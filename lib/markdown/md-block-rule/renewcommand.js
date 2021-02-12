"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReNewCommand = exports.reNewCommand = exports.parseOneCommand = void 0;
var re_level_1 = require("./lists/re-level");
var reTag = /\\renewcommand/;
var reTagG = /\\renewcommand/g;
var parseCommand = function (str) {
    str = str.trim();
    var command = '';
    var params = '';
    var s = '';
    var isOpen = 0;
    var endPos = str.length;
    for (var i = 0; i < str.length; i++) {
        if (!command && (str[i] === '{' || str.charCodeAt(i) === 0x5c /* \ */ || str[i] === '}')) {
            if (s && s.trim().length > 0) {
                command = s;
                s = '';
            }
            continue;
        }
        if (command) {
            if (str[i] === '{') {
                isOpen++;
                if (!s) {
                    continue;
                }
            }
            if (str[i] === '}') {
                isOpen--;
                if (isOpen <= 0) {
                    params = s;
                    endPos = i;
                    break;
                }
            }
        }
        s += str[i];
    }
    if (!params) {
        params = s;
    }
    return { command: command.trim(), params: params.trim(), endPos: endPos };
};
exports.parseOneCommand = function (state, str) {
    var data = parseCommand(str);
    re_level_1.ChangeLevel(state, data);
    return data.endPos;
};
exports.reNewCommand = function (state, lineText) {
    if (lineText.charCodeAt(0) !== 0x5c /* \ */) {
        return;
    }
    var match = lineText.match(reTagG);
    if (!match) {
        return;
    }
    var arr = lineText.split(reTag);
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].trim().length === 0) {
            continue;
        }
        var str = arr[i];
        exports.parseOneCommand(state, str);
    }
};
exports.ReNewCommand = function (state, startLine) {
    var pos = state.bMarks[startLine] + state.tShift[startLine];
    var max = state.eMarks[startLine];
    var nextLine = startLine + 1;
    var lineText = state.src.slice(pos, max);
    var match = lineText.match(reTag);
    if (!match) {
        return false;
    }
    if (match.index > 0) {
        var strBefor = lineText.slice(0, match.index);
        if (strBefor.trim().length > 0) {
            return false;
        }
    }
    exports.reNewCommand(state, lineText.slice(match.index).trim());
    if (state.md.options && state.md.options.forLatex) {
        var token = state.push("renewcommand", "", 0);
        token.latex = lineText.slice(match.index).trim();
    }
    state.line = nextLine;
    return true;
};
//# sourceMappingURL=renewcommand.js.map