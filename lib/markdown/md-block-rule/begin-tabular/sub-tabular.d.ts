import { TTokenTabular } from "./index";
export declare const ClearSubTableLists: () => void;
export declare const pushSubTabular: (str: string, subTabularContent: string, subRes: Array<TTokenTabular>, posBegin: number, posEnd: number, i?: number, level?: number) => string;
/**
 * Expands <...> / <<...>> placeholders inside a tabular cell by replacing them with cached
 * sub-tabular content (or diagbox fallback). If injected content contains a list begin
 * (or other block-ish LaTeX), it may be newline-wrapped to keep downstream block parsing stable.
 */
export declare const getSubTabular: (sub: string, i: number, isCell?: boolean, forLatex?: boolean) => Array<TTokenTabular> | null;
