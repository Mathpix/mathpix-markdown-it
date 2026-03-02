import { TEXCLASS } from "mathjax-full/js/core/MmlTree/MmlNode";
import {
  ITypstData, initTypstData, addToTypstData, addSpaceToTypstData,
  formatScript, isThousandSepComma, needsTokenSeparator, getNodeText,
  isFirstChild, isLastChild,
  RE_NBSP, RE_WORD_DOT_END, RE_WORD_DOT_START,
  RE_WORD_START, RE_OP_WRAPPER,
  RE_UNICODE_SPACES, RE_TRAILING_SPACING,
} from "./common";
import { findTypstSymbol, typstAccentMap, typstFontMap, typstSymbolMap } from "./typst-symbol-map";
import { escapeContentSeparators, hasTopLevelSeparators, escapeLrSemicolons, escapeUnbalancedParens } from "./escape-utils";
import {
  OPEN_BRACKETS, CLOSE_BRACKETS, UNPAIRED_BRACKET_TYPST, UNPAIRED_BRACKET_PROP,
  mapDelimiter, escapeLrOpenDelimiter,
} from "./bracket-utils";
import { mtable, mtr } from "./table-handlers";

const SHALLOW_TREE_MAX_DEPTH = 5;
const ANCESTOR_MAX_DEPTH = 10;
const MATHJAX_INHERIT_SENTINEL = '_inherit_';
const INVISIBLE_CHARS: Set<string> = new Set([
  '\u2061', // function application
  '\u2062', // invisible times
  '\u2063', // invisible separator
  '\u2064', // invisible plus
]);

const getAttributes = (node): any => {
  return node.attributes.getAllAttributes();
};

const defaultHandler = (node, serialize): ITypstData => {
  return handlerApi.handleAll(node, serialize);
};

const needsSpaceBefore = (node): boolean => {
  try {
    if (isFirstChild(node)) {
      return false;
    }
    const index = node.parent.childNodes.findIndex(item => item === node);
    const prev = node.parent.childNodes[index - 1];
    if (prev.kind === 'mi' || prev.kind === 'mo') {
      const text = (prev.childNodes[0] as any)?.text || '';
      const prevTypst = findTypstSymbol(text);
      return RE_WORD_DOT_END.test(prevTypst);
    }
    if (prev.kind === 'mn') {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};

const needsSpaceAfter = (node): boolean => {
  try {
    if (isLastChild(node)) {
      return false;
    }
    const parentKind = node.parent && (node.parent as any).kind;
    if (parentKind === 'msub' || parentKind === 'msup' || parentKind === 'msubsup'
      || parentKind === 'munderover' || parentKind === 'munder' || parentKind === 'mover') {
      return false;
    }
    const index = node.parent.childNodes.findIndex(item => item === node);
    let next = node.parent.childNodes[index + 1];
    // Skip invisible function application
    if (next && (next.childNodes[0] as any)?.text === '\u2061' && !isLastChild(next)) {
      next = node.parent.childNodes[index + 2];
    }
    if (next && (next.kind === 'mi' || next.kind === 'mo')) {
      const text = (next.childNodes[0] as any)?.text || '';
      const nextTypst = findTypstSymbol(text);
      return RE_WORD_DOT_START.test(nextTypst);
    }
    if (next && next.kind === 'mn') {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};

// Built-in Typst math operators — should NOT be wrapped in upright()
const TYPST_MATH_OPERATORS: Set<string> = new Set([
  'sin', 'cos', 'tan', 'cot', 'sec', 'csc',
  'arcsin', 'arccos', 'arctan',
  'sinh', 'cosh', 'tanh', 'coth',
  'exp', 'log', 'ln', 'lg',
  'det', 'dim', 'gcd', 'mod',
  'inf', 'sup', 'lim', 'liminf', 'limsup',
  'max', 'min', 'arg', 'deg', 'hom', 'ker',
  'Pr', 'tr',
]);

const BB_SHORTHAND_LETTERS: Set<string> = new Set(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
);

// --- MI handler: identifiers ---
const mi = () => {
  return (node, _serialize): ITypstData => {
    let res: ITypstData = initTypstData();
    try {
      if (!node.childNodes || node.childNodes.length === 0) {
        return res;
      }
      const firstChild: any = node.childNodes[0];
      const value: string = firstChild.text;
      if (!value) {
        return res;
      }
      const atr = getAttributes(node);
      const mathvariant: string = atr?.mathvariant || '';
      const isKnownSymbol = typstSymbolMap.has(value);
      const isKnownOperator = TYPST_MATH_OPERATORS.has(value);
      let typstValue: string = findTypstSymbol(value);
      // \operatorname{name}: texClass=OP, multi-char, not built-in
      // Don't add limits: #true here — parent handler (munderover/munder/mover) decides placement.
      if (node.texClass === TEXCLASS.OP && value.length > 1 && !isKnownOperator) {
        typstValue = 'op("' + value + '")';
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
          const inner = value.length > 1 && !isKnownSymbol ? '"' + value + '"' : typstValue;
          // \mathbf produces mathvariant="bold" which is upright bold in LaTeX
          if (mathvariant === 'bold' && !isKnownSymbol) {
            typstValue = 'upright(bold(' + inner + '))';
          } else {
            typstValue = fontFn + '(' + inner + ')';
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
    } catch (e) {
      return res;
    }
  };
};

// Operators that should have spaces around them for readability
const SPACED_OPERATORS: Set<string> = new Set([
  '+', '-', '=', '<', '>', '\u2212', // minus sign
  '\u00B1', // ±
  '\u2213', // ∓
]);

// --- MO handler: operators ---
const mo = () => {
  return (node, _serialize): ITypstData => {
    let res: ITypstData = initTypstData();
    try {
      const value = getNodeText(node);
      const unpairedDir = node.properties?.[UNPAIRED_BRACKET_PROP];
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
      if (value.length > 1 && RE_WORD_START.test(value) && !typstSymbolMap.has(value) && !TYPST_MATH_OPERATORS.has(value)) {
        const opName = normalizedValue;
        res = addToTypstData(res, { typst: 'op("' + opName + '")' });
        return res;
      }
      // Check if this operator is inside sub/sup/munderover — no spacing there
      const parentKind = node.parent?.kind;
      const inScript = parentKind === 'msub' || parentKind === 'msup'
        || parentKind === 'msubsup' || parentKind === 'munderover';
      if (typstValue.length > 1 && RE_WORD_START.test(typstValue)) {
        const spaceBefore = needsSpaceBefore(node) ? ' ' : '';
        let spaceAfter = needsSpaceAfter(node) ? ' ' : '';
        // Prevent Typst from interpreting "symbol(" as a function call
        // (e.g. "lt.eq(x)" would call lt.eq as a function)
        if (!spaceAfter && !inScript) {
          try {
            const idx = node.parent.childNodes.findIndex(item => item === node);
            const next = node.parent.childNodes[idx + 1];
            if (next && next.kind === 'mo') {
              const nt = getNodeText(next);
              if (nt === '(' || nt === '[') spaceAfter = ' ';
            }
          } catch (_e) { /* ignore */ }
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
    } catch (e) {
      return res;
    }
  };
};

// --- MN handler: numbers ---
const mn = () => {
  return (node, _serialize): ITypstData => {
    let res: ITypstData = initTypstData();
    try {
      const value = getNodeText(node);
      const atr = getAttributes(node);
      const mathvariant: string = atr?.mathvariant || '';
      if (mathvariant && mathvariant !== 'normal') {
        const fontFn = typstFontMap.get(mathvariant);
        if (fontFn) {
          const content = escapeContentSeparators(value) || '""';
          res = addToTypstData(res, { typst: fontFn + '(' + content + ')' });
          return res;
        }
      }
      res = addToTypstData(res, { typst: value });
      return res;
    } catch (e) {
      return res;
    }
  };
};

// --- MTEXT handler: text content ---
const mtext = () => {
  return (node, _serialize): ITypstData => {
    let res: ITypstData = initTypstData();
    try {
      if (!node.childNodes || node.childNodes.length === 0) {
        return res;
      }
      const firstChild: any = node.childNodes[0];
      let value: string = firstChild.text;
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
      let textContent = '"' + value.replace(/"/g, '\\"') + '"';
      const atr = getAttributes(node);
      const mathvariant: string = atr?.mathvariant || '';
      if (mathvariant && mathvariant !== 'normal') {
        const fontFn = typstFontMap.get(mathvariant);
        if (fontFn) {
          textContent = fontFn + '(' + textContent + ')';
        }
      }
      res = addToTypstData(res, { typst: textContent });
      return res;
    } catch (e) {
      return res;
    }
  };
};

// --- MFRAC handler: fractions ---
const mfrac = () => {
  return (node, serialize): ITypstData => {
    let res: ITypstData = initTypstData();
    try {
      const firstChild = node.childNodes[0] || null;
      const secondChild = node.childNodes[1] || null;
      const dataFirst: ITypstData = firstChild ? serialize.visitNode(firstChild, '') : initTypstData();
      const dataSecond: ITypstData = secondChild ? serialize.visitNode(secondChild, '') : initTypstData();
      const num = escapeContentSeparators(dataFirst.typst.trim()) || '""';
      const den = escapeContentSeparators(dataSecond.typst.trim()) || '""';
      // Check for linethickness=0 which indicates \binom (\choose)
      const atr = getAttributes(node);
      if (atr && (atr.linethickness === '0' || atr.linethickness === 0)) {
        res = addToTypstData(res, { typst: 'binom(' + num + ', ' + den + ')' });
      } else {
        res = addToTypstData(res, { typst: 'frac(' + num + ', ' + den + ')' });
      }
      return res;
    } catch (e) {
      return res;
    }
  };
};

// Prime symbol → Typst ' shorthand mapping
const PRIME_SHORTHANDS: Map<string, string> = new Map([
  ['prime', "'"],
  ['prime.double', "''"],
  ['prime.triple', "'''"],
]);

// Regex to detect overbrace/overbracket/underbrace/underbracket as outermost call
const BRACE_ANNOTATION_RE = /^(overbrace|overbracket|underbrace|underbracket)\((.+)\)$/s;
const RE_SPECIAL_FN_CALL = /^(overbrace|underbrace|overline|underline|op)\(/;

/** Match a brace annotation (overbrace/underbrace/etc.) and return it with annotation as second argument.
 *  Returns null if baseTrimmed doesn't match any of the specified kinds. */
const matchBraceAnnotation = (
  baseTrimmed: string, annotation: string,
  kinds: ('overbrace' | 'overbracket' | 'underbrace' | 'underbracket')[]
): ITypstData | null => {
  const m = BRACE_ANNOTATION_RE.exec(baseTrimmed);
  if (!m || !kinds.includes(m[1] as any)) return null;
  return { typst: m[1] + '(' + m[2] + ', ' + escapeContentSeparators(annotation) + ')' };
};

// --- MSUP handler: superscripts ---
const msup = () => {
  return (node, serialize): ITypstData => {
    let res: ITypstData = initTypstData();
    try {
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
        res = addToTypstData(res, { typst: 'scripts(' + escapeContentSeparators(baseTrimmed) + ')' });
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
    } catch (e) {
      return res;
    }
  };
};

// --- MSUB handler: subscripts ---
const msub = () => {
  return (node, serialize): ITypstData => {
    let res: ITypstData = initTypstData();
    try {
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
        res = addToTypstData(res, { typst: 'scripts(' + escapeContentSeparators(baseTrimmed) + ')' });
      } else {
        res = addToTypstData(res, { typst: baseTrimmed ? base : '""' });
      }
      // Skip empty subscript (e.g. LaTeX m_{} → just "m")
      if (sub) {
        res = addToTypstData(res, { typst: formatScript('_', sub) });
      }
      return res;
    } catch (e) {
      return res;
    }
  };
};

// --- MSUBSUP handler: combined subscript+superscript ---
const msubsup = () => {
  return (node, serialize): ITypstData => {
    let res: ITypstData = initTypstData();
    try {
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
        res = addToTypstData(res, { typst: 'scripts(' + escapeContentSeparators(baseTrimmed) + ')' });
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
    } catch (e) {
      return res;
    }
  };
};

// --- MSQRT handler: square root ---
const msqrt = () => {
  return (node, serialize): ITypstData => {
    let res: ITypstData = initTypstData();
    try {
      const firstChild = node.childNodes[0] || null;
      const dataFirst: ITypstData = firstChild ? serialize.visitNode(firstChild, '') : initTypstData();
      const content = escapeContentSeparators(dataFirst.typst.trim()) || '""';
      res = addToTypstData(res, { typst: 'sqrt(' + content + ')' });
      return res;
    } catch (e) {
      return res;
    }
  };
};

// --- MROOT handler: nth root ---
const mroot = () => {
  return (node, serialize): ITypstData => {
    let res: ITypstData = initTypstData();
    try {
      // MathML mroot: child[0] = radicand, child[1] = index
      const radicand = node.childNodes[0] || null;
      const index = node.childNodes[1] || null;
      const dataRadicand: ITypstData = radicand ? serialize.visitNode(radicand, '') : initTypstData();
      const dataIndex: ITypstData = index ? serialize.visitNode(index, '') : initTypstData();
      const radicandContent = escapeContentSeparators(dataRadicand.typst.trim()) || '""';
      // Typst root: root(index, radicand)
      res = addToTypstData(res, {
        typst: 'root(' + escapeContentSeparators(dataIndex.typst.trim()) + ', ' + radicandContent + ')'
      });
      return res;
    } catch (e) {
      return res;
    }
  };
};

// Multi-word MathJax operator names → Typst built-in operator names.
// MathJax uses thin space (U+2006) between words; we normalize before lookup.
const MATHJAX_MULTIWORD_OPS: Map<string, string> = new Map([
  ['lim sup', 'limsup'],
  ['lim inf', 'liminf'],
]);

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

/** Get movablelimits attribute from a node (typically the base mo of munderover) */
const getMovablelimits = (node: any): boolean | undefined => {
  if (!node || node.kind !== 'mo') return undefined;
  try {
    const atr = getAttributes(node);
    return atr?.movablelimits;
  } catch (e) {
    return undefined;
  }
};

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

/** Build limit-placement base, returns different block/inline bases for movablelimits. */
const buildLimitBase = (firstChild: any, baseTrimmed: string, base: string): ITypstData => {
  const movablelimits = getMovablelimits(firstChild);
  const baseIsCustomOp = RE_OP_WRAPPER.test(baseTrimmed);
  // Extensible arrows/symbols: MathJax sets stretchy=true on the base mo.
  // Use stretch() for these (e.g. \xrightarrow), limits() for stacking (\stackrel, \overset).
  let isStretchy = false;
  if (STRETCH_BASE_SYMBOLS.has(baseTrimmed)) {
    // Find the inner mo node — MathJax may wrap in mstyle/inferredMrow
    let moNode = firstChild;
    for (let i = 0; i < SHALLOW_TREE_MAX_DEPTH && moNode && moNode.kind !== 'mo'; i++) {
      if (moNode.childNodes?.length === 1) {
        moNode = moNode.childNodes[0];
      } else {
        break;
      }
    }
    if (moNode?.kind === 'mo') {
      try {
        const atr = getAttributes(moNode);
        isStretchy = atr?.stretchy === true;
      } catch (e) { /* ignore */ }
    }
  }
  const wrapper = isStretchy ? 'stretch' : 'limits';
  if (movablelimits === true) {
    // Default placement — above/below in display, side in inline.
    if (baseIsCustomOp) {
      // Custom op: display uses limits: #true for above/below; inline omits it for side placement
      return { typst: baseTrimmed.replace(/\)$/, ', limits: #true)'), typst_inline: base };
    }
    // Check if Typst operator natively places limits above/below in display mode.
    // If yes (e.g. sum), Typst already handles movablelimits — same for both modes.
    if (TYPST_DISPLAY_LIMIT_OPS.has(baseTrimmed)) {
      return { typst: base };
    }
    // Operator doesn't natively place limits above/below (e.g. \intop → integral).
    // Block: limits()/stretch() to force above/below; inline: bare operator for side placement.
    return { typst: wrapper + '(' + escapeContentSeparators(baseTrimmed) + ')', typst_inline: base };
  } else if (movablelimits === false) {
    // Explicit \limits — force below/above placement in both modes
    return { typst: wrapper + '(' + escapeContentSeparators(baseTrimmed) + ')' };
  } else {
    // Non-mo base (mrow, etc.) — use existing logic
    const baseIsNativeLimitOp = TYPST_DISPLAY_LIMIT_OPS.has(baseTrimmed);
    // OP-class base with op() output — two cases:
    if (RE_OP_WRAPPER.test(baseTrimmed) && firstChild?.texClass === TEXCLASS.OP) {
      if (firstChild?.kind === 'TeXAtom') {
        // TeXAtom(OP): \varinjlim, \varliminf, etc. — same as movablelimits custom op
        return { typst: baseTrimmed.replace(/\)$/, ', limits: #true)'), typst_inline: base };
      }
      // mi(OP): \operatorname*{name} — add limits: #true inside op()
      return { typst: baseTrimmed.replace(/\)$/, ', limits: #true)') };
    }
    const baseIsSpecialFn = RE_SPECIAL_FN_CALL.test(baseTrimmed);
    if (baseIsNativeLimitOp || baseIsSpecialFn) {
      return { typst: base };
    }
    return { typst: wrapper + '(' + escapeContentSeparators(baseTrimmed) + ')' };
  }
};

/** Check if base should use scripts() wrapper (\nolimits in display mode) */
const needsScriptsWrapper = (baseTrimmed: string): boolean => {
  return TYPST_DISPLAY_LIMIT_OPS.has(baseTrimmed);
};

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

// --- MOVER handler: accents and overbrace ---
const mover = () => {
  return (node, serialize): ITypstData => {
    let res: ITypstData = initTypstData();
    try {
      const firstChild = node.childNodes[0] || null;
      const secondChild = node.childNodes[1] || null;
      const dataFirst: ITypstData = firstChild ? serialize.visitNode(firstChild, '') : initTypstData();
      const dataSecond: ITypstData = secondChild ? serialize.visitNode(secondChild, '') : initTypstData();
      // Detect \varlimsup pattern: mover(mi("lim"), mo("―")) → op(overline(lim))
      if (firstChild?.kind === 'mi' && secondChild?.kind === 'mo') {
        const baseText = getNodeText(firstChild);
        const overChar = getNodeText(secondChild);
        if (baseText === 'lim' && overChar === '\u2015') {
          res = addToTypstData(res, { typst: 'op(overline(lim))' });
          return res;
        }
      }
      if (secondChild && secondChild.kind === 'mo') {
        const accentChar = getNodeText(secondChild);
        const accentFn = typstAccentMap.get(accentChar);
        if (accentFn) {
          const content = escapeContentSeparators(dataFirst.typst.trim()) || '""';
          if (TYPST_ACCENT_SHORTHANDS.has(accentFn)) {
            res = addToTypstData(res, { typst: accentFn + '(' + content + ')' });
          } else {
            res = addToTypstData(res, { typst: 'accent(' + content + ', ' + accentFn + ')' });
          }
          return res;
        }
      }
      const baseTrimmed = dataFirst.typst.trim() || '""';
      const over = dataSecond.typst.trim();
      if (over) {
        const braceRes = matchBraceAnnotation(baseTrimmed, over, ['overbrace', 'overbracket']);
        if (braceRes) { res = addToTypstData(res, braceRes); return res; }
        const baseData = buildLimitBase(firstChild, baseTrimmed, dataFirst.typst);
        res = addToTypstData(res, baseData);
        res = addToTypstData(res, { typst: formatScript('^', over) });
      } else {
        res = addToTypstData(res, { typst: baseTrimmed });
      }
      return res;
    } catch (e) {
      return res;
    }
  };
};

// --- MUNDER handler: under-accents and underbrace ---
const munder = () => {
  return (node, serialize): ITypstData => {
    let res: ITypstData = initTypstData();
    try {
      const firstChild = node.childNodes[0] || null;
      const secondChild = node.childNodes[1] || null;
      const dataFirst: ITypstData = firstChild ? serialize.visitNode(firstChild, '') : initTypstData();
      const dataSecond: ITypstData = secondChild ? serialize.visitNode(secondChild, '') : initTypstData();
      // Detect \varinjlim / \varprojlim / \varliminf patterns: munder(mi("lim"), mo(...))
      // Map to equivalent Typst operators (losing the visual decoration).
      if (firstChild?.kind === 'mi' && secondChild?.kind === 'mo') {
        const baseText = getNodeText(firstChild);
        const underChar = getNodeText(secondChild);
        if (baseText === 'lim' && underChar === '\u2192') {        // → below lim
          res = addToTypstData(res, { typst: 'op("inj lim")' });
          return res;
        }
        if (baseText === 'lim' && underChar === '\u2190') {        // ← below lim
          res = addToTypstData(res, { typst: 'op("proj lim")' });
          return res;
        }
        if (baseText === 'lim' && underChar === '\u2015') {        // ― below lim (\varliminf)
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
          const content = escapeContentSeparators(dataFirst.typst.trim()) || '""';
          // Arrows/harpoons have no under-variant in Typst — use attach(base, b: symbol)
          const underSymbol = MUNDER_ATTACH_SYMBOLS.get(accentFn);
          if (underSymbol) {
            res = addToTypstData(res, { typst: 'attach(' + content + ', b: ' + underSymbol + ')' });
            return res;
          }
          if (TYPST_ACCENT_SHORTHANDS.has(accentFn)) {
            res = addToTypstData(res, { typst: accentFn + '(' + content + ')' });
          } else {
            res = addToTypstData(res, { typst: 'accent(' + content + ', ' + accentFn + ')' });
          }
          return res;
        }
      }
      const baseTrimmed = dataFirst.typst.trim() || '""';
      const under = dataSecond.typst.trim();
      if (under) {
        const braceRes = matchBraceAnnotation(baseTrimmed, under, ['underbrace', 'underbracket']);
        if (braceRes) { res = addToTypstData(res, braceRes); return res; }
        const baseData = buildLimitBase(firstChild, baseTrimmed, dataFirst.typst);
        res = addToTypstData(res, baseData);
        res = addToTypstData(res, { typst: formatScript('_', under) });
      } else {
        res = addToTypstData(res, { typst: baseTrimmed });
      }
      return res;
    } catch (e) {
      return res;
    }
  };
};

// --- MUNDEROVER handler: combined under+over (e.g. sum with limits) ---
const munderover = () => {
  return (node, serialize): ITypstData => {
    let res: ITypstData = initTypstData();
    try {
      const firstChild = node.childNodes[0] || null;
      const secondChild = node.childNodes[1] || null;
      const thirdChild = node.childNodes[2] || null;
      const dataFirst: ITypstData = firstChild ? serialize.visitNode(firstChild, '') : initTypstData();
      const dataSecond: ITypstData = secondChild ? serialize.visitNode(secondChild, '') : initTypstData();
      const dataThird: ITypstData = thirdChild ? serialize.visitNode(thirdChild, '') : initTypstData();
      const under = dataSecond.typst.trim();
      const over = dataThird.typst.trim();
      // Use movablelimits to decide between default placement and limits() wrapping
      const baseTrimmed = dataFirst.typst.trim() || '""';
      const baseData = buildLimitBase(firstChild, baseTrimmed, dataFirst.typst);
      res = addToTypstData(res, baseData);
      if (under) {
        res = addToTypstData(res, { typst: formatScript('_', under) });
      }
      if (over) {
        res = addToTypstData(res, { typst: formatScript('^', over) });
      }
      return res;
    } catch (e) {
      return res;
    }
  };
};

// --- MMULTISCRIPTS handler: pre/post scripts via attach() ---
const mmultiscripts = () => {
  return (node, serialize): ITypstData => {
    let res: ITypstData = initTypstData();
    try {
      if (!node.childNodes || node.childNodes.length === 0) return res;
      // Parse mmultiscripts structure:
      // child[0] = base
      // child[1..prescriptsIdx-1] = post-scripts (pairs of sub, sup)
      // child[prescriptsIdx] = mprescripts
      // child[prescriptsIdx+1..] = pre-scripts (pairs of sub, sup)
      const base = node.childNodes[0];
      const baseData: ITypstData = serialize.visitNode(base, '');
      const baseTrimmed = baseData.typst.trim() || '""';
      let prescriptsIdx = -1;
      for (let i = 1; i < node.childNodes.length; i++) {
        if (node.childNodes[i].kind === 'mprescripts') {
          prescriptsIdx = i;
          break;
        }
      }
      // Collect post-scripts (pairs after base, before mprescripts)
      const postEnd = prescriptsIdx >= 0 ? prescriptsIdx : node.childNodes.length;
      let postSub = '';
      let postSup = '';
      for (let i = 1; i < postEnd; i += 2) {
        const subNode = node.childNodes[i];
        const supNode = node.childNodes[i + 1] || null;
        if (subNode && subNode.kind !== 'none') {
          const d: ITypstData = serialize.visitNode(subNode, '');
          if (d.typst.trim()) postSub = d.typst.trim();
        }
        if (supNode && supNode.kind !== 'none') {
          const d: ITypstData = serialize.visitNode(supNode, '');
          if (d.typst.trim()) postSup = d.typst.trim();
        }
      }
      // Collect pre-scripts (pairs after mprescripts)
      let preSub = '';
      let preSup = '';
      if (prescriptsIdx >= 0) {
        for (let i = prescriptsIdx + 1; i < node.childNodes.length; i += 2) {
          const subNode = node.childNodes[i];
          const supNode = node.childNodes[i + 1] || null;
          if (subNode && subNode.kind !== 'none') {
            const d: ITypstData = serialize.visitNode(subNode, '');
            if (d.typst.trim()) preSub = d.typst.trim();
          }
          if (supNode && supNode.kind !== 'none') {
            const d: ITypstData = serialize.visitNode(supNode, '');
            if (d.typst.trim()) preSup = d.typst.trim();
          }
        }
      }
      const hasPrescripts = preSub || preSup;
      if (!hasPrescripts) {
        // No prescripts — use simple base_sub^sup syntax
        res = addToTypstData(res, { typst: baseTrimmed });
        if (postSub) {
          res = addToTypstData(res, { typst: formatScript('_', postSub) });
        }
        if (postSup) {
          res = addToTypstData(res, { typst: formatScript('^', postSup) });
        }
      } else {
        // Has prescripts — use attach(base, tl:, bl:, t:, b:)
        const parts: string[] = [];
        if (preSup) parts.push('tl: ' + preSup);
        if (preSub) parts.push('bl: ' + preSub);
        if (postSup) parts.push('t: ' + postSup);
        if (postSub) parts.push('b: ' + postSub);
        res = addToTypstData(res, {
          typst: 'attach(' + escapeContentSeparators(baseTrimmed) + ', ' + parts.join(', ') + ')'
        });
      }
      return res;
    } catch (e) {
      return res;
    }
  };
};

// MathML spacing widths → Typst spacing keywords
const MSPACE_WIDTH_MAP: Record<string, string> = {
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

const mspace = () => {
  return (node, _serialize): ITypstData => {
    let res: ITypstData = initTypstData();
    try {
      const atr = getAttributes(node);
      if (!atr || !atr.width) {
        return res;
      }
      const width: string = atr.width.toString();
      const mapped = MSPACE_WIDTH_MAP[width];
      if (mapped !== undefined) {
        if (mapped) res = addToTypstData(res, { typst: mapped });
        return res;
      }
      res = addToTypstData(res, { typst: ' ' });
      return res;
    } catch (e) {
      return res;
    }
  };
};

// --- MROW handler: grouped content, lr() for \left...\right ---
const mrow = () => {
  return (node, serialize): ITypstData => {
    let res: ITypstData = initTypstData();
    try {
      const props = node.properties || {};
      const hasOpen = props.hasOwnProperty('open');
      const hasClose = props.hasOwnProperty('close');
      const openDelim = hasOpen ? props['open'] : '';
      const closeDelim = hasClose ? props['close'] : '';
      // Check if this mrow has \left...\right delimiters
      const isLeftRight = (hasOpen || hasClose)
        && props.texClass === TEXCLASS.INNER;
      // If this mrow wraps a matrix, let mtable handle the delimiters
      const hasTableChild = node.childNodes.some(child => child.kind === 'mtable');
      if (isLeftRight && !hasTableChild) {
        // Serialize inner children, skipping the delimiter mo nodes
        // (delimiters are reconstructed from the open/close properties)
        let content = '';
        for (let i = 0; i < node.childNodes.length; i++) {
          const child = node.childNodes[i];
          // Skip opening delimiter mo (first child matching open property)
          if (i === 0 && child.kind === 'mo') {
            const moText = getNodeText(child);
            if (moText === openDelim || (!moText && !openDelim)) {
              continue;
            }
          }
          // Skip closing delimiter mo (last child matching close property)
          if (i === node.childNodes.length - 1 && child.kind === 'mo') {
            const moText = getNodeText(child);
            if (moText === closeDelim || (!moText && !closeDelim)) {
              continue;
            }
          }
          const data: ITypstData = serialize.visitNode(child, '');
          if (needsTokenSeparator(content, data.typst)) {
            content += ' ';
          }
          content += data.typst;
        }
        const open = openDelim ? mapDelimiter(openDelim) : '';
        const close = closeDelim ? mapDelimiter(closeDelim) : '';
        const hasVisibleOpen = !!open;
        const hasVisibleClose = !!close;
        if (hasVisibleOpen && hasVisibleClose) {
          const trimmedContent = content.trim();
          // Optimize common delimiter pairs to Typst shorthand functions,
          // but fall back to lr() when content has top-level , or ;
          // (these would be parsed as argument/row separators inside a function call).
          const hasSep = hasTopLevelSeparators(trimmedContent);
          if (openDelim === '|' && closeDelim === '|') {
            res = addToTypstData(res, { typst: hasSep
              ? 'lr(| ' + escapeLrSemicolons(trimmedContent) + ' |)'
              : 'abs(' + trimmedContent + ')' });
          } else if (openDelim === '\u2016' && closeDelim === '\u2016') {
            // ‖...‖ → norm() or lr(‖ ... ‖)
            res = addToTypstData(res, { typst: hasSep
              ? 'lr(‖ ' + escapeLrSemicolons(trimmedContent) + ' ‖)'
              : 'norm(' + trimmedContent + ')' });
          } else if (openDelim === '\u230A' && closeDelim === '\u230B') {
            // ⌊...⌋ → floor() or lr(⌊ ... ⌋)
            res = addToTypstData(res, { typst: hasSep
              ? 'lr(⌊ ' + escapeLrSemicolons(trimmedContent) + ' ⌋)'
              : 'floor(' + trimmedContent + ')' });
          } else if (openDelim === '\u2308' && closeDelim === '\u2309') {
            // ⌈...⌉ → ceil() or lr(⌈ ... ⌉)
            res = addToTypstData(res, { typst: hasSep
              ? 'lr(⌈ ' + escapeLrSemicolons(trimmedContent) + ' ⌉)'
              : 'ceil(' + trimmedContent + ')' });
          } else {
            // Mismatched ASCII brackets must be escaped: ( [ { start groups, ) closes lr()
            const escapedOpen = (openDelim in OPEN_BRACKETS && OPEN_BRACKETS[openDelim] !== closeDelim)
              ? '\\' + openDelim : open;
            const escapedClose = (closeDelim in CLOSE_BRACKETS && CLOSE_BRACKETS[closeDelim] !== openDelim)
              ? '\\' + closeDelim : close;
            res = addToTypstData(res, { typst: 'lr(' + escapedOpen + ' ' + escapeLrSemicolons(trimmedContent) + ' ' + escapedClose + ')' });
          }
        } else {
          // One or both delimiters invisible: wrap visible side in lr()
          const trimmed = content.trim();
          const openEsc = openDelim ? escapeLrOpenDelimiter(openDelim) : '';
          const closeEsc = closeDelim ? escapeLrOpenDelimiter(closeDelim) : '';
          if (openEsc) {
            res = addToTypstData(res, { typst: 'lr(' + openEsc + ' ' + escapeLrSemicolons(trimmed) + ')' });
          } else if (closeEsc) {
            res = addToTypstData(res, { typst: 'lr(' + escapeLrSemicolons(trimmed) + ' ' + closeEsc + ')' });
          } else {
            res = addToTypstData(res, { typst: trimmed });
          }
        }
      } else if (isLeftRight && hasTableChild) {
        // Matrix/cases inside \left...\right: skip delimiter mo children
        // (the mtable handler uses the parent mrow's open/close properties for delimiters)
        for (let i = 0; i < node.childNodes.length; i++) {
          const child = node.childNodes[i];
          if (i === 0 && child.kind === 'mo') {
            const moText = getNodeText(child);
            if (moText === openDelim || (!moText && !openDelim)) { continue; }
          }
          if (i === node.childNodes.length - 1 && child.kind === 'mo') {
            const moText = getNodeText(child);
            if (moText === closeDelim || (!moText && !closeDelim)) { continue; }
          }
          const data: ITypstData = serialize.visitNode(child, '');
          res = addToTypstData(res, data);
        }
      } else {
        // Check for OPEN/CLOSE mrow pattern wrapping a binom
        // MathJax represents \binom{n}{k} as mrow(ORD) > [mrow(OPEN), mfrac(linethickness=0), mrow(CLOSE)]
        // Since binom() in Typst already includes parens, skip the delimiter mrows
        if (node.childNodes.length === 3) {
          const first = node.childNodes[0];
          const middle = node.childNodes[1];
          const last = node.childNodes[2];
          if (middle.kind === 'mfrac') {
            const midAtr = getAttributes(middle);
            if (midAtr && (midAtr.linethickness === '0' || midAtr.linethickness === 0)
              && first.texClass === TEXCLASS.OPEN
              && last.texClass === TEXCLASS.CLOSE) {
              const data: ITypstData = serialize.visitNode(middle, '');
              res = addToTypstData(res, data);
              return res;
            }
          }
        }
        // Regular mrow: concatenate children with spacing to prevent merging
        for (let i = 0; i < node.childNodes.length; i++) {
          // Thousand-separator chain: mn","mn","mn... (handles 41,70,000 and 1,000,000)
          if (isThousandSepComma(node, i)) {
            const numData: ITypstData = serialize.visitNode(node.childNodes[i], '');
            if (needsTokenSeparator(res.typst, numData.typst)) {
              addSpaceToTypstData(res);
            }
            let chainTypst = numData.typst;
            let j = i;
            while (isThousandSepComma(node, j)) {
              const nextData: ITypstData = serialize.visitNode(node.childNodes[j + 2], '');
              chainTypst += '\\,' + nextData.typst;
              j += 2;
            }
            res = addToTypstData(res, { typst: chainTypst });
            i = j;
            continue;
          }
          const data: ITypstData = serialize.visitNode(node.childNodes[i], '');
          if (needsTokenSeparator(res.typst, data.typst)) {
            addSpaceToTypstData(res);
          }
          res = addToTypstData(res, data);
        }
      }
      return res;
    } catch (e) {
      return res;
    }
  };
};

/** Check if a node subtree contains an mphantom (shallow — up to 5 levels). */
const hasPhantomChild = (node: any): boolean => {
  const check = (n: any, depth: number): boolean => {
    if (!n || depth > SHALLOW_TREE_MAX_DEPTH) return false;
    if (n.kind === 'mphantom') return true;
    if (n.childNodes) {
      for (const c of n.childNodes) {
        if (check(c, depth + 1)) return true;
      }
    }
    return false;
  };
  return check(node, 0);
};

/** Check if node has an msub/msup/msubsup/mmultiscripts ancestor (mhchem alignment pattern). */
const hasScriptAncestor = (node: any): boolean => {
  let cur = node?.parent;
  while (cur) {
    const k = cur.kind;
    if (k === 'msub' || k === 'msup' || k === 'msubsup' || k === 'mmultiscripts') return true;
    cur = cur.parent;
  }
  return false;
};

// --- MPADDED handler: strip padding, emit content ---
const mpadded = () => {
  return (node, serialize): ITypstData => {
    let res: ITypstData = initTypstData();
    try {
      const atr = getAttributes(node);
      // mhchem alignment phantom: mpadded width=0 or height=0 containing mphantom
      // inside msub/msup/msubsup — zero-size alignment box, emit empty string.
      // Only skip inside script ancestors; standalone \hphantom/\vphantom must still produce #hide().
      if ((atr?.width === 0 || atr?.height === 0) && hasPhantomChild(node) && hasScriptAncestor(node)) {
        return res;
      }
      const data: ITypstData = handlerApi.handleAll(node, serialize);
      const content = data.typst.trim();
      // Handle mathbackground attribute (\colorbox{color}{...})
      const rawBg: string = atr?.mathbackground || '';
      const mathbg: string = rawBg && rawBg !== MATHJAX_INHERIT_SENTINEL ? rawBg : '';
      if (mathbg && content) {
        const fillValue = mathbg.startsWith('#')
          ? 'rgb("' + mathbg + '")'
          : mathbg;
        res = addToTypstData(res, {
          typst: '#highlight(fill: ' + fillValue + ')[$' + content + '$]',
          typst_inline: content
        });
        return res;
      }
      res = addToTypstData(res, data);
      return res;
    } catch (e) {
      return res;
    }
  };
};

// --- MPHANTOM handler: \phantom → hide() ---
const mphantom = () => {
  return (node, serialize): ITypstData => {
    let res: ITypstData = initTypstData();
    try {
      const data: ITypstData = handlerApi.handleAll(node, serialize);
      const content = data.typst.trim();
      if (content) {
        res = addToTypstData(res, { typst: '#hide($' + content + '$)' });
      }
      return res;
    } catch (e) {
      return res;
    }
  };
};

// --- MENCLOSE handler: cancel, strikethrough ---
const menclose = () => {
  return (node, serialize): ITypstData => {
    let res: ITypstData = initTypstData();
    try {
      const atr = getAttributes(node);
      const notation: string = atr?.notation?.toString() || '';
      const data: ITypstData = handlerApi.handleAll(node, serialize);
      const content = data.typst.trim() || '""';
      if (notation.includes('box')) {
        // \boxed → #box with stroke
        res = addToTypstData(res, { typst: '#box(stroke: 0.5pt, inset: 3pt, $' + content + '$)', typst_inline: content });
      } else if (notation.includes('updiagonalstrike') || notation.includes('downdiagonalstrike')) {
        // \cancel uses updiagonalstrike (lower-left to upper-right) → Typst cancel() default
        // \bcancel uses downdiagonalstrike (upper-left to lower-right) → Typst cancel(inverted: true)
        if (notation.includes('downdiagonalstrike') && !notation.includes('updiagonalstrike')) {
          res = addToTypstData(res, { typst: 'cancel(inverted: #true, ' + escapeContentSeparators(content) + ')' });
        } else {
          res = addToTypstData(res, { typst: 'cancel(' + escapeContentSeparators(content) + ')' });
        }
      } else if (notation.includes('horizontalstrike')) {
        res = addToTypstData(res, { typst: 'cancel(' + escapeContentSeparators(content) + ')' });
      } else if (notation.includes('longdiv')) {
        // \longdiv / \enclose{longdiv} → overline(")" content)
        res = addToTypstData(res, { typst: 'overline(")"' + escapeContentSeparators(escapeUnbalancedParens(content)) + ')' });
      } else if (notation.includes('circle')) {
        // \enclose{circle} → #circle with inset
        res = addToTypstData(res, { typst: '#circle(inset: 3pt, $' + content + '$)', typst_inline: content });
      } else if (notation.includes('radical')) {
        // \enclose{radical} → sqrt()
        res = addToTypstData(res, { typst: 'sqrt(' + escapeContentSeparators(escapeUnbalancedParens(content)) + ')' });
      } else if (notation.includes('top')) {
        // \enclose{top} → overline()
        res = addToTypstData(res, { typst: 'overline(' + escapeContentSeparators(escapeUnbalancedParens(content)) + ')' });
      } else if (notation.includes('bottom')) {
        // \enclose{bottom} → underline()
        // Detect \smash{)} prefix (used in \lcm macro): strip leading ) or \), trailing spacing, no space
        if (content.startsWith(')') || content.startsWith('\\)')) {
          const skip = content.startsWith('\\)') ? 2 : 1;
          let inner = content.slice(skip).trim().replace(RE_TRAILING_SPACING, '');
          res = addToTypstData(res, { typst: 'underline(")"' + escapeContentSeparators(inner) + ')' });
        } else {
          res = addToTypstData(res, { typst: 'underline(' + escapeContentSeparators(escapeUnbalancedParens(content)) + ')' });
        }
      } else {
        // Unknown notation: pass through content
        res = addToTypstData(res, data);
      }
      return res;
    } catch (e) {
      return res;
    }
  };
};

// --- Handler dispatch ---
export const handle = (node, serialize): ITypstData => {
  const handler = handlers[node.kind] || defaultHandler;
  return handler(node, serialize);
};

const handleAll = (node, serialize): ITypstData => {
  let res: ITypstData = initTypstData();
  try {
    for (const child of node.childNodes) {
      const data: ITypstData = serialize.visitNode(child, '');
      res = addToTypstData(res, data);
    }
    return res;
  } catch (e) {
    return res;
  }
};

// --- MSTYLE handler: skip operator-internal spacing, pass through otherwise ---
const mstyle = () => {
  return (node, serialize): ITypstData => {
    let res: ITypstData = initTypstData();
    try {
      // MathJax wraps mstyle children in an inferredMrow.
      // Check if this mstyle only contains mspace nodes
      const children = node.childNodes || [];
      if (children.length === 1 && children[0].isInferred) {
        const innerChildren = children[0].childNodes || [];
        const hasOnlySpaces = innerChildren.length > 0
          && innerChildren.every((child) => child.kind === 'mspace');
        if (hasOnlySpaces) {
          // Skip operator-internal spacing (inside TeXAtom chains, e.g. \oint),
          // but preserve explicit user spacing (\, \quad) in top-level inferredMrow
          let isOperatorSpacing = false;
          let p = node.parent;
          for (let d = 0; d < ANCESTOR_MAX_DEPTH && p; d++) {
            if (p.kind === 'math') break;
            if (p.kind === 'TeXAtom') { isOperatorSpacing = true; break; }
            p = p.parent;
          }
          if (isOperatorSpacing) {
            return res;
          }
        }
      }
      // Handle mathcolor attribute (\color{red}{x})
      // Filter out MathJax internal "_inherit_" sentinel value
      const atr = getAttributes(node);
      const rawColor: string = atr?.mathcolor || '';
      const mathcolor: string = rawColor && rawColor !== MATHJAX_INHERIT_SENTINEL ? rawColor : '';
      const data: ITypstData = handlerApi.handleAll(node, serialize);
      if (mathcolor && data.typst.trim()) {
        // Hex colors (#D61F06) need rgb("...") wrapper; named colors (red) pass through
        const fillValue = mathcolor.startsWith('#')
          ? 'rgb("' + mathcolor + '")'
          : mathcolor;
        res = addToTypstData(res, {
          typst: '#text(fill: ' + fillValue + ')[' + data.typst.trim() + ']'
        });
        return res;
      }
      return data;
    } catch (e) {
      return res;
    }
  };
};

const handlerApi = {
  handle: handle,
  handleAll: handleAll
};

const handlers: { [key: string]: (node, serialize) => ITypstData } = {
  mi: mi(),
  mo: mo(),
  mn: mn(),
  mfrac: mfrac(),
  msup: msup(),
  msub: msub(),
  msubsup: msubsup(),
  msqrt: msqrt(),
  mover: mover(),
  munder: munder(),
  munderover: munderover(),
  mmultiscripts: mmultiscripts(),
  mspace: mspace(),
  mtext: mtext(),
  mtable: mtable(),
  mrow: mrow(),
  mtr: mtr(),
  mpadded: mpadded(),
  mroot: mroot(),
  menclose: menclose(),
  mstyle: mstyle(),
  mphantom: mphantom(),
};
