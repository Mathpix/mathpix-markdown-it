"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubCode = exports.codeInlineContent = exports.getExtractedCodeBlockContent = exports.addExtractedCodeBlock = exports.ClearExtractedCodeBlocks = void 0;
var tslib_1 = require("tslib");
var common_1 = require("./common");
var common_2 = require("../../common");
var consts_1 = require("../../common/consts");
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
 * Replace placeholder markers (e.g. <<uuid>> or <uuid>) in a string
 * with the corresponding extracted code block content.
 *
 * Returns the updated string with placeholders resolved and post-processed
 * by `getContent`.
 */
var getExtractedCodeBlockContent = function (inputStr, i) {
    var sub = inputStr;
    var resContent = sub;
    sub = sub.trim();
    var cellM = sub.slice(i).match(consts_1.doubleAngleBracketUuidPattern);
    cellM = cellM ? cellM : sub.slice(i).match(consts_1.singleAngleBracketPattern);
    if (!cellM) {
        return inputStr;
    }
    var _loop_1 = function (j) {
        var content = cellM[j].replace(/</g, '').replace(/>/g, '');
        var index = extractedCodeBlocks.findIndex(function (item) { return item.id === content; });
        if (index >= 0) {
            var iB = resContent.indexOf(cellM[j]);
            var codeContent = extractedCodeBlocks[index].content;
            codeContent = (0, exports.getExtractedCodeBlockContent)(codeContent, 0);
            resContent = resContent.slice(0, iB) + codeContent + resContent.slice(iB + cellM[j].length);
        }
    };
    for (var j = 0; j < cellM.length; j++) {
        _loop_1(j);
    }
    resContent = (0, common_1.getContent)(resContent);
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