import { mathTokenTypes, EX_TO_EM } from "./consts";

const MATH_TOKEN_TYPES = new Set<string>(mathTokenTypes);
// Leaf tokens whose `content` is visible text (measured); others (e.g. `html_inline`, whose
// content is raw markup) contribute 0.
// `code_inline` is absent on purpose: it is handled earlier, by the monospace branch.
const TEXT_LIKE_TYPES = new Set<string>(['text', 'text_special']);

// Combining marks: they render over the base glyph, so they reserve nothing.
const isZeroWidthCombining = (cp: number): boolean =>
  (cp >= 0x0300 && cp <= 0x036F) ||   // Combining Diacritical Marks
  (cp >= 0x1AB0 && cp <= 0x1AFF) ||   // ... Extended
  (cp >= 0x20D0 && cp <= 0x20F0) ||   // ... for Symbols
  (cp >= 0xFE20 && cp <= 0xFE2F) ||   // Combining Half Marks
  cp === 0x3099 || cp === 0x309A;     // Katakana voiced marks (inside the wide range below)

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
// Monospace advance, covering the faces `code` uses (Inconsolata 0.5em, DM Mono 0.6em).
const MONO_EM = 0.62;
const MONO_TOKEN_TYPES = new Set<string>(['code_inline', 'texttt']);

// ASCII fast path — those classes are ASCII-only. Built from the same regexes, so it can't drift.
const ASCII_EM: Float64Array = (() => {
  const widths = new Float64Array(128);
  for (let cp = 0; cp < 128; cp++) {
    const ch: string = String.fromCharCode(cp);
    widths[cp] = NARROW_RE.test(ch) ? NARROW_EM
      : XWIDE_RE.test(ch) ? XWIDE_EM
      : WIDE_RE.test(ch) ? WIDE_EM
      : NORMAL_EM;
  }
  return widths;
})();

/**
 * Whether a code point is an East-Asian Wide/Fullwidth character, which renders
 * roughly twice as wide as an ASCII character. Approximation of Unicode's East
 * Asian Width property covering the BMP ranges. Astral characters (emoji, CJK
 * Ext-B+) are out of range. Combining marks are excluded here and reserve 0 —
 * see isZeroWidthCombining.
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

// Only the case test below allocates, so only its result is worth caching — the wide and
// zero-width checks are range comparisons. Never invalidated: a code point's class is fixed,
// unlike the per-parse caches elsewhere in the parser.
const casedEm: Map<number, number> = new Map();

// Reserve for one non-ASCII code point in em.
const nonAsciiEm = (cp: number): number => {
  // A combining mark renders over the base glyph; a lone surrogate is broken input, not a glyph.
  if (isZeroWidthCombining(cp) || (cp >= 0xD800 && cp <= 0xDFFF)) {
    return 0;
  }
  if (isWideChar(cp)) {
    return CJK_EM;
  }
  let em: number | undefined = casedEm.get(cp);
  if (em === undefined) {
    // The ASCII classes can't see these letters; uppercase runs widest (`Љ` is 1.06em in Arial).
    const ch: string = String.fromCodePoint(cp);
    em = ch !== ch.toLowerCase() && ch === ch.toUpperCase() ? XWIDE_EM : WIDE_EM;
    casedEm.set(cp, em);
  }
  return em;
};

// Monospace cells in a run: code points, not UTF-16 units, and combining marks take none.
const monoCells = (str: string): number => {
  let cells = 0;
  for (let i = 0; i < str.length; i++) {
    const unit: number = str.charCodeAt(i);
    if (unit < 128) {
      cells++;
      continue;
    }
    const cp: number = str.codePointAt(i) ?? 0;
    if (cp > 0xFFFF) {
      i++;
    }
    if (!isZeroWidthCombining(cp)) {
      cells++;
    }
  }
  return cells;
};

/**
 * Reserve for a run of text in em: sum of per-char class widths. ASCII by the class table,
 * combining marks 0, East-Asian wide CJK_EM, other non-ASCII by case (see nonAsciiEm).
 */
export const textReserveEm = (str: string): number => {
  let em = 0;
  for (let i = 0; i < str.length; i++) {
    const unit: number = str.charCodeAt(i);
    if (unit < 128) {
      em += ASCII_EM[unit];
      continue;
    }
    const cp: number = str.codePointAt(i) ?? 0;
    if (cp > 0xFFFF) {
      i++; // consume the low surrogate; an astral char counts once
    }
    em += nonAsciiEm(cp);
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
  // These render as `<code>` in a monospace face, where the glyph-class estimate underreserves.
  if (token.type && MONO_TOKEN_TYPES.has(token.type)) {
    return monoCells(token.content ?? '') * MONO_EM;
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
