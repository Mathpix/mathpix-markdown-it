"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IconConfiguration = exports.IconMethods = void 0;
var Configuration_js_1 = require("mathjax-full/js/input/tex/Configuration.js");
var SymbolMap_js_1 = require("mathjax-full/js/input/tex/SymbolMap.js");
var icons_1 = require("../../../helpers/icons");
var TexError_js_1 = require("mathjax-full/js/input/tex/TexError.js");
exports.IconMethods = {};
exports.IconMethods.Icon = function (parser, name) {
    var iconName = parser.GetArgument(name);
    iconName = iconName ? iconName.trim() : '';
    if (!iconName) {
        var math = parser.create('node', 'mtext', [], {}, '');
        parser.Push(math);
        return;
    }
    var icon = (0, icons_1.findIcon)(iconName, true);
    if (!icon) {
        icon = (0, icons_1.findSquaredIcon)(iconName);
        if (!icon) {
            throw new TexError_js_1.default('MultipleIconProperty', 'The icon name "%1" can\'t be found.', iconName);
        }
        else {
            var textNode = parser.create('text', icon.symbol);
            var math = parser.create('node', 'mtext', [], {}, textNode);
            var def = {
                height: '+0.1em',
                depth: '+0.1em',
                lspace: '+0.1em',
                width: '+0.3em',
                style: "border: 1px solid;"
            };
            math = parser.create('node', 'mpadded', [math], def);
            parser.Push(math);
        }
    }
    else {
        var textNode = parser.create('text', icon.symbol);
        var math = parser.create('node', 'mtext', [], {}, textNode);
        var def = {
            width: icon.width ? icon.width : '+0.5ex'
        };
        math = parser.create('node', 'mpadded', [math], def);
        parser.Push(math);
    }
};
new SymbolMap_js_1.CommandMap('icon', { icon: 'Icon' }, exports.IconMethods);
exports.IconConfiguration = Configuration_js_1.Configuration.create('icon', {
    handler: {
        macro: ['icon']
    }
});
//# sourceMappingURL=IconConfiguration.js.map