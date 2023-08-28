"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grab_footnote_ref = void 0;
var tslib_1 = require("tslib");
var grab_footnote_ref = function (state) {
    var _a, _b, _c, _d, _e;
    if (!((_a = state.tokens) === null || _a === void 0 ? void 0 : _a.length)) {
        return;
    }
    for (var k = 0; k < ((_b = state.tokens) === null || _b === void 0 ? void 0 : _b.length); k++) {
        var token = state.tokens[k];
        if (token.type === "footnote_ref") {
            var footnote = ((_d = (_c = state.env.footnotes) === null || _c === void 0 ? void 0 : _c.list) === null || _d === void 0 ? void 0 : _d.length) > token.meta.id
                ? (_e = state.env.footnotes) === null || _e === void 0 ? void 0 : _e.list[token.meta.id] : null;
            if (footnote) {
                if (footnote.hasOwnProperty('footnoteId')) {
                    var footnoteId = footnote.footnoteId;
                    state.env.mmd_footnotes.list[footnoteId].count = footnote.count;
                    token.meta.footnoteId = footnoteId;
                }
                else {
                    var footnoteId = state.env.mmd_footnotes.list.length;
                    state.env.mmd_footnotes.list[footnoteId] = tslib_1.__assign({}, footnote);
                    state.env.mmd_footnotes.list[footnoteId].footnoteId = footnoteId;
                    footnote.footnoteId = footnoteId;
                    token.meta.footnoteId = footnoteId;
                }
            }
            token.type = "mmd_footnote_ref";
        }
    }
};
exports.grab_footnote_ref = grab_footnote_ref;
//# sourceMappingURL=inline-ruler2.js.map