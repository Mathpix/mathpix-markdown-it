"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MathJax = void 0;
var tslib_1 = require("tslib");
var mathjax_js_1 = require("mathjax-full/js/mathjax.js");
var tex_js_1 = require("mathjax-full/js/input/tex.js");
var mathml_js_1 = require("mathjax-full/js/input/mathml.js");
var svg_js_1 = require("mathjax-full/js/output/svg.js");
var asciimath_js_1 = require("mathjax-full/js/input/asciimath.js");
var html_js_1 = require("mathjax-full/js/handlers/html.js");
var browserAdaptor_js_1 = require("mathjax-full/js/adaptors/browserAdaptor.js");
var liteAdaptor_js_1 = require("mathjax-full/js/adaptors/liteAdaptor.js");
require("mathjax-full/js/input/tex/AllPackages.js");
var assistive_mml_js_1 = require("mathjax-full/js/a11y/assistive-mml.js");
var sre_1 = require("../sre");
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
var handler = html_js_1.RegisterHTMLHandler(adaptor);
/**
 * TODO: Added settings for it
 * */
assistive_mml_js_1.AssistiveMmlHandler(handler);
var texConfig = Object.assign({}, mathJaxConfig_1.default.TeX || {});
var mmlConfig = Object.assign({}, mathJaxConfig_1.default.MathML || {});
var svgConfig = Object.assign({}, mathJaxConfig_1.default.SVG || {});
// @ts-ignore
var MTeX = /** @class */ (function (_super) {
    tslib_1.__extends(MTeX, _super);
    function MTeX() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MTeX.prototype.formatError = function (error) {
        throw Error('TeX error: ' + error.message);
    };
    return MTeX;
}(tex_js_1.TeX));
// @ts-ignore
var mTex = new MTeX(texConfig);
var tex = new tex_js_1.TeX(texConfig);
var mml = new mathml_js_1.MathML(mmlConfig);
var svg = new svg_js_1.SVG(svgConfig);
var docTeX = mathjax_js_1.mathjax.document(domNode, { InputJax: tex, OutputJax: svg });
var mDocTeX = mathjax_js_1.mathjax.document(domNode, { InputJax: mTex, OutputJax: svg });
var docMathML = mathjax_js_1.mathjax.document(domNode, { InputJax: mml, OutputJax: svg });
var SerializedMmlVisitor_js_1 = require("mathjax-full/js/core/MmlTree/SerializedMmlVisitor.js");
var serialized_ascii_1 = require("./serialized-ascii");
var mathml_word_1 = require("./mathml-word");
var toMathML = (function (node) {
    var visitor = new SerializedMmlVisitor_js_1.SerializedMmlVisitor();
    return visitor.visitTree(node);
});
//MmlWordVisitor
var toMathMLWord = (function (node, options) {
    options = Object.assign(options, { aligned: true });
    var visitor = new mathml_word_1.MathMLVisitorWord(options);
    return visitor.visitTree(node);
});
var toAsciiML = (function (node, optionAscii) {
    var visitorA = new serialized_ascii_1.SerializedAsciiVisitor(optionAscii);
    var ascii = visitorA.visitTree(node);
    return ascii ? ascii.trim() : ascii;
});
var OuterData = function (node, math, outMath, forDocx, accessibility) {
    if (forDocx === void 0) { forDocx = false; }
    var _a = outMath.include_mathml, include_mathml = _a === void 0 ? false : _a, _b = outMath.include_mathml_word, include_mathml_word = _b === void 0 ? false : _b, _c = outMath.include_asciimath, include_asciimath = _c === void 0 ? false : _c, _d = outMath.include_latex, include_latex = _d === void 0 ? false : _d, _e = outMath.include_svg, include_svg = _e === void 0 ? true : _e, _f = outMath.include_speech, include_speech = _f === void 0 ? false : _f, _g = outMath.optionAscii, optionAscii = _g === void 0 ? {
        showStyle: false,
        extraBrackets: true
    } : _g;
    var res = {};
    var speech = '';
    if (accessibility) {
        if (accessibility.sre) {
            var lastChild = adaptor.lastChild(node);
            var mmlAssistive = adaptor.innerHTML(lastChild);
            speech = sre_1.getSpeech(accessibility.sre, mmlAssistive);
            adaptor.setAttribute(node, 'aria-label', speech);
            adaptor.setAttribute(node, 'role', "math");
        }
        if (!accessibility.assistiveMml) {
            var lastChild = adaptor.lastChild(node);
            adaptor.remove(lastChild);
            adaptor.removeAttribute(node, 'role');
            adaptor.removeAttribute(node, 'style');
            var firstChild = adaptor.firstChild(node);
            adaptor.removeAttribute(firstChild, 'aria-hidden');
        }
    }
    if (include_mathml) {
        res.mathml = toMathML(math.root);
    }
    if (include_mathml_word) {
        res.mathml_word = toMathMLWord(math.root, { forDocx: forDocx });
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
        res.svg = adaptor.outerHTML(node);
    }
    if (include_speech && speech) {
        res.speech = speech;
    }
    return res;
};
var OuterDataError = function (node, latex, error, outMath) {
    var _a = outMath.include_latex, include_latex = _a === void 0 ? false : _a, _b = outMath.include_svg, include_svg = _b === void 0 ? true : _b, _c = outMath.include_error, include_error = _c === void 0 ? false : _c;
    var res = {};
    if (include_error && error) {
        res.error = error.message;
    }
    if (include_latex) {
        res.latex = latex;
    }
    if (include_svg && node) {
        res.svg = adaptor.outerHTML(node);
    }
    return res;
};
var OuterDataAscii = function (node, math, outMath, forDocx) {
    if (forDocx === void 0) { forDocx = false; }
    var _a = outMath.include_mathml, include_mathml = _a === void 0 ? false : _a, _b = outMath.include_mathml_word, include_mathml_word = _b === void 0 ? false : _b, _c = outMath.include_asciimath, include_asciimath = _c === void 0 ? false : _c, _d = outMath.include_svg, include_svg = _d === void 0 ? true : _d;
    var res = {};
    if (include_mathml) {
        res.mathml = toMathML(math.root);
    }
    if (include_mathml_word) {
        res.mathml_word = toMathMLWord(math.root, { forDocx: forDocx });
    }
    if (include_asciimath) {
        res.asciimath = (math.math
            ? math.math
            : math.inputJax.processStrings ? '' : math.start.node.outerHTML);
    }
    if (include_svg) {
        res.svg = adaptor.outerHTML(node);
    }
    return res;
};
var formatSource = function (text) {
    return text.trim()
        .replace(/\u2062/g, '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
};
var formatSourceMML = function (text) {
    return text.trim()
        .replace(/&#xA0;/g, ' ')
        .replace(/\u00A0/g, ' ')
        .replace(/&nbsp;/g, ' ');
};
var OuterHTML = function (data, outMath) {
    var _a = outMath.include_mathml, include_mathml = _a === void 0 ? false : _a, _b = outMath.include_mathml_word, include_mathml_word = _b === void 0 ? false : _b, _c = outMath.include_asciimath, include_asciimath = _c === void 0 ? false : _c, _d = outMath.include_latex, include_latex = _d === void 0 ? false : _d, _e = outMath.include_svg, include_svg = _e === void 0 ? true : _e, _f = outMath.include_error, include_error = _f === void 0 ? false : _f, _g = outMath.include_speech, include_speech = _g === void 0 ? false : _g;
    var outHTML = '';
    if (include_mathml && data.mathml) {
        outHTML += '<mathml style="display: none">' + formatSourceMML(data.mathml) + '</mathml>';
    }
    if (include_mathml_word && data.mathml_word) {
        outHTML += '<mathmlword style="display: none">' + data.mathml_word + '</mathmlword>';
    }
    if (include_asciimath && data.asciimath) {
        if (!outHTML) {
            outHTML += '\n';
        }
        outHTML += '<asciimath style="display: none;">' + formatSource(data.asciimath) + '</asciimath>';
    }
    if (include_latex && data.latex) {
        if (!outHTML) {
            outHTML += '\n';
        }
        outHTML += '<latex style="display: none">' + formatSource(data.latex) + '</latex>';
    }
    if (include_speech && data.speech) {
        if (!outHTML) {
            outHTML += '\n';
        }
        outHTML += '<speech style="display: none">' + formatSource(data.speech) + '</speech>';
    }
    if (include_error && data.error) {
        if (!outHTML) {
            outHTML += '\n';
        }
        outHTML += '<error style="display: none">' + formatSource(data.error) + '</error>';
    }
    if (include_svg && data.svg) {
        if (!outHTML) {
            outHTML += '\n';
        }
        outHTML += data.svg;
    }
    return outHTML;
};
exports.MathJax = {
    //
    //  Return the stylesheet DOM node
    //
    Stylesheet: function () {
        return svg.styleSheet(mDocTeX);
    },
    TexConvert: function (string, options) {
        if (options === void 0) { options = {}; }
        var _a = options.display, display = _a === void 0 ? true : _a, _b = options.metric, metric = _b === void 0 ? {} : _b, _c = options.outMath, outMath = _c === void 0 ? {} : _c, _d = options.mathJax, mathJax = _d === void 0 ? {} : _d, _e = options.forDocx, forDocx = _e === void 0 ? {} : _e, _f = options.accessibility, accessibility = _f === void 0 ? false : _f;
        var _g = metric.em, em = _g === void 0 ? 16 : _g, _h = metric.ex, ex = _h === void 0 ? 8 : _h, _j = metric.cwidth, cwidth = _j === void 0 ? 1200 : _j, _k = metric.lwidth, lwidth = _k === void 0 ? 100000 : _k, _l = metric.scale, scale = _l === void 0 ? 1 : _l;
        var _m = mathJax.mtextInheritFont, mtextInheritFont = _m === void 0 ? false : _m;
        if (mtextInheritFont) {
            mDocTeX.outputJax.options.mtextInheritFont = true;
        }
        try {
            var node = mDocTeX.convert(string, {
                display: display,
                em: em,
                ex: ex,
                containerWidth: cwidth, lineWidth: lwidth, scale: scale
            });
            var outputJax = mDocTeX.outputJax;
            return OuterData(node, outputJax.math, outMath, forDocx, accessibility);
        }
        catch (err) {
            console.log('ERROR=>', err);
            if (outMath && outMath.include_svg) {
                var node = docTeX.convert(string, { display: display, em: em, ex: ex, containerWidth: cwidth, lineWidth: lwidth, scale: scale });
                return OuterDataError(node, string, err, outMath);
            }
            return OuterDataError(null, string, err, outMath);
        }
    },
    TexConvertToAscii: function (string, options) {
        if (options === void 0) { options = {}; }
        var _a = options.display, display = _a === void 0 ? true : _a, _b = options.metric, metric = _b === void 0 ? {} : _b, _c = options.outMath //, mathJax = {}
        , outMath = _c === void 0 ? {} : _c //, mathJax = {}
        ;
        var _d = metric.em, em = _d === void 0 ? 16 : _d, _e = metric.ex, ex = _e === void 0 ? 8 : _e, _f = metric.cwidth, cwidth = _f === void 0 ? 1200 : _f, _g = metric.lwidth, lwidth = _g === void 0 ? 100000 : _g, _h = metric.scale, scale = _h === void 0 ? 1 : _h;
        docTeX.convert(string, { display: display, em: em, ex: ex, containerWidth: cwidth, lineWidth: lwidth, scale: scale });
        var outputJax = docTeX.outputJax;
        var _j = outMath.optionAscii, optionAscii = _j === void 0 ? {
            showStyle: false,
            extraBrackets: true
        } : _j;
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
    Typeset: function (string, options) {
        if (options === void 0) { options = {}; }
        return OuterHTML(this.TexConvert(string, options), options.outMath);
    },
    TypesetSvgAndAscii: function (string, options) {
        if (options === void 0) { options = {}; }
        var _a = options.outMath, outMath = _a === void 0 ? {} : _a;
        var _b = outMath.include_asciimath, include_asciimath = _b === void 0 ? false : _b;
        options.outMath.include_asciimath = true;
        var data = this.TexConvert(string, options);
        options.outMath.include_asciimath = include_asciimath;
        return { html: OuterHTML(data, outMath), ascii: data.asciimath };
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
    AsciiMathToSvg: function (string, options) {
        if (options === void 0) { options = {}; }
        var _a = options.display, display = _a === void 0 ? true : _a, _b = options.metric, metric = _b === void 0 ? {} : _b, _c = options.outMath, outMath = _c === void 0 ? {} : _c, _d = options.forDocx, forDocx = _d === void 0 ? {} : _d;
        var _e = metric.em, em = _e === void 0 ? 16 : _e, _f = metric.ex, ex = _f === void 0 ? 8 : _f, _g = metric.cwidth, cwidth = _g === void 0 ? 1200 : _g, _h = metric.lwidth, lwidth = _h === void 0 ? 100000 : _h, _j = metric.scale, scale = _j === void 0 ? 1 : _j;
        var asciimath = new asciimath_js_1.AsciiMath({});
        var docAsciiMath = mathjax_js_1.mathjax.document(domNode, { InputJax: asciimath, OutputJax: svg });
        var node = docAsciiMath.convert(string, { display: display, em: em, ex: ex, containerWidth: cwidth, lineWidth: lwidth, scale: scale });
        var outputJax = docAsciiMath.outputJax;
        var outerDataAscii = OuterDataAscii(node, outputJax.math, outMath, forDocx);
        return OuterHTML(outerDataAscii, options.outMath);
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
        mTex.parseOptions.tags.reset(n);
    },
    GetLastEquationNumber: function () {
        var tags = mTex.parseOptions.tags;
        return tags.counter;
    }
};
//# sourceMappingURL=index.js.map