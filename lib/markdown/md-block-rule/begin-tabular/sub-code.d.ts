type TExtractedCodeBlock = {
    id: string;
    content: string;
};
/**
 * Clear all previously extracted code blocks.
 */
export declare const ClearExtractedCodeBlocks: () => void;
/**
 * Add a single extracted code block to the internal storage.
 */
export declare const addExtractedCodeBlock: (item: TExtractedCodeBlock) => void;
/**
 * Replace placeholder markers (e.g. <<uuid>> or <uuid>) in a string
 * with the corresponding extracted code block content.
 *
 * Returns the updated string with placeholders resolved and post-processed
 * by `getContent`.
 */
export declare const getExtractedCodeBlockContent: (inputStr: string, i: number) => string;
/**
 * Post-process inline code-like items in an array of results:
 * for items of the given `type` replace their content using
 * `getMathTableContent`.
 */
export declare const codeInlineContent: (res: any, type?: string) => any;
export declare const getSubCode: (str: string) => string;
export {};
