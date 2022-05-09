"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spanToClass = void 0;
var consts_1 = require("../markdown/common/consts");
exports.spanToClass = function (math) {
    try {
        if (!consts_1.reSpanG.test(math)) {
            return math;
        }
        return math.replace(consts_1.reSpanG, function (subStr) {
            var match = subStr.match(consts_1.reSpan);
            if (match && match.length > 3) {
                var className = match[2] ? match[2].trim() : '';
                var content = match[4] ? match[4].trim() : '';
                return "\\class{" + className + "}{" + content + "}";
            }
            return subStr;
        });
    }
    catch (err) {
        console.error(err);
        return math;
    }
};
//# sourceMappingURL=replace-span-to-class.js.map