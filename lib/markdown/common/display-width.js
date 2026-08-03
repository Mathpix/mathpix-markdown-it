"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenMarkerWidth = exports.textReserveEm = exports.isWideChar = void 0;
var consts_1 = require("./consts");
var MATH_TOKEN_TYPES = new Set(consts_1.mathTokenTypes);
// Leaf tokens whose `content` is visible text (measured); others (e.g. `html_inline`, whose
// content is raw markup) contribute 0.
var TEXT_LIKE_TYPES = new Set(['text', 'code_inline', 'text_special']);
// Combining marks: they render over the base glyph, so they reserve nothing.
var isZeroWidthCombining = function (cp) {
    return (cp >= 0x0300 && cp <= 0x036F) || // Combining Diacritical Marks
        (cp >= 0x1AB0 && cp <= 0x1AFF) || // ... Extended
        (cp >= 0x20D0 && cp <= 0x20F0) || // ... for Symbols
        (cp >= 0xFE20 && cp <= 0xFE2F) || // Combining Half Marks
        cp === 0x3099 || cp === 0x309A;
}; // Katakana voiced marks (inside the wide range below)
// Per-char text reserve in em by width class (safety margin over Helvetica advances).
var NARROW_RE = /[ !'"(),.\/:;|\[\]ijltfrI]/; // thin glyphs
var WIDE_RE = /[A-HJ-Zmw]/; // most capitals (except I) + m, w
var XWIDE_RE = /[W@%]/; // widest glyphs
var NARROW_EM = 0.40;
var NORMAL_EM = 0.62;
var WIDE_EM = 0.90;
var XWIDE_EM = 1.10;
var CJK_EM = 1.20; // East-Asian full-width glyph
// ASCII fast path — those classes are ASCII-only. Built from the same regexes, so it can't drift.
var ASCII_EM = (function () {
    var widths = new Float64Array(128);
    for (var cp = 0; cp < 128; cp++) {
        var ch = String.fromCharCode(cp);
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
var isWideChar = function (cp) {
    return !isZeroWidthCombining(cp) &&
        ((cp >= 0x1100 && cp <= 0x115F) || // Hangul Jamo
            (cp >= 0x2E80 && cp <= 0x303E) || // CJK radicals, Kangxi, CJK symbols/punctuation
            (cp >= 0x3041 && cp <= 0x33FF) || // Hiragana, Katakana, CJK symbols
            (cp >= 0x3400 && cp <= 0x4DBF) || // CJK Unified Ideographs Extension A
            (cp >= 0x4E00 && cp <= 0x9FFF) || // CJK Unified Ideographs
            (cp >= 0xA000 && cp <= 0xA4CF) || // Yi
            (cp >= 0xAC00 && cp <= 0xD7A3) || // Hangul Syllables
            (cp >= 0xF900 && cp <= 0xFAFF) || // CJK Compatibility Ideographs
            (cp >= 0xFE30 && cp <= 0xFE4F) || // CJK Compatibility Forms
            (cp >= 0xFF00 && cp <= 0xFF60) || // Fullwidth Forms
            (cp >= 0xFFE0 && cp <= 0xFFE6));
}; // Fullwidth signs
exports.isWideChar = isWideChar;
// Width class of a non-ASCII code point. The ASCII classes can't see these letters, so split by
// case: uppercase runs widest (`Љ` is 1.06em in Arial), everything else fits the wide class.
var CLASS_EM = [0, 0, CJK_EM, XWIDE_EM, WIDE_EM];
var classifyNonAscii = function (cp) {
    if (isZeroWidthCombining(cp)) {
        return 1;
    }
    if ((0, exports.isWideChar)(cp)) {
        return 2;
    }
    var ch = String.fromCodePoint(cp);
    return ch !== ch.toLowerCase() && ch === ch.toUpperCase() ? 3 : 4;
};
// Cached per code point (the case test allocates, and markers repeat characters) in a fixed
// 64 KB table rather than a growing Map; allocated on the first non-ASCII char measured.
var bmpClass = null;
var nonAsciiEm = function (cp) {
    if (cp > 0xFFFF) {
        return CLASS_EM[classifyNonAscii(cp)];
    }
    if (!bmpClass) {
        bmpClass = new Uint8Array(0x10000);
    }
    var cls = bmpClass[cp];
    if (cls === 0) {
        cls = classifyNonAscii(cp);
        bmpClass[cp] = cls;
    }
    return CLASS_EM[cls];
};
/**
 * Reserve for a run of text in em: sum of per-char class widths. ASCII by the class table,
 * combining marks 0, East-Asian wide CJK_EM, other non-ASCII by case (see classifyNonAscii).
 */
var textReserveEm = function (str) {
    var _a;
    var em = 0;
    for (var i = 0; i < str.length; i++) {
        var unit = str.charCodeAt(i);
        if (unit < 128) {
            em += ASCII_EM[unit];
            continue;
        }
        var cp = (_a = str.codePointAt(i)) !== null && _a !== void 0 ? _a : 0;
        if (cp > 0xFFFF) {
            i++; // consume the low surrogate; an astral char counts once
        }
        em += nonAsciiEm(cp);
    }
    return em;
};
exports.textReserveEm = textReserveEm;
/**
 * Width of one inline marker token in em: math by its rendered `widthEx` (converted to em),
 * wrappers (e.g. `\textbf{…}`) by recursing into children, text-like leaves (`text` /
 * `code_inline` / `text_special`) by per-char class widths, everything else (e.g.
 * `html_inline`, whose content is markup) 0. The counterpart of `getTextWidthByTokens`
 * (font-based) — used where no font is loaded. Math without a `widthEx` (non-SVG output)
 * also contributes 0, so the marker keeps the default indent.
 */
var tokenMarkerWidth = function (token) {
    var _a;
    if (typeof token.widthEx === 'number') {
        return token.widthEx * consts_1.EX_TO_EM;
    }
    // Math with no widthEx → 0 (don't measure content; that would be a fabricated estimate).
    if (token.type && MATH_TOKEN_TYPES.has(token.type)) {
        return 0;
    }
    if (token.children && token.children.length) {
        var em = 0;
        for (var i = 0; i < token.children.length; i++) {
            em += (0, exports.tokenMarkerWidth)(token.children[i]);
        }
        return em;
    }
    if (token.type && TEXT_LIKE_TYPES.has(token.type)) {
        return (0, exports.textReserveEm)((_a = token.content) !== null && _a !== void 0 ? _a : '');
    }
    return 0;
};
exports.tokenMarkerWidth = tokenMarkerWidth;
//# sourceMappingURL=display-width.js.map