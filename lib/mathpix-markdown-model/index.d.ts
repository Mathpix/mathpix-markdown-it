import { Property } from 'csstype';
import { ISmilesOptions } from '../markdown/md-chemistry';
export interface optionsMathpixMarkdown {
    alignMathBlock?: Property.TextAlign;
    display?: Property.Display;
    isCheckFormula?: boolean;
    showTimeLog?: boolean;
    isDisableFancy?: boolean;
    isDisableEmoji?: boolean;
    isDisableEmojiShortcuts?: boolean;
    disableRules?: string[];
    fontSize?: number;
    padding?: number;
    htmlTags?: boolean;
    breaks?: boolean;
    typographer?: boolean;
    linkify?: boolean;
    enableFileLinks?: boolean;
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
    maxWidth?: string;
    toc?: TTocOptions;
    accessibility?: TAccessibility;
}
export declare type TMarkdownItOptions = {
    isDisableFancy?: boolean;
    isDisableEmoji?: boolean;
    isDisableEmojiShortcuts?: boolean;
    disableRules?: string[];
    htmlTags?: boolean;
    breaks?: boolean;
    typographer?: boolean;
    linkify?: boolean;
    enableFileLinks?: boolean;
    xhtmlOut?: boolean;
    width?: number;
    lineNumbering?: boolean;
    startLine?: number;
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
    maxWidth?: string;
    htmlWrapper?: THtmlWrapper | boolean;
    toc?: TTocOptions;
    accessibility?: TAccessibility;
};
export declare type TOutputMath = {
    include_mathml?: boolean;
    include_mathml_word?: boolean;
    include_asciimath?: boolean;
    include_latex?: boolean;
    include_svg?: boolean;
    include_table_html?: boolean;
    include_tsv?: boolean;
    include_table_markdown?: boolean;
    include_smiles?: boolean;
    include_speech?: boolean;
    include_error?: boolean;
    tsv_separators?: {
        column?: string;
        row?: string;
    };
    table_markdown?: {
        math_as_ascii?: boolean;
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
export declare type THtmlWrapper = {
    title?: string;
    includeStyles?: boolean;
    includeFonts?: boolean;
};
export declare type TTocOptions = {
    style?: TTocStyle;
};
export declare enum TTocStyle {
    summary = "summary",
    list = "list"
}
export declare type TAccessibility = {
    assistiveMml?: boolean;
    sre?: object;
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
    getMaxWidthStyle: (maxWidth?: string, isHideScroll?: boolean) => string;
    parseMarkdownByHTML: (html: string, include_sub_math?: boolean) => any[];
    parseMarkdownByElement: (el: Document | HTMLElement, include_sub_math?: boolean) => any[];
    markdownToHTML: (markdown: string, options?: TMarkdownItOptions) => string;
    showTocInContainer: (html: string, containerName?: string) => void;
    getTocContainerHTML: (html: string) => string;
    checkEquationNumber: (html: string) => string;
    handleClick: (e: any) => void;
    scrollPage: (parent: any, offsetTarget: any) => void;
    loadMathJax: (notScrolling?: boolean, setTextAlignJustify?: boolean, isResetBodyStyles?: boolean, maxWidth?: string, scaleEquation?: boolean) => boolean;
    convertToHTML: (str: string, options?: TMarkdownItOptions) => string;
    getMathjaxStyle: () => any;
    getMathpixStyleOnly: (scaleEquation?: boolean) => string;
    getMathpixStyle: (stylePreview?: boolean, showToc?: boolean, tocContainerName?: string, scaleEquation?: boolean) => string;
    getMathpixMarkdownStyles: (useColors?: boolean, scaleEquation?: boolean) => string;
    getMathpixFontsStyle: () => string;
    render: (text: string, options?: optionsMathpixMarkdown) => string;
    mmdYamlToHTML: (mmd: string, options?: TMarkdownItOptions, isAddYamlToHtml?: boolean) => {
        html: string;
        metadata: any;
        content: string;
        error: string;
    };
    renderTitleMmd: (title: string, options?: TMarkdownItOptions, className?: string, isOnlyInner?: boolean) => string;
    renderAuthorsMmd: (authors: string, options?: TMarkdownItOptions, className?: string, isOnlyInner?: boolean) => string;
}
export declare const MathpixMarkdownModel: MathpixMarkdown_Model;
export {};
