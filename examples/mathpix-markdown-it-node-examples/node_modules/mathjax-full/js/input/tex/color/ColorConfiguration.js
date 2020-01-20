"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SymbolMap_js_1 = require("../SymbolMap.js");
var Configuration_js_1 = require("../Configuration.js");
var ColorMethods_js_1 = require("./ColorMethods.js");
var ColorUtil_js_1 = require("./ColorUtil.js");
new SymbolMap_js_1.CommandMap('color', {
    color: 'Color',
    textcolor: 'TextColor',
    definecolor: 'DefineColor',
    colorbox: 'ColorBox',
    fcolorbox: 'FColorBox'
}, ColorMethods_js_1.ColorMethods);
var config = function (config, jax) {
    jax.parseOptions.options.color.model = new ColorUtil_js_1.ColorModel();
};
exports.ColorConfiguration = Configuration_js_1.Configuration.create('color', {
    handler: {
        macro: ['color'],
    },
    options: {
        color: {
            padding: '5px',
            borderWidth: '2px'
        }
    },
    config: config
});
//# sourceMappingURL=ColorConfiguration.js.map