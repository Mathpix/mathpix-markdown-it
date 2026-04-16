import { TextNode } from 'mathjax-full/js/core/MmlTree/MmlNode.js';
import { MathNode } from './types';
import {
  RE_THREE_DIGITS, RE_TWO_DIGITS, RE_PHANTOM_BASE,
  RE_TOKEN_START, RE_SEPARATOR_END, RE_WORD_DOT_END,
  RE_ESCAPED_BRACKET_START, RE_ESCAPED_BRACKET_END,
  RE_LATIN_WITH_MARKS, RE_LETTERS_AND_MARKS,
  RE_CONTENT_SPECIAL,
  TEX_ATOM,
} from './consts';
import { typstSymbolMap } from './typst-symbol-map';

/** Unicode negation slash used by MathJax for \not overlay (U+29F8) */
const NEGATION_SLASH = '\u29F8';
const RE_COMMENT_START = /\/\/|\/\*/g;

/** Escape text for Typst content mode ([...] blocks).
 *  Handles: markup specials (* _ ` @ # < [ ] { } $ ~) and comment starts (// /\*).
 *  Backslashes are escaped FIRST so that existing \# sequences become \\# (literal
 *  backslash + escaped hash) rather than being treated as pre-escaped. */
export const escapeTypstContent = (text: string): string =>
  text
    .replace(/\\/g, '\\\\')
    .replace(RE_CONTENT_SPECIAL, '\\$&')
    .replace(RE_COMMENT_START, (m) => m.replace(/./g, '\\$&'));

/** Check if child at index i in a node's childNodes starts a thousand-separator
 *  pattern: mn, mo(,), mn(3 digits). Also handles Indian numbering (2-digit groups
 *  like 41,70,000) by accepting 2-digit groups when the chain ends with a 3-digit group. */
export const isThousandSepComma = (node: MathNode, i: number): boolean => {
  const children = node.childNodes;
  if (!children || i < 0 || i + 2 >= children.length) {
    return false;
  }
  const child = children[i];
  const comma = children[i + 1];
  const next = children[i + 2];
  if (child?.kind !== 'mn') {
    return false;
  }
  if (comma?.kind !== 'mo' || getChildText(comma) !== ',') {
    return false;
  }
  if (next?.kind !== 'mn') {
    return false;
  }
  const nextText = getChildText(next);
  // Standard: exactly 3 digits after comma
  if (RE_THREE_DIGITS.test(nextText)) {
    return true;
  }
  // Indian numbering: exactly 2 digits — accept if the chain eventually reaches a 3-digit group
  if (!RE_TWO_DIGITS.test(nextText)) {
    return false;
  }
  let j = i + 2;
  while (j + 2 < children.length) {
    const nextComma = children[j + 1];
    const nextNode = children[j + 2];
    if (nextComma?.kind !== 'mo' || getChildText(nextComma) !== ',') {
      return false;
    }
    if (nextNode?.kind !== 'mn') {
      return false;
    }
    const nextDigits = getChildText(nextNode);
    if (RE_THREE_DIGITS.test(nextDigits)) {
      return true;
    }
    if (!RE_TWO_DIGITS.test(nextDigits)) {
      return false;
    }
    j += 2;
  }
  return false;
};

/** Check if text is a non-Latin script character (Devanagari, Arabic, CJK, etc.)
 *  that is NOT a known math symbol with a Typst mapping. */
export const isNonLatinText = (text: string): boolean => {
  // Must consist of letters and combining marks only (not math symbols \p{S})
  if (!RE_LETTERS_AND_MARKS.test(text)) {
    return false;
  }
  // Latin letters with combining marks (k̸, ñ, etc.) are NOT non-Latin
  if (RE_LATIN_WITH_MARKS.test(text)) {
    return false;
  }
  // Must NOT be a known math symbol (∂→partial, ψ→psi, ∅→emptyset, etc.)
  if (typstSymbolMap.has(text)) {
    return false;
  }
  return true;
};

/** Check if a space separator is needed between two adjacent Typst tokens. */
export const needsTokenSeparator = (prev: string, next: string): boolean => {
  if (!prev || !next) {
    return false;
  }
  if (RE_PHANTOM_BASE.test(next)) {
    return false;
  }
  // Standard check: next starts with word/dot/quote, prev doesn't end with separator
  if (RE_TOKEN_START.test(next)) {
    // Escaped bracket at end (\( \) \[ etc.) is NOT a separator
    const prevIsSeparator = RE_SEPARATOR_END.test(prev) && !RE_ESCAPED_BRACKET_END.test(prev);
    return !prevIsSeparator;
  }
  // Any escaped bracket at start of next needs space after word/dot chars
  if (RE_ESCAPED_BRACKET_START.test(next)) {
    return RE_WORD_DOT_END.test(prev);
  }
  return false;
};

/** Check if a node is the first child of its parent. */
export const isFirstChild = (node: MathNode): boolean =>
  !!node.parent && node.parent.childNodes[0] === node;

/** Find the index of a node among its parent's childNodes. Returns -1 if not found. */
export const getSiblingIndex = (node: MathNode): number => {
  if (!node.parent || !node.parent.childNodes) {
    return -1;
  }
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
  if (!node?.childNodes) {
    return '';
  }
  let text = '';
  for (const child of node.childNodes) {
    if (child instanceof TextNode) {
      text += child.getText();
    }
  }
  return text;
};

/** Get typed attributes from a node. Unsafe cast — callers must handle missing fields via ?. or ||. */
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

/** Check if a node is a \not negation overlay: mrow[REL] > mpadded[width=0] > mtext(⧸).
 *  When true, the next sibling should be wrapped in cancel(). */
export const isNegationOverlay = (node: MathNode): boolean => {
  // MathJax represents \not as TeXAtom(REL) in the internal tree
  // (serialized as mrow in MathML output)
  if (node.kind !== TEX_ATOM && node.kind !== 'mrow') {
    return false;
  }
  // Walk through inferred mrow wrappers to find the mpadded
  let target = node.childNodes;
  if (!target) {
    return false;
  }
  while (target.length === 1 && target[0].isInferred && target[0].childNodes) {
    target = target[0].childNodes;
  }
  if (target.length !== 1) {
    return false;
  }
  const mpadded = target[0];
  if (mpadded.kind !== 'mpadded') {
    return false;
  }
  const attrs = mpadded.attributes.getAllAttributes();
  if (attrs.width !== 0) {
    return false;
  }
  // Walk through inferred mrow inside mpadded
  let mpTarget = mpadded.childNodes;
  if (!mpTarget) {
    return false;
  }
  while (mpTarget.length === 1 && mpTarget[0].isInferred && mpTarget[0].childNodes) {
    mpTarget = mpTarget[0].childNodes;
  }
  if (mpTarget.length !== 1) {
    return false;
  }
  const mtext = mpTarget[0];
  if (mtext.kind !== 'mtext') {
    return false;
  }
  return getChildText(mtext) === NEGATION_SLASH;
};

