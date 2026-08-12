"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableMarkdownJoin = exports.getMdForChild = exports.getMdLink = exports.getMdMath = exports.SMILES_CLOSE = exports.SMILES_OPEN = exports.mdHref = void 0;
var tslib_1 = require("tslib");
var consts_1 = require("./consts");
var MATH_TOKEN_TYPES = new Set(consts_1.mathTokenTypes);
// Used with `replace` only, so the /g lastIndex is reset by the call and cannot leak between them.
var LINE_BREAKS_RE = /[\r\n]+/g;
// `\` included so the escape below reaches it: a bare `a\` leaves `](a\)` open.
var HREF_NEEDS_ANGLES_RE = /[\s<>\\]/;
var HREF_ANGLE_ESCAPE_RE = /([<>\\])/g;
// Everything that can end or re-cut a label: the closing bracket, an opening one (which
// re-pairs with it), and a backslash (which would escape whatever we add after it).
var LABEL_ESCAPE_RE = /([\\\[\]])/g;
var escapeLabel = function (s) { return s.replace(LABEL_ESCAPE_RE, '\\$1'); };
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
    // A line break is invalid in a destination in either form, so drop it before deciding.
    var flat = href.replace(LINE_BREAKS_RE, '');
    return HREF_NEEDS_ANGLES_RE.test(flat) || hasUnbalancedParens(flat)
        // `\` too: a trailing one would escape the closing `>` and leave the destination open.
        ? '<' + flat.replace(HREF_ANGLE_ESCAPE_RE, '\\$1') + '>'
        : flat;
};
exports.mdHref = mdHref;
// `smiles_inline` is self-closing, so its closer is not in `markup` and both writers need it.
exports.SMILES_OPEN = '<smiles>';
exports.SMILES_CLOSE = '</smiles>';
// Math per `outMath.table_markdown`: ascii if asked, else latex between the configured delimiters.
// Shared with the cell loop, or a label and the text around it come out in two syntaxes.
var getMdMath = function (token, options, content) {
    var _a, _b;
    var tableMarkdown = (_a = options === null || options === void 0 ? void 0 : options.outMath) === null || _a === void 0 ? void 0 : _a.table_markdown;
    // Same chain the cell loop emits, or a token carrying only `ascii_tsv` differs inside a label.
    var ascii = token.ascii_md || token.ascii_tsv || token.ascii;
    if ((tableMarkdown === null || tableMarkdown === void 0 ? void 0 : tableMarkdown.math_as_ascii) && ascii) {
        return ascii;
    }
    var configured = tableMarkdown === null || tableMarkdown === void 0 ? void 0 : tableMarkdown.math_inline_delimiters;
    // Display math too: `$…$` is the documented default; pass `['$$','$$']` for the block form.
    var _c = tslib_1.__read((configured === null || configured === void 0 ? void 0 : configured.length) > 1
        ? [configured[0], configured[1]]
        : ['$', '$'], 2), open = _c[0], close = _c[1];
    return open + ((_b = content !== null && content !== void 0 ? content : token.content) !== null && _b !== void 0 ? _b : '') + close;
};
exports.getMdMath = getMdMath;
var getMdLink = function (child, token, j, options) {
    var _a, _b, _c, _d;
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
            text += escapeLabel(inner.content);
        }
        else if (inner.type === 'code_inline') {
            // Self-closing: same shape as the main cell loop — open marker, content, close marker.
            text += (0, exports.getMdForChild)(inner) + inner.content + inner.markup;
        }
        else if (inner.type === 'smiles_inline') {
            // The other self-closing type getMdForChild gives a marker for; its closer is not in markup.
            text += (0, exports.getMdForChild)(inner) + inner.content + exports.SMILES_CLOSE;
        }
        else if (inner.type === 'link_open' || inner.type === 'link_close') {
            // Both reachable only in a stitched stream (CommonMark has no nested links); a nested closer
            // never reaches the break above. Skipped explicitly: getMdForChild answers `<a>`/`</a>` for a
            // token without a `tag`, and that markup has no place in a Markdown label.
        }
        else if (inner.type && MATH_TOKEN_TYPES.has(inner.type)) {
            // Verbatim: escaping would turn `\frac` into a LaTeX line break. Trimmed as the cell loop
            // trims, or one formula exports two ways in one cell.
            text += (0, exports.getMdMath)(inner, options, (_a = inner.content) === null || _a === void 0 ? void 0 : _a.trim());
        }
        else if (inner.type === 'image' || inner.type === 'includegraphics') {
            // Whole image, like the main cell loop: alt alone loses `src`. Alt is raw source — not escaped.
            text += "![".concat((_c = (_b = inner.attrGet('alt')) !== null && _b !== void 0 ? _b : inner.content) !== null && _c !== void 0 ? _c : '', "](").concat((0, exports.mdHref)(inner.attrGet('src')), ")");
        }
        else if (inner.type === 'softbreak' || inner.type === 'hardbreak') {
            // Same as the main cell loop: without it the words on both sides glue together.
            text += ' ';
        }
        else {
            // Raw markup and anything else: escaped, or a `]` truncates the label downstream.
            text += escapeLabel((0, exports.getMdForChild)(inner) || ((_d = inner.content) !== null && _d !== void 0 ? _d : ''));
        }
    }
    return "[".concat(text, "](").concat((0, exports.mdHref)(child.attrGet('href')), ")");
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
                res = exports.SMILES_OPEN;
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
        // Else a label flattens `H~2~O` to `H2O`.
        case 'sub':
        case 'sup':
        case 'ins':
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