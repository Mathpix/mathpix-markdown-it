"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineIncludeGraphics = exports.StatePushIncludeGraphics = exports.ParseIncludeGraphics = void 0;
var tslib_1 = require("tslib");
var parseLinkDestination = require("markdown-it/lib/helpers/parse_link_destination");
var utils_1 = require("./utils");
var normalize_link_1 = require("../../helpers/normalize-link");
var parseParams = function (str, align) {
    var e_1, _a;
    if (align === void 0) { align = ''; }
    if (!str || !str.trim())
        return null;
    var res = [];
    var style = '';
    var alt = '';
    // 1. Split the parameters by commas, taking into account the depth of the curly braces
    var parts = [];
    var buf = '';
    var depth = 0;
    for (var i = 0; i < str.length; i++) {
        var ch = str[i];
        if (ch === '{') {
            depth++;
            buf += ch;
        }
        else if (ch === '}') {
            depth = Math.max(0, depth - 1);
            buf += ch;
        }
        else if (ch === ',' && depth === 0) {
            if (buf.trim())
                parts.push(buf.trim());
            buf = '';
        }
        else {
            buf += ch;
        }
    }
    if (buf.trim()) {
        parts.push(buf.trim());
    }
    try {
        // 2. For each parameter, look for the first '=' outside the brackets
        for (var parts_1 = tslib_1.__values(parts), parts_1_1 = parts_1.next(); !parts_1_1.done; parts_1_1 = parts_1.next()) {
            var part = parts_1_1.value;
            var key = '';
            var value = '';
            depth = 0;
            var eqIndex = -1;
            for (var i = 0; i < part.length; i++) {
                var ch = part[i];
                if (ch === '{') {
                    depth++;
                }
                else if (ch === '}') {
                    depth = Math.max(0, depth - 1);
                }
                else if (ch === '=' && depth === 0) {
                    eqIndex = i;
                    break;
                }
            }
            if (eqIndex === -1) {
                // Parameter without '=' can be interpreted as a flag (e.g. align)
                key = part.trim();
                value = '';
            }
            else {
                key = part.slice(0, eqIndex).trim();
                value = part.slice(eqIndex + 1).trim();
            }
            // remove outer { } around value:
            if (value.startsWith('{') && value.endsWith('}')) {
                value = value.slice(1, -1);
            }
            if (['left', 'right', 'center'].includes(key)) {
                align = key;
            }
            switch (key) {
                case 'width':
                    style += "width: ".concat(value, ";");
                    res.push(['width', value]);
                    break;
                case 'max width':
                    style += "max-width: ".concat(value, ";");
                    res.push(['max width', value]);
                    break;
                case 'height':
                    style += "height: ".concat(value, ";");
                    res.push(['height', value]);
                    break;
                case 'alt':
                    res.push(['alt', value]);
                    alt = value;
                    break;
                default:
                    break;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (parts_1_1 && !parts_1_1.done && (_a = parts_1.return)) _a.call(parts_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    if (align) {
        res.push(['align', align]);
    }
    if (!alt) {
        res.push(['alt', '']);
    }
    res.push(['style', style]);
    return { attr: res, align: align };
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
    var attrs = [['src', href]];
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