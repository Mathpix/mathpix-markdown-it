let chai = require('chai');
chai.should();

const { isWideChar, displayWidth, tokenDisplayWidth } = require('../lib/markdown/common/display-width');

describe('display-width: displayWidth (char cells)', () => {
  it('ASCII counts one per char', () => displayWidth('abc').should.equal(3));
  it('CJK counts two per char', () => displayWidth('漢字').should.equal(4));
  it('fullwidth punctuation counts two (U+FF0E)', () => displayWidth('11．').should.equal(4));
  it('astral (emoji) counts one', () => displayWidth('\u{1F600}').should.equal(1));
  it('empty string is zero', () => displayWidth('').should.equal(0));
});

describe('display-width: isWideChar', () => {
  it('CJK ideograph is wide', () => isWideChar(0x6F22).should.equal(true));
  it('fullwidth full stop is wide', () => isWideChar(0xFF0E).should.equal(true));
  it('ASCII is not wide', () => isWideChar(0x41).should.equal(false));
  it('astral emoji is not covered (width 1)', () => isWideChar(0x1F600).should.equal(false));
});

describe('display-width: tokenDisplayWidth', () => {
  it('text token → display width of content', () =>
    tokenDisplayWidth({ type: 'text', content: 'ab' }).should.equal(2));
  it('math token → widthEx / 2 when present', () =>
    tokenDisplayWidth({ type: 'inline_math', widthEx: 8 }).should.equal(4));
  it('math token without widthEx → source length fallback', () =>
    tokenDisplayWidth({ type: 'inline_math', content: 'x^2' }).should.equal(3));
  it('wrapper token → sum of children', () =>
    tokenDisplayWidth({ type: 'textbf', children: [{ type: 'text', content: 'abc' }] }).should.equal(3));
  it('unknown non-math token with no children → 0', () =>
    tokenDisplayWidth({ type: 'softbreak' }).should.equal(0));
});
