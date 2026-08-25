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

// `onlyEnd` seeks a closer with no opener, `openBracketsBefore` carries the depth a previous line left
// open. The footnote scans use both, and the parity change above was measured against neither.
describe('findEndMarker without an opener, and with a depth from elsewhere:', () => {
  const seek = (str, depth = 0, startPos = -1) => {
    const found = findEndMarker(str, startPos, '{', '}', true, depth);
    return found.res ? found.endPos : 'no match: ' + found.openBrackets;
  };
  const cases = [
    { name: 'a bare closer ends the span', str: 'a}', want: 1 },
    { name: 'a shielded one does not', str: 'a\\}', want: 'no match: 1' },
    { name: 'and `\\\\` is not a shield, so the closer after it does', str: 'a\\\\}', want: 3 },
    { name: 'three backslashes shield it again', str: 'a\\\\\\}', want: 'no match: 1' },
    { name: 'a depth of two needs two closers', str: 'a}}', depth: 2, want: 2 },
    { name: 'one closer leaves the depth at one', str: 'a}', depth: 2, want: 'no match: 1' },
    { name: 'an opener raises the depth it was handed', str: 'a{}}}', depth: 2, want: 4 },
    { name: 'a shielded closer does not spend the handed depth', str: 'a\\}}}', depth: 2, want: 4 },
  ];
  cases.forEach(({ name, str, depth, want }) => {
    it(name, () => {
      seek(str, depth).should.equal(want);
    });
  });
  it('a positive startPos skips the character standing there', () => {
    // The scan begins past `startPos`, which in the normal mode holds the opening marker — so a `\` there
    // does not shield. Every caller passes -1 for that reason.
    seek('\\}', 0, 0).should.equal(1);
  });
});
