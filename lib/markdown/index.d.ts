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
/**
 * Asynchronously converts Markdown content into segmented HTML with position mapping.
 *
 * This async version mirrors `markdownToHtmlPipelineSegments`, but uses the async
 * markdown-it pipeline (core/block/inline `parseAsync`) to avoid long event-loop
 * blocking on large documents. It installs the same segmented HTML renderer and
 * returns both the concatenated HTML string and a mapping array describing the
 * start/end indices of each segment.
 *
 * Segmentation logic is identical to the synchronous version: HTML is grouped
 * into logical chunks based on markdown token structure, including special
 * handling for block math inside lists.
 *
 * @param {string} content - The Markdown input to convert.
 * @param {TMarkdownItOptions} [options={}] - Parser configuration options.
 * @param {{ sliceMs?: number }} [parseOpts] - Time-slicing options used by the async parser.
 * @returns {Promise<{ content: string; map: [number, number][] }>} Resolves with:
 *   - content: the combined HTML output string,
 *   - map: an array of [start, end] offsets for each HTML segment.
 */
export declare const markdownToHtmlPipelineSegmentsAsync: (content: string, options?: TMarkdownItOptions, parseOpts?: {
    sliceMs?: number;
}) => Promise<{
    content: string;
    map: [
        number,
        number
    ][];
}>;
/** String transformtion pipeline */
export declare const markdownToHtmlPipeline: (content: string, options?: TMarkdownItOptions) => any;
export declare function markdownToHTMLSegments(markdown: string, options?: TMarkdownItOptions): {
    content: string;
    map: [number, number][];
};
export declare const markdownToHTMLSegmentsAsync: (markdown: string, options?: TMarkdownItOptions) => Promise<{
    content: string;
    map: [
        number,
        number
    ][];
}>;
/**
 * convert a markdown text to html
 */
export declare function markdownToHTML(markdown: string, options?: TMarkdownItOptions): string;
export declare const markdownToHtmlPipelineAsync: (content: string, options?: TMarkdownItOptions) => Promise<any>;
export declare const markdownToHTMLAsync: (markdown: string, options?: TMarkdownItOptions) => Promise<any>;
