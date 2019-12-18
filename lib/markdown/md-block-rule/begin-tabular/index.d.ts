import { RuleBlock } from 'markdown-it';
export declare const openTag: RegExp;
export declare const openTagG: RegExp;
export declare type TAttrs = string[];
export declare type TTokenTabular = {
    token: string;
    tag: string;
    n: number;
    content?: string;
    attrs?: Array<TAttrs>;
};
export declare type TMulti = {
    mr?: number;
    mc?: number;
    attrs: Array<TAttrs>;
    content?: string;
    subTable?: Array<TTokenTabular>;
};
export declare const StatePushDiv: (state: any, startLine: number, nextLine: number, content: string) => void;
export declare const StatePushTabularBlock: (state: any, startLine: number, nextLine: number, content: string, align: string) => boolean;
export declare const BeginTabular: RuleBlock;
