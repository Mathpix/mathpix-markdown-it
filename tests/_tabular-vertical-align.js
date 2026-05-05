const chai = require('chai');
chai.should();
const MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;
const markdownIt = require('markdown-it');
const { mathpixMarkdownPlugin } = require('../lib/index.js');

const { JSDOM } = require('jsdom');
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

describe('Tabular vertical-align bracket and defaultCellVerticalAlign option:', () => {
  const tests = require('./_data/_tabular-vertical-align/_data');
  tests.forEach(function (test) {
    describe(test.title, () => {
      it('Checking result html', (done) => {
        const html = MM.markdownToHTML(test.mmd, test.options || {});
        html.trim().should.equal(test.html);
        done();
      });
    });
  });
});

describe('forLatex round-trip via tableOpen.meta.pos:', () => {
  const parseTokens = (mmd, options = {}) => {
    const md = markdownIt().use(mathpixMarkdownPlugin, { forLatex: true, ...options });
    return md.parse(mmd, {});
  };
  const findTabularTable = (tokens) => {
    for (const t of tokens) {
      if (t.type === 'tabular' && Array.isArray(t.children)) {
        const open = t.children.find(c => c.token === 'table_open' || c.type === 'table_open');
        if (open) return open;
      }
    }
    return null;
  };

  it('source [t] is preserved in meta.pos', () => {
    const tokens = parseTokens('\\begin{tabular}[t]{|l|l|}\n\\hline\na & b \\\\\n\\hline\n\\end{tabular}');
    const open = findTabularTable(tokens);
    open.should.exist;
    open.meta.pos.should.equal('t');
  });

  it('source [b] is preserved in meta.pos', () => {
    const tokens = parseTokens('\\begin{tabular}[b]{|l|l|}\n\\hline\na & b \\\\\n\\hline\n\\end{tabular}');
    const open = findTabularTable(tokens);
    open.meta.pos.should.equal('b');
  });

  it('source [c] is preserved in meta.pos', () => {
    const tokens = parseTokens('\\begin{tabular}[c]{|l|l|}\n\\hline\na & b \\\\\n\\hline\n\\end{tabular}');
    const open = findTabularTable(tokens);
    open.meta.pos.should.equal('c');
  });

  it('absent bracket leaves meta.pos undefined', () => {
    const tokens = parseTokens('\\begin{tabular}{|l|l|}\n\\hline\na & b \\\\\n\\hline\n\\end{tabular}');
    const open = findTabularTable(tokens);
    chai.expect(open.meta.pos).to.be.undefined;
  });

  it("option 'top' injects meta.pos = 't' on absent-bracket tabular", () => {
    const tokens = parseTokens(
      '\\begin{tabular}{|l|l|}\n\\hline\na & b \\\\\n\\hline\n\\end{tabular}',
      { defaultCellVerticalAlign: 'top' }
    );
    const open = findTabularTable(tokens);
    open.meta.pos.should.equal('t');
  });

  it("option 'middle' does NOT inject meta.pos (round-trip preserved)", () => {
    const tokens = parseTokens(
      '\\begin{tabular}{|l|l|}\n\\hline\na & b \\\\\n\\hline\n\\end{tabular}',
      { defaultCellVerticalAlign: 'middle' }
    );
    const open = findTabularTable(tokens);
    chai.expect(open.meta.pos).to.be.undefined;
  });

  it("source [c] wins over option 'top' in meta.pos", () => {
    const tokens = parseTokens(
      '\\begin{tabular}[c]{|l|l|}\n\\hline\na & b \\\\\n\\hline\n\\end{tabular}',
      { defaultCellVerticalAlign: 'top' }
    );
    const open = findTabularTable(tokens);
    open.meta.pos.should.equal('c');
  });
});
