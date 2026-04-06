/** MathJax TeXAtom node kind string */
export declare const TEX_ATOM = "TeXAtom";
/** MathJax mlabeledtr node kind string (numbered equation rows) */
export declare const MLABELEDTR = "mlabeledtr";
/** Non-breaking space U+00A0 (global replacement) */
export declare const RE_NBSP: RegExp;
/** Content-mode special characters: * _ ` @ # < [ ] (must be escaped in Typst [...]) */
export declare const RE_CONTENT_SPECIAL: RegExp;
/** Word char (incl. Unicode letters) or dot at end of string */
export declare const RE_WORD_DOT_END: RegExp;
/** Word char (incl. Unicode letters) or dot at start of string */
export declare const RE_WORD_DOT_START: RegExp;
/** Word char (incl. Unicode letters) at start of string */
export declare const RE_WORD_START: RegExp;
/** Detects op() wrapper prefix */
export declare const RE_OP_WRAPPER: RegExp;
/** Extracts \tag{...} content from mtext */
export declare const RE_TAG_EXTRACT: RegExp;
/** Strips \tag{...} with optional leading whitespace (global) */
export declare const RE_TAG_STRIP: RegExp;
/** Any ASCII bracket character */
export declare const RE_BRACKET_CHARS: RegExp;
/** Single word character (for single-char tests) */
export declare const RE_WORD_CHAR: RegExp;
/** ASCII letter (for function-call detection — Typst funcs are ASCII identifiers) */
export declare const RE_ASCII_LETTER: RegExp;
/** Trailing whitespace */
export declare const RE_TRAILING_WS: RegExp;
/** Leading whitespace */
export declare const RE_LEADING_WS: RegExp;
/** Unicode thin/medium/narrow spaces and NBSP */
export declare const RE_UNICODE_SPACES: RegExp;
/** Trailing Typst spacing keywords */
export declare const RE_TRAILING_SPACING: RegExp;
/** Exactly 3 digits (thousand separator) */
export declare const RE_THREE_DIGITS: RegExp;
/** Exactly 2 digits (Indian numbering) */
export declare const RE_TWO_DIGITS: RegExp;
/** Phantom subscript/superscript base pattern */
export declare const RE_PHANTOM_BASE: RegExp;
/** Token start: word char, dot, quote, or non-ASCII */
export declare const RE_TOKEN_START: RegExp;
/** Natural separator at end of string */
export declare const RE_SEPARATOR_END: RegExp;
/** Ends with an ASCII letter (for function-call ambiguity check) */
export declare const RE_ALPHA_END: RegExp;
/** Trailing word starting with a letter (captures the identifier) */
export declare const RE_TRAILING_IDENT: RegExp;
/** Trailing dotted symbol name: arrow.l, chevron.r, floor.l, etc. */
export declare const RE_TRAILING_DOTTED_IDENT: RegExp;
/** Text with at least one Latin-script letter, optionally with combining marks/digits (NOT non-Latin) */
export declare const RE_LATIN_WITH_MARKS: RegExp;
/** String of Unicode letters and combining marks only */
export declare const RE_LETTERS_AND_MARKS: RegExp;
/** Property name for pre-mtable content (set in index.ts, read in table-handlers.ts) */
export declare const DATA_PRE_CONTENT = "data-pre-content";
/** Property name for post-mtable content (set in index.ts, read in table-handlers.ts) */
export declare const DATA_POST_CONTENT = "data-post-content";
/** Property name for auto-generated tag flag */
export declare const DATA_TAG_AUTO = "data-tag-auto";
/** Property name for label key storage */
export declare const DATA_LABEL_KEY = "data-label-key";
/** Property name for unpaired bracket direction marker */
export declare const UNPAIRED_BRACKET_PROP = "data-unpaired-bracket";
/** Typst empty-content placeholder: two double-quotes represent an empty string in math mode */
export declare const TYPST_PLACEHOLDER = "\"\"";
/** Default equation numbering format */
export declare const DEFAULT_EQ_NUMBERING = "\"(1)\"";
/** Figure kind for equation tags */
export declare const EQ_TAG_FIGURE_KIND = "eq-tag";
export declare const FUNC_APPLY = "\u2061";
export declare const INVISIBLE_TIMES = "\u2062";
export declare const INVISIBLE_SEP = "\u2063";
export declare const INVISIBLE_PLUS = "\u2064";
export declare const MINUS_SIGN = "\u2212";
export declare const PLUS_MINUS = "\u00B1";
export declare const MINUS_PLUS = "\u2213";
export declare const HORIZ_BAR = "\u2015";
export declare const RIGHT_ARROW = "\u2192";
export declare const LEFT_ARROW = "\u2190";
export declare const DOUBLE_VERT = "\u2016";
export declare const PARALLEL_SIGN = "\u2225";
export declare const LEFT_FLOOR = "\u230A";
export declare const RIGHT_FLOOR = "\u230B";
export declare const LEFT_CEIL = "\u2308";
export declare const RIGHT_CEIL = "\u2309";
export declare const LEFT_CHEVRON = "\u27E8";
export declare const RIGHT_CHEVRON = "\u27E9";
export declare const LEFT_ANGLE_OLD = "\u2329";
export declare const RIGHT_ANGLE_OLD = "\u232A";
export declare const INTEGRAL_SIGN = "\u222B";
export declare const MIDLINE_ELLIPSIS = "\u22EF";
/** Node kinds that carry sub/superscripts */
export declare const SCRIPT_NODE_KINDS: ReadonlySet<string>;
/** Prime characters used in derivative patterns (′ ″ ‴) */
export declare const PRIME_CHARS: ReadonlySet<string>;
/** Maximum tree depth for shallow walks (accent detection, phantom check, etc.).
 *  MathJax wraps content in inferredMrow/TeXAtom layers; 5 levels is enough
 *  to reach through these wrappers without traversing the entire tree. */
export declare const SHALLOW_TREE_MAX_DEPTH = 5;
export declare const OPEN_BRACKETS: Readonly<Record<string, string>>;
export declare const CLOSE_BRACKETS: Readonly<Record<string, string>>;
/** Built-in Typst math operators — should NOT be wrapped in upright() or op().
 *  Only includes operators natively recognized by Typst. Non-built-in operators
 *  (arccot, arcsec, arccsc, sech, csch) need op() wrapping and are NOT listed here. */
export declare const TYPST_MATH_OPERATORS: ReadonlySet<string>;
/** Built-in Typst math operators and functions where name( is valid syntax.
 *  Multi-char identifiers NOT in this set get a space before ( to avoid
 *  Typst parsing e.g. emptyset(x) as a function call. */
export declare const TYPST_BUILTIN_OPS: ReadonlySet<string>;
/** Typst box styling constants for \boxed, \fbox, \circle, bordered arrays. */
export declare const BOX_STROKE = "0.5pt";
export declare const BOX_INSET = "3pt";
/** Typst escaped-delimiter output for unpaired brackets (math-mode safe) */
export declare const UNPAIRED_BRACKET_TYPST: Readonly<Record<string, string>>;
