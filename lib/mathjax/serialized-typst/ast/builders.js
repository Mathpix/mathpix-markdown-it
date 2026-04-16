"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSymbolValue = exports.isEmptyNode = exports.errorNode = exports.callVal = exports.inlineMathVal = exports.inlineMath = exports.label = exports.matrixRow = exports.rawVal = exports.lengthVal = exports.identVal = exports.boolVal = exports.strVal = exports.mathVal = exports.namedArg = exports.posArg = exports.placeholder = exports.raw = exports.alignment = exports.linebreak = exports.space = exports.delimited = exports.scriptNode = exports.funcCall = exports.operator = exports.num = exports.text = exports.symbol = exports.EMPTY_RESULT = exports.seq = void 0;
var tslib_1 = require("tslib");
var consts_1 = require("../consts");
var seq = function (children, opts) { return (tslib_1.__assign({ type: "seq" /* TypstMathNodeType.Seq */, children: children }, opts)); };
exports.seq = seq;
exports.EMPTY_RESULT = {
    node: (0, exports.seq)([])
};
var symbol = function (value) { return ({
    type: "symbol" /* TypstMathNodeType.Symbol */,
    value: value,
}); };
exports.symbol = symbol;
var text = function (value, opts) { return (tslib_1.__assign({ type: "text" /* TypstMathNodeType.Text */, value: value }, opts)); };
exports.text = text;
var num = function (value) { return ({
    type: "number" /* TypstMathNodeType.Number */,
    value: value,
}); };
exports.num = num;
var operator = function (value, opts) { return (tslib_1.__assign({ type: "operator" /* TypstMathNodeType.Operator */, value: value }, opts)); };
exports.operator = operator;
var funcCall = function (name, args, opts) { return (tslib_1.__assign({ type: "func" /* TypstMathNodeType.FuncCall */, name: name, args: args }, opts)); };
exports.funcCall = funcCall;
var scriptNode = function (base, opts) { return (tslib_1.__assign({ type: "script" /* TypstMathNodeType.Script */, base: base }, opts)); };
exports.scriptNode = scriptNode;
var delimited = function (kind, body, open, close, size) { return ({
    type: "delimited" /* TypstMathNodeType.Delimited */,
    kind: kind,
    body: body,
    open: open,
    close: close,
    size: size,
}); };
exports.delimited = delimited;
var space = function (width) { return ({
    type: "space" /* TypstMathNodeType.Space */,
    width: width,
}); };
exports.space = space;
var linebreak = function () { return ({
    type: "linebreak" /* TypstMathNodeType.Linebreak */,
}); };
exports.linebreak = linebreak;
var alignment = function (variant, compact) {
    if (compact === void 0) { compact = false; }
    return (tslib_1.__assign({ type: "alignment" /* TypstMathNodeType.Alignment */, variant: variant }, (compact ? { compact: true } : {})));
};
exports.alignment = alignment;
var raw = function (value, opts) { return (tslib_1.__assign(tslib_1.__assign({ type: "raw" /* TypstMathNodeType.Raw */ }, opts), { value: value })); };
exports.raw = raw;
var placeholder = function () { return ({
    type: "placeholder" /* TypstMathNodeType.Placeholder */,
}); };
exports.placeholder = placeholder;
var posArg = function (value) { return ({
    kind: "positional" /* FuncArgKind.Positional */,
    value: value,
}); };
exports.posArg = posArg;
var namedArg = function (name, value) { return ({
    kind: "named" /* FuncArgKind.Named */,
    name: name,
    value: value,
}); };
exports.namedArg = namedArg;
var mathVal = function (node) { return ({
    type: "math" /* ArgValueType.Math */,
    node: node,
}); };
exports.mathVal = mathVal;
var strVal = function (value) { return ({
    type: "string" /* ArgValueType.String */,
    value: value,
}); };
exports.strVal = strVal;
var boolVal = function (value) { return ({
    type: "bool" /* ArgValueType.Bool */,
    value: value,
}); };
exports.boolVal = boolVal;
var identVal = function (value) { return ({
    type: "ident" /* ArgValueType.Ident */,
    value: value,
}); };
exports.identVal = identVal;
var lengthVal = function (value) { return ({
    type: "length" /* ArgValueType.Length */,
    value: value,
}); };
exports.lengthVal = lengthVal;
var rawVal = function (value) { return ({
    type: "raw" /* ArgValueType.Raw */,
    value: value,
}); };
exports.rawVal = rawVal;
var matrixRow = function (cells) { return ({
    type: "matrix-row" /* TypstMathNodeType.MatrixRow */,
    cells: cells,
}); };
exports.matrixRow = matrixRow;
var label = function (key) { return ({
    type: "label" /* TypstMathNodeType.Label */,
    key: key,
}); };
exports.label = label;
var inlineMath = function (body, opts) { return (tslib_1.__assign({ type: "inline-math" /* TypstMathNodeType.InlineMath */, body: body }, opts)); };
exports.inlineMath = inlineMath;
var inlineMathVal = function (node, display) { return (tslib_1.__assign({ type: "inlineMath" /* ArgValueType.InlineMath */, node: node }, (display !== undefined ? { display: display } : {}))); };
exports.inlineMathVal = inlineMathVal;
var callVal = function (node) { return ({
    type: "call" /* ArgValueType.Call */,
    node: node,
}); };
exports.callVal = callVal;
var errorNode = function (fallbackText, nodeKind, message) { return ({
    type: "error" /* TypstMathNodeType.Error */,
    fallbackText: fallbackText,
    nodeKind: nodeKind,
    message: message,
}); };
exports.errorNode = errorNode;
/** Check if a node will serialize to empty/whitespace-only string.
 *  Avoids O(n) serializeTypstMath() for emptiness checks. */
var isEmptyNode = function (node) {
    switch (node.type) {
        case "seq" /* TypstMathNodeType.Seq */:
            return node.children.length === 0 || node.children.every(exports.isEmptyNode);
        case "symbol" /* TypstMathNodeType.Symbol */:
            return !node.value;
        case "text" /* TypstMathNodeType.Text */:
            return !node.value;
        case "number" /* TypstMathNodeType.Number */:
            return !node.value;
        case "placeholder" /* TypstMathNodeType.Placeholder */:
            return false; // serializes to "" which is non-empty
        case "space" /* TypstMathNodeType.Space */:
            return !node.width; // null-width spaces serialize to ''
        case "error" /* TypstMathNodeType.Error */:
            return !node.fallbackText;
        default:
            return false;
    }
};
exports.isEmptyNode = isEmptyNode;
/** Get the value of a single Symbol node, unwrapping single-child Seq.
 *  Returns null for non-symbol or multi-node trees. */
var getSymbolValue = function (node, depth) {
    if (depth === void 0) { depth = 0; }
    if (node.type === "symbol" /* TypstMathNodeType.Symbol */) {
        return node.value;
    }
    if (depth < consts_1.UNWRAP_MAX_DEPTH && node.type === "seq" /* TypstMathNodeType.Seq */ && node.children.length === 1) {
        return (0, exports.getSymbolValue)(node.children[0], depth + 1);
    }
    return null;
};
exports.getSymbolValue = getSymbolValue;
//# sourceMappingURL=builders.js.map