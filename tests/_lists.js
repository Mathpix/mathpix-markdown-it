let chai = require('chai');
let should = chai.should();

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;

const options = {
  cwidth: 800,
  htmlTags: true
};


const { JSDOM } = require("jsdom");
const tests = require("./_data/_lists/_data");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;


describe('Check Lists:', () => {
  const tests = require('./_data/_lists/_data');
  tests.forEach(function(test) {
    const html = MM.markdownToHTML(test.latex, options);
    describe('Latex => ' + test.latex, () => {
      it('Checking result html', (done) => {
        html.should.equal(test.html);
        done();
      });
     });
  });
});

describe('Check Lists inside tabular:', () => {
  const tests = require('./_data/_lists/_data_lists_inside_tabular');
  tests.forEach(function(test) {
    const html = MM.markdownToHTML(test.mmd, options);
    describe('Latex => ' + test.mmd, () => {
      it('Checking result html', (done) => {
        html.should.equal(test.html);
        done();
      });
    });
  });
});

describe('\\item detection requires a real command, not a \\item-prefixed one:', () => {
  // \itemsep / \itemindent (and the word "item") must not be mistaken for \item.
  const liCount = (src) => (MM.markdownToHTML(src, options).match(/<li /g) || []).length;
  it('\\itemsep in an item body does not add an item', () =>
    liCount('\\begin{itemize}\n\\item first \\setlength{\\itemsep}{0pt} rest\n\\item second\n\\end{itemize}').should.equal(2));
  it('\\itemindent at the start of an item body does not add an item', () =>
    liCount('\\begin{itemize}\n\\item[] \\itemindent=2em some text\n\\end{itemize}').should.equal(1));
  it('\\itemsep inline between items does not add an item', () =>
    liCount('\\begin{itemize}\\item a \\itemsep b\\item c\\end{itemize}').should.equal(2));
  it('real \\item still splits', () =>
    liCount('\\begin{itemize}\\item a\\item b\\end{itemize}').should.equal(2));
});
