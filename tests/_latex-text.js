let chai = require('chai');
let should = chai.should();

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;

const options = {
  cwidth: 800,
  lineNumbering: false,
  htmlTags: true
};


const { JSDOM } = require("jsdom");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;


describe('Check Latex Text Styles:', () => {
  const tests = require('./_data/_latex-text/_data');
  tests.forEach(function(test) {
    const html = MM.markdownToHTML(test.latex, options).trim();
    describe('Latex => ' + test.latex, () => {
      it('Checking result html', (done) => {
        html.should.equal(test.html);
        done();
      });
    });
  });
});

describe('Check Latex page break:', () => {
  const tests = require('./_data/_latex-text/_pageBreak');
  tests.forEach(function(test) {
    const html = MM.markdownToHTML(test.latex, options).trim();
    describe('Latex => ' + test.latex, () => {
      it('Checking result html', (done) => {
        html.should.equal(test.html);
        done();
      });
    });    
    
    const htmlShowHiddenTags = MM.markdownToHTML(test.latex, 
      Object.assign({}, options, { showPageBreaks: true })).trim();
    describe('Latex => ' + test.latex, () => {
      it('Checking result html with option showPageBreaks', (done) => {
        htmlShowHiddenTags.should.equal(test.showPageBreaks);
        done();
      });
    });
  });
});
