export type FenceMarker = {
    char: number;
    len: number;
};
/** Marker of a fence opening this line, or null. Mirrors the core fence rule (mmd-fence.ts): marker
 *  ` or ~, run of 3 or more, up to 3 leading spaces, no backtick in a backtick fence's info string. */
export declare const detectFenceOpen: (rawLine: string) => FenceMarker | null;
/** Does this line close `fence`? Same char, at least as long, blank tail. */
export declare const isFenceClose: (rawLine: string, fence: FenceMarker) => boolean;
/**
 * Every verbatim stretch of `text`, ascending and non-overlapping. An unclosed fence, `lstlisting` or
 * math environment runs to the end, as the owning rules treat it.
 */
export declare const findVerbatimRanges: (text: string) => Array<[
    number,
    number
]>;
/** Is `at` inside one of the ascending `ranges`? Half-open `[start, end)`. Binary search, no allocation. */
export declare const isInsideRanges: (ranges: ReadonlyArray<readonly [
    number,
    number
]>, at: number) => boolean;
