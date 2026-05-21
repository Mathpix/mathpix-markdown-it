import { RuleBlock } from 'markdown-it';
/** Environment kind for figure/table paragraph_open tokens. */
export type FigureTableType = 'figure' | 'table';
/**
 * LaTeX placement specifier captured on `\begin{figure}` / `\begin{table}`.
 * Single specifier only — multi-char combinations like `[htbp]` are not captured.
 */
export type FigureTablePlacement = 'h' | 'H' | 't' | 'b' | 'p' | '!h' | 'h!' | '!H' | 'H!' | '!t' | 't!' | '!b' | 'b!' | '!p' | 'p!';
/**
 * Shape of `meta` attached to the `paragraph_open` token of a figure/table when `forLatex` is set.
 * `placement` is present only when the source carried a recognized bracket.
 */
export interface FigureTableOpenMeta {
    type: FigureTableType;
    placement?: FigureTablePlacement;
}
export declare const ClearTableNumbers: () => void;
export declare const ClearFigureNumbers: () => void;
export declare const BeginTable: RuleBlock;
