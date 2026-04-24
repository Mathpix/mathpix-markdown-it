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
export declare const clearColumnStyleCache: () => void;
export declare const getSharedTableOpenAttrs: (extraClass?: string, skipVisual?: boolean) => TAttrs[] | undefined;
export declare const getSharedTbodyOpenAttrs: (numCol: number) => TAttrs[];
export declare const getSharedTrOpenAttrs: (skipVisual?: boolean) => TAttrs[] | undefined;
export declare const SHARED_TD_CLOSE: TTokenTabular;
export declare const SHARED_TR_CLOSE: TTokenTabular;
export declare const SHARED_TABLE_CLOSE: TTokenTabular;
export declare const SHARED_TBODY_CLOSE: TTokenTabular;
export declare const setColumnLines: (aligns: TAligns | null, lines: TLines) => string[];
export declare const addStyle: (attrs: any[], style: string) => Array<TAttrs>;
export declare const addHLineIntoStyle: (attrs: any[], line?: string, pos?: string) => Array<TAttrs>;
export declare const AddTd: (content: string, aligns: TAligns | null, lines: TLines, space: string, decimal?: TDecimal | null, skipVisual?: boolean) => {
    res: Array<TTokenTabular>;
    content: string;
};
export declare const AddTdSubTable: (subTable: Array<TTokenTabular>, aligns: TAligns, lines: TLines, skipVisual?: boolean) => Array<TTokenTabular>;
export {};
