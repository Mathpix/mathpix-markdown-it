import { MathJax, IOuterData } from "../../mathjax/";
import { getWidthFromDocument } from "../utils";
import { addIntoLabelsList, eLabelType } from "./labels";
import { envArraysShouldBeFlattenInTSV } from '../../helpers/consts';
import { formatMathJaxError } from "../../helpers/utils";
import { csvSeparatorsDef, mdSeparatorsDef, tsvSeparatorsDef } from './consts';
import { formatSource } from "../../helpers/parse-mmd-element";

const RE_MJX_ASSISTIVE_ID = /<mjx-assistive-mml[^>]*\bid="([^"]+)"/;

type TypesetResult = {
  /** Rendered HTML string for this math token (SVG/MathML/LaTeX depending on output_format). */
  html?: string;
  /** MathJax metrics/extra data (widthEx/heightEx/etc). Null for 'latex' and 'mathml' output formats. */
  data?: IOuterData | null;
  ascii?: string;
  linear?: string;
  ascii_tsv?: string;
  ascii_csv?: string;
  ascii_md?: string;
  /** Map of label key → {tag, id} produced by MathJax when the math source
   *  contains `\label{...}`. `tag` is the rendered number/string for the
   *  equation; `id` is the per-parse DOM id suffix used by ref/eqref. */
  labels?: Record<string, { tag: string; id?: string }>;
  /** Set on cache-hit returns so the caller can skip re-running addIntoLabelsList and
   * the inline-parse of each label tag — labels were already registered on first miss. */
  _labelsRegistered?: boolean;
};

type CachedResult = TypesetResult & { _mjxId?: string };

/**
 * Per-parse math typeset cache, stored in state.env.__mathpix.
 * Following markdown-it convention (see markdown-it-footnote plugin):
 * - Scoped to a single md.parse() via the env object
 * - Initialized by init_math_cache core ruler hook at parse start
 * - Automatically isolated between parses and between md instances
 * - No module-level mutable state, no WeakMap, no signature computation
 */
type MathpixEnvState = {
  inlineCache: Map<string, CachedResult>;
  displayCache: Map<string, CachedResult>;
  cacheBypass: number;
};

const MATHPIX_ENV_KEY = '__mathpix';

/** Called from init_math_cache hook at the start of every md.parse(). */
export const initMathCache = (state: any): void => {
  if (!state.env) state.env = {};
  state.env[MATHPIX_ENV_KEY] = {
    inlineCache: new Map(),
    displayCache: new Map(),
    cacheBypass: 0,
  } as MathpixEnvState;
};

const getMathpixEnv = (state: any): MathpixEnvState | null =>
  state?.env?.[MATHPIX_ENV_KEY] || null;

/** Begin a section where cache must not be used (options.outMath is temporarily mutated). */
export const beginCacheBypass = (state: any): void => {
  const mx = getMathpixEnv(state);
  if (mx) mx.cacheBypass++;
};

/** End a cache-bypass section. */
export const endCacheBypass = (state: any): void => {
  const mx = getMathpixEnv(state);
  if (mx && mx.cacheBypass > 0) mx.cacheBypass--;
};

/**
 * Returns true when token already contains MathML input (display or inline).
 * These tokens use a separate MathJax path: TypesetMathML().
 */
const isMathMLToken = (token: any) =>
  token.type === 'display_mathML' || token.type === 'inline_mathML';

/**
 * Applies typesetting output to a token in place.
 * `mathData.svg` is only read by renderMathHighlight, so drop it when
 * highlights are off. `outMath.skipMathToHtml` opts token-only callers out
 * of mathEquation entirely.
 */
const applyTypesetResultToToken = (token: any, res: TypesetResult, options: any): void => {
  const skipMathEquation = !!options?.outMath?.skipMathToHtml;
  if (res.html != null && !skipMathEquation) {
    token.mathEquation = res.html;
  }
  if (res.data != null) {
    const keepSvgInMathData = !!options?.highlights?.length;
    if (keepSvgInMathData || res.data.svg == null) {
      token.mathData = res.data;
    } else {
      const { svg, ...rest } = res.data as any;
      token.mathData = rest;
    }
    token.widthEx = res.data.widthEx;
    token.heightEx = res.data.heightEx;
  }
  // Optional fields (present only when requested via outMath options)
  if (res.ascii != null) {
    token.ascii = res.ascii;
  }
  if (res.linear != null) {
    token.linear = res.linear;
  }
  if (res.ascii_tsv != null) {
    token.ascii_tsv = res.ascii_tsv;
  }
  if (res.ascii_csv != null) {
    token.ascii_csv = res.ascii_csv;
  }
  if (res.ascii_md != null) {
    token.ascii_md = res.ascii_md;
  }
  if (res.labels != null) {
    token.labels = res.labels;
  }
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
 *
 * Performance note: for 'mathml' and 'latex' output formats, MathJax still runs
 * the full SVG rendering pipeline internally (the SVG is discarded by renderByFormat).
 * A future optimization could add a fast path that skips SVG generation for these formats.
 */
const typesetMathForToken = (params: {
  state: any;
  token: any;
  math: string;
  isBlock: boolean;
  beginNumber: number;
  containerWidth: number;
  options: any;
}): TypesetResult => {
  const { state, token, math, isBlock, beginNumber, containerWidth, options } = params;
  const outputFormat = options.outMath?.output_format;
  // 1) MathML tokens: MathJax input is MathML (not TeX).
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
  // 2) Per-parse cache lookup for simple inline/display math.
  //    Numbered equations (equation_math*) are never cached — they advance the equation counter.
  //    Ascii-extraction tokens have side-effect options and are also excluded.
  //    Cache is bypassed when options.outMath is temporarily mutated (e.g. SetItemizeLevelTokens).
  const mx = getMathpixEnv(state);
  const cache = mx && mx.cacheBypass === 0
    ? (isBlock ? mx.displayCache : mx.inlineCache)
    : null;
  const isCacheable = !token.return_asciimath
    && (token.type === 'inline_math' || token.type === 'display_math');
  if (isCacheable && cache) {
    const cached = cache.get(math);
    if (cached) {
      let hitHtml = cached.html || '';
      let hitSvg = cached.data?.svg;
      if (cached._mjxId) {
        const freshId = MathJax.nextAssistiveId();
        hitHtml = hitHtml.split(cached._mjxId).join(freshId);
        if (hitSvg) hitSvg = hitSvg.split(cached._mjxId).join(freshId);
      }
      const hitData = cached.data ? { ...cached.data, svg: hitSvg } : cached.data;
      const { _mjxId, ...rest } = cached;
      const fmt = buildFormatOutputs({
        outputFormat, inputLatex: token.inputLatex,
        renderedHtml: hitHtml, renderedData: hitData,
      });
      return {
        ...rest,
        html: hitHtml,
        data: hitData,
        ...fmt,
        _labelsRegistered: true
      };
    }
  }
  // 3) AsciiMath extraction requested
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
  // 4) Default TeX typesetting.
  // skipMathToHtml → disable SVG serialization; mathml_word / ascii / metrics
  // are still produced for token-only callers.
  const skipMathToHtml = !!options.outMath?.skipMathToHtml;
  const outMathForTypeset = skipMathToHtml && options.outMath?.include_svg !== false
    ? { ...options.outMath, include_svg: false }
    : options.outMath;
  const typeset = MathJax.Typeset(math, {
    display: isBlock,
    metric: { cwidth: containerWidth },
    outMath: outMathForTypeset,
    mathJax: options.mathJax,
    forDocx: options.forDocx,
    forPptx: options.forPptx,
    accessibility: options.accessibility,
    nonumbers: options.nonumbers,
    renderingErrors: options.renderingErrors,
  });
  const rawResult: TypesetResult = {
    html: typeset.html,
    data: typeset.data,
    ascii: typeset.ascii,
    linear: typeset.linear,
    ascii_tsv: typeset.ascii_tsv,
    ascii_csv: typeset.ascii_csv,
    ascii_md: typeset.ascii_md,
    labels: typeset.labels,
  };
  if (isCacheable && cache) {
    const mjxIdMatch = rawResult.html?.match(RE_MJX_ASSISTIVE_ID);
    const entry: CachedResult = {
      ...rawResult,
      data: rawResult.data ? { ...rawResult.data } : rawResult.data,
      labels: rawResult.labels ? { ...rawResult.labels } : rawResult.labels,
    };
    if (mjxIdMatch && mjxIdMatch[1]) entry._mjxId = mjxIdMatch[1];
    cache.set(math, entry);
  }
  const fmt = buildFormatOutputs({
    outputFormat, inputLatex: token.inputLatex,
    renderedHtml: rawResult.html || '', renderedData: rawResult.data,
  });
  return { ...rawResult, ...fmt };
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
      state,
      token,
      math,
      isBlock: token.type !== 'inline_math',
      beginNumber,
      containerWidth,
      options,
    });
    applyTypesetResultToToken(token, res, options);
    // After typesetting, equation counter may have advanced.
    const number = MathJax.GetLastEquationNumber();
    // Collect labels (e.g. \label{...}) so we can resolve refs later.
    // On cache hit the labels were already parsed & registered on first miss;
    // re-running inline.parse + addIntoLabelsList is idempotent for the same
    // key+content, so we skip the loop and only recompute idLabels.
    let idLabels: string = '';
    if (token.labels) {
      const labelKeys: string[] = Object.keys(token.labels);
      idLabels = labelKeys.length
        ? encodeURIComponent(labelKeys.join('_'))
        : '';
      if (!res._labelsRegistered) {
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
