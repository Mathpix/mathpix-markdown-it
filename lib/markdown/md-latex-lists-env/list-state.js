"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.endMarkerParse = exports.beginMarkerParse = exports.isParsingMarker = exports.restoreListLevels = exports.snapshotListLevels = exports.getOpenListCount = exports.getListDepth = exports.incrementItemCount = exports.getCurrentListLevelState = exports.leaveListLevel = exports.enterListLevel = exports.resetListState = void 0;
var warn_distinct_1 = require("../common/warn-distinct");
// Counted, not boolean: a marker parsed inside another must not clear the flag early.
var markerParseDepth = 0;
// One entry per open list level, innermost last.
var listLevels = [];
/**
 * Reset all list-related state.
 * Should be called before starting a new parsing session.
 */
var resetListState = function () {
    listLevels = [];
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
        (0, warn_distinct_1.warnDistinct)('leave:' + (0, exports.getListDepth)(), '[list-state] leaving a list level while outside any list', { depth: (0, exports.getListDepth)() });
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
/** How many lists are open right now — a live count, not a snapshot. */
var getOpenListCount = function () { return listLevels.length; };
exports.getOpenListCount = getOpenListCount;
// Structural: a length puts back neither a dropped level nor the `openItems` of a surviving one.
// The empty case is shared: a top-level list opens with no levels yet, and that is the common one.
var NO_LEVELS = Object.freeze([]);
var snapshotListLevels = function () {
    return listLevels.length === 0 ? NO_LEVELS : listLevels.map(function (level) { return ({ openItems: level.openItems }); });
};
exports.snapshotListLevels = snapshotListLevels;
var restoreListLevels = function (snapshot) {
    listLevels = snapshot.map(function (level) { return ({ openItems: level.openItems }); });
};
exports.restoreListLevels = restoreListLevels;
// A marker body is parsed with the block flag still set on `env`, so a list written there became a
// real list inside the marker's `<span>`.
var isParsingMarker = function () { return markerParseDepth > 0; };
exports.isParsingMarker = isParsingMarker;
var beginMarkerParse = function () {
    markerParseDepth++;
};
exports.beginMarkerParse = beginMarkerParse;
var endMarkerParse = function () {
    markerParseDepth--;
};
exports.endMarkerParse = endMarkerParse;
//# sourceMappingURL=list-state.js.map