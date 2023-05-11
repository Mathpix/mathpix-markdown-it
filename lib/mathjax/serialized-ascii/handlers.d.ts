import { MmlNode } from "mathjax-full/js/core/MmlTree/MmlNode";
import { eSymbolType } from "./helperA";
import { IAsciiData } from "./common";
export declare const getSymbolType: (tag: string, output: string) => "" | eSymbolType;
export declare const SymbolToAM: (tag: string, output: string, atr?: any, showStyle?: boolean) => any;
export declare const FindSymbolReplace: (str: string) => string;
export declare const FindSymbolToAM: (tag: string, output: string, atr?: any) => string;
export declare const getAttributes: (node: MmlNode) => import("mathjax-full/js/core/Tree/Node").PropertyList;
export declare const handle: (node: any, serialize: any) => IAsciiData;
