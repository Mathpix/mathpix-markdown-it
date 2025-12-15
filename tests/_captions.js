let chai = require('chai');
let should = chai.should();

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;
const tests = require('./_data/_captions/_data');

const { JSDOM } = require("jsdom");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;


describe('Check tables and figures with captions:', () => {
  tests.forEach(function(test) {
    describe('Latex => ' + test.latex, () => {
      it('(sync) Checking result html', () => {
        MM.texReset();
        const html = MM.markdownToHTML(test.latex);
        html.trim().should.equal(test.html);
      });
      it('(async) Checking result html', async () => {
        MM.texReset();
        let html = await MM.markdownToHTMLAsync(test.latex);
        html.trim().should.equal(test.html);
      });
      it('(async  segments) Checking result html', async () => {
        MM.texReset();
        let { content } = await MM.markdownToHTMLSegmentsAsync(test.latex);
        content.trim().should.equal(test.html);
      });
    });
  });
  MM.texReset();
});
