import { TAttrs, TTokenTabular } from './index';
import { TDecimal } from "./common";
declare type TLines = {
    left?: string;
    right?: string;
    bottom?: string;
    top?: string;
};
declare type TAligns = {
    h?: string;
    v?: string;
    w?: string;
};
export declare const setColumnLines: (aligns: TAligns | null, lines: TLines) => string[];
export declare const addStyle: (attrs: any[], style: string) => Array<TAttrs>;
export declare const addHLineIntoStyle: (attrs: any[], line?: string, pos?: string) => Array<TAttrs>;
export declare const AddTd: (content: string, aligns: TAligns | null, lines: TLines, space: string, decimal?: TDecimal | null) => {
    res: Array<TTokenTabular>;
    content: string;
};
export declare const AddTdSubTable: (subTable: Array<TTokenTabular>, aligns: TAligns, lines: TLines) => Array<TTokenTabular>;
export {};
