"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTabularInline = void 0;
var tsv_1 = require("../common/tsv");
var table_markdown_1 = require("../common/table-markdown");
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
var renderInlineTokenBlock = function (tokens, options, env, slf) {
    var nextToken, result = '', needLf = false;
    var arrTsv = [];
    var arrMd = [];
    var arrRow = [];
    var arrRowMd = [];
    var cell = '';
    var cellMd = '';
    var align = '';
    var colspan = 0, rowspan = [], mr = 0;
    for (var idx = 0; idx < tokens.length; idx++) {
        var token = tokens[idx];
        // console.log('token=>', token)
        if (token.hidden) {
            return { table: '', tsv: '', tableMd: '', align: '' };
        }
        if (token.n !== -1 && idx && tokens[idx - 1].hidden) {
            result += '\n';
        }
        if (token.token === 'table_open' || token.token === 'tbody_open') {
            arrTsv = [];
            arrMd = [];
            arrRow = [];
            arrRowMd = [];
            if (!align) {
                align = token.latex;
            }
        }
        if (token.token === 'tr_open') {
            arrRow = [];
            arrRowMd = [];
        }
        if (token.token === 'tr_close') {
            arrTsv.push(arrRow);
            arrMd.push(arrRowMd);
            var l = arrRow && arrRow.length > 0 ? arrRow.length : 0;
            var l2 = rowspan && rowspan.length > 0 ? rowspan.length : 0;
            if (l < l2) {
                for (var k = l; k < l2; k++) {
                    if (rowspan[k]) {
                        if (rowspan[k][1] && rowspan[k][1] > 1) {
                            for (var i = 0; i < rowspan[k][1]; i++) {
                                arrRow.push('');
                                arrRowMd.push('');
                            }
                        }
                        else {
                            arrRow.push('');
                            arrRowMd.push('');
                        }
                        rowspan[k][0] -= 1;
                    }
                }
            }
        }
        if (token.token === 'td_open') {
            cell = '';
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
                                arrRowMd.push('');
                            }
                        }
                        else {
                            arrRow.push('');
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
                arrRowMd.push(cellMd);
            }
            else {
                arrRow.push(cell);
                arrRowMd.push(cellMd);
                if (colspan && colspan > 1) {
                    for (var i = 0; i < colspan - 1; i++) {
                        arrRow.push('');
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
                    // console.log('[child]=>', child);
                    content += slf.renderInline([child], options);
                    if (child.ascii) {
                        cell += child.ascii;
                    }
                    else {
                        cell += child.tsv ? child.tsv.join(',') : child.content;
                    }
                    if (child.type === 'link_open') {
                        var link = table_markdown_1.getMdLink(child, token, j);
                        link = link.replace(/\|/, '\\|');
                        if (link) {
                            cellMd += link;
                            j += 2;
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
                                cellMd += child.ascii;
                                continue;
                            }
                        }
                        cellMd += child.latex.replace(/\|/, '\\|');
                    }
                    else {
                        if (child.type === 'image') {
                            var img = "![" + child.attrGet('alt') + "](" + child.attrGet('src') + ")";
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
    return { table: result, tsv: arrTsv, tableMd: arrMd, align: align };
};
exports.renderTabularInline = function (a, token, options, env, slf) {
    var _a = options.outMath, _b = _a.include_tsv, include_tsv = _b === void 0 ? false : _b, _c = _a.include_table_markdown, include_table_markdown = _c === void 0 ? false : _c, _d = _a.include_table_html, include_table_html = _d === void 0 ? true : _d;
    var tabular = '';
    if (!include_tsv && !include_table_html && !include_table_markdown) {
        return '';
    }
    var data = renderInlineTokenBlock(token.children, options, env, slf);
    token.tsv = data.tsv;
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
    // console.log('table_markdown:');
    // console.log(tableMarkdownJoin(data.tableMd, data.align));
    return "<div class=\"inline-tabular\">" + tabular + tsv + tableMd + "</div>";
};
//# sourceMappingURL=render-tabular.js.map