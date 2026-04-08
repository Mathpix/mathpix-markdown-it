"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.visitCellWithoutTag = exports.visitPrefixBeforeMo = exports.AUTO_TAG_ENTRY = exports.buildAutoTagWithLabel = exports.buildFigureTag = exports.computeAugment = exports.isInsideEqnArrayCellWithSiblings = exports.isInsideMatrixCell = exports.isNumcasesTable = exports.extractTagFromConditionCell = exports.serializeTagContent = exports.getLabelKey = void 0;
var tslib_1 = require("tslib");
var consts_1 = require("../consts");
var common_1 = require("../common");
var bracket_utils_1 = require("../bracket-utils");
var builders_1 = require("./builders");
var serialize_1 = require("./serialize");
/** Extract the original \label{} key from an mlabeledtr label cell.
 *  MathJax stores the id as "mjx-eqn:<label_key>" when useLabelIds is true. */
var getLabelKey = function (labelCell) {
    var key = (0, common_1.getProp)(labelCell, consts_1.DATA_LABEL_KEY);
    return key ? String(key) : null;
};
exports.getLabelKey = getLabelKey;
/** Serialize a tag label mtd as Typst content for use inside [...].
 *  mtext → plain text, math → $typst_math$.
 *  "(1.2)" → "1.2", "($x\sqrt{5}$ 1.3.1)" → "$x sqrt(5)$ 1.3.1".
 *  NOTE: returns a plain string because tag content lives in Typst content-mode,
 *  not math-mode. */
var serializeTagContent = function (labelCell, serialize) {
    var e_1, _a;
    try {
        var parts_1 = [];
        var visitChild_1 = function (child) {
            var e_2, _a, e_3, _b;
            var _c;
            if (!child) {
                return;
            }
            if (child.kind === 'mtext') {
                var text = (0, common_1.getChildText)(child);
                if (text) {
                    text = text.replace(consts_1.RE_NBSP, ' ');
                    text = (0, common_1.escapeTypstContent)(text);
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
            else if (child.kind === 'mrow' || child.kind === consts_1.TEX_ATOM) {
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
                    var mathStr = (0, serialize_1.serializeTypstMath)(serialize.visitNode(child)).trim();
                    if (mathStr) {
                        parts_1.push('$' + mathStr + '$');
                    }
                }
            }
            else {
                var mathStr = (0, serialize_1.serializeTypstMath)(serialize.visitNode(child)).trim();
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
exports.serializeTagContent = serializeTagContent;
// Extract explicit \tag{...} from a condition cell's mtext content.
var extractTagFromConditionCell = function (cell) {
    var lastTag = null;
    var walk = function (n) {
        var _a;
        if (!n) {
            return;
        }
        if (n.kind === 'mtext') {
            var text = (0, common_1.getChildText)(n);
            var re = new RegExp(consts_1.RE_TAG_EXTRACT.source, consts_1.RE_TAG_EXTRACT.flags.includes('g') ? consts_1.RE_TAG_EXTRACT.flags : consts_1.RE_TAG_EXTRACT.flags + 'g');
            var m = void 0;
            while ((m = re.exec(text)) !== null) {
                lastTag = m[1];
            }
            return;
        }
        (_a = n.childNodes) === null || _a === void 0 ? void 0 : _a.forEach(walk);
    };
    walk(cell);
    return lastTag;
};
exports.extractTagFromConditionCell = extractTagFromConditionCell;
// Detect numcases/subnumcases pattern
var isNumcasesTable = function (node) {
    if (!node.childNodes || node.childNodes.length === 0) {
        return false;
    }
    var firstRow = node.childNodes[0];
    if (firstRow.kind !== consts_1.MLABELEDTR) {
        return false;
    }
    if (!firstRow.childNodes || firstRow.childNodes.length < 3) {
        return false;
    }
    var prefixCell = firstRow.childNodes[1];
    return (0, bracket_utils_1.treeContainsMo)(prefixCell, '{');
};
exports.isNumcasesTable = isNumcasesTable;
/** Check if a node is nested inside a mat()/cases() cell */
var isInsideMatrixCell = function (node) {
    var _a, _b;
    var current = node.parent;
    while (current) {
        if (current.kind === 'mtd') {
            var mtr = current.parent;
            var outerTable = mtr === null || mtr === void 0 ? void 0 : mtr.parent;
            if ((outerTable === null || outerTable === void 0 ? void 0 : outerTable.kind) === 'mtable') {
                var firstRow = (_a = outerTable.childNodes) === null || _a === void 0 ? void 0 : _a[0];
                var isOuterEqnArray = ((_b = firstRow === null || firstRow === void 0 ? void 0 : firstRow.attributes) === null || _b === void 0 ? void 0 : _b.get('displaystyle')) === true;
                if (!isOuterEqnArray) {
                    return true;
                }
                var outerHasLines = outerTable.attributes.isSet('rowlines')
                    || outerTable.attributes.isSet('columnlines');
                if (outerHasLines) {
                    return true;
                }
                current = outerTable.parent;
                continue;
            }
            return false;
        }
        current = current.parent;
    }
    return false;
};
exports.isInsideMatrixCell = isInsideMatrixCell;
/** Check if a node is inside an eqnArray cell with sibling content. */
var isInsideEqnArrayCellWithSiblings = function (node) {
    var _a, _b, _c, _d, _f, _g, _h, _j, _k;
    var current = node.parent;
    var MAX_DEPTH = 20;
    for (var i = 0; i < MAX_DEPTH && current; i++) {
        if (current.isInferred && ((_a = current.parent) === null || _a === void 0 ? void 0 : _a.kind) === 'mtd') {
            var siblingCount = (_c = (_b = current.childNodes) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0;
            if (siblingCount <= 1) {
                return false;
            }
            var mtr = current.parent.parent;
            var outerTable = mtr === null || mtr === void 0 ? void 0 : mtr.parent;
            if ((outerTable === null || outerTable === void 0 ? void 0 : outerTable.kind) === 'mtable') {
                var firstRow = (_d = outerTable.childNodes) === null || _d === void 0 ? void 0 : _d[0];
                return ((_f = firstRow === null || firstRow === void 0 ? void 0 : firstRow.attributes) === null || _f === void 0 ? void 0 : _f.get('displaystyle')) === true;
            }
            return false;
        }
        if (current.kind === 'mtd') {
            var contentCount = (_h = (_g = current.childNodes) === null || _g === void 0 ? void 0 : _g.length) !== null && _h !== void 0 ? _h : 0;
            if (contentCount <= 1) {
                return false;
            }
            var mtr = current.parent;
            var outerTable = mtr === null || mtr === void 0 ? void 0 : mtr.parent;
            if ((outerTable === null || outerTable === void 0 ? void 0 : outerTable.kind) === 'mtable') {
                var firstRow = (_j = outerTable.childNodes) === null || _j === void 0 ? void 0 : _j[0];
                return ((_k = firstRow === null || firstRow === void 0 ? void 0 : firstRow.attributes) === null || _k === void 0 ? void 0 : _k.get('displaystyle')) === true;
            }
            return false;
        }
        current = current.parent;
    }
    return false;
};
exports.isInsideEqnArrayCellWithSiblings = isInsideEqnArrayCellWithSiblings;
/** Count the actual maximum number of columns across all rows. */
var getActualColumnCount = function (node) {
    var e_4, _a;
    var _b, _c, _d;
    var maxCols = 0;
    try {
        for (var _f = tslib_1.__values((_b = node.childNodes) !== null && _b !== void 0 ? _b : []), _g = _f.next(); !_g.done; _g = _f.next()) {
            var row = _g.value;
            var cols = (_d = (_c = row.childNodes) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0;
            if (cols > maxCols) {
                maxCols = cols;
            }
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (_g && !_g.done && (_a = _f.return)) _a.call(_f);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return maxCols;
};
/** Compute Typst augment string from rowlines/columnlines attributes. */
var computeAugment = function (node) {
    var columnlines = node.attributes.isSet('columnlines')
        ? String(node.attributes.get('columnlines') || '').trim().split(/\s+/)
        : [];
    var rowlines = node.attributes.isSet('rowlines')
        ? String(node.attributes.get('rowlines') || '').trim().split(/\s+/)
        : [];
    var actualCols = getActualColumnCount(node);
    var maxVline = actualCols > 0 ? actualCols - 1 : 0;
    var vlinePositions = [];
    var hasDashedLine = false;
    var hasSolidLine = false;
    for (var i = 0; i < columnlines.length; i++) {
        if (columnlines[i] === 'solid' || columnlines[i] === 'dashed') {
            var pos = i + 1;
            if (pos > maxVline) {
                continue;
            }
            vlinePositions.push(pos);
            if (columnlines[i] === 'dashed') {
                hasDashedLine = true;
            }
            else {
                hasSolidLine = true;
            }
        }
    }
    var hlinePositions = [];
    for (var i = 0; i < rowlines.length; i++) {
        if (rowlines[i] === 'solid' || rowlines[i] === 'dashed') {
            hlinePositions.push(i + 1);
            if (rowlines[i] === 'dashed') {
                hasDashedLine = true;
            }
            else {
                hasSolidLine = true;
            }
        }
    }
    if (hlinePositions.length === 0 && vlinePositions.length === 0)
        return '';
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
    if (hasDashedLine && !hasSolidLine) {
        parts.push('stroke: (dash: "dashed")');
    }
    return "#(".concat(parts.join(', '), ")");
};
exports.computeAugment = computeAugment;
/** Build a #figure() wrapper for an explicit equation tag with a label. */
var buildFigureTag = function (tagContent, labelKey) {
    var figure = "#figure(kind: \"".concat(consts_1.EQ_TAG_FIGURE_KIND, "\", supplement: none, numbering: n => [").concat(tagContent, "], [").concat(tagContent, "])");
    return "[".concat(figure, " <").concat((0, common_1.sanitizeTypstLabel)(labelKey), ">]");
};
exports.buildFigureTag = buildFigureTag;
/** Build an auto-numbered tag entry with a label. */
var buildAutoTagWithLabel = function (labelKey) {
    var getNum = "numbering(".concat(consts_1.DEFAULT_EQ_NUMBERING, ", ..counter(math.equation).get())");
    var figure = "#figure(kind: \"".concat(consts_1.EQ_TAG_FIGURE_KIND, "\", supplement: none, numbering: _ => n, [#n])");
    return "{ counter(math.equation).step(); context { let n = ".concat(getNum, "; [").concat(figure, " <").concat((0, common_1.sanitizeTypstLabel)(labelKey), ">] } }");
};
exports.buildAutoTagWithLabel = buildAutoTagWithLabel;
/** Simple auto-numbered tag entry. */
exports.AUTO_TAG_ENTRY = "{ counter(math.equation).step(); context counter(math.equation).display(".concat(consts_1.DEFAULT_EQ_NUMBERING, ") }");
/** Flattenable containers for prefix extraction. */
var FLATTENABLE_KINDS = new Set(['mtd', 'mpadded', 'mstyle']);
var shouldFlattenNode = function (n) {
    return FLATTENABLE_KINDS.has(n.kind) || n.isInferred;
};
/** Visit flat children until stopMo, return SeqNode (for numcases prefix extraction). */
var visitPrefixBeforeMo = function (node, serialize, stopMoText) {
    var e_5, _a;
    var flatChildren = [];
    var extractFlat = function (n) {
        var e_6, _a;
        if (!n || !n.childNodes) {
            return;
        }
        if (n.kind === 'mphantom') {
            return;
        }
        if (shouldFlattenNode(n)) {
            try {
                for (var _b = tslib_1.__values(n.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    extractFlat(child);
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_6) throw e_6.error; }
            }
        }
        else {
            flatChildren.push(n);
        }
    };
    extractFlat(node);
    var result = [];
    try {
        for (var flatChildren_1 = tslib_1.__values(flatChildren), flatChildren_1_1 = flatChildren_1.next(); !flatChildren_1_1.done; flatChildren_1_1 = flatChildren_1.next()) {
            var child = flatChildren_1_1.value;
            if (child.kind === 'mo' && (0, common_1.getNodeText)(child) === stopMoText) {
                break;
            }
            result.push(serialize.visitNode(child));
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (flatChildren_1_1 && !flatChildren_1_1.done && (_a = flatChildren_1.return)) _a.call(flatChildren_1);
        }
        finally { if (e_5) throw e_5.error; }
    }
    if (result.length === 0) {
        return null;
    }
    return (0, builders_1.seq)(result);
};
exports.visitPrefixBeforeMo = visitPrefixBeforeMo;
/** Visit a cell's children, skipping mtext nodes that contain \tag{...}. */
var visitCellWithoutTag = function (mtdNode, serialize) {
    var e_7, _a;
    var children = [];
    var walk = function (n) {
        var e_8, _a;
        if (!n) {
            return;
        }
        if (n.isInferred && n.childNodes) {
            try {
                for (var _b = tslib_1.__values(n.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var c = _c.value;
                    walk(c);
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_8) throw e_8.error; }
            }
            return;
        }
        if (n.kind === 'mtext') {
            var text = (0, common_1.getChildText)(n);
            if (text && consts_1.RE_TAG_EXTRACT.test(text)) {
                // Strip \tag{...} — if remaining text is non-empty, visit it
                var stripped = text.replace(consts_1.RE_TAG_STRIP, '').replace(/\s{2,}/g, ' ').trim();
                if (stripped) {
                    children.push(serialize.visitNode(n));
                }
                return;
            }
        }
        children.push(serialize.visitNode(n));
    };
    if (mtdNode.childNodes) {
        try {
            for (var _b = tslib_1.__values(mtdNode.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var c = _c.value;
                walk(c);
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_7) throw e_7.error; }
        }
    }
    return children.length === 1
        ? children[0]
        : (0, builders_1.seq)(children);
};
exports.visitCellWithoutTag = visitCellWithoutTag;
//# sourceMappingURL=table-helpers.js.map