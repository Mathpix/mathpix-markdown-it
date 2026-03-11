import { MathNode, ITypstData, ITypstSerializer, HandlerFn } from './types';
/** Return the expression if non-empty, otherwise the Typst empty placeholder '""'. */
export declare const typstPlaceholder: (s: string) => string;
export declare const initTypstData: () => ITypstData;
/** Mutates dataOutput by appending dataInput fields. Returns dataOutput for chaining. */
export declare const addToTypstData: (dataOutput: ITypstData, dataInput: ITypstData) => ITypstData;
/** Add a separator space to both typst and typst_inline fields.
 *  Does not create typst_inline if it hasn't been initialized yet. */
export declare const addSpaceToTypstData: (data: ITypstData) => void;
/** Check if child at index i in a node's childNodes starts a thousand-separator
 *  pattern: mn, mo(,), mn(3 digits). Also handles Indian numbering (2-digit groups
 *  like 41,70,000) by accepting 2-digit groups when the chain ends with a 3-digit group. */
export declare const isThousandSepComma: (node: MathNode, i: number) => boolean;
/** Serialize a thousand-separator chain starting at index `start` in a node's childNodes.
 *  Returns { typst, nextIndex } where nextIndex is the first unconsumed child index,
 *  or null if no chain starts at `start`. */
export declare const serializeThousandSepChain: (node: MathNode, start: number, serialize: ITypstSerializer) => {
    typst: string;
    nextIndex: number;
} | null;
/** Check if a space separator is needed between two adjacent Typst tokens.
 *  Returns true when `next` starts with a word/dot/quote character
 *  and `prev` doesn't end with a natural separator (whitespace, open paren, etc.). */
export declare const needsTokenSeparator: (prev: string, next: string) => boolean;
/** Extended spacing check for mrow/inferredMrow child concatenation.
 *  First applies the standard token separator heuristic, then checks whether
 *  a scripted node (msub, msup, …) is followed by (, [ or { — a space is needed
 *  to prevent Typst from parsing them as function call / content block / code block
 *  and to improve readability: q_j (chi, eta), P_l^n (cos chi), x^n [ln x].
 *  Exception: derivative patterns f'(x), f''(x), f^{(n)}(a) keep no space. */
export declare const needsSpaceBetweenNodes: (prevTypst: string, nextTypst: string, prevNode: MathNode | null) => boolean;
/** Simple heuristic for Typst sub/superscript grouping: multi-char content needs parens. */
export declare const needsParens: (s: string) => boolean;
/** Format a subscript or superscript with proper Typst grouping.
 *  Returns e.g. '_x', '_(x + y)', '^n', '^(a b)', or '' if content is empty. */
export declare const formatScript: (prefix: '_' | '^', content: string) => string;
/** Check if a node is the first child of its parent. */
export declare const isFirstChild: (node: MathNode) => boolean;
/** Check if a node is the last child of its parent. */
export declare const isLastChild: (node: MathNode) => boolean;
/** Find the index of a node among its parent's childNodes. Returns -1 if not found. */
export declare const getSiblingIndex: (node: MathNode) => number;
/** Get text content of a node's first child (TextNode).
 *  Safe: returns '' if node has no children or first child is not a TextNode. */
export declare const getChildText: (node: MathNode) => string;
/** Concatenate direct TextNode children of a node (non-recursive). */
export declare const getNodeText: (node: MathNode) => string;
/** Get typed attributes from a node. The single `as T` cast localises the any boundary. */
export declare const getAttrs: <T extends object>(node: MathNode) => T;
/** Get a typed property from a node. Accepts nullable node for convenience (returns undefined). */
export declare const getProp: <T>(node: MathNode | null | undefined, key: string) => T;
/** Check if a node is a \not negation overlay: mrow[REL] > mpadded[width=0] > mtext(⧸).
 *  When true, the next sibling should be wrapped in cancel(). */
export declare const isNegationOverlay: (node: MathNode) => boolean;
/** Serialize all children of a node by visiting each one and concatenating the results. */
export declare const handleAll: HandlerFn;
