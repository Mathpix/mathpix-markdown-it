import { TAccessibility } from "../mathpix-markdown-model";
export declare const MathJax: {
    assistiveMml: boolean;
    nonumbers: boolean;
    checkAccessibility: (accessibility?: TAccessibility, nonumbers?: boolean) => void;
    Stylesheet: () => unknown;
    TexConvert: (string: any, options?: any) => {
        mathml?: string;
        mathml_word?: string;
        asciimath?: string;
        latex?: string;
        svg?: string;
        speech?: string;
        asciimath_tsv?: string;
        asciimath_csv?: string;
    } | {
        mathml?: string;
        mathml_word?: string;
        asciimath?: string;
        latex?: string;
        svg?: string;
        error?: string;
    };
    TexConvertToAscii: (string: any, options?: any) => string;
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
        ascii_tsv: any;
        ascii_csv: any;
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
