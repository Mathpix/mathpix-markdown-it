const chai = require('chai');
chai.should();

const { JSDOM } = require('jsdom');
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

const {
  findVerbatimRanges,
  isInsideRanges,
  detectFenceOpen,
  isFenceClose,
} = require('../lib/markdown/common/verbatim-ranges');
const consts = require('../lib/markdown/common/consts');
const MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;

const f = '```';

// The list guard asks this one predicate whether a `{` or an `\end{itemize}` is text. Its answer comes
// from a binary search, which is only sound while the ranges ascend and do not overlap — and the sources
// do overlap: inline code can open before a fence and close after it.
describe('verbatim ranges: ascending, non-overlapping, and the search agrees with a linear scan', () => {
  const shapes = {
    'inline code spanning two fences': 'a `x\n' + f + '\nq\n' + f + '\nw\n~~~\ne\n~~~\ny` z',
    'inline code spanning a blank line': 'a `x\n\nq\n\nm y` z',
    'inline code spanning an lstlisting': 'a `x \\begin{lstlisting}\nq\n\\end{lstlisting}\nm y` z',
    'one of each': f + '\ncode\n' + f + '\ntext $x$ and `y`\n\\begin{lstlisting}z\\end{lstlisting}\n$$a$$',
    'closed fence': f + '\ncode {\n' + f,
    'unclosed fence': 'text\n' + f + '\ncode {',
    'one-line lstlisting': '\\begin{lstlisting}code\\end{lstlisting}\ntail',
    'unclosed lstlisting': '\\begin{lstlisting}\ncode {\n',
    'inline math': 'text $x_{1$ here',
    'display math': 'text\n$$\n\\frac{1}{2}\n$$\ntail',
    'nothing verbatim': 'plain text with braces { and } and a backslash \\',
    'empty': '',
  };
  Object.entries(shapes).forEach(([name, text]) => {
    it(name, () => {
      const ranges = findVerbatimRanges(text);
      ranges.forEach((range, i) => {
        range[1].should.be.at.least(range[0], 'a range ends before it starts');
        if (i > 0) {
          range[0].should.be.at.least(ranges[i - 1][1], 'ranges overlap or descend');
        }
      });
      // The predicate the guard actually calls, against the definition it stands for.
      for (let at = 0; at <= text.length; at++) {
        const linear = ranges.some(([from, to]) => at >= from && at < to);
        isInsideRanges(ranges, at).should.equal(linear, 'disagreed at offset ' + at);
      }
    });
  });
});

// Fence detection mirrors the core rule; these are the edges that rule draws.
describe('verbatim ranges: fence markers follow the core fence rule', () => {
  it('takes three or more of ` or ~, up to three leading spaces', () => {
    (detectFenceOpen('```') === null).should.equal(false);
    (detectFenceOpen('~~~~') === null).should.equal(false);
    (detectFenceOpen('   ```') === null).should.equal(false);
    (detectFenceOpen('    ```') === null).should.equal(true, 'four spaces is an indented block');
    (detectFenceOpen('``') === null).should.equal(true);
    (detectFenceOpen('text ```') === null).should.equal(true);
    (detectFenceOpen('```js`') === null).should.equal(true, 'a backtick fence info string cannot hold one');
  });
  it('closes on the same char, at least as long, with a blank tail', () => {
    const fence = detectFenceOpen('```');
    isFenceClose('```', fence).should.equal(true);
    isFenceClose('````', fence).should.equal(true);
    isFenceClose('```   ', fence).should.equal(true);
    isFenceClose('``', fence).should.equal(false);
    isFenceClose('``` tail', fence).should.equal(false);
    isFenceClose('~~~', fence).should.equal(false);
  });
});

// The list rule execs these four shared regexes without resetting lastIndex, which is sound only while
// none of them carries `g`. Adding the flag would make every exec resume where the last one stopped.
describe('the shared env regexes carry no `g`, so their exec sites need no reset', () => {
  ['BEGIN_LST_INLINE_RE', 'END_LST_INLINE_RE', 'BEGIN_TABULAR_INLINE_RE', 'END_TABULAR_INLINE_RE']
    .forEach((name) => {
      it(name, () => {
        consts[name].flags.should.equal('', 'add a lastIndex reset at every exec site, or clone per call');
      });
    });
});

// Math is asked for per block, and the scanner reads to EOF when no opener lies ahead — so a document
// whose tail holds no math was re-read once per paragraph. Growth, not wall clock, is the gate.
describe('verbatim ranges: a math-free tail is read once, not once per block', () => {
  const head = '\\begin{itemize}\n\\item a\n\\begin{center}x\\end{center}\n\\end{itemize}\n\n';
  const para = 'Lorem ipsum dolor sit amet.\n\n';
  const median = (text) => {
    findVerbatimRanges(text);
    const runs = [];
    for (let i = 0; i < 3; i++) {
      const started = process.hrtime.bigint();
      findVerbatimRanges(text);
      runs.push(Number(process.hrtime.bigint() - started) / 1e6);
    }
    return Math.min(...runs);
  };
  it('quadrupling the prose does not multiply the cost by more than eight', function () {
    this.retries(2);
    const small = median(head + para.repeat(1000));
    const large = median(head + para.repeat(4000));
    (large / Math.max(small, 0.05)).should.be.below(8, `small ${small}ms, large ${large}ms`);
  });
  it('a `$` before a blank line still opens nothing in the next block', () => {
    const src = 'text $x\n\n\\begin{itemize}\\item a\\end{itemize}\n\ny$ tail';
    isInsideRanges(findVerbatimRanges(src), src.indexOf('\\begin{itemize}'))
      .should.equal(false, 'the per-block clip must survive the opener cursor');
  });
  // The closer used to be covered: the opener took a marker from a later paragraph as its own, and the
  // span was clipped to the blank line rather than dropped — so its whole paragraph tail read as math.
  // Every marker that pairs inside one inline token, not just `$`.
  [['$', '$'], ['\\[', '\\]'], ['\\(', '\\)']].forEach(([open, close]) => {
    it('a `' + open + '` that pairs only past a blank line covers nothing in its own block', () => {
      const src = 'para one has a' + open + 'dangling opener and \\end{itemize} here\n\n'
        + 'second para b' + close + ' ends it\n';
      isInsideRanges(findVerbatimRanges(src), src.indexOf('\\end{itemize}'))
        .should.equal(false, 'an opener with no partner in its own block is not math');
    });
    it('a `' + open + '` pair inside one block still covers what it holds', () => {
      const src = 'text ' + open + 'x \\end{itemize} y' + close + ' tail\n';
      isInsideRanges(findVerbatimRanges(src), src.indexOf('\\end{itemize}'))
        .should.equal(true, 'a real pair must stay verbatim');
    });
  });
  // An env may legitimately span paragraphs, so it keeps the clipped span the `$` no longer gets.
  it('a math env still covers the closer written in its first block', () => {
    const src = '\\begin{align}\na &= \\end{itemize} \\\\\n\nc &= d\n\\end{align}\n';
    isInsideRanges(findVerbatimRanges(src), src.indexOf('\\end{itemize}'))
      .should.equal(true, 'an env body is verbatim up to the blank line');
  });
  it('the returned ranges are not aliased to anything the next call reuses', () => {
    const src = 'a `x\n' + f + '\ncode\n' + f + '\ny` z $m$';
    const first = findVerbatimRanges(src);
    const before = JSON.stringify(first);
    first.forEach((range) => { range[0] = -1; range[1] = -1; });
    JSON.stringify(findVerbatimRanges(src)).should.equal(before);
  });
});

// End to end: the shape whose ranges used to overlap must still keep its list whole. It passed before
// the overlap was fixed only because the balanced-argument check answered first.
describe('a closer inside a fence nested in inline code does not end the list', () => {
  it('keeps both items and leaks no LaTeX', () => {
    const src = '\\begin{itemize}\n\\item a\n\\begin{center}\n`x\n' + f + '\n\\end{itemize}\n' + f
      + '\ny`\n\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}';
    const warn = console.warn;
    const warnings = [];
    console.warn = (...args) => warnings.push(String(args[0]));
    let html;
    try {
      html = MM.markdownToHTML(src, { outMath: { include_svg: false } });
    } finally {
      console.warn = warn;
    }
    (html.match(/<li[\s>]/g) || []).should.have.length(2);
    html.should.match(/>a</);
    html.should.match(/>b</);
    html.replace(/<pre[\s\S]*?<\/pre>/g, '').replace(/<code[\s\S]*?<\/code>/g, '')
      .should.not.match(/\\begin\{itemize\}/);
    warnings.filter((line) => line.startsWith('[list')).should.have.length(0);
  });
});
