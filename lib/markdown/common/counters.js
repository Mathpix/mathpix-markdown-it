"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSizeCounter = exports.resetSizeCounter = exports.size = void 0;
exports.size = {
    heightEx: 0,
    widthEx: 0
};
var resetSizeCounter = function () {
    exports.size = {
        heightEx: 0,
        widthEx: 0
    };
};
exports.resetSizeCounter = resetSizeCounter;
var setSizeCounter = function (widthEx, heightEx) {
    exports.size.widthEx += widthEx;
    exports.size.heightEx += heightEx;
};
exports.setSizeCounter = setSizeCounter;
//# sourceMappingURL=counters.js.map