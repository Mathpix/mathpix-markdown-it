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

// `\item` detection: the rule is `\item` not followed by a letter, so `\itemsep` stays text while
// `\item2`/`\item*` open an item. Pinned as measured, so a regex refactor cannot change it silently.
describe('What counts as \\item inside a list body:', () => {
  const itemBodies = (line) => {
    const html = MM.markdownToHTML('\\begin{itemize}\n\\item a\n' + line + '\n\\end{itemize}',
      { outMath: { include_svg: false } });
    return (html.match(/<li[\s\S]*?<\/li>/g) || []).map((li) => li
      .replace(/<span class="li_level"[^>]*>[\s\S]*?<\/span>/g, '')
      .replace(/<li[^>]*>/, '')
      .replace('</li>', ''));
  };
  const staysText = {
    '\\itemsep 1pt': 'a<br>\n\\itemsep 1pt',
    '\\itemindent 2pt': 'a<br>\n\\itemindent 2pt',
    '\\itemize x': 'a<br>\n\\itemize x',
    'the word item here': 'a<br>\nthe word item here',
  };
  Object.entries(staysText).forEach(([line, expected]) => {
    it(`"${line}" stays inside the item above it`, () => {
      itemBodies(line).should.deep.equal([expected]);
    });
  });
  // A digit or a star is a legal `\item` argument in LaTeX, so these do open an item.
  it('"\\item2 b" opens an item whose body is "2 b"', () => {
    itemBodies('\\item2 b').should.deep.equal(['a', '2 b']);
  });
  it('"\\item* b" opens an item whose body is "* b"', () => {
    itemBodies('\\item* b').should.deep.equal(['a', '* b']);
  });
  // A trailing `\item` with nothing after it: the text before it stays, the empty item is emitted.
  it('a line ending in "\\item" leaves the text and an empty item', () => {
    itemBodies('text \\item').should.deep.equal(['a<br>\ntext', '']);
  });
});
