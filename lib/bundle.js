"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportMethods = void 0;
var mathpix_markdown_model_1 = require("./mathpix-markdown-model");
exports.exportMethods = function () {
    window.loadMathJax = mathpix_markdown_model_1.MathpixMarkdownModel.loadMathJax;
    window.render = mathpix_markdown_model_1.MathpixMarkdownModel.render;
    window.markdownToHTML = mathpix_markdown_model_1.MathpixMarkdownModel.markdownToHTML;
};
exports.exportMethods();
//# sourceMappingURL=bundle.js.map