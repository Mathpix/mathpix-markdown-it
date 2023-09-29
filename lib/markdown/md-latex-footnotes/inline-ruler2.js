"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grab_footnote_ref = void 0;
var tslib_1 = require("tslib");
var grab_footnote_ref = function (state) {
    var _a, _b, _c, _d, _e, _f, _g;
    if (!((_a = state.tokens) === null || _a === void 0 ? void 0 : _a.length)) {
        return;
    }
    for (var k = 0; k < ((_b = state.tokens) === null || _b === void 0 ? void 0 : _b.length); k++) {
        var token = state.tokens[k];
        if (k > 0 && state.tokens[k - 1]) {
            if (token.type === 'footnotetext' && state.tokens[k - 1].type === 'softbreak') {
                token.hidden = true;
                if (!state.tokens[k - 1].hidden) {
                    state.tokens[k - 1].hidden = true;
                    state.tokens[k - 1].showSpace = true;
                }
            }
            if (token.type === 'softbreak' && (state.tokens[k - 1].type === 'footnotetext')) {
                token.hidden = true;
                token.showSpace = true;
                if (!state.tokens[k - 1].hidden) {
                    state.tokens[k - 1].hidden = true;
                }
            }
            if ((token.type === "mmd_footnote_ref" && ((_c = token.meta) === null || _c === void 0 ? void 0 : _c.type) === 'footnote')
                && state.tokens[k - 1].type === 'softbreak') {
                if (!state.tokens[k - 1].hidden) {
                    state.tokens[k - 1].hidden = true;
                    state.tokens[k - 1].showSpace = true;
                }
            }
            if (token.type === 'softbreak'
                && (state.tokens[k - 1].type === "mmd_footnote_ref" && ((_d = state.tokens[k - 1].meta) === null || _d === void 0 ? void 0 : _d.type) === 'footnote')) {
                token.hidden = true;
                token.showSpace = true;
            }
        }
        if (token.type === "footnote_ref") {
            var footnote = ((_f = (_e = state.env.footnotes) === null || _e === void 0 ? void 0 : _e.list) === null || _f === void 0 ? void 0 : _f.length) > token.meta.id
                ? (_g = state.env.footnotes) === null || _g === void 0 ? void 0 : _g.list[token.meta.id] : null;
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