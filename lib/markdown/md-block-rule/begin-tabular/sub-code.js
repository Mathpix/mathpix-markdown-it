"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubCode = exports.codeInlineContent = exports.getExtractedCodeBlockContent = exports.addExtractedCodeBlock = exports.ClearExtractedCodeBlocks = void 0;
var tslib_1 = require("tslib");
var common_1 = require("./common");
var common_2 = require("../../common");
var placeholder_utils_1 = require("./placeholder-utils");
var CODE_FENCE = '```';
var CODE_FENCE_RE = /```/;
var extractedCodeBlocks = [];
/**
 * Clear all previously extracted code blocks.
 */
var ClearExtractedCodeBlocks = function () {
    extractedCodeBlocks = [];
};
exports.ClearExtractedCodeBlocks = ClearExtractedCodeBlocks;
/**
 * Add a single extracted code block to the internal storage.
 */
var addExtractedCodeBlock = function (item) {
    extractedCodeBlocks.push(item);
};
exports.addExtractedCodeBlock = addExtractedCodeBlock;
/**
 * Replace placeholder markers (<<id>> / <id>) with extracted code block content.
 * Newline-wrapping is applied ONLY when injected content contains BEGIN_LIST_ENV_INLINE_RE.
 * Note: does NOT call getContent; callers should normalize once at the end.
 */
var getExtractedCodeBlockContent = function (inputStr, i) {
    var _a;
    var resContent = inputStr;
    var cellM = (0, placeholder_utils_1.findPlaceholders)(resContent, i);
    if (!cellM) {
        return inputStr;
    }
    var _loop_1 = function (j) {
        var placeholder = cellM[j];
        var id = (0, placeholder_utils_1.placeholderToId)(placeholder);
        if (!id) {
            return "continue";
        }
        var index = extractedCodeBlocks.findIndex(function (item) { return item.id === id; });
        if (index < 0) {
            return "continue";
        }
        var start = resContent.indexOf(placeholder);
        if (start === -1) {
            return "continue";
        }
        var original = (_a = extractedCodeBlocks[index].content) !== null && _a !== void 0 ? _a : "";
        var end = start + placeholder.length;
        // expand nested placeholders first
        var injected = (0, exports.getExtractedCodeBlockContent)(original, 0);
        // decide wrapping based on inline neighbors
        var _b = (0, placeholder_utils_1.getInlineContextAroundSpan)(resContent, start, end), beforeNonSpace = _b.beforeNonSpace, afterNonSpace = _b.afterNonSpace;
        injected = (0, placeholder_utils_1.wrapWithNewlinesIfInline)(injected, beforeNonSpace, afterNonSpace);
        resContent = resContent.slice(0, start) + injected + resContent.slice(end);
    };
    for (var j = 0; j < cellM.length; j++) {
        _loop_1(j);
    }
    return resContent;
};
exports.getExtractedCodeBlockContent = getExtractedCodeBlockContent;
/**
 * Post-process inline code-like items in an array of results:
 * for items of the given `type` replace their content using
 * `getExtractedCodeBlockContent`.
 */
var codeInlineContent = function (res, type) {
    if (type === void 0) { type = 'inline'; }
    res
        .map(function (item) {
        if (item.type === type) {
            var code = (0, exports.getExtractedCodeBlockContent)(item.content, 0);
            item.content = code ? code : item.content;
        }
        return item;
    });
    return res;
};
exports.codeInlineContent = codeInlineContent;
/**
 * Save a code block to the extracted table and return a unique
 * placeholder of the form `<<id>>` to be used in the text.
 */
var saveBlockAndPlaceholder = function (blockText) {
    var id = (0, common_1.generateUniqueId)();
    (0, exports.addExtractedCodeBlock)({ id: id, content: blockText });
    return "<<".concat(id, ">>");
};
/**
 * Replaces all top-level ```...``` code blocks in the string with placeholders,
 * storing the original blocks via saveBlockAndPlaceholder.
 *
 * @param str - Source string that may contain fenced code blocks.
 * @returns String with all fenced code blocks replaced by placeholders.
 */
var getSubCodeBlock = function (str) {
    var result = str;
    while (true) {
        var match = CODE_FENCE_RE.exec(result);
        if (!match) {
            // no more opening fences
            break;
        }
        var start = match.index;
        var end = result.indexOf(CODE_FENCE, start + CODE_FENCE.length);
        // no closing fence – stop processing to avoid breaking the rest of the text
        if (end === -1) {
            break;
        }
        var block = result.slice(start, end + CODE_FENCE.length);
        var placeholder = saveBlockAndPlaceholder(block);
        result =
            result.slice(0, start) +
                placeholder +
                result.slice(end + CODE_FENCE.length);
        // reset lastIndex so that the search starts over again on the updated string
        CODE_FENCE_RE.lastIndex = 0;
    }
    return result;
};
/**
 * Replaces all inline code spans in the given string with `{id}` placeholders
 * and stores the original code in an external table via `mathTablePush`.
 *
 * Flow:
 *  1. First hides fenced/LaTeX code blocks via `getSubCodeBlock`.
 *  2. Then finds inline code spans (e.g. `...` or ``...``) with
 *     `getInlineCodeListFromString`.
 *  3. For each span: generates an id, pushes `{ id, content }` to math table,
 *     and replaces the span in the text with `{id}`.
 *
 * @param input - Original source string.
 * @returns String where inline code is replaced by `{id}` placeholders.
 */
var getSubCode = function (input) {
    var e_1, _a;
    var withBlocksHidden = getSubCodeBlock(input);
    var inlineCodes = (0, common_2.getInlineCodeListFromString)(withBlocksHidden);
    if (!inlineCodes || inlineCodes.length === 0) {
        return withBlocksHidden;
    }
    inlineCodes.sort(function (a, b) { return a.posStart - b.posStart; });
    var result = '';
    var cursor = 0;
    try {
        for (var inlineCodes_1 = tslib_1.__values(inlineCodes), inlineCodes_1_1 = inlineCodes_1.next(); !inlineCodes_1_1.done; inlineCodes_1_1 = inlineCodes_1.next()) {
            var item = inlineCodes_1_1.value;
            if (cursor < item.posStart) {
                result += withBlocksHidden.slice(cursor, item.posStart);
            }
            var codeContent = item.content;
            result += saveBlockAndPlaceholder(codeContent);
            cursor = item.posEnd;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (inlineCodes_1_1 && !inlineCodes_1_1.done && (_a = inlineCodes_1.return)) _a.call(inlineCodes_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    if (cursor < withBlocksHidden.length) {
        result += withBlocksHidden.slice(cursor);
    }
    return result;
};
exports.getSubCode = getSubCode;
//# sourceMappingURL=sub-code.js.map