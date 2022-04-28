"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeListenerContextMenuEvents = exports.addListenerContextMenuEvents = exports.removeResizeListener = exports.addResizeListener = exports.removeKeyUpListener = exports.addKeyUpListener = exports.removeClickListener = exports.addClickListener = exports.removeContextMenuListener = exports.addContextMenuListener = exports.handleResize = exports.handleKeyUp = exports.handleClick = void 0;
var menu_1 = require("./menu");
var helper_1 = require("./menu/helper");
var consts_1 = require("./menu/consts");
var handleContextMenu = function (e) {
    var elMath = helper_1.clickInsideElement(e, 'MathJax');
    if (elMath && elMath.parentElement) {
        e.preventDefault();
        menu_1.toggleMenuOn(elMath.parentElement);
        helper_1.positionMenu(e);
    }
    else {
        menu_1.toggleMenuOff();
    }
};
exports.handleClick = function (e) {
    var elItem = helper_1.clickInsideElement(e, consts_1.classNameMenuItem);
    if (!elItem) {
        menu_1.toggleMenuOff();
    }
};
exports.handleKeyUp = function (e) {
    console.log('handleKeyUp=>e=>', e);
    if (e.key === 'Escape') {
        menu_1.toggleMenuOff();
    }
};
exports.handleResize = function () {
    menu_1.toggleMenuOff();
};
exports.addContextMenuListener = function () {
    document.addEventListener("contextmenu", handleContextMenu);
};
exports.removeContextMenuListener = function () {
    document.removeEventListener("contextmenu", handleContextMenu);
};
exports.addClickListener = function () {
    document.addEventListener("click", exports.handleClick);
};
exports.removeClickListener = function () {
    document.removeEventListener("click", exports.handleClick);
};
exports.addKeyUpListener = function () {
    document.addEventListener("keyup", exports.handleKeyUp);
};
exports.removeKeyUpListener = function () {
    document.removeEventListener("keyup", exports.handleKeyUp);
};
exports.addResizeListener = function () {
    document.addEventListener("resize", exports.handleResize);
};
exports.removeResizeListener = function () {
    document.removeEventListener("resize", exports.handleResize);
};
exports.addListenerContextMenuEvents = function () {
    exports.addContextMenuListener();
    exports.addClickListener();
    exports.addKeyUpListener();
    exports.addResizeListener();
};
exports.removeListenerContextMenuEvents = function () {
    exports.removeContextMenuListener();
    exports.removeClickListener();
    exports.removeKeyUpListener();
    exports.removeResizeListener();
};
//# sourceMappingURL=index.js.map