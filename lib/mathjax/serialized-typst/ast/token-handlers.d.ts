import { MathNode } from "../types";
import { TypstMathResult, ITypstMathSerializer } from "./types";
export declare const mnAst: (node: MathNode, _serialize: ITypstMathSerializer) => TypstMathResult;
export declare const mspaceAst: (node: MathNode, _serialize: ITypstMathSerializer) => TypstMathResult;
export declare const miAst: (node: MathNode, _serialize: ITypstMathSerializer) => TypstMathResult;
export declare const moAst: (node: MathNode, _serialize: ITypstMathSerializer) => TypstMathResult;
export declare const mtextAst: (node: MathNode, _serialize: ITypstMathSerializer) => TypstMathResult;
