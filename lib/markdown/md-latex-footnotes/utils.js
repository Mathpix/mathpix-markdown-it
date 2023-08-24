"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rest_mmd_footnotes_list = exports.set_mmd_footnotes_list = exports.getFootnoteItem = exports.addFootnoteToListForFootnotetext = exports.addFootnoteToListForFootnote = void 0;
var tslib_1 = require("tslib");
var mmd_footnotes_list = [];
var addFootnoteToListForFootnote = function (state, token, tokens, envText, numbered, isBlock) {
    if (isBlock === void 0) { isBlock = false; }
    try {
        var footnoteId = state.env.mmd_footnotes.list.length;
        var listNotNumbered = state.env.mmd_footnotes.list.filter(function (item) {
            return (!(item.hasOwnProperty('numbered') && item.numbered !== undefined) && item.type !== "footnotetext");
        });
        var lastNumber = listNotNumbered.length;
        token.meta = {
            id: footnoteId,
            numbered: numbered,
            type: 'footnote',
            lastNumber: lastNumber,
            isBlock: isBlock,
            footnoteId: footnoteId
        };
        state.env.mmd_footnotes.list[footnoteId] = {
            id: footnoteId,
            footnoteId: footnoteId,
            content: envText,
            tokens: tokens,
            numbered: numbered,
            type: 'footnote',
            lastNumber: lastNumber,
            isBlock: isBlock
        };
    }
    catch (err) {
        console.log("[MMD][addFootnoteToListForFootnote] Error=>", err);
    }
};
exports.addFootnoteToListForFootnote = addFootnoteToListForFootnote;
var addFootnoteToListForFootnotetext = function (state, token, tokens, envText, numbered, isBlock) {
    var _a, _b;
    if (isBlock === void 0) { isBlock = false; }
    try {
        var footnoteId = state.env.mmd_footnotes.list.length;
        var listNotNumbered = state.env.mmd_footnotes.list.filter(function (item) {
            return (!(item.hasOwnProperty('numbered') && item.numbered !== undefined) && item.type !== "footnotetext");
        });
        var lastNumber = listNotNumbered.length;
        var listFootnoteMark = ((_b = (_a = state.env.mmd_footnotes) === null || _a === void 0 ? void 0 : _a.list) === null || _b === void 0 ? void 0 : _b.length)
            ? state.env.mmd_footnotes.list.filter(function (item) { return item.type === 'footnotemark'; })
            : [];
        var lastItem = null;
        if (listFootnoteMark === null || listFootnoteMark === void 0 ? void 0 : listFootnoteMark.length) {
            if (numbered) {
                var numberedList = listFootnoteMark.filter(function (item) { return item.numbered === numbered; });
                lastItem = (numberedList === null || numberedList === void 0 ? void 0 : numberedList.length) ? numberedList[numberedList.length - 1] : null;
            }
            else {
                var unNumberedList = listFootnoteMark.filter(function (item) { return item.numbered === undefined; });
                lastItem = (unNumberedList === null || unNumberedList === void 0 ? void 0 : unNumberedList.length) ? unNumberedList[unNumberedList.length - 1] : null;
            }
        }
        token.meta = {
            numbered: numbered,
            isBlock: isBlock
        };
        if (lastItem) {
            if (lastItem.hasContent) {
                state.env.mmd_footnotes.list[lastItem.footnoteId].arrContents.push({
                    content: envText,
                    tokens: tokens,
                    isBlock: isBlock
                });
            }
            else {
                state.env.mmd_footnotes.list[lastItem.footnoteId].id = lastItem.footnoteId;
                state.env.mmd_footnotes.list[lastItem.footnoteId].content = envText;
                state.env.mmd_footnotes.list[lastItem.footnoteId].tokens = tokens;
                state.env.mmd_footnotes.list[lastItem.footnoteId].hasContent = true;
                state.env.mmd_footnotes.list[lastItem.footnoteId].isBlock = isBlock;
                state.env.mmd_footnotes.list[lastItem.footnoteId].arrContents = [{
                        content: envText,
                        tokens: tokens,
                        isBlock: isBlock
                    }];
                token.meta.footnoteId = lastItem.footnoteId;
                token.meta.id = lastItem.footnoteId;
            }
        }
        else {
            state.env.mmd_footnotes.list[footnoteId] = {
                id: footnoteId,
                content: envText,
                tokens: tokens,
                numbered: numbered,
                type: 'footnotetext',
                footnoteId: -1,
                lastNumber: lastNumber,
                isBlock: isBlock
            };
            token.meta.footnoteId = -1;
            token.meta.id = footnoteId;
        }
    }
    catch (err) {
        console.log("[MMD][addFootnoteToListForFootnotetext] Error=>", err);
    }
};
exports.addFootnoteToListForFootnotetext = addFootnoteToListForFootnotetext;
var getFootnoteItem = function (env, meta) {
    var _a, _b;
    var id = meta.hasOwnProperty('footnoteId')
        && meta.footnoteId !== undefined
        && meta.footnoteId !== -1
        ? meta.footnoteId
        : meta.id;
    if ((_b = (_a = env === null || env === void 0 ? void 0 : env.mmd_footnotes) === null || _a === void 0 ? void 0 : _a.list) === null || _b === void 0 ? void 0 : _b.length) {
        return env.mmd_footnotes.list.length > id
            ? env.mmd_footnotes.list[id]
            : null;
    }
    if (mmd_footnotes_list === null || mmd_footnotes_list === void 0 ? void 0 : mmd_footnotes_list.length) {
        return mmd_footnotes_list.length > id
            ? mmd_footnotes_list[id]
            : null;
    }
    return null;
};
exports.getFootnoteItem = getFootnoteItem;
var set_mmd_footnotes_list = function (list) {
    mmd_footnotes_list = tslib_1.__spreadArray([], tslib_1.__read(list), false);
};
exports.set_mmd_footnotes_list = set_mmd_footnotes_list;
var rest_mmd_footnotes_list = function () {
    mmd_footnotes_list = [];
};
exports.rest_mmd_footnotes_list = rest_mmd_footnotes_list;
//# sourceMappingURL=utils.js.map