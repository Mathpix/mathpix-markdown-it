import { MathML } from "mathjax-full/js/input/mathml.js";
import { SVG } from 'mathjax-full/js/output/svg.js';
import { CHTML } from 'mathjax-full/js/output/chtml.js';
import { AsciiMath } from 'mathjax-full/js/input/asciimath.js';
import 'mathjax-full/js/input/tex/AllPackages.js';
/** Load configuration for additional package array */
import './helpers/array/ArrayConfiguration';
/** Load configuration for additional package icon */
import './helpers/icon/IconConfiguration';
export declare const mml: MathML<unknown, unknown, unknown>;
export declare const svg: SVG<unknown, unknown, unknown>;
export declare const chtml: CHTML<unknown, unknown, unknown>;
export declare const asciimath: AsciiMath<unknown, unknown, unknown>;
export declare class MathJaxConfigure {
    mTex: any;
    tex: any;
    texTSV: any;
    mathjax: any;
    adaptor: any;
    domNode: any;
    handler: any;
    docTeX: any;
    docTeXCHTML: any;
    docTeXTSV: any;
    mDocTeX: any;
    mDocTeXCHTML: any;
    docMathML: any;
    docAsciiMath: any;
    constructor();
    chooseAdaptor: () => void;
    initTex: (nonumbers?: boolean) => void;
    setHandler: (acssistiveMml?: boolean, nonumbers?: boolean) => void;
    changeHandler: (acssistiveMml?: boolean, nonumbers?: boolean) => void;
}
