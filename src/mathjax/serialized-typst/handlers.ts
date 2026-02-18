import { TEXCLASS } from "mathjax-full/js/core/MmlTree/MmlNode";
import { ITypstData, initTypstData, addToTypstData, needsParens } from "./common";
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
      // Note: don't check !mathvariant — MathJax may set a default (e.g. "normal")
      if (node.texClass === TEXCLASS.OP && value.length > 1 && !isKnownOperator) {
        const parentKind = node.parent?.kind;
        const isLimits = parentKind === 'munder' || parentKind === 'mover' || parentKind === 'munderover';
        if (isLimits) {
          typstValue = 'op("' + value + '", limits: #true)';
        } else {
          typstValue = 'op("' + value + '")';
        }
      }
      // \mathrm{d} → dif (differential operator optimization)
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
          res = addToTypstData(res, { typst: fontFn + '(' + value + ')' });
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
      // Check for linethickness=0 which indicates \binom (\choose)
      const atr = getAttributes(node);
      if (atr && (atr.linethickness === '0' || atr.linethickness === 0)) {
        res = addToTypstData(res, { typst: 'binom(' + dataFirst.typst.trim() + ', ' + dataSecond.typst.trim() + ')' });
      } else {
        res = addToTypstData(res, { typst: 'frac(' + dataFirst.typst.trim() + ', ' + dataSecond.typst.trim() + ')' });
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
      // Empty base (e.g. LaTeX ^{x} with no preceding base): use empty
      // upright string as placeholder so Typst has a valid base for ^
      res = addToTypstData(res, { typst: base.trim() ? base : '""' });
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
      res = addToTypstData(res, { typst: base.trim() ? base : '""' });
      res = addToTypstData(res, { typst: '_' });
      if (needsParens(sub)) {
        res = addToTypstData(res, { typst: '(' + sub + ')' });
      } else {
        res = addToTypstData(res, { typst: sub });
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
      res = addToTypstData(res, { typst: base.trim() ? base : '""' });
      res = addToTypstData(res, { typst: '_' });
      if (needsParens(sub)) {
        res = addToTypstData(res, { typst: '(' + sub + ')' });
      } else {
        res = addToTypstData(res, { typst: sub });
      }
      res = addToTypstData(res, { typst: '^' });
      if (needsParens(sup)) {
        res = addToTypstData(res, { typst: '(' + sup + ')' });
      } else {
        res = addToTypstData(res, { typst: sup });
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
      res = addToTypstData(res, { typst: 'sqrt(' + dataFirst.typst.trim() + ')' });
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
      // Typst root: root(index, radicand)
      res = addToTypstData(res, {
        typst: 'root(' + dataIndex.typst.trim() + ', ' + dataRadicand.typst.trim() + ')'
      });
      return res;
    } catch (e) {
      return res;
    }
  };
};

// Typst symbols/functions that natively support limit placement (above/below).
// These don't need limits() wrapping in mover/munder fallback.
const TYPST_NATIVE_LIMIT_OPS: Set<string> = new Set([
  // Named function operators
  ...TYPST_MATH_OPERATORS,
  // Large operators (from symbol map) — excludes integrals since Typst
  // integrals default to scripts, not limits placement
  'sum', 'product',
  'product.co', 'union.big', 'inter.big',
  'dot.o.big', 'plus.o.big', 'times.o.big',
  'union.plus.big', 'union.sq.big',
  'or.big', 'and.big',
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
      if (secondChild && secondChild.kind === 'mo') {
        const accentChar = getChildrenText(secondChild);
        const accentFn = typstAccentMap.get(accentChar);
        if (accentFn) {
          const content = dataFirst.typst.trim();
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
      // Fallback: base^(over) or limits(base)^(over)
      // Use limits() for symbols that DON'T natively support limit placement.
      // Skip limits() when:
      // - Base is a known Typst operator/large operator that already places limits above
      // - Base output is from an accent/brace function that already accepts ^ labels
      const base = dataFirst.typst.trim();
      const over = dataSecond.typst.trim();
      if (over) {
        const baseIsNativeLimitOp = TYPST_NATIVE_LIMIT_OPS.has(base);
        const baseIsSpecialFn = /^(overbrace|underbrace|overline|underline|op)\(/.test(base);
        if (baseIsNativeLimitOp || baseIsSpecialFn) {
          res = addToTypstData(res, { typst: base });
        } else {
          res = addToTypstData(res, { typst: 'limits(' + base + ')' });
        }
        res = addToTypstData(res, { typst: '^' });
        if (needsParens(over)) {
          res = addToTypstData(res, { typst: '(' + over + ')' });
        } else {
          res = addToTypstData(res, { typst: over });
        }
      } else {
        res = addToTypstData(res, { typst: base });
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
      if (secondChild && secondChild.kind === 'mo') {
        const accentChar = getChildrenText(secondChild);
        let accentFn = typstAccentMap.get(accentChar);
        // Flip over-accents to under-accents when used in munder context
        if (accentFn === 'overline') { accentFn = 'underline'; }
        if (accentFn === 'overbrace') { accentFn = 'underbrace'; }
        if (accentFn) {
          const content = dataFirst.typst.trim();
          if (TYPST_ACCENT_SHORTHANDS.has(accentFn)) {
            res = addToTypstData(res, { typst: accentFn + '(' + content + ')' });
          } else {
            res = addToTypstData(res, { typst: 'accent(' + content + ', ' + accentFn + ')' });
          }
          return res;
        }
      }
      // Fallback: base_(under) or limits(base)_(under)
      const base = dataFirst.typst.trim();
      const under = dataSecond.typst.trim();
      if (under) {
        const baseIsNativeLimitOp = TYPST_NATIVE_LIMIT_OPS.has(base);
        const baseIsSpecialFn = /^(overbrace|underbrace|overline|underline|op)\(/.test(base);
        if (baseIsNativeLimitOp || baseIsSpecialFn) {
          res = addToTypstData(res, { typst: base });
        } else {
          res = addToTypstData(res, { typst: 'limits(' + base + ')' });
        }
        res = addToTypstData(res, { typst: '_' });
        if (needsParens(under)) {
          res = addToTypstData(res, { typst: '(' + under + ')' });
        } else {
          res = addToTypstData(res, { typst: under });
        }
      } else {
        res = addToTypstData(res, { typst: base });
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
      const base = dataFirst.typst;
      const under = dataSecond.typst.trim();
      const over = dataThird.typst.trim();
      // Use limits() for non-operator bases (e.g. extensible arrows)
      const baseTrimmed = base.trim();
      const baseIsNativeLimitOp = TYPST_NATIVE_LIMIT_OPS.has(baseTrimmed);
      const baseIsSpecialFn = /^(overbrace|underbrace|overline|underline|op)\(/.test(baseTrimmed);
      if (baseIsNativeLimitOp || baseIsSpecialFn) {
        res = addToTypstData(res, { typst: base });
      } else {
        res = addToTypstData(res, { typst: 'limits(' + baseTrimmed + ')' });
      }
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
      const baseTrimmed = baseData.typst.trim();

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
        // \! → negative thin space
        res = addToTypstData(res, { typst: ' negthin ' });
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

// Detect numcases/subnumcases pattern:
// - All rows are mlabeledtr with 4 children (label + prefix + value + condition)
// - First row's cell[1] contains a visible '{' mo (inside mpadded, outside mphantom)
const isNumcasesTable = (node): boolean => {
  if (!node.childNodes || node.childNodes.length === 0) return false;
  const firstRow = node.childNodes[0];
  if (firstRow.kind !== 'mlabeledtr') return false;
  if (firstRow.childNodes.length < 4) return false;
  // Check that cell[1] (first data column) contains a '{' brace
  const prefixCell = firstRow.childNodes[1];
  return treeContainsMo(prefixCell, '{');
};

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
        // numcases/subnumcases: extract prefix from first row's cell[1], then cases(...)
        const firstRow = node.childNodes[0];
        const prefixCell = firstRow.childNodes[1]; // cell after label
        const prefix = serializePrefixBeforeMo(prefixCell, serialize, '{');
        // Build cases rows from cell[2] (value) and cell[3] (condition) of each row
        const rows: string[] = [];
        for (let i = 0; i < countRow; i++) {
          const mtrNode = node.childNodes[i];
          const startCol = mtrNode.kind === 'mlabeledtr' ? 2 : 1; // skip label + prefix
          const cells: string[] = [];
          for (let j = startCol; j < mtrNode.childNodes.length; j++) {
            const mtdNode = mtrNode.childNodes[j];
            const cellData: ITypstData = serialize.visitNode(mtdNode, '');
            const trimmed = cellData.typst.trim();
            if (trimmed) cells.push(trimmed);
          }
          rows.push(cells.join(' & '));
        }
        const casesContent = 'cases(' + rows.join(', ') + ')';
        if (prefix) {
          res = addToTypstData(res, { typst: prefix + ' ' + casesContent });
        } else {
          res = addToTypstData(res, { typst: casesContent });
        }
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
          // For equation arrays (align, gather, etc.), join cells with spaces
          rows.push(cells.join(' '));
        } else if (isCases) {
          // Cases: cells within a row joined with & for alignment
          rows.push(cells.join(' & '));
        } else {
          rows.push(cells.join(', '));
        }
      }
      if (isEqnArray) {
        // Equation arrays: emit rows separated by newlines (\ in Typst math)
        // Append equation tags from mlabeledtr rows
        const taggedRows: string[] = [];
        for (let i = 0; i < countRow; i++) {
          const mtrNode = node.childNodes[i];
          let rowText = rows[i];
          if (mtrNode.kind === 'mlabeledtr' && mtrNode.childNodes.length > 0) {
            const labelCell = mtrNode.childNodes[0];
            const labelData: ITypstData = serialize.visitNode(labelCell, '');
            const labelText = labelData.typst.trim();
            if (labelText) {
              rowText += ' quad #[' + labelText + ']';
            }
          }
          taggedRows.push(rowText);
        }
        // Single-equation tag: use math.equation with numbering
        if (countRow === 1 && node.childNodes[0].kind === 'mlabeledtr') {
          const mtrNode = node.childNodes[0];
          const labelCell = mtrNode.childNodes[0];
          const labelData: ITypstData = serialize.visitNode(labelCell, '');
          const labelText = labelData.typst.trim();
          // Strip Typst string quotes to get raw text for content block
          const tagContent = labelText.replace(/^"(.*)"$/, '$1');
          if (tagContent) {
            res = addToTypstData(res, {
              typst: '#math.equation(block: true, numbering: n => [' + tagContent + '], $ ' + rows[0] + ' $)'
            });
          } else {
            res = addToTypstData(res, { typst: rows[0] });
          }
        } else {
          // Multi-row: keep quad #[...] fallback for per-row tags
          res = addToTypstData(res, { typst: taggedRows.join(' \\\n') });
        }
      } else if (isCases) {
        // Cases environment
        res = addToTypstData(res, { typst: 'cases(' + rows.join(', ') + ')' });
      } else {
        // Matrix: mat(delim: ..., a, b; c, d)
        let matContent = rows.join('; ');

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
        if (augmentStr) {
          params.push(augmentStr.slice(0, -2)); // remove trailing ", "
        }

        const paramStr = params.length > 0 ? params.join(', ') + ', ' : '';
        const matExpr = 'mat(' + paramStr + matContent + ')';

        if (frame === 'solid') {
          res = addToTypstData(res, { typst: '#box(stroke: 0.5pt, inset: 3pt, $ ' + matExpr + ' $)' });
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
          content += data.typst;
        }
        // Map delimiter characters to Typst
        let open = openDelim ? mapDelimiter(openDelim) : '';
        let close = closeDelim ? mapDelimiter(closeDelim) : '';
        const hasVisibleOpen = !!open;
        const hasVisibleClose = !!close;
        if (hasVisibleOpen && hasVisibleClose) {
          const trimmedContent = content.trim();
          // Optimize common delimiter pairs to Typst functions
          if (openDelim === '|' && closeDelim === '|') {
            res = addToTypstData(res, { typst: 'norm(' + trimmedContent + ')' });
          } else if (openDelim === '\u230A' && closeDelim === '\u230B') {
            // ⌊...⌋ → floor()
            res = addToTypstData(res, { typst: 'floor(' + trimmedContent + ')' });
          } else if (openDelim === '\u2308' && closeDelim === '\u2309') {
            // ⌈...⌉ → ceil()
            res = addToTypstData(res, { typst: 'ceil(' + trimmedContent + ')' });
          } else {
            // General lr() for auto-sizing
            res = addToTypstData(res, { typst: 'lr(' + open + ' ' + trimmedContent + ' ' + close + ')' });
          }
        } else {
          // One or both delimiters invisible: emit directly without lr()
          // (lr() requires balanced parens in Typst syntax)
          const trimmed = content.trim();
          if (hasVisibleOpen) {
            res = addToTypstData(res, { typst: open + ' ' + trimmed });
          } else if (hasVisibleClose) {
            res = addToTypstData(res, { typst: trimmed + ' ' + close });
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
          const data: ITypstData = serialize.visitNode(node.childNodes[i], '');
          if (res.typst && data.typst
            && /^[\w."]/.test(data.typst)
            && !/[\s({[,|]$/.test(res.typst)) {
            res.typst += ' ';
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

// --- MPHANTOM handler: invisible content ---
// Typst math mode has no phantom() equivalent, so drop the content
const mphantom = () => {
  return (_node, _serialize): ITypstData => {
    return initTypstData();
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
      const content = data.typst.trim();
      if (notation.indexOf('box') > -1) {
        // \boxed → #box with stroke
        res = addToTypstData(res, { typst: '#box(stroke: 0.5pt, inset: 3pt, $' + content + '$)' });
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
