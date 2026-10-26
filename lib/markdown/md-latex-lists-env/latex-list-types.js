"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isListType = exports.ListType = void 0;
var ListType;
(function (ListType) {
    ListType["itemize"] = "itemize";
    ListType["enumerate"] = "enumerate";
})(ListType = exports.ListType || (exports.ListType = {}));
// Hoisted: the members never change, and `Object.values(...)` allocated an array per call — this one
// is asked for every `\begin{…}` candidate.
var LIST_TYPE_VALUES = new Set(Object.values(ListType));
var isListType = function (value) { return LIST_TYPE_VALUES.has(value); };
exports.isListType = isListType;
//# sourceMappingURL=latex-list-types.js.map