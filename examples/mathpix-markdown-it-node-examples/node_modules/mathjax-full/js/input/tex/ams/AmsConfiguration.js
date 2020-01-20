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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var Configuration_js_1 = require("../Configuration.js");
var AmsItems_js_1 = require("./AmsItems.js");
var Tags_js_1 = require("../Tags.js");
require("./AmsMappings.js");
var AmsTags = (function (_super) {
    __extends(AmsTags, _super);
    function AmsTags() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AmsTags;
}(Tags_js_1.AbstractTags));
exports.AmsTags = AmsTags;
var init = function (config) {
    config.append(Configuration_js_1.Configuration.extension());
};
exports.AmsConfiguration = Configuration_js_1.Configuration.create('ams', { handler: {
        delimiter: ['AMSsymbols-delimiter', 'AMSmath-delimiter'],
        macro: ['AMSsymbols-mathchar0mi', 'AMSsymbols-mathchar0m0',
            'AMSsymbols-delimiter', 'AMSsymbols-macros',
            'AMSmath-mathchar0mo', 'AMSmath-macros', 'AMSmath-delimiter'],
        environment: ['AMSmath-environment']
    },
    items: (_a = {}, _a[AmsItems_js_1.MultlineItem.prototype.kind] = AmsItems_js_1.MultlineItem, _a),
    tags: { 'ams': AmsTags },
    init: init
});
//# sourceMappingURL=AmsConfiguration.js.map