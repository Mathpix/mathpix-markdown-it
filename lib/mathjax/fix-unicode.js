"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Other = void 0;
var MapHandler_1 = require("mathjax-full/js/input/tex/MapHandler");
var NodeUtil_1 = require("mathjax-full/js/input/tex/NodeUtil");
var OperatorDictionary_1 = require("mathjax-full/js/core/MmlTree/OperatorDictionary");
var SymbolMap_js_1 = require("mathjax-full/js/input/tex/SymbolMap.js");
/**
 * Remapping some ASCII characters to their Unicode operator equivalent.
 */
new SymbolMap_js_1.CharacterMap('remap', null, {
    '-': '\u2212',
    '*': '\u2217',
    '`': '\u2018' // map ` to back quote
});
/**
 * Default handling of characters (as <mo> elements).
 * @param {TexParser} parser The calling parser.
 * @param {string} char The character to parse.
 */
function Other(parser, char) {
    var font = parser.stack.env['font'];
    var def = font
        ? { mathvariant: parser.stack.env['font'] }
        : {};
    var remap = MapHandler_1.MapHandler.getMap('remap').lookup(char);
    var range = (0, OperatorDictionary_1.getRange)(char);
    var type = (range === null || range === void 0 ? void 0 : range[3]) || 'mo';
    var mo = parser.create('token', type, def, (remap ? remap.char : char));
    (range === null || range === void 0 ? void 0 : range[4]) && mo.attributes.set('mathvariant', range[4]);
    if (type === 'mo') {
        NodeUtil_1.default.setProperty(mo, 'fixStretchy', true);
        parser.configuration.addNode('fixStretchy', mo);
    }
    parser.Push(mo);
}
exports.Other = Other;
//# sourceMappingURL=fix-unicode.js.map