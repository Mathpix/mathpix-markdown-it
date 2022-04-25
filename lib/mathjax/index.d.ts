import { TAccessibility } from "../mathpix-markdown-model";
export declare const MathJax: {
    assistiveMml: boolean;
    checkAccessibility: (accessibility?: TAccessibility) => void;
    Stylesheet: () => unknown;
    TexConvert: (string: any, options?: any) => {
        mathml?: string;
        mathml_word?: string;
        asciimath?: string;
        latex?: string;
        svg?: string;
        speech?: string;
    } | {
        mathml?: string;
        mathml_word?: string;
        asciimath?: string;
        latex?: string;
        svg?: string;
        error?: string;
    };
    TexConvertToAscii: (string: any, options?: any) => any;
    /**
     * Typeset a TeX expression and return the SVG tree for it
     *
     * @param string {string}
     * @param options {}
     */
    Typeset: (string: any, options?: any) => string;
    TypesetSvgAndAscii: (string: any, options?: any) => {
        html: string;
        ascii: string;
    };
    /**
     * Typeset a MathML expression and return the SVG tree for it
     *
     * @param string {string}
     * @param options {}
     */
    TypesetMathML: (string: any, options?: any) => string;
    AsciiMathToSvg: (string: any, options?: any) => string;
    Reset: (n?: number) => void;
    GetLastEquationNumber: () => any;
};
