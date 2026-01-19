export declare const isNewlineChar: (ch: string | null) => boolean;
export declare const findPlaceholders: (s: string, from?: number) => RegExpMatchArray | null;
export declare const placeholderToId: (placeholder: string) => string;
export declare const getPrevNonSpaceChar: (s: string, idx: number) => string | null;
export declare const getNextNonSpaceChar: (s: string, idx: number) => string | null;
/**
 * Returns non-whitespace neighbors around [start,end) span of a placeholder.
 * Useful to decide whether injected "block-ish" content must be surrounded by newlines.
 */
export declare const getInlineContextAroundSpan: (s: string, start: number, end: number) => {
    beforeNonSpace: string | null;
    afterNonSpace: string | null;
};
/**
 * Wraps injected content with leading/trailing '\n' if:
 *  - injected matches `blockRe`, AND
 *  - placeholder is embedded inline (neighbors are not newlines),
 *  - and injected isn't already newline-wrapped on that side.
 *
 * Note: `blockRe` might be BEGIN_LIST_ENV_INLINE_RE (strict) or BLOCK_LATEX_RE (broader).
 */
export declare const wrapWithNewlinesIfInline: (injected: string, beforeNonSpace: string | null, afterNonSpace: string | null) => string;
