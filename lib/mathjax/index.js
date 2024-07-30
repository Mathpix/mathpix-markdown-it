"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MathJax = exports.OuterHTML = void 0;
var tslib_1 = require("tslib");
var mathjax_1 = require("./mathjax");
var SerializedMmlVisitor_js_1 = require("mathjax-full/js/core/MmlTree/SerializedMmlVisitor.js");
var Element_js_1 = require("mathjax-full/js/adaptors/lite/Element.js");
var serialized_ascii_1 = require("./serialized-ascii");
var mathml_word_1 = require("./mathml-word");
var sre_1 = require("../sre");
var parse_mmd_element_1 = require("../helpers/parse-mmd-element");
var utils_1 = require("../helpers/utils");
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
    var data = visitorA.visitTree(node);
    return {
        ascii: (data === null || data === void 0 ? void 0 : data.ascii) ? data.ascii.trim() : data.ascii,
        ascii_tsv: (data === null || data === void 0 ? void 0 : data.ascii_tsv) ? data.ascii_tsv.trim() : data.ascii_tsv,
        ascii_csv: (data === null || data === void 0 ? void 0 : data.ascii_csv) ? data.ascii_csv.trim() : data.ascii_csv,
        ascii_md: (data === null || data === void 0 ? void 0 : data.ascii_md) ? data.ascii_md.trim() : data.ascii_md,
    };
});
var applySpeechToNode = function (adaptor, node, sre) {
    var lastChild = adaptor.lastChild(node);
    var mmlAssistive = adaptor.innerHTML(lastChild);
    var speech = (0, sre_1.getSpeech)(sre, mmlAssistive);
    adaptor.setAttribute(node, 'aria-label', speech);
    adaptor.setAttribute(node, 'role', 'math');
    adaptor.setAttribute(node, 'tabindex', '0');
    adaptor.setAttribute(lastChild, 'aria-hidden', 'true');
    return speech;
};
var OuterData = function (adaptor, node, math, outMath, forDocx, accessibility) {
    var _a, _b, _c, _d;
    if (forDocx === void 0) { forDocx = false; }
    var _e = outMath.include_mathml, include_mathml = _e === void 0 ? false : _e, _f = outMath.include_mathml_word, include_mathml_word = _f === void 0 ? false : _f, _g = outMath.include_asciimath, include_asciimath = _g === void 0 ? false : _g, _h = outMath.include_latex, include_latex = _h === void 0 ? false : _h, _j = outMath.include_svg, include_svg = _j === void 0 ? true : _j, _k = outMath.include_speech, include_speech = _k === void 0 ? false : _k, _l = outMath.optionAscii, optionAscii = _l === void 0 ? {
        showStyle: false,
        extraBrackets: true,
    } : _l;
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
    if (include_asciimath || (optionAscii === null || optionAscii === void 0 ? void 0 : optionAscii.tableToCsv) || (optionAscii === null || optionAscii === void 0 ? void 0 : optionAscii.tableToTsv) || (optionAscii === null || optionAscii === void 0 ? void 0 : optionAscii.tableToMd)) {
        var dataAscii = toAsciiML(math.root, optionAscii);
        res.asciimath = dataAscii.ascii;
        res.asciimath_tsv = dataAscii.ascii_tsv;
        res.asciimath_csv = dataAscii.ascii_csv;
        res.asciimath_md = dataAscii.ascii_md;
    }
    if (include_latex) {
        res.latex = (math.math
            ? math.math
            : math.inputJax.processStrings ? '' : math.start.node.outerHTML);
    }
    if (include_svg) {
        res.svg = adaptor.outerHTML(node);
        if (node) {
            if (node instanceof Element_js_1.LiteElement) {
                var svgElement = ((_a = node.children) === null || _a === void 0 ? void 0 : _a.length)
                    ? node.children.find(function (item) { return item.kind === 'svg'; })
                    : null;
                var viewBox = svgElement ? (_b = svgElement.attributes) === null || _b === void 0 ? void 0 : _b.viewBox : '';
                var viewBoxArr = viewBox ? viewBox.split(' ') : [];
                var height = (viewBoxArr === null || viewBoxArr === void 0 ? void 0 : viewBoxArr.length) > 3 ? Math.abs(viewBoxArr[1]) / 1000 : 0;
                var heightAndDepth = (viewBoxArr === null || viewBoxArr === void 0 ? void 0 : viewBoxArr.length) > 3 ? Math.abs(viewBoxArr[3]) / 1000 : 0;
                res.height = height;
                res.heightAndDepth = heightAndDepth;
            }
            else {
                if (node instanceof HTMLElement) {
                    var svgElements = node.getElementsByTagName('svg');
                    var svgElement = svgElements ? svgElements[0] : null;
                    var viewBox = svgElement ? svgElement.getAttribute('viewBox') : '';
                    var viewBoxArr = viewBox ? viewBox.split(' ') : [];
                    var height = (viewBoxArr === null || viewBoxArr === void 0 ? void 0 : viewBoxArr.length) > 3 ? Math.abs(Number(viewBoxArr[1])) / 1000 : 0;
                    var heightAndDepth = (viewBoxArr === null || viewBoxArr === void 0 ? void 0 : viewBoxArr.length) > 3 ? Math.abs(Number(viewBoxArr[3])) / 1000 : 0;
                    res.height = height;
                    res.heightAndDepth = heightAndDepth;
                }
            }
        }
    }
    /** Get information about the current labels. */
    res.labels = ((_d = (_c = math.inputJax.parseOptions) === null || _c === void 0 ? void 0 : _c.tags) === null || _d === void 0 ? void 0 : _d.labels)
        ? tslib_1.__assign({}, math.inputJax.parseOptions.tags.labels) : null;
    return res;
};
var OuterDataError = function (adaptor, node, latex, error, outMath) {
    var _a = outMath.include_latex, include_latex = _a === void 0 ? false : _a, _b = outMath.include_svg, include_svg = _b === void 0 ? true : _b;
    var res = {};
    if (error) {
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
        var data = toAsciiML(math.root, optionAscii);
        res.asciimath = data.ascii;
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
        outHTML += '<mathml style="display: none">' + (0, parse_mmd_element_1.formatSourceMML)(data.mathml) + '</mathml>';
    }
    if (include_mathml_word && data.mathml_word) {
        outHTML += '<mathmlword style="display: none">' + data.mathml_word + '</mathmlword>';
    }
    if (include_asciimath && data.asciimath) {
        if (!outHTML) {
            outHTML += '\n';
        }
        outHTML += '<asciimath style="display: none;">' + (0, parse_mmd_element_1.formatSource)(data.asciimath) + '</asciimath>';
    }
    if (include_latex && data.latex) {
        if (!outHTML) {
            outHTML += '\n';
        }
        outHTML += '<latex style="display: none">' + (0, parse_mmd_element_1.formatSource)(data.latex) + '</latex>';
    }
    if (include_speech && data.speech) {
        if (!outHTML) {
            outHTML += '\n';
        }
        outHTML += '<speech style="display: none">' + (0, parse_mmd_element_1.formatSource)(data.speech) + '</speech>';
    }
    if (include_error && data.error) {
        if (!outHTML) {
            outHTML += '\n';
        }
        outHTML += '<error style="display: none">' + (0, parse_mmd_element_1.formatSource)(data.error) + '</error>';
    }
    if (include_svg && data.svg) {
        if (!outHTML) {
            outHTML += '\n';
        }
        outHTML += data.svg;
    }
    return outHTML;
};
exports.OuterHTML = OuterHTML;
exports.MathJax = {
    assistiveMml: true,
    nonumbers: false,
    checkAccessibility: function (accessibility, nonumbers) {
        if (accessibility === void 0) { accessibility = null; }
        if (nonumbers === void 0) { nonumbers = false; }
        if (!this.assistiveMml && accessibility !== null) {
            this.assistiveMml = true;
            this.nonumbers = nonumbers;
            MJ.changeHandler(true, nonumbers);
            return;
        }
        if (this.assistiveMml && accessibility === null) {
            this.assistiveMml = false;
            this.nonumbers = nonumbers;
            MJ.changeHandler(false, nonumbers);
            return;
        }
        if (this.nonumbers !== nonumbers) {
            this.nonumbers = nonumbers;
            MJ.changeHandler(this.assistiveMml, nonumbers);
        }
    },
    //
    //  Return the stylesheet DOM node
    //
    Stylesheet: function () {
        return mathjax_1.svg.styleSheet(MJ.mDocTeX);
    },
    TexConvert: function (string, options, throwError) {
        var _a, _b, _c, _d, _e, _f;
        if (options === void 0) { options = {}; }
        if (throwError === void 0) { throwError = false; }
        var _g = options.display, display = _g === void 0 ? true : _g, _h = options.metric, metric = _h === void 0 ? {} : _h, _j = options.outMath, outMath = _j === void 0 ? {} : _j, _k = options.mathJax, mathJax = _k === void 0 ? {} : _k, _l = options.forDocx, forDocx = _l === void 0 ? {} : _l, _m = options.accessibility, accessibility = _m === void 0 ? null : _m, _o = options.nonumbers, nonumbers = _o === void 0 ? false : _o;
        var _p = metric.em, em = _p === void 0 ? 16 : _p, _q = metric.ex, ex = _q === void 0 ? 8 : _q, _r = metric.cwidth, cwidth = _r === void 0 ? 1200 : _r, _s = metric.lwidth, lwidth = _s === void 0 ? 100000 : _s, _t = metric.scale, scale = _t === void 0 ? 1 : _t;
        var _u = mathJax.mtextInheritFont, mtextInheritFont = _u === void 0 ? false : _u;
        this.checkAccessibility(accessibility, nonumbers);
        MJ.mDocTeX.outputJax.options.mtextInheritFont = mtextInheritFont;
        try {
            /** Here we use different package settings.
             * In order to flatten arrays in asccimath for TSV/CSV we add an extra attribute to the internal mml tree.
             * So for \begin{array} we add a name attribute that points to the environment */
            var node = ((_b = (_a = options === null || options === void 0 ? void 0 : options.outMath) === null || _a === void 0 ? void 0 : _a.optionAscii) === null || _b === void 0 ? void 0 : _b.tableToTsv) || ((_d = (_c = options === null || options === void 0 ? void 0 : options.outMath) === null || _c === void 0 ? void 0 : _c.optionAscii) === null || _d === void 0 ? void 0 : _d.tableToCsv) || ((_f = (_e = options === null || options === void 0 ? void 0 : options.outMath) === null || _e === void 0 ? void 0 : _e.optionAscii) === null || _f === void 0 ? void 0 : _f.tableToMd)
                ? MJ.docTeXTSV.convert(string, {
                    display: display,
                    em: em,
                    ex: ex,
                    containerWidth: cwidth, lineWidth: lwidth, scale: scale
                })
                : MJ.mDocTeX.convert(string, {
                    display: display,
                    em: em,
                    ex: ex,
                    containerWidth: cwidth, lineWidth: lwidth, scale: scale
                });
            var outputJax = MJ.mDocTeX.outputJax;
            return OuterData(MJ.adaptor, node, outputJax.math, outMath, forDocx, accessibility);
        }
        catch (err) {
            if (throwError) {
                throw err;
            }
            (0, utils_1.formatMathJaxError)(err, string, 'TexConvert');
            // if (err.message) {
            //   console.error(`[TexConvert] ERROR=>(${err.message}) in Latex: ${string}`);
            //   console.log('ERROR=>', err);
            //   console.log('[TexConvert] ERROR=>', JSON.stringify({
            //     message: err.message,
            //     latex: string
            //   }, null, 2))
            // } else {
            //   console.log('ERROR=>', err);
            // }
            if (outMath && outMath.include_svg) {
                var node = MJ.docTeX.convert(string, {
                    display: display,
                    em: em,
                    ex: ex,
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
            display: display,
            em: em,
            ex: ex,
            containerWidth: cwidth, lineWidth: lwidth,
            scale: scale,
        });
        var outputJax = MJ.docTeX.outputJax;
        var _k = outMath.optionAscii, optionAscii = _k === void 0 ? {
            showStyle: false,
            extraBrackets: true
        } : _k;
        var data = toAsciiML(outputJax.math.root, optionAscii);
        return data.ascii;
    },
    /**
     * Typeset a TeX expression and return the SVG tree for it
     *
     * @param string {string}
     * @param options {}
     */
    Typeset: function (string, options, throwError) {
        if (options === void 0) { options = {}; }
        if (throwError === void 0) { throwError = false; }
        var data = this.TexConvert(string, options, throwError);
        return {
            html: (0, exports.OuterHTML)(data, options.outMath),
            labels: data.labels,
            ascii: data.asciimath,
            ascii_tsv: data === null || data === void 0 ? void 0 : data['asciimath_tsv'],
            ascii_csv: data === null || data === void 0 ? void 0 : data['asciimath_csv'],
            ascii_md: data === null || data === void 0 ? void 0 : data['asciimath_md'],
            data: tslib_1.__assign({}, data)
        };
    },
    TypesetSvgAndAscii: function (string, options) {
        if (options === void 0) { options = {}; }
        var _a = options.outMath, outMath = _a === void 0 ? {} : _a;
        var _b = outMath.include_asciimath, include_asciimath = _b === void 0 ? false : _b;
        options.outMath.include_asciimath = true;
        var data = this.TexConvert(string, options);
        options.outMath.include_asciimath = include_asciimath;
        return {
            html: (0, exports.OuterHTML)(data, outMath),
            ascii: data.asciimath,
            labels: data.labels,
            ascii_tsv: data === null || data === void 0 ? void 0 : data['asciimath_tsv'],
            ascii_csv: data === null || data === void 0 ? void 0 : data['asciimath_csv'],
            ascii_md: data === null || data === void 0 ? void 0 : data['asciimath_md'],
            data: tslib_1.__assign({}, data)
        };
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
        return (0, exports.OuterHTML)(outerDataMathMl, options.outMath);
    },
    AsciiMathToSvg: function (string, options) {
        if (options === void 0) { options = {}; }
        var _a = options.display, display = _a === void 0 ? true : _a, _b = options.metric, metric = _b === void 0 ? {} : _b, _c = options.outMath, outMath = _c === void 0 ? {} : _c, _d = options.forDocx, forDocx = _d === void 0 ? {} : _d, _e = options.accessibility, accessibility = _e === void 0 ? null : _e;
        var _f = metric.em, em = _f === void 0 ? 16 : _f, _g = metric.ex, ex = _g === void 0 ? 8 : _g, _h = metric.cwidth, cwidth = _h === void 0 ? 1200 : _h, _j = metric.lwidth, lwidth = _j === void 0 ? 100000 : _j, _k = metric.scale, scale = _k === void 0 ? 1 : _k;
        this.checkAccessibility(accessibility);
        var node = MJ.docAsciiMath.convert(string, {
            display: display,
            em: em,
            ex: ex,
            containerWidth: cwidth, lineWidth: lwidth,
            scale: scale,
        });
        var outputJax = MJ.docAsciiMath.outputJax;
        var outerDataAscii = OuterDataAscii(MJ.adaptor, node, outputJax.math, outMath, forDocx, accessibility);
        return (0, exports.OuterHTML)(outerDataAscii, options.outMath);
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
        MJ.mTex.parseOptions.tags.reset(n);
    },
    GetLastEquationNumber: function () {
        var tags = MJ.mTex.parseOptions.tags;
        return tags.counter;
    }
};
//# sourceMappingURL=index.js.map