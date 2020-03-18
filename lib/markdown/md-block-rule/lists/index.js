"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var re_level_1 = require("./re-level");
var TBegin;
(function (TBegin) {
    TBegin["itemize"] = "itemize";
    TBegin["enumerate"] = "enumerate";
})(TBegin = exports.TBegin || (exports.TBegin = {}));
;
var openTag = /\\begin\s{0,}\{(itemize|enumerate)\}/;
var ListItems = function (state, items, iLevel, eLevel, li) {
    var token;
    if (items && items.length > 0) {
        if (items && items.length > 0) {
            items.forEach(function (item) {
                var children = [];
                state.env.parentType = state.parentType;
                state.env.isBlock = true;
                state.md.inline.parse(item.content.trim(), state.md, state.env, children);
                for (var j = 0; j < children.length; j++) {
                    var child = children[j];
                    if (child.type === "setcounter") {
                        li = { value: child.content };
                        continue;
                    }
                    token = state.push(child.type, child.tag, 1);
                    if (child.type === "item_inline" && li && li.value) {
                        token.startValue = li.value;
                        token.attrs = [
                            ['value', li.value.toString()],
                        ];
                        li = null;
                    }
                    if (child.marker) {
                        token.marker = child.marker;
                        token.markerTokens = child.markerTokens;
                    }
                    token.parentType = state.types && state.types.length > 0 ? state.types[state.types.length - 1] : '';
                    token.parentStart = state.startLine;
                    token.map = [item.startLine, item.endLine + 1];
                    token.content = child.content;
                    token.children = child.children;
                    token.prentLevel = state.prentLevel;
                    if (child.type === "item_inline") {
                        token.prentLevel = state.prentLevel + 1;
                    }
                    token.itemizeLevel = iLevel;
                    // token.itemizeLevelTokens = iLevelTokens;
                    token.enumerateLevel = eLevel;
                }
                state.env.isBlock = false;
            });
        }
        items = [];
    }
    return items;
};
var setTokenOpenList = function (state, startLine, endLine, type, iLevel, eLevel) {
    var token;
    if (type === TBegin.itemize) {
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
    state.startLine = startLine;
    token.map = [startLine, endLine];
    token.itemizeLevel = iLevel;
    token.enumerateLevel = eLevel;
    token.prentLevel = state.prentLevel;
    return token;
};
var ListOpen = function (state, startLine, lineText, iLevel, eLevel) {
    var token, tokenStart = null;
    var iOpen = 0;
    if (lineText.charCodeAt(0) !== 0x5c /* \ */) {
        return { iOpen: iOpen, tokenStart: tokenStart };
    }
    var match = lineText.match(openTag);
    if (!match && (state.parentType !== 'itemize' && state.parentType !== 'enumerate')) {
        return { iOpen: iOpen, tokenStart: tokenStart };
    }
    re_level_1.SetItemizeLevelTokens(state);
    if (match) {
        var strAfter = lineText.slice(match.index + match[0].length);
        var type = match[1].trim() in TBegin ? match[1].trim() : null;
        if (!type) {
            return { iOpen: iOpen, tokenStart: tokenStart };
        }
        tokenStart = setTokenOpenList(state, startLine, startLine + 1, type, iLevel, eLevel);
        iOpen++;
        if (strAfter && strAfter.trim().length > 0) {
            var children = [];
            state.env.parentType = state.parentType;
            state.env.isBlock = true;
            state.md.inline.parse(strAfter, state.md, state.env, children);
            for (var j = 0; j < children.length; j++) {
                var child = children[j];
                token = state.push(child.type, child.tag, 1);
                token.parentType = state.types && state.types.length > 0 ? state.types[state.types.length - 1] : '';
                token.parentStart = state.startLine;
                token.map = [startLine, startLine];
                token.content = child.content;
                token.children = child.children;
                token.itemizeLevel = iLevel;
                token.enumerateLevel = eLevel;
                if (child.type === "enumerate_list_open" || child.type === "itemize_list_open") {
                    state.prentLevel++;
                    if (child.type === "itemize_list_open") {
                        state.types.push('itemize');
                    }
                    else {
                        state.types.push('enumerate');
                    }
                    iOpen++;
                }
                if (child.type === "enumerate_list_close" || child.type === "itemize_list_close") {
                    state.prentLevel--;
                    if (state.types && state.types.length > 0) {
                        state.types.pop();
                    }
                    iOpen--;
                }
                if (child.type === "item_inline") {
                    token.prentLevel = state.prentLevel + 1;
                }
                else {
                    token.prentLevel = state.prentLevel;
                }
            }
            state.env.isBlock = false;
        }
    }
    return { iOpen: iOpen, tokenStart: tokenStart };
};
exports.Lists = function (state, startLine, endLine, silent) {
    var openTag = /\\begin\s{0,}\{(itemize|enumerate)\}/;
    var closeTag = /\\end\s{0,}\{(itemize|enumerate)\}/;
    var itemTag = /\\item/;
    var setcounterTag = /\\setcounter\s{0,}\{([^}]*)\}\s{0,}\{([^}]*)\}/;
    var pos = state.bMarks[startLine] + state.tShift[startLine];
    var max = state.eMarks[startLine];
    var nextLine = startLine; // + 1;
    var dStart = state.md.options.renderElement && state.md.options.renderElement.startLine
        ? Number(state.md.options.renderElement.startLine)
        : 0;
    var token, oldParentType;
    var type;
    var li = null;
    //debugger
    var lineText = state.src.slice(pos, max);
    if (lineText.charCodeAt(0) !== 0x5c /* \ */) {
        return false;
    }
    var match = lineText.match(openTag);
    if (!match) {
        return false;
    }
    var eLevel = re_level_1.GetEnumerateLevel();
    var iLevelT = re_level_1.GetItemizeLevelTokensByState(state);
    oldParentType = state.parentType;
    var data = ListOpen(state, startLine + dStart, lineText, iLevelT, eLevel);
    var _a = data.iOpen, iOpen = _a === void 0 ? 0 : _a, _b = data.tokenStart, tokenStart = _b === void 0 ? null : _b;
    if (iOpen === 0) {
        nextLine += 1;
        state.line = nextLine;
        state.startLine = '';
        state.parentType = oldParentType;
        state.level = state.prentLevel < 0 ? 0 : state.prentLevel;
        return true;
    }
    else {
        nextLine += 1;
    }
    var content = '';
    var items = [];
    var haveClose = false;
    for (; nextLine < endLine; nextLine++) {
        pos = state.bMarks[nextLine] + state.tShift[nextLine];
        max = state.eMarks[nextLine];
        lineText = state.src.slice(pos, max);
        if (itemTag.test(lineText)) {
            content = lineText; //.slice(match.index + match[0].length)
            items.push({ content: content.trim(), startLine: nextLine + dStart, endLine: nextLine + dStart });
        }
        if (setcounterTag.test(lineText)) {
            match = lineText.match(setcounterTag);
            if (match && match[2]) {
                li = { value: match[2] };
                continue;
            }
        }
        if (closeTag.test(lineText)) {
            items = ListItems(state, items, iLevelT, eLevel, li);
            li = null;
            if (state.types && state.types.length > 0 && state.types[state.types.length - 1] === TBegin.itemize) {
                token = state.push('itemize_list_close', 'ul', -1);
                token.map = [startLine + dStart, nextLine + dStart];
            }
            else {
                token = state.push('enumerate_list_close', 'ol', -1);
                token.map = [startLine + dStart, nextLine + dStart];
            }
            token.level -= 1;
            state.level -= 1;
            state.prentLevel = state.prentLevel > 0 ? state.prentLevel - 1 : 0;
            token.prentLevel = state.prentLevel;
            state.types.pop();
            iOpen--;
            if (iOpen === 0) {
                haveClose = true;
                nextLine += 1;
                break;
            }
        }
        if (openTag.test(lineText) && !itemTag.test(lineText)) {
            items = ListItems(state, items, iLevelT, eLevel, li);
            li = null;
            var match_1 = lineText.match(openTag);
            if (match_1) {
                type = match_1[1].trim() in TBegin ? match_1[1].trim() : null;
                if (!type) {
                    return false;
                }
                if (type === TBegin.itemize) {
                    token = state.push('itemize_list_open', 'ul', 1);
                    // token.map    = [ nextLine + dStart, nextLine+dStart ];
                    state.prentLevel = (state.parentType !== 'itemize' && state.parentType !== 'enumerate') ? 0 : state.prentLevel + 1;
                    state.parentType = 'itemize';
                    state.types.push('itemize');
                }
                else {
                    token = state.push('enumerate_list_open', 'ol', 1);
                    //  token.map    = [ nextLine+dStart, nextLine+dStart ];
                    state.prentLevel = (state.parentType !== 'itemize' && state.parentType !== 'enumerate') ? 0 : state.prentLevel + 1;
                    state.parentType = 'enumerate';
                    state.types.push('enumerate');
                }
                token.itemizeLevel = iLevelT;
                token.enumerateLevel = eLevel;
                token.prentLevel = state.prentLevel;
                iOpen++;
            }
        }
        else {
            content += lineText;
            if (!itemTag.test(lineText)) {
                if (items && items.length > 0) {
                    items[items.length - 1].content += '\n' + lineText;
                    items[items.length - 1].endLine = nextLine;
                }
                else {
                    if (!closeTag.test(lineText)) {
                        console.log('BREAK!!!!');
                        items.push({ content: lineText, endLine: nextLine });
                        //     break
                    }
                }
            }
        }
    }
    if (!haveClose) {
        items = ListItems(state, items, iLevelT, eLevel, li);
        li = null;
        //return false
    }
    state.line = nextLine;
    state.startLine = '';
    state.parentType = oldParentType;
    state.level = state.prentLevel < 0 ? 0 : state.prentLevel;
    if (tokenStart) {
        tokenStart.map[1] = nextLine + dStart;
    }
    return true;
};
//# sourceMappingURL=index.js.map