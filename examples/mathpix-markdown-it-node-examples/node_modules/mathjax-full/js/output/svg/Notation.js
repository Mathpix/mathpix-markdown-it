"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var Notation = require("../common/Notation.js");
__export(require("../common/Notation.js"));
exports.computeLineData = {
    top: function (h, d, w, t) { return [0, h - t, w, h - t]; },
    right: function (h, d, w, t) { return [w - t, -d, w - t, h]; },
    bottom: function (h, d, w, t) { return [0, t - d, w, t - d]; },
    left: function (h, d, w, t) { return [t, -d, t, h]; },
    vertical: function (h, d, w, t) { return [w / 2 - t, h, w / 2 - t, -d]; },
    horizontal: function (h, d, w, t) { return [0, (h - d) / 2 - t, w, (h - d) / 2 - t]; },
    up: function (h, d, w, t) { return [t, t - d, w - t, h - t]; },
    down: function (h, d, w, t) { return [t, h - t, w - t, t - d]; }
};
exports.lineData = function (node, kind) {
    var _a = node.getBBox(), h = _a.h, d = _a.d, w = _a.w;
    var t = node.thickness / 2;
    return exports.computeLineData[kind](h, d, w, t);
};
exports.RenderLine = function (line) {
    return (function (node, child) {
        node.adaptor.append(node.element, node.line(exports.lineData(node, line)));
    });
};
exports.Border = function (side) {
    return Notation.CommonBorder(function (node, child) {
        node.adaptor.append(node.element, node.line(exports.lineData(node, side)));
    })(side);
};
exports.Border2 = function (name, side1, side2) {
    return Notation.CommonBorder2(function (node, child) {
        node.adaptor.append(node.element, node.line(exports.lineData(node, side1)));
        node.adaptor.append(node.element, node.line(exports.lineData(node, side2)));
    })(name, side1, side2);
};
exports.DiagonalStrike = function (name) {
    return Notation.CommonDiagonalStrike(function (cname) { return function (node, child) {
        node.adaptor.append(node.element, node.line(exports.lineData(node, name)));
    }; })(name);
};
exports.DiagonalArrow = function (name) {
    return Notation.CommonDiagonalArrow(function (node, arrow) {
        node.adaptor.append(node.element, arrow);
    })(name);
};
exports.Arrow = function (name) {
    return Notation.CommonArrow(function (node, arrow) {
        node.adaptor.append(node.element, arrow);
    })(name);
};
//# sourceMappingURL=Notation.js.map