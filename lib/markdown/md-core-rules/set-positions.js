"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPositions = void 0;
var tslib_1 = require("tslib");
var setChildrenPositions = function (state, token, pos) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    if (token.hasOwnProperty('offsetLeft')) {
        pos += token.offsetLeft;
    }
    var start_content = pos;
    for (var i = 0; i < token.children.length; i++) {
        var child = token.children[i];
        var startPos = pos;
        if (child.type === "link_open" && !child.hasOwnProperty('nextPos')) {
            if (token.children[i + 1].hasOwnProperty('nextPos')) {
                token.children[i + 1].positions = {
                    start: startPos + 1,
                    end: start_content + token.children[i + 1].nextPos
                };
            }
            else {
                token.children[i + 1].positions = {
                    start: startPos + 1,
                    end: startPos + 1 + ((_a = token.children[i + 1].content) === null || _a === void 0 ? void 0 : _a.length)
                };
            }
            token.children[i + 1].content_test_str = state.src.slice(token.children[i + 1].positions.start, token.children[i + 1].positions.end);
            child.positions = {
                start: startPos,
                end: start_content + token.children[i + 2].nextPos
            };
            child.content_test_str = state.src.slice(child.positions.start, child.positions.end);
            pos = child.positions.end;
            i += 2;
            continue;
        }
        if (child.hasOwnProperty('nextPos')) {
            pos = start_content + child.nextPos;
        }
        else {
            if ((_b = child.inlinePos) === null || _b === void 0 ? void 0 : _b.end) {
                pos += child.inlinePos.end - child.inlinePos.start;
            }
            else {
                pos += ((_c = child === null || child === void 0 ? void 0 : child.content) === null || _c === void 0 ? void 0 : _c.length) ? (_d = child === null || child === void 0 ? void 0 : child.content) === null || _d === void 0 ? void 0 : _d.length : ((_e = child === null || child === void 0 ? void 0 : child.markup) === null || _e === void 0 ? void 0 : _e.length) ? (_f = child === null || child === void 0 ? void 0 : child.markup) === null || _f === void 0 ? void 0 : _f.length : 0;
            }
            if (child.type === 'softbreak') {
                pos++;
            }
        }
        child.positions = {
            start: startPos,
            end: pos
        };
        if (((_g = child === null || child === void 0 ? void 0 : child.inlinePos) === null || _g === void 0 ? void 0 : _g.hasOwnProperty('start_content')) && ((_h = child.inlinePos) === null || _h === void 0 ? void 0 : _h.hasOwnProperty('end_content'))) {
            child.positions.start_content = start_content + child.inlinePos.start_content;
            child.positions.end_content = start_content + child.inlinePos.end_content;
        }
        child.content_test_str = state.src.slice(child.positions.start, child.positions.end);
        if (child === null || child === void 0 ? void 0 : child.positions.start_content) {
            child.content_test = state.src.slice(child.positions.start_content, child.positions.end_content);
        }
        if ((_j = child.children) === null || _j === void 0 ? void 0 : _j.length) {
            var data = child.positions.hasOwnProperty('start_content')
                ? setChildrenPositions(state, child, child.positions.start_content)
                : setChildrenPositions(state, child, child.positions.start);
            child = data.token;
        }
    }
    return {
        token: token
    };
};
exports.setPositions = function (state) {
    var _a, _b, _c, _d, _e, _f;
    var lines = ((_a = state.env) === null || _a === void 0 ? void 0 : _a.lines) ? tslib_1.__assign({}, (_b = state.env) === null || _b === void 0 ? void 0 : _b.lines) : null;
    if (!lines) {
        console.log("Can not set positions. env.lines is not initialized.");
        return;
    }
    var offsetContent = 0;
    for (var i = 0; i < state.tokens.length; i++) {
        var token = state.tokens[i];
        if (token.block) {
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
            }
            /** Ignore set positions for children.
             * Since the content may not match the original string. Line breaks can be removed*/
            if (['tabular'].includes(token.type)) {
                continue;
            }
            if (((_e = token.children) === null || _e === void 0 ? void 0 : _e.length) && token.positions) {
                var pos = token.positions.hasOwnProperty('start_content')
                    ? token.positions.start_content
                    : ((_f = token.positions) === null || _f === void 0 ? void 0 : _f.start) ? token.positions.start : 0;
                pos += offsetContent;
                var data = setChildrenPositions(state, token, pos);
                token = data.token;
            }
        }
    }
    // console.log("[MMD]=>[state.tokens]=>", state.tokens)
};
//# sourceMappingURL=set-positions.js.map