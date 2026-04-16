type TSubMath = {
    id: string;
    content: string;
};
export declare const ClearSubMathLists: () => void;
export declare const mathTablePush: (item: TSubMath) => void;
export declare const getMathTableContent: (sub: string, i: number) => string;
/**
 * Extract math expressions from a string, replacing them with placeholders.
 * Iterative single-pass implementation: scans the original string once,
 * collects non-math segments and placeholders into an array, joins at the end.
 * Avoids O(N × M) string rebuilds from the recursive version.
 */
export declare const getSubMath: (str: string) => string;
export {};
