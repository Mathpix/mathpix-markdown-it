"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChemistryDrawer = void 0;
var smiles_drawer_1 = require("./smiles-drawer");
var dom_adaptor_1 = require("../dom-adaptor");
exports.ChemistryDrawer = {
    drawSvgSync: function (content, id, options) {
        if (options === void 0) { options = {}; }
        dom_adaptor_1.initDocument();
        var _a = options.theme, theme = _a === void 0 ? 'light' : _a;
        var config;
        if (options) {
            config = Object.assign({}, options, { id: id });
        }
        return smiles_drawer_1.default.parse(content, function (tree) {
            var svgDrawer = new smiles_drawer_1.default.SvgDrawer(config);
            var output_svg = document.createElement('svg');
            var svgId = 'smiles-' + id;
            output_svg.id = svgId;
            document.body.appendChild(output_svg);
            var svg = svgDrawer.draw(tree, svgId, theme, false);
            document.body.removeChild(output_svg);
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