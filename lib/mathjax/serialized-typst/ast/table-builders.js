"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMatrixResult = exports.buildUntaggedEqnArrayResult = exports.buildTaggedEqnArrayResult = exports.buildEqnArrayAsMatResult = exports.joinRowNodes = exports.buildNumcasesGrid = void 0;
var tslib_1 = require("tslib");
var consts_1 = require("../consts");
var common_1 = require("../common");
var bracket_utils_1 = require("../bracket-utils");
var builders_1 = require("./builders");
var table_helpers_1 = require("./table-helpers");
/** Counter reset — emitted after explicit-tag equations to prevent counter increment. */
var COUNTER_RESET = (0, builders_1.raw)('#counter(math.equation).update(n => n - 1)', { leadingNewline: true });
/** numcases/subnumcases → #grid() with cases + numbering column. */
var buildNumcasesGrid = function (node, serialize, countRow) {
    var e_1, _a;
    var firstRow = node.childNodes[0];
    var prefixCell = firstRow.childNodes[1];
    var prefixNode = (0, table_helpers_1.visitPrefixBeforeMo)(prefixCell, serialize, '{');
    var rowTagSources = [];
    for (var i = 0; i < countRow; i++) {
        var mtrNode = node.childNodes[i];
        var labelCell = (mtrNode.kind === consts_1.MLABELEDTR && mtrNode.childNodes.length > 0) ? mtrNode.childNodes[0] : null;
        var labelKey = labelCell ? (0, table_helpers_1.getLabelKey)(labelCell) : null;
        var condCell = mtrNode.childNodes[mtrNode.childNodes.length - 1];
        var condTag = (0, table_helpers_1.extractTagFromConditionCell)(condCell);
        if (condTag) {
            rowTagSources.push({
                source: 'condition',
                content: condTag,
                labelKey: labelKey
            });
        }
        else if (labelCell) {
            var isAutoNumber = !!(0, common_1.getProp)(labelCell, consts_1.DATA_TAG_AUTO);
            if (!isAutoNumber) {
                var tagContent = (0, table_helpers_1.serializeTagContent)(labelCell, serialize);
                rowTagSources.push({
                    source: 'label',
                    content: tagContent,
                    labelKey: labelKey
                });
            }
            else {
                rowTagSources.push({
                    source: 'auto',
                    content: '',
                    labelKey: labelKey
                });
            }
        }
        else {
            rowTagSources.push({
                source: 'auto',
                content: '',
                labelKey: null
            });
        }
    }
    var caseRowNodes = [];
    for (var i = 0; i < countRow; i++) {
        var mtrNode = node.childNodes[i];
        var startCol = mtrNode.kind === consts_1.MLABELEDTR ? 2 : 1;
        var cellNodes = [];
        for (var j = startCol; j < mtrNode.childNodes.length; j++) {
            var mtdNode = mtrNode.childNodes[j];
            var cellNode = void 0;
            if (j === mtrNode.childNodes.length - 1 && rowTagSources[i].source === 'condition') {
                cellNode = (0, table_helpers_1.visitCellWithoutTag)(mtdNode, serialize);
            }
            else {
                cellNode = serialize.visitNode(mtdNode);
            }
            cellNodes.push(cellNode);
        }
        if (cellNodes.length === 1) {
            caseRowNodes.push(cellNodes[0]);
        }
        else {
            var parts = [];
            for (var k = 0; k < cellNodes.length; k++) {
                if (k > 0) {
                    parts.push((0, builders_1.alignment)('&'));
                }
                parts.push(cellNodes[k]);
            }
            caseRowNodes.push((0, builders_1.seq)(parts));
        }
    }
    var casesArgs = caseRowNodes.map(function (r) { return (0, builders_1.posArg)((0, builders_1.mathVal)(r)); });
    var casesNode = (0, builders_1.funcCall)('cases', casesArgs);
    var mathContentNode = prefixNode
        ? (0, builders_1.seq)([prefixNode, casesNode])
        : casesNode;
    var inlineNode = mathContentNode;
    var tagEntries = [];
    for (var i = 0; i < countRow; i++) {
        var info = rowTagSources[i];
        var tagText = '';
        if (info.source === 'condition') {
            tagText = "(".concat((0, common_1.escapeTypstContent)(info.content), ")");
        }
        else if (info.source === 'label' && info.content) {
            tagText = info.content;
        }
        if (tagText && info.labelKey) {
            tagEntries.push((0, table_helpers_1.buildFigureTag)(tagText, info.labelKey));
        }
        else if (tagText) {
            tagEntries.push("[".concat(tagText, "]"));
        }
        else if (info.labelKey) {
            tagEntries.push((0, table_helpers_1.buildAutoTagWithLabel)(info.labelKey));
        }
        else {
            tagEntries.push(table_helpers_1.AUTO_TAG_ENTRY);
        }
    }
    var mathEqNode = (0, builders_1.funcCall)('math.equation', [
        (0, builders_1.namedArg)('block', (0, builders_1.boolVal)(true)),
        (0, builders_1.namedArg)('numbering', (0, builders_1.rawVal)('none')),
        (0, builders_1.posArg)((0, builders_1.inlineMathVal)(mathContentNode, true)),
    ]);
    var innerGridArgs = [
        (0, builders_1.namedArg)('row-gutter', (0, builders_1.rawVal)('0.65em')),
    ];
    try {
        for (var tagEntries_1 = tslib_1.__values(tagEntries), tagEntries_1_1 = tagEntries_1.next(); !tagEntries_1_1.done; tagEntries_1_1 = tagEntries_1.next()) {
            var entry = tagEntries_1_1.value;
            innerGridArgs.push((0, builders_1.posArg)((0, builders_1.rawVal)(entry)));
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (tagEntries_1_1 && !tagEntries_1_1.done && (_a = tagEntries_1.return)) _a.call(tagEntries_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    var innerGridNode = (0, builders_1.funcCall)('grid', innerGridArgs);
    var outerGridNode = (0, builders_1.funcCall)('grid', [
        (0, builders_1.namedArg)('columns', (0, builders_1.rawVal)('(1fr, auto)')),
        (0, builders_1.namedArg)('align', (0, builders_1.rawVal)('(left, right + horizon)')),
        (0, builders_1.posArg)((0, builders_1.callVal)(mathEqNode)),
        (0, builders_1.posArg)((0, builders_1.callVal)(innerGridNode)),
    ], {
        hash: true
    });
    return {
        node: outerGridNode,
        nodeInline: inlineNode
    };
};
exports.buildNumcasesGrid = buildNumcasesGrid;
/** Join row nodes with \\ separators, optionally prepending preContent. */
var joinRowNodes = function (rowNodes, preContentNode) {
    var children = [];
    if (preContentNode) {
        children.push(preContentNode);
        children.push((0, builders_1.linebreak)());
    }
    for (var i = 0; i < rowNodes.length; i++) {
        if (i > 0) {
            children.push((0, builders_1.linebreak)());
        }
        children.push(rowNodes[i]);
    }
    return (0, builders_1.seq)(children);
};
exports.joinRowNodes = joinRowNodes;
/** Build a mat(delim: #none, ...) node for eqnArray rendered as mat. */
var buildEqnArrayMatNode = function (rowNodes, align, augment) {
    var e_2, _a;
    var args = [];
    args.push((0, builders_1.namedArg)('delim', (0, builders_1.rawVal)('#none')));
    if (align) {
        args.push((0, builders_1.namedArg)('align', (0, builders_1.rawVal)(align)));
    }
    if (augment) {
        args.push((0, builders_1.namedArg)('augment', (0, builders_1.rawVal)(augment)));
    }
    try {
        for (var rowNodes_1 = tslib_1.__values(rowNodes), rowNodes_1_1 = rowNodes_1.next(); !rowNodes_1_1.done; rowNodes_1_1 = rowNodes_1.next()) {
            var rowNode = rowNodes_1_1.value;
            args.push((0, builders_1.posArg)((0, builders_1.mathVal)(rowNode)));
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (rowNodes_1_1 && !rowNodes_1_1.done && (_a = rowNodes_1.return)) _a.call(rowNodes_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return (0, builders_1.funcCall)('mat', args, {
        semicolonSep: true,
        escapeContext: "matrix-cell" /* FuncEscapeContext.MatrixCell */
    });
};
/** eqnArray rendered as mat() — nested or has lines. */
var buildEqnArrayAsMatResult = function (rowNodes, rowNodesInline, align, augment, addDisplay) {
    var matNode = buildEqnArrayMatNode(rowNodes, align, augment);
    var matInlineNode = buildEqnArrayMatNode(rowNodesInline, align, augment);
    var blockNode = addDisplay
        ? (0, builders_1.funcCall)('display', [(0, builders_1.posArg)((0, builders_1.mathVal)(matNode))])
        : matNode;
    return {
        node: blockNode,
        nodeInline: matInlineNode
    };
};
exports.buildEqnArrayAsMatResult = buildEqnArrayAsMatResult;
/** eqnArray with tags → number-align / separate / no-tag strategies. */
var buildTaggedEqnArrayResult = function (node, serialize, rowNodes, countRow, preContentNode, postContentNode, rowNodesInline) {
    var rowTagInfos = [];
    for (var i = 0; i < countRow; i++) {
        var mtrNode = node.childNodes[i];
        if (mtrNode.kind === consts_1.MLABELEDTR && mtrNode.childNodes.length > 0) {
            var labelCell = mtrNode.childNodes[0];
            var tagContent = (0, table_helpers_1.serializeTagContent)(labelCell, serialize);
            var isAutoNumber = !!(0, common_1.getProp)(labelCell, consts_1.DATA_TAG_AUTO);
            var labelKey = (0, table_helpers_1.getLabelKey)(labelCell);
            rowTagInfos.push({
                isTagged: !!tagContent,
                isAutoTag: isAutoNumber && !!tagContent,
                isExplicitTag: !isAutoNumber && !!tagContent,
                tagContent: tagContent || '',
                labelKey: labelKey,
            });
        }
        else {
            rowTagInfos.push({
                isTagged: false,
                isAutoTag: false,
                isExplicitTag: false,
                tagContent: '',
                labelKey: null
            });
        }
    }
    var explicitTagIndices = rowTagInfos.map(function (r, i) { return r.isExplicitTag ? i : -1; }).filter(function (i) { return i >= 0; });
    var autoTagIndices = rowTagInfos.map(function (r, i) { return r.isAutoTag ? i : -1; }).filter(function (i) { return i >= 0; });
    var totalTagged = explicitTagIndices.length + autoTagIndices.length;
    if (explicitTagIndices.length === 1 && autoTagIndices.length === 0 && countRow > 1) {
        var tagIdx = explicitTagIndices[0];
        var info = rowTagInfos[tagIdx];
        var rowNodesCopyNA = tslib_1.__spreadArray([], tslib_1.__read(rowNodes), false);
        if (postContentNode && rowNodesCopyNA.length > 0) {
            rowNodesCopyNA[rowNodesCopyNA.length - 1] = (0, builders_1.seq)([rowNodesCopyNA[rowNodesCopyNA.length - 1], postContentNode]);
        }
        var totalRows = (preContentNode ? countRow + 1 : countRow)
            + (postContentNode && rowNodesCopyNA.length === 0 ? 1 : 0);
        var adjustedTagIdx = preContentNode ? tagIdx + 1 : tagIdx;
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
        var mathContentNode = (0, exports.joinRowNodes)(rowNodesCopyNA, preContentNode);
        var eqnArgs = [
            (0, builders_1.namedArg)('block', (0, builders_1.boolVal)(true)),
        ];
        if (info.labelKey)
            eqnArgs.push((0, builders_1.namedArg)('supplement', (0, builders_1.rawVal)('none')));
        eqnArgs.push((0, builders_1.namedArg)('numbering', (0, builders_1.rawVal)("n => [".concat(info.tagContent, "]"))));
        eqnArgs.push((0, builders_1.namedArg)('number-align', (0, builders_1.rawVal)(numberAlign)));
        eqnArgs.push((0, builders_1.posArg)((0, builders_1.inlineMathVal)(mathContentNode, true)));
        var eqnNode = (0, builders_1.funcCall)('math.equation', eqnArgs, { hash: true });
        var blockParts = [eqnNode];
        if (info.labelKey) {
            blockParts.push((0, builders_1.label)(info.labelKey));
        }
        blockParts.push(COUNTER_RESET);
        var inlineBase = rowNodesInline ? tslib_1.__spreadArray([], tslib_1.__read(rowNodesInline), false) : tslib_1.__spreadArray([], tslib_1.__read(rowNodes), false);
        if (postContentNode && inlineBase.length > 0) {
            inlineBase[inlineBase.length - 1] = (0, builders_1.seq)([inlineBase[inlineBase.length - 1], postContentNode]);
        }
        var inlineNode = (0, exports.joinRowNodes)(inlineBase, preContentNode);
        return {
            node: (0, builders_1.seq)(blockParts),
            nodeInline: inlineNode
        };
    }
    else if (totalTagged > 0) {
        var rowNodesCopy = tslib_1.__spreadArray([], tslib_1.__read(rowNodes), false);
        if (preContentNode && rowNodesCopy.length > 0) {
            rowNodesCopy[0] = (0, builders_1.seq)([preContentNode, (0, builders_1.linebreak)(), rowNodesCopy[0]]);
        }
        if (postContentNode && rowNodesCopy.length > 0) {
            rowNodesCopy[rowNodesCopy.length - 1] = (0, builders_1.seq)([rowNodesCopy[rowNodesCopy.length - 1], postContentNode]);
        }
        var blockParts = [];
        for (var i = 0; i < countRow; i++) {
            var info = rowTagInfos[i];
            var rowNode = rowNodesCopy[i];
            if (info.isTagged) {
                var numbering = info.isAutoTag
                    ? consts_1.DEFAULT_EQ_NUMBERING
                    : "n => [".concat(info.tagContent, "]");
                var eqnArgs = [
                    (0, builders_1.namedArg)('block', (0, builders_1.boolVal)(true)),
                ];
                if (info.labelKey)
                    eqnArgs.push((0, builders_1.namedArg)('supplement', (0, builders_1.rawVal)('none')));
                eqnArgs.push((0, builders_1.namedArg)('numbering', (0, builders_1.rawVal)(numbering)));
                eqnArgs.push((0, builders_1.posArg)((0, builders_1.inlineMathVal)(rowNode, true)));
                var eqnNode = (0, builders_1.funcCall)('math.equation', eqnArgs, { hash: true });
                if (info.labelKey) {
                    blockParts.push((0, builders_1.seq)([eqnNode, (0, builders_1.label)(info.labelKey)]));
                }
                else {
                    blockParts.push(eqnNode);
                }
                if (info.isExplicitTag) {
                    blockParts.push(COUNTER_RESET);
                }
            }
            else {
                blockParts.push((0, builders_1.funcCall)('math.equation', [
                    (0, builders_1.namedArg)('block', (0, builders_1.boolVal)(true)),
                    (0, builders_1.namedArg)('numbering', (0, builders_1.rawVal)('none')),
                    (0, builders_1.posArg)((0, builders_1.inlineMathVal)(rowNode, true)),
                ], { hash: true }));
            }
        }
        for (var i = 0; i < blockParts.length - 1; i++) {
            var next = blockParts[i + 1];
            var nextHasLeadingNewline = next.type === 'raw' && next.leadingNewline;
            if (nextHasLeadingNewline) {
                continue;
            }
            var part = blockParts[i];
            if (part.type === 'func') {
                blockParts[i] = (0, builders_1.funcCall)(part.name, tslib_1.__spreadArray([], tslib_1.__read(part.args), false), {
                    hash: part.hash,
                    body: part.body ? tslib_1.__spreadArray([], tslib_1.__read(part.body), false) : undefined,
                    semicolonSep: part.semicolonSep,
                    escapeContext: part.escapeContext,
                    trailingNewline: true,
                });
            }
            else if (part.type === 'raw') {
                blockParts[i] = (0, builders_1.raw)(part.value, {
                    leadingNewline: part.leadingNewline,
                    trailingNewline: true
                });
            }
            else if (part.type === 'seq') {
                blockParts[i] = (0, builders_1.seq)(tslib_1.__spreadArray([], tslib_1.__read(part.children), false), { trailingNewline: true });
            }
        }
        var inlineNode = (0, exports.joinRowNodes)(rowNodesInline !== null && rowNodesInline !== void 0 ? rowNodesInline : rowNodes, null);
        return {
            node: (0, builders_1.seq)(blockParts),
            nodeInline: inlineNode
        };
    }
    else {
        return (0, exports.buildUntaggedEqnArrayResult)(rowNodes, preContentNode, postContentNode, rowNodesInline);
    }
};
exports.buildTaggedEqnArrayResult = buildTaggedEqnArrayResult;
/** eqnArray without tags → rows with \\ separators. */
var buildUntaggedEqnArrayResult = function (rowNodes, preContentNode, postContentNode, rowNodesInline) {
    var appendPost = function (nodes) {
        if (!postContentNode || nodes.length === 0) {
            return nodes;
        }
        var copy = tslib_1.__spreadArray([], tslib_1.__read(nodes), false);
        copy[copy.length - 1] = (0, builders_1.seq)([copy[copy.length - 1], postContentNode]);
        return copy;
    };
    var blockRows = appendPost(rowNodes);
    var blockNode = (0, exports.joinRowNodes)(blockRows, preContentNode);
    if (rowNodesInline) {
        var inlineRows = appendPost(rowNodesInline);
        var inlineNode = (0, exports.joinRowNodes)(inlineRows, preContentNode);
        return {
            node: blockNode,
            nodeInline: inlineNode
        };
    }
    return {
        node: blockNode
    };
};
exports.buildUntaggedEqnArrayResult = buildUntaggedEqnArrayResult;
/** Build a mat() FuncCallNode with params and rows. */
var buildMatFuncCall = function (paramArgs, rowNodes) {
    var e_3, _a;
    var args = tslib_1.__spreadArray([], tslib_1.__read(paramArgs), false);
    try {
        for (var rowNodes_2 = tslib_1.__values(rowNodes), rowNodes_2_1 = rowNodes_2.next(); !rowNodes_2_1.done; rowNodes_2_1 = rowNodes_2.next()) {
            var rowNode = rowNodes_2_1.value;
            args.push((0, builders_1.posArg)((0, builders_1.mathVal)(rowNode)));
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (rowNodes_2_1 && !rowNodes_2_1.done && (_a = rowNodes_2.return)) _a.call(rowNodes_2);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return (0, builders_1.funcCall)('mat', args, { semicolonSep: true });
};
/** Wrap a mat node in lr() for mismatched delimiters using DelimitedNode. */
var wrapMatInLr = function (matNode, branchOpen, branchClose) {
    if (branchOpen || branchClose) {
        return (0, builders_1.delimited)("lr" /* DelimitedKind.Lr */, matNode, branchOpen, branchClose);
    }
    return matNode;
};
/** matrix → mat(delim: ..., ...) with augment/align/frame. */
var buildMatrixResult = function (node, rowNodes, branchOpen, branchClose, rowNodesInline) {
    var frame = node.attributes.isSet('frame')
        ? String(node.attributes.get('frame') || '')
        : '';
    var augmentStr = (0, table_helpers_1.computeAugment)(node);
    var columnAlign = String(node.attributes.get('columnalign') || '');
    var alignArr = columnAlign ? columnAlign.trim().split(/\s+/) : [];
    var uniqueAligns = tslib_1.__spreadArray([], tslib_1.__read(new Set(alignArr)), false);
    var matAlign = (uniqueAligns.length === 1 && uniqueAligns[0] !== 'center')
        ? uniqueAligns[0]
        : '';
    var paramArgs = [];
    var hasDelimiters = branchOpen || branchClose;
    var isMatchedPair = branchOpen && branchClose
        && (branchOpen === branchClose || consts_1.OPEN_BRACKETS[branchOpen] === branchClose);
    if (isMatchedPair) {
        paramArgs.push((0, builders_1.namedArg)('delim', (0, builders_1.rawVal)((0, bracket_utils_1.delimiterToTypst)(branchOpen))));
    }
    else {
        paramArgs.push((0, builders_1.namedArg)('delim', (0, builders_1.rawVal)('#none')));
    }
    if (matAlign) {
        paramArgs.push((0, builders_1.namedArg)('align', (0, builders_1.rawVal)("#".concat(matAlign))));
    }
    if (augmentStr) {
        paramArgs.push((0, builders_1.namedArg)('augment', (0, builders_1.rawVal)(augmentStr)));
    }
    var buildExpr = function (rNodes) {
        var matNode = buildMatFuncCall(paramArgs, rNodes);
        if (hasDelimiters && !isMatchedPair) {
            return wrapMatInLr(matNode, branchOpen, branchClose);
        }
        return matNode;
    };
    var matExpr = buildExpr(rowNodes);
    var matExprInline = rowNodesInline ? buildExpr(rowNodesInline) : undefined;
    if (frame === 'solid') {
        var boxNode = (0, builders_1.funcCall)('box', [
            (0, builders_1.namedArg)('stroke', (0, builders_1.rawVal)(consts_1.BOX_STROKE)),
            (0, builders_1.namedArg)('inset', (0, builders_1.rawVal)(consts_1.BOX_INSET)),
            (0, builders_1.posArg)((0, builders_1.inlineMathVal)(matExpr, true)),
        ]);
        return {
            node: (0, builders_1.funcCall)('align', [(0, builders_1.posArg)((0, builders_1.rawVal)('center')), (0, builders_1.posArg)((0, builders_1.callVal)(boxNode))], { hash: true }),
            nodeInline: matExprInline !== null && matExprInline !== void 0 ? matExprInline : matExpr,
        };
    }
    if (matExprInline) {
        return {
            node: matExpr,
            nodeInline: matExprInline
        };
    }
    return {
        node: matExpr
    };
};
exports.buildMatrixResult = buildMatrixResult;
//# sourceMappingURL=table-builders.js.map