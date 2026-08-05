"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreListLevels = exports.snapshotListLevels = exports.getListDepth = exports.incrementItemCount = exports.getCurrentListLevelState = exports.leaveListLevel = exports.enterListLevel = exports.resetListState = void 0;
var warn_distinct_1 = require("../common/warn-distinct");
// One entry per open list level, innermost last.
var listLevels = [];
/**
 * Reset all list-related state.
 * Should be called before starting a new parsing session.
 */
var resetListState = function () {
    listLevels = [];
    (0, warn_distinct_1.resetWarnDistinct)();
};
exports.resetListState = resetListState;
/**
 * Enter a new nested list level (e.g., encountering \begin{itemize}).
 * The counter is always fresh: a discarded parse can leave a level with items still open.
 */
var enterListLevel = function () {
    listLevels.push({ openItems: 0 });
};
exports.enterListLevel = enterListLevel;
/**
 * Leave the current list level (e.g., encountering \end{itemize}).
 * If already outside lists, logs a warning.
 */
var leaveListLevel = function () {
    if (listLevels.length === 0) {
        (0, warn_distinct_1.warnDistinct)('leave', '[list-state] Attempt to leave list level while depth = -1');
        return;
    }
    listLevels.pop();
};
exports.leaveListLevel = leaveListLevel;
/**
 * Get the state object for the current depth level.
 *
 * @returns State object or undefined.
 */
var getCurrentListLevelState = function () {
    return listLevels[listLevels.length - 1];
};
exports.getCurrentListLevelState = getCurrentListLevelState;
/**
 * Increment the number of opened \item commands on the current list level.
 * Logs a warning if called when no list level is active.
 */
var incrementItemCount = function () {
    var level = (0, exports.getCurrentListLevelState)();
    if (!level) {
        (0, warn_distinct_1.warnDistinct)('increment:' + (0, exports.getListDepth)(), '[list-state] incrementItemCount called outside of any list level', {
            currentListDepth: (0, exports.getListDepth)(),
            listLevels: listLevels,
        });
        return;
    }
    level.openItems += 1;
};
exports.incrementItemCount = incrementItemCount;
/** Current nesting depth (-1 outside any list). Read-only view for cache keys. */
var getListDepth = function () { return listLevels.length - 1; };
exports.getListDepth = getListDepth;
/** Open-level count, to hand back to restoreListLevels after a speculative parse. */
var snapshotListLevels = function () { return listLevels.length; };
exports.snapshotListLevels = snapshotListLevels;
/** Drop levels entered since the snapshot. Only truncates, never re-creates. */
var restoreListLevels = function (depth) {
    if (listLevels.length > depth) {
        listLevels.length = depth;
    }
};
exports.restoreListLevels = restoreListLevels;
//# sourceMappingURL=list-state.js.map