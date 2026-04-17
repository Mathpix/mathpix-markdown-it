/** Called from init_math_cache hook at the start of every md.parse(). */
export declare const initMathCache: (state: any) => void;
/** Begin a section where cache must not be used (options.outMath is temporarily mutated). */
export declare const beginCacheBypass: (state: any) => void;
/** End a cache-bypass section. */
export declare const endCacheBypass: (state: any) => void;
/**
 * Converts a math token into HTML and attaches MathJax metadata to the token.
 * Also extracts equation labels and stores them in the shared labels list.
 */
export declare const convertMathToHtml: (state: any, token: any, options: any) => any;
