import {mathjax} from 'mathjax-full/js/mathjax.js';
import {TeX} from 'mathjax-full/js/input/tex.js';
import {AbstractTags, TagInfo} from 'mathjax-full/js/input/tex/Tags.js';
import {MathML} from "mathjax-full/js/input/mathml.js";
import {SVG} from 'mathjax-full/js/output/svg.js';
import {CHTML} from 'mathjax-full/js/output/chtml.js';
import { AsciiMath } from 'mathjax-full/js/input/asciimath.js';
import {RegisterHTMLHandler} from 'mathjax-full/js/handlers/html.js';
import {browserAdaptor} from 'mathjax-full/js/adaptors/browserAdaptor.js';
import {liteAdaptor} from 'mathjax-full/js/adaptors/liteAdaptor.js';

import 'mathjax-full/js/input/tex/AllPackages.js';
/** Load configuration for additional package array */
import './helpers/array/ArrayConfiguration';
/** Load configuration for additional package icon */
import './helpers/icon/IconConfiguration';

import {AssistiveMmlHandler} from'mathjax-full/js/a11y/assistive-mml.js';

//Fix MathJax error https://github.com/mathjax/MathJax/issues/3033#issuecomment-1511374166
import { Configuration } from "mathjax-full/js/input/tex/Configuration";
import { Other } from "./fix-unicode";
Configuration.create('fix-unicode', {fallback: {character: Other}});

import MathJaxConfig from './mathJaxConfig';
require("./my-BaseMappings");

import {BaseConfiguration} from 'mathjax-full/js/input/tex/base/BaseConfiguration.js';
BaseConfiguration.handler.macro.push('wasysym-mathchar0mo');
//wasysym-macros
BaseConfiguration.handler.macro.push('wasysym-macros');

/** Strange bug with using \tag. In MathJax 3.0.1 https://github.com/mathjax/MathJax/issues/2643#issuecomment-800576687
 * The tag information was not being reset when the equation was being re-rendered.
 * That left an extra tagging information object on the stack, and that ended up being the initial state for the next equation (instead of a blank one)
 *
 * It was fixed in MathJax 3.1 -
 * We can opt out of this when upgrading to version 3.1 and higher */
const startEquation = AbstractTags.prototype.startEquation;
AbstractTags.prototype.startEquation = function (math) {
  this['history'] = [];
  this['stack'] = [];
  this.clearTag();
  this.currentTag = new TagInfo('', undefined, undefined);
  startEquation.call(this, math);
}

const texConfig = Object.assign({}, MathJaxConfig.TeX || {});
/** for TSV/CSV, add the array package, which will add an additional name attribute that points to the environment */
const texTSVConfig = Object.assign({}, texConfig,  {
  packages: [].concat(texConfig['packages'], ['array'])
});
const mmlConfig = Object.assign({}, MathJaxConfig.MathML || {});
const svgConfig = Object.assign({}, MathJaxConfig.SVG || {});
const chtmlConfig = Object.assign({}, MathJaxConfig.CHTML || {});

// @ts-ignore
class MTeX extends TeX {
  formatError(error) {
    throw Error('TeX error: ' + error.message);
  }
}

// @ts-ignore
export const mml = new MathML(mmlConfig);
export const svg = new SVG(svgConfig);
export const chtml = new CHTML(chtmlConfig);
export const asciimath = new AsciiMath({});

export class MathJaxConfigure {
  public mTex;
  public tex;
  public texTSV;
  public mathjax;
  public adaptor;
  public domNode;
  public handler;

  public docTeX;
  public docTeXCHTML;
  public docTeXTSV;
  public mDocTeX;
  public mDocTeXCHTML;
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
    this.docTeXCHTML = mathjax.document(this.domNode, {
      InputJax: this.tex,
      OutputJax: chtml,
    });
    this.docTeXTSV = mathjax.document(this.domNode, {
      InputJax: this.texTSV,
      OutputJax: svg
    });
    this.mDocTeX= mathjax.document(this.domNode, {
      InputJax: this.mTex,
      OutputJax: svg
    });
    this.mDocTeXCHTML= mathjax.document(this.domNode, {
      InputJax: this.mTex,
      OutputJax: chtml,
    });
    this.docMathML = mathjax.document(this.domNode, {
      InputJax: mml,
      OutputJax: svg
    });
    this.docAsciiMath = mathjax.document(this.domNode, {
      InputJax: asciimath,
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
