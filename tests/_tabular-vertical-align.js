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

describe('forLatex round-trip via tableOpen.meta.bracket:', () => {
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

  it('source [t] is preserved in meta.bracket', () => {
    const tokens = parseTokens('\\begin{tabular}[t]{|l|l|}\n\\hline\na & b \\\\\n\\hline\n\\end{tabular}');
    const open = findTabularTable(tokens);
    open.should.exist;
    open.meta.bracket.should.equal('t');
  });

  it('source [b] is preserved in meta.bracket', () => {
    const tokens = parseTokens('\\begin{tabular}[b]{|l|l|}\n\\hline\na & b \\\\\n\\hline\n\\end{tabular}');
    const open = findTabularTable(tokens);
    open.meta.bracket.should.equal('b');
  });

  it('source [c] is preserved in meta.bracket', () => {
    const tokens = parseTokens('\\begin{tabular}[c]{|l|l|}\n\\hline\na & b \\\\\n\\hline\n\\end{tabular}');
    const open = findTabularTable(tokens);
    open.meta.bracket.should.equal('c');
  });

  it('absent bracket leaves meta.bracket undefined', () => {
    const tokens = parseTokens('\\begin{tabular}{|l|l|}\n\\hline\na & b \\\\\n\\hline\n\\end{tabular}');
    const open = findTabularTable(tokens);
    chai.expect(open.meta.bracket).to.be.undefined;
  });

  it("option 'top' injects meta.bracket = 't' on absent-bracket tabular", () => {
    const tokens = parseTokens(
      '\\begin{tabular}{|l|l|}\n\\hline\na & b \\\\\n\\hline\n\\end{tabular}',
      { defaultCellVerticalAlign: 'top' }
    );
    const open = findTabularTable(tokens);
    open.meta.bracket.should.equal('t');
  });

  it("option 'middle' does NOT inject meta.bracket (round-trip preserved)", () => {
    const tokens = parseTokens(
      '\\begin{tabular}{|l|l|}\n\\hline\na & b \\\\\n\\hline\n\\end{tabular}',
      { defaultCellVerticalAlign: 'middle' }
    );
    const open = findTabularTable(tokens);
    chai.expect(open.meta.bracket).to.be.undefined;
  });

  it("source [c] wins over option 'top' in meta.bracket", () => {
    const tokens = parseTokens(
      '\\begin{tabular}[c]{|l|l|}\n\\hline\na & b \\\\\n\\hline\n\\end{tabular}',
      { defaultCellVerticalAlign: 'top' }
    );
    const open = findTabularTable(tokens);
    open.meta.bracket.should.equal('c');
  });
});

describe('forLatex parent bracket on td_open:', () => {
  const parseTokens = (mmd, options = {}) => {
    const md = markdownIt().use(mathpixMarkdownPlugin, { forLatex: true, ...options });
    return md.parse(mmd, {});
  };
  // Find all td_open tokens at any depth.
  const findAllTdOpens = (tokens) => {
    const tds = [];
    const walk = (toks) => {
      if (!Array.isArray(toks)) return;
      for (const t of toks) {
        if (t.token === 'td_open' || t.type === 'td_open') tds.push(t);
        if (Array.isArray(t.children)) walk(t.children);
      }
    };
    walk(tokens);
    return tds;
  };

  it('outer [t] → exactly 2 outer td_opens have parentBracket="t", inner has no parentBracket', () => {
    const tokens = parseTokens(
      '\\begin{tabular}[t]{|l|l|}\n\\hline\n\\begin{tabular}{l}\nx \\\\ y\n\\end{tabular} & b \\\\\n\\hline\n\\end{tabular}'
    );
    const tds = findAllTdOpens(tokens);
    const outerTds = tds.filter(t => t.meta?.parentBracket === 't');
    outerTds.length.should.equal(2);
    const innerTds = tds.filter(t => !t.meta?.parentBracket);
    innerTds.length.should.equal(2); // inner tabular's two cells (x, y) — outer has no bracket pushed onto inner
  });

  it('outer [b] → exactly 2 outer td_opens have parentBracket="b"', () => {
    const tokens = parseTokens(
      '\\begin{tabular}[b]{|l|l|}\n\\hline\n\\begin{tabular}{l}\nx \\\\ y\n\\end{tabular} & b \\\\\n\\hline\n\\end{tabular}'
    );
    const tds = findAllTdOpens(tokens);
    const outerTds = tds.filter(t => t.meta?.parentBracket === 'b');
    outerTds.length.should.equal(2);
  });

  it('outer without bracket → no parentBracket on any td_open', () => {
    const tokens = parseTokens(
      '\\begin{tabular}{|l|l|}\n\\hline\n\\begin{tabular}{l}\nx \\\\ y\n\\end{tabular} & b \\\\\n\\hline\n\\end{tabular}'
    );
    const tds = findAllTdOpens(tokens);
    tds.every(t => !t.meta?.parentBracket).should.be.true;
  });

  it("option 'top' applies only to outer (top-level) — inner stays bracket-less for round-trip", () => {
    const tokens = parseTokens(
      '\\begin{tabular}{|l|l|}\n\\hline\n\\begin{tabular}{l}\nx \\\\ y\n\\end{tabular} & b \\\\\n\\hline\n\\end{tabular}',
      { defaultCellVerticalAlign: 'top' }
    );
    const tds = findAllTdOpens(tokens);
    tds.length.should.equal(4);
    const outerWithT = tds.filter(t => t.meta?.parentBracket === 't');
    const innerWithoutBracket = tds.filter(t => !t.meta?.parentBracket);
    outerWithT.length.should.equal(2);
    innerWithoutBracket.length.should.equal(2);
  });

  it("option 'middle' (round-trip preserved) → no parentBracket on td_opens", () => {
    const tokens = parseTokens(
      '\\begin{tabular}{|l|l|}\n\\hline\n\\begin{tabular}{l}\nx \\\\ y\n\\end{tabular} & b \\\\\n\\hline\n\\end{tabular}',
      { defaultCellVerticalAlign: 'middle' }
    );
    const tds = findAllTdOpens(tokens);
    tds.every(t => !t.meta?.parentBracket).should.be.true;
  });
});
