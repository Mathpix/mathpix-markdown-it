import { TeX } from 'mathjax-full/js/input/tex.js';
import { MathML } from "mathjax-full/js/input/mathml.js";
import { SVG } from 'mathjax-full/js/output/svg.js';
import { AsciiMath } from 'mathjax-full/js/input/asciimath.js';
import 'mathjax-full/js/input/tex/AllPackages.js';
export declare const mTex: any;
export declare const tex: TeX<unknown, unknown, unknown>;
export declare const mml: MathML<unknown, unknown, unknown>;
export declare const svg: SVG<unknown, unknown, unknown>;
export declare const asciimath: AsciiMath<unknown, unknown, unknown>;
export declare class MathJaxConfigure {
    mathjax: any;
    adaptor: any;
    domNode: any;
    handler: any;
    docTeX: any;
    mDocTeX: any;
    docMathML: any;
    docAsciiMath: any;
    constructor();
    chooseAdaptor: () => void;
    setHandler: (acssistiveMml?: boolean) => void;
    changeHandler: (acssistiveMml?: boolean) => void;
}
