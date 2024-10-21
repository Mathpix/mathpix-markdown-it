import { TMarkdownItOptions } from '../mathpix-markdown-model';
/** String transformtion pipeline */
export declare const markdownToHtmlPipeline: (content: string, options?: TMarkdownItOptions) => string;
/**
 * convert a markdown text to html
 */
export declare function markdownToHTML(markdown: string, options?: TMarkdownItOptions): string;
export declare const applyMathpixMarkdownPlugins: (options?: TMarkdownItOptions) => MarkdownIt;
