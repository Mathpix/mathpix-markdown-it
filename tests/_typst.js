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

describe('Typst AST helpers (isEmptyNode, getSymbolValue):', () => {
  const { isEmptyNode, getSymbolValue, seq, symbol, num, placeholder, space, funcCall, posArg, mathVal } = require('../lib/mathjax/serialized-typst/ast/builders.js');
  it('empty seq is empty', () => {
    isEmptyNode(seq([])).should.equal(true);
  });
  it('seq with children is not empty', () => {
    isEmptyNode(seq([symbol('x')])).should.equal(false);
  });
  it('nested empty seqs are empty', () => {
    isEmptyNode(seq([seq([]), seq([])])).should.equal(true);
  });
  it('symbol with value is not empty', () => {
    isEmptyNode(symbol('alpha')).should.equal(false);
  });
  it('symbol with empty value is empty', () => {
    isEmptyNode(symbol('')).should.equal(true);
  });
  it('placeholder is not empty', () => {
    isEmptyNode(placeholder()).should.equal(false);
  });
  it('null-width space is empty', () => {
    isEmptyNode(space(null)).should.equal(true);
  });
  it('named space is not empty', () => {
    isEmptyNode(space('thin')).should.equal(false);
  });
  it('funcCall is not empty', () => {
    isEmptyNode(funcCall('frac', [posArg(mathVal(symbol('a')))])).should.equal(false);
  });
  it('getSymbolValue from symbol', () => {
    should.equal(getSymbolValue(symbol('alpha')), 'alpha');
  });
  it('getSymbolValue from single-child seq', () => {
    should.equal(getSymbolValue(seq([symbol('beta')])), 'beta');
  });
  it('getSymbolValue from multi-child seq returns null', () => {
    should.equal(getSymbolValue(seq([symbol('a'), symbol('b')])), null);
  });
  it('getSymbolValue from non-symbol returns null', () => {
    should.equal(getSymbolValue(num('42')), null);
  });
});

describe('Typst bracket-utils:', () => {
  const { scanBracketTokens, findUnpairedIndices, countUnpairedBrackets } = require('../lib/mathjax/serialized-typst/bracket-utils.js');
  it('scanBracketTokens skips quoted brackets', () => {
    const tokens = scanBracketTokens('"["abc]');
    tokens.length.should.equal(1);
    tokens[0].char.should.equal(']');
    tokens[0].pos.should.equal(6);
  });
  it('scanBracketTokens skips escaped brackets', () => {
    const tokens = scanBracketTokens('\\[x\\]');
    tokens.length.should.equal(0);
  });
  it('scanBracketTokens skips syntax parens (function calls)', () => {
    const tokens = scanBracketTokens('frac(a, b)[x]');
    // ( and ) are syntax parens of frac() — skipped; [ and ] collected
    tokens.length.should.equal(2);
    tokens[0].char.should.equal('[');
    tokens[1].char.should.equal(']');
  });
  it('findUnpairedIndices all paired', () => {
    findUnpairedIndices(['(', ')', '[', ']']).size.should.equal(0);
  });
  it('findUnpairedIndices mixed brackets', () => {
    const unpaired = findUnpairedIndices(['(', '[', ']', '{']);
    unpaired.size.should.equal(2);
    unpaired.has(0).should.equal(true);  // ( unpaired
    unpaired.has(3).should.equal(true);  // { unpaired
  });
  it('findUnpairedIndices nested', () => {
    findUnpairedIndices(['(', '[', ']', ')']).size.should.equal(0);
  });
  it('findUnpairedIndices mismatched', () => {
    const unpaired = findUnpairedIndices(['(', ']']);
    unpaired.size.should.equal(2);
  });
  it('countUnpairedBrackets balanced', () => {
    countUnpairedBrackets('frac(a, b)').should.equal(0);
  });
  it('countUnpairedBrackets with orphan [', () => {
    countUnpairedBrackets('a [b').should.be.greaterThan(0);
  });
  it('countUnpairedBrackets with escaped brackets', () => {
    countUnpairedBrackets('\\[ a \\]').should.equal(0);
  });
});
