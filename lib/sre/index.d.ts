/**
 * TODO: Add a handler to reader output "softmax" as a word instead of "s o f t m a x"
 * */
export declare const getSpeech: (sre: any, mml: any) => string;
/**
 * Process a single mjx-container element to add speech accessibility.
 * Returns true if speech was added, false otherwise.
 *
 * @param sre - Speech Rule Engine instance
 * @param elMath - The mjx-container element
 */
export declare const addSpeechToMathContainer: (sre: any, elMath: Element) => void;
export declare const addAriaToMathHTML: (sre: any, html: string) => string;
