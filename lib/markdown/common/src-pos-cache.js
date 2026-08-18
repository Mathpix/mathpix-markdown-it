"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countPositionsAtOrAfter = exports.srcValueCached = exports.matchPositionsCached = exports.lastMatchPosCached = exports.clearSrcPosCaches = void 0;
// Hosted on `state.env`, which a buffered probe state inherits by reference: a cache written on the
// probe itself dies with it, so the sweep reran for every probe and the scan stayed quadratic.
// One entry per `src`, oldest evicted — and a hit refreshes its slot, or a run of nested parses
// would drop the outer document's entry, the one asked over and over.
var MAX_SOURCES_PER_KEY = 8;
// Which keys were ever used, so a render can empty the buckets without naming them.
var bucketKeys = new Set();
var bucketOf = function (state, key) {
    var _a;
    // Falling back to `state` puts the cache outside the per-render clear, so it lives and dies with
    // that state instead. Every real state carries an `env`; a hand-built one may not.
    var host = ((_a = state.env) !== null && _a !== void 0 ? _a : state);
    var bucket = host[key];
    if (bucket) {
        return bucket;
    }
    bucketKeys.add(key);
    return (host[key] = { hotSrc: null, hotSlot: null, bySrc: new Map() });
};
/** Empties the buckets on `env`: a host reusing one env would otherwise keep old documents alive.
 *  Emptied, not deleted — `delete` would drop `env` into dictionary mode for the whole parse. */
var clearSrcPosCaches = function (env) {
    if (!env) {
        return;
    }
    bucketKeys.forEach(function (key) {
        var bucket = env[key];
        if (bucket) {
            bucket.hotSrc = null;
            bucket.hotSlot = null;
            bucket.bySrc.clear();
        }
    });
};
exports.clearSrcPosCaches = clearSrcPosCaches;
// Re-inserting makes this the newest entry: insertion order is the age order eviction reads.
// Skipped for a lone entry — nothing to age against, and this runs per block rule call.
var recall = function (bucket, src) {
    if (bucket.hotSrc === src) {
        return bucket.hotSlot;
    }
    var hit = bucket.bySrc.get(src);
    if (!hit) {
        return null;
    }
    if (bucket.bySrc.size > 1) {
        bucket.bySrc.delete(src);
        bucket.bySrc.set(src, hit);
    }
    bucket.hotSrc = src;
    bucket.hotSlot = hit;
    return hit;
};
// Insertion order is age order, so the oldest source goes and the current one stays cached. Eviction
// leaves the hot slot alone, so a key holds at most nine sources until the per-render clear.
var remember = function (bucket, src, value) {
    if (bucket.bySrc.size >= MAX_SOURCES_PER_KEY) {
        bucket.bySrc.delete(bucket.bySrc.keys().next().value);
    }
    var slot = { value: value };
    bucket.bySrc.set(src, slot);
    bucket.hotSrc = src;
    bucket.hotSlot = slot;
    return value;
};
/**
 * Offset of the last `patternG` match in `state.src`, or -1, cached on `state.env` under `key`.
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
    var cached = recall(bucket, state.src);
    if (cached) {
        return cached.value;
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
    var cached = recall(bucket, state.src);
    if (cached) {
        return cached.value;
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
/**
 * Any value derived from `state.src`, cached on `state.env` under `key` — same contract as the sweeps
 * above: one entry per `src`, computed on first ask, so a caller asked per block pays once.
 *
 * `isFresh` is for a value that depends on more than `src`: false recomputes and rewrites the slot.
 */
var srcValueCached = function (state, key, compute, isFresh) {
    var bucket = bucketOf(state, key);
    var cached = recall(bucket, state.src);
    if (cached && (!isFresh || isFresh(cached.value))) {
        return cached.value;
    }
    if (cached) {
        // Rewritten in place: a recompute that skips the slot pays the full walk on every later ask.
        cached.value = compute(state.src);
        return cached.value;
    }
    return remember(bucket, state.src, compute(state.src));
};
exports.srcValueCached = srcValueCached;
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