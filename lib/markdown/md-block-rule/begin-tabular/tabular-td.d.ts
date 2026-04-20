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
/** Marker on shared attrs arrays; mutators must clone before writing. */
export declare const attrsSharedMarker: unique symbol;
export declare const clearColumnStyleCache: () => void;
export declare const getSharedTableOpenAttrs: (extraClass?: string) => TAttrs[];
export declare const getSharedTbodyOpenAttrs: (numCol: number) => TAttrs[];
export declare const getSharedTrOpenAttrs: () => TAttrs[];
export declare const SHARED_TD_CLOSE: TTokenTabular;
export declare const SHARED_TR_CLOSE: TTokenTabular;
export declare const SHARED_TABLE_CLOSE: TTokenTabular;
export declare const setColumnLines: (aligns: TAligns | null, lines: TLines) => string[];
export declare const addStyle: (attrs: any[], style: string) => Array<TAttrs>;
export declare const addHLineIntoStyle: (attrs: any[], line?: string, pos?: string) => Array<TAttrs>;
export declare const AddTd: (content: string, aligns: TAligns | null, lines: TLines, space: string, decimal?: TDecimal | null) => {
    res: Array<TTokenTabular>;
    content: string;
};
export declare const AddTdSubTable: (subTable: Array<TTokenTabular>, aligns: TAligns, lines: TLines) => Array<TTokenTabular>;
export {};
