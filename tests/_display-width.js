let chai = require('chai');
chai.should();

const { isWideChar, textReserveEm, tokenMarkerWidth } = require('../lib/markdown/common/display-width');
const { EX_TO_EM } = require('../lib/markdown/common/consts');

describe('display-width: isWideChar', () => {
  it('CJK ideograph is wide', () => isWideChar(0x6F22).should.equal(true));
  it('fullwidth full stop is wide', () => isWideChar(0xFF0E).should.equal(true));
  it('ASCII is not wide', () => isWideChar(0x41).should.equal(false));
  it('astral Wide blocks count as wide, like their BMP counterparts', () => {
    isWideChar(0x1F600).should.equal(true);  // emoticons
    isWideChar(0x1F200).should.equal(true);  // enclosed ideographic supplement
    isWideChar(0x20000).should.equal(true);  // CJK Ext-B
    isWideChar(0x3FFFD).should.equal(true);  // CJK Ext-G
    isWideChar(0x17000).should.equal(true);  // Tangut
  });
  it('the astral Wide blocks have no gaps at their edges', () => {
    isWideChar(0x16FE0).should.equal(true);  // Ideographic Symbols and Punctuation
    isWideChar(0x18D00).should.equal(true);  // Tangut Supplement
    isWideChar(0x1AFF0).should.equal(true);  // Kana Extended-B
  });
  it('the Wide emoji sub-blocks below 1F200 are covered', () => {
    isWideChar(0x1F004).should.equal(true);  // mahjong
    isWideChar(0x1F1E6).should.equal(true);  // regional indicator
    // Domino and playing cards are Neutral, so they stay in the cased fallback (already wider
    // than they render) rather than claiming full width.
    isWideChar(0x1F030).should.equal(false);
    isWideChar(0x1F0A0).should.equal(false);
  });
  it('Wide code points below the CJK blocks are wide, their Neutral neighbours are not', () => {
    // U+2329/232A are Wide since Unicode 3.0 and plausible in an OCR marker; the lookalike math
    // brackets U+27E8/27E9 are Neutral and checked below.
    [String.fromCodePoint(0x2329), String.fromCodePoint(0x232A), '⌚', '⏰', '♈', '⚡', '⚽', '⛄', '✅', '❓', '➕', '⬛', '⭐']
      .forEach((ch) => isWideChar(ch.codePointAt(0)).should.equal(true, 'not wide: U+' +
        ch.codePointAt(0).toString(16).toUpperCase()));
    // Neutral in the same span, so they keep the cased fallback instead of claiming full width.
    [0x2713, 0x2716, 0x2B54, 0x2600, 0x27E8, 0x27E9].forEach((cp) => isWideChar(cp).should.equal(false));
  });
  it('astral blocks that are not Wide stay out', () => {
    isWideChar(0x1D400).should.equal(false); // math alphanumerics
    isWideChar(0x10400).should.equal(false); // Deseret
    isWideChar(0x40000).should.equal(false); // past the last Wide plane
  });
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
  // The marks of these scripts sit on the base letter, so a vowelled word measures as the bare one.
  it('marks outside Latin reserve nothing either (Hebrew, Arabic, Devanagari, Thai)', () => {
    ['\u05b0', '\u05c7', '\u064b', '\u0670', '\u0902', '\u094d', '\u0e31', '\u0e48']
      .forEach((ch) => textReserveEm(ch).should.equal(0));
    textReserveEm('\u05d0\u05b0').should.be.closeTo(textReserveEm('\u05d0'), 1e-9);
    textReserveEm('\u0627\u064b').should.be.closeTo(textReserveEm('\u0627'), 1e-9);
  });
  it('a soft hyphen and a BOM reserve nothing', () => {
    textReserveEm('\u00ad').should.equal(0);
    textReserveEm('\ufeff').should.equal(0);
  });
  it('caseless non-ASCII lands in the wide class (\u2014 \u2116)', () => {
    // Pins the approximation, not exactness: these two are 1.00/1.07em in Arial, so a marker
    // made only of them under-reserves by \u22640.2em \u2014 see the width-model Non-Goal.
    ['\u2014', '\u2116'].forEach((ch) =>
      textReserveEm(ch).should.be.closeTo(0.90, 1e-9));
  });
  // Scripts with no case land in the same wide class, and deliberately so: the reserve over-shoots a
  // narrow letter like `\u0627`, but the Latin-`a` class would clip `\u0915` or `\u0e0d`, which are wider.
  it('a script with no case reserves the wide class, not the narrow one', () => {
    ['\u0e01', '\u0627', '\u0905', '\u05d0'].forEach((ch) =>
      textReserveEm(ch).should.be.closeTo(0.90, 1e-9));
    textReserveEm('\u0e01').should.be.above(textReserveEm('a'));
  });
  it('a repeated non-ASCII char scales linearly (memo returns a stable width)', () =>
    textReserveEm('\u0416\u0416\u0416').should.be.closeTo(3 * textReserveEm('\u0416'), 1e-9));
});


describe('display-width: tokenMarkerWidth (em)', () => {
  it('text token → per-glyph-class reserve', () =>
    tokenMarkerWidth({ type: 'text', content: 'ab' }).should.be.closeTo(1.24, 1e-9));
  it('math token → widthEx × EX_TO_EM when present', () =>
    tokenMarkerWidth({ type: 'inline_math', widthEx: 8 }).should.be.closeTo(8 * EX_TO_EM, 1e-9));
  it('widthEx is read for math only — a text token carrying one still measures its glyphs', () =>
    tokenMarkerWidth({ type: 'text', content: 'ab', widthEx: 99 }).should.be.closeTo(1.24, 1e-9));
  it('math without widthEx → 0 (no measured width, so marker keeps the default indent)', () =>
    tokenMarkerWidth({ type: 'inline_math', content: 'x^2' }).should.equal(0));
  it('math without widthEx does not recurse into children → 0', () =>
    tokenMarkerWidth({ type: 'inline_math', children: [{ type: 'text', content: 'abc' }] }).should.equal(0));
  it('children win over content — the branch order is significant', () => {
    // A wrapper carries the raw source in `content`, so measuring both would double the reserve.
    tokenMarkerWidth({ type: 'text', content: 'aaaaa', children: [{ type: 'text', content: 'a' }] })
      .should.be.closeTo(textReserveEm('a'), 1e-9);
  });
  it('an emoji token is measured, unlike smiles whose content is not what renders', () => {
    tokenMarkerWidth({ type: 'emoji', content: '⌚' }).should.be.closeTo(1.2, 1e-9);
    tokenMarkerWidth({ type: 'smiles_inline', content: 'CCO' }).should.equal(0);
  });
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
  it('a wide glyph takes two monospace cells', () => {
    // Otherwise `\item[\texttt{漢字}]` reserves half of what it renders — the unsafe direction.
    tokenMarkerWidth({ type: 'texttt', content: '漢字' })
      .should.be.closeTo(2 * tokenMarkerWidth({ type: 'texttt', content: 'ab' }), 1e-9);
    tokenMarkerWidth({ type: 'code_inline', content: '漢字' })
      .should.be.above(textReserveEm('漢字'));
  });
  it('an ASCII control reserves nothing in the monospace branch either', () => {
    tokenMarkerWidth({ type: 'code_inline', content: 'a\x01b' })
      .should.be.closeTo(tokenMarkerWidth({ type: 'text', content: 'a\x01b' }), 1e-9);
  });
  it('a lone surrogate reserves nothing in the monospace branch either', () => {
    // The two paths must agree on broken input, or the same marker measures differently by type.
    tokenMarkerWidth({ type: 'code_inline', content: '\uD800' }).should.equal(0);
    tokenMarkerWidth({ type: 'code_inline', content: 'a\uD800b' })
      .should.be.closeTo(tokenMarkerWidth({ type: 'code_inline', content: 'ab' }), 1e-9);
  });
  it('a lone surrogate reserves nothing', () => {
    tokenMarkerWidth({ type: 'text', content: '\uD800' }).should.equal(0);
    tokenMarkerWidth({ type: 'text', content: 'a\uD800b' })
      .should.be.closeTo(tokenMarkerWidth({ type: 'text', content: 'ab' }), 1e-9);
  });
  it('html_inline is not measured (content is markup) → 0', () =>
    tokenMarkerWidth({ type: 'html_inline', content: '<span style="color:red">' }).should.equal(0));
  it('Vertical Forms are wide, not zero-width, though they sit between two zero-width blocks', () => {
    isWideChar(0xFE10).should.equal(true);
    isWideChar(0xFE19).should.equal(true);
    textReserveEm('︐').should.be.closeTo(1.2, 1e-9);
    // The neighbours on both sides still reserve nothing.
    textReserveEm('️').should.equal(0);
    textReserveEm('︠').should.equal(0);
  });
  // Separators, not letters: they print nothing, and the snapshot claims to be complete on zero width.
  it('the line and paragraph separators reserve nothing', () => {
    isWideChar(0x2028).should.equal(false);
    textReserveEm(' ').should.equal(0);
    textReserveEm(' ').should.equal(0);
  });
  it('a tab or newline measures like the space it collapses into', () => {
    ['\t', '\n', '\r'].forEach((ws) => {
      textReserveEm('a' + ws + 'b').should.be.closeTo(textReserveEm('a b'), 1e-9);
    });
    textReserveEm('a\tb').should.be.above(textReserveEm('ab'));
  });
  it('joiners and variation selectors add no advance', () => {
    // They compose the glyphs around them instead of taking a cell of their own.
    const family = '\u{1F468}‍\u{1F469}‍\u{1F467}';
    textReserveEm(family).should.be.closeTo(textReserveEm('\u{1F468}\u{1F469}\u{1F467}'), 1e-9);
    textReserveEm('❤️').should.be.closeTo(textReserveEm('❤'), 1e-9);
    textReserveEm('a​b‌c').should.be.closeTo(textReserveEm('abc'), 1e-9);
  });
  it('the cased class is the same above the cache bound as below it', () => {
    // Below 0x3000 the class is memoised in a fixed byte array, above it recomputed per occurrence.
    textReserveEm('Ж').should.be.closeTo(textReserveEm('Ж'), 1e-9);       // cached path, twice
    textReserveEm('\u{10400}').should.be.closeTo(1.1, 1e-9);             // uncased path, uppercase
    textReserveEm('\u{10428}').should.be.closeTo(0.9, 1e-9);             // uncased path, lowercase
    textReserveEm('Ж').should.be.closeTo(1.1, 1e-9);
  });
  it('an astral wide glyph reserves the CJK width, not the cased fallback', () => {
    // Measured per code point: a surrogate pair is one glyph, so three of them are 3 × 1.20.
    textReserveEm('\u{2000B}').should.be.closeTo(1.2, 1e-9);
    textReserveEm('\u{2000B}\u{2000B}\u{2000B}').should.be.closeTo(3.6, 1e-9);
    textReserveEm('\u{1F600}\u{1F600}').should.be.closeTo(textReserveEm('一一'), 1e-9);
  });
});
