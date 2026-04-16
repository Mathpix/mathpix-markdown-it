import { MathNode } from "../types";
import { TypstMathResult, ITypstMathSerializer } from "./types";
export declare const mtableAst: (node: MathNode, serialize: ITypstMathSerializer) => TypstMathResult;
/** mtr: join cell children with comma separator — fully typed. */
export declare const mtrAst: (node: MathNode, serialize: ITypstMathSerializer) => TypstMathResult;
