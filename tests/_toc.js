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

// The TOC render rule reads its token list from the env stash set at parse
// time, so any inline-parse pass that rebinds `state.env` would drop it and
// emit an empty TOC. This test guards that invariant across tabular and
// footnote deep-walks where the nested inline.parse happens.
describe('TOC survives deep-inline walks (tabular + footnote):', () => {
  it('TOC links are emitted for a document with tabular and footnote content', () => {
    const src =
      '[[toc]]\n\n' +
      '\\section{Intro}\n\n' +
      'Note.\\footnote{see \\cite{X}}\n\n' +
      '\\begin{tabular}{|c|c|} \\hline a & b \\\\ \\hline $x^2$ & 1 \\\\ \\hline \\end{tabular}\n';
    const html = MathpixMarkdownModel.markdownToHTML(src, options);
    const toc = MathpixMarkdownModel.getTocContainerHTML(html, false);
    toc.should.include('Intro');
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

