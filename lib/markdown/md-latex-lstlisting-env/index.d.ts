import { MarkdownIt } from 'markdown-it';
/**
 * Markdown-It plugin that adds support for LaTeX `lstlisting`-like code environments.
 *
 * - Registers a block rule for `\begin{lstlisting}...\end{lstlisting}`.
 * - Registers an inline rule for inline `lstlisting` environments.
 * - Registers an inline fence rule for backtick-style inline code.
 * - Installs a custom renderer for `latex_lstlisting_env` tokens.
 */
export default function pluginLatexCodeEnvs(md: MarkdownIt): void;
