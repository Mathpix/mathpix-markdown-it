import 'mathjax-full/js/input/tex/base/BaseConfiguration.js';
import 'mathjax-full/js/input/tex/ams/AmsConfiguration.js';
import 'mathjax-full/js/input/tex/noundefined/NoUndefinedConfiguration.js';
import 'mathjax-full/js/input/tex/boldsymbol/BoldsymbolConfiguration.js';
import 'mathjax-full/js/input/tex/newcommand/NewcommandConfiguration.js';
import 'mathjax-full/js/input/tex/unicode/UnicodeConfiguration.js';
import "mathjax-full/js/input/tex/color/ColorConfiguration.js";
import "mathjax-full/js/input/tex/mhchem/MhchemConfiguration.js";
export declare const MathJax: {
    Stylesheet: () => unknown;
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
    Typeset: (string: any, options?: any) => string;
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
    TypesetMathML: (string: any, display?: boolean, metric?: any) => any;
    AsciiMathToSvg: (string: any, display?: boolean, metric?: any) => any;
    Reset: (n?: number) => void;
    GetLastEquationNumber: () => any;
};
