let chai = require('chai');
let should = chai.should();

let { MathpixMarkdownModel, TTocStyle} = require('../lib/mathpix-markdown-model/index');

const options = {
  cwidth: 800,
};

const { JSDOM } = require("jsdom");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

describe('Check TOC list:', () => {
  const tests = require('./_data/_toc/_data-list');
  tests.forEach(function(test) {
    const html = MathpixMarkdownModel.markdownToHTML(test.latex, options);
    describe('Latex => ' + test.latex, () => {
      it('Checking result html', (done) => {
        const tocHtml = MathpixMarkdownModel.getTocContainerHTML(html, false);
        tocHtml.trim().should.equal(test.html);
        done();
      });
    });
  });
  MathpixMarkdownModel.texReset();
});

describe('Check TOC summary:', () => {
  const tests = require('./_data/_toc/_data-summary');
  tests.forEach(function(test) {
    const html = MathpixMarkdownModel.markdownToHTML(test.latex,
      Object.assign({}, options, {
        toc: {
          style: TTocStyle.summary,
          doNotGenerateParentId: true
        }
      } ));
    describe('Latex => ' + test.latex, () => {
      it('Checking result html', (done) => {
        const tocHtml = MathpixMarkdownModel.getTocContainerHTML(html, false);
        tocHtml.trim().should.equal(test.html);
        done();
      });
    });
  });
  MathpixMarkdownModel.texReset();
});

