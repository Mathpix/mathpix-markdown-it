import { RuleBlock } from 'markdown-it';
import { FigureTablePlacement } from "../common/consts";
/** Environment kind for figure/table paragraph_open tokens. */
export type FigureTableType = 'figure' | 'table';
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
