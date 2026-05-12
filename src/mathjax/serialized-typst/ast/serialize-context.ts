/**
 * Escape context determines how the serializer escapes content
 * inside a given function's positional math arguments.
 */
export const enum FuncEscapeContext {
  /** , → \,  ; → \;  : → word :  unpaired [] → \[ \] */
  Standard = 'standard',
  /** Same as Standard but unpaired [] → bracket.l / bracket.r (for mat/cases cells) */
  MatrixCell = 'matrix-cell',
  /** Like MatrixCell but does NOT escape commas (commas are column separators in mat rows).
   *  Escapes ; and : and replaces unpaired [] with symbol names. */
  MatrixRow = 'matrix-row',
  /** Standard + unpaired () → "(" / ")" (for wrapping functions like cancel, overline) */
  Wrapper = 'wrapper',
  /** \ → \\  " → \" (for string arguments inside op("...")) */
  StringArg = 'string-arg',
  /** ; → \;  : → word :  inner delimiter brackets escaped (for lr() content) */
  LrContent = 'lr-content',
  /** No escaping */
  None = 'none',
}

/**
 * Maps function names to the escape context applied to their positional math arguments.
 * Unknown function names fall back to FuncEscapeContext.Standard.
 */
export const FUNC_ESCAPE_CONTEXTS: Readonly<Record<string, FuncEscapeContext>> = {
  // Matrix rows — don't escape commas (column separators), only ; and :
  mat: FuncEscapeContext.MatrixRow,
  // Cases rows — escape commas within cells (commas separate rows)
  cases: FuncEscapeContext.MatrixCell,
  // Wrapping functions — also need unpaired () escaped
  cancel: FuncEscapeContext.Wrapper,
  overline: FuncEscapeContext.Wrapper,
  underline: FuncEscapeContext.Wrapper,
  sqrt: FuncEscapeContext.Wrapper,
  root: FuncEscapeContext.Wrapper,
  overbrace: FuncEscapeContext.Wrapper,
  underbrace: FuncEscapeContext.Wrapper,
  overbracket: FuncEscapeContext.Wrapper,
  underbracket: FuncEscapeContext.Wrapper,
  overparen: FuncEscapeContext.Wrapper,
  underparen: FuncEscapeContext.Wrapper,
  accent: FuncEscapeContext.Wrapper,
  hat: FuncEscapeContext.Wrapper,
  tilde: FuncEscapeContext.Wrapper,
  macron: FuncEscapeContext.Wrapper,
  grave: FuncEscapeContext.Wrapper,
  acute: FuncEscapeContext.Wrapper,
  dot: FuncEscapeContext.Wrapper,
  dot_double: FuncEscapeContext.Wrapper,
  breve: FuncEscapeContext.Wrapper,
  caron: FuncEscapeContext.Wrapper,
  // Font wrappers
  bold: FuncEscapeContext.Standard,
  italic: FuncEscapeContext.Standard,
  bb: FuncEscapeContext.Standard,
  cal: FuncEscapeContext.Standard,
  frak: FuncEscapeContext.Standard,
  sans: FuncEscapeContext.Standard,
  mono: FuncEscapeContext.Standard,
  upright: FuncEscapeContext.Standard,
  // Layout / math wrappers
  display: FuncEscapeContext.Standard,
  limits: FuncEscapeContext.Standard,
  scripts: FuncEscapeContext.Standard,
  stretch: FuncEscapeContext.Standard,
  attach: FuncEscapeContext.Standard,
  hide: FuncEscapeContext.Standard,
  // String-argument function
  op: FuncEscapeContext.StringArg,
  // Fractions
  frac: FuncEscapeContext.Standard,
  binom: FuncEscapeContext.Standard,
};
