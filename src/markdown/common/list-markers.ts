/** Plain-text fallback markers for itemize levels 1..N (TSV/CSV/MD). */
export const itemizeLevelPlainDefaults: string[] = [
  '•', // level 1
  '–', // level 2
  '*', // level 3
  '·', // level 4
];

/**
 * Returns a plain-text list marker for a given itemize nesting level.
 * Ensures the level is at least 1 and clamps it to the available defaults.
 *
 * @param level - Itemize nesting level (1-based).
 * @returns Plain-text marker suitable for TSV/CSV/Markdown export.
 */
export const getItemizePlainMarker = (level: number): string => {
  const safeLevel: number = Math.max(1, level);
  const idx: number = Math.min(safeLevel - 1, itemizeLevelPlainDefaults.length - 1);
  return itemizeLevelPlainDefaults[idx];
};
