const chai = require('chai');
chai.should();

const { findEndMarker, getInlineCodeListFromString, buildInlineCodePositionSet } = require('../lib/markdown/common');

// `findEndMarker` pairs `{`/`}` for the caption, section, footnote and list rules — 30 call sites and
// no test until now. A shield is an odd run of backslashes: `\}` is text, `\\}` closes, `\\` being one
// escaped backslash. Reading only the character before the brace dropped whole captions and headings.
describe('findEndMarker shields a marker by backslash parity:', () => {
  const end = (str) => {
    const found = findEndMarker(str, 0);
    return found.res ? found.endPos : 'no match';
  };
  const cases = {
    '{a}': 2,
    '{a{b}c}': 6,
    '{a\\}b}': 5,            // `\}` is text, so the pair closes on the last brace
    '{a\\{b}': 5,            // `\{` opens nothing, so this brace closes the pair
    '{a': 'no match',
    '{a\\}': 'no match',     // the only `}` is shielded
    '{a\\\\}': 4,            // `\\` is a line break: the brace after it closes
    '{a\\\\\\}': 'no match', // three backslashes: the brace is shielded again
    '{a\\\\}b': 4,           // the tail after the pair is not consumed
    '{a\\\\{b}}': 7,         // the inner brace counts, so the outer pair closes last
    '{a\\\\{b}': 'no match', // and with one `}` too few, nothing closes
    '{a\\\\\\\\}': 6,        // four backslashes: two line breaks, brace unshielded
  };
  Object.entries(cases).forEach(([str, expected]) => {
    it(`${JSON.stringify(str)} → ${expected}`, () => {
      end(str).should.equal(expected);
    });
  });
  it('a brace inside inline code is not a level', () => {
    // The backtick span holds `}`, which must not close the argument.
    end('{a `}` b}').should.equal(8);
  });
  it('the caller may pass the code-span index instead of having it rebuilt', () => {
    const str = '{a `}` b}';
    const positions = buildInlineCodePositionSet(getInlineCodeListFromString(str));
    const found = findEndMarker(str, 0, '{', '}', false, 0, positions);
    found.res.should.equal(true);
    found.endPos.should.equal(8);
  });
});
