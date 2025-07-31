"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkTagOutsideInlineCode = exports.removeCaptionsSetupFromTableAndFigure = exports.removeCaptionsFromTableAndFigure = exports.getTerminatedRules = exports.findEndMarker = exports.getInlineCodeListFromString = exports.uniqueSlug = exports.slugify = exports.isSpace = exports.tocRegexp = void 0;
var tslib_1 = require("tslib");
var consts_1 = require("./common/consts");
var utils_1 = require("./utils");
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
var getInlineCodeListFromString = function (str) {
    var inlineCodeList = [];
    if (!str || !str.trim()) {
        return inlineCodeList;
    }
    if (str.indexOf('`') === -1) {
        return inlineCodeList;
    }
    try {
        var pos = 0;
        var beforeCharCode = 0;
        var arrLines = str.split('\n\n');
        if (arrLines === null || arrLines === void 0 ? void 0 : arrLines.length) {
            for (var i = 0; i < arrLines.length; i++) {
                pos += i > 0 ? 2 : 0;
                var line = arrLines[i];
                if (!line || !line.trim() || line.indexOf('`') === -1) {
                    pos += (line === null || line === void 0 ? void 0 : line.length) ? line.length : 0;
                    continue;
                }
                for (var j = 0; j < line.length; j++) {
                    var ch = line.charCodeAt(j);
                    if (ch === 0x60 /* ` */ && beforeCharCode !== 0x5c /* \ */) {
                        var data = (0, utils_1.findBackTick)(j, line);
                        if (data.pending) {
                            break;
                        }
                        inlineCodeList.push({
                            marker: data.marker,
                            posStart: pos + j,
                            posEnd: pos + data.posEnd,
                            content: str.slice(pos + j, pos + data.posEnd)
                        });
                        j = data.posEnd - 1;
                    }
                    beforeCharCode = ch;
                }
                pos += (line === null || line === void 0 ? void 0 : line.length) ? line.length : 0;
            }
        }
        return inlineCodeList;
    }
    catch (err) {
        console.log("[MMD]=>ERROR=>[getInlineCodeListFromString]=>", err);
        return inlineCodeList;
    }
};
exports.getInlineCodeListFromString = getInlineCodeListFromString;
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
var findEndMarker = function (str, startPos, beginMarker, endMarker, onlyEnd, openBracketsBefore) {
    if (startPos === void 0) { startPos = 0; }
    if (beginMarker === void 0) { beginMarker = "{"; }
    if (endMarker === void 0) { endMarker = "}"; }
    if (onlyEnd === void 0) { onlyEnd = false; }
    if (openBracketsBefore === void 0) { openBracketsBefore = 0; }
    var content = '';
    var nextPos = 0;
    if (!str || !str.trim()) {
        return { res: false };
    }
    if (str[startPos] !== beginMarker && !onlyEnd) {
        return { res: false };
    }
    var openBrackets = openBracketsBefore ? openBracketsBefore : 1;
    var beforeCharCode = 0;
    var inlineCodeList = (0, exports.getInlineCodeListFromString)(str);
    var _loop_1 = function (i) {
        var chr = str[i];
        nextPos = i;
        /** Found beginMarker and it is not inline code. (and it's not shielded '\{' )
         * We increase the counter of open tags <openBrackets> and continue the search */
        if (chr === beginMarker && beforeCharCode !== 0x5c /* \ */) {
            content += chr;
            var isCode = (inlineCodeList === null || inlineCodeList === void 0 ? void 0 : inlineCodeList.length)
                ? inlineCodeList.find(function (item) { return item.posStart <= i && item.posEnd >= i; })
                : null;
            if (!isCode) {
                openBrackets++;
            }
            return "continue";
        }
        /** Found endMarker and it is not inline code (and it's not shielded '\}' ) */
        if (chr === endMarker && beforeCharCode !== 0x5c /* \ */) {
            var isCode = (inlineCodeList === null || inlineCodeList === void 0 ? void 0 : inlineCodeList.length)
                ? inlineCodeList.find(function (item) { return item.posStart <= i && item.posEnd >= i; })
                : null;
            if (!isCode) {
                openBrackets--;
            }
            if (openBrackets > 0) {
                /** Continue searching if not all open tags <openBrackets> have been closed */
                content += chr;
                return "continue";
            }
            return "break";
        }
        content += chr;
        beforeCharCode = str.charCodeAt(i);
    };
    for (var i = startPos + 1; i < str.length; i++) {
        var state_1 = _loop_1(i);
        if (state_1 === "break")
            break;
    }
    if (openBrackets > 0) {
        return {
            res: false,
            content: content,
            openBrackets: openBrackets
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
var removeCaptionsFromTableAndFigure = function (content) {
    var captionTagBegin = /\\caption\s{0,}\{/;
    var matchCaptionB = content.match(captionTagBegin);
    if (!matchCaptionB) {
        return {
            content: content,
            isNotCaption: true
        };
    }
    var data = (0, exports.findEndMarker)(content, matchCaptionB.index + matchCaptionB[0].length - 1);
    if (!data.res) {
        return {
            content: content,
            isNotCaption: true
        };
    }
    var startCaption = matchCaptionB.index > 0 ? matchCaptionB.index - 1 : matchCaptionB.index;
    while (startCaption > 0) {
        var beforeStartMarker = content.charCodeAt(startCaption);
        if (!(beforeStartMarker === 0x20 /* space */ || beforeStartMarker === 0x09 /* \t */ || beforeStartMarker === 0x0a /* \n */)) {
            startCaption += 1;
            break;
        }
        startCaption--;
    }
    var endCaption = data.nextPos;
    while (endCaption < content.length) {
        var afterEndMarker = content.charCodeAt(endCaption);
        if (!(afterEndMarker === 0x20 /* space */ || afterEndMarker === 0x09 /* \t */ || afterEndMarker === 0x0a /* \n */)) {
            break;
        }
        endCaption++;
    }
    return {
        content: content.slice(0, startCaption) + content.slice(endCaption),
        isNotCaption: false
    };
};
exports.removeCaptionsFromTableAndFigure = removeCaptionsFromTableAndFigure;
var parseCaptionSetupArgs = function (argStr) {
    var e_1, _a;
    var args = {};
    var parts = argStr.split(',').map(function (p) { return p.trim(); });
    try {
        for (var parts_1 = tslib_1.__values(parts), parts_1_1 = parts_1.next(); !parts_1_1.done; parts_1_1 = parts_1.next()) {
            var part = parts_1_1.value;
            var _b = tslib_1.__read(part.split('=').map(function (s) { return s.trim(); }), 2), key = _b[0], value = _b[1];
            if (key && value) {
                args[key] = value;
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
    return args;
};
var removeCaptionsSetupFromTableAndFigure = function (content) {
    var isLabelFormatEmpty = false;
    var isSingleLineCheck = false;
    try {
        var matchCaption = content.match(consts_1.RE_CAPTION_SETUP_TAG_BEGIN);
        if (!matchCaption) {
            return { content: content, isLabelFormatEmpty: isLabelFormatEmpty, isSingleLineCheck: isSingleLineCheck };
        }
        var data = (0, exports.findEndMarker)(content, matchCaption.index + matchCaption[0].length - 1);
        if (!data.res) {
            return { content: content, isLabelFormatEmpty: isLabelFormatEmpty, isSingleLineCheck: isSingleLineCheck };
        }
        if (data.content) {
            var argsObj = parseCaptionSetupArgs(data.content);
            if (argsObj.labelformat === 'empty') {
                isLabelFormatEmpty = true;
            }
            if (['true', 'yes', 'on'].includes(argsObj.singlelinecheck)) {
                isSingleLineCheck = true;
            }
        }
        var start = matchCaption.index > 0 ? matchCaption.index - 1 : matchCaption.index;
        while (start > 0) {
            var beforeStartMarker = content.charCodeAt(start);
            if (!(beforeStartMarker === 0x20 /* space */ || beforeStartMarker === 0x09 /* \t */ || beforeStartMarker === 0x0a /* \n */)) {
                start += 1;
                break;
            }
            start--;
        }
        var end = data.nextPos;
        while (end < content.length) {
            var afterEndMarker = content.charCodeAt(end);
            if (!(afterEndMarker === 0x20 /* space */ || afterEndMarker === 0x09 /* \t */ || afterEndMarker === 0x0a /* \n */)) {
                break;
            }
            end++;
        }
        return {
            content: content.slice(0, start) + content.slice(end),
            isLabelFormatEmpty: isLabelFormatEmpty,
            isSingleLineCheck: isSingleLineCheck
        };
    }
    catch (err) {
        return {
            content: content,
            isLabelFormatEmpty: isLabelFormatEmpty,
            isSingleLineCheck: isSingleLineCheck
        };
    }
};
exports.removeCaptionsSetupFromTableAndFigure = removeCaptionsSetupFromTableAndFigure;
var checkTagOutsideInlineCode = function (text, regex) {
    var _a;
    var match = text.match(regex);
    if (!match)
        return false;
    var inlineCodeList = (0, exports.getInlineCodeListFromString)(text);
    var matchIndex = (_a = match.index) !== null && _a !== void 0 ? _a : -1;
    if (!inlineCodeList.length)
        return true;
    var isInsideCode = inlineCodeList.some(function (item) { return item.posStart <= matchIndex && item.posEnd >= matchIndex; });
    return !isInsideCode;
};
exports.checkTagOutsideInlineCode = checkTagOutsideInlineCode;
//# sourceMappingURL=common.js.map