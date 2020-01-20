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
Object.defineProperty(exports, "__esModule", { value: true });
var WrapperFactory_js_1 = require("../../core/Tree/WrapperFactory.js");
var CommonWrapperFactory = (function (_super) {
    __extends(CommonWrapperFactory, _super);
    function CommonWrapperFactory() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.jax = null;
        return _this;
    }
    Object.defineProperty(CommonWrapperFactory.prototype, "Wrappers", {
        get: function () {
            return this.node;
        },
        enumerable: true,
        configurable: true
    });
    CommonWrapperFactory.defaultNodes = {};
    return CommonWrapperFactory;
}(WrapperFactory_js_1.AbstractWrapperFactory));
exports.CommonWrapperFactory = CommonWrapperFactory;
//# sourceMappingURL=WrapperFactory.js.map