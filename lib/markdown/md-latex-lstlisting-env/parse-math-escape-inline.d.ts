import type Token from 'markdown-it/lib/token';
/**
 * Create (or retrieve from cache) a Markdown-It instance configured to parse ONLY
 * inline math and plain text. This keeps the behavior consistent with `baseMd` options
 * (html, breaks, typographer, etc.), but strips all other inline rules.
 *
 * Rule precedence: markdown-it's `text` rule runs first but terminates on \ / $ / [, so
 * multiMath/simpleMath still see every delimiter opener before `text` consumes it. `escape`
 * is replaced with `verbatimBackslash` because listing code is verbatim.
 *
 * Cache caveat: options are snapshotted at construction. Safe while each render builds a fresh
 * baseMd (per mdInit); if baseMd is reused across renders with different mathDelimiterMode, the
 * cached parser keeps the first mode.
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
