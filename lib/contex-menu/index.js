"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeListenerContextMenuEvents = exports.addListenerContextMenuEvents = exports.removeTouchStartListener = exports.addTouchStartListener = exports.removeResizeListener = exports.addResizeListener = exports.removeKeyUpListener = exports.addKeyUpListener = exports.removeClickListener = exports.addClickListener = exports.removeContextMenuListener = exports.addContextMenuListener = exports.handleResize = exports.handleKeyUp = exports.handleClick = exports.handleTouchStart = void 0;
var menu_1 = require("./menu");
var helper_1 = require("./menu/helper");
var consts_1 = require("./menu/consts");
var menu_item_actions_1 = require("./menu/menu-item-actions");
var isCloseByTouchStart = false;
var handleContextMenu = function (e) {
    var mmdEl = (0, helper_1.clickInsideElement)(e, consts_1.mmdClassesForContextMenu, false);
    if (mmdEl) {
        e.preventDefault();
        (0, menu_1.toggleMenuOn)(mmdEl, e);
    }
    else {
        (0, menu_1.toggleMenuOff)();
    }
};
var handleTouchStart = function (e) {
    var elItem = (0, helper_1.clickInsideElement)(e, [consts_1.classNameMenuItem]);
    isCloseByTouchStart = false;
    if ((0, menu_1.isOpenContextMenu)() && !elItem) {
        e.stopPropagation();
        (0, menu_1.toggleMenuOff)();
        isCloseByTouchStart = true;
    }
};
exports.handleTouchStart = handleTouchStart;
var handleClick = function (e) {
    if ("ontouchstart" in document.documentElement) {
        var mmdEl = (0, helper_1.clickInsideElement)(e, consts_1.mmdClassesForContextMenu, false);
        if (mmdEl) {
            if (isCloseByTouchStart) {
                isCloseByTouchStart = false;
                return;
            }
            e.stopPropagation();
            if ((0, menu_1.isOpenContextMenu)()) {
                (0, menu_1.toggleMenuOff)();
            }
            else {
                (0, menu_1.toggleMenuOn)(mmdEl, e);
            }
            return;
        }
    }
    var elItem = (0, helper_1.clickInsideElement)(e, [consts_1.classNameMenuItem]);
    if (elItem) {
        e.stopPropagation();
        (0, menu_item_actions_1.clearActiveItem)();
        (0, menu_item_actions_1.chooseItem)(elItem);
    }
    else {
        (0, menu_1.toggleMenuOff)();
    }
};
exports.handleClick = handleClick;
var handleKeyUp = function (e) {
    if (e.key === 'Escape') {
        (0, menu_1.toggleMenuOff)();
    }
};
exports.handleKeyUp = handleKeyUp;
var handleResize = function () {
    (0, menu_1.toggleMenuOff)();
};
exports.handleResize = handleResize;
var addContextMenuListener = function () {
    document.addEventListener("contextmenu", handleContextMenu);
};
exports.addContextMenuListener = addContextMenuListener;
var removeContextMenuListener = function () {
    document.removeEventListener("contextmenu", handleContextMenu);
};
exports.removeContextMenuListener = removeContextMenuListener;
var addClickListener = function () {
    document.addEventListener("click", exports.handleClick);
};
exports.addClickListener = addClickListener;
var removeClickListener = function () {
    document.removeEventListener("click", exports.handleClick);
};
exports.removeClickListener = removeClickListener;
var addKeyUpListener = function () {
    document.addEventListener("keyup", exports.handleKeyUp);
};
exports.addKeyUpListener = addKeyUpListener;
var removeKeyUpListener = function () {
    document.removeEventListener("keyup", exports.handleKeyUp);
};
exports.removeKeyUpListener = removeKeyUpListener;
var addResizeListener = function () {
    document.addEventListener("resize", exports.handleResize);
};
exports.addResizeListener = addResizeListener;
var removeResizeListener = function () {
    document.removeEventListener("resize", exports.handleResize);
};
exports.removeResizeListener = removeResizeListener;
var addTouchStartListener = function () {
    document.addEventListener("touchstart", exports.handleTouchStart);
};
exports.addTouchStartListener = addTouchStartListener;
var removeTouchStartListener = function () {
    document.removeEventListener("touchstart", exports.handleTouchStart);
};
exports.removeTouchStartListener = removeTouchStartListener;
var addListenerContextMenuEvents = function () {
    (0, exports.addContextMenuListener)();
    (0, exports.addClickListener)();
    (0, exports.addKeyUpListener)();
    (0, exports.addResizeListener)();
    (0, exports.addTouchStartListener)();
};
exports.addListenerContextMenuEvents = addListenerContextMenuEvents;
var removeListenerContextMenuEvents = function () {
    (0, exports.removeContextMenuListener)();
    (0, exports.removeClickListener)();
    (0, exports.removeKeyUpListener)();
    (0, exports.removeResizeListener)();
    (0, exports.removeTouchStartListener)();
};
exports.removeListenerContextMenuEvents = removeListenerContextMenuEvents;
//# sourceMappingURL=index.js.map