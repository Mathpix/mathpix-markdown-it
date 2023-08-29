"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTerminatedRules = exports.findEndMarker = exports.uniqueSlug = exports.slugify = exports.isSpace = exports.tocRegexp = void 0;
var tslib_1 = require("tslib");
var consts_1 = require("./common/consts");
var hasProp = Object.prototype.hasOwnProperty;
exports.tocRegexp = /^\[\[toc\]\]/im;
var isSpace = function (code) {
    switch (code) {
        case 0x09:
        case 0x20:
            return true;
    }
    return false;
};
exports.isSpace = isSpace;
var slugify = function (s) { return encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-')); };
exports.slugify = slugify;
var uniqueSlug = function (slug, slugs) {
    var uniq = slug;
    var i = 2;
    while (hasProp.call(slugs, uniq))
        uniq = "".concat(slug, "-").concat(i++);
    slugs[uniq] = true;
    return uniq;
};
exports.uniqueSlug = uniqueSlug;
/** The function finds the position of the end marker in the specified string
 * and returns that position and the content between the start and end markers.
 *
 * In this case, if the line contains nested markers,
 * then these layouts will be ignored and the search will continue until the end marker is found.
 *   For example, for the expression \section{Second $x+sqrt{4}$ Section $x$ \textbf{f} text}
 *     Need to find end marker } in line {Second $x+sqrt{4}$ Section $x$ \textbf{f} text}
 *     Here:
 *         {Second $x+sqrt{4}$ Section $x$ \textbf{f} text}
 *                        ^nested end markers {...} will be ignored
 *         {Second $x+sqrt{4}$ Section $x$ \textbf{f} text}
 *                                                        ^and the search will continue until it is found
 * The function returns an object containing the information:
 *     res: boolean, - Contains false if the end marker could not be found
 *     content?: string, - Contains content between start and end markers
 *     nextPos?: number - Contains the position of the end marker in the string
 * */
var findEndMarker = function (str, startPos, beginMarker, endMarker, onlyEnd) {
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
    var beforeCharCode = 0;
    for (var i = startPos + 1; i < str.length; i++) {
        var chr = str[i];
        nextPos = i;
        /** Inline code opening/closing marker (and it's not shielded '\`' )
         * beginMarker and endMarker will be ignored if they are inline code. */
        if (chr === '`' && beforeCharCode !== 0x5c /* \ */) {
            if (openCode > 0) {
                openCode--;
            }
            else {
                openCode++;
            }
        }
        /** Found beginMarker and it is not inline code. (and it's not shielded '\{' )
         * We increase the counter of open tags <openBrackets> and continue the search */
        if (chr === beginMarker && openCode === 0 && beforeCharCode !== 0x5c /* \ */) {
            content += chr;
            openBrackets++;
            continue;
        }
        /** Found endMarker and it is not inline code (and it's not shielded '\}' ) */
        if (chr === endMarker && openCode === 0 && beforeCharCode !== 0x5c /* \ */) {
            openBrackets--;
            if (openBrackets > 0) {
                /** Continue searching if not all open tags <openBrackets> have been closed */
                content += chr;
                continue;
            }
            break;
        }
        content += chr;
        beforeCharCode = str.charCodeAt(i);
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
        nextPos: nextPos + endMarker.length,
        endPos: nextPos
    };
};
exports.findEndMarker = findEndMarker;
var getTerminatedRules = function (rule) {
    if (consts_1.terminatedRules.hasOwnProperty(rule)) {
        return tslib_1.__spreadArray([], tslib_1.__read(consts_1.terminatedRules[rule].terminated), false);
    }
    return [];
};
exports.getTerminatedRules = getTerminatedRules;
//# sourceMappingURL=common.js.map