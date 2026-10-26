import { ParsedListItem, StateBlockLike, OpaqueStack } from "./latex-list-types";
export type OpaqueProcessResult = {
    consumedLine: boolean;
    lineText: string;
    stack: OpaqueStack;
    items: ParsedListItem[];
};
/**
 * Processes "opaque" inline environments inside list parsing (currently: tabular, lstlisting).
 *
 * The function may:
 * - fully consume the current source line (appending it to `items` as raw text), OR
 * - close an opaque env and return a remaining tail to be parsed again on the same line
 *   (e.g. `\end{tabular} & \begin{tabular}{l}`).
 *
 * Each pass hands back a shorter tail, so malformed input cannot spin here.
 */
export declare const processOpaqueLine: (params: {
    lineText: string;
    stack: OpaqueStack;
    items: ParsedListItem[];
    nextLine: number;
    state: StateBlockLike;
    renderStart: number;
}) => OpaqueProcessResult;
