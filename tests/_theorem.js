let chai = require('chai');
let should = chai.should();

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;

const options = {
  cwidth: 800
};


const { JSDOM } = require("jsdom");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;


describe('Check Theorem environments:', () => {
  const tests = require('./_data/_theorem/_data');
  tests.forEach(function(test, index) {
    const html = MM.markdownToHTML(test.latex, options);
    describe('Latex => ' + test.latex, () => {
      it('Checking result html', (done) => {
        console.log("[html]=>", index);
        console.log(html)
        html.trim().should.equal(test.html);
        done();
      });
    });
  });
  MM.texReset();
});
