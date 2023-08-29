"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDocument = void 0;
var domino = require("domino");
var initDocument = function () {
    try {
        document;
    }
    catch (e) {
        var domimpl = domino.createDOMImplementation();
        global.document = domimpl.createHTMLDocument();
    }
};
exports.initDocument = initDocument;
//# sourceMappingURL=index.js.map