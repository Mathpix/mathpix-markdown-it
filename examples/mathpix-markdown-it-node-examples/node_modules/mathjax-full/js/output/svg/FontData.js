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
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var FontData_js_1 = require("../common/FontData.js");
__export(require("../common/FontData.js"));
;
;
var SVGFontData = (function (_super) {
    __extends(SVGFontData, _super);
    function SVGFontData() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SVGFontData.charOptions = function (font, n) {
        return _super.charOptions.call(this, font, n);
    };
    return SVGFontData;
}(FontData_js_1.FontData));
exports.SVGFontData = SVGFontData;
function AddPaths(font, paths, content) {
    var e_1, _a, e_2, _b;
    try {
        for (var _c = __values(Object.keys(paths)), _d = _c.next(); !_d.done; _d = _c.next()) {
            var c = _d.value;
            var n = parseInt(c);
            SVGFontData.charOptions(font, n).p = paths[n];
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        }
        finally { if (e_1) throw e_1.error; }
    }
    try {
        for (var _e = __values(Object.keys(content)), _f = _e.next(); !_f.done; _f = _e.next()) {
            var c = _f.value;
            var n = parseInt(c);
            SVGFontData.charOptions(font, n).c = content[n];
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return font;
}
exports.AddPaths = AddPaths;
//# sourceMappingURL=FontData.js.map