"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countPositionsAtOrAfter = exports.matchPositionsCached = exports.lastMatchPosCached = void 0;
/**
 * Offset of the last `patternG` match in `state.src`, or -1, cached on the state under `key`.
 *
 * Block rules use it to reject in O(1) what would otherwise cost a scan to end of source per
 * probe — terminator scans re-ask the same rule for every line, which makes such a scan quadratic
 * over a document.
 *
 * `patternG` MUST carry /g and must not be shared with a caller that relies on its `lastIndex`.
 * A nested `state.md.block.parse(...)` builds its own StateBlock, so a cache on the outer state is
 * never read by a nested parse; within one state, reassigning `state.src` invalidates the entry
 * (strings are immutable, so identity is a sound check).
 */
var lastMatchPosCached = function (state, key, patternG) {
    var slot = state;
    var cached = slot[key];
    if (cached && cached.src === state.src) {
        return cached.lastPos;
    }
    patternG.lastIndex = 0;
    var lastPos = -1;
    var m;
    while ((m = patternG.exec(state.src)) !== null) {
        lastPos = m.index;
        // Empty-match guard: a pattern that can match '' would otherwise spin here.
        if (m.index === patternG.lastIndex) {
            patternG.lastIndex++;
        }
    }
    patternG.lastIndex = 0;
    slot[key] = { src: state.src, lastPos: lastPos };
    return lastPos;
};
exports.lastMatchPosCached = lastMatchPosCached;
/**
 * Offsets of every `patternG` match in `state.src`, ascending, cached on the state under `key`.
 * Same contract as lastMatchPosCached: /g required, invalidated when `state.src` is reassigned.
 */
var matchPositionsCached = function (state, key, patternG) {
    var slot = state;
    var cached = slot[key];
    if (cached && cached.src === state.src) {
        return cached.positions;
    }
    patternG.lastIndex = 0;
    var positions = [];
    var match;
    while ((match = patternG.exec(state.src)) !== null) {
        positions.push(match.index);
        if (match.index === patternG.lastIndex) {
            patternG.lastIndex++;
        }
    }
    patternG.lastIndex = 0;
    slot[key] = { src: state.src, positions: positions };
    return positions;
};
exports.matchPositionsCached = matchPositionsCached;
/** How many of the ascending `positions` are at or after `minOffset` — binary search, no allocation. */
var countPositionsAtOrAfter = function (positions, minOffset) {
    var firstIndex = 0;
    var pastLastIndex = positions.length;
    while (firstIndex < pastLastIndex) {
        var middleIndex = (firstIndex + pastLastIndex) >> 1;
        if (positions[middleIndex] < minOffset) {
            firstIndex = middleIndex + 1;
        }
        else {
            pastLastIndex = middleIndex;
        }
    }
    return positions.length - firstIndex;
};
exports.countPositionsAtOrAfter = countPositionsAtOrAfter;
//# sourceMappingURL=src-pos-cache.js.map