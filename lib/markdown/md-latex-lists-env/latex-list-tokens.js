"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processListChildToken = exports.setTokenCloseList = exports.ListOpen = exports.setTokenOpenList = exports.setTokenListItemOpenBlock = exports.wrapLooseRun = exports.absorbSublistIntoWrapper = exports.listHostFlags = exports.LIST_CLOSE_TYPES = exports.LIST_OPEN_TYPES = exports.computeMarkerPadding = void 0;
var tslib_1 = require("tslib");
var list_state_1 = require("./list-state");
var latex_list_types_1 = require("./latex-list-types");
var re_level_1 = require("./re-level");
var latex_list_common_1 = require("./latex-list-common");
var consts_1 = require("../common/consts");
var display_width_1 = require("../common/display-width");
/**
 * Marker reservation for a custom `\item[...]` in `em`: sum of per-token widths (text by
 * glyph class, math by `widthEx`) plus one marker→content gap. Shared by the inline and
 * block item paths in `ListItems`.
 *
 * @param markerTokens - Parsed inline tokens of the marker
 * @returns Total marker reservation in em
 */
var computeMarkerPadding = function (markerTokens) {
    var em = 0;
    var tokens = markerTokens !== null && markerTokens !== void 0 ? markerTokens : [];
    for (var i = 0; i < tokens.length; i++) {
        em += (0, display_width_1.tokenMarkerWidth)(tokens[i]);
    }
    return em > 0 ? em + consts_1.MARKER_GAP_EM : 0;
};
exports.computeMarkerPadding = computeMarkerPadding;
// Such a token ends the loose run: it carries its own `<li>`, or it closes the list the run sits in.
var LIST_STRUCTURE_TYPES = consts_1.LIST_STRUCTURE_TOKEN_TYPES;
exports.LIST_OPEN_TYPES = consts_1.LIST_OPEN_TOKEN_TYPES;
exports.LIST_CLOSE_TYPES = consts_1.LIST_CLOSE_TOKEN_TYPES;
/** Per list open, and copied onto its matching close: 0 needs no host, 1 sits in an `itemize`, 2 in an
 *  `enumerate`. A list is hosted when the container it opens in is a list rather than an item — reading
 *  only the token before it missed a list opening after a sibling's close, which then had no `<li>`. */
var listHostFlags = function (tokens) {
    var flags = new Int8Array(tokens.length);
    // Open containers, innermost last. One stack, so a stream that closes a list with an item still open
    // cannot desync it: that close drops the items inside, as HTML and the parse path both do.
    var open = [];
    for (var i = 0; i < tokens.length; i++) {
        var type = tokens[i].type;
        if (exports.LIST_OPEN_TYPES.has(type)) {
            var parent_1 = open[open.length - 1];
            if (parent_1 === null || parent_1 === void 0 ? void 0 : parent_1.isList) {
                flags[i] = tokens[parent_1.at].type === 'itemize_list_open' ? 1 : 2;
            }
            open.push({ isList: true, at: i });
        }
        else if (exports.LIST_CLOSE_TYPES.has(type)) {
            while (open.length && !open[open.length - 1].isList) {
                open.pop();
            }
            var list = open.pop();
            if (list) {
                flags[i] = flags[list.at];
            }
        }
        else if (type === 'latex_list_item_open') {
            open.push({ isList: false, at: i });
        }
        else if (type === 'latex_list_item_close') {
            if (open.length && !open[open.length - 1].isList) {
                open.pop();
            }
        }
    }
    return flags;
};
exports.listHostFlags = listHostFlags;
// Where the loose run ends: a sublist written in the chunk belongs inside its `<li>`, so a balanced
// open…close pair is taken whole. An unbalanced closer is the enclosing list's — stop before it.
var looseRunEnd = function (tokens, from, limit) {
    var depth = 0;
    for (var i = from; i < limit; i++) {
        var type = tokens[i].type;
        if (exports.LIST_OPEN_TYPES.has(type)) {
            depth++;
            continue;
        }
        if (depth > 0) {
            if (exports.LIST_CLOSE_TYPES.has(type)) {
                depth--;
            }
            continue;
        }
        if (LIST_STRUCTURE_TYPES.has(type)) {
            return i;
        }
    }
    // An unclosed sublist would cross the tags: keep what precedes it.
    return depth > 0 ? looseRunEndBeforeOpen(tokens, from, limit) : limit;
};
// Falls back to the first list open, the run then holding no list at all.
var looseRunEndBeforeOpen = function (tokens, from, limit) {
    for (var i = from; i < limit; i++) {
        if (LIST_STRUCTURE_TYPES.has(tokens[i].type)) {
            return i;
        }
    }
    return limit;
};
// The open token of the item this close belongs to, or null.
// Both pairings in one pass: item close → its open, and list open index → the index that balances it.
// Searching per candidate cost 320k token steps on 200 wrappers, growing ×4 per doubling.
var pairListTokens = function (tokens) {
    var openerOf = new Map();
    var closeAt = new Int32Array(tokens.length).fill(-1);
    var lists = [];
    var items = [];
    for (var i = 0; i < tokens.length; i++) {
        var type = tokens[i].type;
        if (exports.LIST_OPEN_TYPES.has(type)) {
            lists.push(i);
        }
        else if (exports.LIST_CLOSE_TYPES.has(type)) {
            var at = lists.pop();
            if (at !== undefined) {
                closeAt[at] = i;
            }
        }
        else if (type === 'latex_list_item_open') {
            items.push(tokens[i]);
        }
        else if (type === 'latex_list_item_close') {
            var open_1 = items.pop();
            if (open_1) {
                openerOf.set(tokens[i], open_1);
            }
        }
    }
    return { openerOf: openerOf, closeAt: closeAt };
};
// A sublist emitted after a marker-less wrapper has closed is a bare `<ul>` inside `<ul>`. Moves that
// close past the sublist, so it sits in the `<li>` — done on tokens, the exports walking those.
// `level` needs no fixing up: only the close moves, and it closes the same item either side.
var absorbSublistIntoWrapper = function (tokens, from) {
    var _a, _b;
    var start = Math.max(from, 1);
    var _c = pairListTokens(tokens), openerOf = _c.openerOf, closeAt = _c.closeAt;
    // Rebuilt rather than spliced: a splice per wrapper is another O(n) each.
    var out = [];
    var moved = false;
    var i = 0;
    while (i < tokens.length) {
        // The tail of `out`, not `tokens[i - 1]`: a close already moved here is the one to move on.
        var tail = out[out.length - 1];
        // `closeAt[i] >= 0` keeps this terminating: an unpaired open would set `i` back to 0 and loop.
        if (i >= start && exports.LIST_OPEN_TYPES.has(tokens[i].type) && closeAt[i] >= 0
            && (tail === null || tail === void 0 ? void 0 : tail.type) === 'latex_list_item_close' && ((_b = (_a = openerOf.get(tail)) === null || _a === void 0 ? void 0 : _a.meta) === null || _b === void 0 ? void 0 : _b.markerEmpty)) {
            var end = closeAt[i];
            out.pop();
            for (var k = i; k <= end; k++) {
                out.push(tokens[k]);
            }
            out.push(tail);
            moved = true;
            i = end + 1;
            continue;
        }
        out.push(tokens[i]);
        i++;
    }
    // The common list has no marker-less wrapper at all: nothing was moved, so nothing to write back.
    if (!moved) {
        return;
    }
    tokens.length = 0;
    for (var k = 0; k < out.length; k++) {
        tokens.push(out[k]);
    }
};
exports.absorbSublistIntoWrapper = absorbSublistIntoWrapper;
var wrapLooseRun = function (state, from) {
    var _a;
    var end = looseRunEnd(state.tokens, from, state.tokens.length);
    var run = state.tokens.slice(from, end);
    // Whitespace alone is not content: the same run reaches here trimmed from the block path.
    if (!run.some(function (t) { return t.type !== 'text' || (t.content || '').trim(); })) {
        return;
    }
    // Without the constructor the run stays where it is: a loose child renders, a thrown rule does not.
    // Silent by decision — a missing constructor is a caller error, not a document one; pinned by a test.
    if (typeof state.Token !== 'function') {
        return;
    }
    var open = new state.Token('latex_list_item_open', 'li', 1);
    open.block = true;
    open.level = state.level;
    // `block` marks an item holding block markup, as the written-item path does for the same content.
    var holdsBlock = run.some(function (t) { return t.block; });
    open.meta = { markerEmpty: true, isBlock: holdsBlock };
    open.parentType = ((_a = state.types) === null || _a === void 0 ? void 0 : _a.length) > 0
        ? state.types[state.types.length - 1]
        : state.parentType;
    // Line span of what it wraps, so line numbering has the same anchor as a written item.
    var mapped = run.filter(function (t) { return t.map; });
    if (mapped.length) {
        open.map = [mapped[0].map[0], mapped[mapped.length - 1].map[1]];
    }
    var close = new state.Token('latex_list_item_close', 'li', -1);
    close.block = true;
    close.level = state.level;
    // Spliced, not pushed, so `state.level` stays where the caller left it — the wrapped run keeps its own.
    state.tokens.splice(from, 0, open);
    state.tokens.splice(end + 1, 0, close);
};
exports.wrapLooseRun = wrapLooseRun;
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
        // Parse the trimmed marker so markerTokens (used for width and rendering)
        // don't carry edge whitespace that inflates the padding.
        var trimmedMarker = marker.trim();
        token.marker = trimmedMarker;
        var parsedMarkerTokens = [];
        state.md.inline.parse(trimmedMarker, state.md, state.env, parsedMarkerTokens);
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
    return token;
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
var ListOpen = function (state, startLine, lineText, itemizeLevelTokens, enumerateLevelTypes, itemizeLevelContents, openTokens, allListTokens) {
    var e_1, _a;
    var tokenStart = null;
    var iOpen = 0;
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
    // Register the new list so its marker padding is attributed here (same registry the block
    // path uses), covering same-line/single-line lists that never reach the block loop.
    openTokens.push(tokenStart);
    allListTokens.push(tokenStart);
    // Process inline content after \begin{...}
    if (strAfter && strAfter.trim().length > 0) {
        // Same-line content before the first `\item` lands in the `<ul>` like a chunk does.
        var looseFrom = state.tokens.length;
        var children = [];
        state.env.parentType = state.parentType;
        state.env.isBlock = true;
        state.env.prentLevel = state.prentLevel;
        state.env.inheritedListType = state.parentType;
        state.md.inline.parse(strAfter, state.md, state.env, children);
        // Context shared across child token processing
        var ctx = {
            li: li,
            iOpen: iOpen,
            itemizeLevelTokens: itemizeLevelTokens,
            enumerateLevelTypes: enumerateLevelTypes,
            itemizeLevelContents: itemizeLevelContents,
            openTokens: openTokens,
            allListTokens: allListTokens
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
        (0, exports.wrapLooseRun)(state, looseFrom);
        // Update context after processing children
        li = ctx.li;
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
var setTokenCloseList = function (state, startLine, endLine, opener) {
    var _a;
    // Close an open <li> if there is one
    (0, latex_list_common_1.closeOpenListItemIfNeeded)(state);
    // The opener's own kind when it is known: crossed env names put a different type on `state.types`,
    // and the close then emitted `</ul>` for an `<ol>` — a tag with no opener of its own.
    var currentListType = opener
        ? (opener.type === 'itemize_list_open' ? latex_list_types_1.ListType.itemize : latex_list_types_1.ListType.enumerate)
        : (_a = state.types) === null || _a === void 0 ? void 0 : _a[state.types.length - 1];
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
        // A number, as the block path stores it: the two agreed only because consumers stringify it.
        var parsed = parseInt(child.content, 10);
        ctx.li = { value: Number.isNaN(parsed) ? 1 : parsed };
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
    // 4. Marker width → attribute to the innermost open list (not always the outer one).
    if (token.hasOwnProperty('marker')) {
        var paddingChild = (0, exports.computeMarkerPadding)(token.markerTokens);
        var top_1 = ctx.openTokens[ctx.openTokens.length - 1];
        if (top_1 && (!top_1.padding || top_1.padding < paddingChild)) {
            top_1.padding = paddingChild;
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
    if (exports.LIST_OPEN_TYPES.has(token.type)) {
        state.prentLevel++;
        // Seeded like the close branch checks it: an inline state built by a foreign rule may have none.
        if (!state.types) {
            state.types = [];
        }
        state.types.push(token.type === 'itemize_list_open' ? 'itemize' : 'enumerate');
        ctx.iOpen++;
        // Register in the shared registry so resolveListPadding sees inline-opened nested lists.
        token.prentLevel = state.prentLevel; // depth after entering, matching the block path
        ctx.openTokens.push(token);
        ctx.allListTokens.push(token);
    }
    else {
        if (exports.LIST_CLOSE_TYPES.has(token.type)) {
            // Clamped like the block path: an unpaired close would make the level key negative.
            state.prentLevel = Math.max(0, state.prentLevel - 1);
            if (state.types && state.types.length > 0) {
                state.types.pop();
            }
            ctx.iOpen--;
            // Pop only a list of the matching kind. Weaker than the block path, which compares the
            // token itself: an unpaired close of the *same* kind still pops an outer list here, since
            // a close token carries no link to its opener in the inline stream.
            var openType = token.type === 'itemize_list_close' ? 'itemize_list_open' : 'enumerate_list_open';
            if (((_c = ctx.openTokens[ctx.openTokens.length - 1]) === null || _c === void 0 ? void 0 : _c.type) === openType) {
                ctx.openTokens.pop();
            }
        }
    }
    // 8. Attach list-level styling metadata
    token.itemizeLevel = ctx.itemizeLevelTokens;
    token.itemizeLevelContents = ctx.itemizeLevelContents;
    token.enumerateLevel = ctx.enumerateLevelTypes;
};
exports.processListChildToken = processListChildToken;
//# sourceMappingURL=latex-list-tokens.js.map