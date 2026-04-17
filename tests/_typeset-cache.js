let chai = require('chai');
let should = chai.should();
let MathJax = require('../lib/mathjax/index.js').MathJax;
let { MathpixMarkdownModel } = require('../lib/index.js');
const markdownIt = require('markdown-it');
const { mathpixMarkdownPlugin } = require('../lib/index.js');

describe('MathJax typeset cache:', () => {
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
  it('cache is cleared between parse calls on same md instance', () => {
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
  it('cache respects typesetCacheSize limit (cap=2, 4 unique, 6 calls over 2 passes)', () => {
    const md = markdownIt({ html: true, breaks: true }).use(mathpixMarkdownPlugin, {
      typesetCacheSize: 2,
      outMath: { include_svg: true }, mathJax: {}, renderElement: {},
      smiles: {}, forDocx: false, forLatex: false,
    });
    md.render('$a$ $b$ $c$ $d$ $a$ $b$ $c$ $d$');
    callCount.should.equal(6);
  });
  it('cache isolates between two md instances with different options', () => {
    const md1 = markdownIt({ html: true, breaks: true }).use(mathpixMarkdownPlugin, {
      outMath: { include_svg: true }, mathJax: {}, renderElement: {},
      smiles: {}, forDocx: false, forLatex: false,
    });
    const md2 = markdownIt({ html: true, breaks: true }).use(mathpixMarkdownPlugin, {
      outMath: { include_svg: false }, mathJax: {}, renderElement: {},
      smiles: {}, forDocx: false, forLatex: false,
    });
    md1.render('$x$');
    callCount.should.equal(1);
    md2.render('$x$');
    callCount.should.equal(2);
  });
  it('output_format=latex preserves different inputLatex for same math content', () => {
    const md = markdownIt({ html: true, breaks: true }).use(mathpixMarkdownPlugin, {
      outMath: { include_svg: true, output_format: 'latex' }, mathJax: {}, renderElement: {},
      smiles: {}, forDocx: false, forLatex: false,
    });
    const html = md.render('$x^2$ and \\(x^2\\)');
    html.should.include('$x^2$');
    html.should.match(/\\\(x\^2\\\)/);
  });
});
