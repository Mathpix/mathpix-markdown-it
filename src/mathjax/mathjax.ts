import {mathjax} from 'mathjax-full/js/mathjax.js';
import {TeX} from 'mathjax-full/js/input/tex.js';
import {MathML} from "mathjax-full/js/input/mathml.js";
import {SVG} from 'mathjax-full/js/output/svg.js';
import {RegisterHTMLHandler} from 'mathjax-full/js/handlers/html.js';
import {browserAdaptor} from 'mathjax-full/js/adaptors/browserAdaptor.js';
import {liteAdaptor} from 'mathjax-full/js/adaptors/liteAdaptor.js';

import 'mathjax-full/js/input/tex/AllPackages.js';
/** Load configuration for additional package array */
import './helpers/array/ArrayConfiguration';
import {AssistiveMmlHandler} from'mathjax-full/js/a11y/assistive-mml.js';

import MathJaxConfig from './mathJaxConfig';
require("./my-BaseMappings");

import {BaseConfiguration} from 'mathjax-full/js/input/tex/base/BaseConfiguration.js';
BaseConfiguration.handler.macro.push('wasysym-mathchar0mo');
//wasysym-macros
BaseConfiguration.handler.macro.push('wasysym-macros');

const texConfig = Object.assign({}, MathJaxConfig.TeX || {});
/** for TSV/CSV, add the array package, which will add an additional name attribute that points to the environment */
const texTSVConfig = Object.assign({}, texConfig,  {
  packages: [].concat(texConfig['packages'], ['array'])
});
const mmlConfig = Object.assign({}, MathJaxConfig.MathML || {});
const svgConfig = Object.assign({}, MathJaxConfig.SVG || {});

// @ts-ignore
class MTeX extends TeX {
  formatError(error) {
    throw Error('TeX error: ' + error.message);
  }
}

// @ts-ignore
export const mml = new MathML(mmlConfig);
export const svg = new SVG(svgConfig);

export class MathJaxConfigure {
  public mTex;
  public tex;
  public texTSV;
  public mathjax;
  public adaptor;
  public domNode;
  public handler;

  public docTeX;
  public docTeXTSV;
  public mDocTeX;
  public docMathML;
  public docAsciiMath;
  
  constructor() {
    this.initTex();
    this.chooseAdaptor();
    
    this.setHandler(true);
  }

  chooseAdaptor = () => {
    try {
      document;
      if (document.getElementsByTagName('div').length > 0) {
        this.adaptor = browserAdaptor();
        this.domNode = document;
      } else {
        this.adaptor = liteAdaptor();
        this.domNode = '<html></html>';
      }
    }
    catch (e) {
      this.adaptor = liteAdaptor();
      this.domNode = '<html></html>';
    }
  };

  initTex = (nonumbers = false) => {
    if (nonumbers) {
      // @ts-ignore
      this.mTex = new MTeX(Object.assign({}, texConfig, {tags: "none"}));
      this.tex = new TeX(Object.assign({}, texConfig, {tags: "none"}));
      this.texTSV = new TeX(Object.assign({}, texTSVConfig, {tags: "none"}));
    } else {
      // @ts-ignore
      this.mTex = new MTeX(texConfig);
      this.tex = new TeX(texConfig);
      this.texTSV = new TeX(texTSVConfig);
    }
  }
  
  setHandler = (acssistiveMml = false, nonumbers = false) => {
    this.initTex(nonumbers)
    this.handler = RegisterHTMLHandler(this.adaptor);
    if (acssistiveMml) {
      AssistiveMmlHandler(this.handler);
    }

    this.docTeX = mathjax.document(this.domNode, {
      InputJax: this.tex,
      OutputJax: svg
    });    
    this.docTeXTSV = mathjax.document(this.domNode, {
      InputJax: this.texTSV,
      OutputJax: svg
    });
    this.mDocTeX= mathjax.document(this.domNode, {
      InputJax: this.mTex,
      OutputJax: svg
    });
    this.docMathML = mathjax.document(this.domNode, {
      InputJax: mml,
      OutputJax: svg
    });
  };
  
  changeHandler = (acssistiveMml = false, nonumbers = false) => {
    if (this.handler) {
      mathjax.handlers.unregister(this.handler);
    }
    this.setHandler(acssistiveMml, nonumbers);
  }
}
