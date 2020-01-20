"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mathjax_js_1 = require("mathjax-full/js/mathjax.js");
var tex_js_1 = require("mathjax-full/js/input/tex.js");
var mathml_js_1 = require("mathjax-full/js/input/mathml.js");
var svg_js_1 = require("mathjax-full/js/output/svg.js");
var html_js_1 = require("mathjax-full/js/handlers/html.js");
var browserAdaptor_js_1 = require("mathjax-full/js/adaptors/browserAdaptor.js");
var liteAdaptor_js_1 = require("mathjax-full/js/adaptors/liteAdaptor.js");
require("mathjax-full/js/input/tex/base/BaseConfiguration.js");
require("mathjax-full/js/input/tex/ams/AmsConfiguration.js");
require("mathjax-full/js/input/tex/noundefined/NoUndefinedConfiguration.js");
require("mathjax-full/js/input/tex/boldsymbol/BoldsymbolConfiguration.js");
require("mathjax-full/js/input/tex/newcommand/NewcommandConfiguration.js");
require("mathjax-full/js/input/tex/unicode/UnicodeConfiguration.js");
require("mathjax-full/js/input/tex/color/ColorConfiguration.js");
require("mathjax-full/js/input/tex/mhchem/MhchemConfiguration.js");
var mathJaxConfig_1 = require("./mathJaxConfig");
require("./my-BaseMappings");
var BaseConfiguration_js_1 = require("mathjax-full/js/input/tex/base/BaseConfiguration.js");
BaseConfiguration_js_1.BaseConfiguration.handler.macro.push('wasysym-mathchar0mo');
//wasysym-macros
BaseConfiguration_js_1.BaseConfiguration.handler.macro.push('wasysym-macros');
var adaptor, domNode;
try {
    document;
    if (document.getElementsByTagName('div').length > 0) {
        adaptor = browserAdaptor_js_1.browserAdaptor();
        domNode = document;
    }
    else {
        adaptor = liteAdaptor_js_1.liteAdaptor();
        domNode = '<html></html>';
    }
}
catch (e) {
    adaptor = liteAdaptor_js_1.liteAdaptor();
    domNode = '<html></html>';
}
html_js_1.RegisterHTMLHandler(adaptor);
var texConfig = Object.assign({}, mathJaxConfig_1.default.TeX || {});
var mmlConfig = Object.assign({}, mathJaxConfig_1.default.MathML || {});
var svgConfig = Object.assign({}, mathJaxConfig_1.default.SVG || {});
var tex = new tex_js_1.TeX(texConfig);
var mml = new mathml_js_1.MathML(mmlConfig);
var svg = new svg_js_1.SVG(svgConfig);
var docTeX = mathjax_js_1.mathjax.document(domNode, { InputJax: tex, OutputJax: svg });
var docMathML = mathjax_js_1.mathjax.document(domNode, { InputJax: mml, OutputJax: svg });
var SerializedMmlVisitor_js_1 = require("mathjax-full/js/core/MmlTree/SerializedMmlVisitor.js");
var visitor = new SerializedMmlVisitor_js_1.SerializedMmlVisitor();
var toMathML = (function (node) { return visitor.visitTree(node); });
var OuterHTML = function (node, math, outMath) {
    var _a = outMath.include_mathml, include_mathml = _a === void 0 ? true : _a, _b = outMath.include_asciimath, include_asciimath = _b === void 0 ? true : _b, _c = outMath.include_latex, include_latex = _c === void 0 ? true : _c, _d = outMath.include_svg, include_svg = _d === void 0 ? true : _d;
    var outHTML = '';
    if (include_mathml) {
        outHTML += '<mathml style="display: none">' + toMathML(math.root) + '</mathml>';
    }
    if (include_asciimath) {
        if (!outHTML) {
            outHTML += '\n';
        }
        outHTML += '<asciimath style="display: none">' + '</asciimath>';
    }
    if (include_latex) {
        if (!outHTML) {
            outHTML += '\n';
        }
        var original = (math.math
            ? math.math
            : math.inputJax.processStrings ? '' : math.start.node.outerHTML);
        outHTML += '<latex style="display: none">' + original + '</latex>';
    }
    if (include_svg) {
        if (!outHTML) {
            outHTML += '\n';
        }
        outHTML += adaptor.outerHTML(node);
    }
    return outHTML;
};
exports.MathJax = {
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
    Typeset: function (string, options) {
        if (options === void 0) { options = {}; }
        var _a = options.display, display = _a === void 0 ? true : _a, _b = options.metric, metric = _b === void 0 ? {} : _b, _c = options.outMath, outMath = _c === void 0 ? {} : _c;
        var _d = metric.em, em = _d === void 0 ? 16 : _d, _e = metric.ex, ex = _e === void 0 ? 8 : _e, _f = metric.cwidth, cwidth = _f === void 0 ? 1200 : _f, _g = metric.lwidth, lwidth = _g === void 0 ? 100000 : _g, _h = metric.scale, scale = _h === void 0 ? 1 : _h;
        var node = docTeX.convert(string, { display: display, em: em, ex: ex, containerWidth: cwidth, lineWidth: lwidth, scale: scale });
        var outputJax = docTeX.outputJax;
        return OuterHTML(node, outputJax.math, outMath); // adaptor.outerHTML(node);
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
    TypesetMathML: function (string, display, metric) {
        if (display === void 0) { display = true; }
        if (metric === void 0) { metric = {}; }
        var _a = metric.em, em = _a === void 0 ? 16 : _a, _b = metric.ex, ex = _b === void 0 ? 8 : _b, _c = metric.cwidth, cwidth = _c === void 0 ? 1200 : _c, _d = metric.lwidth, lwidth = _d === void 0 ? 100000 : _d, _e = metric.scale, scale = _e === void 0 ? 1 : _e;
        var node = docMathML.convert(string, { display: display, em: em, ex: ex, containerWidth: cwidth, lineWidth: lwidth, scale: scale });
        return adaptor.outerHTML(node);
    },
    //
    //  Reset tags and labels
    //
    Reset: function (n) {
        if (n === void 0) { n = 0; }
        if (n) {
            n--;
        }
        else {
            n = 0;
        }
        tex.parseOptions.tags.reset(n);
    },
    GetLastEquationNumber: function () {
        var tags = tex.parseOptions.tags;
        return tags.counter;
    }
};
//# sourceMappingURL=index.js.map