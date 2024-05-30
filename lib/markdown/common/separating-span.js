"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHtmlSeparatingSpanContainer = exports.removeSeparatingSpanFromContent = exports.getContentAndSeparatingSpanFromLine = exports.getSeparatingSpanFromString = void 0;
var tslib_1 = require("tslib");
var consts_1 = require("./consts");
var getSeparatingSpanFromString = function (str, pos, res, previewUuid) {
    var _a, _b;
    if (pos === void 0) { pos = 0; }
    try {
        if (!((_a = str === null || str === void 0 ? void 0 : str.trim()) === null || _a === void 0 ? void 0 : _a.length)) {
            return res;
        }
        var max = str.length;
        // Ensure we are starting at a '<' character
        if (str.charCodeAt(pos) !== 0x3C /* < */) {
            return res;
        }
        // Check for opening span tag
        var sMatch = str.slice(pos).match(consts_1.markerBeginTagSpan);
        if (!sMatch) {
            return res;
        }
        // Check for closing span tag
        var sMatchEnd = str.slice(pos).match(consts_1.markerCloseTagSpan);
        if (!sMatchEnd) {
            return res;
        }
        var nextPos = pos + sMatchEnd.index + sMatchEnd[0].length;
        // Skip spaces after the closing tag
        while (nextPos < max && str.charCodeAt(nextPos) === 0x20 /* space */) {
            nextPos++;
        }
        var content = str.slice(pos, nextPos);
        var match = content.match(consts_1.reSpan);
        if (!match || match.length < 3) {
            return res;
        }
        var className = (_b = match.groups) === null || _b === void 0 ? void 0 : _b.className;
        if ((className === null || className === void 0 ? void 0 : className.indexOf("preview-uuid-".concat(previewUuid))) !== -1) {
            res.push({
                pos: pos,
                content: content,
                nextPos: nextPos
            });
            if (nextPos < max) {
                return (0, exports.getSeparatingSpanFromString)(str, nextPos, res, previewUuid);
            }
        }
        return res;
    }
    catch (err) {
        console.error(err);
        return res;
    }
};
exports.getSeparatingSpanFromString = getSeparatingSpanFromString;
var getContentAndSeparatingSpanFromLine = function (line, pos, previewUuid, res) {
    var _a;
    if (pos === void 0) { pos = 0; }
    if (previewUuid === void 0) { previewUuid = ''; }
    if (res === void 0) { res = { content: '', contentSpan: '' }; }
    try {
        var max = line === null || line === void 0 ? void 0 : line.length;
        while (pos < max) {
            var match = line.slice(pos).match(consts_1.reSpanG);
            if (match) {
                var className = (_a = match.groups) === null || _a === void 0 ? void 0 : _a.className;
                if (className === null || className === void 0 ? void 0 : className.includes("preview-uuid-".concat(previewUuid))) {
                    var nextPos = pos + match.index + match[0].length;
                    var content = line.slice(pos, pos + match.index);
                    var contentSpan = line.slice(pos + match.index, nextPos);
                    res.content += content;
                    res.contentSpan += contentSpan;
                    pos = nextPos;
                    continue;
                }
            }
            res.content += line.slice(pos);
            break;
        }
        return res;
    }
    catch (err) {
        console.error(err);
        return {
            content: line,
            contentSpan: ""
        };
    }
};
exports.getContentAndSeparatingSpanFromLine = getContentAndSeparatingSpanFromLine;
var removeSeparatingSpanFromContent = function (content, previewUuid) {
    var e_1, _a;
    try {
        var lines = content.split('\n');
        var arrContent = [];
        var arrSpan = [];
        try {
            for (var lines_1 = tslib_1.__values(lines), lines_1_1 = lines_1.next(); !lines_1_1.done; lines_1_1 = lines_1.next()) {
                var line = lines_1_1.value;
                if (!consts_1.reSpanG.test(line)) {
                    arrContent.push(line);
                    arrSpan.push('');
                    continue;
                }
                var data = (0, exports.getContentAndSeparatingSpanFromLine)(line, 0, previewUuid);
                arrContent.push(data.content);
                arrSpan.push(data.contentSpan);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (lines_1_1 && !lines_1_1.done && (_a = lines_1.return)) _a.call(lines_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return {
            content: arrContent.join('\n'),
            contentSpan: arrSpan.join('\n'),
        };
    }
    catch (err) {
        console.error(err);
        return {
            content: content,
            contentSpan: "",
        };
    }
};
exports.removeSeparatingSpanFromContent = removeSeparatingSpanFromContent;
var getHtmlSeparatingSpanContainer = function (contentSpan) {
    var _a;
    if (!((_a = contentSpan === null || contentSpan === void 0 ? void 0 : contentSpan.trim()) === null || _a === void 0 ? void 0 : _a.length)) {
        return "";
    }
    try {
        var spanList = contentSpan.trimRight().split('\n');
        var htmlSpans = spanList
            .map(function (line, index) {
            var htmlLineNumber = "<span style=\"display: none\">".concat(index.toString(), "</span>");
            return line ? "".concat(htmlLineNumber).concat(line, "<br>") : "".concat(htmlLineNumber, "<br>");
        })
            .join('');
        var style = "left: 0; " +
            "top: 0; " +
            "position: absolute; " +
            "width: 100%; " +
            "height: 100%; " +
            "padding: 1rem; " +
            "font-size: 15px; " +
            "line-height: 24px;";
        return "<div class=\"separating-span-container\" style=\"".concat(style, "\">").concat(htmlSpans, "</div>");
    }
    catch (err) {
        console.error(err);
        return "";
    }
};
exports.getHtmlSeparatingSpanContainer = getHtmlSeparatingSpanContainer;
//# sourceMappingURL=separating-span.js.map