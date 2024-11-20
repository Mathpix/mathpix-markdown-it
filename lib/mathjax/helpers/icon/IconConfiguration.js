"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IconConfiguration = exports.IconMethods = void 0;
var Configuration_js_1 = require("mathjax-full/js/input/tex/Configuration.js");
var SymbolMap_js_1 = require("mathjax-full/js/input/tex/SymbolMap.js");
var TexError_js_1 = require("mathjax-full/js/input/tex/TexError.js");
var icons_1 = require("../../../helpers/icons");
exports.IconMethods = {};
exports.IconMethods.Icon = function (parser, iconNameInit) {
    var iconName = parser.GetArgument(iconNameInit);
    iconName = iconName ? iconName.trim() : '';
    if (!iconName) {
        var math = parser.create('node', 'mtext', [], {}, '');
        parser.Push(math);
        return;
    }
    var _a = (0, icons_1.findIcon)(iconName, true), _b = _a.icon, icon = _b === void 0 ? null : _b, _c = _a.name, name = _c === void 0 ? '' : _c, _d = _a.color, color = _d === void 0 ? '' : _d, _e = _a.isSquared, isSquared = _e === void 0 ? false : _e;
    if (!name) {
        var math = parser.create('node', 'mtext', [], {}, '');
        parser.Push(math);
        return;
    }
    if (!icon) {
        throw new TexError_js_1.default('MultipleIconProperty', 'The icon name "%1" can\'t be found.', iconName);
    }
    else {
        if (isSquared) {
            var textNode = parser.create('text', icon.symbol);
            var math = parser.create('node', 'mtext', [], {}, textNode);
            var def = {
                height: '+0.1em',
                depth: '+0.1em',
                lspace: '+0.1em',
                width: '+0.3em',
                style: color ? "border: 1px solid ".concat(color, ";") : "border: 1px solid;"
            };
            if (color) {
                def.color = color;
            }
            math = parser.create('node', 'mpadded', [math], def);
            parser.Push(math);
        }
        else {
            var textNode = parser.create('text', icon.symbol);
            var math = parser.create('node', 'mtext', [], {}, textNode);
            var def = {
                width: icon.width ? icon.width : '+0.5ex'
            };
            if (color) {
                def.color = color;
            }
            math = parser.create('node', 'mpadded', [math], def);
            parser.Push(math);
        }
    }
};
new SymbolMap_js_1.CommandMap('icon', { icon: 'Icon' }, exports.IconMethods);
exports.IconConfiguration = Configuration_js_1.Configuration.create('icon', {
    handler: {
        macro: ['icon']
    }
});
//# sourceMappingURL=IconConfiguration.js.map