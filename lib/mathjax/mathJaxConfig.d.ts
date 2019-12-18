declare const MathJaxConfig: {
    TeX: {
        packages: string[];
        tagSide: string;
        tagIndent: string;
        multlineWidth: string;
        useLabelIds: boolean;
        tags: string;
        inlineMath: string[][];
        displayMath: string[][];
        processEscapes: boolean;
        processEnvironments: boolean;
        processRefs: boolean;
    };
    MathML: {
        parseAs: string;
        forceReparse: boolean;
    };
    HTML: {
        scale: number;
        mathmlSpacing: boolean;
        exFactor: number;
    };
    SVG: {
        fontCache: string;
    };
};
export default MathJaxConfig;
