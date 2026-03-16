"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mtr = exports.mtable = void 0;
var tslib_1 = require("tslib");
var consts_1 = require("./consts");
var common_1 = require("./common");
var escape_utils_1 = require("./escape-utils");
var bracket_utils_1 = require("./bracket-utils");
/** Extract the original \label{} key from an mlabeledtr label cell.
 *  MathJax stores the id as "mjx-eqn:<label_key>" when useLabelIds is true. */
var getLabelKey = function (labelCell) {
    var key = (0, common_1.getProp)(labelCell, consts_1.DATA_LABEL_KEY);
    return key ? String(key) : null;
};
/** Serialize a tag label mtd as Typst content for use inside [...].
 *  mtext → plain text, math → $typst_math$.
 *  "(1.2)" → "1.2", "($x\sqrt{5}$ 1.3.1)" → "$x sqrt(5)$ 1.3.1". */
var serializeTagContent = function (labelCell, serialize) {
    var e_1, _a;
    try {
        var parts_1 = [];
        var visitChild_1 = function (child) {
            var e_2, _a, e_3, _b;
            var _c;
            if (!child)
                return;
            if (child.kind === 'mtext') {
                var text = (0, common_1.getChildText)(child);
                if (text) {
                    text = text.replace(consts_1.RE_NBSP, ' ');
                    text = text.replace(consts_1.RE_CONTENT_SPECIAL, '\\$&');
                    parts_1.push(text);
                }
            }
            else if (child.isInferred) {
                if (child.childNodes) {
                    try {
                        for (var _d = tslib_1.__values(child.childNodes), _f = _d.next(); !_f.done; _f = _d.next()) {
                            var c = _f.value;
                            visitChild_1(c);
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_f && !_f.done && (_a = _d.return)) _a.call(_d);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
            }
            else if (child.kind === 'mrow' || child.kind === 'TeXAtom') {
                var hasMtext = (_c = child.childNodes) === null || _c === void 0 ? void 0 : _c.some(function (c) { var _a; return c && (c.kind === 'mtext' || (c.isInferred && ((_a = c.childNodes) === null || _a === void 0 ? void 0 : _a.some(function (cc) { return (cc === null || cc === void 0 ? void 0 : cc.kind) === 'mtext'; })))); });
                if (hasMtext) {
                    if (child.childNodes) {
                        try {
                            for (var _g = tslib_1.__values(child.childNodes), _h = _g.next(); !_h.done; _h = _g.next()) {
                                var c = _h.value;
                                visitChild_1(c);
                            }
                        }
                        catch (e_3_1) { e_3 = { error: e_3_1 }; }
                        finally {
                            try {
                                if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
                            }
                            finally { if (e_3) throw e_3.error; }
                        }
                    }
                }
                else {
                    var data = serialize.visitNode(child, '');
                    var mathStr = data.typst.trim();
                    if (mathStr) {
                        parts_1.push('$' + mathStr + '$');
                    }
                }
            }
            else {
                var data = serialize.visitNode(child, '');
                var mathStr = data.typst.trim();
                if (mathStr) {
                    parts_1.push('$' + mathStr + '$');
                }
            }
        };
        if (labelCell.childNodes) {
            try {
                for (var _b = tslib_1.__values(labelCell.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    visitChild_1(child);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        return parts_1.join('').trim();
    }
    catch (_e) {
        return '';
    }
};
// Extract explicit \tag{...} from a condition cell's mtext content.
// Returns the tag content (e.g. "3.12") or null if no \tag found.
// When multiple \tag{} are present, the last one wins (LaTeX behavior).
var RE_TAG_EXTRACT_G = new RegExp(consts_1.RE_TAG_EXTRACT.source, consts_1.RE_TAG_EXTRACT.flags.includes('g') ? consts_1.RE_TAG_EXTRACT.flags : consts_1.RE_TAG_EXTRACT.flags + 'g');
var extractTagFromConditionCell = function (cell) {
    var lastTag = null;
    var walk = function (n) {
        var _a;
        if (!n)
            return;
        if (n.kind === 'mtext') {
            var text = (0, common_1.getChildText)(n);
            RE_TAG_EXTRACT_G.lastIndex = 0;
            var m = void 0;
            while ((m = RE_TAG_EXTRACT_G.exec(text)) !== null) {
                lastTag = m[1];
            }
            return;
        }
        (_a = n.childNodes) === null || _a === void 0 ? void 0 : _a.forEach(walk);
    };
    walk(cell);
    return lastTag;
};
// Detect numcases/subnumcases pattern (best-effort heuristic):
// - First row is mlabeledtr with 3+ children (label + prefix + content [+ condition])
//   3 children: empty prefix or no & separator → label + prefix_with_brace + content
//   4 children: non-empty prefix with & separator → label + prefix + value + condition
// - First row's cell[1] contains a visible '{' mo (inside mpadded, outside mphantom)
// Note: '{' as a math symbol (e.g. \{x\}) in cell[1] could cause a false positive,
// but this position is almost always the cases brace in labeled equation arrays.
var isNumcasesTable = function (node) {
    if (!node.childNodes || node.childNodes.length === 0)
        return false;
    var firstRow = node.childNodes[0];
    if (firstRow.kind !== 'mlabeledtr')
        return false;
    if (firstRow.childNodes.length < 3)
        return false;
    // Check that cell[1] (first data column) contains a '{' brace
    var prefixCell = firstRow.childNodes[1];
    return (0, bracket_utils_1.treeContainsMo)(prefixCell, '{');
};
/** Build a label suffix ` <key>` or empty string. */
var labelSuffix = function (key) {
    return key ? " <".concat(key, ">") : '';
};
/** Build a #figure() wrapper for an explicit equation tag with a label. */
var buildFigureTag = function (tagContent, labelKey) {
    var figure = "#figure(kind: \"".concat(consts_1.EQ_TAG_FIGURE_KIND, "\", supplement: none, numbering: n => [").concat(tagContent, "], [").concat(tagContent, "])");
    return "[".concat(figure, " <").concat(labelKey, ">]");
};
/** Build an auto-numbered tag entry with a label (counter step + figure for referenceability). */
var buildAutoTagWithLabel = function (labelKey) {
    var getNum = "numbering(".concat(consts_1.DEFAULT_EQ_NUMBERING, ", ..counter(math.equation).get())");
    var figure = "#figure(kind: \"".concat(consts_1.EQ_TAG_FIGURE_KIND, "\", supplement: none, numbering: _ => n, [#n])");
    return "{ counter(math.equation).step(); context { let n = ".concat(getNum, "; [").concat(figure, " <").concat(labelKey, ">] } }");
};
/** Simple auto-numbered tag entry (counter step + display). */
var AUTO_TAG_ENTRY = "{ counter(math.equation).step(); context counter(math.equation).display(".concat(consts_1.DEFAULT_EQ_NUMBERING, ") }");
/** numcases/subnumcases → #grid() with cases + numbering column */
var buildNumcasesGrid = function (node, serialize, countRow) {
    var e_4, _a;
    var res = (0, common_1.initTypstData)();
    var firstRow = node.childNodes[0];
    var prefixCell = firstRow.childNodes[1]; // cell after label
    var prefix = (0, bracket_utils_1.serializePrefixBeforeMo)(prefixCell, serialize, '{');
    // Determine tag source for each row:
    // 1. Condition-embedded \tag{...} in mtext (MathJax leaves it as literal text)
    // 2. Label cell explicit tag (MathJax processed \tag, data-tag-auto is false)
    // 3. Auto-numbered (data-tag-auto is true)
    var rowTagSources = [];
    for (var i = 0; i < countRow; i++) {
        var mtrNode = node.childNodes[i];
        var labelCell = (mtrNode.kind === 'mlabeledtr' && mtrNode.childNodes.length > 0) ? mtrNode.childNodes[0] : null;
        var labelKey = labelCell ? getLabelKey(labelCell) : null;
        // Check condition cell for embedded \tag{...} in mtext
        var condCell = mtrNode.childNodes[mtrNode.childNodes.length - 1];
        var condTag = extractTagFromConditionCell(condCell);
        if (condTag) {
            rowTagSources.push({ source: 'condition', content: condTag, labelKey: labelKey });
        }
        else if (labelCell) {
            var isAutoNumber = !!(0, common_1.getProp)(labelCell, consts_1.DATA_TAG_AUTO);
            if (!isAutoNumber) {
                var tagContent = serializeTagContent(labelCell, serialize);
                rowTagSources.push({ source: 'label', content: tagContent, labelKey: labelKey });
            }
            else {
                rowTagSources.push({ source: 'auto', content: '', labelKey: labelKey });
            }
        }
        else {
            rowTagSources.push({ source: 'auto', content: '', labelKey: null });
        }
    }
    var caseRows = [];
    for (var i = 0; i < countRow; i++) {
        var mtrNode = node.childNodes[i];
        var startCol = mtrNode.kind === 'mlabeledtr' ? 2 : 1; // skip label + prefix
        var cells = [];
        for (var j = startCol; j < mtrNode.childNodes.length; j++) {
            var mtdNode = mtrNode.childNodes[j];
            var cellData = serialize.visitNode(mtdNode, '');
            var trimmed = cellData.typst.trim();
            // Strip \tag{...} from condition column if tag was extracted from there
            if (j === mtrNode.childNodes.length - 1 && rowTagSources[i].source === 'condition') {
                trimmed = trimmed.replace(consts_1.RE_TAG_STRIP, '');
                trimmed = trimmed.replace(/\s{2,}/g, ' ');
                trimmed = trimmed.replace(/\s+"$/g, '"');
                trimmed = trimmed.trim();
            }
            if (trimmed)
                cells.push(trimmed);
        }
        if (cells.length === 1) {
            caseRows.push((0, escape_utils_1.escapeCasesSeparators)(cells[0]));
        }
        else {
            caseRows.push(cells.map(function (c) { return (0, escape_utils_1.escapeCasesSeparators)(c); }).join(' & '));
        }
    }
    var casesContent;
    if (caseRows.length >= 2) {
        casesContent = "cases(\n  ".concat(caseRows.join(',\n  '), ",\n)");
    }
    else {
        casesContent = "cases(".concat(caseRows.join(', '), ")");
    }
    var mathContent = prefix ? "".concat(prefix, " ").concat(casesContent) : casesContent;
    var tagEntries = [];
    for (var i = 0; i < countRow; i++) {
        var info = rowTagSources[i];
        var tagText = '';
        if (info.source === 'condition') {
            // Escape content-mode special chars in condition-embedded tag text
            tagText = "(".concat(info.content.replace(consts_1.RE_CONTENT_SPECIAL, '\\$&'), ")");
        }
        else if (info.source === 'label' && info.content) {
            tagText = info.content; // already escaped by serializeTagContent
        }
        if (tagText && info.labelKey) {
            // Explicit tag with label — wrap in #figure() so the label is referenceable
            tagEntries.push(buildFigureTag(tagText, info.labelKey));
        }
        else if (tagText) {
            tagEntries.push("[".concat(tagText, "]"));
        }
        else if (info.labelKey) {
            // Auto-numbered with label — step counter outside context, wrap in #figure() for referenceability
            tagEntries.push(buildAutoTagWithLabel(info.labelKey));
        }
        else {
            tagEntries.push(AUTO_TAG_ENTRY);
        }
    }
    var gridLines = [
        '#grid(',
        '  columns: (1fr, auto),',
        '  align: (left, right + horizon),',
        "  math.equation(block: true, numbering: none, $ ".concat(mathContent, " $),"),
        '  grid(',
        '    row-gutter: 0.65em,',
    ];
    try {
        for (var tagEntries_1 = tslib_1.__values(tagEntries), tagEntries_1_1 = tagEntries_1.next(); !tagEntries_1_1.done; tagEntries_1_1 = tagEntries_1.next()) {
            var entry = tagEntries_1_1.value;
            gridLines.push("    ".concat(entry, ","));
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (tagEntries_1_1 && !tagEntries_1_1.done && (_a = tagEntries_1.return)) _a.call(tagEntries_1);
        }
        finally { if (e_4) throw e_4.error; }
    }
    gridLines.push('  ),');
    gridLines.push(')');
    res = (0, common_1.addToTypstData)(res, { typst: gridLines.join('\n') });
    res.typst_inline = mathContent;
    return res;
};
/** Join rows with \\ separators, optionally prepending preContent. */
var joinRows = function (rows, preContent) {
    return preContent
        ? "".concat(preContent, " \\\n").concat(rows.join(' \\\n'))
        : rows.join(' \\\n');
};
/** eqnArray with tags → number-align / separate / no-tag strategies */
var buildTaggedEqnArray = function (node, serialize, inputRows, countRow, preContent, postContent) {
    var res = (0, common_1.initTypstData)();
    var rows = tslib_1.__spreadArray([], tslib_1.__read(inputRows), false);
    var rowTagInfos = [];
    for (var i = 0; i < countRow; i++) {
        var mtrNode = node.childNodes[i];
        if (mtrNode.kind === 'mlabeledtr' && mtrNode.childNodes.length > 0) {
            var labelCell = mtrNode.childNodes[0];
            var tagContent = serializeTagContent(labelCell, serialize);
            var isAutoNumber = !!(0, common_1.getProp)(labelCell, consts_1.DATA_TAG_AUTO);
            var labelKey = getLabelKey(labelCell);
            rowTagInfos.push({
                isTagged: !!tagContent,
                isAutoTag: isAutoNumber && !!tagContent,
                isExplicitTag: !isAutoNumber && !!tagContent,
                tagContent: tagContent || '',
                labelKey: labelKey,
            });
        }
        else {
            rowTagInfos.push({ isTagged: false, isAutoTag: false, isExplicitTag: false, tagContent: '', labelKey: null });
        }
    }
    var explicitTagIndices = rowTagInfos.map(function (r, i) { return r.isExplicitTag ? i : -1; }).filter(function (i) { return i >= 0; });
    var autoTagIndices = rowTagInfos.map(function (r, i) { return r.isAutoTag ? i : -1; }).filter(function (i) { return i >= 0; });
    var totalTagged = explicitTagIndices.length + autoTagIndices.length;
    // Strategy: number-align — exactly ONE explicit tag in multi-row, no auto-tags
    if (explicitTagIndices.length === 1 && autoTagIndices.length === 0 && countRow > 1) {
        var tagIdx = explicitTagIndices[0];
        var info = rowTagInfos[tagIdx];
        // Merge pre/post content into rows
        if (postContent && rows.length > 0) {
            rows[rows.length - 1] += " ".concat(postContent);
        }
        // Determine number-align based on tag position
        // When preContent exists, it becomes an extra row at the top
        var totalRows = (preContent ? countRow + 1 : countRow)
            + (postContent && rows.length === 0 ? 1 : 0);
        var adjustedTagIdx = preContent ? tagIdx + 1 : tagIdx;
        var numberAlign = void 0;
        if (adjustedTagIdx === totalRows - 1) {
            numberAlign = 'end + bottom';
        }
        else if (adjustedTagIdx === 0) {
            numberAlign = 'end + top';
        }
        else {
            numberAlign = 'end + horizon';
        }
        var mathContent = joinRows(rows, preContent);
        var supplementPart = info.labelKey ? ', supplement: none' : '';
        var eqn = "#math.equation(block: true".concat(supplementPart, ", numbering: n => [").concat(info.tagContent, "], number-align: ").concat(numberAlign, ", $ ").concat(mathContent, " $)");
        var block = "".concat(eqn).concat(labelSuffix(info.labelKey), "\n#counter(math.equation).update(n => n - 1)");
        res = (0, common_1.addToTypstData)(res, { typst: block });
        res.typst_inline = joinRows(rows, preContent);
    }
    else if (totalTagged > 0) {
        // Strategy: separate — multiple tags or auto-numbered rows
        // Each row becomes a separate #math.equation block
        // Merge pre/post content into rows
        if (preContent && rows.length > 0) {
            rows[0] = "".concat(preContent, " \\\n").concat(rows[0]);
        }
        if (postContent && rows.length > 0) {
            rows[rows.length - 1] += " ".concat(postContent);
        }
        var eqnBlocks = [];
        for (var i = 0; i < countRow; i++) {
            var info = rowTagInfos[i];
            var rowContent = rows[i];
            if (info.isTagged) {
                var numbering = info.isAutoTag
                    ? consts_1.DEFAULT_EQ_NUMBERING
                    : "n => [".concat(info.tagContent, "]");
                var supplementPart = info.labelKey ? ', supplement: none' : '';
                eqnBlocks.push("#math.equation(block: true".concat(supplementPart, ", numbering: ").concat(numbering, ", $ ").concat(rowContent, " $)").concat(labelSuffix(info.labelKey)));
                if (info.isExplicitTag) {
                    eqnBlocks.push('#counter(math.equation).update(n => n - 1)');
                }
            }
            else {
                eqnBlocks.push("#math.equation(block: true, numbering: none, $ ".concat(rowContent, " $)"));
            }
        }
        res = (0, common_1.addToTypstData)(res, { typst: eqnBlocks.join('\n') });
        res.typst_inline = rows.join(' \\\n');
    }
    else {
        // mlabeledtr nodes present but no actual tag content — treat as no-tag
        return buildUntaggedEqnArray(rows, preContent, postContent);
    }
    return res;
};
/** eqnArray without tags → rows with \\ separators */
var buildUntaggedEqnArray = function (inputRows, preContent, postContent) {
    var res = (0, common_1.initTypstData)();
    var rows = tslib_1.__spreadArray([], tslib_1.__read(inputRows), false);
    if (postContent && rows.length > 0) {
        rows[rows.length - 1] += " ".concat(postContent);
    }
    var content = joinRows(rows, preContent);
    res = (0, common_1.addToTypstData)(res, { typst: content });
    return res;
};
/** Check if a node is nested inside a mat()/cases() cell where \\ linebreaks
 *  are ignored by Typst. Walks up the parent chain looking for mtd → mtr →
 *  mtable. Returns true when any ancestor mtable is a matrix or cases
 *  (not an eqnArray at the top level). When the immediate outer mtable is
 *  an eqnArray that is itself nested, continues walking up. */
var isInsideMatrixCell = function (node) {
    var _a, _b;
    var current = node.parent;
    while (current) {
        if (current.kind === 'mtd') {
            var mtr_1 = current.parent;
            var outerTable = mtr_1 === null || mtr_1 === void 0 ? void 0 : mtr_1.parent;
            if ((outerTable === null || outerTable === void 0 ? void 0 : outerTable.kind) === 'mtable') {
                var firstRow = (_a = outerTable.childNodes) === null || _a === void 0 ? void 0 : _a[0];
                var isOuterEqnArray = ((_b = firstRow === null || firstRow === void 0 ? void 0 : firstRow.attributes) === null || _b === void 0 ? void 0 : _b.get('displaystyle')) === true;
                if (!isOuterEqnArray)
                    return true;
                // Outer is eqnArray — continue walking up to check if it is also nested
                current = outerTable.parent;
                continue;
            }
            return false;
        }
        current = current.parent;
    }
    return false;
};
/** Nested eqnArray inside a mat()/cases() cell → mat(delim: #none, ...).
 *  Rows use ; separators instead of \\ linebreaks (which Typst ignores in cells).
 *  Rows are already escaped; align is a pre-formatted string like "#right",
 *  "#(right, left)", or "" (omit for default center). */
var buildNestedMat = function (inputRows, align) {
    var alignPart = align ? ", align: ".concat(align) : '';
    if (inputRows.length >= 2) {
        return "mat(delim: #none".concat(alignPart, ", \n  ").concat(inputRows.join(';\n  '), ",\n)");
    }
    return "mat(delim: #none".concat(alignPart, ", ").concat(inputRows.join('; '), ")");
};
var buildNestedEqnArray = function (inputRows, inputRowsInline, align) {
    var mat = buildNestedMat(inputRows, align);
    var matInline = buildNestedMat(inputRowsInline, align);
    return { typst: "display(".concat(mat, ")"), typst_inline: matInline };
};
/** matrix → mat(delim: ..., ...) with augment/align/frame.
 *  rowsInline is an optional parallel set of rows for typst_inline
 *  (e.g. without display() wrappers). */
var buildMatrix = function (node, rows, branchOpen, branchClose, rowsInline) {
    var res = (0, common_1.initTypstData)();
    var columnlines = node.attributes.isSet('columnlines')
        ? String(node.attributes.get('columnlines') || '').trim().split(/\s+/)
        : [];
    var rowlines = node.attributes.isSet('rowlines')
        ? String(node.attributes.get('rowlines') || '').trim().split(/\s+/)
        : [];
    var frame = node.attributes.isSet('frame')
        ? String(node.attributes.get('frame') || '')
        : '';
    var vlinePositions = [];
    for (var i = 0; i < columnlines.length; i++) {
        if (columnlines[i] === 'solid' || columnlines[i] === 'dashed') {
            vlinePositions.push(i + 1);
        }
    }
    var hlinePositions = [];
    for (var i = 0; i < rowlines.length; i++) {
        if (rowlines[i] === 'solid' || rowlines[i] === 'dashed') {
            hlinePositions.push(i + 1);
        }
    }
    var augmentStr = '';
    if (hlinePositions.length > 0 || vlinePositions.length > 0) {
        var parts = [];
        if (hlinePositions.length === 1) {
            parts.push("hline: ".concat(hlinePositions[0]));
        }
        else if (hlinePositions.length > 1) {
            parts.push("hline: (".concat(hlinePositions.join(', '), ")"));
        }
        if (vlinePositions.length === 1) {
            parts.push("vline: ".concat(vlinePositions[0]));
        }
        else if (vlinePositions.length > 1) {
            parts.push("vline: (".concat(vlinePositions.join(', '), ")"));
        }
        augmentStr = "augment: #(".concat(parts.join(', '), ")");
    }
    var columnAlign = String(node.attributes.get('columnalign') || '');
    var alignArr = columnAlign ? columnAlign.trim().split(/\s+/) : [];
    var uniqueAligns = tslib_1.__spreadArray([], tslib_1.__read(new Set(alignArr)), false);
    var matAlign = (uniqueAligns.length === 1 && uniqueAligns[0] !== 'center')
        ? uniqueAligns[0] // 'left' or 'right'
        : '';
    var params = [];
    var hasDelimiters = branchOpen || branchClose;
    // Matched pair (same char like |…| or paired like (…)) → mat(delim: ...).
    // Mismatched or asymmetric → mat(delim: #none) wrapped in lr() below.
    var isMatchedPair = branchOpen && branchClose
        && (branchOpen === branchClose || consts_1.OPEN_BRACKETS[branchOpen] === branchClose);
    if (isMatchedPair) {
        params.push("delim: ".concat((0, bracket_utils_1.delimiterToTypst)(branchOpen)));
    }
    else {
        params.push('delim: #none');
    }
    if (matAlign) {
        params.push("align: #".concat(matAlign));
    }
    if (augmentStr) {
        params.push(augmentStr);
    }
    var paramStr = params.length > 0 ? params.join(', ') + ', ' : '';
    // Build a mat(...) expression from rows, optionally wrapped in lr() for
    // non-matched delimiters.
    var buildMatExpr = function (r) {
        var content = r.length >= 2
            ? "\n  ".concat(r.join(';\n  '), ",\n")
            : r.join('; ');
        var expr = "mat(".concat(paramStr).concat(content, ")");
        if (hasDelimiters && !isMatchedPair) {
            var openEsc = branchOpen ? (0, bracket_utils_1.escapeLrDelimiter)(branchOpen) : '';
            var closeEsc = branchClose ? (0, bracket_utils_1.escapeLrDelimiter)(branchClose) : '';
            if (openEsc && closeEsc) {
                expr = "lr(".concat(openEsc, " ").concat(expr, " ").concat(closeEsc, ")");
            }
            else if (openEsc) {
                expr = "lr(".concat(openEsc, " ").concat(expr, ")");
            }
            else if (closeEsc) {
                expr = "lr(".concat(expr, " ").concat(closeEsc, ")");
            }
        }
        return expr;
    };
    var matExpr = buildMatExpr(rows);
    var matExprInline = rowsInline ? buildMatExpr(rowsInline) : undefined;
    if (frame === 'solid') {
        res = (0, common_1.addToTypstData)(res, { typst: "#box(stroke: 0.5pt, inset: 3pt, $ ".concat(matExpr, " $)"), typst_inline: matExprInline !== null && matExprInline !== void 0 ? matExprInline : matExpr });
    }
    else {
        res = (0, common_1.addToTypstData)(res, tslib_1.__assign({ typst: matExpr }, (matExprInline ? { typst_inline: matExprInline } : {})));
    }
    return res;
};
var mtable = function (node, serialize) {
    var _a, _b, _c, _d;
    var res = (0, common_1.initTypstData)();
    var countRow = node.childNodes.length;
    var envName = String(node.attributes.get('name') || '');
    // Check for enclosing brackets from \left...\right (mrow parent with open/close).
    // Only inherit parent delimiters when this mtable is the sole content child
    // (excluding delimiter mo's).  When the parent mrow contains other content
    // alongside the mtable, the mrow handler wraps everything in lr() itself.
    var parentMrow = ((_a = node.parent) === null || _a === void 0 ? void 0 : _a.kind) === 'mrow' ? node.parent : null;
    var hasParentDelims = parentMrow
        && ((0, common_1.getProp)(parentMrow, 'open') !== undefined
            || (0, common_1.getProp)(parentMrow, 'close') !== undefined);
    var isSoleContent = hasParentDelims
        && (0, common_1.getContentChildren)(parentMrow).length === 1;
    var openProp = isSoleContent ? (0, common_1.getProp)(parentMrow, 'open') : undefined;
    var closeProp = isSoleContent ? (0, common_1.getProp)(parentMrow, 'close') : undefined;
    var branchOpen = openProp !== undefined ? String(openProp) : '';
    var branchClose = closeProp !== undefined ? String(closeProp) : '';
    // Determine if this is a cases environment
    var isCases = envName === 'cases' || (branchOpen === '{' && branchClose === '');
    // Detect numcases/subnumcases pattern
    var isNumcases = isNumcasesTable(node);
    // Determine if this is an equation array (align, gather, split, etc.)
    // Skip eqnArray detection for numcases — it should be treated as cases
    var isEqnArray = !isNumcases && !isCases && node.childNodes.length > 0
        && ((_b = node.childNodes[0].attributes) === null || _b === void 0 ? void 0 : _b.get('displaystyle')) === true;
    // Nested aligned/gathered inside a mat()/cases() cell: Typst ignores \\
    // linebreaks in cells, so we must produce a nested mat() with ; separators.
    var isNested = isEqnArray && isInsideMatrixCell(node);
    if (isNumcases) {
        return buildNumcasesGrid(node, serialize, countRow);
    }
    var rows = [];
    var rowsInline = []; // inline variants (without display() wrappers)
    var hasInlineDiff = false; // track if inline rows differ from block rows
    // For nested eqnArrays, collect raw cells per row to analyze column usage.
    var nestedRawRows = [];
    var nestedRawRowsInline = [];
    for (var i = 0; i < countRow; i++) {
        var mtrNode = node.childNodes[i];
        var countColl = ((_c = mtrNode.childNodes) === null || _c === void 0 ? void 0 : _c.length) || 0;
        // For mlabeledtr (numbered equation rows), the first child is the
        // equation number label — skip it so we only emit the math content
        var startCol = mtrNode.kind === 'mlabeledtr' ? 1 : 0;
        var cells = [];
        var cellsInline = [];
        for (var j = startCol; j < countColl; j++) {
            var mtdNode = mtrNode.childNodes[j];
            var cellData = serialize.visitNode(mtdNode, '');
            var block = cellData.typst.trim();
            var inline = ((_d = cellData.typst_inline) !== null && _d !== void 0 ? _d : cellData.typst).trim();
            cells.push(block);
            cellsInline.push(inline);
            if (block !== inline)
                hasInlineDiff = true;
        }
        if (isNested) {
            nestedRawRows.push(cells);
            nestedRawRowsInline.push(cellsInline);
        }
        else if (isEqnArray) {
            // Join cells with & alignment markers.
            // Within each column pair (right-left): &
            // Between column pairs: &quad for visual spacing.
            var pairs = [];
            for (var k = 0; k < cells.length; k += 2) {
                if (k + 1 < cells.length) {
                    pairs.push("".concat(cells[k], " &").concat(cells[k + 1]));
                }
                else {
                    pairs.push(cells[k]);
                }
            }
            rows.push(pairs.join(' &quad '));
        }
        else if (isCases) {
            // Cases: escape top-level commas in each cell to prevent them
            // being parsed as cases() argument separators, then join with &
            rows.push(cells.map(function (c) { return (0, escape_utils_1.escapeCasesSeparators)(c); }).join(' & '));
        }
        else {
            // Matrix: escape top-level commas and semicolons in each cell
            // to prevent them being parsed as mat() cell/row separators
            rows.push(cells.map(function (c) { return (0, escape_utils_1.escapeCasesSeparators)(c); }).join(', '));
            rowsInline.push(cellsInline.map(function (c) { return (0, escape_utils_1.escapeCasesSeparators)(c); }).join(', '));
        }
    }
    if (isNested) {
        var isGathered = envName === 'gathered' || envName === 'gather' || envName === 'gather*';
        var maxCols = nestedRawRows.reduce(function (m, r) { return Math.max(m, r.length); }, 0);
        // Analyze column usage in rl-pairs to pick a single alignment.
        // Even columns (0, 2, ...) are right-aligned, odd are left.
        var hasOddContent = nestedRawRows.some(function (r) {
            return r.some(function (c, k) { return k % 2 === 1 && c !== ''; });
        });
        var nestedAlign = void 0;
        if (isGathered || maxCols <= 0) {
            nestedAlign = ''; // gathered: center (Typst mat default)
        }
        else if (!hasOddContent) {
            nestedAlign = '#right'; // content only in even (right) columns
        }
        else {
            nestedAlign = '#left'; // content in odd (left) columns or mixed
        }
        var nestedRows = nestedRawRows.map(function (r) {
            return (0, escape_utils_1.escapeCasesSeparators)(r.join(' ').trim());
        });
        var nestedRowsInline = nestedRawRowsInline.map(function (r) {
            return (0, escape_utils_1.escapeCasesSeparators)(r.join(' ').trim());
        });
        return buildNestedEqnArray(nestedRows, nestedRowsInline, nestedAlign);
    }
    else if (isEqnArray) {
        var hasAnyTag = node.childNodes.some(function (child) { return child.kind === 'mlabeledtr'; });
        var preContent = String((0, common_1.getProp)(node, consts_1.DATA_PRE_CONTENT) || '');
        var postContent = String((0, common_1.getProp)(node, consts_1.DATA_POST_CONTENT) || '');
        if (hasAnyTag) {
            return buildTaggedEqnArray(node, serialize, rows, countRow, preContent, postContent);
        }
        else {
            return buildUntaggedEqnArray(rows, preContent, postContent);
        }
    }
    else if (isCases) {
        // Cases environment
        var casesBody = void 0;
        if (rows.length >= 2) {
            casesBody = "cases(\n  ".concat(rows.join(',\n  '), ",\n)");
        }
        else {
            casesBody = "cases(".concat(rows.join(', '), ")");
        }
        res = (0, common_1.addToTypstData)(res, { typst: casesBody });
    }
    else {
        return buildMatrix(node, rows, branchOpen, branchClose, hasInlineDiff ? rowsInline : undefined);
    }
    return res;
};
exports.mtable = mtable;
var mtr = function (node, serialize) {
    var res = (0, common_1.initTypstData)();
    for (var i = 0; i < node.childNodes.length; i++) {
        if (i > 0) {
            res = (0, common_1.addToTypstData)(res, { typst: ', ' });
        }
        var data = serialize.visitNode(node.childNodes[i], '');
        res = (0, common_1.addToTypstData)(res, data);
    }
    return res;
};
exports.mtr = mtr;
//# sourceMappingURL=table-handlers.js.map