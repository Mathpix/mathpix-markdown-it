"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineIncludeGraphics = exports.StatePushIncludeGraphics = exports.ParseIncludeGraphics = void 0;
var utils_1 = require("./utils");
var parseParams = function (str, align) {
    if (align === void 0) { align = ''; }
    if (!str) {
        return null;
    }
    var params = [];
    var style = '';
    var res = [];
    str = str.replace(/ /g, '');
    if (str) {
        params = str.split(',');
    }
    for (var i = 0; i < params.length; i++) {
        var param = params[i].split('=');
        if (['left', 'right', 'center'].indexOf(param[0]) >= 0) {
            align = param[0];
        }
        switch (param[0]) {
            case 'width':
                style += param[0] + ": " + param[1] + ";";
                res.push(['width', param[1]]);
                break;
            case 'height':
                style += param[0] + ": " + param[1] + ";";
                res.push(['height', param[1]]);
                break;
            default:
                break;
        }
    }
    if (align) {
        res.push(['align', align]);
    }
    res.push(['style', style]);
    return style ? { attr: res, align: align } : null;
};
var getAttrIncludeGraphics = function (match, align) {
    var href = match[2];
    var params = match[1] ? match[1].replace(/\]|\[/g, '') : '';
    var styles = parseParams(params, align);
    var attrs = [['src', href], ['alt', '']];
    if (styles) {
        attrs = attrs.concat(styles.attr);
    }
    return { attrs: attrs, latex: params };
};
exports.ParseIncludeGraphics = function (str, i, align) {
    if (align === void 0) { align = ''; }
    var res = [];
    var posB = 0;
    for (var i_1 = 0; i_1 < str.length; i_1++) {
        var match = str
            .slice(posB)
            .match(utils_1.includegraphicsTag);
        if (!match) {
            if (str.slice(posB) && str.slice(posB).trim().length > 0) {
                res.push({ token: 'inline', tag: '', n: 0, content: str, pos: posB + str.length });
            }
            break;
        }
        if (match.index > 0) {
            res.push({ token: 'inline', tag: '', n: 0, content: str.slice(posB, posB + match.index), pos: posB + match.index });
        }
        var _a = getAttrIncludeGraphics(match, align), attrs = _a.attrs, latex = _a.latex;
        posB += match.index + match[0].length;
        i_1 = posB;
        res.push({ token: 'includegraphics', tag: 'img', n: 0, attrs: attrs, content: '', pos: posB, latex: latex });
    }
    return res;
};
exports.StatePushIncludeGraphics = function (state, startLine, nextLine, content, align) {
    var token;
    var res = exports.ParseIncludeGraphics(content, 0, align);
    if (!res || res.length === 0) {
        return false;
    }
    if (nextLine >= 0) {
        state.line = nextLine;
    }
    for (var j = 0; j < res.length; j++) {
        token = state.push(res[j].token, res[j].tag, res[j].n);
        if (res[j].attrs) {
            token.attrs = [].concat(res[j].attrs);
        }
        if (res[j].content) {
            token.content = res[j].content;
            token.children = [];
        }
        if (state.md.options.forLatex && res[j].latex) {
            token.latex = res[j].latex;
        }
    }
    return true;
};
exports.InlineIncludeGraphics = function (state, silent) {
    var startMathPos = state.pos;
    if (state.src.charCodeAt(startMathPos) !== 0x5c /* \ */) {
        return false;
    }
    var match = state.src
        .slice(startMathPos)
        .match(utils_1.includegraphicsTag);
    if (!match) {
        return false;
    }
    var _a = getAttrIncludeGraphics(match, ''), attrs = _a.attrs, latex = _a.latex;
    if (!silent) {
        var token = state.push("includegraphics", "img", 0);
        token.attrs = attrs;
        token.content = '';
        if (state.md.options.forLatex) {
            token.latex = latex;
        }
    }
    state.pos = startMathPos + match.index + match[0].length;
    return true;
};
//# sourceMappingURL=includegraphics.js.map