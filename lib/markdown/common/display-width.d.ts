interface WidthToken {
    type?: string;
    content?: string;
    widthEx?: number;
    children?: WidthToken[] | null;
}
/**
 * Whether a code point is an East-Asian Wide/Fullwidth character, which renders
 * roughly twice as wide as an ASCII character. Approximation of Unicode's East
 * Asian Width property covering the BMP ranges. Astral characters (emoji, CJK
 * Ext-B+) are out of range and count as width 1; the zero-width combining marks
 * U+3099/U+309A are excluded. Other combining marks are not special-cased (count 1).
 */
export declare const isWideChar: (cp: number) => boolean;
/**
 * Reserve for a run of text in em: sum of per-char class widths. Combining marks U+3099/
 * U+309A count 0; East-Asian wide chars use CJK_EM; else narrow/normal/wide by class.
 */
export declare const textReserveEm: (str: string) => number;
/**
 * Width of one inline marker token in em: math by its rendered `widthEx` (converted to em),
 * wrappers (e.g. `\textbf{…}`) by recursing into children, text-like leaves (`text` /
 * `code_inline` / `text_special`) by per-char class widths, everything else (e.g.
 * `html_inline`, whose content is markup) 0. The counterpart of `getTextWidthByTokens`
 * (font-based) — used where no font is loaded. Math without a `widthEx` (non-SVG output)
 * also contributes 0, so the marker keeps the default indent.
 */
export declare const tokenMarkerWidth: (token: WidthToken) => number;
export {};
