"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findFaIcons = exports.findSquaredIcon = exports.findIcon = void 0;
var fa_icons_1 = require("./fa-icons");
var unicode_icons_1 = require("./unicode-icons");
var squared_icons_1 = require("./squared-icons");
var emoji_icons_1 = require("./emoji-icons");
var findEmoji = function (iconName, isMath) {
    if (isMath === void 0) { isMath = false; }
    return emoji_icons_1.emojiIcons.find(function (item) { return item.name === iconName && (!isMath || !item.textOnly); });
};
var findIcon = function (iconName, isMath) {
    if (isMath === void 0) { isMath = false; }
    if (iconName.indexOf('emoji') !== -1) {
        iconName = iconName.replace(/emoji/g, "");
        iconName = iconName ? iconName.trim() : '';
        return iconName ? findEmoji(iconName, isMath) : null;
    }
    var foundIcon = unicode_icons_1.unicodeIcons.find(function (item) { return item.alias === iconName || item.name === iconName; });
    if (!foundIcon) {
        foundIcon = !isMath ? (0, exports.findFaIcons)(iconName) : null;
        if (!foundIcon) {
            foundIcon = findEmoji(iconName, isMath);
        }
    }
    return foundIcon;
};
exports.findIcon = findIcon;
var findSquaredIcon = function (iconName) {
    return squared_icons_1.squaredIcons.find(function (item) { return item.alias === iconName || item.name === iconName; });
};
exports.findSquaredIcon = findSquaredIcon;
var findFaIcons = function (iconName) {
    return fa_icons_1.faIcons.find(function (item) { return item.alias === iconName || item.name === iconName; });
};
exports.findFaIcons = findFaIcons;
//# sourceMappingURL=index.js.map