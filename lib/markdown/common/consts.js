"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reDiagboxG = exports.reFootNoteText = exports.reFootNoteMark = exports.reOpenTagFootnotetextNumbered = exports.reOpenTagFootnotetextG = exports.reOpenTagFootnotetext = exports.reOpenTagFootnoteNumbered = exports.reOpenTagFootnoteG = exports.reOpenTagFootnote = exports.reFootNote = exports.closeTagTabular = exports.openTagTabular = exports.reMultiRow = exports.reMultiRowWithVPos = exports.reAddContentsLineG = exports.reAddContentsLine = exports.reSetCounterG = exports.reSetCounter = exports.defQED = exports.reNewCommandQedSymbolG = exports.reNewCommandQedSymbol = exports.defTheoremStyle = exports.reTheoremStyleG = exports.reTheoremStyle = exports.reNewTheoremUnNumbered = exports.reNewTheoremNumbered2 = exports.reNewTheoremNumbered = exports.reNewTheorem = exports.reNewTheoremUnNumberedInit = exports.reNewTheoremInit = exports.reNewTheoremG = exports.openTagProof = exports.openTagDescription = exports.openTag = exports.labelTagG = exports.labelTag = exports.closeTagSpan = exports.reSeparatingSpanG = exports.reSeparatingSpan = exports.reSpanG = exports.reSpan = exports.markerCloseTagSpan = exports.markerBeginTagSpan = exports.reOpenTagSmiles = exports.open_tag_smiles = exports.mathMLInlineRegex = exports.closeTagMML = exports.openTagMML = exports.attribute = exports.attr_value = void 0;
exports.LATEX_ENUM_STYLE_RE = exports.LATEX_BLOCK_ENV_OPEN_RE = exports.LATEX_LIST_BOUNDARY_INLINE_RE = exports.LATEX_ITEM_COMMAND_INLINE_RE = exports.LATEX_ITEM_COMMAND_RE = exports.END_LIST_ENV_RE = exports.END_LIST_ENV_INLINE_RE = exports.BEGIN_LIST_ENV_INLINE_RE = exports.BEGIN_LIST_ENV_RE = exports.BEGIN_LST_WITH_TRAIL_WS_NL_RE = exports.END_TABULAR_INLINE_RE = exports.END_LST_INLINE_RE = exports.BEGIN_TABULAR_INLINE_RE = exports.BEGIN_LST_INLINE_RE = exports.BEGIN_LST_RE = exports.END_LST_RE = exports.BEGIN_LST_FAST_RE = exports.LATEX_BLOCK_ENV = exports.RE_INCLUDEGRAPHICS_WITH_ALIGNMENT_GLOBAL = exports.RE_ALIGN_CENTERING_GLOBAL = exports.RE_CAPTION_TAG_BEGIN = exports.RE_CAPTION_TAG_GLOBAL = exports.RE_CAPTION_TAG = exports.RE_BEGIN_TABLE_OR_FIGURE_WITH_PLACEMENT = exports.RE_BEGIN_FIGURE_OR_TABLE_ENV = exports.RE_ALIGN_ENV_BLOCK = exports.RE_BEGIN_ALIGN_ENV = exports.RE_CAPTION_SETUP = exports.RE_CAPTION_SETUP_TAG_BEGIN = exports.lineSpaceTag = exports.RE_DIMENSIONAL_UNIT_TAG = exports.RE_CLINE = exports.RE_HDASHLINE = exports.RE_HHLINE = exports.RE_HLINE = exports.RE_TAG_WITH_CLINE = exports.RE_TAG_WITH_HDASHLINE = exports.RE_TAG_WITH_HHLINE = exports.RE_TAG_WITH_HLINE = exports.preserveNewlineUnlessDoubleAngleUuidRegex = exports.singleCurlyBracketPattern = exports.doubleCurlyBracketUuidPattern = exports.singleAngleBracketPattern = exports.doubleAngleBracketUuidPattern = exports.uuidPatternNoCapture = exports.uuidPattern = exports.svgInlineRegex = exports.svgRegex = exports.reNumber = exports.reDiagbox = void 0;
exports.INLINE_ELEMENT_TOKENS = exports.CLOSING_STYLE_TOKENS = exports.OPENING_STYLE_TOKENS = exports.renderOptionsDef = exports.codeHighlightDef = exports.mathTokenTypes = exports.terminatedRules = exports.mdSeparatorsDef = exports.csvSeparatorsDef = exports.tsvSeparatorsDef = exports.mathEnvironments = exports.latexEnvironments = exports.RE_EMPTY_TEXT = exports.SIMPLE_MATH_DELIM_RE = exports.TEXTWIDTH_RE = exports.HIGHLIGHT_TEXT_COLOR = exports.HIGHLIGHT_COLOR = exports.LST_HLJS_LANGUAGES = exports.ENUM_STYLES = exports.ITEM_LEVEL_COMMANDS = exports.ENUM_LEVEL_COMMANDS = exports.LATEX_ENUM_STYLE_KEY_RE = void 0;
var tslib_1 = require("tslib");
var attr_name = '[a-zA-Z_:][a-zA-Z0-9:._-]*';
var unquoted = '[^"\'=<>`\\x00-\\x20]+';
var single_quoted = "'[^']*'";
var double_quoted = '"[^"]*"';
exports.attr_value = '(?:' + unquoted + '|' + single_quoted + '|' + double_quoted + ')';
exports.attribute = '(?:\\s+' + attr_name + '(?:\\s*=\\s*' + exports.attr_value + ')?)';
var open_tag_mml = '^<(math)' + exports.attribute + '*\\s*\\/?>';
var close_tag_mml = '^<\\/math*\\s*>';
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
exports.uuidPatternNoCapture = 'f[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}';
exports.doubleAngleBracketUuidPattern = new RegExp("<<(?:".concat(exports.uuidPattern, ")>>"), "g");
exports.singleAngleBracketPattern = new RegExp("<(?:".concat(exports.uuidPattern, ")>"), "g");
exports.doubleCurlyBracketUuidPattern = new RegExp("\\{\\{(?:".concat(exports.uuidPattern, ")\\}\\}"), "g");
exports.singleCurlyBracketPattern = new RegExp("\\{(?:".concat(exports.uuidPattern, ")\\}"), "g");
exports.preserveNewlineUnlessDoubleAngleUuidRegex = new RegExp(String.raw(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\r?\n(?!s*<<(?:", ")>>)"], ["\\r?\\n(?!\\s*<<(?:", ")>>)"])), exports.uuidPatternNoCapture), "g");
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
exports.LATEX_BLOCK_ENV = new Set(['lstlisting', 'itemize', 'enumerate']);
exports.BEGIN_LST_FAST_RE = /^\\begin\{lstlisting\}/;
exports.END_LST_RE = /^\\end\{lstlisting\}\s*$/;
exports.BEGIN_LST_RE = /^\\begin\{lstlisting\}(?:\[(.*?)\])?\s*$/;
exports.BEGIN_LST_INLINE_RE = /\\begin\{lstlisting\}(?:\[(.*?)\])?/;
exports.BEGIN_TABULAR_INLINE_RE = /\\begin\s{0,}{tabular}\s{0,}\{([^}]*)\}/;
exports.END_LST_INLINE_RE = /\\end\{lstlisting\}/;
exports.END_TABULAR_INLINE_RE = /\\end\{tabular\}/;
/** Horizontal spaces (no CR/LF) + at most one newline (CRLF or LF), optional */
var HSPACE_PLUS_ONE_NL_OPT = String.raw(templateObject_2 || (templateObject_2 = tslib_1.__makeTemplateObject(["(?:[^S\r\n]*\r?\n)?"], ["(?:[^\\S\\r\\n]*\\r?\\n)?"])));
/** Full begin line: \begin{lstlisting}[...]( +hspace +≤1 NL ) */
exports.BEGIN_LST_WITH_TRAIL_WS_NL_RE = new RegExp(String.raw(templateObject_3 || (templateObject_3 = tslib_1.__makeTemplateObject(["^\\begin{lstlisting}(?:[(.*?)])?"], ["^\\\\begin\\{lstlisting\\}(?:\\[(.*?)\\])?"]))) + HSPACE_PLUS_ONE_NL_OPT);
/** Matches \begin{itemize} or \begin{enumerate} */
exports.BEGIN_LIST_ENV_RE = /^\\begin\s*\{(itemize|enumerate)\}/;
exports.BEGIN_LIST_ENV_INLINE_RE = /\\begin\s*\{(itemize|enumerate)\}/;
/** Matches \end{itemize} or \end{enumerate} */
exports.END_LIST_ENV_INLINE_RE = /\\end\s*\{(itemize|enumerate)\}/;
exports.END_LIST_ENV_RE = /^\\end\s*\{(itemize|enumerate)\}/;
/** Matches \item or \item[optional] */
exports.LATEX_ITEM_COMMAND_RE = /^(?:\\item\s*\[([^\]]*)\]|\\item)/;
exports.LATEX_ITEM_COMMAND_INLINE_RE = /(?:item\s*\[([^\]]*)\]|item)/;
exports.LATEX_LIST_BOUNDARY_INLINE_RE = /\\begin\s*\{(itemize|enumerate)\}|\\end\s*\{(itemize|enumerate)\}|\\item/;
/** Matches \begin{center}, \begin{left}, \begin{right}, \begin{table}, \begin{figure}, \begin{tabular}, \begin{lstlisting} */
exports.LATEX_BLOCK_ENV_OPEN_RE = /\\begin{(center|left|right|table|figure|tabular|lstlisting)}/;
/**
 * Enumerate environment detection: \alph, \roman, \arabic, etc.
 */
exports.LATEX_ENUM_STYLE_RE = /(?:\\alph|\\Alph|\\arabic|\\roman|\\Roman)\s*\{(enumi|enumii|enumiii|enumiv)\}/;
/**
 * Extracts enumeration style keyword: alph, Roman, arabic...
 */
exports.LATEX_ENUM_STYLE_KEY_RE = /^(?:alph|Alph|arabic|roman|Roman)/;
/** List of LaTeX enumerate level command names */
exports.ENUM_LEVEL_COMMANDS = [
    "labelenumi",
    "labelenumii",
    "labelenumiii",
    "labelenumiv",
];
/** List of LaTeX itemize level command names */
exports.ITEM_LEVEL_COMMANDS = [
    "labelitemi",
    "labelitemii",
    "labelitemiii",
    "labelitemiv",
];
/**
 * Mapping LaTeX enumeration style → CSS list-style-type
 */
exports.ENUM_STYLES = {
    alph: "lower-alpha",
    Alph: "upper-alpha",
    arabic: "decimal",
    roman: "lower-roman",
    Roman: "upper-roman",
};
exports.LST_HLJS_LANGUAGES = {
    'c++': 'cpp',
    assembler: 'x86asm',
    caml: 'ocaml',
    csh: 'shell',
    inform: 'inform7',
    ksh: 'shell',
    sh: 'shell',
};
exports.HIGHLIGHT_COLOR = 'rgba(0, 147, 255, 0.25)';
exports.HIGHLIGHT_TEXT_COLOR = '#1e2029';
exports.TEXTWIDTH_RE = /^\s*(\d*\.?\d+)?\s*\\(?:textwidth|linewidth)\b/;
// Matches unescaped `$$` delimiters (e.g. "$$...$$"), not inside backticks.
// Group 1 ensures the $$ is either at the start or not preceded by a backslash.
exports.SIMPLE_MATH_DELIM_RE = /(^|[^\\])\$\$(?!\$)/g;
exports.RE_EMPTY_TEXT = /^[\s\u00a0]*$/;
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
    "abstract",
    // Code
    "lstlisting"
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
        terminated: ['paragraph']
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
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=consts.js.map