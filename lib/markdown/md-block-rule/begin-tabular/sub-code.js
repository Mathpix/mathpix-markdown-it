"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sub_math_1 = require("./sub-math");
exports.codeInlineContent = function (res, type) {
    if (type === void 0) { type = 'inline'; }
    res
        .filter(function (item) { return item.type === type; })
        .map(function (item) {
        item.content = sub_math_1.getMathTableContent(item.content, 0);
        return item;
    });
    return res;
};
var getSubCodeBlock = function (str) {
    var match = str.match(/(?:```([^]*)```)/);
    if (match) {
        var id = "f" + (+new Date + (Math.random() * 100000).toFixed()).toString();
        sub_math_1.mathTablePush({ id: id, content: match[0] });
        str = str.slice(0, match.index) + ("{" + id + "}") + str.slice(match.index + match[0].length);
        str = getSubCodeBlock(str);
        return str;
    }
    else {
        return str;
    }
};
exports.getSubCode = function (str) {
    var c = '';
    var str2 = '';
    str = getSubCodeBlock(str);
    for (var ii = 0; ii < str.length; ii++) {
        if (str.charCodeAt(ii) === 0x60) {
            if (c.length === 0) {
                c += str[ii];
            }
            else {
                c += str[ii];
                var id = "f" + (+new Date + (Math.random() * 100000).toFixed()).toString();
                sub_math_1.mathTablePush({ id: id, content: c });
                str2 += "{" + id + "}";
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
//# sourceMappingURL=sub-code.js.map