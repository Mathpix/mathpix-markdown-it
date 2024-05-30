"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fenceBlock = void 0;
var separating_span_1 = require("../common/separating-span");
// fences (``` lang, ~~~ lang)
var fenceBlock = function (state, startLine, endLine, silent) {
    var _a;
    var pos = state.bMarks[startLine] + state.tShift[startLine];
    var max = state.eMarks[startLine];
    var dataSeparatingSpan = [];
    var previewUuid = (_a = state.md.options) === null || _a === void 0 ? void 0 : _a.previewUuid;
    // if it's indented more than 3 spaces, it should be a code block
    if (state.sCount[startLine] - state.blkIndent >= 4) {
        return false;
    }
    if (pos + 3 > max) {
        return false;
    }
    var marker = state.src.charCodeAt(pos);
    if (marker !== 0x7E /* ~ */ && marker !== 0x60 /* ` */) {
        return false;
    }
    // scan marker length
    var mem = pos;
    pos = state.skipChars(pos, marker);
    var len = pos - mem;
    if (len < 3) {
        return false;
    }
    var markup = state.src.slice(mem, pos);
    var params = state.src.slice(pos, max);
    if (marker === 0x60 /* ` */) {
        if (params.indexOf(String.fromCharCode(marker)) >= 0) {
            return false;
        }
    }
    // Since start is found, we can report success here in validation mode
    if (silent) {
        return true;
    }
    var nextLine = startLine;
    var haveEndMarker = false;
    // search end of block
    while (++nextLine < endLine) {
        pos = state.bMarks[nextLine] + state.tShift[nextLine];
        mem = state.bMarks[nextLine] + state.tShift[nextLine];
        max = state.eMarks[nextLine];
        if (pos < max && state.sCount[nextLine] < state.blkIndent) {
            // non-empty line with negative indent should stop the list:
            // - ```
            //  test
            break;
        }
        if (state.src.charCodeAt(pos) !== marker) {
            continue;
        }
        if (state.sCount[nextLine] - state.blkIndent >= 4) {
            // closing fence should be indented less than 4 spaces
            continue;
        }
        pos = state.skipChars(pos, marker);
        // closing code fence must be at least as long as the opening one
        if (pos - mem < len) {
            continue;
        }
        // make sure tail has spaces only
        pos = state.skipSpaces(pos);
        var strAfterCloseTag = state.src.slice(pos, max);
        if ((strAfterCloseTag === null || strAfterCloseTag === void 0 ? void 0 : strAfterCloseTag.length) > 0) {
            dataSeparatingSpan = (0, separating_span_1.getSeparatingSpanFromString)(strAfterCloseTag, 0, [], previewUuid);
            if ((dataSeparatingSpan === null || dataSeparatingSpan === void 0 ? void 0 : dataSeparatingSpan.length) > 0) {
                pos += dataSeparatingSpan[dataSeparatingSpan.length - 1].nextPos;
            }
        }
        if (pos < max) {
            continue;
        }
        haveEndMarker = true;
        // found!
        break;
    }
    // If a fence has heading spaces, they should be removed from its inner block
    len = state.sCount[startLine];
    state.line = nextLine + (haveEndMarker ? 1 : 0);
    var content = state.getLines(startLine + 1, nextLine, len, true);
    var dataContent = (0, separating_span_1.removeSeparatingSpanFromContent)(content, previewUuid);
    var token = state.push('fence', 'code', 0);
    token.info = params;
    token.content = dataContent.content;
    token.contentSpan = dataContent.contentSpan;
    token.contentFull = content;
    token.markup = markup;
    token.map = [startLine, state.line];
    if (dataSeparatingSpan === null || dataSeparatingSpan === void 0 ? void 0 : dataSeparatingSpan.length) {
        for (var i = 0; i < dataSeparatingSpan.length; i++) {
            token = state.push('inline', '', 0);
            token.content = dataSeparatingSpan[i].content;
            token.children = [];
        }
    }
    return true;
};
exports.fenceBlock = fenceBlock;
//# sourceMappingURL=mmd-fence.js.map