"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableMarkdownJoin = exports.getMdForChild = exports.getMdLink = void 0;
// A bare destination ends at the first unbalanced `)`, so such an href needs the `<…>` form.
var hasUnbalancedParens = function (href) {
    var depth = 0;
    for (var i = 0; i < href.length; i++) {
        if (href[i] === '(') {
            depth++;
        }
        if (href[i] === ')' && --depth < 0) {
            return true;
        }
    }
    return depth !== 0;
};
var mdHref = function (href) {
    if (!href) {
        return '';
    }
    return /[\s<>]/.test(href) || hasUnbalancedParens(href)
        ? '<' + href.replace(/([<>])/g, '\\$1') + '>'
        : href;
};
var getMdLink = function (child, token, j) {
    var _a, _b;
    if (child.type !== 'link_open') {
        return '';
    }
    if (j + 1 >= token.children.length) {
        return '';
    }
    // Read the whole link, not just the next token: formatted link text (`[**b** x](url)`) spans
    // several tokens, and taking only the first yielded an empty label.
    var text = '';
    var depth = 1;
    for (var i = j + 1; i < token.children.length; i++) {
        var inner = token.children[i];
        // No nested links in CommonMark; counted so a stitched stream can't end the label early.
        if (inner.type === 'link_open') {
            depth++;
        }
        else if (inner.type === 'link_close') {
            depth--;
            if (depth === 0) {
                break;
            }
        }
        if (inner.type === 'text') {
            // An unescaped `]` ends the label early and breaks the link.
            text += inner.content.replace(/\]/g, '\\]');
        }
        else if (inner.type === 'code_inline') {
            // Self-closing: same shape as the main cell loop — open marker, content, close marker.
            text += (0, exports.getMdForChild)(inner) + inner.content + inner.markup;
        }
        else if (inner.type === 'smiles_inline') {
            // The other self-closing type getMdForChild gives a marker for; its closer is not in markup.
            text += (0, exports.getMdForChild)(inner) + inner.content + '</smiles>';
        }
        else if (inner.type === 'html_inline') {
            // Raw markup, so `]` in it is not escaped yet — unlike an image alt or a math latex below.
            text += ((_a = inner.content) !== null && _a !== void 0 ? _a : '').replace(/\]/g, '\\]');
        }
        else {
            // Fall back to content: an image holds its alt there, inline math its latex.
            // Not escaped here: an image keeps the raw source in `content`, so a `]` is already escaped.
            text += (0, exports.getMdForChild)(inner) || ((_b = inner.content) !== null && _b !== void 0 ? _b : '');
        }
    }
    return "[".concat(text, "](").concat(mdHref(child.attrGet('href')), ")");
};
exports.getMdLink = getMdLink;
var getMdForChild = function (child) {
    var res = '';
    if (!child.tag) {
        switch (child.type) {
            case 'textbf_open':
            case 'textbf_close':
                res = '**';
                break;
            case 'textit_open':
            case 'textit_close':
                res = '*';
                break;
            case 'texttt_open':
            case 'texttt_close':
                res = '`';
                break;
            case 'smiles_inline':
                res = '<smiles>';
                break;
            case 'link_open':
                res = '<a>';
                break;
            case 'link_close':
                res = '</a>';
                break;
        }
        return res;
    }
    switch (child.tag) {
        case 'em':
        case 's':
        case 'strong':
        case 'mark':
        case 'code':
            res = child.markup;
            break;
    }
    return res;
};
exports.getMdForChild = getMdForChild;
var tableMarkdownJoin = function (tableMd, align) {
    if (align === void 0) { align = ''; }
    if (!tableMd || tableMd.length === 0) {
        return '';
    }
    var table = [];
    var alignArr = align.split('|');
    for (var i = 0; i < tableMd.length; i++) {
        var row = tableMd[i];
        var rowStr = '| ' + row.join(' | ') + ' |';
        table.push(rowStr);
        if (i === 0) {
            var header = '|';
            for (var j = 0; j < alignArr.length; j++) {
                var itemAlign = alignArr[j];
                switch (itemAlign) {
                    case 'left':
                        header += ' :--- |';
                        break;
                    case 'right':
                        header += ' ---: |';
                        break;
                    case 'center':
                        header += ' :---: |';
                        break;
                    default:
                        header += ' --- |';
                        break;
                }
            }
            table.push(header);
        }
    }
    return table.join("\n");
};
exports.tableMarkdownJoin = tableMarkdownJoin;
//# sourceMappingURL=table-markdown.js.map