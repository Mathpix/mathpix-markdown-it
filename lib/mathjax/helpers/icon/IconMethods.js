"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IconMethods = void 0;
var NodeUtil_js_1 = require("mathjax-full/js/input/tex/NodeUtil.js");
var ParseUtil_js_1 = require("mathjax-full/js/input/tex/ParseUtil.js");
function padding(colorPadding) {
    var pad = "+".concat(colorPadding);
    var unit = colorPadding.replace(/^.*?([a-z]*)$/, '$1');
    var pad2 = 2 * parseFloat(pad);
    return {
        width: "+".concat(pad2).concat(unit),
        height: pad,
        depth: pad,
        lspace: colorPadding,
    };
}
exports.IconMethods = {};
/**
 * Override \color macro definition.
 *
 * @param {TexParser} parser The calling parser.
 * @param {string} name The name of the control sequence.
 */
exports.IconMethods.Color = function (parser, name) {
    var model = parser.GetBrackets(name, '');
    var colorDef = parser.GetArgument(name);
    var colorModel = parser.configuration.packageData.get('color').model;
    var color = colorModel.getColor(model, colorDef);
    var style = parser.itemFactory.create('style')
        .setProperties({ styles: { mathcolor: color } });
    parser.stack.env['color'] = color;
    parser.Push(style);
};
/**
 * Define the \textcolor macro.
 *
 * @param {TexParser} parser The calling parser.
 * @param {string} name The name of the control sequence.
 */
exports.IconMethods.TextColor = function (parser, name) {
    var model = parser.GetBrackets(name, '');
    var colorDef = parser.GetArgument(name);
    var colorModel = parser.configuration.packageData.get('color').model;
    var color = colorModel.getColor(model, colorDef);
    var old = parser.stack.env['color'];
    parser.stack.env['color'] = color;
    var math = parser.ParseArg(name);
    if (old) {
        parser.stack.env['color'] = old;
    }
    else {
        delete parser.stack.env['color'];
    }
    var node = parser.create('node', 'mstyle', [math], { mathcolor: color });
    parser.Push(node);
};
/**
 * Define the \definecolor macro.
 *
 * @param {TexParser} parser The calling parser.
 * @param {string} name The name of the control sequence.
 */
exports.IconMethods.DefineColor = function (parser, name) {
    var cname = parser.GetArgument(name);
    var model = parser.GetArgument(name);
    var def = parser.GetArgument(name);
    var colorModel = parser.configuration.packageData.get('color').model;
    colorModel.defineColor(model, cname, def);
};
/**
 * Produce a text box with a colored background: `\colorbox`.
 *
 * @param {TexParser} parser The calling parser.
 * @param {string} name The name of the control sequence.
 */
exports.IconMethods.ColorBox = function (parser, name) {
    var cname = parser.GetArgument(name);
    var math = ParseUtil_js_1.default.internalMath(parser, parser.GetArgument(name));
    var colorModel = parser.configuration.packageData.get('color').model;
    var node = parser.create('node', 'mpadded', math, {
        mathbackground: colorModel.getColor('named', cname)
    });
    NodeUtil_js_1.default.setProperties(node, padding(parser.options.color.padding));
    parser.Push(node);
};
/**
 * Produce a framed text box with a colored background: `\fcolorbox`.
 *
 * @param {TexParser} parser The calling parser.
 * @param {string} name The name of the control sequence.
 */
exports.IconMethods.FColorBox = function (parser, name) {
    var fname = parser.GetArgument(name);
    var cname = parser.GetArgument(name);
    var math = ParseUtil_js_1.default.internalMath(parser, parser.GetArgument(name));
    var options = parser.options.color;
    var colorModel = parser.configuration.packageData.get('color').model;
    var node = parser.create('node', 'mpadded', math, {
        mathbackground: colorModel.getColor('named', cname),
        style: "border: ".concat(options.borderWidth, " solid ").concat(colorModel.getColor('named', fname))
    });
    NodeUtil_js_1.default.setProperties(node, padding(options.padding));
    parser.Push(node);
};
//# sourceMappingURL=IconMethods.js.map