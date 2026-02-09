/**
 * TODO: Add a handler to reader output "softmax" as a word instead of "s o f t m a x"
 * */
export declare const getSpeech: (sre: any, mml: any) => string;
/**
 * Process a single mjx-container element to add speech accessibility.
 *
 * @param sre - Speech Rule Engine instance
 * @param elMath - The mjx-container element
 * @param doc - Document object for creating elements (pass `document` in browser)
 */
export declare const addSpeechToMathContainer: (sre: any, elMath: Element, doc: Document) => void;
export declare const addAriaToMathHTML: (sre: any, html: string) => string;
