const chai = require('chai');
chai.should();
const markdownIt = require('markdown-it');
const { mathpixMarkdownPlugin } = require('../lib/index.js');

const { JSDOM } = require('jsdom');
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

describe('figure/table placement: meta.placement and meta.type on paragraph_open (forLatex):', () => {
  const parseTokens = (mmd, options = {}) => {
    const md = markdownIt().use(mathpixMarkdownPlugin, { forLatex: true, ...options });
    return md.parse(mmd, {});
  };
  const findFirstParagraphOpen = (tokens) => {
    for (const t of tokens) {
      if (t.type === 'paragraph_open' && t.parentType === 'table') return t;
    }
    return null;
  };
  it('figure with explicit [t]: meta.placement === "t", meta.type === "figure"', () => {
    const tokens = parseTokens('\\begin{figure}[t]\n\\includegraphics{img.png}\n\\end{figure}');
    const open = findFirstParagraphOpen(tokens);
    open.should.exist;
    open.meta.placement.should.equal('t');
    open.meta.type.should.equal('figure');
  });
  it('figure with explicit [!h]: meta.placement === "!h"', () => {
    const tokens = parseTokens('\\begin{figure}[!h]\n\\includegraphics{img.png}\n\\end{figure}');
    const open = findFirstParagraphOpen(tokens);
    open.meta.placement.should.equal('!h');
    open.meta.type.should.equal('figure');
  });
  it('figure with explicit [H]: meta.placement === "H"', () => {
    const tokens = parseTokens('\\begin{figure}[H]\n\\includegraphics{img.png}\n\\end{figure}');
    const open = findFirstParagraphOpen(tokens);
    open.meta.placement.should.equal('H');
  });
  it('figure without bracket: meta.placement is undefined, meta.type === "figure"', () => {
    const tokens = parseTokens('\\begin{figure}\n\\includegraphics{img.png}\n\\end{figure}');
    const open = findFirstParagraphOpen(tokens);
    chai.expect(open.meta.placement).to.be.undefined;
    open.meta.type.should.equal('figure');
  });
  it('table with explicit [b]: meta.placement === "b", meta.type === "table"', () => {
    const tokens = parseTokens('\\begin{table}[b]\n\\begin{tabular}{|l|}\\hline x \\\\\\hline\\end{tabular}\n\\end{table}');
    const open = findFirstParagraphOpen(tokens);
    open.meta.placement.should.equal('b');
    open.meta.type.should.equal('table');
  });
  it('table without bracket: meta.placement is undefined, meta.type === "table"', () => {
    const tokens = parseTokens('\\begin{table}\n\\begin{tabular}{|l|}\\hline x \\\\\\hline\\end{tabular}\n\\end{table}');
    const open = findFirstParagraphOpen(tokens);
    chai.expect(open.meta.placement).to.be.undefined;
    open.meta.type.should.equal('table');
  });
  it('whitespace between env name and bracket: \\begin{figure}  [t] still captures "t"', () => {
    const tokens = parseTokens('\\begin{figure}  [t]\n\\includegraphics{img.png}\n\\end{figure}');
    const open = findFirstParagraphOpen(tokens);
    open.meta.placement.should.equal('t');
  });
  it('token.latex remains \\begin{figure}[h] regardless of source (back-compat)', () => {
    const explicitT = parseTokens('\\begin{figure}[t]\n\\includegraphics{img.png}\n\\end{figure}');
    findFirstParagraphOpen(explicitT).latex.should.equal('\\begin{figure}[h]');
    const noBracket = parseTokens('\\begin{figure}\n\\includegraphics{img.png}\n\\end{figure}');
    findFirstParagraphOpen(noBracket).latex.should.equal('\\begin{figure}[h]');
  });
});
