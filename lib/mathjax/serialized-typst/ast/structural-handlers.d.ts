import { MathNode } from "../types";
import { TypstMathNode, TypstMathResult, ITypstMathSerializer } from "./types";
/** Detect consecutive non-Latin mi nodes and return typed AST node.
 *  Returns { node, nextIndex } or null. */
export declare const tryCombiningMiChainAst: (parentNode: MathNode, start: number) => {
    node: TypstMathNode;
    nextIndex: number;
} | null;
export declare const mrowAst: (node: MathNode, serialize: ITypstMathSerializer) => TypstMathResult;
export declare const mpaddedAst: (node: MathNode, serialize: ITypstMathSerializer) => TypstMathResult;
export declare const mphantomAst: (node: MathNode, serialize: ITypstMathSerializer) => TypstMathResult;
export declare const mencloseAst: (node: MathNode, serialize: ITypstMathSerializer) => TypstMathResult;
export declare const mstyleAst: (node: MathNode, serialize: ITypstMathSerializer) => TypstMathResult;
