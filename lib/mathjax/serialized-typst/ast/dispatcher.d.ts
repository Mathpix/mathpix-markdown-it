import { MathNode } from '../types';
import { TypstMathResult, ITypstMathSerializer, LabelsMap } from './types';
/** Dispatch a MathML node to its AST handler. Returns TypstMathResult (block + inline). */
export declare const dispatchFull: (node: MathNode, serialize: ITypstMathSerializer) => TypstMathResult;
/**
 * Create a self-referencing ITypstMathSerializer that dispatches through the AST pipeline.
 * Children are returned as typed TypstMathNode, not raw(string).
 *
 * visitNode auto-prefers nodeInline when the block variant contains a block-level
 * code-mode function (#math.equation, #grid). Handlers that wrap children in math
 * constructs (frac, sqrt, lr, hat, hide, box, etc.) call visitNode and would
 * otherwise nest block-level constructs inside math wrappers — which Typst rejects.
 * Handlers that need both variants explicitly use visitNodeFull (mtable, mrow with
 * \left...\right, inferred mrow) and handle the block/inline split themselves.
 */
export declare const createAstSerializer: (labels?: LabelsMap) => ITypstMathSerializer;
