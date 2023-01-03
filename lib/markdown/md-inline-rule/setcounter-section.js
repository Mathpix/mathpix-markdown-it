"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCounterSection = void 0;
var consts_1 = require("../common/consts");
var lists_1 = require("../md-block-rule/lists");
var mdPluginText_1 = require("../mdPluginText");
/** `\setcounter{section}{number}`
 * Sets count for `section` to contain the value number.
 * *Note:* number can be positive or negative.
 * */
exports.setCounterSection = function (state) {
    var _a, _b;
    var startPos = state.pos;
    if (state.src.charCodeAt(startPos) !== 0x5c /* \ */) {
        return false;
    }
    var envName = "";
    var numStr = "";
    var nextPos = startPos;
    var content = "";
    var match = state.src
        .slice(startPos)
        .match(consts_1.reSetCounter);
    if (!match) {
        return false;
    }
    content = match[0];
    nextPos += match[0].length;
    envName = ((_a = match.groups) === null || _a === void 0 ? void 0 : _a.name) ? match.groups.name : match[1];
    if (!envName || !["section", "subsection", "subsubsection"].includes(envName)) {
        return false;
    }
    numStr = ((_b = match.groups) === null || _b === void 0 ? void 0 : _b.number) ? match.groups.number : match[2];
    numStr = numStr ? numStr.trim() : '';
    var num = numStr && lists_1.reNumber.test(numStr)
        ? Number(match[2].trim()) : 0;
    mdPluginText_1.setTextCounterSection(envName, num);
    var token = state.push("section_setcounter", "", 0);
    token.content = "";
    token.children = [];
    if (state.md.options.forLatex) {
        token.latex = content;
    }
    state.pos = nextPos;
    return true;
};
//# sourceMappingURL=setcounter-section.js.map