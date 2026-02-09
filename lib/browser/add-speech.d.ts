export interface MathpixSpeechConfig {
    /** Container element to process (defaults to document.body) */
    container?: HTMLElement;
}
/**
 * Add speech attributes to already-rendered SVG math elements.
 * Use this when math was rendered server-side without accessibility (output_format: 'svg').
 *
 * This function:
 * - Loads SRE (Speech Rule Engine) dynamically
 * - Finds all mjx-container elements
 * - Extracts MathML from mjx-assistive-mml
 * - Generates speech text and adds aria-label
 *
 * @param container - The container element to search for math elements (defaults to document.body)
 */
export declare const addSpeechToRenderedMath: (container?: HTMLElement) => Promise<void>;
