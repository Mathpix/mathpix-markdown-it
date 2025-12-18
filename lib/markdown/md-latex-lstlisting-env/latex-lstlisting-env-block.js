"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.latexLstlistingEnvBlockRule = void 0;
var lstlisting_options_1 = require("./lstlisting-options");
var consts_1 = require("../common/consts");
/**
 * Try to read a whole lstlisting block starting at `startLine`.
 * Returns { opts, content, endLine } or null if not matched/closed.
 */
var readLstlistingBlock = function (state, startLine) {
    var start = state.bMarks[startLine] + state.tShift[startLine];
    var max = state.eMarks[startLine];
    var firstLine = state.src.slice(start, max);
    if (!consts_1.BEGIN_LST_FAST_RE.test(firstLine))
        return null;
    var match = firstLine.match(consts_1.BEGIN_LST_RE);
    if (!match)
        return null;
    var optsRaw = (match[1] || '').trim();
    // Collect lines until \end{lstlisting}
    var lines = [];
    var nextLine = startLine + 1;
    for (; nextLine < state.lineMax; nextLine++) {
        var s = state.bMarks[nextLine] + state.tShift[nextLine];
        var e = state.eMarks[nextLine];
        var line = state.src.slice(s, e);
        if (consts_1.END_LST_RE.test(line)) {
            // stop BEFORE end-line; `nextLine` now points to end
            break;
        }
        // keep original slice (without trimming), preserve exact content
        lines.push(state.src.slice(state.bMarks[nextLine], state.eMarks[nextLine]));
    }
    if (nextLine >= state.lineMax) {
        // no closing \end{lstlisting}
        return null;
    }
    return {
        opts: optsRaw,
        content: lines.join('\n'),
        endLine: nextLine + 1, // move parser AFTER the end line
    };
};
/**
 * Block rule: parse LaTeX \begin{lstlisting}[...]\end{lstlisting} as a code block token.
 * - Supports optional [mathescape] in options: math is parsed into children (text + math tokens).
 */
var latexLstlistingEnvBlockRule = function (state, startLine, _endLine, silent) {
    // don't start mid-paragraph
    if (state.tShift[startLine] < 0)
        return false;
    var res = readLstlistingBlock(state, startLine);
    if (!res)
        return false;
    if (silent)
        return true;
    var opts = res.opts, content = res.content, endLine = res.endLine;
    var token = state.push('latex_lstlisting_env', 'pre', 0);
    token.block = true;
    token.map = [startLine, endLine];
    token.markup = 'lstlisting';
    token.content = content; // raw text
    token.info = opts; // raw options
    if (opts) {
        (0, lstlisting_options_1.applyLstListingOptionsToToken)(token, content, opts, state);
    }
    state.line = endLine;
    return true;
};
exports.latexLstlistingEnvBlockRule = latexLstlistingEnvBlockRule;
//# sourceMappingURL=latex-lstlisting-env-block.js.map