/**
 * Whether a code point is an East-Asian Wide/Fullwidth character, which renders
 * roughly twice as wide as an ASCII character. Approximation of Unicode's East
 * Asian Width property covering the BMP ranges. Astral characters (emoji, CJK
 * Ext-B+) are out of range and count as width 1.
 */
export declare const isWideChar: (cp: number) => boolean;
/**
 * Display width of a string in character cells: East-Asian Wide/Fullwidth
 * characters count as 2, everything else as 1. Iterates by code point so
 * surrogate pairs count once.
 */
export declare const displayWidth: (str: string) => number;
/**
 * Width of one inline token in character cells: text by display width, math by its
 * rendered `widthEx`, wrappers (e.g. `\textbf{…}`) by recursing into children. The
 * char-based counterpart of `getTextWidthByTokens` (font-based) — used where no font
 * is loaded (`fontMetrics` runs only under markdownToHTMLWithSize).
 */
export declare const tokenDisplayWidth: (token: any) => number;
