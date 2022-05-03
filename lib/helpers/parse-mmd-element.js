"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMarkdownByElement = exports.parseMmdElement = exports.formatSourceMML = exports.formatSource = exports.formatSourceHtmlWord = exports.formatSourceHtml = void 0;
exports.formatSourceHtml = function (text, notTrim) {
    if (notTrim === void 0) { notTrim = false; }
    text = notTrim ? text : text.trim();
    return text
        .replace(/&amp;/g, '&')
        .replace(/&nbsp;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
};
exports.formatSourceHtmlWord = function (text, notTrim) {
    if (notTrim === void 0) { notTrim = false; }
    text = notTrim ? text : text.trim();
    return text
        .replace(/<maligngroup><\/maligngroup>/g, '<maligngroup/>')
        .replace(/<malignmark><\/malignmark>/g, '<malignmark/>')
        .replace(/&nbsp;/g, '&#xA0;');
};
exports.formatSource = function (text) {
    return text.trim()
        .replace(/\u2062/g, '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
};
exports.formatSourceMML = function (text) {
    return text.trim()
        .replace(/&#xA0;/g, ' ')
        .replace(/\u00A0/g, ' ')
        .replace(/&nbsp;/g, ' ');
};
exports.parseMmdElement = function (math_el, res) {
    if (res === void 0) { res = []; }
    if (!math_el || !math_el.children || !math_el.children.length)
        return res;
    for (var j = 0; j < math_el.children.length; j++) {
        var child = math_el.children[j];
        if (['smiles', 'smiles-inline'].includes(math_el.className) && child.tagName.toUpperCase() === 'SVG') {
            res.push({ type: "svg", value: child.outerHTML });
            continue;
        }
        if (["MATHML", "MATHMLWORD", "ASCIIMATH", "LATEX", "MJX-CONTAINER", "TABLE", "TSV", "SMILES", "TABLE-MARKDOWN", "ERROR"].indexOf(child.tagName) !== -1) {
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
                    value: child.tagName === 'LATEX' || child.tagName === 'ASCIIMATH' || child.tagName === 'ERROR' || child.tagName === 'TSV' || child.tagName === "TABLE-MARKDOWN" || child.tagName === 'SMILES'
                        ? exports.formatSourceHtml(child.innerHTML, (child.tagName === 'TSV' || child.tagName === "TABLE-MARKDOWN"))
                        : child.tagName === 'MATHMLWORD'
                            ? exports.formatSourceHtmlWord(child.innerHTML)
                            : child.innerHTML
                });
            }
        }
    }
    return res;
};
exports.parseMarkdownByElement = function (el, include_sub_math) {
    if (include_sub_math === void 0) { include_sub_math = true; }
    var res = [];
    if (!el)
        return null;
    var math_el = include_sub_math
        ? el.querySelectorAll('.math-inline, .math-block, .table_tabular, .inline-tabular, .smiles, .smiles-inline')
        : el.querySelectorAll('div > .math-inline, div > .math-block, .table_tabular, div > .inline-tabular, div > .smiles, div > .smiles-inline');
    if (!math_el)
        return null;
    for (var i = 0; i < math_el.length; i++) {
        res = exports.parseMmdElement(math_el[i], res);
    }
    return res;
};
//# sourceMappingURL=parse-mmd-element.js.map