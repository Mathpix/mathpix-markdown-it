"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMarkdownByElement = exports.parseMmdElement = exports.formatSourceMML = exports.formatSource = exports.formatSourceHtmlWord = exports.formatSourceHtml = void 0;
var formatSourceHtml = function (text, notTrim) {
    if (notTrim === void 0) { notTrim = false; }
    text = notTrim ? text : text.trim();
    return text
        .replace(/&amp;/g, '&')
        .replace(/&nbsp;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
};
exports.formatSourceHtml = formatSourceHtml;
var formatSourceHtmlWord = function (text, notTrim) {
    if (notTrim === void 0) { notTrim = false; }
    text = notTrim ? text : text.trim();
    return text
        .replace(/<maligngroup><\/maligngroup>/g, '<maligngroup/>')
        .replace(/<malignmark><\/malignmark>/g, '<malignmark/>')
        .replace(/&nbsp;/g, '&#xA0;');
};
exports.formatSourceHtmlWord = formatSourceHtmlWord;
var formatSource = function (text, notTrim) {
    if (notTrim === void 0) { notTrim = false; }
    text = notTrim ? text : text.trim();
    return text
        .replace(/\u2062/g, '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
};
exports.formatSource = formatSource;
var formatSourceMML = function (text) {
    return text.trim()
        .replace(/&#xA0;/g, ' ')
        .replace(/\u00A0/g, ' ')
        .replace(/&nbsp;/g, ' ');
};
exports.formatSourceMML = formatSourceMML;
var parseMmdElement = function (math_el, res) {
    var _a, _b;
    if (res === void 0) { res = []; }
    if (!math_el)
        return res;
    if (['MOLECULE', 'CHARTDATA'].includes((_a = math_el.tagName) === null || _a === void 0 ? void 0 : _a.toUpperCase())) {
        if ((_b = math_el.children) === null || _b === void 0 ? void 0 : _b.length) {
            for (var i = 0; i < math_el.children.length; i++) {
                res.push({
                    type: math_el.children[i].tagName.toLowerCase(),
                    value: (0, exports.formatSourceHtml)(math_el.children[i].innerHTML)
                });
            }
        }
        return res;
    }
    if (!math_el.children || !math_el.children.length)
        return res;
    for (var j = 0; j < math_el.children.length; j++) {
        var child = math_el.children[j];
        if (['smiles', 'smiles-inline'].includes(math_el.className) && child.tagName.toUpperCase() === 'SVG') {
            res.push({ type: "svg", value: child.outerHTML });
            continue;
        }
        if (["MATHML", "MATHMLWORD", "ASCIIMATH", "LATEX", "MJX-CONTAINER", "TABLE", "TSV", "CSV", "SMILES", "TABLE-MARKDOWN", "ERROR"].indexOf(child.tagName) !== -1) {
            if (child.tagName === "MJX-CONTAINER" || child.tagName === "TABLE") {
                if (child.tagName === "TABLE") {
                    res.push({ type: "html", value: child.outerHTML });
                }
                else {
                    res.push({ type: "svg", value: child.innerHTML });
                }
            }
            else {
                res.push({
                    type: child.tagName.toLowerCase(),
                    value: child.tagName === 'LATEX' || child.tagName === 'ASCIIMATH' || child.tagName === 'ERROR' || child.tagName === 'TSV' || child.tagName === 'CSV' || child.tagName === "TABLE-MARKDOWN" || child.tagName === 'SMILES'
                        ? (0, exports.formatSourceHtml)(child.innerHTML, (child.tagName === 'TSV' || child.tagName === 'CSV' || child.tagName === "TABLE-MARKDOWN"))
                        : child.tagName === 'MATHMLWORD'
                            ? (0, exports.formatSourceHtmlWord)(child.innerHTML)
                            : child.innerHTML
                });
            }
        }
    }
    return res;
};
exports.parseMmdElement = parseMmdElement;
var parseMarkdownByElement = function (el, include_sub_math) {
    if (include_sub_math === void 0) { include_sub_math = true; }
    var res = [];
    if (!el)
        return null;
    var querySelectorChem = 'pre > mol, svg > metadata > molecule';
    var querySelectorChart = 'svg > metadata > chartdata';
    var math_el = include_sub_math
        ? el.querySelectorAll('.math-inline, .math-block, .table_tabular, .inline-tabular, .smiles, .smiles-inline'
            + ', ' + querySelectorChem
            + ', ' + querySelectorChart)
        : el.querySelectorAll('div:not(.cell-item) > .math-inline, div:not(.cell-item) > .math-block, .table_tabular, div:not(.cell-item) > .inline-tabular, div:not(.cell-item) > .smiles, div:not(.cell-item) > .smiles-inline'
            + ', ' + querySelectorChem
            + ', ' + querySelectorChart);
    if (!math_el)
        return null;
    for (var i = 0; i < math_el.length; i++) {
        res = (0, exports.parseMmdElement)(math_el[i], res);
    }
    return res;
};
exports.parseMarkdownByElement = parseMarkdownByElement;
//# sourceMappingURL=parse-mmd-element.js.map