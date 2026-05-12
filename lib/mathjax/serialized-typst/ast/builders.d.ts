import { TypstMathNode, TypstMathResult, SeqNode, SeqOpts, SymbolNode, TextNode, TextOpts, NumberNode, OperatorNode, OperatorOpts, FuncCallNode, FuncCallOpts, ScriptNode, ScriptOpts, DelimitedNode, DelimitedKind, DelimiterSize, SpaceNode, LinebreakNode, AlignmentNode, RawNode, RawOpts, PlaceholderNode, InlineMathNode, InlineMathOpts, LabelNode, MatrixRowNode, ErrorNode, FuncArg, PositionalArg, NamedArg, ArgValue } from './types';
export declare const seq: (children: TypstMathNode[], opts?: SeqOpts) => SeqNode;
export declare const EMPTY_RESULT: TypstMathResult;
export declare const symbol: (value: string) => SymbolNode;
export declare const text: (value: string, opts?: TextOpts) => TextNode;
export declare const num: (value: string) => NumberNode;
export declare const operator: (value: string, opts?: OperatorOpts) => OperatorNode;
export declare const funcCall: (name: string, args: FuncArg[], opts?: FuncCallOpts) => FuncCallNode;
export declare const scriptNode: (base: TypstMathNode, opts: ScriptOpts) => ScriptNode;
export declare const delimited: (kind: DelimitedKind, body: TypstMathNode, open: string, close: string, size?: DelimiterSize) => DelimitedNode;
export declare const space: (width: string | null) => SpaceNode;
export declare const linebreak: () => LinebreakNode;
export declare const alignment: (variant: '&' | '&quad', compact?: boolean) => AlignmentNode;
export declare const raw: (value: string, opts?: RawOpts) => RawNode;
export declare const placeholder: () => PlaceholderNode;
export declare const posArg: (value: ArgValue) => PositionalArg;
export declare const namedArg: (name: string, value: ArgValue) => NamedArg;
export declare const mathVal: (node: TypstMathNode) => ArgValue;
export declare const strVal: (value: string) => ArgValue;
export declare const boolVal: (value: boolean) => ArgValue;
export declare const identVal: (value: string) => ArgValue;
export declare const lengthVal: (value: string) => ArgValue;
export declare const rawVal: (value: string) => ArgValue;
export declare const matrixRow: (cells: TypstMathNode[]) => MatrixRowNode;
export declare const label: (key: string) => LabelNode;
export declare const inlineMath: (body: TypstMathNode, opts?: InlineMathOpts) => InlineMathNode;
export declare const inlineMathVal: (node: TypstMathNode, display?: boolean) => ArgValue;
export declare const callVal: (node: FuncCallNode) => ArgValue;
export declare const errorNode: (fallbackText: string, nodeKind: string, message: string) => ErrorNode;
/** Check if a node will serialize to empty/whitespace-only string.
 *  Avoids O(n) serializeTypstMath() for emptiness checks. */
export declare const isEmptyNode: (node: TypstMathNode) => boolean;
/** Get the value of a single Symbol node, unwrapping single-child Seq.
 *  Returns null for non-symbol or multi-node trees. */
export declare const getSymbolValue: (node: TypstMathNode, depth?: number) => string | null;
