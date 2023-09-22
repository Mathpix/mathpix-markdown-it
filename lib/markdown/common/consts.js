"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.terminatedRules = exports.mdSeparatorsDef = exports.csvSeparatorsDef = exports.tsvSeparatorsDef = exports.mathEnvironments = exports.latexEnvironments = exports.HIGHLIGHT_TEXT_COLOR = exports.HIGHLIGHT_COLOR = exports.reNumber = exports.reFootNoteText = exports.reFootNoteMark = exports.reOpenTagFootnotetextNumbered = exports.reOpenTagFootnotetext = exports.reOpenTagFootnoteNumbered = exports.reOpenTagFootnote = exports.reFootNote = exports.closeTagTabular = exports.openTagTabular = exports.reMultiRow = exports.reMultiRowWithVPos = exports.reAddContentsLineG = exports.reAddContentsLine = exports.reSetCounterG = exports.reSetCounter = exports.defQED = exports.reNewCommandQedSymbolG = exports.reNewCommandQedSymbol = exports.defTheoremStyle = exports.reTheoremStyleG = exports.reTheoremStyle = exports.reNewTheoremUnNumbered = exports.reNewTheoremNumbered2 = exports.reNewTheoremNumbered = exports.reNewTheorem = exports.reNewTheoremUnNumberedInit = exports.reNewTheoremInit = exports.reNewTheoremG = exports.openTagProof = exports.openTagDescription = exports.openTag = exports.labelTagG = exports.labelTag = exports.closeTagSpan = exports.reSpan = exports.reOpenTagSmiles = exports.open_tag_smiles = exports.closeTagMML = exports.openTagMML = exports.attribute = exports.attr_value = void 0;
exports.codeHighlightDef = exports.mathTokenTypes = void 0;
var attr_name = '[a-zA-Z_:][a-zA-Z0-9:._-]*';
var unquoted = '[^"\'=<>`\\x00-\\x20]+';
var single_quoted = "'[^']*'";
var double_quoted = '"[^"]*"';
exports.attr_value = '(?:' + unquoted + '|' + single_quoted + '|' + double_quoted + ')';
exports.attribute = '(?:\\s+' + attr_name + '(?:\\s*=\\s*' + exports.attr_value + ')?)';
var open_tag_mml = '<(math)' + exports.attribute + '*\\s*\\/?>';
var close_tag_mml = '<\\/math*\\s*>';
exports.openTagMML = new RegExp('(?:' + open_tag_mml + ')');
exports.closeTagMML = new RegExp('(?:' + close_tag_mml + ')');
exports.open_tag_smiles = '^<(smiles)' + exports.attribute + '*\\s*\\/?>';
exports.reOpenTagSmiles = new RegExp('(?:' + exports.open_tag_smiles + ')');
exports.reSpan = /^<(span\s*(?:class="([^>]*)")\s*([^>]*))>(.*)<\/span\>/;
var close_tag_span = '<\\/span*\\s*>';
exports.closeTagSpan = new RegExp('(?:' + close_tag_span + ')');
exports.labelTag = /\\label\s{0,}\{([^}]*)\}/;
exports.labelTagG = /\\label\s{0,}\{([^}]*)\}/g;
exports.openTag = /\\begin\s{0,}\{(?<name>[^}]*)\}/;
exports.openTagDescription = /\\begin\s{0,}\{(?<name>[^}]*)\}\s{0,}\[(?<description>[^\]]*)\]/;
exports.openTagProof = /\\begin\s{0,}\{([proof\s]+)\}/;
exports.reNewTheoremG = /\\newtheorem([^}]*)\s{0,}\{(?<name>[^}]*)\}/;
exports.reNewTheoremInit = /^\\newtheorem\s{0,}\{(?<name>[^}]*)\}/;
exports.reNewTheoremUnNumberedInit = /^\\newtheorem\*\s{0,}\{(?<name>[^}]*)\}/;
exports.reNewTheorem = /^\\newtheorem\s{0,}\{(?<name>[^}]*)\}\s{0,}\{(?<print>[^}]*)\}/;
exports.reNewTheoremNumbered = /^\\newtheorem\s{0,}\{(?<name>[^}]*)\}\s{0,}\{(?<print>[^}]*)\}\s{0,}\[(?<numbered>[^\]]*)\]/;
exports.reNewTheoremNumbered2 = /^\\newtheorem\s{0,}\{(?<name>[^}]*)\}\s{0,}\[(?<numbered>[^\]]*)\]\s{0,}\{(?<print>[^}]*)\}/;
exports.reNewTheoremUnNumbered = /^\\newtheorem\*\s{0,}\{(?<name>[^}]*)\}\s{0,}\{(?<print>[^}]*)\}/;
exports.reTheoremStyle = /^\\theoremstyle\s{0,}\{(definition|plain|remark)\}/;
exports.reTheoremStyleG = /\\theoremstyle\s{0,}\{(definition|plain|remark)\}/;
exports.defTheoremStyle = "plain";
exports.reNewCommandQedSymbol = /^\\renewcommand\s{0,}\\qedsymbol\s{0,}\{(?<qed>[^}]*)\}/;
exports.reNewCommandQedSymbolG = /\\renewcommand\s{0,}\\qedsymbol\s{0,}\{(?<qed>[^}]*)\}/;
exports.defQED = "$\\square$";
exports.reSetCounter = /^\\setcounter\s{0,}\{(?<name>[^}]*)\}\s{0,}\{(?<number>[^}]*)\}/;
exports.reSetCounterG = /\\setcounter\s{0,}\{(?<name>[^}]*)\}\s{0,}\{(?<number>[^}]*)\}/;
exports.reAddContentsLine = /^\\addcontentsline\s{0,}\{(?<exp>[^}]*)\}\s{0,}\{(?<unit>[^}]*)\}/;
exports.reAddContentsLineG = /^\\addcontentsline\s{0,}\{(?<exp>[^}]*)\}\s{0,}\{(?<unit>[^}]*)\}/;
exports.reMultiRowWithVPos = /(?:\\multirow\s{0,}\[(?<vpos>[^\]]*)\]\s{0,}\{(?<nrows>[^}]*)\}\s{0,}\{(?<width>[^}]*)\})/;
exports.reMultiRow = /(?:\\multirow\s{0,}\{(?<nrows>[^}]*)\}\s{0,}\{(?<width>[^}]*)\})/;
exports.openTagTabular = /^\\begin\s{0,}{tabular}\s{0,}\{([^}]*)\}/;
exports.closeTagTabular = /^\\end\s{0,}{tabular}/;
exports.reFootNote = /^\\footnote/;
exports.reOpenTagFootnote = /\\footnote\s{0,}\[\s{0,}\]\s{0,}{|\\footnote\s{0,}\[-?\d+\]\s{0,}{|\\footnote\s{0,}{/;
exports.reOpenTagFootnoteNumbered = /\\footnote\s{0,}\[(?<number>-?\d+)\]\s{0,}{/;
exports.reOpenTagFootnotetext = /\\footnotetext\s{0,}\[\s{0,}\]\s{0,}{|\\footnotetext\s{0,}\[-?\d+\]\s{0,}{|\\footnotetext\s{0,}{|\\blfootnotetext\s{0,}{/;
exports.reOpenTagFootnotetextNumbered = /\\footnotetext\s{0,}\[(?<number>-?\d+)\]\s{0,}{/;
exports.reFootNoteMark = /^\\footnotemark/;
exports.reFootNoteText = /^\\footnotetext|\\blfootnotetext/;
exports.reNumber = /^-?\d+$/;
exports.HIGHLIGHT_COLOR = 'rgba(0, 147, 255, 0.25)';
exports.HIGHLIGHT_TEXT_COLOR = '#1e2029';
exports.latexEnvironments = [
    "figure",
    "table",
    "tabular",
    "enumerate",
    "itemize",
    "proof",
    //Paragraph environments
    "center",
    "left",
    "right",
    "abstract"
];
/** https://docs.mathjax.org/en/v3.0-latest/input/tex/macros/index.html#environments */
exports.mathEnvironments = [
    "align",
    "align*",
    "alignat",
    "alignat*",
    "aligned",
    "alignedat",
    "array",
    "Bmatrix",
    "bmatrix",
    "cases",
    "eqnarray",
    "eqnarray*",
    "equation",
    "equation*",
    "gather",
    "gather*",
    "gathered",
    "matrix",
    "multline",
    "multline*",
    "pmatrix",
    "smallmatrix",
    "split",
    "subarray",
    "Vmatrix",
    "vmatrix"
];
exports.tsvSeparatorsDef = {
    column: '\t',
    row: '\n' /** newline as the record delimiter */
};
exports.csvSeparatorsDef = {
    column: ',',
    row: '\n',
    toQuoteAllFields: false /** to quote all fields whether or not they contain delimiters */
};
exports.mdSeparatorsDef = {
    column: ' ',
    row: ' <br> ', /** <br> as the record delimiter */
};
/**
 * key - name of block-rule;
 * terminated - a list of rules that this rule can terminate. */
exports.terminatedRules = {
    "smilesDrawerBlock": {
        terminated: ['paragraph', 'reference', 'blockquote', 'list']
    },
    "BeginTable": {
        terminated: ["newTheoremBlock"]
    },
    "BeginAlign": {
        terminated: ["newTheoremBlock"]
    },
    "BeginTabular": {
        terminated: ["newTheoremBlock"]
    },
    "BeginProof": {
        terminated: ["newTheoremBlock"]
    },
    "BeginTheorem": {
        terminated: ["newTheoremBlock"]
    },
    "newTheoremBlock": {
        terminated: ["pageBreaksBlock"]
    },
    "ReNewCommand": {
        terminated: []
    },
    "Lists": {
        terminated: []
    },
    "separatingSpan": {
        terminated: []
    },
    "headingSection": {
        terminated: ["newTheoremBlock", "mathMLBlock"]
    },
    "addContentsLineBlock": {
        terminated: ["newTheoremBlock"]
    },
    "mathMLBlock": {
        terminated: ['newTheoremBlock']
    },
    "abstractBlock": {
        terminated: []
    },
    "pageBreaksBlock": {
        terminated: ['paragraph']
    },
    "paragraphDiv": {
        terminated: []
    }
};
exports.mathTokenTypes = ["display_math", "inline_math", "equation_math_not_number", "equation_math"];
exports.codeHighlightDef = {
    auto: false,
    code: true
};
//# sourceMappingURL=consts.js.map