import { Handler } from '../core/Handler.js';
import { MathDocumentConstructor } from '../core/MathDocument.js';
import { MathML } from '../input/mathml.js';
import { MmlNode } from '../core/MmlTree/MmlNode.js';
import { EnrichedMathItem, EnrichedMathDocument } from './semantic-enrich.js';
export declare type Constructor<T> = new (...args: any[]) => T;
export declare type EnrichedDocumentConstructor<N, T, D> = MathDocumentConstructor<EnrichedMathDocument<N, T, D>>;
export interface ComplexityMathItem<N, T, D> extends EnrichedMathItem<N, T, D> {
    complexity(document: ComplexityMathDocument<N, T, D>): void;
}
export declare function ComplexityMathItemMixin<N, T, D, B extends Constructor<EnrichedMathItem<N, T, D>>>(BaseMathItem: B, computeComplexity: (node: MmlNode) => void): Constructor<ComplexityMathItem<N, T, D>> & B;
export interface ComplexityMathDocument<N, T, D> extends EnrichedMathDocument<N, T, D> {
    complexity(): ComplexityMathDocument<N, T, D>;
}
export declare function ComplexityMathDocumentMixin<N, T, D, B extends EnrichedDocumentConstructor<N, T, D>>(BaseDocument: B): Constructor<ComplexityMathDocument<N, T, D>> & B;
export declare function ComplexityHandler<N, T, D>(handler: Handler<N, T, D>, MmlJax?: MathML<N, T, D>): Handler<N, T, D>;
