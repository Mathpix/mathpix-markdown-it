import { TAccessibility } from "../mathpix-markdown-model";
import { Label } from 'mathjax-full/js/input/tex/Tags.js';
export interface IOuterData {
    mathml?: string;
    mathml_word?: string;
    asciimath?: string;
    asciimath_tsv?: string;
    asciimath_csv?: string;
    asciimath_md?: string;
    latex?: string;
    svg?: string;
    speech?: string;
    labels?: {
        [key: string]: Label;
    };
}
export declare const MathJax: {
    assistiveMml: boolean;
    nonumbers: boolean;
    checkAccessibility: (accessibility?: TAccessibility, nonumbers?: boolean) => void;
    Stylesheet: () => unknown;
    TexConvert: (string: any, options?: any) => IOuterData;
    TexConvertToAscii: (string: any, options?: any) => string;
    /**
     * Typeset a TeX expression and return the SVG tree for it
     *
     * @param string {string}
     * @param options {}
     */
    Typeset: (string: any, options?: any) => {
        html: string;
        labels: {
            [key: string]: Label;
        };
        ascii: string;
        ascii_tsv: string;
        ascii_csv: string;
        ascii_md: string;
    };
    TypesetSvgAndAscii: (string: any, options?: any) => {
        html: string;
        ascii: string;
        labels: {
            [key: string]: Label;
        };
        ascii_tsv: string;
        ascii_csv: string;
        ascii_md: string;
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
