/** MathJax TeXAtom node kind string */
export const TEX_ATOM = 'TeXAtom';

/** MathJax mlabeledtr node kind string (numbered equation rows) */
export const MLABELEDTR = 'mlabeledtr';

/** Non-breaking space U+00A0 (global replacement) */
export const RE_NBSP = /\u00A0/g;
/** Content-mode special characters: * _ ` @ # < [ ] (must be escaped in Typst [...]) */
export const RE_CONTENT_SPECIAL = /[*_`@#<\[\]]/g;
/** Word char (incl. Unicode letters) or dot at end of string */
export const RE_WORD_DOT_END = /[\w\p{L}.]$/u;
/** Word char (incl. Unicode letters) or dot at start of string */
export const RE_WORD_DOT_START = /^[\w\p{L}.]/u;
/** Word char (incl. Unicode letters) at start of string */
export const RE_WORD_START = /^[\w\p{L}]/u;
/** Detects op() wrapper prefix */
export const RE_OP_WRAPPER = /^op\(/;
/** Extracts \tag{...} content from mtext */
export const RE_TAG_EXTRACT = /\\tag\{([^}]+)\}/;
/** Strips \tag{...} with optional leading whitespace (global) */
export const RE_TAG_STRIP = /\s*\\tag\{[^}]+\}/g;
/** Any ASCII bracket character */
export const RE_BRACKET_CHARS = /[\[\](){}]/;
/** Single word character (for single-char tests) */
export const RE_WORD_CHAR = /[\w\p{L}]/u;
/** ASCII letter (for function-call detection — Typst funcs are ASCII identifiers) */
export const RE_ASCII_LETTER = /[a-zA-Z]/;
/** Trailing whitespace */
export const RE_TRAILING_WS = /\s$/;
/** Leading whitespace */
export const RE_LEADING_WS = /^\s/;
/** Unicode thin/medium/narrow spaces and NBSP */
export const RE_UNICODE_SPACES = /[\u2006\u2005\u2004\u2009\u200A\u00A0]/g;
/** Trailing Typst spacing keywords */
export const RE_TRAILING_SPACING = /\s+(?:med|thin|thick|quad)$/;
/** Exactly 3 digits (thousand separator) */
export const RE_THREE_DIGITS = /^\d{3}$/;
/** Exactly 2 digits (Indian numbering) */
export const RE_TWO_DIGITS = /^\d{2}$/;
/** Phantom subscript/superscript base pattern */
export const RE_PHANTOM_BASE = /^""[_^]/;
/** Token start: word char, dot, quote, or non-ASCII */
export const RE_TOKEN_START = /^[\w."\u0080-\uFFFF]/;
/** Natural separator at end of string */
export const RE_SEPARATOR_END = /[\s({[,|]$/;
/** Ends with an ASCII letter (for function-call ambiguity check) */
export const RE_ALPHA_END = /[a-zA-Z]$/;
/** Trailing word starting with a letter (captures the identifier) */
export const RE_TRAILING_IDENT = /([a-zA-Z]\w*)$/;
/** Trailing dotted symbol name: arrow.l, chevron.r, floor.l, etc. */
export const RE_TRAILING_DOTTED_IDENT = /([a-zA-Z]\w*(?:\.[a-zA-Z]\w*)*)$/;
/** Text with at least one Latin-script letter, optionally with combining marks/digits (NOT non-Latin) */
export const RE_LATIN_WITH_MARKS = /^[\p{Script=Latin}\p{M}\d]*\p{Script=Latin}[\p{Script=Latin}\p{M}\d]*$/u;
/** String of Unicode letters and combining marks only */
export const RE_LETTERS_AND_MARKS = /^[\p{L}\p{M}]+$/u;

/** Property name for pre-mtable content (set in index.ts, read in table-handlers.ts) */
export const DATA_PRE_CONTENT = 'data-pre-content';
/** Property name for post-mtable content (set in index.ts, read in table-handlers.ts) */
export const DATA_POST_CONTENT = 'data-post-content';
/** Property name for auto-generated tag flag */
export const DATA_TAG_AUTO = 'data-tag-auto';
/** Property name for label key storage */
export const DATA_LABEL_KEY = 'data-label-key';
/** Property name for unpaired bracket direction marker */
export const UNPAIRED_BRACKET_PROP = 'data-unpaired-bracket';
/** Typst empty-content placeholder: two double-quotes represent an empty string in math mode */
export const TYPST_PLACEHOLDER = '""';
/** Default equation numbering format */
export const DEFAULT_EQ_NUMBERING = '"(1)"';
/** Figure kind for equation tags */
export const EQ_TAG_FIGURE_KIND = 'eq-tag';

// Unicode character constants — named for readability
// Invisible math operators (MathML)
export const FUNC_APPLY = '\u2061';            // ⁡ function application
export const INVISIBLE_TIMES = '\u2062';       // ⁢ invisible times
export const INVISIBLE_SEP = '\u2063';         // ⁣ invisible separator
export const INVISIBLE_PLUS = '\u2064';        // ⁤ invisible plus
// Math operator code points
export const MINUS_SIGN = '\u2212';            // −
export const PLUS_MINUS = '\u00B1';            // ±
export const MINUS_PLUS = '\u2213';            // ∓
// Characters used in lim variant detection
export const HORIZ_BAR = '\u2015';             // ― horizontal bar
export const RIGHT_ARROW = '\u2192';           // →
export const LEFT_ARROW = '\u2190';            // ←
// Delimiter code points
export const DOUBLE_VERT = '\u2016';           // ‖ double vertical bar
export const PARALLEL_SIGN = '\u2225';         // ∥ parallel to
export const LEFT_FLOOR = '\u230A';            // ⌊
export const RIGHT_FLOOR = '\u230B';           // ⌋
export const LEFT_CEIL = '\u2308';             // ⌈
export const RIGHT_CEIL = '\u2309';            // ⌉
export const LEFT_CHEVRON = '\u27E8';          // ⟨
export const RIGHT_CHEVRON = '\u27E9';         // ⟩
export const LEFT_ANGLE_OLD = '\u2329';        // 〈 (deprecated Unicode form)
export const RIGHT_ANGLE_OLD = '\u232A';       // 〉 (deprecated Unicode form)
// Other math symbols
export const INTEGRAL_SIGN = '\u222B';         // ∫
export const MIDLINE_ELLIPSIS = '\u22EF';      // ⋯

/** Node kinds that carry sub/superscripts */
export const SCRIPT_NODE_KINDS: ReadonlySet<string> = new Set([
  'msub', 'msup', 'msubsup', 'munder', 'mover', 'munderover',
]);

/** Prime characters used in derivative patterns (′ ″ ‴) */
export const PRIME_CHARS: ReadonlySet<string> = new Set([
  '\u2032', '\u2033', '\u2034',
]);

/** Maximum tree depth for shallow walks (accent detection, phantom check, etc.).
 *  MathJax wraps content in inferredMrow/TeXAtom layers; 5 levels is enough
 *  to reach through these wrappers without traversing the entire tree. */
export const SHALLOW_TREE_MAX_DEPTH = 5;

export const OPEN_BRACKETS: Readonly<Record<string, string>> = {
  '(': ')', '[': ']', '{': '}',
};
export const CLOSE_BRACKETS: Readonly<Record<string, string>> = {
  ')': '(', ']': '[', '}': '{',
};
/** Built-in Typst math operators — should NOT be wrapped in upright() or op().
 *  Only includes operators natively recognized by Typst. Non-built-in operators
 *  (arccot, arcsec, arccsc, sech, csch) need op() wrapping and are NOT listed here. */
export const TYPST_MATH_OPERATORS: ReadonlySet<string> = new Set([
  'sin', 'cos', 'tan', 'cot', 'sec', 'csc',
  'arcsin', 'arccos', 'arctan',
  'sinh', 'cosh', 'tanh', 'coth',
  'exp', 'log', 'ln', 'lg',
  'det', 'dim', 'gcd', 'mod',
  'inf', 'sup', 'lim', 'liminf', 'limsup',
  'max', 'min', 'arg', 'deg', 'hom', 'ker',
  'Pr', 'tr',
]);

/** Typst math functions used by the converter (not operators). */
const TYPST_MATH_FUNCTIONS: ReadonlySet<string> = new Set([
  'frac', 'sqrt', 'mat', 'cases', 'lr', 'abs', 'norm', 'floor', 'ceil',
  'op', 'scripts', 'limits', 'cancel', 'overline', 'underline',
  'overbrace', 'underbrace', 'overbracket', 'underbracket', 'overparen', 'underparen',
  'stretch', 'attach',
]);

/** Built-in Typst math operators and functions where name( is valid syntax.
 *  Multi-char identifiers NOT in this set get a space before ( to avoid
 *  Typst parsing e.g. emptyset(x) as a function call. */
export const TYPST_BUILTIN_OPS: ReadonlySet<string> = new Set([
  ...TYPST_MATH_OPERATORS, ...TYPST_MATH_FUNCTIONS,
]);

/** Typst box styling constants for \boxed, \fbox, \circle, bordered arrays. */
export const BOX_STROKE = '0.5pt';
export const BOX_INSET = '3pt';

/** Typst escaped-delimiter output for unpaired brackets (math-mode safe) */
export const UNPAIRED_BRACKET_TYPST: Readonly<Record<string, string>> = {
  '(': '\\(', ')': '\\)', '[': '\\[', ']': '\\]', '{': '\\{', '}': '\\}',
};
