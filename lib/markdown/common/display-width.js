"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenDisplayWidth = exports.displayWidth = exports.isWideChar = void 0;
var tslib_1 = require("tslib");
var consts_1 = require("./consts");
// Marker widths are measured in `ex` (math by exact `widthEx`, text ~1.3 ex/char — a glyph
// is ~1 ex). The producer converts the total to `em` for the emitted padding (EX_TO_EM).
var TEXT_EX_PER_CELL = 1.3;
var MATH_TOKEN_TYPES = new Set(consts_1.mathTokenTypes);
/**
 * Whether a code point is an East-Asian Wide/Fullwidth character, which renders
 * roughly twice as wide as an ASCII character. Approximation of Unicode's East
 * Asian Width property covering the BMP ranges. Astral characters (emoji, CJK
 * Ext-B+) are out of range and count as width 1.
 */
var isWideChar = function (cp) {
    return (cp >= 0x1100 && cp <= 0x115F) || // Hangul Jamo
        (cp >= 0x2E80 && cp <= 0x303E) || // CJK radicals, Kangxi, CJK symbols/punctuation
        (cp >= 0x3041 && cp <= 0x33FF) || // Hiragana, Katakana, CJK symbols
        (cp >= 0x3400 && cp <= 0x4DBF) || // CJK Unified Ideographs Extension A
        (cp >= 0x4E00 && cp <= 0x9FFF) || // CJK Unified Ideographs
        (cp >= 0xA000 && cp <= 0xA4CF) || // Yi
        (cp >= 0xAC00 && cp <= 0xD7A3) || // Hangul Syllables
        (cp >= 0xF900 && cp <= 0xFAFF) || // CJK Compatibility Ideographs
        (cp >= 0xFE30 && cp <= 0xFE4F) || // CJK Compatibility Forms
        (cp >= 0xFF00 && cp <= 0xFF60) || // Fullwidth Forms
        (cp >= 0xFFE0 && cp <= 0xFFE6);
}; // Fullwidth signs
exports.isWideChar = isWideChar;
/**
 * Display width of a string in character cells: East-Asian Wide/Fullwidth
 * characters count as 2, everything else as 1. Iterates by code point so
 * surrogate pairs count once.
 */
var displayWidth = function (str) {
    var e_1, _a;
    var _b;
    var width = 0;
    try {
        for (var str_1 = tslib_1.__values(str), str_1_1 = str_1.next(); !str_1_1.done; str_1_1 = str_1.next()) {
            var ch = str_1_1.value;
            width += (0, exports.isWideChar)((_b = ch.codePointAt(0)) !== null && _b !== void 0 ? _b : 0) ? 2 : 1;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (str_1_1 && !str_1_1.done && (_a = str_1.return)) _a.call(str_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return width;
};
exports.displayWidth = displayWidth;
/**
 * Width of one inline token in `ex`: text by display width × TEXT_EX_PER_CELL, math by its
 * exact rendered `widthEx`, wrappers (e.g. `\textbf{…}`) by recursing into children. The
 * char-based counterpart of `getTextWidthByTokens` (font-based) — used where no font is
 * loaded (`fontMetrics` runs only under markdownToHTMLWithSize). Math without a `widthEx`
 * (non-SVG output) returns 0: no measured width, so the marker keeps the default indent
 * rather than a fabricated estimate.
 */
var tokenDisplayWidth = function (token) {
    var _a;
    if (token.type === 'text') {
        return (0, exports.displayWidth)((_a = token.content) !== null && _a !== void 0 ? _a : '') * TEXT_EX_PER_CELL;
    }
    if (typeof token.widthEx === 'number') {
        return token.widthEx;
    }
    // Math with no widthEx → 0 (don't recurse children; that branch is for wrappers).
    if (token.type && MATH_TOKEN_TYPES.has(token.type)) {
        return 0;
    }
    if (token.children && token.children.length) {
        var width = 0;
        for (var i = 0; i < token.children.length; i++) {
            width += (0, exports.tokenDisplayWidth)(token.children[i]);
        }
        return width;
    }
    return 0;
};
exports.tokenDisplayWidth = tokenDisplayWidth;
//# sourceMappingURL=display-width.js.map