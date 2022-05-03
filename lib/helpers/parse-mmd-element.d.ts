export declare const formatSourceHtml: (text: string, notTrim?: boolean) => string;
export declare const formatSourceHtmlWord: (text: string, notTrim?: boolean) => string;
export declare const formatSource: (text: string) => string;
export declare const formatSourceMML: (text: string) => string;
export declare const parseMmdElement: (math_el: any, res?: any[]) => any[];
export declare const parseMarkdownByElement: (el: HTMLElement | Document, include_sub_math?: boolean) => any[];
