"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clickInsideElement = exports.findClassInElement = exports.getPositionMenuByClick = exports.positionMenu = exports.getContextMenuElement = exports.getMenuElement = exports.getPosition = void 0;
var consts_1 = require("./consts");
var getPosition = function (e) {
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
exports.getPosition = getPosition;
var getMenuElement = function () {
    return document.querySelector(".".concat(consts_1.classNameMenu));
};
exports.getMenuElement = getMenuElement;
var getContextMenuElement = function () {
    return document.querySelector(".".concat(consts_1.classNameContextMenu));
};
exports.getContextMenuElement = getContextMenuElement;
var positionMenu = function (e) {
    var elMenu = (0, exports.getMenuElement)();
    if (!elMenu) {
        return;
    }
    var clickCoords = (0, exports.getPosition)(e);
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
        var elContextMenu = (0, exports.getContextMenuElement)();
        if (elContextMenu && !elContextMenu.classList.contains("".concat(consts_1.classNameContextMenu, "-overlay"))) {
            elContextMenu.classList.add("".concat(consts_1.classNameContextMenu, "-overlay"));
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
exports.positionMenu = positionMenu;
var getPositionMenuByClick = function (e, itemsLength) {
    var clickCoords = (0, exports.getPosition)(e);
    var clickCoordsX = clickCoords.x;
    var clickCoordsY = clickCoords.y;
    var menuHeight = consts_1.heightMenuItem * itemsLength + consts_1.paddingMenu + 2;
    var menuWidth = consts_1.maxWidthMenu + 4;
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var scrollTop = document.body.scrollTop + document.documentElement.scrollTop;
    var res = {};
    if (windowWidth <= consts_1.SMALL_SCREEN_BREAKPOINT) {
        menuHeight += consts_1.paddingMenuBottomSmall;
        res.left = "0px";
        res.top = windowHeight + scrollTop - menuHeight + "px";
        res.maxWidth = '100vw';
        res.className = 'mmd-menu-sm';
        return res;
    }
    menuHeight += consts_1.paddingMenu;
    if ((windowWidth - clickCoordsX) < menuWidth) {
        res.left = windowWidth - menuWidth + "px";
    }
    else {
        res.left = clickCoordsX + "px";
    }
    if ((windowHeight + scrollTop - clickCoordsY) < menuHeight) {
        res.top = windowHeight + scrollTop - menuHeight + "px";
    }
    else {
        res.top = clickCoordsY + "px";
    }
    return res;
};
exports.getPositionMenuByClick = getPositionMenuByClick;
var findClassInElement = function (el, classNamesList) {
    var className = '';
    if (el === null || el === void 0 ? void 0 : el.classList) {
        for (var i = 0; i < classNamesList.length; i++) {
            if (el.classList.contains(classNamesList[i])) {
                className = classNamesList[i];
                break;
            }
        }
    }
    return className;
};
exports.findClassInElement = findClassInElement;
var clickInsideElement = function (e, classNamesList, isMenuItem) {
    if (isMenuItem === void 0) { isMenuItem = true; }
    var el = e.target;
    var className = isMenuItem ? (0, exports.findClassInElement)(el, classNamesList) : '';
    if (className) {
        return el;
    }
    else {
        var elParent = null;
        while (el = el.parentNode) {
            className = (0, exports.findClassInElement)(el, classNamesList);
            if (className) {
                elParent = className === 'MathJax' ? el.parentNode : el;
            }
        }
        return elParent;
    }
};
exports.clickInsideElement = clickInsideElement;
//# sourceMappingURL=helper.js.map