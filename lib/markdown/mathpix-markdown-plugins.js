"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mdPluginConfigured_1 = require("./mdPluginConfigured");
var mathpixMarkdownPlugin = function (md, options) {
    var _a = options.width, width = _a === void 0 ? 1200 : _a, _b = options.outMath, outMath = _b === void 0 ? {} : _b, _c = options.smiles, smiles = _c === void 0 ? {} : _c, _d = options.mathJax, mathJax = _d === void 0 ? {} : _d, _e = options.renderElement, renderElement = _e === void 0 ? {} : _e;
    md
        .use(mdPluginConfigured_1.mdPluginChemistry, smiles)
        .use(mdPluginConfigured_1.mdPluginTableTabular, { width: width, outMath: outMath })
        .use(mdPluginConfigured_1.mdPluginList, { width: width, outMath: outMath, renderElement: renderElement })
        .use(mdPluginConfigured_1.mdPluginMathJax({ width: width, outMath: outMath, mathJax: mathJax, renderElement: renderElement }))
        .use(mdPluginConfigured_1.mdPluginText())
        .use(mdPluginConfigured_1.mdPluginHighlightCode, { auto: false })
        .use(mdPluginConfigured_1.mdPluginAnchor)
        .use(mdPluginConfigured_1.mdPluginTOC);
};
exports.default = mathpixMarkdownPlugin;
//# sourceMappingURL=mathpix-markdown-plugins.js.map