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
export interface ITypstData {
    typst: string;
    /** Inline-safe variant: same as typst when no block wrappers are used,
     *  otherwise contains pure math expressions without #math.equation() wrappers. */
    typst_inline?: string;
}
export declare const initTypstData: () => ITypstData;
export declare const addToTypstData: (dataOutput: ITypstData, dataInput: ITypstData) => ITypstData;
/** Add a separator space to both typst and typst_inline fields. */
export declare const addSpaceToTypstData: (data: ITypstData) => void;
/** Check if child at index i in a node's childNodes starts a thousand-separator
 *  pattern: mn, mo(,), mn(3 digits). Also handles Indian numbering (2-digit groups
 *  like 41,70,000) by accepting 2-digit groups when the chain ends with a 3-digit group. */
export declare const isThousandSepComma: (node: any, i: number) => boolean;
/** Check if a space separator is needed between two adjacent Typst tokens.
 *  Returns true when `next` starts with a word/dot/quote character
 *  and `prev` doesn't end with a natural separator (whitespace, open paren, etc.). */
export declare const needsTokenSeparator: (prev: string, next: string) => boolean;
export declare const needsParens: (s: string) => boolean;
/** Format a subscript or superscript with proper Typst grouping.
 *  Returns e.g. '_x', '_(x + y)', '^n', '^(a b)', or '' if content is empty. */
export declare const formatScript: (prefix: '_' | '^', content: string) => string;
/** Check if a node is the first child of its parent. */
export declare const isFirstChild: (node: any) => boolean;
/** Check if a node is the last child of its parent. */
export declare const isLastChild: (node: any) => boolean;
