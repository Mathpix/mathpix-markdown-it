import { TMarkdownItOptions } from '../mathpix-markdown-model';
/**
 * Converts Markdown content to segmented HTML with position mapping.
 *
 * This function initializes a markdown-it parser with custom options and injected rendering rules,
 * then overrides the renderer's render method to produce HTML content in segments. Each segment
 * corresponds to a continuous chunk of HTML generated from one or more markdown tokens. It also
 * returns a map of tuples indicating the start and end indices of each HTML segment within the
 * combined output string.
 *
 * The segmentation logic groups tokens until a closing tag of an opened block is found or certain
 * block tokens (like hr, fence, code_block, html_block) appear, splitting the content accordingly.
 * Special handling is included for first block math tokens inside lists.
 *
 * @param {string} content - The Markdown source content to convert.
 * @param {TMarkdownItOptions} [options={}] - Optional configuration options for the markdown-it parser.
 * @returns {{ content: string, map: [number, number][] }} An object containing:
 *   - content: the concatenated HTML string from all segments.
 *   - map: an array of tuples, each tuple [start, end] marks the indices of each HTML segment within the content.
 */
export declare const markdownToHtmlPipelineSegments: (content: string, options?: TMarkdownItOptions) => {
    content: string;
    map: [
        number,
        number
    ][];
};
/** String transformtion pipeline */
export declare const markdownToHtmlPipeline: (content: string, options?: TMarkdownItOptions) => any;
export declare function markdownToHTMLSegments(markdown: string, options?: TMarkdownItOptions): {
    content: string;
    map: [number, number][];
};
/**
 * convert a markdown text to html
 */
export declare function markdownToHTML(markdown: string, options?: TMarkdownItOptions): string;
