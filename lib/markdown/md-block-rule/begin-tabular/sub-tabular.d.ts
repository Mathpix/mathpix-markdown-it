import { TTokenTabular } from "./index";
export declare const ClearSubTableLists: () => void;
export declare const pushSubTabular: (str: string, subRes: Array<TTokenTabular> | string, posBegin: number, posEnd: number, i?: number) => string;
export declare const getSubTabular: (sub: string, i: number, isCell?: boolean) => Array<TTokenTabular> | null;
