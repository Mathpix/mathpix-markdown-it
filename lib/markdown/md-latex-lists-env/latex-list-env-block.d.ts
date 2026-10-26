import type { RuleBlock } from 'markdown-it/lib/parser_block';
import { StateBlockLike } from "./latex-list-types";
export declare const ListsInternal: (state: StateBlockLike, startLine: number, endLine: number) => boolean;
/**
 * Block rule that parses LaTeX list environments:
 *   \begin{itemize} ... \end{itemize}
 *   \begin{enumerate} ... \end{enumerate}
 *
 * It:
 *  - detects list begin/end commands,
 *  - collects and splits \item content into logical items,
 *  - handles \setcounter and nested lists on the same line,
 *  - emits corresponding *_list_open, *_list_close, and list item tokens.
 */
export declare const Lists: RuleBlock;
