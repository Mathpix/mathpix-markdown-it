import { MathNode } from '../types';
import { TypstMathNode, TypstMathResult } from './types';
/** Serializer interface for AST-returning handlers */
export interface ITypstMathSerializer {
    visitNode(node: MathNode): TypstMathNode;
    visitNodeFull(node: MathNode): TypstMathResult;
}
/** Handler signature for AST-returning handlers */
export type AstHandlerFn = (node: MathNode, serialize: ITypstMathSerializer) => TypstMathResult;
