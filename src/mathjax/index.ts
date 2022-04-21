import {mathjax as MJ} from 'mathjax-full/js/mathjax.js';
import {TeX} from 'mathjax-full/js/input/tex.js';
import {MathML} from "mathjax-full/js/input/mathml.js";
import {SVG} from 'mathjax-full/js/output/svg.js';
import {AsciiMath} from 'mathjax-full/js/input/asciimath.js';
import {RegisterHTMLHandler} from 'mathjax-full/js/handlers/html.js';
import {browserAdaptor} from 'mathjax-full/js/adaptors/browserAdaptor.js';
import {liteAdaptor} from 'mathjax-full/js/adaptors/liteAdaptor.js';

import 'mathjax-full/js/input/tex/AllPackages.js';
import {AssistiveMmlHandler} from'mathjax-full/js/a11y/assistive-mml.js';
import { getSpeech } from '../sre';

import MathJaxConfig from './mathJaxConfig';

require("./my-BaseMappings");

import {BaseConfiguration} from 'mathjax-full/js/input/tex/base/BaseConfiguration.js';
BaseConfiguration.handler.macro.push('wasysym-mathchar0mo');
//wasysym-macros
BaseConfiguration.handler.macro.push('wasysym-macros');

var adaptor,
  domNode;

try {
  document;
  if (document.getElementsByTagName('div').length > 0) {
    adaptor = browserAdaptor();
    domNode = document;
  } else {
    adaptor = liteAdaptor();
    domNode = '<html></html>';
  }
}
catch (e) {
  adaptor = liteAdaptor();
  domNode = '<html></html>';
}

let handler: any = RegisterHTMLHandler(adaptor);

/**
 * TODO: Added settings for it 
 * */
AssistiveMmlHandler(handler);

const texConfig = Object.assign({}, MathJaxConfig.TeX || {});
const mmlConfig = Object.assign({}, MathJaxConfig.MathML || {});
const svgConfig = Object.assign({}, MathJaxConfig.SVG || {});

// @ts-ignore
class MTeX extends TeX {
  formatError(error) {
    throw Error('TeX error: ' + error.message);
  }
}

// @ts-ignore
const mTex = new MTeX(texConfig);
const tex = new TeX(texConfig);
const mml = new MathML(mmlConfig);
const svg = new SVG(svgConfig);

let docTeX = MJ.document(domNode, { InputJax: tex, OutputJax: svg });
let mDocTeX: MathDocument<any, any, any> = MJ.document(domNode, { InputJax: mTex, OutputJax: svg });
let docMathML = MJ.document(domNode, { InputJax: mml, OutputJax: svg });

import { SerializedMmlVisitor as MmlVisitor } from 'mathjax-full/js/core/MmlTree/SerializedMmlVisitor.js';
import { SerializedAsciiVisitor as AsciiVisitor } from './serialized-ascii';
import { MathMLVisitorWord } from './mathml-word';
import { MathDocument } from "mathjax-full/js/core/MathDocument";

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

const applySpeechToNode = (node, accessibility): string => {
  if (!accessibility || !accessibility.sre ) {
    return '';
  }
  const lastChild = adaptor.lastChild(node);
  const mmlAssistive = adaptor.innerHTML(lastChild);
  const speech = getSpeech(accessibility.sre, mmlAssistive);
  adaptor.setAttribute(node, 'aria-label', speech);
  adaptor.setAttribute(node, 'role', "math");
  adaptor.setAttribute(node, 'tabindex', "0");
  
  adaptor.setAttribute(lastChild, 'aria-hidden', "true");
  return speech;
};

const removeAssistiveMmlFromNode = (node, accessibility) => {
  if ( accessibility && accessibility.assistiveMml) {
    return;
  }
  const lastChild = adaptor.lastChild(node);
  adaptor.remove(lastChild);

  adaptor.removeAttribute(node, 'role');
  adaptor.removeAttribute(node, 'style');

  const firstChild = adaptor.firstChild(node);
  adaptor.removeAttribute(firstChild, 'aria-hidden');
};

const OuterData = (node, math, outMath, forDocx = false, accessibility?) => {
  const {
    include_mathml = false,
    include_mathml_word = false,
    include_asciimath = false,
    include_latex = false,
    include_svg = true,
    include_speech = false,
    optionAscii = {
      showStyle: false,
      extraBrackets: true
    }} = outMath;
  let res: {
    mathml?: string,
    mathml_word?: string,
    asciimath?: string,
    latex?: string,
    svg?: string,
    speech?: string
  } = {};

  const speech = applySpeechToNode(node, accessibility);
  removeAssistiveMmlFromNode(node, accessibility);
  
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

  if (include_speech && speech) {
    res.speech = speech;
  }
  return res;
};

const OuterDataError = (node, latex, error, outMath) => {
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

const OuterDataAscii = (node, math, outMath, forDocx = false, accessibility?) => {
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
    svg?: string
    speech?: string
  } = {};

  const speech = applySpeechToNode(node, accessibility);
  removeAssistiveMmlFromNode(node, accessibility);
  
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

  if (include_speech && speech) {
    res.speech = speech;
  }
  return res;
};

const OuterDataMathMl = (node, math, outMath, forDocx = false, accessibility?) => {
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
    svg?: string
    speech?: string
  } = {};

  const speech = applySpeechToNode(node, accessibility);
  removeAssistiveMmlFromNode(node, accessibility);
  
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

  if (include_speech && speech) {
    res.speech = speech;
  }
  return res;
};

const formatSource = (text: string) => {
  return text.trim()
    .replace(/\u2062/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

const formatSourceMML = (text: string) => {
  return text.trim()
    .replace( /&#xA0;/g, ' ')
    .replace( /\u00A0/g, ' ')
    .replace(/&nbsp;/g, ' ');
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
  //
  //  Return the stylesheet DOM node
  //
  Stylesheet: function () {
    return svg.styleSheet(mDocTeX);
  },
  TexConvert: function(string, options: any={}) {
    const {display = true, metric = {}, outMath = {}, mathJax = {}, forDocx={}, accessibility} = options;
    const {em = 16, ex = 8, cwidth = 1200, lwidth = 100000, scale = 1} = metric;
    const {mtextInheritFont = false} = mathJax;
    if (mtextInheritFont) {
      mDocTeX.outputJax.options.mtextInheritFont = true;
    }
    try {
      const node = mDocTeX.convert(string, {
        display: display, 
        em: em, 
        ex: ex, 
        containerWidth: cwidth, lineWidth: lwidth, scale: scale});
      const outputJax = mDocTeX.outputJax as any;
      return OuterData(node, outputJax.math, outMath, forDocx, accessibility);    
    } catch (err) {
      console.log('ERROR=>', err);
      if (outMath && outMath.include_svg) {
        const node = docTeX.convert(string, {display: display, em: em, ex: ex, containerWidth: cwidth, lineWidth: lwidth, scale: scale});
        return OuterDataError(node, string, err, outMath);
      }
      return OuterDataError(null, string, err, outMath);
    }
  },
  TexConvertToAscii: function(string, options: any={}) {
    const {display = true, metric = {},
      outMath = {}//, mathJax = {}
    } = options;
    const {em = 16, ex = 8, cwidth = 1200, lwidth = 100000, scale = 1} = metric;
    docTeX.convert(string, {display: display, em: em, ex: ex, containerWidth: cwidth, lineWidth: lwidth, scale: scale});
    const outputJax = docTeX.outputJax as any;
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
   * @param display {boolean}
   * @param metric {
   *    @param {number} em      The size of 1 em in pixels
   *    @param {number} ex      The size of 1 ex in pixels
   *    @param {number} cwidth  The container width in pixels
   *    @param {number} lwidth  The line breaking width in pixels
   *    @param {number} scale   The scaling factor (unitless)
   * }
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
   * @param display {boolean}
   * @param metric {
   *    @param {number} em      The size of 1 em in pixels
   *    @param {number} ex      The size of 1 ex in pixels
   *    @param {number} cwidth  The container width in pixels
   *    @param {number} lwidth  The line breaking width in pixels
   *    @param {number} scale   The scaling factor (unitless)
   * }
   */

  TypesetMathML: function(string, options: any={}) {
    const { display = true, metric = {}, outMath = {}, forDocx={}, accessibility } = options;
    const {em = 16, ex = 8, cwidth = 1200, lwidth = 100000, scale = 1} = metric;
    const node = docMathML.convert(string, {display: display, em: em, ex: ex, containerWidth: cwidth, lineWidth: lwidth, scale: scale});
    // return adaptor.outerHTML(node);
    
    const outputJax = docMathML.outputJax as any;
    const outerDataMathMl = OuterDataMathMl(node, outputJax.math, outMath, forDocx, accessibility);
    return OuterHTML(outerDataMathMl, options.outMath);
  },

  AsciiMathToSvg: function(string, options: any={}) {
    const {display = true, metric = {}, outMath = {}, forDocx={}, accessibility} = options;
    const {em = 16, ex = 8, cwidth = 1200, lwidth = 100000, scale = 1} = metric;
    const asciimath = new AsciiMath({});

    let docAsciiMath = MJ.document(domNode, { InputJax: asciimath, OutputJax: svg });
    const node = docAsciiMath.convert(string, {display: display, em: em, ex: ex, containerWidth: cwidth, lineWidth: lwidth, scale: scale});

    const outputJax = docAsciiMath.outputJax as any;
    const outerDataAscii = OuterDataAscii(node, outputJax.math, outMath, forDocx, accessibility);
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
