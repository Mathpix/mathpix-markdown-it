import * as CSS from 'csstype';
export interface optionsMathpixMarkdown {
    alignMathBlock?: CSS.TextAlignProperty;
    display?: CSS.DisplayProperty;
    isCheckFormula?: boolean;
    showTimeLog?: boolean;
    isDisableFancy?: boolean;
    disableRules?: string[];
    fontSize?: number;
    padding?: number;
    htmlTags?: boolean;
    breaks?: boolean;
    typographer?: boolean;
    width?: number;
    showToc?: boolean;
    overflowY?: string;
}
export declare type TMarkdownItOptions = {
    htmlTags?: boolean;
    breaks?: boolean;
    typographer?: boolean;
    width?: number;
    lineNumbering?: boolean;
};
declare class MathpixMarkdown_Model {
    disableFancyArrayDef: string[];
    disableRules: string[];
    isCheckFormula?: boolean;
    showTimeLog?: boolean;
    setOptions(disableRules: string[], isCheckFormula?: boolean, showTimeLog?: boolean): void;
    checkFormula: (mathString: string, showTimeLog?: boolean) => string;
    texReset: (n?: number) => void;
    getLastEquationNumber: () => any;
    markdownToHTML: (markdown: string, options: TMarkdownItOptions) => string;
    showTocInContainer: (html: string, containerName?: string) => void;
    getTocContainerHTML: (html: string) => string;
    checkEquationNumber: (html: string) => string;
    handleClick: (e: any) => void;
    scrollPage: (parent: any, offsetTarget: any) => void;
    loadMathJax: (notScrolling?: boolean, setTextAlignJustify?: boolean, isResetBodyStyles?: boolean) => boolean;
    convertToHTML: (str: string, options: TMarkdownItOptions) => string;
    getMathjaxStyle: () => any;
    getMathpixStyleOnly: () => string;
    getMathpixStyle: (stylePreview?: boolean, showToc?: boolean, tocContainerName?: string) => string;
    render: (text: string, options?: optionsMathpixMarkdown) => string;
}
export declare const MathpixMarkdownModel: MathpixMarkdown_Model;
export {};
