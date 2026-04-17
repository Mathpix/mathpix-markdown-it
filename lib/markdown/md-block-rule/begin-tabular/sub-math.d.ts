export declare const ClearSubMathLists: () => void;
export declare const mathTablePush: (id: string, content: string) => void;
export declare const getMathTableContent: (sub: string, i: number) => string;
/**
 * Extract math expressions from a string, replacing them with placeholders.
 * Iterative single-pass: scans the original string once with a local RegExp,
 * collects non-math segments and placeholders into an array, joins at the end.
 */
export declare const getSubMath: (str: string) => string;
