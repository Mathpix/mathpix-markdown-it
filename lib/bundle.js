"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportMethods = void 0;
var mathpix_markdown_model_1 = require("./mathpix-markdown-model");
exports.exportMethods = function () {
    window.loadMathJax = mathpix_markdown_model_1.MathpixMarkdownModel.loadMathJax;
    window.render = mathpix_markdown_model_1.MathpixMarkdownModel.render;
    window.markdownToHTML = mathpix_markdown_model_1.MathpixMarkdownModel.markdownToHTML;
    window.mmdYamlToHTML = mathpix_markdown_model_1.MathpixMarkdownModel.mmdYamlToHTML;
    window.renderTitleMmd = mathpix_markdown_model_1.MathpixMarkdownModel.renderTitleMmd;
    window.renderAuthorsMmd = mathpix_markdown_model_1.MathpixMarkdownModel.renderAuthorsMmd;
};
exports.exportMethods();
//# sourceMappingURL=bundle.js.map