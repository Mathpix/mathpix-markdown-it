"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTextWidthByTokens = void 0;
var text_dimentions_1 = require("../../helpers/text-dimentions");
var fonSize = 16;
var getTextWidthByTokens = function (tokens, fontType, widthEx, heightEx) {
    var _a;
    if (fontType === void 0) { fontType = 'normal'; }
    if (widthEx === void 0) { widthEx = 0; }
    if (heightEx === void 0) { heightEx = 0; }
    try {
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            if (token.type === 'text') {
                var widthTextEx = text_dimentions_1.fontMetrics.getWidthInEx(token.content, fonSize, fontType);
                if (widthTextEx) {
                    widthEx += widthTextEx;
                }
                continue;
            }
            if (token.type === 'textbf' || token.type === 'textit') {
                if ((_a = token.children) === null || _a === void 0 ? void 0 : _a.length) {
                    var data = (0, exports.getTextWidthByTokens)(token.children, 'bold', widthEx, heightEx);
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
        console.log("[ERROR]=>[getTextWidthByTokens]=>err=>", err);
        return {
            widthEx: 0,
            heightEx: 0
        };
    }
};
exports.getTextWidthByTokens = getTextWidthByTokens;
//# sourceMappingURL=textWidthByTokens.js.map