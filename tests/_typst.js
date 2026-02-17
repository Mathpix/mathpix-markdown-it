let chai = require('chai');
let should = chai.should();
let MathJax = require('../lib/mathjax/index.js').MathJax;

describe('Latex to Typst math format:', () => {
  const tests = [
    { latex: '\\frac{a}{b}', expected: 'frac(a, b)' },
    { latex: 'x^{2}', expected: 'x^2' },
    { latex: 'x^2', expected: 'x^2' },
    { latex: '\\sqrt{x}', expected: 'sqrt(x)' },
    { latex: '\\sqrt[3]{x}', expected: 'root(3, x)' },
    { latex: '\\alpha + \\beta', expected: 'alpha + beta' },
    { latex: '\\hat{x}', expected: 'hat(x)' },
    { latex: '\\mathbb{R}', expected: 'bb(R)' },
    { latex: '\\sum_{i=1}^{n}', expected: null },
    { latex: '\\left( x \\right)', expected: null },
    { latex: '\\text{if } x > 0', expected: null },
    { latex: 'a + b', expected: 'a + b' },
    { latex: '\\infty', expected: 'infinity' },
    { latex: '\\leq', expected: 'lt.eq' },
    { latex: '\\times', expected: 'times' },
    { latex: '\\overline{x}', expected: null },
  ];
  tests.forEach(function(t) {
    it('Latex =>' + t.latex, function() {
      const result = MathJax.TexConvertToTypst(t.latex);
      console.log('    LATEX    =>', t.latex);
      console.log('    TYPST    =>', result);
      if (t.expected) {
        console.log('    EXPECTED =>', t.expected);
      }
      result.should.be.a('string');
      result.length.should.be.greaterThan(0);
      if (t.expected) {
        result.should.equal(t.expected);
      }
    });
  });
});
