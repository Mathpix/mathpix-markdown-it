"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitInlineListEnv = exports.resolveListPadding = exports.finalizeListItems = exports.ItemsAddToPrev = exports.ItemsListPush = exports.ListItems = void 0;
var tslib_1 = require("tslib");
var latex_list_tokens_1 = require("./latex-list-tokens");
var helper_1 = require("../md-block-rule/helper");
var consts_1 = require("../common/consts");
var list_state_1 = require("./list-state");
/**
 * Processes LaTeX list items and generates Markdown-It tokens
 * for both inline content and nested list structures.
 *
 * @param state - Markdown-It list processing state
 * @param items - Parsed list items from LaTeX environment
 * @param itemizeLevelTokens - Current itemize nesting level
 * @param enumerateLevelTypes - Current enumerate nesting level
 * @param li - Optional starting value for enumerate items
 * @param iOpen - Current count of open list environments
 * @param itemizeLevelContents - Itemize content depth level
 *
 * @returns {ListItemsResult} Updated open-list count and computed padding
 */
var ListItems = function (state, items, itemizeLevelTokens, enumerateLevelTypes, li, iOpen, itemizeLevelContents, openTokens, allListTokens) {
    var e_1, _a, e_2, _b;
    var _c, _d, _e;
    if (!items || items.length === 0) {
        return { iOpen: iOpen };
    }
    try {
        for (var items_1 = tslib_1.__values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
            var listItem = items_1_1.value;
            state.env.parentType = state.parentType;
            state.env.isBlock = true;
            state.env.prentLevel = state.prentLevel;
            state.env.inheritedListType = state.parentType;
            listItem.content = listItem.content.trim();
            // A chunk with no `\item` of its own, before the first one: its tokens went straight into the
            // `<ul>`. Wrapped after they are emitted, below — a chunk that emits nothing gets no `<li>`.
            var looseFrom = openTokens.length > 0
                && !consts_1.LATEX_ITEM_COMMAND_RE.test(listItem.content)
                && !((_c = (0, list_state_1.getCurrentListLevelState)()) === null || _c === void 0 ? void 0 : _c.openItems)
                ? state.tokens.length
                : -1;
            // Detect block-level item content: a LaTeX block env, a backtick (code span/fence), or a tilde fence.
            if (consts_1.LATEX_BLOCK_ENV_OPEN_RE.test(listItem.content) || listItem.content.indexOf('`') > -1 || listItem.content.indexOf('~~~') > -1) {
                var match = listItem.content.match(consts_1.LATEX_ITEM_COMMAND_RE);
                if (match) {
                    var itemToken = (0, latex_list_tokens_1.setTokenListItemOpenBlock)(state, listItem.startLine, listItem.endLine + 1, match[1], li, itemizeLevelTokens, enumerateLevelTypes, itemizeLevelContents);
                    // Block items skip the inline path, so measure the marker here too — attribute to the
                    // innermost open list (this item's list), not always the outer one.
                    if (itemToken.hasOwnProperty('marker')) {
                        var paddingChild = (0, latex_list_tokens_1.computeMarkerPadding)(itemToken.markerTokens);
                        var top_1 = openTokens[openTokens.length - 1];
                        if (top_1 && (!top_1.padding || top_1.padding < paddingChild)) {
                            top_1.padding = paddingChild;
                        }
                    }
                    if (li && li.hasOwnProperty('value')) {
                        li = null;
                    }
                    var rawContent = (_e = (_d = listItem === null || listItem === void 0 ? void 0 : listItem.content) === null || _d === void 0 ? void 0 : _d.slice(match.index + match[0].length)) !== null && _e !== void 0 ? _e : '';
                    var blockContent = rawContent.trim();
                    (0, helper_1.SetTokensBlockParse)(state, blockContent, { disableBlockRules: true });
                    // Clears isBlock after the *last* block item; for earlier ones the next iteration sets it
                    // back. The Lists rule's finally is the actual guarantee — do not drop it for this line.
                    state.env.isBlock = false;
                    continue;
                }
                // No marker here — the chunk follows a closed nested list, or precedes the first `\item`.
                // Same path as the marker case above, so a block env renders alike wherever it sits.
                if (consts_1.LATEX_BLOCK_ENV_OPEN_RE.test(listItem.content)) {
                    (0, helper_1.SetTokensBlockParse)(state, listItem.content, { disableBlockRules: true });
                    if (looseFrom >= 0) {
                        (0, latex_list_tokens_1.wrapLooseRun)(state, looseFrom);
                    }
                    state.env.isBlock = false;
                    continue;
                }
            }
            // Parse inline children
            var inlineChildren = [];
            state.md.inline.parse(listItem.content.trim(), state.md, state.env, inlineChildren);
            // Context shared across child token processing
            var ctx = { li: li, iOpen: iOpen, itemizeLevelTokens: itemizeLevelTokens, enumerateLevelTypes: enumerateLevelTypes, itemizeLevelContents: itemizeLevelContents, openTokens: openTokens, allListTokens: allListTokens };
            try {
                // Process each inline child token
                for (var inlineChildren_1 = (e_2 = void 0, tslib_1.__values(inlineChildren)), inlineChildren_1_1 = inlineChildren_1.next(); !inlineChildren_1_1.done; inlineChildren_1_1 = inlineChildren_1.next()) {
                    var child = inlineChildren_1_1.value;
                    (0, latex_list_tokens_1.processListChildToken)(state, listItem, child, ctx);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (inlineChildren_1_1 && !inlineChildren_1_1.done && (_b = inlineChildren_1.return)) _b.call(inlineChildren_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            if (looseFrom >= 0) {
                (0, latex_list_tokens_1.wrapLooseRun)(state, looseFrom);
            }
            // Update context after processing children
            li = ctx.li;
            iOpen = ctx.iOpen;
            state.env.isBlock = false;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (items_1_1 && !items_1_1.done && (_a = items_1.return)) _a.call(items_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return { iOpen: iOpen };
};
exports.ListItems = ListItems;
/**
 * Splits a line of LaTeX list content into logical items based on `\item`
 * and appends them to the given `items` array.
 *
 * Special handling:
 * - If `\item` appears in the middle of the line and both the prefix and
 *   suffix contain backticks, the whole line is treated as a continuation
 *   of the previous item.
 * - Otherwise, text before `\item` is appended to the previous item
 *   (if any), and the rest is processed recursively as a new item segment.
 *
 * The function mutates and also returns the `items` array for convenience.
 *
 * @param items - Accumulator of parsed list items
 * @param content - Current line content
 * @param startLine - Line number where this piece starts
 * @param endLine - Line number where this piece ends
 * @returns The updated array of parsed list items
 */
var ItemsListPush = function (items, content, startLine, endLine) {
    var index = content.search(consts_1.LATEX_ITEM_SPLIT_RE);
    // No "\item" in the line or at the very start: treat whole line as one chunk
    if (index <= 0) {
        items.push({ content: content, startLine: startLine, endLine: endLine });
        return items;
    }
    var before = content.slice(0, index);
    var after = content.slice(index);
    var hasBacktickBefore = before.includes("`");
    var hasBacktickAfter = after.includes("`");
    // Case 1: both parts contain backticks → treat as continuation of previous item
    if (hasBacktickBefore && hasBacktickAfter) {
        if (items.length > 0) {
            var lastIndex = items.length - 1;
            items[lastIndex].content += "\n" + content;
            items[lastIndex].endLine += 1;
        }
        else {
            items.push({ content: content, startLine: startLine, endLine: endLine });
        }
        return items;
    }
    // Case 2: normal case with "\item" in the middle
    if (items.length > 0) {
        // Append prefix to previous item
        var lastIndex = items.length - 1;
        items[lastIndex].content += "\n" + before;
        items[lastIndex].endLine += 1;
    }
    else if (before.trim().length > 0) {
        // No previous items: keep prefix as a separate item
        items.push({ content: before, startLine: startLine, endLine: endLine });
    }
    // Recursively process the remaining part starting from "\item"
    return (0, exports.ItemsListPush)(items, after, startLine, endLine);
};
exports.ItemsListPush = ItemsListPush;
/**
 * Appends the given line to the previous parsed list item if it exists,
 * or creates a new list item from the line if the list is empty and
 * the line is not an inline list environment closing command.
 *
 * This is used to merge continuation lines into the last list item.
 *
 * @param items - Accumulated list of parsed items
 * @param lineText - Current line text to append or add as a new item
 * @param nextLine - Line number of the current line
 * @returns The updated list of parsed items
 */
var ItemsAddToPrev = function (items, lineText, nextLine, keepLineBreak) {
    if (keepLineBreak === void 0) { keepLineBreak = true; }
    if (items.length > 0) {
        var lastIndex = items.length - 1;
        // Without the break for a line that renders to nothing: the softbreak would outlive it as `<br>`.
        items[lastIndex].content += (keepLineBreak ? "\n" : "") + lineText;
        items[lastIndex].endLine = nextLine;
        return items;
    }
    // No previous items: optionally create a new item,
    // but skip pure inline end-of-list commands.
    if (!consts_1.END_LIST_ENV_INLINE_RE.test(lineText)) {
        (0, exports.ItemsListPush)(items, lineText, nextLine, nextLine);
    }
    return items;
};
exports.ItemsAddToPrev = ItemsAddToPrev;
var finalizeListItems = function (state, items, itemizeLevelTokens, enumerateLevelTypes, li, iOpen, itemizeLevelContents, openTokens, allListTokens) {
    // ListItems records each marker's width on its innermost open list (openTokens[last]) — both
    // block items here and inline-opened nested lists — so the indent is resolved later, top-down,
    // once every list's final width is known (see resolveListPadding), independent of item order.
    var dataItems = (0, exports.ListItems)(state, items, itemizeLevelTokens, enumerateLevelTypes, li, iOpen, itemizeLevelContents, openTokens, allListTokens);
    return {
        iOpen: dataItems.iOpen,
        items: [],
        li: null,
    };
};
exports.finalizeListItems = finalizeListItems;
/**
 * Resolve per-list padding top-down (doc order) once every list's width is recorded. A list keeps
 * the default unless its marker overflows the ancestor indent + default, then reserves the
 * shortfall; the total (ancestor + own) is clamped to LIST_MAX_INDENT_EM. Depth = prentLevel.
 */
var resolveListPadding = function (listTokens) {
    var e_3, _a;
    if (!listTokens.length)
        return;
    // No marker wider than the default can produce an attribute, so the arithmetic below is skipped.
    var overflows = false;
    for (var i = 0; i < listTokens.length; i++) {
        if ((listTokens[i].padding || 0) > consts_1.LIST_DEFAULT_INDENT_EM) {
            overflows = true;
            break;
        }
    }
    if (!overflows)
        return;
    var baseDepth = listTokens[0].prentLevel || 0;
    // prefix[d] = indent summed over the levels above d; after a token of depth d it is d+2 long.
    var prefix = [0];
    try {
        for (var listTokens_1 = tslib_1.__values(listTokens), listTokens_1_1 = listTokens_1.next(); !listTokens_1_1.done; listTokens_1_1 = listTokens_1.next()) {
            var token = listTokens_1_1.value;
            // Clamp depth to >= 0 (a negative would throw on prefix.length below).
            var depth = Math.max(0, (token.prentLevel || 0) - baseDepth);
            // Fill any skipped level with the default FIRST, so the ancestor sum has no holes (no NaN).
            for (var d = prefix.length; d <= depth; d++) {
                prefix[d] = prefix[d - 1] + consts_1.LIST_DEFAULT_INDENT_EM;
            }
            // Ancestor indent counts toward the marker's room: it sits at `right: 100%` of the item, so it
            // grows leftwards into what the ancestors already reserved (see .li_level in styles-lists.ts).
            var ancestorSum = prefix[depth];
            var total = Math.min(token.padding || 0, consts_1.LIST_MAX_INDENT_EM);
            // Ceil, never round: the reserve must not fall below the need — float noise can add one
            // hundredth on top, which is the safe direction. Negative past the clamp.
            var em = Math.ceil((total - ancestorSum) * 100) / 100;
            // Own indent for this level: the reserved em when the marker overflows, else the default.
            var indentEm = em > consts_1.LIST_DEFAULT_INDENT_EM ? em : consts_1.LIST_DEFAULT_INDENT_EM;
            if (em > consts_1.LIST_DEFAULT_INDENT_EM) {
                // Matches PADDING_EM_RE by construction: clamped to (default, LIST_MAX_INDENT_EM] and ceiled
                // to two decimals, so never exponential or negative. The renderer drops a miss silently.
                token.attrSet("data-padding-inline-start", String(em) + "em");
            }
            prefix.length = depth + 1;
            prefix[depth + 1] = ancestorSum + indentEm;
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (listTokens_1_1 && !listTokens_1_1.done && (_a = listTokens_1.return)) _a.call(listTokens_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
};
exports.resolveListPadding = resolveListPadding;
var splitInlineListEnv = function (lineText, match) {
    var sB = match.index > 0 ? lineText.slice(0, match.index).trim() : "";
    var sE = match.index + match[0].length < lineText.length
        ? lineText.slice(match.index + match[0].length).trim()
        : "";
    var isBacktickEscapedPair = sB.includes("`") && sE.includes("`");
    return { sB: sB, sE: sE, isBacktickEscapedPair: isBacktickEscapedPair };
};
exports.splitInlineListEnv = splitInlineListEnv;
//# sourceMappingURL=latex-list-items.js.map