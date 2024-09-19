export declare const HTML_OPEN_TAG_RE: RegExp;
export declare const HTML_CLOSE_TAG_RE: RegExp;
export declare const HTML_OPEN_TAG: RegExp;
export type type_HTML_SEQUENCES = [RegExp, RegExp | string, boolean];
export declare const HTML_SEQUENCES: type_HTML_SEQUENCES[];
export declare const selfClosingTags: string[];
export declare const extractFullHtmlTagContent: (html: string, tag: string) => string[];
