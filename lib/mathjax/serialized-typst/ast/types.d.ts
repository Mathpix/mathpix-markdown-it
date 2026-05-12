import { MathNode } from '../types';
import { FuncEscapeContext } from './serialize-context';
export declare const enum TypstMathNodeType {
    Seq = "seq",
    Symbol = "symbol",
    Text = "text",
    Number = "number",
    Operator = "operator",
    FuncCall = "func",
    Script = "script",
    Delimited = "delimited",
    Space = "space",
    Linebreak = "linebreak",
    Alignment = "alignment",
    Raw = "raw",
    Placeholder = "placeholder",
    /** $body$ for embedding math in code-mode content blocks (#hide, #box, etc.) */
    InlineMath = "inline-math",
    /** Typst label: <key> */
    Label = "label",
    /** Matrix row with separate cells for per-cell escaping */
    MatrixRow = "matrix-row",
    /** Fallback for handler errors — preserves node text instead of losing it. */
    Error = "error"
}
export declare const enum DelimitedKind {
    /** lr(open ... close) */
    Lr = "lr",
    /** abs(body) — used when |...| has no top-level separators */
    Abs = "abs",
    /** norm(body) — used when ‖...‖ has no top-level separators */
    Norm = "norm",
    /** floor(body) — used when ⌊...⌋ has no top-level separators */
    Floor = "floor",
    /** ceil(body) — used when ⌈...⌉ has no top-level separators */
    Ceil = "ceil"
}
export declare const enum DelimiterSize {
    Big = "big",
    Bigg = "bigg"
}
export interface SeqOpts {
    /** Append \n after serialization (for sequential code-mode blocks) */
    readonly trailingNewline?: boolean;
}
export interface SeqNode extends SeqOpts {
    readonly type: TypstMathNodeType.Seq;
    readonly children: readonly TypstMathNode[];
}
/** Value is a pre-mapped Typst identifier (alpha, sum, arrow.r, RR, etc.) */
export interface SymbolNode {
    readonly type: TypstMathNodeType.Symbol;
    readonly value: string;
}
export interface TextOpts {
    /** When true, only escape \ before " and trailing \, not all backslashes.
     *  MathJax preserves raw LaTeX in mtext; Typst treats unknown \x as literal. */
    readonly preserveBackslash?: boolean;
}
/** Raw text without surrounding quotes — serializer wraps in "..." and escapes */
export interface TextNode extends TextOpts {
    readonly type: TypstMathNodeType.Text;
    readonly value: string;
}
export interface NumberNode {
    readonly type: TypstMathNodeType.Number;
    readonly value: string;
}
export interface OperatorOpts {
    /** " + ", " = " — spaces on both sides */
    readonly spaced?: boolean;
    /** Space before only (unary minus, etc.) */
    readonly unaryPrefix?: boolean;
}
export interface OperatorNode extends OperatorOpts {
    readonly type: TypstMathNodeType.Operator;
    readonly value: string;
}
export interface FuncCallOpts {
    /** Prefix with # for code-mode calls: #math.equation, #box, #grid */
    readonly hash?: boolean;
    /** Square-bracket body: name(args)[body] */
    readonly body?: readonly TypstMathNode[];
    /** Use ; instead of , between positional args (for mat() row separator) */
    readonly semicolonSep?: boolean;
    /** Override the default escape context for this function's positional math args.
     *  When set, the serializer uses this instead of looking up FUNC_ESCAPE_CONTEXTS[name]. */
    readonly escapeContext?: FuncEscapeContext;
    /** Suppress multi-line formatting even with 2+ positional args (\atop, \brace) */
    readonly singleLine?: boolean;
    /** Append \n after serialization (for sequential code-mode blocks) */
    readonly trailingNewline?: boolean;
}
export interface FuncCallNode extends FuncCallOpts {
    readonly type: TypstMathNodeType.FuncCall;
    readonly name: string;
    readonly args: readonly FuncArg[];
}
/** Matrix row with separately-escapable cells.
 *  Serializer escapes each cell individually, then joins with ", ". */
export interface MatrixRowNode {
    readonly type: TypstMathNodeType.MatrixRow;
    readonly cells: readonly TypstMathNode[];
}
export interface ScriptOpts {
    readonly sub?: TypstMathNode;
    readonly sup?: TypstMathNode;
    readonly preSub?: TypstMathNode;
    readonly preSup?: TypstMathNode;
    /** Skip parens around sub (limits(base)_arrow.l not limits(base)_(arrow.l)) */
    readonly bareSub?: boolean;
}
/** When preSub or preSup is set, serializer emits attach() instead of _/^ */
export interface ScriptNode extends ScriptOpts {
    readonly type: TypstMathNodeType.Script;
    readonly base: TypstMathNode;
}
export interface DelimitedNode {
    readonly type: TypstMathNodeType.Delimited;
    readonly kind: DelimitedKind;
    readonly body: TypstMathNode;
    readonly open: string;
    readonly close: string;
    /** \big / \bigg sizing */
    readonly size?: DelimiterSize;
}
export interface SpaceNode {
    readonly type: TypstMathNodeType.Space;
    /** thin, med, thick, quad, wide — null for zero-width */
    readonly width: string | null;
}
export interface LinebreakNode {
    readonly type: TypstMathNodeType.Linebreak;
}
export interface AlignmentNode {
    readonly type: TypstMathNodeType.Alignment;
    readonly variant: '&' | '&quad';
    /** When true, no space is inserted after the alignment marker (eqnArray style) */
    readonly compact?: boolean;
}
export interface RawOpts {
    /** Prepend \n before value */
    readonly leadingNewline?: boolean;
    /** Append \n after value */
    readonly trailingNewline?: boolean;
}
/** Pre-formatted Typst code — inserted verbatim */
export interface RawNode extends RawOpts {
    readonly type: TypstMathNodeType.Raw;
    readonly value: string;
}
/** Empty-content placeholder: "" in Typst math */
export interface PlaceholderNode {
    readonly type: TypstMathNodeType.Placeholder;
}
/** Typst label reference: serializes as ` <key>` */
export interface LabelNode {
    readonly type: TypstMathNodeType.Label;
    readonly key: string;
}
export interface InlineMathOpts {
    /** When true, use display-style spacing: $ body $ instead of $body$ */
    readonly display?: boolean;
}
/** Wraps math content in $...$ for embedding in code-mode functions (#hide, #box, etc.) */
export interface InlineMathNode extends InlineMathOpts {
    readonly type: TypstMathNodeType.InlineMath;
    readonly body: TypstMathNode;
}
/** Fallback when a handler throws — preserves source text and records the error
 *  for diagnostics. Serializes as the fallback text (best effort). */
export interface ErrorNode {
    readonly type: TypstMathNodeType.Error;
    /** Best-effort text extracted from the MathML node. */
    readonly fallbackText: string;
    /** Handler kind that failed (e.g. 'mfrac', 'msup'). */
    readonly nodeKind: string;
    /** Error message from the caught exception. */
    readonly message: string;
}
export type TypstMathNode = SeqNode | SymbolNode | TextNode | NumberNode | OperatorNode | FuncCallNode | ScriptNode | DelimitedNode | SpaceNode | LinebreakNode | AlignmentNode | RawNode | PlaceholderNode | InlineMathNode | LabelNode | MatrixRowNode | ErrorNode;
export type FuncArg = PositionalArg | NamedArg;
export declare const enum FuncArgKind {
    Positional = "positional",
    Named = "named"
}
export interface PositionalArg {
    readonly kind: FuncArgKind.Positional;
    readonly value: ArgValue;
}
export interface NamedArg {
    readonly kind: FuncArgKind.Named;
    readonly name: string;
    readonly value: ArgValue;
}
export declare const enum ArgValueType {
    Math = "math",
    String = "string",
    Bool = "bool",
    Ident = "ident",
    Length = "length",
    Raw = "raw",
    InlineMath = "inlineMath",
    Call = "call"
}
export type ArgValue = {
    readonly type: ArgValueType.Math;
    readonly node: TypstMathNode;
} | {
    readonly type: ArgValueType.String;
    readonly value: string;
} | {
    readonly type: ArgValueType.Bool;
    readonly value: boolean;
} | {
    readonly type: ArgValueType.Ident;
    readonly value: string;
} | {
    readonly type: ArgValueType.Length;
    readonly value: string;
} | {
    readonly type: ArgValueType.Raw;
    readonly value: string;
} | {
    readonly type: ArgValueType.InlineMath;
    readonly node: TypstMathNode;
    readonly display?: boolean;
} | {
    readonly type: ArgValueType.Call;
    readonly node: FuncCallNode;
};
/**
 * Handler result — carries block and inline AST variants.
 * ITypstData remains the public API; produced by serializing this.
 */
export interface TypstMathResult {
    readonly node: TypstMathNode;
    /** Undefined means identical to node */
    readonly nodeInline?: TypstMathNode;
}
/** Label info from MathJax tags system: maps labelKey → { tag, id } */
export type LabelsMap = Readonly<Record<string, {
    tag: string;
    id: string;
}>> | null;
/** Serializer interface for AST-returning handlers */
export interface ITypstMathSerializer {
    visitNode(node: MathNode): TypstMathNode;
    visitNodeFull(node: MathNode): TypstMathResult;
    /** Labels from MathJax tags system — used by getLabelKey for bare display math */
    readonly labels: LabelsMap;
    /** Accumulated conversion errors — handler failures, unexpected nodes, etc. */
    readonly errors: string[];
}
/** Handler signature for AST-returning handlers */
export type AstHandlerFn = (node: MathNode, serialize: ITypstMathSerializer) => TypstMathResult;
/** Side-channel for storing AST nodes alongside MathML nodes.
 *  MathML setProperty only accepts string | number | boolean,
 *  so we use a WeakMap keyed by the MathML node instead. */
export declare const astNodeStore: WeakMap<object, {
    preContent?: TypstMathNode;
    postContent?: TypstMathNode;
}>;
