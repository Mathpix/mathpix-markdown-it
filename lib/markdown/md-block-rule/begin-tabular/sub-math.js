"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubMath = exports.getMathTableContent = exports.mathTablePush = exports.ClearSubMathLists = void 0;
var common_1 = require("./common");
var mdPluginRaw_1 = require("../../mdPluginRaw");
var utils_1 = require("../../utils");
var math_spans_1 = require("../../common/math-spans");
var sub_code_1 = require("./sub-code");
var consts_1 = require("../../common/consts");
// Openers, end markers and the `$` guards come from common/math-spans: the list guard reads the same
// ones, and a second copy is what makes two readers of one construct disagree.
var mathTable = new Map();
var ClearSubMathLists = function () {
    mathTable.clear();
};
exports.ClearSubMathLists = ClearSubMathLists;
var mathTablePush = function (idOrItem, content) {
    if (typeof idOrItem === 'string') {
        mathTable.set(idOrItem, content);
    }
    else {
        mathTable.set(idOrItem.id, idOrItem.content);
    }
};
exports.mathTablePush = mathTablePush;
/** Replace UUID placeholders with original math content.
 *  Uses trimmed string for regex matching (consistent with getSubMath),
 *  but untrimmed sub for slicing to preserve original whitespace. */
var getMathTableContent = function (sub, i) {
    var tail = sub.trim().slice(i);
    var cellM = tail.match(consts_1.doubleCurlyBracketUuidPattern);
    cellM = cellM ? cellM : tail.match(consts_1.singleCurlyBracketPattern);
    if (!cellM) {
        return '';
    }
    var parts = [];
    var lastIdx = 0;
    for (var j = 0; j < cellM.length; j++) {
        var id = cellM[j].replace(/\{/g, '').replace(/\}/g, '');
        var mathContent = mathTable.get(id);
        if (mathContent !== undefined) {
            var iB = sub.indexOf(cellM[j], lastIdx);
            if (iB >= 0) {
                parts.push(sub.slice(lastIdx, iB));
                parts.push(mathContent);
                lastIdx = iB + cellM[j].length;
            }
        }
    }
    if (parts.length === 0) {
        return (0, common_1.getContent)(sub);
    }
    parts.push(sub.slice(lastIdx));
    return (0, common_1.getContent)(parts.join(''));
};
exports.getMathTableContent = getMathTableContent;
/**
 * Extract math expressions from a string, replacing them with placeholders.
 * Iterative single-pass: scans the original string once, collects non-math
 * segments and placeholders into an array, joins at the end.
 *
 * `startPos` is a seek offset applied via `re.lastIndex` before scanning.
 */
var getSubMath = function (str, startPos) {
    var _a;
    if (startPos === void 0) { startPos = 0; }
    var re = math_spans_1.RE_MATH_OPEN_G;
    re.lastIndex = startPos > 0 ? startPos : 0;
    var parts = [];
    var lastCopied = 0;
    var match;
    while ((match = re.exec(str)) !== null) {
        var beginMarkerPos = match.index;
        var startMathPos = beginMarkerPos + match[0].length;
        var envGroup = match[1];
        var endMarker = (0, math_spans_1.getEndMarker)(match[0], envGroup, match[2], match[3]);
        var endMarkerPos = -1;
        if (endMarker === null) {
            endMarkerPos = startMathPos;
            endMarker = '';
        }
        else if (endMarker === undefined) {
            if (envGroup && envGroup !== 'abstract' && envGroup !== 'tabular') {
                var environment = envGroup.trim();
                var openTag = (0, utils_1.beginTag)(environment, true);
                var closeTag = (0, utils_1.endTag)(environment, true);
                if (closeTag && openTag) {
                    var data = (0, utils_1.findOpenCloseTagsMathEnvironment)(str.slice(beginMarkerPos), openTag, closeTag);
                    var lastClose = ((_a = data === null || data === void 0 ? void 0 : data.arrClose) === null || _a === void 0 ? void 0 : _a.length) ? data.arrClose[data.arrClose.length - 1] : null;
                    if (lastClose && typeof lastClose.posStart === 'number') {
                        endMarkerPos = beginMarkerPos + lastClose.posStart;
                    }
                    endMarker = "\\end{".concat(envGroup, "}");
                }
            }
            if (endMarker === undefined) {
                continue;
            }
        }
        if (endMarkerPos === -1) {
            endMarkerPos = (0, mdPluginRaw_1.findEndMarkerPos)(str, endMarker, startMathPos);
        }
        if (endMarkerPos === -1) {
            re.lastIndex = startMathPos;
            continue;
        }
        if (match[0] === "$" || match[0] === "$$") {
            if ((0, math_spans_1.shouldSkipDollar)(str, match[0], beginMarkerPos, endMarkerPos)) {
                re.lastIndex = startMathPos;
                continue;
            }
        }
        var nextPos = endMarkerPos + endMarker.length;
        var content = str.slice(beginMarkerPos, nextPos);
        var id = (0, common_1.generateUniqueId)();
        var isCodeEnv = !!(envGroup && consts_1.LATEX_BLOCK_ENV.has(envGroup));
        if (isCodeEnv) {
            (0, sub_code_1.addExtractedCodeBlock)({ id: id, content: content });
        }
        else {
            (0, exports.mathTablePush)(id, content);
        }
        var placeholder = isCodeEnv ? "<<".concat(id, ">>") : "{".concat(id, "}");
        parts.push(str.slice(lastCopied, beginMarkerPos));
        parts.push(placeholder);
        lastCopied = nextPos;
        re.lastIndex = nextPos;
    }
    if (parts.length === 0) {
        return str;
    }
    parts.push(str.slice(lastCopied));
    return parts.join('');
};
exports.getSubMath = getSubMath;
//# sourceMappingURL=sub-math.js.map