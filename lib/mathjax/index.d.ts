import { TAccessibility } from "../mathpix-markdown-model";
import { Label } from 'mathjax-full/js/input/tex/Tags.js';
/**
 * Error returned by `MathpixMarkdownModel.validateTex` when parsing fails.
 * - `code`: MathJax `TexError.id` (e.g. `'UndefinedControlSequence'`, `'MissingArgFor'`) for parse errors;
 *   `'InvalidInput'` when `latex` is not a string (caller bug);
 *   `'InternalError'` when MathJax itself threw a non-TexError (parser crash);
 *   `'TexError'` is a defensive fallback if a future MathJax produces a TexError without an `.id` (does not occur in 3.2.2).
 * - `latex`: the input formula that triggered the error.
 */
export declare class TexValidationError extends Error {
    readonly code?: string;
    readonly latex: string;
    constructor(message: string, latex: string, code?: string);
}
export type TexValidationResult = {
    valid: true;
} | {
    valid: false;
    error: TexValidationError;
};
export interface IOuterData {
    mathml?: string;
    mathml_word?: string;
    asciimath?: string;
    linearmath?: string;
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
    _a11y: {
        renderKey: string;
        counter: number;
    };
    beginRender(renderKey?: string): void;
    nextAssistiveId(prefix?: string): string;
    checkAccessibility: (accessibility?: TAccessibility, nonumbers?: boolean) => void;
    Stylesheet: () => unknown;
    TexConvert: (string: any, options?: any, throwError?: boolean) => IOuterData;
    /**
     * Validates a TeX expression using MathJax's parser without producing SVG output.
     * Runs `TexParser` directly on an isolated `MTeX` instance — skips MathItem/MathDocument,
     * post-filters, and the output jax. No side-effects on the rendering pipeline.
     *
     * @remarks Validator state (custom macros via `\newcommand`) persists across calls.
     * Pass `isolated: true` (or call `ResetValidateTex()`) after untrusted input.
     *
     * @param latex - The TeX source to validate. An empty or whitespace-only string returns `{ valid: true }`.
     * @param options.display - `true` (default) for block math, `false` for inline.
     * @param options.isolated - If `true`, drop accumulated `packageData` **before** this call. Default `false`. Asymmetric: macros defined by *this* call remain after return; call `resetValidateTex()` if you also want to drop them.
     * @returns `{ valid: true }` if parsing succeeds, `{ valid: false, error: TexValidationError }` otherwise. Never throws.
     */
    ValidateTex: (latex: string, options?: {
        display?: boolean;
        isolated?: boolean;
    }) => TexValidationResult;
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
        linear: string;
        ascii_tsv: string;
        ascii_csv: string;
        ascii_md: string;
        data: {
            mathml?: string;
            mathml_word?: string;
            asciimath?: string;
            linearmath?: string;
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
        linear: string;
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
            linearmath?: string;
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
            linearmath?: string;
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
    ResetValidateTex: () => void;
    GetLastEquationNumber: () => any;
};
