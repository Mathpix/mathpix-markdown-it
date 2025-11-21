"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.latexLstlistingEnvInlineRule = void 0;
var lstlisting_options_1 = require("./lstlisting-options");
var consts_1 = require("../common/consts");
/** Does the \end{...} start at the very beginning of its line (only spaces/tabs before)? */
var endStartsAtLineStart = function (src, endPos) {
    var prevNL = src.lastIndexOf('\n', endPos - 1);
    var lineStart = prevNL === -1 ? 0 : prevNL + 1;
    for (var i = lineStart; i < endPos; i++) {
        var ch = src.charCodeAt(i);
        if (ch !== 0x20 /* space */ && ch !== 0x09 /* tab */)
            return false;
    }
    return true;
};
/** Normalize tail: remove exactly one trailing \n iff \end{...} is on a fresh line with no text to the left */
var normalizeContentByEndPosition = function (raw, src, endPos) {
    var s = raw.replace(/\r\n?/g, '\n');
    return endStartsAtLineStart(src, endPos) && s.endsWith('\n') ? s.slice(0, -1) : s;
};
/** Find matching \end{lstlisting} (no cross-env nesting needed here) */
var findEndOfLstlisting = function (src, from) {
    return src.indexOf('\\end{lstlisting}', from);
};
/** Parse \begin{lstlisting}[opts] at given pos; return { opts, after } or null */
var parseBeginLstlistingAt = function (src, pos) {
    var tail = src.slice(pos);
    if (!consts_1.BEGIN_LST_FAST_RE.test(tail))
        return null;
    var match = tail.match(consts_1.BEGIN_LST_WITH_TRAIL_WS_NL_RE);
    if (!match)
        return null;
    var opts = (match[1] || '').trim();
    return { opts: opts, after: pos + match[0].length };
};
/**
 * Inline rule: parse \begin{lstlisting}[...]\end{lstlisting} in inline stream.
 * - Emits 'latex_lstlisting_env' token (block=false), so renderer can output <pre><code>...</code></pre>.
 * - If [mathescape] present, children are math-only tokens (text + inline/display math),
 *   everything else stays plain text.
 */
var latexLstlistingEnvInlineRule = function (state, silent) {
    var src = state.src;
    var pos = state.pos;
    // must start with '\' and literally '\begin{...}' here
    if (src.charCodeAt(pos) !== 0x5c /* \ */)
        return false;
    if (!src.startsWith('\\begin{', pos))
        return false;
    var begin = parseBeginLstlistingAt(src, pos);
    if (!begin)
        return false;
    // find \end{lstlisting}
    var endBegin = begin.after;
    var endPos = findEndOfLstlisting(src, endBegin);
    if (endPos === -1)
        return false;
    var endTagLen = '\\end{lstlisting}'.length;
    var endTagEnd = endPos + endTagLen;
    if (!silent) {
        var raw = src.slice(endBegin, endPos);
        var content = normalizeContentByEndPosition(raw, src, endPos);
        var token = state.push('latex_lstlisting_env', 'pre', 0);
        token.block = false; // remain in the inline flow
        token.content = content;
        token.info = begin.opts; // raw options
        if (begin.opts) {
            (0, lstlisting_options_1.applyLstListingOptionsToToken)(token, content, begin.opts, state);
        }
    }
    state.pos = endTagEnd; // advance cursor past the end tag
    return true;
};
exports.latexLstlistingEnvInlineRule = latexLstlistingEnvInlineRule;
//# sourceMappingURL=latex-lstlisting-env-inline.js.map