"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableMarkdownJoin = exports.getMdForChild = exports.getMdLink = void 0;
exports.getMdLink = function (child, token, j) {
    if (child.type !== 'link_open') {
        return '';
    }
    var link = '';
    link += '[';
    var linkRef = "(" + child.attrGet('href') + ")";
    var nextChild = j + 1 < token.children.length
        ? token.children[j + 1]
        : null;
    if (!nextChild) {
        return '';
    }
    link += nextChild.content;
    link += ']';
    link += linkRef;
    return link;
};
exports.getMdForChild = function (child) {
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
exports.tableMarkdownJoin = function (tableMd, align) {
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
//# sourceMappingURL=table-markdown.js.map