"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnumeratePlainMarker = exports.getItemizePlainMarker = exports.enumerateLevelDefaults = exports.itemizeLevelDefaults = exports.itemizeLevelPlainDefaults = void 0;
var tslib_1 = require("tslib");
/** Plain-text fallback markers for itemize levels 1..N (TSV/CSV/MD). */
exports.itemizeLevelPlainDefaults = [
    '•',
    '–',
    '*',
    '·', // level 4
];
/** Default LaTeX itemize bullet styles */
exports.itemizeLevelDefaults = [
    "\\textbullet",
    "\\textendash",
    "\\textasteriskcentered",
    "\\textperiodcentered", //"·"
];
/** Default enumerate styles for CSS list-style-type */
exports.enumerateLevelDefaults = [
    'decimal',
    'lower-alpha',
    'lower-roman',
    'upper-alpha',
];
/**
 * Returns a plain-text list marker for a given itemize nesting level.
 * Ensures the level is at least 1 and clamps it to the available defaults.
 *
 * @param level - Itemize nesting level (1-based).
 * @returns Plain-text marker suitable for TSV/CSV/Markdown export.
 */
var getItemizePlainMarker = function (level) {
    var safeLevel = Math.max(1, level);
    var idx = Math.min(safeLevel - 1, exports.itemizeLevelPlainDefaults.length - 1);
    return exports.itemizeLevelPlainDefaults[idx];
};
exports.getItemizePlainMarker = getItemizePlainMarker;
/**
 * Converts a 1-based index to an Excel-like alphabetic label (a..z, aa..zz, ...).
 *
 * @param n - 1-based index (values <= 0 are treated as 1).
 * @param upper - If true, returns uppercase letters.
 * @returns Alphabetic label for the given index.
 */
var toAlpha = function (n, upper) {
    var x = Math.max(1, n);
    var label = '';
    var baseCharCode = upper ? 65 : 97; // 'A' or 'a'
    while (x > 0) {
        x -= 1;
        label = String.fromCharCode(baseCharCode + (x % 26)) + label;
        x = Math.floor(x / 26);
    }
    return label;
};
/**
 * Converts a 1-based index to a Roman numeral string.
 *
 * @param n - 1-based index (values <= 0 are treated as 1).
 * @param upper - If true, returns uppercase numerals.
 * @returns Roman numeral representation of the given index.
 */
var toRoman = function (n, upper) {
    var e_1, _a;
    var x = Math.max(1, n);
    var romanMap = [
        [1000, 'm'], [900, 'cm'], [500, 'd'], [400, 'cd'],
        [100, 'c'], [90, 'xc'], [50, 'l'], [40, 'xl'],
        [10, 'x'], [9, 'ix'], [5, 'v'], [4, 'iv'], [1, 'i'],
    ];
    var res = '';
    try {
        for (var romanMap_1 = tslib_1.__values(romanMap), romanMap_1_1 = romanMap_1.next(); !romanMap_1_1.done; romanMap_1_1 = romanMap_1.next()) {
            var _b = tslib_1.__read(romanMap_1_1.value, 2), value = _b[0], symbol = _b[1];
            while (x >= value) {
                res += symbol;
                x -= value;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (romanMap_1_1 && !romanMap_1_1.done && (_a = romanMap_1.return)) _a.call(romanMap_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return upper ? res.toUpperCase() : res;
};
/**
 * Resolves the enumerate marker style for a given nesting level.
 * Falls back to the first default ("decimal") for invalid levels or levels beyond configured defaults.
 *
 * @param level - Enumerate nesting level (1-based).
 * @returns CSS-like enumerate style name (e.g. "decimal", "lower-alpha").
 */
var getEnumerateStyle = function (level) {
    var safeLevel = Number.isFinite(level) ? Math.max(1, level) : 1;
    if (safeLevel > exports.enumerateLevelDefaults.length) {
        return exports.enumerateLevelDefaults[0]; // "decimal"
    }
    return exports.enumerateLevelDefaults[safeLevel - 1];
};
/**
 * Returns a plain-text enumerate marker for the given item index and nesting level,
 * using `enumerateLevelDefaults` to pick the style (decimal/alpha/roman).
 *
 * Examples:
 * - level 1 (decimal): 1.
 * - level 2 (lower-alpha): a.
 * - level 3 (lower-roman): i.
 * - level 4 (upper-alpha): A.
 */
var getEnumeratePlainMarker = function (enumerateIndex, level) {
    var style = getEnumerateStyle(level);
    var index = Math.max(1, enumerateIndex);
    switch (style) {
        case 'decimal':
            return "".concat(index, ".");
        case 'lower-alpha':
            return "".concat(toAlpha(index, false), ".");
        case 'upper-alpha':
            return "".concat(toAlpha(index, true), ".");
        case 'lower-roman':
            return "".concat(toRoman(index, false), ".");
        case 'upper-roman':
            return "".concat(toRoman(index, true), ".");
        default:
            return "".concat(index, ".");
    }
};
exports.getEnumeratePlainMarker = getEnumeratePlainMarker;
//# sourceMappingURL=list-markers.js.map