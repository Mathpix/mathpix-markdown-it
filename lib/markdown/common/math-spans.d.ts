export declare const RE_MATH_OPEN: RegExp;
/** For `getSubMath` only, which resets `lastIndex` on entry and is not reentrant. A second caller here
 *  needs its own instance. */
export declare const RE_MATH_OPEN_G: RegExp;
/**
 * End marker for a matched opening marker.
 * - string: marker to search for (e.g. "\\]", "$")
 * - null: self-closing match (eqref/ref) — content is the match itself
 * - undefined: `\begin{env}` — the caller resolves it by balanced tag search
 */
export declare const getEndMarker: (matchStr: string, envGroup: string | undefined, eqrefGroup: string | undefined, refGroup: string | undefined) => string | null | undefined;
/** Is this `$`/`$$` pair not math after all? Escaped either side, whitespace inside a `$` pair, or a
 *  digit right after the closer, which reads as a price rather than a formula. */
export declare const shouldSkipDollar: (str: string, marker: string, beginMarkerPos: number, endMarkerPos: number) => boolean;
/**
 * First math span at or after `from`, or null. Same openers, end markers and `$` guards the extraction
 * uses, with nothing extracted and no state touched.
 */
export declare const nextMathSpan: (str: string, from: number, mathEnvsOnly?: boolean, until?: number, lastEnd?: number) => {
    start: number;
    end: number;
} | null;
/** Offset of every math opener, ascending. `nextMathSpan` with no opener ahead scans to EOF, so a
 *  caller asking per block needs these once instead. */
export declare const mathOpenerOffsets: (str: string) => number[];
