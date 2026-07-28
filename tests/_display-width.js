let chai = require('chai');
chai.should();

const { isWideChar, displayWidth, tokenDisplayWidth } = require('../lib/markdown/common/display-width');
const { EX_TO_EM } = require('../lib/markdown/common/consts');
const { fontMetrics } = require('../lib/markdown/common/text-dimentions');

describe('display-width: EX_TO_EM matches the default font metrics', () => {
  // EX_TO_EM is a literal (exDef/fonSizeDef are module-private); the fontMetrics singleton
  // is initialized from those same defaults, so this pins them in sync without importing them.
  it('EX_TO_EM === fontMetrics.ex / fontMetrics.fontSize', () =>
    (fontMetrics.ex / fontMetrics.fontSize).should.be.closeTo(EX_TO_EM, 1e-9));
});

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

describe('display-width: tokenDisplayWidth (ex)', () => {
  it('text token → display width × 1.3 ex/cell', () =>
    tokenDisplayWidth({ type: 'text', content: 'ab' }).should.be.closeTo(2.6, 1e-9));
  it('math token → exact widthEx when present', () =>
    tokenDisplayWidth({ type: 'inline_math', widthEx: 8 }).should.equal(8));
  it('math without widthEx → 0 (no measured width, so marker keeps the default indent)', () =>
    tokenDisplayWidth({ type: 'inline_math', content: 'x^2' }).should.equal(0));
  it('math without widthEx does not recurse into children → 0', () =>
    tokenDisplayWidth({ type: 'inline_math', children: [{ type: 'text', content: 'abc' }] }).should.equal(0));
  it('wrapper token → sum of children', () =>
    tokenDisplayWidth({ type: 'textbf', children: [{ type: 'text', content: 'abc' }] }).should.be.closeTo(3.9, 1e-9));
  it('unknown non-math token with no children → 0', () =>
    tokenDisplayWidth({ type: 'softbreak' }).should.equal(0));
});
