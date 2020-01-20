"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var Configuration_js_1 = require("../Configuration.js");
var NodeUtil_js_1 = require("../NodeUtil.js");
var TexConstants_js_1 = require("../TexConstants.js");
var SymbolMap_js_1 = require("../SymbolMap.js");
var NodeFactory_js_1 = require("../NodeFactory.js");
var BOLDVARIANT = {};
BOLDVARIANT[TexConstants_js_1.TexConstant.Variant.NORMAL] = TexConstants_js_1.TexConstant.Variant.BOLD;
BOLDVARIANT[TexConstants_js_1.TexConstant.Variant.ITALIC] = TexConstants_js_1.TexConstant.Variant.BOLDITALIC;
BOLDVARIANT[TexConstants_js_1.TexConstant.Variant.FRAKTUR] = TexConstants_js_1.TexConstant.Variant.BOLDFRAKTUR;
BOLDVARIANT[TexConstants_js_1.TexConstant.Variant.SCRIPT] = TexConstants_js_1.TexConstant.Variant.BOLDSCRIPT;
BOLDVARIANT[TexConstants_js_1.TexConstant.Variant.SANSSERIF] = TexConstants_js_1.TexConstant.Variant.BOLDSANSSERIF;
BOLDVARIANT['-tex-calligraphic'] = '-tex-bold-calligraphic';
BOLDVARIANT['-tex-oldstyle'] = '-tex-bold-oldstyle';
exports.BoldsymbolMethods = {};
exports.BoldsymbolMethods.Boldsymbol = function (parser, name) {
    var boldsymbol = parser.stack.env['boldsymbol'];
    parser.stack.env['boldsymbol'] = true;
    var mml = parser.ParseArg(name);
    parser.stack.env['boldsymbol'] = boldsymbol;
    parser.Push(mml);
};
new SymbolMap_js_1.CommandMap('boldsymbol', { boldsymbol: 'Boldsymbol' }, exports.BoldsymbolMethods);
function createBoldToken(factory, kind, def, text) {
    var token = NodeFactory_js_1.NodeFactory.createToken(factory, kind, def, text);
    if (kind !== 'mtext' &&
        factory.configuration.parser.stack.env['boldsymbol']) {
        NodeUtil_js_1.default.setProperty(token, 'fixBold', true);
        factory.configuration.addNode('fixBold', token);
    }
    return token;
}
exports.createBoldToken = createBoldToken;
function rewriteBoldTokens(arg) {
    var e_1, _a;
    try {
        for (var _b = __values(arg.data.getList('fixBold')), _c = _b.next(); !_c.done; _c = _b.next()) {
            var node = _c.value;
            if (NodeUtil_js_1.default.getProperty(node, 'fixBold')) {
                var variant = NodeUtil_js_1.default.getAttribute(node, 'mathvariant');
                if (variant == null) {
                    NodeUtil_js_1.default.setAttribute(node, 'mathvariant', TexConstants_js_1.TexConstant.Variant.BOLD);
                }
                else {
                    NodeUtil_js_1.default.setAttribute(node, 'mathvariant', BOLDVARIANT[variant] || variant);
                }
                NodeUtil_js_1.default.removeProperties(node, 'fixBold');
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
}
exports.rewriteBoldTokens = rewriteBoldTokens;
;
exports.BoldsymbolConfiguration = Configuration_js_1.Configuration.create('boldsymbol', { handler: { macro: ['boldsymbol'] },
    nodes: { 'token': createBoldToken },
    postprocessors: [rewriteBoldTokens] });
//# sourceMappingURL=BoldsymbolConfiguration.js.map