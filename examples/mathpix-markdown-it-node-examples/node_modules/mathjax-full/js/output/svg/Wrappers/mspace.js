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
var Wrapper_js_1 = require("../Wrapper.js");
var mspace_js_1 = require("../../common/Wrappers/mspace.js");
var mspace_js_2 = require("../../../core/MmlTree/MmlNodes/mspace.js");
var SVGmspace = (function (_super) {
    __extends(SVGmspace, _super);
    function SVGmspace() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SVGmspace.kind = mspace_js_2.MmlMspace.prototype.kind;
    return SVGmspace;
}(mspace_js_1.CommonMspaceMixin(Wrapper_js_1.SVGWrapper)));
exports.SVGmspace = SVGmspace;
//# sourceMappingURL=mspace.js.map