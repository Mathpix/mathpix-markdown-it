import { RenderOptions } from "../../mathpix-markdown-model";

const attr_name = '[a-zA-Z_:][a-zA-Z0-9:._-]*';
const unquoted = '[^"\'=<>`\\x00-\\x20]+';
const single_quoted = "'[^']*'";
const double_quoted = '"[^"]*"';

export const attr_value = '(?:' + unquoted + '|' + single_quoted + '|' + double_quoted + ')';
export const attribute = '(?:\\s+' + attr_name + '(?:\\s*=\\s*' + attr_value + ')?)';

const open_tag_mml = '^<(math)' + attribute + '*\\s*\\/?>';
const close_tag_mml = '^<\\/math*\\s*>';
export const openTagMML = new RegExp('(?:' + open_tag_mml + ')');
export const closeTagMML = new RegExp('(?:' + close_tag_mml + ')');
export const mathMLInlineRegex: RegExp = /^<(math\b[^>]*)>[\s\S]*<\/math>/;


export const open_tag_smiles = '^<(smiles)' + attribute + '*\\s*\\/?>';

export const reOpenTagSmiles: RegExp = new RegExp('(?:' + open_tag_smiles + ')');
export const markerBeginTagSpan: RegExp = /^<\/?(span)(?=(\s|>|$))/i;
export const markerCloseTagSpan: RegExp = /<\/span\s*>/i;
export const reSpan: RegExp = /^<(span\s*(?:class="(?<className>[^>]*)")\s*([^>]*))>(.*)<\/span\>/;
export const reSpanG: RegExp = /<(span\s*(?:class="(?<className>[^>]*)")\s*([^>]*))>(.*)<\/span\>/;
export const reSeparatingSpan: RegExp = /^<(span\s*(?:class="(?<className>[^>]*)")\s*([^>]*))>(\s*)<\/span\>/;
export const reSeparatingSpanG: RegExp = /<(span\s*(?:class="(?<className>[^>]*)")\s*([^>]*))>(\s*)<\/span\>/;
const close_tag_span = '<\\/span*\\s*>';
export const closeTagSpan = new RegExp('(?:' + close_tag_span + ')');

export const labelTag: RegExp = /\\label\s{0,}\{([^}]*)\}/;
export const labelTagG: RegExp = /\\label\s{0,}\{([^}]*)\}/g;

export const openTag: RegExp = /\\begin\s{0,}\{(?<name>[^}]*)\}/;
export const openTagDescription: RegExp = /\\begin\s{0,}\{(?<name>[^}]*)\}\s{0,}\[(?<description>[^\]]*)\]/;
export const openTagProof: RegExp = /\\begin\s{0,}\{([proof\s]+)\}/;

export const reNewTheoremG: RegExp = /\\newtheorem([^}]*)\s{0,}\{(?<name>[^}]*)\}/;
export const reNewTheoremInit: RegExp = /^\\newtheorem\s{0,}\{(?<name>[^}]*)\}/;
export const reNewTheoremUnNumberedInit: RegExp = /^\\newtheorem\*\s{0,}\{(?<name>[^}]*)\}/;
export const reNewTheorem: RegExp = /^\\newtheorem\s{0,}\{(?<name>[^}]*)\}\s{0,}\{(?<print>[^}]*)\}/;
export const reNewTheoremNumbered: RegExp = /^\\newtheorem\s{0,}\{(?<name>[^}]*)\}\s{0,}\{(?<print>[^}]*)\}\s{0,}\[(?<numbered>[^\]]*)\]/;
export const reNewTheoremNumbered2: RegExp = /^\\newtheorem\s{0,}\{(?<name>[^}]*)\}\s{0,}\[(?<numbered>[^\]]*)\]\s{0,}\{(?<print>[^}]*)\}/;
export const reNewTheoremUnNumbered: RegExp = /^\\newtheorem\*\s{0,}\{(?<name>[^}]*)\}\s{0,}\{(?<print>[^}]*)\}/;
export const reTheoremStyle: RegExp = /^\\theoremstyle\s{0,}\{(definition|plain|remark)\}/;
export const reTheoremStyleG: RegExp = /\\theoremstyle\s{0,}\{(definition|plain|remark)\}/;
export const defTheoremStyle = "plain";
export const reNewCommandQedSymbol: RegExp = /^\\renewcommand\s{0,}\\qedsymbol\s{0,}\{(?<qed>[^}]*)\}/;
export const reNewCommandQedSymbolG: RegExp = /\\renewcommand\s{0,}\\qedsymbol\s{0,}\{(?<qed>[^}]*)\}/;
export const defQED = "$\\square$";
export const reSetCounter: RegExp = /^\\setcounter\s{0,}\{(?<name>[^}]*)\}\s{0,}\{(?<number>[^}]*)\}/;
export const reSetCounterG: RegExp = /\\setcounter\s{0,}\{(?<name>[^}]*)\}\s{0,}\{(?<number>[^}]*)\}/;
export const reAddContentsLine: RegExp = /^\\addcontentsline\s{0,}\{(?<exp>[^}]*)\}\s{0,}\{(?<unit>[^}]*)\}/;
export const reAddContentsLineG: RegExp = /^\\addcontentsline\s{0,}\{(?<exp>[^}]*)\}\s{0,}\{(?<unit>[^}]*)\}/;

export const reMultiRowWithVPos: RegExp = /(?:\\multirow\s{0,}\[(?<vpos>[^\]]*)\]\s{0,}\{(?<nrows>[^}]*)\}\s{0,}\{(?<width>[^}]*)\})/;
export const reMultiRow: RegExp = /(?:\\multirow\s{0,}\{(?<nrows>[^}]*)\}\s{0,}\{(?<width>[^}]*)\})/;

export const openTagTabular: RegExp = /^\\begin\s{0,}{tabular}\s{0,}\{([^}]*)\}/;
export const closeTagTabular: RegExp = /^\\end\s{0,}{tabular}/;

export const reFootNote: RegExp = /^\\footnote/;
export const reOpenTagFootnote: RegExp = /^\\footnote\s{0,}\[\s{0,}\]\s{0,}{|^\\footnote\s{0,}\[-?\d+\]\s{0,}{|^\\footnote\s{0,}{/;
export const reOpenTagFootnoteG: RegExp = /\\footnote\s{0,}\[\s{0,}\]\s{0,}{|\\footnote\s{0,}\[-?\d+\]\s{0,}{|\\footnote\s{0,}{/;
export const reOpenTagFootnoteNumbered: RegExp = /\\footnote\s{0,}\[(?<number>-?\d+)\]\s{0,}{/;
export const reOpenTagFootnotetext: RegExp = /^\\footnotetext\s{0,}\[\s{0,}\]\s{0,}{|^\\footnotetext\s{0,}\[-?\d+\]\s{0,}{|^\\footnotetext\s{0,}{|^\\blfootnotetext\s{0,}{/;
export const reOpenTagFootnotetextG: RegExp = /\\footnotetext\s{0,}\[\s{0,}\]\s{0,}{|\\footnotetext\s{0,}\[-?\d+\]\s{0,}{|\\footnotetext\s{0,}{|\\blfootnotetext\s{0,}{/;
export const reOpenTagFootnotetextNumbered: RegExp = /\\footnotetext\s{0,}\[(?<number>-?\d+)\]\s{0,}{/;
export const reFootNoteMark: RegExp = /^\\footnotemark/;
export const reFootNoteText: RegExp = /^\\footnotetext|\\blfootnotetext/;
export const reDiagboxG: RegExp = /\\(diagbox|backslashbox|slashbox)(\[[^\]]*\])?/g;
export const reDiagbox: RegExp = /\\(diagbox|backslashbox|slashbox)(?:\[(.*?)\])?/;
export const reNumber = /^-?\d+$/;
export const svgRegex: RegExp = /^<svg\b[^>]*>[\s\S]*<\/svg>$/;
export const svgInlineRegex: RegExp = /^<svg\b[^>]*>[\s\S]*<\/svg>/;
export const uuidPattern: string = '(f[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})';
export const doubleAngleBracketUuidPattern: RegExp = new RegExp(`<<(?:${uuidPattern})>>`, "g");
export const singleAngleBracketPattern: RegExp = new RegExp(`<(?:${uuidPattern})>`, "g");
export const doubleCurlyBracketUuidPattern: RegExp = new RegExp(`\\{\\{(?:${uuidPattern})\\}\\}`, "g");
export const singleCurlyBracketPattern: RegExp = new RegExp(`\\{(?:${uuidPattern})\\}`, "g");

export const RE_TAG_WITH_HLINE: RegExp = /\[(.*?)\]\s{0,}\\hline/;
export const RE_TAG_WITH_HHLINE: RegExp = /\[(.*?)\]\s{0,}\\hhline/;
export const RE_TAG_WITH_HDASHLINE: RegExp = /\[(.*?)\]\s{0,}\\hdashline/;
export const RE_TAG_WITH_CLINE: RegExp = /\[(.*?)\]\s{0,}\\cline\s{0,}\{([^}]*)\}/;
export const RE_HLINE: RegExp = /\\hline/;
export const RE_HHLINE: RegExp = /\\hhline/;
export const RE_HDASHLINE: RegExp = /\\hdashline/;
export const RE_CLINE: RegExp = /\\cline\s{0,}\{([^}]*)\}/;
export const RE_DIMENSIONAL_UNIT_TAG: RegExp = /\[(\d+(?:\.\d+)?(?:ex|pt|em|px|cm|mm|in))\]?/;
export const lineSpaceTag: RegExp = new RegExp(
  [
    RE_TAG_WITH_HLINE.source,
    RE_TAG_WITH_HHLINE.source,
    RE_TAG_WITH_HDASHLINE.source,
    RE_TAG_WITH_CLINE.source,
    RE_HLINE.source,
    RE_HHLINE.source,
    RE_HDASHLINE.source,
    RE_CLINE.source,
    RE_DIMENSIONAL_UNIT_TAG.source
  ].join("|"),
  "g"
);
export const RE_CAPTION_SETUP_TAG_BEGIN: RegExp = /\\captionsetup\s{0,}\{/;
export const RE_CAPTION_SETUP: RegExp = /^\\captionsetup\s{0,}\{([^}]*)\}/;
export const RE_BEGIN_ALIGN_ENV: RegExp = /\\begin\s{0,}\{(center|left|right)\}/;
export const RE_ALIGN_ENV_BLOCK: RegExp = /\\begin\s{0,}\{(center|left|right)\}\s{0,}([\s\S]*?)\s{0,}\\end\s{0,}\{(center|left|right)\}/;
export const RE_BEGIN_FIGURE_OR_TABLE_ENV: RegExp = /\\begin\s{0,}\{(table|figure)\}/;
export const RE_BEGIN_TABLE_OR_FIGURE_WITH_PLACEMENT: RegExp = /\\begin\s{0,}\{(table|figure)\}\s{0,}\[(H|\!H|H\!|h|\!h|h\!|t|\!t|b|\!b|p|\!p)\]/;
export const RE_CAPTION_TAG: RegExp = /\\caption\s{0,}\{([^}]*)\}/;
export const RE_CAPTION_TAG_GLOBAL: RegExp = /\s{0,}\\caption\s{0,}\{([^}]*)\}\s{0,}/g;
export const RE_CAPTION_TAG_BEGIN: RegExp = /\\caption\s{0,}\{/;
export const RE_ALIGN_CENTERING_GLOBAL: RegExp = /\\centering/g;
export const RE_INCLUDEGRAPHICS_WITH_ALIGNMENT_GLOBAL: RegExp = /\\includegraphics\[((.*)(center|left|right))\]\s{0,}\{([^{}]*)\}/g;

export const HIGHLIGHT_COLOR = 'rgba(0, 147, 255, 0.25)';
export const HIGHLIGHT_TEXT_COLOR = '#1e2029';
export const TEXTWIDTH_RE = /^\s*(\d*\.?\d+)?\s*\\(?:textwidth|linewidth)\b/;
// Matches unescaped `$$` delimiters (e.g. "$$...$$"), not inside backticks.
// Group 1 ensures the $$ is either at the start or not preceded by a backslash.
export const SIMPLE_MATH_DELIM_RE: RegExp = /(^|[^\\])\$\$(?!\$)/g;
export const latexEnvironments = [
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
export const mathEnvironments = [
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

export const tsvSeparatorsDef = {
  column: '\t', /** TAB as the field delimiter */
  row: '\n' /** newline as the record delimiter */
};

export const csvSeparatorsDef = {
  column: ',', /** comma as the field delimiter */
  row: '\n', /** newline as the record delimiter */
  toQuoteAllFields: false /** to quote all fields whether or not they contain delimiters */
};

export const mdSeparatorsDef = {
  column: ' ', /** space as the field delimiter */
  row: ' <br> ', /** <br> as the record delimiter */
};

/** 
 * key - name of block-rule;
 * terminated - a list of rules that this rule can terminate. */
export const terminatedRules = {
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
    terminated: [ 'paragraph', 'reference', 'blockquote', 'list' ]
  }
};


export const mathTokenTypes = ["display_math", "inline_math", "equation_math_not_number", "equation_math"];

export const codeHighlightDef = {
  auto: false,
  code: true
};

export const renderOptionsDef: RenderOptions = {
  enable_markdown: true,
  enable_latex: true,
  enable_markdown_mmd_extensions: true
}

export const OPENING_STYLE_TOKENS  = [
  "strong_open", "em_open", "s_open", "mark_open", "underline_open", "out_open", "text_latex_open",
  "textbf_open", "texttt_open", "textit_open"
];

export const CLOSING_STYLE_TOKENS = [
  "strong_close", "em_close", "s_close", "mark_close", "underline_close", "out_close", "text_latex_close",
  "textbf_close", "texttt_close", "textit_close"
];

export const INLINE_ELEMENT_TOKENS = [
  "text", "inline_math", "inline_mathML", "code_inline", "smiles_inline", "link_open", "label", "dotfill",
  "textbf", "texttt", "textit", "text_latex", "url"
];
