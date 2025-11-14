let chai = require('chai');
let should = chai.should();

let { MathpixMarkdownModel, TTocStyle} = require('../lib/mathpix-markdown-model/index');

const { JSDOM } = require("jsdom");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

describe('Check sections:', () => {
  const options = {};
  const tests = require('./_data/_sections/_data');
  tests.forEach(function(test) {
    const html = MathpixMarkdownModel.markdownToHTML(test.latex, options);
    const htmlSummary = MathpixMarkdownModel.markdownToHTML(test.latex, {
      ...options,
      toc: {
        style: TTocStyle.summary,
        doNotGenerateParentId: true
      }
    });
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
    //excludeUnnumberedFromTOC
    const html_excludeUnnumberedFromTOC = MathpixMarkdownModel.markdownToHTML(test.latex, {
      ...options,
      toc: {
        excludeUnnumberedFromTOC: true
      }
    });
    const htmlSummary_excludeUnnumberedFromTOC = MathpixMarkdownModel.markdownToHTML(test.latex, {
      ...options,
      toc: {
        style: TTocStyle.summary,
        doNotGenerateParentId: true,
        excludeUnnumberedFromTOC: true
      }
    });
    describe('Latex => ' + test.latex, () => {
      it('Checking result html', (done) => {
        html_excludeUnnumberedFromTOC.trim().should.equal(test.html_excludeUnnumberedFromTOC);
        done();
      });

      it('Checking result html toc by default', (done) => {
        const tocHtml_excludeUnnumberedFromTOC = MathpixMarkdownModel.getTocContainerHTML(html_excludeUnnumberedFromTOC, false);
        tocHtml_excludeUnnumberedFromTOC.trim().should.equal(test.tocHtml_excludeUnnumberedFromTOC);
        done();
      });

      it('Checking result html toc as summary', (done) => {
        const tocHtmlSummary_excludeUnnumberedFromTOC = MathpixMarkdownModel.getTocContainerHTML(htmlSummary_excludeUnnumberedFromTOC, false);
        tocHtmlSummary_excludeUnnumberedFromTOC.trim().should.equal(test.tocHtmlSummary_excludeUnnumberedFromTOC);
        done();
      });
    });
  });
  MathpixMarkdownModel.texReset();
});

