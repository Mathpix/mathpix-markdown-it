"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
function CommonTeXFontMixin(Base) {
    var _a;
    return _a = (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            class_1.prototype.getDelimiterData = function (n) {
                return this.getChar('-smallop', n) || this.getChar('-size4', n);
            };
            return class_1;
        }(Base)),
        _a.defaultVariants = __spread(Base.defaultVariants, [
            ['-smallop', 'normal'],
            ['-largeop', 'normal'],
            ['-size3', 'normal'],
            ['-size4', 'normal'],
            ['-tex-calligraphic', 'italic'],
            ['-tex-bold-calligraphic', 'bold-italic'],
            ['-tex-oldstyle', 'normal'],
            ['-tex-bold-oldstyle', 'bold'],
            ['-tex-mathit', 'italic'],
            ['-tex-variant', 'normal']
        ]),
        _a.defaultCssFonts = __assign({}, Base.defaultCssFonts, { '-smallop': ['serif', false, false], '-largeop': ['serif', false, false], '-size3': ['serif', false, false], '-size4': ['serif', false, false], '-tex-calligraphic': ['cursive', true, false], '-tex-bold-calligraphic': ['cursive', true, true], '-tex-oldstyle': ['serif', false, false], '-tex-bold-oldstyle': ['serif', false, true], '-tex-mathit': ['serif', true, false] }),
        _a.defaultSizeVariants = ['normal', '-smallop', '-largeop', '-size3', '-size4'],
        _a;
}
exports.CommonTeXFontMixin = CommonTeXFontMixin;
//# sourceMappingURL=tex.js.map