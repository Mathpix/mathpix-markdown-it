"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSetCounterInline = exports.listItemInline = exports.listBeginInline = exports.listCloseInline = exports.latexListEnvInline = exports.findFirstCompleteListEnv = void 0;
var tslib_1 = require("tslib");
var utils_1 = require("../utils");
var common_1 = require("../common");
var src_pos_cache_1 = require("../common/src-pos-cache");
var list_state_1 = require("./list-state");
var latex_list_types_1 = require("./latex-list-types");
var latex_list_common_1 = require("./latex-list-common");
var latex_list_env_engine_1 = require("./latex-list-env-engine");
var consts_1 = require("../common/consts");
// Sticky-free closer search over the whole src, so the check needs no slice.
var END_LIST_ENV_SEARCH_G = new RegExp(consts_1.END_LIST_ENV_INLINE_RE.source, 'g');
// Same patterns applied at an index instead of to `src.slice(pos)`, which copied the rest of the
// document on every call. Built from the shared sources, so they cannot drift.
var ITEM_COMMAND_AT = (0, consts_1.makeItemCommandSticky)();
// The scan needs its own: `lastIndex` is state, and the rule above walks a different position.
var ITEM_COMMAND_IN_SCAN = (0, consts_1.makeItemCommandSticky)();
var LIST_BOUNDARY_SEARCH_G = new RegExp(consts_1.LATEX_LIST_BOUNDARY_INLINE_RE.source, 'g');
// Cached per src, and empty for a source without the command: finding the nearest one by scanning
// backwards cost a walk of the prefix per item boundary.
var RENEWCOMMAND_POSITIONS = Symbol('renewcommand-positions');
var RENEWCOMMAND_SEARCH_G = /\\renewcommand\b/g;
// Does `at` fall inside the arguments of the nearest `\renewcommand` before it?
var insideRenewCommand = function (state, at) {
    var positions = (0, src_pos_cache_1.matchPositionsCached)(state, RENEWCOMMAND_POSITIONS, RENEWCOMMAND_SEARCH_G);
    var before = positions.length - (0, src_pos_cache_1.countPositionsAtOrAfter)(positions, at + 1);
    if (before === 0) {
        return false;
    }
    var cmdAt = positions[before - 1];
    var span = (0, common_1.renewCommandSpanEnd)(state.src.slice(cmdAt));
    return span > 0 && at < cmdAt + span;
};
/**
 * Finds the first complete list environment starting at `startPos`.
 * - Tracks nested itemize/enumerate via `listStack`
 * - Treats lstlisting/tabular as opaque (skips their content)
 * - Skips Markdown backtick code spans so `\begin/\end` inside code does not interfere
 */
var findFirstCompleteListEnv = function (src, startPos) {
    var _a, _b, _c;
    var slice = src.slice(startPos);
    var begin = slice.match(consts_1.BEGIN_LIST_ENV_RE);
    if (!begin || begin.index !== 0) {
        return null;
    }
    var rootTypeRaw = ((_a = begin[1]) !== null && _a !== void 0 ? _a : "").trim();
    if (!rootTypeRaw || !(0, latex_list_types_1.isListType)(rootTypeRaw)) {
        return null;
    }
    // The only success path is the closer branch below, so no closer ahead means no match. Checked
    // up front because the scan walks char by char and slices the rest at each step.
    END_LIST_ENV_SEARCH_G.lastIndex = startPos;
    if (!END_LIST_ENV_SEARCH_G.exec(src)) {
        return null;
    }
    var rootType = rootTypeRaw;
    var listStack = [rootType];
    var pos = startPos + begin[0].length;
    // Opaque env stack: tabular can nest; lstlisting cannot.
    var opaqueStack = [];
    while (pos < src.length) {
        // 1) Skip Markdown code spans starting exactly at pos
        var codePos = (0, utils_1.skipBackticks)(src, pos);
        if (codePos !== pos) {
            pos = codePos;
            continue;
        }
        // A closer in a `\renewcommand` body belongs to the macro, as the item scan already reads it.
        if (opaqueStack.length === 0 && src.startsWith('\\renewcommand', pos)) {
            var macroEnd = (0, common_1.renewCommandSpanEnd)(src.slice(pos));
            if (macroEnd > 0) {
                pos += macroEnd;
                continue;
            }
        }
        // The optional marker is an argument: a list command written in it is text, not structure.
        if (opaqueStack.length === 0) {
            ITEM_COMMAND_IN_SCAN.lastIndex = pos;
            var itemAt = ITEM_COMMAND_IN_SCAN.exec(src);
            if (itemAt && itemAt[1] !== undefined) {
                pos += itemAt[0].length;
                continue;
            }
        }
        var rest = src.slice(pos);
        // 2) If inside opaque → only look for END of the current opaque
        if (opaqueStack.length > 0) {
            var top_1 = opaqueStack[opaqueStack.length - 1];
            var endRe = top_1 === "lstlisting" ? consts_1.END_LST_INLINE_RE : consts_1.END_TABULAR_INLINE_RE;
            endRe.lastIndex = 0;
            var me = endRe.exec(rest);
            if (!me) {
                // continue scanning char-by-char until we find the end
                pos += 1;
                continue;
            }
            // Found opaque end, pop stack and jump after it
            pos += me.index + me[0].length;
            opaqueStack = opaqueStack.slice(0, -1);
            continue;
        }
        // 3) Nested begin list (must be exactly at pos)
        var mbList = rest.match(consts_1.BEGIN_LIST_ENV_RE);
        if (mbList && mbList.index === 0) {
            var tRaw = ((_b = mbList[1]) !== null && _b !== void 0 ? _b : "").trim();
            if (tRaw && (0, latex_list_types_1.isListType)(tRaw)) {
                listStack.push(tRaw);
                pos += mbList[0].length;
                continue;
            }
        }
        // 4) End list (must be exactly at pos)
        var meList = rest.match(consts_1.END_LIST_ENV_RE);
        if (meList && meList.index === 0) {
            var tRaw = ((_c = meList[1]) !== null && _c !== void 0 ? _c : "").trim();
            if (!tRaw || !(0, latex_list_types_1.isListType)(tRaw)) {
                return null;
            }
            var expected = listStack[listStack.length - 1];
            if (expected !== tRaw) {
                return null;
            }
            listStack.pop();
            pos += meList[0].length;
            if (listStack.length === 0) {
                return { type: rootType, start: startPos, end: pos, raw: src.slice(startPos, pos) };
            }
            continue;
        }
        // 5) Opaque begin (ONLY if starts exactly at pos)
        consts_1.BEGIN_LST_INLINE_RE.lastIndex = 0;
        consts_1.BEGIN_TABULAR_INLINE_RE.lastIndex = 0;
        var mbLst = consts_1.BEGIN_LST_INLINE_RE.exec(rest);
        var mbTab = consts_1.BEGIN_TABULAR_INLINE_RE.exec(rest);
        var mbLst0 = mbLst && mbLst.index === 0 ? mbLst : null;
        var mbTab0 = mbTab && mbTab.index === 0 ? mbTab : null;
        if (mbLst0 || mbTab0) {
            var opened = mbLst0 ? "lstlisting" : "tabular";
            opaqueStack = tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(opaqueStack), false), [opened], false);
            pos += (mbLst0 !== null && mbLst0 !== void 0 ? mbLst0 : mbTab0)[0].length;
            continue;
        }
        pos += 1;
    }
    return null;
};
exports.findFirstCompleteListEnv = findFirstCompleteListEnv;
/**
 * Inline rule: recognizes a complete `\begin{itemize|enumerate}...\end{...}` sequence at the current
 * cursor, parses it with the block list parser, then injects the resulting tokens into the inline stream.
 * Any token.inlinePos produced by the block parser is shifted to absolute offsets in `state.src`.
 */
var latexListEnvInline = function (state, silent) {
    var _a;
    var startPos = state.pos;
    // Must start with '\'
    if (state.src.charCodeAt(startPos) !== 0x5c /* '\' */) {
        return false;
    }
    var begin = state.src.slice(startPos).match(consts_1.BEGIN_LIST_ENV_RE);
    if (!begin || begin.index !== 0) {
        return false;
    }
    var type = ((_a = begin[1]) !== null && _a !== void 0 ? _a : "").trim();
    if (!type || !(0, latex_list_types_1.isListType)(type)) {
        return false;
    }
    var env = (0, exports.findFirstCompleteListEnv)(state.src, startPos);
    if (!env) {
        return false;
    }
    if (silent) {
        state.pos = env.end;
        return true;
    }
    // Parse raw env using block logic. A failure here does not apply the rule, as on the block path;
    // the flush below stays unguarded — its tokens are already in the stream.
    var parsed;
    try {
        parsed = (0, latex_list_env_engine_1.parseListEnvRawToTokens)(state.md, env.raw, state.env);
    }
    catch (e) {
        (0, latex_list_env_engine_1.warnListRuleFailed)(e);
        return false;
    }
    if (!parsed.ok) {
        return false;
    }
    // Flush tokens into inline stream and shift inlinePos by absolute start offset
    (0, latex_list_env_engine_1.flushTokensToInline)(state, parsed.tokens, env.start);
    // Advance position
    state.pos = env.end;
    return true;
};
exports.latexListEnvInline = latexListEnvInline;
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
    var _a, _b, _c, _d;
    var startPos = state.pos;
    // Only handle in block/list context
    if (!state.env.isBlock || (0, list_state_1.isParsingMarker)()) {
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
        // What is open, not what the command names: crossed env names made `\end{itemize}` emit `</ul>`
        // over an open `<ol>`, leaving a tag with no opener and the `<ol>` never closed. `env.parentType`
        // is read only while a list is open — the transient the opener wrote, restored after it — and
        // `isListType` drops anything a consumer left under that name.
        var openType = (_b = (_a = state.types) === null || _a === void 0 ? void 0 : _a[state.types.length - 1]) !== null && _b !== void 0 ? _b : (_c = state.env) === null || _c === void 0 ? void 0 : _c.parentType;
        var listType = (0, latex_list_types_1.isListType)(openType) ? openType : rawType;
        (0, latex_list_common_1.closeOpenListItemIfNeeded)(state);
        var _e = (0, latex_list_common_1.getListTokenTypes)(listType), closeType = _e.closeType, htmlTag = _e.htmlTag;
        // itemize_list_close or enumerate_list_close
        var token = state.push(closeType, htmlTag, -1);
        (0, latex_list_common_1.applyListCloseState)(state, token);
    }
    state.pos = startPos + ((_d = match.index) !== null && _d !== void 0 ? _d : 0) + match[0].length;
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
    if (!state.env.isBlock || (0, list_state_1.isParsingMarker)()) {
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
    // Only handle in block/list context
    if (!state.env.isBlock || (0, list_state_1.isParsingMarker)()) {
        return false;
    }
    // No list open: the `<li>` would have nothing to sit in.
    if ((0, list_state_1.getOpenListCount)() === 0) {
        return false;
    }
    // Try to match \item[...] command right after '\'
    ITEM_COMMAND_AT.lastIndex = startPos;
    var itemMatch = ITEM_COMMAND_AT.exec(state.src);
    if (!itemMatch) {
        return false;
    }
    // Find where this item ends: next \item or begin/end list env
    var contentStart = startPos + itemMatch[0].length;
    LIST_BOUNDARY_SEARCH_G.lastIndex = contentStart;
    var boundaryMatch = LIST_BOUNDARY_SEARCH_G.exec(state.src);
    // A closer in a `\renewcommand` body belongs to the macro: taking it emitted a close with no opener.
    while (boundaryMatch && insideRenewCommand(state, boundaryMatch.index)) {
        LIST_BOUNDARY_SEARCH_G.lastIndex = boundaryMatch.index + boundaryMatch[0].length;
        boundaryMatch = LIST_BOUNDARY_SEARCH_G.exec(state.src);
    }
    var content = boundaryMatch && boundaryMatch.index > contentStart
        ? state.src.slice(contentStart, boundaryMatch.index)
        : state.src.slice(contentStart);
    if (!silent) {
        // Close previous <li> if needed
        (0, latex_list_common_1.closeOpenListItemIfNeeded)(state);
        // Open new list item
        var token = state.push("latex_list_item_open", "li", 1);
        (0, list_state_1.incrementItemCount)();
        token.parentType = state.parentType;
        token.inlinePos = {
            start_content: contentStart,
        };
        // Skip leading spaces in content for accurate inline range
        token.inlinePos.start_content += (0, utils_1.getSpacesFromLeft)(content);
        token.inlinePos.end_content = token.inlinePos.start_content + content.length;
        // Optional marker: \item[<marker>]
        if (itemMatch[1] !== undefined) {
            // Parse the trimmed marker so markerTokens (used for width and rendering)
            // don't carry edge whitespace that inflates the padding.
            var trimmedMarker = itemMatch[1] ? itemMatch[1].trim() : "";
            token.marker = trimmedMarker;
            var children = [];
            // Only when they are about to be replaced. Restored in `finally`, or a throw leaves the mutated
            // `outMath` on the md instance for every later render.
            var beforeOptions = state.md.options.forDocx ? tslib_1.__assign({}, state.md.options) : null;
            (0, list_state_1.beginMarkerParse)();
            try {
                if (beforeOptions) {
                    state.md.options = tslib_1.__assign(tslib_1.__assign({}, state.md.options), { outMath: {
                            include_svg: true,
                            include_mathml_word: false,
                        } });
                }
                state.md.inline.parse(trimmedMarker, state.md, state.env, children);
            }
            finally {
                (0, list_state_1.endMarkerParse)();
                if (beforeOptions) {
                    state.md.options = beforeOptions;
                }
            }
            token.markerTokens = children;
        }
        // Inline content inside the list item
        token = state.push("inline", "", 0);
        token.content = content.trim();
        token.children = [];
    }
    // Advance parser position to after this item
    state.pos = contentStart + content.length;
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
    var _a, _b, _c, _d, _e;
    // Only handle in block/list context (not in pure inline text)
    if (!state.env.isBlock || (0, list_state_1.isParsingMarker)()) {
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
        // `?? 1` as the block path does: null comes back for a non-numeric argument like `{zz}`.
        var startNumber = (_a = (0, latex_list_common_1.parseSetCounterNumber)(match)) !== null && _a !== void 0 ? _a : 1;
        var content = startNumber.toString();
        var token = state.push("setcounter", "", 0);
        token.content = content;
        if ((_c = (_b = state.md) === null || _b === void 0 ? void 0 : _b.options) === null || _c === void 0 ? void 0 : _c.forLatex) {
            var absoluteEnd = startPos + ((_d = match.index) !== null && _d !== void 0 ? _d : 0) + match[0].length;
            token.latex = state.src.slice(state.pos, absoluteEnd);
        }
    }
    // Advance parser position to just after the \setcounter call
    state.pos = startPos + ((_e = match.index) !== null && _e !== void 0 ? _e : 0) + match[0].length;
    return true;
};
exports.listSetCounterInline = listSetCounterInline;
//# sourceMappingURL=latex-list-env-inline.js.map