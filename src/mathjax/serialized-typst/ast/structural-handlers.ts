import { TEXCLASS } from "mathjax-full/js/core/MmlTree/MmlNode";
import {
  MathNode,
  FracAttrs, PaddedAttrs, EncloseAttrs, StyleAttrs,
} from "../types";
import {
  SHALLOW_TREE_MAX_DEPTH, ANCESTOR_MAX_DEPTH, TEX_ATOM,
  DOUBLE_VERT, LEFT_FLOOR, RIGHT_FLOOR, LEFT_CEIL, RIGHT_CEIL,
  BOX_STROKE, BOX_INSET,
} from "../consts";
import {
  getNodeText, getAttrs, getProp, getContentChildren,
  isThousandSepComma,
  isNegationOverlay,
  isNonLatinText,
} from "../common";
import { typstFontMap } from "../typst-symbol-map";
import { mapDelimiter } from "../bracket-utils";
import { TypstMathNode, TypstMathResult, DelimitedKind, ArgValue, ITypstMathSerializer } from "./types";
import {
  seq, symbol, text, delimited, funcCall, inlineMath, posArg, namedArg,
  mathVal, boolVal, identVal, lengthVal, rawVal, inlineMathVal, callVal,
} from "./builders";
import { serializeTypstMath } from "./serialize";
import { containsBlockCodeFunc } from "./code-mode-utils";

const MATHJAX_INHERIT_SENTINEL = '_inherit_';

/** Map delimiter char pair to DelimitedKind */
const detectDelimitedKind = (openDelim: string, closeDelim: string): DelimitedKind => {
  if (openDelim === '|' && closeDelim === '|') return DelimitedKind.Abs;
  if (openDelim === DOUBLE_VERT && closeDelim === DOUBLE_VERT) return DelimitedKind.Norm;
  if (openDelim === LEFT_FLOOR && closeDelim === RIGHT_FLOOR) return DelimitedKind.Floor;
  if (openDelim === LEFT_CEIL && closeDelim === RIGHT_CEIL) return DelimitedKind.Ceil;
  return DelimitedKind.Lr;
};

const hasPhantomChild = (node: MathNode): boolean => {
  const check = (n: MathNode, depth: number): boolean => {
    if (!n || depth > SHALLOW_TREE_MAX_DEPTH) {
      return false;
    }
    if (n.kind === 'mphantom') {
      return true;
    }
    if (n.childNodes) {
      for (const c of n.childNodes) {
        if (check(c, depth + 1)) {
          return true;
        }
      }
    }
    return false;
  };
  return check(node, 0);
};

const hasScriptAncestor = (node: MathNode): boolean => {
  let cur = node?.parent;
  for (let d = 0; d < ANCESTOR_MAX_DEPTH && cur; d++) {
    const k = cur.kind;
    if (k === 'msub' || k === 'msup' || k === 'msubsup' || k === 'mmultiscripts') {
      return true;
    }
    cur = cur.parent;
  }
  return false;
};

const isOperatorInternalSpacing = (node: MathNode): boolean => {
  const children = node.childNodes || [];
  if (children.length !== 1 || !children[0].isInferred) {
    return false;
  }
  const innerChildren = children[0].childNodes || [];
  if (innerChildren.length === 0 || !innerChildren.every((child) => child.kind === 'mspace')) {
    return false;
  }
  let p = node.parent;
  for (let d = 0; d < ANCESTOR_MAX_DEPTH && p; d++) {
    if (p.kind === 'math') {
      break;
    }
    if (p.kind === TEX_ATOM) {
      return true;
    }
    p = p.parent;
  }
  return false;
};

/** Build an ArgValue for a CSS color: hex → rgb("..."), named → ident */
const colorArgValue = (color: string): ArgValue =>
  color.startsWith('#')
    ? rawVal('rgb("' + color + '")')
    : identVal(color);

/** Wrap content in #text(fill: color)[...] */
const buildColorWrap = (content: TypstMathNode, mathcolor: string): TypstMathNode =>
  funcCall('text', [namedArg('fill', colorArgValue(mathcolor))], { hash: true, body: [content] });

const containsTable = (child: MathNode): boolean => {
  if (child.kind === 'mtable') return true;
  if (child.isInferred && child.childNodes) {
    return child.childNodes.some(c => c.kind === 'mtable');
  }
  return false;
};

/** Flatten deeply nested seq nodes into a single flat array of non-seq leaves. */
const flattenSeq = (node: TypstMathNode): TypstMathNode[] => {
  if (node.type === 'seq') {
    const result: TypstMathNode[] = [];
    for (const child of node.children) {
      result.push(...flattenSeq(child));
    }
    return result;
  }
  return [node];
};

/** Strip leading ) or \) and trailing space nodes from a content node.
 *  Used for \lcm/smash patterns where the menclose body starts with ). */
const stripLeadingDelimAndTrailingSpace = (contentNode: TypstMathNode): TypstMathNode => {
  const flat = flattenSeq(contentNode);
  // Strip leading ) or \)
  if (flat.length > 0) {
    const first = flat[0];
    const isCloseParen =
      (first.type === 'operator' && (first.value === ')' || first.value === '\\)'))
      || (first.type === 'symbol' && (first.value === ')' || first.value === '\\)'));
    if (isCloseParen) {
      flat.shift();
    }
  }
  // Strip trailing space nodes
  while (flat.length > 0 && flat[flat.length - 1].type === 'space') {
    flat.pop();
  }
  return seq(flat);
};

/** Visit all children via AST dispatcher, return SeqNode (block only, no inline propagation). */
const visitAllChildren = (node: MathNode, serialize: ITypstMathSerializer): TypstMathNode => {
  const children: TypstMathNode[] = [];
  for (const child of (node.childNodes ?? [])) {
    children.push(serialize.visitNode(child));
  }
  return seq(children);
};

/** Detect consecutive non-Latin mi nodes and return typed AST node.
 *  Returns { node, nextIndex } or null. */
export const tryCombiningMiChainAst = (
  parentNode: MathNode, start: number,
): { node: TypstMathNode; nextIndex: number } | null => {
  const children = parentNode.childNodes;
  if (!children || start >= children.length) {
    return null;
  }
  const first = children[start];
  if (first.kind !== 'mi') {
    return null;
  }
  const firstText = getNodeText(first);
  if (!firstText || !isNonLatinText(firstText)) {
    return null;
  }
  const variant = String(first.attributes?.get('mathvariant') ?? '');
  let merged = firstText;
  let k = start + 1;
  while (k < children.length) {
    const sib = children[k];
    if (sib.kind !== 'mi') {
      break;
    }
    if (String(sib.attributes?.get('mathvariant') ?? '') !== variant) {
      break;
    }
    const sibText = getNodeText(sib);
    if (!sibText || !isNonLatinText(sibText)) {
      break;
    }
    merged += sibText;
    k++;
  }
  const textNode = text(merged, { preserveBackslash: true });
  const fontFn = variant === 'bold' ? null : typstFontMap.get(variant);
  let result: TypstMathNode;
  if (!fontFn) {
    if (variant === 'bold') {
      result = funcCall('upright', [posArg(mathVal(funcCall('bold', [posArg(mathVal(textNode))])))]);
    } else {
      result = textNode;
    }
  } else {
    result = funcCall(fontFn, [posArg(mathVal(textNode))]);
  }
  return {
    node: result,
    nextIndex: k
  };
};

export const mrowAst = (node: MathNode, serialize: ITypstMathSerializer): TypstMathResult => {
  const openProp = getProp<string>(node, 'open');
  const closeProp = getProp<string>(node, 'close');
  const hasOpen = openProp !== undefined;
  const hasClose = closeProp !== undefined;
  const openDelim: string = hasOpen ? String(openProp) : '';
  const closeDelim: string = hasClose ? String(closeProp) : '';
  const isLeftRight = (hasOpen || hasClose)
    && getProp<number>(node, 'texClass') === TEXCLASS.INNER;
  const contentChildren = getContentChildren(node);
  const hasTableChild = contentChildren.length === 1 && containsTable(contentChildren[0]);
  const closeMapped = closeDelim ? mapDelimiter(closeDelim) : '';
  const hasTableFirst = !hasTableChild && contentChildren.length > 1
    && containsTable(contentChildren[0]) && openDelim && !closeMapped;
  if (isLeftRight && !hasTableChild && !hasTableFirst) {
    // Build content as typed SeqNode, skipping delimiter mo's
    const blockChildren: TypstMathNode[] = [];
    const inlineChildren: TypstMathNode[] = [];
    let hasInlineDiff = false;
    for (let i = 0; i < node.childNodes.length; i++) {
      const child = node.childNodes[i];
      if (i === 0 && child.kind === 'mo') {
        const moText = getNodeText(child);
        if (moText === openDelim || (!moText && !openDelim)) {
          continue;
        }
      }
      if (i === node.childNodes.length - 1 && child.kind === 'mo') {
        const moText = getNodeText(child);
        if (moText === closeDelim || (!moText && !closeDelim)) {
          continue;
        }
      }
      const result = serialize.visitNodeFull(child);
      blockChildren.push(result.node);
      const inlineNode = result.nodeInline ?? result.node;
      inlineChildren.push(inlineNode);
      if (result.nodeInline) {
        hasInlineDiff = true;
      }
    }
    const kind = detectDelimitedKind(openDelim, closeDelim);
    // If any child has a block-level code-mode function (#math.equation, #grid),
    // we cannot wrap it in lr() — those constructs break math flow inside delimiters.
    // Use inline variants for BOTH variants of the Delimited node.
    const hasBlockCode = blockChildren.some(containsBlockCodeFunc);
    if (hasBlockCode) {
      return {
        node: delimited(kind, seq(inlineChildren), openDelim, closeDelim)
      };
    }
    const blockNode = delimited(kind, seq(blockChildren), openDelim, closeDelim);
    if (hasInlineDiff) {
      return {
        node: blockNode,
        nodeInline: delimited(kind, seq(inlineChildren), openDelim, closeDelim)
      };
    }
    return {
      node: blockNode
    };
  }
  if (isLeftRight && (hasTableChild || hasTableFirst)) {
    const blockChildren: TypstMathNode[] = [];
    const inlineChildren: TypstMathNode[] = [];
    let hasInlineDiff = false;
    for (let i = 0; i < node.childNodes.length; i++) {
      const child = node.childNodes[i];
      if (i === 0 && child.kind === 'mo') {
        const moText = getNodeText(child);
        if (moText === openDelim || (!moText && !openDelim)) {
          continue;
        }
      }
      if (i === node.childNodes.length - 1 && child.kind === 'mo') {
        const moText = getNodeText(child);
        if (moText === closeDelim || (!moText && !closeDelim)) {
          continue;
        }
      }
      const result = serialize.visitNodeFull(child);
      blockChildren.push(result.node);
      const inlineNode = result.nodeInline ?? result.node;
      inlineChildren.push(inlineNode);
      if (result.nodeInline) {
        hasInlineDiff = true;
      }
    }
    if (hasInlineDiff) {
      return {
        node: seq(blockChildren),
        nodeInline: seq(inlineChildren)
      };
    }
    return {
      node: seq(blockChildren)
    };
  }
  // Binom pattern: mrow(ORD) > [mrow(OPEN), mfrac(linethickness=0), mrow(CLOSE)]
  if (node.childNodes.length === 3) {
    const first = node.childNodes[0];
    const middle = node.childNodes[1];
    const last = node.childNodes[2];
    if (middle.kind === 'mfrac') {
      const midAtr = getAttrs<FracAttrs>(middle);
      if ((midAtr.linethickness === '0' || midAtr.linethickness === 0)
        && first.texClass === TEXCLASS.OPEN
        && last.texClass === TEXCLASS.CLOSE) {
        return {
          node: serialize.visitNode(middle)
        };
      }
    }
  }
  // Regular mrow: build SeqNode from children
  const children: TypstMathNode[] = [];
  for (let i = 0; i < node.childNodes.length; i++) {
    // Thousand separator chain: mn "," mn "," mn → num\,num\,num
    if (isThousandSepComma(node, i)) {
      const chainParts: TypstMathNode[] = [serialize.visitNode(node.childNodes[i])];
      let k = i;
      while (isThousandSepComma(node, k)) {
        chainParts.push(symbol('\\,'));
        chainParts.push(serialize.visitNode(node.childNodes[k + 2]));
        k += 2;
      }
      children.push(seq(chainParts));
      i = k;
      continue;
    }
    // Combining mark chain: consecutive non-Latin mi nodes → font("merged text")
    const combChain = tryCombiningMiChainAst(node, i);
    if (combChain) {
      children.push(combChain.node);
      i = combChain.nextIndex - 1;
      continue;
    }
    const child = node.childNodes[i];
    if (isNegationOverlay(child) && i + 1 < node.childNodes.length) {
      const nextNode = serialize.visitNode(node.childNodes[i + 1]);
      children.push(funcCall('cancel', [posArg(mathVal(nextNode))]));
      i++;
      continue;
    }
    children.push(serialize.visitNode(child));
  }
  return {
    node: seq(children)
  };
};

export const mpaddedAst = (node: MathNode, serialize: ITypstMathSerializer): TypstMathResult => {
  const attrs = getAttrs<PaddedAttrs>(node);
  const isZeroWidth = attrs.width === 0 || attrs.width === '0';
  const isZeroHeight = attrs.height === 0 || attrs.height === '0';
  if ((isZeroWidth || isZeroHeight) && hasPhantomChild(node)
    && (hasScriptAncestor(node) || hasAdjacentTripledashStyle(node))) {
    return {
      node: seq([])
    };
  }
  const contentNode = visitAllChildren(node, serialize);
  const rawBg = attrs.mathbackground || '';
  const mathbg: string = rawBg && rawBg !== MATHJAX_INHERIT_SENTINEL ? rawBg : '';
  if (mathbg && serializeTypstMath(contentNode).trim()) {
    return {
      node: funcCall('highlight', [namedArg('fill', colorArgValue(mathbg))], { hash: true, body: [inlineMath(contentNode)] }),
      nodeInline: contentNode,
    };
  }
  return {
    node: contentNode
  };
};

export const mphantomAst = (node: MathNode, serialize: ITypstMathSerializer): TypstMathResult => {
  const contentNode = visitAllChildren(node, serialize);
  if (serializeTypstMath(contentNode).trim()) {
    return {
      node: funcCall('hide', [posArg(inlineMathVal(contentNode))], { hash: true })
    };
  }
  return {
    node: seq([])
  };
};

const parseNotation = (notation: string): Set<string> =>
  new Set(notation.split(/\s+/).filter(Boolean));

const hasNotation = (words: Set<string>, keyword: string): boolean =>
  words.has(keyword);

const BORDER_SIDES = ['top', 'bottom', 'left', 'right'] as const;

const hasBorderNotation = (words: Set<string>): boolean => {
  let count = 0;
  for (const side of BORDER_SIDES) {
    if (words.has(side)) {
      count++;
    }
  }
  return count >= 2;
};

const buildStrokeSides = (words: Set<string>): string =>
  BORDER_SIDES.map(side =>
    side + ': ' + (words.has(side) ? BOX_STROKE : '0pt')
  ).join(', ');

export const mencloseAst = (node: MathNode, serialize: ITypstMathSerializer): TypstMathResult => {
  const attrs = getAttrs<EncloseAttrs>(node);
  const notation = attrs.notation?.toString() || '';
  const words = parseNotation(notation);
  const contentNode = visitAllChildren(node, serialize);
  const contentStr = serializeTypstMath(contentNode).trim();
  if (hasNotation(words, 'box')) {
    // #box() is inline-safe — keep frame in both variants.
    // Always use $ display $ math inside: it renders simple and multi-line
    // content correctly. $inline$ inside box breaks multi-line alignment (&, \\).
    const boxNode = funcCall('box', [
      namedArg('stroke', lengthVal(BOX_STROKE)),
      namedArg('inset', lengthVal(BOX_INSET)),
      posArg(inlineMathVal(contentNode, true)),
    ], { hash: true });
    return { node: boxNode };
  }
  // cancel variants → FuncCallNode (serializer applies Wrapper escaping)
  if (hasNotation(words, 'updiagonalstrike') || hasNotation(words, 'downdiagonalstrike')) {
    if (hasNotation(words, 'updiagonalstrike') && hasNotation(words, 'downdiagonalstrike')) {
      return {
        node: funcCall('cancel', [namedArg('cross', boolVal(true)), posArg(mathVal(contentNode))])
      };
    }
    if (hasNotation(words, 'downdiagonalstrike')) {
      return {
        node: funcCall('cancel', [namedArg('inverted', boolVal(true)), posArg(mathVal(contentNode))])
      };
    }
    return {
      node: funcCall('cancel', [posArg(mathVal(contentNode))])
    };
  }
  if (hasNotation(words, 'horizontalstrike')) {
    return {
      node: funcCall('cancel', [posArg(mathVal(contentNode))])
    };
  }
  if (hasNotation(words, 'longdiv')) {
    // overline(lr(\) content)) — \) is a sized delimiter inside lr
    const lrNode = delimited(DelimitedKind.Lr, contentNode, ')', '');
    return {
      node: funcCall('overline', [posArg(mathVal(lrNode))])
    };
  }
  if (hasNotation(words, 'circle')) {
    // MathJax renders \enclose{circle} as an ellipse (stretched to content
    // width) — use #ellipse() for visual parity. #circle() would force 1:1
    // aspect ratio, producing oversized frames for long single-line content.
    // Neither #ellipse() nor #circle() auto-centers content — wrap in align().
    const centered = funcCall('align', [
      posArg(rawVal('center + horizon')),
      posArg(inlineMathVal(contentNode, true)),
    ]);
    const ellipseNode = funcCall('ellipse', [
      namedArg('inset', lengthVal(BOX_INSET)),
      posArg(callVal(centered)),
    ], { hash: true });
    return { node: ellipseNode };
  }
  if (hasNotation(words, 'radical')) {
    return {
      node: funcCall('sqrt', [posArg(mathVal(contentNode))])
    };
  }
  if (hasBorderNotation(words)) {
    // #box() with partial borders is inline-safe — keep frame in both variants.
    const sides = buildStrokeSides(words);
    const borderBoxNode = funcCall('box', [
      namedArg('stroke', rawVal('(' + sides + ')')),
      namedArg('inset', lengthVal(BOX_INSET)),
      posArg(inlineMathVal(contentNode, true)),
    ], {
      hash: true
    });
    return {
      node: borderBoxNode
    };
  }
  if (hasNotation(words, 'top')) {
    return {
      node: funcCall('overline', [posArg(mathVal(contentNode))])
    };
  }
  if (hasNotation(words, 'bottom')) {
    // \smash{)} prefix for \lcm macro: strip leading ), trailing spacing, wrap in underline(lr(\) ...))
    if (contentStr.startsWith(')') || contentStr.startsWith('\\)')) {
      const innerBody = stripLeadingDelimAndTrailingSpace(contentNode);
      const lrNode = delimited(DelimitedKind.Lr, innerBody, ')', '');
      return {
        node: funcCall('underline', [posArg(mathVal(lrNode))])
      };
    }
    return {
      node: funcCall('underline', [posArg(mathVal(contentNode))])
    };
  }
  return {
    node: contentNode
  };
};

const isTripledashStyle = (node: MathNode): boolean => {
  const attrs = getAttrs<StyleAttrs>(node);
  const ms = attrs.mathsize;
  if (!ms || (typeof ms === 'string' ? parseFloat(ms) >= 1 : ms >= 1)) {
    return false;
  }
  const children = node.childNodes?.[0]?.childNodes ?? node.childNodes ?? [];
  let dashCount = 0;
  for (const child of children) {
    if (child.kind === 'mspace') {
      continue;
    }
    if (child.kind === 'mtext') {
      dashCount++;
      continue;
    }
    return false;
  }
  return dashCount > 0;
};

const containsTripledashStyle = (node: MathNode, depth = 0): boolean => {
  if (depth > SHALLOW_TREE_MAX_DEPTH) {
    return false;
  }
  if (node.kind === 'mstyle' && isTripledashStyle(node)) {
    return true;
  }
  if (node.childNodes) {
    for (const child of node.childNodes) {
      if (containsTripledashStyle(child, depth + 1)) {
        return true;
      }
    }
  }
  return false;
};

const hasAdjacentTripledashStyle = (node: MathNode): boolean => {
  let cur: MathNode | null = node;
  for (let depth = 0; depth < 3 && cur; depth++) {
    const parent = cur.parent;
    if (!parent?.childNodes) {
      cur = parent;
      continue;
    }
    for (const sibling of parent.childNodes) {
      if (sibling === cur) {
        continue;
      }
      if (containsTripledashStyle(sibling)) {
        return true;
      }
    }
    cur = parent;
  }
  return false;
};

/** Regex for replacing quoted dashes in raw strings (matches `"-"` pattern) */
const QUOTED_DASH_RE = /"-"/g;

/** Walk AST and replace TextNode("-") → SymbolNode("hyph") for mhchem tripledash. */
const replaceDashesWithHyph = (node: TypstMathNode): TypstMathNode => {
  if (node.type === 'text' && node.value === '-') {
    return symbol('hyph');
  }
  if (node.type === 'raw' && node.value.includes('"-"')) {
    const replaced = node.value.replace(QUOTED_DASH_RE, 'hyph');
    if (replaced !== node.value) {
      return {
        type: node.type,
        value: replaced
      };
    }
  }
  if (node.type === 'seq') {
    let changed = false;
    const newChildren = node.children.map(child => {
      const replaced = replaceDashesWithHyph(child);
      if (replaced !== child) {
        changed = true;
      }
      return replaced;
    });
    return changed ? seq(newChildren) : node;
  }
  return node;
};

export const mstyleAst = (node: MathNode, serialize: ITypstMathSerializer): TypstMathResult => {
  if (isOperatorInternalSpacing(node)) {
    return {
      node: seq([])
    };
  }
  const contentNode = visitAllChildren(node, serialize);
  if (isTripledashStyle(node)) {
    const transformed = replaceDashesWithHyph(contentNode);
    if (transformed !== contentNode) {
      return {
        node: transformed
      };
    }
  }
  const attrs = getAttrs<StyleAttrs>(node);
  const rawColor = attrs.mathcolor || '';
  const mathcolor: string = rawColor && rawColor !== MATHJAX_INHERIT_SENTINEL ? rawColor : '';
  const rawBg = attrs.mathbackground || '';
  const mathbg: string = rawBg && rawBg !== MATHJAX_INHERIT_SENTINEL ? rawBg : '';
  const content = serializeTypstMath(contentNode).trim();
  if (mathbg && content) {
    let styledNode: TypstMathNode = funcCall('highlight', [namedArg('fill', colorArgValue(mathbg))], {
      hash: true,
      body: [inlineMath(contentNode)],
    });
    if (mathcolor) {
      styledNode = buildColorWrap(styledNode, mathcolor);
    }
    return {
      node: styledNode,
      nodeInline: contentNode
    };
  }
  if (mathcolor && content) {
    return {
      node: buildColorWrap(contentNode, mathcolor)
    };
  }
  return {
    node: contentNode
  };
};
