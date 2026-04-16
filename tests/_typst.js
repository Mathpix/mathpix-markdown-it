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

describe('Typst AST ErrorNode:', () => {
  const { serializeTypstMath } = require('../lib/mathjax/serialized-typst/ast/serialize.js');
  const { errorNode, seq, symbol } = require('../lib/mathjax/serialized-typst/ast/builders.js');

  it('ErrorNode serializes to fallbackText', () => {
    const node = errorNode('x + y', 'mfrac', 'test error');
    serializeTypstMath(node).should.equal('x + y');
  });

  it('ErrorNode with empty fallback serializes to empty string', () => {
    const node = errorNode('', 'msup', 'null child');
    serializeTypstMath(node).should.equal('');
  });

  it('ErrorNode preserves text in seq with siblings', () => {
    const node = seq([symbol('a'), errorNode('LOST', 'mo', 'err'), symbol('b')]);
    serializeTypstMath(node).should.equal('a LOST b');
  });

  it('ErrorNode carries nodeKind and message', () => {
    const node = errorNode('fallback', 'mfrac', 'division by zero');
    node.type.should.equal('error');
    node.fallbackText.should.equal('fallback');
    node.nodeKind.should.equal('mfrac');
    node.message.should.equal('division by zero');
  });

  it('Parse errors (merror) return error string', () => {
    const data = MathJax.TexConvertToTypstData('\\frac{');
    data.error.should.be.a('string');
    data.error.should.include('Missing close brace');
    data.typstmath.should.equal('');
  });
});
