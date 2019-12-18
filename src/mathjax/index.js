import {mathjax as MJ} from 'mathjax-full/js/mathjax.js';
import {TeX} from 'mathjax-full/js/input/tex.js';
import {MathML} from "mathjax-full/js/input/mathml.js";
import {SVG} from 'mathjax-full/js/output/svg.js';
import {HTMLMathItem} from 'mathjax-full/js/handlers/html/HTMLMathItem.js';
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
import MathJaxConfig from './mathJaxConfig';

require("./my-BaseMappings.js");

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


export const MathJax = {
  //
  //  Return the stylesheet DOM node
  //
  Stylesheet: function () {
    return svg.styleSheet(docTeX);
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
  Typeset: function(string, display=true, metric={}) {
    const {em = 16, ex = 8, cwidth = 1200, lwidth = 100000, scale = 1} = metric;
    const node = docTeX.convert(string, {display: display, em: em, ex: ex, containerWidth: cwidth, lineWidth: lwidth, scale: scale});
    return adaptor.outerHTML(node);
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

  TypesetMathML: function(string, display=true, metric={}) {
    const {em = 16, ex = 8, cwidth = 1200, lwidth = 100000, scale = 1} = metric;
    const node = docMathML.convert(string, {display: display, em: em, ex: ex, containerWidth: cwidth, lineWidth: lwidth, scale: scale});
    return adaptor.outerHTML(node);
  },

  //
  //  Reset tags and labels
  //
  Reset: function (n) {
    if (n) {n--} else {n = 0}
    tex.parseOptions.tags.reset(n);
  },
  GetLastEquationNumber: function () {
    return tex.parseOptions.tags.counter;
  }
};
