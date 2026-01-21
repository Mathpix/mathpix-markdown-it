/** Plain-text fallback markers for itemize levels 1..N (TSV/CSV/MD). */
export const itemizeLevelPlainDefaults: string[] = [
  '•', // level 1
  '–', // level 2
  '*', // level 3
  '·', // level 4
];

/** Default LaTeX itemize bullet styles */
export const itemizeLevelDefaults: string[] = [
  "\\textbullet", //"•"
  "\\textendash", //"–"
  "\\textasteriskcentered", //"∗"
  "\\textperiodcentered", //"·"
];

/** Default enumerate styles for CSS list-style-type */
export const enumerateLevelDefaults: string[] = [
  'decimal',
  'lower-alpha',
  'lower-roman',
  'upper-alpha',
];

type EnumerateStyle = 'decimal' | 'lower-alpha' | 'upper-alpha' | 'lower-roman' | 'upper-roman';

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

/**
 * Converts a 1-based index to an Excel-like alphabetic label (a..z, aa..zz, ...).
 *
 * @param n - 1-based index (values <= 0 are treated as 1).
 * @param upper - If true, returns uppercase letters.
 * @returns Alphabetic label for the given index.
 */
const toAlpha = (n: number, upper: boolean): string => {
  let x: number = Math.max(1, n);
  let label: string = '';
  const baseCharCode = upper ? 65 : 97; // 'A' or 'a'
  while (x > 0) {
    x -= 1;
    label = String.fromCharCode(baseCharCode + (x % 26)) + label;
    x = Math.floor(x / 26);
  }
  return label;
};

/**
 * Converts a 1-based index to a Roman numeral string.
 *
 * @param n - 1-based index (values <= 0 are treated as 1).
 * @param upper - If true, returns uppercase numerals.
 * @returns Roman numeral representation of the given index.
 */
const toRoman = (n: number, upper: boolean): string => {
  let x: number = Math.max(1, n);
  const romanMap: Array<[number, string]> = [
    [1000, 'm'], [900, 'cm'], [500, 'd'], [400, 'cd'],
    [100, 'c'], [90, 'xc'], [50, 'l'], [40, 'xl'],
    [10, 'x'], [9, 'ix'], [5, 'v'], [4, 'iv'], [1, 'i'],
  ];
  let res: string = '';
  for (const [value, symbol] of romanMap) {
    while (x >= value) {
      res += symbol;
      x -= value;
    }
  }
  return upper ? res.toUpperCase() : res;
};

/**
 * Resolves the enumerate marker style for a given nesting level.
 * Falls back to the first default ("decimal") for invalid levels or levels beyond configured defaults.
 *
 * @param level - Enumerate nesting level (1-based).
 * @returns CSS-like enumerate style name (e.g. "decimal", "lower-alpha").
 */
const getEnumerateStyle = (level: number): EnumerateStyle => {
  const safeLevel:number = Number.isFinite(level) ? Math.max(1, level) : 1;
  if (safeLevel > enumerateLevelDefaults.length) {
    return enumerateLevelDefaults[0] as EnumerateStyle; // "decimal"
  }
  return enumerateLevelDefaults[safeLevel - 1] as EnumerateStyle;
};

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
export const getEnumeratePlainMarker = (enumerateIndex: number, level: number): string => {
  const style: EnumerateStyle = getEnumerateStyle(level);
  const index: number = Math.max(1, enumerateIndex);
  switch (style) {
    case 'decimal':
      return `${index}.`;
    case 'lower-alpha':
      return `${toAlpha(index, false)}.`;
    case 'upper-alpha':
      return `${toAlpha(index, true)}.`;
    case 'lower-roman':
      return `${toRoman(index, false)}.`;
    case 'upper-roman':
      return `${toRoman(index, true)}.`;
    default:
      return `${index}.`;
  }
};
