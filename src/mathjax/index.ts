import { MathJaxConfigure, svg } from './mathjax';

import { SerializedMmlVisitor as MmlVisitor } from 'mathjax-full/js/core/MmlTree/SerializedMmlVisitor.js';
import { LiteElement } from "mathjax-full/js/adaptors/lite/Element.js";
import { SerializedAsciiVisitor as AsciiVisitor } from './serialized-ascii';
import { SerializedTypstVisitor } from './serialized-typst';
import { ITypstData, MathNode } from './serialized-typst/types';
import { markUnpairedBrackets, clearUnpairedBracketMarks } from './serialized-typst/bracket-utils';
import { getNodeText } from './serialized-typst/common';
import { DATA_PRE_CONTENT, DATA_POST_CONTENT } from './serialized-typst/consts';
import { MathMLVisitorWord } from './mathml-word';
import { getSpeech } from '../sre';
import { TAccessibility } from "../mathpix-markdown-model";
import { formatSource, formatSourceMML } from "../helpers/parse-mmd-element";
import { Label } from 'mathjax-full/js/input/tex/Tags.js';
import { IAsciiData } from "./serialized-ascii/common";
import { formatMathJaxError } from "../helpers/utils";
import { getMathDimensions, IMathDimensions } from "./utils";
import { uid } from "../markdown/utils";

const MJ = new MathJaxConfigure();

interface ITypstConvertResult {
  typstmath: string;
  typstmath_inline: string;
  error?: string;
}

export interface IOuterData {
  mathml?: string,
  mathml_word?: string,
  asciimath?: string,
  linearmath?: string,
  asciimath_tsv?: string,
  asciimath_csv?: string,
  asciimath_md?: string,
  typstmath?: string,
  typstmath_inline?: string,  // always set when typstmath is set
  typstmath_error?: string,   // non-fatal conversion errors from Typst handlers
  latex?: string,
  svg?: string,
  speech?: string,
  error?: string,
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

const normalizeTypstSpaces = (s: string): string =>
  s ? s.trim().replace(/(\S) {2,}/g, '$1 ') : '';

/** Strip trailing \\ linebreak sequences. Needed for inline `$...$` where a
 *  trailing \ combines with the closing $ to form \$ (escaped dollar), breaking
 *  math-mode termination. Block `$ ... $` has a space before $ that saves it,
 *  so trailing linebreaks can remain there for visual parity with MathJax. */
const RE_TRAILING_LINEBREAKS = /(?:\s*\\)+\s*$/;

const stripTrailingLinebreaks = (s: string): string =>
  s ? s.replace(RE_TRAILING_LINEBREAKS, '') : '';

/** Find the first merror node in the tree and return its error message, or null. */
const findMerror = (node: MathNode): string | null => {
  if (!node) return null;
  if (node.kind === 'merror') {
    const attrMsg = node.attributes?.get('data-mjx-error') as string | undefined;
    if (attrMsg) return attrMsg;
    const textMsg = (node.childNodes ?? [])
      .map(c => getNodeText(c)).join('');
    return textMsg || 'Unknown error';
  }
  for (const child of (node.childNodes ?? [])) {
    const err = findMerror(child);
    if (err) return err;
  }
  return null;
};

/** Return both block and inline Typst math from the MathML AST.
 *  Temporarily mutates the shared MathML tree via setProperty()
 *  (data-unpaired-bracket, data-pre-content, data-post-content).
 *  All mutations are cleaned up after serialization. */
const toTypstData = (node: MathNode, labels?: Record<string, { tag: string; id: string }> | null): ITypstConvertResult => {
  const parseError = findMerror(node);
  if (parseError) {
    return {
      typstmath: '',
      typstmath_inline: '',
      error: parseError
    };
  }
  // markUnpairedBrackets and visitInferredMrowNode both mutate the shared
  // MathML tree (setting properties / reading them). markUnpairedBrackets must
  // run first so that bracket properties are available during serialization.
  markUnpairedBrackets(node);
  const visitorT = new SerializedTypstVisitor(labels ?? null);
  const data: ITypstData = visitorT.visitTree(node);
  // Clean up tree mutations so properties don't leak to other visitors
  clearUnpairedBracketMarks(node);
  clearTypstProperties(node);
  const typstmath = normalizeTypstSpaces(data?.typst);
  const typstmath_inline = stripTrailingLinebreaks(
    normalizeTypstSpaces(data?.typst_inline ?? data?.typst)
  );
  // Propagate non-fatal conversion errors (handler failures).
  // Output still contains best-effort fallback text.
  const error = data?.errors?.length
    ? data.errors.join('; ')
    : undefined;
  return {
    typstmath,
    typstmath_inline,
    error
  };
};

/** Remove data-pre-content and data-post-content properties set during Typst serialization. */
const clearTypstProperties = (root: MathNode): void => {
  const walk = (node: MathNode): void => {
    if (!node) return;
    node.removeProperty(DATA_PRE_CONTENT, DATA_POST_CONTENT);
    if (node.childNodes) {
      for (const child of node.childNodes) walk(child);
    }
  };
  walk(root);
};

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
    include_typst = false,
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
  /** Get information about the current labels. */
  const tagLabels = math.inputJax?.parseOptions?.tags?.labels
    ? {...math.inputJax.parseOptions.tags.labels}
    : null;
  if (include_typst) {
    const typstData = toTypstData(math.root, tagLabels);
    res.typstmath = typstData.typstmath;
    res.typstmath_inline = typstData.typstmath_inline;
    if (typstData.error) {
      res.typstmath_error = typstData.error;
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
  res.labels = tagLabels;
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
    include_typst = false,
    include_svg = true,
    include_speech = false,
    output_format = 'svg'
  } = outMath;
  let res: {
    mathml?: string,
    mathml_word?: string,
    asciimath?: string,
    typstmath?: string,
    typstmath_inline?: string,
    typstmath_error?: string,
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
  if (include_typst) {
    const tagLabels = math.inputJax?.parseOptions?.tags?.labels
      ? {...math.inputJax.parseOptions.tags.labels}
      : null;
    const typstData = toTypstData(math.root, tagLabels);
    res.typstmath = typstData.typstmath;
    res.typstmath_inline = typstData.typstmath_inline;
    if (typstData.error) {
      res.typstmath_error = typstData.error;
    }
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
    include_typst = false,
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
  if (include_typst) {
    const tagLabels = math.inputJax?.parseOptions?.tags?.labels
      ? {...math.inputJax.parseOptions.tags.labels}
      : null;
    const typstData = toTypstData(math.root, tagLabels);
    res.typstmath = typstData.typstmath;
    res.typstmath_inline = typstData.typstmath_inline;
    if (typstData.error) {
      res.typstmath_error = typstData.error;
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
    include_typst = false,
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
  if (include_typst && data.typstmath) {
    if (!outHTML) { outHTML += '\n'}
    outHTML += '<typstmath style="display: none;">' + formatSource(data.typstmath) + '</typstmath>';
    outHTML += '<typstmath-inline style="display: none;">' + formatSource(data.typstmath_inline || data.typstmath) + '</typstmath-inline>';
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
  TexConvertToTypstData: function(string: string, options: any = {}): ITypstConvertResult {
    const {display = true, metric = {}, accessibility = null} = options;
    const {em = 16, ex = 8, cwidth = 1200, lwidth = 100000, scale = 1} = metric;
    this.checkAccessibility(accessibility);
    (MJ.docTeX as any).inputJax?.parseOptions?.tags?.reset();
    MJ.docTeX.convert(string, {
      display, em, ex, containerWidth: cwidth, lineWidth: lwidth, scale,
    });
    const outputJax = MJ.docTeX.outputJax as any;
    const tagLabels = outputJax?.math?.inputJax?.parseOptions?.tags?.labels ?? null;
    return toTypstData(outputJax.math.root, tagLabels);
  },
  MathMLConvertToTypstData: function(string: string, options: any = {}): ITypstConvertResult {
    const {display = true, metric = {}, accessibility = null} = options;
    const {em = 16, ex = 8, cwidth = 1200, lwidth = 100000, scale = 1} = metric;
    this.checkAccessibility(accessibility);
    MJ.docMathML.convert(string, {
      display, em, ex, containerWidth: cwidth, lineWidth: lwidth, scale,
    });
    const outputJax = MJ.docMathML.outputJax as any;
    return toTypstData(outputJax.math.root);
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

  /** @deprecated Use TypesetAsciiMath instead. Kept for backward compatibility. */
  AsciiMathToSvg: function(string, options: any={}) {
    return this.TypesetAsciiMath(string, options).html;
  },

  TypesetAsciiMath: function(string, options: any={}) {
    const {display = true, metric = {}, outMath = {}, forDocx={}, accessibility = null} = options;
    const {em = 16, ex = 8, cwidth = 1200, lwidth = 100000, scale = 1} = metric;
    this.checkAccessibility(accessibility);
    const node = MJ.docAsciiMath.convert(string, {
      display, em, ex, containerWidth: cwidth, lineWidth: lwidth, scale,
    });
    const outputJax = MJ.docAsciiMath.outputJax as any;
    const outerDataAscii = OuterDataAscii(MJ.adaptor, node, outputJax.math, outMath, forDocx, accessibility);
    return {
      html: outMath?.output_format === 'mathml'
        ? formatSourceMML(outerDataAscii.mathml)
        : OuterHTML(outerDataAscii, options.outMath),
      data: outerDataAscii,
    };
  },

  //
  //  Reset tags and labels
  //
  Reset: function (n = 0) {
    if (n) {n--} else {n = 0}
    MJ.mTex.parseOptions.tags.reset(n);
  },
  GetLastEquationNumber: function () {
    const tags: any = MJ.mTex.parseOptions.tags;
    return tags.counter;
  }
};
