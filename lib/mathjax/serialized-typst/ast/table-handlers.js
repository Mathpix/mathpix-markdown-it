"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mtrAst = exports.mtableAst = void 0;
var tslib_1 = require("tslib");
var consts_1 = require("../consts");
var common_1 = require("../common");
var types_1 = require("./types");
var builders_1 = require("./builders");
var serialize_1 = require("./serialize");
var table_helpers_1 = require("./table-helpers");
var table_builders_1 = require("./table-builders");
/** Same scope as containsBlockCodeFunc in dispatcher.ts: recurses only
 *  into SeqNode children, not FuncCall.args / Delimited.body. */
var hasBlockCodeFunc = function (node) {
    if (node.type === 'func' && node.hash && consts_1.BLOCK_CODE_FUNCS.has(node.name)) {
        return true;
    }
    if (node.type === 'seq') {
        return node.children.some(hasBlockCodeFunc);
    }
    return false;
};
var mtableAst = function (node, serialize) {
    var e_1, _a;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var countRow = node.childNodes.length;
    var envName = String(node.attributes.get('name') || '');
    // Check for enclosing brackets from \left...\right
    var parentMrow = ((_b = node.parent) === null || _b === void 0 ? void 0 : _b.kind) === 'mrow' ? node.parent : null;
    var hasParentDelims = parentMrow
        && ((0, common_1.getProp)(parentMrow, 'open') !== undefined
            || (0, common_1.getProp)(parentMrow, 'close') !== undefined);
    var isSoleContent = hasParentDelims
        && (0, common_1.getContentChildren)(parentMrow).length === 1;
    var closeStr = hasParentDelims ? String((_c = (0, common_1.getProp)(parentMrow, 'close')) !== null && _c !== void 0 ? _c : '') : '';
    var parentContent = hasParentDelims ? (0, common_1.getContentChildren)(parentMrow) : [];
    var isFirstWithInvisibleClose = hasParentDelims && !isSoleContent
        && !closeStr && parentContent[0] === node;
    var openProp = (isSoleContent || isFirstWithInvisibleClose) ? (0, common_1.getProp)(parentMrow, 'open') : undefined;
    var closeProp = isSoleContent ? (0, common_1.getProp)(parentMrow, 'close') : undefined;
    var branchOpen = openProp !== undefined ? String(openProp) : '';
    var branchClose = closeProp !== undefined ? String(closeProp) : '';
    // Determine cases/eqnArray/matrix
    var firstRowDisplaystyle = node.childNodes.length > 0
        && ((_d = node.childNodes[0].attributes) === null || _d === void 0 ? void 0 : _d.get('displaystyle')) === true;
    var isReverseCases = branchOpen === '' && branchClose === '}' && firstRowDisplaystyle;
    var isCases = envName === 'cases' || (branchOpen === '{' && branchClose === '') || isReverseCases;
    var isNumcases = (0, table_helpers_1.isNumcasesTable)(node);
    var hasLines = node.attributes.isSet('rowlines') || node.attributes.isSet('columnlines');
    var isEqnArray = !isNumcases && !isCases && node.childNodes.length > 0
        && ((_e = node.childNodes[0].attributes) === null || _e === void 0 ? void 0 : _e.get('displaystyle')) === true;
    var insideMatCell = (0, table_helpers_1.isInsideMatrixCell)(node);
    var columnAlign = String(node.attributes.get('columnalign') || '').trim();
    var isGatheredLike = isEqnArray && columnAlign === 'center'
        && node.childNodes.every(function (row) { var _a, _b; return ((_b = (_a = row.childNodes) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) <= 1; });
    var insideEqnArrayCell = isGatheredLike && (0, table_helpers_1.isInsideEqnArrayCellWithSiblings)(node);
    var isNested = isEqnArray && (insideMatCell || insideEqnArrayCell);
    var eqnArrayAsMat = isNested || (isEqnArray && hasLines);
    if (isNumcases) {
        return (0, table_builders_1.buildNumcasesGrid)(node, serialize, countRow);
    }
    // Collect row data
    var rowNodes = [];
    var rowNodesInline = [];
    var hasInlineDiff = false;
    var nestedRawRows = [];
    var nestedRawRowsInline = [];
    for (var i = 0; i < countRow; i++) {
        var mtrNode = node.childNodes[i];
        var countColl = ((_f = mtrNode.childNodes) === null || _f === void 0 ? void 0 : _f.length) || 0;
        var startCol = mtrNode.kind === consts_1.MLABELEDTR ? 1 : 0;
        var cellNodes = [];
        var cellNodesInline = [];
        for (var j = startCol; j < countColl; j++) {
            var mtdNode = mtrNode.childNodes[j];
            var result_1 = serialize.visitNodeFull(mtdNode);
            var blockNode = result_1.node;
            var inlineNode = (_g = result_1.nodeInline) !== null && _g !== void 0 ? _g : result_1.node;
            // Block-level code-mode funcs (#align, #grid, #math.equation) break math
            // flow in eqnArray rows. Use inline variant to keep everything in math mode.
            // Inline #box/#circle are safe and do NOT trigger this.
            var useInlineForBlock = isEqnArray && result_1.nodeInline !== undefined
                && hasBlockCodeFunc(blockNode);
            cellNodes.push(useInlineForBlock ? inlineNode : blockNode);
            cellNodesInline.push(inlineNode);
            if (result_1.nodeInline !== undefined) {
                hasInlineDiff = true;
            }
        }
        if (eqnArrayAsMat) {
            nestedRawRows.push(cellNodes);
            nestedRawRowsInline.push(cellNodesInline);
        }
        else if (isEqnArray) {
            // Join cells with & alignment markers in rl-pairs:
            // &quad between pairs (wide gap), & within pair (tight gap).
            // compact=true suppresses extra space after the marker.
            var pairParts = [];
            var pairPartsInline = [];
            for (var k = 0; k < cellNodes.length; k += 2) {
                if (k > 0) {
                    pairParts.push((0, builders_1.alignment)('&quad', true));
                    pairPartsInline.push((0, builders_1.alignment)('&quad', true));
                }
                pairParts.push(cellNodes[k]);
                pairPartsInline.push(cellNodesInline[k]);
                if (k + 1 < cellNodes.length) {
                    pairParts.push((0, builders_1.alignment)('&', true));
                    pairPartsInline.push((0, builders_1.alignment)('&', true));
                    pairParts.push(cellNodes[k + 1]);
                    pairPartsInline.push(cellNodesInline[k + 1]);
                }
            }
            rowNodes.push((0, builders_1.seq)(pairParts));
            rowNodesInline.push((0, builders_1.seq)(pairPartsInline));
        }
        else if (isCases) {
            // Cases: join cells with & alignment (escaping handled by serializer's MatrixCell context)
            var parts = [];
            for (var k = 0; k < cellNodes.length; k++) {
                if (k > 0) {
                    parts.push((0, builders_1.alignment)('&'));
                }
                parts.push(cellNodes[k]);
            }
            rowNodes.push((0, builders_1.seq)(parts));
        }
        else {
            // Matrix: MatrixRowNode escapes each cell individually, then joins with ", "
            rowNodes.push((0, builders_1.matrixRow)(cellNodes));
            rowNodesInline.push((0, builders_1.matrixRow)(cellNodesInline));
        }
    }
    var result;
    if (eqnArrayAsMat) {
        var maxCols = nestedRawRows.reduce(function (m, r) { return Math.max(m, r.length); }, 0);
        var isGathered = envName === 'gathered' || envName === 'gather' || envName === 'gather*'
            || isGatheredLike;
        // Analyze column usage in rl-pairs
        var hasEvenContent = nestedRawRows.some(function (r) {
            return r.some(function (c, k) { return k % 2 === 0 && (0, serialize_1.serializeTypstMath)(c).trim() !== ''; });
        });
        var nestedAlign = void 0;
        if (isGathered || maxCols <= 0) {
            nestedAlign = '';
        }
        else if (!hasEvenContent) {
            nestedAlign = '#left';
        }
        else {
            nestedAlign = '#right';
        }
        // Flatten each row's cells into a single node (space-joined)
        var nestedRowNodes = nestedRawRows.map(function (r) {
            var _a;
            if (r.length <= 1) {
                return (_a = r[0]) !== null && _a !== void 0 ? _a : (0, builders_1.seq)([]);
            }
            // Join cells with space
            var parts = [];
            for (var k = 0; k < r.length; k++) {
                if (k > 0) {
                    parts.push((0, builders_1.space)(null));
                }
                parts.push(r[k]);
            }
            return (0, builders_1.seq)(parts);
        });
        var nestedRowNodesInline = nestedRawRowsInline.map(function (r) {
            var _a;
            if (r.length <= 1) {
                return (_a = r[0]) !== null && _a !== void 0 ? _a : (0, builders_1.seq)([]);
            }
            var parts = [];
            for (var k = 0; k < r.length; k++) {
                if (k > 0) {
                    parts.push((0, builders_1.space)(null));
                }
                parts.push(r[k]);
            }
            return (0, builders_1.seq)(parts);
        });
        var augment = hasLines ? (0, table_helpers_1.computeAugment)(node) : '';
        return (0, table_builders_1.buildEqnArrayAsMatResult)(nestedRowNodes, nestedRowNodesInline, nestedAlign, augment, isNested);
    }
    else if (isEqnArray) {
        var hasAnyTag = node.childNodes.some(function (child) { return child.kind === consts_1.MLABELEDTR; });
        var store = types_1.astNodeStore.get(node);
        var preContentNode = (_h = store === null || store === void 0 ? void 0 : store.preContent) !== null && _h !== void 0 ? _h : null;
        var postContentNode = (_j = store === null || store === void 0 ? void 0 : store.postContent) !== null && _j !== void 0 ? _j : null;
        var inlineRows = hasInlineDiff ? rowNodesInline : undefined;
        if (hasAnyTag) {
            return (0, table_builders_1.buildTaggedEqnArrayResult)(node, serialize, rowNodes, countRow, preContentNode, postContentNode, inlineRows);
        }
        else {
            return (0, table_builders_1.buildUntaggedEqnArrayResult)(rowNodes, preContentNode, postContentNode, inlineRows);
        }
    }
    else if (isCases) {
        var casesArgs = [];
        if (isReverseCases) {
            casesArgs.push((0, builders_1.namedArg)('reverse', (0, builders_1.boolVal)(true)));
        }
        try {
            for (var rowNodes_1 = tslib_1.__values(rowNodes), rowNodes_1_1 = rowNodes_1.next(); !rowNodes_1_1.done; rowNodes_1_1 = rowNodes_1.next()) {
                var rowNode = rowNodes_1_1.value;
                casesArgs.push((0, builders_1.posArg)((0, builders_1.mathVal)(rowNode)));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (rowNodes_1_1 && !rowNodes_1_1.done && (_a = rowNodes_1.return)) _a.call(rowNodes_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        result = {
            node: (0, builders_1.funcCall)('cases', casesArgs)
        };
    }
    else {
        result = (0, table_builders_1.buildMatrixResult)(node, rowNodes, branchOpen, branchClose, hasInlineDiff ? rowNodesInline : undefined);
    }
    // Wrap in display() for block output when inside a mat() cell
    if (insideMatCell) {
        var blockNode = result.node;
        var inlineNode = (_k = result.nodeInline) !== null && _k !== void 0 ? _k : blockNode;
        result = {
            node: (0, builders_1.funcCall)('display', [(0, builders_1.posArg)((0, builders_1.mathVal)(blockNode))]),
            nodeInline: inlineNode,
        };
    }
    return result;
};
exports.mtableAst = mtableAst;
/** mtr: join cell children with comma separator — fully typed. */
var mtrAst = function (node, serialize) {
    var children = [];
    for (var i = 0; i < node.childNodes.length; i++) {
        if (i > 0) {
            children.push((0, builders_1.operator)(','));
        }
        children.push(serialize.visitNode(node.childNodes[i]));
    }
    return {
        node: (0, builders_1.seq)(children)
    };
};
exports.mtrAst = mtrAst;
//# sourceMappingURL=table-handlers.js.map