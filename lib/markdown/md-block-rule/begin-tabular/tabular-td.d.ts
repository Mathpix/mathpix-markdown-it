import { TAttrs, TTokenTabular } from './index';
import { TDecimal } from "./common";
type TLines = {
    left?: string;
    right?: string;
    bottom?: string;
    top?: string;
};
type TAligns = {
    h?: string;
    v?: string;
    w?: string;
};
/**
 * Non-enumerable marker set on cached shared `attrs` arrays so that code
 * paths that mutate attrs (highlight, diagbox overlays) can detach a private
 * copy instead of corrupting every cell that shares the instance.
 *
 * Consumers check the marker via `(attrs as any)[attrsSharedMarker] === true`.
 * The marker is defined with `configurable: true` so the clone can clear it.
 */
export declare const attrsSharedMarker: unique symbol;
export declare const clearColumnStyleCache: () => void;
/**
 * Backward-compatible helper: returns a single `['style', X]` tuple.
 * Kept for callers (AddTdSubTable, other code paths) that still build
 * non-shared attrs arrays; prefer `composeCellStyle` + `getSharedCellAttrs`
 * for hot paths.
 */
export declare const setColumnLines: (aligns: TAligns | null, lines: TLines) => string[];
export declare const addStyle: (attrs: any[], style: string) => Array<TAttrs>;
export declare const addHLineIntoStyle: (attrs: any[], line?: string, pos?: string) => Array<TAttrs>;
export declare const AddTd: (content: string, aligns: TAligns | null, lines: TLines, space: string, decimal?: TDecimal | null) => {
    res: Array<TTokenTabular>;
    content: string;
};
export declare const AddTdSubTable: (subTable: Array<TTokenTabular>, aligns: TAligns, lines: TLines) => Array<TTokenTabular>;
export {};
