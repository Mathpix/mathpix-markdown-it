"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSetCounterInline = exports.listItemInline = exports.listBeginInline = exports.listCloseInline = void 0;
var tslib_1 = require("tslib");
var utils_1 = require("../utils");
var list_state_1 = require("./list-state");
var latex_list_types_1 = require("./latex-list-types");
var latex_list_common_1 = require("./latex-list-common");
var consts_1 = require("../common/consts");
/**
 * Inline rule that parses LaTeX list environment closing commands:
 *
 *   \end{itemize}
 *   \end{enumerate}
 *
 * It:
 *  - checks that we are in block/list context,
 *  - closes any still-open list item (`latex_list_item_close`),
 *  - emits `itemize_list_close` or `enumerate_list_close`,
 *  - updates `state.level` and `state.prentLevel`,
 *  - updates internal list-level state via `leaveListLevel`,
 *  - advances `state.pos` to the end of the `\end{...}` command.
 */
var listCloseInline = function (state, silent) {
    var _a;
    var startPos = state.pos;
    // Only handle in block/list context
    if (!state.env.isBlock) {
        return false;
    }
    // Must start with backslash
    if (state.src.charCodeAt(startPos) !== 0x5c /* '\' */) {
        return false;
    }
    var match = state.src
        .slice(startPos)
        .match(consts_1.END_LIST_ENV_RE);
    if (!match) {
        return false;
    }
    var rawType = match[1].trim();
    if (!(0, latex_list_types_1.isListType)(rawType)) {
        return false;
    }
    if (!silent) {
        var listType = rawType;
        (0, latex_list_common_1.closeOpenListItemIfNeeded)(state);
        var _b = (0, latex_list_common_1.getListTokenTypes)(listType), closeType = _b.closeType, htmlTag = _b.htmlTag;
        // itemize_list_close or enumerate_list_close
        var token = state.push(closeType, htmlTag, -1);
        (0, latex_list_common_1.applyListCloseState)(state, token);
    }
    state.pos = startPos + ((_a = match.index) !== null && _a !== void 0 ? _a : 0) + match[0].length;
    return true;
};
exports.listCloseInline = listCloseInline;
/**
 * Inline rule that parses LaTeX list environment openings:
 *
 *   \begin{itemize}
 *   \begin{enumerate}
 *
 * It:
 *  - validates that we are in block/list context,
 *  - emits an `itemize_list_open` or `enumerate_list_open` token,
 *  - updates `state.prentLevel`, `state.parentType` and `state.types`,
 *  - advances `state.pos` to the end of the \begin{...} command,
 *  - registers the new list level in the list-level state.
 */
var listBeginInline = function (state, silent) {
    var _a;
    var startPos = state.pos;
    // Only inside block/list context
    if (!state.env.isBlock) {
        return false;
    }
    // Must start with backslash
    if (state.src.charCodeAt(startPos) !== 0x5c /* '\' */) {
        return false;
    }
    var match = state.src
        .slice(startPos)
        .match(consts_1.BEGIN_LIST_ENV_RE);
    if (!match) {
        return false;
    }
    var rawType = match[1].trim();
    if (!(0, latex_list_types_1.isListType)(rawType)) {
        return false;
    }
    if (!silent) {
        var listType = rawType;
        var _b = (0, latex_list_common_1.getListTokenTypes)(listType), openType = _b.openType, htmlTag = _b.htmlTag;
        // itemize_list_open or enumerate_list_open
        var token = state.push(openType, htmlTag, 1);
        (0, latex_list_common_1.applyListOpenState)(state, listType, token);
    }
    state.pos = startPos + ((_a = match.index) !== null && _a !== void 0 ? _a : 0) + match[0].length;
    return true;
};
exports.listBeginInline = listBeginInline;
/**
 * Inline rule that parses a single LaTeX list item:
 *   \item[marker] content...
 *
 * It:
 *  - closes a previously open list item if necessary,
 *  - opens a new `latex_list_item_open` token,
 *  - parses the optional marker into `markerTokens`,
 *  - creates an `inline` token with the item content,
 *  - updates `state.pos` to the end of the current item.
 */
var listItemInline = function (state, silent) {
    var startPos = state.pos;
    // Must start with backslash
    if (state.src.charCodeAt(startPos) !== 0x5c /* '\' */) {
        return false;
    }
    // Try to match \item[...] command right after '\'
    var itemMatch = state.src
        .slice(startPos)
        .match(consts_1.LATEX_ITEM_COMMAND_RE);
    if (!itemMatch) {
        return false;
    }
    // Find where this item ends: next \item or begin/end list env
    var boundaryMatch = state.src
        .slice(startPos + itemMatch.index + itemMatch[0].length)
        .match(consts_1.LATEX_LIST_BOUNDARY_INLINE_RE);
    var content = boundaryMatch && boundaryMatch.index > 0
        ? state.src.slice(startPos + itemMatch.index + itemMatch[0].length, startPos + itemMatch.index + itemMatch[0].length + boundaryMatch.index)
        : state.src.slice(startPos + itemMatch.index + itemMatch[0].length);
    if (!silent) {
        // Close previous <li> if needed
        (0, latex_list_common_1.closeOpenListItemIfNeeded)(state);
        // Open new list item
        var token = state.push("latex_list_item_open", "li", 1);
        (0, list_state_1.incrementItemCount)();
        token.parentType = state.parentType;
        token.inlinePos = {
            start_content: startPos + itemMatch.index + itemMatch[0].length,
        };
        // Skip leading spaces in content for accurate inline range
        token.inlinePos.start_content += (0, utils_1.getSpacesFromLeft)(content);
        token.inlinePos.end_content = token.inlinePos.start_content + content.length;
        // Optional marker: \item[<marker>]
        if (itemMatch[1] !== undefined) {
            token.marker = itemMatch[1] ? itemMatch[1].trim() : "";
            var children = [];
            var beforeOptions = tslib_1.__assign({}, state.md.options);
            if (state.md.options.forDocx) {
                state.md.options = tslib_1.__assign(tslib_1.__assign({}, state.md.options), { outMath: {
                        include_svg: true,
                        include_mathml_word: false,
                    } });
            }
            state.md.inline.parse(itemMatch[1], state.md, state.env, children);
            state.md.options = beforeOptions;
            token.markerTokens = children;
        }
        // Inline content inside the list item
        token = state.push("inline", "", 0);
        token.content = content.trim();
        token.children = [];
    }
    // Advance parser position to after this item
    state.pos = startPos + itemMatch.index + itemMatch[0].length + content.length;
    return true;
};
exports.listItemInline = listItemInline;
/**
 * Inline rule that parses LaTeX \setcounter commands inside list environments:
 *
 *   \setcounter{enumi}{3}
 *
 * It:
 *  - validates that we are in block/list context (state.env.isBlock),
 *  - parses the numeric value,
 *  - converts N to N+1 (so the next list item starts from that value),
 *  - emits a `setcounter` token with `content = "<nextNumber>"`,
 *  - optionally attaches the original LaTeX source in `token.latex`
 *    when `md.options.forLatex` is enabled.
 *
 * Example:
 *   \setcounter{enumi}{3}  →  token.type = "setcounter", token.content = "4"
 */
var listSetCounterInline = function (state, silent) {
    var _a, _b, _c, _d;
    // Only handle in block/list context (not in pure inline text)
    if (!state.env.isBlock) {
        return false;
    }
    var startPos = state.pos;
    // Must start with backslash
    if (state.src.charCodeAt(startPos) !== 0x5c /* '\' */) {
        return false;
    }
    var match = state.src
        .slice(startPos)
        .match(consts_1.reSetCounter);
    if (!match) {
        return false;
    }
    if (!silent) {
        var startNumber = (0, latex_list_common_1.parseSetCounterNumber)(match);
        var content = startNumber.toString();
        var token = state.push("setcounter", "", 0);
        token.content = content;
        if ((_b = (_a = state.md) === null || _a === void 0 ? void 0 : _a.options) === null || _b === void 0 ? void 0 : _b.forLatex) {
            var absoluteEnd = startPos + ((_c = match.index) !== null && _c !== void 0 ? _c : 0) + match[0].length;
            token.latex = state.src.slice(state.pos, absoluteEnd);
        }
    }
    // Advance parser position to just after the \setcounter call
    state.pos = startPos + ((_d = match.index) !== null && _d !== void 0 ? _d : 0) + match[0].length;
    return true;
};
exports.listSetCounterInline = listSetCounterInline;
//# sourceMappingURL=latex-list-env-inline.js.map