"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTextWidthByTokens = void 0;
var text_dimentions_1 = require("./text-dimentions");
var getTextWidthByTokens = function (tokens, widthEx, heightEx, fontType) {
    var _a;
    if (widthEx === void 0) { widthEx = 0; }
    if (heightEx === void 0) { heightEx = 0; }
    if (fontType === void 0) { fontType = text_dimentions_1.eFontType.normal; }
    try {
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            if (token.type === 'text') {
                var widthTextEx = text_dimentions_1.fontMetrics.getWidthInEx(token.content, fontType);
                if (widthTextEx) {
                    widthEx += widthTextEx;
                }
                continue;
            }
            if (token.type === 'textbf' || token.type === 'textit') {
                if ((_a = token.children) === null || _a === void 0 ? void 0 : _a.length) {
                    var data = (0, exports.getTextWidthByTokens)(token.children, widthEx, heightEx, text_dimentions_1.eFontType.bold);
                    if (data) {
                        widthEx = data.widthEx;
                        heightEx = data.heightEx;
                    }
                }
                continue;
            }
            if (token.widthEx) {
                widthEx += token.widthEx;
            }
            if (token.heightEx && heightEx < token.heightEx) {
                heightEx = token.heightEx;
            }
        }
        return {
            widthEx: widthEx,
            heightEx: heightEx
        };
    }
    catch (err) {
        console.error("[ERROR]=>[getTextWidthByTokens]=>err=>", err);
        return {
            widthEx: 0,
            heightEx: 0
        };
    }
};
exports.getTextWidthByTokens = getTextWidthByTokens;
//# sourceMappingURL=textWidthByTokens.js.map