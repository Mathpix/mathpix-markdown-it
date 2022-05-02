"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clickInsideElement = exports.positionMenu = exports.getContextMenuElement = exports.getMenuElement = exports.getPosition = void 0;
var consts_1 = require("./consts");
exports.getPosition = function (e) {
    var posX = 0;
    var posY = 0;
    if (!e) {
        e = window.event;
    }
    if (e.pageX || e.pageY) {
        posX = e.pageX;
        posY = e.pageY;
    }
    else if (e.clientX || e.clientY) {
        posX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    return {
        x: posX,
        y: posY
    };
};
exports.getMenuElement = function () {
    return document.querySelector("." + consts_1.classNameMenu);
};
exports.getContextMenuElement = function () {
    return document.querySelector("." + consts_1.classNameContextMenu);
};
exports.positionMenu = function (e) {
    var elMenu = exports.getMenuElement();
    if (!elMenu) {
        return;
    }
    var clickCoords = exports.getPosition(e);
    var clickCoordsX = clickCoords.x;
    var clickCoordsY = clickCoords.y;
    var menuWidth = elMenu.offsetWidth + 4;
    var menuHeight = elMenu.offsetHeight + 4;
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    if (windowWidth <= consts_1.SMALL_SCREEN_BREAKPOINT) {
        elMenu.style.left = 0;
        elMenu.style.bottom = 0;
        elMenu.style.maxWidth = '100vw';
        elMenu.classList.add('mmd-menu-sm');
        var elContextMenu = exports.getContextMenuElement();
        if (elContextMenu && !elContextMenu.classList.contains(consts_1.classNameContextMenu + "-overlay")) {
            elContextMenu.classList.add(consts_1.classNameContextMenu + "-overlay");
        }
        return;
    }
    if ((windowWidth - clickCoordsX) < menuWidth) {
        elMenu.style.left = windowWidth - menuWidth + "px";
    }
    else {
        elMenu.style.left = clickCoordsX + "px";
    }
    if ((windowHeight - clickCoordsY) < menuHeight) {
        elMenu.style.top = windowHeight - menuHeight + "px";
    }
    else {
        elMenu.style.top = clickCoordsY + "px";
    }
};
exports.clickInsideElement = function (e, className) {
    var el = e.target;
    if (el.classList.contains(className)) {
        return el;
    }
    else {
        while (el = el.parentNode) {
            if (el.classList && el.classList.contains(className)) {
                return el;
            }
        }
    }
    return null;
};
//# sourceMappingURL=helper.js.map