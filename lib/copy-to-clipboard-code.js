"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exposeClipboardToWindow = void 0;
var copy_to_clipboard_1 = require("./copy-to-clipboard");
var exposeClipboardToWindow = function () {
    if (typeof window !== 'undefined') {
        window.addListenerCopyToClipboardEvents = copy_to_clipboard_1.addListenerCopyToClipboardEvents;
        window.removeListenerCopyToClipboardEvents = copy_to_clipboard_1.removeListenerCopyToClipboardEvents;
    }
};
exports.exposeClipboardToWindow = exposeClipboardToWindow;
(0, exports.exposeClipboardToWindow)();
//# sourceMappingURL=copy-to-clipboard-code.js.map