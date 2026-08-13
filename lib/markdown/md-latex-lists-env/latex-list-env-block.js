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
var verbatim_ranges_1 = require("../common/verbatim-ranges");
var env_transient_1 = require("../common/env-transient");
var latex_list_env_engine_1 = require("./latex-list-env-engine");
var latex_list_opaque_1 = require("./latex-list-opaque");
var consts_1 = require("../common/consts");
var list_source_model_1 = require("./list-source-model");
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
        var opaqueRes = (0, latex_list_opaque_1.processOpaqueLine)({
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
        var env = (0, list_source_model_1.nextListEnvMatch)(tail);
        var sawListEnv = !!env;
        while (env) {
            var envMatch = env.match, isEnd = env.isEnd;
            var raw = envMatch[1].trim();
            // Defensive: the patterns match `itemize|enumerate` only, so this fires only if one widens.
            if (!(0, latex_list_types_1.isListType)(raw)) {
                return 'abort';
            }
            var _f = (0, list_source_model_1.splitInlineListEnv)(tail, envMatch), sB = _f.sB, sE = _f.sE, isBacktickEscapedPair = _f.isBacktickEscapedPair;
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
                (0, latex_list_tokens_1.setTokenCloseList)(state, startLine + renderStart, lineIdx + renderStart, closingList);
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
                    var tailEnv = (0, list_source_model_1.nextListEnvMatch)(sE);
                    var siblingClosable = false;
                    if (tailEnv && !tailEnv.isEnd) {
                        // Count, do not just look: a tail opening two levels needs two closers. The count walks
                        // the tail as this loop does, so both agree on which transitions are real.
                        var needed = (0, list_source_model_1.unclosedEnvsIn)(sE);
                        if (needed <= 0) {
                            siblingClosable = true;
                        }
                        else {
                            // Free closers, not every closer: one claimed by a list opened further down is not ours.
                            siblingClosable = (0, list_source_model_1.closersLeftAfter)(state, state.eMarks[lineIdx]) >= needed;
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
                if ((0, src_pos_cache_1.countPositionsAtOrAfter)((0, list_source_model_1.listCloserOffsets)(state), state.bMarks[lineIdx]) < iOpen) {
                    return 'abort';
                }
            }
            tail = sE;
            env = (0, list_source_model_1.nextListEnvMatch)(tail);
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
    if ((0, list_source_model_1.lastListEndPos)(state) < state.bMarks[startLine]) {
        return false;
    }
    // Probe answers are not memoised: it measured slower on every shape (see the spec).
    // `bufferedState` shares `env` by prototype, so ListsInternal mutates the real env: one whole-env
    // snapshot serves both restores below, naming keys would miss what a rule in the body writes.
    var captionSnap = (0, caption_counters_1.getCaptionCounters)();
    // A discarded parse enters a level per `\begin` and, having no `\end`, never leaves it — without
    // this the depth grows with the number of probes, not with the real nesting.
    var listLevelSnap = (0, list_state_1.snapshotListLevels)();
    // Inside the `try`: reading a consumer's `env` can throw, and that must decline the rule, not the
    // render. Null until the slot is really taken.
    var envSnap = null;
    var committed = false;
    try {
        envSnap = (0, env_transient_1.snapshotEnvAll)(state.env);
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
        if (envSnap) {
            (0, env_transient_1.restoreEnvKeysFromAll)(state.env, env_transient_1.LIST_TRANSIENT_ENV_KEYS, envSnap);
            if (!committed) {
                (0, env_transient_1.restoreEnvAll)(state.env, envSnap);
            }
            (0, env_transient_1.releaseEnvSnapshot)();
        }
    }
};
exports.Lists = Lists;
//# sourceMappingURL=latex-list-env-block.js.map