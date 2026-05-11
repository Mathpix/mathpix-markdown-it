"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPositions = void 0;
var tslib_1 = require("tslib");
var highlight_math_token_1 = require("../highlight/highlight-math-token");
var common_1 = require("../highlight/common");
var consts_1 = require("../common/consts");
var OPEN_BRACKET_CHARCODE = 0x5B;
var TABULAR_TYPES = new Set(['tabular', 'tabular_inline']);
var setChildrenPositions = function (state, token, pos, highlights, isBlockquote) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    if (isBlockquote === void 0) { isBlockquote = false; }
    if (token.hasOwnProperty('offsetLeft')) {
        pos += token.offsetLeft;
    }
    var start_content = pos;
    var hasInlineHtml = token.children.find(function (item) { return item.type === "html_inline"; });
    if (hasInlineHtml && ((_a = token.highlights) === null || _a === void 0 ? void 0 : _a.length)) {
        token.highlightAll = true;
        var dataAttrsStyle = (0, common_1.getStyleFromHighlight)(token.highlights[0]);
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
        // Mirror top-level setPositions skip: position the tabular token itself but don't recurse
        // into its cells (cell content is reconstructed from `token.content`, not from `state.src`
        // slicing). pos advances by `content.length` so subsequent siblings stay correctly placed.
        if (TABULAR_TYPES.has(child.type)) {
            var len = typeof child.content === 'string' ? child.content.length : 0;
            if (Object.isExtensible(child)) {
                child.positions = { start: startPos, end: startPos + len };
                if (!hasInlineHtml) {
                    child.highlights = (0, common_1.findPositionsInHighlights)(highlights, child.positions);
                }
                child.content_test_str = state.src.slice(child.positions.start, child.positions.end);
            }
            pos = startPos + len;
            continue;
        }
        // `[text](url)` (link_open, text, link_close): special case keeps the legacy text-positioned math
        // (snapshots in tests/_data/_tokenPositions/_data.js pin it). Skipped unless the triple is writable
        // and link_close carries `nextPos` (used as the link end — `undefined` would propagate as `NaN`).
        // i+2 (link_close) is read-only here — loop skips it via `i += 2`, so no extensibility check needed.
        if (child.type === "link_open" && !child.hasOwnProperty('nextPos')
            && Object.isExtensible(child)
            && token.children[i + 1] && token.children[i + 1].type === 'text'
            && Object.isExtensible(token.children[i + 1])
            && token.children[i + 2] && token.children[i + 2].type === 'link_close'
            && typeof token.children[i + 2].nextPos === 'number') {
            if (typeof token.children[i + 1].nextPos === 'number') {
                token.children[i + 1].positions = {
                    start: startPos + 1,
                    end: start_content + token.children[i + 1].nextPos
                };
                if (!hasInlineHtml) {
                    token.children[i + 1].highlights = (0, common_1.findPositionsInHighlights)(highlights, token.children[i + 1].positions);
                }
            }
            else {
                // Guard `content` is a string before `.length` — markdown-it's contract sets text content
                // to a string, but a defensive check stops `undefined.length` → `NaN` from poisoning `.positions.end`.
                var innerContent = token.children[i + 1].content;
                var innerLen = typeof innerContent === 'string' ? innerContent.length : 0;
                token.children[i + 1].positions = {
                    start: startPos + 1,
                    end: startPos + 1 + innerLen
                };
                if (!hasInlineHtml) {
                    token.children[i + 1].highlights = (0, common_1.findPositionsInHighlights)(highlights, token.children[i + 1].positions);
                }
            }
            token.children[i + 1].content_test_str = state.src.slice(token.children[i + 1].positions.start, token.children[i + 1].positions.end);
            child.positions = {
                start: startPos,
                end: start_content + token.children[i + 2].nextPos
            };
            if (!hasInlineHtml) {
                child.highlights = (0, common_1.findPositionsInHighlights)(highlights, child.positions);
            }
            if (!((_b = token.children[i + 1].highlights) === null || _b === void 0 ? void 0 : _b.length) && ((_c = child.highlights) === null || _c === void 0 ? void 0 : _c.length)) {
                child.highlightAll = true;
                var style = child.attrGet('style');
                child.attrSet('style', (0, common_1.getStyleFromHighlight)(child.highlights[0]) + style);
            }
            child.content_test_str = state.src.slice(child.positions.start, child.positions.end);
            pos = child.positions.end;
            i += 2;
            continue;
        }
        // Span-based fallback for fancy link contents (`[**bold**](url)`, `` [`code`](url) ``,
        // `[![alt](img)](url)`): set `link_open.positions` to the full `[…](…)` span via the matching
        // `link_close.nextPos`, advance `pos` past `[`, and let the per-child loop position each inner
        // child by its own `nextPos`/`content`/`markup`. `start_content`/`end_content` are intentionally
        // not set on link_open (consistent with strict-triple branch). `highlightAll` cascade is also
        // omitted — would require a post-hoc pass; not needed for current consumers.
        if (child.type === "link_open" && !child.hasOwnProperty('nextPos') && Object.isExtensible(child)) {
            var linkCloseIdx = -1;
            var depth = 1;
            for (var j = i + 1; j < token.children.length; j++) {
                var c = token.children[j];
                if (c.type === 'link_open') {
                    depth++;
                }
                else if (c.type === 'link_close') {
                    depth--;
                    if (depth === 0) {
                        linkCloseIdx = j;
                        break;
                    }
                }
            }
            if (linkCloseIdx !== -1 && typeof token.children[linkCloseIdx].nextPos === 'number') {
                child.positions = {
                    start: startPos,
                    end: start_content + token.children[linkCloseIdx].nextPos
                };
                if (!hasInlineHtml) {
                    child.highlights = (0, common_1.findPositionsInHighlights)(highlights, child.positions);
                }
                child.content_test_str = state.src.slice(child.positions.start, child.positions.end);
                // Skip the `[` so inner children align. Custom emitters without `[` keep pos at startPos.
                pos = state.src.charCodeAt(startPos) === OPEN_BRACKET_CHARCODE ? startPos + 1 : startPos;
                continue;
            }
            // Malformed token stream defensive path — markdown-it always pairs link_open/link_close, so this is unreachable in normal streams.
            child.positions = { start: startPos, end: startPos };
            child.content_test_str = '';
            pos = startPos;
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
                pos += ((_e = child === null || child === void 0 ? void 0 : child.content) === null || _e === void 0 ? void 0 : _e.length)
                    ? (_f = child === null || child === void 0 ? void 0 : child.content) === null || _f === void 0 ? void 0 : _f.length
                    : ((_g = child === null || child === void 0 ? void 0 : child.markup) === null || _g === void 0 ? void 0 : _g.length)
                        ? (_h = child === null || child === void 0 ? void 0 : child.markup) === null || _h === void 0 ? void 0 : _h.length
                        : 0;
            }
            if (child.type === 'softbreak') {
                pos++;
            }
        }
        // Skip frozen shared tokens (safety net for any frozen non-tabular singleton). MUST run
        // AFTER the pos-advance block above so siblings stay correctly placed when this fires.
        if (!Object.isExtensible(child)) {
            continue;
        }
        child.positions = {
            start: startPos,
            end: pos
        };
        if (!hasInlineHtml) {
            child.highlights = (0, common_1.findPositionsInHighlights)(highlights, child.positions);
        }
        if (((_j = child === null || child === void 0 ? void 0 : child.inlinePos) === null || _j === void 0 ? void 0 : _j.hasOwnProperty('start_content')) && ((_k = child.inlinePos) === null || _k === void 0 ? void 0 : _k.hasOwnProperty('end_content'))) {
            child.positions.start_content = start_content + child.inlinePos.start_content;
            child.positions.end_content = start_content + child.inlinePos.end_content;
        }
        child.content_test_str = state.src.slice(child.positions.start, child.positions.end);
        if (child === null || child === void 0 ? void 0 : child.positions.start_content) {
            child.content_test = state.src.slice(child.positions.start_content, child.positions.end_content);
        }
        if ((_l = child.highlights) === null || _l === void 0 ? void 0 : _l.length) {
            if (consts_1.mathTokenTypes.includes(child.type)) {
                if (child.highlights.find(function (item) { return item.include_block; })) {
                    child.highlightAll = true;
                }
                else {
                    (0, highlight_math_token_1.highlightMathToken)(state, child);
                }
            }
            if (child.type === 'includegraphics') {
                child.attrSet('data-mmd-highlight', (0, common_1.getStyleFromHighlight)(token.highlights[0]));
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
var setPositions = function (state) {
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
                    if (token.eMarks) {
                        if (endLine - 1 >= 0) {
                            endPos = lines.eMarks[endLine - 1] + token.eMarks;
                            endPos += endLine - token.map[0] === 0 ? 1 : 0;
                        }
                        if (endLine === 0) {
                            endPos = token.eMarks;
                        }
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
                token.highlights = (0, common_1.findPositionsInHighlights)(highlights, token.positions);
                if ((_f = token.highlights) === null || _f === void 0 ? void 0 : _f.length) {
                    (0, common_1.needToHighlightAll)(token);
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
                    token.highlights = (0, common_1.mergingHighlights)(token.highlights);
                    if (token.type === 'fence'
                        || token.type === 'code_block'
                        || token.type === 'html_block') {
                        var style = token.attrGet('style');
                        style = style ? style : '';
                        token.attrSet('style', (0, common_1.getStyleFromHighlight)(token.highlights[0]) + style);
                        if (token.type === 'code_block') {
                            var className = token.attrGet('class');
                            className = className
                                ? className + ' ' + 'mmd-highlight'
                                : 'mmd-highlight';
                            token.attrSet('class', className);
                        }
                    }
                    if (token.type === 'includegraphics') {
                        token.attrSet('data-mmd-highlight', (0, common_1.getStyleFromHighlight)(token.highlights[0]));
                    }
                    if (token.positions.start_content > ((_h = token.highlights) === null || _h === void 0 ? void 0 : _h[0].start)) {
                        if ((_j = token.highlights) === null || _j === void 0 ? void 0 : _j[0].highlight_color) {
                            dataAttrsStyle += "background-color: ".concat((_k = token.highlights) === null || _k === void 0 ? void 0 : _k[0].highlight_color, ";");
                        }
                        if ((_l = token.highlights) === null || _l === void 0 ? void 0 : _l[0].text_color) {
                            dataAttrsStyle += "color: ".concat((_m = token.highlights) === null || _m === void 0 ? void 0 : _m[0].text_color, ";");
                        }
                        token.attrPush(['style', dataAttrsStyle]);
                    }
                }
            }
            /** Ignore set positions for children.
             * Since the content may not match the original string. Line breaks can be removed*/
            if (TABULAR_TYPES.has(token.type)) {
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
                        var dataAttrsStyle = (0, common_1.getStyleFromHighlight)(token.highlights[0]);
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
};
exports.setPositions = setPositions;
//# sourceMappingURL=set-positions.js.map