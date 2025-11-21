/**
 * Block rule: parse LaTeX \begin{lstlisting}[...]\end{lstlisting} as a code block token.
 * - Supports optional [mathescape] in options: math is parsed into children (text + math tokens).
 */
export declare const latexLstlistingEnvBlockRule: (state: StateBlock, startLine: number, _endLine: number, silent: boolean) => boolean;
