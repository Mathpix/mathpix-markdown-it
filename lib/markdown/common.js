"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findEndMarker = exports.uniqueSlug = exports.slugify = exports.isSpace = exports.tocRegexp = void 0;
var hasProp = Object.prototype.hasOwnProperty;
exports.tocRegexp = /^\[\[toc\]\]/im;
exports.isSpace = function (code) {
    switch (code) {
        case 0x09:
        case 0x20:
            return true;
    }
    return false;
};
exports.slugify = function (s) { return encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-')); };
exports.uniqueSlug = function (slug, slugs) {
    var uniq = slug;
    var i = 2;
    while (hasProp.call(slugs, uniq))
        uniq = slug + "-" + i++;
    slugs[uniq] = true;
    return uniq;
};
exports.findEndMarker = function (str, startPos, beginMarker, endMarker, onlyEnd) {
    if (startPos === void 0) { startPos = 0; }
    if (beginMarker === void 0) { beginMarker = "{"; }
    if (endMarker === void 0) { endMarker = "}"; }
    if (onlyEnd === void 0) { onlyEnd = false; }
    var content = '';
    var nextPos = 0;
    if (str[startPos] !== beginMarker && !onlyEnd) {
        return { res: false };
    }
    var openBrackets = 1;
    var openCode = 0;
    for (var i = startPos + 1; i < str.length; i++) {
        var chr = str[i];
        nextPos = i;
        if (chr === '`') {
            if (openCode > 0) {
                openCode--;
            }
            else {
                openCode++;
            }
        }
        if (chr === beginMarker && openCode === 0) {
            content += chr;
            openBrackets++;
            continue;
        }
        if (chr === endMarker && openCode === 0) {
            openBrackets--;
            if (openBrackets > 0) {
                content += chr;
                continue;
            }
            break;
        }
        content += chr;
    }
    if (openBrackets > 0) {
        return {
            res: false,
            content: content
        };
    }
    return {
        res: true,
        content: content,
        nextPos: nextPos + endMarker.length
    };
};
//# sourceMappingURL=common.js.map