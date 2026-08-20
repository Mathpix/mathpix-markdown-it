"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandArgumentSpans = exports.braceMatches = void 0;
var tslib_1 = require("tslib");
var verbatim_ranges_1 = require("./verbatim-ranges");
var common_1 = require("../common");
var consts_1 = require("./consts");
// Where a command's argument begins and ends, for readers that must tell a written `\end{itemize}` from
// one that ends a list. Markdown is not LaTeX: braces stand in prose, unbalanced ones included, so only
// a group that follows a command name is an argument. Verbatim ranges — inline code, fences, math,
// `lstlisting` — are handed in by the caller and take precedence: a brace there is neither.
// Built from the supported names, so the sweep cannot drift from what the package parses.
var COMMAND_SWEEP_G = new RegExp('\\\\(?:' + consts_1.LATEX_BRACE_ARG_COMMANDS.join('|') + ')(?![a-zA-Z])', 'g');
/** Where each balanced `{` closes. One pass: asking per brace rescanned the tail, `n^1.9` on a run of
 *  unmatched `{`. A brace inside `verbatim`, or escaped, opens and closes nothing. */
var braceMatches = function (text, verbatim) {
    var closeOf = new Map();
    var open = [];
    var range = 0;
    for (var i = 0; i < text.length; i++) {
        var chr = text[i];
        if (chr !== '{' && chr !== '}' && chr !== '\\') {
            continue;
        }
        // Before the escape check: a `\` ending a verbatim range must not escape past its end.
        while (range < verbatim.length && verbatim[range][1] <= i) {
            range++;
        }
        if (range < verbatim.length && i >= verbatim[range][0]) {
            i = verbatim[range][1] - 1;
            continue;
        }
        if (chr === '\\') {
            i++;
            continue;
        }
        if (chr === '{') {
            open.push(i);
            continue;
        }
        var from = open.pop();
        if (from !== undefined) {
            // Every pair, not depth 1 alone: a stray `{` above must not hide the pairs under it.
            closeOf.set(from, i);
        }
    }
    return closeOf;
};
exports.braceMatches = braceMatches;
/** Past a command name: a star, `[...]` options, a bare name as in `\renewcommand\qedsymbol{Q}`, and the
 *  spaces between. Options do not span lines, so a `[` whose `]` sits on another line is text. */
var afterCommandOptions = function (text, from) {
    var at = from;
    for (;;) {
        while (at < text.length && (text[at] === ' ' || text[at] === '\t')) {
            at++;
        }
        if (text[at] === '*') {
            at++;
            continue;
        }
        if (text[at] === '\\' && (0, common_1.isAsciiLetter)(text.charCodeAt(at + 1))) {
            at++;
            while (at < text.length && (0, common_1.isAsciiLetter)(text.charCodeAt(at))) {
                at++;
            }
            continue;
        }
        if (text[at] === '[') {
            var lineEnd = text.indexOf('\n', at);
            var close_1 = text.indexOf(']', at);
            if (close_1 < 0 || (lineEnd >= 0 && close_1 > lineEnd)) {
                return at;
            }
            at = close_1 + 1;
            continue;
        }
        return at;
    }
};
/** Outermost command-argument spans, ascending, `[openBrace, closeBrace]` **inclusive** — `isInsideRanges`
 *  is half-open, so the closing brace's own offset reads as outside. Harmless for the readers there are,
 *  which ask about a backslash, always strictly inside; a reader asking about that brace needs `close + 1`.
 *  Read forward from the commands: a group with no command before it — `opens {` … `closes }` — is not one. */
var commandArgumentSpans = function (text, verbatim) {
    var e_1, _a;
    var closeOf = (0, exports.braceMatches)(text, verbatim);
    var spans = [];
    COMMAND_SWEEP_G.lastIndex = 0;
    var command;
    while ((command = COMMAND_SWEEP_G.exec(text)) !== null) {
        // A command written in code or math is text, and so are the braces after it.
        if ((0, verbatim_ranges_1.isInsideRanges)(verbatim, command.index)) {
            continue;
        }
        var at = afterCommandOptions(text, command.index + command[0].length);
        // `\renewcommand{\x}{y}`: every group that follows the name is an argument of it.
        while (text[at] === '{') {
            var close_2 = closeOf.get(at);
            if (close_2 === undefined) {
                break; // an argument left open marks nothing
            }
            spans.push([at, close_2]);
            at = afterCommandOptions(text, close_2 + 1);
        }
    }
    // Keep the outermost; ascending, so a search over them stays a binary one.
    spans.sort(function (a, b) { return a[0] - b[0] || b[1] - a[1]; });
    var outer = [];
    var reach = -1;
    try {
        for (var spans_1 = tslib_1.__values(spans), spans_1_1 = spans_1.next(); !spans_1_1.done; spans_1_1 = spans_1.next()) {
            var span = spans_1_1.value;
            if (span[1] > reach) {
                outer.push(span);
                reach = span[1];
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (spans_1_1 && !spans_1_1.done && (_a = spans_1.return)) _a.call(spans_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return outer;
};
exports.commandArgumentSpans = commandArgumentSpans;
//# sourceMappingURL=argument-spans.js.map