let chai = require('chai');
let should = chai.should();

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;

const options = {
  cwidth: 800
};


const { JSDOM } = require("jsdom");
const tests = require("./_data/_tabular/_data");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

describe('Check Mathjax:', () => {
  const tests = require('./_data/_tabular/_data');
  tests.forEach(function(test) {
    const html = MM.markdownToHTML(test.latex, options);
    describe('Latex => ' + test.latex, () => {
      it('Checking result html', (done) => {
        html.trim().should.equal(test.svg);
        done();
      });
    });
  });
});

describe('Check Mathjax:', () => {
  const tests = require('./_data/_tabular/_data_sub');
  tests.forEach(function(test) {
    const html = MM.markdownToHTML(test.latex, options);
    describe('Latex => ' + test.latex, () => {
      it('Checking result html', (done) => {
        html.trim().should.equal(test.svg);
        done();
      });
    });
  });
});
