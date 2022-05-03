import { MathJaxConfigure, mTex, svg } from './mathjax';

import { SerializedMmlVisitor as MmlVisitor } from 'mathjax-full/js/core/MmlTree/SerializedMmlVisitor.js';
import { SerializedAsciiVisitor as AsciiVisitor } from './serialized-ascii';
import { MathMLVisitorWord } from './mathml-word';
import { getSpeech } from '../sre';
import { TAccessibility } from "../mathpix-markdown-model";
import { formatSource, formatSourceMML } from "../helpers/parse-mmd-element";

const MJ = new MathJaxConfigure();

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

const toAsciiML = ((node, optionAscii) => {
  const visitorA = new AsciiVisitor(optionAscii);
  let ascii = visitorA.visitTree(node);
  return ascii ? ascii.trim() : ascii;
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

const OuterData = (adaptor, node, math, outMath, forDocx = false, accessibility?) => {
  const {
    include_mathml = false,
    include_mathml_word = false,
    include_asciimath = false,
    include_latex = false,
    include_svg = true,
    include_speech = false,
    optionAscii = {
      showStyle: false,
      extraBrackets: true,
    },
  } = outMath;
  const res: {
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
    res.asciimath = toAsciiML(math.root, optionAscii);
  }
  if (include_latex) {
    res.latex = (math.math
      ? math.math
      : math.inputJax.processStrings ? '' : math.start.node.outerHTML);
  }
  if (include_svg) {
    res.svg = adaptor.outerHTML(node)
  }
  return res;
};

const OuterDataError = (adaptor, node, latex, error, outMath) => {
  const {
    include_latex = false,
    include_svg = true,
    include_error = false
  } = outMath;
  let res: {
    mathml?: string,
    mathml_word?: string,
    asciimath?: string,
    latex?: string,
    svg?: string,
    error?: string
  } = {};

  if (include_error && error) {
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
    optionAscii = {
      showStyle: false,
      extraBrackets: true
    }
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
    res.asciimath = toAsciiML(math.root, optionAscii);
  }

  if (include_svg) {
    res.svg = adaptor.outerHTML(node)
  }

  return res;
};

const OuterHTML = (data, outMath) => {
  const {
    include_mathml = false,
    include_mathml_word = false,
    include_asciimath = false,
    include_latex = false,
    include_svg = true,
    include_error = false,
    include_speech = false
  } = outMath;
  let outHTML = '';
  if (include_mathml && data.mathml) {
    outHTML +=  '<mathml style="display: none">' + formatSourceMML(data.mathml) + '</mathml>';
  }
  if (include_mathml_word && data.mathml_word) {
    outHTML +=  '<mathmlword style="display: none">' + data.mathml_word + '</mathmlword>';
  }
  if (include_asciimath && data.asciimath) {
    if (!outHTML) { outHTML += '\n'}
    outHTML +=  '<asciimath style="display: none;">' + formatSource(data.asciimath) + '</asciimath>';
  }
  if (include_latex && data.latex) {
    if (!outHTML) { outHTML += '\n'}
    outHTML += '<latex style="display: none">' + formatSource(data.latex) + '</latex>';
  }    
  if (include_speech && data.speech) {
    if (!outHTML) { outHTML += '\n'}
    outHTML += '<speech style="display: none">' + formatSource(data.speech) + '</speech>';
  }  
  if (include_error && data.error) {
    if (!outHTML) { outHTML += '\n'}
    outHTML += '<error style="display: none">' + formatSource(data.error) + '</error>';
  }

  if (include_svg && data.svg) {
    if (!outHTML) { outHTML += '\n'}
    outHTML += data.svg;
  }

  return outHTML;
};

export const MathJax = {
  assistiveMml: true,
  
  checkAccessibility: function (accessibility: TAccessibility = null) {
    if (!this.assistiveMml && accessibility !== null) {
      this.assistiveMml = true;
      MJ.changeHandler(true);
      return;
    }
    
    if (this.assistiveMml && accessibility === null) {
      this.assistiveMml = false;
      MJ.changeHandler(false);
    }
  },
  
  //
  //  Return the stylesheet DOM node
  //
  Stylesheet: function () {
    return svg.styleSheet(MJ.mDocTeX);
  },
  TexConvert: function(string, options: any={}) {
    const {display = true, metric = {}, outMath = {}, mathJax = {}, forDocx={}, accessibility = null} = options;
    const {em = 16, ex = 8, cwidth = 1200, lwidth = 100000, scale = 1} = metric;
    const {mtextInheritFont = false} = mathJax;
    this.checkAccessibility(accessibility);
    
    if (mtextInheritFont) {
      MJ.mDocTeX.outputJax.options.mtextInheritFont = true;
    }
    try {
      const node = MJ.mDocTeX.convert(string, {
        display: display, 
        em: em, 
        ex: ex, 
        containerWidth: cwidth, lineWidth: lwidth, scale: scale});
      const outputJax = MJ.mDocTeX.outputJax as any;
      return OuterData(MJ.adaptor, node, outputJax.math, outMath, forDocx, accessibility);
    } catch (err) {
      console.log('ERROR=>', err);
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
    return toAsciiML(outputJax.math.root, optionAscii);
  },
  /**
   * Typeset a TeX expression and return the SVG tree for it
   *
   * @param string {string}
   * @param options {}
   */
  Typeset: function(string, options: any={}) {
    return OuterHTML(this.TexConvert(string, options), options.outMath);
  },

  TypesetSvgAndAscii: function(string, options: any={}) {
    const { outMath = {} } = options;
    const { include_asciimath = false } = outMath;
    options.outMath.include_asciimath = true;
    const data = this.TexConvert(string, options);
    options.outMath.include_asciimath = include_asciimath
    return {html: OuterHTML(data, outMath), ascii: data.asciimath};
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
    const outerDataMathMl = OuterDataMathMl(MJ.adaptor, node, outputJax.math, outMath, forDocx, accessibility);
    return OuterHTML(outerDataMathMl, options.outMath);
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
    mTex.parseOptions.tags.reset(n);
  },
  GetLastEquationNumber: function () {
    const tags: any = mTex.parseOptions.tags;
    return tags.counter;
  }
};
