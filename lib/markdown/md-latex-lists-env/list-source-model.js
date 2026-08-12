"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firstUsableCloser = exports.nextListEnvMatch = exports.hasCloserAhead = exports.closersLeftAfter = exports.absoluteOffsetOf = exports.wrapperBeginAt = exports.pairArgumentSpans = exports.lastListEndPos = exports.listCloserOffsets = exports.unclosedEnvsIn = exports.splitInlineListEnv = void 0;
var tslib_1 = require("tslib");
var list_state_1 = require("./list-state");
var src_pos_cache_1 = require("../common/src-pos-cache");
var verbatim_ranges_1 = require("../common/verbatim-ranges");
var consts_1 = require("../common/consts");
// What the list rule knows about its source text, and nothing about tokens: where content is verbatim,
// where a command argument spans, whether a closer is structural, whether a wrapper can reach its own.
// One model, so the readers that ask these questions cannot drift apart — each one that did cost an item.
// Outermost command-argument spans, ascending.
var ARG_SPANS_KEY = Symbol('mmd.argumentSpans');
var VERBATIM_KEY = Symbol('mmd.verbatimRanges');
// Built from the unanchored env regexes, so a sweep cannot drift from what the parser accepts.
var END_LIST_ENV_SWEEP_G = new RegExp(consts_1.END_LIST_ENV_INLINE_RE.source, 'g');
var BEGIN_LIST_ENV_SWEEP_G = new RegExp(consts_1.BEGIN_LIST_ENV_INLINE_RE.source, 'g');
/** Text around an inline transition. A transition with a backtick on both sides sits in a code span,
 *  and the parse loop leaves the whole line to the inline path when it meets one. */
var splitInlineListEnv = function (lineText, match) {
    var sB = match.index > 0 ? lineText.slice(0, match.index).trim() : "";
    var sE = match.index + match[0].length < lineText.length
        ? lineText.slice(match.index + match[0].length).trim()
        : "";
    var isBacktickEscapedPair = sB.includes("`") && sE.includes("`");
    return { sB: sB, sE: sE, isBacktickEscapedPair: isBacktickEscapedPair };
};
exports.splitInlineListEnv = splitInlineListEnv;
// How many envs a line's tail leaves open: positive means it needs that many closers from ahead.
// Counted by walking the tail as the parse loop does — a plain text count called a closer in a code
// span real, and the loop then opened a sibling it could never close.
var unclosedEnvsIn = function (s) {
    var depth = 0;
    var tail = s;
    var env = (0, exports.nextListEnvMatch)(tail);
    while (env) {
        var split = (0, exports.splitInlineListEnv)(tail, env.match);
        if (split.isBacktickEscapedPair) {
            break;
        }
        depth += env.isEnd ? -1 : 1;
        tail = split.sE;
        env = (0, exports.nextListEnvMatch)(tail);
    }
    return depth;
};
exports.unclosedEnvsIn = unclosedEnvsIn;
// Offsets of every closer: the last one answers the early bail, the whole list feeds the depth check
// inside the body walk. Cached on the state the rule receives — the buffered state reads it through
// the prototype, so the sweep runs once per document rather than once per probe.
var LIST_END_OFFSETS_KEY = Symbol('mmd.listEndOffsets');
var CLOSER_SUFFIX_KEY = Symbol('mmd.closerSuffix');
var OPENER_SUFFIX_KEY = Symbol('mmd.openerSuffix');
var listCloserOffsets = function (state) {
    return (0, src_pos_cache_1.matchPositionsCached)(state, LIST_END_OFFSETS_KEY, END_LIST_ENV_SWEEP_G);
};
exports.listCloserOffsets = listCloserOffsets;
var lastListEndPos = function (state) {
    var offsets = (0, exports.listCloserOffsets)(state);
    return offsets.length ? offsets[offsets.length - 1] : -1;
};
exports.lastListEndPos = lastListEndPos;
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
// Global clones of the same patterns, for a scan that resumes past a closer it rejected.
// Clones, not the shared originals: a scan here returns mid-loop and leaves `lastIndex` set, and the
// verbatim check it calls on the way execs the originals.
var END_OPAQUE_ENV_SEARCH_G = Object.freeze(Object.keys(END_OPAQUE_ENV_RE).reduce(function (acc, name) {
    acc[name] = new RegExp(END_OPAQUE_ENV_RE[name].source, 'g');
    return acc;
}, {}));
var LIST_BEGIN_OFFSETS_KEY = Symbol('mmd.listBeginOffsets');
var listOpenerOffsets = function (state) {
    return (0, src_pos_cache_1.matchPositionsCached)(state, LIST_BEGIN_OFFSETS_KEY, BEGIN_LIST_ENV_SWEEP_G);
};
// Outermost `{}` pairs in one pass; a `{` that never closes stays on the stack and yields no span.
// Calling findEndMarker per brace rescanned the tail — `n^1.9` measured on a run of unmatched `{`.
// Every balanced pair, the env name in `\end{itemize}` included. Exported to be tested directly.
var pairArgumentSpans = function (text, verbatim) {
    var e_1, _a;
    var spans = [];
    var open = [];
    var range = 0;
    for (var i = 0; i < text.length; i++) {
        var chr = text[i];
        if (chr !== '{' && chr !== '}' && chr !== '\\') {
            continue;
        }
        // Verbatim is text: skip it whole. Before the escape check, or a `\` ending a range escapes past it.
        while (range < verbatim.length && verbatim[range][1] <= i) {
            range++;
        }
        if (range < verbatim.length && i >= verbatim[range][0]) {
            i = verbatim[range][1] - 1;
            continue;
        }
        if (chr === '\\') {
            i++; // an escaped brace opens and closes nothing
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
// Text, not structure: code, math, or a command argument. One predicate, so no reader asks half of it.
var writtenAsText = function (state, at) {
    return (0, verbatim_ranges_1.isInsideRanges)(argumentSpansOf(state), at) || insideVerbatim(state, at);
};
// Is a closer in `[from, to)` ours? `\item b \end{itemize}` ends the list, `\caption{x \end{itemize} y}`
// is text. Order decides, not counts: one closer and one opener balance out on a tally, yet a closer
// standing first is still ours. Offsets and spans are ascending, so one merge walk answers it.
var closesOurListWithin = function (state, from, to) {
    var closerOffsets = (0, exports.listCloserOffsets)(state);
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
        // A balanced pair around it outranks conservatism: a `{` left open earlier may sit in math or code,
        // where it opens nothing.
        if ((0, verbatim_ranges_1.isInsideRanges)(spans, at) || insideVerbatim(state, at)) {
            continue;
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
exports.wrapperBeginAt = wrapperBeginAt;
// Where `match` sits in the source: `lineText` is a suffix of its line, so the line's end anchors it.
var absoluteOffsetOf = function (state, line, lineText, index, text) {
    var at = state.eMarks[line] - lineText.length + index;
    // -1 when the anchor does not hold; each caller decides what that means.
    return state.src.slice(at, at + text.length) === text ? at : -1;
};
exports.absoluteOffsetOf = absoluteOffsetOf;
// How many of `all` from index `i` on are structural, cached per source: a walk per wrapper made a
// document of them super-linear — 1600 units went 2.25× slower than `master` before this.
var structuralSuffix = function (state, all, key) {
    return (0, src_pos_cache_1.srcValueCached)(state, key, function () {
        var spans = argumentSpansOf(state);
        var suffix = new Int32Array(all.length + 1);
        for (var i = all.length - 1; i >= 0; i--) {
            var structural = !(0, verbatim_ranges_1.isInsideRanges)(spans, all[i]) && !insideVerbatim(state, all[i]);
            suffix[i] = suffix[i + 1] + (structural ? 1 : 0);
        }
        return suffix;
    });
};
// Structural (not text) offsets of `all` inside `[from, to)`, as a difference of two suffix counts.
// Private: the suffix is cached under `key` but built from `all`, so only this module pairs the two.
var structuralCountIn = function (state, all, key, from, to) {
    var suffix = structuralSuffix(state, all, key);
    var startAt = all.length - (0, src_pos_cache_1.countPositionsAtOrAfter)(all, from);
    var endAt = all.length - (0, src_pos_cache_1.countPositionsAtOrAfter)(all, to);
    return suffix[startAt] - suffix[endAt];
};
// How many of the open lists the source past `at` can still close: structural closers there minus the
// openers that claim them, since a closer of a list opened after the wrapper is not ours to use.
var closersLeftAfter = function (state, at) {
    return structuralCountIn(state, (0, exports.listCloserOffsets)(state), CLOSER_SUFFIX_KEY, at, Infinity)
        - structuralCountIn(state, listOpenerOffsets(state), OPENER_SUFFIX_KEY, at, Infinity);
};
exports.closersLeftAfter = closersLeftAfter;
// Opening a wrapper as opaque swallows every line until its closer, so require one it can reach.
// Reaching past a closer of our own list swallowed it too, and the whole list then printed as
// literal LaTeX — that closer may be the last thing on its line, so position cannot decide it.
var hasCloserAhead = function (state, from, name) {
    var sweep = WRAPPER_END_SWEEP_G[name];
    var key = WRAPPER_END_OFFSETS_KEYS[name];
    if (!sweep || !key) {
        return false;
    }
    var offsets = (0, src_pos_cache_1.matchPositionsCached)(state, key, sweep);
    // Every closer ahead, not just the first: one written as text — in code, math or an argument — left
    // the wrapper transparent while a real closer stood below.
    for (var i = offsets.length - (0, src_pos_cache_1.countPositionsAtOrAfter)(offsets, from); i < offsets.length; i++) {
        var at = offsets[i];
        if (writtenAsText(state, at)) {
            continue;
        }
        // Swallowing our closer is allowed when the source past the wrapper still closes the open lists and
        // no list starts inside it — eating another list's `\begin` would lose that list. A closer farther
        // out swallows a superset, so failing here ends the search rather than moving it along.
        if (closesOurListWithin(state, from, at)) {
            var opensInside = structuralCountIn(state, listOpenerOffsets(state), OPENER_SUFFIX_KEY, from, at);
            // The live count, not this source's own depth: an ambient list from an outer parse still needs closing.
            if (opensInside > 0 || (0, exports.closersLeftAfter)(state, at) < Math.max(1, (0, list_state_1.getOpenListCount)())) {
                return false;
            }
        }
        return true;
    }
    return false;
};
exports.hasCloserAhead = hasCloserAhead;
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
exports.nextListEnvMatch = nextListEnvMatch;
// The first closer in `text` that is not written in code, or null. A wrapper's closer inside a fence, an
// `lstlisting` or a code span is content — and a later one on the same line is still its closer.
var firstUsableCloser = function (state, line, text, env, skipCodeClosers) {
    var checkVerbatim = skipCodeClosers && WRAPPER_ENV_NAMES.indexOf(env) >= 0;
    // Global, so a skipped closer costs no slice of the rest of the line.
    var scan = END_OPAQUE_ENV_SEARCH_G[env];
    scan.lastIndex = 0;
    var found;
    while ((found = scan.exec(text)) !== null) {
        // Unanchored (-1) counts as structure: the closer is taken, as it was before the ranges existed.
        var at = checkVerbatim
            ? (0, exports.absoluteOffsetOf)(state, line, text, found.index, found[0])
            : -1;
        if (at < 0 || !writtenAsText(state, at)) {
            return { index: found.index, length: found[0].length };
        }
    }
    return null;
};
exports.firstUsableCloser = firstUsableCloser;
//# sourceMappingURL=list-source-model.js.map