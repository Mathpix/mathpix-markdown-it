"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MathJax = exports.OuterHTML = exports.TexValidationError = void 0;
var tslib_1 = require("tslib");
var mathjax_1 = require("./mathjax");
var SerializedMmlVisitor_js_1 = require("mathjax-full/js/core/MmlTree/SerializedMmlVisitor.js");
var Element_js_1 = require("mathjax-full/js/adaptors/lite/Element.js");
var serialized_ascii_1 = require("./serialized-ascii");
var mathml_word_1 = require("./mathml-word");
var sre_1 = require("../sre");
var parse_mmd_element_1 = require("../helpers/parse-mmd-element");
var TexParser_js_1 = require("mathjax-full/js/input/tex/TexParser.js");
var TexError_js_1 = require("mathjax-full/js/input/tex/TexError.js");
var utils_1 = require("../helpers/utils");
var utils_2 = require("./utils");
var utils_3 = require("../markdown/utils");
var MJ = new mathjax_1.MathJaxConfigure();
/**
 * Error returned by `MathpixMarkdownModel.validateTex` when parsing fails.
 * - `code`: MathJax `TexError.id` (e.g. `'UndefinedControlSequence'`, `'MissingArgFor'`) for parse errors;
 *   `'InvalidInput'` when `latex` is not a string (caller bug);
 *   `'InternalError'` when MathJax itself threw a non-TexError (parser crash);
 *   `'TexError'` is a defensive fallback if a future MathJax produces a TexError without an `.id` (does not occur in 3.2.2).
 * - `latex`: the input formula that triggered the error.
 */
var TexValidationError = /** @class */ (function (_super) {
    tslib_1.__extends(TexValidationError, _super);
    function TexValidationError(message, latex, code) {
        var _this = _super.call(this, message) || this;
        // Restore prototype chain (ES5 target breaks it on extends Error).
        Object.setPrototypeOf(_this, TexValidationError.prototype);
        _this.name = 'TexValidationError';
        _this.latex = latex;
        _this.code = code;
        return _this;
    }
    return TexValidationError;
}(Error));
exports.TexValidationError = TexValidationError;
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
        linear: data.linear,
        ascii_tsv: (data === null || data === void 0 ? void 0 : data.ascii_tsv) ? data.ascii_tsv.trim() : data.ascii_tsv,
        ascii_csv: (data === null || data === void 0 ? void 0 : data.ascii_csv) ? data.ascii_csv.trim() : data.ascii_csv,
        ascii_md: (data === null || data === void 0 ? void 0 : data.ascii_md) ? data.ascii_md.trim() : data.ascii_md
    };
});
var normalizeMathJaxA11y = function (adaptor, mjxContainer) {
    adaptor.setAttribute(mjxContainer, 'role', 'math');
    adaptor.setAttribute(mjxContainer, 'tabindex', '0');
    var svg = adaptor.firstChild(mjxContainer);
    if (svg) {
        adaptor.setAttribute(svg, 'aria-hidden', 'true');
    }
};
var makeAssistiveMmlAccessible = function (adaptor, mjxContainer) {
    var assistive = adaptor.lastChild(mjxContainer);
    var id = adaptor.getAttribute(assistive, 'id');
    if (!id) {
        id = exports.MathJax.nextAssistiveId();
        adaptor.setAttribute(assistive, 'id', id);
    }
    adaptor.setAttribute(mjxContainer, 'aria-labelledby', id);
    adaptor.removeAttribute(assistive, 'aria-hidden');
};
var applySpeechToNode = function (adaptor, mjxContainer, sre) {
    var assistive = adaptor.lastChild(mjxContainer); // mjx-assistive-mml
    var assistiveMml = adaptor.innerHTML(assistive);
    var speech = (0, sre_1.getSpeech)(sre, assistiveMml);
    adaptor.setAttribute(mjxContainer, 'aria-label', speech);
    adaptor.removeAttribute(assistive, 'aria-hidden');
    return speech;
};
/**
 * Applies MathJax accessibility attributes to an mjx-container:
 * - role="math", tabindex="0"
 * - hides SVG from AT
 * - either sets aria-label via SRE speech, or exposes assistive MathML via aria-labelledby
 */
var applyMathJaxA11y = function (adaptor, mjxContainer, accessibility, includeSpeechOutput) {
    if (includeSpeechOutput === void 0) { includeSpeechOutput = false; }
    if (!(accessibility === null || accessibility === void 0 ? void 0 : accessibility.sre) && !(accessibility === null || accessibility === void 0 ? void 0 : accessibility.assistiveMml)) {
        return {};
    }
    normalizeMathJaxA11y(adaptor, mjxContainer);
    // Prefer SRE if provided
    if (accessibility.sre) {
        var speech = applySpeechToNode(adaptor, mjxContainer, accessibility.sre);
        return includeSpeechOutput && speech ? { speech: speech } : {};
    }
    // Otherwise fallback to assistive MathML exposure
    if (accessibility.assistiveMml) {
        makeAssistiveMmlAccessible(adaptor, mjxContainer);
    }
    return {};
};
var OuterData = function (adaptor, node, math, outMath, forDocx, accessibility) {
    var _a, _b;
    if (forDocx === void 0) { forDocx = false; }
    var _c = outMath.include_mathml, include_mathml = _c === void 0 ? false : _c, _d = outMath.include_mathml_word, include_mathml_word = _d === void 0 ? false : _d, _e = outMath.include_asciimath, include_asciimath = _e === void 0 ? false : _e, _f = outMath.include_latex, include_latex = _f === void 0 ? false : _f, _g = outMath.include_linearmath, include_linearmath = _g === void 0 ? false : _g, _h = outMath.include_svg, include_svg = _h === void 0 ? true : _h, _j = outMath.include_speech, include_speech = _j === void 0 ? false : _j, _k = outMath.optionAscii, optionAscii = _k === void 0 ? {
        showStyle: false,
        extraBrackets: true,
    } : _k, _l = outMath.output_format, output_format = _l === void 0 ? 'svg' : _l;
    var res = {};
    var a11y = applyMathJaxA11y(adaptor, node, accessibility, include_speech);
    if (a11y.speech) {
        res.speech = a11y.speech;
    }
    if (include_mathml || output_format === 'mathml') {
        res.mathml = toMathML(math.root);
    }
    if (include_mathml_word) {
        res.mathml_word = toMathMLWord(math.root, { forDocx: forDocx });
    }
    if (include_asciimath || (optionAscii === null || optionAscii === void 0 ? void 0 : optionAscii.tableToCsv) || (optionAscii === null || optionAscii === void 0 ? void 0 : optionAscii.tableToTsv) || (optionAscii === null || optionAscii === void 0 ? void 0 : optionAscii.tableToMd) || include_linearmath) {
        var dataAscii = toAsciiML(math.root, optionAscii);
        if (include_asciimath || (optionAscii === null || optionAscii === void 0 ? void 0 : optionAscii.tableToCsv) || (optionAscii === null || optionAscii === void 0 ? void 0 : optionAscii.tableToTsv) || (optionAscii === null || optionAscii === void 0 ? void 0 : optionAscii.tableToMd)) {
            res.asciimath = dataAscii.ascii;
            res.asciimath_tsv = dataAscii.ascii_tsv;
            res.asciimath_csv = dataAscii.ascii_csv;
            res.asciimath_md = dataAscii.ascii_md;
        }
        if (include_linearmath) {
            res.linearmath = dataAscii.linear;
        }
    }
    if (include_latex) {
        res.latex = (math.math
            ? math.math
            : math.inputJax.processStrings ? '' : math.start.node.outerHTML);
    }
    if (include_svg) {
        res.svg = adaptor.outerHTML(node);
        if (node) {
            var mathDimensions = node instanceof Element_js_1.LiteElement
                ? (0, utils_2.getMathDimensions)(node)
                : node instanceof HTMLElement
                    ? (0, utils_2.getMathDimensions)(node)
                    : null;
            if (mathDimensions) {
                res.width = mathDimensions.containerWidth;
                res.widthEx = mathDimensions.widthEx;
                res.heightEx = mathDimensions.heightEx;
                res.height = mathDimensions.viewBoxHeight;
                res.heightAndDepth = mathDimensions.viewBoxHeightAndDepth;
            }
        }
    }
    var labelsSrc = (_b = (_a = math.inputJax.parseOptions) === null || _a === void 0 ? void 0 : _a.tags) === null || _b === void 0 ? void 0 : _b.labels;
    res.labels = labelsSrc && Object.keys(labelsSrc).length > 0
        ? tslib_1.__assign({}, labelsSrc) : null;
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
    var _a = outMath.include_mathml, include_mathml = _a === void 0 ? false : _a, _b = outMath.include_mathml_word, include_mathml_word = _b === void 0 ? false : _b, _c = outMath.include_asciimath, include_asciimath = _c === void 0 ? false : _c, _d = outMath.include_svg, include_svg = _d === void 0 ? true : _d, _e = outMath.include_speech, include_speech = _e === void 0 ? false : _e, _f = outMath.output_format, output_format = _f === void 0 ? 'svg' : _f;
    var res = {};
    var a11y = applyMathJaxA11y(adaptor, node, accessibility, include_speech);
    if (a11y.speech) {
        res.speech = a11y.speech;
    }
    if (include_mathml || output_format === 'mathml') {
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
    var _a = outMath.include_mathml, include_mathml = _a === void 0 ? false : _a, _b = outMath.include_mathml_word, include_mathml_word = _b === void 0 ? false : _b, _c = outMath.include_asciimath, include_asciimath = _c === void 0 ? false : _c, _d = outMath.include_svg, include_svg = _d === void 0 ? true : _d, _e = outMath.include_speech, include_speech = _e === void 0 ? false : _e, _f = outMath.include_linearmath, include_linearmath = _f === void 0 ? false : _f, _g = outMath.optionAscii, optionAscii = _g === void 0 ? {
        showStyle: false,
        extraBrackets: true
    } : _g, _h = outMath.output_format, output_format = _h === void 0 ? 'svg' : _h;
    var res = {};
    var a11y = applyMathJaxA11y(adaptor, node, accessibility, include_speech);
    if (a11y.speech) {
        res.speech = a11y.speech;
    }
    if (include_mathml || output_format === 'mathml') {
        res.mathml = toMathML(math.root);
    }
    if (include_mathml_word) {
        res.mathml_word = toMathMLWord(math.root, { forDocx: forDocx });
    }
    if (include_asciimath || include_linearmath) {
        var dataAscii = toAsciiML(math.root, optionAscii);
        if (include_asciimath) {
            res.asciimath = dataAscii.ascii;
        }
        if (include_linearmath) {
            res.linearmath = dataAscii.linear;
        }
    }
    if (include_svg) {
        res.svg = adaptor.outerHTML(node);
        if (node) {
            var mathDimensions = node instanceof Element_js_1.LiteElement
                ? (0, utils_2.getMathDimensions)(node)
                : node instanceof HTMLElement
                    ? (0, utils_2.getMathDimensions)(node)
                    : null;
            if (mathDimensions) {
                res.width = mathDimensions.containerWidth;
                res.widthEx = mathDimensions.widthEx;
                res.heightEx = mathDimensions.heightEx;
                res.height = mathDimensions.viewBoxHeight;
                res.heightAndDepth = mathDimensions.viewBoxHeightAndDepth;
            }
        }
    }
    return res;
};
var OuterHTML = function (data, outMath, forPptx) {
    if (forPptx === void 0) { forPptx = false; }
    var _a = outMath.include_mathml, include_mathml = _a === void 0 ? false : _a, _b = outMath.include_mathml_word, include_mathml_word = _b === void 0 ? false : _b, _c = outMath.include_asciimath, include_asciimath = _c === void 0 ? false : _c, _d = outMath.include_linearmath, include_linearmath = _d === void 0 ? false : _d, _e = outMath.include_latex, include_latex = _e === void 0 ? false : _e, _f = outMath.include_svg, include_svg = _f === void 0 ? true : _f, _g = outMath.include_error, include_error = _g === void 0 ? false : _g, _h = outMath.include_speech, include_speech = _h === void 0 ? false : _h;
    var outHTML = '';
    if (include_mathml && data.mathml) {
        if (forPptx) {
            outHTML += '<mathml>' + (0, parse_mmd_element_1.formatSourceMML)(data.mathml) + '</mathml>';
        }
        else {
            outHTML += '<mathml style="display: none;">' + (0, parse_mmd_element_1.formatSourceMML)(data.mathml) + '</mathml>';
        }
    }
    if (include_mathml_word && data.mathml_word) {
        outHTML += '<mathmlword style="display: none;">' + data.mathml_word + '</mathmlword>';
    }
    if (include_asciimath && data.asciimath) {
        if (!outHTML) {
            outHTML += '\n';
        }
        outHTML += '<asciimath style="display: none;">' + (0, parse_mmd_element_1.formatSource)(data.asciimath) + '</asciimath>';
    }
    if (include_linearmath && data.linearmath) {
        if (!outHTML) {
            outHTML += '\n';
        }
        outHTML += '<linearmath style="display: none;">' + (0, parse_mmd_element_1.formatSource)(data.linearmath) + '</linearmath>';
    }
    if (include_latex && data.latex) {
        if (!outHTML) {
            outHTML += '\n';
        }
        outHTML += '<latex style="display: none;">' + (0, parse_mmd_element_1.formatSource)(data.latex) + '</latex>';
    }
    if (include_speech && data.speech) {
        if (!outHTML) {
            outHTML += '\n';
        }
        outHTML += '<speech style="display: none;">' + (0, parse_mmd_element_1.formatSource)(data.speech) + '</speech>';
    }
    if (include_error && data.error) {
        if (!outHTML) {
            outHTML += '\n';
        }
        outHTML += '<error style="display: none;">' + (0, parse_mmd_element_1.formatSource)(data.error) + '</error>';
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
/**
 * Produces the rendered HTML string for a given output_format.
 *
 * Note: for "latex", this returns "" because the original LaTeX source is not
 * available at this level (IOuterData doesn't carry it). The caller
 * (buildFormatOutputs in convert-math-to-html.ts) replaces this empty string
 * with the formatted LaTeX source via formatSource(inputLatex).
 */
var renderByFormat = function (data, outMath, forPptx) {
    if (forPptx === void 0) { forPptx = false; }
    switch (outMath === null || outMath === void 0 ? void 0 : outMath.output_format) {
        case "latex":
            return "";
        case "mathml":
            return data.mathml ? (0, parse_mmd_element_1.formatSourceMML)(data.mathml) : "";
        default:
            return (0, exports.OuterHTML)(data, outMath, forPptx);
    }
};
exports.MathJax = {
    assistiveMml: true,
    nonumbers: false,
    _a11y: {
        renderKey: (0, utils_3.uid)(),
        counter: 0,
    },
    beginRender: function (renderKey) {
        this._a11y.renderKey = renderKey || (0, utils_3.uid)();
        this._a11y.counter = 0;
    },
    nextAssistiveId: function (prefix) {
        if (prefix === void 0) { prefix = 'mjx-mml-'; }
        this._a11y.counter += 1;
        return "".concat(prefix).concat(this._a11y.renderKey, "-").concat(this._a11y.counter);
    },
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
    /**
     * Validates a TeX expression using MathJax's parser without producing SVG output.
     * Runs `TexParser` directly on an isolated `MTeX` instance — skips MathItem/MathDocument,
     * post-filters, and the output jax. No side-effects on the rendering pipeline.
     *
     * @remarks Validator state (custom macros via `\newcommand`) persists across calls.
     * Pass `isolated: true` (or call `ResetValidateTex()`) after untrusted input.
     *
     * @param latex - The TeX source to validate. An empty or whitespace-only string returns `{ valid: true }`.
     * @param options.display - `true` (default) for block math, `false` for inline.
     * @param options.isolated - If `true`, drop accumulated `packageData` **before** this call. Default `false`. Asymmetric: macros defined by *this* call remain after return; call `resetValidateTex()` if you also want to drop them.
     * @returns `{ valid: true }` if parsing succeeds, `{ valid: false, error: TexValidationError }` otherwise. Never throws.
     */
    ValidateTex: function (latex, options) {
        if (options === void 0) { options = {}; }
        var _a = options !== null && options !== void 0 ? options : {}, _b = _a.display, display = _b === void 0 ? true : _b, _c = _a.isolated, isolated = _c === void 0 ? false : _c;
        if (typeof latex !== 'string') {
            var latexRepr = void 0;
            try {
                latexRepr = String(latex);
            }
            catch (_d) {
                latexRepr = '[unstringifiable]';
            }
            return {
                valid: false,
                error: new TexValidationError('latex must be a string', latexRepr, 'InvalidInput'),
            };
        }
        if (isolated)
            MJ.resetValidateTex();
        var validateInputJax = MJ.validateTex;
        var parseOptions = validateInputJax.parseOptions;
        try {
            parseOptions.clear();
            var stub = { inputData: {} };
            // Cast via unknown so StartEquationMath stays the source of truth for what startEquation reads.
            parseOptions.tags.startEquation(stub);
            // isInner: false → top-level math context, matching the render path.
            // Parse runs inside the constructor; mml() finalizes the tree and is the patch point exercised by the 'InternalError' test (do not remove).
            var parser = new TexParser_js_1.default(latex, { display: display, isInner: false }, parseOptions);
            // !root — defensive: mathjax-full 3.2.2 never returns falsy here, but the API does not contractually forbid it.
            var root = parser.mml();
            if (!root) {
                return {
                    valid: false,
                    error: new TexValidationError('parser produced no MML root', latex, 'InternalError'),
                };
            }
            return { valid: true };
        }
        catch (err) {
            // TexError isn't an Error subclass; duck-type .message and .id.
            var rawMessage = typeof (err === null || err === void 0 ? void 0 : err.message) === 'string'
                ? err.message
                : String(err);
            var code = typeof (err === null || err === void 0 ? void 0 : err.id) === 'string' ? err.id : undefined;
            if (err instanceof TexError_js_1.default || code) {
                return { valid: false, error: new TexValidationError(rawMessage, latex, code !== null && code !== void 0 ? code : 'TexError') };
            }
            return { valid: false, error: new TexValidationError(rawMessage, latex, 'InternalError') };
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
        var dataAscii = toAsciiML(outputJax.math.root, optionAscii);
        return dataAscii.ascii;
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
            html: renderByFormat(data, options.outMath, options.forPptx),
            labels: data.labels,
            ascii: data.asciimath,
            linear: data.linearmath,
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
            html: renderByFormat(data, outMath),
            ascii: data.asciimath,
            linear: data.linearmath,
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
        return {
            html: (outMath === null || outMath === void 0 ? void 0 : outMath.output_format) === 'mathml'
                ? (0, parse_mmd_element_1.formatSourceMML)(outerDataMathMl.mathml)
                : (0, exports.OuterHTML)(outerDataMathMl, options.outMath),
            data: tslib_1.__assign({}, outerDataMathMl)
        };
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
        return (outMath === null || outMath === void 0 ? void 0 : outMath.output_format) === 'mathml'
            ? (0, parse_mmd_element_1.formatSourceMML)(outerDataAscii.mathml)
            : (0, exports.OuterHTML)(outerDataAscii, options.outMath);
    },
    // Render-path tags only. Validator persists packageData across calls — use ResetValidateTex to drop.
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
    // Drops the validator instance; next call rebuilds with empty packageData.
    ResetValidateTex: function () {
        MJ.resetValidateTex();
    },
    GetLastEquationNumber: function () {
        var tags = MJ.mTex.parseOptions.tags;
        return tags.counter;
    }
};
//# sourceMappingURL=index.js.map