import { TEXCLASS } from "mathjax-full/js/core/MmlTree/MmlNode";
import { MathNode, FontAttrs, SpaceAttrs } from "../types";
import {
  RE_NBSP,
  RE_WORD_START, RE_UNICODE_SPACES,
  UNPAIRED_BRACKET_PROP, UNPAIRED_BRACKET_TYPST, UNPAIRED_BRACKET_TABLE_TYPST,
  FUNC_APPLY, INVISIBLE_TIMES, INVISIBLE_SEP, INVISIBLE_PLUS,
  MINUS_SIGN, PLUS_MINUS, MINUS_PLUS,
  SCRIPT_NODE_KINDS, TYPST_MATH_OPERATORS,
} from "../consts";
import {
  getNodeText, getChildText, getAttrs, getProp,
  isFirstChild, getSiblingIndex,
} from "../common";
import { findTypstSymbol, typstFontMap, typstSymbolMap } from "../typst-symbol-map";
import { TypstMathNode, TypstMathResult, ITypstMathSerializer } from "./types";
import { symbol, text, funcCall, num, operator, space, placeholder, posArg, mathVal, strVal, EMPTY_RESULT } from "./builders";

const INVISIBLE_CHARS: ReadonlySet<string> = new Set([
  FUNC_APPLY, INVISIBLE_TIMES, INVISIBLE_SEP, INVISIBLE_PLUS,
]);

const COMBINING_NOT_SLASH = '\u0338';

/** Precomposed characters with combining marks (ṭ, ñ, é) decompose into
 *  base + mark in NFD. Typst math can't shape them as single glyphs —
 *  they must be wrapped in text() ("ṭ") instead of bare symbol (ṭ). */
const hasCombiningMarks = (s: string): boolean =>
  s.normalize('NFD').length > s.length;

const stripCombiningNot = (value: string): [string, boolean] => {
  if (value.endsWith(COMBINING_NOT_SLASH)) {
    return [value.slice(0, -1), true];
  }
  return [value, false];
};

const BB_SHORTHAND_LETTERS: ReadonlySet<string> = new Set(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
);

const SPACED_OPERATORS: ReadonlySet<string> = new Set([
  '+', '-', '=', '<', '>', MINUS_SIGN, PLUS_MINUS, MINUS_PLUS,
]);

const MATHJAX_MULTIWORD_OPS: ReadonlyMap<string, string> = new Map([
  ['lim sup', 'limsup'],
  ['lim inf', 'liminf'],
]);

const MSPACE_WIDTH_MAP: ReadonlyMap<string, string | null> = new Map([
  ['2em', 'wide'],
  ['1em', 'quad'],
  ['0.2778em', 'thick'],
  ['0.278em', 'thick'],
  ['0.2222em', 'med'],
  ['0.222em', 'med'],
  ['0.1667em', 'thin'],
  ['0.167em', 'thin'],
  ['-0.1667em', null],
  ['-0.167em', null],
]);

const singleResult = (node: TypstMathNode): TypstMathResult => ({ node });

const isUnaryPrefix = (node: MathNode): boolean => {
  if (isFirstChild(node)) {
    return true;
  }
  const parent = node.parent;
  if (!parent) {
    return false;
  }
  const idx = getSiblingIndex(node);
  if (idx <= 0) {
    return false;
  }
  const prev = parent.childNodes[idx - 1];
  return !!prev && prev.kind === 'mo' && prev.texClass === TEXCLASS.OPEN;
};

const normalizeOperatorName = (value: string): string =>
  value.replace(RE_UNICODE_SPACES, ' ').trim();

const isWordLikeToken = (value: string): boolean =>
  value.length > 1 && RE_WORD_START.test(value);

const isInScriptContext = (node: MathNode): boolean =>
  !!node.parent && SCRIPT_NODE_KINDS.has(node.parent.kind);

export const mnAst = (node: MathNode, _serialize: ITypstMathSerializer): TypstMathResult => {
  const value = getNodeText(node);
  const attrs = getAttrs<FontAttrs>(node);
  const mathvariant = attrs.mathvariant || '';
  if (mathvariant && mathvariant !== 'normal') {
    const fontFn = typstFontMap.get(mathvariant);
    if (fontFn) {
      return singleResult(funcCall(fontFn, [posArg(mathVal(value ? num(value) : placeholder()))]));
    }
  }
  return singleResult(num(value));
};

export const mspaceAst = (node: MathNode, _serialize: ITypstMathSerializer): TypstMathResult => {
  const attrs = getAttrs<SpaceAttrs>(node);
  if (!attrs.width) {
    return EMPTY_RESULT;
  }
  const width = attrs.width.toString().trim();
  const mapped = MSPACE_WIDTH_MAP.get(width);
  if (mapped !== undefined) {
    if (mapped === null) {
      return EMPTY_RESULT;
    }
    return singleResult(space(mapped));
  }
  return singleResult(space(null));
};

export const miAst = (node: MathNode, _serialize: ITypstMathSerializer): TypstMathResult => {
  if (!node.childNodes || node.childNodes.length === 0) {
    return EMPTY_RESULT;
  }
  const rawValue = getNodeText(node);
  if (!rawValue) {
    return EMPTY_RESULT;
  }
  const [value, hasNot] = stripCombiningNot(rawValue);
  if (!value) {
    return EMPTY_RESULT;
  }
  const attrs = getAttrs<FontAttrs>(node);
  const mathvariant = attrs.mathvariant || '';
  const isKnownSymbol = typstSymbolMap.has(value);
  const isKnownOperator = TYPST_MATH_OPERATORS.has(value);
  const typstSymbol: string = findTypstSymbol(value);
  let result: TypstMathNode;
  // \operatorname{name}: texClass=OP, multi-char, not built-in
  if (node.texClass === TEXCLASS.OP && value.length > 1 && !isKnownOperator) {
    result = funcCall('op', [posArg(strVal(value))]);
  }
  // \mathrm{d} → dif
  else if (mathvariant === 'normal' && value === 'd' && !isKnownSymbol) {
    result = symbol('dif');
  }
  // \mathbb{R} → RR
  else if (mathvariant === 'double-struck' && value.length === 1 && BB_SHORTHAND_LETTERS.has(value)) {
    result = symbol(value + value);
  }
  // Font wrapping: bold("text"), italic(symbol), upright(bold("text")), etc.
  else if (
    mathvariant
    && mathvariant !== 'italic'
    && !isKnownOperator
    && (!isKnownSymbol || mathvariant === 'bold' || mathvariant === 'bold-italic')
    && !(isKnownSymbol && typstSymbol.startsWith('\\'))
  ) {
    const fontFn = typstFontMap.get(mathvariant);
    if (fontFn) {
      const useText = !isKnownSymbol
        && (value.length > 1 || hasCombiningMarks(value));
      const innerNode: TypstMathNode = useText
        ? text(value)
        : symbol(typstSymbol);
      if (mathvariant === 'bold' && !isKnownSymbol) {
        result = funcCall('upright', [posArg(mathVal(funcCall('bold', [posArg(mathVal(innerNode))])))]);
      } else {
        result = funcCall(fontFn, [posArg(mathVal(innerNode))]);
      }
    } else {
      result = !isKnownSymbol && hasCombiningMarks(value)
        ? text(value)
        : symbol(typstSymbol);
    }
  }
  else {
    result = !isKnownSymbol && hasCombiningMarks(value)
      ? text(value)
      : symbol(typstSymbol);
  }
  if (hasNot) {
    result = funcCall('cancel', [posArg(mathVal(result))]);
  }
  return singleResult(result);
};

export const moAst = (node: MathNode, _serialize: ITypstMathSerializer): TypstMathResult => {
  const rawValue = getNodeText(node);
  const [value, hasNot] = stripCombiningNot(rawValue);
  // Unpaired bracket — use symbol names in mat() context, escaped forms elsewhere
  const unpairedDir = getProp<string>(node, UNPAIRED_BRACKET_PROP);
  if (unpairedDir) {
    const isTableContext = unpairedDir.startsWith('table-');
    const mapping = isTableContext ? UNPAIRED_BRACKET_TABLE_TYPST : UNPAIRED_BRACKET_TYPST;
    if (mapping[value]) {
      let bracketNode: TypstMathNode = symbol(mapping[value]);
      if (hasNot) {
        bracketNode = funcCall('cancel', [posArg(mathVal(bracketNode))]);
      }
      return singleResult(bracketNode);
    }
  }
  if (INVISIBLE_CHARS.has(value)) return EMPTY_RESULT;
  const typstValue: string = findTypstSymbol(value);
  const normalizedName = normalizeOperatorName(value);
  // Multi-word operators: "lim sup" → "limsup"
  const mappedMultiword = MATHJAX_MULTIWORD_OPS.get(normalizedName);
  if (mappedMultiword) {
    let mwNode: TypstMathNode = symbol(mappedMultiword);
    if (hasNot) {
      mwNode = funcCall('cancel', [posArg(mathVal(mwNode))]);
    }
    return singleResult(mwNode);
  }
  // Named operators: multi-char non-builtin → op("name")
  if (
    isWordLikeToken(normalizedName)
    && !typstSymbolMap.has(value)
    && !TYPST_MATH_OPERATORS.has(normalizedName)
  ) {
    let opNode: TypstMathNode = funcCall('op', [posArg(strVal(normalizedName))]);
    if (hasNot) {
      opNode = funcCall('cancel', [posArg(mathVal(opNode))]);
    }
    return singleResult(opNode);
  }
  // Bare curly braces: \{ and \} produce mo({) and mo(}) without \left/\right.
  // Paired braces use escaped \{ \} so Typst treats them as delimiters (auto-scaling).
  // Unpaired braces use brace.l/brace.r (handled above via UNPAIRED_BRACKET_PROP).
  if (value === '{') {
    let braceNode: TypstMathNode = symbol('\\{');
    if (hasNot) {
      braceNode = funcCall('cancel', [posArg(mathVal(braceNode))]);
    }
    return singleResult(braceNode);
  }
  if (value === '}') {
    let braceNode: TypstMathNode = symbol('\\}');
    if (hasNot) {
      braceNode = funcCall('cancel', [posArg(mathVal(braceNode))]);
    }
    return singleResult(braceNode);
  }
  let result: TypstMathNode = symbol(typstValue);
  if (hasNot) {
    result = funcCall('cancel', [posArg(mathVal(result))]);
  }
  const inScript = isInScriptContext(node);
  // Spaced binary/unary operators: +, -, =, <, >, etc.
  if (!inScript && SPACED_OPERATORS.has(value)) {
    if (isUnaryPrefix(node)) {
      return singleResult(result);
    }
    const spacedOp = operator(typstValue, { spaced: true });
    return singleResult(hasNot ? funcCall('cancel', [posArg(mathVal(spacedOp))]) : spacedOp);
  }
  if (!inScript && value === ',') {
    return singleResult(operator(','));
  }
  // /, ;, " — OperatorNode, serializer escapes via OPERATOR_ESCAPE_MAP
  if (value === '/' || value === ';' || value === '"') {
    return singleResult(operator(value));
  }
  return singleResult(result);
};

export const mtextAst = (node: MathNode, _serialize: ITypstMathSerializer): TypstMathResult => {
  if (!node.childNodes || node.childNodes.length === 0) {
    return EMPTY_RESULT;
  }
  let value = getChildText(node);
  if (!value || !value.trim()) {
    return EMPTY_RESULT;
  }
  value = value.replace(RE_NBSP, ' ');
  if (value.length === 1 && typstSymbolMap.has(value)) {
    return singleResult(symbol(findTypstSymbol(value)));
  }
  const textNode: TypstMathNode = text(value, { preserveBackslash: true });
  const attrs = getAttrs<FontAttrs>(node);
  const mathvariant = attrs.mathvariant || '';
  if (mathvariant && mathvariant !== 'normal') {
    const fontFn = typstFontMap.get(mathvariant);
    if (fontFn) {
      return singleResult(funcCall(fontFn, [posArg(mathVal(textNode))]));
    }
  }
  return singleResult(textNode);
};
