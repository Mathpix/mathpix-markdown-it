"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPositions = void 0;
var tslib_1 = require("tslib");
var highlight_math_token_1 = require("../highlight/highlight-math-token");
var common_1 = require("../highlight/common");
var consts_1 = require("../common/consts");
var setChildrenPositions = function (state, token, pos, highlights, isBlockquote) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    if (isBlockquote === void 0) { isBlockquote = false; }
    if (token.hasOwnProperty('offsetLeft')) {
        pos += token.offsetLeft;
    }
    var start_content = pos;
    var hasInlineHtml = token.children.find(function (item) { return item.type === "html_inline"; });
    if (hasInlineHtml && ((_a = token.highlights) === null || _a === void 0 ? void 0 : _a.length)) {
        token.highlightAll = true;
        var dataAttrsStyle = common_1.getStyleFromHighlight(token.highlights[0]);
        var style = token.attrGet('style');
        style = style
            ? style + ' ' + dataAttrsStyle
            : dataAttrsStyle;
        token.attrSet('style', style);
    }
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
                if (!hasInlineHtml) {
                    token.children[i + 1].highlights = common_1.findPositionsInHighlights(highlights, token.children[i + 1].positions);
                }
            }
            else {
                token.children[i + 1].positions = {
                    start: startPos + 1,
                    end: startPos + 1 + ((_b = token.children[i + 1].content) === null || _b === void 0 ? void 0 : _b.length)
                };
                if (!hasInlineHtml) {
                    token.children[i + 1].highlights = common_1.findPositionsInHighlights(highlights, token.children[i + 1].positions);
                }
            }
            token.children[i + 1].content_test_str = state.src.slice(token.children[i + 1].positions.start, token.children[i + 1].positions.end);
            child.positions = {
                start: startPos,
                end: start_content + token.children[i + 2].nextPos
            };
            if (!hasInlineHtml) {
                child.highlights = common_1.findPositionsInHighlights(highlights, child.positions);
            }
            if (!((_c = token.children[i + 1].highlights) === null || _c === void 0 ? void 0 : _c.length) && ((_d = child.highlights) === null || _d === void 0 ? void 0 : _d.length)) {
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
            if ((_e = child.inlinePos) === null || _e === void 0 ? void 0 : _e.end) {
                pos += child.inlinePos.end - child.inlinePos.start;
            }
            else {
                pos += ((_f = child === null || child === void 0 ? void 0 : child.content) === null || _f === void 0 ? void 0 : _f.length) ? (_g = child === null || child === void 0 ? void 0 : child.content) === null || _g === void 0 ? void 0 : _g.length : ((_h = child === null || child === void 0 ? void 0 : child.markup) === null || _h === void 0 ? void 0 : _h.length) ? (_j = child === null || child === void 0 ? void 0 : child.markup) === null || _j === void 0 ? void 0 : _j.length : 0;
            }
            if (child.type === 'softbreak') {
                pos++;
            }
        }
        child.positions = {
            start: startPos,
            end: pos
        };
        if (!hasInlineHtml) {
            child.highlights = common_1.findPositionsInHighlights(highlights, child.positions);
        }
        if (((_k = child === null || child === void 0 ? void 0 : child.inlinePos) === null || _k === void 0 ? void 0 : _k.hasOwnProperty('start_content')) && ((_l = child.inlinePos) === null || _l === void 0 ? void 0 : _l.hasOwnProperty('end_content'))) {
            child.positions.start_content = start_content + child.inlinePos.start_content;
            child.positions.end_content = start_content + child.inlinePos.end_content;
        }
        child.content_test_str = state.src.slice(child.positions.start, child.positions.end);
        if (child === null || child === void 0 ? void 0 : child.positions.start_content) {
            child.content_test = state.src.slice(child.positions.start_content, child.positions.end_content);
        }
        if ((_m = child.highlights) === null || _m === void 0 ? void 0 : _m.length) {
            if (consts_1.mathTokenTypes.includes(child.type)) {
                if (child.highlights.find(function (item) { return item.include_block; })) {
                    child.highlightAll = true;
                }
                else {
                    highlight_math_token_1.highlightMathToken(state, child);
                }
            }
            if (child.type === 'includegraphics') {
                child.attrSet('data-mmd-highlight', common_1.getStyleFromHighlight(token.highlights[0]));
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
        if ((_o = child.children) === null || _o === void 0 ? void 0 : _o.length) {
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
exports.setPositions = function (state) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
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
        var tokenBefore = i - 1 >= 0 ? state.tokens[i - 1] : null;
        if (token.block) {
            if (token.type === "blockquote_open") {
                offsetBlockquote += token.markup.length;
            }
            if (token.type === "blockquote_close") {
                offsetBlockquote -= token.markup.length;
            }
            /** Set positions for block tokens */
            if (token.map && ((_c = token.map) === null || _c === void 0 ? void 0 : _c.length) === 2 && token.map[0] >= 0 && token.map[1] >= 0) {
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
                        if (((_d = token.content) === null || _d === void 0 ? void 0 : _d.length) && ((_e = token.content) === null || _e === void 0 ? void 0 : _e.length) < (content_test === null || content_test === void 0 ? void 0 : content_test.length)) {
                            var index = content_test.indexOf(token.content);
                            startPos += index !== -1 ? index : 0;
                        }
                    }
                }
                token.positions = {
                    start: startPos,
                    end: endPos,
                };
                token.highlights = common_1.findPositionsInHighlights(highlights, token.positions);
                if ((_f = token.highlights) === null || _f === void 0 ? void 0 : _f.length) {
                    common_1.needToHighlightAll(token);
                }
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
                if ((_g = token.highlights) === null || _g === void 0 ? void 0 : _g.length) {
                    token.highlights = common_1.mergingHighlights(token.highlights);
                    if (token.type === 'fence'
                        || token.type === 'code_block'
                        || token.type === 'html_block') {
                        var style = token.attrGet('style');
                        style = style ? style : '';
                        token.attrSet('style', common_1.getStyleFromHighlight(token.highlights[0]) + style);
                        if (token.type === 'code_block') {
                            var className = token.attrGet('class');
                            className = className
                                ? className + ' ' + 'mmd-highlight'
                                : 'mmd-highlight';
                            token.attrSet('class', className);
                        }
                    }
                    if (token.type === 'includegraphics') {
                        token.attrSet('data-mmd-highlight', common_1.getStyleFromHighlight(token.highlights[0]));
                    }
                    if (token.positions.start_content > ((_h = token.highlights) === null || _h === void 0 ? void 0 : _h[0].start)) {
                        if ((_j = token.highlights) === null || _j === void 0 ? void 0 : _j[0].highlight_color) {
                            dataAttrsStyle += "background-color: " + ((_k = token.highlights) === null || _k === void 0 ? void 0 : _k[0].highlight_color) + ";";
                        }
                        if ((_l = token.highlights) === null || _l === void 0 ? void 0 : _l[0].text_color) {
                            dataAttrsStyle += "color: " + ((_m = token.highlights) === null || _m === void 0 ? void 0 : _m[0].text_color) + ";";
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
            if (((_o = token.children) === null || _o === void 0 ? void 0 : _o.length) && token.positions) {
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
                    : ((_p = token.positions) === null || _p === void 0 ? void 0 : _p.start) ? token.positions.start : 0;
                pos += offsetContent;
                if (token.type === 'inline' && (tokenBefore === null || tokenBefore === void 0 ? void 0 : tokenBefore.type) === 'paragraph_open') {
                    var hasInlineHtml = token.children.find(function (item) { return item.type === "html_inline"; });
                    if (hasInlineHtml && ((_q = token.highlights) === null || _q === void 0 ? void 0 : _q.length)) {
                        token.highlightAll = true;
                        var dataAttrsStyle = common_1.getStyleFromHighlight(token.highlights[0]);
                        var style = tokenBefore.attrGet('style');
                        style = style
                            ? style + ' ' + dataAttrsStyle
                            : dataAttrsStyle;
                        tokenBefore.attrSet('style', style);
                    }
                }
                var data = setChildrenPositions(state, token, pos, highlights, offsetBlockquote > 0);
                token = data.token;
            }
        }
    }
    // console.log("[MMD]=>[state.tokens]=>", state.tokens)
};
//# sourceMappingURL=set-positions.js.map