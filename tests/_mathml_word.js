let chai = require('chai');
let should = chai.should();
const notIncludeSymbols = require('./_ascii');

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;


const { JSDOM } = require("jsdom");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;


describe('Check mathml_word:', () => {
  const tests = require('./_data/_mathml_word/_data');
  const options = {
    cwidth: 800,
    outMath: {
      include_mathml_word: true,
      include_svg: false,
    }};
  tests.forEach(function(test, index) {
    const html = MM.render(test.latex_input, options);
    const data = MM.parseMarkdownByHTML(html, false);
    describe((index + 1) + '. [input_latex] => ' + test.latex_input, () => {
      it('Should be return mathml_word =>', function(done) {
        data[0].should.have.property('type', 'mathmlword');
        data[0].should.have.property('value', test.mathmlword);
        done();
      });
    });
  });
});


