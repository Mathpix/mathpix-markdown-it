import { MathNode } from './types';
import { TypstMathNode } from './ast/types';
import { ITypstMathSerializer } from './ast/types';
/** Result of a successful pattern match in visitInferredMrowNode. */
export interface PatternResult {
    node: TypstMathNode;
    nextJ: number;
}
/** Check if a child node is a tagged eqnArray mtable. */
export declare const isTaggedEqnArray: (child: MathNode) => boolean;
/** Big delimiter pattern: TeXAtom(OPEN) ... TeXAtom(CLOSE) with sized mo */
export declare const tryBigDelimiterPattern: (node: MathNode, j: number, serialize: ITypstMathSerializer) => PatternResult | null;
/** Bare delimiter pairing: |...|, floor, ceil, norm, chevron.
 *  Groups content for correct subscript/superscript attachment and produces
 *  Typst shorthand functions (ceil, floor, norm) or lr() for matched pairs.
 *
 *  Key invariant: the content between opener and closer must have balanced
 *  brackets — ALL delimiter types ((), [], {}, ⟨⟩, ⌊⌋, ⌈⌉) are tracked.
 *  This prevents |...\rangle from being swallowed into a wrong |...| pair
 *  when ⟩ sits between the two pipes. */
export declare const tryBareDelimiterPattern: (node: MathNode, j: number, serialize: ITypstMathSerializer) => PatternResult | null;
/** \idotsint pattern: mo(integral) mo(dots) scripted(mo(integral)) */
export declare const tryIdotsintPattern: (node: MathNode, j: number, serialize: ITypstMathSerializer) => PatternResult | null;
/** Thousand separator chain: mn, mo(,), mn(3 digits) */
export declare const tryThousandSepPattern: (node: MathNode, j: number, serialize: ITypstMathSerializer) => PatternResult | null;
