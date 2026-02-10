import { MathJax } from "../../mathjax/";
import { getWidthFromDocument } from "../utils";
import { addIntoLabelsList, eLabelType } from "./labels";
import { envArraysShouldBeFlattenInTSV } from '../../helpers/consts';
import { formatMathJaxError } from "../../helpers/utils";
import { csvSeparatorsDef, mdSeparatorsDef, tsvSeparatorsDef } from './consts';
import { formatSource } from "../../helpers/parse-mmd-element";

type TypesetResult = {
  /** Rendered HTML string for this math token (SVG/MathML/LaTeX depending on output_format). */
  html?: string;
  /** MathJax metrics/extra data (widthEx/heightEx/etc). */
  data?: any;
  ascii?: string;
  linear?: string;
  ascii_tsv?: string;
  ascii_csv?: string;
  ascii_md?: string;
  labels?: Record<string, any>;
};

/**
 * Returns true when token already contains MathML input (display or inline).
 * These tokens use a separate MathJax path: TypesetMathML().
 */
const isMathMLToken = (token: any) =>
  token.type === 'display_mathML' || token.type === 'inline_mathML';

/**
 * Applies the typesetting output to the markdown-it token.
 * Mutates the token in-place.
 */
const applyTypesetResultToToken = (token: any, res: TypesetResult): void => {
  if (res.html != null) token.mathEquation = res.html;
  if (res.data != null) {
    token.mathData = res.data;
    token.widthEx = res.data.widthEx;
    token.heightEx = res.data.heightEx;
  }
  // Optional fields (present only when requested via outMath options)
  if (res.ascii != null) token.ascii = res.ascii;
  if (res.linear != null) token.linear = res.linear;
  if (res.ascii_tsv != null) token.ascii_tsv = res.ascii_tsv;
  if (res.ascii_csv != null) token.ascii_csv = res.ascii_csv;
  if (res.ascii_md != null) token.ascii_md = res.ascii_md;
  if (res.labels != null) token.labels = res.labels;
}

/**
 * Builds outMath options for AsciiMath/TSV/CSV/Markdown extraction.
 * Note: "tableTo*" options are enabled only for specific environments.
 */
const buildAsciiOutMath = (outMath: any, token: any) => {
  const shouldFlatten: boolean = envArraysShouldBeFlattenInTSV.includes(token.math_env);
  return Object.assign({}, outMath, {
    optionAscii: {
      showStyle: false,
      extraBrackets: true,
      // We flatten arrays only for specific environments; otherwise output is noisy/unusable.
      tableToTsv: outMath?.include_tsv && shouldFlatten,
      tableToCsv: outMath?.include_csv && shouldFlatten,
      tableToMd: outMath?.include_table_markdown && shouldFlatten,
      isSubTable: token.isSubTable,
      // keep these defaults centralized in ./consts
      tsv_separators: { ...tsvSeparatorsDef },
      csv_separators: { ...csvSeparatorsDef },
      md_separators: { ...mdSeparatorsDef },
    },
  });
}

/**
 * Returns { html, data } for the requested output_format.
 * - output_format === 'latex': return original latex string (not MathJax HTML)
 * - output_format === 'mathml': we typically don't need extra SVG metrics
 * - default: return MathJax HTML + data (metrics)
 */
const buildFormatOutputs = (params: {
  outputFormat?: string;
  inputLatex?: string;
  renderedHtml: string;
  renderedData: any;
}): Pick<TypesetResult, "html" | "data"> => {
  const { outputFormat, inputLatex, renderedHtml, renderedData } = params;
  const html: string = outputFormat === 'latex'
    ? formatSource(inputLatex ?? '')
    : renderedHtml;
  const data = (outputFormat === 'latex' || outputFormat === 'mathml')
    ? null
    : renderedData;
  return { html, data };
}

/**
 * Typesets a single token according to its type and options:
 * - MathML tokens -> TypesetMathML()
 * - tokens requesting Ascii extraction -> TypesetSvgAndAscii()
 * - default -> Typeset()
 */
const typesetMathForToken = (params: {
  token: any;
  math: string;
  isBlock: boolean;
  beginNumber: number;
  containerWidth: number;
  options: any;
}): TypesetResult => {
  const { token, math, isBlock, beginNumber, containerWidth, options } = params;
  const outputFormat = options.outMath?.output_format;
  // 1) MathML tokens: MathJax input is MathML (not TeX).
  // Format routing is handled inside TypesetMathML:
  // - 'mathml': returns formatSourceMML(mathml) directly.
  // - 'latex': no MathML→LaTeX converter; falls back to SVG.
  // - 'svg' (default): standard SVG rendering.
  if (isMathMLToken(token)) {
    const typeset = MathJax.TypesetMathML(math, {
      display: true,
      metric: { cwidth: containerWidth },
      outMath: options.outMath,
      accessibility: options.accessibility,
      renderingErrors: options.renderingErrors,
    });
    return {
      html: typeset.html,
      // For mathml output, SVG metrics are irrelevant — null out data.
      data: outputFormat === 'mathml' ? null : typeset.data,
    };
  }
  MathJax.Reset(beginNumber); // Reset is important for equation numbering stability across tokens.
  // 2) AsciiMath extraction requested
  if (token.return_asciimath) {
    const typeset = MathJax.TypesetSvgAndAscii(math, {
      display: isBlock,
      metric: { cwidth: containerWidth },
      outMath: buildAsciiOutMath(options.outMath, token),
      mathJax: options.mathJax,
      accessibility: options.accessibility,
      renderingErrors: options.renderingErrors,
    });
    const fmt: Pick<TypesetResult, "html" | "data"> = buildFormatOutputs({
      outputFormat,
      inputLatex: token.inputLatex,
      renderedHtml: typeset.html,
      renderedData: typeset.data,
    });
    return {
      ...fmt,
      ascii: typeset.ascii,
      linear: typeset.linear,
      ascii_tsv: typeset.ascii_tsv,
      ascii_csv: typeset.ascii_csv,
      ascii_md: typeset.ascii_md,
      labels: typeset.labels,
    };
  }
  // 3) Default TeX typesetting
  const typeset = MathJax.Typeset(math, {
    display: isBlock,
    metric: { cwidth: containerWidth },
    outMath: options.outMath,
    mathJax: options.mathJax,
    forDocx: options.forDocx,
    forPptx: options.forPptx,
    accessibility: options.accessibility,
    nonumbers: options.nonumbers,
    renderingErrors: options.renderingErrors,
  });
  const fmt: Pick<TypesetResult, "html" | "data"> = buildFormatOutputs({
    outputFormat,
    inputLatex: token.inputLatex,
    renderedHtml: typeset.html,
    renderedData: typeset.data,
  });
  return {
    ...fmt,
    ascii: typeset.ascii,
    linear: typeset.linear,
    ascii_tsv: typeset.ascii_tsv,
    ascii_csv: typeset.ascii_csv,
    ascii_md: typeset.ascii_md,
    labels: typeset.labels,
  };
}

/**
 * Converts a math token into HTML and attaches MathJax metadata to the token.
 * Also extracts equation labels and stores them in the shared labels list.
 */
export const convertMathToHtml = (state, token, options) => {
  const math = token.content;
  const beginNumber = MathJax.GetLastEquationNumber() + 1;
  try {
    const containerWidth = options?.width && options.width > 0
      ? options.width
      : getWidthFromDocument(1200);
    const res: TypesetResult = typesetMathForToken({
      token,
      math,
      isBlock: token.type !== 'inline_math',
      beginNumber,
      containerWidth,
      options,
    });
    applyTypesetResultToToken(token, res);
    // After typesetting, equation counter may have advanced.
    const number = MathJax.GetLastEquationNumber();
    // Collect labels (e.g. \label{...}) so we can resolve refs later.
    let idLabels: string = '';
    if (token.labels) {
      const labelKeys: string[] = Object.keys(token.labels);
      idLabels = labelKeys.length
        ? encodeURIComponent(labelKeys.join('_'))
        : '';
      for (const key in token.labels) {
        const tagContent = token.labels[key].tag;
        // Parse label content as inline markdown-it tokens
        // so we can render it consistently in UI.
        const tagChildrenTokens: any[] = [];
        state.md.inline.parse(tagContent, state.md, state.env, tagChildrenTokens);
        addIntoLabelsList({
          key,
          id: idLabels,
          tag: tagContent,
          tagId: token.labels[key].id,
          tagChildrenTokens,
          type: eLabelType.equation
        });
      }
    }
    token.idLabels = idLabels;
    token.number = number;
    token.begin_number = beginNumber;
    // attrNumber is "current equation number range" used by render rules
    token.attrNumber = beginNumber >= number
      ? number.toString()
      : `${beginNumber},${number}`;
    return token;
  } catch (e: any) {
    console.error('ERROR [convertMathToHtml] MathJax =>', e.message, e);
    formatMathJaxError(e, math, 'convertMathToHtml');
    token.error = { message: e.message, error: e };
    return token;
  }
};
