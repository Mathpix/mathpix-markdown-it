let chai = require('chai');
let should = chai.should();

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;

const options = {
  cwidth: 800,
  outMath: {
    include_svg: true,
  }
};


const { JSDOM } = require("jsdom");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;


describe('Check Mathjax:', () => {
  const tests = require('./_data/_icon/_data');
  tests.forEach(function(test) {
    const html = MM.markdownToHTML(test.mmd, options);
    describe('mmd => ' + test.mmd, () => {
      it('Checking result html', (done) => {
        html.trim().should.equal(test.html);
        done();
      });
    });
  });
});
