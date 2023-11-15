"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeListenerCopyToClipdoardEvents = exports.addListenerCopyToClipdoardEvents = exports.blurred = exports.focused = exports.clicked = exports.clickInsideCopyElement = void 0;
var tslib_1 = require("tslib");
var clipboard_1 = require("./clipboard");
var CLIPBOARD_COPY_TIMER_DURATION = 2000;
var showSVG = function (svg) {
    svg.style.display = 'inline-block';
};
var hideSVG = function (svg) {
    svg.style.display = 'none';
};
var clickInsideCopyElement = function (e) {
    var el = e.target;
    if (el.tagName === "CLIPBOARD-COPY") {
        return el;
    }
    else {
        var elParent = null;
        while (el = el.parentNode) {
            if (el.tagName === "CLIPBOARD-COPY") {
                elParent = el;
            }
        }
        return elParent;
    }
};
exports.clickInsideCopyElement = clickInsideCopyElement;
function copy(button) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        function trigger() {
            button.dispatchEvent(new CustomEvent('clipboard-copy', { bubbles: true }));
        }
        var text;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    text = button.getAttribute('value');
                    if (button.getAttribute('aria-disabled') === 'true') {
                        return [2 /*return*/];
                    }
                    if (!text) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, clipboard_1.copyText)(text)];
                case 1:
                    _a.sent();
                    trigger();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
var clicked = function (event) {
    var button = (0, exports.clickInsideCopyElement)(event);
    if (button instanceof HTMLElement) {
        copy(button);
    }
};
exports.clicked = clicked;
// Toggle a copy button.
var showCopy = function (button) {
    var _a = tslib_1.__read(button.querySelectorAll('.mmd-clipboard-icon'), 2), copyIcon = _a[0], checkIcon = _a[1];
    if (!copyIcon || !checkIcon)
        return;
    button.setAttribute('aria-label', 'Copy');
    // button.classList.remove('mmd-tooltipped');
    // button.classList.remove('mmd-tooltipped-w');
    showSVG(copyIcon);
    hideSVG(checkIcon);
};
// Toggle a copy button.
var showCheck = function (button) {
    var _a = tslib_1.__read(button.querySelectorAll('.mmd-clipboard-icon'), 2), copyIcon = _a[0], checkIcon = _a[1];
    if (!copyIcon || !checkIcon)
        return;
    button.setAttribute('aria-label', 'Copied');
    // button.classList.add('mmd-tooltipped');
    // button.classList.add('mmd-tooltipped-w');
    hideSVG(copyIcon);
    showSVG(checkIcon);
};
var handleClipboardCopy = function (event) {
    var el = event.target;
    showCheck(el);
    setTimeout(function () {
        el.setAttribute('aria-label', '');
        showCopy(el);
    }, CLIPBOARD_COPY_TIMER_DURATION);
};
var focused = function (event) {
    // console.log("[MMD]=>focused=>event=>", event);
    // console.log("[MMD]=>focused=>event.currentTarget=>", event.currentTarget);
};
exports.focused = focused;
var blurred = function () {
    // console.log("[MMD]=>blurred=>event=>", event);
    // console.log("[MMD]=>blurred=>event.currentTarget=>", event.currentTarget);
};
exports.blurred = blurred;
var addListenerCopyToClipdoardEvents = function () {
    document.addEventListener('click', exports.clicked);
    document.addEventListener('focus', exports.focused);
    document.addEventListener('blur', exports.blurred);
    document.addEventListener('clipboard-copy', handleClipboardCopy);
};
exports.addListenerCopyToClipdoardEvents = addListenerCopyToClipdoardEvents;
var removeListenerCopyToClipdoardEvents = function () {
    document.removeEventListener('click', exports.clicked);
    document.removeEventListener('focus', exports.focused);
    document.removeEventListener('blur', exports.blurred);
    document.removeEventListener('clipboard-copy', handleClipboardCopy);
};
exports.removeListenerCopyToClipdoardEvents = removeListenerCopyToClipdoardEvents;
//# sourceMappingURL=index.js.map