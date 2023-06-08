"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.highlightText = exports.getStyleFromHighlight = exports.filteredHighlightContent = exports.sortHighlights = void 0;
var consts_1 = require("../common/consts");
exports.sortHighlights = function (a, b) {
    return a.start > b.start ? 1 : -1;
};
exports.filteredHighlightContent = function (highlightContent) {
    var newArr = [];
    var _loop_1 = function (i) {
        var index = (newArr === null || newArr === void 0 ? void 0 : newArr.length) ? newArr.findIndex(function (item) { return item.positions.start >= highlightContent[i].positions.start
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
        _loop_1(i);
    }
    return newArr;
};
exports.getStyleFromHighlight = function (highlight) {
    var dataAttrsStyle = '';
    if (highlight.hasOwnProperty('highlight_color')
        || highlight.hasOwnProperty('text_color')) {
        if (highlight.highlight_color) {
            dataAttrsStyle += "background-color: " + highlight.highlight_color + ";";
        }
        if (highlight.text_color) {
            dataAttrsStyle += "color: " + highlight.text_color + ";";
        }
    }
    else {
        dataAttrsStyle += "background-color: " + consts_1.HIGHLIGHT_COLOR + ";";
        dataAttrsStyle += "color: " + consts_1.HIGHLIGHT_TEXT_COLOR + ";";
    }
    return dataAttrsStyle;
};
exports.highlightText = function (token, content) {
    var _a;
    if (content === void 0) { content = ''; }
    if ((_a = token.highlights) === null || _a === void 0 ? void 0 : _a.length) {
        var highlightContent = [];
        if (!token.highlightAll) {
            token.highlights.sort(exports.sortHighlights);
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
                    content: token.content.slice(startPos, endPos)
                });
            }
        }
        var textStr_1 = '';
        if (token.highlightAll) {
            textStr_1 += '<span style="' + exports.getStyleFromHighlight(token.highlights[0]) + '">';
            textStr_1 += content ? content : token.content;
            textStr_1 += '</span>';
            return textStr_1;
        }
        var textStart_1 = 0;
        highlightContent.map(function (item) {
            textStr_1 += token.content.slice(textStart_1, item.positions.start);
            textStr_1 += '<span style="' + exports.getStyleFromHighlight(item.highlight) + '">';
            textStr_1 += item.content;
            textStr_1 += '</span>';
            textStart_1 = item.positions.end;
        });
        textStr_1 += token.content.slice(textStart_1);
        return textStr_1;
    }
    else {
        return token.content;
    }
};
//# sourceMappingURL=common.js.map