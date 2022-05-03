"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mathMenuItems = void 0;
var consts_1 = require("./consts");
var menu_item_1 = require("./menu-item");
var parse_mmd_element_1 = require("../../helpers/parse-mmd-element");
exports.mathMenuItems = function (el) {
    var items = [];
    try {
        var res = parse_mmd_element_1.parseMmdElement(el);
        if (!res || !res.length) {
            return items;
        }
        var _loop_1 = function (i) {
            var resItem = res.find(function (item) { return item.type === consts_1.mathExportTypes[i]; });
            if (!resItem) {
                return "continue";
            }
            var item = menu_item_1.createMathMenuItem(resItem.type, resItem.value);
            if (item) {
                items.push(item);
            }
        };
        for (var i = 0; i < consts_1.mathExportTypes.length; i++) {
            _loop_1(i);
        }
        return items;
    }
    catch (err) {
        console.error(err);
        return items;
    }
};
//# sourceMappingURL=menu-items.js.map