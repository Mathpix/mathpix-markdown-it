"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processOpaqueLine = void 0;
var tslib_1 = require("tslib");
var latex_list_items_1 = require("./latex-list-items");
var warn_distinct_1 = require("../common/warn-distinct");
var consts_1 = require("../common/consts");
var list_source_model_1 = require("./list-source-model");
// Lines the list rule must not read as structure: a fence, an `lstlisting` body, a `tabular`. The
// stack, the items and the rest of the line go in and come back out — the parse loop owns them.
// Opens `openedType` and decides in one place whether it closes on this same line — the nested-tabular
// branch skipped that check, so its one-line form left the stack open for good.
var openOpaqueEnv = function (stack, items, openedType, afterBegin, nextLine, state) {
    // Not skipping a closer in code here: measured, the wrapper's own block rule truncates its content at
    // that closer anyway, and refusing it lost the tail instead of showing it (Non-Goals).
    var meSameLine = (0, list_source_model_1.firstUsableCloser)(state, nextLine, afterBegin, openedType, false);
    if (!meSameLine) {
        // `lineText` is a tail for the caller to re-parse, so it is only read when `handled` is false.
        return {
            handled: true,
            stack: tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(stack), false), [openedType], false),
            items: (0, latex_list_items_1.ItemsAddToPrev)(items, afterBegin, nextLine),
            lineText: '',
        };
    }
    // Closed on this line, so the stack is handed back untouched: pushing only to pop allocated twice.
    var glue = openedType === "lstlisting" ? "\n" : "";
    var endToken = afterBegin.slice(meSameLine.index, meSameLine.index + meSameLine.length);
    items = (0, latex_list_items_1.ItemsAddToPrev)(items, afterBegin.slice(0, meSameLine.index) + glue + endToken, nextLine);
    var afterSameLineEnd = afterBegin.slice(meSameLine.index + meSameLine.length);
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
        return openOpaqueEnv(stack, items, "tabular", lineText.slice(mbTab.index), nextLine, state);
    }
    // A wrapper opens only when its closer is ahead of the `\begin` itself: an `\end{X}` left of it read
    // as reachable and cost the whole list.
    var mbWrapRaw = (0, list_source_model_1.wrapperBeginAt)(lineText);
    // Unanchored (-1) declines the wrapper: with no offset to search from, no closer can be shown reachable.
    var wrapAt = mbWrapRaw
        ? (0, list_source_model_1.absoluteOffsetOf)(state, nextLine, lineText, mbWrapRaw.index, mbWrapRaw[0])
        : -1;
    var mbWrap = mbWrapRaw && wrapAt >= 0 && (0, list_source_model_1.hasCloserAhead)(state, wrapAt, mbWrapRaw[1]) ? mbWrapRaw : null;
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
    return openOpaqueEnv(stack, items, openedType, afterBegin, nextLine, state);
};
/**
 * Detects \end{...} for the current opaque env (stack top).
 * - If not found, appends the full raw line: nothing opens on top of a non-`tabular` top, so there is no tail.
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
    // Same rule as when the env opened: a closer written in code is content, and the next one still closes.
    var me = (0, list_source_model_1.firstUsableCloser)(state, nextLine, lineText, top, true);
    if (!me) {
        // Raw, to keep the indentation. Safe only because `lineText` is the whole line here: handleLstBeginInline
        // declines any non-tabular top, so nothing has consumed a prefix. Widening that would duplicate the tail.
        var rawLine = state.src.slice(state.bMarks[nextLine], state.eMarks[nextLine]);
        items = (0, latex_list_items_1.ItemsAddToPrev)(items, rawLine, nextLine);
        return { handled: true, stack: stack, items: items, lineText: lineText };
    }
    var endIndex = me.index;
    var endToken = lineText.slice(endIndex, endIndex + me.length);
    var beforeEnd = lineText.slice(0, endIndex);
    var afterEnd = lineText.slice(endIndex + me.length);
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
        // A shorter tail means a wrapper closed on this line; look again, or a second one beside it reaches
        // the caller as text and keeps the brace that opened it.
        if (lineText.length < remaining) {
            continue;
        }
        return { consumedLine: false, lineText: lineText, stack: stack, items: items };
    }
    // Unreachable today: every branch returns or shrinks the tail. Asserts that, rather than guarding it.
    (0, warn_distinct_1.warnDistinct)('opaque-stall:' + stack.join('>'), '[list-env] an opaque line stopped shrinking; the tail is taken as text');
    items = (0, latex_list_items_1.ItemsAddToPrev)(items, lineText, nextLine);
    return { consumedLine: true, lineText: lineText, stack: stack, items: items };
};
exports.processOpaqueLine = processOpaqueLine;
//# sourceMappingURL=latex-list-opaque.js.map