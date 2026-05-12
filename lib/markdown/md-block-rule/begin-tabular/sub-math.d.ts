export declare const ClearSubMathLists: () => void;
export declare const mathTablePush: (idOrItem: string | {
    id: string;
    content: string;
}, content?: string) => void;
/** Replace UUID placeholders with original math content.
 *  Uses trimmed string for regex matching (consistent with getSubMath),
 *  but untrimmed sub for slicing to preserve original whitespace. */
export declare const getMathTableContent: (sub: string, i: number) => string;
/**
 * Extract math expressions from a string, replacing them with placeholders.
 * Iterative single-pass: scans the original string once, collects non-math
 * segments and placeholders into an array, joins at the end.
 *
 * `startPos` is a seek offset applied via `re.lastIndex` before scanning.
 */
export declare const getSubMath: (str: string, startPos?: number) => string;
