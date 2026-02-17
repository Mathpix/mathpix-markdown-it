import { MathJaxConfigure, svg } from './mathjax';

import { SerializedMmlVisitor as MmlVisitor } from 'mathjax-full/js/core/MmlTree/SerializedMmlVisitor.js';
import { LiteElement } from "mathjax-full/js/adaptors/lite/Element.js";
import { SerializedAsciiVisitor as AsciiVisitor } from './serialized-ascii';
import { SerializedTypstVisitor } from './serialized-typst';
import { ITypstData } from './serialized-typst/common';
import { MathMLVisitorWord } from './mathml-word';
import { getSpeech } from '../sre';
import { TAccessibility } from "../mathpix-markdown-model";
import { formatSource, formatSourceMML } from "../helpers/parse-mmd-element";
import { Label } from 'mathjax-full/js/input/tex/Tags.js';
import { IAsciiData } from "./serialized-ascii/common";
import { formatMathJaxError } from "../helpers/utils";
import { getMathDimensions, IMathDimensions } from "./utils";

const MJ = new MathJaxConfigure();

export interface IOuterData {
  mathml?: string,
  mathml_word?: string,
  asciimath?: string,
  linearmath?: string,
  asciimath_tsv?: string,
  asciimath_csv?: string,
  asciimath_md?: string,
  typstmath?: string,
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

const toTypstML = ((node, optionTypst?): string => {
  const visitorT = new SerializedTypstVisitor(optionTypst);
  const data: ITypstData = visitorT.visitTree(node);
  return data?.typst ? data.typst.trim().replace(/ {2,}/g, ' ') : '';
});

const applySpeechToNode = (adaptor, node, sre): string => {
  const lastChild = adaptor.lastChild(node);
  const mmlAssistive = adaptor.innerHTML(lastChild);
  const speech = getSpeech(sre, mmlAssistive);
  adaptor.setAttribute(node, 'aria-label', speech);
  adaptor.setAttribute(node, 'role', 'math');
  adaptor.setAttribute(node, 'tabindex', '0');

  adaptor.setAttribute(lastChild, 'aria-hidden', 'true');
  return speech;
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
  } = outMath;
  const res: IOuterData = {};

  if (accessibility && accessibility.sre) {
    const speech = applySpeechToNode(adaptor, node, accessibility.sre);
    if (include_speech && speech) {
      res.speech = speech;
    }
  }
  
  if (include_mathml) {
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

  if (include_typst) {
    res.typstmath = toTypstML(math.root);
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
  /** Get information about the current labels. */
  res.labels = math.inputJax.parseOptions?.tags?.labels
    ? {...math.inputJax.parseOptions.tags.labels}
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
  } = outMath;
  let res: {
    mathml?: string,
    mathml_word?: string,
    asciimath?: string,
    latex?: string,
    svg?: string,
    speech?: string
  } = {};

  if (accessibility && accessibility.sre) {
    const speech = applySpeechToNode(adaptor, node, accessibility.sre);
    if (include_speech && speech) {
      res.speech = speech;
    }
  }

  if (include_mathml) {
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
    }
  } = outMath;
  let res: IOuterData = {};

  if (accessibility && accessibility.sre) {
    const speech = applySpeechToNode(adaptor, node, accessibility.sre);
    if (include_speech && speech) {
      res.speech = speech;
    }
  }

  if (include_mathml) {
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

export const MathJax = {
  assistiveMml: true,
  nonumbers: false,
  
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
  TexConvertToTypst: function(string, options: any={}) {
    const {display = true, metric = {}, accessibility = null} = options;
    const {em = 16, ex = 8, cwidth = 1200, lwidth = 100000, scale = 1} = metric;
    this.checkAccessibility(accessibility);
    MJ.docTeX.convert(string, {
      display, em, ex, containerWidth: cwidth, lineWidth: lwidth, scale,
    });
    const outputJax = MJ.docTeX.outputJax as any;
    return toTypstML(outputJax.math.root);
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
      html: OuterHTML(data, options.outMath, options.forPptx),
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
      html: OuterHTML(data, outMath), 
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
      html: OuterHTML(outerDataMathMl, options.outMath),
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
    return OuterHTML(outerDataAscii, options.outMath);
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
