"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SCRIPT_NODE_KINDS = exports.MIDLINE_ELLIPSIS = exports.INTEGRAL_SIGN = exports.RIGHT_ANGLE_OLD = exports.LEFT_ANGLE_OLD = exports.RIGHT_CHEVRON = exports.LEFT_CHEVRON = exports.RIGHT_CEIL = exports.LEFT_CEIL = exports.RIGHT_FLOOR = exports.LEFT_FLOOR = exports.PARALLEL_SIGN = exports.DOUBLE_VERT = exports.LEFT_ARROW = exports.RIGHT_ARROW = exports.HORIZ_BAR = exports.MINUS_PLUS = exports.PLUS_MINUS = exports.MINUS_SIGN = exports.INVISIBLE_PLUS = exports.INVISIBLE_SEP = exports.INVISIBLE_TIMES = exports.FUNC_APPLY = exports.EQ_TAG_FIGURE_KIND = exports.DEFAULT_EQ_NUMBERING = exports.TYPST_PLACEHOLDER = exports.UNPAIRED_BRACKET_PROP = exports.DATA_LABEL_KEY = exports.DATA_TAG_AUTO = exports.DATA_POST_CONTENT = exports.DATA_PRE_CONTENT = exports.RE_TRAILING_IDENT = exports.RE_ALPHA_END = exports.RE_SEPARATOR_END = exports.RE_TOKEN_START = exports.RE_PHANTOM_BASE = exports.RE_TWO_DIGITS = exports.RE_THREE_DIGITS = exports.RE_TRAILING_SPACING = exports.RE_UNICODE_SPACES = exports.RE_WORD_CHAR = exports.RE_BRACKET_CHARS = exports.RE_TAG_STRIP = exports.RE_TAG_EXTRACT = exports.RE_OP_WRAPPER = exports.RE_WORD_START = exports.RE_WORD_DOT_START = exports.RE_WORD_DOT_END = exports.RE_CONTENT_SPECIAL = exports.RE_NBSP = void 0;
exports.UNPAIRED_BRACKET_TYPST = exports.TYPST_BUILTIN_OPS = exports.CLOSE_BRACKETS = exports.OPEN_BRACKETS = exports.SHALLOW_TREE_MAX_DEPTH = exports.PRIME_CHARS = void 0;
/** Non-breaking space U+00A0 (global replacement) */
exports.RE_NBSP = /\u00A0/g;
/** Content-mode special characters: * _ ` @ # < [ ] (must be escaped in Typst [...]) */
exports.RE_CONTENT_SPECIAL = /[*_`@#<\[\]]/g;
/** Word char or dot at end of string */
exports.RE_WORD_DOT_END = /[\w.]$/;
/** Word char or dot at start of string */
exports.RE_WORD_DOT_START = /^[\w.]/;
/** Word char at start of string */
exports.RE_WORD_START = /^\w/;
/** Detects op() wrapper prefix */
exports.RE_OP_WRAPPER = /^op\(/;
/** Extracts \tag{...} content from mtext */
exports.RE_TAG_EXTRACT = /\\tag\{([^}]+)\}/;
/** Strips \tag{...} with optional leading whitespace (global) */
exports.RE_TAG_STRIP = /\s*\\tag\{[^}]+\}/g;
/** Any ASCII bracket character */
exports.RE_BRACKET_CHARS = /[\[\](){}]/;
/** Single word character (for single-char tests) */
exports.RE_WORD_CHAR = /\w/;
/** Unicode thin/medium/narrow spaces and NBSP */
exports.RE_UNICODE_SPACES = /[\u2006\u2005\u2004\u2009\u200A\u00A0]/g;
/** Trailing Typst spacing keywords */
exports.RE_TRAILING_SPACING = /\s+(?:med|thin|thick|quad)$/;
/** Exactly 3 digits (thousand separator) */
exports.RE_THREE_DIGITS = /^\d{3}$/;
/** Exactly 2 digits (Indian numbering) */
exports.RE_TWO_DIGITS = /^\d{2}$/;
/** Phantom subscript/superscript base pattern */
exports.RE_PHANTOM_BASE = /^""[_^]/;
/** Token start: word char, dot, quote, or non-ASCII */
exports.RE_TOKEN_START = /^[\w."\u0080-\uFFFF]/;
/** Natural separator at end of string */
exports.RE_SEPARATOR_END = /[\s({[,|]$/;
/** Ends with an ASCII letter (for function-call ambiguity check) */
exports.RE_ALPHA_END = /[a-zA-Z]$/;
/** Trailing word starting with a letter (captures the identifier) */
exports.RE_TRAILING_IDENT = /([a-zA-Z]\w*)$/;
/** Property name for pre-mtable content (set in index.ts, read in table-handlers.ts) */
exports.DATA_PRE_CONTENT = 'data-pre-content';
/** Property name for post-mtable content (set in index.ts, read in table-handlers.ts) */
exports.DATA_POST_CONTENT = 'data-post-content';
/** Property name for auto-generated tag flag */
exports.DATA_TAG_AUTO = 'data-tag-auto';
/** Property name for label key storage */
exports.DATA_LABEL_KEY = 'data-label-key';
/** Property name for unpaired bracket direction marker */
exports.UNPAIRED_BRACKET_PROP = 'data-unpaired-bracket';
/** Typst empty-content placeholder: two double-quotes represent an empty string in math mode */
exports.TYPST_PLACEHOLDER = '""';
/** Default equation numbering format */
exports.DEFAULT_EQ_NUMBERING = '"(1)"';
/** Figure kind for equation tags */
exports.EQ_TAG_FIGURE_KIND = 'eq-tag';
// Unicode character constants — named for readability
// Invisible math operators (MathML)
exports.FUNC_APPLY = '\u2061'; // ⁡ function application
exports.INVISIBLE_TIMES = '\u2062'; // ⁢ invisible times
exports.INVISIBLE_SEP = '\u2063'; // ⁣ invisible separator
exports.INVISIBLE_PLUS = '\u2064'; // ⁤ invisible plus
// Math operator code points
exports.MINUS_SIGN = '\u2212'; // −
exports.PLUS_MINUS = '\u00B1'; // ±
exports.MINUS_PLUS = '\u2213'; // ∓
// Characters used in lim variant detection
exports.HORIZ_BAR = '\u2015'; // ― horizontal bar
exports.RIGHT_ARROW = '\u2192'; // →
exports.LEFT_ARROW = '\u2190'; // ←
// Delimiter code points
exports.DOUBLE_VERT = '\u2016'; // ‖ double vertical bar
exports.PARALLEL_SIGN = '\u2225'; // ∥ parallel to
exports.LEFT_FLOOR = '\u230A'; // ⌊
exports.RIGHT_FLOOR = '\u230B'; // ⌋
exports.LEFT_CEIL = '\u2308'; // ⌈
exports.RIGHT_CEIL = '\u2309'; // ⌉
exports.LEFT_CHEVRON = '\u27E8'; // ⟨
exports.RIGHT_CHEVRON = '\u27E9'; // ⟩
exports.LEFT_ANGLE_OLD = '\u2329'; // 〈 (deprecated Unicode form)
exports.RIGHT_ANGLE_OLD = '\u232A'; // 〉 (deprecated Unicode form)
// Other math symbols
exports.INTEGRAL_SIGN = '\u222B'; // ∫
exports.MIDLINE_ELLIPSIS = '\u22EF'; // ⋯
/** Node kinds that carry sub/superscripts */
exports.SCRIPT_NODE_KINDS = new Set([
    'msub', 'msup', 'msubsup', 'munder', 'mover', 'munderover',
]);
/** Prime characters used in derivative patterns (′ ″ ‴) */
exports.PRIME_CHARS = new Set([
    '\u2032', '\u2033', '\u2034',
]);
/** Maximum tree depth for shallow walks (accent detection, phantom check, etc.) */
exports.SHALLOW_TREE_MAX_DEPTH = 5;
exports.OPEN_BRACKETS = {
    '(': ')', '[': ']', '{': '}',
};
exports.CLOSE_BRACKETS = {
    ')': '(', ']': '[', '}': '{',
};
/** Built-in Typst math operators where name( is valid function-call syntax.
 *  Multi-char identifiers NOT in this set get a space before ( to avoid
 *  Typst parsing e.g. emptyset(x) as a function call. */
exports.TYPST_BUILTIN_OPS = new Set([
    // Standard math operators
    'sin', 'cos', 'tan', 'cot', 'sec', 'csc',
    'arcsin', 'arccos', 'arctan', 'arccot', 'arcsec', 'arccsc',
    'sinh', 'cosh', 'tanh', 'coth', 'sech', 'csch',
    'ln', 'log', 'lg', 'exp',
    'lim', 'limsup', 'liminf',
    'max', 'min', 'sup', 'inf',
    'det', 'gcd', 'dim', 'ker', 'deg', 'arg', 'mod',
    'hom', 'Pr',
    // Typst math functions used by the converter
    'frac', 'sqrt', 'mat', 'cases', 'lr', 'abs', 'norm', 'floor', 'ceil',
    'op', 'scripts', 'limits', 'cancel', 'overline', 'underline',
    'overbrace', 'underbrace', 'overbracket', 'underbracket',
    'stretch', 'attach',
]);
/** Typst escaped-delimiter output for unpaired brackets (math-mode safe) */
exports.UNPAIRED_BRACKET_TYPST = {
    '(': '\\(', ')': '\\)', '[': '\\[', ']': '\\]', '{': '\\{', '}': '\\}',
};
//# sourceMappingURL=consts.js.map