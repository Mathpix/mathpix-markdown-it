"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeListenerContextMenuEvents = exports.addListenerContextMenuEvents = exports.removeTouchStartListener = exports.addTouchStartListener = exports.removeResizeListener = exports.addResizeListener = exports.removeKeyUpListener = exports.addKeyUpListener = exports.removeClickListener = exports.addClickListener = exports.removeContextMenuListener = exports.addContextMenuListener = exports.handleResize = exports.handleKeyUp = exports.handleClick = exports.handleTouchStart = void 0;
var menu_1 = require("./menu");
var helper_1 = require("./menu/helper");
var consts_1 = require("./menu/consts");
var menu_item_actions_1 = require("./menu/menu-item-actions");
var isCloseByTouchStart = false;
var handleContextMenu = function (e) {
    var elMath = helper_1.clickInsideElement(e, 'MathJax');
    if (elMath && elMath.parentElement) {
        e.preventDefault();
        menu_1.toggleMenuOn(elMath.parentElement, e);
    }
    else {
        menu_1.toggleMenuOff();
    }
};
exports.handleTouchStart = function (e) {
    var elItem = helper_1.clickInsideElement(e, consts_1.classNameMenuItem);
    isCloseByTouchStart = false;
    if (menu_1.isOpenContextMenu() && !elItem) {
        e.stopPropagation();
        menu_1.toggleMenuOff();
        isCloseByTouchStart = true;
    }
};
exports.handleClick = function (e) {
    if ("ontouchstart" in document.documentElement) {
        var elMath = helper_1.clickInsideElement(e, 'MathJax');
        if (elMath) {
            if (isCloseByTouchStart) {
                isCloseByTouchStart = false;
                return;
            }
            e.stopPropagation();
            if (menu_1.isOpenContextMenu()) {
                menu_1.toggleMenuOff();
            }
            else {
                menu_1.toggleMenuOn(elMath.parentElement, e);
            }
            return;
        }
    }
    var elItem = helper_1.clickInsideElement(e, consts_1.classNameMenuItem);
    if (elItem) {
        e.stopPropagation();
        menu_item_actions_1.clearActiveItem();
        menu_item_actions_1.chooseItem(elItem);
    }
    else {
        menu_1.toggleMenuOff();
    }
};
exports.handleKeyUp = function (e) {
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
exports.addTouchStartListener = function () {
    document.addEventListener("touchstart", exports.handleTouchStart);
};
exports.removeTouchStartListener = function () {
    document.removeEventListener("touchstart", exports.handleTouchStart);
};
exports.addListenerContextMenuEvents = function () {
    exports.addContextMenuListener();
    exports.addClickListener();
    exports.addKeyUpListener();
    exports.addResizeListener();
    exports.addTouchStartListener();
};
exports.removeListenerContextMenuEvents = function () {
    exports.removeContextMenuListener();
    exports.removeClickListener();
    exports.removeKeyUpListener();
    exports.removeResizeListener();
    exports.removeTouchStartListener();
};
//# sourceMappingURL=index.js.map