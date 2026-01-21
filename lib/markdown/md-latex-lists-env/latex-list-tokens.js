"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processListChildToken = exports.setTokenCloseList = exports.ListOpen = exports.setTokenOpenList = exports.setTokenListItemOpenBlock = void 0;
var tslib_1 = require("tslib");
var list_state_1 = require("./list-state");
var latex_list_types_1 = require("./latex-list-types");
var re_level_1 = require("./re-level");
var latex_list_common_1 = require("./latex-list-common");
var consts_1 = require("../common/consts");
/**
 * Creates an opening list-item token (<li>) for block-style LaTeX list items.
 * Handles marker parsing, enumeration start values, nesting metadata,
 * and updates the internal list-level state (item counters).
 *
 * @param state - Markdown-It state object
 * @param startLine - Starting line number of the list item
 * @param endLine - Ending line number of the list item
 * @param marker - Optional raw \item[...] marker string
 * @param li - Optional enumeration start value (e.g., \setcounter)
 * @param itemizeLevelTokens - Pre-parsed bullet tokens for itemize levels
 * @param enumerateLevelTypes - Current enumerate list-style types
 * @param itemizeLevelContents - Raw bullet text for each itemize level
 */
var setTokenListItemOpenBlock = function (state, startLine, endLine, marker, li, itemizeLevelTokens, enumerateLevelTypes, itemizeLevelContents) {
    var _a;
    // Check current list depth and close previous item if needed
    (0, latex_list_common_1.closeOpenListItemIfNeeded)(state);
    // Create opening <li> token
    var token = state.push('latex_list_item_open', 'li', 1);
    (0, list_state_1.incrementItemCount)();
    token.meta = { isBlock: true };
    token.parentType = ((_a = state.types) === null || _a === void 0 ? void 0 : _a.length) > 0
        ? state.types[state.types.length - 1]
        : '';
    // Parse marker (e.g., \item[abc])
    if (marker !== undefined) {
        token.marker = marker.trim();
        var parsedMarkerTokens = [];
        state.md.inline.parse(marker, state.md, state.env, parsedMarkerTokens);
        token.markerTokens = parsedMarkerTokens;
    }
    // Apply enumeration start value
    if ((li === null || li === void 0 ? void 0 : li.value) !== undefined) {
        token.startValue = li.value;
        token.attrSet("value", String(li.value));
        li = null;
    }
    // Parent metadata
    token.parentStart = state.startLine;
    token.map = [startLine, endLine];
    token.prentLevel = state.prentLevel;
    // Assign list-type metadata
    token.itemizeLevel = itemizeLevelTokens;
    token.itemizeLevelContents = itemizeLevelContents;
    token.enumerateLevel = enumerateLevelTypes;
};
exports.setTokenListItemOpenBlock = setTokenListItemOpenBlock;
/**
 * Creates an opening token for LaTeX list environments (\begin{itemize}, \begin{enumerate}).
 * Updates list nesting state, parent tracking, and attaches itemize/enumerate
 * styling metadata used for rendering markers and list formatting.
 *
 * @param state - Markdown-It processing state
 * @param startLine - Line number where the list begins
 * @param endLine - Line number where the list ends
 * @param type - List type ("itemize" or "enumerate")
 * @param itemizeLevelTokens - Pre-parsed itemize bullet tokens
 * @param enumerateLevelTypes - List-style types for enumerate levels
 * @param itemizeLevelContents - Raw bullet text for each itemize level
 */
var setTokenOpenList = function (state, startLine, endLine, type, itemizeLevelTokens, enumerateLevelTypes, itemizeLevelContents) {
    // Determine token type and HTML tag
    var _a = (0, latex_list_common_1.getListTokenTypes)(type), openType = _a.openType, htmlTag = _a.htmlTag;
    // itemize_list_open or enumerate_list_open
    var token = state.push(openType, htmlTag, 1);
    (0, latex_list_common_1.applyListOpenState)(state, type, token);
    // Attach styling metadata
    token.itemizeLevel = itemizeLevelTokens;
    token.itemizeLevelContents = itemizeLevelContents;
    token.enumerateLevel = enumerateLevelTypes;
    token.prentLevel = state.prentLevel;
    // Map source lines
    if (startLine > -1 && endLine > -1) {
        state.startLine = startLine;
        token.map = [startLine, endLine];
    }
    return token;
};
exports.setTokenOpenList = setTokenOpenList;
/**
 * Parses a LaTeX list environment beginning on the current line
 * (e.g., \begin{itemize} or \begin{enumerate}), opens the
 * corresponding list token, and processes any inline content
 * that appears on the same line after \begin{...}.
 *
 * Returns:
 *  - iOpen: how many list environments were opened
 *  - tokenStart: the created *_list_open token, if any
 *  - li: optional enumerate start value extracted via \setcounter
 */
var ListOpen = function (state, startLine, lineText, itemizeLevelTokens, enumerateLevelTypes, itemizeLevelContents) {
    var e_1, _a;
    var tokenStart = null;
    var iOpen = 0;
    var padding = 0;
    var li = null;
    // Line must start with '\' to be a LaTeX command
    if (lineText.charCodeAt(0) !== 0x5c /* '\' */) {
        return { iOpen: iOpen, tokenStart: tokenStart, li: li };
    }
    var match = lineText.match(consts_1.BEGIN_LIST_ENV_RE);
    // If we are not already inside a list and no \begin{itemize/enumerate} found
    if (!match && state.parentType !== "itemize" && state.parentType !== "enumerate") {
        return { iOpen: iOpen, tokenStart: tokenStart, li: li };
    }
    // Ensure itemize level tokens are prepared
    (0, re_level_1.SetItemizeLevelTokens)(state);
    if (!match) {
        // Already in a list, but no new begin here — nothing more to do
        return { iOpen: iOpen, tokenStart: tokenStart, li: li };
    }
    var strAfter = lineText.slice(match.index + match[0].length);
    var rawType = match[1].trim();
    if (!(0, latex_list_types_1.isListType)(rawType)) {
        return { iOpen: iOpen, tokenStart: tokenStart, li: li };
    }
    var listType = rawType;
    tokenStart = (0, exports.setTokenOpenList)(state, startLine, startLine + 1, listType, itemizeLevelTokens, enumerateLevelTypes, itemizeLevelContents);
    iOpen++;
    // Process inline content after \begin{...}
    if (strAfter && strAfter.trim().length > 0) {
        var children = [];
        state.env.parentType = state.parentType;
        state.env.isBlock = true;
        state.env.prentLevel = state.prentLevel;
        state.env.inheritedListType = state.parentType;
        state.md.inline.parse(strAfter, state.md, state.env, children);
        // Context shared across child token processing
        var ctx = {
            li: li,
            padding: padding,
            iOpen: iOpen,
            itemizeLevelTokens: itemizeLevelTokens,
            enumerateLevelTypes: enumerateLevelTypes,
            itemizeLevelContents: itemizeLevelContents
        };
        try {
            // Process each inline child token
            for (var children_1 = tslib_1.__values(children), children_1_1 = children_1.next(); !children_1_1.done; children_1_1 = children_1.next()) {
                var child = children_1_1.value;
                (0, exports.processListChildToken)(state, {
                    startLine: startLine,
                    endLine: startLine,
                    content: ''
                }, child, ctx);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (children_1_1 && !children_1_1.done && (_a = children_1.return)) _a.call(children_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // Update context after processing children
        li = ctx.li;
        padding = ctx.padding;
        iOpen = ctx.iOpen;
        state.env.isBlock = false;
    }
    return { iOpen: iOpen, tokenStart: tokenStart, li: li };
};
exports.ListOpen = ListOpen;
/**
 * Closes the current LaTeX list environment (\end{itemize} / \end{enumerate}).
 *
 * - Closes any still-open list item if needed
 * - Emits the appropriate *_list_close token
 * - Updates list nesting levels and internal list-level state
 *
 * @param state - Markdown-It processing state
 * @param startLine - Line where the list block starts
 * @param endLine - Line where the list block ends
 * @returns The created closing list token
 */
var setTokenCloseList = function (state, startLine, endLine) {
    var _a;
    // Close an open <li> if there is one
    (0, latex_list_common_1.closeOpenListItemIfNeeded)(state);
    var currentListType = (_a = state.types) === null || _a === void 0 ? void 0 : _a[state.types.length - 1];
    var isItemize = currentListType === latex_list_types_1.ListType.itemize;
    var _b = (0, latex_list_common_1.getListTokenTypes)(isItemize ? latex_list_types_1.ListType.itemize : latex_list_types_1.ListType.enumerate), closeType = _b.closeType, htmlTag = _b.htmlTag;
    // itemize_list_close or enumerate_list_close
    var token = state.push(closeType, htmlTag, -1);
    if (startLine > -1 && endLine > -1) {
        token.map = [startLine, endLine];
    }
    (0, latex_list_common_1.applyListCloseState)(state, token);
    if (state.types && state.types.length > 0) {
        state.types.pop();
    }
};
exports.setTokenCloseList = setTokenCloseList;
/**
 * Processes a single inline token inside a LaTeX list item.
 *
 * This function:
 *  - Applies \setcounter values to list items (\item)
 *  - Handles custom list markers and computes marker padding
 *  - Updates parent metadata (type, nesting level, line map)
 *  - Adjusts list nesting state for itemize/enumerate environments
 *  - Attaches itemize/enumerate level styling metadata
 *
 * @param state - The Markdown-It state object
 * @param item - Parsed list item metadata (start/end line and content)
 * @param child - Inline token to process
 * @param ctx - Shared context for updating list state (padding, counters, levels)
 */
var processListChildToken = function (state, item, child, ctx) {
    var _a, _b, _c;
    // 1. Handle \setcounter
    if (child.type === 'setcounter') {
        ctx.li = { value: child.content };
        if (((_a = state.md.options) === null || _a === void 0 ? void 0 : _a.forLatex) && child.latex) {
            var token_1 = state.push("setcounter", "", 0);
            token_1.latex = child.latex;
        }
        return;
    }
    // 2. Push token to state
    state.tokens.push(child);
    var token = child;
    // 3. Apply enumerate start value for list item
    if (token.type === 'latex_list_item_open' && ((_b = ctx.li) === null || _b === void 0 ? void 0 : _b.hasOwnProperty('value'))) {
        token.startValue = ctx.li.value;
        token.attrSet('value', ctx.li.value.toString());
        ctx.li = null;
    }
    // 4. Handle custom marker and compute padding
    if (token.hasOwnProperty('marker')) {
        var paddingChild = 0;
        var markerTokens = (_c = token.markerTokens) !== null && _c !== void 0 ? _c : [];
        for (var i = 0; i < markerTokens.length; i++) {
            if (markerTokens[i].type === 'text') {
                paddingChild += markerTokens[i].content.length;
            }
        }
        if (paddingChild > ctx.padding) {
            ctx.padding = paddingChild;
        }
    }
    // 5. Parent metadata
    token.parentType = state.types && state.types.length > 0
        ? state.types[state.types.length - 1]
        : '';
    token.parentStart = state.startLine;
    token.map = [item.startLine, item.endLine + 1];
    if (token.hasOwnProperty('inlinePos')) {
        token.bMarks = token.inlinePos.start_content;
    }
    // 6. Logical nesting level for this token
    token.prentLevel = token.type === "latex_list_item_open"
        ? state.prentLevel + 1
        : state.prentLevel;
    // 7. Open / close list environments
    if (token.type === 'enumerate_list_open' || token.type === 'itemize_list_open') {
        state.prentLevel++;
        if (token.type === 'itemize_list_open') {
            state.types.push('itemize');
        }
        else {
            state.types.push('enumerate');
        }
        ctx.iOpen++;
    }
    else {
        if (token.type === 'enumerate_list_close' || token.type === 'itemize_list_close') {
            state.prentLevel--;
            if (state.types && state.types.length > 0) {
                state.types.pop();
            }
            ctx.iOpen--;
        }
    }
    // 8. Attach list-level styling metadata
    token.itemizeLevel = ctx.itemizeLevelTokens;
    token.itemizeLevelContents = ctx.itemizeLevelContents;
    token.enumerateLevel = ctx.enumerateLevelTypes;
};
exports.processListChildToken = processListChildToken;
//# sourceMappingURL=latex-list-tokens.js.map