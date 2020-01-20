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
function CommonMtextMixin(Base) {
    var _a;
    return _a = (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            class_1.prototype.getVariant = function () {
                var options = this.jax.options;
                if (options.mtextInheritFont || (options.merrorInheritFont && this.node.Parent.isKind('merror'))) {
                    var variant = this.node.attributes.get('mathvariant');
                    var font = this.constructor.INHERITFONTS[variant];
                    if (font) {
                        this.variant = this.explicitVariant.apply(this, __spread(font));
                        return;
                    }
                }
                _super.prototype.getVariant.call(this);
            };
            return class_1;
        }(Base)),
        _a.INHERITFONTS = {
            normal: ['', '', ''],
            bold: ['', 'bold', ''],
            italic: ['', '', 'italic'],
            'bold-italic': ['', 'bold', 'italic'],
            script: ['cursive', '', ''],
            'bold-script': ['cursive', 'bold', ''],
            'sans-serif': ['sans-serif', '', ''],
            'bold-sans-serif': ['sans-serif', 'bold', ''],
            'sans-serif-italic': ['sans-serif', '', 'italic'],
            'bold-sans-serif-italic': ['sans-serif', 'bold', 'italic'],
            monospace: ['monospace', '', '']
        },
        _a;
}
exports.CommonMtextMixin = CommonMtextMixin;
//# sourceMappingURL=mtext.js.map