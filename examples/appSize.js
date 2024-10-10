const MathpixMarkdownModel = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;

let text = "\\((\\text{Count}-0.5)/\\mathrm{n}\\)\\((\\text{Count}-0.5)/\\mathrm{n}\\)";

const options = {
  htmlTags: true,
  width: 800,
  outMath: {
    include_svg: true,
  }
};

let data = MathpixMarkdownModel.markdownToHTMLWithSize(text, options);
console.log('[data] =>', data);
