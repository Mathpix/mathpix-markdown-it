"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChemistryDrawer = void 0;
var smiles_drawer_1 = require("./smiles-drawer");
exports.ChemistryDrawer = {
    drawSvgSync: function (content, id, options) {
        if (options === void 0) { options = {}; }
        var _a = options.theme, theme = _a === void 0 ? 'light' : _a, stretch = options.stretch, _b = options.scale, scale = _b === void 0 ? 1 : _b, _c = options.fontSize, fontSize = _c === void 0 ? 37.5 : _c;
        var config;
        if (options) {
            config = Object.assign({}, options, { id: id });
        }
        if (fontSize) {
            var pt = Number(fontSize) * 3 / 4;
            var scale_1 = pt / 5;
            config.bondThickness = 0.6 * scale_1;
            config.bondLength = 15 * scale_1;
            config.bondSpacing = 0.18 * 15 * scale_1;
            config.fontSizeLarge = 5 * scale_1;
            config.fontSizeSmall = 3 * scale_1;
            config.padding = 5 * scale_1;
            console.log('fontSize=>', fontSize);
            console.log('pt=>', pt);
            console.log('scale=>', scale_1);
        }
        return smiles_drawer_1.default.parse(content, function (tree) {
            var _a, _b, _c, _d;
            var svgDrawer = new smiles_drawer_1.default.SvgDrawer(config);
            var output_svg = document.createElement('svg');
            var svgId = 'smiles-' + id;
            output_svg.id = svgId;
            document.body.appendChild(output_svg);
            var svg = svgDrawer.draw(tree, svgId, theme, false);
            if (!stretch && ((_a = svgDrawer.svgWrapper) === null || _a === void 0 ? void 0 : _a.drawingWidth)) {
                svg.style.width = ((_b = svgDrawer.svgWrapper) === null || _b === void 0 ? void 0 : _b.drawingWidth) * scale + "px";
            }
            if (!stretch && ((_c = svgDrawer.svgWrapper) === null || _c === void 0 ? void 0 : _c.drawingHeight)) {
                svg.style.height = ((_d = svgDrawer.svgWrapper) === null || _d === void 0 ? void 0 : _d.drawingHeight) * scale + "px";
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