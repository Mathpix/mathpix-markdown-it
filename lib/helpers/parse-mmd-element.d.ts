export declare const formatSourceHtml: (text: string, notTrim?: boolean) => string;
export declare const formatSourceHtmlWord: (text: string, notTrim?: boolean) => string;
export declare const formatSource: (text: string, notTrim?: boolean) => string;
export declare const formatSourceMML: (text: string) => string;
export declare const parseMmdElement: (math_el: any, res?: any[]) => any[];
export declare const parseMarkdownByElement: (el: HTMLElement | Document, include_sub_math?: boolean) => any[];
/**
 * Builds a single Word-pasteable HTML document from a rendered MMD element.
 *
 * `parseMarkdownByElement` returns one entry per math element, which is what a
 * per-equation copy needs. This instead keeps the surrounding prose and replaces
 * every math container in place with the Word-flavoured MathML already embedded
 * in it, so the result carries the whole snip in document order.
 *
 * The source element is never modified: the walk runs over a clone.
 */
export declare const parseMathmlWordDocument: (el: HTMLElement | Document) => string;
