"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.highlightText = exports.needToHighlightAll = exports.getStyleFromHighlight = exports.filteredHighlightContent = exports.findPositionsInHighlights = exports.mergingHighlights = exports.sortHighlights = void 0;
var consts_1 = require("../common/consts");
var sortHighlights = function (a, b) {
    return a.start > b.start ? 1 : -1;
};
exports.sortHighlights = sortHighlights;
var mergingHighlights = function (highlights) {
    if (!(highlights === null || highlights === void 0 ? void 0 : highlights.length) || (highlights === null || highlights === void 0 ? void 0 : highlights.length) < 2) {
        return highlights;
    }
    highlights.sort(exports.sortHighlights);
    var newArr = [];
    var _loop_1 = function (i) {
        var index = (newArr === null || newArr === void 0 ? void 0 : newArr.length)
            ? newArr.findIndex(function (item) { return item.start >= highlights[i].start
                && item.end <= highlights[i].end; })
            : -1;
        if (index === -1) {
            var lastIndex = (newArr === null || newArr === void 0 ? void 0 : newArr.length) ? newArr.length - 1 : -1;
            if (lastIndex >= 0 && newArr[lastIndex].end > highlights[i].start) {
                newArr[lastIndex].end = newArr[lastIndex].end > highlights[i].end
                    ? newArr[lastIndex].end
                    : highlights[i].end;
            }
            else {
                newArr.push(highlights[i]);
            }
            return "continue";
        }
        newArr.splice(index, 1);
        newArr.push(highlights[i]);
    };
    for (var i = 0; i < highlights.length; i++) {
        _loop_1(i);
    }
    return newArr;
};
exports.mergingHighlights = mergingHighlights;
var findPositionsInHighlights = function (highlights, positions) {
    var res = [];
    if (!highlights.length) {
        return res;
    }
    for (var i = 0; i < highlights.length; i++) {
        var item = highlights[i];
        if (item.start === 0 && item.end === 0) {
            continue;
        }
        if (item.start > positions.end || item.end < positions.start) {
            continue;
        }
        if (item.start >= positions.start) {
            if (item.end <= positions.end) {
                res.push(item);
            }
            else {
                res.push({
                    start: item.start,
                    end: positions.end,
                    highlight_color: item.highlight_color,
                    text_color: item.text_color,
                });
            }
        }
        else {
            if (item.end <= positions.end) {
                res.push({
                    start: positions.start,
                    end: item.end,
                    highlight_color: item.highlight_color,
                    text_color: item.text_color,
                });
            }
            else {
                res.push({
                    start: positions.start,
                    end: positions.end,
                    highlight_color: item.highlight_color,
                    text_color: item.text_color,
                });
            }
        }
    }
    return res;
};
exports.findPositionsInHighlights = findPositionsInHighlights;
var filteredHighlightContent = function (highlightContent) {
    var newArr = [];
    var _loop_2 = function (i) {
        var index = (newArr === null || newArr === void 0 ? void 0 : newArr.length)
            ? newArr.findIndex(function (item) { return item.positions.start >= highlightContent[i].positions.start
                && item.positions.end <= highlightContent[i].positions.end; })
            : -1;
        if (index === -1) {
            var lastIndex = (newArr === null || newArr === void 0 ? void 0 : newArr.length) ? newArr.length - 1 : -1;
            if (lastIndex >= 0
                && newArr[lastIndex].positions.end + 1 === highlightContent[i].positions.start
                && !newArr[lastIndex].highlightIncludeIntoBraces && !highlightContent[i].highlightIncludeIntoBraces) {
                newArr[lastIndex].positions.end = highlightContent[i].positions.end;
                newArr[lastIndex].content += highlightContent[i].content;
            }
            else {
                newArr.push(highlightContent[i]);
            }
            return "continue";
        }
        newArr.splice(index, 1);
        newArr.push(highlightContent[i]);
    };
    for (var i = 0; i < highlightContent.length; i++) {
        _loop_2(i);
    }
    return newArr;
};
exports.filteredHighlightContent = filteredHighlightContent;
var getStyleFromHighlight = function (highlight) {
    var dataAttrsStyle = '';
    if ((highlight.hasOwnProperty('highlight_color') && highlight.highlight_color !== undefined)
        || (highlight.hasOwnProperty('text_color') && highlight.text_color !== undefined)) {
        if (highlight.highlight_color) {
            dataAttrsStyle += "background-color: ".concat(highlight.highlight_color, ";");
        }
        else {
            dataAttrsStyle += "background-color: ".concat(consts_1.HIGHLIGHT_COLOR, ";");
        }
        if (highlight.text_color) {
            dataAttrsStyle += "color: ".concat(highlight.text_color, ";");
        }
        else {
            dataAttrsStyle += "color: ".concat(consts_1.HIGHLIGHT_TEXT_COLOR, ";");
        }
    }
    else {
        dataAttrsStyle += "background-color: ".concat(consts_1.HIGHLIGHT_COLOR, ";");
        dataAttrsStyle += "color: ".concat(consts_1.HIGHLIGHT_TEXT_COLOR, ";");
    }
    return dataAttrsStyle;
};
exports.getStyleFromHighlight = getStyleFromHighlight;
var needToHighlightAll = function (token) {
    var res = false;
    for (var i = 0; i < token.highlights.length; i++) {
        var startPos = token.highlights[i].start;
        if (token.positions.hasOwnProperty('start_content')) {
            if (token.positions.start_content > startPos) {
                token.highlightAll = true;
                res = true;
                break;
            }
        }
        if (token.positions.start === token.highlights[i].start && token.positions.end === token.highlights[i].end) {
            token.highlightAll = true;
            res = true;
            break;
        }
    }
    return res;
};
exports.needToHighlightAll = needToHighlightAll;
var highlightText = function (token, content) {
    var _a;
    if (content === void 0) { content = ''; }
    if ((_a = token.highlights) === null || _a === void 0 ? void 0 : _a.length) {
        var highlightContent = [];
        if (!token.highlightAll) {
            token.highlights = (0, exports.mergingHighlights)(token.highlights);
            for (var i = 0; i < token.highlights.length; i++) {
                var startPos = token.highlights[i].start;
                var endPos = token.highlights[i].end;
                if (token.positions.hasOwnProperty('start_content')) {
                    if (token.positions.start_content > startPos) {
                        token.highlightAll = true;
                        break;
                    }
                    startPos -= token.positions.start_content;
                    endPos -= token.positions.start_content;
                }
                else {
                    startPos -= token.positions.start;
                    endPos -= token.positions.start;
                }
                highlightContent.push({
                    positions: {
                        start: startPos,
                        end: endPos
                    },
                    highlight: token.highlights[i],
                    content: content ? content.slice(startPos, endPos) : token.content.slice(startPos, endPos)
                });
            }
        }
        var textStr_1 = '';
        if (token.highlightAll) {
            textStr_1 += '<span class="mmd-highlight" style="' + (0, exports.getStyleFromHighlight)(token.highlights[0]) + '">';
            textStr_1 += content ? content : token.content;
            textStr_1 += '</span>';
            return textStr_1;
        }
        var textStart_1 = 0;
        highlightContent.map(function (item) {
            textStr_1 += content ? content.slice(textStart_1, item.positions.start) : token.content.slice(textStart_1, item.positions.start);
            textStr_1 += '<span class="mmd-highlight" style="' + (0, exports.getStyleFromHighlight)(item.highlight) + '">';
            textStr_1 += item.content;
            textStr_1 += '</span>';
            textStart_1 = item.positions.end;
        });
        textStr_1 += content ? content.slice(textStart_1) : token.content.slice(textStart_1);
        return textStr_1;
    }
    else {
        return token.content;
    }
};
exports.highlightText = highlightText;
//# sourceMappingURL=common.js.map