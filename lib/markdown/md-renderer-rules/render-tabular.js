"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTabularInline = exports.renderInlineTokenBlock = void 0;
var tsv_1 = require("../common/tsv");
var csv_1 = require("../common/csv");
var table_markdown_1 = require("../common/table-markdown");
var consts_1 = require("../common/consts");
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
exports.renderInlineTokenBlock = function (tokens, options, env, slf, isSubTable) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    if (isSubTable === void 0) { isSubTable = false; }
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
                    content += slf.renderInline([child], options);
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
                                    ? '"' + tsv_1.TsvJoin(child.tsv, options) + '"'
                                    : child.content;
                                cellCsv += child.csv
                                    ? csv_1.CsvJoin(child.csv, options, true)
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
                        var link = table_markdown_1.getMdLink(child, token, j);
                        link = link.replace(/\|/, '\\|');
                        if (link) {
                            cellMd += link;
                            if ((j + 1) < token.children.length) {
                                content += slf.renderInline([token.children[j + 1]], options);
                                j++;
                            }
                            if ((j + 2) < token.children.length) {
                                content += slf.renderInline([token.children[j + 2]], options);
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
                    cellMd += table_markdown_1.getMdForChild(child);
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
                            var img = "![" + child.attrGet('alt') + "](" + src + ")";
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
                content = slf.renderInline([{ type: 'text', content: token.content }], options);
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
exports.renderTabularInline = function (a, token, options, env, slf) {
    var _a = options.outMath, _b = _a.include_tsv, include_tsv = _b === void 0 ? false : _b, _c = _a.include_csv, include_csv = _c === void 0 ? false : _c, _d = _a.include_table_markdown, include_table_markdown = _d === void 0 ? false : _d, _e = _a.include_table_html, include_table_html = _e === void 0 ? true : _e;
    var tabular = '';
    if (!include_tsv && !include_csv && !include_table_html && !include_table_markdown) {
        return '';
    }
    var data = exports.renderInlineTokenBlock(token.children, options, env, slf, token.isSubTable);
    token.tsv = data.tsv;
    token.csv = data.csv;
    token.tableMd = data.tableMd; //tableMarkdownJoin(data.tableMd, data.align);
    if (include_table_html) {
        tabular = data.table;
    }
    var tsv = include_tsv && token.tsv
        ? "<tsv style=\"display: none\">" + tsv_1.TsvJoin(token.tsv, options) + "</tsv>"
        : '';
    var tableMd = include_table_markdown && token.tableMd
        ? "<table-markdown style=\"display: none\">" + table_markdown_1.tableMarkdownJoin(data.tableMd, data.align) + "</table-markdown>"
        : '';
    var csv = include_csv && token.csv
        ? "<csv style=\"display: none\">" + csv_1.CsvJoin(token.csv, options) + "</csv>"
        : '';
    return "<div class=\"inline-tabular\">" + tabular + tsv + tableMd + csv + "</div>";
};
//# sourceMappingURL=render-tabular.js.map