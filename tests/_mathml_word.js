let chai = require('chai');
let should = chai.should();
const notIncludeSymbols = require('./_ascii');

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;

const Window = require('window');
const window = new Window();
global.window = window;
global.document = window.document;

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
global.DOMParser = new JSDOM().window.DOMParser;


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
    describe(index + '. [input_latex] => ' + test.latex_input, () => {
      it('Should be return mathml_word =>', function(done) {
        data[0].should.have.property('type', 'mathmlword');
        data[0].should.have.property('value', test.mathmlword);
        done();
      });
    });
  });
});


