import { TAccessibility } from "../mathpix-markdown-model";
import { Label } from 'mathjax-full/js/input/tex/Tags.js';
export interface IOuterData {
    mathml?: string;
    mathml_word?: string;
    asciimath?: string;
    linermath?: string;
    asciimath_tsv?: string;
    asciimath_csv?: string;
    asciimath_md?: string;
    latex?: string;
    svg?: string;
    speech?: string;
    labels?: {
        [key: string]: Label;
    };
    height?: number;
    heightAndDepth?: number;
    width?: string;
    widthEx?: number;
    heightEx?: number;
}
export declare const OuterHTML: (data: any, outMath: any, forPptx?: boolean) => string;
export declare const MathJax: {
    assistiveMml: boolean;
    nonumbers: boolean;
    checkAccessibility: (accessibility?: TAccessibility, nonumbers?: boolean) => void;
    Stylesheet: () => unknown;
    TexConvert: (string: any, options?: any, throwError?: boolean) => IOuterData;
    TexConvertToAscii: (string: any, options?: any) => string;
    /**
     * Typeset a TeX expression and return the SVG tree for it
     *
     * @param string {string}
     * @param options {}
     */
    Typeset: (string: any, options?: any, throwError?: boolean) => {
        html: string;
        labels: {
            [key: string]: Label;
        };
        ascii: string;
        liner: string;
        ascii_tsv: string;
        ascii_csv: string;
        ascii_md: string;
        data: {
            mathml?: string;
            mathml_word?: string;
            asciimath?: string;
            linermath?: string;
            asciimath_tsv?: string;
            asciimath_csv?: string;
            asciimath_md?: string;
            latex?: string;
            svg?: string;
            speech?: string;
            labels?: {
                [key: string]: Label;
            };
            height?: number;
            heightAndDepth?: number;
            width?: string;
            widthEx?: number;
            heightEx?: number;
        };
    };
    TypesetSvgAndAscii: (string: any, options?: any) => {
        html: string;
        ascii: string;
        liner: string;
        labels: {
            [key: string]: Label;
        };
        ascii_tsv: string;
        ascii_csv: string;
        ascii_md: string;
        data: {
            mathml?: string;
            mathml_word?: string;
            asciimath?: string;
            linermath?: string;
            asciimath_tsv?: string;
            asciimath_csv?: string;
            asciimath_md?: string;
            latex?: string;
            svg?: string;
            speech?: string;
            labels?: {
                [key: string]: Label;
            };
            height?: number;
            heightAndDepth?: number;
            width?: string;
            widthEx?: number;
            heightEx?: number;
        };
    };
    /**
     * Typeset a MathML expression and return the SVG tree for it
     *
     * @param string {string}
     * @param options {}
     */
    TypesetMathML: (string: any, options?: any) => {
        html: string;
        data: {
            mathml?: string;
            mathml_word?: string;
            asciimath?: string;
            linermath?: string;
            asciimath_tsv?: string;
            asciimath_csv?: string;
            asciimath_md?: string;
            latex?: string;
            svg?: string;
            speech?: string;
            labels?: {
                [key: string]: Label;
            };
            height?: number;
            heightAndDepth?: number;
            width?: string;
            widthEx?: number;
            heightEx?: number;
        };
    };
    AsciiMathToSvg: (string: any, options?: any) => string;
    Reset: (n?: number) => void;
    GetLastEquationNumber: () => any;
};
