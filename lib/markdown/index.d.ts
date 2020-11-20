import { TMarkdownItOptions } from '../mathpix-markdown-model';
/** String transformtion pipeline */
export declare const markdownToHtmlPipeline: (content: string, options?: TMarkdownItOptions) => any;
/**
 * convert a markdown text to html
 */
export declare function markdownToHTML(markdown: string, options?: TMarkdownItOptions): string;
