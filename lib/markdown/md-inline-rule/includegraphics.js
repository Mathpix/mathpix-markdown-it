"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineIncludeGraphics = exports.StatePushIncludeGraphics = exports.ParseIncludeGraphics = void 0;
var parseLinkDestination = require("markdown-it/lib/helpers/parse_link_destination");
var utils_1 = require("./utils");
var normalize_link_1 = require("../../helpers/normalize-link");
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
                style += "".concat(param[0], ": ").concat(param[1], ";");
                res.push(['width', param[1]]);
                break;
            case 'height':
                style += "".concat(param[0], ": ").concat(param[1], ";");
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
    var res = href ? parseLinkDestination(href, 0, href.length) : null;
    if (res === null || res === void 0 ? void 0 : res.ok) {
        href = res.str;
        href = (0, normalize_link_1.normalizeLink)(href);
    }
    var params = match[1] ? match[1].replace(/\]|\[/g, '') : '';
    var styles = parseParams(params, align);
    var attrs = [['src', href], ['alt', '']];
    if (styles) {
        attrs = attrs.concat(styles.attr);
    }
    return { attrs: attrs, latex: params };
};
var ParseIncludeGraphics = function (str, i, align) {
    if (align === void 0) { align = ''; }
    var res = [];
    var posB = 0;
    for (var i_1 = 0; i_1 < str.length; i_1++) {
        var match = str
            .slice(posB)
            .match(utils_1.includegraphicsTag);
        if (!match) {
            var content = str.slice(posB);
            if (content && content.trim().length > 0) {
                res.push({ token: 'inline', tag: '', n: 0, content: content, pos: posB + content.length });
            }
            break;
        }
        if (match.index > 0) {
            res.push({ token: 'inline', tag: '', n: 0, content: str.slice(posB, posB + match.index), pos: posB + match.index });
        }
        var _a = getAttrIncludeGraphics(match, align), attrs = _a.attrs, latex = _a.latex;
        var inlinePos = {
            start: posB + match.index,
            end: posB
        };
        posB += match.index + match[0].length;
        i_1 = posB;
        inlinePos.end = i_1;
        res.push({ token: 'includegraphics', tag: 'img', n: 0, attrs: attrs, content: '', pos: posB, latex: latex, inlinePos: inlinePos });
    }
    return res;
};
exports.ParseIncludeGraphics = ParseIncludeGraphics;
var StatePushIncludeGraphics = function (state, startLine, nextLine, content, align) {
    var token;
    if (!align && state.md.options.centerImages) {
        align = 'center';
    }
    var res = (0, exports.ParseIncludeGraphics)(content, 0, align);
    if (!res || res.length === 0) {
        return false;
    }
    if (nextLine >= 0) {
        state.line = nextLine;
    }
    for (var j = 0; j < res.length; j++) {
        token = state.push(res[j].token, res[j].tag, res[j].n);
        token.map = [startLine, nextLine];
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
        if (res[j].inlinePos) {
            token.inlinePos = res[j].inlinePos;
        }
    }
    return true;
};
exports.StatePushIncludeGraphics = StatePushIncludeGraphics;
var InlineIncludeGraphics = function (state, silent) {
    var startMathPos = state.pos;
    if (state.src.charCodeAt(startMathPos) !== 0x5c /* \ */) {
        return false;
    }
    var match = state.src
        .slice(startMathPos)
        .match(utils_1.includegraphicsTagB);
    if (!match) {
        return false;
    }
    var _a = getAttrIncludeGraphics(match, ''), attrs = _a.attrs, latex = _a.latex;
    if (!silent) {
        var token = state.push("includegraphics", "img", 0);
        token.attrs = attrs;
        if (state.md.options.centerImages && state.env.align) {
            token.attrSet('data-align', state.env.align);
        }
        token.content = '';
        if (state.md.options.forLatex) {
            token.latex = latex;
        }
        token.inlinePos = {
            start: match.index,
            end: match.index + match[0].length
        };
    }
    state.pos = startMathPos + match.index + match[0].length;
    return true;
};
exports.InlineIncludeGraphics = InlineIncludeGraphics;
//# sourceMappingURL=includegraphics.js.map