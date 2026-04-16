"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubMath = exports.getMathTableContent = exports.mathTablePush = exports.ClearSubMathLists = void 0;
var common_1 = require("./common");
var mdPluginRaw_1 = require("../../mdPluginRaw");
var utils_1 = require("../../utils");
var sub_code_1 = require("./sub-code");
var consts_1 = require("../../common/consts");
/** Regex to find math opening markers. Uses global flag for iterative scanning. */
var RE_MATH_OPEN = /\\\\\[|\\\[|\\\\\(|\\\(|\$\$|\$|\\begin\{([^}]*)\}|eqref\{([^}]*)\}|ref\{([^}]*)\}/g;
var mathTable = new Map();
var ClearSubMathLists = function () {
    mathTable = new Map();
};
exports.ClearSubMathLists = ClearSubMathLists;
var mathTablePush = function (item) {
    mathTable.set(item.id, item.content);
};
exports.mathTablePush = mathTablePush;
var getMathTableContent = function (sub, i) {
    var resContent = sub;
    sub = sub.trim();
    var cellM = sub.slice(i).match(consts_1.doubleCurlyBracketUuidPattern);
    cellM = cellM ? cellM : sub.slice(i).match(consts_1.singleCurlyBracketPattern);
    if (!cellM) {
        return '';
    }
    for (var j = 0; j < cellM.length; j++) {
        var content = cellM[j].replace(/\{/g, '').replace(/\}/g, '');
        var mathContent = mathTable.get(content);
        if (mathContent !== undefined) {
            var iB = resContent.indexOf(cellM[j]);
            if (iB >= 0) {
                resContent = resContent.slice(0, iB) + mathContent + resContent.slice(iB + cellM[j].length);
            }
        }
    }
    resContent = (0, common_1.getContent)(resContent);
    return resContent;
};
exports.getMathTableContent = getMathTableContent;
/** Determine the end marker string for a matched opening marker. */
var getEndMarker = function (match) {
    var m = match[0];
    if (m === "\\\\[") {
        return "\\\\]";
    }
    if (m === "\\[") {
        return "\\]";
    }
    if (m === "\\\\(") {
        return "\\\\)";
    }
    if (m === "\\(") {
        return "\\)";
    }
    if (m.includes("eqref") || m.includes("ref")) {
        return "";
    }
    if (m === "$$") {
        return "$$";
    }
    if (m === "$") {
        return "$";
    }
    return undefined;
};
/** Check if a $ or $$ match should be skipped (escaped, whitespace-padded, before digit). */
var shouldSkipDollar = function (str, marker, beginMarkerPos, endMarkerPos) {
    var beforeEnd = str.charCodeAt(endMarkerPos - 1);
    // Escaped marker: \$ or \$$
    if (beforeEnd === 0x5c /* \ */ ||
        (beginMarkerPos > 0 && str.charCodeAt(beginMarkerPos - 1) === 0x5c /* \ */)) {
        return true;
    }
    if (marker === "$") {
        var afterStart = str.charCodeAt(beginMarkerPos + 1);
        // Whitespace inside: $ x$ or $x $
        if (beforeEnd === 0x20 || beforeEnd === 0x09 || beforeEnd === 0x0a ||
            afterStart === 0x20 || afterStart === 0x09 || afterStart === 0x0a) {
            return true;
        }
    }
    // Digit after closing marker: $5, $10
    var suffix = str.charCodeAt(endMarkerPos + 1);
    if (suffix >= 0x30 && suffix < 0x3a) {
        return true;
    }
    return false;
};
/**
 * Extract math expressions from a string, replacing them with placeholders.
 * Iterative single-pass implementation: scans the original string once,
 * collects non-math segments and placeholders into an array, joins at the end.
 * Avoids O(N × M) string rebuilds from the recursive version.
 */
var getSubMath = function (str) {
    var _a, _b;
    RE_MATH_OPEN.lastIndex = 0;
    var parts = [];
    var lastCopied = 0;
    var match;
    while ((match = RE_MATH_OPEN.exec(str)) !== null) {
        var beginMarkerPos = match.index;
        var startMathPos = beginMarkerPos + match[0].length;
        // Determine end marker
        var endMarker = getEndMarker(match);
        var endMarkerPos = -1;
        // \begin{env} — find matching \end{env} via balanced tag search
        if (endMarker === undefined) {
            if (match[1] && match[1] !== 'abstract' && match[1] !== 'tabular') {
                var environment = match[1].trim();
                var openTag = (0, utils_1.beginTag)(environment, true);
                var closeTag = (0, utils_1.endTag)(environment, true);
                if (closeTag && openTag) {
                    var data = (0, utils_1.findOpenCloseTagsMathEnvironment)(str.slice(beginMarkerPos), openTag, closeTag);
                    if ((_a = data === null || data === void 0 ? void 0 : data.arrClose) === null || _a === void 0 ? void 0 : _a.length) {
                        endMarkerPos = beginMarkerPos + ((_b = data.arrClose[data.arrClose.length - 1]) === null || _b === void 0 ? void 0 : _b.posStart);
                    }
                    endMarker = "\\end{".concat(match[1], "}");
                }
            }
            if (endMarker === undefined) {
                // Unrecognized \begin{abstract} or \begin{tabular} — skip
                continue;
            }
        }
        // Find end marker position
        if (endMarkerPos === -1) {
            endMarkerPos = (0, mdPluginRaw_1.findEndMarkerPos)(str, endMarker, startMathPos);
        }
        if (endMarkerPos === -1) {
            // End marker not found — skip this opener, continue scanning
            RE_MATH_OPEN.lastIndex = startMathPos;
            continue;
        }
        // Dollar-sign specific validation
        if (match[0] === "$" || match[0] === "$$") {
            if (shouldSkipDollar(str, match[0], beginMarkerPos, endMarkerPos)) {
                RE_MATH_OPEN.lastIndex = startMathPos;
                continue;
            }
        }
        // Valid math expression found — extract and replace with placeholder
        var nextPos = endMarkerPos + endMarker.length;
        var content = str.slice(beginMarkerPos, nextPos);
        var id = (0, common_1.generateUniqueId)();
        var isCodeEnv = !!(match[1] && consts_1.LATEX_BLOCK_ENV.has(match[1]));
        if (isCodeEnv) {
            (0, sub_code_1.addExtractedCodeBlock)({ id: id, content: content });
        }
        else {
            mathTable.set(id, content);
        }
        var placeholder = isCodeEnv ? "<<".concat(id, ">>") : "{".concat(id, "}");
        // Collect: text before this match + placeholder
        parts.push(str.slice(lastCopied, beginMarkerPos));
        parts.push(placeholder);
        lastCopied = nextPos;
        // Continue scanning after the replacement (placeholder is shorter than
        // the original content, but we scan the original string — set lastIndex
        // past the consumed region so we don't re-match inside it).
        RE_MATH_OPEN.lastIndex = nextPos;
    }
    // Fast path: no matches found — return original string unchanged
    if (parts.length === 0) {
        return str;
    }
    // Collect remaining text after the last match
    parts.push(str.slice(lastCopied));
    return parts.join('');
};
exports.getSubMath = getSubMath;
//# sourceMappingURL=sub-math.js.map