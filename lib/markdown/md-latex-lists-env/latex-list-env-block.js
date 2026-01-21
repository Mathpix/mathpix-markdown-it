"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lists = exports.ListsInternal = void 0;
var tslib_1 = require("tslib");
var latex_list_tokens_1 = require("./latex-list-tokens");
var latex_list_items_1 = require("./latex-list-items");
var re_level_1 = require("./re-level");
var latex_list_types_1 = require("./latex-list-types");
var latex_list_common_1 = require("./latex-list-common");
var latex_list_env_engine_1 = require("./latex-list-env-engine");
var consts_1 = require("../common/consts");
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
    var _a, _b;
    var _c, _d, _e;
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
    var openData = (0, latex_list_tokens_1.ListOpen)(state, startLine + renderStart, lineText, itemizeLevelTokens, enumerateLevelTypes, itemizeLevelContents);
    var _f = openData.iOpen, iOpen = _f === void 0 ? 0 : _f, _g = openData.tokenStart, tokenStart = _g === void 0 ? null : _g;
    li = (_c = openData.li) !== null && _c !== void 0 ? _c : null;
    if (iOpen === 0) {
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
    for (; nextLine < endLine; nextLine++) {
        pos = state.bMarks[nextLine] + state.tShift[nextLine];
        max = state.eMarks[nextLine];
        lineText = state.src.slice(pos, max);
        // Handle opaque envs; may consume the line or return a tail to re-parse.
        var opaqueRes = processOpaqueLine({
            lineText: lineText,
            stack: opaqueStack,
            items: items,
            nextLine: nextLine,
            state: state,
            renderStart: renderStart
        });
        opaqueStack = opaqueRes.stack;
        items = opaqueRes.items;
        lineText = opaqueRes.lineText;
        if (opaqueRes.consumedLine) {
            continue;
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
                    items = (0, latex_list_items_1.ItemsAddToPrev)(items, sE, nextLine);
                }
                continue;
            }
        }
        // Handle inline \end{itemize}/\end{enumerate}
        if (consts_1.END_LIST_ENV_INLINE_RE.test(lineText)) {
            var endMatch = lineText.match(consts_1.END_LIST_ENV_INLINE_RE);
            if (endMatch) {
                var raw = endMatch[1].trim();
                if (!(0, latex_list_types_1.isListType)(raw)) {
                    return false;
                }
                var _h = (0, latex_list_items_1.splitInlineListEnv)(lineText, endMatch), sB = _h.sB, sE = _h.sE, isBacktickEscapedPair = _h.isBacktickEscapedPair;
                if (isBacktickEscapedPair) {
                    items = (0, latex_list_items_1.ItemsListPush)(items, lineText, nextLine, nextLine);
                    continue;
                }
                if (sB.length > 0) {
                    items = (0, latex_list_items_1.ItemsAddToPrev)(items, sB, nextLine);
                }
                (_a = (0, latex_list_items_1.finalizeListItems)(state, items, itemizeLevelTokens, enumerateLevelTypes, li, iOpen, itemizeLevelContents, tokenStart), iOpen = _a.iOpen, items = _a.items, li = _a.li);
                (0, latex_list_tokens_1.setTokenCloseList)(state, startLine + renderStart, nextLine + renderStart);
                if (sE.length > 0) {
                    items = (0, latex_list_items_1.ItemsAddToPrev)(items, sE, nextLine);
                }
                iOpen--;
                if (iOpen <= 0) {
                    haveClose = true;
                    nextLine += 1;
                    break;
                }
            }
            continue;
        }
        // Handle inline \begin{itemize}/\begin{enumerate}
        if (consts_1.BEGIN_LIST_ENV_INLINE_RE.test(lineText)) {
            var beginMatch = lineText.match(consts_1.BEGIN_LIST_ENV_INLINE_RE);
            if (beginMatch) {
                var raw = beginMatch[1].trim();
                if (!(0, latex_list_types_1.isListType)(raw)) {
                    return false;
                }
                var beginType = raw;
                var _j = (0, latex_list_items_1.splitInlineListEnv)(lineText, beginMatch), sB = _j.sB, sE = _j.sE, isBacktickEscapedPair = _j.isBacktickEscapedPair;
                if (isBacktickEscapedPair) {
                    items = (0, latex_list_items_1.ItemsListPush)(items, lineText, nextLine, nextLine);
                    continue;
                }
                if (sB.length > 0) {
                    items = (0, latex_list_items_1.ItemsAddToPrev)(items, sB, nextLine);
                }
                (_b = (0, latex_list_items_1.finalizeListItems)(state, items, itemizeLevelTokens, enumerateLevelTypes, li, iOpen, itemizeLevelContents, tokenStart), iOpen = _b.iOpen, items = _b.items, li = _b.li);
                (0, latex_list_tokens_1.setTokenOpenList)(state, -1, -1, beginType, itemizeLevelTokens, enumerateLevelTypes, itemizeLevelContents);
                if (sE.length > 0) {
                    items = (0, latex_list_items_1.ItemsAddToPrev)(items, sE, nextLine);
                }
                iOpen++;
            }
        }
        else {
            // Regular line inside list: either a new \item or continuation
            if (consts_1.LATEX_ITEM_COMMAND_INLINE_RE.test(lineText)) {
                items = (0, latex_list_items_1.ItemsListPush)(items, lineText, nextLine + renderStart, nextLine + renderStart);
            }
            else {
                items = (0, latex_list_items_1.ItemsAddToPrev)(items, lineText, nextLine);
            }
        }
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
    var lineText = state.src.slice(pos, max);
    // Must start with backslash to be LaTeX command
    if (lineText.charCodeAt(0) !== 0x5c /* '\' */) {
        return false;
    }
    var match = lineText.match(consts_1.BEGIN_LIST_ENV_RE);
    if (!match) {
        return false;
    }
    var typeList = match[1].trim();
    if (!(0, latex_list_types_1.isListType)(typeList)) {
        return false;
    }
    // Buffer tokens first (do not write into the real state during parsing)
    var bufferedState = (0, latex_list_env_engine_1.createBufferedState)(state);
    // Run the original logic on bufferedState instead of state
    var ok = (0, exports.ListsInternal)(bufferedState, startLine, endLine); // we'll define it
    if (!ok)
        return false;
    // In silent mode: only report that this block can start; do not modify state or emit tokens.
    if (silent) {
        return true;
    }
    // Flush tokens to the real state at the end
    (0, latex_list_env_engine_1.flushBufferedTokens)(state, bufferedState.tokens);
    // Sync state fields modified by parsing
    state.line = bufferedState.line;
    state.startLine = bufferedState.startLine;
    state.parentType = bufferedState.parentType;
    state.level = bufferedState.level;
    state.prentLevel = bufferedState.prentLevel;
    state.env = bufferedState.env;
    return true;
};
exports.Lists = Lists;
//# sourceMappingURL=latex-list-env-block.js.map