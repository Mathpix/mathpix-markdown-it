"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lists = exports.ListsInternal = void 0;
var tslib_1 = require("tslib");
var latex_list_tokens_1 = require("./latex-list-tokens");
var latex_list_items_1 = require("./latex-list-items");
var re_level_1 = require("./re-level");
var latex_list_types_1 = require("./latex-list-types");
var latex_list_common_1 = require("./latex-list-common");
var list_state_1 = require("./list-state");
var caption_counters_1 = require("../common/caption-counters");
var src_pos_cache_1 = require("../common/src-pos-cache");
var common_1 = require("../common");
var env_transient_1 = require("../common/env-transient");
var latex_list_env_engine_1 = require("./latex-list-env-engine");
var consts_1 = require("../common/consts");
// Matches what the `renewcommand` rule looks for, anchored: the whole line is that command.
var RENEWCOMMAND_LINE_RE = /^\s*\\renewcommand\b/;
// Built from the unanchored env regexes, so a sweep cannot drift from what the parser accepts.
var END_LIST_ENV_SWEEP_G = new RegExp(consts_1.END_LIST_ENV_INLINE_RE.source, 'g');
var BEGIN_LIST_ENV_SWEEP_G = new RegExp(consts_1.BEGIN_LIST_ENV_INLINE_RE.source, 'g');
// How many envs a line's tail leaves open: positive means it needs that many closers from ahead.
var unclosedEnvsIn = function (s) {
    return (s.match(BEGIN_LIST_ENV_SWEEP_G) || []).length - (s.match(END_LIST_ENV_SWEEP_G) || []).length;
};
// Offsets of every closer: the last one answers the early bail, the whole list feeds the depth check
// inside the body walk. Cached on the state the rule receives — the buffered state reads it through
// the prototype, so the sweep runs once per document rather than once per probe.
var LIST_END_OFFSETS_KEY = Symbol('mmd.listEndOffsets');
var listCloserOffsets = function (state) {
    return (0, src_pos_cache_1.matchPositionsCached)(state, LIST_END_OFFSETS_KEY, END_LIST_ENV_SWEEP_G);
};
// Fence openers, line-anchored like detectFenceOpen. Over-detecting is the safe direction: it only
// makes the sibling check below decline, never trust a closer that is really code.
var FENCE_OPEN_SWEEP_G = /^ {0,3}(?:`{3,}|~{3,})/gm;
var FENCE_OPEN_OFFSETS_KEY = Symbol('mmd.fenceOpenOffsets');
var fenceOpenOffsets = function (state) {
    return (0, src_pos_cache_1.matchPositionsCached)(state, FENCE_OPEN_OFFSETS_KEY, FENCE_OPEN_SWEEP_G);
};
var lastListEndPos = function (state) {
    var offsets = listCloserOffsets(state);
    return offsets.length ? offsets[offsets.length - 1] : -1;
};
// Closer per opaque env: the stack top picks its own, so a nested `\end{tabular}` is raw content
// inside a `table` rather than its closer.
var END_OPAQUE_ENV_RE = Object.freeze({
    lstlisting: consts_1.END_LST_INLINE_RE,
    tabular: consts_1.END_TABULAR_INLINE_RE,
    table: /\\end\{table\}/,
    figure: /\\end\{figure\}/,
    center: /\\end\{center\}/,
    left: /\\end\{left\}/,
    right: /\\end\{right\}/,
});
// Closer offsets per wrapper name, cached like the list sweeps: no scan of the source tail per
// `\begin`, which was O(remainder) on every occurrence.
var WRAPPER_END_SWEEP_G = Object.freeze({
    table: /\\end\{table\}/g,
    figure: /\\end\{figure\}/g,
    center: /\\end\{center\}/g,
    left: /\\end\{left\}/g,
    right: /\\end\{right\}/g,
});
var WRAPPER_END_OFFSETS_KEYS = Object.freeze({
    table: Symbol('mmd.endTable'),
    figure: Symbol('mmd.endFigure'),
    center: Symbol('mmd.endCenter'),
    left: Symbol('mmd.endLeft'),
    right: Symbol('mmd.endRight'),
});
var LIST_BEGIN_OFFSETS_KEY = Symbol('mmd.listBeginOffsets');
var listOpenerOffsets = function (state) {
    return (0, src_pos_cache_1.matchPositionsCached)(state, LIST_BEGIN_OFFSETS_KEY, BEGIN_LIST_ENV_SWEEP_G);
};
// Spans of every command argument, or null when a `{` never closes. Pairing is findEndMarker's job.
var argumentSpans = function (text) {
    var spans = [];
    for (var i = 0; i < text.length; i++) {
        if (text[i] === '\\') {
            i++;
            continue;
        }
        if (text[i] !== '{') {
            continue;
        }
        var found = (0, common_1.findEndMarker)(text, i);
        if (!found.res) {
            return null;
        }
        spans.push([i, found.endPos]);
        i = found.endPos;
    }
    return spans;
};
var positionsBetween = function (positions, from, to) {
    return positions.slice(positions.length - (0, src_pos_cache_1.countPositionsAtOrAfter)(positions, from), positions.length - (0, src_pos_cache_1.countPositionsAtOrAfter)(positions, to));
};
// Is a closer in `[from, to)` ours? `\item b \end{itemize}` ends the list, `\caption{x \end{itemize} y}`
// is text. An unmatched `{` leaves spans unknowable, so then every closer counts — the safe side.
var closesOurListWithin = function (state, from, to) {
    var closers = positionsBetween(listCloserOffsets(state), from, to);
    if (!closers.length) {
        return false;
    }
    var openers = positionsBetween(listOpenerOffsets(state), from, to);
    var spans = argumentSpans(state.src.slice(from, to));
    if (!spans) {
        return closers.length > openers.length;
    }
    var isStructure = function (offset) {
        return !spans.some(function (_a) {
            var _b = tslib_1.__read(_a, 2), open = _b[0], close = _b[1];
            return offset - from > open && offset - from < close;
        });
    };
    return closers.filter(isStructure).length > openers.filter(isStructure).length;
};
// A wrapper env opening on this line, or null. `tabular`/`lstlisting` keep their own detection,
// which is stricter — this one reuses the shared regex's name capture.
var wrapperBeginAt = function (lineText) {
    var mb = consts_1.LATEX_BLOCK_ENV_OPEN_RE.exec(lineText);
    return mb && mb[1] !== 'tabular' && mb[1] !== 'lstlisting' ? mb : null;
};
// Opening a wrapper as opaque swallows every line until its closer, so require one it can reach.
// Reaching past a closer of our own list swallowed it too, and the whole list then printed as
// literal LaTeX — that closer may be the last thing on its line, so position cannot decide it.
var hasCloserAhead = function (state, line, name) {
    var sweep = WRAPPER_END_SWEEP_G[name];
    var key = WRAPPER_END_OFFSETS_KEYS[name];
    if (!sweep || !key) {
        return false;
    }
    var from = state.bMarks[line];
    var at = (0, src_pos_cache_1.firstPositionAtOrAfter)((0, src_pos_cache_1.matchPositionsCached)(state, key, sweep), from);
    if (at < 0) {
        return false;
    }
    if (closesOurListWithin(state, from, at)) {
        return false;
    }
    // A closer written inside a code fence is text, so it cannot serve either.
    var fence = (0, src_pos_cache_1.firstPositionAtOrAfter)(fenceOpenOffsets(state), from);
    return fence < 0 || at < fence;
};
// The leftmost inline \begin/\end in `s`, or null once none is left. Both patterns need their
// literal plus a name, so a match is never empty and the caller's tail always shrinks.
var nextListEnvMatch = function (s) {
    var endMatch = s.match(consts_1.END_LIST_ENV_INLINE_RE);
    var beginMatch = s.match(consts_1.BEGIN_LIST_ENV_INLINE_RE);
    if (!endMatch && !beginMatch) {
        return null;
    }
    // Source order: an `\end` ahead of a `\begin` closes before the next level opens.
    var isEnd = !!endMatch && (!beginMatch || endMatch.index < beginMatch.index);
    return { match: isEnd ? endMatch : beginMatch, isEnd: isEnd };
};
// A fenced code block (``` or ~~~) inside a list env is opaque like lstlisting: its lines are collected raw so
// the code keeps its indentation (the normal content path de-indents via tShift, which `\item` detection needs).
// Detection mirrors the core fence rule (mmd-fence.ts): marker ` (0x60) or ~ (0x7E), run length ≥ 3, ≤ 3 leading
// spaces; a backtick open cannot carry a backtick in its info string; a close is same char, ≥ open length, blank tail.
var BACKTICK = 0x60;
var TILDE = 0x7E;
var skipUpTo3Spaces = function (rawLine) {
    var pos = 0;
    while (pos < 3 && rawLine.charCodeAt(pos) === 0x20) {
        pos++;
    }
    return pos;
};
var detectFenceOpen = function (rawLine) {
    var pos = skipUpTo3Spaces(rawLine);
    var char = rawLine.charCodeAt(pos);
    if (char !== BACKTICK && char !== TILDE) {
        return null;
    }
    var len = 0;
    while (rawLine.charCodeAt(pos + len) === char) {
        len++;
    }
    if (len < 3) {
        return null;
    }
    if (char === BACKTICK && rawLine.indexOf('`', pos + len) >= 0) {
        return null; // an info string on a backtick fence cannot contain a backtick
    }
    return { char: char, len: len };
};
var isFenceClose = function (rawLine, fence) {
    var pos = skipUpTo3Spaces(rawLine);
    if (rawLine.charCodeAt(pos) !== fence.char) {
        return false;
    }
    var len = 0;
    while (rawLine.charCodeAt(pos + len) === fence.char) {
        len++;
    }
    if (len < fence.len) {
        return false;
    }
    for (var i = pos + len; i < rawLine.length; i++) {
        var c = rawLine.charCodeAt(i);
        if (c !== 0x20 && c !== 0x09) {
            return false; // tail must be blank
        }
    }
    return true;
};
/**
 * Detects \begin{lstlisting} or \begin{tabular} on a line and enters an opaque env.
 * - Uses `stack` to track nesting (tabular can nest, lstlisting cannot).
 * - Text before \begin (including prefixes like \hline or & when nesting inside tabular) is preserved and added as normal list content.
 * - From \begin... to end of line is appended as raw/opaque text.
 *
 * @returns Updated { handled, stack, items, lineText }.
 */
var handleLstBeginInline = function (lineText, stack, items, nextLine, dStart, itemTag, state) {
    var top = stack[stack.length - 1];
    // Inside lstlisting or a wrapper, every line is raw until that env's own closer.
    if (top && top !== "tabular") {
        return { handled: false, stack: stack, items: items, lineText: lineText };
    }
    // All three patterns below need the literal, so one scan answers for them.
    if (lineText.indexOf('\\begin') < 0) {
        return { handled: false, stack: stack, items: items, lineText: lineText };
    }
    // Reset regex lastIndex (important if /g/)
    consts_1.BEGIN_LST_INLINE_RE.lastIndex = 0;
    consts_1.BEGIN_TABULAR_INLINE_RE.lastIndex = 0;
    var mbLst = consts_1.BEGIN_LST_INLINE_RE.exec(lineText);
    var mbTab = consts_1.BEGIN_TABULAR_INLINE_RE.exec(lineText);
    // If we are inside tabular, allow only nested tabular
    if (top === "tabular") {
        if (!mbTab)
            return { handled: false, stack: stack, items: items, lineText: lineText };
        // keep the prefix before \begin{tabular} (e.g. "\hline " or " & ")
        var prefix = lineText.slice(0, mbTab.index);
        var beginAndRest = lineText.slice(mbTab.index);
        // open nested tabular
        stack = tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(stack), false), ["tabular"], false);
        if (prefix.length > 0) {
            items = (0, latex_list_items_1.ItemsAddToPrev)(items, prefix, nextLine);
        }
        items = (0, latex_list_items_1.ItemsAddToPrev)(items, beginAndRest, nextLine);
        return { handled: true, stack: stack, items: items, lineText: lineText };
    }
    // A wrapper opens only when its closer is ahead, or the rest of the list turns into raw text.
    var mbWrapRaw = wrapperBeginAt(lineText);
    var mbWrap = mbWrapRaw && hasCloserAhead(state, nextLine, mbWrapRaw[1]) ? mbWrapRaw : null;
    // Earliest begin, or none. Seeded, so this stays a `null` the caller handles rather than a throw
    // the rule would swallow if the guard above and this fold ever drifted apart.
    var mb = [mbLst, mbTab, mbWrap]
        .filter(Boolean)
        .reduce(function (a, b) { return (a && a.index <= b.index ? a : b); }, null);
    if (!mb)
        return { handled: false, stack: stack, items: items, lineText: lineText };
    var openedType = mb === mbLst ? "lstlisting" : mb === mbTab ? "tabular" : mb[1];
    var beginIndex = mb.index;
    var before = lineText.slice(0, beginIndex);
    var afterBegin = lineText.slice(beginIndex);
    if (before.length > 0) {
        if (itemTag.test(before)) {
            items = (0, latex_list_items_1.ItemsListPush)(items, before, nextLine + dStart, nextLine + dStart);
        }
        else {
            items = (0, latex_list_items_1.ItemsAddToPrev)(items, before, nextLine);
        }
    }
    stack = tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(stack), false), [openedType], false);
    // The env can close on this same line: a single-line `\begin{center}x\end{center}` left the stack
    // open for good, and the list then bailed out as literal text. Same handling as on a later line.
    var endRe = END_OPAQUE_ENV_RE[openedType];
    endRe.lastIndex = 0;
    var meSameLine = endRe.exec(afterBegin);
    if (!meSameLine) {
        items = (0, latex_list_items_1.ItemsAddToPrev)(items, afterBegin, nextLine);
        return { handled: true, stack: stack, items: items, lineText: lineText };
    }
    var glue = openedType === "lstlisting" ? "\n" : "";
    items = (0, latex_list_items_1.ItemsAddToPrev)(items, afterBegin.slice(0, meSameLine.index) + glue + meSameLine[0], nextLine);
    stack = stack.slice(0, -1);
    var afterSameLineEnd = afterBegin.slice(meSameLine.index + meSameLine[0].length);
    return afterSameLineEnd.trim().length
        ? { handled: false, stack: stack, items: items, lineText: afterSameLineEnd }
        : { handled: true, stack: stack, items: items, lineText: "" };
};
/**
 * Detects \end{...} for the current opaque env (stack top).
 * - If not found, appends the full raw line (keeps indentation) as opaque text.
 * - If found, appends up to end marker, pops stack, and returns tail (if any).
 *
 * @returns Updated { handled, stack, items, lineText }.
 */
var handleLstEndInline = function (lineText, stack, items, nextLine, state) {
    var _a;
    var top = stack[stack.length - 1];
    if (!top) {
        return { handled: false, stack: stack, items: items, lineText: lineText };
    }
    var endRe = END_OPAQUE_ENV_RE[top];
    endRe.lastIndex = 0;
    var me = endRe.exec(lineText);
    if (!me) {
        // still inside opaque env → append raw line with indentation
        var rawLine = state.src.slice(state.bMarks[nextLine], state.eMarks[nextLine]);
        items = (0, latex_list_items_1.ItemsAddToPrev)(items, rawLine, nextLine);
        return { handled: true, stack: stack, items: items, lineText: lineText };
    }
    var endIndex = me.index;
    var endToken = lineText.slice(endIndex, endIndex + me[0].length);
    var beforeEnd = lineText.slice(0, endIndex);
    var afterEnd = lineText.slice(endIndex + me[0].length);
    // Append code continuation
    if (beforeEnd.length > 0) {
        var glue = top === "lstlisting" ? "\n" : "";
        items = (0, latex_list_items_1.ItemsAddToPrev)(items, beforeEnd + glue + endToken, nextLine);
    }
    else {
        items = (0, latex_list_items_1.ItemsAddToPrev)(items, endToken, nextLine);
    }
    // pop matching env
    stack = stack.slice(0, -1);
    // If nothing meaningful after end tag, consume line
    if (!((_a = afterEnd === null || afterEnd === void 0 ? void 0 : afterEnd.trim()) === null || _a === void 0 ? void 0 : _a.length)) {
        return { handled: true, stack: stack, items: items, lineText: "" };
    }
    // return remainder to be parsed normally
    return { handled: false, stack: stack, items: items, lineText: afterEnd };
};
/**
 * Processes "opaque" inline environments inside list parsing (currently: tabular, lstlisting).
 *
 * The function may:
 * - fully consume the current source line (appending it to `items` as raw text), OR
 * - close an opaque env and return a remaining tail to be parsed again on the same line
 *   (e.g. `\end{tabular} & \begin{tabular}{l}`).
 *
 * Uses a guard to prevent infinite loops on malformed input.
 */
var processOpaqueLine = function (params) {
    var lineText = params.lineText, stack = params.stack, items = params.items, nextLine = params.nextLine, state = params.state, renderStart = params.renderStart;
    var guard = 0;
    while (guard++ < 50) {
        var top_1 = stack[stack.length - 1];
        if (top_1) {
            // -------- inside opaque --------
            if (top_1 === "tabular") {
                consts_1.END_TABULAR_INLINE_RE.lastIndex = 0;
                consts_1.BEGIN_TABULAR_INLINE_RE.lastIndex = 0;
                var me = consts_1.END_TABULAR_INLINE_RE.exec(lineText);
                var mb = consts_1.BEGIN_TABULAR_INLINE_RE.exec(lineText);
                // close if end exists before begin (or begin missing)
                if (me && (!mb || me.index <= mb.index)) {
                    var endRes_1 = handleLstEndInline(lineText, stack, items, nextLine, state);
                    stack = endRes_1.stack;
                    items = endRes_1.items;
                    if (endRes_1.handled) {
                        return { consumedLine: true, lineText: lineText, stack: stack, items: items };
                    }
                    // got tail → keep parsing same line
                    lineText = endRes_1.lineText;
                    continue;
                }
                // otherwise if begin exists, open nested tabular
                if (mb) {
                    var beginRes_1 = handleLstBeginInline(lineText, stack, items, nextLine, renderStart, consts_1.LATEX_ITEM_COMMAND_INLINE_RE, state);
                    stack = beginRes_1.stack;
                    items = beginRes_1.items;
                    if (beginRes_1.handled) {
                        return { consumedLine: true, lineText: lineText, stack: stack, items: items };
                    }
                    lineText = beginRes_1.lineText;
                    continue;
                }
                // plain opaque line inside tabular:
                // preserve indentation unless this is a tail
                var rawLine = state.src.slice(state.bMarks[nextLine], state.eMarks[nextLine]);
                var rawLineNoIndent = state.src.slice(state.bMarks[nextLine] + state.tShift[nextLine], state.eMarks[nextLine]);
                var toAppend = (lineText !== rawLineNoIndent) ? lineText : rawLine;
                items = (0, latex_list_items_1.ItemsAddToPrev)(items, toAppend, nextLine);
                return { consumedLine: true, lineText: lineText, stack: stack, items: items };
            }
            // other opaque (lstlisting): only try to end
            var endRes = handleLstEndInline(lineText, stack, items, nextLine, state);
            stack = endRes.stack;
            items = endRes.items;
            if (endRes.handled) {
                return { consumedLine: true, lineText: lineText, stack: stack, items: items };
            }
            lineText = endRes.lineText;
            continue;
        }
        // not inside opaque: try to begin
        var beginRes = handleLstBeginInline(lineText, stack, items, nextLine, renderStart, consts_1.LATEX_ITEM_COMMAND_INLINE_RE, state);
        stack = beginRes.stack;
        items = beginRes.items;
        if (beginRes.handled) {
            return { consumedLine: true, lineText: lineText, stack: stack, items: items };
        }
        lineText = beginRes.lineText;
        return { consumedLine: false, lineText: lineText, stack: stack, items: items };
    }
    // safety: if guard exceeded, treat as consumed to avoid infinite loop
    items = (0, latex_list_items_1.ItemsAddToPrev)(items, lineText, nextLine);
    return { consumedLine: true, lineText: lineText, stack: stack, items: items };
};
/**
 * Parse a LaTeX list environment starting at `startLine` and emit tokens into `state`.
 *
 * Notes:
 * - The function is "strict": it returns false if the matching \end{...} is not found.
 * - Works with any StateBlock-like object (real block state or synthetic state for inline reuse).
 *
 * @returns true if the environment was successfully parsed and closed, otherwise false.
 */
var ListsInternal = function (state, startLine, endLine) {
    var e_1, _a, e_2, _b;
    var _c;
    var pos = state.bMarks[startLine] + state.tShift[startLine];
    var max = state.eMarks[startLine];
    var lineText = state.src.slice(pos, max);
    var renderStart = state.md.options.renderElement && state.md.options.renderElement.startLine
        ? Number(state.md.options.renderElement.startLine)
        : 0;
    var oldParentType = state.parentType;
    var enumerateLevelTypes = (0, re_level_1.GetEnumerateLevel)();
    var dataMarkers = (0, re_level_1.GetItemizeLevelTokensByState)(state);
    var itemizeLevelTokens = dataMarkers.tokens;
    var itemizeLevelContents = dataMarkers.contents;
    var nextLine = startLine;
    var li = null;
    // Open list tokens by nesting level (padding → innermost) and every list-open token in doc
    // order (resolved top-down at the end). ListOpen seeds them and handles same-line content.
    var openTokens = [];
    var allListTokens = [];
    var openData = (0, latex_list_tokens_1.ListOpen)(state, startLine + renderStart, lineText, itemizeLevelTokens, enumerateLevelTypes, itemizeLevelContents, openTokens, allListTokens);
    var _d = openData.iOpen, iOpen = _d === void 0 ? 0 : _d, _e = openData.tokenStart, tokenStart = _e === void 0 ? null : _e;
    li = (_c = openData.li) !== null && _c !== void 0 ? _c : null;
    if (iOpen === 0) {
        // A single-line list (\begin…\item…\end on one line) is fully built by ListOpen; resolve here.
        (0, latex_list_items_1.resolveListPadding)(allListTokens);
        nextLine += 1;
        state.line = nextLine;
        state.startLine = startLine;
        state.parentType = oldParentType;
        state.level = state.prentLevel < 0 ? 0 : state.prentLevel;
        return true;
    }
    else {
        nextLine += 1;
    }
    var items = [];
    var haveClose = false;
    var opaqueStack = [];
    var fenceMarker = null;
    var fenceBuffer = [];
    // Process one ordinary (non-fence) list line: opaque envs, \setcounter, inline \begin/\end, \item, content.
    // Returns 'abort' (bail, emit nothing), 'break' (list closed — caller advances past this line) or 'proceed'.
    var processLine = function (lineText, lineIdx) {
        var _a, _b;
        var _c, _d, _e;
        // Handle opaque envs; may consume the line or return a tail to re-parse.
        var opaqueRes = processOpaqueLine({
            lineText: lineText,
            stack: opaqueStack,
            items: items,
            nextLine: lineIdx,
            state: state,
            renderStart: renderStart
        });
        opaqueStack = opaqueRes.stack;
        items = opaqueRes.items;
        lineText = opaqueRes.lineText;
        if (opaqueRes.consumedLine) {
            return 'proceed';
        }
        // Renders to nothing: joins without a break, which survived as an orphan `<br>`. forLatex keeps it.
        if (RENEWCOMMAND_LINE_RE.test(lineText)) {
            items = (0, latex_list_items_1.ItemsAddToPrev)(items, lineText, lineIdx, !!((_c = state.md.options) === null || _c === void 0 ? void 0 : _c.forLatex));
            return 'proceed';
        }
        // Handle \setcounter lines
        if (consts_1.reSetCounter.test(lineText)) {
            var match = lineText.match(consts_1.reSetCounter);
            if (match && ((_d = state.md.options) === null || _d === void 0 ? void 0 : _d.forLatex)) {
                var token = state.push("setcounter", "", 0);
                token.latex = match[0].trim();
            }
            if (match && match[2]) {
                var sE = match.index + match[0].length < lineText.length
                    ? lineText.slice(match.index + match[0].length)
                    : "";
                sE = sE.trim();
                var startNumber = (_e = (0, latex_list_common_1.parseSetCounterNumber)(match)) !== null && _e !== void 0 ? _e : 1;
                li = { value: startNumber };
                if (sE.length > 0) {
                    items = (0, latex_list_items_1.ItemsAddToPrev)(items, sE, lineIdx);
                }
                return 'proceed';
            }
        }
        // Every inline \begin/\end on the line, left to right. Handling only the first left the tail
        // of a collapsed `\end{itemize}\end{itemize}` to ItemsAddToPrev, which drops a pure closer —
        // so the outer list never closed and the strict `!haveClose` bail killed the whole rule.
        var tail = lineText;
        var env = nextListEnvMatch(tail);
        var sawListEnv = !!env;
        while (env) {
            var envMatch = env.match, isEnd = env.isEnd;
            var raw = envMatch[1].trim();
            if (!(0, latex_list_types_1.isListType)(raw)) {
                return 'abort';
            }
            var _f = (0, latex_list_items_1.splitInlineListEnv)(tail, envMatch), sB = _f.sB, sE = _f.sE, isBacktickEscapedPair = _f.isBacktickEscapedPair;
            if (isBacktickEscapedPair) {
                items = (0, latex_list_items_1.ItemsListPush)(items, tail, lineIdx, lineIdx);
                return 'proceed';
            }
            if (sB.length > 0) {
                // A marker here starts its own item, as it does before a wrapper `\begin`: appended to the
                // item above, `\item b \end{itemize}` reached the block path inside a chunk that already
                // held a block env, where only the first marker is read and this one printed as text.
                items = consts_1.LATEX_ITEM_COMMAND_INLINE_RE.test(sB)
                    ? (0, latex_list_items_1.ItemsListPush)(items, sB, lineIdx, lineIdx)
                    : (0, latex_list_items_1.ItemsAddToPrev)(items, sB, lineIdx);
            }
            if (isEnd) {
                // An inline `\end` in the item body may already have popped this list inside
                // finalizeListItems — pop by identity so we never pop a list this `\end` didn't close.
                var closingList = openTokens[openTokens.length - 1];
                (_a = (0, latex_list_items_1.finalizeListItems)(state, items, itemizeLevelTokens, enumerateLevelTypes, li, iOpen, itemizeLevelContents, openTokens, allListTokens), iOpen = _a.iOpen, items = _a.items, li = _a.li);
                (0, latex_list_tokens_1.setTokenCloseList)(state, startLine + renderStart, lineIdx + renderStart);
                if (closingList && openTokens[openTokens.length - 1] === closingList) {
                    openTokens.pop();
                }
                iOpen--;
                if (iOpen <= 0) {
                    // The tail may open a sibling list. Its closer must sit in the tail, or on a later line
                    // ahead of any fence — an unclosed sibling aborts the rule and drops this finished list.
                    var tailEnv = nextListEnvMatch(sE);
                    var siblingClosable = false;
                    if (tailEnv && !tailEnv.isEnd) {
                        // Count, do not just look: a tail opening two levels needs two closers. Offsets only
                        // past this point — a plain closer with nothing behind it is the common case, and the
                        // fence sweep has no earlier warm-up, so it would run per rule entry.
                        var needed = unclosedEnvsIn(sE);
                        if (needed <= 0) {
                            siblingClosable = true;
                        }
                        else {
                            var lineEnd = state.eMarks[lineIdx];
                            var closers = listCloserOffsets(state);
                            // Only closers before the next fence opener count: one written inside code is text.
                            var nextFence = (0, src_pos_cache_1.firstPositionAtOrAfter)(fenceOpenOffsets(state), lineEnd);
                            var ahead = (0, src_pos_cache_1.countPositionsAtOrAfter)(closers, lineEnd) -
                                (nextFence < 0 ? 0 : (0, src_pos_cache_1.countPositionsAtOrAfter)(closers, nextFence));
                            siblingClosable = ahead >= needed;
                        }
                    }
                    if (siblingClosable) {
                        // The outermost list closed, so the sibling opens outside any list: applyListCloseState
                        // leaves `parentType` set, which would make it read as nested and lose 2.5em of indent.
                        state.parentType = oldParentType;
                    }
                    if (!siblingClosable) {
                        if (sE.length > 0) {
                            items = (0, latex_list_items_1.ItemsAddToPrev)(items, sE, lineIdx);
                        }
                        haveClose = true;
                        return 'break';
                    }
                }
            }
            else {
                var beginType = raw;
                (_b = (0, latex_list_items_1.finalizeListItems)(state, items, itemizeLevelTokens, enumerateLevelTypes, li, iOpen, itemizeLevelContents, openTokens, allListTokens), iOpen = _b.iOpen, items = _b.items, li = _b.li);
                var nestedOpen = (0, latex_list_tokens_1.setTokenOpenList)(state, -1, -1, beginType, itemizeLevelTokens, enumerateLevelTypes, itemizeLevelContents);
                openTokens.push(nestedOpen);
                allListTokens.push(nestedOpen);
                iOpen++;
                // Every open env needs a closer of its own, and only closers ahead can serve. The sweep
                // over-counts (a `\end` inside a fence is not real), so a `<` here means closure is
                // impossible — without this the walk runs to EOF once per probed line.
                if ((0, src_pos_cache_1.countPositionsAtOrAfter)(listCloserOffsets(state), state.bMarks[lineIdx]) < iOpen) {
                    return 'abort';
                }
            }
            tail = sE;
            env = nextListEnvMatch(tail);
        }
        if (sawListEnv) {
            // What is left after the last env: item text, as the single-pass tail was.
            if (tail.length > 0) {
                items = (0, latex_list_items_1.ItemsAddToPrev)(items, tail, lineIdx);
            }
            return 'proceed';
        }
        // Regular line inside list: either a new \item or continuation
        if (consts_1.LATEX_ITEM_COMMAND_INLINE_RE.test(lineText)) {
            items = (0, latex_list_items_1.ItemsListPush)(items, lineText, lineIdx + renderStart, lineIdx + renderStart);
        }
        else {
            items = (0, latex_list_items_1.ItemsAddToPrev)(items, lineText, lineIdx);
        }
        return 'proceed';
    };
    for (; nextLine < endLine; nextLine++) {
        pos = state.bMarks[nextLine] + state.tShift[nextLine];
        max = state.eMarks[nextLine];
        lineText = state.src.slice(pos, max);
        // Fence: buffer lines; commit raw (indent kept) on close, else replay as content below. Not inside lstlisting/tabular.
        var rawLine = state.src.slice(state.bMarks[nextLine], state.eMarks[nextLine]);
        if (fenceMarker) {
            fenceBuffer.push({ lineText: lineText, rawLine: rawLine, line: nextLine });
            if (isFenceClose(rawLine, fenceMarker)) {
                try {
                    for (var fenceBuffer_1 = (e_1 = void 0, tslib_1.__values(fenceBuffer)), fenceBuffer_1_1 = fenceBuffer_1.next(); !fenceBuffer_1_1.done; fenceBuffer_1_1 = fenceBuffer_1.next()) {
                        var b = fenceBuffer_1_1.value;
                        items = (0, latex_list_items_1.ItemsAddToPrev)(items, b.rawLine, b.line);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (fenceBuffer_1_1 && !fenceBuffer_1_1.done && (_a = fenceBuffer_1.return)) _a.call(fenceBuffer_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                fenceBuffer.length = 0;
                fenceMarker = null;
            }
            continue;
        }
        if (opaqueStack.length === 0) {
            fenceMarker = detectFenceOpen(rawLine);
            if (fenceMarker) {
                fenceBuffer.push({ lineText: lineText, rawLine: rawLine, line: nextLine });
                continue;
            }
        }
        var sig = processLine(lineText, nextLine);
        if (sig === 'abort') {
            return false;
        }
        if (sig === 'break') {
            nextLine += 1;
            break;
        }
    }
    // Unclosed fence: buffered lines are ordinary content — replay them through the normal path.
    if (fenceMarker) {
        fenceMarker = null;
        try {
            for (var fenceBuffer_2 = tslib_1.__values(fenceBuffer), fenceBuffer_2_1 = fenceBuffer_2.next(); !fenceBuffer_2_1.done; fenceBuffer_2_1 = fenceBuffer_2.next()) {
                var b = fenceBuffer_2_1.value;
                var sig = processLine(b.lineText, b.line);
                if (sig === 'abort') {
                    return false;
                }
                if (sig === 'break') {
                    nextLine = b.line + 1;
                    break;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (fenceBuffer_2_1 && !fenceBuffer_2_1.done && (_b = fenceBuffer_2.return)) _b.call(fenceBuffer_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        fenceBuffer.length = 0;
    }
    if (!haveClose) {
        // Strict mode: do not emit partial tokens (important for inline env wrapper).
        // No explicit \end{itemize}/\end{enumerate} found — flush remaining items
        return false;
    }
    state.line = nextLine;
    state.startLine = startLine;
    state.parentType = oldParentType;
    state.level = state.prentLevel < 0 ? 0 : state.prentLevel;
    if (tokenStart) {
        tokenStart.map[1] = nextLine + renderStart;
    }
    (0, latex_list_items_1.resolveListPadding)(allListTokens);
    return true;
};
exports.ListsInternal = ListsInternal;
/**
 * Block rule that parses LaTeX list environments:
 *   \begin{itemize} ... \end{itemize}
 *   \begin{enumerate} ... \end{enumerate}
 *
 * It:
 *  - detects list begin/end commands,
 *  - collects and splits \item content into logical items,
 *  - handles \setcounter and nested lists on the same line,
 *  - emits corresponding *_list_open, *_list_close, and list item tokens.
 */
var Lists = function (state, startLine, endLine, silent) {
    var pos = state.bMarks[startLine] + state.tShift[startLine];
    var max = state.eMarks[startLine];
    // Fast bail without allocating a substring: a list env line must start with '\'.
    if (pos >= max || state.src.charCodeAt(pos) !== 0x5c /* '\' */) {
        return false;
    }
    var lineText = state.src.slice(pos, max);
    var match = lineText.match(consts_1.BEGIN_LIST_ENV_RE);
    if (!match) {
        return false;
    }
    var typeList = match[1].trim();
    if (!(0, latex_list_types_1.isListType)(typeList)) {
        return false;
    }
    // No closer left in the source: the strict rule can only answer false, so skip the parse.
    if (lastListEndPos(state) < state.bMarks[startLine]) {
        return false;
    }
    // No memo of probe answers: the closer lookahead above and the depth check inside the body walk
    // made repeated probes cheap enough that caching them measured slower on every shape, malformed
    // included — and a memo key has to enumerate every input the answer depends on to stay correct.
    // `bufferedState` shares `env` by prototype, so ListsInternal mutates the real env. One snapshot
    // of the whole env serves both restores below — naming keys instead would miss whatever a rule
    // reachable from the body writes. The body also bumps the module-global caption counters.
    var captionSnap = (0, caption_counters_1.getCaptionCounters)();
    var envSnap = (0, env_transient_1.snapshotEnvAll)(state.env);
    // A discarded parse enters a level per `\begin` and, having no `\end`, never leaves it — without
    // this the depth grows with the number of probes, not with the real nesting.
    var listLevelSnap = (0, list_state_1.snapshotListLevels)();
    var committed = false;
    try {
        var bufferedState = (0, latex_list_env_engine_1.createBufferedState)(state);
        var ok = (0, exports.ListsInternal)(bufferedState, startLine, endLine);
        if (!ok || silent) {
            return ok;
        }
        // Set before flushing: once tokens (carrying caption numbers) start entering state,
        // a mid-flush throw must not roll the counters back out from under them.
        committed = true;
        (0, latex_list_env_engine_1.flushBufferedTokens)(state, bufferedState.tokens);
        state.line = bufferedState.line;
        state.startLine = bufferedState.startLine;
        state.parentType = bufferedState.parentType;
        state.level = bufferedState.level;
        state.prentLevel = bufferedState.prentLevel;
        // No `types` copy-back: a committed list is balanced, so the walk already popped what it pushed.
        return true;
    }
    catch (e) {
        // A failed rule does not apply. Past the commit point tokens are already in state — nothing to
        // fall back to, so that one case propagates.
        if (committed) {
            throw e;
        }
        (0, latex_list_env_engine_1.warnListRuleFailed)(e);
        return false;
    }
    finally {
        if (!committed) {
            (0, caption_counters_1.setCaptionCounters)(captionSnap);
            (0, list_state_1.restoreListLevels)(listLevelSnap);
        }
        // Transient flags go back even on commit: a leaked isBlock=true wakes the inline fallback on the
        // next block (empty `<>` items). Everything else only when the tokens are discarded.
        (0, env_transient_1.restoreEnvKeysFromAll)(state.env, env_transient_1.LIST_TRANSIENT_ENV_KEYS, envSnap);
        if (!committed) {
            (0, env_transient_1.restoreEnvAll)(state.env, envSnap);
        }
        (0, env_transient_1.releaseEnvSnapshot)();
    }
};
exports.Lists = Lists;
//# sourceMappingURL=latex-list-env-block.js.map