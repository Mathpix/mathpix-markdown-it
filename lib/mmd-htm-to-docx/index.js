"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var html_to_docx_1 = require("html-to-docx");
var htmlToDocx = function (htmlString) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var fileBuffer;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, html_to_docx_1.default(htmlString, null, { table: { row: { cantSplit: true } } })];
            case 1:
                fileBuffer = _a.sent();
                return [2 /*return*/, fileBuffer];
        }
    });
}); };
exports.default = htmlToDocx;
//# sourceMappingURL=index.js.map