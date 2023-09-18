"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mmd_footnote_tail = void 0;
var utils_1 = require("./utils");
var createFootnotesTokens = function (state, stateTokens, refTokens, meta, idx, itemLabel, itemCount, itemTokens, itemContent, isBlock) {
    var _a, _b, _c, _d, _e, _f;
    if (isBlock === void 0) { isBlock = false; }
    var token = new state.Token('mmd_footnote_open', '', 1);
    token.meta = meta;
    var footnote = ((_b = (_a = state.env.mmd_footnotes) === null || _a === void 0 ? void 0 : _a.list) === null || _b === void 0 ? void 0 : _b.length) > token.meta.id
        ? (_c = state.env.mmd_footnotes) === null || _c === void 0 ? void 0 : _c.list[token.meta.id] : null;
    token.meta.nonumbers = footnote.nonumbers;
    stateTokens.push(token);
    var tokens = [];
    var lastParagraph;
    if (isBlock) {
        tokens = itemTokens;
    }
    else {
        if (itemTokens) {
            tokens = [];
            token = new state.Token('paragraph_open', 'div', 1);
            token.block = true;
            tokens.push(token);
            token = new state.Token('inline', '', 0);
            token.children = itemTokens;
            token.content = itemContent;
            tokens.push(token);
            token = new state.Token('paragraph_close', 'div', -1);
            token.block = true;
            tokens.push(token);
        }
        else if (itemLabel) {
            tokens = refTokens[':' + itemLabel];
        }
    }
    if (tokens) {
        stateTokens = stateTokens.concat(tokens);
    }
    if (stateTokens[stateTokens.length - 1].type === 'paragraph_close') {
        lastParagraph = stateTokens.pop();
    }
    else {
        lastParagraph = null;
    }
    var t = itemCount > 0 ? itemCount : 1;
    for (var j = 0; j < t; j++) {
        token = new state.Token('mmd_footnote_anchor', '', 0);
        token.meta = { id: idx, subId: j, label: itemLabel };
        var footnote_1 = ((_e = (_d = state.env.mmd_footnotes) === null || _d === void 0 ? void 0 : _d.list) === null || _e === void 0 ? void 0 : _e.length) > token.meta.id
            ? (_f = state.env.mmd_footnotes) === null || _f === void 0 ? void 0 : _f.list[token.meta.id] : null;
        if (footnote_1) {
            token.meta.footnoteId = footnote_1.footnoteId;
            token.meta.type = footnote_1.type;
        }
        stateTokens.push(token);
    }
    if (lastParagraph) {
        stateTokens.push(lastParagraph);
    }
    token = new state.Token('mmd_footnote_close', '', -1);
    stateTokens.push(token);
    return stateTokens;
};
// Glue footnote tokens to end of token stream
var mmd_footnote_tail = function (state) {
    var _a, _b;
    try {
        var i = void 0, l = void 0, list = void 0, current_1, currentLabel_1, insideRef_1 = false, refTokens_1 = {};
        if (!state.env.mmd_footnotes) {
            return;
        }
        if ((_b = (_a = state.env.mmd_footnotes) === null || _a === void 0 ? void 0 : _a.list) === null || _b === void 0 ? void 0 : _b.length) {
            var lastNumber = 0;
            for (var i_1 = 0; i_1 < state.env.mmd_footnotes.list.length; i_1++) {
                var item = state.env.mmd_footnotes.list[i_1];
                if (item.hasOwnProperty('lastNumber')) {
                    lastNumber = item.numbered
                        ? item.lastNumber
                        : item.lastNumber + 1;
                    continue;
                }
                item.lastNumber = lastNumber;
                lastNumber += 1;
            }
        }
        state.tokens = state.tokens.filter(function (tok) {
            var _a, _b;
            if (tok.type === 'footnote_reference_open') {
                insideRef_1 = true;
                current_1 = [];
                currentLabel_1 = tok.meta.label;
                return Boolean((_a = state.md.options) === null || _a === void 0 ? void 0 : _a.forMD);
            }
            if (tok.type === 'footnote_reference_close') {
                insideRef_1 = false;
                // prepend ':' to avoid conflict with Object.prototype members
                refTokens_1[':' + currentLabel_1] = current_1;
                if (!state.env.mmd_footnotes.refsTokens) {
                    state.env.mmd_footnotes.refsTokens = {};
                }
                state.env.mmd_footnotes.refsTokens[':' + currentLabel_1] = current_1;
                return Boolean((_b = state.md.options) === null || _b === void 0 ? void 0 : _b.forMD);
            }
            if (insideRef_1) {
                current_1.push(tok);
            }
            if (state.md.options.forMD)
                return true;
            return !insideRef_1;
        });
        if (!state.env.mmd_footnotes.list) {
            return;
        }
        list = state.env.mmd_footnotes.list;
        var notIncrementNumber = false;
        var incrementNumber = false;
        var counter_footnote = 0;
        var createFootnoteOpen = true;
        var stateTokens = [];
        for (i = 0, l = list.length; i < l; i++) {
            createFootnoteOpen = true;
            if (list[i].hasOwnProperty('type')) {
                switch (list[i].type) {
                    case 'footnotetext':
                    case 'blfootnotetext':
                        break;
                    case 'footnotemark':
                        if (list[i].numbered === undefined) {
                            counter_footnote++;
                        }
                        if (!list[i].hasContent) {
                            if (list[i].numbered === undefined) {
                                incrementNumber = true;
                            }
                            /** If a footnotemark does not have a description, then it is not included in the list of footnotes. */
                            createFootnoteOpen = false;
                        }
                        break;
                    case 'footnote':
                        if (list[i].numbered === undefined) {
                            counter_footnote++;
                        }
                        if (state.md.options.forLatex) {
                            createFootnoteOpen = false;
                        }
                        break;
                }
            }
            else {
                counter_footnote++;
            }
            list[i].counter_footnote = counter_footnote;
            if (!createFootnoteOpen || state.md.options.forMD) {
                continue;
            }
            var meta = {
                id: i,
                label: list[i].label,
                numbered: list[i].numbered,
                type: list[i].type,
                counter_footnote: counter_footnote
            };
            if (list[i].numbered !== undefined || list[i].type === "footnotetext" || list[i].type === "blfootnotetext") {
                notIncrementNumber = true;
            }
            else {
                if (notIncrementNumber) {
                    meta.numbered = counter_footnote;
                    notIncrementNumber = false;
                }
            }
            if (list[i].numbered === undefined) {
                if (list[i].type === "footnote" || list[i].type === "footnotemark") {
                    if (incrementNumber) {
                        meta.numbered = counter_footnote;
                        incrementNumber = false;
                    }
                }
                if (list[i].type === "footnotetext" || list[i].type === "blfootnotetext") {
                    meta.numbered = counter_footnote;
                }
            }
            if (list[i].hasOwnProperty('arrContents') && list[i].arrContents.length) {
                for (var j = 0; j < list[i].arrContents.length; j++) {
                    stateTokens = createFootnotesTokens(state, stateTokens, refTokens_1, meta, i, list[i].label, list[i].count, list[i].arrContents[j].tokens, list[i].arrContents[j].content, list[i].isBlock);
                }
            }
            else {
                stateTokens = createFootnotesTokens(state, stateTokens, refTokens_1, meta, i, list[i].label, list[i].count, list[i].tokens, list[i].content, list[i].isBlock);
            }
        }
        if (stateTokens === null || stateTokens === void 0 ? void 0 : stateTokens.length) {
            var token = new state.Token('mmd_footnote_block_open', '', 1);
            state.tokens.push(token);
            var isNotMarkerList = false;
            for (var i_2 = 0; i_2 < stateTokens.length; i_2++) {
                var item = stateTokens[i_2];
                if (item.type === "mmd_footnote_open") {
                    if (i_2 === 0) {
                        token = new state.Token('mmd_footnote_list_open', '', 1);
                        token.meta = item.meta;
                        state.tokens.push(token);
                        if (item.meta.nonumbers) {
                            isNotMarkerList = true;
                        }
                    }
                    else {
                        if (item.meta.nonumbers) {
                            if (!isNotMarkerList) {
                                isNotMarkerList = true;
                                token = new state.Token('mmd_footnote_list_close', '', -1);
                                state.tokens.push(token);
                                token = new state.Token('mmd_footnote_list_open', '', 1);
                                token.meta = item.meta;
                                state.tokens.push(token);
                            }
                        }
                        else {
                            if (isNotMarkerList) {
                                isNotMarkerList = false;
                                token = new state.Token('mmd_footnote_list_close', '', -1);
                                state.tokens.push(token);
                                token = new state.Token('mmd_footnote_list_open', '', 1);
                                token.meta = item.meta;
                                state.tokens.push(token);
                            }
                        }
                    }
                }
                state.tokens.push(item);
            }
            token = new state.Token('mmd_footnote_list_close', '', -1);
            state.tokens.push(token);
            token = new state.Token('mmd_footnote_block_close', '', -1);
            state.tokens.push(token);
        }
        state.env.footnotes = null;
        (0, utils_1.set_mmd_footnotes_list)(state.env.mmd_footnotes.list);
    }
    catch (err) {
        console.log("[MMD][footnote_tail] Error=>", err);
        return;
    }
};
exports.mmd_footnote_tail = mmd_footnote_tail;
//# sourceMappingURL=core-rule.js.map