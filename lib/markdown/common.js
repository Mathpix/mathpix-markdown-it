"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqueSlug = exports.slugify = exports.isSpace = exports.tocRegexp = void 0;
var hasProp = Object.prototype.hasOwnProperty;
exports.tocRegexp = /^\[\[toc\]\]/im;
exports.isSpace = function (code) {
    switch (code) {
        case 0x09:
        case 0x20:
            return true;
    }
    return false;
};
exports.slugify = function (s) { return encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-')); };
exports.uniqueSlug = function (slug, slugs) {
    var uniq = slug;
    var i = 2;
    while (hasProp.call(slugs, uniq))
        uniq = slug + "-" + i++;
    slugs[uniq] = true;
    return uniq;
};
//# sourceMappingURL=common.js.map