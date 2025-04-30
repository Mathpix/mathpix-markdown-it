import { TMarkdownItOptions } from '../mathpix-markdown-model';
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
