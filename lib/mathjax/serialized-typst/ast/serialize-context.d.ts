/**
 * Escape context determines how the serializer escapes content
 * inside a given function's positional math arguments.
 */
export declare const enum FuncEscapeContext {
    /** , → \,  ; → \;  : → word :  unpaired [] → \[ \] */
    Standard = "standard",
    /** Same as Standard but unpaired [] → bracket.l / bracket.r (for mat/cases cells) */
    MatrixCell = "matrix-cell",
    /** Like MatrixCell but does NOT escape commas (commas are column separators in mat rows).
     *  Escapes ; and : and replaces unpaired [] with symbol names. */
    MatrixRow = "matrix-row",
    /** Standard + unpaired () → "(" / ")" (for wrapping functions like cancel, overline) */
    Wrapper = "wrapper",
    /** \ → \\  " → \" (for string arguments inside op("...")) */
    StringArg = "string-arg",
    /** ; → \;  : → word :  inner delimiter brackets escaped (for lr() content) */
    LrContent = "lr-content",
    /** No escaping */
    None = "none"
}
/**
 * Maps function names to the escape context applied to their positional math arguments.
 * Unknown function names fall back to FuncEscapeContext.Standard.
 */
export declare const FUNC_ESCAPE_CONTEXTS: Readonly<Record<string, FuncEscapeContext>>;
