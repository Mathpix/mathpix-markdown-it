"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReNewCommand = exports.reNewCommand = exports.parseOneCommand = exports.startsCommandAt = void 0;
var re_level_1 = require("../md-latex-lists-env/re-level");
var common_1 = require("../common");
var reTag = /\\renewcommand/;
var reTagG = /\\renewcommand/g;
var TAG = '\\renewcommand';
// Sticky, so it carries a lastIndex — set it before every `exec`.
var BLANKS_STICKY_RE = /\s*/y;
/** Does a `\renewcommand` start at `at`? With the `\b` the span reader requires: the two disagreeing
 *  on `\renewcommandfoo` cost the line its text. */
var startsCommandAt = function (text, at) {
    if (!text.startsWith(TAG, at)) {
        return false;
    }
    var next = text.charCodeAt(at + TAG.length);
    return !(0, common_1.isAsciiLetter)(next) && !(next >= 0x30 && next <= 0x39) && next !== 0x5f /* _ */;
};
exports.startsCommandAt = startsCommandAt;
/** First non-blank at or after `from`, or -1 when only blanks follow. No slice: this runs per command. */
var skipBlanksFrom = function (text, from) {
    BLANKS_STICKY_RE.lastIndex = from;
    BLANKS_STICKY_RE.exec(text);
    var at = BLANKS_STICKY_RE.lastIndex;
    return at < text.length ? at : -1;
};
var parseCommand = function (str) {
    var command = '';
    var params = '';
    var s = '';
    var isOpen = 0;
    var endPos = str.length;
    // Space is skipped, not trimmed, so offsets stay in the coordinates of the string passed in.
    // `*` is not part of the name.
    var start = 0;
    while (start < str.length && (str[start] === ' ' || str[start] === '\t')) {
        start++;
    }
    if (str[start] === '*') {
        start++;
    }
    for (var i = start; i < str.length; i++) {
        if (!command && (str[i] === '{' || str.charCodeAt(i) === 0x5c /* \ */ || str[i] === '}')) {
            if (s && s.trim().length > 0) {
                command = s;
                s = '';
                // `\renewcommand\x{a{b}c}`: this brace opens the body — uncounted, the first inner `}` ended it.
                if (str[i] === '{') {
                    isOpen++;
                }
            }
            continue;
        }
        // `\renewcommand{\x}[1]{Z}`: the optional argument is not part of the body. Space between the two is
        // legal, so `s` may hold it — dropped with the argument, or the `{` after it read as body text.
        if (command && !s.trim() && !isOpen && str[i] === '[') {
            var past = (0, common_1.skipOptionalArg)(str, i, true);
            if (past > 0) {
                i = past - 1;
                s = '';
                continue;
            }
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
var parseOneCommand = function (state, str) {
    var data = parseCommand(str);
    (0, re_level_1.ChangeLevel)(state, data);
    return data.endPos;
};
exports.parseOneCommand = parseOneCommand;
var reNewCommand = function (state, lineText) {
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
        (0, exports.parseOneCommand)(state, str);
    }
};
exports.reNewCommand = reNewCommand;
/** Where the text after every `\renewcommand` begins, or the line's length when they are all it holds.
 *  One code-span index for the whole line: built per command it cost 1215ms on 8000 of them against 3. */
var tailStartOnLine = function (lineText, from) {
    var codeIndex = (0, common_1.buildInlineCodePositionSet)((0, common_1.getInlineCodeListFromString)(lineText));
    var at = from;
    while ((0, exports.startsCommandAt)(lineText, at)) {
        var span = (0, common_1.renewCommandSpanEnd)(lineText, at, codeIndex);
        // Arguments not closing on the line: the rest of it is the body, as this rule always read it.
        if (span <= 0) {
            return lineText.length;
        }
        at = span;
        var blank = skipBlanksFrom(lineText, at);
        if (blank < 0) {
            return lineText.length;
        }
        at = blank;
    }
    return at;
};
var ReNewCommand = function (state, startLine) {
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
    (0, exports.reNewCommand)(state, lineText.slice(match.index).trim());
    // Applied, but the line is not ours when something else shares it: this rule renders to nothing, so
    // claiming the line dropped that text. The paragraph takes it, inline reads the command there.
    if (tailStartOnLine(lineText, match.index) < lineText.length) {
        return false;
    }
    if (state.md.options && state.md.options.forLatex) {
        var token = state.push("renewcommand", "", 0);
        token.latex = lineText.slice(match.index).trim();
    }
    state.line = nextLine;
    return true;
};
exports.ReNewCommand = ReNewCommand;
//# sourceMappingURL=renewcommand.js.map