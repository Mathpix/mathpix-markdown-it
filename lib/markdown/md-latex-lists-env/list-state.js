"use strict";
/**
 * State manager for nested LaTeX list environments (e.g., \begin{itemize}, \item).
 *
 * This module tracks the current depth of nested lists and the number of \item
 * entries opened at each depth level during parsing.
 *
 * Depth levels:
 *   -1 — outside of any list
 *    0 — first list level
 *    1 — nested list level
 *    ...
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.incrementItemCount = exports.getCurrentListLevelState = exports.getListLevelState = exports.leaveListLevel = exports.enterListLevel = exports.resetListState = void 0;
var tslib_1 = require("tslib");
// Internal state
var listLevels = [];
var currentListDepth = -1; // -1 means “not inside a list”
// Speculative parses reach these diagnostics once per offending line, so a desync would flood a
// consumer's log. Report each distinct case once per parse (reset below); a repeat says nothing new.
var warned = new Set();
var warnDistinct = function (key) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (warned.has(key)) {
        return;
    }
    warned.add(key);
    console.warn.apply(console, tslib_1.__spreadArray([], tslib_1.__read(args), false));
};
/**
 * Reset all list-related state.
 * Should be called before starting a new parsing session.
 */
var resetListState = function () {
    listLevels = [];
    currentListDepth = -1;
    warned.clear();
};
exports.resetListState = resetListState;
/**
 * Enter a new nested list level (e.g., encountering \begin{itemize}).
 * Automatically creates state storage for the new level if needed.
 */
var enterListLevel = function () {
    currentListDepth++;
    if (!listLevels[currentListDepth]) {
        listLevels[currentListDepth] = { openItems: 0 };
    }
};
exports.enterListLevel = enterListLevel;
/**
 * Leave the current list level (e.g., encountering \end{itemize}).
 * If already outside lists, logs a warning.
 */
var leaveListLevel = function () {
    if (currentListDepth < 0) {
        warnDistinct('leave', '[list-state] Attempt to leave list level while depth = -1');
        return;
    }
    currentListDepth--;
};
exports.leaveListLevel = leaveListLevel;
/**
 * Get the state object for a specific depth level.
 *
 * @param depth - The list depth level.
 * @returns State object or undefined.
 */
var getListLevelState = function (depth) {
    return listLevels[depth];
};
exports.getListLevelState = getListLevelState;
/**
 * Get the state object for the current depth level.
 *
 * @returns State object or undefined.
 */
var getCurrentListLevelState = function () {
    return listLevels[currentListDepth];
};
exports.getCurrentListLevelState = getCurrentListLevelState;
/**
 * Increment the number of opened \item commands on the current list level.
 * Logs a warning if called when no list level is active.
 */
var incrementItemCount = function () {
    var level = (0, exports.getCurrentListLevelState)();
    if (!level) {
        warnDistinct('increment:' + currentListDepth, '[list-state] incrementItemCount called outside of any list level', {
            currentListDepth: currentListDepth,
            listLevels: listLevels,
        });
        return;
    }
    level.openItems += 1;
};
exports.incrementItemCount = incrementItemCount;
//# sourceMappingURL=list-state.js.map