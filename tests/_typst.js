let chai = require('chai');
let should = chai.should();
let MathJax = require('../lib/mathjax/index.js').MathJax;

describe('Latex to Typst math format:', () => {
  const tests = require('./_data/_typst/data');
  tests.forEach(function(t) {
    it('Latex =>' + t.latex, function() {
      const data = MathJax.TexConvertToTypstData(t.latex);
      console.log('    LATEX    =>', t.latex);
      console.log('    TYPST    =>', data.typstmath);
      console.log('    EXPECTED =>', t.typst);
      data.typstmath.should.be.a('string');
      if (t.typst.length > 0) {
        data.typstmath.length.should.be.greaterThan(0);
      }
      data.typstmath.should.equal(t.typst);

      console.log('    TYPST_INLINE    =>', data.typstmath_inline);
      console.log('    EXPECTED_INLINE =>', t.typst_inline);
      data.typstmath_inline.should.be.a('string');
      data.typstmath_inline.should.equal(t.typst_inline);
    });
  });
});
