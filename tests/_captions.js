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
    const html = MM.markdownToHTML(test.latex);
    describe('Latex => ' + test.latex, () => {
      it('Checking result html', (done) => {
        html.trim().should.equal(test.html);
        done();
      });
    });
    if (test.html_width0) {
      const html = MM.markdownToHTML(test.latex, {width: 0});
      describe('Latex => ' + test.latex, () => {
        it('Checking result html', (done) => {
          html.trim().should.equal(test.html_width0);
          done();
        });
      });
    }
  });
  MM.texReset();
});
