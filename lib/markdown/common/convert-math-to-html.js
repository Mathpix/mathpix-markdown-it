"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertMathToHtml = void 0;
var tslib_1 = require("tslib");
var mathjax_1 = require("../../mathjax/");
var utils_1 = require("../utils");
var labels_1 = require("./labels");
var consts_1 = require("../../helpers/consts");
var utils_2 = require("../../helpers/utils");
var consts_2 = require("./consts");
var parse_mmd_element_1 = require("../../helpers/parse-mmd-element");
/**
 * Returns true when token already contains MathML input (display or inline).
 * These tokens use a separate MathJax path: TypesetMathML().
 */
var isMathMLToken = function (token) {
    return token.type === 'display_mathML' || token.type === 'inline_mathML';
};
/**
 * Applies the typesetting output to the markdown-it token.
 * Mutates the token in-place.
 */
var applyTypesetResultToToken = function (token, res) {
    if (res.html != null)
        token.mathEquation = res.html;
    if (res.data != null) {
        token.mathData = res.data;
        token.widthEx = res.data.widthEx;
        token.heightEx = res.data.heightEx;
    }
    // Optional fields (present only when requested via outMath options)
    if (res.ascii != null)
        token.ascii = res.ascii;
    if (res.linear != null)
        token.linear = res.linear;
    if (res.ascii_tsv != null)
        token.ascii_tsv = res.ascii_tsv;
    if (res.ascii_csv != null)
        token.ascii_csv = res.ascii_csv;
    if (res.ascii_md != null)
        token.ascii_md = res.ascii_md;
    if (res.labels != null)
        token.labels = res.labels;
};
/**
 * Builds outMath options for AsciiMath/TSV/CSV/Markdown extraction.
 * Note: "tableTo*" options are enabled only for specific environments.
 */
var buildAsciiOutMath = function (outMath, token) {
    var shouldFlatten = consts_1.envArraysShouldBeFlattenInTSV.includes(token.math_env);
    return Object.assign({}, outMath, {
        optionAscii: {
            showStyle: false,
            extraBrackets: true,
            // We flatten arrays only for specific environments; otherwise output is noisy/unusable.
            tableToTsv: (outMath === null || outMath === void 0 ? void 0 : outMath.include_tsv) && shouldFlatten,
            tableToCsv: (outMath === null || outMath === void 0 ? void 0 : outMath.include_csv) && shouldFlatten,
            tableToMd: (outMath === null || outMath === void 0 ? void 0 : outMath.include_table_markdown) && shouldFlatten,
            isSubTable: token.isSubTable,
            // keep these defaults centralized in ./consts
            tsv_separators: tslib_1.__assign({}, consts_2.tsvSeparatorsDef),
            csv_separators: tslib_1.__assign({}, consts_2.csvSeparatorsDef),
            md_separators: tslib_1.__assign({}, consts_2.mdSeparatorsDef),
        },
    });
};
/**
 * Returns { html, data } for the requested output_format.
 * - output_format === 'latex': return original latex string (not MathJax HTML)
 * - output_format === 'mathml': we typically don't need extra SVG metrics
 * - default: return MathJax HTML + data (metrics)
 */
var buildFormatOutputs = function (params) {
    var outputFormat = params.outputFormat, inputLatex = params.inputLatex, renderedHtml = params.renderedHtml, renderedData = params.renderedData;
    var html = outputFormat === 'latex'
        ? (0, parse_mmd_element_1.formatSource)(inputLatex !== null && inputLatex !== void 0 ? inputLatex : '')
        : renderedHtml;
    var data = (outputFormat === 'latex' || outputFormat === 'mathml')
        ? null
        : renderedData;
    return { html: html, data: data };
};
/**
 * Typesets a single token according to its type and options:
 * - MathML tokens -> TypesetMathML()
 * - tokens requesting Ascii extraction -> TypesetSvgAndAscii()
 * - default -> Typeset()
 */
var typesetMathForToken = function (params) {
    var _a, _b, _c;
    var token = params.token, math = params.math, isBlock = params.isBlock, beginNumber = params.beginNumber, containerWidth = params.containerWidth, options = params.options;
    var outputFormat = (_a = options.outMath) === null || _a === void 0 ? void 0 : _a.output_format;
    // 1) MathML tokens: MathJax input is MathML (not TeX).
    if (isMathMLToken(token)) {
        var typeset_1 = mathjax_1.MathJax.TypesetMathML(math, {
            display: true,
            metric: { cwidth: containerWidth },
            outMath: options.outMath,
            accessibility: options.accessibility,
            renderingErrors: options.renderingErrors,
        });
        // Respect output_format where conversion is possible:
        // - 'mathml': return MathML source directly (we have it from the MathJax parse tree).
        // - 'latex': no MathML→LaTeX converter available; fall back to SVG.
        // - 'svg' (default): standard SVG rendering.
        if (outputFormat === 'mathml') {
            return {
                html: (0, parse_mmd_element_1.formatSourceMML)((_c = (_b = typeset_1.data) === null || _b === void 0 ? void 0 : _b.mathml) !== null && _c !== void 0 ? _c : math),
                data: null,
            };
        }
        return {
            html: typeset_1.html,
            data: typeset_1.data,
        };
    }
    mathjax_1.MathJax.Reset(beginNumber); // Reset is important for equation numbering stability across tokens.
    // 2) AsciiMath extraction requested
    if (token.return_asciimath) {
        var typeset_2 = mathjax_1.MathJax.TypesetSvgAndAscii(math, {
            display: isBlock,
            metric: { cwidth: containerWidth },
            outMath: buildAsciiOutMath(options.outMath, token),
            mathJax: options.mathJax,
            accessibility: options.accessibility,
            renderingErrors: options.renderingErrors,
        });
        var fmt_1 = buildFormatOutputs({
            outputFormat: outputFormat,
            inputLatex: token.inputLatex,
            renderedHtml: typeset_2.html,
            renderedData: typeset_2.data,
        });
        return tslib_1.__assign(tslib_1.__assign({}, fmt_1), { ascii: typeset_2.ascii, linear: typeset_2.linear, ascii_tsv: typeset_2.ascii_tsv, ascii_csv: typeset_2.ascii_csv, ascii_md: typeset_2.ascii_md, labels: typeset_2.labels });
    }
    // 3) Default TeX typesetting
    var typeset = mathjax_1.MathJax.Typeset(math, {
        display: isBlock,
        metric: { cwidth: containerWidth },
        outMath: options.outMath,
        mathJax: options.mathJax,
        forDocx: options.forDocx,
        forPptx: options.forPptx,
        accessibility: options.accessibility,
        nonumbers: options.nonumbers,
        renderingErrors: options.renderingErrors,
    });
    var fmt = buildFormatOutputs({
        outputFormat: outputFormat,
        inputLatex: token.inputLatex,
        renderedHtml: typeset.html,
        renderedData: typeset.data,
    });
    return tslib_1.__assign(tslib_1.__assign({}, fmt), { ascii: typeset.ascii, linear: typeset.linear, ascii_tsv: typeset.ascii_tsv, ascii_csv: typeset.ascii_csv, ascii_md: typeset.ascii_md, labels: typeset.labels });
};
/**
 * Converts a math token into HTML and attaches MathJax metadata to the token.
 * Also extracts equation labels and stores them in the shared labels list.
 */
var convertMathToHtml = function (state, token, options) {
    var math = token.content;
    var beginNumber = mathjax_1.MathJax.GetLastEquationNumber() + 1;
    try {
        var containerWidth = (options === null || options === void 0 ? void 0 : options.width) && options.width > 0
            ? options.width
            : (0, utils_1.getWidthFromDocument)(1200);
        var res = typesetMathForToken({
            token: token,
            math: math,
            isBlock: token.type !== 'inline_math',
            beginNumber: beginNumber,
            containerWidth: containerWidth,
            options: options,
        });
        applyTypesetResultToToken(token, res);
        // After typesetting, equation counter may have advanced.
        var number = mathjax_1.MathJax.GetLastEquationNumber();
        // Collect labels (e.g. \label{...}) so we can resolve refs later.
        var idLabels = '';
        if (token.labels) {
            var labelKeys = Object.keys(token.labels);
            idLabels = labelKeys.length
                ? encodeURIComponent(labelKeys.join('_'))
                : '';
            for (var key in token.labels) {
                var tagContent = token.labels[key].tag;
                // Parse label content as inline markdown-it tokens
                // so we can render it consistently in UI.
                var tagChildrenTokens = [];
                state.md.inline.parse(tagContent, state.md, state.env, tagChildrenTokens);
                (0, labels_1.addIntoLabelsList)({
                    key: key,
                    id: idLabels,
                    tag: tagContent,
                    tagId: token.labels[key].id,
                    tagChildrenTokens: tagChildrenTokens,
                    type: labels_1.eLabelType.equation
                });
            }
        }
        token.idLabels = idLabels;
        token.number = number;
        token.begin_number = beginNumber;
        // attrNumber is "current equation number range" used by render rules
        token.attrNumber = beginNumber >= number
            ? number.toString()
            : "".concat(beginNumber, ",").concat(number);
        return token;
    }
    catch (e) {
        console.error('ERROR [convertMathToHtml] MathJax =>', e.message, e);
        (0, utils_2.formatMathJaxError)(e, math, 'convertMathToHtml');
        token.error = { message: e.message, error: e };
        return token;
    }
};
exports.convertMathToHtml = convertMathToHtml;
//# sourceMappingURL=convert-math-to-html.js.map