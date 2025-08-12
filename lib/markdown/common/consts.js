"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reDiagboxG = exports.reFootNoteText = exports.reFootNoteMark = exports.reOpenTagFootnotetextNumbered = exports.reOpenTagFootnotetextG = exports.reOpenTagFootnotetext = exports.reOpenTagFootnoteNumbered = exports.reOpenTagFootnoteG = exports.reOpenTagFootnote = exports.reFootNote = exports.closeTagTabular = exports.openTagTabular = exports.reMultiRow = exports.reMultiRowWithVPos = exports.reAddContentsLineG = exports.reAddContentsLine = exports.reSetCounterG = exports.reSetCounter = exports.defQED = exports.reNewCommandQedSymbolG = exports.reNewCommandQedSymbol = exports.defTheoremStyle = exports.reTheoremStyleG = exports.reTheoremStyle = exports.reNewTheoremUnNumbered = exports.reNewTheoremNumbered2 = exports.reNewTheoremNumbered = exports.reNewTheorem = exports.reNewTheoremUnNumberedInit = exports.reNewTheoremInit = exports.reNewTheoremG = exports.openTagProof = exports.openTagDescription = exports.openTag = exports.labelTagG = exports.labelTag = exports.closeTagSpan = exports.reSeparatingSpanG = exports.reSeparatingSpan = exports.reSpanG = exports.reSpan = exports.markerCloseTagSpan = exports.markerBeginTagSpan = exports.reOpenTagSmiles = exports.open_tag_smiles = exports.mathMLInlineRegex = exports.closeTagMML = exports.openTagMML = exports.attribute = exports.attr_value = void 0;
exports.INLINE_ELEMENT_TOKENS = exports.CLOSING_STYLE_TOKENS = exports.OPENING_STYLE_TOKENS = exports.renderOptionsDef = exports.codeHighlightDef = exports.mathTokenTypes = exports.terminatedRules = exports.mdSeparatorsDef = exports.csvSeparatorsDef = exports.tsvSeparatorsDef = exports.mathEnvironments = exports.latexEnvironments = exports.HIGHLIGHT_TEXT_COLOR = exports.HIGHLIGHT_COLOR = exports.RE_INCLUDEGRAPHICS_WITH_ALIGNMENT_GLOBAL = exports.RE_ALIGN_CENTERING_GLOBAL = exports.RE_CAPTION_TAG_BEGIN = exports.RE_CAPTION_TAG_GLOBAL = exports.RE_CAPTION_TAG = exports.RE_BEGIN_TABLE_OR_FIGURE_WITH_PLACEMENT = exports.RE_BEGIN_FIGURE_OR_TABLE_ENV = exports.RE_ALIGN_ENV_BLOCK = exports.RE_BEGIN_ALIGN_ENV = exports.RE_CAPTION_SETUP = exports.RE_CAPTION_SETUP_TAG_BEGIN = exports.lineSpaceTag = exports.RE_DIMENSIONAL_UNIT_TAG = exports.RE_CLINE = exports.RE_HDASHLINE = exports.RE_HHLINE = exports.RE_HLINE = exports.RE_TAG_WITH_CLINE = exports.RE_TAG_WITH_HDASHLINE = exports.RE_TAG_WITH_HHLINE = exports.RE_TAG_WITH_HLINE = exports.singleCurlyBracketPattern = exports.doubleCurlyBracketUuidPattern = exports.singleAngleBracketPattern = exports.doubleAngleBracketUuidPattern = exports.uuidPattern = exports.svgInlineRegex = exports.svgRegex = exports.reNumber = exports.reDiagbox = void 0;
var attr_name = '[a-zA-Z_:][a-zA-Z0-9:._-]*';
var unquoted = '[^"\'=<>`\\x00-\\x20]+';
var single_quoted = "'[^']*'";
var double_quoted = '"[^"]*"';
exports.attr_value = '(?:' + unquoted + '|' + single_quoted + '|' + double_quoted + ')';
exports.attribute = '(?:\\s+' + attr_name + '(?:\\s*=\\s*' + exports.attr_value + ')?)';
var open_tag_mml = '^<(math)' + exports.attribute + '*\\s*\\/?>';
var close_tag_mml = '<\\/math\\s*>';
exports.openTagMML = new RegExp('(?:' + open_tag_mml + ')');
exports.closeTagMML = new RegExp('(?:' + close_tag_mml + ')');
exports.mathMLInlineRegex = /^<(math\b[^>]*)>[\s\S]*<\/math>/;
exports.open_tag_smiles = '^<(smiles)' + exports.attribute + '*\\s*\\/?>';
exports.reOpenTagSmiles = new RegExp('(?:' + exports.open_tag_smiles + ')');
exports.markerBeginTagSpan = /^<\/?(span)(?=(\s|>|$))/i;
exports.markerCloseTagSpan = /<\/span\s*>/i;
exports.reSpan = /^<(span\s*(?:class="(?<className>[^>]*)")\s*([^>]*))>(.*)<\/span\>/;
exports.reSpanG = /<(span\s*(?:class="(?<className>[^>]*)")\s*([^>]*))>(.*)<\/span\>/;
exports.reSeparatingSpan = /^<(span\s*(?:class="(?<className>[^>]*)")\s*([^>]*))>(\s*)<\/span\>/;
exports.reSeparatingSpanG = /<(span\s*(?:class="(?<className>[^>]*)")\s*([^>]*))>(\s*)<\/span\>/;
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
exports.reOpenTagFootnote = /^\\footnote\s{0,}\[\s{0,}\]\s{0,}{|^\\footnote\s{0,}\[-?\d+\]\s{0,}{|^\\footnote\s{0,}{/;
exports.reOpenTagFootnoteG = /\\footnote\s{0,}\[\s{0,}\]\s{0,}{|\\footnote\s{0,}\[-?\d+\]\s{0,}{|\\footnote\s{0,}{/;
exports.reOpenTagFootnoteNumbered = /\\footnote\s{0,}\[(?<number>-?\d+)\]\s{0,}{/;
exports.reOpenTagFootnotetext = /^\\footnotetext\s{0,}\[\s{0,}\]\s{0,}{|^\\footnotetext\s{0,}\[-?\d+\]\s{0,}{|^\\footnotetext\s{0,}{|^\\blfootnotetext\s{0,}{/;
exports.reOpenTagFootnotetextG = /\\footnotetext\s{0,}\[\s{0,}\]\s{0,}{|\\footnotetext\s{0,}\[-?\d+\]\s{0,}{|\\footnotetext\s{0,}{|\\blfootnotetext\s{0,}{/;
exports.reOpenTagFootnotetextNumbered = /\\footnotetext\s{0,}\[(?<number>-?\d+)\]\s{0,}{/;
exports.reFootNoteMark = /^\\footnotemark/;
exports.reFootNoteText = /^\\footnotetext|\\blfootnotetext/;
exports.reDiagboxG = /\\(diagbox|backslashbox|slashbox)(\[[^\]]*\])?/g;
exports.reDiagbox = /\\(diagbox|backslashbox|slashbox)(?:\[(.*?)\])?/;
exports.reNumber = /^-?\d+$/;
exports.svgRegex = /^<svg\b[^>]*>[\s\S]*<\/svg>$/;
exports.svgInlineRegex = /^<svg\b[^>]*>[\s\S]*<\/svg>/;
exports.uuidPattern = '(f[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})';
exports.doubleAngleBracketUuidPattern = new RegExp("<<(?:".concat(exports.uuidPattern, ")>>"), "g");
exports.singleAngleBracketPattern = new RegExp("<(?:".concat(exports.uuidPattern, ")>"), "g");
exports.doubleCurlyBracketUuidPattern = new RegExp("\\{\\{(?:".concat(exports.uuidPattern, ")\\}\\}"), "g");
exports.singleCurlyBracketPattern = new RegExp("\\{(?:".concat(exports.uuidPattern, ")\\}"), "g");
exports.RE_TAG_WITH_HLINE = /\[(.*?)\]\s{0,}\\hline/;
exports.RE_TAG_WITH_HHLINE = /\[(.*?)\]\s{0,}\\hhline/;
exports.RE_TAG_WITH_HDASHLINE = /\[(.*?)\]\s{0,}\\hdashline/;
exports.RE_TAG_WITH_CLINE = /\[(.*?)\]\s{0,}\\cline\s{0,}\{([^}]*)\}/;
exports.RE_HLINE = /\\hline/;
exports.RE_HHLINE = /\\hhline/;
exports.RE_HDASHLINE = /\\hdashline/;
exports.RE_CLINE = /\\cline\s{0,}\{([^}]*)\}/;
exports.RE_DIMENSIONAL_UNIT_TAG = /\[(\d+(?:\.\d+)?(?:ex|pt|em|px|cm|mm|in))\]?/;
exports.lineSpaceTag = new RegExp([
    exports.RE_TAG_WITH_HLINE.source,
    exports.RE_TAG_WITH_HHLINE.source,
    exports.RE_TAG_WITH_HDASHLINE.source,
    exports.RE_TAG_WITH_CLINE.source,
    exports.RE_HLINE.source,
    exports.RE_HHLINE.source,
    exports.RE_HDASHLINE.source,
    exports.RE_CLINE.source,
    exports.RE_DIMENSIONAL_UNIT_TAG.source
].join("|"), "g");
exports.RE_CAPTION_SETUP_TAG_BEGIN = /\\captionsetup\s{0,}\{/;
exports.RE_CAPTION_SETUP = /^\\captionsetup\s{0,}\{([^}]*)\}/;
exports.RE_BEGIN_ALIGN_ENV = /\\begin\s{0,}\{(center|left|right)\}/;
exports.RE_ALIGN_ENV_BLOCK = /\\begin\s{0,}\{(center|left|right)\}\s{0,}([\s\S]*?)\s{0,}\\end\s{0,}\{(center|left|right)\}/;
exports.RE_BEGIN_FIGURE_OR_TABLE_ENV = /\\begin\s{0,}\{(table|figure)\}/;
exports.RE_BEGIN_TABLE_OR_FIGURE_WITH_PLACEMENT = /\\begin\s{0,}\{(table|figure)\}\s{0,}\[(H|\!H|H\!|h|\!h|h\!|t|\!t|b|\!b|p|\!p)\]/;
exports.RE_CAPTION_TAG = /\\caption\s{0,}\{([^}]*)\}/;
exports.RE_CAPTION_TAG_GLOBAL = /\s{0,}\\caption\s{0,}\{([^}]*)\}\s{0,}/g;
exports.RE_CAPTION_TAG_BEGIN = /\\caption\s{0,}\{/;
exports.RE_ALIGN_CENTERING_GLOBAL = /\\centering/g;
exports.RE_INCLUDEGRAPHICS_WITH_ALIGNMENT_GLOBAL = /\\includegraphics\[((.*)(center|left|right))\]\s{0,}\{([^{}]*)\}/g;
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
    "numcases",
    "subnumcases",
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
        terminated: ['paragraph', "newTheoremBlock"]
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
        terminated: ['paragraph', 'newTheoremBlock']
    },
    "abstractBlock": {
        terminated: ['paragraph']
    },
    "pageBreaksBlock": {
        terminated: ['paragraph']
    },
    "paragraphDiv": {
        terminated: []
    },
    "svg_block": {
        terminated: ['paragraph']
    },
    "image_with_size_block": {
        terminated: ['paragraph']
    },
    "fence": {
        terminated: ['paragraph', 'reference', 'blockquote', 'list']
    }
};
exports.mathTokenTypes = ["display_math", "inline_math", "equation_math_not_number", "equation_math"];
exports.codeHighlightDef = {
    auto: false,
    code: true
};
exports.renderOptionsDef = {
    enable_markdown: true,
    enable_latex: true,
    enable_markdown_mmd_extensions: true
};
exports.OPENING_STYLE_TOKENS = [
    "strong_open", "em_open", "s_open", "mark_open", "underline_open", "out_open", "text_latex_open",
    "textbf_open", "texttt_open", "textit_open"
];
exports.CLOSING_STYLE_TOKENS = [
    "strong_close", "em_close", "s_close", "mark_close", "underline_close", "out_close", "text_latex_close",
    "textbf_close", "texttt_close", "textit_close"
];
exports.INLINE_ELEMENT_TOKENS = [
    "text", "inline_math", "inline_mathML", "code_inline", "smiles_inline", "link_open", "label", "dotfill",
    "textbf", "texttt", "textit", "text_latex", "url"
];
//# sourceMappingURL=consts.js.map