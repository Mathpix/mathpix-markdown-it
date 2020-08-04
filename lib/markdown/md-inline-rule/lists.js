"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSetCounterInline = exports.listItemInline = exports.listBeginInline = exports.listCloseInline = void 0;
var lists_1 = require("../md-block-rule/lists");
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
        .match(lists_1.bItemTag);
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
    var children = [];
    state.md.inline.parse(content.trim(), state.md, state.env, children);
    token.children = children;
    if (match[1]) {
        token.marker = match[1];
        var children_1 = [];
        state.md.inline.parse(match[1], state.md, state.env, children_1);
        token.markerTokens = children_1;
    }
    state.pos = startMathPos + match.index + match[0].length + content.length;
    return true;
};
exports.listSetCounterInline = function (state, silent) {
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
        content = match[2];
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