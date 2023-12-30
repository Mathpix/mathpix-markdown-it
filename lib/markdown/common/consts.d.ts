export declare const attr_value: string;
export declare const attribute: string;
export declare const openTagMML: RegExp;
export declare const closeTagMML: RegExp;
export declare const open_tag_smiles: string;
export declare const reOpenTagSmiles: RegExp;
export declare const reSpan: RegExp;
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
export declare const reNumber: RegExp;
export declare const svgRegex: RegExp;
export declare const HIGHLIGHT_COLOR = "rgba(0, 147, 255, 0.25)";
export declare const HIGHLIGHT_TEXT_COLOR = "#1e2029";
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
        terminated: any[];
    };
    pageBreaksBlock: {
        terminated: string[];
    };
    paragraphDiv: {
        terminated: any[];
    };
};
export declare const mathTokenTypes: string[];
export declare const codeHighlightDef: {
    auto: boolean;
    code: boolean;
};
