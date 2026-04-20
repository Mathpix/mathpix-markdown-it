let chai = require('chai');
let should = chai.should();
let MathJax = require('../lib/mathjax/index.js').MathJax;
let { MathpixMarkdownModel } = require('../lib/index.js');
const markdownIt = require('markdown-it');
const { mathpixMarkdownPlugin } = require('../lib/index.js');

describe('MathJax per-parse typeset cache (state.env scoped):', () => {
  let origTypeset;
  let callCount;
  beforeEach(() => {
    callCount = 0;
    origTypeset = MathJax.Typeset;
    MathJax.Typeset = function(...args) {
      callCount++;
      return origTypeset.apply(this, args);
    };
  });
  afterEach(() => {
    MathJax.Typeset = origTypeset;
  });
  it('duplicate inline_math uses cache (1 MathJax call for 3 identical)', () => {
    MathpixMarkdownModel.markdownToHTML('$x^2$ and $x^2$ and $x^2$');
    callCount.should.equal(1);
  });
  it('different inline_math expressions are not confused', () => {
    const html = MathpixMarkdownModel.markdownToHTML('$x$ and $y$');
    html.should.be.a('string');
    callCount.should.equal(2);
  });
  it('equation_math is NOT cached (numbering side effects)', () => {
    MathpixMarkdownModel.markdownToHTML(
      '\\begin{equation}a=1\\end{equation}\n\\begin{equation}a=1\\end{equation}'
    );
    callCount.should.equal(2);
  });
  it('cache does NOT persist between md.parse calls on same instance', () => {
    const md = markdownIt({ html: true, breaks: true }).use(mathpixMarkdownPlugin, {
      outMath: { include_svg: true }, mathJax: {}, renderElement: {},
      smiles: {}, forDocx: false, forLatex: false,
    });
    md.render('$x^2$');
    callCount.should.equal(1);
    md.render('$x^2$');
    callCount.should.equal(2);
  });
  it('display_math is cached separately from inline_math', () => {
    MathpixMarkdownModel.markdownToHTML('$x^2$ and $$x^2$$');
    callCount.should.equal(2);
  });
  it('cache is scoped to env — passing different env creates isolated caches', () => {
    const md = markdownIt({ html: true, breaks: true }).use(mathpixMarkdownPlugin, {
      outMath: { include_svg: true }, mathJax: {}, renderElement: {},
      smiles: {}, forDocx: false, forLatex: false,
    });
    md.parse('$x$', {});
    callCount.should.equal(1);
    md.parse('$x$', {});
    callCount.should.equal(2);
  });
  it('reusing env across parses still produces fresh cache (init hook resets)', () => {
    const md = markdownIt({ html: true, breaks: true }).use(mathpixMarkdownPlugin, {
      outMath: { include_svg: true }, mathJax: {}, renderElement: {},
      smiles: {}, forDocx: false, forLatex: false,
    });
    const env = {};
    md.parse('$x$', env);
    callCount.should.equal(1);
    md.parse('$x$', env);
    callCount.should.equal(2);
  });
  it('cache returns isolated data — mutation does not corrupt cache', () => {
    const md = markdownIt({ html: true, breaks: true }).use(mathpixMarkdownPlugin, {
      outMath: { include_svg: true }, mathJax: {}, renderElement: {},
      smiles: {}, forDocx: false, forLatex: false,
    });
    const tokens = md.parse('$x^2$ and $x^2$', {});
    const mathTokens = tokens.flatMap(t => t.children || []).filter(t => t.type === 'inline_math');
    mathTokens.length.should.equal(2);
    // Each token must get its own mathData object (not a shared reference)
    // so that mutating one does not leak into cache or other tokens.
    mathTokens[0].mathData.should.not.equal(mathTokens[1].mathData);
    mathTokens[0].mathEquation.should.be.a('string');
    mathTokens[0].mathEquation = 'CORRUPTED';
    mathTokens[1].mathEquation.should.not.equal('CORRUPTED');
  });
  it('output_format=latex preserves different inputLatex for same math content', () => {
    MathJax.Typeset = origTypeset;
    const md = markdownIt({ html: true, breaks: true }).use(mathpixMarkdownPlugin, {
      outMath: { include_svg: true, output_format: 'latex' }, mathJax: {}, renderElement: {},
      smiles: {}, forDocx: false, forLatex: false,
    });
    const html = md.render('$x^2$ and \\(x^2\\)');
    html.should.include('$x^2$');
    html.should.match(/\\\(x\^2\\\)/);
  });
  it('cached math with accessibility produces unique mjx-mml IDs', () => {
    MathJax.Typeset = origTypeset;
    const html = MathpixMarkdownModel.markdownToHTML(
      '$\\leftarrow$ and $\\leftarrow$ and $\\leftarrow$',
      { outMath: { include_svg: true }, accessibility: { assistiveMml: true }, previewUuid: 'ID' }
    );
    const ids = [...html.matchAll(/<mjx-assistive-mml[^>]*\bid="([^"]+)"/g)].map(m => m[1]);
    ids.length.should.be.at.least(3);
    new Set(ids).size.should.equal(ids.length);
  });
  it('cache works with unusual previewUuid containing special chars', () => {
    MathJax.Typeset = origTypeset;
    const html = MathpixMarkdownModel.markdownToHTML(
      '$\\leftarrow$ and $\\leftarrow$',
      { outMath: { include_svg: true }, accessibility: { assistiveMml: true }, previewUuid: 'my_uuid.v2' }
    );
    const ids = [...html.matchAll(/<mjx-assistive-mml[^>]*\bid="([^"]+)"/g)].map(m => m[1]);
    ids.length.should.be.at.least(2);
    new Set(ids).size.should.equal(ids.length);
  });
  it('beginCacheBypass/endCacheBypass controls cache bypass counter', () => {
    const { initMathCache, beginCacheBypass, endCacheBypass } = require('../lib/markdown/common/convert-math-to-html');
    const state = { env: {} };
    initMathCache(state);
    state.env.__mathpix.cacheBypass.should.equal(0);
    beginCacheBypass(state);
    state.env.__mathpix.cacheBypass.should.equal(1);
    beginCacheBypass(state);
    state.env.__mathpix.cacheBypass.should.equal(2);
    endCacheBypass(state);
    state.env.__mathpix.cacheBypass.should.equal(1);
    endCacheBypass(state);
    state.env.__mathpix.cacheBypass.should.equal(0);
  });
  it('endCacheBypass does not go below zero', () => {
    const { initMathCache, endCacheBypass } = require('../lib/markdown/common/convert-math-to-html');
    const state = { env: {} };
    initMathCache(state);
    endCacheBypass(state);
    state.env.__mathpix.cacheBypass.should.equal(0);
  });
  it('SetItemizeLevelTokens with forDocx does not pollute cache for main text', () => {
    MathJax.Typeset = origTypeset;
    const md = markdownIt({ html: true, breaks: true }).use(mathpixMarkdownPlugin, {
      outMath: { include_svg: true, include_mathml_word: true },
      forDocx: true,
      mathJax: {}, renderElement: {}, smiles: {},
    });
    const doc = '\\renewcommand{\\labelitemi}{$\\alpha$}\n\n' +
      '\\begin{itemize}\n\\item item text\n\\end{itemize}\n\n' +
      'Inline: $\\alpha$ here.';
    const html = md.render(doc);
    (html.match(/<mathmlword/gi) || []).length.should.be.greaterThan(0);
  });
  it('duplicate display_math with \\label runs MathJax once and registers the label once', () => {
    const { clearLabelsList, getLabelsList } = require('../lib/markdown/common/labels.js');
    clearLabelsList();
    const { MathpixMarkdownModel } = require('../lib/index.js');
    MathpixMarkdownModel.markdownToHTML(
      '$$a\\label{eqA}$$\n\n$$a\\label{eqA}$$',
      { outMath: { include_svg: true }, mathJax: {} }
    );
    callCount.should.equal(1);
    getLabelsList().filter(l => l.key === 'eqA').length.should.equal(1);
  });
  // Per-parse caches (subTabular / mathTable / etc) must be empty at the start
  // of every parse — otherwise repeated parses on the same md instance drift.
  it('repeated parses on the same md instance produce identical output', () => {
    const md = markdownIt({ html: true, breaks: true }).use(mathpixMarkdownPlugin, {
      outMath: { include_svg: true }, mathJax: {}, renderElement: {},
      smiles: {}, forDocx: false, forLatex: false,
    });
    const src = '\\begin{tabular}{|c|} \\hline $x$ \\\\ \\hline \\end{tabular}';
    const first = md.render(src);
    for (let i = 0; i < 4; i++) {
      md.render(src).should.equal(first);
    }
  });
});
