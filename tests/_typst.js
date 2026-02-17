let chai = require('chai');
let should = chai.should();
let MathJax = require('../lib/mathjax/index.js').MathJax;

describe('Latex to Typst math format:', () => {
  const tests = require('./_data/_typst/data');
  tests.forEach(function(t) {
    it('Latex =>' + t.latex, function() {
      const result = MathJax.TexConvertToTypst(t.latex);
      console.log('    LATEX    =>', t.latex);
      console.log('    TYPST    =>', result);
      console.log('    EXPECTED =>', t.typst);
      result.should.be.a('string');
      result.length.should.be.greaterThan(0);
      result.should.equal(t.typst);
    });
  });
});
