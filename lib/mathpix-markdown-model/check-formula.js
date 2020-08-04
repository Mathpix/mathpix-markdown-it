"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkFormula = void 0;
var mdPluginRaw_1 = require("../markdown/mdPluginRaw");
exports.checkFormula = function (mathString, showTimeLog) {
    if (showTimeLog === void 0) { showTimeLog = false; }
    var startTime = new Date().getTime();
    var latexBlockRule = /abstract|center|left|right|table|figure|tabular|enumerate|itemize/;
    var res_mathString = "";
    var idx = 0;
    while (idx < mathString.length) {
        var startMathPos = idx;
        var endMarker = // eslint-disable-line
         void 0; // eslint-disable-line
        if (mathString.charCodeAt(startMathPos) === 0x24 /* $ */) {
            endMarker = "$";
            if (mathString.charCodeAt(++startMathPos) === 0x24 /* $ */) {
                endMarker = "$$";
            }
        }
        else {
            if (mathString.charCodeAt(startMathPos) !== 0x5c /* \ */) {
                res_mathString = res_mathString + mathString[idx];
                idx++;
                continue;
            }
            var match = mathString
                .slice(++startMathPos)
                .match(/^(?:\\\[|\[|\\\(|\(|$|$$|begin\{([^}]*)\}|eqref\{([^}]*)\})/); // eslint-disable-line
            if (!match) {
                res_mathString = res_mathString + mathString[idx];
                idx++;
                continue;
            }
            if (latexBlockRule.test(match[1])) {
                res_mathString = res_mathString + mathString[idx];
                idx++;
                continue;
            }
            startMathPos += match[0].length;
            if (match[0] === "\\[") {
                endMarker = "\\\\]";
            }
            else if (match[0] === "\[") {
                endMarker = "\\]";
            }
            else if (match[0] === "\\(") {
                endMarker = "\\\\)";
            }
            else if (match[0] === "\(") {
                endMarker = "\\)";
            }
            else if (match[0].includes("eqref")) {
                endMarker = "";
            }
            else if (match[1]) {
                endMarker = "\\end{" + match[1] + "}";
            }
        }
        var endMarkerPos = (endMarker === '$$' || endMarker === '$')
            ? mdPluginRaw_1.findEndMarkerPos(mathString, endMarker, startMathPos)
            : mathString.indexOf(endMarker, startMathPos);
        if (endMarkerPos === -1) {
            res_mathString = res_mathString + mathString.substr(idx, mathString.length);
            break;
        }
        var ln = endMarkerPos + endMarker.length;
        var str2 = mathString.substr(idx, ln - idx).split("\n").join("");
        res_mathString = res_mathString + str2;
        var nextPos = endMarkerPos + endMarker.length;
        idx = nextPos;
    }
    var endTime = new Date().getTime();
    if (showTimeLog) {
        console.log("=> checkFormula: " + (endTime - startTime) + "ms");
    }
    return res_mathString;
};
//# sourceMappingURL=check-formula.js.map