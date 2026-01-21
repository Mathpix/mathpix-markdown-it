/** Plain-text fallback markers for itemize levels 1..N (TSV/CSV/MD). */
export declare const itemizeLevelPlainDefaults: string[];
/** Default LaTeX itemize bullet styles */
export declare const itemizeLevelDefaults: string[];
/** Default enumerate styles for CSS list-style-type */
export declare const enumerateLevelDefaults: string[];
/**
 * Returns a plain-text list marker for a given itemize nesting level.
 * Ensures the level is at least 1 and clamps it to the available defaults.
 *
 * @param level - Itemize nesting level (1-based).
 * @returns Plain-text marker suitable for TSV/CSV/Markdown export.
 */
export declare const getItemizePlainMarker: (level: number) => string;
/**
 * Returns a plain-text enumerate marker for the given item index and nesting level,
 * using `enumerateLevelDefaults` to pick the style (decimal/alpha/roman).
 *
 * Examples:
 * - level 1 (decimal): 1.
 * - level 2 (lower-alpha): a.
 * - level 3 (lower-roman): i.
 * - level 4 (upper-alpha): A.
 */
export declare const getEnumeratePlainMarker: (enumerateIndex: number, level: number) => string;
