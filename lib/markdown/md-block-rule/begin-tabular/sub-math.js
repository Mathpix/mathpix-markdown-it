"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubMath = exports.getMathTableContent = exports.mathTablePush = exports.ClearSubMathLists = void 0;
var common_1 = require("./common");
var mdPluginRaw_1 = require("../../mdPluginRaw");
var utils_1 = require("../../utils");
var sub_code_1 = require("./sub-code");
var consts_1 = require("../../common/consts");
var mathTable = [];
var ClearSubMathLists = function () {
    mathTable = [];
};
exports.ClearSubMathLists = ClearSubMathLists;
var mathTablePush = function (item) {
    mathTable.push(item);
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
    var _loop_1 = function (j) {
        var content = cellM[j].replace(/\{/g, '').replace(/\}/g, '');
        var index = mathTable.findIndex(function (item) { return item.id === content; });
        if (index >= 0) {
            var iB = resContent.indexOf(cellM[j]);
            resContent = resContent.slice(0, iB) + mathTable[index].content + resContent.slice(iB + cellM[j].length);
        }
    };
    for (var j = 0; j < cellM.length; j++) {
        _loop_1(j);
    }
    resContent = (0, common_1.getContent)(resContent);
    return resContent;
};
exports.getMathTableContent = getMathTableContent;
var getSubMath = function (str, startPos) {
    var _a, _b;
    if (startPos === void 0) { startPos = 0; }
    var match = str
        .slice(startPos)
        .match(/(?:\\\\\[|\\\[|\\\\\(|\\\(|\$\$|\$|\\begin\{([^}]*)\}|eqref\{([^}]*)\}|ref\{([^}]*)\})/);
    var endMarkerPos = -1;
    if (match) {
        var beginMarkerPos = startPos + match.index;
        var startMathPos = beginMarkerPos + match[0].length;
        var endMarker = void 0;
        if (match[0] === "\\\\[") {
            endMarker = "\\\\]";
        }
        else if (match[0] === "\\[") {
            endMarker = "\\]";
        }
        else if (match[0] === "\\\\(") {
            endMarker = "\\\\)";
        }
        else if (match[0] === "\\(") {
            endMarker = "\\)";
        }
        else if (match[0].includes("eqref")) {
            endMarker = "";
        }
        else if (match[0].includes("ref")) {
            endMarker = "";
        }
        else if (match[1] && match[1] !== 'abstract' && match[1] !== 'tabular') {
            var environment = match[1].trim();
            var openTag = (0, utils_1.beginTag)(environment, true);
            var closeTag = (0, utils_1.endTag)(environment, true);
            if (closeTag && openTag) {
                var data = (0, utils_1.findOpenCloseTagsMathEnvironment)(str.slice(startPos), openTag, closeTag);
                if ((_a = data === null || data === void 0 ? void 0 : data.arrClose) === null || _a === void 0 ? void 0 : _a.length) {
                    endMarkerPos = startPos + ((_b = data.arrClose[data.arrClose.length - 1]) === null || _b === void 0 ? void 0 : _b.posStart);
                }
                endMarker = "\\end{".concat(match[1], "}");
            }
        }
        else if (match[0] === "$$") {
            endMarker = match[0];
        }
        else if (match[0] === "$") {
            endMarker = match[0];
        }
        endMarkerPos = endMarkerPos !== -1
            ? endMarkerPos
            : (0, mdPluginRaw_1.findEndMarkerPos)(str, endMarker, startMathPos);
        if (endMarkerPos === -1) {
            /** If the end marker is not found, it is necessary to search further, excluding the current marker. */
            str = (0, exports.getSubMath)(str, startMathPos);
            return str;
        }
        if (match[0] === "$" || match[0] === "$$") {
            var beforeEndMarker = str.charCodeAt(endMarkerPos - 1);
            if (beforeEndMarker === 0x5c /* \ */ ||
                (beginMarkerPos > 0 && str.charCodeAt(beginMarkerPos - 1) === 0x5c /* \ */)) {
                /** If the marker is shielded, it is necessary to search further, excluding the current marker. */
                str = (0, exports.getSubMath)(str, startMathPos);
                return str;
            }
            if (match[0] === "$") {
                var afterStartMarker = str.charCodeAt(beginMarkerPos + 1);
                if (beforeEndMarker === 0x20 /* space */ ||
                    beforeEndMarker === 0x09 /* \t */ ||
                    beforeEndMarker === 0x0a /* \n */ ||
                    afterStartMarker === 0x20 /* space */ ||
                    afterStartMarker === 0x09 /* \t */ ||
                    afterStartMarker === 0x0a /* \n */) {
                    str = (0, exports.getSubMath)(str, startMathPos);
                    return str;
                }
            }
            // Skip if closing $ is succeeded by a digit (eg $5 $10 ...)
            var suffix = str.charCodeAt(endMarkerPos + 1);
            if (suffix >= 0x30 && suffix < 0x3a) {
                str = (0, exports.getSubMath)(str, startMathPos);
                return str;
            }
        }
        var nextPos = endMarkerPos + endMarker.length;
        var content = str.slice(beginMarkerPos, nextPos);
        var id = (0, common_1.generateUniqueId)();
        var isCodeEnv = match[1] && consts_1.LATEX_BLOCK_ENV.has(match[1]);
        if (isCodeEnv) {
            (0, sub_code_1.addExtractedCodeBlock)({ id: id, content: content });
        }
        else {
            mathTable.push({ id: id, content: content });
        }
        var placeholder = isCodeEnv ? "<<".concat(id, ">>") : "{".concat(id, "}");
        str = str.slice(0, startPos) + str.slice(startPos, beginMarkerPos) + placeholder + str.slice(endMarkerPos + endMarker.length);
        str = (0, exports.getSubMath)(str, startPos);
    }
    return str;
};
exports.getSubMath = getSubMath;
//# sourceMappingURL=sub-math.js.map