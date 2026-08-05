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

// A `\renewcommand` line inside a list body renders to nothing, so joining it to the previous item
// with a line break left an orphan `<br>`. A plain continuation line still breaks — that is content.
describe('A no-output command between items leaves no orphan <br>:', () => {
  const itemBodies = (src) => {
    const html = MM.markdownToHTML(src, { outMath: { include_svg: false } });
    return (html.match(/<li[\s\S]*?<\/li>/g) || []).map((li) => li
      .replace(/<span class="li_level"[^>]*>[\s\S]*?<\/span>/g, '')
      .replace(/<li[^>]*>/, '')
      .replace('</li>', ''));
  };
  it('\\renewcommand between items does not break the item above it', () => {
    itemBodies('\\begin{itemize}\n\\item a\n\\renewcommand{\\labelitemi}{ZZZ}\n\\item b\n\\end{itemize}')
      .should.deep.equal(['a', 'b']);
  });
  it('a plain continuation line keeps its break', () => {
    itemBodies('\\begin{itemize}\n\\item a\ntail text\n\\item b\n\\end{itemize}')
      .should.deep.equal(['a<br>\ntail text', 'b']);
  });
  it('an unsupported command stays visible, on its own line', () => {
    itemBodies('\\begin{itemize}\n\\item a\n\\itemsep 1pt\n\\item b\n\\end{itemize}')
      .should.deep.equal(['a<br>\n\\itemsep 1pt', 'b']);
  });
});
