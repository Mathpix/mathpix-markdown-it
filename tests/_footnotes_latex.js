let chai = require('chai');
let should = chai.should();

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;
const { getLabelsList } = require('../lib/index');

const options = {
  cwidth: 800
};


const { JSDOM } = require("jsdom");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;


describe('Check Latex Footnotes:', () => {
  describe('Check footnotes counter:', () => {
    const mmdContent = require('./_data/_footnotes_latex/_mmd/_mmd_01');
    const htmlContent = require('./_data/_footnotes_latex/_html/_html_01');
    const html = MM.markdownToHTML(mmdContent, options);
    it('Checking result html', (done) => {
      html.trim().should.equal(htmlContent);
      done();
    });
    MM.texReset();
  });

  describe('Check: \\footnotestext to one \\footnotemark:', () => {
    const mmdContent = require('./_data/_footnotes_latex/_mmd/_mmd_02');
    const htmlContent = require('./_data/_footnotes_latex/_html/_html_02');
    const html = MM.markdownToHTML(mmdContent, options);
    it('Checking result html', (done) => {
      html.trim().should.equal(htmlContent);
      done();
    });
    MM.texReset();
  });
  
  describe('Check Latex Footnotes with MD Footnotes:', () => {
    const mmdContent = require('./_data/_footnotes_latex/_mmd/_mmd_03');
    const htmlContent = require('./_data/_footnotes_latex/_html/_html_03');
    const html = MM.markdownToHTML(mmdContent, options);
    it('Checking result html', (done) => {
      html.trim().should.equal(htmlContent);
      done();
    });
    MM.texReset();
  });
});
