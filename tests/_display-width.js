let chai = require('chai');
chai.should();

const { isWideChar, textReserveEm, tokenMarkerWidth } = require('../lib/markdown/common/display-width');
const { EX_TO_EM } = require('../lib/markdown/common/consts');

describe('display-width: isWideChar', () => {
  it('CJK ideograph is wide', () => isWideChar(0x6F22).should.equal(true));
  it('fullwidth full stop is wide', () => isWideChar(0xFF0E).should.equal(true));
  it('ASCII is not wide', () => isWideChar(0x41).should.equal(false));
  it('astral emoji is not covered (width 1)', () => isWideChar(0x1F600).should.equal(false));
  it('combining marks U+3099/U+309A are excluded (not wide)', () => {
    isWideChar(0x3099).should.equal(false);
    isWideChar(0x309A).should.equal(false);
  });
});

describe('display-width: textReserveEm (per-glyph-class em)', () => {
  it('normal glyph = 0.62em', () => textReserveEm('a').should.be.closeTo(0.62, 1e-9));
  it('narrow glyph = 0.40em (. i l space capital I)', () => {
    textReserveEm('.').should.be.closeTo(0.40, 1e-9);
    textReserveEm('I').should.be.closeTo(0.40, 1e-9);
  });
  it('wide glyph = 0.90em (most capitals, m)', () => textReserveEm('M').should.be.closeTo(0.90, 1e-9));
  it('extra-wide glyph = 1.10em (W @ %)', () => textReserveEm('W').should.be.closeTo(1.10, 1e-9));
  it('sums per character', () => textReserveEm('abc').should.be.closeTo(1.86, 1e-9));
  it('combining mark adds 0 (\u304B + \u3099 == \u304B)', () =>
    textReserveEm('\u304B\u3099').should.be.closeTo(textReserveEm('\u304B'), 1e-9));
});


describe('display-width: tokenMarkerWidth (em)', () => {
  it('text token → per-glyph-class reserve', () =>
    tokenMarkerWidth({ type: 'text', content: 'ab' }).should.be.closeTo(1.24, 1e-9));
  it('math token → widthEx × EX_TO_EM when present', () =>
    tokenMarkerWidth({ type: 'inline_math', widthEx: 8 }).should.be.closeTo(8 * EX_TO_EM, 1e-9));
  it('math without widthEx → 0 (no measured width, so marker keeps the default indent)', () =>
    tokenMarkerWidth({ type: 'inline_math', content: 'x^2' }).should.equal(0));
  it('math without widthEx does not recurse into children → 0', () =>
    tokenMarkerWidth({ type: 'inline_math', children: [{ type: 'text', content: 'abc' }] }).should.equal(0));
  it('wrapper token → sum of children', () =>
    tokenMarkerWidth({ type: 'textbf', children: [{ type: 'text', content: 'abc' }] }).should.be.closeTo(1.86, 1e-9));
  it('unknown non-math token with no children → 0', () =>
    tokenMarkerWidth({ type: 'softbreak' }).should.equal(0));
  it('html_inline is not measured (content is markup) → 0', () =>
    tokenMarkerWidth({ type: 'html_inline', content: '<span style="color:red">' }).should.equal(0));
});
