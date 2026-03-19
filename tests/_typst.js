let chai = require('chai');
let should = chai.should();
let MathJax = require('../lib/mathjax/index.js').MathJax;

describe('Latex to Typst math format:', () => {
  const tests = require('./_data/_typst/data');
  tests.forEach(function(t) {
    it('Latex =>' + t.latex, function() {
      const data = MathJax.TexConvertToTypstData(t.latex);
      data.typstmath.should.be.a('string');
      if (t.typst.length > 0) {
        data.typstmath.length.should.be.greaterThan(0);
      }
      data.typstmath.should.equal(t.typst);
      data.typstmath_inline.should.be.a('string');
      data.typstmath_inline.should.equal(t.typst_inline);
      if (t.error) {
        data.error.should.be.a('string');
        data.error.should.equal(t.error);
      }
    });
  });
});
