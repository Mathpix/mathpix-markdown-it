"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTableCellContent = void 0;
var tsv_1 = require("./tsv");
var csv_1 = require("./csv");
var table_markdown_1 = require("./table-markdown");
var consts_1 = require("./consts");
var renderTableCellContent = function (token, isSubTable, options, env, slf) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
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
            var rendered = slf.renderInline([child], options, env);
            var smoothedRendered = Array.isArray(child.tableSmoothed)
                ? ((_a = child.tableSmoothed) === null || _a === void 0 ? void 0 : _a.length) > 0
                    ? child.tableSmoothed.map(function (item) { return typeof item === 'string' ? item : item.join(' '); }).join(' <br> ')
                    : ''
                : rendered;
            smoothedCell += smoothedRendered;
            content += options.forPptx ? smoothedRendered : rendered;
            var ascii = child.ascii_tsv || child.ascii;
            var csvAscii = child.ascii_csv || child.ascii;
            var tsvData = child.tsv ? child.tsv.join(',') : child.content;
            var csvData = child.csv ? child.csv.join(',') : child.content;
            if (ascii) {
                tsvCell += ascii;
                csvCell += csvAscii;
            }
            else if (token.type === 'subTabular') {
                if ((_b = token.parents) === null || _b === void 0 ? void 0 : _b.length) {
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
            switch (child.type) {
                case 'link_open': {
                    var href = child.attrGet('href');
                    tsvCell += href;
                    csvCell += href;
                    var link = (0, table_markdown_1.getMdLink)(child, token, j)
                        .replace(/\|/g, '\\|');
                    if (link) {
                        mdCell += link;
                        if (j + 1 < token.children.length) {
                            content += slf.renderInline([token.children[++j]], options, env);
                            j++;
                        }
                        if (j + 1 < token.children.length) {
                            content += slf.renderInline([token.children[++j]], options, env);
                            j++;
                        }
                    }
                    continue;
                }
                case 'text':
                    mdCell += child.content.replace(/\|/g, '\\|');
                    continue;
                case 'softbreak':
                    tsvCell += ' ';
                    csvCell += ' ';
                    mdCell += ' ';
                    continue;
                case 'image':
                case 'includegraphics': {
                    var src = child.attrGet('src');
                    tsvCell += src;
                    csvCell += src;
                    mdCell += "![".concat(child.attrGet('alt'), "](").concat(src, ")").replace(/\|/g, '\\|');
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
                    mdCell += '</smiles>';
                    continue;
                case "latex_lstlisting_env": {
                    var mdContent = child.content.split('\n').join('<br>');
                    mdContent = mdContent.replace(/\|/g, '&#124');
                    mdCell += "<pre><code>".concat(mdContent, "</code></pre>");
                    continue;
                }
            }
            if ((_c = child.tableMd) === null || _c === void 0 ? void 0 : _c.length) {
                mdCell += child.tableMd.map(function (item) { return (typeof item === 'string' ? item : item.join(' ')); }).join(' <br> ');
                continue;
            }
            mdCell += (0, table_markdown_1.getMdForChild)(child);
            if (child.latex) {
                var outMath = options.outMath;
                if (((_d = outMath === null || outMath === void 0 ? void 0 : outMath.table_markdown) === null || _d === void 0 ? void 0 : _d.math_as_ascii) && ascii) {
                    mdCell += child.ascii_md || ascii;
                    continue;
                }
                var begin_math_inline_delimiters = '$';
                var end_math_inline_delimiters = '$';
                if (((_g = (_f = (_e = options.outMath) === null || _e === void 0 ? void 0 : _e.table_markdown) === null || _f === void 0 ? void 0 : _f.math_inline_delimiters) === null || _g === void 0 ? void 0 : _g.length) > 1) {
                    begin_math_inline_delimiters = options.outMath.table_markdown.math_inline_delimiters[0];
                    end_math_inline_delimiters = options.outMath.table_markdown.math_inline_delimiters[1];
                }
                var mdContent = consts_1.mathTokenTypes.includes(child.type)
                    ? begin_math_inline_delimiters + ((_h = child.content) === null || _h === void 0 ? void 0 : _h.trim()) + end_math_inline_delimiters
                    : child.latex;
                mdCell += mdContent
                    .replace(/\|/g, '\\|')
                    .replace(/\n/g, ' ');
            }
            else {
                mdCell += child.content.replace(/\|/g, '\\|');
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