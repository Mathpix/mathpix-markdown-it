"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItemizePlainMarker = exports.itemizeLevelPlainDefaults = void 0;
/** Plain-text fallback markers for itemize levels 1..N (TSV/CSV/MD). */
exports.itemizeLevelPlainDefaults = [
    '•',
    '–',
    '*',
    '·', // level 4
];
/**
 * Returns a plain-text list marker for a given itemize nesting level.
 * Ensures the level is at least 1 and clamps it to the available defaults.
 *
 * @param level - Itemize nesting level (1-based).
 * @returns Plain-text marker suitable for TSV/CSV/Markdown export.
 */
var getItemizePlainMarker = function (level) {
    var safeLevel = Math.max(1, level);
    var idx = Math.min(safeLevel - 1, exports.itemizeLevelPlainDefaults.length - 1);
    return exports.itemizeLevelPlainDefaults[idx];
};
exports.getItemizePlainMarker = getItemizePlainMarker;
//# sourceMappingURL=list-markers.js.map