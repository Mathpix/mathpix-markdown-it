"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.footnote_tail = void 0;
var createFootnotesTokens = function (state, refTokens, meta, idx, itemLabel, itemCount, itemTokens, itemContent) {
    var token = new state.Token('footnote_open', '', 1);
    token.meta = meta;
    state.tokens.push(token);
    var tokens = [];
    var lastParagraph;
    if (itemTokens) {
        tokens = [];
        token = new state.Token('paragraph_open', 'p', 1);
        token.block = true;
        tokens.push(token);
        token = new state.Token('inline', '', 0);
        token.children = itemTokens;
        token.content = itemContent;
        tokens.push(token);
        token = new state.Token('paragraph_close', 'p', -1);
        token.block = true;
        tokens.push(token);
    }
    else if (itemLabel) {
        tokens = refTokens[':' + itemLabel];
    }
    if (tokens)
        state.tokens = state.tokens.concat(tokens);
    if (state.tokens[state.tokens.length - 1].type === 'paragraph_close') {
        lastParagraph = state.tokens.pop();
    }
    else {
        lastParagraph = null;
    }
    var t = itemCount > 0 ? itemCount : 1;
    for (var j = 0; j < t; j++) {
        token = new state.Token('footnote_anchor', '', 0);
        token.meta = { id: idx, subId: j, label: itemLabel };
        state.tokens.push(token);
    }
    if (lastParagraph) {
        state.tokens.push(lastParagraph);
    }
    token = new state.Token('footnote_close', '', -1);
    state.tokens.push(token);
};
// Glue footnote tokens to end of token stream
var footnote_tail = function (state) {
    var _a, _b;
    var i, l, list, current, currentLabel, insideRef = false, refTokens = {};
    if (!state.env.footnotes) {
        return;
    }
    if ((_b = (_a = state.env.footnotes) === null || _a === void 0 ? void 0 : _a.list) === null || _b === void 0 ? void 0 : _b.length) {
        var lastNumber = 0;
        for (var i_1 = 0; i_1 < state.env.footnotes.list.length; i_1++) {
            var item = state.env.footnotes.list[i_1];
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
    var footnote_block_open = state.tokens.filter(function (token) {
        return token.type === 'footnote_block_open';
    });
    if (footnote_block_open === null || footnote_block_open === void 0 ? void 0 : footnote_block_open.length) {
        var footnote_open = state.tokens.filter(function (token) {
            return token.type === 'footnote_open';
        });
        for (var i_2 = 0; i_2 < footnote_open.length; i_2++) {
            footnote_open[i_2].meta.numbered =
                state.env.footnotes.list[footnote_open[i_2].meta.id].numbered;
        }
        return;
    }
    state.tokens = state.tokens.filter(function (tok) {
        if (tok.type === 'footnote_reference_open') {
            insideRef = true;
            current = [];
            currentLabel = tok.meta.label;
            return false;
        }
        if (tok.type === 'footnote_reference_close') {
            insideRef = false;
            // prepend ':' to avoid conflict with Object.prototype members
            refTokens[':' + currentLabel] = current;
            if (!state.env.footnotes.refsTokens) {
                state.env.footnotes.refsTokens = {};
            }
            state.env.footnotes.refsTokens[':' + currentLabel] = current;
            return false;
        }
        if (insideRef) {
            current.push(tok);
        }
        return !insideRef;
    });
    if (!state.env.footnotes.list) {
        return;
    }
    list = state.env.footnotes.list;
    var token = new state.Token('footnote_block_open', '', 1);
    state.tokens.push(token);
    var notIncrementNumber = false;
    var incrementNumber = false;
    var counter_footnote = 0;
    var createFootnoteOpen = true;
    for (i = 0, l = list.length; i < l; i++) {
        createFootnoteOpen = true;
        if (list[i].hasOwnProperty('type')) {
            switch (list[i].type) {
                case 'footnotetext':
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
        if (!createFootnoteOpen) {
            continue;
        }
        var meta = {
            id: i,
            label: list[i].label,
            numbered: list[i].numbered,
            type: list[i].type,
            counter_footnote: counter_footnote
        };
        if (list[i].numbered !== undefined || list[i].type === "footnotetext") {
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
            if (list[i].type === "footnotetext") {
                meta.numbered = counter_footnote;
            }
        }
        if (list[i].hasOwnProperty('arrContents') && list[i].arrContents.length) {
            for (var j = 0; j < list[i].arrContents.length; j++) {
                createFootnotesTokens(state, refTokens, meta, i, list[i].label, list[i].count, list[i].arrContents[j].tokens, list[i].arrContents[j].content);
            }
        }
        else {
            createFootnotesTokens(state, refTokens, meta, i, list[i].label, list[i].count, list[i].tokens, list[i].content);
        }
    }
    token = new state.Token('footnote_block_close', '', -1);
    state.tokens.push(token);
};
exports.footnote_tail = footnote_tail;
//# sourceMappingURL=core-rule.js.map