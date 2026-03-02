/** Non-breaking space U+00A0 (global replacement) */
export const RE_NBSP = /\u00A0/g;
/** Content-mode special characters: * _ ` @ # < (must be escaped in Typst [...]) */
export const RE_CONTENT_SPECIAL = /[*_`@#<]/g;
/** Word char or dot at end of string */
export const RE_WORD_DOT_END = /[\w.]$/;
/** Word char or dot at start of string */
export const RE_WORD_DOT_START = /^[\w.]/;
/** Word char at start of string */
export const RE_WORD_START = /^\w/;
/** Detects op() wrapper prefix */
export const RE_OP_WRAPPER = /^op\(/;
/** Extracts \tag{...} content from mtext */
export const RE_TAG_EXTRACT = /\\tag\{([^}]+)\}/;
/** Strips \tag{...} with optional leading whitespace (global) */
export const RE_TAG_STRIP = /\s*\\tag\{[^}]+\}/g;
/** Any ASCII bracket character */
export const RE_BRACKET_CHARS = /[\[\](){}]/;
/** Single word character (for single-char tests) */
export const RE_WORD_CHAR = /\w/;
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

/** Maximum tree depth for shallow walks (accent detection, phantom check, etc.) */
export const SHALLOW_TREE_MAX_DEPTH = 5;

export const OPEN_BRACKETS: Record<string, string> = {
  '(': ')', '[': ']', '{': '}',
};
export const CLOSE_BRACKETS: Record<string, string> = {
  ')': '(', ']': '[', '}': '{',
};
/** Typst escaped-delimiter output for unpaired brackets (math-mode safe) */
export const UNPAIRED_BRACKET_TYPST: Record<string, string> = {
  '(': '\\(', ')': '\\)', '[': '\\[', ']': '\\]', '{': '\\{', '}': '\\}',
};
