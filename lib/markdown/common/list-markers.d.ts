/** Plain-text fallback markers for itemize levels 1..N (TSV/CSV/MD). */
export declare const itemizeLevelPlainDefaults: string[];
/**
 * Returns a plain-text list marker for a given itemize nesting level.
 * Ensures the level is at least 1 and clamps it to the available defaults.
 *
 * @param level - Itemize nesting level (1-based).
 * @returns Plain-text marker suitable for TSV/CSV/Markdown export.
 */
export declare const getItemizePlainMarker: (level: number) => string;
