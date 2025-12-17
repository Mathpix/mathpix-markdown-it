"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAttributes = void 0;
var tslib_1 = require("tslib");
/**
 * Parse a comma-separated attribute string into an object.
 *
 * Examples:
 *   "language=JavaScript, mathescape"
 *     → { language: "JavaScript", mathescape: true }
 *
 * - Attributes are split by commas.
 * - Each attribute may be "key=value" or just "key" (interpreted as `true`).
 * - Whitespace around keys/values is trimmed.
 */
var parseAttributes = function (str) {
    var result = {};
    try {
        str.split(",").forEach(function (pair) {
            var _a = tslib_1.__read(pair.split("=").map(function (s) { return s.trim(); }), 2), key = _a[0], value = _a[1];
            // no explicit value -> treat as boolean flag = true
            if (!value) {
                result[key] = true;
                return;
            }
            var lower = value.toLowerCase();
            if (lower === "true") {
                result[key] = true;
            }
            else if (lower === "false") {
                result[key] = false;
            }
            else {
                result[key] = value;
            }
        });
        return result;
    }
    catch (err) {
        console.error("[ERROR]=>[parseAttributes]=>", err);
        return result;
    }
};
exports.parseAttributes = parseAttributes;
//# sourceMappingURL=parse-attribures.js.map