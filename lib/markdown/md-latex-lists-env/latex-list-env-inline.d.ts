import { RuleInline } from 'markdown-it';
import { EnvMatch } from "./latex-list-types";
/**
 * Finds the first complete list environment starting at `startPos`.
 * - Tracks nested itemize/enumerate via `listStack`
 * - Treats lstlisting/tabular as opaque (skips their content)
 * - Skips Markdown backtick code spans so `\begin/\end` inside code does not interfere
 */
export declare const findFirstCompleteListEnv: (src: string, startPos: number) => EnvMatch | null;
/**
 * Inline rule: recognizes a complete `\begin{itemize|enumerate}...\end{...}` sequence at the current
 * cursor, parses it with the block list parser, then injects the resulting tokens into the inline stream.
 * Any token.inlinePos produced by the block parser is shifted to absolute offsets in `state.src`.
 */
export declare const latexListEnvInline: RuleInline;
/**
 * Inline rule that parses LaTeX list environment closing commands:
 *
 *   \end{itemize}
 *   \end{enumerate}
 *
 * It:
 *  - checks that we are in block/list context,
 *  - closes any still-open list item (`latex_list_item_close`),
 *  - emits `itemize_list_close` or `enumerate_list_close`,
 *  - updates `state.level` and `state.prentLevel`,
 *  - updates internal list-level state via `leaveListLevel`,
 *  - advances `state.pos` to the end of the `\end{...}` command.
 */
export declare const listCloseInline: RuleInline;
/**
 * Inline rule that parses LaTeX list environment openings:
 *
 *   \begin{itemize}
 *   \begin{enumerate}
 *
 * It:
 *  - validates that we are in block/list context,
 *  - emits an `itemize_list_open` or `enumerate_list_open` token,
 *  - updates `state.prentLevel`, `state.parentType` and `state.types`,
 *  - advances `state.pos` to the end of the \begin{...} command,
 *  - registers the new list level in the list-level state.
 */
export declare const listBeginInline: RuleInline;
/**
 * Inline rule that parses a single LaTeX list item:
 *   \item[marker] content...
 *
 * It:
 *  - closes a previously open list item if necessary,
 *  - opens a new `latex_list_item_open` token,
 *  - parses the optional marker into `markerTokens`,
 *  - creates an `inline` token with the item content,
 *  - updates `state.pos` to the end of the current item.
 */
export declare const listItemInline: RuleInline;
/**
 * Inline rule that parses LaTeX \setcounter commands inside list environments:
 *
 *   \setcounter{enumi}{3}
 *
 * It:
 *  - validates that we are in block/list context (state.env.isBlock),
 *  - parses the numeric value,
 *  - converts N to N+1 (so the next list item starts from that value),
 *  - emits a `setcounter` token with `content = "<nextNumber>"`,
 *  - optionally attaches the original LaTeX source in `token.latex`
 *    when `md.options.forLatex` is enabled.
 *
 * Example:
 *   \setcounter{enumi}{3}  →  token.type = "setcounter", token.content = "4"
 */
export declare const listSetCounterInline: RuleInline;
