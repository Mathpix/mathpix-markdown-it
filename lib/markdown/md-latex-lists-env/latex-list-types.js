"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isListType = exports.ListType = void 0;
var ListType;
(function (ListType) {
    ListType["itemize"] = "itemize";
    ListType["enumerate"] = "enumerate";
})(ListType = exports.ListType || (exports.ListType = {}));
var isListType = function (value) {
    return Object.values(ListType).includes(value);
};
exports.isListType = isListType;
//# sourceMappingURL=latex-list-types.js.map