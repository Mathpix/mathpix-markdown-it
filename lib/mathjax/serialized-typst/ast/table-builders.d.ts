import { MathNode } from "../types";
import { TypstMathNode, TypstMathResult, ITypstMathSerializer } from "./types";
/** numcases/subnumcases → #grid() with cases + numbering column. */
export declare const buildNumcasesGrid: (node: MathNode, serialize: ITypstMathSerializer, countRow: number) => TypstMathResult;
/** Join row nodes with \\ separators, optionally prepending preContent. */
export declare const joinRowNodes: (rowNodes: TypstMathNode[], preContentNode: TypstMathNode | null) => TypstMathNode;
/** eqnArray rendered as mat() — nested or has lines. */
export declare const buildEqnArrayAsMatResult: (rowNodes: TypstMathNode[], rowNodesInline: TypstMathNode[], align: string, augment: string, addDisplay: boolean) => TypstMathResult;
/** eqnArray with tags → number-align / separate / no-tag strategies. */
export declare const buildTaggedEqnArrayResult: (node: MathNode, serialize: ITypstMathSerializer, rowNodes: TypstMathNode[], countRow: number, preContentNode: TypstMathNode | null, postContentNode: TypstMathNode | null, rowNodesInline?: TypstMathNode[]) => TypstMathResult;
/** eqnArray without tags → rows with \\ separators. */
export declare const buildUntaggedEqnArrayResult: (rowNodes: TypstMathNode[], preContentNode: TypstMathNode | null, postContentNode: TypstMathNode | null, rowNodesInline?: TypstMathNode[]) => TypstMathResult;
/** matrix → mat(delim: ..., ...) with augment/align/frame. */
export declare const buildMatrixResult: (node: MathNode, rowNodes: TypstMathNode[], branchOpen: string, branchClose: string, rowNodesInline?: TypstMathNode[]) => TypstMathResult;
