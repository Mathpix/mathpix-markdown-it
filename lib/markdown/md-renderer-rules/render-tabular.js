"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTabularInline = exports.renderInlineTokenBlock = void 0;
var tsv_1 = require("../common/tsv");
var csv_1 = require("../common/csv");
var table_markdown_1 = require("../common/table-markdown");
var consts_1 = require("../common/consts");
var parse_mmd_element_1 = require("../../helpers/parse-mmd-element");
var common_1 = require("../highlight/common");
var tokenAttrGet = function (token, name) {
    if (!name) {
        return '';
    }
    if (!token.attrs) {
        return '';
    }
    var index = token.attrs.findIndex(function (item) { return item[0] === name; });
    if (index < 0) {
        return '';
    }
    return token.attrs[index][1];
};
var tokenAttrSet = function (token, name, value) {
    if (!name) {
        return;
    }
    if (!token.attrs) {
        token.attrs = [];
        token.attrs.push([name, value]);
        return;
    }
    var index = token.attrs.findIndex(function (item) { return item[0] === name; });
    if (index < 0) {
        token.attrs.push([name, value]);
        return;
    }
    token.attrs[index][1] = value;
};
var renderInlineTokenBlock = function (tokens, options, env, slf, isSubTable, highlight) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    if (isSubTable === void 0) { isSubTable = false; }
    if (highlight === void 0) { highlight = null; }
    var nextToken, result = '', needLf = false;
    var arrTsv = [];
    var arrCsv = [];
    var arrMd = [];
    var arrRow = [];
    var arrRowCsv = [];
    var arrRowMd = [];
    var cell = '';
    var cellCsv = '';
    var cellMd = '';
    var align = '';
    var colspan = 0, rowspan = [], mr = 0;
    for (var idx = 0; idx < tokens.length; idx++) {
        var token = tokens[idx];
        if (token.hidden) {
            return { table: '', tsv: '', tableMd: '', align: '' };
        }
        if (token.n !== -1 && idx && tokens[idx - 1].hidden) {
            result += '\n';
        }
        if (token.token === 'table_open' || token.token === 'tbody_open') {
            arrTsv = [];
            arrCsv = [];
            arrMd = [];
            arrRow = [];
            arrRowCsv = [];
            arrRowMd = [];
            if (!align) {
                align = token.latex;
            }
        }
        if (token.token === 'tr_open') {
            arrRow = [];
            arrRowCsv = [];
            arrRowMd = [];
        }
        if (token.token === 'tr_close') {
            arrTsv.push(arrRow);
            arrCsv.push(arrRowCsv);
            arrMd.push(arrRowMd);
            var l = arrRow && arrRow.length > 0 ? arrRow.length : 0;
            var l2 = rowspan && rowspan.length > 0 ? rowspan.length : 0;
            if (l < l2) {
                for (var k = l; k < l2; k++) {
                    if (rowspan[k]) {
                        if (rowspan[k][1] && rowspan[k][1] > 1) {
                            for (var i = 0; i < rowspan[k][1]; i++) {
                                arrRow.push('');
                                arrRowCsv.push('');
                                arrRowMd.push('');
                            }
                        }
                        else {
                            arrRow.push('');
                            arrRowCsv.push('');
                            arrRowMd.push('');
                        }
                        rowspan[k][0] -= 1;
                    }
                }
            }
        }
        if (token.token === 'td_open') {
            cell = '';
            cellCsv = '';
            cellMd = '';
            colspan = tokenAttrGet(token, 'colspan');
            colspan = colspan ? Number(colspan) : 0;
            mr = tokenAttrGet(token, 'rowspan');
            mr = mr ? Number(mr) : 0;
            if (highlight) {
                var styles = tokenAttrGet(token, 'style');
                var dataAttrsStyle = (0, common_1.getStyleFromHighlight)(highlight);
                tokenAttrSet(token, 'style', dataAttrsStyle + styles);
                tokenAttrSet(token, 'class', 'mmd-highlight');
            }
        }
        if (token.token === 'td_close') {
            var l = arrRow && arrRow.length > 0 ? arrRow.length : 0;
            var l2 = rowspan && rowspan.length > 0 ? rowspan.length : 0;
            if (l < l2) {
                for (var k = l; k < l2; k++) {
                    if (rowspan[k] && rowspan[k][0] && rowspan[k][0] > 0) {
                        if (rowspan[k] && rowspan[k][1] && rowspan[k][1] > 1) {
                            for (var i = 0; i < rowspan[k][1]; i++) {
                                arrRow.push('');
                                arrRowCsv.push('');
                                arrRowMd.push('');
                            }
                        }
                        else {
                            arrRow.push('');
                            arrRowCsv.push('');
                            arrRowMd.push('');
                        }
                        if (rowspan[k] && rowspan[k][0]) {
                            rowspan[k][0] -= 1;
                        }
                    }
                    else {
                        break;
                    }
                }
            }
            l = arrRow && arrRow.length > 0 ? arrRow.length : 0;
            if (!mr && rowspan[l] && rowspan[l][0] > 0) {
                arrRow.push(cell);
                arrRowCsv.push(cellCsv);
                arrRowMd.push(cellMd);
            }
            else {
                arrRow.push(cell);
                arrRowCsv.push(cellCsv);
                arrRowMd.push(cellMd);
                if (colspan && colspan > 1) {
                    for (var i = 0; i < colspan - 1; i++) {
                        arrRow.push('');
                        arrRowCsv.push('');
                        arrRowMd.push('');
                    }
                }
                if (mr && mr > 1) {
                    rowspan[l] = [mr - 1, colspan];
                }
            }
            colspan = 0;
        }
        if (token.token === 'inline') {
            var content = '';
            if (token.children) {
                for (var j = 0; j < token.children.length; j++) {
                    var child = token.children[j];
                    if (child.type === "tabular_inline" || isSubTable) {
                        child.isSubTable = true;
                    }
                    content += slf.renderInline([child], options, env);
                    if (child.ascii) {
                        cell += child.ascii_tsv ? child.ascii_tsv : child.ascii;
                        cellCsv += child.ascii_csv ? child.ascii_csv : child.ascii;
                    }
                    else {
                        if (token.type === 'subTabular') {
                            if ((_a = token.parents) === null || _a === void 0 ? void 0 : _a.length) {
                                cell += child.tsv ? child.tsv.join(',') : child.content;
                                cellCsv += child.csv ? child.csv.join(',') : child.content;
                            }
                            else {
                                cell += child.tsv
                                    ? '"' + (0, tsv_1.TsvJoin)(child.tsv, options) + '"'
                                    : child.content;
                                cellCsv += child.csv
                                    ? (0, csv_1.CsvJoin)(child.csv, options, true)
                                    : child.content;
                            }
                        }
                        else {
                            cell += child.tsv ? child.tsv.join(',') : child.content;
                            cellCsv += child.csv ? child.csv.join(',') : child.content;
                        }
                    }
                    if (child.type === 'link_open') {
                        cell += child.attrGet('href');
                        cellCsv += child.attrGet('href');
                        var link = (0, table_markdown_1.getMdLink)(child, token, j);
                        link = link.replace(/\|/, '\\|');
                        if (link) {
                            cellMd += link;
                            if ((j + 1) < token.children.length) {
                                content += slf.renderInline([token.children[j + 1]], options, env);
                                j++;
                            }
                            if ((j + 2) < token.children.length) {
                                content += slf.renderInline([token.children[j + 2]], options, env);
                                j++;
                            }
                            continue;
                        }
                    }
                    if (child.type === 'text') {
                        var text = child.content;
                        text = text.replace(/\|/, '\\|');
                        cellMd += text;
                        continue;
                    }
                    cellMd += (0, table_markdown_1.getMdForChild)(child);
                    if (child.latex) {
                        if (options.outMath && options.outMath.table_markdown && options.outMath.table_markdown.math_as_ascii) {
                            if (child.ascii) {
                                cellMd += child.ascii_md ? child.ascii_md : child.ascii;
                                continue;
                            }
                        }
                        var begin_math_inline_delimiters = ((_d = (_c = (_b = options.outMath) === null || _b === void 0 ? void 0 : _b.table_markdown) === null || _c === void 0 ? void 0 : _c.math_inline_delimiters) === null || _d === void 0 ? void 0 : _d.length) > 1
                            ? (_f = (_e = options.outMath) === null || _e === void 0 ? void 0 : _e.table_markdown) === null || _f === void 0 ? void 0 : _f.math_inline_delimiters[0] : '$';
                        var end_math_inline_delimiters = ((_j = (_h = (_g = options.outMath) === null || _g === void 0 ? void 0 : _g.table_markdown) === null || _h === void 0 ? void 0 : _h.math_inline_delimiters) === null || _j === void 0 ? void 0 : _j.length) > 1
                            ? (_l = (_k = options.outMath) === null || _k === void 0 ? void 0 : _k.table_markdown) === null || _l === void 0 ? void 0 : _l.math_inline_delimiters[1] : '$';
                        var mdContent = consts_1.mathTokenTypes.includes(child.type)
                            ? begin_math_inline_delimiters + ((_m = child.content) === null || _m === void 0 ? void 0 : _m.trim()) + end_math_inline_delimiters
                            : child.latex;
                        cellMd += mdContent
                            .replace(/\|/g, '\\|')
                            .replace(/\n/g, ' ');
                    }
                    else {
                        if (child.type === 'image' || child.type === 'includegraphics') {
                            var src = child.attrGet('src');
                            cell += src;
                            cellCsv += src;
                            var img = "![".concat(child.attrGet('alt'), "](").concat(src, ")");
                            img = img.replace(/\|/, '\\|');
                            cellMd += img;
                        }
                        else {
                            var subTable = child.content.replace(/\|/, '\\|');
                            if (child.tableMd && child.tableMd.length) {
                                subTable = child.tableMd.map(function (item) { return (item.join(' ')); }).join(' <br> ');
                            }
                            cellMd += subTable;
                        }
                    }
                    if (child.tag === 'code') {
                        cellMd += child.markup;
                        continue;
                    }
                    if (child.type === 'smiles_inline') {
                        cellMd += '</smiles>';
                    }
                }
            }
            else {
                content = slf.renderInline([{ type: 'text', content: token.content }], options, env);
                cell += content;
                cellCsv += content;
                cellMd += content;
            }
            result += content;
            continue;
        }
        // Add token name, e.g. `<img`
        result += (token.n === -1 ? '</' : '<') + token.tag;
        // Encode attributes, e.g. `<img src="foo"`
        result += slf.renderAttrs(token);
        // Add a slash for self-closing tags, e.g. `<img src="foo" /`
        if (token.n === 0 && options.xhtmlOut) {
            result += ' /';
        }
        // Check if we need to add a newline after this tag
        needLf = true;
        if (token.n === 1) {
            if (idx + 1 < tokens.length) {
                nextToken = tokens[idx + 1];
                if (nextToken.token === 'inline' || nextToken.hidden) {
                    // Block-level tag containing an inline tag.
                    //
                    needLf = false;
                }
                else if (nextToken.n === -1 && nextToken.tag === token.tag) {
                    // Opening tag + closing tag of the same type. E.g. `<li></li>`.
                    //
                    needLf = false;
                }
            }
        }
        result += needLf ? '>\n' : '>';
    }
    return {
        table: result,
        tsv: arrTsv,
        csv: arrCsv,
        tableMd: arrMd,
        align: align
    };
};
exports.renderInlineTokenBlock = renderInlineTokenBlock;
var renderTabularInline = function (a, token, options, env, slf) {
    var _a;
    var _b = options.outMath, _c = _b.include_tsv, include_tsv = _c === void 0 ? false : _c, _d = _b.include_csv, include_csv = _d === void 0 ? false : _d, _e = _b.include_table_markdown, include_table_markdown = _e === void 0 ? false : _e, _f = _b.include_table_html, include_table_html = _f === void 0 ? true : _f;
    var tabular = '';
    if (!include_tsv && !include_csv && !include_table_html && !include_table_markdown) {
        return '';
    }
    var highlight = ((_a = token.highlights) === null || _a === void 0 ? void 0 : _a.length) ? token.highlights[0] : null;
    var data = (0, exports.renderInlineTokenBlock)(token.children, options, env, slf, token.isSubTable, highlight);
    token.tsv = data.tsv;
    token.csv = data.csv;
    token.tableMd = data.tableMd; //tableMarkdownJoin(data.tableMd, data.align);
    var className = 'inline-tabular';
    className += token.isSubTable ? ' sub-table' : '';
    if (include_table_html) {
        tabular = data.table;
    }
    var tsv = include_tsv && token.tsv
        ? "<tsv style=\"display: none\">".concat((0, parse_mmd_element_1.formatSource)((0, tsv_1.TsvJoin)(token.tsv, options), true), "</tsv>")
        : '';
    var tableMd = include_table_markdown && token.tableMd
        ? "<table-markdown style=\"display: none\">".concat((0, parse_mmd_element_1.formatSource)((0, table_markdown_1.tableMarkdownJoin)(data.tableMd, data.align), true), "</table-markdown>")
        : '';
    var csv = include_csv && token.csv
        ? "<csv style=\"display: none\">".concat((0, parse_mmd_element_1.formatSource)((0, csv_1.CsvJoin)(token.csv, options), true), "</csv>")
        : '';
    return "<div class=\"".concat(className, "\">").concat(tabular).concat(tsv).concat(tableMd).concat(csv, "</div>");
};
exports.renderTabularInline = renderTabularInline;
//# sourceMappingURL=render-tabular.js.map