// Math tokens carry advance width as `token.widthEx` (see convert-math-to-html).
// `ex` is ~½ em, so ~2 ex ≈ one character cell.
const MATH_EX_PER_CHAR = 2;

/**
 * Whether a code point is an East-Asian Wide/Fullwidth character, which renders
 * roughly twice as wide as an ASCII character. Approximation of Unicode's East
 * Asian Width property covering the BMP ranges. Astral characters (emoji, CJK
 * Ext-B+) are out of range and count as width 1.
 */
export const isWideChar = (cp: number): boolean =>
  (cp >= 0x1100 && cp <= 0x115F) ||   // Hangul Jamo
  (cp >= 0x2E80 && cp <= 0x303E) ||   // CJK radicals, Kangxi, CJK symbols/punctuation
  (cp >= 0x3041 && cp <= 0x33FF) ||   // Hiragana, Katakana, CJK symbols
  (cp >= 0x3400 && cp <= 0x4DBF) ||   // CJK Unified Ideographs Extension A
  (cp >= 0x4E00 && cp <= 0x9FFF) ||   // CJK Unified Ideographs
  (cp >= 0xA000 && cp <= 0xA4CF) ||   // Yi
  (cp >= 0xAC00 && cp <= 0xD7A3) ||   // Hangul Syllables
  (cp >= 0xF900 && cp <= 0xFAFF) ||   // CJK Compatibility Ideographs
  (cp >= 0xFE30 && cp <= 0xFE4F) ||   // CJK Compatibility Forms
  (cp >= 0xFF00 && cp <= 0xFF60) ||   // Fullwidth Forms
  (cp >= 0xFFE0 && cp <= 0xFFE6);     // Fullwidth signs

/**
 * Display width of a string in character cells: East-Asian Wide/Fullwidth
 * characters count as 2, everything else as 1. Iterates by code point so
 * surrogate pairs count once.
 */
export const displayWidth = (str: string): number => {
  let width = 0;
  for (const ch of str) {
    width += isWideChar(ch.codePointAt(0)) ? 2 : 1;
  }
  return width;
};

/**
 * Width of one inline token in character cells: text by display width, math by its
 * rendered `widthEx`, wrappers (e.g. `\textbf{…}`) by recursing into children. The
 * char-based counterpart of `getTextWidthByTokens` (font-based) — used where no font
 * is loaded (`fontMetrics` runs only under markdownToHTMLWithSize).
 */
export const tokenDisplayWidth = (token: any): number => {
  if (token.type === 'text') {
    return displayWidth(token.content);
  }
  if (typeof token.widthEx === 'number') {
    return token.widthEx / MATH_EX_PER_CHAR;
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
