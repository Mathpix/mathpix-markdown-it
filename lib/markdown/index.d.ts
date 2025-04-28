import { TMarkdownItOptions } from '../mathpix-markdown-model';
export declare const markdownToHtmlPipelineSegments: (content: string, options?: TMarkdownItOptions) => Array<{
    id: number;
    html: string;
}>;
/** String transformtion pipeline */
export declare const markdownToHtmlPipeline: (content: string, options?: TMarkdownItOptions) => any;
export declare function markdownToHTMLSegments(markdown: string, options?: TMarkdownItOptions): Array<{
    id: number;
    html: string;
}>;
/**
 * convert a markdown text to html
 */
export declare function markdownToHTML(markdown: string, options?: TMarkdownItOptions): string;
