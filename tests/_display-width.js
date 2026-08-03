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
  it('uppercase non-ASCII is extra-wide (\u0416 \u0409 \u00C4 \u03A9)', () => {
    ['\u0416', '\u0409', '\u00C4', '\u03A9'].forEach((ch) =>
      textReserveEm(ch).should.be.closeTo(1.10, 1e-9));
  });
  it('lowercase non-ASCII is wide (\u0436 \u00E4 \u03C9)', () => {
    ['\u0436', '\u00E4', '\u03C9'].forEach((ch) =>
      textReserveEm(ch).should.be.closeTo(0.90, 1e-9));
  });
  it('combining marks reserve nothing, so decomposed accents cost only the base glyph', () => {
    ['\u0301', '\u0308', '\u0327', '\u1ab0', '\u20d0', '\ufe20'].forEach((ch) =>
      textReserveEm(ch).should.equal(0));
    textReserveEm('e\u0301').should.be.closeTo(textReserveEm('e'), 1e-9);
  });
  it('caseless non-ASCII lands in the wide class (\u2014 \u2116)', () => {
    // Pins the approximation, not exactness: these two are 1.00/1.07em in Arial, so a marker
    // made only of them under-reserves by \u22640.2em \u2014 see the width-model Non-Goal.
    ['\u2014', '\u2116'].forEach((ch) =>
      textReserveEm(ch).should.be.closeTo(0.90, 1e-9));
  });
  it('a repeated non-ASCII char scales linearly (memo returns a stable width)', () =>
    textReserveEm('\u0416\u0416\u0416').should.be.closeTo(3 * textReserveEm('\u0416'), 1e-9));
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
  it('code_inline and texttt use the monospace advance, not the glyph classes', () => {
    // They render as `<code>`; a glyph-class estimate underreserves narrow chars there.
    tokenMarkerWidth({ type: 'code_inline', content: 'iiiiiiiiii' }).should.be.closeTo(6.2, 1e-9);
    tokenMarkerWidth({ type: 'texttt', content: 'iiiiiiiiii', children: [{ type: 'text', content: 'iiiiiiiiii' }] })
      .should.be.closeTo(6.2, 1e-9);
  });
  it('a lone surrogate reserves nothing', () => {
    tokenMarkerWidth({ type: 'text', content: '\uD800' }).should.equal(0);
    tokenMarkerWidth({ type: 'text', content: 'a\uD800b' })
      .should.be.closeTo(tokenMarkerWidth({ type: 'text', content: 'ab' }), 1e-9);
  });
  it('html_inline is not measured (content is markup) → 0', () =>
    tokenMarkerWidth({ type: 'html_inline', content: '<span style="color:red">' }).should.equal(0));
});
