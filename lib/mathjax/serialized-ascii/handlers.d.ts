import { MmlNode } from "mathjax-full/js/core/MmlTree/MmlNode";
import { eSymbolType } from "./helperA";
import { IAsciiData } from "./common";
export declare const needFirstSpaceBeforeTeXAtom: (node: any) => boolean;
export declare const needLastSpaceAfterTeXAtom: (node: any) => boolean;
export declare const needFirstSpace: (node: any, isLiner?: boolean) => boolean;
export declare const getSymbolType: (tag: string, output: string) => "" | eSymbolType;
export declare const SymbolToAM: (tag: string, output: string, atr?: any, showStyle?: boolean) => {
    ascii: any;
    liner: any;
};
export declare const FindSymbolReplace: (str: string) => string;
export declare const FindSymbolToAM: (tag: string, output: string, atr?: any) => {
    ascii: string;
    liner: string;
};
export declare const getAttributes: (node: MmlNode) => import("mathjax-full/js/core/Tree/Node").PropertyList;
export declare const handle: (node: any, serialize: any) => IAsciiData;
