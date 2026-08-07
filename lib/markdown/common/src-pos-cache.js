"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firstPositionAtOrAfter = exports.countPositionsAtOrAfter = exports.matchPositionsCached = exports.lastMatchPosCached = void 0;
// Hosted on `state.env`, which a buffered probe state inherits by reference: a cache written on the
// probe itself dies with it, so the sweep reran for every probe and the scan stayed quadratic.
// Keyed by `src`, so a nested parse cannot evict the outer document's entry.
var MAX_SOURCES_PER_KEY = 8;
var bucketOf = function (state, key) {
    var _a, _b;
    var host = ((_a = state.env) !== null && _a !== void 0 ? _a : state);
    return (_b = host[key]) !== null && _b !== void 0 ? _b : (host[key] = new Map());
};
// Insertion order is age order, so the oldest source goes and the current one stays cached.
var remember = function (bucket, src, value) {
    if (bucket.size >= MAX_SOURCES_PER_KEY) {
        bucket.delete(bucket.keys().next().value);
    }
    bucket.set(src, value);
    return value;
};
/**
 * Offset of the last `patternG` match in `state.src`, or -1, cached on the state under `key`.
 *
 * Block rules use it to reject in O(1) what would otherwise cost a scan to end of source per
 * probe — terminator scans re-ask the same rule for every line, which makes such a scan quadratic
 * over a document.
 *
 * `patternG` MUST carry /g and must not be shared with a caller that relies on its `lastIndex`.
 * Entries are per `src`: a nested parse reads its own, and reassigning `state.src` picks a different
 * one (strings are immutable, so identity is a sound key).
 */
var lastMatchPosCached = function (state, key, patternG) {
    var bucket = bucketOf(state, key);
    var cached = bucket.get(state.src);
    if (cached !== undefined) {
        return cached;
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
    return remember(bucket, state.src, lastPos);
};
exports.lastMatchPosCached = lastMatchPosCached;
/**
 * Offsets of every `patternG` match in `state.src`, ascending, cached on `state.env` under `key`.
 * Same contract as lastMatchPosCached: /g required, one entry per `src`.
 */
var matchPositionsCached = function (state, key, patternG) {
    var bucket = bucketOf(state, key);
    var cached = bucket.get(state.src);
    if (cached) {
        return cached;
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
    return remember(bucket, state.src, positions);
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
/** The nearest of the ascending `positions` at or after `minOffset`, or -1 when none is left. */
var firstPositionAtOrAfter = function (positions, minOffset) {
    var count = (0, exports.countPositionsAtOrAfter)(positions, minOffset);
    return count > 0 ? positions[positions.length - count] : -1;
};
exports.firstPositionAtOrAfter = firstPositionAtOrAfter;
//# sourceMappingURL=src-pos-cache.js.map