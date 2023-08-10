"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.footnote_tail = void 0;
// Glue footnote tokens to end of token stream
var footnote_tail = function (state) {
    var _a, _b;
    var i, l, j, t, lastParagraph, list, token, tokens, current, currentLabel, insideRef = false, refTokens = {};
    if (!state.env.footnotes) {
        return;
    }
    if ((_b = (_a = state.env.footnotes) === null || _a === void 0 ? void 0 : _a.list) === null || _b === void 0 ? void 0 : _b.length) {
        var lastNumber_1 = 0;
        for (var i_1 = 0; i_1 < state.env.footnotes.list.length; i_1++) {
            var item = state.env.footnotes.list[i_1];
            if (item.hasOwnProperty('lastNumber')) {
                lastNumber_1 = item.numbered
                    ? item.lastNumber
                    : item.lastNumber + 1;
                continue;
            }
            item.lastNumber = lastNumber_1;
            lastNumber_1 += 1;
        }
        // /** sort by last number */
        // state.env.footnotes.list.sort((a,b) => {
        //   return a.lastNumber > b.lastNumber ? 1 : -1
        // })
    }
    // if ()
    /** Filter */
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
    token = new state.Token('footnote_block_open', '', 1);
    state.tokens.push(token);
    var notIncrementNumber = false;
    var lastNumber = 0;
    for (i = 0, l = list.length; i < l; i++) {
        if (list[i].type === "footnotemark" && !list[i].hasContent) {
            if (list[i].numbered === undefined) {
                lastNumber += 1;
            }
            continue;
        }
        token = new state.Token('footnote_open', '', 1);
        token.meta = {
            id: i,
            label: list[i].label,
            numbered: list[i].numbered,
        };
        if (!notIncrementNumber && list[i].numbered === undefined && list[i].type !== "footnotetext") {
            // lastNumber = i + 1;
            lastNumber += 1;
        }
        if (list[i].numbered !== undefined || list[i].type === "footnotetext") {
            notIncrementNumber = true;
        }
        else {
            if (notIncrementNumber) {
                token.meta.numbered = lastNumber + 1;
                notIncrementNumber = false;
            }
        }
        if (list[i].type === "footnotetext" && list[i].numbered === undefined) {
            token.meta.numbered = list[i].lastNumber;
            lastNumber = list[i].lastNumber;
        }
        state.tokens.push(token);
        if (list[i].tokens) {
            tokens = [];
            token = new state.Token('paragraph_open', 'p', 1);
            token.block = true;
            tokens.push(token);
            token = new state.Token('inline', '', 0);
            token.children = list[i].tokens;
            token.content = list[i].content;
            tokens.push(token);
            token = new state.Token('paragraph_close', 'p', -1);
            token.block = true;
            tokens.push(token);
        }
        else if (list[i].label) {
            tokens = refTokens[':' + list[i].label];
        }
        if (tokens)
            state.tokens = state.tokens.concat(tokens);
        if (state.tokens[state.tokens.length - 1].type === 'paragraph_close') {
            lastParagraph = state.tokens.pop();
        }
        else {
            lastParagraph = null;
        }
        t = list[i].count > 0 ? list[i].count : 1;
        for (j = 0; j < t; j++) {
            token = new state.Token('footnote_anchor', '', 0);
            token.meta = { id: i, subId: j, label: list[i].label };
            state.tokens.push(token);
        }
        if (lastParagraph) {
            state.tokens.push(lastParagraph);
        }
        token = new state.Token('footnote_close', '', -1);
        state.tokens.push(token);
    }
    token = new state.Token('footnote_block_close', '', -1);
    state.tokens.push(token);
};
exports.footnote_tail = footnote_tail;
//# sourceMappingURL=core-rule.js.map