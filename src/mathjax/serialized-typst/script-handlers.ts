import { TEXCLASS } from "mathjax-full/js/core/MmlTree/MmlNode";
import { ITypstData, HandlerFn, MathNode, FracAttrs, MoAttrs } from "./types";
import {
  RE_OP_WRAPPER, SHALLOW_TREE_MAX_DEPTH,
  HORIZ_BAR, RIGHT_ARROW, LEFT_ARROW,
} from "./consts";
import {
  initTypstData, addToTypstData,
  getNodeText, getAttrs,
  typstPlaceholder, formatScript,
} from "./common";
import { typstAccentMap } from "./typst-symbol-map";
import { escapeContentSeparators } from "./escape-utils";

// Prime symbol → Typst ' shorthand mapping
const PRIME_SHORTHANDS: Map<string, string> = new Map([
  ['prime', "'"],
  ['prime.double', "''"],
  ['prime.triple', "'''"],
]);

// Regex to detect overbrace/overbracket/underbrace/underbracket as outermost call
const BRACE_ANNOTATION_RE = /^(overbrace|overbracket|underbrace|underbracket)\((.+)\)$/s;
const RE_SPECIAL_FN_CALL = /^(overbrace|underbrace|overline|underline|op)\(/;
const RE_TRAILING_PAREN = /\)$/;

// Operators that Typst places below/above in display mode by default.
// Used to detect \nolimits (when these appear in msubsup/msub/msup instead of munderover).
const TYPST_DISPLAY_LIMIT_OPS: Set<string> = new Set([
  // Named function operators with limits placement
  'lim', 'limsup', 'liminf', 'max', 'min', 'inf', 'sup',
  'det', 'gcd', 'Pr',
  // Large operators
  'sum', 'product', 'product.co',
  'union.big', 'inter.big',
  'dot.o.big', 'plus.o.big', 'times.o.big',
  'union.plus.big', 'union.sq.big',
  'or.big', 'and.big',
]);

// Extensible arrows/harpoons: use stretch() instead of limits() for \xrightarrow, \xleftarrow, etc.
const STRETCH_BASE_SYMBOLS: Set<string> = new Set([
  'arrow.r', 'arrow.l', 'arrow.l.r',
  'arrow.r.twohead', 'arrow.l.twohead',
  'arrow.r.bar',                       // \xmapsto
  'arrow.r.hook', 'arrow.l.hook',      // \xhookrightarrow, \xhookleftarrow
  'arrow.r.double', 'arrow.l.double', 'arrow.l.r.double',
  'harpoon.rt', 'harpoon.lb',          // \xrightharpoonup, \xleftharpoondown
  'harpoons.rtlb', 'harpoons.ltrb',    // \xrightleftharpoons, \xleftrightharpoons
  'arrows.rr',                         // \xtofrom
  '=',                                 // \xlongequal
]);

// Accent functions that have no under-variant in Typst.
// In munder context, these use attach(base, b: symbol) instead of accent function.
const MUNDER_ATTACH_SYMBOLS: Map<string, string> = new Map([
  ['arrow', 'arrow.r'],        // → below
  ['arrow.l', 'arrow.l'],      // ← below
  ['arrow.l.r', 'arrow.l.r'],  // ↔ below
  ['harpoon', 'harpoon'],      // ⇀ below
  ['harpoon.lt', 'harpoon.lt'],// ↼ below
]);

// Typst accent shorthand functions that can be called as fn(content).
// Accents NOT in this set must use the accent(content, symbol) form.
const TYPST_ACCENT_SHORTHANDS: Set<string> = new Set([
  'hat', 'tilde', 'acute', 'grave', 'macron', 'overline', 'underline',
  'breve', 'dot', 'diaer', 'caron', 'arrow', 'circle',
  'overbrace', 'underbrace', 'overbracket', 'underbracket',
]);

/** Append ", limits: #true" inside an op() wrapper: op("name") → op("name", limits: #true) */
const addLimitsParam = (opExpr: string): string =>
  opExpr.replace(RE_TRAILING_PAREN, ', limits: #true)');

/** Match a brace annotation (overbrace/underbrace/etc.) and return it with annotation as second argument.
 *  Returns null if baseTrimmed doesn't match any of the specified kinds. */
const matchBraceAnnotation = (
  baseTrimmed: string, annotation: string,
  kinds: ('overbrace' | 'overbracket' | 'underbrace' | 'underbracket')[]
): ITypstData | null => {
  const m = BRACE_ANNOTATION_RE.exec(baseTrimmed);
  const kind = m?.[1] as typeof kinds[number] | undefined;
  if (!kind || !kinds.includes(kind)) return null;
  const base = m[2];
  const ann = typstPlaceholder(escapeContentSeparators(annotation));
  return { typst: `${kind}(${base}, ${ann})` };
};

/** Get movablelimits attribute from a node (typically the base mo of munderover) */
const getMovablelimits = (node: MathNode): boolean | undefined => {
  if (!node || node.kind !== 'mo') return undefined;
  try {
    const atr = getAttrs<MoAttrs>(node);
    return atr.movablelimits;
  } catch (e) {
    return undefined;
  }
};

/** Check if baseTrimmed is a custom op() wrapper (e.g. op("name")). */
const isCustomOp = (baseTrimmed: string): boolean =>
  RE_OP_WRAPPER.test(baseTrimmed);

/** Check if baseTrimmed is a stretchy extensible symbol (\xrightarrow, \xleftarrow, etc.).
 *  Walks into firstChild to find the inner mo and check its stretchy attribute. */
const isStretchyBase = (baseTrimmed: string, firstChild: MathNode): boolean => {
  if (!STRETCH_BASE_SYMBOLS.has(baseTrimmed)) return false;
  let moNode: MathNode = firstChild;
  for (let i = 0; i < SHALLOW_TREE_MAX_DEPTH && moNode && moNode.kind !== 'mo'; i++) {
    if (moNode.childNodes?.length === 1) {
      moNode = moNode.childNodes[0];
    } else {
      break;
    }
  }
  if (moNode?.kind !== 'mo') return false;
  try {
    const atr = getAttrs<MoAttrs>(moNode);
    return atr.stretchy === true;
  } catch (e) { return false; }
};

/** Check if baseTrimmed is a Typst operator that natively places limits
 *  above/below in display mode (e.g. sum, lim, max). */
const isNativeDisplayLimitOp = (baseTrimmed: string): boolean =>
  TYPST_DISPLAY_LIMIT_OPS.has(baseTrimmed);

/** Check if baseTrimmed starts with a special function call
 *  (overbrace, underbrace, overline, underline, op). */
const isSpecialFnCall = (baseTrimmed: string): boolean =>
  RE_SPECIAL_FN_CALL.test(baseTrimmed);

/** Build limit-placement base, returns different block/inline bases for movablelimits.
 *  baseTrimmed is the raw trimmed value; empty bases get placeholder '""' inside wrappers. */
const buildLimitBase = (firstChild: MathNode | null, baseTrimmed: string, base: string): ITypstData => {
  const basePlaceholder = typstPlaceholder(baseTrimmed);
  const movablelimits = firstChild ? getMovablelimits(firstChild) : undefined;
  const wrapper = firstChild && isStretchyBase(baseTrimmed, firstChild) ? 'stretch' : 'limits';
  if (movablelimits === true) {
    if (isCustomOp(baseTrimmed)) {
      return { typst: addLimitsParam(baseTrimmed), typst_inline: base };
    }
    if (isNativeDisplayLimitOp(baseTrimmed)) {
      return { typst: base };
    }
    return { typst: `${wrapper}(${escapeContentSeparators(basePlaceholder)})`, typst_inline: base };
  } else if (movablelimits === false) {
    return { typst: `${wrapper}(${escapeContentSeparators(basePlaceholder)})` };
  } else {
    if (isCustomOp(baseTrimmed) && firstChild?.texClass === TEXCLASS.OP) {
      if (firstChild?.kind === 'TeXAtom') {
        return { typst: addLimitsParam(baseTrimmed), typst_inline: base };
      }
      return { typst: addLimitsParam(baseTrimmed) };
    }
    if (isNativeDisplayLimitOp(baseTrimmed) || isSpecialFnCall(baseTrimmed)) {
      return { typst: base };
    }
    return { typst: `${wrapper}(${escapeContentSeparators(basePlaceholder)})` };
  }
};

/** Check if base should use scripts() wrapper (\nolimits in display mode) */
const needsScriptsWrapper = (baseTrimmed: string): boolean =>
  isNativeDisplayLimitOp(baseTrimmed);

export const mfrac: HandlerFn = (node, serialize) => {
  let res: ITypstData = initTypstData();
  const firstChild = node.childNodes[0] || null;
  const secondChild = node.childNodes[1] || null;
  const dataFirst: ITypstData = firstChild ? serialize.visitNode(firstChild, '') : initTypstData();
  const dataSecond: ITypstData = secondChild ? serialize.visitNode(secondChild, '') : initTypstData();
  const num = typstPlaceholder(escapeContentSeparators(dataFirst.typst.trim()));
  const den = typstPlaceholder(escapeContentSeparators(dataSecond.typst.trim()));
  // Check for linethickness=0 which indicates \binom (\choose)
  const atr = getAttrs<FracAttrs>(node);
  if (atr.linethickness === '0' || atr.linethickness === 0) {
    res = addToTypstData(res, { typst: `binom(${num}, ${den})` });
  } else {
    res = addToTypstData(res, { typst: `frac(${num}, ${den})` });
  }
  return res;
};

export const msup: HandlerFn = (node, serialize) => {
  let res: ITypstData = initTypstData();
  const firstChild = node.childNodes[0] || null;
  const secondChild = node.childNodes[1] || null;
  const dataFirst: ITypstData = firstChild ? serialize.visitNode(firstChild, '') : initTypstData();
  const dataSecond: ITypstData = secondChild ? serialize.visitNode(secondChild, '') : initTypstData();
  const base = dataFirst.typst;
  const sup = dataSecond.typst.trim();
  const baseTrimmed = base.trim();
  // overbrace/overbracket annotation: insert as second argument instead of ^
  if (sup) {
    const braceRes = matchBraceAnnotation(baseTrimmed, sup, ['overbrace', 'overbracket']);
    if (braceRes) { res = addToTypstData(res, braceRes); return res; }
  }
  // All parts empty (e.g. mhchem phantom alignment msup) → skip entirely
  if (!baseTrimmed && !sup) {
    return res;
  }
  // \nolimits: wrap known limit-type operators in scripts() to force side placement
  if (baseTrimmed && needsScriptsWrapper(baseTrimmed)) {
    res = addToTypstData(res, { typst: `scripts(${escapeContentSeparators(baseTrimmed)})` });
  } else {
    // Empty base (e.g. LaTeX ^{x} with no preceding base): use empty placeholder
    res = addToTypstData(res, { typst: baseTrimmed ? base : '""' });
  }
  // Skip empty superscript (e.g. LaTeX m^{} → just "m")
  if (sup) {
    // Optimize prime symbols to Typst ' shorthand
    const primeShorthand = PRIME_SHORTHANDS.get(sup);
    if (primeShorthand) {
      res = addToTypstData(res, { typst: primeShorthand });
    } else {
      res = addToTypstData(res, { typst: formatScript('^', sup) });
    }
  }
  return res;
};

export const msub: HandlerFn = (node, serialize) => {
  let res: ITypstData = initTypstData();
  const firstChild = node.childNodes[0] || null;
  const secondChild = node.childNodes[1] || null;
  const dataFirst: ITypstData = firstChild ? serialize.visitNode(firstChild, '') : initTypstData();
  const dataSecond: ITypstData = secondChild ? serialize.visitNode(secondChild, '') : initTypstData();
  const sub = dataSecond.typst.trim();
  const base = dataFirst.typst;
  const baseTrimmed = base.trim();
  // underbrace/underbracket annotation: insert as second argument instead of _
  if (sub) {
    const braceRes = matchBraceAnnotation(baseTrimmed, sub, ['underbrace', 'underbracket']);
    if (braceRes) { res = addToTypstData(res, braceRes); return res; }
  }
  // All parts empty (e.g. mhchem phantom alignment msub) → skip entirely
  if (!baseTrimmed && !sub) {
    return res;
  }
  // \nolimits: wrap known limit-type operators in scripts() to force side placement
  if (baseTrimmed && needsScriptsWrapper(baseTrimmed)) {
    res = addToTypstData(res, { typst: `scripts(${escapeContentSeparators(baseTrimmed)})` });
  } else {
    res = addToTypstData(res, { typst: baseTrimmed ? base : '""' });
  }
  // Skip empty subscript (e.g. LaTeX m_{} → just "m")
  if (sub) {
    res = addToTypstData(res, { typst: formatScript('_', sub) });
  }
  return res;
};

export const msubsup: HandlerFn = (node, serialize) => {
  let res: ITypstData = initTypstData();
  const firstChild = node.childNodes[0] || null;
  const secondChild = node.childNodes[1] || null;
  const thirdChild = node.childNodes[2] || null;
  const dataFirst: ITypstData = firstChild ? serialize.visitNode(firstChild, '') : initTypstData();
  const dataSecond: ITypstData = secondChild ? serialize.visitNode(secondChild, '') : initTypstData();
  const dataThird: ITypstData = thirdChild ? serialize.visitNode(thirdChild, '') : initTypstData();
  const sub = dataSecond.typst.trim();
  const sup = dataThird.typst.trim();
  const base = dataFirst.typst;
  const baseTrimmed = base.trim();
  // All parts empty (e.g. mhchem phantom alignment msubsup) → skip entirely
  if (!baseTrimmed && !sub && !sup) {
    return res;
  }
  // \nolimits: wrap known limit-type operators in scripts() to force side placement
  if (baseTrimmed && needsScriptsWrapper(baseTrimmed)) {
    res = addToTypstData(res, { typst: `scripts(${escapeContentSeparators(baseTrimmed)})` });
  } else {
    res = addToTypstData(res, { typst: baseTrimmed ? base : '""' });
  }
  // Skip empty subscript/superscript (e.g. LaTeX m_{}^{x} → just "m^x")
  if (sub) {
    res = addToTypstData(res, { typst: formatScript('_', sub) });
  }
  if (sup) {
    res = addToTypstData(res, { typst: formatScript('^', sup) });
  }
  return res;
};

export const msqrt: HandlerFn = (node, serialize) => {
  let res: ITypstData = initTypstData();
  const firstChild = node.childNodes[0] || null;
  const dataFirst: ITypstData = firstChild ? serialize.visitNode(firstChild, '') : initTypstData();
  const content = typstPlaceholder(escapeContentSeparators(dataFirst.typst.trim()));
  res = addToTypstData(res, { typst: `sqrt(${content})` });
  return res;
};

export const mroot: HandlerFn = (node, serialize) => {
  let res: ITypstData = initTypstData();
  // MathML mroot: child[0] = radicand, child[1] = index
  const radicand = node.childNodes[0] || null;
  const index = node.childNodes[1] || null;
  const dataRadicand: ITypstData = radicand ? serialize.visitNode(radicand, '') : initTypstData();
  const dataIndex: ITypstData = index ? serialize.visitNode(index, '') : initTypstData();
  const radicandContent = typstPlaceholder(escapeContentSeparators(dataRadicand.typst.trim()));
  const indexContent = typstPlaceholder(escapeContentSeparators(dataIndex.typst.trim()));
  // Typst root: root(index, radicand)
  res = addToTypstData(res, {
    typst: `root(${indexContent}, ${radicandContent})`
  });
  return res;
};

export const mover: HandlerFn = (node, serialize) => {
  let res: ITypstData = initTypstData();
  const firstChild = node.childNodes[0] || null;
  const secondChild = node.childNodes[1] || null;
  const dataFirst: ITypstData = firstChild ? serialize.visitNode(firstChild, '') : initTypstData();
  const dataSecond: ITypstData = secondChild ? serialize.visitNode(secondChild, '') : initTypstData();
  // Detect \varlimsup pattern: mover(mi("lim"), mo("―")) → op(overline(lim))
  if (firstChild?.kind === 'mi' && secondChild?.kind === 'mo') {
    const baseText = getNodeText(firstChild);
    const overChar = getNodeText(secondChild);
    if (baseText === 'lim' && overChar === HORIZ_BAR) {
      res = addToTypstData(res, { typst: 'op(overline(lim))' });
      return res;
    }
  }
  if (secondChild && secondChild.kind === 'mo') {
    const accentChar = getNodeText(secondChild);
    const accentFn = typstAccentMap.get(accentChar);
    if (accentFn) {
      const content = typstPlaceholder(escapeContentSeparators(dataFirst.typst.trim()));
      if (TYPST_ACCENT_SHORTHANDS.has(accentFn)) {
        res = addToTypstData(res, { typst: `${accentFn}(${content})` });
      } else {
        res = addToTypstData(res, { typst: `accent(${content}, ${accentFn})` });
      }
      return res;
    }
  }
  const rawBase = dataFirst.typst.trim();
  const over = dataSecond.typst.trim();
  if (over) {
    const braceRes = matchBraceAnnotation(rawBase, over, ['overbrace', 'overbracket']);
    if (braceRes) { res = addToTypstData(res, braceRes); return res; }
    const baseData = buildLimitBase(firstChild, rawBase, dataFirst.typst);
    res = addToTypstData(res, baseData);
    res = addToTypstData(res, { typst: formatScript('^', over) });
  } else {
    res = addToTypstData(res, { typst: typstPlaceholder(rawBase) });
  }
  return res;
};

export const munder: HandlerFn = (node, serialize) => {
  let res: ITypstData = initTypstData();
  const firstChild = node.childNodes[0] || null;
  const secondChild = node.childNodes[1] || null;
  const dataFirst: ITypstData = firstChild ? serialize.visitNode(firstChild, '') : initTypstData();
  const dataSecond: ITypstData = secondChild ? serialize.visitNode(secondChild, '') : initTypstData();
  // Detect \varinjlim / \varprojlim / \varliminf patterns: munder(mi("lim"), mo(...))
  // Map to equivalent Typst operators (losing the visual decoration).
  if (firstChild?.kind === 'mi' && secondChild?.kind === 'mo') {
    const baseText = getNodeText(firstChild);
    const underChar = getNodeText(secondChild);
    if (baseText === 'lim' && underChar === RIGHT_ARROW) {     // \varinjlim
      res = addToTypstData(res, { typst: 'op("inj lim")' });
      return res;
    }
    if (baseText === 'lim' && underChar === LEFT_ARROW) {      // \varprojlim
      res = addToTypstData(res, { typst: 'op("proj lim")' });
      return res;
    }
    if (baseText === 'lim' && underChar === HORIZ_BAR) {       // \varliminf
      res = addToTypstData(res, { typst: 'op(underline(lim))' });
      return res;
    }
  }
  if (secondChild && secondChild.kind === 'mo') {
    const accentChar = getNodeText(secondChild);
    let accentFn = typstAccentMap.get(accentChar);
    // Flip over-accents to under-accents when used in munder context
    if (accentFn === 'overline') { accentFn = 'underline'; }
    if (accentFn === 'overbrace') { accentFn = 'underbrace'; }
    if (accentFn) {
      const content = typstPlaceholder(escapeContentSeparators(dataFirst.typst.trim()));
      // Arrows/harpoons have no under-variant in Typst — use attach(base, b: symbol)
      const underSymbol = MUNDER_ATTACH_SYMBOLS.get(accentFn);
      if (underSymbol) {
        res = addToTypstData(res, { typst: `attach(${content}, b: ${underSymbol})` });
        return res;
      }
      if (TYPST_ACCENT_SHORTHANDS.has(accentFn)) {
        res = addToTypstData(res, { typst: `${accentFn}(${content})` });
      } else {
        res = addToTypstData(res, { typst: `accent(${content}, ${accentFn})` });
      }
      return res;
    }
  }
  const rawBase = dataFirst.typst.trim();
  const under = dataSecond.typst.trim();
  if (under) {
    const braceRes = matchBraceAnnotation(rawBase, under, ['underbrace', 'underbracket']);
    if (braceRes) { res = addToTypstData(res, braceRes); return res; }
    const baseData = buildLimitBase(firstChild, rawBase, dataFirst.typst);
    res = addToTypstData(res, baseData);
    res = addToTypstData(res, { typst: formatScript('_', under) });
  } else {
    res = addToTypstData(res, { typst: typstPlaceholder(rawBase) });
  }
  return res;
};

export const munderover: HandlerFn = (node, serialize) => {
  let res: ITypstData = initTypstData();
  const firstChild = node.childNodes[0] || null;
  const secondChild = node.childNodes[1] || null;
  const thirdChild = node.childNodes[2] || null;
  const dataFirst: ITypstData = firstChild ? serialize.visitNode(firstChild, '') : initTypstData();
  const dataSecond: ITypstData = secondChild ? serialize.visitNode(secondChild, '') : initTypstData();
  const dataThird: ITypstData = thirdChild ? serialize.visitNode(thirdChild, '') : initTypstData();
  const under = dataSecond.typst.trim();
  const over = dataThird.typst.trim();
  // Use movablelimits to decide between default placement and limits() wrapping
  const rawBase = dataFirst.typst.trim();
  const baseData = buildLimitBase(firstChild, rawBase, dataFirst.typst);
  res = addToTypstData(res, baseData);
  if (under) {
    res = addToTypstData(res, { typst: formatScript('_', under) });
  }
  if (over) {
    res = addToTypstData(res, { typst: formatScript('^', over) });
  }
  return res;
};

export const mmultiscripts: HandlerFn = (node, serialize) => {
  let res: ITypstData = initTypstData();
  if (!node.childNodes || node.childNodes.length === 0) return res;
  // Parse mmultiscripts structure:
  // child[0] = base
  // child[1..prescriptsIdx-1] = post-scripts (pairs of sub, sup)
  // child[prescriptsIdx] = mprescripts
  // child[prescriptsIdx+1..] = pre-scripts (pairs of sub, sup)
  const base = node.childNodes[0];
  const baseData: ITypstData = serialize.visitNode(base, '');
  const baseTrimmed = typstPlaceholder(baseData.typst.trim());
  let prescriptsIdx = -1;
  for (let i = 1; i < node.childNodes.length; i++) {
    if (node.childNodes[i].kind === 'mprescripts') {
      prescriptsIdx = i;
      break;
    }
  }
  // Collect post-scripts (pairs after base, before mprescripts).
  // NOTE: MathML allows multiple sub/sup pairs; in practice LaTeX produces at most one.
  // Typst attach() accepts only one value per position, so we keep the LAST non-empty value.
  const postEnd = prescriptsIdx >= 0 ? prescriptsIdx : node.childNodes.length;
  let lastPostSub = '';
  let lastPostSup = '';
  for (let i = 1; i < postEnd; i += 2) {
    const subNode = node.childNodes[i];
    const supNode = node.childNodes[i + 1] || null;
    if (subNode && subNode.kind !== 'none') {
      const d: ITypstData = serialize.visitNode(subNode, '');
      if (d.typst.trim()) lastPostSub = d.typst.trim();
    }
    if (supNode && supNode.kind !== 'none') {
      const d: ITypstData = serialize.visitNode(supNode, '');
      if (d.typst.trim()) lastPostSup = d.typst.trim();
    }
  }
  // Collect pre-scripts (pairs after mprescripts)
  let lastPreSub = '';
  let lastPreSup = '';
  if (prescriptsIdx >= 0) {
    for (let i = prescriptsIdx + 1; i < node.childNodes.length; i += 2) {
      const subNode = node.childNodes[i];
      const supNode = node.childNodes[i + 1] || null;
      if (subNode && subNode.kind !== 'none') {
        const d: ITypstData = serialize.visitNode(subNode, '');
        if (d.typst.trim()) lastPreSub = d.typst.trim();
      }
      if (supNode && supNode.kind !== 'none') {
        const d: ITypstData = serialize.visitNode(supNode, '');
        if (d.typst.trim()) lastPreSup = d.typst.trim();
      }
    }
  }
  const hasPrescripts = lastPreSub || lastPreSup;
  if (!hasPrescripts) {
    // No prescripts — use simple base_sub^sup syntax
    res = addToTypstData(res, { typst: baseTrimmed });
    if (lastPostSub) {
      res = addToTypstData(res, { typst: formatScript('_', lastPostSub) });
    }
    if (lastPostSup) {
      res = addToTypstData(res, { typst: formatScript('^', lastPostSup) });
    }
  } else {
    // Has prescripts — use attach(base, tl:, bl:, t:, b:)
    const parts: string[] = [];
    if (lastPreSup) parts.push(`tl: ${lastPreSup}`);
    if (lastPreSub) parts.push(`bl: ${lastPreSub}`);
    if (lastPostSup) parts.push(`t: ${lastPostSup}`);
    if (lastPostSub) parts.push(`b: ${lastPostSub}`);
    res = addToTypstData(res, {
      typst: `attach(${escapeContentSeparators(baseTrimmed)}, ${parts.join(', ')})`
    });
  }
  return res;
};
