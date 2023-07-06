"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.choosePreviousItem = exports.chooseNextItem = exports.chooseItem = exports.clearActiveItem = exports.findIndexActiveItem = exports.getMenuItemActive = exports.getMenuItems = void 0;
var copy = require("copy-to-clipboard");
var consts_1 = require("./consts");
var parse_mmd_element_1 = require("../../helpers/parse-mmd-element");
var getMenuItems = function () {
    return document.querySelectorAll(".".concat(consts_1.classNameMenuItem));
};
exports.getMenuItems = getMenuItems;
var getMenuItemActive = function () {
    return document.querySelector(".".concat(consts_1.classNameMenuItem, ".active"));
};
exports.getMenuItemActive = getMenuItemActive;
var findIndexActiveItem = function (elem, items) {
    if (!elem || !items || !items.length) {
        return -1;
    }
    for (var i = 0; i < items.length; i++) {
        if (items[i] === elem) {
            return i;
        }
    }
    return -1;
};
exports.findIndexActiveItem = findIndexActiveItem;
var clearActiveItem = function () {
    var items = document.querySelectorAll(".".concat(consts_1.classNameMenuItem, ".active"));
    if (!items || !items.length) {
        return;
    }
    for (var i = 0; i < items.length; i++) {
        items[i].classList.remove('active');
    }
};
exports.clearActiveItem = clearActiveItem;
var chooseItem = function (el) {
    try {
        if (!el) {
            return;
        }
        var elSource = el.querySelector(".".concat(consts_1.classNameMenuItemSource));
        if (elSource) {
            el.focus();
            var source = elSource.innerHTML;
            var dataType = elSource.getAttribute('data-type');
            if (dataType === consts_1.eMathType.mathmlword) {
                source = (0, parse_mmd_element_1.formatSourceHtmlWord)(source);
            }
            else {
                source = dataType === consts_1.eMathType.mathml
                    ? source
                    : (0, parse_mmd_element_1.formatSourceHtml)(source, (dataType === consts_1.eMathType.tsv || dataType === consts_1.eMathType.csv));
            }
            copy(source, {
                format: 'text/plain',
                debug: true
            });
        }
        if (!el.classList.contains('active')) {
            el.classList.add('active');
        }
    }
    catch (err) {
        console.error(err);
    }
};
exports.chooseItem = chooseItem;
var chooseNextItem = function () {
    var items = (0, exports.getMenuItems)();
    if (!items || !items.length) {
        return;
    }
    var elActive = (0, exports.getMenuItemActive)();
    var index = (0, exports.findIndexActiveItem)(elActive, items);
    var len = items && items.length ? items.length - 1 : 0;
    if (elActive) {
        index++;
        elActive.classList.remove('active');
        var next = items[index];
        if (typeof next !== undefined && index <= len) {
            elActive = next;
        }
        else {
            elActive = items[0];
        }
        (0, exports.chooseItem)(elActive);
    }
    else {
        (0, exports.chooseItem)(items[0]);
    }
};
exports.chooseNextItem = chooseNextItem;
var choosePreviousItem = function () {
    var items = (0, exports.getMenuItems)();
    if (!items || !items.length) {
        return;
    }
    var elActive = (0, exports.getMenuItemActive)();
    var index = (0, exports.findIndexActiveItem)(elActive, items);
    var len = items && items.length ? items.length - 1 : 0;
    if (elActive) {
        index--;
        elActive.classList.remove('active');
        var next = items[index];
        if (typeof next !== undefined && index >= 0) {
            elActive = next;
        }
        else {
            elActive = items[len];
        }
        (0, exports.chooseItem)(elActive);
    }
    else {
        (0, exports.chooseItem)(items[len]);
    }
};
exports.choosePreviousItem = choosePreviousItem;
//# sourceMappingURL=menu-item-actions.js.map