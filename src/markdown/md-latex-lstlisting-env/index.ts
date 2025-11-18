import { MarkdownIt } from 'markdown-it';
import { latexLstlistingEnvBlockRule } from "./latex-lstlisting-env-block";
import { latexLstlistingEnvInlineRule } from "./latex-lstlisting-env-inline";
import { fenceInline } from "../md-inline-rule/fence-inline";
import { makeLatexLstlistingEnvRendererWithMd } from "./render-latex-lstlisting-env";

/**
 * Markdown-It plugin that adds support for LaTeX `lstlisting`-like code environments.
 *
 * - Registers a block rule for `\begin{lstlisting}...\end{lstlisting}`.
 * - Registers an inline rule for inline `lstlisting` environments.
 * - Registers an inline fence rule for backtick-style inline code.
 * - Installs a custom renderer for `latex_lstlisting_env` tokens.
 */
export default function pluginLatexCodeEnvs(md: MarkdownIt) {
  md.block.ruler.before('fence', 'latex_lstlisting_env_block', latexLstlistingEnvBlockRule, {
    alt: ['paragraph', 'reference', 'blockquote', 'list']
  });
  md.inline.ruler.before('escape', 'latex_lstlisting_env_inline', latexLstlistingEnvInlineRule);
  md.inline.ruler.before('escape', 'fence_inline', fenceInline);
  md.renderer.rules.latex_lstlisting_env = makeLatexLstlistingEnvRendererWithMd(md, 'lstlisting');
}
