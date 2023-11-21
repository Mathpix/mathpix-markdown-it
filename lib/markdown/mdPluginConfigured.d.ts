/**
 * configured custom mathjax plugin
 */
export declare const mdPluginMathJax: (options: any) => (md: any) => void;
/**
 * configured custom tag plugin
 */
export declare const mdPluginText: () => (md: markdownit) => void;
export declare const mdPluginHighlightCode: (md: any, opts: any) => void;
export declare const mdPluginTOC: (md: markdownit, opts: any) => void;
export declare const mdPluginAnchor: {
    (md: markdownit, opts: any): void;
    defaults: {
        level: number;
    };
};
export declare const mdPluginTableTabular: (md: markdownit, options: any) => void;
export declare const mdPluginList: (md: markdownit, options: any) => void;
export declare const mdPluginChemistry: (md: markdownit, options: any) => void;
export declare const mdPluginSvgToBase64: (md: markdownit, options: any) => void;
export declare const mdPluginCollapsible: (md: any) => void;
export declare const mdSetPositionsAndHighlight: (md: markdownit, options: any) => void;
export declare const mdLatexFootnotes: (md: markdownit, options: any) => void;
