import { TEXCLASS } from "mathjax-full/js/core/MmlTree/MmlNode";
import {
  ITypstData, HandlerFn, MathNode,
  FracAttrs, PaddedAttrs, EncloseAttrs, StyleAttrs,
} from "./types";
import {
  RE_TRAILING_SPACING, SHALLOW_TREE_MAX_DEPTH, TEX_ATOM,
  OPEN_BRACKETS, CLOSE_BRACKETS,
  DOUBLE_VERT, LEFT_FLOOR, RIGHT_FLOOR, LEFT_CEIL, RIGHT_CEIL,
  BOX_STROKE, BOX_INSET,
} from "./consts";
import {
  initTypstData, addToTypstData, addSpaceToTypstData,
  getNodeText, getAttrs, getProp, getContentChildren,
  typstPlaceholder, serializeThousandSepChain, serializeCombiningMiChain, needsTokenSeparator, needsSpaceBetweenNodes,
  handleAll, isNegationOverlay,
} from "./common";
import {
  escapeContentSeparators, hasTopLevelSeparators,
  escapeLrSemicolons, escapeLrBrackets, escapeUnbalancedParens,
} from "./escape-utils";
import { mapDelimiter, escapeLrDelimiter } from "./bracket-utils";

/** Max ancestor levels to walk when checking script/TeXAtom context.
 *  Typical MathML nesting (mrow/TeXAtom/inferredMrow) rarely exceeds 6–8 levels. */
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
    if (p.kind === TEX_ATOM) return true;
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

const containsTable = (child: MathNode): boolean => {
  if (child.kind === 'mtable') return true;
  if (child.isInferred && child.childNodes) {
    return child.childNodes.some(c => c.kind === 'mtable');
  }
  return false;
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
  // If this mrow wraps ONLY a matrix (no other content besides delimiter mo's),
  // let mtable handle the delimiters.  When the mrow contains a matrix alongside
  // other nodes (e.g. \left. array \longrightarrow array \right]), we must use
  // the regular lr() path so all content stays inside one lr() call.
  const contentChildren = getContentChildren(node);
  const hasTableChild = contentChildren.length === 1 && containsTable(contentChildren[0]);
  // \left\{ table ... \right. with extra content after the table:
  // the table inherits { as its open delimiter (→ cases()), extra content follows.
  const closeMapped = closeDelim ? mapDelimiter(closeDelim) : '';
  const hasTableFirst = !hasTableChild && contentChildren.length > 1
    && containsTable(contentChildren[0]) && openDelim && !closeMapped;
  if (isLeftRight && !hasTableChild && !hasTableFirst) {
    // Serialize inner children, skipping the delimiter mo nodes
    // (delimiters are reconstructed from the open/close properties)
    let content = '';
    let contentInline = '';
    let hasInlineDiff = false;
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
      const inlineTypst = data.typst_inline ?? data.typst;
      if (inlineTypst !== data.typst) hasInlineDiff = true;
      // prevNode may be the skipped opening delimiter mo —
      // safe because mo is not in SCRIPT_NODE_KINDS.
      const prevNode = i > 0 ? node.childNodes[i - 1] : null;
      if (needsSpaceBetweenNodes(content, data.typst, prevNode)) {
        content += ' ';
      }
      if (needsSpaceBetweenNodes(contentInline, inlineTypst, prevNode)) {
        contentInline += ' ';
      }
      content += data.typst;
      contentInline += inlineTypst;
    }
    const open = openDelim ? mapDelimiter(openDelim) : '';
    const close = closeDelim ? mapDelimiter(closeDelim) : '';
    const hasVisibleOpen = !!open;
    const hasVisibleClose = !!close;
    // Build lr() expression from content string
    // Collect which ASCII bracket chars match the lr() delimiters —
    // only these need escaping inside lr() to prevent auto-scaling.
    const lrBracketChars = new Set<string>();
    for (const d of [openDelim, closeDelim]) {
      if (d && (d in OPEN_BRACKETS || d in CLOSE_BRACKETS)) {
        lrBracketChars.add(d);
        const peer = OPEN_BRACKETS[d] ?? CLOSE_BRACKETS[d];
        if (peer) lrBracketChars.add(peer);
      }
    }
    const escBr = (s: string): string =>
      lrBracketChars.size > 0 ? escapeLrBrackets(s, lrBracketChars) : s;
    const buildLrExpr = (cnt: string): string => {
      if (hasVisibleOpen && hasVisibleClose) {
        const trimmed = cnt.trim();
        const hasSep = hasTopLevelSeparators(trimmed);
        if (openDelim === '|' && closeDelim === '|') {
          const escaped = escapeLrSemicolons(escBr(trimmed));
          return hasSep ? `lr(| ${escaped} |)` : `abs(${escapeContentSeparators(trimmed)})`;
        } else if (openDelim === DOUBLE_VERT && closeDelim === DOUBLE_VERT) {
          const escaped = escapeLrSemicolons(escBr(trimmed));
          return hasSep ? `lr(‖ ${escaped} ‖)` : `norm(${escapeContentSeparators(trimmed)})`;
        } else if (openDelim === LEFT_FLOOR && closeDelim === RIGHT_FLOOR) {
          const escaped = escapeLrSemicolons(escBr(trimmed));
          return hasSep ? `lr(⌊ ${escaped} ⌋)` : `floor(${escapeContentSeparators(trimmed)})`;
        } else if (openDelim === LEFT_CEIL && closeDelim === RIGHT_CEIL) {
          const escaped = escapeLrSemicolons(escBr(trimmed));
          return hasSep ? `lr(⌈ ${escaped} ⌉)` : `ceil(${escapeContentSeparators(trimmed)})`;
        } else {
          const escapedOpen = (openDelim in OPEN_BRACKETS && OPEN_BRACKETS[openDelim] !== closeDelim)
            ? '\\' + openDelim : open;
          const escapedClose = (closeDelim in CLOSE_BRACKETS && CLOSE_BRACKETS[closeDelim] !== openDelim)
            ? '\\' + closeDelim : close;
          return `lr(${escapedOpen} ${escapeLrSemicolons(escBr(trimmed))} ${escapedClose})`;
        }
      } else {
        const trimmed = cnt.trim();
        const openEsc = openDelim ? escapeLrDelimiter(openDelim) : '';
        const closeEsc = closeDelim ? escapeLrDelimiter(closeDelim) : '';
        if (openEsc) {
          return `lr(${openEsc} ${escapeLrSemicolons(escBr(trimmed))})`;
        } else if (closeEsc) {
          return `lr(${escapeLrSemicolons(escBr(trimmed))} ${closeEsc})`;
        } else {
          return trimmed;
        }
      }
    };
    const lrTypst = buildLrExpr(content);
    if (hasInlineDiff) {
      res = addToTypstData(res, { typst: lrTypst, typst_inline: buildLrExpr(contentInline) });
    } else {
      res = addToTypstData(res, { typst: lrTypst });
    }
  } else if (isLeftRight && (hasTableChild || hasTableFirst)) {
    // Matrix/cases inside \left...\right: skip delimiter mo children
    // (the mtable handler uses the parent mrow's open/close properties for delimiters).
    // When hasTableFirst, the close delimiter is invisible (\right.) and extra
    // content follows the table — serialize it normally after the table.
    let contentInline = '';
    let hasInlineDiff = false;
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
      const inlineTypst = data.typst_inline ?? data.typst;
      if (inlineTypst !== data.typst) hasInlineDiff = true;
      const prevNode = i > 0 ? node.childNodes[i - 1] : null;
      if (needsSpaceBetweenNodes(res.typst, data.typst, prevNode)) {
        addSpaceToTypstData(res);
      }
      if (needsSpaceBetweenNodes(contentInline, inlineTypst, prevNode)) {
        contentInline += ' ';
      }
      res = addToTypstData(res, data);
      contentInline += inlineTypst;
    }
    if (hasInlineDiff) {
      res.typst_inline = contentInline;
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
      const chain = serializeThousandSepChain(node, i, serialize);
      if (chain) {
        if (needsTokenSeparator(res.typst, chain.typst)) {
          addSpaceToTypstData(res);
        }
        res = addToTypstData(res, { typst: chain.typst });
        i = chain.nextIndex - 1; // -1 because the for-loop will i++
        continue;
      }
      // Combining-mark chain: consecutive mi nodes with combining chars (Devanagari, etc.)
      const combChain = serializeCombiningMiChain(node, i);
      if (combChain) {
        if (needsTokenSeparator(res.typst, combChain.typst)) {
          addSpaceToTypstData(res);
        }
        res = addToTypstData(res, { typst: combChain.typst });
        i = combChain.nextIndex - 1;
        continue;
      }
      const child = node.childNodes[i];
      // \not negation overlay: wrap next sibling in cancel()
      if (isNegationOverlay(child) && i + 1 < node.childNodes.length) {
        const nextData: ITypstData = serialize.visitNode(node.childNodes[i + 1], '');
        const cancelTypst = `cancel(${escapeContentSeparators(escapeUnbalancedParens(nextData.typst.trim()))})`;
        if (needsSpaceBetweenNodes(res.typst, cancelTypst, i > 0 ? node.childNodes[i - 1] : null)) {
          addSpaceToTypstData(res);
        }
        res = addToTypstData(res, { typst: cancelTypst });
        i++; // skip the consumed sibling
        continue;
      }
      const data: ITypstData = serialize.visitNode(child, '');
      if (needsSpaceBetweenNodes(res.typst, data.typst, i > 0 ? node.childNodes[i - 1] : null)) {
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
  const isZeroWidth = atr.width === 0 || atr.width === '0';
  const isZeroHeight = atr.height === 0 || atr.height === '0';
  if ((isZeroWidth || isZeroHeight) && hasPhantomChild(node)
    && (hasScriptAncestor(node) || hasAdjacentTripledashStyle(node))) {
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

/** Word-boundary safe check for space-separated menclose notation keywords.
 *  Converts notation to a Set once, then lookups are O(1). */
const parseNotation = (notation: string): Set<string> =>
  new Set(notation.split(/\s+/).filter(Boolean));

/** Check if a parsed notation set contains a keyword. */
const hasNotation = (words: Set<string>, keyword: string): boolean =>
  words.has(keyword);

/** Border-side keywords recognised in menclose notation. */
const BORDER_SIDES = ['top', 'bottom', 'left', 'right'] as const;

/** Check if the notation contains at least two border-side keywords,
 *  indicating a selective box stroke (e.g. "left right top" from \begin{array}{|l|}\hline).
 *  Single-side notations ("top" only or "bottom" only) keep the existing
 *  overline/underline path for non-table contexts. */
const hasBorderNotation = (words: Set<string>): boolean => {
  let count = 0;
  for (const side of BORDER_SIDES) {
    if (words.has(side)) count++;
  }
  return count >= 2;
};

/** Build Typst stroke dictionary entries from notation keywords.
 *  E.g. {top, left, right} → "top: 0.5pt, bottom: 0pt, left: 0.5pt, right: 0.5pt" */
const buildStrokeSides = (words: Set<string>): string =>
  BORDER_SIDES.map(side =>
    `${side}: ${words.has(side) ? BOX_STROKE : '0pt'}`
  ).join(', ');

export const menclose: HandlerFn = (node, serialize) => {
  let res: ITypstData = initTypstData();
  const atr = getAttrs<EncloseAttrs>(node);
  const notation = atr.notation?.toString() || '';
  const words = parseNotation(notation);
  const data: ITypstData = handleAll(node, serialize);
  const content = typstPlaceholder(data.typst.trim());
  if (hasNotation(words, 'box')) {
    // \boxed → #box with stroke
    res = addToTypstData(res, { typst: `#align(center, box(stroke: ${BOX_STROKE}, inset: ${BOX_INSET}, $${content}$))`, typst_inline: content });
  } else if (hasNotation(words, 'updiagonalstrike') || hasNotation(words, 'downdiagonalstrike')) {
    // \cancel uses updiagonalstrike → Typst cancel() default
    // \bcancel uses downdiagonalstrike → Typst cancel(inverted: #true)
    // \xcancel uses both → Typst cancel(cross: #true)
    const escaped = escapeContentSeparators(escapeUnbalancedParens(content));
    if (hasNotation(words, 'updiagonalstrike') && hasNotation(words, 'downdiagonalstrike')) {
      res = addToTypstData(res, { typst: `cancel(cross: #true, ${escaped})` });
    } else if (hasNotation(words, 'downdiagonalstrike')) {
      res = addToTypstData(res, { typst: `cancel(inverted: #true, ${escaped})` });
    } else {
      res = addToTypstData(res, { typst: `cancel(${escaped})` });
    }
  } else if (hasNotation(words, 'horizontalstrike')) {
    res = addToTypstData(res, { typst: `cancel(${escapeContentSeparators(escapeUnbalancedParens(content))})` });
  } else if (hasNotation(words, 'longdiv')) {
    // \longdiv / \enclose{longdiv} → overline(lr(\) content))
    // lr(\) ...) makes the ) delimiter stretch to match content height
    res = addToTypstData(res, { typst: `overline(lr(\\) ${escapeContentSeparators(escapeUnbalancedParens(content))}))` });
  } else if (hasNotation(words, 'circle')) {
    // \enclose{circle} → #circle with inset
    res = addToTypstData(res, { typst: `#align(center, circle(inset: ${BOX_INSET}, $${content}$))`, typst_inline: content });
  } else if (hasNotation(words, 'radical')) {
    // \enclose{radical} → sqrt()
    res = addToTypstData(res, { typst: `sqrt(${escapeContentSeparators(escapeUnbalancedParens(content))})` });
  } else if (hasBorderNotation(words)) {
    // \begin{array}{|l|} \hline ... → menclose with notation="left right top" etc.
    // Generate #box(stroke: (...)) with selective strokes for the specified sides.
    const sides = buildStrokeSides(words);
    res = addToTypstData(res, {
      typst: `#align(center, box(stroke: (${sides}), inset: ${BOX_INSET}, $ ${content} $))`,
      typst_inline: content,
    });
  } else if (hasNotation(words, 'top')) {
    // \enclose{top} → overline()
    res = addToTypstData(res, { typst: `overline(${escapeContentSeparators(escapeUnbalancedParens(content))})` });
  } else if (hasNotation(words, 'bottom')) {
    // \enclose{bottom} → underline()
    // Detect \smash{)} prefix (used in \lcm macro): strip leading ) or \), trailing spacing
    // lr(\) ...) makes the ) delimiter stretch to match content height
    if (content.startsWith(')') || content.startsWith('\\)')) {
      const skip = content.startsWith('\\)') ? 2 : 1;
      let inner = content.slice(skip).trim().replace(RE_TRAILING_SPACING, '');
      res = addToTypstData(res, { typst: `underline(lr(\\) ${escapeContentSeparators(inner)}))` });
    } else {
      res = addToTypstData(res, { typst: `underline(${escapeContentSeparators(escapeUnbalancedParens(content))})` });
    }
  } else {
    // Unknown notation: pass through content
    res = addToTypstData(res, data);
  }
  return res;
};

// mhchem \tripledash: mstyle(mathsize<1em) containing only mtext("-") and mspace.
// Detect and replace dashes with Typst `hyph` symbols.
const QUOTED_DASH_GLOBAL = /"-"/g;
const isTripledashStyle = (node: MathNode): boolean => {
  const atr = getAttrs<StyleAttrs>(node);
  const ms = atr.mathsize;
  if (!ms || (typeof ms === 'string' ? parseFloat(ms) >= 1 : ms >= 1)) return false;
  const children = node.childNodes?.[0]?.childNodes ?? node.childNodes ?? [];
  let dashCount = 0;
  for (const child of children) {
    if (child.kind === 'mspace') continue;
    if (child.kind === 'mtext') { dashCount++; continue; }
    return false;
  }
  return dashCount > 0;
};

/** Recursively check if a subtree contains a tripledash mstyle (shallow). */
const containsTripledashStyle = (node: MathNode, depth = 0): boolean => {
  if (depth > SHALLOW_TREE_MAX_DEPTH) return false;
  if (node.kind === 'mstyle' && isTripledashStyle(node)) return true;
  if (node.childNodes) {
    for (const child of node.childNodes) {
      if (containsTripledashStyle(child, depth + 1)) return true;
    }
  }
  return false;
};

/** Check if a sibling (up to 2 parent levels) contains a tripledash mstyle.
 *  Used by mpadded to suppress the #hide() phantom preceding tripledash. */
const hasAdjacentTripledashStyle = (node: MathNode): boolean => {
  let cur: MathNode | null = node;
  for (let depth = 0; depth < 3 && cur; depth++) {
    const parent = cur.parent;
    if (!parent?.childNodes) { cur = parent; continue; }
    for (const sibling of parent.childNodes) {
      if (sibling === cur) continue;
      if (containsTripledashStyle(sibling)) return true;
    }
    cur = parent;
  }
  return false;
};

export const mstyle: HandlerFn = (node, serialize) => {
  let res: ITypstData = initTypstData();
  if (isOperatorInternalSpacing(node)) {
    return res;
  }
  // mhchem \tripledash pattern: tiny dashes → hyph symbols
  if (isTripledashStyle(node)) {
    const data: ITypstData = handleAll(node, serialize);
    const content = data.typst.trim();
    const replaced = content.replace(QUOTED_DASH_GLOBAL, 'hyph');
    if (replaced !== content) {
      res = addToTypstData(res, { typst: replaced });
      return res;
    }
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
