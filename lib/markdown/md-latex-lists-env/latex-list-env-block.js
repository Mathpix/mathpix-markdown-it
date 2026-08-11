"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lists = exports.ListsInternal = exports.pairArgumentSpans = void 0;
var tslib_1 = require("tslib");
var latex_list_tokens_1 = require("./latex-list-tokens");
var latex_list_items_1 = require("./latex-list-items");
var re_level_1 = require("./re-level");
var latex_list_types_1 = require("./latex-list-types");
var latex_list_common_1 = require("./latex-list-common");
var list_state_1 = require("./list-state");
var caption_counters_1 = require("../common/caption-counters");
var src_pos_cache_1 = require("../common/src-pos-cache");
var verbatim_ranges_1 = require("../common/verbatim-ranges");
var env_transient_1 = require("../common/env-transient");
var latex_list_env_engine_1 = require("./latex-list-env-engine");
var warn_distinct_1 = require("../common/warn-distinct");
var consts_1 = require("../common/consts");
// Outermost command-argument spans, ascending.
var ARG_SPANS_KEY = Symbol('mmd.argumentSpans');
var VERBATIM_KEY = Symbol('mmd.verbatimRanges');
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
var lastListEndPos = function (state) {
    var offsets = listCloserOffsets(state);
    return offsets.length ? offsets[offsets.length - 1] : -1;
};
// Wrapper names: the shared table minus the two that bring their own detection. Everything below is
// derived from it, so a name added there cannot silently miss the guard.
var WRAPPER_ENV_NAMES = Object.freeze(consts_1.LATEX_BLOCK_ENV_NAMES.filter(function (name) { return name !== 'tabular' && name !== 'lstlisting'; }));
// Closer offsets per wrapper name, cached like the list sweeps: no scan of the source tail per
// `\begin`, which was O(remainder) on every occurrence.
var WRAPPER_END_SWEEP_G = Object.freeze(WRAPPER_ENV_NAMES.reduce(function (acc, name) {
    acc[name] = new RegExp('\\\\end\\{' + name + '\\}', 'g');
    return acc;
}, {}));
var WRAPPER_END_OFFSETS_KEYS = Object.freeze(WRAPPER_ENV_NAMES.reduce(function (acc, name) {
    acc[name] = Symbol('mmd.end_' + name);
    return acc;
}, {}));
// Closer per opaque env: the stack top picks its own, so a nested `\end{tabular}` is raw content
// inside a `table` rather than its closer. The two with their own patterns are named, the rest derived.
var END_OPAQUE_ENV_RE = Object.freeze(WRAPPER_ENV_NAMES.reduce(function (acc, name) {
    acc[name] = new RegExp('\\\\end\\{' + name + '\\}');
    return acc;
}, { lstlisting: consts_1.END_LST_INLINE_RE, tabular: consts_1.END_TABULAR_INLINE_RE }));
var LIST_BEGIN_OFFSETS_KEY = Symbol('mmd.listBeginOffsets');
var listOpenerOffsets = function (state) {
    return (0, src_pos_cache_1.matchPositionsCached)(state, LIST_BEGIN_OFFSETS_KEY, BEGIN_LIST_ENV_SWEEP_G);
};
// Outermost `{}` pairs in one pass; a `{` that never closes stays on the stack and yields no span.
// Calling findEndMarker per brace rescanned the tail — `n^1.9` measured on a run of unmatched `{`.
// Exported to be tested directly: its ascending, non-overlapping output is what the span search assumes.
var pairArgumentSpans = function (text, verbatim) {
    var e_1, _a;
    var spans = [];
    var open = [];
    var range = 0;
    for (var i = 0; i < text.length; i++) {
        var chr = text[i];
        if (chr === '\\') {
            // Before the verbatim skip, so a `\` just outside a range consumes its first character.
            i++; // an escaped brace opens and closes nothing
            continue;
        }
        if (chr !== '{' && chr !== '}') {
            continue;
        }
        // A fenced block or an `lstlisting` is text: skip it whole rather than pair inside it.
        while (range < verbatim.length && verbatim[range][1] <= i) {
            range++;
        }
        if (range < verbatim.length && i >= verbatim[range][0]) {
            i = verbatim[range][1] - 1;
            continue;
        }
        if (chr === '{') {
            open.push(i);
            continue;
        }
        var from = open.pop();
        if (from !== undefined) {
            spans.push([from, i]); // every pair: depth 1 alone would lose all pairs under a stray `{`
        }
    }
    // Keep the outermost, as findEndMarker returned; ascending, so the span search stays a binary one.
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
exports.pairArgumentSpans = pairArgumentSpans;
var verbatimRangesOf = function (state) {
    return (0, src_pos_cache_1.srcValueCached)(state, VERBATIM_KEY, verbatim_ranges_1.findVerbatimRanges);
};
// Both are cached per source, and the pairing reads the ranges rather than finding them again.
var argumentSpansOf = function (state) {
    return (0, src_pos_cache_1.srcValueCached)(state, ARG_SPANS_KEY, function (src) { return (0, exports.pairArgumentSpans)(src, verbatimRangesOf(state)); });
};
var insideVerbatim = function (state, at) {
    return (0, verbatim_ranges_1.isInsideRanges)(verbatimRangesOf(state), at);
};
// Is a closer in `[from, to)` ours? `\item b \end{itemize}` ends the list, `\caption{x \end{itemize} y}`
// is text. Order decides, not counts: one closer and one opener balance out on a tally, yet a closer
// standing first is still ours. Offsets and spans are ascending, so one merge walk answers it.
var closesOurListWithin = function (state, from, to) {
    var closerOffsets = listCloserOffsets(state);
    var closersAhead = (0, src_pos_cache_1.countPositionsAtOrAfter)(closerOffsets, from)
        - (0, src_pos_cache_1.countPositionsAtOrAfter)(closerOffsets, to);
    if (closersAhead <= 0) {
        return false;
    }
    var openerOffsets = listOpenerOffsets(state);
    var openersAhead = (0, src_pos_cache_1.countPositionsAtOrAfter)(openerOffsets, from)
        - (0, src_pos_cache_1.countPositionsAtOrAfter)(openerOffsets, to);
    var spans = argumentSpansOf(state);
    var closer = closerOffsets.length - (0, src_pos_cache_1.countPositionsAtOrAfter)(closerOffsets, from);
    var opener = openerOffsets.length - (0, src_pos_cache_1.countPositionsAtOrAfter)(openerOffsets, from);
    var span = 0;
    var depth = 0;
    for (var step = 0; step < closersAhead + openersAhead; step++) {
        var nextCloser = closer < closerOffsets.length ? closerOffsets[closer] : Infinity;
        var nextOpener = opener < openerOffsets.length ? openerOffsets[opener] : Infinity;
        var isCloser = nextCloser <= nextOpener;
        var at = isCloser ? nextCloser : nextOpener;
        if (isCloser) {
            closer++;
        }
        else {
            opener++;
        }
        while (span < spans.length && spans[span][1] < at) {
            span++;
        }
        // A balanced pair around it is knowledge, and it outranks the conservatism below: the `{` left open
        // earlier may sit in math or code, where it opens nothing.
        if (span < spans.length && at > spans[span][0] && at < spans[span][1]) {
            continue; // inside a command argument: text, not structure
        }
        if (insideVerbatim(state, at)) {
            continue; // written in code or math: text, whatever the braces say
        }
        depth += isCloser ? -1 : 1;
        if (depth < 0) {
            return true;
        }
    }
    return false;
};
// The first wrapper opening on this line, or null. Asking for the first block env instead let a
// `\begin{tabular}` ahead of it decide the answer, by where it sits in the shared name list.
var WRAPPER_BEGIN_SWEEP_G = new RegExp(consts_1.LATEX_BLOCK_ENV_OPEN_RE.source, 'g');
var wrapperBeginAt = function (lineText) {
    WRAPPER_BEGIN_SWEEP_G.lastIndex = 0;
    var mb = WRAPPER_BEGIN_SWEEP_G.exec(lineText);
    while (mb) {
        if (WRAPPER_ENV_NAMES.indexOf(mb[1]) >= 0) {
            return mb;
        }
        mb = WRAPPER_BEGIN_SWEEP_G.exec(lineText);
    }
    return null;
};
// Where `match` sits in the source: `lineText` is a suffix of its line, so the line's end anchors it.
var absoluteOffsetOf = function (state, line, lineText, match) {
    var at = state.eMarks[line] - lineText.length + match.index;
    // Past the end when it does not: the guard then finds no closer and declines, the safe side.
    return state.src.slice(at, at + match[0].length) === match[0] ? at : state.src.length;
};
// Structural (not text) offsets of `all` inside `[from, to)`.
var structuralCountIn = function (state, all, from, to) {
    var spans = argumentSpansOf(state);
    var found = 0;
    for (var i = all.length - (0, src_pos_cache_1.countPositionsAtOrAfter)(all, from); i < all.length; i++) {
        if (all[i] >= to) {
            break;
        }
        if (!(0, verbatim_ranges_1.isInsideRanges)(spans, all[i]) && !insideVerbatim(state, all[i])) {
            found++;
        }
    }
    return found;
};
// How many of the open lists the source past `at` can still close: structural closers there minus the
// openers that claim them, since a closer of a list opened after the wrapper is not ours to use.
var closersLeftAfter = function (state, at) {
    return structuralCountIn(state, listCloserOffsets(state), at, Infinity)
        - structuralCountIn(state, listOpenerOffsets(state), at, Infinity);
};
// Opening a wrapper as opaque swallows every line until its closer, so require one it can reach.
// Reaching past a closer of our own list swallowed it too, and the whole list then printed as
// literal LaTeX — that closer may be the last thing on its line, so position cannot decide it.
var hasCloserAhead = function (state, from, name) {
    var sweep = WRAPPER_END_SWEEP_G[name];
    var key = WRAPPER_END_OFFSETS_KEYS[name];
    if (!sweep || !key) {
        return false;
    }
    var at = (0, src_pos_cache_1.firstPositionAtOrAfter)((0, src_pos_cache_1.matchPositionsCached)(state, key, sweep), from);
    if (at < 0) {
        return false;
    }
    // Swallowing our closer is allowed when the source past the wrapper still closes the open lists and
    // no list starts inside it — eating another list's `\begin` would lose that list.
    if (closesOurListWithin(state, from, at)) {
        var opensInside = structuralCountIn(state, listOpenerOffsets(state), from, at);
        // The live count, not this source's own depth: an ambient list from an outer parse still needs closing.
        if (opensInside > 0 || closersLeftAfter(state, at) < Math.max(1, (0, list_state_1.getOpenListCount)())) {
            return false;
        }
    }
    // A closer inside a fenced block or an `lstlisting` is text. Asked of the ranges, so a closed block
    // before it leaves the closer usable.
    return !insideVerbatim(state, at);
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
// Opens `openedType` and decides in one place whether it closes on this same line — the nested-tabular
// branch skipped that check, so its one-line form left the stack open for good.
var openOpaqueEnv = function (stack, items, openedType, afterBegin, nextLine) {
    stack = tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(stack), false), [openedType], false);
    var endRe = END_OPAQUE_ENV_RE[openedType];
    var meSameLine = endRe.exec(afterBegin);
    if (!meSameLine) {
        // `lineText` is a tail for the caller to re-parse, so it is only read when `handled` is false.
        return { handled: true, stack: stack, items: (0, latex_list_items_1.ItemsAddToPrev)(items, afterBegin, nextLine), lineText: '' };
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
        if (prefix.length > 0) {
            items = (0, latex_list_items_1.ItemsAddToPrev)(items, prefix, nextLine);
        }
        return openOpaqueEnv(stack, items, "tabular", lineText.slice(mbTab.index), nextLine);
    }
    // A wrapper opens only when its closer is ahead of the `\begin` itself: an `\end{X}` left of it read
    // as reachable and cost the whole list.
    var mbWrapRaw = wrapperBeginAt(lineText);
    var mbWrap = mbWrapRaw && hasCloserAhead(state, absoluteOffsetOf(state, nextLine, lineText, mbWrapRaw), mbWrapRaw[1])
        ? mbWrapRaw
        : null;
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
    return openOpaqueEnv(stack, items, openedType, afterBegin, nextLine);
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
 * Each pass hands back a shorter tail, so malformed input cannot spin here.
 */
var processOpaqueLine = function (params) {
    var lineText = params.lineText, stack = params.stack, items = params.items, nextLine = params.nextLine, state = params.state, renderStart = params.renderStart;
    // Termination is structural: every branch that keeps going hands back a shorter tail, so the loop
    // ends when it stops shrinking. No step count — the number of envs on a line is the input's business.
    var remaining = lineText.length + 1;
    while (lineText.length < remaining) {
        remaining = lineText.length;
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
    // Unreachable today: every branch returns or shrinks the tail. Asserts that, rather than guarding it.
    (0, warn_distinct_1.warnDistinct)('opaque-stall:' + stack.join('>'), '[list-env] an opaque line stopped shrinking; the tail is taken as text');
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
    var e_2, _a, e_3, _b;
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
    var listFrom = state.tokens.length;
    var openData = (0, latex_list_tokens_1.ListOpen)(state, startLine + renderStart, lineText, itemizeLevelTokens, enumerateLevelTypes, itemizeLevelContents, openTokens, allListTokens);
    var _d = openData.iOpen, iOpen = _d === void 0 ? 0 : _d, _e = openData.tokenStart, tokenStart = _e === void 0 ? null : _e;
    li = (_c = openData.li) !== null && _c !== void 0 ? _c : null;
    if (iOpen === 0) {
        // A single-line list (\begin…\item…\end on one line) is fully built by ListOpen; resolve here.
        (0, latex_list_tokens_1.absorbSublistIntoWrapper)(state.tokens, listFrom);
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
        if (consts_1.RENEWCOMMAND_LINE_RE.test(lineText)) {
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
            // Defensive: the patterns match `itemize|enumerate` only, so this fires only if one widens.
            if (!(0, latex_list_types_1.isListType)(raw)) {
                return 'abort';
            }
            var _f = (0, latex_list_items_1.splitInlineListEnv)(tail, envMatch), sB = _f.sB, sE = _f.sE, isBacktickEscapedPair = _f.isBacktickEscapedPair;
            if (isBacktickEscapedPair) {
                items = (0, latex_list_items_1.ItemsListPush)(items, tail, lineIdx, lineIdx);
                return 'proceed';
            }
            if (sB.length > 0) {
                // Any inline transition, not only one before a wrapper: appended to the item above, a marker
                // reached the block path in a chunk that already held a block env, where it printed as text.
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
                    // The line it closed on, so its `map` spans what it holds rather than a single line.
                    if (closingList.map) {
                        closingList.map[1] = Math.max(closingList.map[1], lineIdx + renderStart + 1);
                    }
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
                            // Only closers outside verbatim content count: one written in code is text. Stops at
                            // `needed`, so a document full of closers is not walked for nothing.
                            var ahead = 0;
                            for (var k = closers.length - (0, src_pos_cache_1.countPositionsAtOrAfter)(closers, lineEnd); k < closers.length && ahead < needed; k++) {
                                if (!insideVerbatim(state, closers[k])) {
                                    ahead++;
                                }
                            }
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
                // Real lines, or line numbering emits a bare class; the end is written when this list closes.
                // `state.startLine` is put back: items read it for `parentStart`, which is the list they sit in.
                var parentStartLine = state.startLine;
                var nestedOpen = (0, latex_list_tokens_1.setTokenOpenList)(state, lineIdx + renderStart, lineIdx + renderStart + 1, beginType, itemizeLevelTokens, enumerateLevelTypes, itemizeLevelContents);
                state.startLine = parentStartLine;
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
            if ((0, verbatim_ranges_1.isFenceClose)(rawLine, fenceMarker)) {
                try {
                    for (var fenceBuffer_1 = (e_2 = void 0, tslib_1.__values(fenceBuffer)), fenceBuffer_1_1 = fenceBuffer_1.next(); !fenceBuffer_1_1.done; fenceBuffer_1_1 = fenceBuffer_1.next()) {
                        var b = fenceBuffer_1_1.value;
                        items = (0, latex_list_items_1.ItemsAddToPrev)(items, b.rawLine, b.line);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (fenceBuffer_1_1 && !fenceBuffer_1_1.done && (_a = fenceBuffer_1.return)) _a.call(fenceBuffer_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                fenceBuffer.length = 0;
                fenceMarker = null;
            }
            continue;
        }
        if (opaqueStack.length === 0) {
            fenceMarker = (0, verbatim_ranges_1.detectFenceOpen)(rawLine);
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
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (fenceBuffer_2_1 && !fenceBuffer_2_1.done && (_b = fenceBuffer_2.return)) _b.call(fenceBuffer_2);
            }
            finally { if (e_3) throw e_3.error; }
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
    (0, latex_list_tokens_1.absorbSublistIntoWrapper)(state.tokens, listFrom);
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
    // Probe answers are not memoised: it measured slower on every shape (see the spec).
    // `bufferedState` shares `env` by prototype, so ListsInternal mutates the real env: one whole-env
    // snapshot serves both restores below, naming keys would miss what a rule in the body writes.
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