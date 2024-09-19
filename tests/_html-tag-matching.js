let chai = require('chai');
let should = chai.should();

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;


const { JSDOM } = require("jsdom");
const tests = require("./_data/_sanitizeHtml/_data");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

describe('Check html tags.', () => {
  const options = {
    width: 800,
  };
  const tests = require('./_data/_html-tag-matching/_data');

  tests.forEach(function(test) {
    const html = MM.markdownToHTML(test.mmd, Object.assign(
      {}, {...options},
      {
      htmlTags: true
    }));
    // console.log("[html]=>");
    // console.log(html);
    describe('Should be html with the validation that checks for matching opening and closing HTML tags => ' + test.mmd, () => {
      it('Checking result html', (done) => {
        html.trim().should.equal(test.html);
        done();
      });
    });
  });

  tests.forEach(function(test) {
    const htmlDisableTagMatching = MM.markdownToHTML(test.mmd, Object.assign(
      {}, {...options},
      {
        htmlTags: true,
        htmlDisableTagMatching: true,
      }));
    describe('Should be html without the validation that checks for matching opening and closing HTML tags => ' + test.mmd, () => {
      it('Checking result html', (done) => {
        htmlDisableTagMatching.trim().should.equal(test.htmlDisableTagMatching);
        done();
      });
    });
  });

  tests.forEach(function(test) {
    const htmlTagsDisable = MM.markdownToHTML(test.mmd, Object.assign(
      {}, {...options},
      {
        htmlTags: false
      }));
    describe('Should be disable html rendering => ' + test.mmd, () => {
      it('Checking result html', (done) => {
        htmlTagsDisable.trim().should.equal(test.htmlTagsDisable);
        done();
      });
    });
  });
});
