"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TBegin;
(function (TBegin) {
    TBegin["itemize"] = "itemize";
    TBegin["enumerate"] = "enumerate";
})(TBegin || (TBegin = {}));
;
exports.Lists = function (state, startLine, endLine, silent) {
    var openTag = /\\begin\s{0,}\{(itemize|enumerate)\}/;
    var closeTag = /\\end\s{0,}\{(itemize|enumerate)\}/;
    var itemTag = /\\item/;
    var pos = state.bMarks[startLine] + state.tShift[startLine];
    var max = state.eMarks[startLine];
    var nextLine = startLine; // + 1;
    var token, oldParentType;
    var iOpen = 0;
    var type;
    startLine = state.line;
    var lineText = state.src.slice(pos, max);
    if (lineText.charCodeAt(0) !== 0x5c /* \ */) {
        return false;
    }
    var match = lineText.match(openTag);
    if (!match && (state.parentType !== 'itemize' && state.parentType !== 'enumerate')) {
        return false;
    }
    oldParentType = state.parentType;
    if (match) {
        type = match[1].trim() in TBegin ? match[1].trim() : null;
        if (!type) {
            return false;
        }
        //Unordered lists
        if (type === TBegin.itemize) {
            token = state.push('itemize_list_open', 'ul', 1);
            token.map = [startLine, startLine];
            state.prentLevel = (state.parentType !== 'itemize' && state.parentType !== 'enumerate') ? 0 : state.prentLevel + 1;
            state.parentType = 'itemize';
            state.types = ['itemize'];
        }
        else {
            token = state.push('enumerate_list_open', 'ol', 1);
            token.map = [startLine, startLine];
            state.prentLevel = (state.parentType !== 'itemize' && state.parentType !== 'enumerate') ? 0 : state.prentLevel + 1;
            state.parentType = 'enumerate';
            state.types = ['enumerate'];
        }
        token.prentLevel = state.prentLevel;
        nextLine += 1;
        iOpen++;
    }
    else {
        if (state.parentType === 'itemize' || state.parentType === 'enumerate') {
            console.log('------------ state.parentType==>', state.parentType);
        }
        else {
            return false;
        }
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
            items.push({ content: content.trim(), startLine: nextLine, endLine: nextLine });
        }
        if (closeTag.test(lineText)) {
            if (items && items.length > 0) {
                items.forEach(function (item) {
                    var children = [];
                    state.env.parentType = state.parentType;
                    state.md.inline.parse(item.content, state.md, state.env, children);
                    for (var j = 0; j < children.length; j++) {
                        var child = children[j];
                        token = state.push(child.type, child.tag, 1);
                        token.parentType = state.types[state.types.length - 1];
                        token.map = [item.startLine, item.endLine];
                        token.content = child.content;
                        token.children = child.children;
                        token.level = state.level;
                        token.prentLevel = state.prentLevel + 1;
                    }
                });
            }
            items = [];
            if (state.types[state.types.length - 1] === TBegin.itemize) {
                token = state.push('itemize_list_close', 'ul', -1);
                token.map = [startLine, nextLine];
            }
            else {
                token = state.push('enumerate_list_close', 'ol', -1);
                token.map = [startLine, nextLine];
            }
            token.level -= 1;
            state.level -= 1;
            state.prentLevel = state.prentLevel > 0 ? state.prentLevel - 1 : 0;
            token.prentLevel = state.prentLevel;
            state.types.splice(-1, 1);
            iOpen--;
            if (iOpen === 0) {
                haveClose = true;
                nextLine += 1;
                break;
            }
        }
        if (openTag.test(lineText)) {
            if (items && items.length > 0) {
                if (items && items.length > 0) {
                    state.prentLevel += 1;
                    items.forEach(function (item) {
                        var children = [];
                        state.env.parentType = state.parentType;
                        state.md.inline.parse(item.content, state.md, state.env, children);
                        for (var j = 0; j < children.length; j++) {
                            var child = children[j];
                            token = state.push(child.type, child.tag, 1);
                            token.parentType = state.types[state.types.length - 1];
                            token.map = [item.startLine, item.endLine];
                            token.content = child.content;
                            token.children = child.children;
                            token.prentLevel = state.prentLevel;
                        }
                    });
                }
                items = [];
            }
            var match_1 = lineText.match(openTag);
            if (match_1) {
                type = match_1[1].trim() in TBegin ? match_1[1].trim() : null;
                if (!type) {
                    return false;
                }
                if (type === TBegin.itemize) {
                    token = state.push('itemize_list_open', 'ul', 1);
                    token.map = [startLine, startLine];
                    state.prentLevel = (state.parentType !== 'itemize' && state.parentType !== 'enumerate') ? 0 : state.prentLevel + 1;
                    state.parentType = 'itemize';
                    state.types.push('itemize');
                }
                else {
                    token = state.push('enumerate_list_open', 'ol', 1);
                    token.map = [startLine, startLine];
                    state.prentLevel = (state.parentType !== 'itemize' && state.parentType !== 'enumerate') ? 0 : state.prentLevel + 1;
                    state.parentType = 'enumerate';
                    state.types.push('enumerate');
                }
                token.prentLevel = state.prentLevel;
                iOpen++;
            }
        }
        else {
            content += lineText;
            if (!itemTag.test(lineText) && items && items.length > 0) {
                items[items.length - 1].content += '\n' + lineText;
                items[items.length - 1].endLine = nextLine;
            }
        }
        // this would be a code block normally, but after paragraph
        // it's considered a lazy continuation regardless of what's there
        // if (state.sCount[nextLine] - state.blkIndent > 3) { continue; }
        // quirk for blockquotes, this line should already be checked by that rule
        // if (state.sCount[nextLine] < 0) { continue; }
    }
    if (!haveClose && (state.parentType !== 'itemize' && state.parentType !== 'enumerate')) {
        state.line = nextLine;
        return false;
    }
    state.line = nextLine;
    state.startLine = nextLine;
    state.parentType = oldParentType;
    state.level = state.prentLevel < 0 ? 0 : state.prentLevel;
    return true;
};
//# sourceMappingURL=index.js.map