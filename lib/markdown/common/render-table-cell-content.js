"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTableCellContent = void 0;
var tslib_1 = require("tslib");
var tsv_1 = require("./tsv");
var csv_1 = require("./csv");
var table_markdown_1 = require("./table-markdown");
var consts_1 = require("./consts");
var common_1 = require("../common");
var escapeHtml = require('markdown-it/lib/common/utils').escapeHtml;
// A token that was itself rendered as a table carries its smoothed lines; everything else is
// smoothed as rendered. Shared by the main loop and the link loop so the two cannot drift.
var smoothedFor = function (child, rendered) {
    if (!Array.isArray(child.tableSmoothed)) {
        return rendered;
    }
    return child.tableSmoothed.length > 0
        ? child.tableSmoothed.map(function (item) { return typeof item === 'string' ? item : item.join(' '); }).join(' <br> ')
        : '';
};
/**
 * Renders a table cell token into multiple parallel representations:
 * HTML/text (`content`), TSV, CSV, Markdown (`tableMd`), and a "smoothed" variant
 * used for DOCX/PPTX where line wrapping and block-like inline tokens matter.
 *
 * This function is recursive: inline children may contain nested tabular content.
 *
 * @param token - Cell token (or inline token) whose children form the cell content.
 * @param isSubTable - True if the current token is being rendered inside a nested table context.
 * @param options - Rendering options (DOCX/PPTX/markdown math settings).
 * @param env - Markdown-it rendering environment.
 * @param slf - Markdown-it renderer instance (must support renderInline).
 * @returns Combined render outputs for this cell.
 */
var renderTableCellContent = function (token, isSubTable, options, env, slf) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    var content = '';
    var tsvCell = '';
    var csvCell = '';
    var mdCell = '';
    var smoothedCell = '';
    try {
        for (var j = 0; j < token.children.length; j++) {
            var child = token.children[j];
            if (child.type === "tabular_inline" || isSubTable) {
                child.isSubTable = true;
            }
            var childType = child.token || child.type;
            if (childType && ['inline', 'underline', 'out'].includes(childType)) {
                var cellRender = (0, exports.renderTableCellContent)(child, true, options, env, slf);
                if (cellRender) {
                    content += cellRender.content;
                    tsvCell += cellRender.tsv;
                    csvCell += cellRender.csv;
                    mdCell += cellRender.tableMd;
                    smoothedCell += cellRender.tableSmoothed;
                }
                continue;
            }
            if ((options.forDocx || options.forPptx) &&
                child.type === 'text' && (0, common_1.isWhitespace)(child.content)) {
                var prev = token.children[j - 1];
                var next = token.children[j + 1];
                if ((prev === null || prev === void 0 ? void 0 : prev.type) === 'latex_lstlisting_env' && (next === null || next === void 0 ? void 0 : next.type) === 'latex_lstlisting_env') {
                    content += slf.renderInline([{ type: 'softbreak', tag: 'br', nesting: 0 }], options, env);
                    continue;
                }
            }
            if (options === null || options === void 0 ? void 0 : options.forMD) {
                child.meta = tslib_1.__assign(tslib_1.__assign({}, ((_a = child.meta) !== null && _a !== void 0 ? _a : {})), { isTableCell: true });
            }
            var rendered = slf.renderInline([child], options, env);
            var smoothedRendered = smoothedFor(child, rendered);
            smoothedCell += smoothedRendered;
            content += options.forPptx ? smoothedRendered : rendered;
            var ascii = child.ascii_tsv || child.ascii;
            var csvAscii = child.ascii_csv || child.ascii;
            var tsvData = child.tsv ? child.tsv.join(',') : child.content;
            var csvData = child.csv ? child.csv.join(',') : child.content;
            // An image writes its own tsv/csv value (the `src`) in the switch below; letting the generic
            // append run first glued the alt from `content` onto it — `alt` + `i.png` in one cell.
            var writesOwnPlainText = child.type === 'image' || child.type === 'includegraphics';
            if (!writesOwnPlainText) {
                if (ascii) {
                    tsvCell += ascii;
                    csvCell += csvAscii;
                }
                else if (token.type === 'subTabular') {
                    if (((_b = token.parents) === null || _b === void 0 ? void 0 : _b.length) || ["backslashbox", "slashbox"].includes(child.type)) {
                        tsvCell += tsvData;
                        csvCell += csvData;
                    }
                    else {
                        tsvCell += child.tsv ? "\"".concat((0, tsv_1.TsvJoin)(child.tsv, options), "\"") : child.content;
                        csvCell += child.csv ? (0, csv_1.CsvJoin)(child.csv, options, true) : child.content;
                    }
                }
                else {
                    tsvCell += tsvData;
                    csvCell += csvData;
                }
            }
            switch (child.type) {
                case 'link_open': {
                    var href = child.attrGet('href');
                    tsvCell += href;
                    csvCell += href;
                    var link = (0, table_markdown_1.getMdLink)(child, token, j, options)
                        .replace(/\|/g, '\\|');
                    // Outside the `if`: with link_open as the last child there is no label to emit, but the
                    // main loop already appended the opening `<a>`.
                    var depth = 1;
                    if (link) {
                        mdCell += link;
                        // getMdLink already emitted [text](href). Render the rest of the link for HTML and
                        // stop on its own link_close, so following siblings are not consumed.
                        while (depth > 0 && j + 1 < token.children.length) {
                            var inner = token.children[++j];
                            if (inner.type === 'link_open') {
                                depth++;
                            }
                            else if (inner.type === 'link_close') {
                                depth--;
                            }
                            var innerRendered = slf.renderInline([inner], options, env);
                            var innerSmoothed = smoothedFor(inner, innerRendered);
                            // Same choice as the main loop: forPptx takes the smoothed form. Without both lines
                            // the accumulators keep an opening `<a>` with no text and no closing tag.
                            content += options.forPptx ? innerSmoothed : innerRendered;
                            smoothedCell += innerSmoothed;
                        }
                    }
                    // The stream is partly hand-stitched: a link_open with no close would stay open.
                    if (depth > 0) {
                        content += '</a>';
                        smoothedCell += '</a>';
                    }
                    continue;
                }
                case 'text':
                    mdCell += child.content.replace(/\|/g, '\\|');
                    continue;
                case 'softbreak':
                    tsvCell += ' ';
                    csvCell += ' ';
                    var prev = token.children[j - 1];
                    var next = token.children[j + 1];
                    mdCell += (prev === null || prev === void 0 ? void 0 : prev.type) === 'latex_lstlisting_env' && (next === null || next === void 0 ? void 0 : next.type) === 'latex_lstlisting_env'
                        ? ''
                        : ' ';
                    continue;
                case 'image':
                case 'includegraphics': {
                    var src = child.attrGet('src');
                    tsvCell += src;
                    csvCell += src;
                    mdCell += (options === null || options === void 0 ? void 0 : options.forMD)
                        ? rendered
                        // `mdHref` as inside a label, so both paths write the destination the same way.
                        : "![".concat((_c = child.attrGet('alt')) !== null && _c !== void 0 ? _c : '', "](").concat((0, table_markdown_1.mdHref)(src), ")").replace(/\|/g, '\\|');
                    continue;
                }
                case 'code':
                case 'code_inline':
                case 'texttt': {
                    mdCell += (0, table_markdown_1.getMdForChild)(child);
                    mdCell += child.content;
                    mdCell += child.markup;
                    continue;
                }
                case 'smiles_inline':
                    mdCell += (0, table_markdown_1.getMdForChild)(child);
                    mdCell += child.content.replace(/\|/g, '\\|');
                    mdCell += table_markdown_1.SMILES_CLOSE;
                    continue;
                case "latex_lstlisting_env": {
                    // codeText: mathescape \$ un-escaped + verbatim math; else raw content
                    var escape_1 = escapeHtml((_e = (_d = child.meta) === null || _d === void 0 ? void 0 : _d.codeText) !== null && _e !== void 0 ? _e : child.content);
                    var mdContent = escape_1.split('\n').join('<br>');
                    mdContent = mdContent.replace(/\|/g, '&#124');
                    mdCell += "<pre><code>".concat(mdContent, "</code></pre>");
                    continue;
                }
                case 'underline_open':
                case 'underline_close':
                case 'out_open':
                case 'out_close':
                    continue;
            }
            if ((_f = child.tableMd) === null || _f === void 0 ? void 0 : _f.length) {
                mdCell += child.tableMd.map(function (item) { return (typeof item === 'string' ? item : item.join(' ')); }).join(' <br> ');
                continue;
            }
            mdCell += (0, table_markdown_1.getMdForChild)(child);
            if (child.latex) {
                // Escaped like the path below: the ascii for `$|x|$` is `|x|`, and bare pipes re-cut the row.
                var mdAscii = (0, table_markdown_1.asciiForMarkdown)(child);
                if (((_h = (_g = options.outMath) === null || _g === void 0 ? void 0 : _g.table_markdown) === null || _h === void 0 ? void 0 : _h.math_as_ascii) && mdAscii) {
                    mdCell += mdAscii
                        .replace(/\|/g, '\\|')
                        .replace(/\n/g, ' ');
                    continue;
                }
                var mdContent = consts_1.mathTokenTypes.includes(child.type)
                    ? (0, table_markdown_1.getMdMath)(child, options, (_j = child.content) === null || _j === void 0 ? void 0 : _j.trim())
                    : child.latex;
                mdCell += mdContent
                    .replace(/\|/g, '\\|')
                    .replace(/\n/g, ' ');
            }
            else {
                mdCell += (child === null || child === void 0 ? void 0 : child.content) ? child.content.replace(/\|/g, '\\|') : '';
            }
        }
        return {
            content: content,
            tsv: tsvCell,
            csv: csvCell,
            tableMd: mdCell,
            tableSmoothed: smoothedCell,
        };
    }
    catch (e) {
        return {
            content: content,
            tsv: tsvCell,
            csv: csvCell,
            tableMd: mdCell,
            tableSmoothed: smoothedCell,
        };
    }
};
exports.renderTableCellContent = renderTableCellContent;
//# sourceMappingURL=render-table-cell-content.js.map