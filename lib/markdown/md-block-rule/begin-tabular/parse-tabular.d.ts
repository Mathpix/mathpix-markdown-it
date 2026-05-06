import { TTokenTabular } from "./index";
import { TVerticalPos } from './common';
/**
 * Splits a tabular row into columns by unescaped '&' characters.
 * Escaped '\&' is treated as a literal '&' and does not split columns.
 */
export declare const separateByColumns: (str: string) => string[];
export declare const ParseTabular: (str: string, i: number, align?: string, options?: {}, isSubTabular?: boolean, bracket?: TVerticalPos) => Array<TTokenTabular> | null;
