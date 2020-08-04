"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTabularInline = void 0;
var tsv_1 = require("../common/tsv");
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
    var arrRow = [];
    var cell = '';
    var colspan = 0, rowspan = [], mr = 0;
    var _loop_1 = function (idx) {
        var token = tokens[idx];
        if (token.hidden) {
            return { value: { table: '', tsv: '' } };
        }
        if (token.n !== -1 && idx && tokens[idx - 1].hidden) {
            result += '\n';
        }
        if (token.token === 'table_open' || token.token === 'tbody_open') {
            arrTsv = [];
            arrRow = [];
        }
        if (token.token === 'tr_open') {
            arrRow = [];
        }
        if (token.token === 'tr_close') {
            arrTsv.push(arrRow);
            var l = arrRow && arrRow.length > 0 ? arrRow.length : 0;
            var l2 = rowspan && rowspan.length > 0 ? rowspan.length : 0;
            if (l < l2) {
                for (var k = l; k < l2; k++) {
                    if (rowspan[k]) {
                        if (rowspan[k][1] && rowspan[k][1] > 1) {
                            for (var i = 0; i < rowspan[k][1]; i++) {
                                arrRow.push('');
                            }
                        }
                        else {
                            arrRow.push('');
                        }
                        rowspan[k][0] -= 1;
                    }
                }
            }
        }
        if (token.token === 'td_open') {
            cell = '';
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
                            }
                        }
                        else {
                            arrRow.push('');
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
            }
            else {
                arrRow.push(cell);
                if (colspan && colspan > 1) {
                    for (var i = 0; i < colspan - 1; i++) {
                        arrRow.push('');
                    }
                }
                if (mr && mr > 1) {
                    rowspan[l] = [mr - 1, colspan];
                }
            }
            colspan = 0;
        }
        if (token.token === 'inline') {
            var content_1 = '';
            if (token.children) {
                token.children.forEach(function (child) {
                    content_1 += slf.renderInline([child], options);
                    if (child.ascii) {
                        cell += child.ascii;
                    }
                    else {
                        cell += child.tsv ? child.tsv.join(',') : child.content;
                    }
                });
            }
            else {
                content_1 = slf.renderInline([{ type: 'text', content: token.content }], options);
                cell += content_1;
            }
            result += content_1;
            return "continue";
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
    };
    for (var idx = 0; idx < tokens.length; idx++) {
        var state_1 = _loop_1(idx);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return { table: result, tsv: arrTsv };
};
exports.renderTabularInline = function (a, token, options, env, slf) {
    var _a = options.outMath, _b = _a.include_tsv, include_tsv = _b === void 0 ? false : _b, _c = _a.include_table_html, include_table_html = _c === void 0 ? true : _c;
    var tabular = '';
    if (!include_tsv && !include_table_html) {
        return '';
    }
    var data = renderInlineTokenBlock(token.children, options, env, slf);
    token.tsv = data.tsv;
    if (include_table_html) {
        tabular = data.table;
    }
    var tsv = include_tsv && token.tsv
        ? "<tsv style=\"display: none\">" + tsv_1.TsvJoin(token.tsv, options) + "</tsv>"
        : '';
    return "<div class=\"inline-tabular\">" + tabular + tsv + "</div>";
};
//# sourceMappingURL=render-tabular.js.map