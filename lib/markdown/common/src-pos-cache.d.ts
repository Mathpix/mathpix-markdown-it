type SrcState = {
    src: string;
    env?: any;
};
/** Empties the buckets on `env`: a host reusing one env would otherwise keep old documents alive.
 *  Emptied, not deleted — `delete` would drop `env` into dictionary mode for the whole parse. */
export declare const clearSrcPosCaches: (env: any) => void;
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
export declare const matchPositionsCached: (state: SrcState, key: symbol, patternG: RegExp) => readonly number[];
/**
 * Any value derived from `state.src`, cached on `state.env` under `key` — same contract as the sweeps
 * above: one entry per `src`, computed on first ask, so a caller asked per block pays once.
 *
 * `isFresh` is for a value that depends on more than `src`: false recomputes and rewrites the slot.
 */
export declare const srcValueCached: <T>(state: SrcState, key: symbol, compute: (src: string) => T, isFresh?: (cached: T) => boolean) => T;
/** How many of the ascending `positions` are at or after `minOffset` — binary search, no allocation. */
export declare const countPositionsAtOrAfter: (positions: readonly number[], minOffset: number) => number;
export {};
