let chai = require('chai');
let should = chai.should();
let MathJax = require('../lib/mathjax/index.js').MathJax;
let { MathpixMarkdownModel } = require('../lib/index.js');

describe('MathJax typeset cache:', () => {
  it('duplicate inline_math uses cache (fewer MathJax calls)', () => {
    let callCount = 0;
    const origTypeset = MathJax.Typeset;
    MathJax.Typeset = function(...args) {
      callCount++;
      return origTypeset.apply(this, args);
    };
    try {
      MathpixMarkdownModel.markdownToHTML('$x^2$ and $x^2$ and $x^2$');
      callCount.should.equal(1);
    } finally {
      MathJax.Typeset = origTypeset;
    }
  });
  it('different inline_math expressions are not confused', () => {
    const html = MathpixMarkdownModel.markdownToHTML('$x$ and $y$');
    html.should.be.a('string');
    html.length.should.be.greaterThan(0);
  });
  it('equation_math is NOT cached (numbering side effects)', () => {
    let callCount = 0;
    const origTypeset = MathJax.Typeset;
    MathJax.Typeset = function(...args) {
      callCount++;
      return origTypeset.apply(this, args);
    };
    try {
      MathpixMarkdownModel.markdownToHTML(
        '\\begin{equation}a=1\\end{equation}\n\\begin{equation}a=1\\end{equation}'
      );
      callCount.should.equal(2);
    } finally {
      MathJax.Typeset = origTypeset;
    }
  });
  it('cache is cleared between parse calls on same md instance', () => {
    let callCount = 0;
    const origTypeset = MathJax.Typeset;
    MathJax.Typeset = function(...args) {
      callCount++;
      return origTypeset.apply(this, args);
    };
    try {
      const markdownIt = require('markdown-it');
      const { mathpixMarkdownPlugin } = require('../lib/index.js');
      const md = markdownIt({ html: true, breaks: true }).use(mathpixMarkdownPlugin, {
        outMath: { include_svg: true }, mathJax: {}, renderElement: {},
        smiles: {}, forDocx: false, forLatex: false,
      });
      md.render('$x^2$');
      const firstCount = callCount;
      firstCount.should.equal(1);
      md.render('$x^2$');
      const secondCount = callCount - firstCount;
      secondCount.should.equal(1);
    } finally {
      MathJax.Typeset = origTypeset;
    }
  });
  it('display_math is cached separately from inline_math', () => {
    let callCount = 0;
    const origTypeset = MathJax.Typeset;
    MathJax.Typeset = function(...args) {
      callCount++;
      return origTypeset.apply(this, args);
    };
    try {
      MathpixMarkdownModel.markdownToHTML('$x^2$ and $$x^2$$');
      callCount.should.equal(2);
    } finally {
      MathJax.Typeset = origTypeset;
    }
  });

  it('cache respects typesetCacheSize limit', () => {
    let callCount = 0;
    const origTypeset = MathJax.Typeset;
    MathJax.Typeset = function(...args) {
      callCount++;
      return origTypeset.apply(this, args);
    };
    try {
      const markdownIt = require('markdown-it');
      const { mathpixMarkdownPlugin } = require('../lib/index.js');
      const md = markdownIt({ html: true, breaks: true }).use(mathpixMarkdownPlugin, {
        typesetCacheSize: 2,
        outMath: { include_svg: true }, mathJax: {}, renderElement: {},
        smiles: {}, forDocx: false, forLatex: false,
      });
      md.render('$a$ $b$ $c$ $d$ $a$ $b$ $c$ $d$');
      callCount.should.be.greaterThan(4);
    } finally {
      MathJax.Typeset = origTypeset;
    }
  });
});
