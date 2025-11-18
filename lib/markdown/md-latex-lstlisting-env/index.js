"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var latex_lstlisting_env_block_1 = require("./latex-lstlisting-env-block");
var latex_lstlisting_env_inline_1 = require("./latex-lstlisting-env-inline");
var fence_inline_1 = require("../md-inline-rule/fence-inline");
var render_latex_lstlisting_env_1 = require("./render-latex-lstlisting-env");
/**
 * Markdown-It plugin that adds support for LaTeX `lstlisting`-like code environments.
 *
 * - Registers a block rule for `\begin{lstlisting}...\end{lstlisting}`.
 * - Registers an inline rule for inline `lstlisting` environments.
 * - Registers an inline fence rule for backtick-style inline code.
 * - Installs a custom renderer for `latex_lstlisting_env` tokens.
 */
function pluginLatexCodeEnvs(md) {
    md.block.ruler.before('fence', 'latex_lstlisting_env_block', latex_lstlisting_env_block_1.latexLstlistingEnvBlockRule, {
        alt: ['paragraph', 'reference', 'blockquote', 'list']
    });
    md.inline.ruler.before('escape', 'latex_lstlisting_env_inline', latex_lstlisting_env_inline_1.latexLstlistingEnvInlineRule);
    md.inline.ruler.before('escape', 'fence_inline', fence_inline_1.fenceInline);
    md.renderer.rules.latex_lstlisting_env = (0, render_latex_lstlisting_env_1.makeLatexLstlistingEnvRendererWithMd)(md, 'lstlisting');
}
exports.default = pluginLatexCodeEnvs;
//# sourceMappingURL=index.js.map