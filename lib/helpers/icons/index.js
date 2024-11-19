"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findIcon = exports.findFaIconsByTag = exports.findFaIconsByName = exports.findSquaredIconByTag = exports.findSquaredIconByName = exports.findSquaredIcon = void 0;
var tslib_1 = require("tslib");
var fa_icons_1 = require("./fa-icons");
var unicode_icons_1 = require("./unicode-icons");
var squared_icons_1 = require("./squared-icons");
var emoji_icons_1 = require("./emoji-icons");
var css_colors_1 = require("./css-colors");
var findEmoji = function (iconName, isMath) {
    if (isMath === void 0) { isMath = false; }
    return emoji_icons_1.emojiIcons.find(function (item) { return item.name === iconName && (!isMath || !item.textOnly); });
};
var findSquaredIcon = function (iconName) {
    return squared_icons_1.squaredIcons.find(function (item) { return item.alias === iconName || item.name === iconName; });
};
exports.findSquaredIcon = findSquaredIcon;
var findSquaredIconByName = function (iconName) {
    return squared_icons_1.squaredIcons.find(function (item) { return item.alias === iconName || item.name === iconName; });
};
exports.findSquaredIconByName = findSquaredIconByName;
var findSquaredIconByTag = function (tag) {
    return squared_icons_1.squaredIcons.find(function (item) { var _a; return (_a = item.tags) === null || _a === void 0 ? void 0 : _a.includes(tag); });
};
exports.findSquaredIconByTag = findSquaredIconByTag;
var findFaIconsByName = function (iconName) {
    return fa_icons_1.faIcons.find(function (item) { return item.alias === iconName || item.name === iconName; });
};
exports.findFaIconsByName = findFaIconsByName;
var findFaIconsByTag = function (tag) {
    return fa_icons_1.faIcons.find(function (item) { var _a; return (_a = item.tags) === null || _a === void 0 ? void 0 : _a.includes(tag); });
};
exports.findFaIconsByTag = findFaIconsByTag;
var findIconByName = function (iconName, isMath) {
    if (isMath === void 0) { isMath = false; }
    var foundIcon = unicode_icons_1.unicodeIcons.find(function (item) { return item.alias === iconName || item.name === iconName; });
    if (!foundIcon) {
        foundIcon = !isMath ? (0, exports.findFaIconsByName)(iconName) : null;
        if (!foundIcon) {
            foundIcon = findEmoji(iconName, isMath);
        }
    }
    return foundIcon;
};
var findIconByTag = function (tag, isMath) {
    if (isMath === void 0) { isMath = false; }
    var foundIcon = unicode_icons_1.unicodeIcons.find(function (item) { return item.tags.includes(tag); });
    if (!foundIcon) {
        foundIcon = !isMath ? (0, exports.findFaIconsByTag)(tag) : null;
    }
    return foundIcon;
};
var parseIconNameAndColor = function (iconName) {
    var reColor = /\bcolor\s*=\s*(#[0-9a-fA-F]{3,8}|\w+\([^)]*\)|[a-zA-Z]+)/;
    // Attempt to match color pattern
    var match = iconName.match(reColor);
    if (match) {
        // Color is present, split icon name and color
        var parsedName_1 = iconName.slice(0, match.index).trim();
        var parsedColor_1 = match[1] || '';
        return { parsedName: parsedName_1, parsedColor: parsedColor_1 };
    }
    // If no color found, split the name and the rest of the string
    var parts = iconName.split(/\s+/);
    var parsedName = parts[0]; // The first part is the icon name
    var parsedColor = parts.length > 1 ? parts.slice(1).join(' ').trim() : '';
    return { parsedName: parsedName, parsedColor: parsedColor };
};
var findIcon = function (iconName, isMath) {
    var _a;
    if (isMath === void 0) { isMath = false; }
    if (iconName.includes('emoji')) {
        var cleanIconName = (_a = iconName.replace(/emoji/g, "")) === null || _a === void 0 ? void 0 : _a.trim();
        return {
            icon: cleanIconName ? findEmoji(cleanIconName, isMath) : null,
            name: cleanIconName,
            color: '',
            isSquared: false
        };
    }
    // Let's analyze the icon and color
    var _b = parseIconNameAndColor(iconName), parsedName = _b.parsedName, parsedColor = _b.parsedColor;
    var iconNameParsed = parsedName || iconName;
    var color = parsedColor || '';
    if (!iconNameParsed) {
        return { icon: null, name: '', color: '', isSquared: false };
    }
    // Attempt to find the icon by name
    var foundIcon = findIconByName(iconNameParsed, isMath);
    if (foundIcon) {
        return { icon: foundIcon, name: iconNameParsed, color: color, isSquared: false };
    }
    // Check for a squared variant of the icon
    foundIcon = (0, exports.findSquaredIconByName)(iconNameParsed);
    if (foundIcon) {
        return { icon: foundIcon, name: iconNameParsed, color: color, isSquared: true };
    }
    // If no icon is found, check for color-prefixed icons
    if (iconNameParsed.includes('_')) {
        var _c = tslib_1.__read(iconNameParsed.split('_')), colorName = _c[0], rest = _c.slice(1);
        var tag = "color_".concat(rest.join('_'));
        if (css_colors_1.cssColors.includes(colorName) && rest.length > 0) {
            foundIcon = findIconByTag(tag, isMath);
            if (foundIcon) {
                return { icon: foundIcon, name: iconNameParsed, color: colorName, isSquared: false };
            }
            foundIcon = (0, exports.findSquaredIconByTag)(tag);
            if (foundIcon) {
                return { icon: foundIcon, name: iconNameParsed, color: colorName, isSquared: true };
            }
        }
    }
    return { icon: null, name: iconNameParsed, color: '', isSquared: false };
};
exports.findIcon = findIcon;
//# sourceMappingURL=index.js.map