import { MmlNode } from "mathjax-full/js/core/MmlTree/MmlNode";
export declare const SymbolToAM: (tag: string, output: string, atr?: any) => any;
export declare const FindSymbolToAM: (tag: string, output: string) => string;
export declare const getAttributes: (node: MmlNode) => import("mathjax-full/js/core/Tree/Node").PropertyList;
export declare const handle: (node: any, serialize: any) => any;
