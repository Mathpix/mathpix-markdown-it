import { MmlNode, TextNode } from 'mathjax-full/js/core/MmlTree/MmlNode.js';
import { Node as TreeNode } from 'mathjax-full/js/core/Tree/Node.js';

export { MmlNode, TreeNode };

/** Visitor/serializer interface used by handlers.
 *  visitNode accepts TreeNode (MathJax base) so childNodes elements pass without casts. */
export interface ITypstSerializer {
  visitNode(node: TreeNode, space: string): ITypstData;
}

/** Handler function signature — node is MmlNode (has texClass, attributes, etc.). */
export type HandlerFn = (node: TreeNode, serialize: ITypstSerializer) => ITypstData;

// --- Regex Constants ---

/** Non-breaking space U+00A0 (global replacement) */
export const RE_NBSP = /\u00A0/g;
/** Content-mode special characters: * _ ` @ # < (must be escaped in Typst [...]) */
export const RE_CONTENT_SPECIAL = /[*_`@#<]/g;
/** Word char or dot at end of string */
export const RE_WORD_DOT_END = /[\w.]$/;
/** Word char or dot at start of string */
export const RE_WORD_DOT_START = /^[\w.]/;
/** Word char at start of string */
export const RE_WORD_START = /^\w/;
/** Detects op() wrapper prefix */
export const RE_OP_WRAPPER = /^op\(/;
/** Extracts \tag{...} content from mtext */
export const RE_TAG_EXTRACT = /\\tag\{([^}]+)\}/;
/** Strips \tag{...} with optional leading whitespace (global) */
export const RE_TAG_STRIP = /\s*\\tag\{[^}]+\}/g;
/** Any ASCII bracket character */
export const RE_BRACKET_CHARS = /[\[\](){}]/;
/** Single word character (for single-char tests) */
export const RE_WORD_CHAR = /\w/;
/** Unicode thin/medium/narrow spaces and NBSP */
export const RE_UNICODE_SPACES = /[\u2006\u2005\u2004\u2009\u200A\u00A0]/g;
/** Trailing Typst spacing keywords */
export const RE_TRAILING_SPACING = /\s+(?:med|thin|thick|quad)$/;
/** Property name for pre-mtable content (set in index.ts, read in table-handlers.ts) */
export const DATA_PRE_CONTENT = 'data-pre-content';
/** Property name for post-mtable content (set in index.ts, read in table-handlers.ts) */
export const DATA_POST_CONTENT = 'data-post-content';
/** Exactly 3 digits (thousand separator) */
export const RE_THREE_DIGITS = /^\d{3}$/;
/** Exactly 2 digits (Indian numbering) */
export const RE_TWO_DIGITS = /^\d{2}$/;
/** Phantom subscript/superscript base pattern */
export const RE_PHANTOM_BASE = /^""[_^]/;
/** Token start: word char, dot, quote, or non-ASCII */
export const RE_TOKEN_START = /^[\w."\u0080-\uFFFF]/;
/** Natural separator at end of string */
export const RE_SEPARATOR_END = /[\s({[,|]$/;

/** Typst empty-content placeholder: two double-quotes represent an empty string in math mode */
export const TYPST_PLACEHOLDER = '""';

/** Return the expression if non-empty, otherwise the Typst empty placeholder '""'. */
export const typstPlaceholder = (s: string): string => s || TYPST_PLACEHOLDER;

export interface ITypstData {
  typst: string;
  /** Inline-safe variant: same as typst when no block wrappers are used,
   *  otherwise contains pure math expressions without #math.equation() wrappers. */
  typst_inline?: string;
}

export const initTypstData = (): ITypstData => {
  return { typst: '' };
};

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

/** Add a separator space to both typst and typst_inline fields. */
export const addSpaceToTypstData = (data: ITypstData): void => {
  data.typst += ' ';
  if (data.typst_inline !== undefined) {
    data.typst_inline += ' ';
  }
};

/** Check if child at index i in a node's childNodes starts a thousand-separator
 *  pattern: mn, mo(,), mn(3 digits). Also handles Indian numbering (2-digit groups
 *  like 41,70,000) by accepting 2-digit groups when the chain ends with a 3-digit group. */
export const isThousandSepComma = (node: TreeNode, i: number): boolean => {
  try {
    if (i + 2 >= node.childNodes.length) return false;
    const child = node.childNodes[i];
    const comma = node.childNodes[i + 1];
    const next = node.childNodes[i + 2];
    if (child?.kind !== 'mn') return false;
    if (comma?.kind !== 'mo' || getChildText(comma) !== ',') return false;
    if (next?.kind !== 'mn') return false;
    const nextText: string = getChildText(next);
    // Standard: exactly 3 digits after comma
    if (RE_THREE_DIGITS.test(nextText)) return true;
    // Indian numbering: exactly 2 digits — accept if the chain eventually reaches a 3-digit group
    if (RE_TWO_DIGITS.test(nextText)) {
      let j = i + 2;
      while (j + 2 < node.childNodes.length) {
        const nextComma = node.childNodes[j + 1];
        const nextNode = node.childNodes[j + 2];
        if (nextComma?.kind !== 'mo' || getChildText(nextComma) !== ',') break;
        if (nextNode?.kind !== 'mn') break;
        const nextDigits: string = getChildText(nextNode);
        if (RE_THREE_DIGITS.test(nextDigits)) return true;
        if (!RE_TWO_DIGITS.test(nextDigits)) break;
        j += 2;
      }
    }
    return false;
  } catch (_e) {
    return false;
  }
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

export const needsParens = (s: string): boolean => {
  // In Typst, sub/superscript grouping always uses (): x^(content), x_(content)
  // Even if the content itself starts/ends with () — those are literal, not grouping.
  // e.g. f^{(n)} in LaTeX → f^((n)) in Typst (outer = grouping, inner = literal)
  if (s.length <= 1) {
    return false;
  }
  return true;
};

/** Format a subscript or superscript with proper Typst grouping.
 *  Returns e.g. '_x', '_(x + y)', '^n', '^(a b)', or '' if content is empty. */
export const formatScript = (prefix: '_' | '^', content: string): string => {
  if (!content) return '';
  return prefix + (needsParens(content) ? '(' + content + ')' : content);
};

/** Check if a node is the first child of its parent. */
export const isFirstChild = (node: TreeNode): boolean => {
  return node.parent && node.parent.childNodes[0] && node.parent.childNodes[0] === node;
};

/** Check if a node is the last child of its parent. */
export const isLastChild = (node: TreeNode): boolean => {
  return node.parent && node.parent.childNodes
    && node.parent.childNodes[node.parent.childNodes.length - 1] === node;
};

/** Find the index of a node among its parent's childNodes. Returns -1 if not found. */
export const getSiblingIndex = (node: TreeNode): number => {
  if (!node.parent || !node.parent.childNodes) return -1;
  return node.parent.childNodes.findIndex((item) => item === node);
};

/** Get text content of a node's first child (TextNode).
 *  Safe: returns '' if node has no children or first child is not a TextNode. */
export const getChildText = (node: TreeNode): string => {
  const child = node?.childNodes?.[0];
  return child instanceof TextNode ? child.getText() : '';
};

/** Concatenate text content of all child nodes. */
export const getNodeText = (node: TreeNode): string => {
  if (!node?.childNodes) return '';
  let text = '';
  for (const child of node.childNodes) {
    if (child instanceof TextNode) text += child.getText();
  }
  return text;
};
