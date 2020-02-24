let chai = require('chai');
let should = chai.should();


let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;

const options = {
  cwidth: 800,
  outMath: {
    include_asciimath: true,
    include_mathml: true,
    include_latex: true,
    include_svg: true,
    include_tsv: true
  }};


const Window = require('window');
const window = new Window();
global.window = window;
global.document = window.document;

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
global.DOMParser = new JSDOM().window.DOMParser;

describe('Check parseMarkdownByHTML:', () => {
    const tests = require('./_data/_parseMarkdownByHTML/_data');
    tests.forEach(function(test) {
      const html = MM.render(test.latex_input, options);
      const data = MM.parseMarkdownByHTML(html, false);
      describe('input_latex => ' + test.latex_input, () => {
        it('Should be return mathml =>', function(done) {
          data[0].should.have.property('type', 'mathml');
          data[1].should.have.property('type', 'asciimath');
          data[2].should.have.property('type', 'latex');
          data[3].should.have.property('type', 'html');
          data[0].should.have.property('value', test.mathml);
          data[1].should.have.property('value', test.asciimath);
          data[2].should.have.property('value', test.latex);
          done();
        });
        it('Should be return mathml =>', function(done) {
          data[0].should.have.property('type', 'mathml');
          data[0].should.have.property('value', test.mathml);
          done();
        });
        it('Should be return asciimath =>', function(done) {
          data[1].should.have.property('type', 'asciimath');
          data[1].should.have.property('value', test.asciimath);
          done();
        });
        it('Should be return latex =>', function(done) {
          data[2].should.have.property('type', 'latex');
          data[2].should.have.property('value', test.latex);
          done();
        });
        it('Should be return html =>', function(done) {
          data[3].should.have.property('type', 'html');
          done();
        });
    });
  });
});

describe('Check u2212 for asciimath:', () => {
  const options = {
    outMath: {
      include_asciimath: true
    }
  };
  const test = `\\[3-x\\]`;
  const html = MM.render(test, options);
  const parsed = MM.parseMarkdownByHTML(html, false);
  describe('input_latex => ' + test, () => {
    it('Should be return html =>', function(done) {
      parsed[0].should.have.property('type', 'asciimath');
      parsed[0].value.charCodeAt(1).should.equal(45);
      parsed[0].value[1].should.equal('-');
      done();
    });
  });
});
