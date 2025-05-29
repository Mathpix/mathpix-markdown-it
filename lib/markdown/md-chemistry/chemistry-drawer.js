"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChemistryDrawer = void 0;
var smiles_drawer_1 = require("./smiles-drawer");
var dom_adaptor_1 = require("../dom-adaptor");
var chemistry_options_1 = require("./chemistry-options");
exports.ChemistryDrawer = {
    drawSvgSync: function (content, id, options, injectSizeAttributes) {
        if (options === void 0) { options = {}; }
        if (injectSizeAttributes === void 0) { injectSizeAttributes = false; }
        (0, dom_adaptor_1.initDocument)();
        var _a = options.theme, theme = _a === void 0 ? 'light' : _a, stretch = options.stretch, _b = options.fontSize, fontSize = _b === void 0 ? 14 : _b, _c = options.disableColors, disableColors = _c === void 0 ? true : _c, autoScale = options.autoScale, _d = options.useCurrentColor, useCurrentColor = _d === void 0 ? true : _d;
        var scale = options.scale || 1;
        var config = {};
        if (autoScale) {
            scale = (0, chemistry_options_1.getScale)(fontSize);
        }
        else {
            config = (0, chemistry_options_1.setFontSize)(fontSize, {});
        }
        var darkTextColor = useCurrentColor ? 'currentColor' : '#fff';
        var lightTextColor = useCurrentColor ? 'currentColor' : '#222';
        if (disableColors) {
            config = (0, chemistry_options_1.setDisableColors)(config, darkTextColor, lightTextColor);
        }
        else {
            config = (0, chemistry_options_1.setThemesByDefault)(config, darkTextColor, lightTextColor);
        }
        if (options) {
            config = Object.assign(config, options, { id: id });
        }
        return smiles_drawer_1.default.parse(content, function (tree) {
            var _a, _b, _c, _d;
            var svgDrawer = new smiles_drawer_1.default.SvgDrawer(config);
            var output_svg = document.createElement('svg');
            var svgId = 'smiles-' + id;
            output_svg.id = svgId;
            output_svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            var svg = svgDrawer.draw(tree, output_svg, theme, false);
            if (!stretch && ((_a = svgDrawer.svgWrapper) === null || _a === void 0 ? void 0 : _a.drawingWidth)) {
                var width = ((_b = svgDrawer.svgWrapper) === null || _b === void 0 ? void 0 : _b.drawingWidth) * scale;
                svg.style.width = "".concat(width, "px");
                if (injectSizeAttributes) {
                    svg.setAttribute('width', width);
                }
            }
            if (!stretch && !options.isTesting && ((_c = svgDrawer.svgWrapper) === null || _c === void 0 ? void 0 : _c.drawingHeight)) {
                var height = ((_d = svgDrawer.svgWrapper) === null || _d === void 0 ? void 0 : _d.drawingHeight) * scale;
                svg.style.height = "".concat(height, "px");
                if (injectSizeAttributes) {
                    svg.setAttribute('height', height);
                }
            }
            svg.style.overflow = 'visible';
            if (svg && svg.outerHTML) {
                return svg.outerHTML;
            }
            else {
                return '';
            }
        }, function (err) {
            console.error('[drawSvgSync]' + err);
            return "<span class=\"smiles-error\" style=\"background-color: yellow; color: red;\">SyntaxError: ".concat(err.message, "</span>");
        });
    }
};
//# sourceMappingURL=chemistry-drawer.js.map