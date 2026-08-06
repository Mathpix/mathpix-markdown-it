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
export declare const lastMatchPosCached: (state: StateBlock, key: symbol, patternG: RegExp) => number;
/**
 * Offsets of every `patternG` match in `state.src`, ascending, cached on the state under `key`.
 * Same contract as lastMatchPosCached: /g required, invalidated when `state.src` is reassigned.
 */
export declare const matchPositionsCached: (state: StateBlock, key: symbol, patternG: RegExp) => readonly number[];
/** How many of the ascending `positions` are at or after `minOffset` — binary search, no allocation. */
export declare const countPositionsAtOrAfter: (positions: readonly number[], minOffset: number) => number;
/** The nearest of the ascending `positions` at or after `minOffset`, or -1 when none is left. */
export declare const firstPositionAtOrAfter: (positions: readonly number[], minOffset: number) => number;
