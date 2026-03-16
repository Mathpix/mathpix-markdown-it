import { TextNode } from 'mathjax-full/js/core/MmlTree/MmlNode.js';
import { MathNode, ITypstData, ITypstSerializer, HandlerFn } from './types';
import {
  RE_THREE_DIGITS, RE_TWO_DIGITS, RE_PHANTOM_BASE,
  RE_TOKEN_START, RE_SEPARATOR_END, TYPST_PLACEHOLDER,
  SCRIPT_NODE_KINDS, PRIME_CHARS,
} from './consts';

/** Return the expression if non-empty, otherwise the Typst empty placeholder '""'. */
export const typstPlaceholder = (s: string): string => s || TYPST_PLACEHOLDER;

export const initTypstData = (): ITypstData => ({ typst: '' });

/** Mutates dataOutput by appending dataInput fields. Returns dataOutput for chaining. */
export const addToTypstData = (
  dataOutput: ITypstData,
  dataInput: ITypstData
): ITypstData => {
  dataOutput.typst += dataInput.typst;
  // Always propagate inline variant: use explicit typst_inline if set,
  // otherwise fall back to typst (inline == block for most nodes).
  dataOutput.typst_inline = (dataOutput.typst_inline ?? '')
    + (dataInput.typst_inline !== undefined ? dataInput.typst_inline : dataInput.typst);
  return dataOutput;
};

/** Add a separator space to both typst and typst_inline fields.
 *  Does not create typst_inline if it hasn't been initialized yet. */
export const addSpaceToTypstData = (data: ITypstData): void => {
  data.typst += ' ';
  if (data.typst_inline !== undefined) {
    data.typst_inline += ' ';
  }
};

/** Check if child at index i in a node's childNodes starts a thousand-separator
 *  pattern: mn, mo(,), mn(3 digits). Also handles Indian numbering (2-digit groups
 *  like 41,70,000) by accepting 2-digit groups when the chain ends with a 3-digit group. */
export const isThousandSepComma = (node: MathNode, i: number): boolean => {
  const children = node.childNodes;
  if (!children || i < 0 || i + 2 >= children.length) return false;
  const child = children[i];
  const comma = children[i + 1];
  const next = children[i + 2];
  if (child?.kind !== 'mn') return false;
  if (comma?.kind !== 'mo' || getChildText(comma) !== ',') return false;
  if (next?.kind !== 'mn') return false;
  const nextText = getChildText(next);
  // Standard: exactly 3 digits after comma
  if (RE_THREE_DIGITS.test(nextText)) return true;
  // Indian numbering: exactly 2 digits — accept if the chain eventually reaches a 3-digit group
  if (!RE_TWO_DIGITS.test(nextText)) return false;
  let j = i + 2;
  while (j + 2 < children.length) {
    const nextComma = children[j + 1];
    const nextNode = children[j + 2];
    if (nextComma?.kind !== 'mo' || getChildText(nextComma) !== ',') return false;
    if (nextNode?.kind !== 'mn') return false;
    const nextDigits = getChildText(nextNode);
    if (RE_THREE_DIGITS.test(nextDigits)) return true;
    if (!RE_TWO_DIGITS.test(nextDigits)) return false;
    j += 2;
  }
  return false;
};

/** Serialize a thousand-separator chain starting at index `start` in a node's childNodes.
 *  Returns { typst, nextIndex } where nextIndex is the first unconsumed child index,
 *  or null if no chain starts at `start`. */
export const serializeThousandSepChain = (
  node: MathNode, start: number, serialize: ITypstSerializer
): { typst: string; nextIndex: number } | null => {
  if (!isThousandSepComma(node, start)) return null;
  const numData = serialize.visitNode(node.childNodes[start], '');
  let chainTypst = numData.typst;
  let k = start;
  while (isThousandSepComma(node, k)) {
    const nextData = serialize.visitNode(node.childNodes[k + 2], '');
    chainTypst += `\\,${nextData.typst}`;
    k += 2;
  }
  return { typst: chainTypst, nextIndex: k + 1 };
};

/** Check if a space separator is needed between two adjacent Typst tokens.
 *  Returns true when `next` starts with a word/dot/quote character
 *  and `prev` doesn't end with a natural separator (whitespace, open paren, etc.). */
export const needsTokenSeparator = (prev: string, next: string): boolean => {
  if (!prev || !next) return false;
  // No space before phantom subscript/superscript base (""_ or ""^)
  if (RE_PHANTOM_BASE.test(next)) return false;
  return RE_TOKEN_START.test(next)
    && !RE_SEPARATOR_END.test(prev);
};

/** Check if a scripted node represents a derivative pattern: f'(x), f''(x), f^{(n)}(a).
 *  These are msup with mi base and prime (mo with ′/″/‴) or parenthesized-group (TeXAtom) superscript. */
const isDerivativePattern = (node: MathNode): boolean => {
  if (node.kind !== 'msup') return false;
  if (node.childNodes?.[0]?.kind !== 'mi') return false;
  const script = node.childNodes?.[1];
  // f'(x), f''(x) — superscript is mo with prime character (′ ″ ‴)
  if (script?.kind === 'mo') {
    const scriptText = getChildText(script);
    return PRIME_CHARS.has(scriptText);
  }
  // f^{(n)}(a) — superscript is TeXAtom (parenthesized group)
  if (script?.kind === 'TeXAtom') return true;
  return false;
};

/** Extended spacing check for mrow/inferredMrow child concatenation.
 *  First applies the standard token separator heuristic, then checks whether
 *  a scripted node (msub, msup, …) is followed by (, [ or { — a space is needed
 *  to prevent Typst from parsing them as function call / content block / code block
 *  and to improve readability: q_j (chi, eta), P_l^n (cos chi), x^n [ln x].
 *  Exception: derivative patterns f'(x), f''(x), f^{(n)}(a) keep no space. */
export const needsSpaceBetweenNodes = (
  prevTypst: string, nextTypst: string, prevNode: MathNode | null,
): boolean => {
  if (needsTokenSeparator(prevTypst, nextTypst)) return true;
  if (prevNode && SCRIPT_NODE_KINDS.has(prevNode.kind) && nextTypst.length > 0) {
    const ch = nextTypst[0];
    if (ch === '[' || ch === '{') return true;
    if (ch === '(' && !isDerivativePattern(prevNode)) return true;
  }
  return false;
};

/** Simple heuristic for Typst sub/superscript grouping: multi-char content needs parens. */
export const needsParens = (s: string): boolean => s.length > 1;

/** Format a subscript or superscript with proper Typst grouping.
 *  Returns e.g. '_x', '_(x + y)', '^n', '^(a b)', or '' if content is empty. */
export const formatScript = (prefix: '_' | '^', content: string): string => {
  if (!content) return '';
  return prefix + (needsParens(content) ? `(${content})` : content);
};

/** Check if a node is the first child of its parent. */
export const isFirstChild = (node: MathNode): boolean =>
  !!node.parent && node.parent.childNodes[0] === node;

/** Check if a node is the last child of its parent. */
export const isLastChild = (node: MathNode): boolean =>
  !!node.parent && node.parent.childNodes[node.parent.childNodes.length - 1] === node;

/** Find the index of a node among its parent's childNodes. Returns -1 if not found. */
export const getSiblingIndex = (node: MathNode): number => {
  if (!node.parent || !node.parent.childNodes) return -1;
  return node.parent.childNodes.indexOf(node);
};

/** Get text content of a node's first child (TextNode).
 *  Safe: returns '' if node has no children or first child is not a TextNode. */
export const getChildText = (node: MathNode): string => {
  const child = node?.childNodes?.[0];
  return child instanceof TextNode ? child.getText() : '';
};

/** Concatenate direct TextNode children of a node (non-recursive). */
export const getNodeText = (node: MathNode): string => {
  if (!node?.childNodes) return '';
  let text = '';
  for (const child of node.childNodes) {
    if (child instanceof TextNode) text += child.getText();
  }
  return text;
};

/** Get typed attributes from a node. The single `as T` cast localises the any boundary. */
export const getAttrs = <T extends object>(node: MathNode): T =>
  node.attributes.getAllAttributes() as T;

/** Get a typed property from a node. Accepts nullable node for convenience (returns undefined). */
export const getProp = <T>(node: MathNode | null | undefined, key: string): T | undefined =>
  node?.getProperty(key) as T | undefined;

/** Return child nodes excluding the first/last mo (delimiter fences from \left...\right). */
export const getContentChildren = (node: MathNode): MathNode[] =>
  node.childNodes.filter((child, i) =>
    !(child.kind === 'mo' && (i === 0 || i === node.childNodes.length - 1))
  );

/** Unicode negation slash used by MathJax for \not overlay (U+29F8) */
const NEGATION_SLASH = '\u29F8';

/** Check if a node is a \not negation overlay: mrow[REL] > mpadded[width=0] > mtext(⧸).
 *  When true, the next sibling should be wrapped in cancel(). */
export const isNegationOverlay = (node: MathNode): boolean => {
  // MathJax represents \not as TeXAtom(REL) in the internal tree
  // (serialized as mrow in MathML output)
  if (node.kind !== 'TeXAtom' && node.kind !== 'mrow') return false;
  // Walk through inferred mrow wrappers to find the mpadded
  let target = node.childNodes;
  if (!target) return false;
  while (target.length === 1 && target[0].isInferred && target[0].childNodes) {
    target = target[0].childNodes;
  }
  if (target.length !== 1) return false;
  const mpadded = target[0];
  if (mpadded.kind !== 'mpadded') return false;
  const attrs = mpadded.attributes.getAllAttributes();
  if (attrs.width !== 0) return false;
  // Walk through inferred mrow inside mpadded
  let mpTarget = mpadded.childNodes;
  if (!mpTarget) return false;
  while (mpTarget.length === 1 && mpTarget[0].isInferred && mpTarget[0].childNodes) {
    mpTarget = mpTarget[0].childNodes;
  }
  if (mpTarget.length !== 1) return false;
  const mtext = mpTarget[0];
  if (mtext.kind !== 'mtext') return false;
  return getChildText(mtext) === NEGATION_SLASH;
};

/** Serialize all children of a node by visiting each one and concatenating the results. */
export const handleAll: HandlerFn = (node, serialize) => {
  let res: ITypstData = initTypstData();
  for (const child of (node.childNodes ?? [])) {
    res = addToTypstData(res, serialize.visitNode(child, ''));
  }
  return res;
};
