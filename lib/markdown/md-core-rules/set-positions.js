"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPositions = void 0;
var tslib_1 = require("tslib");
var highlight_math_token_1 = require("../highlight/highlight-math-token");
var common_1 = require("../highlight/common");
var setChildrenPositions = function (state, token, pos, highlights, isBlockquote) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    if (isBlockquote === void 0) { isBlockquote = false; }
    if (token.hasOwnProperty('offsetLeft')) {
        pos += token.offsetLeft;
    }
    var start_content = pos;
    for (var i = 0; i < token.children.length; i++) {
        var child = token.children[i];
        var childBefore = i - 1 >= 0 ? token.children[i - 1] : null;
        var startPos = pos;
        if (child.type === "link_open" && !child.hasOwnProperty('nextPos')) {
            if (token.children[i + 1].hasOwnProperty('nextPos')) {
                token.children[i + 1].positions = {
                    start: startPos + 1,
                    end: start_content + token.children[i + 1].nextPos
                };
                token.children[i + 1].highlights = findPositionsInHighlights(highlights, token.children[i + 1].positions);
            }
            else {
                token.children[i + 1].positions = {
                    start: startPos + 1,
                    end: startPos + 1 + ((_a = token.children[i + 1].content) === null || _a === void 0 ? void 0 : _a.length)
                };
                token.children[i + 1].highlights = findPositionsInHighlights(highlights, token.children[i + 1].positions);
            }
            token.children[i + 1].content_test_str = state.src.slice(token.children[i + 1].positions.start, token.children[i + 1].positions.end);
            child.positions = {
                start: startPos,
                end: start_content + token.children[i + 2].nextPos
            };
            child.highlights = findPositionsInHighlights(highlights, child.positions);
            if (!((_b = token.children[i + 1].highlights) === null || _b === void 0 ? void 0 : _b.length) && ((_c = child.highlights) === null || _c === void 0 ? void 0 : _c.length)) {
                child.highlightAll = true;
                var style = child.attrGet('style');
                child.attrSet('style', common_1.getStyleFromHighlight(child.highlights[0]) + style);
            }
            child.content_test_str = state.src.slice(child.positions.start, child.positions.end);
            pos = child.positions.end;
            i += 2;
            continue;
        }
        if (child.hasOwnProperty('nextPos')) {
            pos = start_content + child.nextPos;
        }
        else {
            if ((_d = child.inlinePos) === null || _d === void 0 ? void 0 : _d.end) {
                pos += child.inlinePos.end - child.inlinePos.start;
            }
            else {
                pos += ((_e = child === null || child === void 0 ? void 0 : child.content) === null || _e === void 0 ? void 0 : _e.length) ? (_f = child === null || child === void 0 ? void 0 : child.content) === null || _f === void 0 ? void 0 : _f.length : ((_g = child === null || child === void 0 ? void 0 : child.markup) === null || _g === void 0 ? void 0 : _g.length) ? (_h = child === null || child === void 0 ? void 0 : child.markup) === null || _h === void 0 ? void 0 : _h.length : 0;
            }
            if (child.type === 'softbreak') {
                pos++;
            }
        }
        child.positions = {
            start: startPos,
            end: pos
        };
        child.highlights = findPositionsInHighlights(highlights, child.positions);
        if (((_j = child === null || child === void 0 ? void 0 : child.inlinePos) === null || _j === void 0 ? void 0 : _j.hasOwnProperty('start_content')) && ((_k = child.inlinePos) === null || _k === void 0 ? void 0 : _k.hasOwnProperty('end_content'))) {
            child.positions.start_content = start_content + child.inlinePos.start_content;
            child.positions.end_content = start_content + child.inlinePos.end_content;
        }
        child.content_test_str = state.src.slice(child.positions.start, child.positions.end);
        if (child === null || child === void 0 ? void 0 : child.positions.start_content) {
            child.content_test = state.src.slice(child.positions.start_content, child.positions.end_content);
        }
        if ((_l = child.highlights) === null || _l === void 0 ? void 0 : _l.length) {
            if (['display_math', 'inline_math', 'equation_math', 'equation_math_not_number'].includes(child.type)) {
                highlight_math_token_1.highlightMathToken(state, child);
            }
        }
        if (isBlockquote) {
            if ((childBefore === null || childBefore === void 0 ? void 0 : childBefore.type) === "softbreak" && child.content_test_str.charCodeAt(0) === 0x3E /* > */) {
                var offset = 0;
                for (var k = 0; k < child.content_test_str.length; k++) {
                    if (child.content_test_str.charCodeAt(k) === 0x3E /* > */
                        || child.content_test_str.charCodeAt(k) === 0x20 /* space */) {
                        offset++;
                    }
                    else {
                        break;
                    }
                }
                if (offset > 0) {
                    child.positions.start += offset;
                    child.positions.end += offset;
                    child.content_test_str = state.src.slice(child.positions.start, child.positions.end);
                }
            }
        }
        if ((_m = child.children) === null || _m === void 0 ? void 0 : _m.length) {
            var data = child.positions.hasOwnProperty('start_content')
                ? setChildrenPositions(state, child, child.positions.start_content, highlights)
                : setChildrenPositions(state, child, child.positions.start, highlights);
            child = data.token;
        }
    }
    return {
        token: token
    };
};
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
        if (item.start >= positions.start && item.end <= positions.end) {
            res.push(item);
        }
    }
    return res;
};
exports.setPositions = function (state) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    var lines = ((_a = state.env) === null || _a === void 0 ? void 0 : _a.lines) ? tslib_1.__assign({}, (_b = state.env) === null || _b === void 0 ? void 0 : _b.lines) : null;
    if (!lines) {
        console.log("Can not set positions. env.lines is not initialized.");
        return;
    }
    var highlights = [];
    if (state.md.options.hasOwnProperty('highlights')) {
        highlights = state.md.options.highlights;
    }
    var offsetContent = 0;
    var offsetBlockquote = 0;
    for (var i = 0; i < state.tokens.length; i++) {
        var token = state.tokens[i];
        if (token.block) {
            if (token.type === "blockquote_open") {
                offsetBlockquote += token.markup.length;
            }
            if (token.type === "blockquote_close") {
                offsetBlockquote -= token.markup.length;
            }
            /** Set positions for block tokens */
            if (token.map) {
                var line = token.map[0];
                var endLine = token.map[1] > token.map[0]
                    ? token.map[1] - 1
                    : token.map[1];
                var startPos = lines.bMarks[line] + lines.tShift[line];
                var endPos = lines.eMarks[endLine];
                var content_test = state.src.slice(startPos, endPos);
                if (token.hasOwnProperty('bMarks')) {
                    startPos += token.bMarks;
                    if (token.eMarks && endLine - 1 >= 0) {
                        endPos = lines.eMarks[endLine - 1] + token.eMarks;
                        endPos += endLine - token.map[0] === 0 ? 1 : 0;
                    }
                }
                else {
                    if (token.type === "inline") {
                        if (((_c = token.content) === null || _c === void 0 ? void 0 : _c.length) && ((_d = token.content) === null || _d === void 0 ? void 0 : _d.length) < (content_test === null || content_test === void 0 ? void 0 : content_test.length)) {
                            var index = content_test.indexOf(token.content);
                            startPos += index !== -1 ? index : 0;
                        }
                    }
                }
                token.positions = {
                    start: startPos,
                    end: endPos,
                };
                token.highlights = findPositionsInHighlights(highlights, token.positions);
                if (token.hasOwnProperty('bMarksContent')) {
                    token.positions.start_content = token.positions.start + token.bMarksContent;
                    if (endLine - 1 >= 0) {
                        token.positions.end_content = lines.eMarks[endLine - 1] + token.eMarksContent;
                        token.positions.end_content += endLine - token.map[0] === 0 ? 1 : 0;
                    }
                    else {
                        token.positions.end_content = token.eMarksContent;
                    }
                    token.content_test = state.src.slice(token.positions.start_content, token.positions.end_content);
                }
                token.content_test_str = state.src.slice(token.positions.start, token.positions.end);
                var dataAttrsStyle = '';
                if ((_e = token.highlights) === null || _e === void 0 ? void 0 : _e.length) {
                    token.highlights.sort(common_1.sortHighlights);
                    if (token.positions.start_content > ((_f = token.highlights) === null || _f === void 0 ? void 0 : _f[0].start)) {
                        if ((_g = token.highlights) === null || _g === void 0 ? void 0 : _g[0].highlight_color) {
                            dataAttrsStyle += "background-color: " + ((_h = token.highlights) === null || _h === void 0 ? void 0 : _h[0].highlight_color) + ";";
                        }
                        if ((_j = token.highlights) === null || _j === void 0 ? void 0 : _j[0].text_color) {
                            dataAttrsStyle += "color: " + ((_k = token.highlights) === null || _k === void 0 ? void 0 : _k[0].text_color) + ";";
                        }
                        token.attrPush(['style', dataAttrsStyle]);
                    }
                }
            }
            /** Ignore set positions for children.
             * Since the content may not match the original string. Line breaks can be removed*/
            if (['tabular'].includes(token.type)) {
                continue;
            }
            if (((_l = token.children) === null || _l === void 0 ? void 0 : _l.length) && token.positions) {
                if (offsetBlockquote > 0 && token.type === 'inline' && token.content_test_str.charCodeAt(0) === 0x3E /* > */) {
                    var offset = 0;
                    for (var k = 0; k < token.content_test_str.length; k++) {
                        if (token.content_test_str.charCodeAt(k) === 0x3E /* > */
                            || token.content_test_str.charCodeAt(k) === 0x20 /* space */) {
                            offset++;
                        }
                        else {
                            break;
                        }
                    }
                    if (offset > 0) {
                        token.positions.start += offset;
                        token.content_test_str = state.src.slice(token.positions.start, token.positions.end);
                    }
                }
                var pos = token.positions.hasOwnProperty('start_content')
                    ? token.positions.start_content
                    : ((_m = token.positions) === null || _m === void 0 ? void 0 : _m.start) ? token.positions.start : 0;
                pos += offsetContent;
                var data = setChildrenPositions(state, token, pos, highlights, offsetBlockquote > 0);
                token = data.token;
            }
        }
    }
    console.log("[MMD]=>[state.tokens]=>", state.tokens);
};
//# sourceMappingURL=set-positions.js.map