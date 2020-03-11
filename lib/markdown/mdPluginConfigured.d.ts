/**
 * configured custom mathjax plugin
 */
export declare const ConfiguredMathJaxPlugin: (options: any) => (md: any) => void;
/**
 * configured custom tag plugin
 */
export declare const CustomTagPlugin: () => (md: any) => void;
export declare const HighlightPlugin: {
    (md: any, opts: any): void;
    defaults: {
        auto: boolean;
        code: boolean;
    };
};
export declare const separateForBlockPlugin: (md: any) => void;
export declare const tocPlugin: (md: any, opts: any) => void;
export declare const anchorPlugin: {
    (md: any, opts: any): void;
    defaults: {
        level: number;
    };
};
export declare const tableTabularPlugin: (md: any, options: any) => void;
export declare const listsPlugin: (md: any, options: any) => void;
