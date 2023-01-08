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

describe('Check sections:', () => {
  const tests = require('./_data/_sections/_data');
  tests.forEach(function(test) {
    const html = MathpixMarkdownModel.markdownToHTML(test.latex, options);
    const htmlSummary = MathpixMarkdownModel.markdownToHTML(test.latex,       
      Object.assign({}, options, {
      toc: {
        style: TTocStyle.summary,
        doNotGenerateParentId: true
      }
    }));
    describe('Latex => ' + test.latex, () => {
      it('Checking result html', (done) => {
        html.trim().should.equal(test.html);
        done();
      });      
      
      it('Checking result html toc by default', (done) => {
        const tocHtml = MathpixMarkdownModel.getTocContainerHTML(html, false);
        tocHtml.trim().should.equal(test.tocHtml);
        done();
      });      
      
      it('Checking result html toc as summary', (done) => {
        const tocHtmlSummary = MathpixMarkdownModel.getTocContainerHTML(htmlSummary, false);
        tocHtmlSummary.trim().should.equal(test.tocHtmlSummary);
        done();
      });
    });
  });
  MathpixMarkdownModel.texReset();
});

