/**
 * Pattern-matching helpers for inferred mrow nodes.
 * Extracted from index.ts so they can be reused by the AST dispatcher.
 *
 * Pattern functions return TypstMathNode (AST) instead of strings.
 */
import { TEXCLASS } from 'mathjax-full/js/core/MmlTree/MmlNode.js';
import { MathNode } from './types';
import {
  LEFT_FLOOR, RIGHT_FLOOR, LEFT_CEIL, RIGHT_CEIL,
  DOUBLE_VERT, LEFT_CHEVRON, RIGHT_CHEVRON,
  LEFT_ANGLE_OLD, RIGHT_ANGLE_OLD,
  INTEGRAL_SIGN, MIDLINE_ELLIPSIS, TEX_ATOM, MLABELEDTR,
  UNPAIRED_BRACKET_PROP,
} from './consts';
import {
  getChildText, getAttrs, isThousandSepComma,
} from './common';
import { findTypstSymbol } from './typst-symbol-map';
import { TypstMathNode, DelimitedKind } from './ast/types';
import { ITypstMathSerializer } from './ast/types';
import { seq, symbol, delimited, funcCall, scriptNode, posArg, namedArg, mathVal, rawVal } from './ast/builders';
import { FuncEscapeContext } from './ast/serialize-context';
import { serializeTypstMath } from './ast/serialize';

// Node kinds that carry sub/sup scripts (used in \idotsint pattern detection).
const IDOTSINT_SCRIPT_KINDS: ReadonlySet<string> = new Set(['msubsup', 'msub', 'msup']);

// Comprehensive bracket sets for fence balance validation inside bare delimiter pairing.
// Covers ALL asymmetric bracket types that Typst auto-scales inside lr().
// Excludes | and ‖ — they are symmetric and handled by the pairing logic itself.
const FENCE_OPEN_CHARS: ReadonlySet<string> = new Set([
  '(', '{', '[', LEFT_CHEVRON, LEFT_ANGLE_OLD, LEFT_FLOOR, LEFT_CEIL,
]);
const FENCE_CLOSE_CHARS: ReadonlySet<string> = new Set([
  ')', '}', ']', RIGHT_CHEVRON, RIGHT_ANGLE_OLD, RIGHT_FLOOR, RIGHT_CEIL,
]);

/** Check that all brackets between positions [from, to) are balanced.
 *  Returns false if any opening bracket has no matching close, or vice versa.
 *  Used to validate bare delimiter pairing — rejects |...| when unmatched
 *  brackets (e.g. [, ⟩) sit between the two pipes. */
const isFenceBalanced = (node: MathNode, from: number, to: number): boolean => {
  let depth = 0;
  for (let k = from; k < to; k++) {
    const child = node.childNodes[k];
    // Skip brackets already marked as unpaired by markUnpairedBrackets() —
    // they'll be escaped (\[, \]) or replaced (bracket.l) in the serialized
    // output and won't affect Typst's delimiter matching inside lr().
    const mo = resolveDelimiterMo(child);
    if (mo?.getProperty?.(UNPAIRED_BRACKET_PROP)) {
      continue;
    }
    const ch = getDelimiterChar(child);
    if (!ch) {
      continue;
    }
    if (FENCE_OPEN_CHARS.has(ch)) {
      depth++;
    } else if (FENCE_CLOSE_CHARS.has(ch)) {
      depth--;
      if (depth < 0) {
        return false;
      } // unmatched close bracket
    }
  }
  return depth === 0;
};

/** Additional validation for ‖...‖ (DOUBLE_VERT) pairs.
 *  Rejects pairing when content contains PUNCT (set builder notation: {x ‖ P(x)})
 *  or REL when the pair spans the entire expression (a ‖ b is "parallel to"). */
const isDoubleVertContentValid = (
  node: MathNode, j: number, closeIdx: number, delimChar: string,
): boolean => {
  if (delimChar !== DOUBLE_VERT) {
    return true;
  }
  for (let k = j + 1; k < closeIdx; k++) {
    const tc = node.childNodes[k]?.texClass;
    if (tc === TEXCLASS.PUNCT) {
      return false;
    }
    if (j === 0 && closeIdx === node.childNodes.length - 1 && tc === TEXCLASS.REL) {
      return false;
    }
  }
  return true;
};

// Map of opening delimiter char -> expected close char + Typst output format.
// Note: |..| uses Lr (not Abs) in inferred mrow to produce lr(| ... |) form.
// The abs() shorthand is only used for \left|...\right| via mrow handler.
const BARE_DELIM_PAIRS: Readonly<Record<string, {
  close: string; kind: DelimitedKind; open: string; closeChar: string;
}>> = {
  '|':              { close: '|',              kind: DelimitedKind.Lr,    open: '|',            closeChar: '|' },
  [LEFT_FLOOR]:     { close: RIGHT_FLOOR,      kind: DelimitedKind.Floor, open: LEFT_FLOOR,     closeChar: RIGHT_FLOOR },
  [LEFT_CEIL]:      { close: RIGHT_CEIL,       kind: DelimitedKind.Ceil,  open: LEFT_CEIL,      closeChar: RIGHT_CEIL },
  [DOUBLE_VERT]:    { close: DOUBLE_VERT,      kind: DelimitedKind.Norm,  open: DOUBLE_VERT,    closeChar: DOUBLE_VERT },
  [LEFT_CHEVRON]:   { close: RIGHT_CHEVRON,    kind: DelimitedKind.Lr,    open: LEFT_CHEVRON,   closeChar: RIGHT_CHEVRON },
  [LEFT_ANGLE_OLD]: { close: RIGHT_ANGLE_OLD,  kind: DelimitedKind.Lr,    open: LEFT_ANGLE_OLD, closeChar: RIGHT_ANGLE_OLD },
};

interface BigDelimInfo {
  delim: string;
  size: string;
  isOpen: boolean
}

/** Result of a successful pattern match in visitInferredMrowNode. */
export interface PatternResult {
  node: TypstMathNode;
  nextJ: number;
}

// Extract big delimiter info from a TeXAtom node wrapping a sized mo.
const getBigDelimInfo = (node: MathNode): BigDelimInfo | null => {
  try {
    if (node.kind !== TEX_ATOM) {
      return null;
    }
    if (node.getProperty?.('data-custom-cmd')) {
      return null;
    }
    const inferred = node.childNodes?.[0];
    if (!inferred || !inferred.isInferred) {
      return null;
    }
    const mo = inferred.childNodes?.[0];
    if (!mo || mo.kind !== 'mo') {
      return null;
    }
    const atr = getAttrs<{ minsize?: string }>(mo);
    if (!atr.minsize) {
      return null;
    }
    const tc = mo.texClass ?? inferred.texClass ?? node.texClass;
    if (tc !== TEXCLASS.OPEN && tc !== TEXCLASS.CLOSE) {
      return null;
    }
    const delim = getChildText(mo);
    return {
      delim,
      size: String(atr.minsize),
      isOpen: tc === TEXCLASS.OPEN
    };
  } catch (_e: unknown) {
    return null;
  }
};

// Resolve the inner mo node from a bare mo, mrow, or TeXAtom wrapping one mo.
const resolveDelimiterMo = (node: MathNode): MathNode | null => {
  try {
    if (node?.kind === 'mo') {
      return node;
    }
    if (node?.getProperty?.('data-custom-cmd')) {
      return null;
    }
    if (node?.kind === 'mrow' || node?.kind === TEX_ATOM) {
      let children = node.childNodes;
      if (children?.length === 1 && children[0].isInferred) {
        children = children[0].childNodes;
      }
      if (children?.length === 1 && children[0].kind === 'mo') {
        return children[0];
      }
    }
    return null;
  } catch (_e: unknown) {
    return null;
  }
};

// Return the text content of a single-mo node.
const getDelimiterChar = (node: MathNode): string | null => {
  const mo = resolveDelimiterMo(node);
  return mo ? (getChildText(mo) || null) : null;
};

// Check if node is msub/msup/msubsup whose BASE is a closing delimiter.
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
export const isTaggedEqnArray = (child: MathNode): boolean => {
  if (child.kind !== 'mtable') return false;
  const isEqnArray = child.childNodes.length > 0
    && child.childNodes[0].attributes?.get('displaystyle') === true;
  return isEqnArray && child.childNodes.some((c) => c.kind === MLABELEDTR);
};

/** Visit a range of children [from, to) and return them as TypstMathNode array. */
const visitRange = (
  node: MathNode, from: number, to: number,
  serialize: ITypstMathSerializer
): TypstMathNode[] => {
  const nodes: TypstMathNode[] = [];
  for (let k = from; k < to; k++) {
    nodes.push(serialize.visitNode(node.childNodes[k]));
  }
  return nodes;
};

/** Build script attachments from a scripted delimiter closer. */
const attachScriptsFromNode = (
  baseNode: TypstMathNode, scriptMathNode: MathNode, serialize: ITypstMathSerializer
): TypstMathNode => {
  const kind = scriptMathNode.kind;
  const opts: { sub?: TypstMathNode; sup?: TypstMathNode } = {};
  if ((kind === 'msub' || kind === 'msubsup') && scriptMathNode.childNodes[1]) {
    opts.sub = serialize.visitNode(scriptMathNode.childNodes[1]);
  }
  const supChild = kind === 'msup' ? scriptMathNode.childNodes[1]
    : kind === 'msubsup' ? scriptMathNode.childNodes[2] : null;
  if (supChild) {
    opts.sup = serialize.visitNode(supChild);
  }
  return scriptNode(baseNode, opts);
};

/** Big delimiter pattern: TeXAtom(OPEN) ... TeXAtom(CLOSE) with sized mo */
export const tryBigDelimiterPattern = (
  node: MathNode, j: number, serialize: ITypstMathSerializer
): PatternResult | null => {
  const openInfo = getBigDelimInfo(node.childNodes[j]);
  if (!openInfo || !openInfo.isOpen) {
    return null;
  }
  let closeIdx = -1;
  let closeInfo: BigDelimInfo | null = null;
  let bigDepth = 0;
  for (let k = j + 1; k < node.childNodes.length; k++) {
    const candidate = getBigDelimInfo(node.childNodes[k]);
    if (!candidate) {
      continue;
    }
    if (candidate.isOpen) {
      bigDepth++;
    } else if (bigDepth > 0) {
      bigDepth--;
    } else {
      closeIdx = k;
      closeInfo = candidate;
      break;
    }
  }
  if (closeIdx < 0 || !closeInfo) {
    return null;
  }
  const openDelim = findTypstSymbol(openInfo.delim);
  const closeDelim = findTypstSymbol(closeInfo.delim);
  if (!openDelim || !closeDelim) {
    return null;
  }
  const contentNodes = visitRange(node, j + 1, closeIdx, serialize);
  const bodyNode = seq(contentNodes);
  const contentStr = serializeTypstMath(bodyNode).trim();
  // lr(size: #Xem, open content close) — use rawVal for explicit delimiter spacing
  const lrNode = funcCall('lr', [
    namedArg('size', rawVal('#' + openInfo.size)),
    posArg(rawVal(openDelim + ' ' + contentStr + ' ' + closeDelim)),
  ]);
  return {
    node: lrNode,
    nextJ: closeIdx + 1
  };
};

/** Bare delimiter pairing: |...|, floor, ceil, norm, chevron.
 *  Groups content for correct subscript/superscript attachment and produces
 *  Typst shorthand functions (ceil, floor, norm) or lr() for matched pairs.
 *
 *  Key invariant: the content between opener and closer must have balanced
 *  brackets — ALL delimiter types ((), [], {}, ⟨⟩, ⌊⌋, ⌈⌉) are tracked.
 *  This prevents |...\rangle from being swallowed into a wrong |...| pair
 *  when ⟩ sits between the two pipes. */
export const tryBareDelimiterPattern = (
  node: MathNode, j: number, serialize: ITypstMathSerializer
): PatternResult | null => {
  const delimChar = getDelimiterChar(node.childNodes[j]);
  const delimPair = delimChar ? BARE_DELIM_PAIRS[delimChar] : undefined;
  if (!delimPair) {
    return null;
  }
  if (delimChar === delimPair.close && node.parent?.kind === TEX_ATOM) {
    return null;
  }
  const isSymmetric = delimChar === delimPair.close;
  if (isSymmetric) {
    const openerMo = resolveDelimiterMo(node.childNodes[j]);
    if (openerMo && openerMo.texClass === TEXCLASS.CLOSE) {
      return null;
    }
  }
  let closeIdx = -1;
  let closeIsScripted = false;
  let nestDepth = 0;
  for (let k = j + 1; k < node.childNodes.length; k++) {
    const ch = getDelimiterChar(node.childNodes[k]);
    // Track nesting for asymmetric pairs (chevron, floor, ceil)
    if (!isSymmetric && ch === delimChar) {
      nestDepth++;
      continue;
    }
    // Also check scripted opening delimiters (e.g. ⟨_1) for nesting
    if (!isSymmetric && !ch) {
      const scriptedOpener = getScriptedDelimiterChar(node.childNodes[k]);
      if (scriptedOpener === delimChar) {
        nestDepth++;
        continue;
      }
    }
    if (ch === delimPair.close) {
      if (nestDepth > 0) {
        nestDepth--;
        continue;
      }
      closeIdx = k;
      break;
    }
    const scriptedCh = getScriptedDelimiterChar(node.childNodes[k]);
    if (scriptedCh === delimPair.close) {
      if (nestDepth > 0) {
        nestDepth--;
        continue;
      }
      closeIdx = k;
      closeIsScripted = true;
      break;
    }
  }
  if (closeIdx <= j + 1) {
    return null;
  }
  // Validate: ALL bracket types must be balanced between opener and closer.
  // This prevents |ψ⟩ = ...[|↑↓⟩] from pairing the first | with a distant |
  // through an unmatched ⟩ or [.
  if (!isFenceBalanced(node, j + 1, closeIdx)) {
    return null;
  }
  // Additional ‖ validation
  if (!isDoubleVertContentValid(node, j, closeIdx, delimChar)) {
    return null;
  }
  const contentNodes = visitRange(node, j + 1, closeIdx, serialize);
  const bodyNode = seq(contentNodes);
  let delimExpr: TypstMathNode = delimited(delimPair.kind, bodyNode, delimPair.open, delimPair.closeChar);
  if (closeIsScripted) {
    delimExpr = attachScriptsFromNode(delimExpr, node.childNodes[closeIdx], serialize);
  }
  return {
    node: delimExpr,
    nextJ: closeIdx + 1
  };
};

/** \idotsint pattern: mo(integral) mo(dots) scripted(mo(integral)) */
export const tryIdotsintPattern = (
  node: MathNode, j: number, serialize: ITypstMathSerializer
): PatternResult | null => {
  const child = node.childNodes[j];
  if (child?.kind !== 'mo' || getChildText(child) !== INTEGRAL_SIGN) {
    return null;
  }
  const next1 = node.childNodes[j + 1];
  const next2 = node.childNodes[j + 2];
  if (!next1 || next1.kind !== 'mo' || getChildText(next1) !== MIDLINE_ELLIPSIS || !next2) {
    return null;
  }
  const scriptBase = next2.childNodes?.[0];
  if (!IDOTSINT_SCRIPT_KINDS.has(next2.kind) || scriptBase?.kind !== 'mo' || getChildText(scriptBase) !== INTEGRAL_SIGN) {
    return null;
  }
  const part1 = serialize.visitNode(child);
  const part2 = serialize.visitNode(next1);
  const part3Sym = findTypstSymbol(INTEGRAL_SIGN);
  // lr(integral dots.c integral)
  const lrBody = seq([part1, part2, symbol(part3Sym)]);
  const lrNode = funcCall('lr', [posArg(mathVal(lrBody))], { escapeContext: FuncEscapeContext.LrContent });
  // Attach scripts from next2
  const opts: { sub?: TypstMathNode; sup?: TypstMathNode } = {};
  const kind = next2.kind;
  if ((kind === 'msub' || kind === 'msubsup') && next2.childNodes[1]) {
    opts.sub = serialize.visitNode(next2.childNodes[1]);
  }
  const supChild = kind === 'msup' ? next2.childNodes[1]
    : kind === 'msubsup' ? next2.childNodes[2] : null;
  if (supChild) {
    opts.sup = serialize.visitNode(supChild);
  }
  const resultNode = (opts.sub || opts.sup) ? scriptNode(lrNode, opts) : lrNode;
  return {
    node: resultNode,
    nextJ: j + 3
  };
};

/** Thousand separator chain: mn, mo(,), mn(3 digits) */
export const tryThousandSepPattern = (
  node: MathNode, j: number, serialize: ITypstMathSerializer
): PatternResult | null => {
  if (!isThousandSepComma(node, j)) {
    return null;
  }
  const parts: TypstMathNode[] = [serialize.visitNode(node.childNodes[j])];
  let k = j;
  while (isThousandSepComma(node, k)) {
    parts.push(symbol('\\,'));
    parts.push(serialize.visitNode(node.childNodes[k + 2]));
    k += 2;
  }
  return {
    node: seq(parts),
    nextJ: k + 1
  };
};
