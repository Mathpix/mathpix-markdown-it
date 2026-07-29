import { mathTokenTypes, EX_TO_EM } from "./consts";

const MATH_TOKEN_TYPES = new Set<string>(mathTokenTypes);
// Leaf tokens whose `content` is visible text (measured); others (e.g. `html_inline`, whose
// content is raw markup) contribute 0.
const TEXT_LIKE_TYPES = new Set<string>(['text', 'code_inline', 'text_special']);

// Zero-width combining marks that fall inside the Katakana range below.
const isZeroWidthCombining = (cp: number): boolean => cp === 0x3099 || cp === 0x309A;

// Minimal shape tokenMarkerWidth reads (a subset of markdown-it's Token).
interface WidthToken {
  type?: string;
  content?: string;
  widthEx?: number;
  children?: WidthToken[] | null;
}

// Per-char text reserve in em by width class (safety margin over Helvetica advances).
const NARROW_RE = /[ !'"(),.\/:;|\[\]ijltfrI]/;   // thin glyphs
const WIDE_RE = /[A-HJ-Zmw]/;                      // most capitals (except I) + m, w
const XWIDE_RE = /[W@%]/;                           // widest glyphs
const NARROW_EM = 0.40;
const NORMAL_EM = 0.62;
const WIDE_EM = 0.90;
const XWIDE_EM = 1.10;
const CJK_EM = 1.20;                               // East-Asian full-width glyph

/**
 * Whether a code point is an East-Asian Wide/Fullwidth character, which renders
 * roughly twice as wide as an ASCII character. Approximation of Unicode's East
 * Asian Width property covering the BMP ranges. Astral characters (emoji, CJK
 * Ext-B+) are out of range and count as width 1; the zero-width combining marks
 * U+3099/U+309A are excluded. Other combining marks are not special-cased (count 1).
 */
export const isWideChar = (cp: number): boolean =>
  !isZeroWidthCombining(cp) &&
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
 * Reserve for a run of text in em: sum of per-char class widths. Combining marks U+3099/
 * U+309A count 0; East-Asian wide chars use CJK_EM; else narrow/normal/wide by class.
 */
export const textReserveEm = (str: string): number => {
  let em = 0;
  for (const ch of str) {
    const cp: number = ch.codePointAt(0) ?? 0;
    if (isZeroWidthCombining(cp)) {
      continue;
    }
    if (isWideChar(cp)) {
      em += CJK_EM;
    } else if (NARROW_RE.test(ch)) {
      em += NARROW_EM;
    } else if (XWIDE_RE.test(ch)) {
      em += XWIDE_EM;
    } else if (WIDE_RE.test(ch)) {
      em += WIDE_EM;
    } else {
      em += NORMAL_EM;
    }
  }
  return em;
};

/**
 * Width of one inline marker token in em: math by its rendered `widthEx` (converted to em),
 * wrappers (e.g. `\textbf{…}`) by recursing into children, text-like leaves (`text` /
 * `code_inline` / `text_special`) by per-char class widths, everything else (e.g.
 * `html_inline`, whose content is markup) 0. The counterpart of `getTextWidthByTokens`
 * (font-based) — used where no font is loaded. Math without a `widthEx` (non-SVG output)
 * also contributes 0, so the marker keeps the default indent.
 */
export const tokenMarkerWidth = (token: WidthToken): number => {
  if (typeof token.widthEx === 'number') {
    return token.widthEx * EX_TO_EM;
  }
  // Math with no widthEx → 0 (don't measure content; that would be a fabricated estimate).
  if (token.type && MATH_TOKEN_TYPES.has(token.type)) {
    return 0;
  }
  if (token.children && token.children.length) {
    let em = 0;
    for (let i = 0; i < token.children.length; i++) {
      em += tokenMarkerWidth(token.children[i]);
    }
    return em;
  }
  if (token.type && TEXT_LIKE_TYPES.has(token.type)) {
    return textReserveEm(token.content ?? '');
  }
  return 0;
};
