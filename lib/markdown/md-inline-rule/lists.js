"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSetCounterInline = exports.listItemInline = exports.listBeginInline = exports.listCloseInline = void 0;
var tslib_1 = require("tslib");
var lists_1 = require("../md-block-rule/lists");
var utils_1 = require("../utils");
exports.listCloseInline = function (state, silent) {
    var token;
    var match;
    var startMathPos = state.pos;
    var closeTag = /^(?:end\s{0,}\{(itemize|enumerate)\})/;
    if (!state.env.isBlock) {
        return false;
    }
    if (state.src.charCodeAt(startMathPos) !== 0x5c /* \ */) {
        return false;
    }
    if (silent) {
        return false;
    }
    match = state.src
        .slice(++startMathPos)
        .match(closeTag);
    if (!match) {
        return false;
    }
    var type = match[1].trim() in lists_1.TBegin ? match[1].trim() : null;
    if (!type) {
        return false;
    }
    if (type === lists_1.TBegin.itemize) {
        token = state.push('itemize_list_close', 'ul', -1);
    }
    else {
        token = state.push('enumerate_list_close', 'ol', -1);
    }
    token.level -= 1;
    state.level -= 1;
    state.prentLevel = state.prentLevel > 0 ? state.prentLevel - 1 : 0;
    token.prentLevel = state.prentLevel;
    state.pos = startMathPos + match.index + match[0].length;
    return true;
};
exports.listBeginInline = function (state, silent) {
    var token;
    var match;
    var startMathPos = state.pos;
    var openTag = /^(?:begin\s{0,}\{(itemize|enumerate)\})/;
    if (!state.env.isBlock) {
        return false;
    }
    if (state.src.charCodeAt(startMathPos) !== 0x5c /* \ */) {
        return false;
    }
    if (silent) {
        return false;
    }
    match = state.src
        .slice(++startMathPos)
        .match(openTag);
    if (!match) {
        return false;
    }
    var type = match[1].trim() in lists_1.TBegin ? match[1].trim() : null;
    if (!type) {
        return false;
    }
    if (type === lists_1.TBegin.itemize) {
        token = state.push('itemize_list_open', 'ul', 1);
        state.prentLevel = (state.parentType !== 'itemize' && state.parentType !== 'enumerate') ? 0 : state.prentLevel + 1;
        state.parentType = 'itemize';
        state.types = ['itemize'];
    }
    else {
        token = state.push('enumerate_list_open', 'ol', 1);
        state.prentLevel = (state.parentType !== 'itemize' && state.parentType !== 'enumerate') ? 0 : state.prentLevel + 1;
        state.parentType = 'enumerate';
        state.types = ['enumerate'];
    }
    token.prentLevel = state.prentLevel;
    state.pos = startMathPos + match.index + match[0].length; // + content.length;
    return true;
};
exports.listItemInline = function (state, silent) {
    var token;
    var match;
    var startMathPos = state.pos;
    var endItem = /\\begin\s{0,}\{(itemize|enumerate)\}|\\end\s{0,}\{(itemize|enumerate)\}|\\item/;
    if (state.src.charCodeAt(startMathPos) !== 0x5c /* \ */) {
        return false;
    }
    if (silent) {
        return false;
    }
    match = state.src
        .slice(++startMathPos)
        .match(lists_1.bItemTag); ///^(?:item\s{0,}\[([^\]]*)\]|item)/
    if (!match) {
        return false;
    }
    var matchEnd = state.src
        .slice(startMathPos + match.index + match[0].length)
        .match(endItem);
    var content = matchEnd && matchEnd.index > 0
        ? state.src.slice(startMathPos + match.index + match[0].length, matchEnd.index + startMathPos + match.index + match[0].length)
        : state.src.slice(startMathPos + match.index + match[0].length);
    token = state.push('item_inline', 'li', 0);
    token.parentType = state.parentType;
    token.inlinePos = {
        start_content: startMathPos + match.index + match[0].length,
    };
    token.inlinePos.start_content += utils_1.getSpacesFromLeft(content);
    token.inlinePos.end_content = token.inlinePos.start_content + content.length;
    var children = [];
    state.md.inline.parse(content.trim(), state.md, state.env, children);
    token.children = children;
    if (match[1] !== undefined) {
        token.marker = match[1] ? match[1].trim() : '';
        var children_1 = [];
        var beforeOptions = tslib_1.__assign({}, state.md.options);
        if (state.md.options.forDocx) {
            state.md.options = Object.assign({}, state.md.options, {
                outMath: {
                    include_svg: true,
                    include_mathml_word: false,
                }
            });
        }
        state.md.inline.parse(match[1], state.md, state.env, children_1);
        state.md.options = beforeOptions;
        token.markerTokens = children_1;
    }
    state.pos = startMathPos + match.index + match[0].length + content.length;
    return true;
};
exports.listSetCounterInline = function (state, silent) {
    var _a;
    var token;
    var match;
    var startMathPos = state.pos;
    var content = '';
    var setcounterTag = /^(?:setcounter\s{0,}\{([^}]*)\}\s{0,}\{([^}]*)\})/;
    if (!state.env.isBlock) {
        return false;
    }
    if (state.src.charCodeAt(startMathPos) !== 0x5c /* \ */) {
        return false;
    }
    if (silent) {
        return false;
    }
    match = state.src
        .slice(++startMathPos)
        .match(setcounterTag);
    if (!match) {
        return false;
    }
    if (match && match[2]) {
        var startNumber = ((_a = match[2]) === null || _a === void 0 ? void 0 : _a.trim()) && lists_1.reNumber.test(match[2].trim())
            ? Number(match[2].trim()) + 1 : 1;
        content = startNumber.toString();
    }
    else {
        return false;
    }
    token = state.push('setcounter', '', 0);
    token.content = content;
    state.pos = startMathPos + match.index + match[0].length;
    return true;
};
//# sourceMappingURL=lists.js.map