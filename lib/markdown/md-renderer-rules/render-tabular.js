"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTabularInline = exports.renderInlineTokenBlock = void 0;
var tslib_1 = require("tslib");
var tsv_1 = require("../common/tsv");
var csv_1 = require("../common/csv");
var table_markdown_1 = require("../common/table-markdown");
var parse_mmd_element_1 = require("../../helpers/parse-mmd-element");
var common_1 = require("../highlight/common");
var render_table_cell_content_1 = require("../common/render-table-cell-content");
var list_markers_1 = require("../common/list-markers");
var TABLE_TOKENS = new Set([
    'table_open', 'table_close', 'tbody_open', 'tbody_close', 'tr_open', 'tr_close', 'td_open', 'td_close',
]);
/**
 * Appends a text chunk to the last line of a string array.
 * If the array is empty, a new line is created.
 */
var appendToLastLine = function (lines, chunk) {
    if (!chunk) {
        return;
    }
    if (lines.length === 0) {
        lines.push(chunk);
        return;
    }
    lines[lines.length - 1] += chunk;
};
/**
 * Ensures there is an empty last line in the lines array.
 * If the current last line contains non-whitespace characters, appends a new empty line.
 *
 * @param lines - Array of lines representing a multi-line cell value.
 */
var ensureTrailingEmptyLine = function (lines) {
    if (!lines.length) {
        lines.push('');
        return;
    }
    if (lines[lines.length - 1].trim()) {
        lines.push('');
    }
};
/**
 * Formats TSV cell content from an array of lines.
 *
 * Behavior:
 * - Joins all lines using '\n' by default.
 * - If the resulting text contains a double quote (`"`), falls back to joining lines with spaces
 *   to avoid broken TSV/Excel output.
 * - If `isSubTable` is true, returns the joined text without quoting.
 * - Otherwise, wraps the value in double quotes only when it contains newlines or tabs.
 * @param lines - Cell content split into lines.
 * @param isSubTable - Whether the cell belongs to a nested table context.
 * @returns TSV-ready string for a single table cell.
 */
var formatTsvCell = function (lines, isSubTable) {
    var text = (lines !== null && lines !== void 0 ? lines : []).join('\n');
    if (text.includes('"')) {
        return (lines !== null && lines !== void 0 ? lines : []).join(' ');
    }
    if (isSubTable) {
        return text;
    }
    // Quote if TSV contains characters that should be protected in spreadsheets/parsers.
    var needsQuoting = /[\n\t]/.test(text);
    if (!needsQuoting) {
        return text;
    }
    return "\"".concat(text, "\"");
};
/**
 * Formats CSV cell content from an array of lines by joining them with newline characters.
 *
 * @param lines - Cell content split into lines.
 * @returns CSV-ready string for a single table cell.
 */
var formatCsvCell = function (lines) {
    return (lines !== null && lines !== void 0 ? lines : []).join('\n');
};
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
/**
 * Renders a non-table token into the current table-cell accumulators.
 *
 * Handles three cases:
 * - `tabular` blocks via `renderInlineTokenBlock` (nested LaTeX tables).
 * - Composite tokens (with children) via `renderTableCellContent` (recursive cell rendering).
 * - Leaf tokens via `slf.renderInline`, plus list-specific Markdown stitching
 *   (handled by `handleListTokensForCellMarkdown`).
 *
 * @param token - Token to render (expected to be outside the core table token set).
 * @param ctx - Rendering context (renderer/options/env and additional state used by helpers).
 * @param acc - Mutable accumulators for the current cell (HTML/text, TSV/CSV, Markdown, smoothed).
 */
var renderNonTableTokenIntoCell = function (token, ctx, acc) {
    var _a, _b;
    var options = ctx.options, env = ctx.env, slf = ctx.slf, highlight = ctx.highlight;
    if ((token === null || token === void 0 ? void 0 : token.type) === 'tabular' || (token === null || token === void 0 ? void 0 : token.type) === 'tabular_inline') {
        var data = (0, exports.renderInlineTokenBlock)(token.children, options, env, slf, true, highlight);
        acc.result += data.table;
        if (Array.isArray(data.tableMd) && data.tableMd.length) {
            if ((_a = acc.cellMd) === null || _a === void 0 ? void 0 : _a.trim()) {
                console.log("1[TEST]=>acc.cellMd=>", acc.cellMd);
                acc.cellMd += '<br>';
                console.log("2[TEST]=>acc.cellMd=>", acc.cellMd);
            }
            acc.cellMd += data.tableMd.map(function (item) { return (typeof item === 'string' ? item : item.join(' ')); }).join(' <br> ');
        }
        if (data.tsv) {
            ensureTrailingEmptyLine(acc.cellTsvLines);
            appendToLastLine(acc.cellTsvLines, (0, tsv_1.TsvJoin)(data.tsv, options));
        }
        if (data.csv) {
            ensureTrailingEmptyLine(acc.cellCsvLines);
            appendToLastLine(acc.cellCsvLines, (0, csv_1.CsvJoin)(data.csv, options, true));
        }
        return;
    }
    if ((_b = token === null || token === void 0 ? void 0 : token.children) === null || _b === void 0 ? void 0 : _b.length) {
        var cellRender = (0, render_table_cell_content_1.renderTableCellContent)(token, true, options, env, slf);
        acc.result += cellRender.content;
        appendToLastLine(acc.cellTsvLines, cellRender.tsv);
        appendToLastLine(acc.cellCsvLines, cellRender.csv);
        acc.cellMd += cellRender.tableMd;
        acc.cellSmoothed += cellRender.tableSmoothed;
        return;
    }
    // Leaf token
    acc.result += slf.renderInline([token], options, env);
    // List-related markdown stitching inside table cells
    handleListTokensForCellMarkdown(token, ctx, acc);
};
/**
 * Applies Markdown/TSV/CSV "stitching" rules for LaTeX list tokens when rendering table cells.
 * This handler does not render the list content itself; it only injects separators (e.g. <br>),
 * indentation, and list markers so that list structure is preserved inside a single table cell.
 *
 * @param token - Current token being processed.
 * @param ctx - Render context containing the token stream, current index, and renderer dependencies.
 * @param acc - Mutable accumulators for the current cell (md/tsv/csv/smoothed).
 */
var handleListTokensForCellMarkdown = function (token, ctx, acc) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    var tokens = ctx.tokens, idx = ctx.idx, options = ctx.options, env = ctx.env, slf = ctx.slf;
    var prevToken = idx > 0 ? tokens[idx - 1] : null;
    var addBr = function () {
        // Find last non-space character
        var s = acc.cellMd;
        var k = s.length - 1;
        while (k >= 0 && (s[k] === " " || s[k] === "\t"))
            k--;
        // If the last significant char is a backslash, separate it from the HTML tag.
        if (k >= 0 && s[k] === "\\") {
            acc.cellMd += " ";
        }
        acc.cellMd += '<br>';
    };
    if ((token === null || token === void 0 ? void 0 : token.type) && ["itemize_list_open", "enumerate_list_open"].includes(token.type)) {
        var level = (_a = token === null || token === void 0 ? void 0 : token.prentLevel) !== null && _a !== void 0 ? _a : 0;
        var prevType = prevToken === null || prevToken === void 0 ? void 0 : prevToken.type;
        var prevLevel = (_b = prevToken === null || prevToken === void 0 ? void 0 : prevToken.prentLevel) !== null && _b !== void 0 ? _b : 0;
        // Add a break after a paragraph boundary.
        if (prevType === 'paragraph_close') {
            addBr();
        }
        // Add a break before nested lists unless we are right after a list item close.
        if (prevToken && prevType !== 'latex_list_item_close' && level > 0) {
            addBr();
        }
        // Add a break between top-level lists.
        var prevIsListClose = prevType === 'enumerate_list_close' || prevType === 'itemize_list_close';
        if (prevIsListClose && prevLevel === 0) {
            addBr();
        }
        return;
    }
    if ((token === null || token === void 0 ? void 0 : token.type) === "latex_list_item_open") {
        var mdPrefix = '';
        var tsvPrefix = '';
        var csvPrefix = '';
        // Add a break if a list item starts right after a paragraph.
        if ((prevToken === null || prevToken === void 0 ? void 0 : prevToken.type) === 'paragraph_close') {
            mdPrefix += '<br>';
            acc.cellSmoothed += ' ';
        }
        var isEnumerate = token.parentType === "enumerate";
        // Ensure list items always start on a fresh TSV/CSV line.
        ensureTrailingEmptyLine(acc.cellTsvLines);
        ensureTrailingEmptyLine(acc.cellCsvLines);
        // Indent nested list items using non-breaking spaces (HTML).
        var listLevel = Math.max(1, isEnumerate ? (_c = token.meta) === null || _c === void 0 ? void 0 : _c.enumerateLevel : (_d = token.meta) === null || _d === void 0 ? void 0 : _d.itemizeLevel);
        for (var i = 1; i < listLevel; i++) {
            mdPrefix += '&#160;&#160;';
            tsvPrefix += '  ';
            csvPrefix += '  ';
        }
        var markerMd = '';
        var markerTsv = ' ';
        var markerCsv = ' ';
        // If the token provides a custom marker, use it; otherwise default to bullet markers.
        if (token.hasOwnProperty('marker')) {
            if (((_e = token.markerTokens) === null || _e === void 0 ? void 0 : _e.length) > 0) {
                // Avoid mutating the original token: render marker tokens via a shallow copy.
                var markerToken = tslib_1.__assign(tslib_1.__assign({}, token), { children: token.markerTokens });
                var markerRender = (0, render_table_cell_content_1.renderTableCellContent)(markerToken, true, options, env, slf);
                markerMd = (_f = markerRender.tableMd) !== null && _f !== void 0 ? _f : '';
                markerTsv += (_g = markerRender.tsv) !== null && _g !== void 0 ? _g : '';
                markerCsv += (_h = markerRender.csv) !== null && _h !== void 0 ? _h : '';
            }
            else {
                markerMd = (_j = token.marker) !== null && _j !== void 0 ? _j : '';
                markerTsv += (_k = token.marker) !== null && _k !== void 0 ? _k : '';
                markerCsv += (_l = token.marker) !== null && _l !== void 0 ? _l : '';
            }
        }
        else {
            var plainMarker = isEnumerate
                ? (0, list_markers_1.getEnumeratePlainMarker)(Math.max(1, (_o = (_m = token.meta) === null || _m === void 0 ? void 0 : _m.enumerateIndex) !== null && _o !== void 0 ? _o : 1), listLevel)
                : (0, list_markers_1.getItemizePlainMarker)(listLevel);
            markerMd = plainMarker;
            markerTsv += plainMarker;
            markerCsv += plainMarker;
        }
        if (markerMd) {
            mdPrefix += "".concat(markerMd, " ");
        }
        if (markerTsv) {
            tsvPrefix += markerTsv + ' ';
        }
        if (markerCsv) {
            csvPrefix += markerCsv + ' ';
        }
        acc.cellMd += mdPrefix;
        appendToLastLine(acc.cellTsvLines, tsvPrefix);
        appendToLastLine(acc.cellCsvLines, csvPrefix);
        acc.cellSmoothed += markerMd ? "".concat(markerMd, " ") : '';
        return;
    }
    if ((token === null || token === void 0 ? void 0 : token.type) === "latex_list_item_close") {
        var prevType = prevToken === null || prevToken === void 0 ? void 0 : prevToken.type;
        // Add a break between list items unless the list ends immediately after the item.
        var shouldBreak = prevType !== 'itemize_list_close' && prevType !== 'enumerate_list_close';
        if (shouldBreak) {
            addBr();
        }
        return;
    }
    if ((token === null || token === void 0 ? void 0 : token.type) && ["itemize_list_close", "enumerate_list_close"].includes(token.type)) {
        // No-op: list close is handled by item close logic and surrounding tokens.
        return;
    }
};
/**
 * Renders a markdown-it token stream representing an HTML table (or LaTeX tabular)
 * into HTML markup and parallel TSV/CSV/Markdown/"smoothed" table representations.
 * Also handles nested tabular blocks and list tokens inside table cells.
 *
 * @param tokens - Token stream to render.
 * @param options - Renderer options (pptx/docx/xhtml, etc.).
 * @param env - Rendering environment.
 * @param slf - Markdown-it renderer instance.
 * @param isSubTable - Whether the current table is nested inside another table cell.
 * @param highlight - Optional highlight metadata applied to table cells.
 * @returns Rendered table outputs in multiple formats.
 */
var renderInlineTokenBlock = function (tokens, options, env, slf, isSubTable, highlight) {
    var _a, _b, _c;
    if (isSubTable === void 0) { isSubTable = false; }
    if (highlight === void 0) { highlight = null; }
    var nextToken, result = '', needLf = false;
    var arrTsv = [];
    var arrCsv = [];
    var arrMd = [];
    var arrSmoothed = [];
    var arrRow = [];
    var arrRowCsv = [];
    var arrRowMd = [];
    var arrRowSmoothed = [];
    var cellTsvLines = [''];
    var cellCsvLines = [''];
    var cellMd = '';
    var cellSmoothed = '';
    var align = '';
    var colspan = 0, rowspan = [], mr = 0;
    var numCol = 0;
    var ctx = { tokens: tokens, idx: 0, options: options, env: env, slf: slf, highlight: highlight };
    for (var idx = 0; idx < tokens.length; idx++) {
        ctx.idx = idx;
        var token = tokens[idx];
        if (token.hidden) {
            continue;
        }
        if (token.n !== -1 && idx && tokens[idx - 1].hidden) {
            result += '\n';
        }
        if (token.token === 'table_open' || token.token === 'tbody_open') {
            arrTsv = [];
            arrCsv = [];
            arrMd = [];
            arrSmoothed = [];
            arrRow = [];
            arrRowCsv = [];
            arrRowMd = [];
            arrRowSmoothed = [];
            if (!align) {
                align = token.latex;
            }
        }
        if (token.token === 'tr_open') {
            arrRow = [];
            arrRowCsv = [];
            arrRowMd = [];
            arrRowSmoothed = [];
        }
        if (token.token === 'tr_close') {
            arrTsv.push(arrRow);
            arrCsv.push(arrRowCsv);
            arrMd.push(arrRowMd);
            arrSmoothed.push(arrRowSmoothed);
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
                                arrRowSmoothed.push('');
                            }
                        }
                        else {
                            arrRow.push('');
                            arrRowCsv.push('');
                            arrRowMd.push('');
                            arrRowSmoothed.push('');
                        }
                        rowspan[k][0] -= 1;
                    }
                }
            }
        }
        if (token.token === 'td_open') {
            var nextToken_1 = tokens[idx + 1];
            var nextToken2 = tokens[idx + 2];
            if ((nextToken2 === null || nextToken2 === void 0 ? void 0 : nextToken2.token) === 'td_close' &&
                ((_a = nextToken_1 === null || nextToken_1 === void 0 ? void 0 : nextToken_1.children) === null || _a === void 0 ? void 0 : _a.length) === 1 &&
                ['slashbox', 'backslashbox'].includes(nextToken_1.children[0].type)) {
                var diagBoxToken = nextToken_1.children[0];
                diagBoxToken.meta = tslib_1.__assign(tslib_1.__assign({}, diagBoxToken.meta), { isBlock: true });
                var dir = diagBoxToken.type === 'backslashbox' ? 'left' : 'right';
                var styles = tokenAttrGet(token, 'style');
                styles += 'background-size: 100% 100%;';
                styles += 'vertical-align: middle;';
                styles += "background-image: linear-gradient(to bottom ".concat(dir, ", transparent calc(50% - 0.5px), black 50%, black 50%, transparent calc(50% + 0.5px));");
                tokenAttrSet(token, 'style', styles);
            }
            cellTsvLines = [''];
            cellCsvLines = [''];
            cellMd = '';
            cellSmoothed = '';
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
                                arrRowSmoothed.push('');
                            }
                        }
                        else {
                            arrRow.push('');
                            arrRowCsv.push('');
                            arrRowMd.push('');
                            arrRowSmoothed.push('');
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
                arrRow.push(formatTsvCell(cellTsvLines, isSubTable));
                arrRowCsv.push(formatCsvCell(cellCsvLines));
                arrRowMd.push(cellMd);
                arrRowSmoothed.push(cellSmoothed);
            }
            else {
                arrRow.push(formatTsvCell(cellTsvLines, isSubTable));
                arrRowCsv.push(formatCsvCell(cellCsvLines));
                arrRowMd.push(cellMd);
                arrRowSmoothed.push(cellSmoothed);
                if (colspan && colspan > 1) {
                    for (var i = 0; i < colspan - 1; i++) {
                        arrRow.push('');
                        arrRowCsv.push('');
                        arrRowMd.push('');
                        arrRowSmoothed.push('');
                    }
                }
                if (mr && mr > 1) {
                    rowspan[l] = [mr - 1, colspan];
                }
            }
            colspan = 0;
        }
        if (token.token === 'inline' || token.type === 'inline') {
            var content = '';
            if (token.children) {
                var cellRender = (0, render_table_cell_content_1.renderTableCellContent)(token, true, options, env, slf);
                content += cellRender.content;
                appendToLastLine(cellTsvLines, cellRender.tsv);
                appendToLastLine(cellCsvLines, cellRender.csv);
                cellMd += cellRender.tableMd;
                cellSmoothed += cellRender.tableSmoothed;
            }
            else {
                content = slf.renderInline([{ type: 'text', content: token.content }], options, env);
                appendToLastLine(cellTsvLines, content);
                appendToLastLine(cellCsvLines, content);
                cellMd += content;
                cellSmoothed += content;
            }
            result += content;
            continue;
        }
        if (!TABLE_TOKENS.has(token.token) && !TABLE_TOKENS.has(token.type)) {
            var acc = {
                result: result,
                cellMd: cellMd,
                cellSmoothed: cellSmoothed,
                cellTsvLines: cellTsvLines,
                cellCsvLines: cellCsvLines,
            };
            renderNonTableTokenIntoCell(token, ctx, acc);
            result = acc.result;
            cellMd = acc.cellMd;
            cellSmoothed = acc.cellSmoothed;
            cellTsvLines = acc.cellTsvLines;
            cellCsvLines = acc.cellCsvLines;
            continue;
        }
        var tokenTag = token.tag;
        var sizerTr = '';
        if (options === null || options === void 0 ? void 0 : options.forPptx) {
            if (token.tag === 'tbody') {
                numCol = tokenAttrGet(token, 'data_num_col');
                numCol = numCol ? Number(numCol) : 0;
                if (numCol) {
                    sizerTr += '<tr class="tr-sizer">';
                    for (var i = 0; i < numCol; i++) {
                        sizerTr += '<td class="td_empty">x</td>';
                    }
                    sizerTr += '</tr>';
                }
            }
        }
        // Add token name, e.g. `<img`
        result += (token.n === -1 ? '</' : '<') + tokenTag;
        if ((options === null || options === void 0 ? void 0 : options.forPptx) && token.token === 'td_open' && ((_b = tokens[idx + 1]) === null || _b === void 0 ? void 0 : _b.token) === 'td_close') {
            var className = tokenAttrGet(token, 'class');
            className += className ? ' ' : '';
            className += 'td_empty';
            tokenAttrSet(token, 'class', className);
        }
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
        if (options === null || options === void 0 ? void 0 : options.forPptx) {
            if (sizerTr) {
                result += sizerTr;
            }
            if (token.token === 'td_open' && ((_c = tokens[idx + 1]) === null || _c === void 0 ? void 0 : _c.token) === 'td_close') {
                result += 'x';
            }
        }
    }
    return {
        table: result,
        tsv: arrTsv,
        csv: arrCsv,
        tableMd: arrMd,
        tableSmoothed: arrSmoothed,
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
    token.tableSmoothed = data.tableSmoothed;
    var className = 'inline-tabular';
    className += token.isSubTable ? ' sub-table' : '';
    if (include_table_html) {
        tabular = data.table;
    }
    var tsv = include_tsv && token.tsv
        ? "<tsv style=\"display: none;\">".concat((0, parse_mmd_element_1.formatSource)((0, tsv_1.TsvJoin)(token.tsv, options), true), "</tsv>")
        : '';
    var tableMd = include_table_markdown && token.tableMd
        ? "<table-markdown style=\"display: none;\">".concat((0, parse_mmd_element_1.formatSource)((0, table_markdown_1.tableMarkdownJoin)(data.tableMd, data.align), true), "</table-markdown>")
        : '';
    var csv = include_csv && token.csv
        ? "<csv style=\"display: none;\">".concat((0, parse_mmd_element_1.formatSource)((0, csv_1.CsvJoin)(token.csv, options), true), "</csv>")
        : '';
    return "<div class=\"".concat(className, "\">").concat(tabular).concat(tsv).concat(tableMd).concat(csv, "</div>");
};
exports.renderTabularInline = renderTabularInline;
//# sourceMappingURL=render-tabular.js.map