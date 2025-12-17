import type { RuleBlock } from 'markdown-it/lib/parser_block';
/**
 * Block rule: parse LaTeX \begin{lstlisting}[...]\end{lstlisting} as a code block token.
 * - Supports optional [mathescape] in options: math is parsed into children (text + math tokens).
 */
export declare const latexLstlistingEnvBlockRule: RuleBlock;
