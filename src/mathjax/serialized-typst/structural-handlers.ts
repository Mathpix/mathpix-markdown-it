import { TEXCLASS } from "mathjax-full/js/core/MmlTree/MmlNode";
import {
  ITypstData, HandlerFn, MathNode,
  FracAttrs, PaddedAttrs, EncloseAttrs, StyleAttrs,
} from "./types";
import {
  RE_TRAILING_SPACING, SHALLOW_TREE_MAX_DEPTH,
  OPEN_BRACKETS, CLOSE_BRACKETS,
  DOUBLE_VERT, LEFT_FLOOR, RIGHT_FLOOR, LEFT_CEIL, RIGHT_CEIL,
} from "./consts";
import {
  initTypstData, addToTypstData, addSpaceToTypstData,
  getNodeText, getAttrs, getProp,
  typstPlaceholder, isThousandSepComma, needsTokenSeparator, handleAll,
} from "./common";
import {
  escapeContentSeparators, hasTopLevelSeparators,
  escapeLrSemicolons, escapeUnbalancedParens,
} from "./escape-utils";
import { mapDelimiter, escapeLrDelimiter } from "./bracket-utils";

const ANCESTOR_MAX_DEPTH = 10;
const MATHJAX_INHERIT_SENTINEL = '_inherit_';

/** Check if a node subtree contains an mphantom (shallow — up to 5 levels). */
const hasPhantomChild = (node: MathNode): boolean => {
  const check = (n: MathNode, depth: number): boolean => {
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
const hasScriptAncestor = (node: MathNode): boolean => {
  let cur = node?.parent;
  for (let d = 0; d < ANCESTOR_MAX_DEPTH && cur; d++) {
    const k = cur.kind;
    if (k === 'msub' || k === 'msup' || k === 'msubsup' || k === 'mmultiscripts') return true;
    cur = cur.parent;
  }
  return false;
};

/** Check if mstyle contains only operator-internal mspace nodes (inside a TeXAtom chain).
 *  These represent spacing injected by MathJax for compound operators (e.g. \oint)
 *  and should be suppressed. Explicit user spacing (\, \quad) is preserved. */
const isOperatorInternalSpacing = (node: MathNode): boolean => {
  const children = node.childNodes || [];
  if (children.length !== 1 || !children[0].isInferred) return false;
  const innerChildren = children[0].childNodes || [];
  if (innerChildren.length === 0 || !innerChildren.every((child) => child.kind === 'mspace')) {
    return false;
  }
  let p = node.parent;
  for (let d = 0; d < ANCESTOR_MAX_DEPTH && p; d++) {
    if (p.kind === 'math') break;
    if (p.kind === 'TeXAtom') return true;
    p = p.parent;
  }
  return false;
};

/** Wrap a Typst expression in #text(fill: color)[...].
 *  Hex colors (#D61F06) are converted to rgb("...") format. */
const wrapWithColor = (content: string, mathcolor: string): string => {
  const fillValue = mathcolor.startsWith('#')
    ? `rgb("${mathcolor}")`
    : mathcolor;
  return `#text(fill: ${fillValue})[${content}]`;
};

export const mrow: HandlerFn = (node, serialize) => {
  let res: ITypstData = initTypstData();
  const openProp = getProp<string>(node, 'open');
  const closeProp = getProp<string>(node, 'close');
  const hasOpen = openProp !== undefined;
  const hasClose = closeProp !== undefined;
  const openDelim: string = hasOpen ? String(openProp) : '';
  const closeDelim: string = hasClose ? String(closeProp) : '';
  // Check if this mrow has \left...\right delimiters
  const isLeftRight = (hasOpen || hasClose)
    && getProp<number>(node, 'texClass') === TEXCLASS.INNER;
  // If this mrow wraps a matrix, let mtable handle the delimiters
  const hasTableChild = node.childNodes.some(child => {
    if (child.kind === 'mtable') return true;
    // MathJax often wraps mtable in an inferred mrow
    if (child.isInferred && child.childNodes) {
      return child.childNodes.some(c => c.kind === 'mtable');
    }
    return false;
  });
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
        const escaped = escapeLrSemicolons(trimmedContent);
        res = addToTypstData(res, { typst: hasSep
          ? `lr(| ${escaped} |)` : `abs(${trimmedContent})` });
      } else if (openDelim === DOUBLE_VERT && closeDelim === DOUBLE_VERT) {
        const escaped = escapeLrSemicolons(trimmedContent);
        res = addToTypstData(res, { typst: hasSep
          ? `lr(‖ ${escaped} ‖)` : `norm(${trimmedContent})` });
      } else if (openDelim === LEFT_FLOOR && closeDelim === RIGHT_FLOOR) {
        const escaped = escapeLrSemicolons(trimmedContent);
        res = addToTypstData(res, { typst: hasSep
          ? `lr(⌊ ${escaped} ⌋)` : `floor(${trimmedContent})` });
      } else if (openDelim === LEFT_CEIL && closeDelim === RIGHT_CEIL) {
        const escaped = escapeLrSemicolons(trimmedContent);
        res = addToTypstData(res, { typst: hasSep
          ? `lr(⌈ ${escaped} ⌉)` : `ceil(${trimmedContent})` });
      } else {
        // Mismatched ASCII brackets must be escaped: ( [ { start groups, ) closes lr()
        const escapedOpen = (openDelim in OPEN_BRACKETS && OPEN_BRACKETS[openDelim] !== closeDelim)
          ? '\\' + openDelim : open;
        const escapedClose = (closeDelim in CLOSE_BRACKETS && CLOSE_BRACKETS[closeDelim] !== openDelim)
          ? '\\' + closeDelim : close;
        res = addToTypstData(res, { typst: `lr(${escapedOpen} ${escapeLrSemicolons(trimmedContent)} ${escapedClose})` });
      }
    } else {
      // One or both delimiters invisible: wrap visible side in lr()
      const trimmed = content.trim();
      const openEsc = openDelim ? escapeLrDelimiter(openDelim) : '';
      const closeEsc = closeDelim ? escapeLrDelimiter(closeDelim) : '';
      if (openEsc) {
        res = addToTypstData(res, { typst: `lr(${openEsc} ${escapeLrSemicolons(trimmed)})` });
      } else if (closeEsc) {
        res = addToTypstData(res, { typst: `lr(${escapeLrSemicolons(trimmed)} ${closeEsc})` });
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
        const midAtr = getAttrs<FracAttrs>(middle);
        if ((midAtr.linethickness === '0' || midAtr.linethickness === 0)
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
};

export const mpadded: HandlerFn = (node, serialize) => {
  let res: ITypstData = initTypstData();
  const atr = getAttrs<PaddedAttrs>(node);
  // mhchem alignment phantom: mpadded width=0 or height=0 containing mphantom
  // inside msub/msup/msubsup — zero-size alignment box, emit empty string.
  // Only skip inside script ancestors; standalone \hphantom/\vphantom must still produce #hide().
  if ((atr.width === 0 || atr.height === 0) && hasPhantomChild(node) && hasScriptAncestor(node)) {
    return res;
  }
  const data: ITypstData = handleAll(node, serialize);
  const content = data.typst.trim();
  // Handle mathbackground attribute (\colorbox{color}{...})
  const rawBg = atr.mathbackground || '';
  const mathbg: string = rawBg && rawBg !== MATHJAX_INHERIT_SENTINEL ? rawBg : '';
  if (mathbg && content) {
    const fillValue = mathbg.startsWith('#')
      ? `rgb("${mathbg}")`
      : mathbg;
    res = addToTypstData(res, {
      typst: `#highlight(fill: ${fillValue})[$${content}$]`,
      typst_inline: content
    });
    return res;
  }
  res = addToTypstData(res, data);
  return res;
};

export const mphantom: HandlerFn = (node, serialize) => {
  let res: ITypstData = initTypstData();
  const data: ITypstData = handleAll(node, serialize);
  const content = data.typst.trim();
  if (content) {
    res = addToTypstData(res, { typst: `#hide($${content}$)` });
  }
  return res;
};

export const menclose: HandlerFn = (node, serialize) => {
  let res: ITypstData = initTypstData();
  const atr = getAttrs<EncloseAttrs>(node);
  const notation = atr.notation?.toString() || '';
  const data: ITypstData = handleAll(node, serialize);
  const content = typstPlaceholder(data.typst.trim());
  if (notation.includes('box')) {
    // \boxed → #box with stroke
    res = addToTypstData(res, { typst: `#box(stroke: 0.5pt, inset: 3pt, $${content}$)`, typst_inline: content });
  } else if (notation.includes('updiagonalstrike') || notation.includes('downdiagonalstrike')) {
    // \cancel uses updiagonalstrike (lower-left to upper-right) → Typst cancel() default
    // \bcancel uses downdiagonalstrike (upper-left to lower-right) → Typst cancel(inverted: true)
    if (notation.includes('downdiagonalstrike') && !notation.includes('updiagonalstrike')) {
      res = addToTypstData(res, { typst: `cancel(inverted: #true, ${escapeContentSeparators(escapeUnbalancedParens(content))})` });
    } else {
      res = addToTypstData(res, { typst: `cancel(${escapeContentSeparators(escapeUnbalancedParens(content))})` });
    }
  } else if (notation.includes('horizontalstrike')) {
    res = addToTypstData(res, { typst: `cancel(${escapeContentSeparators(escapeUnbalancedParens(content))})` });
  } else if (notation.includes('longdiv')) {
    // \longdiv / \enclose{longdiv} → overline(")" content)
    res = addToTypstData(res, { typst: `overline(")"${escapeContentSeparators(escapeUnbalancedParens(content))})` });
  } else if (notation.includes('circle')) {
    // \enclose{circle} → #circle with inset
    res = addToTypstData(res, { typst: `#circle(inset: 3pt, $${content}$)`, typst_inline: content });
  } else if (notation.includes('radical')) {
    // \enclose{radical} → sqrt()
    res = addToTypstData(res, { typst: `sqrt(${escapeContentSeparators(escapeUnbalancedParens(content))})` });
  } else if (notation.includes('top')) {
    // \enclose{top} → overline()
    res = addToTypstData(res, { typst: `overline(${escapeContentSeparators(escapeUnbalancedParens(content))})` });
  } else if (notation.includes('bottom')) {
    // \enclose{bottom} → underline()
    // Detect \smash{)} prefix (used in \lcm macro): strip leading ) or \), trailing spacing, no space
    if (content.startsWith(')') || content.startsWith('\\)')) {
      const skip = content.startsWith('\\)') ? 2 : 1;
      let inner = content.slice(skip).trim().replace(RE_TRAILING_SPACING, '');
      res = addToTypstData(res, { typst: `underline(")"${escapeContentSeparators(inner)})` });
    } else {
      res = addToTypstData(res, { typst: `underline(${escapeContentSeparators(escapeUnbalancedParens(content))})` });
    }
  } else {
    // Unknown notation: pass through content
    res = addToTypstData(res, data);
  }
  return res;
};

export const mstyle: HandlerFn = (node, serialize) => {
  let res: ITypstData = initTypstData();
  if (isOperatorInternalSpacing(node)) {
    return res;
  }
  const atr = getAttrs<StyleAttrs>(node);
  const rawColor = atr.mathcolor || '';
  const mathcolor: string = rawColor && rawColor !== MATHJAX_INHERIT_SENTINEL ? rawColor : '';
  const rawBg = atr.mathbackground || '';
  const mathbg: string = rawBg && rawBg !== MATHJAX_INHERIT_SENTINEL ? rawBg : '';
  const data: ITypstData = handleAll(node, serialize);
  const content = data.typst.trim();
  // Handle mathbackground (same as mpadded colorbox)
  if (mathbg && content) {
    const fillValue = mathbg.startsWith('#') ? `rgb("${mathbg}")` : mathbg;
    let typst = `#highlight(fill: ${fillValue})[$${content}$]`;
    if (mathcolor) {
      typst = wrapWithColor(typst, mathcolor);
    }
    res = addToTypstData(res, { typst, typst_inline: content });
    return res;
  }
  if (mathcolor && content) {
    res = addToTypstData(res, { typst: wrapWithColor(content, mathcolor) });
    return res;
  }
  return data;
};
