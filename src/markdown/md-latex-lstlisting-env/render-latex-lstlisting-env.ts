import { MarkdownIt, Token, Renderer } from "markdown-it";
const escapeHtml = require('markdown-it/lib/common/utils').escapeHtml;

/**
 * Render a code token (block or inline) with optional syntax highlighting and math-aware children.
 *
 * Behavior:
 * - If the token has `children`, iterates through them:
 *   - `text` children are highlighted with `md.options.highlight(langName)` when available,
 *     otherwise HTML-escaped.
 *   - non-`text` children are rendered via `md.renderer.renderInline` (e.g., math spans),
 *     while their plain-text projections are taken from `child.ascii*` fields.
 * - If the token has no `children`, highlights/escapes `token.content` as a single chunk.
 * - Builds plain-text TSV/CSV strings from the rendered pieces (newlines are replaced with spaces)
 *   and stores them into `token.tsv` / `token.csv` (arrays with a single string).
 *
 * Notes:
 * - The function mutates `token.tsv` and `token.csv`.
 * - If the highlighter throws or returns a falsy value, the raw text is HTML-escaped.
 *
 * @param token   Markdown-It token representing the code fragment.
 * @param md      Markdown-It instance (used for highlighting and rendering).
 * @param langName Language name passed to the highlighter (may be empty).
 * @param options  Renderer options forwarded to `renderInline` for non-text children.
 * @param env      Rendering environment forwarded to `renderInline`.
 * @returns HTML string produced from the token content (children-aware).
 */
const renderCodeWithMathHighlighted = (
  token: Token,
  md: MarkdownIt,
  langName: string,
  options: any = {},
  env = {}
): string => {
  const children = token.children ?? [];
  const partsHtml: string[] = [];
  const partsTsv: string[] = [];
  const partsCsv: string[] = [];
  if (children.length > 0) {
    for (const child of children) {
      if (child.type === 'text') {
        const raw: string = child.content ?? '';
        try {
          const highlighted = (md.options?.highlight && typeof md.options.highlight === 'function')
            ? (md.options.highlight(raw, langName) || escapeHtml(raw))  // <-- raw code в highlight
            : escapeHtml(raw);
          partsHtml.push(highlighted);
        } catch {
          partsHtml.push(escapeHtml(raw));
        }
        partsTsv.push(raw);
        partsCsv.push(raw);
      } else {
        let mathHtml: string = md.renderer.renderInline([child], options, env);
        if (options?.forDocx && mathHtml) {
          mathHtml = mathHtml
            .split(/\r?\n/)
            .map(line => line.trim())
            .join('');
        }
        partsHtml.push(mathHtml);
        partsTsv.push(child.ascii_tsv ?? child.ascii ?? '');
        partsCsv.push(child.ascii_csv ?? child.ascii ?? '');
      }
    }
  } else {
    const raw: string = token.content ?? '';
    const highlighted = (md.options?.highlight && typeof md.options.highlight === 'function')
      ? (md.options.highlight(raw, langName) || escapeHtml(raw))  // <-- raw code в highlight
      : escapeHtml(raw);
    partsHtml.push(highlighted);
    partsTsv.push(raw);
    partsCsv.push(raw);
  }
  const tsv: string = partsTsv.join('').replace(/\r?\n/g, ' ');
  const csv: string = partsCsv.join('').replace(/\r?\n/g, ' ');
  token.tsv = [tsv];
  token.csv = [csv];
  return partsHtml.join('');
};

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
export const makeLatexLstlistingEnvRendererWithMd = (md: MarkdownIt) => {
  return (
    tokens: Token[],
    idx: number,
    options: Record<string, any> = {},
    env: Record<string, any> = {},
    slf: Renderer
  ): string => {
    const token: Token = tokens[idx];
    const langName: string = token.meta?.language?.hlName ?? '';
    let highlighted: string = renderCodeWithMathHighlighted(token, md, langName, options, env);
    if (highlighted.indexOf('<pre') === 0) {
      return highlighted + '\n';
    }
    const styleValue: string = 'text-align: left;';
    // If language exists, inject class gently, without modifying original token.
    // May be, one day we will add .clone() for token and simplify this part, but
    // now we prefer to keep things local.
    const classes: string[] = ['lstlisting-code'];
    if (langName) {
      classes.push(options.langPrefix + langName);
    }
    const attrs = token.attrs ? token.attrs.map(([k, v]) => [k, v]) : [];
    // handle `class` attribute
    const classIndex = token.attrIndex('class');
    const className = classes.join(' ');
    if (classIndex < 0) {
      attrs.push(['class', className]);
    } else {
      attrs[classIndex][1] += ' ' + className;
    }
    // handle `style` attribute (if provided as value)
    if (styleValue) {
      const styleIndex = token.attrIndex('style');
      if (styleIndex < 0) {
        attrs.push(['style', styleValue]);
      } else {
        attrs[styleIndex][1] += '; ' + styleValue;
      }
    }
    // Fake token just to render attributes
    const fakeToken: Pick<Token, 'attrs'> = { attrs };
    return  '<pre><code'
      + slf.renderAttrs(fakeToken)
      + '>'
      + highlighted
      + '</code></pre>\n';
  };
}
