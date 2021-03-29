import {mathjax as MJ} from 'mathjax-full/js/mathjax.js';
import {TeX} from 'mathjax-full/js/input/tex.js';
import {MathML} from "mathjax-full/js/input/mathml.js";
import {SVG} from 'mathjax-full/js/output/svg.js';
import {AsciiMath} from 'mathjax-full/js/input/asciimath.js';
import {RegisterHTMLHandler} from 'mathjax-full/js/handlers/html.js';
import {browserAdaptor} from 'mathjax-full/js/adaptors/browserAdaptor.js';
import {liteAdaptor} from 'mathjax-full/js/adaptors/liteAdaptor.js';

import 'mathjax-full/js/input/tex/base/BaseConfiguration.js';
import 'mathjax-full/js/input/tex/ams/AmsConfiguration.js';
import 'mathjax-full/js/input/tex/noundefined/NoUndefinedConfiguration.js';
import 'mathjax-full/js/input/tex/boldsymbol/BoldsymbolConfiguration.js';
import 'mathjax-full/js/input/tex/newcommand/NewcommandConfiguration.js';
import 'mathjax-full/js/input/tex/unicode/UnicodeConfiguration.js';
import "mathjax-full/js/input/tex/color/ColorConfiguration.js";
import "mathjax-full/js/input/tex/mhchem/MhchemConfiguration.js";
import "mathjax-full/js/input/tex/enclose/EncloseConfiguration";
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
RegisterHTMLHandler(adaptor);

const texConfig = Object.assign({}, MathJaxConfig.TeX || {});
const mmlConfig = Object.assign({}, MathJaxConfig.MathML || {});
const svgConfig = Object.assign({}, MathJaxConfig.SVG || {});

const tex = new TeX(texConfig);
const mml = new MathML(mmlConfig);
const svg = new SVG(svgConfig);

let docTeX = MJ.document(domNode, { InputJax: tex, OutputJax: svg });
let docMathML = MJ.document(domNode, { InputJax: mml, OutputJax: svg });

import { SerializedMmlVisitor as MmlVisitor } from 'mathjax-full/js/core/MmlTree/SerializedMmlVisitor.js';
import { SerializedAsciiVisitor as AsciiVisitor } from './serialized-ascii';
import { MathMLVisitorWord } from './mathml-word';

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

const OuterData = (node, math, outMath, forDocx = false) => {
  const {
    include_mathml = false,
    include_mathml_word = false,
    include_asciimath = false,
    include_latex = false,
    include_svg = true,
    optionAscii = {
      showStyle: false,
      extraBrackets: true
    }} = outMath;
  let res: {
    mathml?: string,
    mathml_word?: string,
    asciimath?: string,
    latex?: string,
    svg?: string
  } = {};
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

const OuterDataAscii = (node, math, outMath, forDocx = false) => {
  const {
    include_mathml = false,
    include_mathml_word = false,
    include_asciimath = false,
    include_svg = true,
  } = outMath;
  let res: {
    mathml?: string,
    mathml_word?: string,
    asciimath?: string,
    latex?: string,
    svg?: string
  } = {};
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

const formatSource = (text: string) => {
  return text.trim()
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
    return svg.styleSheet(docTeX);
  },
  TexConvert: function(string, options: any={}) {
    const {display = true, metric = {}, outMath = {}, mathJax = {}, forDocx={}} = options;
    const {em = 16, ex = 8, cwidth = 1200, lwidth = 100000, scale = 1} = metric;
    const {mtextInheritFont = false} = mathJax;
    if (mtextInheritFont) {
      docTeX.outputJax.options.mtextInheritFont = true
    }
    const node = docTeX.convert(string, {display: display, em: em, ex: ex, containerWidth: cwidth, lineWidth: lwidth, scale: scale});
    const outputJax = docTeX.outputJax as any;
    return OuterData(node, outputJax.math, outMath, forDocx);
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

  TypesetMathML: function(string, display=true, metric: any={}) {
    const {em = 16, ex = 8, cwidth = 1200, lwidth = 100000, scale = 1} = metric;
    const node = docMathML.convert(string, {display: display, em: em, ex: ex, containerWidth: cwidth, lineWidth: lwidth, scale: scale});
    return adaptor.outerHTML(node);
  },

  AsciiMathToSvg: function(string, options: any={}) {
    const {display = true, metric = {}, outMath = {}, forDocx={}} = options;
    const {em = 16, ex = 8, cwidth = 1200, lwidth = 100000, scale = 1} = metric;
    const asciimath = new AsciiMath({});

    let docAsciiMath = MJ.document(domNode, { InputJax: asciimath, OutputJax: svg });
    const node = docAsciiMath.convert(string, {display: display, em: em, ex: ex, containerWidth: cwidth, lineWidth: lwidth, scale: scale});

    const outputJax = docAsciiMath.outputJax as any;
    const outerDataAscii = OuterDataAscii(node, outputJax.math, outMath, forDocx);
    return OuterHTML(outerDataAscii, options.outMath);
  },

  //
  //  Reset tags and labels
  //
  Reset: function (n = 0) {
    if (n) {n--} else {n = 0}
    tex.parseOptions.tags.reset(n);
  },
  GetLastEquationNumber: function () {
    const tags: any = tex.parseOptions.tags;
    return tags.counter;
  }
};
