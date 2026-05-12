"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderAsciiMath = exports.backtickAsAsciiMath = exports.asciiMath = void 0;
var convert_math_to_html_1 = require("../common/convert-math-to-html");
var asciiMath = function (state, silent) {
    var notRenderAsciiMath = state.md.options.mathJax
        && Object(state.md.options.mathJax).hasOwnProperty('asciiMath')
        && state.md.options.mathJax.asciiMath === false;
    if (notRenderAsciiMath) {
        return false;
    }
    var startMathPos = state.pos;
    var beginMarker = /^<ascii>/;
    var endMarker = '</ascii>';
    if (state.src.charCodeAt(startMathPos) !== 0x3C /* < */) {
        return false;
    }
    if (!beginMarker.test(state.src.slice(startMathPos))) {
        return false;
    }
    var match = state.src
        .slice(startMathPos)
        .match(beginMarker);
    if (!match) {
        return false;
    }
    startMathPos += match[0].length;
    var endMarkerPos = state.src.indexOf(endMarker, startMathPos);
    if (endMarkerPos === -1) {
        return false;
    }
    var nextPos = endMarkerPos + endMarker.length;
    if (!silent) {
        var token = state.push("ascii_math", 0);
        token.content = state.src.slice(startMathPos, endMarkerPos);
        if (state.env.tabulare) {
            token.return_asciimath = true;
        }
        if (state.md.options.forLatex) {
            token.markup = startMathPos;
        }
        (0, convert_math_to_html_1.convertAsciiMathToHtml)(state, token);
    }
    state.pos = nextPos;
    return true;
};
exports.asciiMath = asciiMath;
var backtickAsAsciiMath = function (state, silent) {
    var useBacktick = state.md.options.mathJax && state.md.options.mathJax.asciiMath && state.md.options.mathJax.asciiMath.useBacktick;
    if (!useBacktick) {
        return false;
    }
    var start, marker, matchStart, matchEnd, token, pos = state.pos, ch = state.src.charCodeAt(pos);
    if (ch !== 0x60 /* ` */) {
        return false;
    }
    start = pos;
    pos++;
    if (state.src.charCodeAt(pos) === 0x60 /* ` */) {
        return false;
    }
    marker = state.src.slice(start, pos);
    matchStart = matchEnd = pos;
    while ((matchStart = state.src.indexOf('`', matchEnd)) !== -1) {
        matchEnd = matchStart + 1;
        if (matchEnd - matchStart === marker.length) {
            if (!silent) {
                token = state.push('ascii_math', 0);
                token.markup = marker;
                token.content = state.src.slice(pos, matchStart)
                    .replace(/[ \n]+/g, ' ')
                    .trim();
                (0, convert_math_to_html_1.convertAsciiMathToHtml)(state, token);
            }
            state.pos = matchEnd;
            return true;
        }
    }
    if (!silent) {
        state.pending += marker;
    }
    state.pos += marker.length;
    return true;
};
exports.backtickAsAsciiMath = backtickAsAsciiMath;
var renderAsciiMath = function (tokens, idx, options) {
    var _a;
    var token = tokens[idx];
    if (token.error) {
        if ((_a = options === null || options === void 0 ? void 0 : options.outMath) === null || _a === void 0 ? void 0 : _a.not_catch_errors) {
            throw token.error;
        }
        return "<p class=\"math-error\">".concat(token.content, "</p>");
    }
    return "<span class=\"math-inline ascii\">".concat(token.mathEquation, "</span>");
};
exports.renderAsciiMath = renderAsciiMath;
//# sourceMappingURL=index.js.map