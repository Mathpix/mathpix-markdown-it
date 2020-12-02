"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDocument = void 0;
var domino = require("domino");
exports.initDocument = function () {
    try {
        document;
    }
    catch (e) {
        var domimpl = domino.createDOMImplementation();
        global.document = domimpl.createHTMLDocument();
    }
};
//# sourceMappingURL=index.js.map