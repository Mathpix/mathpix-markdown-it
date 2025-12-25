"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lists = void 0;
var latex_list_tokens_1 = require("./latex-list-tokens");
var latex_list_items_1 = require("./latex-list-items");
var re_level_1 = require("./re-level");
var latex_list_types_1 = require("./latex-list-types");
var latex_list_common_1 = require("./latex-list-common");
var consts_1 = require("../common/consts");
/**
 * Try to handle an inline `\begin{lstlisting}` on the given line.
 *
 * Behavior:
 * - If already inside a lstlisting environment (`envDepth > 0`), does nothing.
 * - If a `\begin{lstlisting}` is found:
 *   - Text before the begin is appended either as a new list item (when it matches `itemTag`)
 *     or concatenated to the previous item.
 *   - Sets `envDepth` to 1 (entered lstlisting).
 *   - Appends the substring starting at `\begin{lstlisting}` to the end of the line
 *     as code content in the current item.
 *
 * The function does not mutate inputs; it returns the updated state.
 *
 * @param lineText The full text of the current line.
 * @param envDepth Current lstlisting nesting depth.
 * @param items    Collected items so far (list builder state).
 * @param nextLine The current (next) line index used for item position metadata.
 * @param dStart   Document start line offset to compute absolute positions.
 * @param itemTag  RegExp to detect list item prefixes (e.g., `^\s*\\item`).
 * @returns Updated handling result with flags, depth, items, and original line text.
 */
var handleLstBeginInline = function (lineText, envDepth, items, nextLine, dStart, itemTag) {
    // If already inside lstlisting, do nothing.
    if (envDepth > 0) {
        return { handled: false, envDepth: envDepth, items: items, lineText: lineText };
    }
    var mb = consts_1.BEGIN_LST_INLINE_RE.exec(lineText);
    if (!mb) {
        return { handled: false, envDepth: envDepth, items: items, lineText: lineText };
    }
    var beginIndex = mb.index;
    // Is there text BEFORE \begin{lstlisting} ?
    var before = lineText.slice(0, beginIndex).trimEnd();
    var afterBegin = lineText.slice(beginIndex); // start from \begin...
    // If there was something before begin, it was regular text/part of \item:
    if (before.length > 0) {
        if (itemTag.test(before)) {
            items = (0, latex_list_items_1.ItemsListPush)(items, before, nextLine + dStart, nextLine + dStart);
        }
        else {
            items = (0, latex_list_items_1.ItemsAddToPrev)(items, before, nextLine);
        }
    }
    envDepth = 1; //entered lstlisting
    items = (0, latex_list_items_1.ItemsAddToPrev)(items, afterBegin, nextLine); //The part from \begin{lstlisting} to the end of the line is considered a code string.
    return { handled: true, envDepth: envDepth, items: items, lineText: lineText };
};
/**
 * Try to handle an inline `\end{lstlisting}` on the current line.
 *
 * Behavior:
 * - If not inside an lstlisting environment (`envDepth === 0`), does nothing.
 * - If no end marker is found on this line, appends the full line (with original leading whitespace)
 *   to the current item and reports `handled: true` (still inside the env).
 * - If an end marker is present:
 *   - Appends everything up to `\end{...}` (plus the end token itself) to the current item.
 *   - Resets `envDepth` to 0 (leaves lstlisting).
 *   - If there is trailing text after the end token, returns it in `lineText` so the caller
 *     can continue processing the remainder of the line; otherwise returns an empty `lineText`.
 *
 * The function does not mutate inputs; it returns the updated state.
 *
 * @param lineText Current line text (may contain `\end{lstlisting}`).
 * @param envDepth Current lstlisting nesting depth (0 if outside).
 * @param items    Accumulated items list (list builder state).
 * @param nextLine Line index used for item position metadata.
 * @param state    Markdown-It state (used to read the original line with indentation).
 * @returns Updated result with flags, depth, items, and remaining line text (if any).
 */
var handleLstEndInline = function (lineText, envDepth, items, nextLine, state) {
    var _a;
    // If we are not inside lstlisting, we exit
    if (envDepth === 0) {
        return { handled: false, envDepth: envDepth, items: items, lineText: lineText };
    }
    var me = consts_1.END_LST_INLINE_RE.exec(lineText);
    if (!me) {
        // There is no end of environment - just add the line as is
        lineText = state.src.slice(state.bMarks[nextLine], state.eMarks[nextLine]); // It is important to take into account the leading whitespace characters.
        items = (0, latex_list_items_1.ItemsAddToPrev)(items, lineText, nextLine);
        return { handled: true, envDepth: envDepth, items: items, lineText: lineText };
    }
    // There is an end of environment in this line
    var endIndex = me.index;
    var endToken = lineText.slice(endIndex, endIndex + me[0].length);
    var beforeEnd = lineText.slice(0, endIndex);
    var afterEnd = lineText.slice(endIndex + me[0].length);
    // Everything up to \end{...} is a continuation of the code
    if (beforeEnd.length > 0) {
        items = (0, latex_list_items_1.ItemsAddToPrev)(items, beforeEnd + '\n' + endToken, nextLine);
    }
    else {
        items = (0, latex_list_items_1.ItemsAddToPrev)(items, endToken, nextLine);
    }
    envDepth = 0; // Exit lstlisting
    if (!((_a = afterEnd === null || afterEnd === void 0 ? void 0 : afterEnd.trim()) === null || _a === void 0 ? void 0 : _a.length)) {
        return { handled: true, envDepth: envDepth, items: items, lineText: '' };
    }
    return { handled: false, envDepth: envDepth, items: items, lineText: afterEnd };
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
    var _a, _b;
    var _c, _d, _e;
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
    // In silent mode: only report that this block can start; do not modify state or emit tokens.
    if (silent) {
        return true;
    }
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
    var envDepth = 0; // >0 — inside lstlisting environment
    for (; nextLine < endLine; nextLine++) {
        pos = state.bMarks[nextLine] + state.tShift[nextLine];
        max = state.eMarks[nextLine];
        lineText = state.src.slice(pos, max);
        // 1) If you are NOT currently inside lstlisting, first search for \begin{lstlisting}
        if (envDepth === 0) {
            var beginRes = handleLstBeginInline(lineText, envDepth, items, nextLine, renderStart, consts_1.LATEX_ITEM_COMMAND_INLINE_RE);
            envDepth = beginRes.envDepth;
            if (beginRes.handled) {
                continue; // this line is already fully processed
            }
            lineText = beginRes.lineText;
        }
        // 2) If inside lstlisting, look for \end{lstlisting}
        if (envDepth > 0) {
            var endRes = handleLstEndInline(lineText, envDepth, items, nextLine, state);
            envDepth = endRes.envDepth;
            items = endRes.items;
            if (endRes.handled) {
                continue;
            }
            lineText = endRes.lineText;
        }
        // Handle \setcounter lines
        if (consts_1.reSetCounter.test(lineText)) {
            match = lineText.match(consts_1.reSetCounter);
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
        // No explicit \end{itemize}/\end{enumerate} found — flush remaining items
        console.log("NOT CLOSE TAG.");
        (0, latex_list_items_1.ListItemsBlock)(state, items);
        li = null;
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
exports.Lists = Lists;
//# sourceMappingURL=latex-list-env-block.js.map