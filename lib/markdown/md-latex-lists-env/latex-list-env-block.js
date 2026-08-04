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
var list_state_2 = require("./list-state");
var src_pos_cache_1 = require("../common/src-pos-cache");
var env_transient_1 = require("../common/env-transient");
var latex_list_env_engine_1 = require("./latex-list-env-engine");
var consts_1 = require("../common/consts");
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
var handleLstBeginInline = function (lineText, stack, items, nextLine, dStart, itemTag) {
    var top = stack[stack.length - 1];
    // If we are inside lstlisting, ignore any begin markers.
    if (top === "lstlisting") {
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
    // If stack is empty:
    if (!mbLst && !mbTab)
        return { handled: false, stack: stack, items: items, lineText: lineText };
    // Choose earliest begin if both exist
    var mb = mbLst && mbTab
        ? (mbLst.index <= mbTab.index ? mbLst : mbTab)
        : (mbLst || mbTab);
    var openedType = mb === mbLst ? "lstlisting" : "tabular";
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
    items = (0, latex_list_items_1.ItemsAddToPrev)(items, afterBegin, nextLine);
    return { handled: true, stack: stack, items: items, lineText: lineText };
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
    var endRe = top === "lstlisting"
        ? consts_1.END_LST_INLINE_RE
        : consts_1.END_TABULAR_INLINE_RE;
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
                    var beginRes_1 = handleLstBeginInline(lineText, stack, items, nextLine, renderStart, consts_1.LATEX_ITEM_COMMAND_INLINE_RE);
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
        var beginRes = handleLstBeginInline(lineText, stack, items, nextLine, renderStart, consts_1.LATEX_ITEM_COMMAND_INLINE_RE);
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
        var _c, _d;
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
        // Handle \setcounter lines
        if (consts_1.reSetCounter.test(lineText)) {
            var match = lineText.match(consts_1.reSetCounter);
            if (match && ((_c = state.md.options) === null || _c === void 0 ? void 0 : _c.forLatex)) {
                var token = state.push("setcounter", "", 0);
                token.latex = match[0].trim();
            }
            if (match && match[2]) {
                var sE = match.index + match[0].length < lineText.length
                    ? lineText.slice(match.index + match[0].length)
                    : "";
                sE = sE.trim();
                var startNumber = (_d = (0, latex_list_common_1.parseSetCounterNumber)(match)) !== null && _d !== void 0 ? _d : 1;
                li = { value: startNumber };
                if (sE.length > 0) {
                    items = (0, latex_list_items_1.ItemsAddToPrev)(items, sE, lineIdx);
                }
                return 'proceed';
            }
        }
        // Handle inline \end{itemize}/\end{enumerate}
        if (consts_1.END_LIST_ENV_INLINE_RE.test(lineText)) {
            var endMatch = lineText.match(consts_1.END_LIST_ENV_INLINE_RE);
            if (endMatch) {
                var raw = endMatch[1].trim();
                if (!(0, latex_list_types_1.isListType)(raw)) {
                    return 'abort';
                }
                var _e = (0, latex_list_items_1.splitInlineListEnv)(lineText, endMatch), sB = _e.sB, sE = _e.sE, isBacktickEscapedPair = _e.isBacktickEscapedPair;
                if (isBacktickEscapedPair) {
                    items = (0, latex_list_items_1.ItemsListPush)(items, lineText, lineIdx, lineIdx);
                    return 'proceed';
                }
                if (sB.length > 0) {
                    items = (0, latex_list_items_1.ItemsAddToPrev)(items, sB, lineIdx);
                }
                // An inline `\end` in the item body may already have popped this list inside
                // finalizeListItems — pop by identity so we never pop a list this `\end` didn't close.
                var closingList = openTokens[openTokens.length - 1];
                (_a = (0, latex_list_items_1.finalizeListItems)(state, items, itemizeLevelTokens, enumerateLevelTypes, li, iOpen, itemizeLevelContents, openTokens, allListTokens), iOpen = _a.iOpen, items = _a.items, li = _a.li);
                (0, latex_list_tokens_1.setTokenCloseList)(state, startLine + renderStart, lineIdx + renderStart);
                if (closingList && openTokens[openTokens.length - 1] === closingList) {
                    openTokens.pop();
                }
                if (sE.length > 0) {
                    items = (0, latex_list_items_1.ItemsAddToPrev)(items, sE, lineIdx);
                }
                iOpen--;
                if (iOpen <= 0) {
                    haveClose = true;
                    return 'break';
                }
            }
            return 'proceed';
        }
        // Handle inline \begin{itemize}/\begin{enumerate}
        if (consts_1.BEGIN_LIST_ENV_INLINE_RE.test(lineText)) {
            var beginMatch = lineText.match(consts_1.BEGIN_LIST_ENV_INLINE_RE);
            if (beginMatch) {
                var raw = beginMatch[1].trim();
                if (!(0, latex_list_types_1.isListType)(raw)) {
                    return 'abort';
                }
                var beginType = raw;
                var _f = (0, latex_list_items_1.splitInlineListEnv)(lineText, beginMatch), sB = _f.sB, sE = _f.sE, isBacktickEscapedPair = _f.isBacktickEscapedPair;
                if (isBacktickEscapedPair) {
                    items = (0, latex_list_items_1.ItemsListPush)(items, lineText, lineIdx, lineIdx);
                    return 'proceed';
                }
                if (sB.length > 0) {
                    items = (0, latex_list_items_1.ItemsAddToPrev)(items, sB, lineIdx);
                }
                (_b = (0, latex_list_items_1.finalizeListItems)(state, items, itemizeLevelTokens, enumerateLevelTypes, li, iOpen, itemizeLevelContents, openTokens, allListTokens), iOpen = _b.iOpen, items = _b.items, li = _b.li);
                var nestedOpen = (0, latex_list_tokens_1.setTokenOpenList)(state, -1, -1, beginType, itemizeLevelTokens, enumerateLevelTypes, itemizeLevelContents);
                openTokens.push(nestedOpen);
                allListTokens.push(nestedOpen);
                if (sE.length > 0) {
                    items = (0, latex_list_items_1.ItemsAddToPrev)(items, sE, lineIdx);
                }
                iOpen++;
            }
        }
        else {
            // Regular line inside list: either a new \item or continuation
            if (consts_1.LATEX_ITEM_COMMAND_INLINE_RE.test(lineText)) {
                items = (0, latex_list_items_1.ItemsListPush)(items, lineText, lineIdx + renderStart, lineIdx + renderStart);
            }
            else {
                items = (0, latex_list_items_1.ItemsAddToPrev)(items, lineText, lineIdx);
            }
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
// Per-state memo of silent-probe results, invalidated when `state.src` is reassigned. Unbounded
// by design: it lives and dies with one parse, holding at most one entry per list-start line.
var LIST_PROBE_KEY = Symbol('mmd.listProbe');
var getCachedListProbe = function (state, key) {
    var slot = state;
    var cached = slot[LIST_PROBE_KEY];
    return cached && cached.src === state.src ? cached.map.get(key) : undefined;
};
var setCachedListProbe = function (state, key, ok) {
    var slot = state;
    var cached = slot[LIST_PROBE_KEY];
    if (!cached || cached.src !== state.src) {
        cached = { src: state.src, map: new Map() };
        slot[LIST_PROBE_KEY] = cached;
    }
    cached.map.set(key, ok);
};
// Per-state offset of the last list closer, invalidated when `state.src` is reassigned. Without
// it an unclosed env costs a speculative parse to EOF per probe — quadratic over a document.
var LIST_END_POS_KEY = Symbol('mmd.listEndPos');
// Built from the unanchored closer regex, so the sweep cannot drift from what the parser accepts.
var END_LIST_ENV_SWEEP_G = new RegExp(consts_1.END_LIST_ENV_INLINE_RE.source, 'g');
var lastListEndPos = function (state) {
    return (0, src_pos_cache_1.lastMatchPosCached)(state, LIST_END_POS_KEY, END_LIST_ENV_SWEEP_G);
};
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
    var _a, _b, _c, _d, _e;
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
    // A silent probe answers "does a closed list env start here?", which needs the full
    // speculative parse. Paragraph/footnote terminator scans re-ask it for the same line many
    // times, so memoize per state. Key covers every input the answer depends on.
    // `state.src` alone does not pin what a line contains — blockquote shifts bMarks/tShift for the
    // same line numbers on the same state — so the key carries the first line's geometry too. The
    // later lines are not in it: the parser walks them from these same arrays, which markdown-it
    // shifts uniformly, so the first line pins the frame.
    var probeKey = silent
        ? "".concat(startLine, ":").concat(endLine, ":").concat(state.bMarks[startLine] + state.tShift[startLine], ":").concat(state.eMarks[startLine]) +
            ":".concat(state.parentType, ":").concat(state.prentLevel, ":").concat((_a = state.env) === null || _a === void 0 ? void 0 : _a.inheritedListType) +
            // Module-global, so it is not implied by the state fields above; free to add (measured).
            ":".concat((0, list_state_1.getListDepth)()) +
            // Read by rules the body parse reaches (begin-tabular). Booleans keep the key short.
            ":".concat(!!((_b = state.env) === null || _b === void 0 ? void 0 : _b.tabulare), ":").concat(!!((_c = state.env) === null || _c === void 0 ? void 0 : _c.subTabular)) +
            ":".concat(!!((_d = state.env) === null || _d === void 0 ? void 0 : _d.isInline), ":").concat(!!((_e = state.env) === null || _e === void 0 ? void 0 : _e.isBlock))
        : '';
    if (silent) {
        var cached = getCachedListProbe(state, probeKey);
        if (cached !== undefined) {
            return cached;
        }
    }
    // `bufferedState` shares `env` by prototype, so ListsInternal mutates the real env.
    // Snapshot/restore its transient fields on every exit (abort, silent, commit): a list
    // ending in a block item leaks isBlock=true and wakes the inline fallback on the next
    // block, and a silent probe must not change state.
    var transientSnap = (0, env_transient_1.snapshotEnvKeys)(state.env, env_transient_1.LIST_TRANSIENT_ENV_KEYS);
    // The speculative parse runs the list body (incl. \begin{figure}/\begin{table}\caption),
    // which bumps the module-global caption counters and writes float env. On a non-committing
    // exit the tokens are discarded, so roll both back; on commit they match the flushed tokens.
    var captionSnap = (0, caption_counters_1.getCaptionCounters)();
    var floatEnvSnap = (0, env_transient_1.snapshotEnvKeys)(state.env, env_transient_1.LIST_SPECULATIVE_ENV_KEYS);
    // A discarded parse enters a level per `\begin` and, having no `\end`, never leaves it — without
    // this the depth grows with the number of probes, not with the real nesting.
    var listLevelSnap = (0, list_state_2.snapshotListLevels)();
    var committed = false;
    try {
        var bufferedState = (0, latex_list_env_engine_1.createBufferedState)(state);
        var ok = (0, exports.ListsInternal)(bufferedState, startLine, endLine);
        if (!ok || silent) {
            if (silent) {
                setCachedListProbe(state, probeKey, ok);
            }
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
        return true;
    }
    finally {
        (0, env_transient_1.restoreEnvKeys)(state.env, env_transient_1.LIST_TRANSIENT_ENV_KEYS, transientSnap.had, transientSnap.snap);
        if (!committed) {
            (0, caption_counters_1.setCaptionCounters)(captionSnap);
            (0, list_state_2.restoreListLevels)(listLevelSnap);
            (0, env_transient_1.restoreEnvKeys)(state.env, env_transient_1.LIST_SPECULATIVE_ENV_KEYS, floatEnvSnap.had, floatEnvSnap.snap);
        }
    }
};
exports.Lists = Lists;
//# sourceMappingURL=latex-list-env-block.js.map