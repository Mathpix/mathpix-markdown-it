/**
 * configured custom mathjax plugin
 */
export declare const mdPluginMathJax: (options: any) => (md: any) => void;
/**
 * configured custom tag plugin
 */
export declare const mdPluginText: () => (md: any) => void;
export declare const mdPluginHighlightCode: {
    (md: any, opts: any): void;
    defaults: {
        auto: boolean;
        code: boolean;
    };
};
export declare const mdPluginTOC: (md: any, opts: any) => void;
export declare const mdPluginAnchor: {
    (md: any, opts: any): void;
    defaults: {
        level: number;
    };
};
export declare const mdPluginTableTabular: (md: any, options: any) => void;
export declare const mdPluginList: (md: any, options: any) => void;
export declare const mdPluginChemistry: (md: any, options: any) => void;
export declare const mdPluginSvgToBase64: (md: any, options: any) => void;
export declare const mdPluginCollapsible: (md: any) => void;
