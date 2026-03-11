import { MmlVisitor } from 'mathjax-full/js/core/MmlTree/MmlVisitor.js';
import { TextNode, XMLNode, TEXCLASS } from 'mathjax-full/js/core/MmlTree/MmlNode.js';
import { handle } from './handlers';
import { ITypstData, ITypstSerializer, MathNode } from './types';
import {
  DATA_PRE_CONTENT, DATA_POST_CONTENT,
  LEFT_FLOOR, RIGHT_FLOOR, LEFT_CEIL, RIGHT_CEIL,
  DOUBLE_VERT, LEFT_CHEVRON, RIGHT_CHEVRON,
  LEFT_ANGLE_OLD, RIGHT_ANGLE_OLD,
  INTEGRAL_SIGN, MIDLINE_ELLIPSIS,
} from './consts';
import {
  addToTypstData, addSpaceToTypstData, initTypstData,
  serializeThousandSepChain, formatScript, needsTokenSeparator, needsSpaceBetweenNodes,
  getChildText, getAttrs, isNegationOverlay,
} from './common';
import { findTypstSymbol } from './typst-symbol-map';

// Node kinds that carry sub/sup scripts (used in \idotsint pattern detection).
const SCRIPT_KINDS: ReadonlySet<string> = new Set(['msubsup', 'msub', 'msup']);

// Map of opening delimiter char → expected close char + Typst output format.
const BARE_DELIM_PAIRS: Readonly<Record<string, { close: string; typstOpen: string; typstClose: string }>> = {
  '|':              { close: '|',              typstOpen: 'lr(| ',          typstClose: ' |)' },
  [LEFT_FLOOR]:     { close: RIGHT_FLOOR,      typstOpen: 'floor(',         typstClose: ')' },
  [LEFT_CEIL]:      { close: RIGHT_CEIL,       typstOpen: 'ceil(',          typstClose: ')' },
  [DOUBLE_VERT]:    { close: DOUBLE_VERT,      typstOpen: 'norm(',          typstClose: ')' },
  [LEFT_CHEVRON]:   { close: RIGHT_CHEVRON,    typstOpen: 'lr(chevron.l ',  typstClose: ' chevron.r)' },
  [LEFT_ANGLE_OLD]: { close: RIGHT_ANGLE_OLD,  typstOpen: 'lr(chevron.l ',  typstClose: ' chevron.r)' },
};

interface BigDelimInfo { delim: string; size: string; isOpen: boolean }

// Extract big delimiter info from a TeXAtom node wrapping a sized mo.
// The TeXAtom itself may have texClass=0 (ORD); the OPEN/CLOSE class
// is on the inner inferredMrow or mo node.
// Returns { delim, size, isOpen } if found, or null.
const getBigDelimInfo = (node: MathNode): BigDelimInfo | null => {
  try {
    if (node.kind !== 'TeXAtom') return null;
    // TeXAtom > inferredMrow > mo(minsize/maxsize)
    const inferred = node.childNodes?.[0];
    if (!inferred || !inferred.isInferred) return null;
    const mo = inferred.childNodes?.[0];
    if (!mo || mo.kind !== 'mo') return null;
    const atr = getAttrs<{ minsize?: string }>(mo);
    if (!atr.minsize) return null;
    // Check if this is OPEN or CLOSE via the mo or inferredMrow texClass
    const tc = mo.texClass ?? inferred.texClass ?? node.texClass;
    if (tc !== TEXCLASS.OPEN && tc !== TEXCLASS.CLOSE) return null;
    const delim = getChildText(mo);
    return { delim, size: String(atr.minsize), isOpen: tc === TEXCLASS.OPEN };
  } catch (_e: unknown) {
    return null;
  }
};

// Return the text content of a single-mo node (bare mo, mrow or TeXAtom wrapping one mo).
// Used to detect delimiter characters like |, ⌊, ⌋, ⌈, ⌉, ‖, ⟨, ⟩.
const getDelimiterChar = (node: MathNode): string | null => {
  try {
    let moNode: MathNode | null = null;
    if (node?.kind === 'mo') {
      moNode = node;
    } else if (node?.kind === 'mrow' || node?.kind === 'TeXAtom') {
      let children = node.childNodes;
      if (children?.length === 1 && children[0].isInferred) {
        children = children[0].childNodes;
      }
      if (children?.length === 1 && children[0].kind === 'mo') {
        moNode = children[0];
      }
    }
    return moNode ? (getChildText(moNode) || null) : null;
  } catch (_e: unknown) {
    return null;
  }
};

// Check if node is msub/msup/msubsup whose BASE is a closing delimiter.
// Returns the delimiter char if found, null otherwise.
// Used to detect \|x\|_2 where the closing ‖ is inside msub(‖, 2).
const getScriptedDelimiterChar = (node: MathNode): string | null => {
  try {
    const k = node?.kind;
    if (k === 'msub' || k === 'msup' || k === 'msubsup') {
      return getDelimiterChar(node.childNodes?.[0]);
    }
    return null;
  } catch (_e: unknown) {
    return null;
  }
};

/** Check if a child node is a tagged eqnArray mtable. */
const isTaggedEqnArray = (child: MathNode): boolean => {
  if (child.kind !== 'mtable') return false;
  const isEqnArray = child.childNodes.length > 0
    && child.childNodes[0].attributes?.get('displaystyle') === true;
  return isEqnArray && child.childNodes.some((c) => c.kind === 'mlabeledtr');
};

/** Result of a successful pattern match in visitInferredMrowNode. */
interface PatternResult {
  typst: string;
  nextJ: number;
}

/** Serialize content between two sibling indices, joining with token separators. */
const serializeRange = (
  node: MathNode, from: number, to: number,
  space: string, serialize: ITypstSerializer
): string => {
  let content = '';
  for (let k = from; k < to; k++) {
    const innerData = serialize.visitNode(node.childNodes[k], space);
    if (needsTokenSeparator(content, innerData.typst)) content += ' ';
    content += innerData.typst;
  }
  return content;
};

/** Serialize and append sub/sup scripts from a script node (msub, msup, msubsup). */
const appendScripts = (
  base: string, scriptNode: MathNode, space: string, serialize: ITypstSerializer
): string => {
  let result = base;
  const kind = scriptNode.kind;
  if ((kind === 'msub' || kind === 'msubsup') && scriptNode.childNodes[1]) {
    const sub = serialize.visitNode(scriptNode.childNodes[1], space).typst.trim();
    if (sub) result += formatScript('_', sub);
  }
  const supNode = kind === 'msup' ? scriptNode.childNodes[1]
    : kind === 'msubsup' ? scriptNode.childNodes[2] : null;
  if (supNode) {
    const sup = serialize.visitNode(supNode, space).typst.trim();
    if (sup) result += formatScript('^', sup);
  }
  return result;
};

/** Big delimiter pattern: TeXAtom(OPEN) ... TeXAtom(CLOSE) with sized mo (\big, \Big, etc.) */
const tryBigDelimiterPattern = (
  node: MathNode, j: number, space: string, serialize: ITypstSerializer
): PatternResult | null => {
  const openInfo = getBigDelimInfo(node.childNodes[j]);
  if (!openInfo || !openInfo.isOpen) return null;
  let closeIdx = -1;
  let closeInfo: BigDelimInfo | null = null;
  for (let k = j + 1; k < node.childNodes.length; k++) {
    const candidate = getBigDelimInfo(node.childNodes[k]);
    if (candidate && !candidate.isOpen) {
      closeIdx = k;
      closeInfo = candidate;
      break;
    }
  }
  if (closeIdx < 0 || !closeInfo) return null;
  const content = serializeRange(node, j + 1, closeIdx, space, serialize);
  const openDelim = findTypstSymbol(openInfo.delim);
  const closeDelim = findTypstSymbol(closeInfo.delim);
  return {
    typst: `lr(size: #${openInfo.size}, ${openDelim} ${content.trim()} ${closeDelim})`,
    nextJ: closeIdx + 1,
  };
};

/** Bare delimiter pairing: |...|, ⌊...⌋, ⌈...⌉, ‖...‖, ⟨...⟩ without \left...\right.
 *  Also detects closing delimiters inside msub/msup/msubsup (e.g. \|x\|_2 → norm(x)_2). */
const tryBareDelimiterPattern = (
  node: MathNode, j: number, space: string, serialize: ITypstSerializer
): PatternResult | null => {
  const delimChar = getDelimiterChar(node.childNodes[j]);
  const delimPair = delimChar ? BARE_DELIM_PAIRS[delimChar] : undefined;
  if (!delimPair) return null;
  // For symmetric delimiters, skip inside TeXAtom groups
  if (delimChar === delimPair.close && node.parent?.kind === 'TeXAtom') return null;
  let closeIdx = -1;
  let closeIsScripted = false;
  for (let k = j + 1; k < node.childNodes.length; k++) {
    if (getDelimiterChar(node.childNodes[k]) === delimPair.close) {
      closeIdx = k;
      break;
    }
    if (getScriptedDelimiterChar(node.childNodes[k]) === delimPair.close) {
      closeIdx = k;
      closeIsScripted = true;
      break;
    }
  }
  if (closeIdx <= j + 1) return null; // need at least one node between delimiters
  const content = serializeRange(node, j + 1, closeIdx, space, serialize);
  let delimExpr = `${delimPair.typstOpen}${content.trim()}${delimPair.typstClose}`;
  // When the closing delimiter is inside a script node (e.g. ‖_2),
  // extract and append the script parts to the delimited expression.
  if (closeIsScripted) {
    delimExpr = appendScripts(delimExpr, node.childNodes[closeIdx], '', serialize);
  }
  return { typst: delimExpr, nextJ: closeIdx + 1 };
};

/** \idotsint pattern: mo(∫) mo(⋯) scripted(mo(∫)) → lr(integral dots.c integral)_sub^sup */
const tryIdotsintPattern = (
  node: MathNode, j: number, space: string, serialize: ITypstSerializer
): PatternResult | null => {
  const child = node.childNodes[j];
  if (child?.kind !== 'mo' || getChildText(child) !== INTEGRAL_SIGN) return null;
  const next1 = node.childNodes[j + 1];
  const next2 = node.childNodes[j + 2];
  if (!next1 || next1.kind !== 'mo' || getChildText(next1) !== MIDLINE_ELLIPSIS || !next2) return null;
  const scriptBase = next2.childNodes?.[0];
  if (!SCRIPT_KINDS.has(next2.kind) || scriptBase?.kind !== 'mo' || getChildText(scriptBase) !== INTEGRAL_SIGN) return null;
  // Serialize the three base parts
  const part1 = serialize.visitNode(child, space);
  const part2 = serialize.visitNode(next1, space);
  const part3 = findTypstSymbol(INTEGRAL_SIGN);
  // Build base: "integral dots.c integral"
  let baseContent = part1.typst;
  if (needsTokenSeparator(baseContent, part2.typst)) baseContent += ' ';
  baseContent += part2.typst;
  if (needsTokenSeparator(baseContent, part3)) baseContent += ' ';
  baseContent += part3;
  const typst = appendScripts(`lr(${baseContent.trim()})`, next2, '', serialize);
  return { typst, nextJ: j + 3 };
};

/** Thousand separator chain: mn, mo(,), mn(3 digits) → 1\,000\,000 */
const tryThousandSepPattern = (
  node: MathNode, j: number, _space: string, serialize: ITypstSerializer
): PatternResult | null => {
  const chain = serializeThousandSepChain(node, j, serialize);
  if (!chain) return null;
  return { typst: chain.typst, nextJ: chain.nextIndex };
};

export interface ITypstVisitorOptions {
  [key: string]: unknown;
}

export class SerializedTypstVisitor extends MmlVisitor {
  constructor(public readonly options: ITypstVisitorOptions = {}) {
    super();
  }

  public visitTree(node: MathNode): ITypstData {
    return this.visitNode(node, '');
  }

  // Parent AbstractVisitor forces ...args: any[] signature
  public visitNode(node: MathNode, ...args: any[]): ITypstData {
    const handler = this.nodeHandlers.get(node.kind) || this.visitDefault;
    return handler.call(this, node, ...args);
  }

  public visitTextNode(node: TextNode, _space: string): ITypstData {
    let res: ITypstData = initTypstData();
    try {
      const text = node.getText();
      res = addToTypstData(res, { typst: text });
      return res;
    } catch (_e: unknown) {
      return res;
    }
  }

  public visitXMLNode(_node: XMLNode, _space: string): ITypstData {
    return initTypstData();
  }

  public visitInferredMrowNode(node: MathNode, space: string): ITypstData {
    let res: ITypstData = initTypstData();
    try {
      const children = node.childNodes;
      let j = 0;
      while (j < children.length) {
        const child = children[j];
        // Pattern 1: Big delimiter (\big, \Big, \bigg, \Bigg)
        const bigDelim = tryBigDelimiterPattern(node, j, space, this);
        if (bigDelim) {
          if (needsTokenSeparator(res.typst, bigDelim.typst)) addSpaceToTypstData(res);
          res = addToTypstData(res, { typst: bigDelim.typst });
          j = bigDelim.nextJ;
          continue;
        }
        // Pattern 2: Bare delimiter pairing (|...|, ⌊...⌋, ⌈...⌉, ‖...‖, ⟨...⟩)
        const bareDelim = tryBareDelimiterPattern(node, j, space, this);
        if (bareDelim) {
          if (needsTokenSeparator(res.typst, bareDelim.typst)) addSpaceToTypstData(res);
          res = addToTypstData(res, { typst: bareDelim.typst });
          j = bareDelim.nextJ;
          continue;
        }
        // Pattern 3: \idotsint (∫⋯∫ with scripts)
        const idotsint = tryIdotsintPattern(node, j, space, this);
        if (idotsint) {
          if (needsTokenSeparator(res.typst, idotsint.typst)) addSpaceToTypstData(res);
          res = addToTypstData(res, { typst: idotsint.typst });
          j = idotsint.nextJ;
          continue;
        }
        // Pattern 4: Thousand separator chain (1,000,000)
        const thousandSep = tryThousandSepPattern(node, j, space, this);
        if (thousandSep) {
          if (needsTokenSeparator(res.typst, thousandSep.typst)) addSpaceToTypstData(res);
          res = addToTypstData(res, { typst: thousandSep.typst });
          j = thousandSep.nextJ;
          continue;
        }
        // Pattern 5: Tagged eqnArray mtable with sibling content
        if (isTaggedEqnArray(child)) {
          // Pre-content: accumulated prefix before the mtable
          if (res.typst.trim()) {
            child.setProperty(DATA_PRE_CONTENT, res.typst.trim());
            res = initTypstData();
          }
          // Post-content: serialize remaining siblings after the mtable
          let postContent = '';
          for (let k = j + 1; k < children.length; k++) {
            const postData = this.visitNode(children[k], space);
            if (needsTokenSeparator(postContent, postData.typst)) {
              postContent += ' ';
            }
            postContent += postData.typst;
          }
          if (postContent.trim()) {
            child.setProperty(DATA_POST_CONTENT, postContent.trim());
          }
          // Process the mtable itself
          const data = this.visitNode(child, space);
          if (needsTokenSeparator(res.typst, data.typst)) {
            addSpaceToTypstData(res);
          }
          res = addToTypstData(res, data);
          // Skip all remaining siblings (already serialized as post-content)
          break;
        }
        // Pattern 6: \not negation overlay — mrow[REL] > mpadded[width=0] > mtext(⧸)
        // Consume the next sibling and wrap it in cancel()
        if (isNegationOverlay(child) && j + 1 < children.length) {
          const nextData = this.visitNode(children[j + 1], space);
          const cancelTypst = `cancel(${nextData.typst.trim()})`;
          if (needsSpaceBetweenNodes(res.typst, cancelTypst, j > 0 ? children[j - 1] : null)) {
            addSpaceToTypstData(res);
          }
          res = addToTypstData(res, { typst: cancelTypst });
          j += 2;
          continue;
        }
        // Normal processing
        const data = this.visitNode(child, space);
        if (needsSpaceBetweenNodes(res.typst, data.typst, j > 0 ? children[j - 1] : null)) {
          addSpaceToTypstData(res);
        }
        res = addToTypstData(res, data);
        j++;
      }
      return res;
    } catch (_e: unknown) {
      return res;
    }
  }

  public visitTeXAtomNode(node: MathNode, _space: string): ITypstData {
    let res: ITypstData = initTypstData();
    try {
      const childData = this.childNodeMml(node);
      if (childData.typst.trim()) {
        res = addToTypstData(res, childData);
      }
      return res;
    } catch (_e: unknown) {
      return res;
    }
  }

  public visitAnnotationNode(_node: MathNode, _space: string): ITypstData {
    return initTypstData();
  }

  public visitDefault(node: MathNode, _space: string): ITypstData {
    return this.childNodeMml(node);
  }

  protected childNodeMml(node: MathNode): ITypstData {
    return addToTypstData(initTypstData(), handle(node, this));
  }
}
