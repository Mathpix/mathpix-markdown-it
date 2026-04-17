import { Property } from 'csstype';
import { ISmilesOptions } from '../markdown/md-chemistry';
import { IFontMetricsOptions } from "../markdown/common/text-dimentions";
import { size, ISize } from "../markdown/common/counters";
export interface StyleBundleOpts {
    setTextAlignJustify?: boolean;
    useColors?: boolean;
    maxWidth?: string;
    isPptx?: boolean;
    resetBody?: boolean;
    container?: boolean;
    mathjax?: boolean;
    code?: boolean;
    preview?: boolean;
    toc?: boolean;
    tocContainerName?: string;
    menu?: boolean;
}
export interface optionsMathpixMarkdown {
    alignMathBlock?: Property.TextAlign;
    display?: Property.Display;
    isCheckFormula?: boolean;
    showTimeLog?: boolean;
    isDisableFancy?: boolean;
    isDisableEmoji?: boolean;
    isDisableEmojiShortcuts?: boolean;
    isDisableRefs?: boolean;
    isDisableFootnotes?: boolean;
    disableRules?: string[];
    fontSize?: number;
    padding?: number;
    htmlTags?: boolean;
    htmlDisableTagMatching?: boolean;
    breaks?: boolean;
    typographer?: boolean;
    linkify?: boolean;
    enableFileLinks?: boolean;
    validateLink?: (url: string) => void;
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
    forMD?: boolean;
    forPptx?: boolean;
    openLinkInNewWindow?: boolean;
    maxWidth?: string;
    toc?: TTocOptions;
    accessibility?: TAccessibility;
    nonumbers?: boolean;
    showPageBreaks?: boolean;
    centerImages?: boolean;
    centerTables?: boolean;
    enableCodeBlockRuleForLatexCommands?: boolean;
    addPositionsToTokens?: boolean;
    highlights?: Array<THighlight>;
    parserErrors?: ParserErrors;
    codeHighlight?: CodeHighlight;
    footnotes?: Footnotes;
    copyToClipboard?: boolean;
    renderOptions?: RenderOptions;
    previewUuid?: string;
}
export type TMarkdownItOptions = {
    isDisableFancy?: boolean;
    isDisableEmoji?: boolean;
    isDisableEmojiShortcuts?: boolean;
    isDisableRefs?: boolean;
    isDisableFootnotes?: boolean;
    disableRules?: string[];
    htmlTags?: boolean;
    htmlDisableTagMatching?: boolean;
    breaks?: boolean;
    typographer?: boolean;
    linkify?: boolean;
    enableFileLinks?: boolean;
    validateLink?: (url: string) => void;
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
    forMD?: boolean;
    forPptx?: boolean;
    openLinkInNewWindow?: boolean;
    maxWidth?: string;
    htmlWrapper?: THtmlWrapper | boolean;
    toc?: TTocOptions;
    accessibility?: TAccessibility;
    nonumbers?: boolean;
    showPageBreaks?: boolean;
    centerImages?: boolean;
    centerTables?: boolean;
    enableCodeBlockRuleForLatexCommands?: boolean;
    addPositionsToTokens?: boolean;
    highlights?: Array<THighlight>;
    parserErrors?: ParserErrors;
    codeHighlight?: CodeHighlight;
    footnotes?: Footnotes;
    copyToClipboard?: boolean;
    renderOptions?: RenderOptions;
    previewUuid?: string;
    enableSizeCalculation?: boolean;
};
export type TOutputMath = {
    output_format?: 'svg' | 'mathml' | 'latex';
    include_mathml?: boolean;
    include_mathml_word?: boolean;
    include_asciimath?: boolean;
    include_latex?: boolean;
    include_svg?: boolean;
    include_linearmath?: boolean;
    include_table_html?: boolean;
    include_tsv?: boolean;
    include_csv?: boolean;
    include_table_markdown?: boolean;
    include_smiles?: boolean;
    include_mol?: boolean;
    include_speech?: boolean;
    include_error?: boolean;
    tsv_separators?: {
        column?: string;
        row?: string;
    };
    csv_separators?: {
        column?: string;
        row?: string;
        toQuoteAllFields?: boolean; /** to quote all fields whether or not they contain delimiters */
    };
    md_separators?: {
        column?: string;
        row?: string;
    };
    table_markdown?: {
        math_as_ascii?: boolean;
        math_inline_delimiters?: Array<string>;
    };
    not_catch_errors?: boolean;
};
export type TOutputMathJax = {
    mtextInheritFont?: boolean;
    asciiMath?: TAsciiMath;
};
export type THtmlSanitize = {
    disallowedTagsMode?: string;
    allowedTags?: Array<string>;
    allowedAttributes?: Record<string, string[]>;
    allowedIframeHostnames?: Array<string>;
    selfClosing?: Array<string>;
    allowedSchemes?: Array<string>;
    allowedSchemesByTag?: Record<string, string[]>;
    allowedSchemesAppliedToAttributes?: Array<string>;
    allowProtocolRelative?: boolean;
    enforceHtmlBoundary?: boolean;
    skipCloseTag?: boolean;
} | false;
export type TAsciiMath = {
    useBacktick?: boolean;
} | false;
export type THtmlWrapper = {
    title?: string;
    includeStyles?: boolean;
    includeFonts?: boolean;
};
export type TTocOptions = {
    style?: TTocStyle;
    doNotGenerateParentId?: boolean; /** Don't generate unique ParentId for nested blocks. Used to testing */
    excludeUnnumberedFromTOC?: boolean;
};
export type CodeHighlight = {
    auto?: boolean;
    code?: boolean;
};
export type RenderOptions = {
    enable_markdown?: boolean;
    enable_latex?: boolean;
    enable_markdown_mmd_extensions?: boolean;
};
export declare enum TTocStyle {
    summary = "summary",
    list = "list"
}
export declare enum ParserErrors {
    show = "show",
    hide = "hide",
    show_input = "show_input"
}
export type THighlight = {
    start: number;
    end: number;
    highlight_color?: string;
    text_color?: string;
    font_weight?: string;
    include_block?: boolean;
};
export type TAccessibility = {
    assistiveMml?: boolean;
    sre?: object;
};
export type Footnotes = {
    fontSize?: string;
    compact_refs?: boolean;
};
declare class MathpixMarkdown_Model {
    disableFancyArrayDef: string[];
    disableRules: string[];
    isCheckFormula?: boolean;
    showTimeLog?: boolean;
    private isClickHandlerBound;
    setOptions(disableRules: string[], isCheckFormula?: boolean, showTimeLog?: boolean): void;
    checkFormula: (mathString: string, showTimeLog?: boolean) => string;
    texReset: (n?: number) => void;
    getLastEquationNumber: () => any;
    getMaxWidthStyle: (maxWidth?: string, isHideScroll?: boolean) => string;
    parseMarkdownByHTML: (html: string, include_sub_math?: boolean) => any[];
    parseMarkdownByElement: (el: Document | HTMLElement, include_sub_math?: boolean) => any[];
    markdownToHTMLWithSize: (markdown: string, options?: TMarkdownItOptions, fontMetricsOptions?: IFontMetricsOptions) => {
        html: string;
        size: ISize;
    };
    markdownToHTMLSegments: (markdown: string, options?: TMarkdownItOptions) => {
        content: string;
        map: [
            number,
            number
        ][];
    };
    markdownToHTML: (markdown: string, options?: TMarkdownItOptions) => string;
    showTocInContainer: (html: string, containerName?: string) => void;
    getTocContainerHTML: (html: string, onlyContent?: boolean) => string;
    checkEquationNumber: (html: string) => string;
    handleClick: (e: any) => void;
    scrollPage: (parent: any, offsetTarget: any) => void;
    /** Browser runtime: injects SVG-styles + Mathpix-styles into DOM. Includes: core, code, tabular, lists, toc, menu. No container/mathjax (SVG injected separately). */
    loadMathJax: (notScrolling?: boolean, setTextAlignJustify?: boolean, isResetBodyStyles?: boolean, maxWidth?: string, useColors?: boolean) => boolean;
    convertToHTML: (str: string, options?: TMarkdownItOptions) => string;
    getMathjaxStyle: () => string;
    /**
     * Single CSS builder. All style assembly methods delegate here.
     *
     * Canonical order:
     *   resetBody → container → mathjax → MathpixStyle → code → tabular → lists → preview → toc → menu+clipboard
     *
     * Modules always included: MathpixStyle, tabularStyles, listsStyles.
     * Modules toggled via opts: resetBody, container, mathjax, code (default: on), preview, toc, menu+clipboard.
     */
    buildStyles: (opts?: StyleBundleOpts) => string;
    /** Styles for embedded widget (no container/preview). Includes: mathjax, core, code, tabular, lists, menu.*/
    getMathpixStyleOnly: (useColors?: boolean) => string;
    /** Full page styles. Includes: container, mathjax, core, code, tabular, lists. Optionally: preview, toc, menu.*/
    getMathpixStyle: (stylePreview?: boolean, showToc?: boolean, tocContainerName?: string, useColors?: boolean, isPptx?: boolean) => string;
    /** VSCode markdown preview styles. Includes: container, mathjax, core, tabular, lists. No code (VSCode provides its own).*/
    getMathpixMarkdownStyles: (useColors?: boolean) => string;
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
