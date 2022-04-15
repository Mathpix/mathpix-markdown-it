
const MathpixMarkdownModel = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;

const { JSDOM } = require("jsdom");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;


const options = {
    // lineNumbering: true,
    htmlTags: true,
    width: 800
  };
let  text = '\n' +
'You can insert non-numbered block mode mathematics by using the LaTeX delimiters `$$...$$`, `\\[...\\]`, `\\begin{equation*}...\\end{equation*}`, and `\\begin{align*}...\\end{align*}`:\n' +
'\n' +
'$$\n' +
'x = \\frac { - b \\pm \\sqrt { b ^ { 2 } - 4 a c } } { 2 a }\n' +
'$$\n' +
'\n' +
'\\[\n' +
'y = \\frac { \\sum _ { i } w _ { i } y _ { i } } { \\sum _ { i } w _ { i } } , i = 1,2 \\ldots k\n' +
'\\]\n' +
'\n' +
'\\begin{equation*}\n' +
'l ( \\theta ) = \\sum _ { i = 1 } ^ { m } \\log p ( x , \\theta )\n' +
'\\end{equation*}\n' +
'\n' +
'\\begin{align*}\n' +
't _ { 1 } + t _ { 2 } = \\frac { ( 2 L / c ) \\sqrt { 1 - u ^ { 2 } / c ^ { 2 } } } { 1 - u ^ { 2 } / c ^ { 2 } } = \\frac { 2 L / c } { \\sqrt { 1 - u ^ { 2 } / c ^ { 2 } } }\n' +
'\\end{align*}'

text = "$x^x$"

const htmlMM = MathpixMarkdownModel.markdownToHTML(text, options);
console.log('==>htmlMM=>', htmlMM)

