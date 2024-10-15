const MathpixMarkdownModel = require('../../lib/mathpix-markdown-model/index').MathpixMarkdownModel;

let text = "\\((\\text{Count}-0.5)/\\mathrm{n}\\)\\((\\text{Count}-0.5)/\\mathrm{n}\\)";
text = "\\textbf{so-called Archaic smile. Each work is stylized and lacks individualized features.}"

const fs = require('fs');
const path = require("path");

const zenpixDir = path.dirname(__dirname);
const fontDir = path.resolve(zenpixDir, 'size/fonts');
const arialFontPath = path.join(fontDir, 'Arial.ttf');
const arialBoldFontPath = path.join(fontDir, 'Arial-Bold.ttf');
console.log("[TEST]=>arialFontPath=>", arialFontPath)
const fontBuffer = fs.readFileSync(arialFontPath);
const fontBoldBuffer = fs.readFileSync(arialBoldFontPath);
console.log("[TEST]=>fontBuffer=>", fontBuffer)
const fonts = {
  normal: fontBuffer.buffer,
  bold: fontBoldBuffer.buffer
}

const options = {
  htmlTags: true,
  width: 800,
  outMath: {
    include_svg: true,
  }
};

let data = MathpixMarkdownModel.markdownToHTMLWithSize(text, options, fonts);
console.log('[data] =>', data);

text = 'so-called Archaic smile. Each work is stylized and lacks individualized features.'
let data2 = MathpixMarkdownModel.markdownToHTMLWithSize(text, options, fonts);
console.log('[data2] =>', data2);
