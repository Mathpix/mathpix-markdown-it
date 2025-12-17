import { RenderOptions } from "../../mathpix-markdown-model";
export declare const attr_value: string;
export declare const attribute: string;
export declare const openTagMML: RegExp;
export declare const closeTagMML: RegExp;
export declare const mathMLInlineRegex: RegExp;
export declare const open_tag_smiles: string;
export declare const reOpenTagSmiles: RegExp;
export declare const markerBeginTagSpan: RegExp;
export declare const markerCloseTagSpan: RegExp;
export declare const reSpan: RegExp;
export declare const reSpanG: RegExp;
export declare const reSeparatingSpan: RegExp;
export declare const reSeparatingSpanG: RegExp;
export declare const closeTagSpan: RegExp;
export declare const labelTag: RegExp;
export declare const labelTagG: RegExp;
export declare const openTag: RegExp;
export declare const openTagDescription: RegExp;
export declare const openTagProof: RegExp;
export declare const reNewTheoremG: RegExp;
export declare const reNewTheoremInit: RegExp;
export declare const reNewTheoremUnNumberedInit: RegExp;
export declare const reNewTheorem: RegExp;
export declare const reNewTheoremNumbered: RegExp;
export declare const reNewTheoremNumbered2: RegExp;
export declare const reNewTheoremUnNumbered: RegExp;
export declare const reTheoremStyle: RegExp;
export declare const reTheoremStyleG: RegExp;
export declare const defTheoremStyle = "plain";
export declare const reNewCommandQedSymbol: RegExp;
export declare const reNewCommandQedSymbolG: RegExp;
export declare const defQED = "$\\square$";
export declare const reSetCounter: RegExp;
export declare const reSetCounterG: RegExp;
export declare const reAddContentsLine: RegExp;
export declare const reAddContentsLineG: RegExp;
export declare const reMultiRowWithVPos: RegExp;
export declare const reMultiRow: RegExp;
export declare const openTagTabular: RegExp;
export declare const closeTagTabular: RegExp;
export declare const reFootNote: RegExp;
export declare const reOpenTagFootnote: RegExp;
export declare const reOpenTagFootnoteG: RegExp;
export declare const reOpenTagFootnoteNumbered: RegExp;
export declare const reOpenTagFootnotetext: RegExp;
export declare const reOpenTagFootnotetextG: RegExp;
export declare const reOpenTagFootnotetextNumbered: RegExp;
export declare const reFootNoteMark: RegExp;
export declare const reFootNoteText: RegExp;
export declare const reDiagboxG: RegExp;
export declare const reDiagbox: RegExp;
export declare const reNumber: RegExp;
export declare const svgRegex: RegExp;
export declare const svgInlineRegex: RegExp;
export declare const uuidPattern: string;
export declare const doubleAngleBracketUuidPattern: RegExp;
export declare const singleAngleBracketPattern: RegExp;
export declare const doubleCurlyBracketUuidPattern: RegExp;
export declare const singleCurlyBracketPattern: RegExp;
export declare const RE_TAG_WITH_HLINE: RegExp;
export declare const RE_TAG_WITH_HHLINE: RegExp;
export declare const RE_TAG_WITH_HDASHLINE: RegExp;
export declare const RE_TAG_WITH_CLINE: RegExp;
export declare const RE_HLINE: RegExp;
export declare const RE_HHLINE: RegExp;
export declare const RE_HDASHLINE: RegExp;
export declare const RE_CLINE: RegExp;
export declare const RE_DIMENSIONAL_UNIT_TAG: RegExp;
export declare const lineSpaceTag: RegExp;
export declare const RE_CAPTION_SETUP_TAG_BEGIN: RegExp;
export declare const RE_CAPTION_SETUP: RegExp;
export declare const RE_BEGIN_ALIGN_ENV: RegExp;
export declare const RE_ALIGN_ENV_BLOCK: RegExp;
export declare const RE_BEGIN_FIGURE_OR_TABLE_ENV: RegExp;
export declare const RE_BEGIN_TABLE_OR_FIGURE_WITH_PLACEMENT: RegExp;
export declare const RE_CAPTION_TAG: RegExp;
export declare const RE_CAPTION_TAG_GLOBAL: RegExp;
export declare const RE_CAPTION_TAG_BEGIN: RegExp;
export declare const RE_ALIGN_CENTERING_GLOBAL: RegExp;
export declare const RE_INCLUDEGRAPHICS_WITH_ALIGNMENT_GLOBAL: RegExp;
export declare const CODE_ENVS: Set<string>;
export declare const BEGIN_LST_FAST_RE: RegExp;
export declare const END_LST_RE: RegExp;
export declare const BEGIN_LST_RE: RegExp;
export declare const BEGIN_LST_INLINE_RE: RegExp;
export declare const END_LST_INLINE_RE: RegExp;
/** Full begin line: \begin{lstlisting}[...]( +hspace +≤1 NL ) */
export declare const BEGIN_LST_WITH_TRAIL_WS_NL_RE: RegExp;
export declare const LST_HLJS_LANGUAGES: {
    'c++': string;
    assembler: string;
    caml: string;
    csh: string;
    inform: string;
    ksh: string;
    sh: string;
};
export declare const HIGHLIGHT_COLOR = "rgba(0, 147, 255, 0.25)";
export declare const HIGHLIGHT_TEXT_COLOR = "#1e2029";
export declare const TEXTWIDTH_RE: RegExp;
export declare const SIMPLE_MATH_DELIM_RE: RegExp;
export declare const RE_EMPTY_TEXT: RegExp;
export declare const latexEnvironments: string[];
/** https://docs.mathjax.org/en/v3.0-latest/input/tex/macros/index.html#environments */
export declare const mathEnvironments: string[];
export declare const tsvSeparatorsDef: {
    column: string;
    row: string; /** newline as the record delimiter */
};
export declare const csvSeparatorsDef: {
    column: string;
    row: string;
    toQuoteAllFields: boolean; /** to quote all fields whether or not they contain delimiters */
};
export declare const mdSeparatorsDef: {
    column: string;
    row: string;
};
/**
 * key - name of block-rule;
 * terminated - a list of rules that this rule can terminate. */
export declare const terminatedRules: {
    smilesDrawerBlock: {
        terminated: string[];
    };
    BeginTable: {
        terminated: string[];
    };
    BeginAlign: {
        terminated: string[];
    };
    BeginTabular: {
        terminated: string[];
    };
    BeginProof: {
        terminated: string[];
    };
    BeginTheorem: {
        terminated: string[];
    };
    newTheoremBlock: {
        terminated: string[];
    };
    ReNewCommand: {
        terminated: any[];
    };
    Lists: {
        terminated: any[];
    };
    separatingSpan: {
        terminated: any[];
    };
    headingSection: {
        terminated: string[];
    };
    addContentsLineBlock: {
        terminated: string[];
    };
    mathMLBlock: {
        terminated: string[];
    };
    abstractBlock: {
        terminated: string[];
    };
    pageBreaksBlock: {
        terminated: string[];
    };
    paragraphDiv: {
        terminated: any[];
    };
    svg_block: {
        terminated: string[];
    };
    image_with_size_block: {
        terminated: string[];
    };
    fence: {
        terminated: string[];
    };
};
export declare const mathTokenTypes: string[];
export declare const codeHighlightDef: {
    auto: boolean;
    code: boolean;
};
export declare const renderOptionsDef: RenderOptions;
export declare const OPENING_STYLE_TOKENS: string[];
export declare const CLOSING_STYLE_TOKENS: string[];
export declare const INLINE_ELEMENT_TOKENS: string[];
