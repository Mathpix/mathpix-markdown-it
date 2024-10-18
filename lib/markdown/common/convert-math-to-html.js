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
/** Perform math to conversion to html and get additional data from MathJax to pass it to render rules */
var convertMathToHtml = function (state, token, options) {
    var _a, _b, _c;
    var math = token.content;
    var isBlock = token.type !== 'inline_math';
    var begin_number = mathjax_1.MathJax.GetLastEquationNumber() + 1;
    try {
        var cwidth = 1200;
        if (options && options.width && options.width > 0) {
            cwidth = options.width;
        }
        else {
            cwidth = (0, utils_1.getWidthFromDocument)(cwidth);
        }
        if (token.type === 'display_mathML' || token.type === 'inline_mathML') {
            var data = mathjax_1.MathJax.TypesetMathML(math, {
                display: true,
                metric: { cwidth: cwidth },
                outMath: options.outMath,
                accessibility: options.accessibility,
                renderingErrors: options.renderingErrors
            });
            token.mathEquation = data.html;
            token.mathData = data.data;
            token.widthEx = token.mathData.widthEx;
            token.heightEx = token.mathData.heightEx;
        }
        else {
            if (token.return_asciimath) {
                mathjax_1.MathJax.Reset(begin_number);
                var data = mathjax_1.MathJax.TypesetSvgAndAscii(math, {
                    display: isBlock,
                    metric: { cwidth: cwidth },
                    outMath: Object.assign({}, options.outMath, {
                        optionAscii: {
                            showStyle: false,
                            extraBrackets: true,
                            tableToTsv: ((_a = options.outMath) === null || _a === void 0 ? void 0 : _a.include_tsv)
                                && consts_1.envArraysShouldBeFlattenInTSV.includes(token.math_env),
                            tableToCsv: ((_b = options.outMath) === null || _b === void 0 ? void 0 : _b.include_csv)
                                && consts_1.envArraysShouldBeFlattenInTSV.includes(token.math_env),
                            tableToMd: ((_c = options.outMath) === null || _c === void 0 ? void 0 : _c.include_table_markdown)
                                && consts_1.envArraysShouldBeFlattenInTSV.includes(token.math_env),
                            isSubTable: token.isSubTable,
                            tsv_separators: tslib_1.__assign({}, consts_2.tsvSeparatorsDef),
                            csv_separators: tslib_1.__assign({}, consts_2.csvSeparatorsDef),
                            md_separators: tslib_1.__assign({}, consts_2.mdSeparatorsDef),
                        },
                    }),
                    mathJax: options.mathJax,
                    accessibility: options.accessibility,
                    renderingErrors: options.renderingErrors
                });
                token.mathEquation = data.html;
                token.mathData = data.data;
                token.ascii = data.ascii;
                token.ascii_tsv = data.ascii_tsv;
                token.ascii_csv = data.ascii_csv;
                token.ascii_md = data.ascii_md;
                token.labels = data.labels;
                token.widthEx = token.mathData.widthEx;
                token.heightEx = token.mathData.heightEx;
            }
            else {
                mathjax_1.MathJax.Reset(begin_number);
                var data = mathjax_1.MathJax.Typeset(math, { display: isBlock, metric: { cwidth: cwidth },
                    outMath: options.outMath, mathJax: options.mathJax, forDocx: options.forDocx,
                    accessibility: options.accessibility,
                    nonumbers: options.nonumbers,
                    renderingErrors: options.renderingErrors
                });
                token.mathEquation = data.html;
                token.mathData = data.data;
                token.ascii = data.ascii;
                token.ascii_tsv = data.ascii_tsv;
                token.ascii_csv = data.ascii_csv;
                token.ascii_md = data.ascii_md;
                token.labels = data.labels;
                token.widthEx = token.mathData.widthEx;
                token.heightEx = token.mathData.heightEx;
            }
        }
        var number = mathjax_1.MathJax.GetLastEquationNumber();
        var idLabels = '';
        if (token.labels) {
            /** generate parenID - needs to multiple labels */
            var labelsKeys = token.labels ? Object.keys(token.labels) : [];
            idLabels = (labelsKeys === null || labelsKeys === void 0 ? void 0 : labelsKeys.length) ? encodeURIComponent(labelsKeys.join('_')) : '';
            for (var key in token.labels) {
                var tagContent = token.labels[key].tag;
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
        token.begin_number = begin_number;
        token.attrNumber = begin_number >= number
            ? number.toString()
            : begin_number.toString() + ',' + number.toString();
        return token;
    }
    catch (e) {
        console.error('ERROR [convertMathToHtml] MathJax =>', e.message, e);
        (0, utils_2.formatMathJaxError)(e, math, 'convertMathToHtml');
        token.error = {
            message: e.message,
            error: e
        };
        return token;
    }
};
exports.convertMathToHtml = convertMathToHtml;
//# sourceMappingURL=convert-math-to-html.js.map