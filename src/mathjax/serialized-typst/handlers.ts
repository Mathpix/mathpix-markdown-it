import { TEXCLASS } from "mathjax-full/js/core/MmlTree/MmlNode";
import { ITypstData, initTypstData, addToTypstData, addSpaceToTypstData, needsParens, isThousandSepComma, needsTokenSeparator } from "./common";
import { findTypstSymbol, typstAccentMap, typstFontMap, typstSymbolMap } from "./typst-symbol-map";
import { isFirstChild, isLastChild } from "./node-utils";

const INVISIBLE_CHARS: Set<string> = new Set([
  '\u2061', // function application
  '\u2062', // invisible times
  '\u2063', // invisible separator
  '\u2064', // invisible plus
]);

const getChildrenText = (node): string => {
  let text: string = '';
  try {
    node.childNodes.forEach((child: any) => {
      text += child.text;
    });
    return text;
  } catch (e) {
    return text;
  }
};

const getAttributes = (node): any => {
  return node.attributes.getAllAttributes();
};

const defHandle = (node, serialize): ITypstData => {
  return handlerApi.handleAll(node, serialize);
};

/** Extract the original \label{} key from an mlabeledtr label cell.
 *  MathJax stores the id as "mjx-eqn:<label_key>" when useLabelIds is true. */
const getLabelKey = (labelCell: any): string | null => {
  const key = labelCell?.properties?.['data-label-key'];
  return key ? String(key) : null;
};

// Serialize a tag label mtd as Typst content for use inside [...].
// mtext nodes → plain text, math nodes → $typst_math$.
// For simple tags like "(1.2)", returns "1.2" (stripped parens).
// For mixed tags like "($x\sqrt{5}$ 1.3.1)", returns "$x sqrt(5)$ 1.3.1".
const serializeTagContent = (labelCell: any, serialize: any): string => {
  try {
    // Walk the children of the label mtd's content.
    // Simple tag: mtd > mtext("(1.2)")
    // Mixed tag: mtd > mrow > [mtext("("), mrow(math), mtext(" 1.3.1)")]
    const parts: string[] = [];
    const visitChild = (child: any) => {
      if (!child) return;
      if (child.kind === 'mtext') {
        // Text node — emit as plain text
        const text = child.childNodes?.[0]?.text || '';
        if (text) {
          parts.push(text.replace(/\u00A0/g, ' '));
        }
      } else if (child.isInferred) {
        // Inferred mrow — always recurse
        if (child.childNodes) {
          for (const c of child.childNodes) {
            visitChild(c);
          }
        }
      } else if (child.kind === 'mrow' || child.kind === 'TeXAtom') {
        // Check if this group contains any mtext (mixed content) — recurse
        // Otherwise it's a pure math group — serialize as one $...$ block
        const hasMtext = child.childNodes?.some(
          (c: any) => c && (c.kind === 'mtext' || (c.isInferred && c.childNodes?.some((cc: any) => cc?.kind === 'mtext')))
        );
        if (hasMtext) {
          if (child.childNodes) {
            for (const c of child.childNodes) {
              visitChild(c);
            }
          }
        } else {
          // Pure math group — serialize whole thing
          const data: ITypstData = serialize.visitNode(child, '');
          const mathStr = data.typst.trim();
          if (mathStr) {
            parts.push('$' + mathStr + '$');
          }
        }
      } else {
        // Math node — serialize and wrap in $...$
        const data: ITypstData = serialize.visitNode(child, '');
        const mathStr = data.typst.trim();
        if (mathStr) {
          parts.push('$' + mathStr + '$');
        }
      }
    };
    if (labelCell.childNodes) {
      for (const child of labelCell.childNodes) {
        visitChild(child);
      }
    }
    return parts.join('').trim();
  } catch (_e) {
    return '';
  }
};

// Spacing helper: check if previous sibling ends with a word character
// and current node starts with a word character, requiring a space separator
const needSpaceBefore = (node): boolean => {
  try {
    if (isFirstChild(node)) {
      return false;
    }
    const index = node.parent.childNodes.findIndex(item => item === node);
    const prev = node.parent.childNodes[index - 1];
    if (prev.kind === 'mi' || prev.kind === 'mo') {
      const text = (prev.childNodes[0] as any)?.text || '';
      const prevTypst = findTypstSymbol(text);
      // Any word char or dot at end of previous Typst output needs separation
      return /[\w.]$/.test(prevTypst);
    }
    if (prev.kind === 'mn') {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};

const needSpaceAfter = (node): boolean => {
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
      // Any word char or dot at start of next Typst output needs separation
      return /^[\w.]/.test(nextTypst);
    }
    if (next && next.kind === 'mn') {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};

// Built-in Typst math function names — these are already rendered upright
// and should NOT be wrapped in upright()
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

// Single uppercase letters that can use doubled-letter shorthand for \mathbb
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
      // Apply font wrapping if mathvariant is set and not the default italic
      // Skip font wrapping for known symbols (e.g. \infty with mathvariant="normal")
      // Skip font wrapping for built-in Typst math operators (sin, cos, log, etc.)
      else if (mathvariant && mathvariant !== 'italic' && !isKnownSymbol && !isKnownOperator) {
        const fontFn = typstFontMap.get(mathvariant);
        if (fontFn) {
          // Multi-letter text needs quotes in Typst math (e.g. italic("word"), bold("text"))
          const inner = value.length > 1 ? '"' + value + '"' : typstValue;
          // \mathbf produces mathvariant="bold" which is upright bold in LaTeX
          if (mathvariant === 'bold') {
            typstValue = 'upright(bold(' + inner + '))';
          } else {
            typstValue = fontFn + '(' + inner + ')';
          }
        }
      }
      // Add spacing around multi-character Typst symbol names
      if (typstValue.length > 1 && /^\w/.test(typstValue)) {
        const spaceBefore = needSpaceBefore(node) ? ' ' : '';
        const spaceAfter = needSpaceAfter(node) ? ' ' : '';
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
      const value = getChildrenText(node);
      // Skip invisible operators
      if (INVISIBLE_CHARS.has(value)) {
        return res;
      }
      const typstValue: string = findTypstSymbol(value);
      // Map multi-word MathJax operator names to Typst built-in equivalents
      // (e.g. \limsup → "lim⁠sup" with thin space → "limsup")
      const normalizedValue = value.replace(/[\u2006\u2005\u2004\u2009\u200A\u00A0]/g, ' ');
      const mappedOp = MATHJAX_MULTIWORD_OPS.get(normalizedValue);
      if (mappedOp) {
        const spaceBefore = needSpaceBefore(node) ? ' ' : '';
        const spaceAfter = needSpaceAfter(node) ? ' ' : '';
        res = addToTypstData(res, { typst: spaceBefore + mappedOp + spaceAfter });
        return res;
      }
      // Detect custom named operators (e.g. \injlim → "inj lim", \projlim → "proj lim")
      // Don't add limits: #true here — parent handler (munderover/munder/mover) decides placement
      if (value.length > 1 && /^\w/.test(value) && !typstSymbolMap.has(value) && !TYPST_MATH_OPERATORS.has(value)) {
        const opName = normalizedValue;
        res = addToTypstData(res, { typst: 'op("' + opName + '")' });
        return res;
      }
      // Check if this operator is inside sub/sup/munderover — no spacing there
      const parentKind = node.parent?.kind;
      const inScript = parentKind === 'msub' || parentKind === 'msup'
        || parentKind === 'msubsup' || parentKind === 'munderover';
      // Add spacing around operators for readability
      if (typstValue.length > 1 && /^\w/.test(typstValue)) {
        // Multi-char Typst symbol names: "times", "lt.eq", etc.
        const spaceBefore = needSpaceBefore(node) ? ' ' : '';
        let spaceAfter = needSpaceAfter(node) ? ' ' : '';
        // Prevent Typst from interpreting "symbol(" as a function call
        // (e.g. "lt.eq(x)" would call lt.eq as a function)
        if (!spaceAfter && !inScript) {
          try {
            const idx = node.parent.childNodes.findIndex(item => item === node);
            const next = node.parent.childNodes[idx + 1];
            if (next && next.kind === 'mo') {
              const nt = getChildrenText(next);
              if (nt === '(' || nt === '[') spaceAfter = ' ';
            }
          } catch (_e) { /* ignore */ }
        }
        res = addToTypstData(res, { typst: spaceBefore + typstValue + spaceAfter });
      } else if (!inScript && SPACED_OPERATORS.has(value)) {
        // Common binary/relational operators: add spaces
        res = addToTypstData(res, { typst: ' ' + typstValue + ' ' });
      } else if (!inScript && value === ',') {
        // Commas: add trailing space for readability
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
      const value = getChildrenText(node);
      // Check for font variant (e.g. \mathbb{1})
      const atr = getAttributes(node);
      const mathvariant: string = atr?.mathvariant || '';
      if (mathvariant && mathvariant !== 'normal') {
        const fontFn = typstFontMap.get(mathvariant);
        if (fontFn) {
          const content = value || '""';
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
      // Replace non-breaking spaces with regular spaces
      value = value.replace(/\u00A0/g, ' ');
      // Check if this is a single symbol character with a known Typst mapping
      if (value.length === 1 && typstSymbolMap.has(value)) {
        const typstValue = findTypstSymbol(value);
        const spaceBefore = needSpaceBefore(node) ? ' ' : '';
        const spaceAfter = needSpaceAfter(node) ? ' ' : '';
        res = addToTypstData(res, { typst: spaceBefore + typstValue + spaceAfter });
        return res;
      }
      // In Typst math, text is wrapped in double quotes
      let textContent = '"' + value + '"';
      // Apply font wrapping if mathvariant is set (e.g. \textbf, \textit)
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
      const num = dataFirst.typst.trim() || '""';
      const den = dataSecond.typst.trim() || '""';
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
        const braceMatch = BRACE_ANNOTATION_RE.exec(baseTrimmed);
        if (braceMatch && (braceMatch[1] === 'overbrace' || braceMatch[1] === 'overbracket')) {
          res = addToTypstData(res, { typst: braceMatch[1] + '(' + braceMatch[2] + ', ' + sup + ')' });
          return res;
        }
      }
      // \nolimits: wrap known limit-type operators in scripts() to force side placement
      if (baseTrimmed && needsScriptsWrapper(baseTrimmed)) {
        res = addToTypstData(res, { typst: 'scripts(' + baseTrimmed + ')' });
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
          res = addToTypstData(res, { typst: '^' });
          if (needsParens(sup)) {
            res = addToTypstData(res, { typst: '(' + sup + ')' });
          } else {
            res = addToTypstData(res, { typst: sup });
          }
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
        const braceMatch = BRACE_ANNOTATION_RE.exec(baseTrimmed);
        if (braceMatch && (braceMatch[1] === 'underbrace' || braceMatch[1] === 'underbracket')) {
          res = addToTypstData(res, { typst: braceMatch[1] + '(' + braceMatch[2] + ', ' + sub + ')' });
          return res;
        }
      }
      // \nolimits: wrap known limit-type operators in scripts() to force side placement
      if (baseTrimmed && needsScriptsWrapper(baseTrimmed)) {
        res = addToTypstData(res, { typst: 'scripts(' + baseTrimmed + ')' });
      } else {
        res = addToTypstData(res, { typst: baseTrimmed ? base : '""' });
      }
      // Skip empty subscript (e.g. LaTeX m_{} → just "m")
      if (sub) {
        res = addToTypstData(res, { typst: '_' });
        if (needsParens(sub)) {
          res = addToTypstData(res, { typst: '(' + sub + ')' });
        } else {
          res = addToTypstData(res, { typst: sub });
        }
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
      // \nolimits: wrap known limit-type operators in scripts() to force side placement
      if (baseTrimmed && needsScriptsWrapper(baseTrimmed)) {
        res = addToTypstData(res, { typst: 'scripts(' + baseTrimmed + ')' });
      } else {
        res = addToTypstData(res, { typst: baseTrimmed ? base : '""' });
      }
      // Skip empty subscript/superscript (e.g. LaTeX m_{}^{x} → just "m^x")
      if (sub) {
        res = addToTypstData(res, { typst: '_' });
        if (needsParens(sub)) {
          res = addToTypstData(res, { typst: '(' + sub + ')' });
        } else {
          res = addToTypstData(res, { typst: sub });
        }
      }
      if (sup) {
        res = addToTypstData(res, { typst: '^' });
        if (needsParens(sup)) {
          res = addToTypstData(res, { typst: '(' + sup + ')' });
        } else {
          res = addToTypstData(res, { typst: sup });
        }
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
      const content = dataFirst.typst.trim() || '""';
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
      const radicandContent = dataRadicand.typst.trim() || '""';
      // Typst root: root(index, radicand)
      res = addToTypstData(res, {
        typst: 'root(' + dataIndex.typst.trim() + ', ' + radicandContent + ')'
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

/** Build limit-placement base for munderover/munder/mover handlers.
 *  Returns ITypstData with potentially different block/inline bases for movablelimits. */
/**
 * Symbols that should use stretch() instead of limits() when used as the base
 * of mover/munder/munderover — extensible arrows, harpoons, and equal sign.
 * stretch() makes the symbol grow to fit its annotations, matching LaTeX's
 * \xrightarrow, \xleftarrow, \xlongequal, etc.
 */
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

const buildLimitBase = (firstChild: any, baseTrimmed: string, base: string): ITypstData => {
  const movablelimits = getMovablelimits(firstChild);
  const baseIsCustomOp = /^op\(/.test(baseTrimmed);
  // Extensible arrows/symbols: MathJax sets stretchy=true on the base mo.
  // Use stretch() for these (e.g. \xrightarrow), limits() for stacking (\stackrel, \overset).
  let isStretchy = false;
  if (STRETCH_BASE_SYMBOLS.has(baseTrimmed)) {
    // Find the inner mo node — MathJax may wrap in mstyle/inferredMrow
    let moNode = firstChild;
    for (let i = 0; i < 5 && moNode && moNode.kind !== 'mo'; i++) {
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
    return { typst: wrapper + '(' + baseTrimmed + ')', typst_inline: base };
  } else if (movablelimits === false) {
    // Explicit \limits — force below/above placement in both modes
    return { typst: wrapper + '(' + baseTrimmed + ')' };
  } else {
    // Non-mo base (mrow, etc.) — use existing logic
    const baseIsNativeLimitOp = TYPST_DISPLAY_LIMIT_OPS.has(baseTrimmed);
    // OP-class base with op() output — two cases:
    if (/^op\(/.test(baseTrimmed) && firstChild?.texClass === TEXCLASS.OP) {
      if (firstChild?.kind === 'TeXAtom') {
        // TeXAtom(OP): \varinjlim, \varliminf, etc. — same as movablelimits custom op
        return { typst: baseTrimmed.replace(/\)$/, ', limits: #true)'), typst_inline: base };
      }
      // mi(OP): \operatorname*{name} — add limits: #true inside op()
      return { typst: baseTrimmed.replace(/\)$/, ', limits: #true)') };
    }
    const baseIsSpecialFn = /^(overbrace|underbrace|overline|underline|op)\(/.test(baseTrimmed);
    if (baseIsNativeLimitOp || baseIsSpecialFn) {
      return { typst: base };
    }
    return { typst: wrapper + '(' + baseTrimmed + ')' };
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
        const baseText = getChildrenText(firstChild);
        const overChar = getChildrenText(secondChild);
        if (baseText === 'lim' && overChar === '\u2015') {
          res = addToTypstData(res, { typst: 'op(overline(lim))' });
          return res;
        }
      }
      if (secondChild && secondChild.kind === 'mo') {
        const accentChar = getChildrenText(secondChild);
        const accentFn = typstAccentMap.get(accentChar);
        if (accentFn) {
          const content = dataFirst.typst.trim() || '""';
          if (TYPST_ACCENT_SHORTHANDS.has(accentFn)) {
            // Shorthand accent: fn(content)
            res = addToTypstData(res, { typst: accentFn + '(' + content + ')' });
          } else {
            // Non-shorthand accent: accent(content, symbol)
            res = addToTypstData(res, { typst: 'accent(' + content + ', ' + accentFn + ')' });
          }
          return res;
        }
      }
      // Fallback: base^(over) — uses movablelimits to decide limits() wrapping
      const baseTrimmed = dataFirst.typst.trim() || '""';
      const over = dataSecond.typst.trim();
      if (over) {
        // overbrace/overbracket annotation: insert as second argument
        const braceMatch = BRACE_ANNOTATION_RE.exec(baseTrimmed);
        if (braceMatch && (braceMatch[1] === 'overbrace' || braceMatch[1] === 'overbracket')) {
          res = addToTypstData(res, { typst: braceMatch[1] + '(' + braceMatch[2] + ', ' + over + ')' });
          return res;
        }
        const baseData = buildLimitBase(firstChild, baseTrimmed, dataFirst.typst);
        res = addToTypstData(res, baseData);
        res = addToTypstData(res, { typst: '^' });
        if (needsParens(over)) {
          res = addToTypstData(res, { typst: '(' + over + ')' });
        } else {
          res = addToTypstData(res, { typst: over });
        }
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
        const baseText = getChildrenText(firstChild);
        const underChar = getChildrenText(secondChild);
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
        const accentChar = getChildrenText(secondChild);
        let accentFn = typstAccentMap.get(accentChar);
        // Flip over-accents to under-accents when used in munder context
        if (accentFn === 'overline') { accentFn = 'underline'; }
        if (accentFn === 'overbrace') { accentFn = 'underbrace'; }
        if (accentFn) {
          const content = dataFirst.typst.trim() || '""';
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
      // Fallback: base_(under) — uses movablelimits to decide limits() wrapping
      const baseTrimmed = dataFirst.typst.trim() || '""';
      const under = dataSecond.typst.trim();
      if (under) {
        // underbrace/underbracket annotation: insert as second argument
        const braceMatch = BRACE_ANNOTATION_RE.exec(baseTrimmed);
        if (braceMatch && (braceMatch[1] === 'underbrace' || braceMatch[1] === 'underbracket')) {
          res = addToTypstData(res, { typst: braceMatch[1] + '(' + braceMatch[2] + ', ' + under + ')' });
          return res;
        }
        const baseData = buildLimitBase(firstChild, baseTrimmed, dataFirst.typst);
        res = addToTypstData(res, baseData);
        res = addToTypstData(res, { typst: '_' });
        if (needsParens(under)) {
          res = addToTypstData(res, { typst: '(' + under + ')' });
        } else {
          res = addToTypstData(res, { typst: under });
        }
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
        res = addToTypstData(res, { typst: '_' });
        if (needsParens(under)) {
          res = addToTypstData(res, { typst: '(' + under + ')' });
        } else {
          res = addToTypstData(res, { typst: under });
        }
      }
      if (over) {
        res = addToTypstData(res, { typst: '^' });
        if (needsParens(over)) {
          res = addToTypstData(res, { typst: '(' + over + ')' });
        } else {
          res = addToTypstData(res, { typst: over });
        }
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
          res = addToTypstData(res, { typst: '_' });
          if (needsParens(postSub)) {
            res = addToTypstData(res, { typst: '(' + postSub + ')' });
          } else {
            res = addToTypstData(res, { typst: postSub });
          }
        }
        if (postSup) {
          res = addToTypstData(res, { typst: '^' });
          if (needsParens(postSup)) {
            res = addToTypstData(res, { typst: '(' + postSup + ')' });
          } else {
            res = addToTypstData(res, { typst: postSup });
          }
        }
      } else {
        // Has prescripts — use attach(base, tl:, bl:, t:, b:)
        const parts: string[] = [];
        if (preSup) parts.push('tl: ' + preSup);
        if (preSub) parts.push('bl: ' + preSub);
        if (postSup) parts.push('t: ' + postSup);
        if (postSub) parts.push('b: ' + postSub);
        res = addToTypstData(res, {
          typst: 'attach(' + baseTrimmed + ', ' + parts.join(', ') + ')'
        });
      }

      return res;
    } catch (e) {
      return res;
    }
  };
};

// --- MSPACE handler: spacing commands ---
const mspace = () => {
  return (node, _serialize): ITypstData => {
    let res: ITypstData = initTypstData();
    try {
      const atr = getAttributes(node);
      if (!atr || !atr.width) {
        return res;
      }
      const width: string = atr.width.toString();
      // Map common MathML spacing widths to Typst spacing keywords
      if (width === '2em') {
        res = addToTypstData(res, { typst: ' wide ' });
      } else if (width === '1em') {
        res = addToTypstData(res, { typst: ' quad ' });
      } else if (width === '0.2778em' || width === '0.278em') {
        // \; or \: → medmathspace
        res = addToTypstData(res, { typst: ' med ' });
      } else if (width === '0.1667em' || width === '0.167em') {
        // \, → thinmathspace
        res = addToTypstData(res, { typst: ' thin ' });
      } else if (width === '-0.1667em' || width === '-0.167em') {
        // \! → negative thin space — skip (Typst has no negthin; this is a LaTeX spacing hack)
        return res;
      } else if (width === '0.2222em' || width === '0.222em') {
        // \: → mediummathspace
        res = addToTypstData(res, { typst: ' med ' });
      } else {
        // Generic space fallback
        res = addToTypstData(res, { typst: ' ' });
      }
      return res;
    } catch (e) {
      return res;
    }
  };
};

// Delimiter mapping for matrix environments
const delimiterToTypst = (delim: string): string => {
  switch (delim) {
    case '(': return '"("';
    case ')': return '")"';
    case '[': return '"["';
    case ']': return '"]"';
    case '{': return '"{"';
    case '}': return '"}"';
    case '|': return '"|"';
    case '\u2016': return '"\u2016"'; // double vertical bar ‖
    case '\u2225': return '"\u2016"'; // parallel → ‖
    default: return '"' + delim + '"';
  }
};

// Check if a node subtree (outside mphantom) contains an mo with the given text
const treeContainsMo = (node, moText: string, skipPhantom = true): boolean => {
  if (!node) return false;
  if (skipPhantom && node.kind === 'mphantom') return false;
  if (node.kind === 'mo') {
    const text = getChildrenText(node);
    if (text === moText) return true;
  }
  if (node.childNodes) {
    for (const child of node.childNodes) {
      if (treeContainsMo(child, moText, skipPhantom)) return true;
    }
  }
  return false;
};

// Serialize all visible content in a node subtree up to (but not including)
// the first mo with the given text. Returns the serialized prefix.
const serializePrefixBeforeMo = (node, serialize, stopMoText: string): string => {
  // Walk the mtd → inferredMrow → mpadded chain to find the flat math children
  let flatChildren: any[] = [];
  const extractFlat = (n) => {
    if (!n || !n.childNodes) return;
    if (n.kind === 'mphantom') return;
    if (n.kind === 'mtd' || n.kind === 'mpadded' || n.kind === 'mstyle' || n.isInferred) {
      for (const child of n.childNodes) {
        extractFlat(child);
      }
    } else {
      flatChildren.push(n);
    }
  };
  extractFlat(node);
  // Serialize children up to the stop mo
  let result = '';
  for (const child of flatChildren) {
    if (child.kind === 'mo' && getChildrenText(child) === stopMoText) {
      break;
    }
    const data: ITypstData = serialize.visitNode(child, '');
    result += data.typst;
  }
  return result.trim();
};

// Escape top-level commas and semicolons in a Typst expression for use inside cases().
// Replaces commas at depth 0 with "," and semicolons at depth 0 with ";"
// (Typst text strings) so they render visually but aren't parsed as
// cases()/mat() argument or row separators.
// Characters inside function calls like lr((...)) are left as-is.
const escapeCasesSeparators = (expr: string): string => {
  let depth = 0;
  let result = '';
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (ch === '(' || ch === '[' || ch === '{') {
      depth++;
      result += ch;
    } else if ((ch === ')' || ch === ']' || ch === '}') && depth > 0) {
      depth--;
      result += ch;
    } else if (ch === ',' && depth === 0) {
      result += '","';
    } else if (ch === ';' && depth === 0) {
      result += '";"';
    } else {
      result += ch;
    }
  }
  return result;
};

/** Check whether a Typst expression contains `,` or `;` at parenthesis depth 0. */
const hasTopLevelSeparators = (expr: string): boolean => {
  let depth = 0;
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (ch === '(' || ch === '[' || ch === '{') { depth++; }
    else if ((ch === ')' || ch === ']' || ch === '}') && depth > 0) { depth--; }
    else if ((ch === ',' || ch === ';') && depth === 0) { return true; }
  }
  return false;
};

/** Escape top-level `;` → `";"` inside lr() content (commas are safe in lr). */
const escapeLrSemicolons = (expr: string): string => {
  let depth = 0;
  let result = '';
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (ch === '(' || ch === '[' || ch === '{') { depth++; result += ch; }
    else if ((ch === ')' || ch === ']' || ch === '}') && depth > 0) { depth--; result += ch; }
    else if (ch === ';' && depth === 0) { result += '";"'; }
    else { result += ch; }
  }
  return result;
};

const BRACKET_SYMBOL_MAP: Record<string, string> = {
  '[': 'bracket.l',
  ']': 'bracket.r',
  '(': 'paren.l',
  ')': 'paren.r',
  '{': 'brace.l',
  '}': 'brace.r',
};

// Replace unpaired brackets in a matrix/cases cell with Typst symbol names.
// Brackets that have a matching open/close pair in the same cell are kept as-is.
// Escaped brackets (\[), brackets inside quoted strings ("..."), and brackets
// inside function-call parens (e.g. frac(...)) are ignored.
const replaceUnpairedBrackets = (expr: string): string => {
  // Quick exit if no bracket characters present
  if (!/[\[\](){}]/.test(expr)) return expr;

  type BracketInfo = { char: string; pos: number };
  const brackets: BracketInfo[] = [];

  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    // Skip backslash-escaped characters
    if (ch === '\\') {
      i++; // skip next char
      continue;
    }
    // Skip quoted strings
    if (ch === '"') {
      i++;
      while (i < expr.length && expr[i] !== '"') {
        if (expr[i] === '\\') i++; // skip escaped char in string
        i++;
      }
      continue;
    }
    // Check if this is a bracket character
    if ('[](){}'.includes(ch)) {
      // Check if ( is a function-call paren (preceded by word char or .)
      // If so, skip the entire function call content
      if (ch === '(' && i > 0 && /[\w.]/.test(expr[i - 1])) {
        let depth = 1;
        i++;
        while (i < expr.length && depth > 0) {
          if (expr[i] === '\\') { i++; }
          else if (expr[i] === '"') {
            i++;
            while (i < expr.length && expr[i] !== '"') {
              if (expr[i] === '\\') i++;
              i++;
            }
          }
          else if (expr[i] === '(') depth++;
          else if (expr[i] === ')') depth--;
          if (depth > 0) i++;
        }
        // i now points to the closing ), skip it
        continue;
      }
      brackets.push({ char: ch, pos: i });
    }
  }

  // Pair brackets using stacks for each bracket type
  const BRACKET_PAIRS: Record<string, string> = { '[': ']', '(': ')', '{': '}' };
  const unmatched = new Set<number>();

  for (const [open, close] of Object.entries(BRACKET_PAIRS)) {
    const stack: number[] = [];
    for (const b of brackets) {
      if (b.char === open) {
        stack.push(b.pos);
      } else if (b.char === close) {
        if (stack.length > 0) {
          stack.pop(); // matched
        } else {
          unmatched.add(b.pos); // unmatched close
        }
      }
    }
    // Any remaining in stack are unmatched opens
    for (const pos of stack) {
      unmatched.add(pos);
    }
  }

  if (unmatched.size === 0) return expr;

  // Replace unmatched brackets with symbol names, adding spaces where needed
  let result = '';
  for (let i = 0; i < expr.length; i++) {
    if (unmatched.has(i)) {
      const sym = BRACKET_SYMBOL_MAP[expr[i]];
      // Add space before if preceded by word char or dot
      if (result.length > 0 && /[\w.]/.test(result[result.length - 1])) {
        result += ' ';
      }
      result += sym;
      // Add space after if followed by word char
      if (i + 1 < expr.length && /\w/.test(expr[i + 1])) {
        result += ' ';
      }
    } else {
      result += expr[i];
    }
  }
  return result;
};

// Extract explicit \tag{...} from a condition cell's mtext content.
// Returns the tag content (e.g. "3.12") or null if no \tag found.
const extractTagFromConditionCell = (cell: any): string | null => {
  const walk = (n: any): string | null => {
    if (!n) return null;
    if (n.kind === 'mtext') {
      const text = n.childNodes?.[0]?.text || '';
      const match = text.match(/\\tag\{([^}]+)\}/);
      return match ? match[1] : null;
    }
    if (n.childNodes) {
      for (const child of n.childNodes) {
        const found = walk(child);
        if (found) return found;
      }
    }
    return null;
  };
  return walk(cell);
};

// Detect numcases/subnumcases pattern:
// - First row is mlabeledtr with 3+ children (label + prefix + content [+ condition])
//   3 children: empty prefix or no & separator → label + prefix_with_brace + content
//   4 children: non-empty prefix with & separator → label + prefix + value + condition
// - First row's cell[1] contains a visible '{' mo (inside mpadded, outside mphantom)
const isNumcasesTable = (node): boolean => {
  if (!node.childNodes || node.childNodes.length === 0) return false;
  const firstRow = node.childNodes[0];
  if (firstRow.kind !== 'mlabeledtr') return false;
  if (firstRow.childNodes.length < 3) return false;
  // Check that cell[1] (first data column) contains a '{' brace
  const prefixCell = firstRow.childNodes[1];
  return treeContainsMo(prefixCell, '{');
};

// Check if a node is inside a non-eqnArray mtable (mat()/cases() function call syntax)
// where bare ASCII delimiters like [ { ( would break parsing.
// --- MTABLE handler: matrices and equation arrays ---
const mtable = () => {
  return (node, serialize): ITypstData => {
    let res: ITypstData = initTypstData();
    try {
      const countRow = node.childNodes.length;
      const envName = node.attributes.get('name') as string;
      // Check for enclosing brackets from \left...\right (mrow parent with open/close)
      const parentMrow = node.parent?.kind === 'mrow' ? node.parent : null;
      const branchOpen = parentMrow?.properties?.hasOwnProperty('open') ? parentMrow.properties['open'] : '';
      const branchClose = parentMrow?.properties?.hasOwnProperty('close') ? parentMrow.properties['close'] : '';
      // Determine if this is a cases environment
      const isCases = envName === 'cases' || (branchOpen === '{' && branchClose === '');
      // Detect numcases/subnumcases pattern
      const isNumcases = isNumcasesTable(node);
      // Determine if this is an equation array (align, gather, split, etc.)
      // Skip eqnArray detection for numcases — it should be treated as cases
      const isEqnArray = !isNumcases && !isCases && node.childNodes.length > 0
        && node.childNodes[0].attributes?.get('displaystyle');

      if (isNumcases) {
        // numcases/subnumcases: build #grid() with cases + numbering column
        const firstRow = node.childNodes[0];
        const prefixCell = firstRow.childNodes[1]; // cell after label
        const prefix = serializePrefixBeforeMo(prefixCell, serialize, '{');

        // Determine tag source for each row:
        // 1. Condition-embedded \tag{...} in mtext (MathJax leaves it as literal text)
        // 2. Label cell explicit tag (MathJax processed \tag, data-tag-auto is false)
        // 3. Auto-numbered (data-tag-auto is true)
        const autoTagEntry = '{ counter(math.equation).step(); context counter(math.equation).display("(1)") }';
        const rowTagSources: { source: 'condition' | 'label' | 'auto'; content: string; labelKey: string | null }[] = [];
        for (let i = 0; i < countRow; i++) {
          const mtrNode = node.childNodes[i];
          const labelCell = (mtrNode.kind === 'mlabeledtr' && mtrNode.childNodes.length > 0) ? mtrNode.childNodes[0] : null;
          const labelKey = labelCell ? getLabelKey(labelCell) : null;
          // Check condition cell for embedded \tag{...} in mtext
          const condCell = mtrNode.childNodes[mtrNode.childNodes.length - 1];
          const condTag = extractTagFromConditionCell(condCell);
          if (condTag) {
            rowTagSources.push({ source: 'condition', content: condTag, labelKey });
          } else if (labelCell) {
            const isAutoNumber = !!(labelCell as any).properties?.['data-tag-auto'];
            if (!isAutoNumber) {
              const tagContent = serializeTagContent(labelCell, serialize);
              rowTagSources.push({ source: 'label', content: tagContent, labelKey });
            } else {
              rowTagSources.push({ source: 'auto', content: '', labelKey });
            }
          } else {
            rowTagSources.push({ source: 'auto', content: '', labelKey: null });
          }
        }

        // Build case rows from content columns (after label + prefix)
        const caseRows: string[] = [];
        for (let i = 0; i < countRow; i++) {
          const mtrNode = node.childNodes[i];
          const startCol = mtrNode.kind === 'mlabeledtr' ? 2 : 1; // skip label + prefix
          const cells: string[] = [];
          for (let j = startCol; j < mtrNode.childNodes.length; j++) {
            const mtdNode = mtrNode.childNodes[j];
            const cellData: ITypstData = serialize.visitNode(mtdNode, '');
            let trimmed = cellData.typst.trim();
            // Strip \tag{...} from condition column if tag was extracted from there
            if (j === mtrNode.childNodes.length - 1 && rowTagSources[i].source === 'condition') {
              trimmed = trimmed.replace(/\s*\\tag\{[^}]+\}/g, '');
              trimmed = trimmed.replace(/\s+"$/g, '"');
              trimmed = trimmed.trim();
            }
            if (trimmed) cells.push(trimmed);
          }
          if (cells.length === 1) {
            // Single cell (no & separator): escape top-level commas
            // to prevent them being parsed as cases() argument separators
            caseRows.push(escapeCasesSeparators(replaceUnpairedBrackets(cells[0])));
          } else {
            caseRows.push(cells.map(c => escapeCasesSeparators(replaceUnpairedBrackets(c))).join(' & '));
          }
        }

        let casesContent: string;
        if (caseRows.length >= 2) {
          casesContent = 'cases(\n  ' + caseRows.join(',\n  ') + ',\n)';
        } else {
          casesContent = 'cases(' + caseRows.join(', ') + ')';
        }
        const mathContent = prefix ? prefix + ' ' + casesContent : casesContent;

        // Build tag entries for numbering column
        const tagEntries: string[] = [];
        for (let i = 0; i < countRow; i++) {
          const info = rowTagSources[i];
          let tagText = '';
          if (info.source === 'condition') {
            tagText = '(' + info.content + ')';
          } else if (info.source === 'label' && info.content) {
            tagText = info.content;
          }
          if (tagText && info.labelKey) {
            // Explicit tag with label — wrap in #figure() so the label is referenceable
            tagEntries.push('[#figure(kind: "eq-tag", supplement: none, numbering: n => [' + tagText + '], [' + tagText + ']) <' + info.labelKey + '>]');
          } else if (tagText) {
            tagEntries.push('[' + tagText + ']');
          } else if (info.labelKey) {
            // Auto-numbered with label — step counter outside context, wrap in #figure() for referenceability
            tagEntries.push('{ counter(math.equation).step(); context { let n = numbering("(1)", ..counter(math.equation).get()); [#figure(kind: "eq-tag", supplement: none, numbering: _ => n, [#n]) <' + info.labelKey + '>] } }');
          } else {
            tagEntries.push(autoTagEntry);
          }
        }

        // Build grid output
        const lines: string[] = [
          '#grid(',
          '  columns: (1fr, auto),',
          '  align: (left, right + horizon),',
          '  math.equation(block: true, numbering: none, $ ' + mathContent + ' $),',
          '  grid(',
          '    row-gutter: 0.65em,',
        ];
        for (const entry of tagEntries) {
          lines.push('    ' + entry + ',');
        }
        lines.push('  ),');
        lines.push(')');

        res = addToTypstData(res, { typst: lines.join('\n') });
        // Inline variant: pure math content without #grid wrapper
        res.typst_inline = mathContent;
        return res;
      }

      // Build rows
      const rows: string[] = [];
      for (let i = 0; i < countRow; i++) {
        const mtrNode = node.childNodes[i];
        const countColl = mtrNode.childNodes?.length || 0;
        // For mlabeledtr (numbered equation rows), the first child is the
        // equation number label — skip it so we only emit the math content
        const startCol = mtrNode.kind === 'mlabeledtr' ? 1 : 0;
        const cells: string[] = [];
        for (let j = startCol; j < countColl; j++) {
          const mtdNode = mtrNode.childNodes[j];
          const cellData: ITypstData = serialize.visitNode(mtdNode, '');
          cells.push(cellData.typst.trim());
        }
        if (isEqnArray) {
          // Join cells with & alignment markers.
          // Within each column pair (right-left): &
          // Between column pairs: &quad for visual spacing.
          const pairs: string[] = [];
          for (let k = 0; k < cells.length; k += 2) {
            if (k + 1 < cells.length) {
              pairs.push(cells[k] + ' &' + cells[k + 1]);
            } else {
              pairs.push(cells[k]);
            }
          }
          rows.push(pairs.join(' &quad '));
        } else if (isCases) {
          // Cases: escape top-level commas in each cell to prevent them
          // being parsed as cases() argument separators, then join with &
          rows.push(cells.map(c => escapeCasesSeparators(replaceUnpairedBrackets(c))).join(' & '));
        } else {
          // Matrix: escape top-level commas and semicolons in each cell
          // to prevent them being parsed as mat() cell/row separators
          rows.push(cells.map(c => escapeCasesSeparators(replaceUnpairedBrackets(c))).join(', '));
        }
      }
      if (isEqnArray) {
        // Check if any row has a tag (mlabeledtr)
        const hasAnyTag = node.childNodes.some(
          (child: any) => child.kind === 'mlabeledtr'
        );
        if (hasAnyTag) {
          // Emit each row as a separate block equation:
          // - numbered rows → #math.equation(block: true, numbering: ..., $ ... $)
          // - unnumbered rows → $ ... $
          const eqnBlocks: string[] = [];
          for (let i = 0; i < countRow; i++) {
            const mtrNode = node.childNodes[i];
            const rowContent = rows[i];
            if (mtrNode.kind === 'mlabeledtr' && mtrNode.childNodes.length > 0) {
              const labelCell = mtrNode.childNodes[0];
              const tagContent = serializeTagContent(labelCell, serialize);
              if (tagContent) {
                const isAutoNumber = !!(labelCell as any).properties?.['data-tag-auto'];
                const numbering = isAutoNumber
                  ? '"(1)"'
                  : 'n => [' + tagContent + ']';
                const labelKey = getLabelKey(labelCell);
                const labelSuffix = labelKey ? ' <' + labelKey + '>' : '';
                const supplementPart = labelKey ? ', supplement: none' : '';
                eqnBlocks.push(
                  '#math.equation(block: true' + supplementPart + ', numbering: ' + numbering + ', $ ' + rowContent + ' $)' + labelSuffix
                );
                // Explicit \tag{} does not consume a number in LaTeX, but
                // math.equation always steps the counter in Typst — undo it.
                if (!isAutoNumber) {
                  eqnBlocks.push('#counter(math.equation).update(n => n - 1)');
                }
              } else {
                eqnBlocks.push('$ ' + rowContent + ' $');
              }
            } else {
              eqnBlocks.push('$ ' + rowContent + ' $');
            }
          }
          res = addToTypstData(res, { typst: eqnBlocks.join('\n') });
          // Inline variant: pure math content without #math.equation wrappers
          res.typst_inline = rows.join(' \\\n');
        } else {
          // No tags at all (e.g. align*): emit as single block with \ separators
          res = addToTypstData(res, { typst: rows.join(' \\\n') });
        }
      } else if (isCases) {
        // Cases environment
        let casesBody: string;
        if (rows.length >= 2) {
          casesBody = 'cases(\n  ' + rows.join(',\n  ') + ',\n)';
        } else {
          casesBody = 'cases(' + rows.join(', ') + ')';
        }
        res = addToTypstData(res, { typst: casesBody });
      } else {
        // Matrix: mat(delim: ..., a, b; c, d)
        let matContent: string;
        if (rows.length >= 2) {
          matContent = '\n  ' + rows.join(';\n  ') + ',\n';
        } else {
          matContent = rows.join('; ');
        }

        // Parse array line attributes for augment parameter
        const columnlines = node.attributes.isSet('columnlines')
          ? (node.attributes.get('columnlines') as string).split(' ')
          : [];
        const rowlines = node.attributes.isSet('rowlines')
          ? (node.attributes.get('rowlines') as string).split(' ')
          : [];
        const frame = node.attributes.isSet('frame')
          ? (node.attributes.get('frame') as string)
          : '';

        const vlinePositions: number[] = [];
        for (let i = 0; i < columnlines.length; i++) {
          if (columnlines[i] === 'solid' || columnlines[i] === 'dashed') {
            vlinePositions.push(i + 1);
          }
        }
        const hlinePositions: number[] = [];
        for (let i = 0; i < rowlines.length; i++) {
          if (rowlines[i] === 'solid' || rowlines[i] === 'dashed') {
            hlinePositions.push(i + 1);
          }
        }

        // Build augment string
        let augmentStr = '';
        if (hlinePositions.length > 0 || vlinePositions.length > 0) {
          const parts: string[] = [];
          if (hlinePositions.length === 1) {
            parts.push('hline: ' + hlinePositions[0]);
          } else if (hlinePositions.length > 1) {
            parts.push('hline: (' + hlinePositions.join(', ') + ')');
          }
          if (vlinePositions.length === 1) {
            parts.push('vline: ' + vlinePositions[0]);
          } else if (vlinePositions.length > 1) {
            parts.push('vline: (' + vlinePositions.join(', ') + ')');
          }
          augmentStr = 'augment: #(' + parts.join(', ') + '), ';
        }

        // Extract column alignment
        const columnAlign = node.attributes.get('columnalign') as string;
        const alignArr = columnAlign ? columnAlign.trim().split(/\s+/) : [];
        const uniqueAligns = [...new Set(alignArr)];
        const matAlign = (uniqueAligns.length === 1 && uniqueAligns[0] !== 'center')
          ? uniqueAligns[0]  // 'left' or 'right'
          : '';

        // Build mat() parameters
        const params: string[] = [];
        const hasDelimiters = branchOpen || branchClose;
        if (hasDelimiters) {
          if (branchOpen) {
            params.push('delim: ' + delimiterToTypst(branchOpen));
          }
        } else {
          // Arrays/matrices without parent delimiters should not have parens
          params.push('delim: #none');
        }
        if (matAlign) {
          params.push('align: #' + matAlign);
        }
        if (augmentStr) {
          params.push(augmentStr.slice(0, -2)); // remove trailing ", "
        }

        const paramStr = params.length > 0 ? params.join(', ') + ', ' : '';
        const matExpr = 'mat(' + paramStr + matContent + ')';

        if (frame === 'solid') {
          res = addToTypstData(res, { typst: '#box(stroke: 0.5pt, inset: 3pt, $ ' + matExpr + ' $)', typst_inline: matExpr });
        } else {
          res = addToTypstData(res, { typst: matExpr });
        }
      }
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
            const moText = getChildrenText(child);
            if (moText === openDelim || (!moText && !openDelim)) {
              continue;
            }
          }
          // Skip closing delimiter mo (last child matching close property)
          if (i === node.childNodes.length - 1 && child.kind === 'mo') {
            const moText = getChildrenText(child);
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
        // Map delimiter characters to Typst
        let open = openDelim ? mapDelimiter(openDelim) : '';
        let close = closeDelim ? mapDelimiter(closeDelim) : '';
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
            // General lr() for auto-sizing — escape semicolons
            res = addToTypstData(res, { typst: 'lr(' + open + ' ' + escapeLrSemicolons(trimmedContent) + ' ' + close + ')' });
          }
        } else {
          // One or both delimiters invisible: wrap visible side in lr()
          // with escaped delimiters so bare ASCII chars don't break parsing
          // and auto-sizing from \left/\right is preserved.
          const trimmed = content.trim();
          const openEsc = openDelim ? escapeDelimiterForLr(openDelim) : '';
          const closeEsc = closeDelim ? escapeDelimiterForLr(closeDelim) : '';
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
            const moText = getChildrenText(child);
            if (moText === openDelim || (!moText && !openDelim)) { continue; }
          }
          if (i === node.childNodes.length - 1 && child.kind === 'mo') {
            const moText = getChildrenText(child);
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
              // binom() in Typst already includes parentheses — skip OPEN/CLOSE wrappers
              const data: ITypstData = serialize.visitNode(middle, '');
              res = addToTypstData(res, data);
              return res;
            }
          }
        }
        // Regular mrow: concatenate children with spacing to prevent merging
        for (let i = 0; i < node.childNodes.length; i++) {
          // Thousand-separator: mn, mo(,), mn(3 digits) → merge as 120","000
          if (isThousandSepComma(node, i)) {
            const numData: ITypstData = serialize.visitNode(node.childNodes[i], '');
            if (needsTokenSeparator(res.typst, numData.typst)) {
              addSpaceToTypstData(res);
            }
            const nextData: ITypstData = serialize.visitNode(node.childNodes[i + 2], '');
            res = addToTypstData(res, { typst: numData.typst + '","' + nextData.typst });
            i += 2;
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

// Map delimiter characters to Typst representation
const mapDelimiter = (delim: string): string => {
  const mapped = typstSymbolMap.get(delim);
  if (mapped) {
    return mapped;
  }
  return delim;
};

// Escape ASCII delimiters for use inside lr() within mat()/cases() context.
// Bare [ { ( break Typst function-call parsing; backslash-escaping makes them
// literal math delimiters that lr() can auto-size.
const delimiterEscapeMap: Record<string, string> = {
  '[': '\\[',
  ']': '\\]',
  '(': '\\(',
  ')': '\\)',
  '{': '\\{',
  '}': '\\}',
};

const escapeDelimiterForLr = (delim: string): string => {
  if (delimiterEscapeMap[delim]) return delimiterEscapeMap[delim];
  const mapped = typstSymbolMap.get(delim);
  if (mapped) return mapped;
  return delim;
};

// --- MTR handler: table row ---
const mtr = () => {
  return (node, serialize): ITypstData => {
    let res: ITypstData = initTypstData();
    try {
      for (let i = 0; i < node.childNodes.length; i++) {
        if (i > 0) {
          res = addToTypstData(res, { typst: ', ' });
        }
        const data: ITypstData = serialize.visitNode(node.childNodes[i], '');
        res = addToTypstData(res, data);
      }
      return res;
    } catch (e) {
      return res;
    }
  };
};

// --- MPADDED handler: strip padding, emit content ---
const mpadded = () => {
  return (node, serialize): ITypstData => {
    let res: ITypstData = initTypstData();
    try {
      const data: ITypstData = handlerApi.handleAll(node, serialize);
      res = addToTypstData(res, data);
      return res;
    } catch (e) {
      return res;
    }
  };
};

// --- MPHANTOM handler: invisible content that preserves space ---
// Typst's hide() is the equivalent of LaTeX \phantom — renders content
// invisibly while preserving its dimensions.
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
      if (notation.indexOf('box') > -1) {
        // \boxed → #box with stroke
        res = addToTypstData(res, { typst: '#box(stroke: 0.5pt, inset: 3pt, $' + content + '$)', typst_inline: content });
      } else if (notation.indexOf('updiagonalstrike') > -1 || notation.indexOf('downdiagonalstrike') > -1) {
        // \cancel uses updiagonalstrike (lower-left to upper-right) → Typst cancel() default
        // \bcancel uses downdiagonalstrike (upper-left to lower-right) → Typst cancel(inverted: true)
        if (notation.indexOf('downdiagonalstrike') > -1 && notation.indexOf('updiagonalstrike') === -1) {
          res = addToTypstData(res, { typst: 'cancel(inverted: #true, ' + content + ')' });
        } else {
          res = addToTypstData(res, { typst: 'cancel(' + content + ')' });
        }
      } else if (notation.indexOf('horizontalstrike') > -1) {
        res = addToTypstData(res, { typst: 'cancel(' + content + ')' });
      } else if (notation.indexOf('longdiv') > -1) {
        // \longdiv / \enclose{longdiv} → overline(")" content)
        res = addToTypstData(res, { typst: 'overline(")"' + content + ')' });
      } else if (notation.indexOf('circle') > -1) {
        // \enclose{circle} → #circle with inset
        res = addToTypstData(res, { typst: '#circle(inset: 3pt, $' + content + '$)', typst_inline: content });
      } else if (notation.indexOf('radical') > -1) {
        // \enclose{radical} → sqrt()
        res = addToTypstData(res, { typst: 'sqrt(' + content + ')' });
      } else if (notation.indexOf('top') > -1) {
        // \enclose{top} → overline()
        res = addToTypstData(res, { typst: 'overline(' + content + ')' });
      } else if (notation.indexOf('bottom') > -1) {
        // \enclose{bottom} → underline()
        res = addToTypstData(res, { typst: 'underline(' + content + ')' });
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
  const handler = handlers[node.kind] || defHandle;
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
          // Only skip if this is operator-internal spacing (e.g. around \oint)
          // not explicit user spacing (e.g. \, \quad).
          // Operator-internal mstyle nodes are nested inside TeXAtom chains;
          // user spacing sits directly in the top-level inferredMrow.
          let isOperatorSpacing = false;
          let p = node.parent;
          for (let d = 0; d < 10 && p; d++) {
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
      const mathcolor: string = rawColor && rawColor !== '_inherit_' ? rawColor : '';
      const data: ITypstData = handlerApi.handleAll(node, serialize);
      if (mathcolor && data.typst.trim()) {
        res = addToTypstData(res, {
          typst: '#text(fill: ' + mathcolor + ')[' + data.typst.trim() + ']'
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
