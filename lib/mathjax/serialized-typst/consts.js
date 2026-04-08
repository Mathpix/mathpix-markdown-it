"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LEFT_CEIL = exports.RIGHT_FLOOR = exports.LEFT_FLOOR = exports.PARALLEL_SIGN = exports.DOUBLE_VERT = exports.LEFT_ARROW = exports.RIGHT_ARROW = exports.HORIZ_BAR = exports.MINUS_PLUS = exports.PLUS_MINUS = exports.MINUS_SIGN = exports.INVISIBLE_PLUS = exports.INVISIBLE_SEP = exports.INVISIBLE_TIMES = exports.FUNC_APPLY = exports.EQ_TAG_FIGURE_KIND = exports.DEFAULT_EQ_NUMBERING = exports.TYPST_PLACEHOLDER = exports.UNPAIRED_BRACKET_PROP = exports.DATA_LABEL_KEY = exports.DATA_TAG_AUTO = exports.DATA_POST_CONTENT = exports.DATA_PRE_CONTENT = exports.RE_LETTERS_AND_MARKS = exports.RE_LATIN_WITH_MARKS = exports.RE_TRAILING_DOTTED_IDENT = exports.RE_TRAILING_IDENT = exports.RE_ALPHA_END = exports.RE_SEPARATOR_END = exports.RE_TOKEN_START = exports.RE_PHANTOM_BASE = exports.RE_TWO_DIGITS = exports.RE_THREE_DIGITS = exports.RE_TRAILING_SPACING = exports.RE_UNICODE_SPACES = exports.RE_LEADING_WS = exports.RE_TRAILING_WS = exports.RE_ASCII_LETTER = exports.RE_WORD_CHAR = exports.RE_BRACKET_CHARS = exports.RE_TAG_STRIP = exports.RE_TAG_EXTRACT = exports.RE_OP_WRAPPER = exports.RE_WORD_START = exports.RE_WORD_DOT_START = exports.RE_WORD_DOT_END = exports.RE_CONTENT_SPECIAL = exports.RE_NBSP = exports.MLABELEDTR = exports.TEX_ATOM = void 0;
exports.UNPAIRED_BRACKET_TABLE_TYPST = exports.UNPAIRED_BRACKET_TYPST = exports.BOX_INSET = exports.BOX_STROKE = exports.TYPST_BUILTIN_OPS = exports.TYPST_MATH_OPERATORS = exports.CLOSE_BRACKETS = exports.OPEN_BRACKETS = exports.SHALLOW_TREE_MAX_DEPTH = exports.PRIME_CHARS = exports.SCRIPT_NODE_KINDS = exports.MIDLINE_ELLIPSIS = exports.INTEGRAL_SIGN = exports.RIGHT_ANGLE_OLD = exports.LEFT_ANGLE_OLD = exports.RIGHT_CHEVRON = exports.LEFT_CHEVRON = exports.RIGHT_CEIL = void 0;
var tslib_1 = require("tslib");
/** MathJax TeXAtom node kind string */
exports.TEX_ATOM = 'TeXAtom';
/** MathJax mlabeledtr node kind string (numbered equation rows) */
exports.MLABELEDTR = 'mlabeledtr';
/** Non-breaking space U+00A0 (global replacement) */
exports.RE_NBSP = /\u00A0/g;
/** Content-mode special characters that must be escaped in Typst [...] blocks.
 *  Covers: bold (*), italic (_), raw (`), math ($), code (#), label (<),
 *  citation (@), non-breaking space (~), content block ([ ]), code block ({ }). */
exports.RE_CONTENT_SPECIAL = /[*_`$#<@~\[\]{}]/g;
/** Word char (incl. Unicode letters) or dot at end of string */
exports.RE_WORD_DOT_END = /[\w\p{L}.]$/u;
/** Word char (incl. Unicode letters) or dot at start of string */
exports.RE_WORD_DOT_START = /^[\w\p{L}.]/u;
/** Word char (incl. Unicode letters) at start of string */
exports.RE_WORD_START = /^[\w\p{L}]/u;
/** Detects op() wrapper prefix */
exports.RE_OP_WRAPPER = /^op\(/;
/** Extracts \tag{...} content from mtext */
exports.RE_TAG_EXTRACT = /\\tag\{([^}]+)\}/;
/** Strips \tag{...} with optional leading whitespace (global) */
exports.RE_TAG_STRIP = /\s*\\tag\{[^}]+\}/g;
/** Any ASCII bracket character */
exports.RE_BRACKET_CHARS = /[\[\](){}]/;
/** Single word character (for single-char tests) */
exports.RE_WORD_CHAR = /[\w\p{L}]/u;
/** ASCII letter (for function-call detection — Typst funcs are ASCII identifiers) */
exports.RE_ASCII_LETTER = /[a-zA-Z]/;
/** Trailing whitespace */
exports.RE_TRAILING_WS = /\s$/;
/** Leading whitespace */
exports.RE_LEADING_WS = /^\s/;
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
/** Trailing dotted symbol name: arrow.l, chevron.r, floor.l, etc. */
exports.RE_TRAILING_DOTTED_IDENT = /([a-zA-Z]\w*(?:\.[a-zA-Z]\w*)*)$/;
/** Text with at least one Latin-script letter, optionally with combining marks/digits (NOT non-Latin) */
exports.RE_LATIN_WITH_MARKS = /^[\p{Script=Latin}\p{M}\d]*\p{Script=Latin}[\p{Script=Latin}\p{M}\d]*$/u;
/** String of Unicode letters and combining marks only */
exports.RE_LETTERS_AND_MARKS = /^[\p{L}\p{M}]+$/u;
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
/** Maximum tree depth for shallow walks (accent detection, phantom check, etc.).
 *  MathJax wraps content in inferredMrow/TeXAtom layers; 5 levels is enough
 *  to reach through these wrappers without traversing the entire tree. */
exports.SHALLOW_TREE_MAX_DEPTH = 5;
exports.OPEN_BRACKETS = {
    '(': ')', '[': ']', '{': '}',
};
exports.CLOSE_BRACKETS = {
    ')': '(', ']': '[', '}': '{',
};
/** Built-in Typst math operators — should NOT be wrapped in upright() or op().
 *  Only includes operators natively recognized by Typst. Non-built-in operators
 *  (arccot, arcsec, arccsc, sech, csch) need op() wrapping and are NOT listed here. */
exports.TYPST_MATH_OPERATORS = new Set([
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
var TYPST_MATH_FUNCTIONS = new Set([
    'frac', 'sqrt', 'mat', 'cases', 'lr', 'abs', 'norm', 'floor', 'ceil',
    'op', 'scripts', 'limits', 'cancel', 'overline', 'underline',
    'overbrace', 'underbrace', 'overbracket', 'underbracket', 'overparen', 'underparen',
    'stretch', 'attach',
]);
/** Built-in Typst math operators and functions where name( is valid syntax.
 *  Multi-char identifiers NOT in this set get a space before ( to avoid
 *  Typst parsing e.g. emptyset(x) as a function call. */
exports.TYPST_BUILTIN_OPS = new Set(tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(exports.TYPST_MATH_OPERATORS), false), tslib_1.__read(TYPST_MATH_FUNCTIONS), false));
/** Typst box styling constants for \boxed, \fbox, \circle, bordered arrays. */
exports.BOX_STROKE = '0.5pt';
exports.BOX_INSET = '3pt';
/** Typst escaped-delimiter output for unpaired brackets (math-mode safe) */
exports.UNPAIRED_BRACKET_TYPST = {
    '(': '\\(', ')': '\\)', '[': '\\[', ']': '\\]', '{': '\\{', '}': '\\}',
};
/** Typst symbol-name output for unpaired brackets inside mat() cells.
 *  Symbol names avoid escaping issues in mat() argument context. */
exports.UNPAIRED_BRACKET_TABLE_TYPST = {
    '(': 'paren.l', ')': 'paren.r',
    '[': 'bracket.l', ']': 'bracket.r',
    '{': 'brace.l', '}': 'brace.r',
};
//# sourceMappingURL=consts.js.map