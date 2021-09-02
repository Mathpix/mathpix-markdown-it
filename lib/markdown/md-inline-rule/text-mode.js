"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.textMode = void 0;
var textModeObj = {
    "textasciicircum": "\u02C6",
    "textless": "\u003C",
    "textasciitilde": "\u0303",
    "textordfeminine": "\u00AA",
    "textasteriskcentered": "\u2217",
    "textordmasculine": "\u00B0",
    "textbackslash": "\u005C",
    "textparagraph": "\u00B6",
    "textbar": "\u007C",
    "textperiodcentered": "\u00B7",
    "textbraceleft": "\u007B",
    "textquestiondown": "\u00BF",
    "textbraceright": "\u007D",
    "textquotedblleft": "\u201C",
    "textbullet": "\u2022",
    "textquotedblright": "\u201D",
    "textcopyright": "\u00A9",
    "textquoteleft": "\u2018",
    "textdagger": "\u2020",
    "textquoteright": "\u2019",
    "textdaggerdbl": "\u2021",
    "textregistered": "\u00AE",
    "textdollar": "\u0024",
    "textsection": "\u00A7",
    "textellipsis": "\u00B7\u00B7\u00B7",
    "ldots": "\u00B7\u00B7\u00B7",
    "textsterling": "\u00A3",
    "textemdash": "\u2014",
    "texttrademark": "TM",
    "textendash": "\u2013",
    "textunderscore": "\u002D",
    "textexclamdown": "\u00A1",
    "textvisiblespace": "\u02FD",
    "textgreater": "\u003E",
    "pounds": "\u00A3",
};
exports.textMode = function (state, silent) {
    var token;
    var match;
    var startMathPos = state.pos;
    if (state.src.charCodeAt(startMathPos) !== 0x5c /* \ */) {
        return false;
    }
    if (silent) {
        return false;
    }
    var textModeRegexp = new RegExp('^(?:' + Object.keys(textModeObj).join('|') + ')');
    match = state.src
        .slice(++startMathPos)
        .match(textModeRegexp);
    if (!match) {
        return false;
    }
    token = state.push('text', '', 0);
    token.content = textModeObj[match[0]];
    token.latex = '\\' + match[0];
    state.pos = startMathPos + match.index + match[0].length;
    return true;
};
//# sourceMappingURL=text-mode.js.map