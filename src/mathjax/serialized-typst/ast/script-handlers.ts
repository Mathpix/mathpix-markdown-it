import { TEXCLASS } from "mathjax-full/js/core/MmlTree/MmlNode";
import { MathNode, FracAttrs, MoAttrs } from "../types";
import {
  RE_OP_WRAPPER, SHALLOW_TREE_MAX_DEPTH, TEX_ATOM,
  HORIZ_BAR, RIGHT_ARROW, LEFT_ARROW,
  OPEN_BRACKETS,
} from "../consts";
import { getNodeText, getAttrs } from "../common";
import { typstAccentMap } from "../typst-symbol-map";
import { TypstMathNode, TypstMathResult, ITypstMathSerializer } from "./types";
import { seq, symbol, placeholder, funcCall, scriptNode, posArg, namedArg, mathVal, strVal, boolVal, identVal } from "./builders";
import { serializeTypstMath } from "./serialize";

const PRIME_SHORTHANDS: ReadonlyMap<string, string> = new Map([
  ['prime', "'"],
  ['prime.double', "''"],
  ['prime.triple', "'''"],
]);

const RE_SPECIAL_FN_CALL = /^(overbrace|underbrace|overbracket|underbracket|op)\(/;

const TYPST_DISPLAY_LIMIT_OPS: ReadonlySet<string> = new Set([
  'lim', 'limsup', 'liminf', 'max', 'min', 'inf', 'sup',
  'det', 'gcd', 'Pr',
  'sum', 'product', 'product.co',
  'union.big', 'inter.big',
  'dot.o.big', 'plus.o.big', 'times.o.big',
  'union.plus.big', 'union.sq.big',
  'or.big', 'and.big',
]);

const STRETCH_BASE_SYMBOLS: ReadonlySet<string> = new Set([
  'arrow.r', 'arrow.l', 'arrow.l.r',
  'arrow.r.twohead', 'arrow.l.twohead',
  'arrow.r.bar',
  'arrow.r.hook', 'arrow.l.hook',
  'arrow.r.double', 'arrow.l.double', 'arrow.l.r.double',
  'harpoon.rt', 'harpoon.lb',
  'harpoons.rtlb', 'harpoons.ltrb',
  'arrows.rl',
  '=',
]);

const MUNDER_ATTACH_SYMBOLS: ReadonlyMap<string, string> = new Map([
  ['arrow', 'arrow.r'],
  ['arrow.l', 'arrow.l'],
  ['arrow.l.r', 'arrow.l.r'],
  ['harpoon', 'harpoon'],
  ['harpoon.lt', 'harpoon.lt'],
]);

const CONSTRUCTED_LONG_ARROWS: ReadonlyMap<string, string> = new Map([
  ['harpoon.lb|harpoon.rt', 'harpoons.rtlb'],
  ['harpoon.rb|harpoon.lt', 'harpoons.ltrb'],
  ['arrow.l.long|arrow.r.long', 'arrows.lr'],
]);

const HIDE_PATTERN = /#hide(?:\(\$[^$]*\$\)|\[\$[^$]*\$\])/g;
const DASH_CHARS = /[\s\-\u2212\u2013\u2014\u2015\u23AF\u2500]/g;

const TYPST_ACCENT_SHORTHANDS: ReadonlySet<string> = new Set([
  'hat', 'tilde', 'acute', 'grave', 'macron', 'overline', 'underline',
  'breve', 'dot', 'diaer', 'caron', 'arrow', 'circle',
  'overbrace', 'underbrace', 'overbracket', 'underbracket', 'overparen', 'underparen',
]);

const EMPTY_RESULT: TypstMathResult = { node: seq([]) };

const stripDashes = (s: string): string =>
  s.replace(HIDE_PATTERN, '')
    .replace(DASH_CHARS, '');

const unwrapToMoText = (node: MathNode): string => {
  let cur = node;
  for (let d = 0; d < SHALLOW_TREE_MAX_DEPTH && cur; d++) {
    if (cur.kind === 'mo') {
      return getNodeText(cur) || '';
    }
    if (cur.childNodes?.length === 1) {
      cur = cur.childNodes[0];
    } else {
      break;
    }
  }
  return '';
};

/** Unwrap single-child SeqNode to get the inner node.
 *  Inferred mrow processing wraps results in seq([node]),
 *  which needs unwrapping for type checks (e.g., matching FuncCallNode). */
const unwrapSeq = (node: TypstMathNode): TypstMathNode => {
  if (node.type === 'seq' && node.children.length === 1) {
    return unwrapSeq(node.children[0]);
  }
  return node;
};

/** Add limits: #true to a FuncCallNode. With the AST dispatcher,
 *  custom op() bases always arrive as FuncCallNode from mi handler. */
const addLimitsToNode = (baseNode: TypstMathNode): TypstMathNode => {
  const inner = unwrapSeq(baseNode);
  if (inner.type === 'func') {
    const limitedFunc = funcCall(inner.name, [...inner.args, namedArg('limits', boolVal(true))], {
      hash: inner.hash,
      body: inner.body ? [...inner.body] : undefined,
    });
    return limitedFunc;
  }
  return baseNode;
};

type BraceKind = 'overbrace' | 'overbracket' | 'underbrace' | 'underbracket';

/** If baseNode is a FuncCallNode matching overbrace/underbrace/etc.,
 *  add annotation as second argument. Returns null if no match. */
const matchBraceAnnotation = (
  baseNode: TypstMathNode, annotationNode: TypstMathNode,
  kinds: BraceKind[]
): TypstMathNode | null => {
  const inner = unwrapSeq(baseNode);
  if (inner.type === 'func' && (kinds as string[]).indexOf(inner.name) >= 0) {
    return funcCall(inner.name, [...inner.args, posArg(mathVal(annotationNode))]);
  }
  return null;
};

const unwrapToScriptNode = (node: MathNode | null): MathNode | null => {
  let n = node;
  for (let i = 0; i < SHALLOW_TREE_MAX_DEPTH && n; i++) {
    if (n.kind === 'mover' || n.kind === 'munder' || n.kind === 'munderover') return n;
    if ((n.kind === TEX_ATOM || n.isInferred) && n.childNodes?.length === 1) {
      n = n.childNodes[0];
    } else {
      break;
    }
  }
  return n;
};

const getMovablelimits = (node: MathNode): boolean | undefined => {
  if (!node || node.kind !== 'mo') return undefined;
  try {
    return getAttrs<MoAttrs>(node).movablelimits;
  } catch (_e: unknown) {
    return undefined;
  }
};

const isCustomOp = (baseTrimmed: string): boolean =>
  RE_OP_WRAPPER.test(baseTrimmed);

const isStretchyBase = (baseTrimmed: string, firstChild: MathNode): boolean => {
  if (!STRETCH_BASE_SYMBOLS.has(baseTrimmed)) {
    return false;
  }
  let moNode = firstChild;
  for (let i = 0; i < SHALLOW_TREE_MAX_DEPTH && moNode && moNode.kind !== 'mo'; i++) {
    if (moNode.childNodes?.length === 1) {
      moNode = moNode.childNodes[0];
    } else {
      break;
    }
  }
  if (moNode?.kind !== 'mo') {
    return false;
  }
  try {
    return getAttrs<MoAttrs>(moNode).stretchy === true;
  } catch (_e: unknown) {
    return false;
  }
};

const isNativeDisplayLimitOp = (baseTrimmed: string): boolean =>
  TYPST_DISPLAY_LIMIT_OPS.has(baseTrimmed);

const isSpecialFnCall = (baseTrimmed: string): boolean =>
  RE_SPECIAL_FN_CALL.test(baseTrimmed);

/** Unwrap inferred mrow / TEX_ATOM to find the actual content node. */
const unwrapFirstChild = (node: MathNode | null): MathNode | null => {
  let cur = node;
  for (let d = 0; d < SHALLOW_TREE_MAX_DEPTH && cur; d++) {
    if ((cur.isInferred || cur.kind === TEX_ATOM) && cur.childNodes?.length === 1) {
      cur = cur.childNodes[0];
    } else {
      return cur;
    }
  }
  return cur;
};

/** Build limit-placement base. Returns block node (possibly wrapped in limits/stretch)
 *  and optional different inline node. */
const buildLimitBase = (
  firstChild: MathNode | null, baseTrimmed: string, baseNode: TypstMathNode,
): { block: TypstMathNode; inline?: TypstMathNode } => {
  const movablelimits = firstChild ? getMovablelimits(firstChild) : undefined;
  const wrapper = firstChild && isStretchyBase(baseTrimmed, firstChild) ? 'stretch' : 'limits';
  const wrapBase = (): TypstMathNode => funcCall(wrapper, [posArg(mathVal(baseNode))]);
  if (movablelimits === true) {
    if (isCustomOp(baseTrimmed)) {
      return {
        block: addLimitsToNode(baseNode),
        inline: baseNode
      };
    }
    // Native display-limit ops (sum, lim, max, etc.) already place limits
    // below/above in Typst display mode — no wrapper needed
    if (isNativeDisplayLimitOp(baseTrimmed)) {
      return {
        block: baseNode
      };
    }
    // Other ops (integral, etc.): wrap in limits() for block, bare for inline
    return {
      block: wrapBase(),
      inline: baseNode
    };
  }
  if (movablelimits === false) {
    return {
      block: wrapBase()
    };
  }
  // movablelimits undefined — custom op() needs limits in display mode:
  // Matches: \operatorname* (TEX_ATOM + texClass=OP),
  //          \varinjlim etc. (munder/mover wrapping → baseTrimmed starts with op())
  if (isCustomOp(baseTrimmed)) {
    // Unwrap inferred mrow / TeXAtom to find actual content node
    const unwrapped = unwrapFirstChild(firstChild);
    const hasOpContext = firstChild?.texClass === TEXCLASS.OP
      || unwrapped?.kind === 'munder' || unwrapped?.kind === 'mover';
    if (hasOpContext) {
      // Check for inner munder/mover → \varinjlim: different block/inline
      if (unwrapped?.kind === 'munder' || unwrapped?.kind === 'mover') {
        return {
          block: addLimitsToNode(baseNode),
          inline: baseNode
        };
      }
      // \operatorname*{} (TeXAtom OP) → limits in both
      return {
        block: addLimitsToNode(baseNode)
      };
    }
  }
  if (isNativeDisplayLimitOp(baseTrimmed) || isSpecialFnCall(baseTrimmed)) {
    return {
      block: baseNode
    };
  }
  return {
    block: wrapBase()
  };
};

const needsScriptsWrapper = (baseTrimmed: string): boolean =>
  isNativeDisplayLimitOp(baseTrimmed);

/** Check if a custom op() base in msub/msup/msubsup needs limits: #true.
 *  Only checks for \operatorname* (TeXAtom OP without inner munder/mover).
 *  The \varinjlim pattern is handled by munderoverAst/buildLimitBase instead —
 *  if we're in msubsup, it means \nolimits was used so we DON'T add limits. */
const needsLimitsMode = (baseTrimmed: string, firstChild: MathNode | null): false | 'both' => {
  if (!isCustomOp(baseTrimmed) || !firstChild) {
    return false;
  }
  // First pass: check if tree contains munder/mover (= \varinjlim pattern with \nolimits)
  let cur: MathNode | null = firstChild;
  for (let d = 0; d < SHALLOW_TREE_MAX_DEPTH && cur; d++) {
    if (cur.kind === 'munder' || cur.kind === 'mover' || cur.kind === 'munderover') {
      return false;
    }
    if ((cur.kind === TEX_ATOM || cur.isInferred) && cur.childNodes?.length === 1) {
      cur = cur.childNodes[0];
    } else break;
  }
  // Second pass: check for \operatorname* (TeXAtom OP without inner under/over)
  cur = firstChild;
  for (let d = 0; d < SHALLOW_TREE_MAX_DEPTH && cur; d++) {
    if (cur.kind === TEX_ATOM && cur.texClass === TEXCLASS.OP) {
      return 'both';
    }
    if ((cur.kind === TEX_ATOM || cur.isInferred) && cur.childNodes?.length === 1) {
      cur = cur.childNodes[0];
    } else break;
  }
  return false;
};

/** Check if a MathML node is a bare opening bracket mo (not \left/\right).
 *  In Typst, [^(x) would start auto-matching — need to separate bracket from script. */
const isOpeningBracketBase = (child: MathNode | null): boolean => {
  if (!child || child.kind !== 'mo') {
    return false;
  }
  const text = getNodeText(child);
  return !!text && !!OPEN_BRACKETS[text];
};

/** Get child as TypstMathNode for use in FuncCallNode args */
const visitChildNode = (serialize: ITypstMathSerializer, child: MathNode | null): TypstMathNode => {
  if (!child) {
    return placeholder();
  }
  return serialize.visitNode(child);
};

export const mfracAst = (node: MathNode, serialize: ITypstMathSerializer): TypstMathResult => {
  const firstChild = node.childNodes[0] || null;
  const secondChild = node.childNodes[1] || null;
  const numNode = visitChildNode(serialize, firstChild);
  const denNode = visitChildNode(serialize, secondChild);
  const attrs = getAttrs<FracAttrs>(node);
  if (attrs.linethickness === '0' || attrs.linethickness === 0) {
    const parent = node.parent;
    const hasFenceParent = parent
      && parent.kind === 'mrow'
      && parent.childNodes.length === 3
      && parent.childNodes[0]?.texClass === TEXCLASS.OPEN
      && parent.childNodes[2]?.texClass === TEXCLASS.CLOSE;
    if (hasFenceParent) {
      const closeDelim = unwrapToMoText(parent.childNodes[2]);
      if (closeDelim === ')') {
        return {
          node: funcCall('binom', [posArg(mathVal(numNode)), posArg(mathVal(denNode))])
        };
      }
      const openDelim = unwrapToMoText(parent.childNodes[0]);
      const delimArg = openDelim
        ? namedArg('delim', strVal(openDelim))
        : namedArg('delim', identVal('#none'));
      return {
        node: funcCall('mat', [delimArg, posArg(mathVal(numNode)), posArg(mathVal(denNode))], { semicolonSep: true, singleLine: true })
      };
    }
    return {
      node: funcCall('mat', [namedArg('delim', identVal('#none')), posArg(mathVal(numNode)), posArg(mathVal(denNode))], { semicolonSep: true, singleLine: true })
    };
  }
  return {
    node: funcCall('frac', [posArg(mathVal(numNode)), posArg(mathVal(denNode))])
  };
};

export const msupAst = (node: MathNode, serialize: ITypstMathSerializer): TypstMathResult => {
  // Opening bracket as script base: [^{\circ} → [ ""^(compose)
  // In Typst [^(...) starts auto-matching, so separate bracket from script.
  if (isOpeningBracketBase(node.childNodes[0])) {
    const bracketNode = visitChildNode(serialize, node.childNodes[0]);
    const supNode = visitChildNode(serialize, node.childNodes[1] || null);
    return {
      node: seq([bracketNode, scriptNode(placeholder(), { sup: supNode })])
    };
  }
  const baseNode = visitChildNode(serialize, node.childNodes[0] || null);
  const supNode = visitChildNode(serialize, node.childNodes[1] || null);
  const baseTrimmed = serializeTypstMath(baseNode).trim();
  const sup = serializeTypstMath(supNode).trim();
  // Brace annotation: overbrace(content)^annotation → overbrace(content, annotation)
  if (sup) {
    const braceStr = matchBraceAnnotation(baseNode, supNode, ['overbrace', 'overbracket']);
    if (braceStr) return {
      node: braceStr
    };
  }
  if (!baseTrimmed && !sup) return EMPTY_RESULT;
  // \nolimits: wrap known limit operators in scripts() to force side placement
  if (baseTrimmed && needsScriptsWrapper(baseTrimmed)) {
    return {
      node: scriptNode(funcCall('scripts', [posArg(mathVal(baseNode))]), { sup: supNode })
    };
  }
  // Prime shorthand: ′ → ', ″ → '', ‴ → '''
  if (sup) {
    const primeShorthand = PRIME_SHORTHANDS.get(sup);
    if (primeShorthand) {
      // Prime is concatenated directly: f' not f^' (Typst shorthand)
      return {
        node: seq([baseNode, symbol(primeShorthand)])
      };
    }
  }
  // Custom op() in msubsup context: add limits: #true for block variant
  const firstChild = node.childNodes[0] || null;
  if (needsLimitsMode(baseTrimmed, firstChild)) {
    return {
      node: scriptNode(addLimitsToNode(baseNode), sup ? { sup: supNode } : {})
    };
  }
  return {
    node: scriptNode(baseNode, sup ? { sup: supNode } : {})
  };
};

export const msubAst = (node: MathNode, serialize: ITypstMathSerializer): TypstMathResult => {
  if (isOpeningBracketBase(node.childNodes[0])) {
    const bracketNode = visitChildNode(serialize, node.childNodes[0]);
    const subNode = visitChildNode(serialize, node.childNodes[1] || null);
    return {
      node: seq([bracketNode, scriptNode(placeholder(), { sub: subNode })])
    };
  }
  const baseNode = visitChildNode(serialize, node.childNodes[0] || null);
  const subNode = visitChildNode(serialize, node.childNodes[1] || null);
  const baseTrimmed = serializeTypstMath(baseNode).trim();
  const sub = serializeTypstMath(subNode).trim();
  // Brace annotation: underbrace(content)_annotation → underbrace(content, annotation)
  if (sub) {
    const braceStr = matchBraceAnnotation(baseNode, subNode, ['underbrace', 'underbracket']);
    if (braceStr) {
      return {
        node: braceStr
      };
    }
  }
  if (!baseTrimmed && !sub) return EMPTY_RESULT;
  if (baseTrimmed && needsScriptsWrapper(baseTrimmed)) {
    return {
      node: scriptNode(funcCall('scripts', [posArg(mathVal(baseNode))]), { sub: subNode })
    };
  }
  const firstChild = node.childNodes[0] || null;
  if (needsLimitsMode(baseTrimmed, firstChild)) {
    return {
      node: scriptNode(addLimitsToNode(baseNode), sub ? { sub: subNode } : {})
    };
  }
  return {
    node: scriptNode(baseNode, sub ? { sub: subNode } : {})
  };
};

export const msubsupAst = (node: MathNode, serialize: ITypstMathSerializer): TypstMathResult => {
  if (isOpeningBracketBase(node.childNodes[0])) {
    const bracketNode = visitChildNode(serialize, node.childNodes[0]);
    const subNode = visitChildNode(serialize, node.childNodes[1] || null);
    const supNode = visitChildNode(serialize, node.childNodes[2] || null);
    const opts: { sub?: TypstMathNode; sup?: TypstMathNode } = {};
    const sub = serializeTypstMath(subNode).trim();
    const sup = serializeTypstMath(supNode).trim();
    if (sub) {
      opts.sub = subNode;
    }
    if (sup) {
      opts.sup = supNode;
    }
    return {
      node: seq([bracketNode, scriptNode(placeholder(), opts)])
    };
  }
  const baseNode = visitChildNode(serialize, node.childNodes[0] || null);
  const subNode = visitChildNode(serialize, node.childNodes[1] || null);
  const supNode = visitChildNode(serialize, node.childNodes[2] || null);
  const baseTrimmed = serializeTypstMath(baseNode).trim();
  const sub = serializeTypstMath(subNode).trim();
  const sup = serializeTypstMath(supNode).trim();
  if (!baseTrimmed && !sub && !sup) {
    return EMPTY_RESULT;
  }
  if (baseTrimmed && needsScriptsWrapper(baseTrimmed)) {
    const opts: { sub?: TypstMathNode; sup?: TypstMathNode } = {};
    if (sub) {
      opts.sub = subNode;
    }
    if (sup) {
      opts.sup = supNode;
    }
    return {
      node: scriptNode(funcCall('scripts', [posArg(mathVal(baseNode))]), opts)
    };
  }
  const opts: { sub?: TypstMathNode; sup?: TypstMathNode } = {};
  if (sub) {
    opts.sub = subNode;
  }
  if (sup) {
    opts.sup = supNode;
  }
  const firstChild = node.childNodes[0] || null;
  if (needsLimitsMode(baseTrimmed, firstChild)) {
    return {
      node: scriptNode(addLimitsToNode(baseNode), opts)
    };
  }
  return {
    node: scriptNode(baseNode, opts)
  };
};

export const msqrtAst = (node: MathNode, serialize: ITypstMathSerializer): TypstMathResult => {
  const contentNode = visitChildNode(serialize, node.childNodes[0] || null);
  return {
    node: funcCall('sqrt', [posArg(mathVal(contentNode))])
  };
};

export const mrootAst = (node: MathNode, serialize: ITypstMathSerializer): TypstMathResult => {
  const radicandNode = visitChildNode(serialize, node.childNodes[0] || null);
  const indexNode = visitChildNode(serialize, node.childNodes[1] || null);
  // Typst root(index, radicand) — note swapped order vs MathML mroot(radicand, index)
  return {
    node: funcCall('root', [posArg(mathVal(indexNode)), posArg(mathVal(radicandNode))])
  };
};

export const moverAst = (node: MathNode, serialize: ITypstMathSerializer): TypstMathResult => {
  const firstChild = node.childNodes[0] || null;
  const secondChild = node.childNodes[1] || null;
  const baseNode = visitChildNode(serialize, firstChild);
  const overNode = visitChildNode(serialize, secondChild);
  const baseStr = serializeTypstMath(baseNode);
  const overStr = serializeTypstMath(overNode);
  // \varlimsup: mover(mi("lim"), mo("―"))
  if (firstChild?.kind === 'mi' && secondChild?.kind === 'mo') {
    const baseText = getNodeText(firstChild);
    const overChar = getNodeText(secondChild);
    if (baseText === 'lim' && overChar === HORIZ_BAR) {
      return {
        node: funcCall('op', [posArg(mathVal(funcCall('overline', [posArg(mathVal(symbol('lim')))])))])
      };
    }
  }
  // Accent → FuncCallNode (serializer handles Wrapper escaping)
  if (node.attributes.get('accent') && secondChild && secondChild.kind === 'mo') {
    const accentChar = getNodeText(secondChild);
    const accentFn = typstAccentMap.get(accentChar);
    if (accentFn) {
      if (TYPST_ACCENT_SHORTHANDS.has(accentFn)) {
        return {
          node: funcCall(accentFn, [posArg(mathVal(baseNode))])
        };
      }
      return {
        node: funcCall('accent', [posArg(mathVal(baseNode)), posArg(mathVal(symbol(accentFn)))])
      };
    }
  }
  const rawBase = baseStr.trim();
  const over = overStr.trim();
  // Constructed long arrows
  if (over) {
    const longArrow = CONSTRUCTED_LONG_ARROWS.get(stripDashes(rawBase) + '|' + stripDashes(over));
    if (longArrow) return {
      node: symbol(longArrow)
    };
  }
  if (over) {
    const braceStr = matchBraceAnnotation(baseNode, overNode, ['overbrace', 'overbracket']);
    if (braceStr) {
      return {
        node: braceStr
      };
    }
    // Flatten mover(munder(...), over): inner munder already has limits() + subscript
    const innerBase = unwrapToScriptNode(firstChild);
    if (innerBase && (innerBase.kind === 'munder' || innerBase.kind === 'munderover')) {
      return {
        node: scriptNode(baseNode, { sup: overNode })
      };
    }
    const limitBase = buildLimitBase(firstChild, rawBase, baseNode);
    const blockResult = scriptNode(limitBase.block, { sup: overNode });
    if (limitBase.inline) {
      return {
        node: blockResult,
        nodeInline: scriptNode(limitBase.inline, { sup: overNode })
      };
    }
    return {
      node: blockResult
    };
  }
  return {
    node: baseStr.trim() ? baseNode : placeholder()
  };
};

export const munderAst = (node: MathNode, serialize: ITypstMathSerializer): TypstMathResult => {
  const firstChild = node.childNodes[0] || null;
  const secondChild = node.childNodes[1] || null;
  const baseNode = visitChildNode(serialize, firstChild);
  const underNode = visitChildNode(serialize, secondChild);
  const baseStr = serializeTypstMath(baseNode);
  const underStr = serializeTypstMath(underNode);
  // \varinjlim / \varprojlim / \varliminf
  if (firstChild?.kind === 'mi' && secondChild?.kind === 'mo') {
    const baseText = getNodeText(firstChild);
    const underChar = getNodeText(secondChild);
    if (baseText === 'lim' && underChar === RIGHT_ARROW) {
      return {
        node: funcCall('op', [posArg(strVal('inj lim'))])
      };
    }
    if (baseText === 'lim' && underChar === LEFT_ARROW) {
      return {
        node: funcCall('op', [posArg(strVal('proj lim'))])
      };
    }
    if (baseText === 'lim' && underChar === HORIZ_BAR) {
      return {
        node: funcCall('op', [posArg(mathVal(funcCall('underline', [posArg(mathVal(symbol('lim')))])))])
      };
    }
  }
  // Accent under → FuncCallNode (serializer handles Wrapper escaping)
  if (node.attributes.get('accentunder') && secondChild && secondChild.kind === 'mo') {
    const accentChar = getNodeText(secondChild);
    let accentFn = typstAccentMap.get(accentChar);
    if (accentFn === 'overline') {
      accentFn = 'underline';
    }
    if (accentFn === 'overbrace') {
      accentFn = 'underbrace';
    }
    if (accentFn === 'overparen') {
      accentFn = 'underparen';
    }
    if (accentFn) {
      // Arrows/harpoons have no under-variant — use limits(base)_symbol
      const underSymbol = MUNDER_ATTACH_SYMBOLS.get(accentFn);
      if (underSymbol) {
        const limitsNode = funcCall('limits', [posArg(mathVal(baseNode))]);
        return {
          node: scriptNode(limitsNode, { sub: symbol(underSymbol), bareSub: true })
        };
      }
      if (TYPST_ACCENT_SHORTHANDS.has(accentFn)) {
        return {
          node: funcCall(accentFn, [posArg(mathVal(baseNode))])
        };
      }
      return {
        node: funcCall('accent', [posArg(mathVal(baseNode)), posArg(mathVal(symbol(accentFn)))])
      };
    }
  }
  const rawBase = baseStr.trim();
  const under = underStr.trim();
  if (under) {
    const braceStr = matchBraceAnnotation(baseNode, underNode, ['underbrace', 'underbracket']);
    if (braceStr) {
      return {
        node: braceStr
      };
    }
    const limitBase = buildLimitBase(firstChild, rawBase, baseNode);
    const blockResult = scriptNode(limitBase.block, { sub: underNode });
    if (limitBase.inline) {
      return {
        node: blockResult, nodeInline: scriptNode(limitBase.inline, { sub: underNode })
      };
    }
    return {
      node: blockResult
    };
  }
  return {
    node: rawBase ? baseNode : placeholder()
  };
};

export const munderoverAst = (node: MathNode, serialize: ITypstMathSerializer): TypstMathResult => {
  const firstChild = node.childNodes[0] || null;
  const baseNode = visitChildNode(serialize, firstChild);
  const underNode = visitChildNode(serialize, node.childNodes[1] || null);
  const overNode = visitChildNode(serialize, node.childNodes[2] || null);
  const rawBase = serializeTypstMath(baseNode).trim();
  const under = serializeTypstMath(underNode).trim();
  const over = serializeTypstMath(overNode).trim();
  const limitBase = buildLimitBase(firstChild, rawBase, baseNode);
  const opts: { sub?: TypstMathNode; sup?: TypstMathNode } = {};
  if (under) {
    opts.sub = underNode;
  }
  if (over) {
    opts.sup = overNode;
  }
  const blockResult = scriptNode(limitBase.block, opts);
  if (limitBase.inline) {
    return {
      node: blockResult,
      nodeInline: scriptNode(limitBase.inline, opts)
    };
  }
  return {
    node: blockResult
  };
};

/** Visit a mmultiscripts child, returning its node only if non-empty and non-"none" kind */
const visitScriptChild = (
  serialize: ITypstMathSerializer, child: MathNode | null,
): TypstMathNode | null => {
  if (!child || child.kind === 'none') {
    return null;
  }
  const node = serialize.visitNode(child);
  const str = serializeTypstMath(node).trim();
  return str ? node : null;
};

export const mmultiscriptsAst = (node: MathNode, serialize: ITypstMathSerializer): TypstMathResult => {
  if (!node.childNodes || node.childNodes.length === 0) {
    return EMPTY_RESULT;
  }
  const baseNode = visitChildNode(serialize, node.childNodes[0]);
  let prescriptsIdx = -1;
  for (let i = 1; i < node.childNodes.length; i++) {
    if (node.childNodes[i].kind === 'mprescripts') {
      prescriptsIdx = i;
      break;
    }
  }
  // Collect post-scripts (last non-empty of each position wins)
  const postEnd = prescriptsIdx >= 0 ? prescriptsIdx : node.childNodes.length;
  let lastPostSub: TypstMathNode | null = null;
  let lastPostSup: TypstMathNode | null = null;
  for (let i = 1; i < postEnd; i += 2) {
    const sub = visitScriptChild(serialize, node.childNodes[i]);
    const sup = visitScriptChild(serialize, node.childNodes[i + 1] || null);
    if (sub) {
      lastPostSub = sub;
    }
    if (sup) {
      lastPostSup = sup;
    }
  }
  // Collect pre-scripts
  let lastPreSub: TypstMathNode | null = null;
  let lastPreSup: TypstMathNode | null = null;
  if (prescriptsIdx >= 0) {
    for (let i = prescriptsIdx + 1; i < node.childNodes.length; i += 2) {
      const sub = visitScriptChild(serialize, node.childNodes[i]);
      const sup = visitScriptChild(serialize, node.childNodes[i + 1] || null);
      if (sub) {
        lastPreSub = sub;
      }
      if (sup) {
        lastPreSup = sup;
      }
    }
  }
  // ScriptNode — serializer handles attach() for prescripts, _/^ for simple case
  const opts: {
    sub?: TypstMathNode; sup?: TypstMathNode;
    preSub?: TypstMathNode; preSup?: TypstMathNode;
  } = {};
  if (lastPostSub) {
    opts.sub = lastPostSub;
  }
  if (lastPostSup) {
    opts.sup = lastPostSup;
  }
  if (lastPreSub) {
    opts.preSub = lastPreSub;
  }
  if (lastPreSup) {
    opts.preSup = lastPreSup;
  }
  return {
    node: scriptNode(baseNode, opts)
  };
};
