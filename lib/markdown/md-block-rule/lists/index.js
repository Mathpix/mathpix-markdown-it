"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lists = exports.ReRenderListsItem = exports.bItemTag = exports.TBegin = void 0;
var re_level_1 = require("./re-level");
var TBegin;
(function (TBegin) {
    TBegin["itemize"] = "itemize";
    TBegin["enumerate"] = "enumerate";
})(TBegin = exports.TBegin || (exports.TBegin = {}));
;
var openTag = /\\begin\s{0,}\{(itemize|enumerate)\}/;
exports.bItemTag = /^(?:item\s{0,}\[([^\]]*)\]|item)/;
var closeTag = /\\end\s{0,}\{(itemize|enumerate)\}/;
var setTokenListItemOpenBlock = function (state, startLine, endLine, marker, li, iLevel, eLevel) {
    var token;
    token = state.push('latex_list_item_open', 'li', 1);
    token.parentType = state.types && state.types.length > 0 ? state.types[state.types.length - 1] : '';
    if (marker) {
        token.marker = marker;
        var chMarker = [];
        state.md.inline.parse(marker, state.md, state.env, chMarker);
        token.markerTokens = chMarker;
    }
    if (li && li.value) {
        token.startValue = li.value;
        token.attrSet('value', li.value.toString());
        li = null;
    }
    token.parentType = state.types && state.types.length > 0 ? state.types[state.types.length - 1] : '';
    token.parentStart = state.startLine;
    token.map = [startLine, endLine];
    token.prentLevel = state.prentLevel;
    token.itemizeLevel = iLevel;
    token.enumerateLevel = eLevel;
};
var SetTokensBlockParse = function (state, content, startLine, endLine) {
    var token;
    var children = [];
    state.md.block.parse(content, state.md, state.env, children);
    for (var j = 0; j < children.length; j++) {
        var child = children[j];
        token = state.push(child.type, child.tag, child.nesting);
        token.attrs = child.attrs;
        if (startLine && endLine) {
            token.map = [startLine, endLine];
        }
        token.content = child.content;
        token.children = child.children;
    }
};
var ListItemsBlock = function (state, items) {
    if (items && items.length > 0) {
        if (items && items.length > 0) {
            items.forEach(function (item) {
                SetTokensBlockParse(state, item.content.trim(), item.startLine, item.endLine + 1);
            });
        }
    }
};
var ListItems = function (state, items, iLevel, eLevel, li, iOpen) {
    var token;
    var blockStartTag = /\\begin{(center|left|right|table|figure|tabular)}/;
    if (items && items.length > 0) {
        if (items && items.length > 0) {
            items.forEach(function (item) {
                var children = [];
                state.env.parentType = state.parentType;
                state.env.isBlock = true;
                item.content = item.content.trim();
                if (blockStartTag.test(item.content) || (item.content.indexOf('`') > -1) //&& item.content.charCodeAt(0) === 0x5c /* \ */
                ) {
                    var match = item.content.slice(1).match(exports.bItemTag);
                    if (match) {
                        setTokenListItemOpenBlock(state, item.startLine, item.endLine + 1, match[1], li, iLevel, eLevel);
                        if (li && li.value) {
                            li = null;
                        }
                        SetTokensBlockParse(state, item.content.slice(match.index + match[0].length + 1).trim());
                        token = state.push('latex_list_item_close', 'li', -1);
                        return;
                    }
                }
                state.md.inline.parse(item.content.trim(), state.md, state.env, children);
                for (var j = 0; j < children.length; j++) {
                    var child = children[j];
                    if (child.type === "setcounter") {
                        li = { value: child.content };
                        continue;
                    }
                    token = state.push(child.type, child.tag, 1);
                    token.attrs = child.attrs;
                    if (child.type === "item_inline" && li && li.value) {
                        token.startValue = li.value;
                        token.attrSet('value', li.value.toString());
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
                    token.itemizeLevel = iLevel;
                    // token.itemizeLevelTokens = iLevelTokens;
                    token.enumerateLevel = eLevel;
                }
                state.env.isBlock = false;
            });
        }
    }
    return iOpen;
};
var setTokenOpenList = function (state, startLine, endLine, type, iLevel, eLevel) {
    var token;
    if (type === TBegin.itemize) {
        token = state.push('itemize_list_open', 'ul', 1);
        state.prentLevel = (state.parentType !== 'itemize' && state.parentType !== 'enumerate') ? 0 : state.prentLevel + 1;
        state.parentType = 'itemize';
        if (state.types && state.types.length > 0) {
            state.types.push('itemize');
        }
        else {
            state.types = ['itemize'];
        }
    }
    else {
        token = state.push('enumerate_list_open', 'ol', 1);
        state.prentLevel = (state.parentType !== 'itemize' && state.parentType !== 'enumerate') ? 0 : state.prentLevel + 1;
        state.parentType = 'enumerate';
        if (state.types && state.types.length > 0) {
            state.types.push('enumerate');
        }
        else {
            state.types = ['enumerate'];
        }
    }
    token.itemizeLevel = iLevel;
    token.enumerateLevel = eLevel;
    token.prentLevel = state.prentLevel;
    if (startLine > -1 && endLine > -1) {
        state.startLine = startLine;
        token.map = [startLine, endLine];
    }
    return token;
};
var setTokenCloseList = function (state, startLine, endLine) {
    var token;
    if (state.types && state.types.length > 0 && state.types[state.types.length - 1] === TBegin.itemize) {
        token = state.push('itemize_list_close', 'ul', -1);
        token.map = [startLine, endLine];
    }
    else {
        token = state.push('enumerate_list_close', 'ol', -1);
        token.map = [startLine, endLine];
    }
    token.level -= 1;
    state.level -= 1;
    state.prentLevel = state.prentLevel > 0 ? state.prentLevel - 1 : 0;
    token.prentLevel = state.prentLevel;
    state.types.pop();
};
var ListOpen = function (state, startLine, lineText, iLevel, eLevel) {
    var token, tokenStart = null;
    var iOpen = 0;
    var li = null;
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
                if (child.type === "setcounter") {
                    li = { value: child.content };
                    continue;
                }
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
                    if (li && li.value) {
                        token.startValue = li.value;
                        token.attrSet('value', li.value.toString());
                        li = null;
                    }
                    token.prentLevel = state.prentLevel + 1;
                }
                else {
                    token.prentLevel = state.prentLevel;
                }
            }
            state.env.isBlock = false;
        }
    }
    return { iOpen: iOpen, tokenStart: tokenStart, li: li };
};
var ItemsListPush = function (items, content, startLine, endLine) {
    //const itemTag: RegExp = /\\item/;
    var index = content.indexOf('\\item');
    if (index > 0) {
        if (content.slice(0, index).indexOf('`') > -1 && content.slice(index).indexOf('`') > -1) {
            if (items.length > 0) {
                var last = items.length - 1;
                items[last].content += '\n' + content;
                items[last].endLine += 1;
            }
            else {
                items.push({ content: content, startLine: startLine, endLine: endLine });
            }
            return items;
        }
        if (items.length > 0) {
            var last = items.length - 1;
            items[last].content += '\n' + content.slice(0, index);
            items[last].endLine += 1;
        }
        else {
            items = ItemsListPush(items, content.slice(0, index), startLine, endLine);
        }
        items = ItemsListPush(items, content.slice(index), startLine, endLine);
    }
    else {
        items.push({ content: content, startLine: startLine, endLine: endLine });
    }
    return items;
};
var ItemsAddToPrev = function (items, lineText, nextLine) {
    if (items && items.length > 0) {
        items[items.length - 1].content += '\n' + lineText;
        items[items.length - 1].endLine = nextLine;
    }
    else {
        if (!closeTag.test(lineText)) {
            items = ItemsListPush(items, lineText, nextLine, nextLine);
            //     break
        }
    }
    return items;
};
exports.ReRenderListsItem = function (state, startLine, endLine, silent) {
    var pos = state.bMarks[startLine] + state.tShift[startLine];
    var max = state.eMarks[startLine];
    var nextLine = startLine + 1;
    var lineText = state.src.slice(pos, max);
    var content = lineText;
    if (lineText.charCodeAt(0) !== 0x5c /* \ */) {
        return false;
    }
    var match = lineText.slice(1).match(exports.bItemTag);
    if (!match) {
        return false;
    }
    var eLevel = re_level_1.GetEnumerateLevel();
    var iLevelT = re_level_1.GetItemizeLevelTokensByState(state);
    for (; nextLine < endLine; nextLine++) {
        pos = state.bMarks[nextLine] + state.tShift[nextLine];
        max = state.eMarks[nextLine];
        lineText = state.src.slice(pos, max);
        content += '\n' + lineText;
    }
    match = content.slice(1).match(exports.bItemTag);
    if (match) {
        setTokenListItemOpenBlock(state, startLine, nextLine + 1, match[1], null, iLevelT, eLevel);
        SetTokensBlockParse(state, content.slice(match.index + match[0].length + 1).trim());
        state.push('latex_list_item_close', 'li', -1);
    }
    state.line = nextLine;
    return true;
};
exports.Lists = function (state, startLine, endLine, silent) {
    var openTag = /\\begin\s{0,}\{(itemize|enumerate)\}/;
    var itemTag = /\\item/;
    var setcounterTag = /^(?:\\setcounter\s{0,}\{([^}]*)\}\s{0,}\{([^}]*)\})/;
    var pos = state.bMarks[startLine] + state.tShift[startLine];
    var max = state.eMarks[startLine];
    var nextLine = startLine; // + 1;
    var dStart = state.md.options.renderElement && state.md.options.renderElement.startLine
        ? Number(state.md.options.renderElement.startLine)
        : 0;
    var oldParentType;
    var type;
    // let li = null;
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
    var _a = data.iOpen, iOpen = _a === void 0 ? 0 : _a, _b = data.tokenStart, tokenStart = _b === void 0 ? null : _b, _c = data.li, li = _c === void 0 ? null : _c;
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
    var items = [];
    var haveClose = false;
    for (; nextLine < endLine; nextLine++) {
        pos = state.bMarks[nextLine] + state.tShift[nextLine];
        max = state.eMarks[nextLine];
        lineText = state.src.slice(pos, max);
        if (setcounterTag.test(lineText)) {
            match = lineText.match(setcounterTag);
            if (match && state.md.options && state.md.options.forLatex) {
                var token = state.push("setcounter", "", 0);
                token.latex = match[0].trim();
            }
            if (match && match[2]) {
                var sE = match.index + match[0].length < lineText.length
                    ? lineText.slice(match.index + match[0].length)
                    : '';
                sE = sE.trim();
                li = { value: match[2] };
                if (sE.length > 0) {
                    items = ItemsAddToPrev(items, sE, nextLine);
                }
                continue;
            }
        }
        if (closeTag.test(lineText)) {
            var match_1 = lineText.match(closeTag);
            if (match_1) {
                type = match_1[1].trim() in TBegin ? match_1[1].trim() : null;
                if (!type) {
                    return false;
                }
                var sB = match_1.index > 0 ? lineText.slice(0, match_1.index) : '';
                var sE = match_1.index + match_1[0].length < lineText.length
                    ? lineText.slice(match_1.index + match_1[0].length)
                    : '';
                sB = sB.trim();
                sE = sE.trim();
                if (sB.indexOf('`') > -1 && sE.indexOf('`') > -1) {
                    items = ItemsListPush(items, lineText, nextLine, nextLine);
                    continue;
                }
                if (sB.length > 0) {
                    items = ItemsAddToPrev(items, sB, nextLine);
                }
                iOpen = ListItems(state, items, iLevelT, eLevel, li, iOpen);
                items = [];
                li = null;
                setTokenCloseList(state, startLine + dStart, nextLine + dStart);
                if (sE.length > 0) {
                    items = ItemsAddToPrev(items, sE, nextLine);
                }
                iOpen--;
                if (iOpen <= 0) {
                    haveClose = true;
                    nextLine += 1;
                    break;
                }
            }
            continue;
        }
        if (openTag.test(lineText)) {
            var match_2 = lineText.match(openTag);
            if (match_2) {
                type = match_2[1].trim() in TBegin ? match_2[1].trim() : null;
                if (!type) {
                    return false;
                }
                var sB = match_2.index > 0 ? lineText.slice(0, match_2.index) : '';
                var sE = match_2.index + match_2[0].length < lineText.length
                    ? lineText.slice(match_2.index + match_2[0].length)
                    : '';
                sB = sB.trim();
                sE = sE.trim();
                if (sB.indexOf('`') > -1 && sE.indexOf('`') > -1) {
                    items = ItemsListPush(items, lineText, nextLine, nextLine);
                    continue;
                }
                if (sB.length > 0) {
                    items = ItemsAddToPrev(items, sB, nextLine);
                }
                iOpen = ListItems(state, items, iLevelT, eLevel, li, iOpen);
                items = [];
                li = null;
                setTokenOpenList(state, -1, -1, type, iLevelT, eLevel);
                if (sE.length > 0) {
                    items = ItemsAddToPrev(items, sE, nextLine);
                }
                iOpen++;
            }
        }
        else {
            if (itemTag.test(lineText)) {
                items = ItemsListPush(items, lineText.trim(), nextLine + dStart, nextLine + dStart);
            }
            else {
                items = ItemsAddToPrev(items, lineText, nextLine);
            }
        }
    }
    if (!haveClose) {
        console.log('NOT CLOSE TAG.');
        ListItemsBlock(state, items);
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