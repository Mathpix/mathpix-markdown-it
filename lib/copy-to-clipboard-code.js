"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportMethods = void 0;
var copy_to_clipboard_1 = require("./copy-to-clipboard");
var exportMethods = function () {
    window.addListenerCopyToClipdoardEvents = copy_to_clipboard_1.addListenerCopyToClipdoardEvents;
    window.removeListenerCopyToClipdoardEvents = copy_to_clipboard_1.removeListenerCopyToClipdoardEvents;
};
exports.exportMethods = exportMethods;
(0, exports.exportMethods)();
//# sourceMappingURL=copy-to-clipboard-code.js.map