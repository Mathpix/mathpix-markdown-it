import { MathNode } from '../types';
import { TypstMathNode, TypstMathResult, ITypstMathSerializer, LabelsMap } from './types';
/** Dispatch a MathML node to its AST handler. Returns TypstMathResult (block + inline). */
export declare const dispatchFull: (node: MathNode, serialize: ITypstMathSerializer) => TypstMathResult;
/** Dispatch a MathML node, returning only the block TypstMathNode. */
export declare const dispatch: (node: MathNode, serialize: ITypstMathSerializer) => TypstMathNode;
/**
 * Create a self-referencing ITypstMathSerializer that dispatches through the AST pipeline.
 * Children are returned as typed TypstMathNode, not raw(string).
 */
export declare const createAstSerializer: (labels?: LabelsMap) => ITypstMathSerializer;
