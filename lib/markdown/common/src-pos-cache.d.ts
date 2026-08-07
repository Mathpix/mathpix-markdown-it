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
export declare const lastMatchPosCached: (state: StateBlock, key: symbol, patternG: RegExp) => number;
/**
 * Offsets of every `patternG` match in `state.src`, ascending, cached on `state.env` under `key`.
 * Same contract as lastMatchPosCached: /g required, one entry per `src`.
 */
export declare const matchPositionsCached: (state: StateBlock, key: symbol, patternG: RegExp) => readonly number[];
/** How many of the ascending `positions` are at or after `minOffset` — binary search, no allocation. */
export declare const countPositionsAtOrAfter: (positions: readonly number[], minOffset: number) => number;
/** The nearest of the ascending `positions` at or after `minOffset`, or -1 when none is left. */
export declare const firstPositionAtOrAfter: (positions: readonly number[], minOffset: number) => number;
