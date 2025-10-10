"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLastChild = exports.isFirstChild = void 0;
var isFirstChild = function (node) {
    return node.parent && node.parent.childNodes[0] && node.parent.childNodes[0] === node;
};
exports.isFirstChild = isFirstChild;
var isLastChild = function (node) {
    return node.parent && node.parent.childNodes && node.parent.childNodes[node.parent.childNodes.length - 1] === node;
};
exports.isLastChild = isLastChild;
//# sourceMappingURL=node-utils.js.map