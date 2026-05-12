let chai = require('chai');
let should = chai.should();
let { escapeContentSeparators } = require('../lib/mathjax/serialized-typst/escape-utils');

describe('escapeContentSeparators — unpaired bracket escaping:', () => {
  it('paired brackets are not touched', () => {
    escapeContentSeparators('a[b]c').should.equal('a[b]c');
  });
  it('only unpaired [ is escaped', () => {
    escapeContentSeparators('a[bc').should.equal('a\\[bc');
  });
  it('only unpaired ] is escaped', () => {
    escapeContentSeparators('abc]').should.equal('abc\\]');
  });
  it('nested: outer unpaired [ is escaped, inner pair preserved', () => {
    escapeContentSeparators('a[b[c]').should.equal('a\\[b[c]');
  });
  it('already-escaped \\[ is not double-escaped', () => {
    escapeContentSeparators('a\\[b').should.equal('a\\[b');
  });
  it('brackets inside quoted string are not touched', () => {
    escapeContentSeparators('"[" + ]').should.equal('"[" + \\]');
  });
  it('empty string returns empty', () => {
    escapeContentSeparators('').should.equal('');
  });
  it('no brackets returns unchanged', () => {
    escapeContentSeparators('a + b').should.equal('a + b');
  });
  it('commas and semicolons are still escaped at depth 0', () => {
    escapeContentSeparators('a, b; c').should.equal('a\\, b\\; c');
  });
  it('commas inside paired brackets are not escaped', () => {
    escapeContentSeparators('[a, b]').should.equal('[a, b]');
  });
  it('frac bracket case: unpaired [ inside expression', () => {
    escapeContentSeparators('(+)[4 x + 10 y - 5 z').should.equal('(+)\\[4 x + 10 y - 5 z');
  });
});
