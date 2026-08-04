"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenMarkerWidth = exports.textReserveEm = exports.isWideChar = void 0;
var consts_1 = require("./consts");
var MATH_TOKEN_TYPES = new Set(consts_1.mathTokenTypes);
// Leaf tokens whose `content` is visible text (measured); others (e.g. `html_inline`, whose
// content is raw markup) contribute 0.
// `code_inline` is absent on purpose: it is handled earlier, by the monospace branch.
var TEXT_LIKE_TYPES = new Set(['text', 'text_special']);
// Code points that add no advance: they render over the base glyph, join it, or select a variant.
var isZeroWidthChar = function (cp) {
    return (cp >= 0x0300 && cp <= 0x036F) || // Combining Diacritical Marks
        (cp >= 0x1AB0 && cp <= 0x1AFF) || // ... Extended
        (cp >= 0x200B && cp <= 0x200F) || // zero-width space/non-joiner/joiner, bidi marks
        (cp >= 0x20D0 && cp <= 0x20F0) || // ... for Symbols
        (cp >= 0xFE00 && cp <= 0xFE0F) || // Variation Selectors
        (cp >= 0xFE20 && cp <= 0xFE2F) || // Combining Half Marks (Vertical Forms sit between: wide)
        cp === 0x3099 || cp === 0x309A;
}; // Katakana voiced marks (inside the wide range below)
// Per-char reserve in em, over-estimating the widest glyph of each class against the bundled Arial
// fixture at 16px (`A` advances ~0.72em, takes 0.90). Lower bound pinned in _list-marker-padding.js.
// Thin glyphs; \t\r\n collapse to a single space when rendered, so they share the space's class.
var NARROW_RE = /[ \t\r\n!'"(),.\/:;|\[\]ijltfrI]/;
var WIDE_RE = /[A-HJ-Zmw]/; // most capitals (except I) + m, w
var XWIDE_RE = /[W@%]/; // widest glyphs
var NARROW_EM = 0.40;
var NORMAL_EM = 0.62;
var WIDE_EM = 0.90;
var XWIDE_EM = 1.10;
var CJK_EM = 1.20; // East-Asian full-width glyph
// Monospace advance, covering the faces `code` uses (Inconsolata 0.5em, DM Mono 0.6em).
// Equal to NORMAL_EM by coincidence, not derivation — the two move independently.
var MONO_EM = 0.62;
var MONO_TOKEN_TYPES = new Set(['code_inline', 'texttt']);
// ASCII fast path — those classes are ASCII-only. Built from the same regexes, so it can't drift.
var ASCII_EM = (function () {
    var widths = new Float64Array(128);
    for (var cp = 0; cp < 128; cp++) {
        var ch = String.fromCharCode(cp);
        // Controls render nothing (the whitespace ones are in NARROW_RE, which runs first).
        widths[cp] = !NARROW_RE.test(ch) && (cp < 0x20 || cp === 0x7F) ? 0
            : NARROW_RE.test(ch) ? NARROW_EM
                : XWIDE_RE.test(ch) ? XWIDE_EM
                    : WIDE_RE.test(ch) ? WIDE_EM
                        : NORMAL_EM;
    }
    return widths;
})();
/**
 * Whether a code point is an East-Asian Wide/Fullwidth character, which renders
 * roughly twice as wide as an ASCII character. Block-level approximation of Unicode's
 * East Asian Width property, over the BMP and the astral blocks that are Wide.
 * Zero-advance code points are excluded here and reserve 0 — see isZeroWidthChar.
 */
var isWideChar = function (cp) {
    return !isZeroWidthChar(cp) &&
        ((cp >= 0x1100 && cp <= 0x115F) || // Hangul Jamo
            (cp >= 0x2E80 && cp <= 0x303E) || // CJK radicals, Kangxi, CJK symbols/punctuation
            (cp >= 0x3041 && cp <= 0x33FF) || // Hiragana, Katakana, CJK symbols
            (cp >= 0x3400 && cp <= 0x4DBF) || // CJK Unified Ideographs Extension A
            (cp >= 0x4E00 && cp <= 0x9FFF) || // CJK Unified Ideographs
            (cp >= 0xA000 && cp <= 0xA4CF) || // Yi
            (cp >= 0xAC00 && cp <= 0xD7A3) || // Hangul Syllables
            (cp >= 0xF900 && cp <= 0xFAFF) || // CJK Compatibility Ideographs
            (cp >= 0xFE10 && cp <= 0xFE4F) || // Vertical Forms, CJK Compatibility Forms
            (cp >= 0xFF00 && cp <= 0xFF60) || // Fullwidth Forms
            (cp >= 0xFFE0 && cp <= 0xFFE6) || // Fullwidth signs
            (cp >= 0x16FE0 && cp <= 0x18D08) || // Ideographic Symbols, Tangut (+Supplement), Khitan
            (cp >= 0x1AFF0 && cp <= 0x1B2FF) || // Kana Extended-B, Kana Supplement/Extended-A, Nushu
            (cp >= 0x1F000 && cp <= 0x1F02F) || // Mahjong Tiles
            (cp >= 0x1F1E6 && cp <= 0x1F1FF) || // Regional Indicators
            (cp >= 0x1F200 && cp <= 0x1FAFF) || // Enclosed Ideographic Supplement, emoji pictographs
            (cp >= 0x20000 && cp <= 0x3FFFD));
}; // CJK Unified Ideographs Extension B–G
exports.isWideChar = isWideChar;
// The ASCII classes can't see these letters; uppercase runs widest (`Љ` is 1.06em in Arial).
var casedEmFor = function (cp) {
    var ch = String.fromCodePoint(cp);
    return ch !== ch.toLowerCase() && ch === ch.toUpperCase() ? XWIDE_EM : WIDE_EM;
};
// Only the case test allocates, so only it is worth caching — the wide and zero-width checks are
// range comparisons. One byte per code point over the dense range (0 = unseen), so the cache has a
// fixed size and needs no lifecycle owner; above it the class is computed per occurrence.
var CASED_CACHE_MAX = 0x3000;
var casedClass = new Uint8Array(CASED_CACHE_MAX);
// Reserve for one non-ASCII code point in em.
var nonAsciiEm = function (cp) {
    // A combining mark renders over the base glyph; a lone surrogate is broken input, not a glyph.
    if (isZeroWidthChar(cp) || (cp >= 0xD800 && cp <= 0xDFFF)) {
        return 0;
    }
    if ((0, exports.isWideChar)(cp)) {
        return CJK_EM;
    }
    if (cp >= CASED_CACHE_MAX) {
        return casedEmFor(cp);
    }
    var cls = casedClass[cp];
    if (cls === 0) {
        cls = casedEmFor(cp) === XWIDE_EM ? 1 : 2;
        casedClass[cp] = cls;
    }
    return cls === 1 ? XWIDE_EM : WIDE_EM;
};
// Monospace cells in a run: code points, not UTF-16 units, and combining marks take none.
var monoCells = function (str) {
    var _a;
    var cells = 0;
    for (var i = 0; i < str.length; i++) {
        var unit = str.charCodeAt(i);
        if (unit < 128) {
            cells++;
            continue;
        }
        var cp = (_a = str.codePointAt(i)) !== null && _a !== void 0 ? _a : 0;
        if (cp > 0xFFFF) {
            i++;
        }
        // A lone surrogate is broken input, not a glyph — same call as nonAsciiEm makes.
        if (cp >= 0xD800 && cp <= 0xDFFF) {
            continue;
        }
        if (!isZeroWidthChar(cp)) {
            // A wide glyph takes two cells in a monospace face.
            cells += (0, exports.isWideChar)(cp) ? 2 : 1;
        }
    }
    return cells;
};
/**
 * Reserve for a run of text in em: sum of per-char class widths. ASCII by the class table,
 * combining marks 0, East-Asian wide CJK_EM, other non-ASCII by case (see nonAsciiEm).
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
 * `code_inline`/`texttt` by monospace cells, wrappers (e.g. `\textbf{…}`) by recursing into
 * children, text-like leaves (`text` / `text_special`) by per-char class widths, everything
 * else (e.g. `html_inline`, whose content is markup) 0. The counterpart of `getTextWidthByTokens`
 * (font-based) — used where no font is loaded. Math without a `widthEx` (non-SVG output)
 * also contributes 0, so the marker keeps the default indent.
 */
var tokenMarkerWidth = function (token) {
    var _a, _b;
    if (typeof token.widthEx === 'number') {
        return token.widthEx * consts_1.EX_TO_EM;
    }
    // Math with no widthEx → 0 (don't measure content; that would be a fabricated estimate).
    if (token.type && MATH_TOKEN_TYPES.has(token.type)) {
        return 0;
    }
    // These render as `<code>` in a monospace face, where the glyph-class estimate underreserves.
    if (token.type && MONO_TOKEN_TYPES.has(token.type)) {
        return monoCells((_a = token.content) !== null && _a !== void 0 ? _a : '') * MONO_EM;
    }
    if (token.children && token.children.length) {
        var em = 0;
        for (var i = 0; i < token.children.length; i++) {
            em += (0, exports.tokenMarkerWidth)(token.children[i]);
        }
        return em;
    }
    if (token.type && TEXT_LIKE_TYPES.has(token.type)) {
        return (0, exports.textReserveEm)((_b = token.content) !== null && _b !== void 0 ? _b : '');
    }
    return 0;
};
exports.tokenMarkerWidth = tokenMarkerWidth;
//# sourceMappingURL=display-width.js.map