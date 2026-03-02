/** Non-breaking space U+00A0 (global replacement) */
export declare const RE_NBSP: RegExp;
/** Content-mode special characters: * _ ` @ # < (must be escaped in Typst [...]) */
export declare const RE_CONTENT_SPECIAL: RegExp;
/** Word char or dot at end of string */
export declare const RE_WORD_DOT_END: RegExp;
/** Word char or dot at start of string */
export declare const RE_WORD_DOT_START: RegExp;
/** Word char at start of string */
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
export declare const OPEN_BRACKETS: Record<string, string>;
export declare const CLOSE_BRACKETS: Record<string, string>;
/** Typst escaped-delimiter output for unpaired brackets (math-mode safe) */
export declare const UNPAIRED_BRACKET_TYPST: Record<string, string>;
