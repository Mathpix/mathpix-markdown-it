const attr_name = '[a-zA-Z_:][a-zA-Z0-9:._-]*';
const unquoted = '[^"\'=<>`\\x00-\\x20]+';
const single_quoted = "'[^']*'";
const double_quoted = '"[^"]*"';

export const attr_value = '(?:' + unquoted + '|' + single_quoted + '|' + double_quoted + ')';
export const attribute = '(?:\\s+' + attr_name + '(?:\\s*=\\s*' + attr_value + ')?)';

const open_tag_mml = '<(math)' + attribute + '*\\s*\\/?>';
const close_tag_mml = '<\\/math*\\s*>';

export const openTagMML = new RegExp('(?:' + open_tag_mml + ')');
export const closeTagMML = new RegExp('(?:' + close_tag_mml + ')');

export const open_tag_smiles = '^<(smiles)' + attribute + '*\\s*\\/?>';

export const reOpenTagSmiles: RegExp = new RegExp('(?:' + open_tag_smiles + ')');

export const reSpan: RegExp = /^<(span\s*(?:class="([^>]*)")\s*([^>]*))>(.*)<\/span\>/;
const close_tag_span = '<\\/span*\\s*>';
export const closeTagSpan = new RegExp('(?:' + close_tag_span + ')');

export const labelTag: RegExp = /\\label\s{0,}\{([^}]*)\}/;
export const labelTagG: RegExp = /\\label\s{0,}\{([^}]*)\}/g;

export const openTag: RegExp = /\\begin\s{0,}\{(?<name>[\w\s]+)\}/;
export const openTagDescription: RegExp = /\\begin\s{0,}\{(?<name>[\w\s]+)\}\s{0,}\[(?<description>[\w\s]+)\]/;
export const openTagProof: RegExp = /\\begin\s{0,}\{([proof\s]+)\}/;

export const reNewTheorem: RegExp = /^\\newtheorem\s{0,}\{(?<name>[\w\s]+)\}\s{0,}\{(?<print>[\w\s]+)\}/;
export const reNewTheoremNumbered: RegExp = /^\\newtheorem\s{0,}\{(?<name>[\w\s]+)\}\s{0,}\{(?<print>[\w\s]+)\}\s{0,}\[(?<numbered>[\w\s]+)\]/;
export const reNewTheoremNumbered2: RegExp = /^\\newtheorem\s{0,}\{(?<name>[\w\s]+)\}\s{0,}\[(?<numbered>[\w\s]+)\]\s{0,}\{(?<print>[\w\s]+)\}/;
export const reNewTheoremUnNumbered: RegExp = /^\\newtheorem\*\s{0,}\{(?<name>[\w\s]+)\}\s{0,}\{(?<print>[\w\s]+)\}/;
export const reTheoremStyle: RegExp = /\\theoremstyle\s{0,}\{(definition|plain|remark)\}/;
export const defTheoremStyle = "plain";
export const reNewCommandQedSymbol: RegExp = /^\\renewcommand\s{0,}\\qedsymbol\s{0,}\{(?<qed>[^}]*)\}/;
export const reNewCommandQedSymbolG: RegExp = /\\renewcommand\s{0,}\\qedsymbol\s{0,}\{(?<qed>[^}]*)\}/;
export const defQED = "$\\square$";


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
