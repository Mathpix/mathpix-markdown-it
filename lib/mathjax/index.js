"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MathJax = void 0;
var mathjax_1 = require("./mathjax");
var SerializedMmlVisitor_js_1 = require("mathjax-full/js/core/MmlTree/SerializedMmlVisitor.js");
var serialized_ascii_1 = require("./serialized-ascii");
var mathml_word_1 = require("./mathml-word");
var sre_1 = require("../sre");
var parse_mmd_element_1 = require("../helpers/parse-mmd-element");
var MJ = new mathjax_1.MathJaxConfigure();
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
var applySpeechToNode = function (adaptor, node, sre) {
    var lastChild = adaptor.lastChild(node);
    var mmlAssistive = adaptor.innerHTML(lastChild);
    var speech = sre_1.getSpeech(sre, mmlAssistive);
    adaptor.setAttribute(node, 'aria-label', speech);
    adaptor.setAttribute(node, 'role', 'math');
    adaptor.setAttribute(node, 'tabindex', '0');
    adaptor.setAttribute(lastChild, 'aria-hidden', 'true');
    return speech;
};
var OuterData = function (adaptor, node, math, outMath, forDocx, accessibility) {
    if (forDocx === void 0) { forDocx = false; }
    var _a = outMath.include_mathml, include_mathml = _a === void 0 ? false : _a, _b = outMath.include_mathml_word, include_mathml_word = _b === void 0 ? false : _b, _c = outMath.include_asciimath, include_asciimath = _c === void 0 ? false : _c, _d = outMath.include_latex, include_latex = _d === void 0 ? false : _d, _e = outMath.include_svg, include_svg = _e === void 0 ? true : _e, _f = outMath.include_speech, include_speech = _f === void 0 ? false : _f, _g = outMath.optionAscii, optionAscii = _g === void 0 ? {
        showStyle: false,
        extraBrackets: true,
    } : _g;
    var res = {};
    if (accessibility && accessibility.sre) {
        var speech = applySpeechToNode(adaptor, node, accessibility.sre);
        if (include_speech && speech) {
            res.speech = speech;
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
    return res;
};
var OuterDataError = function (adaptor, node, latex, error, outMath) {
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
var OuterDataAscii = function (adaptor, node, math, outMath, forDocx, accessibility) {
    if (forDocx === void 0) { forDocx = false; }
    var _a = outMath.include_mathml, include_mathml = _a === void 0 ? false : _a, _b = outMath.include_mathml_word, include_mathml_word = _b === void 0 ? false : _b, _c = outMath.include_asciimath, include_asciimath = _c === void 0 ? false : _c, _d = outMath.include_svg, include_svg = _d === void 0 ? true : _d, _e = outMath.include_speech, include_speech = _e === void 0 ? false : _e;
    var res = {};
    if (accessibility && accessibility.sre) {
        var speech = applySpeechToNode(adaptor, node, accessibility.sre);
        if (include_speech && speech) {
            res.speech = speech;
        }
    }
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
var OuterDataMathMl = function (adaptor, node, math, outMath, forDocx, accessibility) {
    if (forDocx === void 0) { forDocx = false; }
    var _a = outMath.include_mathml, include_mathml = _a === void 0 ? false : _a, _b = outMath.include_mathml_word, include_mathml_word = _b === void 0 ? false : _b, _c = outMath.include_asciimath, include_asciimath = _c === void 0 ? false : _c, _d = outMath.include_svg, include_svg = _d === void 0 ? true : _d, _e = outMath.include_speech, include_speech = _e === void 0 ? false : _e, _f = outMath.optionAscii, optionAscii = _f === void 0 ? {
        showStyle: false,
        extraBrackets: true
    } : _f;
    var res = {};
    if (accessibility && accessibility.sre) {
        var speech = applySpeechToNode(adaptor, node, accessibility.sre);
        if (include_speech && speech) {
            res.speech = speech;
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
    if (include_svg) {
        res.svg = adaptor.outerHTML(node);
    }
    return res;
};
var OuterHTML = function (data, outMath) {
    var _a = outMath.include_mathml, include_mathml = _a === void 0 ? false : _a, _b = outMath.include_mathml_word, include_mathml_word = _b === void 0 ? false : _b, _c = outMath.include_asciimath, include_asciimath = _c === void 0 ? false : _c, _d = outMath.include_latex, include_latex = _d === void 0 ? false : _d, _e = outMath.include_svg, include_svg = _e === void 0 ? true : _e, _f = outMath.include_error, include_error = _f === void 0 ? false : _f, _g = outMath.include_speech, include_speech = _g === void 0 ? false : _g;
    var outHTML = '';
    if (include_mathml && data.mathml) {
        outHTML += '<mathml style="display: none">' + parse_mmd_element_1.formatSourceMML(data.mathml) + '</mathml>';
    }
    if (include_mathml_word && data.mathml_word) {
        outHTML += '<mathmlword style="display: none">' + data.mathml_word + '</mathmlword>';
    }
    if (include_asciimath && data.asciimath) {
        if (!outHTML) {
            outHTML += '\n';
        }
        outHTML += '<asciimath style="display: none;">' + parse_mmd_element_1.formatSource(data.asciimath) + '</asciimath>';
    }
    if (include_latex && data.latex) {
        if (!outHTML) {
            outHTML += '\n';
        }
        outHTML += '<latex style="display: none">' + parse_mmd_element_1.formatSource(data.latex) + '</latex>';
    }
    if (include_speech && data.speech) {
        if (!outHTML) {
            outHTML += '\n';
        }
        outHTML += '<speech style="display: none">' + parse_mmd_element_1.formatSource(data.speech) + '</speech>';
    }
    if (include_error && data.error) {
        if (!outHTML) {
            outHTML += '\n';
        }
        outHTML += '<error style="display: none">' + parse_mmd_element_1.formatSource(data.error) + '</error>';
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
    assistiveMml: true,
    checkAccessibility: function (accessibility) {
        if (accessibility === void 0) { accessibility = null; }
        if (!this.assistiveMml && accessibility !== null) {
            this.assistiveMml = true;
            MJ.changeHandler(true);
            return;
        }
        if (this.assistiveMml && accessibility === null) {
            this.assistiveMml = false;
            MJ.changeHandler(false);
        }
    },
    //
    //  Return the stylesheet DOM node
    //
    Stylesheet: function () {
        return mathjax_1.svg.styleSheet(MJ.mDocTeX);
    },
    TexConvert: function (string, options) {
        if (options === void 0) { options = {}; }
        var _a = options.display, display = _a === void 0 ? true : _a, _b = options.metric, metric = _b === void 0 ? {} : _b, _c = options.outMath, outMath = _c === void 0 ? {} : _c, _d = options.mathJax, mathJax = _d === void 0 ? {} : _d, _e = options.forDocx, forDocx = _e === void 0 ? {} : _e, _f = options.accessibility, accessibility = _f === void 0 ? null : _f;
        var _g = metric.em, em = _g === void 0 ? 16 : _g, _h = metric.ex, ex = _h === void 0 ? 8 : _h, _j = metric.cwidth, cwidth = _j === void 0 ? 1200 : _j, _k = metric.lwidth, lwidth = _k === void 0 ? 100000 : _k, _l = metric.scale, scale = _l === void 0 ? 1 : _l;
        var _m = mathJax.mtextInheritFont, mtextInheritFont = _m === void 0 ? false : _m;
        this.checkAccessibility(accessibility);
        if (mtextInheritFont) {
            MJ.mDocTeX.outputJax.options.mtextInheritFont = true;
        }
        try {
            var node = MJ.mDocTeX.convert(string, {
                display: display,
                em: em,
                ex: ex,
                containerWidth: cwidth, lineWidth: lwidth, scale: scale
            });
            var outputJax = MJ.mDocTeX.outputJax;
            return OuterData(MJ.adaptor, node, outputJax.math, outMath, forDocx, accessibility);
        }
        catch (err) {
            console.log('ERROR=>', err);
            if (outMath && outMath.include_svg) {
                var node = MJ.docTeX.convert(string, {
                    display: display, em: em, ex: ex,
                    containerWidth: cwidth, lineWidth: lwidth,
                    scale: scale,
                });
                return OuterDataError(MJ.adaptor, node, string, err, outMath);
            }
            return OuterDataError(MJ.adaptor, null, string, err, outMath);
        }
    },
    TexConvertToAscii: function (string, options) {
        if (options === void 0) { options = {}; }
        var _a = options.display, display = _a === void 0 ? true : _a, _b = options.metric, metric = _b === void 0 ? {} : _b, _c = options.outMath, outMath = _c === void 0 ? {} : _c, _d = options.accessibility, accessibility = _d === void 0 ? null : _d;
        var _e = metric.em, em = _e === void 0 ? 16 : _e, _f = metric.ex, ex = _f === void 0 ? 8 : _f, _g = metric.cwidth, cwidth = _g === void 0 ? 1200 : _g, _h = metric.lwidth, lwidth = _h === void 0 ? 100000 : _h, _j = metric.scale, scale = _j === void 0 ? 1 : _j;
        this.checkAccessibility(accessibility);
        MJ.docTeX.convert(string, {
            display: display, em: em, ex: ex,
            containerWidth: cwidth, lineWidth: lwidth,
            scale: scale,
        });
        var outputJax = MJ.docTeX.outputJax;
        var _k = outMath.optionAscii, optionAscii = _k === void 0 ? {
            showStyle: false,
            extraBrackets: true
        } : _k;
        return toAsciiML(outputJax.math.root, optionAscii);
    },
    /**
     * Typeset a TeX expression and return the SVG tree for it
     *
     * @param string {string}
     * @param options {}
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
     * @param options {}
     */
    TypesetMathML: function (string, options) {
        if (options === void 0) { options = {}; }
        var _a = options.display, display = _a === void 0 ? true : _a, _b = options.metric, metric = _b === void 0 ? {} : _b, _c = options.outMath, outMath = _c === void 0 ? {} : _c, _d = options.forDocx, forDocx = _d === void 0 ? {} : _d, _e = options.accessibility, accessibility = _e === void 0 ? null : _e;
        var _f = metric.em, em = _f === void 0 ? 16 : _f, _g = metric.ex, ex = _g === void 0 ? 8 : _g, _h = metric.cwidth, cwidth = _h === void 0 ? 1200 : _h, _j = metric.lwidth, lwidth = _j === void 0 ? 100000 : _j, _k = metric.scale, scale = _k === void 0 ? 1 : _k;
        this.checkAccessibility(accessibility);
        var node = MJ.docMathML.convert(string, { display: display, em: em, ex: ex, containerWidth: cwidth, lineWidth: lwidth, scale: scale });
        var outputJax = MJ.docMathML.outputJax;
        var outerDataMathMl = OuterDataMathMl(MJ.adaptor, node, outputJax.math, outMath, forDocx, accessibility);
        return OuterHTML(outerDataMathMl, options.outMath);
    },
    AsciiMathToSvg: function (string, options) {
        if (options === void 0) { options = {}; }
        var _a = options.display, display = _a === void 0 ? true : _a, _b = options.metric, metric = _b === void 0 ? {} : _b, _c = options.outMath, outMath = _c === void 0 ? {} : _c, _d = options.forDocx, forDocx = _d === void 0 ? {} : _d, _e = options.accessibility, accessibility = _e === void 0 ? null : _e;
        var _f = metric.em, em = _f === void 0 ? 16 : _f, _g = metric.ex, ex = _g === void 0 ? 8 : _g, _h = metric.cwidth, cwidth = _h === void 0 ? 1200 : _h, _j = metric.lwidth, lwidth = _j === void 0 ? 100000 : _j, _k = metric.scale, scale = _k === void 0 ? 1 : _k;
        this.checkAccessibility(accessibility);
        var node = MJ.docAsciiMath.convert(string, {
            display: display, em: em, ex: ex,
            containerWidth: cwidth, lineWidth: lwidth,
            scale: scale,
        });
        var outputJax = MJ.docAsciiMath.outputJax;
        var outerDataAscii = OuterDataAscii(MJ.adaptor, node, outputJax.math, outMath, forDocx, accessibility);
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
        mathjax_1.mTex.parseOptions.tags.reset(n);
    },
    GetLastEquationNumber: function () {
        var tags = mathjax_1.mTex.parseOptions.tags;
        return tags.counter;
    }
};
//# sourceMappingURL=index.js.map