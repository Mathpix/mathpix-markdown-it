"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lastMatchPosCached = void 0;
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
//# sourceMappingURL=src-pos-cache.js.map