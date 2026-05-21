import { MathJaxConfigure, svg } from './mathjax';

import { SerializedMmlVisitor as MmlVisitor } from 'mathjax-full/js/core/MmlTree/SerializedMmlVisitor.js';
import { LiteElement } from "mathjax-full/js/adaptors/lite/Element.js";
import { SerializedAsciiVisitor as AsciiVisitor } from './serialized-ascii';
import { MathMLVisitorWord } from './mathml-word';
import { getSpeech } from '../sre';
import { TAccessibility } from "../mathpix-markdown-model";
import { formatSource, formatSourceMML } from "../helpers/parse-mmd-element";
import { Label } from 'mathjax-full/js/input/tex/Tags.js';
import TexParser from 'mathjax-full/js/input/tex/TexParser.js';
import TexError from 'mathjax-full/js/input/tex/TexError.js';
import { MathItem } from 'mathjax-full/js/core/MathItem.js';
import { IAsciiData } from "./serialized-ascii/common";
import { formatMathJaxError } from "../helpers/utils";
import { getMathDimensions, IMathDimensions } from "./utils";
import { uid } from "../markdown/utils";

const MJ = new MathJaxConfigure();

// Minimal shape that startEquation reads (verified against mathjax-full 3.2.2 — only inputData.recompile).
interface StartEquationMath { inputData: { recompile?: unknown } }

/**
 * Error returned by `MathpixMarkdownModel.validateTex` when parsing fails.
 * - `code`: MathJax `TexError.id` (e.g. `'UndefinedControlSequence'`, `'MissingArgFor'`) for parse errors;
 *   `'InvalidInput'` when `latex` is not a string (caller bug);
 *   `'InternalError'` when MathJax itself threw a non-TexError (parser crash);
 *   `'TexError'` is a defensive fallback if a future MathJax produces a TexError without an `.id` (does not occur in 3.2.2).
 * - `latex`: the input formula that triggered the error.
 */
export class TexValidationError extends Error {
  readonly code?: string;
  readonly latex: string;
  constructor(message: string, latex: string, code?: string) {
    super(message);
    // Restore prototype chain (ES5 target breaks it on extends Error).
    Object.setPrototypeOf(this, TexValidationError.prototype);
    this.name = 'TexValidationError';
    this.latex = latex;
    this.code = code;
  }
}

export type TexValidationResult =
  | { valid: true }
  | { valid: false; error: TexValidationError };

export interface IOuterData {
  mathml?: string,
  mathml_word?: string,
  asciimath?: string,
  linearmath?: string,
  asciimath_tsv?: string,
  asciimath_csv?: string,
  asciimath_md?: string,
  latex?: string,
  svg?: string,
  speech?: string,
  labels?: {
    [key: string]: Label;
  },
  height?: number,
  heightAndDepth?: number,
  width?: string;
  widthEx?: number;
  heightEx?: number;
}

const toMathML = (node => {
  const visitor = new MmlVisitor();
  return visitor.visitTree(node)
});

//MmlWordVisitor
const toMathMLWord = ((node, options) => {
  options = Object.assign(options, {aligned: true});
  const visitor = new MathMLVisitorWord(options);
  return visitor.visitTree(node)
});

const toAsciiML = ((node, optionAscii): IAsciiData => {
  const visitorA = new AsciiVisitor(optionAscii);
  let data: IAsciiData = visitorA.visitTree(node);
  return {
    ascii: data?.ascii ? data.ascii.trim() : data.ascii,
    linear: data.linear,
    ascii_tsv: data?.ascii_tsv ? data.ascii_tsv.trim() : data.ascii_tsv,
    ascii_csv: data?.ascii_csv ? data.ascii_csv.trim() : data.ascii_csv,
    ascii_md: data?.ascii_md ? data.ascii_md.trim() : data.ascii_md
  }
});

const normalizeMathJaxA11y = (adaptor, mjxContainer) => {
  adaptor.setAttribute(mjxContainer, 'role', 'math');
  adaptor.setAttribute(mjxContainer, 'tabindex', '0');
  const svg = adaptor.firstChild(mjxContainer);
  if (svg) {
    adaptor.setAttribute(svg, 'aria-hidden', 'true');
  }
}

const makeAssistiveMmlAccessible = (adaptor, mjxContainer) => {
  const assistive = adaptor.lastChild(mjxContainer);
  let id = adaptor.getAttribute(assistive, 'id');
  if (!id) {
    id = MathJax.nextAssistiveId();
    adaptor.setAttribute(assistive, 'id', id);
  }
  adaptor.setAttribute(mjxContainer, 'aria-labelledby', id);
  adaptor.removeAttribute(assistive, 'aria-hidden');
}

const applySpeechToNode = (adaptor, mjxContainer, sre): string => {
  const assistive = adaptor.lastChild(mjxContainer); // mjx-assistive-mml
  const assistiveMml = adaptor.innerHTML(assistive);
  const speech: string = getSpeech(sre, assistiveMml);
  adaptor.setAttribute(mjxContainer, 'aria-label', speech);
  adaptor.removeAttribute(assistive, 'aria-hidden');
  return speech;
};

/**
 * Applies MathJax accessibility attributes to an mjx-container:
 * - role="math", tabindex="0"
 * - hides SVG from AT
 * - either sets aria-label via SRE speech, or exposes assistive MathML via aria-labelledby
 */
const applyMathJaxA11y = (
  adaptor: any,
  mjxContainer: any,
  accessibility?: TAccessibility,
  includeSpeechOutput = false,
): { speech?: string } => {
  if (!accessibility?.sre && !accessibility?.assistiveMml) {
    return {};
  }
  normalizeMathJaxA11y(adaptor, mjxContainer);
  // Prefer SRE if provided
  if (accessibility.sre) {
    const speech: string = applySpeechToNode(adaptor, mjxContainer, accessibility.sre);
    return includeSpeechOutput && speech ? { speech } : {};
  }
  // Otherwise fallback to assistive MathML exposure
  if (accessibility.assistiveMml) {
    makeAssistiveMmlAccessible(adaptor, mjxContainer);
  }
  return {};
};

const OuterData = (adaptor, node, math, outMath, forDocx = false, accessibility?): IOuterData => {
  const {
    include_mathml = false,
    include_mathml_word = false,
    include_asciimath = false,
    include_latex = false,
    include_linearmath = false,
    include_svg = true,
    include_speech = false,
    optionAscii = {
      showStyle: false,
      extraBrackets: true,
    },
    output_format = 'svg'
  } = outMath;
  const res: IOuterData = {};
  const a11y = applyMathJaxA11y(adaptor, node, accessibility, include_speech);
  if (a11y.speech) {
    res.speech = a11y.speech;
  }
  
  if (include_mathml || output_format === 'mathml') {
    res.mathml = toMathML(math.root);
  }

  if (include_mathml_word) {
    res.mathml_word = toMathMLWord(math.root, {forDocx: forDocx});
  }
  if (include_asciimath || optionAscii?.tableToCsv || optionAscii?.tableToTsv || optionAscii?.tableToMd || include_linearmath) {
    const dataAscii: IAsciiData = toAsciiML(math.root, optionAscii);
    if (include_asciimath || optionAscii?.tableToCsv || optionAscii?.tableToTsv || optionAscii?.tableToMd) {
      res.asciimath = dataAscii.ascii;
      res.asciimath_tsv = dataAscii.ascii_tsv;
      res.asciimath_csv = dataAscii.ascii_csv;
      res.asciimath_md = dataAscii.ascii_md;
    }
    if (include_linearmath) {
      res.linearmath = dataAscii.linear;
    }
  }
  
  if (include_latex) {
    res.latex = (math.math
      ? math.math
      : math.inputJax.processStrings ? '' : math.start.node.outerHTML);
  }
  if (include_svg) {
    res.svg = adaptor.outerHTML(node);
    if (node) {
      const mathDimensions: IMathDimensions =
        node instanceof LiteElement
          ? getMathDimensions(node)
          : node instanceof HTMLElement
            ? getMathDimensions(node)
            : null;
      if (mathDimensions) {
        res.width = mathDimensions.containerWidth;
        res.widthEx = mathDimensions.widthEx;
        res.heightEx = mathDimensions.heightEx;
        res.height = mathDimensions.viewBoxHeight;
        res.heightAndDepth = mathDimensions.viewBoxHeightAndDepth;
      }
    }
  }
  const labelsSrc = math.inputJax.parseOptions?.tags?.labels;
  res.labels = labelsSrc && Object.keys(labelsSrc).length > 0
    ? {...labelsSrc}
    : null;
  return res;
};

const OuterDataError = (adaptor, node, latex, error, outMath) => {
  const {
    include_latex = false,
    include_svg = true,
  } = outMath;
  let res: {
    mathml?: string,
    mathml_word?: string,
    asciimath?: string,
    latex?: string,
    svg?: string,
    error?: string
  } = {};

  if (error) {
    res.error = error.message
  }
  if (include_latex) {
    res.latex = latex;
  }
  if (include_svg && node) {
    res.svg = adaptor.outerHTML(node);
  }
  return res;
};

const OuterDataAscii = (adaptor, node, math, outMath, forDocx = false, accessibility?) => {
  const {
    include_mathml = false,
    include_mathml_word = false,
    include_asciimath = false,
    include_svg = true,
    include_speech = false,
    output_format = 'svg'
  } = outMath;
  let res: {
    mathml?: string,
    mathml_word?: string,
    asciimath?: string,
    latex?: string,
    svg?: string,
    speech?: string
  } = {};
  const a11y = applyMathJaxA11y(adaptor, node, accessibility, include_speech);
  if (a11y.speech) {
    res.speech = a11y.speech;
  }

  if (include_mathml || output_format === 'mathml') {
    res.mathml = toMathML(math.root);
  }

  if (include_mathml_word) {
    res.mathml_word = toMathMLWord(math.root, {forDocx: forDocx});
  }

  if (include_asciimath) {
    res.asciimath = (math.math
      ? math.math
      : math.inputJax.processStrings ? '' : math.start.node.outerHTML);
  }
  if (include_svg) {
    res.svg = adaptor.outerHTML(node)
  }

  return res;
};

const OuterDataMathMl = (adaptor, node, math, outMath, forDocx = false, accessibility?) => {
  const {
    include_mathml = false,
    include_mathml_word = false,
    include_asciimath = false,
    include_svg = true,
    include_speech = false,
    include_linearmath = false,
    optionAscii = {
      showStyle: false,
      extraBrackets: true
    },
    output_format = 'svg'
  } = outMath;
  let res: IOuterData = {};
  const a11y = applyMathJaxA11y(adaptor, node, accessibility, include_speech);
  if (a11y.speech) {
    res.speech = a11y.speech;
  }

  if (include_mathml || output_format === 'mathml') {
    res.mathml = toMathML(math.root);
  }

  if (include_mathml_word) {
    res.mathml_word = toMathMLWord(math.root, {forDocx: forDocx});
  }

  if (include_asciimath || include_linearmath) {
    const dataAscii: IAsciiData = toAsciiML(math.root, optionAscii);
    if (include_asciimath) {
      res.asciimath = dataAscii.ascii;
    }
    if (include_linearmath) {
      res.linearmath = dataAscii.linear;
    }
  }

  if (include_svg) {
    res.svg = adaptor.outerHTML(node);
    if (node) {
      const mathDimensions: IMathDimensions =
        node instanceof LiteElement
          ? getMathDimensions(node)
          : node instanceof HTMLElement
            ? getMathDimensions(node)
            : null;
      if (mathDimensions) {
        res.width = mathDimensions.containerWidth;
        res.widthEx = mathDimensions.widthEx;
        res.heightEx = mathDimensions.heightEx;
        res.height = mathDimensions.viewBoxHeight;
        res.heightAndDepth = mathDimensions.viewBoxHeightAndDepth;
      }
    }
  }
  return res;
};

export const OuterHTML = (data, outMath, forPptx: boolean = false) => {
  const {
    include_mathml = false,
    include_mathml_word = false,
    include_asciimath = false,
    include_linearmath = false,
    include_latex = false,
    include_svg = true,
    include_error = false,
    include_speech = false
  } = outMath;
  let outHTML = '';
  if (include_mathml && data.mathml) {
    if (forPptx) {
      outHTML += '<mathml>' + formatSourceMML(data.mathml) + '</mathml>';
    } else {
      outHTML += '<mathml style="display: none;">' + formatSourceMML(data.mathml) + '</mathml>';
    }
  }
  if (include_mathml_word && data.mathml_word) {
    outHTML +=  '<mathmlword style="display: none;">' + data.mathml_word + '</mathmlword>';
  }
  if (include_asciimath && data.asciimath) {
    if (!outHTML) { outHTML += '\n'}
    outHTML +=  '<asciimath style="display: none;">' + formatSource(data.asciimath) + '</asciimath>';
  }
  if (include_linearmath && data.linearmath) {
    if (!outHTML) { outHTML += '\n'}
    outHTML +=  '<linearmath style="display: none;">' + formatSource(data.linearmath) + '</linearmath>';
  }
  if (include_latex && data.latex) {
    if (!outHTML) { outHTML += '\n'}
    outHTML += '<latex style="display: none;">' + formatSource(data.latex) + '</latex>';
  }    
  if (include_speech && data.speech) {
    if (!outHTML) { outHTML += '\n'}
    outHTML += '<speech style="display: none;">' + formatSource(data.speech) + '</speech>';
  }  
  if (include_error && data.error) {
    if (!outHTML) { outHTML += '\n'}
    outHTML += '<error style="display: none;">' + formatSource(data.error) + '</error>';
  }

  if (include_svg && data.svg) {
    if (!outHTML) { outHTML += '\n'}
    outHTML += data.svg;
  }

  return outHTML;
};

/**
 * Produces the rendered HTML string for a given output_format.
 *
 * Note: for "latex", this returns "" because the original LaTeX source is not
 * available at this level (IOuterData doesn't carry it). The caller
 * (buildFormatOutputs in convert-math-to-html.ts) replaces this empty string
 * with the formatted LaTeX source via formatSource(inputLatex).
 */
const renderByFormat = (data: IOuterData, outMath: any, forPptx = false): string => {
  switch (outMath?.output_format) {
    case "latex":
      return "";
    case "mathml":
      return data.mathml ? formatSourceMML(data.mathml) : "";
    default:
      return OuterHTML(data, outMath, forPptx);
  }
}

export const MathJax = {
  assistiveMml: true,
  nonumbers: false,
  _a11y: {
    renderKey: uid(),
    counter: 0,
  },

  beginRender(renderKey?: string) {
    this._a11y.renderKey = renderKey || uid();
    this._a11y.counter = 0;
  },

  nextAssistiveId(prefix = 'mjx-mml-') {
    this._a11y.counter += 1;
    return `${prefix}${this._a11y.renderKey}-${this._a11y.counter}`;
  },

  checkAccessibility: function (accessibility: TAccessibility = null, nonumbers = false) {
    if (!this.assistiveMml && accessibility !== null) {
      this.assistiveMml = true;
      this.nonumbers = nonumbers;
      MJ.changeHandler(true, nonumbers);
      return;
    }
    
    if (this.assistiveMml && accessibility === null) {
      this.assistiveMml = false;
      this.nonumbers = nonumbers;
      MJ.changeHandler(false, nonumbers);
      return;
    }

    if (this.nonumbers !== nonumbers) {
      this.nonumbers = nonumbers;
      MJ.changeHandler(this.assistiveMml, nonumbers);
    }
  },
  
  //
  //  Return the stylesheet DOM node
  //
  Stylesheet: function () {
    return svg.styleSheet(MJ.mDocTeX);
  },
  TexConvert: function(string, options: any={}, throwError = false): IOuterData {
    const {display = true, metric = {}, outMath = {}, mathJax = {}, forDocx={}, accessibility = null, nonumbers = false} = options;
    const {em = 16, ex = 8, cwidth = 1200, lwidth = 100000, scale = 1} = metric;
    const {mtextInheritFont = false} = mathJax;
    this.checkAccessibility(accessibility, nonumbers);
    MJ.mDocTeX.outputJax.options.mtextInheritFont = mtextInheritFont;
    try {
      /** Here we use different package settings.
       * In order to flatten arrays in asccimath for TSV/CSV we add an extra attribute to the internal mml tree.
       * So for \begin{array} we add a name attribute that points to the environment */
      const node = options?.outMath?.optionAscii?.tableToTsv || options?.outMath?.optionAscii?.tableToCsv || options?.outMath?.optionAscii?.tableToMd
        ? MJ.docTeXTSV.convert(string, {
        display: display, 
        em: em, 
        ex: ex, 
        containerWidth: cwidth, lineWidth: lwidth, scale: scale})
        : MJ.mDocTeX.convert(string, {
        display: display, 
        em: em, 
        ex: ex, 
        containerWidth: cwidth, lineWidth: lwidth, scale: scale});
      const outputJax = MJ.mDocTeX.outputJax as any;
      return OuterData(MJ.adaptor, node, outputJax.math, outMath, forDocx, accessibility);
    } catch (err) {
      if (throwError) {
        throw err;
      }
      formatMathJaxError(err, string, 'TexConvert');
      if (outMath && outMath.include_svg) {
        const node = MJ.docTeX.convert(string, {
          display, em, ex, containerWidth: cwidth, lineWidth: lwidth, scale,
        });
        return OuterDataError(MJ.adaptor, node, string, err, outMath);
      }
      return OuterDataError(MJ.adaptor, null, string, err, outMath);
    }
  },
  /**
   * Validates a TeX expression using MathJax's parser without producing SVG output.
   * Runs `TexParser` directly on an isolated `MTeX` instance — skips MathItem/MathDocument,
   * post-filters, and the output jax. No side-effects on the rendering pipeline.
   *
   * @remarks Validator state (custom macros via `\newcommand`) persists across calls.
   * Pass `isolated: true` (or call `ResetValidateTex()`) after untrusted input.
   *
   * @param latex - The TeX source to validate. An empty or whitespace-only string returns `{ valid: true }`.
   * @param options.display - `true` (default) for block math, `false` for inline.
   * @param options.isolated - If `true`, drop accumulated `packageData` **before** this call. Default `false`. Asymmetric: macros defined by *this* call remain after return; call `resetValidateTex()` if you also want to drop them.
   * @returns `{ valid: true }` if parsing succeeds, `{ valid: false, error: TexValidationError }` otherwise. Never throws.
   */
  ValidateTex: function(latex: string, options: { display?: boolean; isolated?: boolean } = {}): TexValidationResult {
    const { display = true, isolated = false } = options ?? {};
    if (typeof latex !== 'string') {
      let latexRepr: string;
      try {
        latexRepr = String(latex);
      } catch {
        latexRepr = '[unstringifiable]';
      }
      return {
        valid: false,
        error: new TexValidationError('latex must be a string', latexRepr, 'InvalidInput'),
      };
    }
    if (isolated) MJ.resetValidateTex();
    const validateInputJax = MJ.validateTex;
    const parseOptions = validateInputJax.parseOptions;
    try {
      parseOptions.clear();
      const stub: StartEquationMath = { inputData: {} };
      // Cast via unknown so StartEquationMath stays the source of truth for what startEquation reads.
      parseOptions.tags.startEquation(stub as unknown as MathItem<any, any, any>);
      // isInner: false → top-level math context, matching the render path.
      // Parse runs inside the constructor; mml() finalizes the tree and is the patch point exercised by the 'InternalError' test (do not remove).
      const parser = new TexParser(latex, { display, isInner: false }, parseOptions);
      // !root — defensive: mathjax-full 3.2.2 never returns falsy here, but the API does not contractually forbid it.
      const root = parser.mml();
      if (!root) {
        return {
          valid: false,
          error: new TexValidationError('parser produced no MML root', latex, 'InternalError'),
        };
      }
      return { valid: true };
    } catch (err) {
      // TexError isn't an Error subclass; duck-type .message and .id.
      const rawMessage = typeof (err as any)?.message === 'string'
        ? (err as any).message as string
        : String(err);
      const code = typeof (err as any)?.id === 'string' ? (err as any).id as string : undefined;
      if (err instanceof TexError || code) {
        return { valid: false, error: new TexValidationError(rawMessage, latex, code ?? 'TexError') };
      }
      return { valid: false, error: new TexValidationError(rawMessage, latex, 'InternalError') };
    }
  },
  TexConvertToAscii: function(string, options: any={}) {
    const {display = true, metric = {},
      outMath = {}, accessibility = null
    } = options;
    const {em = 16, ex = 8, cwidth = 1200, lwidth = 100000, scale = 1} = metric;
    
    this.checkAccessibility(accessibility);
    MJ.docTeX.convert(string, {
      display, em, ex, containerWidth: cwidth, lineWidth: lwidth, scale,
    });
    const outputJax = MJ.docTeX.outputJax as any;
    const {
      optionAscii = {
        showStyle: false,
        extraBrackets: true
      }} = outMath;
    const dataAscii: IAsciiData = toAsciiML(outputJax.math.root, optionAscii);
    return dataAscii.ascii;
  },
  /**
   * Typeset a TeX expression and return the SVG tree for it
   *
   * @param string {string}
   * @param options {}
   */
  Typeset: function(string, options: any={}, throwError = false) {
    const data = this.TexConvert(string, options, throwError);
    return {
      html: renderByFormat(data, options.outMath, options.forPptx),
      labels: data.labels,
      ascii: data.asciimath,
      linear: data.linearmath,
      ascii_tsv: data?.['asciimath_tsv'],
      ascii_csv: data?.['asciimath_csv'],
      ascii_md: data?.['asciimath_md'],
      data: {...data}
    }
  },

  TypesetSvgAndAscii: function(string, options: any={}) {
    const { outMath = {} } = options;
    const { include_asciimath = false } = outMath;
    options.outMath.include_asciimath = true;
    const data: IOuterData = this.TexConvert(string, options);
    options.outMath.include_asciimath = include_asciimath;
    return {
      html: renderByFormat(data, outMath),
      ascii: data.asciimath,
      linear: data.linearmath,
      labels: data.labels,
      ascii_tsv: data?.['asciimath_tsv'],
      ascii_csv: data?.['asciimath_csv'],
      ascii_md: data?.['asciimath_md'],
      data: {...data}
    };
  },
  /**
   * Typeset a MathML expression and return the SVG tree for it
   *
   * @param string {string}
   * @param options {}
   */

  TypesetMathML: function(string, options: any={}) {
    const { display = true, metric = {}, outMath = {}, forDocx={}, accessibility = null } = options;
    const {em = 16, ex = 8, cwidth = 1200, lwidth = 100000, scale = 1} = metric;

    this.checkAccessibility(accessibility);
    const node = MJ.docMathML.convert(string, {display: display, em: em, ex: ex, containerWidth: cwidth, lineWidth: lwidth, scale: scale});
    const outputJax = MJ.docMathML.outputJax as any;
    const outerDataMathMl: IOuterData = OuterDataMathMl(MJ.adaptor, node, outputJax.math, outMath, forDocx, accessibility);
    return {
      html: outMath?.output_format === 'mathml'
        ? formatSourceMML(outerDataMathMl.mathml)
        : OuterHTML(outerDataMathMl, options.outMath),
      data: {...outerDataMathMl}
    };
  },

  AsciiMathToSvg: function(string, options: any={}) {
    const {display = true, metric = {}, outMath = {}, forDocx={}, accessibility = null} = options;
    const {em = 16, ex = 8, cwidth = 1200, lwidth = 100000, scale = 1} = metric;

    this.checkAccessibility(accessibility);
    const node = MJ.docAsciiMath.convert(string, {
      display, em, ex, containerWidth: cwidth, lineWidth: lwidth, scale,
    });
    const outputJax = MJ.docAsciiMath.outputJax as any;
    const outerDataAscii = OuterDataAscii(MJ.adaptor, node, outputJax.math, outMath, forDocx, accessibility);
    return outMath?.output_format === 'mathml'
      ? formatSourceMML(outerDataAscii.mathml)
      : OuterHTML(outerDataAscii, options.outMath);
  },

  // Render-path tags only. Validator persists packageData across calls — use ResetValidateTex to drop.
  Reset: function (n = 0) {
    if (n) {n--} else {n = 0}
    MJ.mTex.parseOptions.tags.reset(n);
  },
  // Drops the validator instance; next call rebuilds with empty packageData.
  ResetValidateTex: function () {
    MJ.resetValidateTex();
  },
  GetLastEquationNumber: function () {
    const tags: any = MJ.mTex.parseOptions.tags;
    return tags.counter;
  }
};
