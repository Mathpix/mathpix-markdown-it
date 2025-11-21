/**
 * Inline rule: parse \begin{lstlisting}[...]\end{lstlisting} in inline stream.
 * - Emits 'latex_lstlisting_env' token (block=false), so renderer can output <pre><code>...</code></pre>.
 * - If [mathescape] present, children are math-only tokens (text + inline/display math),
 *   everything else stays plain text.
 */
export declare const latexLstlistingEnvInlineRule: (state: StateInline, silent: boolean) => boolean;
