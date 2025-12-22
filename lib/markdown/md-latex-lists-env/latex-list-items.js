"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitInlineListEnv = exports.finalizeListItems = exports.ItemsAddToPrev = exports.ItemsListPush = exports.ListItems = exports.ListItemsBlock = void 0;
var tslib_1 = require("tslib");
var latex_list_tokens_1 = require("./latex-list-tokens");
var helper_1 = require("../md-block-rule/helper");
var consts_1 = require("../common/consts");
/**
 * Processes block-style LaTeX list items by parsing their content
 * using the block parser. This is used for items whose content
 * contains block environments (e.g., \begin{table}, \begin{figure}, etc.).
 *
 * @param state - Markdown-It processing state
 * @param items - Array of parsed list items
 */
var ListItemsBlock = function (state, items) {
    var e_1, _a;
    var _b;
    if (!items || items.length === 0) {
        return;
    }
    try {
        for (var items_1 = tslib_1.__values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
            var item = items_1_1.value;
            var rawContent = (_b = item === null || item === void 0 ? void 0 : item.content) !== null && _b !== void 0 ? _b : '';
            var itemContent = rawContent.trim();
            (0, helper_1.SetTokensBlockParse)(state, itemContent, {
                startLine: item.startLine,
                endLine: item.endLine + 1,
                disableBlockRules: true
            });
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (items_1_1 && !items_1_1.done && (_a = items_1.return)) _a.call(items_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
};
exports.ListItemsBlock = ListItemsBlock;
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
var ListItems = function (state, items, itemizeLevelTokens, enumerateLevelTypes, li, iOpen, itemizeLevelContents) {
    var e_2, _a, e_3, _b;
    var _c, _d;
    var padding = 0;
    if (!items || items.length === 0) {
        return { iOpen: iOpen, padding: padding };
    }
    try {
        for (var items_2 = tslib_1.__values(items), items_2_1 = items_2.next(); !items_2_1.done; items_2_1 = items_2.next()) {
            var listItem = items_2_1.value;
            state.env.parentType = state.parentType;
            state.env.isBlock = true;
            state.env.prentLevel = state.prentLevel;
            listItem.content = listItem.content.trim();
            // Detect block-level item content
            if (consts_1.LATEX_BLOCK_ENV_OPEN_RE.test(listItem.content) || (listItem.content.indexOf('`') > -1)) {
                var match = listItem.content.match(consts_1.LATEX_ITEM_COMMAND_RE);
                if (match) {
                    (0, latex_list_tokens_1.setTokenListItemOpenBlock)(state, listItem.startLine, listItem.endLine + 1, match[1], li, itemizeLevelTokens, enumerateLevelTypes, itemizeLevelContents);
                    if (li && li.hasOwnProperty('value')) {
                        li = null;
                    }
                    var rawContent = (_d = (_c = listItem === null || listItem === void 0 ? void 0 : listItem.content) === null || _c === void 0 ? void 0 : _c.slice(match.index + match[0].length)) !== null && _d !== void 0 ? _d : '';
                    var blockContent = rawContent.trim();
                    (0, helper_1.SetTokensBlockParse)(state, blockContent, { disableBlockRules: true });
                    continue;
                }
            }
            // Parse inline children
            var inlineChildren = [];
            state.md.inline.parse(listItem.content.trim(), state.md, state.env, inlineChildren);
            // Context shared across child token processing
            var ctx = { li: li, padding: padding, iOpen: iOpen, itemizeLevelTokens: itemizeLevelTokens, enumerateLevelTypes: enumerateLevelTypes, itemizeLevelContents: itemizeLevelContents };
            try {
                // Process each inline child token
                for (var inlineChildren_1 = (e_3 = void 0, tslib_1.__values(inlineChildren)), inlineChildren_1_1 = inlineChildren_1.next(); !inlineChildren_1_1.done; inlineChildren_1_1 = inlineChildren_1.next()) {
                    var child = inlineChildren_1_1.value;
                    (0, latex_list_tokens_1.processListChildToken)(state, listItem, child, ctx);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (inlineChildren_1_1 && !inlineChildren_1_1.done && (_b = inlineChildren_1.return)) _b.call(inlineChildren_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
            // Update context after processing children
            li = ctx.li;
            padding = ctx.padding;
            iOpen = ctx.iOpen;
            state.env.isBlock = false;
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (items_2_1 && !items_2_1.done && (_a = items_2.return)) _a.call(items_2);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return {
        iOpen: iOpen,
        padding: padding
    };
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
    var index = content.indexOf('\\item');
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
var ItemsAddToPrev = function (items, lineText, nextLine) {
    if (items.length > 0) {
        var lastIndex = items.length - 1;
        items[lastIndex].content += "\n" + lineText;
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
var finalizeListItems = function (state, items, itemizeLevelTokens, enumerateLevelTypes, li, iOpen, itemizeLevelContents, tokenStart) {
    var dataItems = (0, exports.ListItems)(state, items, itemizeLevelTokens, enumerateLevelTypes, li, iOpen, itemizeLevelContents);
    if (tokenStart) {
        var p = tokenStart;
        if (!p.padding || p.padding < dataItems.padding) {
            p.padding = dataItems.padding;
            if (p.padding > 3) {
                p.attrSet("data-padding-inline-start", String(dataItems.padding * 14));
            }
        }
    }
    return {
        iOpen: dataItems.iOpen,
        items: [],
        li: null,
    };
};
exports.finalizeListItems = finalizeListItems;
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