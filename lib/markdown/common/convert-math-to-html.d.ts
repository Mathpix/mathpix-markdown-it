/** Clear the typeset cache. Call between independent documents to prevent stale data. */
export declare const clearTypesetCache: () => void;
/**
 * Converts a math token into HTML and attaches MathJax metadata to the token.
 * Also extracts equation labels and stores them in the shared labels list.
 */
export declare const convertMathToHtml: (state: any, token: any, options: any) => any;
