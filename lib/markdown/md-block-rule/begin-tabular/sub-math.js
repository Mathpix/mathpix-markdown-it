"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubMath = exports.getMathTableContent = exports.mathTablePush = exports.ClearSubMathLists = void 0;
var common_1 = require("./common");
var mdPluginRaw_1 = require("../../mdPluginRaw");
var utils_1 = require("../../utils");
var sub_code_1 = require("./sub-code");
var consts_1 = require("../../common/consts");
var RE_MATH_OPEN = /\\\\\[|\\\[|\\\\\(|\\\(|\$\$|\$|\\begin\{([^}]*)\}|eqref\{([^}]*)\}|ref\{([^}]*)\}/g;
var mathTable = new Map();
var ClearSubMathLists = function () {
    mathTable.clear();
};
exports.ClearSubMathLists = ClearSubMathLists;
var mathTablePush = function (id, content) {
    mathTable.set(id, content);
};
exports.mathTablePush = mathTablePush;
var getMathTableContent = function (sub, i) {
    var trimmed = sub.trim();
    var cellM = trimmed.slice(i).match(consts_1.doubleCurlyBracketUuidPattern);
    cellM = cellM ? cellM : trimmed.slice(i).match(consts_1.singleCurlyBracketPattern);
    if (!cellM) {
        return '';
    }
    var parts = [];
    var lastIdx = 0;
    var resContent = sub;
    for (var j = 0; j < cellM.length; j++) {
        var id = cellM[j].replace(/\{/g, '').replace(/\}/g, '');
        var mathContent = mathTable.get(id);
        if (mathContent !== undefined) {
            var iB = resContent.indexOf(cellM[j], lastIdx);
            if (iB >= 0) {
                parts.push(resContent.slice(lastIdx, iB));
                parts.push(mathContent);
                lastIdx = iB + cellM[j].length;
            }
        }
    }
    if (parts.length === 0) {
        return (0, common_1.getContent)(resContent);
    }
    parts.push(resContent.slice(lastIdx));
    return (0, common_1.getContent)(parts.join(''));
};
exports.getMathTableContent = getMathTableContent;
var getEndMarker = function (matchStr, envGroup, eqrefGroup, refGroup) {
    if (matchStr === "\\\\[") {
        return "\\\\]";
    }
    if (matchStr === "\\[") {
        return "\\]";
    }
    if (matchStr === "\\\\(") {
        return "\\\\)";
    }
    if (matchStr === "\\(") {
        return "\\)";
    }
    if (eqrefGroup !== undefined || refGroup !== undefined) {
        return "";
    }
    if (matchStr === "$$") {
        return "$$";
    }
    if (matchStr === "$") {
        return "$";
    }
    return undefined;
};
var shouldSkipDollar = function (str, marker, beginMarkerPos, endMarkerPos) {
    var beforeEnd = str.charCodeAt(endMarkerPos - 1);
    if (beforeEnd === 0x5c ||
        (beginMarkerPos > 0 && str.charCodeAt(beginMarkerPos - 1) === 0x5c)) {
        return true;
    }
    if (marker === "$") {
        var afterStart = str.charCodeAt(beginMarkerPos + 1);
        if (beforeEnd === 0x20 || beforeEnd === 0x09 || beforeEnd === 0x0a ||
            afterStart === 0x20 || afterStart === 0x09 || afterStart === 0x0a) {
            return true;
        }
    }
    var suffix = str.charCodeAt(endMarkerPos + 1);
    if (suffix >= 0x30 && suffix < 0x3a) {
        return true;
    }
    return false;
};
/**
 * Extract math expressions from a string, replacing them with placeholders.
 * Iterative single-pass: scans the original string once with a local RegExp,
 * collects non-math segments and placeholders into an array, joins at the end.
 */
var getSubMath = function (str) {
    var _a, _b;
    var re = new RegExp(RE_MATH_OPEN.source, 'g');
    var parts = [];
    var lastCopied = 0;
    var match;
    while ((match = re.exec(str)) !== null) {
        var beginMarkerPos = match.index;
        var startMathPos = beginMarkerPos + match[0].length;
        var envGroup = match[1];
        var endMarker = getEndMarker(match[0], envGroup, match[2], match[3]);
        var endMarkerPos = -1;
        if (endMarker === undefined) {
            if (envGroup && envGroup !== 'abstract' && envGroup !== 'tabular') {
                var environment = envGroup.trim();
                var openTag = (0, utils_1.beginTag)(environment, true);
                var closeTag = (0, utils_1.endTag)(environment, true);
                if (closeTag && openTag) {
                    var data = (0, utils_1.findOpenCloseTagsMathEnvironment)(str.slice(beginMarkerPos), openTag, closeTag);
                    if ((_a = data === null || data === void 0 ? void 0 : data.arrClose) === null || _a === void 0 ? void 0 : _a.length) {
                        endMarkerPos = beginMarkerPos + ((_b = data.arrClose[data.arrClose.length - 1]) === null || _b === void 0 ? void 0 : _b.posStart);
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
            if (shouldSkipDollar(str, match[0], beginMarkerPos, endMarkerPos)) {
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
            mathTable.set(id, content);
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