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
  SCRIPT_NODE_KINDS,
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

/** Combining long solidus overlay (U+0338) — used by MathJax for \not on mi/mo/mtext */
const COMBINING_NOT_SLASH = '\u0338';

/** Strip trailing combining not slash and return [cleanValue, hasCancelSlash] */
const stripCombiningNot = (value: string): [string, boolean] => {
  if (value.endsWith(COMBINING_NOT_SLASH)) {
    return [value.slice(0, -1), true];
  }
  return [value, false];
};

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

// Operators that get spaces around them in non-script contexts for readability
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
const MSPACE_WIDTH_MAP: ReadonlyMap<string, string> = new Map([
  ['2em', ' wide '],
  ['1em', ' quad '],
  ['0.2778em', ' thick '],  // \; → thickmathspace
  ['0.278em', ' thick '],
  ['0.2222em', ' med '],    // \: → mediummathspace
  ['0.222em', ' med '],
  ['0.1667em', ' thin '],   // \, → thinmathspace
  ['0.167em', ' thin '],
  ['-0.1667em', ''],         // \! → negative thin space (Typst has no negthin; skip)
  ['-0.167em', ''],
]);

/** Check if a +/- operator is in unary prefix position (after OPEN paren or at start).
 *  Unary: (-1), (+x). Binary: a - b, x + 1, )+ (end of group). */
const isUnaryPrefix = (node: MathNode): boolean => {
  if (isFirstChild(node)) return true;
  const parent = node.parent;
  if (!parent) return false;
  const idx = getSiblingIndex(node);
  if (idx <= 0) return false;
  const prev = parent.childNodes[idx - 1];
  // After an opening bracket → unary
  if (prev.kind === 'mo' && prev.texClass === TEXCLASS.OPEN) return true;
  return false;
};

/** Escape a string for use inside Typst string literals ("...") */
const escapeTypstString = (s: string): string =>
  s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

/** Normalize multi-word operator name (thin/non-breaking spaces → regular space) */
const normalizeOperatorName = (value: string): string =>
  value.replace(RE_UNICODE_SPACES, ' ').trim();

/** True when the token looks like a word (multi-char, starts with letter/dot) */
const isWordLikeToken = (value: string): boolean =>
  value.length > 1 && RE_WORD_START.test(value);

/** Check if a node is inside a sub/superscript context */
const isInScriptContext = (node: MathNode): boolean =>
  !!node.parent && SCRIPT_NODE_KINDS.has(node.parent.kind);

/** Shorthand: create ITypstData with a single typst string */
const singleTypst = (typst: string): ITypstData =>
  addToTypstData(initTypstData(), { typst });

/** Extract the primary Typst symbol text from a node (mi/mo).
 *  Gets the first child's text and maps it through findTypstSymbol. */
const getNodeTypstSymbol = (node: MathNode): string => {
  const text = getChildText(node);
  if (!text) return '';
  return findTypstSymbol(text);
};

/** Wrap value with context-dependent spaces (before/after sibling-aware) */
const withContextSpaces = (node: MathNode, value: string): string => {
  const before = needsSpaceBefore(node) ? ' ' : '';
  const after = needsSpaceAfter(node) ? ' ' : '';
  return before + value + after;
};

const needsSpaceBefore = (node: MathNode): boolean => {
  const parent = node.parent;
  if (!parent || isFirstChild(node)) return false;
  const index = getSiblingIndex(node);
  if (index <= 0) return false;
  const prev = parent.childNodes[index - 1];
  if (!prev) return false;
  if (prev.kind === 'mi' || prev.kind === 'mo') {
    return RE_WORD_DOT_END.test(getNodeTypstSymbol(prev));
  }
  return prev.kind === 'mn';
};

const needsSpaceAfter = (node: MathNode): boolean => {
  const parent = node.parent;
  if (!parent || isLastChild(node)) return false;
  if (isInScriptContext(node)) return false;
  const index = getSiblingIndex(node);
  if (index < 0) return false;
  let next = parent.childNodes[index + 1];
  if (!next) return false;
  // Skip invisible function application (U+2061)
  if (getChildText(next) === FUNC_APPLY && index + 2 < parent.childNodes.length) {
    next = parent.childNodes[index + 2];
  }
  if (!next) return false;
  if (next.kind === 'mi' || next.kind === 'mo') {
    return RE_WORD_DOT_START.test(getNodeTypstSymbol(next));
  }
  return next.kind === 'mn';
};

/** Handle unpaired brackets like \left( ... \right. */
const trySerializeUnpairedBracket = (
  node: MathNode, value: string,
): ITypstData | null => {
  const unpairedDir = getProp<string>(node, UNPAIRED_BRACKET_PROP);
  if (!unpairedDir || !UNPAIRED_BRACKET_TYPST[value]) return null;
  return singleTypst(withContextSpaces(node, UNPAIRED_BRACKET_TYPST[value]));
};

/** Handle multi-word MathJax operator names (e.g. "lim sup" → "limsup") */
const trySerializeMultiwordOp = (
  node: MathNode, normalizedName: string,
): ITypstData | null => {
  const mappedOp = MATHJAX_MULTIWORD_OPS.get(normalizedName);
  if (!mappedOp) return null;
  return singleTypst(withContextSpaces(node, mappedOp));
};

/** Handle custom named operators (e.g. \injlim → op("inj lim")) */
const trySerializeNamedOperator = (
  node: MathNode, value: string, normalizedName: string,
): ITypstData | null => {
  if (
    isWordLikeToken(normalizedName)
    && !typstSymbolMap.has(value)
    && !TYPST_MATH_OPERATORS.has(normalizedName)
  ) {
    return singleTypst(withContextSpaces(node, `op("${escapeTypstString(normalizedName)}")`));
  }
  return null;
};

/** True when the next sibling is ( or [ — needs a space to prevent
 *  Typst from interpreting "symbol(" as a function call */
const needsDisambiguatingSpaceAfter = (node: MathNode, inScript: boolean): boolean => {
  if (inScript) return false;
  const parent = node.parent;
  if (!parent) return false;
  const idx = getSiblingIndex(node);
  const next = idx >= 0 ? parent.childNodes[idx + 1] : undefined;
  if (!next || next.kind !== 'mo') return false;
  const nt = getNodeText(next);
  return nt === '(' || nt === '[';
};

/** Handle word-like Typst symbol names that need spacing and bracket disambiguation */
const trySerializeWordLikeOperator = (
  node: MathNode, typstValue: string, inScript: boolean,
): ITypstData | null => {
  if (!isWordLikeToken(typstValue)) return null;
  const spaceBefore = needsSpaceBefore(node) ? ' ' : '';
  const spaceAfter = (needsSpaceAfter(node) || needsDisambiguatingSpaceAfter(node, inScript)) ? ' ' : '';
  return singleTypst(spaceBefore + typstValue + spaceAfter);
};

export const mi: HandlerFn = (node, _serialize) => {
  if (!node.childNodes || node.childNodes.length === 0) {
    return initTypstData();
  }
  // getNodeText (not getChildText) to capture combining chars like U+0338 (\not)
  const rawValue = getNodeText(node);
  if (!rawValue) {
    return initTypstData();
  }
  // \not on mi: combining long solidus overlay (U+0338) → cancel()
  const [value, hasNot] = stripCombiningNot(rawValue);
  if (!value) return initTypstData();
  const attrs = getAttrs<FontAttrs>(node);
  const mathvariant = attrs.mathvariant || '';
  const isKnownSymbol = typstSymbolMap.has(value);
  const isKnownOperator = TYPST_MATH_OPERATORS.has(value);
  let typstValue: string = findTypstSymbol(value);
  // \operatorname{name}: texClass=OP, multi-char, not built-in
  // Don't add limits: #true here — parent handler (munderover/munder/mover) decides placement.
  if (node.texClass === TEXCLASS.OP && value.length > 1 && !isKnownOperator) {
    typstValue = `op("${escapeTypstString(value)}")`;
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
      const inner = value.length > 1 && !isKnownSymbol ? `"${escapeTypstString(value)}"` : typstValue;
      // \mathbf produces mathvariant="bold" which is upright bold in LaTeX
      if (mathvariant === 'bold' && !isKnownSymbol) {
        typstValue = `upright(bold(${inner}))`;
      } else {
        typstValue = `${fontFn}(${inner})`;
      }
    }
  }
  if (hasNot) typstValue = `cancel(${typstValue})`;
  // Add spacing around multi-character word-like Typst symbol names
  if (isWordLikeToken(typstValue)) {
    return singleTypst(withContextSpaces(node, typstValue));
  }
  return singleTypst(typstValue);
};

export const mo: HandlerFn = (node, _serialize) => {
  const rawValue = getNodeText(node);
  // \not on mo: combining long solidus overlay (U+0338) → cancel()
  const [value, hasNot] = stripCombiningNot(rawValue);
  const unpaired = trySerializeUnpairedBracket(node, value);
  if (unpaired) return hasNot ? singleTypst(`cancel(${unpaired.typst})`) : unpaired;
  if (INVISIBLE_CHARS.has(value)) return initTypstData();
  let typstValue: string = findTypstSymbol(value);
  const normalizedName = normalizeOperatorName(value);
  const multiword = trySerializeMultiwordOp(node, normalizedName);
  if (multiword) return hasNot ? singleTypst(`cancel(${multiword.typst.trim()})`) : multiword;
  // Don't add limits: #true here — parent handler decides placement.
  const namedOp = trySerializeNamedOperator(node, value, normalizedName);
  if (namedOp) return hasNot ? singleTypst(`cancel(${namedOp.typst.trim()})`) : namedOp;
  if (hasNot) typstValue = `cancel(${typstValue})`;
  const inScript = isInScriptContext(node);
  const wordLike = trySerializeWordLikeOperator(node, typstValue, inScript);
  if (wordLike) return wordLike;
  if (!inScript && SPACED_OPERATORS.has(value)) {
    // Unary prefix operators (after OPEN paren or at start) get no space after:
    // (-1) → (-1), not ( - 1). Binary/other contexts get spaces on both sides.
    if (isUnaryPrefix(node)) {
      return singleTypst(needsSpaceBefore(node) ? ' ' + typstValue : typstValue);
    }
    return singleTypst(' ' + typstValue + ' ');
  }
  if (!inScript && value === ',') {
    return singleTypst(', ');
  }
  // Escape slash: in Typst math, / creates a fraction; \/ is a literal slash
  if (value === '/') {
    return singleTypst('\\/');
  }
  return singleTypst(typstValue);
};

export const mn: HandlerFn = (node, _serialize) => {
  const value = getNodeText(node);
  const attrs = getAttrs<FontAttrs>(node);
  const mathvariant = attrs.mathvariant || '';
  if (mathvariant && mathvariant !== 'normal') {
    const fontFn = typstFontMap.get(mathvariant);
    if (fontFn) {
      const content = typstPlaceholder(escapeContentSeparators(value));
      return singleTypst(`${fontFn}(${content})`);
    }
  }
  return singleTypst(value);
};

export const mtext: HandlerFn = (node, _serialize) => {
  if (!node.childNodes || node.childNodes.length === 0) {
    return initTypstData();
  }
  let value = getChildText(node);
  if (!value || !value.trim()) {
    return initTypstData();
  }
  value = value.replace(RE_NBSP, ' ');
  if (value.length === 1 && typstSymbolMap.has(value)) {
    const typstValue = findTypstSymbol(value);
    return singleTypst(withContextSpaces(node, typstValue));
  }
  // Only escape quotes here — backslashes in mtext content are intentional
  // (e.g. numcases text like "x \geq 0" should keep the backslash as-is)
  let textContent = `"${value.replace(/"/g, '\\"')}"`;
  const attrs = getAttrs<FontAttrs>(node);
  const mathvariant = attrs.mathvariant || '';
  if (mathvariant && mathvariant !== 'normal') {
    const fontFn = typstFontMap.get(mathvariant);
    if (fontFn) {
      textContent = `${fontFn}(${textContent})`;
    }
  }
  return singleTypst(textContent);
};

export const mspace: HandlerFn = (node, _serialize) => {
  const attrs = getAttrs<SpaceAttrs>(node);
  if (!attrs.width) {
    return initTypstData();
  }
  const width = attrs.width.toString().trim();
  const mapped = MSPACE_WIDTH_MAP.get(width);
  if (mapped !== undefined) {
    return mapped ? singleTypst(mapped) : initTypstData();
  }
  return singleTypst(' ');
};
