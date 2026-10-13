let chai = require('chai');
let should = chai.should();

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;
const mmdContent = require("./_data/_footnotes/_mmd");
const { htmlContent, htmlContentFootnote_compact_refs } = require("./_data/_footnotes/_html");

const { JSDOM } = require("jsdom");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;


describe('Check Footnotes:', () => {
  const html = MM.markdownToHTML(mmdContent);
  it('Checking result html', (done) => {
    html.trim().should.equal(htmlContent);
    done();
  });
  MM.texReset();
});

describe('Check Footnotes with compact_refs option set to true:', () => {
  const html = MM.markdownToHTML(mmdContent, {
    footnotes: {
      compact_refs: true
    }
  });
  it('Checking result html', (done) => {
    html.trim().should.equal(htmlContentFootnote_compact_refs);
    done();
  });
  MM.texReset();
});

describe('Inline footnote on a LaTeX list line, parsed before the core inline rule:', () => {
  it('renders the list and one footnote', (done) => {
    MM.texReset();
    const html = MM.markdownToHTML('\\begin{itemize}\n^[x]\n\\end{itemize}');
    html.should.include('<ul class="itemize"');
    (html.match(/class="footnote-item"/g) || []).length.should.equal(1);
    done();
  });
});
