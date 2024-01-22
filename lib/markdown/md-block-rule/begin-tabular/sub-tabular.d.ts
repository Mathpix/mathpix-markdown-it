import { TTokenTabular } from "./index";
export declare const ClearSubTableLists: () => void;
export declare const pushSubTabular: (str: string, subTabularContent: string, subRes: Array<TTokenTabular>, posBegin: number, posEnd: number, i?: number, level?: number) => string;
export declare const getSubTabular: (sub: string, i: number, isCell?: boolean, forLatex?: boolean) => Array<TTokenTabular> | null;
