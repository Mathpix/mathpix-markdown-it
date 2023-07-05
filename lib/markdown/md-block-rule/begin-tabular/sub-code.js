"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubCode = exports.codeInlineContent = void 0;
var sub_math_1 = require("./sub-math");
var codeInlineContent = function (res, type) {
    if (type === void 0) { type = 'inline'; }
    res
        .map(function (item) {
        if (item.type === type) {
            var code = (0, sub_math_1.getMathTableContent)(item.content, 0);
            item.content = code ? code : item.content;
        }
        return item;
    });
    return res;
};
exports.codeInlineContent = codeInlineContent;
var getSubCodeBlock = function (str) {
    var match = str.match(/(?:```)/);
    if (match) {
        var end = str.indexOf('```', match.index + 3);
        if (end > -1) {
            var id = "f".concat((+new Date + (Math.random() * 100000).toFixed()).toString());
            (0, sub_math_1.mathTablePush)({ id: id, content: str.slice(match.index, end + 3) });
            str = str.slice(0, match.index) + "{".concat(id, "}") + str.slice(end + 3);
            str = getSubCodeBlock(str);
        }
        return str;
    }
    else {
        return str;
    }
};
var getSubCode = function (str) {
    var c = '';
    var str2 = '';
    str = getSubCodeBlock(str);
    for (var ii = 0; ii < str.length; ii++) {
        if (str.charCodeAt(ii) === 0x60) {
            if (str.charCodeAt(ii + 1) === 0x60) {
                ii += 1;
            }
            if (c.length === 0) {
                c += str[ii];
            }
            else {
                c += str[ii];
                var id = "f".concat((+new Date + (Math.random() * 100000).toFixed()).toString());
                (0, sub_math_1.mathTablePush)({ id: id, content: c });
                str2 += "{".concat(id, "}");
                c = '';
            }
        }
        if (c && str.charCodeAt(ii) !== 0x60) {
            c += str[ii];
        }
        if (c.length === 0 && str.charCodeAt(ii) !== 0x60) {
            str2 += str[ii];
        }
    }
    str2 += c;
    return str2;
};
exports.getSubCode = getSubCode;
//# sourceMappingURL=sub-code.js.map