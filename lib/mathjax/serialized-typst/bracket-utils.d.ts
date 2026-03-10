import { ITypstSerializer, MathNode } from "./types";
export declare const delimiterToTypst: (delim: string) => string;
export declare const treeContainsMo: (node: MathNode, moText: string, skipPhantom?: boolean) => boolean;
export declare const serializePrefixBeforeMo: (node: MathNode, serialize: ITypstSerializer, stopMoText: string) => string;
export declare const replaceUnpairedBrackets: (expr: string) => string;
export declare const markUnpairedBrackets: (root: MathNode) => void;
export declare const mapDelimiter: (delim: string) => string;
/** Map delimiter for use inside lr(): apply lr-specific escapes first,
 *  then fall back to typstSymbolMap, then return as-is. */
export declare const escapeLrDelimiter: (delim: string) => string;
