const { JSDOM } = require("jsdom");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

const MathpixMarkdownModel = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;

const options = {
    lineNumbering: true,
    htmlTags: true,
    width: 800
  };
let  text = '<img src="images/scene_graph/image_retrieval_paper.png" width="60%" title="scene graph" align="center"/>'

const htmlMM = MathpixMarkdownModel.markdownToHTML(text, options);
console.log('==>htmlMM=>', htmlMM)

