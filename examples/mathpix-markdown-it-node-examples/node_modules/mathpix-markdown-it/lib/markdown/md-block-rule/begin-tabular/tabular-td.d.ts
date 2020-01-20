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
export declare const setColumnLines: (aligns: TAligns, lines: TLines) => string[];
export declare const addStyle: (attrs: any[], style: string) => TAttrs[];
export declare const addHLineIntoStyle: (attrs: any[], line?: string, pos?: string) => TAttrs[];
export declare const AddTd: (content: string, aligns: TAligns, lines: TLines, space: string, decimal?: TDecimal) => TTokenTabular[];
export declare const AddTdSubTable: (subTable: TTokenTabular[], aligns: TAligns, lines: TLines) => TTokenTabular[];
export {};
