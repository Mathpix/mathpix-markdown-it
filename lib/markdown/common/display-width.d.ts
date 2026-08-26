interface WidthToken {
    type?: string;
    content?: string;
    widthEx?: number;
    children?: WidthToken[] | null;
}
/**
 * Whether a code point is an East-Asian Wide/Fullwidth character, which renders
 * roughly twice as wide as an ASCII character. Block-level approximation of Unicode's
 * East Asian Width property, over the BMP and the astral blocks that are Wide.
 * Zero-advance code points are excluded here and reserve 0 — see isZeroWidthChar.
 */
export declare const isWideChar: (cp: number) => boolean;
/**
 * Reserve for a run of text in em: sum of per-char class widths. ASCII by the class table,
 * combining marks 0, East-Asian wide CJK_EM, other non-ASCII by case (see nonAsciiEm).
 */
export declare const textReserveEm: (str: string) => number;
/**
 * Width of one inline marker token in em: math by its rendered `widthEx` (converted to em),
 * `code_inline`/`texttt` by monospace cells, wrappers (e.g. `\textbf{…}`) by recursing into
 * children, text-like leaves (`text` / `text_special`) by per-char class widths, everything
 * else (e.g. `html_inline`, whose content is markup) 0. The counterpart of `getTextWidthByTokens`
 * (font-based) — used where no font is loaded. Math without a `widthEx` (non-SVG output)
 * also contributes 0, so the marker keeps the default indent.
 */
export declare const tokenMarkerWidth: (token: WidthToken, depth?: number) => number;
export {};
