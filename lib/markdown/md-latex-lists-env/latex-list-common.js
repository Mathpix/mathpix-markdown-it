"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSetCounterNumber = exports.closeOpenListItemIfNeeded = exports.applyListCloseState = exports.applyListOpenState = exports.getListTokenTypes = void 0;
var tslib_1 = require("tslib");
var latex_list_types_1 = require("./latex-list-types");
var list_state_1 = require("./list-state");
var consts_1 = require("../common/consts");
/**
 * Compute token types and HTML tag for a given LaTeX list type.
 */
var getListTokenTypes = function (listType) {
    var isItemize = listType === latex_list_types_1.ListType.itemize;
    return {
        isItemize: isItemize,
        openType: isItemize ? "itemize_list_open" : "enumerate_list_open",
        closeType: isItemize ? "itemize_list_close" : "enumerate_list_close",
        htmlTag: isItemize ? "ul" : "ol",
    };
};
exports.getListTokenTypes = getListTokenTypes;
/**
 * Apply state changes when opening a list environment.
 */
var applyListOpenState = function (state, listType, token) {
    var _a, _b;
    var isTopLevel = state.parentType !== "itemize" && state.parentType !== "enumerate";
    var inheritedListType = (_a = state.env) === null || _a === void 0 ? void 0 : _a.inheritedListType;
    var isInheritedListContext = inheritedListType === "itemize" || inheritedListType === "enumerate";
    var isTopLevelList = isTopLevel && !isInheritedListContext;
    state.prentLevel = isTopLevel ? 0 : state.prentLevel + 1;
    state.parentType = listType;
    state.types = ((_b = state.types) === null || _b === void 0 ? void 0 : _b.length)
        ? tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(state.types), false), [listType], false) : [listType];
    token.prentLevel = state.prentLevel;
    token.isTopLevelList = isTopLevelList;
    // Register new list depth in internal list-level tracker
    (0, list_state_1.enterListLevel)();
};
exports.applyListOpenState = applyListOpenState;
/**
 * Apply state changes when closing a list environment.
 */
var applyListCloseState = function (state, token) {
    if (typeof token.level === "number") {
        token.level = Math.max(0, token.level - 1);
    }
    if (typeof state.level === "number") {
        state.level = Math.max(0, state.level - 1);
    }
    state.prentLevel = Math.max(0, state.prentLevel - 1);
    token.prentLevel = state.prentLevel;
    // Update list-level nesting state
    (0, list_state_1.leaveListLevel)();
};
exports.applyListCloseState = applyListCloseState;
/**
 * Close an open <li> if the current list level reports open items.
 */
var closeOpenListItemIfNeeded = function (state) {
    var listData = (0, list_state_1.getCurrentListLevelState)();
    if ((listData === null || listData === void 0 ? void 0 : listData.openItems) && listData.openItems > 0) {
        state.push("latex_list_item_close", "li", -1);
        listData.openItems -= 1;
    }
};
exports.closeOpenListItemIfNeeded = closeOpenListItemIfNeeded;
/**
 * Parse a \setcounter match and return the "next" number (N+1),
 * or null if the number is invalid.
 *
 * Assumes match[2] is the numeric argument of \setcounter.
 */
var parseSetCounterNumber = function (match) {
    var _a, _b;
    var raw = (_b = (_a = match[2]) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : "";
    if (!raw || !consts_1.reNumber.test(raw)) {
        return null;
    }
    return Number(raw) + 1;
};
exports.parseSetCounterNumber = parseSetCounterNumber;
//# sourceMappingURL=latex-list-common.js.map