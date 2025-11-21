import { Token } from "markdown-it";
/**
 * Create a Markdown-It renderer for LaTeX `lstlisting` environments.
 *
 * Behavior:
 * - Always delegates rendering of the token content to `renderCodeWithMathHighlighted`
 *   (handles both plain code and tokens with math-aware children; also builds TSV/CSV).
 * - If the returned HTML starts with a full `<pre...>` block (e.g. provided by an external highlighter),
 *   it is returned as-is with a trailing newline.
 * - Otherwise, the result is wrapped into `<pre><code ...>` and a language class
 *   `options.langPrefix + langName` is gently injected by cloning token attrs (the original token is not mutated).
 *
 * @param md Markdown-It instance (used for highlighting and rendering).
 * @returns A renderer function `(tokens, idx, options, env, slf) => string` for `latex_lstlisting_env`.
 */
export declare const makeLatexLstlistingEnvRendererWithMd: (md: MarkdownIt) => (tokens: Token[], idx: number, options: Record<string, any>, env: Record<string, any>, slf: Renderer) => string;
