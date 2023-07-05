/**
 * configured custom mathjax plugin
 */
export declare const mdPluginMathJax: (options: any) => (md: any) => void;
/**
 * configured custom tag plugin
 */
export declare const mdPluginText: () => (md: MarkdownIt) => void;
export declare const mdPluginHighlightCode: {
    (md: any, opts: any): void;
    defaults: {
        auto: boolean;
        code: boolean;
    };
};
export declare const mdPluginTOC: (md: MarkdownIt, opts: any) => void;
export declare const mdPluginAnchor: {
    (md: MarkdownIt, opts: any): void;
    defaults: {
        level: number;
    };
};
export declare const mdPluginTableTabular: (md: MarkdownIt, options: any) => void;
export declare const mdPluginList: (md: MarkdownIt, options: any) => void;
export declare const mdPluginChemistry: (md: MarkdownIt, options: any) => void;
export declare const mdPluginSvgToBase64: (md: MarkdownIt, options: any) => void;
export declare const mdPluginCollapsible: (md: any) => void;
export declare const mdSetPositionsAndHighlight: (md: MarkdownIt, options: any) => void;
