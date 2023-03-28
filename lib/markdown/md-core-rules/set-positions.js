"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPositions = void 0;
var tslib_1 = require("tslib");
exports.setPositions = function (state) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5;
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
                /** Skip set positions for theorems */
                if (token.type === "theorem_open") {
                    i++;
                    while (((_e = state.tokens[i]) === null || _e === void 0 ? void 0 : _e.type) !== "theorem_close" && i < state.tokens.length) {
                        i++;
                    }
                    continue;
                }
                if (token.type === "proof_open") {
                    i++;
                    while (((_f = state.tokens[i]) === null || _f === void 0 ? void 0 : _f.type) !== "proof_close" && i < state.tokens.length) {
                        i++;
                    }
                    continue;
                }
            }
            /** Ignore set positions for children.
             * Since the content may not match the original string. Line breaks can be removed*/
            if (['tabular'].includes(token.type)) {
                continue;
            }
            if (((_g = token.children) === null || _g === void 0 ? void 0 : _g.length) && token.positions) {
                var pos = token.positions.hasOwnProperty('start_content')
                    ? token.positions.start_content
                    : ((_h = token.positions) === null || _h === void 0 ? void 0 : _h.start) ? token.positions.start : 0;
                pos += offsetContent;
                var start_content = pos;
                for (var i_1 = 0; i_1 < token.children.length; i_1++) {
                    if ((_j = token.children[i_1].inlinePos) === null || _j === void 0 ? void 0 : _j.hasOwnProperty('start')) {
                        pos = start_content + token.children[i_1].inlinePos.start;
                    }
                    if (token.children[i_1].type === "code_inline") {
                        pos += ((_l = (_k = token.children[i_1]) === null || _k === void 0 ? void 0 : _k.markup) === null || _l === void 0 ? void 0 : _l.length) ? (_o = (_m = token.children[i_1]) === null || _m === void 0 ? void 0 : _m.markup) === null || _o === void 0 ? void 0 : _o.length : 0;
                    }
                    var startPos = pos;
                    if ((_p = token.children[i_1].inlinePos) === null || _p === void 0 ? void 0 : _p.end) {
                        pos += token.children[i_1].inlinePos.end - token.children[i_1].inlinePos.start;
                    }
                    else {
                        pos += ((_r = (_q = token.children[i_1]) === null || _q === void 0 ? void 0 : _q.content) === null || _r === void 0 ? void 0 : _r.length) ? (_t = (_s = token.children[i_1]) === null || _s === void 0 ? void 0 : _s.content) === null || _t === void 0 ? void 0 : _t.length : ((_v = (_u = token.children[i_1]) === null || _u === void 0 ? void 0 : _u.markup) === null || _v === void 0 ? void 0 : _v.length) ? (_x = (_w = token.children[i_1]) === null || _w === void 0 ? void 0 : _w.markup) === null || _x === void 0 ? void 0 : _x.length : 0;
                    }
                    if (token.children[i_1].type === 'softbreak') {
                        pos++;
                    }
                    token.children[i_1].positions = {
                        start: startPos,
                        end: pos
                    };
                    if (((_z = (_y = token.children[i_1]) === null || _y === void 0 ? void 0 : _y.inlinePos) === null || _z === void 0 ? void 0 : _z.hasOwnProperty('start_content')) && ((_0 = token.children[i_1].inlinePos) === null || _0 === void 0 ? void 0 : _0.hasOwnProperty('end_content'))) {
                        token.children[i_1].positions.start_content = token.children[i_1].positions.start + token.children[i_1].inlinePos.start_content;
                        token.children[i_1].positions.end_content = token.children[i_1].positions.start + token.children[i_1].inlinePos.end_content;
                    }
                    token.children[i_1].content_test_str = state.src.slice(token.children[i_1].positions.start, token.children[i_1].positions.end);
                    if ((_1 = token.children[i_1]) === null || _1 === void 0 ? void 0 : _1.positions.start_content) {
                        token.children[i_1].content_test = state.src.slice(token.children[i_1].positions.start_content, token.children[i_1].positions.end_content);
                    }
                    if (token.children[i_1].type === "code_inline") {
                        pos += ((_3 = (_2 = token.children[i_1]) === null || _2 === void 0 ? void 0 : _2.markup) === null || _3 === void 0 ? void 0 : _3.length) ? (_5 = (_4 = token.children[i_1]) === null || _4 === void 0 ? void 0 : _4.markup) === null || _5 === void 0 ? void 0 : _5.length : 0;
                    }
                }
            }
        }
    }
    // console.log("[MMD]=>[state.tokens]=>", state.tokens)
};
//# sourceMappingURL=set-positions.js.map