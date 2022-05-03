"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleMenuOff = exports.toggleMenuOn = exports.isOpenContextMenu = exports.dropContextMenu = exports.createContextMenu = void 0;
var menu_items_1 = require("./menu-items");
var menu_item_actions_1 = require("./menu-item-actions");
var consts_1 = require("./consts");
var helper_1 = require("./helper");
var handleKeyDownMenuItem = function (e) {
    switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
            menu_item_actions_1.chooseNextItem();
            break;
        case 'ArrowUp':
        case 'ArrowLeft':
            menu_item_actions_1.choosePreviousItem();
            break;
    }
};
var addEventListenerToMenu = function (elMenu) {
    elMenu.addEventListener('keydown', handleKeyDownMenuItem);
};
var removeEventListenerFromMenu = function () {
    var elMenu = document.querySelector("." + consts_1.classNameMenu);
    if (!elMenu) {
        return;
    }
    elMenu.removeEventListener('keydown', handleKeyDownMenuItem);
};
var findContextMenuElement = function () {
    return document.querySelector("." + consts_1.classNameContextMenu);
};
exports.createContextMenu = function (el, e) {
    try {
        var items = menu_items_1.mathMenuItems(el);
        if (!items || !items.length) {
            return;
        }
        var elCtxtMenu = document.createElement('div');
        elCtxtMenu.setAttribute('class', consts_1.classNameContextMenu);
        elCtxtMenu.setAttribute('style', 'position: absolute; left: 0px; top: 0px; z-index: 200; width: 100%; height: 100%; border: 0px; padding: 0px; margin: 0px;');
        var elPosition = document.createElement('div');
        elPosition.setAttribute('style', 'position: fixed; left: 0px; top: 0px; z-index: 200; width: 100%; height: 100%; border: 0px; padding: 0px; margin: 0px;');
        elCtxtMenu.appendChild(elPosition);
        var elMenu = document.createElement('div');
        elMenu.setAttribute('class', consts_1.classNameMenu);
        elMenu.setAttribute('role', 'menu');
        elMenu.setAttribute('aria-label', 'Copy to Clipboard');
        elMenu.setAttribute('tabindex', '0');
        for (var i = 0; i < items.length; i++) {
            elMenu.appendChild(items[i]);
        }
        var resPos = helper_1.getPositionMenuByClick(e, items.length);
        if (resPos.className === 'mmd-menu-sm') {
            elMenu.style.left = resPos.left;
            elMenu.style.bottom = "0";
            elMenu.style.position = 'fixed';
            elMenu.style.maxWidth = resPos.maxWidth;
            elMenu.classList.add(resPos.className);
            elPosition.classList.add(consts_1.classNameContextMenu + "-overlay");
        }
        else {
            elMenu.style.left = resPos.left;
            elMenu.style.top = resPos.top;
        }
        addEventListenerToMenu(elMenu);
        elCtxtMenu.appendChild(elMenu);
        document.body.appendChild(elCtxtMenu);
        elMenu.focus();
    }
    catch (err) {
        console.error(err);
    }
};
exports.dropContextMenu = function (elContextMenu) {
    try {
        if (!elContextMenu) {
            elContextMenu = findContextMenuElement();
        }
        if (elContextMenu) {
            removeEventListenerFromMenu();
            document.body.removeChild(elContextMenu);
        }
    }
    catch (err) {
        console.error(err);
    }
};
exports.isOpenContextMenu = function () {
    var elContextMenu = findContextMenuElement();
    return Boolean(elContextMenu);
};
exports.toggleMenuOn = function (el, e) {
    var elContextMenu = findContextMenuElement();
    if (!elContextMenu) {
        exports.createContextMenu(el, e);
    }
    else {
        exports.dropContextMenu(elContextMenu);
        exports.createContextMenu(el, e);
    }
};
exports.toggleMenuOff = function () {
    exports.dropContextMenu();
};
//# sourceMappingURL=index.js.map