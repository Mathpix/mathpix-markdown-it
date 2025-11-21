import type Token from 'markdown-it/lib/token';
/**
 * Create (or retrieve from cache) a Markdown-It instance configured to parse ONLY
 * inline math and plain text. This keeps the behavior consistent with `baseMd` options
 * (html, breaks, typographer, etc.), but strips all other inline rules.
 *
 * Order matters:
 *  1) multiMath (handles \[, \(, \begin{...})
 *  2) simpleMath (handles $...$ / $$...$$)
 *  3) text fallback
 */
export declare const createMathOnlyInlineParser: (baseMd: MarkdownIt) => MarkdownIt;
/**
 * Parse a string with ONLY math inline rules enabled.
 *
 * @param baseMd  Original Markdown-It instance (its options are reused).
 * @param src     Raw source to parse (e.g., the inside of lstlisting with mathescape).
 * @param env     Environment object; it will be shallow-cloned and augmented with `mathescape_ctx: true`.
 * @returns       Array of tokens containing only text + inline/display math tokens.
 */
export declare const parseMathEscapeInline: (baseMd: MarkdownIt, src: string, env?: {}) => Token[];
