import { MarkdownIt } from 'markdown-it';
/**
 * Markdown-it plugin that adds full LaTeX-style list environment support:
 *   \begin{itemize} ... \end{itemize}
 *   \begin{enumerate} ... \end{enumerate}
 *   \item, \setcounter, nested lists, inline and block modes.
 *
 * The plugin:
 *  • registers custom block and inline rules for LaTeX list parsing,
 *  • manages internal list state (nesting, counters, markers),
 *  • injects dedicated renderers for itemize/enumerate tokens,
 *  • safely coexists with builtin markdown-it list rules.
 *
 * Should be loaded once per MarkdownIt instance.
 */
export default function pluginLatexListsEnv(md: MarkdownIt, options: any): void;
