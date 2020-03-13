"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var re_level_1 = require("../md-block-rule/lists/re-level");
exports.reNewCommand = function (state, silent) {
    var match;
    var startMathPos = state.pos;
    var reItem = /^(?:renewcommand\s{0,}\{(\\labelenumi|\\labelenumii|\\labelenumiii|\\labelenumiv|\\labelitemi|\\labelitemii\\labelitemiii\\labelitemiv)\})/;
    var reEnum = /(?:\\alph|\\Alph|\\arabic|\\roman|\\Roman\s{0,}\{(enumi|enumii|enumiii|enumiv)\})/;
    var reEnumL = /^(?:alph|Alph|arabic|roman|Roman)/;
    if (state.src.charCodeAt(startMathPos) !== 0x5c /* \ */) {
        return false;
    }
    if (silent) {
        return false;
    }
    startMathPos += 1;
    match = state.src
        .slice(startMathPos)
        .match(reItem);
    if (!match) {
        return false;
    }
    if (!match[1]) {
        return false;
    }
    var indexLevel = re_level_1.LevelsEnum.indexOf(match[1].replace(/\\/g, '').trim());
    var isEnum = false;
    if (indexLevel === -1) {
        indexLevel = re_level_1.LevelsItem.indexOf(match[1].replace(/\\/g, '').trim());
        if (indexLevel === -1) {
            return false;
        }
    }
    else {
        isEnum = true;
    }
    var str = state.src.slice(startMathPos + match[0].length).trim();
    if (str[0] === '{') {
        if (isEnum) {
            var matchL = str.match(reEnum);
            if (matchL) {
                var matchE = matchL[0].slice(1).match(reEnumL);
                if (matchE) {
                    var newStyle = re_level_1.AvailableStyles[matchE[0]];
                    re_level_1.enumerateLevel[indexLevel] = newStyle;
                }
            }
        }
        else {
            if (str[1] === '$') {
            }
            else {
                var iEnd = str.indexOf('}', 1);
                if (iEnd > -1) {
                    var content = str.slice(1, iEnd);
                    re_level_1.itemizeLevel[indexLevel] = content;
                    re_level_1.SetItemizeLevelTokens(state);
                    state.pos = startMathPos + match[0].length + iEnd + 1;
                    return true;
                }
            }
        }
    }
    return true;
};
//# sourceMappingURL=renewcommand.js.map