import { MathNode } from './types';
/** Escape text for Typst content mode ([...] blocks).
 *  Handles: markup specials (* _ ` @ # < [ ] { } $ ~) and comment starts (// /\*).
 *  Backslashes are escaped FIRST so that existing \# sequences become \\# (literal
 *  backslash + escaped hash) rather than being treated as pre-escaped. */
export declare const escapeTypstContent: (text: string) => string;
/** Check if child at index i in a node's childNodes starts a thousand-separator
 *  pattern: mn, mo(,), mn(3 digits). Also handles Indian numbering (2-digit groups
 *  like 41,70,000) by accepting 2-digit groups when the chain ends with a 3-digit group. */
export declare const isThousandSepComma: (node: MathNode, i: number) => boolean;
/** Check if text is a non-Latin script character (Devanagari, Arabic, CJK, etc.)
 *  that is NOT a known math symbol with a Typst mapping. */
export declare const isNonLatinText: (text: string) => boolean;
/** Check if a space separator is needed between two adjacent Typst tokens. */
export declare const needsTokenSeparator: (prev: string, next: string) => boolean;
/** Check if a node is the first child of its parent. */
export declare const isFirstChild: (node: MathNode) => boolean;
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
/** Return child nodes excluding the first/last mo (delimiter fences from \left...\right). */
export declare const getContentChildren: (node: MathNode) => MathNode[];
/** Check if a node is a \not negation overlay: mrow[REL] > mpadded[width=0] > mtext(⧸).
 *  When true, the next sibling should be wrapped in cancel(). */
export declare const isNegationOverlay: (node: MathNode) => boolean;
