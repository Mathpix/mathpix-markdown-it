export declare const PREVIEW_PARAGRAPH_PREFIX = "preview-paragraph-";
export declare const PREVIEW_LINE_CLASS = "preview-line";
export declare function code_block_injectLineNumbers(tokens: any, idx: any, options: any, env: any, slf: any): string;
/** overwrite paragraph_open and close rule to inject line number */
export declare function withLineNumbers(renderer: any): any;
export declare function injectLabelIdToParagraph(renderer: any): any;
export declare const injectRenderRules: (renderer: any) => any;
