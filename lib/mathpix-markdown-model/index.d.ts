import { Property } from 'csstype';
import { ISmilesOptions } from '../markdown/md-chemistry';
export interface optionsMathpixMarkdown {
    alignMathBlock?: Property.TextAlign;
    display?: Property.Display;
    isCheckFormula?: boolean;
    showTimeLog?: boolean;
    isDisableFancy?: boolean;
    disableRules?: string[];
    fontSize?: number;
    padding?: number;
    htmlTags?: boolean;
    breaks?: boolean;
    typographer?: boolean;
    linkify?: boolean;
    xhtmlOut?: boolean;
    width?: number;
    showToc?: boolean;
    overflowY?: string;
    outMath?: TOutputMath;
    mathJax?: TOutputMathJax;
    htmlSanitize?: THtmlSanitize;
    smiles?: ISmilesOptions;
    forDocx?: boolean;
    forLatex?: boolean;
    openLinkInNewWindow?: boolean;
}
export declare type TMarkdownItOptions = {
    isDisableFancy?: boolean;
    disableRules?: string[];
    htmlTags?: boolean;
    breaks?: boolean;
    typographer?: boolean;
    linkify?: boolean;
    xhtmlOut?: boolean;
    width?: number;
    lineNumbering?: boolean;
    renderElement?: {
        inLine?: boolean;
        startLine?: number;
        class?: string;
        preview?: any;
    };
    outMath?: TOutputMath;
    mathJax?: TOutputMathJax;
    htmlSanitize?: THtmlSanitize;
    smiles?: ISmilesOptions;
    forDocx?: boolean;
    forLatex?: boolean;
    openLinkInNewWindow?: boolean;
};
export declare type TOutputMath = {
    include_mathml?: boolean;
    include_mathml_word?: boolean;
    include_asciimath?: boolean;
    include_latex?: boolean;
    include_svg?: boolean;
    include_table_html?: boolean;
    include_tsv?: boolean;
    include_smiles?: boolean;
    tsv_separators?: {
        column?: string;
        row?: string;
    };
    not_catch_errors?: boolean;
};
export declare type TOutputMathJax = {
    mtextInheritFont?: boolean;
    asciiMath?: TAsciiMath;
};
export declare type THtmlSanitize = {
    disallowedTagsMode?: string;
} | false;
export declare type TAsciiMath = {
    useBacktick?: boolean;
} | false;
declare class MathpixMarkdown_Model {
    disableFancyArrayDef: string[];
    disableRules: string[];
    isCheckFormula?: boolean;
    showTimeLog?: boolean;
    setOptions(disableRules: string[], isCheckFormula?: boolean, showTimeLog?: boolean): void;
    checkFormula: (mathString: string, showTimeLog?: boolean) => string;
    texReset: (n?: number) => void;
    getLastEquationNumber: () => any;
    parseMarkdownByHTML: (html: string, include_sub_math?: boolean) => any[];
    parseMarkdownByElement: (el: HTMLElement | Document, include_sub_math?: boolean) => any[];
    markdownToHTML: (markdown: string, options?: TMarkdownItOptions) => string;
    showTocInContainer: (html: string, containerName?: string) => void;
    getTocContainerHTML: (html: string) => string;
    checkEquationNumber: (html: string) => string;
    handleClick: (e: any) => void;
    scrollPage: (parent: any, offsetTarget: any) => void;
    loadMathJax: (notScrolling?: boolean, setTextAlignJustify?: boolean, isResetBodyStyles?: boolean) => boolean;
    convertToHTML: (str: string, options?: TMarkdownItOptions) => string;
    getMathjaxStyle: () => any;
    getMathpixStyleOnly: () => string;
    getMathpixStyle: (stylePreview?: boolean, showToc?: boolean, tocContainerName?: string) => string;
    getMathpixMarkdownStyles: (useColors?: boolean) => string;
    getMathpixFontsStyle: () => string;
    render: (text: string, options?: optionsMathpixMarkdown) => string;
}
export declare const MathpixMarkdownModel: MathpixMarkdown_Model;
export {};
