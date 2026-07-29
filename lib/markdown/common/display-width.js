"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenMarkerWidth = exports.textReserveEm = exports.isWideChar = void 0;
var tslib_1 = require("tslib");
var consts_1 = require("./consts");
var MATH_TOKEN_TYPES = new Set(consts_1.mathTokenTypes);
// Leaf tokens whose `content` is visible text (measured); others (e.g. `html_inline`, whose
// content is raw markup) contribute 0.
var TEXT_LIKE_TYPES = new Set(['text', 'code_inline', 'text_special']);
// Zero-width combining marks that fall inside the Katakana range below.
var isZeroWidthCombining = function (cp) { return cp === 0x3099 || cp === 0x309A; };
// Per-char text reserve in em by width class (safety margin over Helvetica advances).
var NARROW_RE = /[ !'"(),.\/:;|\[\]ijltfrI]/; // thin glyphs
var WIDE_RE = /[A-HJ-Zmw]/; // most capitals (except I) + m, w
var XWIDE_RE = /[W@%]/; // widest glyphs
var NARROW_EM = 0.40;
var NORMAL_EM = 0.62;
var WIDE_EM = 0.90;
var XWIDE_EM = 1.10;
var CJK_EM = 1.20; // East-Asian full-width glyph
/**
 * Whether a code point is an East-Asian Wide/Fullwidth character, which renders
 * roughly twice as wide as an ASCII character. Approximation of Unicode's East
 * Asian Width property covering the BMP ranges. Astral characters (emoji, CJK
 * Ext-B+) are out of range and count as width 1; the zero-width combining marks
 * U+3099/U+309A are excluded. Other combining marks are not special-cased (count 1).
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
/**
 * Reserve for a run of text in em: sum of per-char class widths. Combining marks U+3099/
 * U+309A count 0; East-Asian wide chars use CJK_EM; else narrow/normal/wide by class.
 */
var textReserveEm = function (str) {
    var e_1, _a;
    var _b;
    var em = 0;
    try {
        for (var str_1 = tslib_1.__values(str), str_1_1 = str_1.next(); !str_1_1.done; str_1_1 = str_1.next()) {
            var ch = str_1_1.value;
            var cp = (_b = ch.codePointAt(0)) !== null && _b !== void 0 ? _b : 0;
            if (isZeroWidthCombining(cp)) {
                continue;
            }
            if ((0, exports.isWideChar)(cp)) {
                em += CJK_EM;
            }
            else if (NARROW_RE.test(ch)) {
                em += NARROW_EM;
            }
            else if (XWIDE_RE.test(ch)) {
                em += XWIDE_EM;
            }
            else if (WIDE_RE.test(ch)) {
                em += WIDE_EM;
            }
            else {
                em += NORMAL_EM;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (str_1_1 && !str_1_1.done && (_a = str_1.return)) _a.call(str_1);
        }
        finally { if (e_1) throw e_1.error; }
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