import { TypstMathNode } from './types';
/** Side-channel for storing AST nodes alongside MathML nodes.
 *  MathML setProperty only accepts string | number | boolean,
 *  so we use a WeakMap keyed by the MathML node instead. */
export declare const astNodeStore: WeakMap<object, {
    preContent?: TypstMathNode;
    postContent?: TypstMathNode;
}>;
