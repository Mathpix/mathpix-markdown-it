import { UNWRAP_MAX_DEPTH } from '../consts';
import {
  TypstMathNodeType,
  TypstMathNode,
  TypstMathResult,
  SeqNode, SeqOpts,
  SymbolNode,
  TextNode, TextOpts,
  NumberNode,
  OperatorNode, OperatorOpts,
  FuncCallNode, FuncCallOpts,
  ScriptNode, ScriptOpts,
  DelimitedNode,
  DelimitedKind,
  DelimiterSize,
  SpaceNode,
  LinebreakNode,
  AlignmentNode,
  RawNode, RawOpts,
  PlaceholderNode,
  InlineMathNode, InlineMathOpts,
  LabelNode,
  MatrixRowNode,
  ErrorNode,
  FuncArg,
  PositionalArg,
  NamedArg,
  ArgValue,
  ArgValueType,
  FuncArgKind,
} from './types';

export const seq = (children: TypstMathNode[], opts?: SeqOpts): SeqNode => ({
  type: TypstMathNodeType.Seq,
  children,
  ...opts,
});

export const EMPTY_RESULT: TypstMathResult = {
  node: seq([])
};

export const symbol = (value: string): SymbolNode => ({
  type: TypstMathNodeType.Symbol,
  value,
});

export const text = (value: string, opts?: TextOpts): TextNode => ({
  type: TypstMathNodeType.Text,
  value,
  ...opts,
});

export const num = (value: string): NumberNode => ({
  type: TypstMathNodeType.Number,
  value,
});

export const operator = (value: string, opts?: OperatorOpts): OperatorNode => ({
  type: TypstMathNodeType.Operator,
  value,
  ...opts,
});

export const funcCall = (name: string, args: FuncArg[], opts?: FuncCallOpts): FuncCallNode => ({
  type: TypstMathNodeType.FuncCall,
  name,
  args,
  ...opts,
});

export const scriptNode = (base: TypstMathNode, opts: ScriptOpts): ScriptNode => ({
  type: TypstMathNodeType.Script,
  base,
  ...opts,
});

export const delimited = (
  kind: DelimitedKind,
  body: TypstMathNode,
  open: string,
  close: string,
  size?: DelimiterSize,
): DelimitedNode => ({
  type: TypstMathNodeType.Delimited,
  kind,
  body,
  open,
  close,
  size,
});

export const space = (width: string | null): SpaceNode => ({
  type: TypstMathNodeType.Space,
  width,
});

export const linebreak = (): LinebreakNode => ({
  type: TypstMathNodeType.Linebreak,
});

export const alignment = (variant: '&' | '&quad', compact = false): AlignmentNode => ({
  type: TypstMathNodeType.Alignment,
  variant,
  ...(compact ? { compact: true } : {}),
});

export const raw = (value: string, opts?: RawOpts): RawNode => ({
  type: TypstMathNodeType.Raw,
  ...opts,
  value,
});

export const placeholder = (): PlaceholderNode => ({
  type: TypstMathNodeType.Placeholder,
});

export const posArg = (value: ArgValue): PositionalArg => ({
  kind: FuncArgKind.Positional,
  value,
});

export const namedArg = (name: string, value: ArgValue): NamedArg => ({
  kind: FuncArgKind.Named,
  name,
  value,
});

export const mathVal = (node: TypstMathNode): ArgValue => ({
  type: ArgValueType.Math,
  node,
});

export const strVal = (value: string): ArgValue => ({
  type: ArgValueType.String,
  value,
});

export const boolVal = (value: boolean): ArgValue => ({
  type: ArgValueType.Bool,
  value,
});

export const identVal = (value: string): ArgValue => ({
  type: ArgValueType.Ident,
  value,
});

export const lengthVal = (value: string): ArgValue => ({
  type: ArgValueType.Length,
  value,
});

export const rawVal = (value: string): ArgValue => ({
  type: ArgValueType.Raw,
  value,
});

export const matrixRow = (cells: TypstMathNode[]): MatrixRowNode => ({
  type: TypstMathNodeType.MatrixRow,
  cells,
});

export const label = (key: string): LabelNode => ({
  type: TypstMathNodeType.Label,
  key,
});

export const inlineMath = (body: TypstMathNode, opts?: InlineMathOpts): InlineMathNode => ({
  type: TypstMathNodeType.InlineMath,
  body,
  ...opts,
});

export const inlineMathVal = (node: TypstMathNode, display?: boolean): ArgValue => ({
  type: ArgValueType.InlineMath,
  node,
  ...(display !== undefined ? { display } : {}),
});

export const callVal = (node: FuncCallNode): ArgValue => ({
  type: ArgValueType.Call,
  node,
});

export const errorNode = (fallbackText: string, nodeKind: string, message: string): ErrorNode => ({
  type: TypstMathNodeType.Error,
  fallbackText,
  nodeKind,
  message,
});

/** Check if a node will serialize to empty/whitespace-only string.
 *  Avoids O(n) serializeTypstMath() for emptiness checks. */
export const isEmptyNode = (node: TypstMathNode): boolean => {
  switch (node.type) {
    case TypstMathNodeType.Seq:
      return node.children.length === 0 || node.children.every(isEmptyNode);
    case TypstMathNodeType.Symbol:
      return !node.value;
    case TypstMathNodeType.Text:
      return !node.value;
    case TypstMathNodeType.Number:
      return !node.value;
    case TypstMathNodeType.Placeholder:
      return false; // serializes to "" which is non-empty
    case TypstMathNodeType.Space:
      return !node.width; // null-width spaces serialize to ''
    case TypstMathNodeType.Error:
      return !node.fallbackText;
    default:
      return false;
  }
};

/** Get the value of a single Symbol node, unwrapping single-child Seq.
 *  Returns null for non-symbol or multi-node trees. */
export const getSymbolValue = (node: TypstMathNode, depth = 0): string | null => {
  if (node.type === TypstMathNodeType.Symbol) {
    return node.value;
  }
  if (depth < UNWRAP_MAX_DEPTH && node.type === TypstMathNodeType.Seq && node.children.length === 1) {
    return getSymbolValue(node.children[0], depth + 1);
  }
  return null;
};
