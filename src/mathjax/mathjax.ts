import {mathjax} from 'mathjax-full/js/mathjax.js';
import {TeX} from 'mathjax-full/js/input/tex.js';
import {MathML} from "mathjax-full/js/input/mathml.js";
import {SVG} from 'mathjax-full/js/output/svg.js';
import { AsciiMath } from 'mathjax-full/js/input/asciimath.js';
import {RegisterHTMLHandler} from 'mathjax-full/js/handlers/html.js';
import {browserAdaptor} from 'mathjax-full/js/adaptors/browserAdaptor.js';
import {liteAdaptor} from 'mathjax-full/js/adaptors/liteAdaptor.js';

import 'mathjax-full/js/input/tex/AllPackages.js';
import {AssistiveMmlHandler} from'mathjax-full/js/a11y/assistive-mml.js';

import MathJaxConfig from './mathJaxConfig';
require("./my-BaseMappings");

import {BaseConfiguration} from 'mathjax-full/js/input/tex/base/BaseConfiguration.js';
BaseConfiguration.handler.macro.push('wasysym-mathchar0mo');
//wasysym-macros
BaseConfiguration.handler.macro.push('wasysym-macros');

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
export const mTex = new MTeX(texConfig);
export const tex = new TeX(texConfig);
export const mml = new MathML(mmlConfig);
export const svg = new SVG(svgConfig);
export const asciimath = new AsciiMath({});

export class MathJaxConfigure {
  public mathjax;
  public adaptor;
  public domNode;
  public handler;

  public docTeX;
  public mDocTeX;
  public docMathML;
  public docAsciiMath;
  
  constructor() {
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
  
  setHandler = (acssistiveMml = false) => {
    this.handler = RegisterHTMLHandler(this.adaptor);
    if (acssistiveMml) {
      AssistiveMmlHandler(this.handler);
    }

    this.docTeX = mathjax.document(this.domNode, {
      InputJax: tex,
      OutputJax: svg
    });
    this.mDocTeX= mathjax.document(this.domNode, {
      InputJax: mTex,
      OutputJax: svg
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
  
  changeHandler = (acssistiveMml = false) => {
    if (this.handler) {
      mathjax.handlers.unregister(this.handler);
    }
    this.setHandler(acssistiveMml);
  }
}
