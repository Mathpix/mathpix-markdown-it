import { TEXCLASS } from "mathjax-full/js/core/MmlTree/MmlNode";
import {
  ITypstData, HandlerFn, MathNode, FontAttrs, SpaceAttrs,
} from "./types";
import {
  RE_NBSP, RE_WORD_DOT_END, RE_WORD_DOT_START,
  RE_WORD_START, RE_UNICODE_SPACES,
  UNPAIRED_BRACKET_PROP, UNPAIRED_BRACKET_TYPST,
  FUNC_APPLY, INVISIBLE_TIMES, INVISIBLE_SEP, INVISIBLE_PLUS,
  MINUS_SIGN, PLUS_MINUS, MINUS_PLUS,
} from "./consts";
import {
  initTypstData, addToTypstData,
  getNodeText, getChildText, getAttrs, getProp,
  isFirstChild, isLastChild, getSiblingIndex, typstPlaceholder,
} from "./common";
import { findTypstSymbol, typstFontMap, typstSymbolMap } from "./typst-symbol-map";
import { escapeContentSeparators } from "./escape-utils";

const INVISIBLE_CHARS: ReadonlySet<string> = new Set([
  FUNC_APPLY, INVISIBLE_TIMES, INVISIBLE_SEP, INVISIBLE_PLUS,
]);

// Built-in Typst math operators — should NOT be wrapped in upright()
const TYPST_MATH_OPERATORS: ReadonlySet<string> = new Set([
  'sin', 'cos', 'tan', 'cot', 'sec', 'csc',
  'arcsin', 'arccos', 'arctan',
  'sinh', 'cosh', 'tanh', 'coth',
  'exp', 'log', 'ln', 'lg',
  'det', 'dim', 'gcd', 'mod',
  'inf', 'sup', 'lim', 'liminf', 'limsup',
  'max', 'min', 'arg', 'deg', 'hom', 'ker',
  'Pr', 'tr',
]);

const BB_SHORTHAND_LETTERS: ReadonlySet<string> = new Set(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
);

// Operators that should have spaces around them for readability
const SPACED_OPERATORS: ReadonlySet<string> = new Set([
  '+', '-', '=', '<', '>', MINUS_SIGN, PLUS_MINUS, MINUS_PLUS,
]);

// Multi-word MathJax operator names → Typst built-in operator names.
// MathJax uses thin space (U+2006) between words; we normalize before lookup.
const MATHJAX_MULTIWORD_OPS: ReadonlyMap<string, string> = new Map([
  ['lim sup', 'limsup'],
  ['lim inf', 'liminf'],
]);

// MathML spacing widths → Typst spacing keywords
const MSPACE_WIDTH_MAP: Readonly<Record<string, string>> = {
  '2em': ' wide ',
  '1em': ' quad ',
  '0.2778em': ' thick ',  // \; → thickmathspace
  '0.278em': ' thick ',
  '0.2222em': ' med ',    // \: → mediummathspace
  '0.222em': ' med ',
  '0.1667em': ' thin ',   // \, → thinmathspace
  '0.167em': ' thin ',
  '-0.1667em': '',         // \! → negative thin space (Typst has no negthin; skip)
  '-0.167em': '',
};

/** Extract the primary Typst symbol text from a node (mi/mo).
 *  Gets the first child's text and maps it through findTypstSymbol. */
const getNodeTypstSymbol = (node: MathNode): string => {
  const text = getChildText(node);
  if (!text) return '';
  return findTypstSymbol(text);
};

const needsSpaceBefore = (node: MathNode): boolean => {
  try {
    if (isFirstChild(node)) return false;
    const index = getSiblingIndex(node);
    if (index <= 0) return false;
    const prev = node.parent.childNodes[index - 1];
    if (prev.kind === 'mi' || prev.kind === 'mo') {
      return RE_WORD_DOT_END.test(getNodeTypstSymbol(prev));
    }
    if (prev.kind === 'mn') return true;
    return false;
  } catch (_e: unknown) {
    return false;
  }
};

const needsSpaceAfter = (node: MathNode): boolean => {
  try {
    if (isLastChild(node)) return false;
    const parentKind = node.parent?.kind;
    if (parentKind === 'msub' || parentKind === 'msup' || parentKind === 'msubsup'
      || parentKind === 'munderover' || parentKind === 'munder' || parentKind === 'mover') {
      return false;
    }
    const index = getSiblingIndex(node);
    if (index < 0) return false;
    let next = node.parent.childNodes[index + 1];
    // Skip invisible function application (U+2061)
    if (next && getChildText(next) === FUNC_APPLY && index + 2 < node.parent.childNodes.length) {
      next = node.parent.childNodes[index + 2];
    }
    if (next && (next.kind === 'mi' || next.kind === 'mo')) {
      return RE_WORD_DOT_START.test(getNodeTypstSymbol(next));
    }
    if (next && next.kind === 'mn') return true;
    return false;
  } catch (_e: unknown) {
    return false;
  }
};

export const mi: HandlerFn = (node, _serialize) => {
  let res: ITypstData = initTypstData();
  if (!node.childNodes || node.childNodes.length === 0) {
    return res;
  }
  const value = getChildText(node);
  if (!value) {
    return res;
  }
  const atr = getAttrs<FontAttrs>(node);
  const mathvariant = atr.mathvariant || '';
  const isKnownSymbol = typstSymbolMap.has(value);
  const isKnownOperator = TYPST_MATH_OPERATORS.has(value);
  let typstValue: string = findTypstSymbol(value);
  // \operatorname{name}: texClass=OP, multi-char, not built-in
  // Don't add limits: #true here — parent handler (munderover/munder/mover) decides placement.
  if (node.texClass === TEXCLASS.OP && value.length > 1 && !isKnownOperator) {
    typstValue = `op("${value}")`;
  }
  // \mathrm{d} → dif (differential operator shorthand, single-char d only)
  else if (mathvariant === 'normal' && value === 'd' && !isKnownSymbol) {
    typstValue = 'dif';
  }
  // \mathbb{R} → RR (doubled letter shorthand for single uppercase)
  else if (mathvariant === 'double-struck' && value.length === 1 && BB_SHORTHAND_LETTERS.has(value)) {
    typstValue = value + value;
  }
  // Font wrapping: skip for known non-bold symbols, operators, and escape-form symbols (\#, \$)
  else if (mathvariant && mathvariant !== 'italic' && !isKnownOperator
    && (!isKnownSymbol || mathvariant === 'bold' || mathvariant === 'bold-italic')
    && !(isKnownSymbol && typstValue.startsWith('\\'))) {
    const fontFn = typstFontMap.get(mathvariant);
    if (fontFn) {
      // Multi-letter text needs quotes in Typst math (e.g. italic("word"), bold("text"))
      const inner = value.length > 1 && !isKnownSymbol ? `"${value}"` : typstValue;
      // \mathbf produces mathvariant="bold" which is upright bold in LaTeX
      if (mathvariant === 'bold' && !isKnownSymbol) {
        typstValue = `upright(bold(${inner}))`;
      } else {
        typstValue = `${fontFn}(${inner})`;
      }
    }
  }
  // Add spacing around multi-character Typst symbol names
  if (typstValue.length > 1 && RE_WORD_START.test(typstValue)) {
    const spaceBefore = needsSpaceBefore(node) ? ' ' : '';
    const spaceAfter = needsSpaceAfter(node) ? ' ' : '';
    res = addToTypstData(res, { typst: spaceBefore + typstValue + spaceAfter });
  } else {
    res = addToTypstData(res, { typst: typstValue });
  }
  return res;
};

export const mo: HandlerFn = (node, _serialize) => {
  let res: ITypstData = initTypstData();
  const value = getNodeText(node);
  const unpairedDir = getProp<string>(node, UNPAIRED_BRACKET_PROP);
  if (unpairedDir && UNPAIRED_BRACKET_TYPST[value]) {
    const spaceBefore = needsSpaceBefore(node) ? ' ' : '';
    const spaceAfter = needsSpaceAfter(node) ? ' ' : '';
    res = addToTypstData(res, { typst: spaceBefore + UNPAIRED_BRACKET_TYPST[value] + spaceAfter });
    return res;
  }
  if (INVISIBLE_CHARS.has(value)) {
    return res;
  }
  const typstValue: string = findTypstSymbol(value);
  // Map multi-word MathJax operator names to Typst built-in equivalents
  // (e.g. \limsup → "lim⁠sup" with thin space → "limsup")
  const normalizedValue = value.replace(RE_UNICODE_SPACES, ' ');
  const mappedOp = MATHJAX_MULTIWORD_OPS.get(normalizedValue);
  if (mappedOp) {
    const spaceBefore = needsSpaceBefore(node) ? ' ' : '';
    const spaceAfter = needsSpaceAfter(node) ? ' ' : '';
    res = addToTypstData(res, { typst: spaceBefore + mappedOp + spaceAfter });
    return res;
  }
  // Detect custom named operators (e.g. \injlim → "inj lim", \projlim → "proj lim")
  // Don't add limits: #true here — parent handler (munderover/munder/mover) decides placement
  if (normalizedValue.length > 1 && RE_WORD_START.test(normalizedValue) && !typstSymbolMap.has(value) && !TYPST_MATH_OPERATORS.has(value)) {
    const opName = normalizedValue;
    res = addToTypstData(res, { typst: `op("${opName}")` });
    return res;
  }
  // Check if this operator is inside sub/sup/munderover — no spacing there
  const parentKind = node.parent?.kind;
  const inScript = parentKind === 'msub' || parentKind === 'msup'
    || parentKind === 'msubsup' || parentKind === 'munderover'
    || parentKind === 'munder' || parentKind === 'mover';
  if (typstValue.length > 1 && RE_WORD_START.test(typstValue)) {
    const spaceBefore = needsSpaceBefore(node) ? ' ' : '';
    let spaceAfter = needsSpaceAfter(node) ? ' ' : '';
    // Prevent Typst from interpreting "symbol(" as a function call
    // (e.g. "lt.eq(x)" would call lt.eq as a function)
    if (!spaceAfter && !inScript) {
      try {
        const idx = getSiblingIndex(node);
        const next = node.parent.childNodes[idx + 1];
        if (next && next.kind === 'mo') {
          const nt = getNodeText(next);
          if (nt === '(' || nt === '[') spaceAfter = ' ';
        }
      } catch (_e: unknown) { /* ignore */ }
    }
    res = addToTypstData(res, { typst: spaceBefore + typstValue + spaceAfter });
  } else if (!inScript && SPACED_OPERATORS.has(value)) {
    res = addToTypstData(res, { typst: ' ' + typstValue + ' ' });
  } else if (!inScript && value === ',') {
    res = addToTypstData(res, { typst: ', ' });
  } else if (value === '/') {
    // Escape slash: in Typst math, / creates a fraction; \/ is a literal slash
    res = addToTypstData(res, { typst: '\\/' });
  } else {
    res = addToTypstData(res, { typst: typstValue });
  }
  return res;
};

export const mn: HandlerFn = (node, _serialize) => {
  let res: ITypstData = initTypstData();
  const value = getNodeText(node);
  const atr = getAttrs<FontAttrs>(node);
  const mathvariant = atr.mathvariant || '';
  if (mathvariant && mathvariant !== 'normal') {
    const fontFn = typstFontMap.get(mathvariant);
    if (fontFn) {
      const content = typstPlaceholder(escapeContentSeparators(value));
      res = addToTypstData(res, { typst: `${fontFn}(${content})` });
      return res;
    }
  }
  res = addToTypstData(res, { typst: value });
  return res;
};

export const mtext: HandlerFn = (node, _serialize) => {
  let res: ITypstData = initTypstData();
  if (!node.childNodes || node.childNodes.length === 0) {
    return res;
  }
  let value = getChildText(node);
  if (!value || !value.trim()) {
    return res;
  }
  value = value.replace(RE_NBSP, ' ');
  if (value.length === 1 && typstSymbolMap.has(value)) {
    const typstValue = findTypstSymbol(value);
    const spaceBefore = needsSpaceBefore(node) ? ' ' : '';
    const spaceAfter = needsSpaceAfter(node) ? ' ' : '';
    res = addToTypstData(res, { typst: spaceBefore + typstValue + spaceAfter });
    return res;
  }
  let textContent = `"${value.replace(/"/g, '\\"')}"`;
  const atr = getAttrs<FontAttrs>(node);
  const mathvariant = atr.mathvariant || '';
  if (mathvariant && mathvariant !== 'normal') {
    const fontFn = typstFontMap.get(mathvariant);
    if (fontFn) {
      textContent = `${fontFn}(${textContent})`;
    }
  }
  res = addToTypstData(res, { typst: textContent });
  return res;
};

export const mspace: HandlerFn = (node, _serialize) => {
  let res: ITypstData = initTypstData();
  const atr = getAttrs<SpaceAttrs>(node);
  if (!atr.width) {
    return res;
  }
  const width = atr.width.toString();
  const mapped = MSPACE_WIDTH_MAP[width];
  if (mapped !== undefined) {
    if (mapped) res = addToTypstData(res, { typst: mapped });
    return res;
  }
  res = addToTypstData(res, { typst: ' ' });
  return res;
};
