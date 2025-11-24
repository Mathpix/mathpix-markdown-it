"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubCode = exports.codeInlineContent = exports.getExtractedCodeBlockContent = exports.addExtractedCodeBlock = exports.ClearExtractedCodeBlocks = void 0;
var tslib_1 = require("tslib");
var common_1 = require("./common");
var sub_math_1 = require("./sub-math");
var common_2 = require("../../common");
var consts_1 = require("../../common/consts");
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
            resContent = resContent.slice(0, iB) + extractedCodeBlocks[index].content + resContent.slice(iB + cellM[j].length);
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
 * `getMathTableContent`.
 */
var codeInlineContent = function (res, type) {
    if (type === void 0) { type = 'inline'; }
    res
        .map(function (item) {
        if (item.type === type) {
            var code = (0, sub_math_1.getMathTableContent)(item.content, 0);
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
 * Hide markdown fenced blocks and LaTeX `lstlisting` environments
 * by replacing them with unique placeholders.
 *
 * - Scans the input line-by-line.
 * - Respects Markdown fence rules (≤3 leading spaces).
 * - Supports nested `lstlisting` environments of the same name.
 */
var getSubCodeBlock = function (input) {
    var result = '';
    var pos = 0;
    var len = input.length;
    // markdown fence state
    var inFenceBlock = false;
    var fenceChar = '';
    var fenceLen = 0;
    var fenceIndent = 0;
    var fenceStart = 0;
    // lstlisting state (supports nesting of lstlisting only)
    var inLstlisting = false;
    var lstDepth = 0;
    var lstStart = 0;
    var nextLineEnd = function (pos) {
        var nl = input.indexOf('\n', pos);
        return nl === -1 ? len : nl + 1;
    };
    // slice "core" of a line: strip leading spaces/tabs and trailing CR/LF only
    var sliceLineCore = function (from, to) {
        var r = to;
        if (r > from && input.charCodeAt(r - 1) === 0x0A)
            r--; // \n
        if (r > from && input.charCodeAt(r - 1) === 0x0D)
            r--; // \r
        var l = from;
        while (l < r) {
            var ch = input.charCodeAt(l);
            if (ch === 0x20 || ch === 0x09)
                l++;
            else
                break; // space/tab
        }
        return input.slice(l, r);
    };
    // fence-opening at the beginning of the line (taking into account ≤3 spaces)
    function matchFenceOpenAtBOL(lineStart, lineEnd) {
        var p = lineStart;
        var indent = 0;
        while (p < lineEnd && (input[p] === ' ' || input[p] === '\t')) {
            indent++;
            p++;
        }
        if (indent > 3)
            return null;
        var ch = input[p];
        if (ch !== '`' && ch !== '~')
            return null;
        var k = p;
        while (k < lineEnd && input[k] === ch)
            k++;
        var markerLen = k - p;
        if (markerLen < 3)
            return null;
        return { ch: ch, len: markerLen, indent: indent };
    }
    // fence-closing (line starts with ≤indent spaces + ≥len of the same character)
    function isFenceCloseAtBOL(lineStart, lineEnd) {
        var p = lineStart;
        var indent = 0;
        while (p < lineEnd && (input[p] === ' ' || input[p] === '\t')) {
            indent++;
            p++;
        }
        if (indent > fenceIndent)
            return false;
        var k = p;
        var cnt = 0;
        while (k < lineEnd && input[k] === fenceChar) {
            cnt++;
            k++;
        }
        return cnt >= fenceLen;
    }
    // ONLY lstlisting begin/end (line-level)
    var isLstBeginLine = function (lineStart, lineEnd) {
        var core = sliceLineCore(lineStart, lineEnd);
        return consts_1.BEGIN_LST_RE.test(core);
    };
    var isLstEndLine = function (lineStart, lineEnd) {
        var core = sliceLineCore(lineStart, lineEnd);
        return consts_1.END_LST_RE.test(core);
    };
    while (pos < len) {
        var lineStart = pos;
        var lineEnd = nextLineEnd(pos);
        if (inFenceBlock) {
            if (isFenceCloseAtBOL(lineStart, lineEnd)) {
                var block = input.slice(fenceStart, lineEnd);
                result += saveBlockAndPlaceholder(block);
                pos = lineEnd;
                inFenceBlock = false;
                fenceChar = '';
                fenceLen = 0;
                fenceIndent = 0;
                continue;
            }
            pos = lineEnd;
            continue;
        }
        if (inLstlisting) {
            if (isLstBeginLine(lineStart, lineEnd)) {
                lstDepth++;
                pos = lineEnd;
                continue;
            }
            if (isLstEndLine(lineStart, lineEnd)) {
                lstDepth--;
                pos = lineEnd;
                if (lstDepth === 0) {
                    var block = input.slice(lstStart, pos);
                    result += saveBlockAndPlaceholder(block);
                    inLstlisting = false;
                    lstStart = 0;
                }
                continue;
            }
            pos = lineEnd;
            continue;
        }
        // outside blocks: check openings
        if (isLstBeginLine(lineStart, lineEnd)) {
            inLstlisting = true;
            lstDepth = 1;
            lstStart = lineStart;
            pos = lineEnd;
            continue;
        }
        var fenceOpen = matchFenceOpenAtBOL(lineStart, lineEnd);
        if (fenceOpen) {
            inFenceBlock = true;
            fenceChar = fenceOpen.ch;
            fenceLen = fenceOpen.len;
            fenceIndent = fenceOpen.indent;
            fenceStart = lineStart;
            pos = lineEnd;
            continue;
        }
        result += input.slice(lineStart, lineEnd);
        pos = lineEnd;
    }
    if (inFenceBlock) {
        result += input.slice(fenceStart);
    }
    if (inLstlisting) {
        result += input.slice(lstStart);
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
            var id = (0, common_1.generateUniqueId)();
            (0, sub_math_1.mathTablePush)({ id: id, content: codeContent });
            result += "{".concat(id, "}");
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