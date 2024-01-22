let chai = require('chai');
let should = chai.should();
const notIncludeSymbols = require('./_ascii');

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;

const options = {
  cwidth: 800,
  htmlTags: true
};



const { JSDOM } = require("jsdom");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;


describe('SVG. Check parseMarkdownByHTML for Chart:', () => {
  const tests = require('./_data/_svg_chart/_data');
  tests.forEach((test, index) => {
    const html = MM.markdownToHTML(test.mmd, options);
    const data = MM.parseMarkdownByHTML(html, false);
    describe('SVG [' + index + ']', () => {
      it('Should be length = 1', (done) => {
        data.should.have.length(1);
        done();
      });
      it('Should be return markdown =>', function(done) {
        data[0].should.have.property('type', 'markdown');
        data[0].should.have.property('value', test.markdown);
        done();
      });
    });
  });
});



