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

export const tsvSeparatorsDef = {
  column: '\t', 
  row: '\n'
};
