const chai = require('chai');
chai.should();

const { JSDOM } = require('jsdom');
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

const { nextMathSpan, getEndMarker, shouldSkipDollar } = require('../lib/markdown/common/math-spans');
const { findEndMarkerPos } = require('../lib/markdown/common');

// One scanner answers two callers: the tabular path extracts math with it, the list guard asks whether a
// closer sits inside math. Its markers and `$` guards are therefore load-bearing in two places.
describe('math spans: the openers and end markers the owning rules use', () => {
  const span = (str, mathEnvsOnly = false) => nextMathSpan(str, 0, mathEnvsOnly);
  it('pairs $ and $$, and reports the whole span', () => {
    span('a $x$ b').should.deep.equal({ start: 2, end: 5 });
    span('a $$x$$ b').should.deep.equal({ start: 2, end: 7 });
  });
  it('declines what the `$` guards decline', () => {
    (span('a $ x$ b') === null).should.equal(true, 'space after the opener');
    (span('a $x $ b') === null).should.equal(true, 'space before the closer');
    (span('a \\$x$ b') === null).should.equal(true, 'escaped opener');
    (span('a $x$5 b') === null).should.equal(true, 'a digit after the closer reads as a price');
  });
  it('pairs bracket math', () => {
    span('a \\[x\\] b').should.deep.equal({ start: 2, end: 7 });
    span('a \\(x\\) b').should.deep.equal({ start: 2, end: 7 });
  });
  it('takes a math environment, and with mathEnvsOnly refuses a list one', () => {
    const env = span('a \\begin{align}x=1\\end{align} b', true);
    env.start.should.equal(2);
    env.end.should.equal(29);
    (span('a \\begin{itemize}\\item x\\end{itemize} b', true) === null)
      .should.equal(true, 'itemize must never read as a formula');
    // Without the flag the extraction path takes any env, sorting math from code afterwards.
    (span('a \\begin{itemize}\\item x\\end{itemize} b', false) === null).should.equal(false);
  });
  it('takes eqref/ref as self-closing', () => {
    span('see eqref{a} here').should.deep.equal({ start: 4, end: 12 });
  });
  it('returns null for an opener that never closes', () => {
    (span('a $x b') === null).should.equal(true);
    (span('a \\(x b') === null).should.equal(true);
  });
  it('stops at `until`, so a caller scanning a block does not walk the tail', () => {
    const text = 'para one\n\npara two $x$ here';
    (nextMathSpan(text, 0, true, 9) === null).should.equal(true, 'the span lies past the bound');
    nextMathSpan(text, 0, true, text.length).start.should.equal(text.indexOf('$'));
  });
  it('the end-marker table maps every opener', () => {
    getEndMarker('\\[', undefined, undefined, undefined).should.equal('\\]');
    getEndMarker('\\(', undefined, undefined, undefined).should.equal('\\)');
    getEndMarker('$$', undefined, undefined, undefined).should.equal('$$');
    getEndMarker('$', undefined, undefined, undefined).should.equal('$');
    (getEndMarker('eqref{a}', undefined, 'a', undefined) === null).should.equal(true);
    (getEndMarker('\\begin{align}', 'align', undefined, undefined) === undefined).should.equal(true);
  });
  // The span scanner finds its end marker through this helper. Skipping an escaped one used to recurse,
  // so a run of them overflowed the stack — mid-render on `master` that returned an empty document.
  it('skipping escaped end markers costs no stack', () => {
    findEndMarkerPos('a \\$$ b $$ c', '$$', 0).should.equal(8);
    findEndMarkerPos('\\$$ only', '$$', 0).should.equal(-1);
    const run = '\\$$'.repeat(50000);
    findEndMarkerPos(run + ' $$', '$$', 0).should.equal(run.length + 1);
  });
  // The digit guard is for currency after a single `$`. A `$$` pair is unambiguous, so a digit right after
  // it keeps the span — the guard read the second `$` there and never a digit, and now says so.
  it('a digit after a display closer keeps the span', () => {
    nextMathSpan('$$x$$5', 0).end.should.equal('$$x$$'.length);
    (nextMathSpan('$x$5', 0) === null).should.equal(true);
    shouldSkipDollar('$$x$$5', '$$', 0, 4).should.equal(false);
    shouldSkipDollar('$x$5', '$', 0, 2).should.equal(true);
  });
  it('shouldSkipDollar names each reason', () => {
    shouldSkipDollar('$x$', '$', 0, 2).should.equal(false);
    shouldSkipDollar('$ x$', '$', 0, 3).should.equal(true);
    shouldSkipDollar('$x $', '$', 0, 3).should.equal(true);
    shouldSkipDollar('$x$7', '$', 0, 2).should.equal(true);
    shouldSkipDollar('\\$x$', '$', 1, 3).should.equal(true);
  });
});
