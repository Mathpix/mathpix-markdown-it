"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubMath = exports.getMathTableContent = exports.mathTablePush = exports.ClearSubMathLists = void 0;
var common_1 = require("./common");
var mdPluginRaw_1 = require("../../mdPluginRaw");
var mathTable = [];
exports.ClearSubMathLists = function () {
    mathTable = [];
};
exports.mathTablePush = function (item) {
    mathTable.push(item);
};
exports.getMathTableContent = function (sub, i) {
    var resContent = sub;
    sub = sub.trim();
    var cellM = sub.slice(i).match(/(?:\{\{([\w]*)\}\})/g);
    cellM = cellM ? cellM : sub.slice(i).match(/(?:\{([\w]*)\})/g);
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
    resContent = common_1.getContent(resContent);
    return resContent;
};
exports.getSubMath = function (str) {
    var match = str
        .match(/(?:\\\\\[|\\\[|\\\\\(|\\\(|\$\$|\$|\\begin\{([^}]*)\}|eqref\{([^}]*)\}|ref\{([^}]*)\})/);
    if (match) {
        var startMathPos = match.index + match[0].length;
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
            endMarker = "\\end{" + match[1] + "}";
        }
        else if (match[0] === "$$") {
            endMarker = match[0];
        }
        else if (match[0] === "$") {
            endMarker = match[0];
        }
        var endMarkerPos = mdPluginRaw_1.findEndMarkerPos(str, endMarker, startMathPos);
        if (endMarkerPos === -1) {
            return str;
        }
        if (match[0] === "$" || match[0] === "$$") {
            var beforeEndMarker = str.charCodeAt(endMarkerPos - 1);
            if (beforeEndMarker === 0x5c /* \ */ ||
                (match.index > 0 && str.charCodeAt(match.index - 1) === 0x5c /* \ */)) {
                return str;
            }
            if (match[0] === "$") {
                var afterStartMarker = str.charCodeAt(match.index + 1);
                if (beforeEndMarker === 0x20 /* space */ ||
                    beforeEndMarker === 0x09 /* \t */ ||
                    beforeEndMarker === 0x0a /* \n */ ||
                    afterStartMarker === 0x20 /* space */ ||
                    afterStartMarker === 0x09 /* \t */ ||
                    afterStartMarker === 0x0a /* \n */) {
                    return str;
                }
            }
            // Skip if closing $ is succeeded by a digit (eg $5 $10 ...)
            var suffix = str.charCodeAt(endMarkerPos + 1);
            if (suffix >= 0x30 && suffix < 0x3a) {
                return str;
            }
        }
        var nextPos = endMarkerPos + endMarker.length;
        var content = str.slice(match.index, nextPos);
        var id = "f" + (+new Date + (Math.random() * 100000).toFixed()).toString();
        mathTable.push({ id: id, content: content });
        str = str.slice(0, match.index) + ("{" + id + "}") + str.slice(endMarkerPos + endMarker.length);
        str = exports.getSubMath(str);
    }
    return str;
};
//# sourceMappingURL=sub-math.js.map