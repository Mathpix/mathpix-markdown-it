"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChemistryDrawer = void 0;
var smiles_drawer_1 = require("./smiles-drawer");
var dom_adaptor_1 = require("../dom-adaptor");
var chemistry_options_1 = require("./chemistry-options");
exports.ChemistryDrawer = {
    drawSvgSync: function (content, id, options) {
        if (options === void 0) { options = {}; }
        dom_adaptor_1.initDocument();
        var _a = options.theme, theme = _a === void 0 ? 'light' : _a, stretch = options.stretch, _b = options.scale, scale = _b === void 0 ? 1 : _b, _c = options.fontSize, fontSize = _c === void 0 ? 16 : _c;
        var config = chemistry_options_1.setFontSize(fontSize, {});
        if (options) {
            config = Object.assign(config, options, { id: id });
        }
        return smiles_drawer_1.default.parse(content, function (tree) {
            var _a, _b;
            var svgDrawer = new smiles_drawer_1.default.SvgDrawer(config);
            var output_svg = document.createElement('svg');
            var svgId = 'smiles-' + id;
            output_svg.id = svgId;
            var svg = svgDrawer.draw(tree, output_svg, theme, false);
            if (!stretch && ((_a = svgDrawer.svgWrapper) === null || _a === void 0 ? void 0 : _a.drawingWidth)) {
                svg.style.width = ((_b = svgDrawer.svgWrapper) === null || _b === void 0 ? void 0 : _b.drawingWidth) * scale + "px";
            }
            if (svg && svg.outerHTML) {
                return svg.outerHTML;
            }
            else {
                return '';
            }
        }, function (err) {
            console.error('[drawSvgSync]' + err);
            return "<span class=\"smiles-error\" style=\"background-color: yellow; color: red;\">SyntaxError: " + err.message + "</span>";
        });
    }
};
//# sourceMappingURL=chemisrty-drawer.js.map