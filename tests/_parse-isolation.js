let chai = require('chai');
let should = chai.should();

const markdownIt = require('markdown-it');
const { mathpixMarkdownPlugin } = require('../lib/index.js');

const { JSDOM } = require('jsdom');
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

// Each sub-plugin (TOC, theorem, labels, footnotes, lists, text counters)
// holds module-level state. If those aren't reset per parse, re-rendering the
// same source on one md instance drifts — extra `-2` slugs, bumped section
// numbers, stale footnote refs.
describe('parse isolation: repeat-render of same source produces identical HTML', () => {
  const mkMd = () => markdownIt({ html: true, breaks: true }).use(mathpixMarkdownPlugin, {
    outMath: { include_svg: true }, mathJax: {}, renderElement: {},
    smiles: {}, forDocx: false, forLatex: false,
  });
  it('TOC with repeated headings does not accumulate slug suffixes', () => {
    const md = mkMd();
    const src = '[[toc]]\n\n# Introduction\n\n## Goals\n';
    const first = md.render(src);
    const second = md.render(src);
    const third = md.render(src);
    second.should.equal(first);
    third.should.equal(first);
  });
  it('section + equation label + footnote: three parses yield identical output', () => {
    const md = mkMd();
    const src =
      '[[toc]]\n\n' +
      '\\section{Intro}\n\n' +
      '\\begin{equation}\\label{E1}x=1\\end{equation}\n\n' +
      'See~\\ref{E1}. Also.\\footnote{note}\n';
    const first = md.render(src);
    const second = md.render(src);
    const third = md.render(src);
    second.should.equal(first);
    third.should.equal(first);
  });
  it('itemize with \\renewcommand{\\labelitemi}: second parse sees the fresh definition', () => {
    const md = mkMd();
    const srcA = '\\renewcommand{\\labelitemi}{*}\n\n' +
      '\\begin{itemize}\n\\item one\n\\item two\n\\end{itemize}\n';
    const srcB = '\\renewcommand{\\labelitemi}{\\dagger}\n\n' +
      '\\begin{itemize}\n\\item one\n\\item two\n\\end{itemize}\n';
    md.render(srcA);
    const second = md.render(srcB);
    // Second parse's marker must come from srcB's \renewcommand, not from
    // srcA's stale cached itemizeLevelTokens.
    second.should.not.include('>*<');
  });
  it('tabular parse error from doc 1 does not leak into doc 2', () => {
    const md = mkMd();
    const broken = '\\begin{tabular}{|c|}\nmissing end\n';
    const clean = '\\begin{tabular}{|c|}\n\\hline\nok \\\\\n\\hline\n\\end{tabular}\n';
    md.render(broken);
    const clean1 = md.render(clean);
    const clean2 = md.render(clean);
    clean2.should.equal(clean1);
  });
});
