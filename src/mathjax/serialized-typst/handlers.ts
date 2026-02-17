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
      return /\w$/.test(prevTypst);
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
    if (node.parent && (node.parent as any).kind === 'msubsup') {
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
      return /^\w/.test(nextTypst);
    }
    return false;
  } catch (e) {
    return false;
  }
};

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
      let typstValue: string = findTypstSymbol(value);
      // Apply font wrapping if mathvariant is set and not the default italic
      // Skip font wrapping for known symbols (e.g. \infty with mathvariant="normal")
      if (mathvariant && mathvariant !== 'italic' && !isKnownSymbol) {
        const fontFn = typstFontMap.get(mathvariant);
        if (fontFn) {
          typstValue = fontFn + '(' + typstValue + ')';
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
        const spaceAfter = needSpaceAfter(node) ? ' ' : '';
        res = addToTypstData(res, { typst: spaceBefore + typstValue + spaceAfter });
      } else if (!inScript && SPACED_OPERATORS.has(value)) {
        // Common binary/relational operators: add spaces
        res = addToTypstData(res, { typst: ' ' + typstValue + ' ' });
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
      // In Typst math, text is wrapped in double quotes
      res = addToTypstData(res, { typst: '"' + value + '"' });
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
      // Check for linethickness="0" which indicates \binom
      const atr = getAttributes(node);
      if (atr && atr.linethickness === '0') {
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

// --- MSUP handler: superscripts ---
const msup = () => {
  return (node, serialize): ITypstData => {
    let res: ITypstData = initTypstData();
    try {
      const firstChild = node.childNodes[0] || null;
      const secondChild = node.childNodes[1] || null;
      const dataFirst: ITypstData = firstChild ? serialize.visitNode(firstChild, '') : initTypstData();
      const dataSecond: ITypstData = secondChild ? serialize.visitNode(secondChild, '') : initTypstData();
      const sup = dataSecond.typst.trim();
      res = addToTypstData(res, { typst: dataFirst.typst });
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
      res = addToTypstData(res, { typst: dataFirst.typst });
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
      res = addToTypstData(res, { typst: dataFirst.typst });
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
          // Known accent: use Typst accent function
          res = addToTypstData(res, {
            typst: accentFn + '(' + dataFirst.typst.trim() + ')'
          });
          return res;
        }
      }
      // Fallback: base^(over) — e.g. for stackrel/overset
      const base = dataFirst.typst.trim();
      const over = dataSecond.typst.trim();
      if (over) {
        res = addToTypstData(res, { typst: base });
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
        const accentFn = typstAccentMap.get(accentChar);
        if (accentFn) {
          res = addToTypstData(res, {
            typst: accentFn + '(' + dataFirst.typst.trim() + ')'
          });
          return res;
        }
      }
      // Fallback: base_(under)
      const base = dataFirst.typst.trim();
      const under = dataSecond.typst.trim();
      if (under) {
        res = addToTypstData(res, { typst: base });
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
      // Emit: base_(under)^(over)
      res = addToTypstData(res, { typst: base });
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
    case '\u2016': return '"‖"'; // double vertical bar
    case '\u2225': return '"‖"'; // parallel
    default: return '"' + delim + '"';
  }
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
      // Determine if this is an equation array (align, gather, split, etc.)
      const isEqnArray = node.childNodes.length > 0
        && node.childNodes[0].attributes?.get('displaystyle');
      // Build rows
      const rows: string[] = [];
      for (let i = 0; i < countRow; i++) {
        const mtrNode = node.childNodes[i];
        const countColl = mtrNode.childNodes?.length || 0;
        const cells: string[] = [];
        for (let j = 0; j < countColl; j++) {
          const mtdNode = mtrNode.childNodes[j];
          const cellData: ITypstData = serialize.visitNode(mtdNode, '');
          cells.push(cellData.typst.trim());
        }
        if (isEqnArray) {
          // For equation arrays (align, gather, etc.), join cells with spaces
          rows.push(cells.join(' '));
        } else {
          rows.push(cells.join(', '));
        }
      }
      if (isEqnArray) {
        // Equation arrays: emit rows separated by newlines (\ in Typst math)
        res = addToTypstData(res, { typst: rows.join(' \\\n') });
      } else if (isCases) {
        // Cases environment
        res = addToTypstData(res, { typst: 'cases(' + rows.join(', ') + ')' });
      } else {
        // Matrix: mat(delim: ..., a, b; c, d)
        let matContent = rows.join('; ');
        if (branchOpen || branchClose) {
          const delimStr = branchOpen ? 'delim: ' + delimiterToTypst(branchOpen) + ', ' : '';
          res = addToTypstData(res, { typst: 'mat(' + delimStr + matContent + ')' });
        } else {
          res = addToTypstData(res, { typst: 'mat(' + matContent + ')' });
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
        // Use lr() for auto-sizing delimiters
        let content = '';
        for (let i = 0; i < node.childNodes.length; i++) {
          const data: ITypstData = serialize.visitNode(node.childNodes[i], '');
          content += data.typst;
        }
        // Map delimiter characters to Typst
        let open = openDelim || '';
        let close = closeDelim || '';
        // Handle invisible delimiters (empty string from \left. or \right.)
        if (hasOpen && !openDelim) {
          open = '#none';
        }
        if (hasClose && !closeDelim) {
          close = '#none';
        }
        // Map Unicode delimiters
        if (open) { open = mapDelimiter(open); }
        if (close) { close = mapDelimiter(close); }
        res = addToTypstData(res, { typst: 'lr(' + open + ' ' + content.trim() + ' ' + close + ')' });
      } else {
        // Regular mrow: just concatenate children
        for (let i = 0; i < node.childNodes.length; i++) {
          const data: ITypstData = serialize.visitNode(node.childNodes[i], '');
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

// --- MENCLOSE handler: cancel, strikethrough ---
const menclose = () => {
  return (node, serialize): ITypstData => {
    let res: ITypstData = initTypstData();
    try {
      const atr = getAttributes(node);
      const notation: string = atr?.notation?.toString() || '';
      const data: ITypstData = handlerApi.handleAll(node, serialize);
      const content = data.typst.trim();
      if (notation.indexOf('updiagonalstrike') > -1 || notation.indexOf('downdiagonalstrike') > -1) {
        // \bcancel uses updiagonalstrike, \cancel uses downdiagonalstrike
        // In Typst: cancel(x) for \cancel, cancel(inverted: true, x) for \bcancel
        if (notation.indexOf('updiagonalstrike') > -1 && notation.indexOf('downdiagonalstrike') === -1) {
          res = addToTypstData(res, { typst: 'cancel(inverted: true, ' + content + ')' });
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
  mspace: mspace(),
  mtext: mtext(),
  mtable: mtable(),
  mrow: mrow(),
  mtr: mtr(),
  mpadded: mpadded(),
  mroot: mroot(),
  menclose: menclose(),
};
