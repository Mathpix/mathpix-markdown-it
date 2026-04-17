/** Clear the typeset cache for a specific md instance.
 *  Called at the start of every md.parse() via core.ruler hook. */
export declare const clearTypesetCache: (options: object) => void;
/**
 * Converts a math token into HTML and attaches MathJax metadata to the token.
 * Also extracts equation labels and stores them in the shared labels list.
 */
export declare const convertMathToHtml: (state: any, token: any, options: any) => any;
