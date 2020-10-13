"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChemistryDrawer = void 0;
var smiles_drawer_1 = require("./smiles-drawer");
exports.ChemistryDrawer = {
    drawSvgSync: function (content, id, options) {
        if (options === void 0) { options = {}; }
        var _a = options.theme, theme = _a === void 0 ? 'light' : _a, stretch = options.stretch, _b = options.scale, scale = _b === void 0 ? 3 : _b;
        var config;
        if (options) {
            config = Object.assign({}, options, { id: id });
        }
        return smiles_drawer_1.default.parse(content, function (tree) {
            var _a, _b;
            var svgDrawer = new smiles_drawer_1.default.SvgDrawer(config);
            var output_svg = document.createElement('svg');
            var svgId = 'smiles-' + id;
            output_svg.id = svgId;
            document.body.appendChild(output_svg);
            var svg = svgDrawer.draw(tree, svgId, theme, false);
            if (!stretch && ((_a = svgDrawer.svgWrapper) === null || _a === void 0 ? void 0 : _a.drawingWidth)) {
                svg.style.width = ((_b = svgDrawer.svgWrapper) === null || _b === void 0 ? void 0 : _b.drawingWidth) * scale + "px";
            }
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