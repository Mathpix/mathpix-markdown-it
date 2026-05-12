"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FUNC_ESCAPE_CONTEXTS = void 0;
/**
 * Maps function names to the escape context applied to their positional math arguments.
 * Unknown function names fall back to FuncEscapeContext.Standard.
 */
exports.FUNC_ESCAPE_CONTEXTS = {
    // Matrix rows — don't escape commas (column separators), only ; and :
    mat: "matrix-row" /* FuncEscapeContext.MatrixRow */,
    // Cases rows — escape commas within cells (commas separate rows)
    cases: "matrix-cell" /* FuncEscapeContext.MatrixCell */,
    // Wrapping functions — also need unpaired () escaped
    cancel: "wrapper" /* FuncEscapeContext.Wrapper */,
    overline: "wrapper" /* FuncEscapeContext.Wrapper */,
    underline: "wrapper" /* FuncEscapeContext.Wrapper */,
    sqrt: "wrapper" /* FuncEscapeContext.Wrapper */,
    root: "wrapper" /* FuncEscapeContext.Wrapper */,
    overbrace: "wrapper" /* FuncEscapeContext.Wrapper */,
    underbrace: "wrapper" /* FuncEscapeContext.Wrapper */,
    overbracket: "wrapper" /* FuncEscapeContext.Wrapper */,
    underbracket: "wrapper" /* FuncEscapeContext.Wrapper */,
    overparen: "wrapper" /* FuncEscapeContext.Wrapper */,
    underparen: "wrapper" /* FuncEscapeContext.Wrapper */,
    accent: "wrapper" /* FuncEscapeContext.Wrapper */,
    hat: "wrapper" /* FuncEscapeContext.Wrapper */,
    tilde: "wrapper" /* FuncEscapeContext.Wrapper */,
    macron: "wrapper" /* FuncEscapeContext.Wrapper */,
    grave: "wrapper" /* FuncEscapeContext.Wrapper */,
    acute: "wrapper" /* FuncEscapeContext.Wrapper */,
    dot: "wrapper" /* FuncEscapeContext.Wrapper */,
    dot_double: "wrapper" /* FuncEscapeContext.Wrapper */,
    breve: "wrapper" /* FuncEscapeContext.Wrapper */,
    caron: "wrapper" /* FuncEscapeContext.Wrapper */,
    // Font wrappers
    bold: "standard" /* FuncEscapeContext.Standard */,
    italic: "standard" /* FuncEscapeContext.Standard */,
    bb: "standard" /* FuncEscapeContext.Standard */,
    cal: "standard" /* FuncEscapeContext.Standard */,
    frak: "standard" /* FuncEscapeContext.Standard */,
    sans: "standard" /* FuncEscapeContext.Standard */,
    mono: "standard" /* FuncEscapeContext.Standard */,
    upright: "standard" /* FuncEscapeContext.Standard */,
    // Layout / math wrappers
    display: "standard" /* FuncEscapeContext.Standard */,
    limits: "standard" /* FuncEscapeContext.Standard */,
    scripts: "standard" /* FuncEscapeContext.Standard */,
    stretch: "standard" /* FuncEscapeContext.Standard */,
    attach: "standard" /* FuncEscapeContext.Standard */,
    hide: "standard" /* FuncEscapeContext.Standard */,
    // String-argument function
    op: "string-arg" /* FuncEscapeContext.StringArg */,
    // Fractions
    frac: "standard" /* FuncEscapeContext.Standard */,
    binom: "standard" /* FuncEscapeContext.Standard */,
};
//# sourceMappingURL=serialize-context.js.map