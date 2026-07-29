import { mathTokenTypes } from "./consts";

// Marker widths are measured in `ex` (math by exact `widthEx`, text ~1.3 ex/char — a glyph
// is ~1 ex). The producer converts the total to `em` for the emitted padding (EX_TO_EM).
const TEXT_EX_PER_CELL = 1.3;
const MATH_TOKEN_TYPES = new Set<string>(mathTokenTypes);

// Minimal shape tokenDisplayWidth reads (a subset of markdown-it's Token).
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
export const isWideChar = (cp: number): boolean =>
  // U+3099/U+309A are zero-width combining marks that fall inside the Katakana range below.
  (cp !== 0x3099 && cp !== 0x309A) &&
  ((cp >= 0x1100 && cp <= 0x115F) ||   // Hangul Jamo
  (cp >= 0x2E80 && cp <= 0x303E) ||   // CJK radicals, Kangxi, CJK symbols/punctuation
  (cp >= 0x3041 && cp <= 0x33FF) ||   // Hiragana, Katakana, CJK symbols
  (cp >= 0x3400 && cp <= 0x4DBF) ||   // CJK Unified Ideographs Extension A
  (cp >= 0x4E00 && cp <= 0x9FFF) ||   // CJK Unified Ideographs
  (cp >= 0xA000 && cp <= 0xA4CF) ||   // Yi
  (cp >= 0xAC00 && cp <= 0xD7A3) ||   // Hangul Syllables
  (cp >= 0xF900 && cp <= 0xFAFF) ||   // CJK Compatibility Ideographs
  (cp >= 0xFE30 && cp <= 0xFE4F) ||   // CJK Compatibility Forms
  (cp >= 0xFF00 && cp <= 0xFF60) ||   // Fullwidth Forms
  (cp >= 0xFFE0 && cp <= 0xFFE6));    // Fullwidth signs

/**
 * Display width of a string in character cells: East-Asian Wide/Fullwidth characters count
 * as 2, the zero-width combining marks U+3099/U+309A as 0, everything else as 1. Iterates
 * by code point so surrogate pairs count once. Other combining marks are not special-cased.
 */
export const displayWidth = (str: string): number => {
  let width = 0;
  for (const ch of str) {
    const cp: number = ch.codePointAt(0) ?? 0;
    if (cp === 0x3099 || cp === 0x309A) {
      continue; // zero-width combining marks
    }
    width += isWideChar(cp) ? 2 : 1;
  }
  return width;
};

/**
 * Width of one inline token in `ex`: text by display width × TEXT_EX_PER_CELL, math by its
 * exact rendered `widthEx`, wrappers (e.g. `\textbf{…}`) by recursing into children. The
 * char-based counterpart of `getTextWidthByTokens` (font-based) — used where no font is
 * loaded (`fontMetrics` runs only under markdownToHTMLWithSize). Math without a `widthEx`
 * (non-SVG output) returns 0: no measured width, so the marker keeps the default indent
 * rather than a fabricated estimate.
 */
export const tokenDisplayWidth = (token: WidthToken): number => {
  if (token.type === 'text') {
    return displayWidth(token.content ?? '') * TEXT_EX_PER_CELL;
  }
  if (typeof token.widthEx === 'number') {
    return token.widthEx;
  }
  // Math with no widthEx → 0 (don't recurse children; that branch is for wrappers).
  if (token.type && MATH_TOKEN_TYPES.has(token.type)) {
    return 0;
  }
  if (token.children && token.children.length) {
    let width = 0;
    for (let i = 0; i < token.children.length; i++) {
      width += tokenDisplayWidth(token.children[i]);
    }
    return width;
  }
  return 0;
};
