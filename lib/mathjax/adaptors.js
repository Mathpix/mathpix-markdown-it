"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDomNode = exports.getAdaptor = void 0;
var browserAdaptor_1 = require("mathjax-full/js/adaptors/browserAdaptor");
var html_1 = require("mathjax-full/js/handlers/html");
var liteAdaptor_js_1 = require("mathjax-full/js/adaptors/liteAdaptor.js");
exports.getAdaptor = function () {
    var adaptor;
    try {
        document;
        if (document.getElementsByTagName('div').length > 0) {
            adaptor = browserAdaptor_1.browserAdaptor();
            console.log('^^^^^^^^^^^^^^^^^^ 1 adaptor=>', adaptor);
            html_1.RegisterHTMLHandler(adaptor);
            return adaptor;
            // domNode = document;
        }
        else {
            // adaptor = liteAdaptor();
            adaptor = browserAdaptor_1.browserAdaptor();
            console.log('^^^^^^^^^^^^^^^^^^ 2 adaptor=>', adaptor);
            // domNode = '<html></html>';
            html_1.RegisterHTMLHandler(adaptor);
            return adaptor;
        }
    }
    catch (e) {
        adaptor = liteAdaptor_js_1.liteAdaptor();
        debugger;
        console.log('^^^^^^^^^^^^^^^^^^ 3 adaptor=>', adaptor);
        // domNode = '<html></html>';
        html_1.RegisterHTMLHandler(adaptor);
        return adaptor;
    }
    // RegisterHTMLHandler(adaptor);
};
exports.getDomNode = function () {
    try {
        document;
        if (document.getElementsByTagName('div').length > 0) {
            return document;
        }
        else {
            return '<html></html>';
        }
    }
    catch (e) {
        return '<html></html>';
    }
};
//# sourceMappingURL=adaptors.js.map