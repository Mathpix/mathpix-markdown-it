import { TTokenTabular } from "./index";
import { TVerticalPos } from "./common";
export declare const ClearSubTableLists: () => void;
export declare const getSubTabularBracket: (placeholderOrId: string) => TVerticalPos | undefined;
export declare const pushSubTabular: (str: string, subTabularContent: string, subRes: Array<TTokenTabular>, posBegin: number, posEnd: number, i?: number, level?: number, bracket?: TVerticalPos) => string;
/**
 * Expands <...> / <<...>> placeholders inside a tabular cell by replacing them with cached
 * sub-tabular content (or diagbox fallback). If injected content contains a list begin
 * (or other block-ish LaTeX), it may be newline-wrapped to keep downstream block parsing stable.
 */
export declare const getSubTabular: (sub: string, i: number, isCell?: boolean, forLatex?: boolean) => Array<TTokenTabular> | null;
