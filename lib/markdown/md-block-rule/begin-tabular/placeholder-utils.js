"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapWithNewlinesIfInline = exports.getInlineContextAroundSpan = exports.getNextNonSpaceChar = exports.getPrevNonSpaceChar = exports.placeholderToId = exports.findPlaceholders = exports.isNewlineChar = void 0;
var consts_1 = require("../../common/consts");
var isNewlineChar = function (ch) { return ch === "\n" || ch === "\r"; };
exports.isNewlineChar = isNewlineChar;
var findPlaceholders = function (s, from) {
    if (from === void 0) { from = 0; }
    var m = s.slice(from).match(consts_1.doubleAngleBracketUuidPattern);
    if (!m) {
        m = s.slice(from).match(consts_1.singleAngleBracketPattern);
    }
    return m;
};
exports.findPlaceholders = findPlaceholders;
var placeholderToId = function (placeholder) {
    return placeholder.replace(/</g, "").replace(/>/g, "");
};
exports.placeholderToId = placeholderToId;
var getPrevNonSpaceChar = function (s, idx) {
    for (var k = idx; k >= 0; k--) {
        var ch = s[k];
        if (ch !== " " && ch !== "\t") {
            return ch;
        }
    }
    return null;
};
exports.getPrevNonSpaceChar = getPrevNonSpaceChar;
var getNextNonSpaceChar = function (s, idx) {
    for (var k = idx; k < s.length; k++) {
        var ch = s[k];
        if (ch !== " " && ch !== "\t") {
            return ch;
        }
    }
    return null;
};
exports.getNextNonSpaceChar = getNextNonSpaceChar;
/**
 * Returns non-whitespace neighbors around [start,end) span of a placeholder.
 * Useful to decide whether injected "block-ish" content must be surrounded by newlines.
 */
var getInlineContextAroundSpan = function (s, start, end) {
    var beforeNonSpace = (0, exports.getPrevNonSpaceChar)(s, start - 1);
    var afterNonSpace = (0, exports.getNextNonSpaceChar)(s, end);
    return { beforeNonSpace: beforeNonSpace, afterNonSpace: afterNonSpace };
};
exports.getInlineContextAroundSpan = getInlineContextAroundSpan;
/**
 * Wraps injected content with leading/trailing '\n' if:
 *  - injected matches `blockRe`, AND
 *  - placeholder is embedded inline (neighbors are not newlines),
 *  - and injected isn't already newline-wrapped on that side.
 *
 * Note: `blockRe` might be BEGIN_LIST_ENV_INLINE_RE (strict) or BLOCK_LATEX_RE (broader).
 */
var wrapWithNewlinesIfInline = function (injected, beforeNonSpace, afterNonSpace) {
    if (!injected) {
        return injected;
    }
    consts_1.BLOCK_LATEX_RE.lastIndex = 0;
    if (!consts_1.BLOCK_LATEX_RE.test(injected)) {
        return injected;
    }
    var out = injected;
    var needLeading = beforeNonSpace != null && !(0, exports.isNewlineChar)(beforeNonSpace) && !out.startsWith("\n");
    var needTrailing = afterNonSpace != null && !(0, exports.isNewlineChar)(afterNonSpace) && !out.endsWith("\n");
    if (needLeading)
        out = "\n" + out;
    if (needTrailing)
        out = out + "\n";
    return out;
};
exports.wrapWithNewlinesIfInline = wrapWithNewlinesIfInline;
//# sourceMappingURL=placeholder-utils.js.map