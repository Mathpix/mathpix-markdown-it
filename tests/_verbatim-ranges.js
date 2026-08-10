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
