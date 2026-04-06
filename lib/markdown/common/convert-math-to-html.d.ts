/**
 * Converts an ascii math token via TypesetAsciiMath at parsing stage.
 * Sets token.mathEquation (HTML) and token.mathData (metrics/typst/etc).
 */
export declare const convertAsciiMathToHtml: (state: any, token: any) => void;
/**
 * Converts a math token into HTML and attaches MathJax metadata to the token.
 * Also extracts equation labels and stores them in the shared labels list.
 */
export declare const convertMathToHtml: (state: any, token: any, options: any) => any;
