"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDocument = void 0;
var Window = require('window');
exports.initDocument = function () {
    try {
        document;
    }
    catch (e) {
        var window_1 = new Window();
        global.window = window_1;
        global.document = window_1.document;
    }
};
//# sourceMappingURL=index.js.map