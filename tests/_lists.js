let chai = require('chai');
let should = chai.should();

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;
const markdownIt = require('markdown-it');
const { mathpixMarkdownPlugin } = require('../lib/index.js');
const { pairArgumentSpans } = require('../lib/markdown/md-latex-lists-env/list-source-model');
const { LATEX_ITEM_COMMAND_INLINE_RE, LATEX_ITEM_SPLIT_RE } = require('../lib/markdown/common/consts');

const options = {
  cwidth: 800,
  htmlTags: true
};


const { JSDOM } = require("jsdom");
const tests = require("./_data/_lists/_data");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;


// A fixture may carry `options` of its own: line numbering has no effect under the defaults, so its
// attributes are only pinnable this way.
const fixtureOptions = (test) => (test.options ? Object.assign({}, options, test.options) : options);

describe('Check Lists:', () => {
  const tests = require('./_data/_lists/_data');
  tests.forEach(function(test) {
    const html = MM.markdownToHTML(test.latex, fixtureOptions(test));
    describe('Latex => ' + test.latex, () => {
      it('Checking result html', (done) => {
        html.should.equal(test.html);
        done();
      });
     });
  });
});

// Pinned-quirk fixtures: shapes whose markup is invalid on purpose, so they stay out of the sweep below.
describe('Pre-existing list quirks (TO BE FIXED):', () => {
  require('./_data/_lists/_data_known_quirks').forEach((test) => {
    it(test.name, () => {
      MM.markdownToHTML(test.latex, options).should.equal(test.html);
    });
  });
});

describe('Check Lists inside tabular:', () => {
  const tests = require('./_data/_lists/_data_lists_inside_tabular');
  tests.forEach(function(test) {
    const html = MM.markdownToHTML(test.mmd, options);
    describe('Latex => ' + test.mmd, () => {
      it('Checking result html', (done) => {
        html.should.equal(test.html);
        done();
      });
    });
  });
});

// A `\renewcommand` line inside a list body renders to nothing, so joining it to the previous item
// with a line break left an orphan `<br>`. A plain continuation line still breaks — that is content.
describe('A no-output command between items leaves no orphan <br>:', () => {
  const itemBodies = (src) => {
    const html = MM.markdownToHTML(src, { outMath: { include_svg: false } });
    return (html.match(/<li[\s\S]*?<\/li>/g) || []).map((li) => li
      .replace(/<span class="li_level"[^>]*>[\s\S]*?<\/span>/g, '')
      .replace(/<li[^>]*>/, '')
      .replace('</li>', ''));
  };
  it('\\renewcommand between items does not break the item above it', () => {
    itemBodies('\\begin{itemize}\n\\item a\n\\renewcommand{\\labelitemi}{ZZZ}\n\\item b\n\\end{itemize}')
      .should.deep.equal(['a', 'b']);
  });
  it('forLatex keeps the break, the line being source to rebuild', () => {
    // Read through the plugin: `markdownToHTML` drops `forLatex` before the plugin sees it.
    const content = (forLatex) => markdownIt({ html: true })
      .use(mathpixMarkdownPlugin, { outMath: { include_svg: false }, forLatex })
      .parse('\\begin{itemize}\n\\item a\n\\renewcommand{\\labelitemi}{ZZZ}\n\\item b\n\\end{itemize}', {})
      .filter((t) => t.type === 'inline').map((t) => t.content);
    content(true).should.deep.equal(['a\n\\renewcommand{\\labelitemi}{ZZZ}', 'b']);
    content(false).should.deep.equal(['a\\renewcommand{\\labelitemi}{ZZZ}', 'b']);
  });
  it('a plain continuation line keeps its break', () => {
    itemBodies('\\begin{itemize}\n\\item a\ntail text\n\\item b\n\\end{itemize}')
      .should.deep.equal(['a<br>\ntail text', 'b']);
  });
  it('an unsupported command stays visible, on its own line', () => {
    itemBodies('\\begin{itemize}\n\\item a\n\\itemsep 1pt\n\\item b\n\\end{itemize}')
      .should.deep.equal(['a<br>\n\\itemsep 1pt', 'b']);
  });
});

// `\item` detection: the rule is `\item` not followed by a letter, so `\itemsep` stays text while
// `\item2`/`\item*` open an item. Pinned as measured, so a regex refactor cannot change it silently.
describe('What counts as \\item inside a list body:', () => {
  const itemBodies = (line) => {
    const html = MM.markdownToHTML('\\begin{itemize}\n\\item a\n' + line + '\n\\end{itemize}',
      { outMath: { include_svg: false } });
    return (html.match(/<li[\s\S]*?<\/li>/g) || []).map((li) => li
      .replace(/<span class="li_level"[^>]*>[\s\S]*?<\/span>/g, '')
      .replace(/<li[^>]*>/, '')
      .replace('</li>', ''));
  };
  const staysText = {
    '\\itemsep 1pt': 'a<br>\n\\itemsep 1pt',
    '\\itemindent 2pt': 'a<br>\n\\itemindent 2pt',
    '\\itemize x': 'a<br>\n\\itemize x',
    'the word item here': 'a<br>\nthe word item here',
  };
  Object.entries(staysText).forEach(([line, expected]) => {
    it(`"${line}" stays inside the item above it`, () => {
      itemBodies(line).should.deep.equal([expected]);
    });
  });
  // A digit or a star is a legal `\item` argument in LaTeX, so these do open an item.
  it('"\\item2 b" opens an item whose body is "2 b"', () => {
    itemBodies('\\item2 b').should.deep.equal(['a', '2 b']);
  });
  it('"\\item* b" opens an item whose body is "* b"', () => {
    itemBodies('\\item* b').should.deep.equal(['a', '* b']);
  });
  // A trailing `\item` with nothing after it: the text before it stays, the empty item is emitted.
  it('a line ending in "\\item" leaves the text and an empty item', () => {
    itemBodies('text \\item').should.deep.equal(['a<br>\ntext', '']);
  });
});

// An unclosed wrapper inside a list must never take the list with it: the wrapper only becomes
// opaque when a closer it can actually reach exists. An unbounded search matched a same-named env
// further down the document, swallowed the list's own `\end{itemize}` and printed it all as LaTeX.
describe('An unclosed wrapper env leaves the list rendering:', () => {
  const fence = '```';
  const rendered = (src) => {
    const html = MM.markdownToHTML(src, { outMath: { include_svg: false } });
    const outsideCode = html.replace(/<pre[\s\S]*?<\/pre>/g, '');
    return {
      items: (html.match(/<li[\s>]/g) || []).length,
      leaked: /\\begin\{itemize\}|\\item(?![a-zA-Z])/.test(outsideCode),
    };
  };
  // Each shape carries the item count `master` renders: a `> 0` assertion passed while an item was
  // being lost inside the wrapper's raw content.
  const shapes = {
    'a closed figure further down the document': [
      '\\begin{itemize}\n\\item a\n\\begin{figure}\n\\item b\n\\end{itemize}\n\n'
      + '\\begin{figure}\n\\caption{other}\n\\end{figure}\n', 2],
    'a closed center further down the document': [
      '\\begin{itemize}\n\\item a\n\\begin{center}\nb\n\\end{itemize}\n\n'
      + '\\begin{center}\nother\n\\end{center}\n', 1],
    'a lone \\end{center} in later text': [
      '\\begin{itemize}\n\\item a\n\\begin{center}\nb\n\\end{itemize}\n\ntext \\end{center} more\n', 1],
    'a \\end{center} inside a fenced code block': [
      '\\begin{itemize}\n\\item a\n\\begin{center}\nb\n\\end{itemize}\n\n'
      + fence + '\n\\end{center}\n' + fence + '\n', 1],
    'no closer anywhere': [
      '\\begin{itemize}\n\\item a\n\\begin{center}\nb\n\\end{itemize}\n', 1],
    // No blank line before the foreign env, so the whole tail is one block: the guard has to weigh
    // the closers it passes, not just find one.
    'a figure straight after the list, no blank line': [
      '\\begin{itemize}\n\\item a\n\\begin{figure}\n\\item b\n\\end{itemize}\n'
      + '\\begin{figure}\n\\caption{other}\n\\end{figure}\n', 2],
    'a center straight after the list, no blank line': [
      '\\begin{itemize}\n\\item a\n\\begin{center}\nb\n\\end{itemize}\n'
      + '\\begin{center}\nother\n\\end{center}\n', 1],
    'a fenced \\end{center} with no blank line before it': [
      '\\begin{itemize}\n\\item a\n\\begin{center}\nb\n\\end{itemize}\n'
      + fence + '\n\\end{center}\n' + fence + '\n', 1],
    'the closer sits on the same line as \\end{itemize}': [
      '\\begin{itemize}\n\\item a\n\\begin{center}\nb\n\\end{itemize} \\end{center}\n', 1],
    // The candidate closer must be ahead of the `\begin` itself: searching from the line start took an
    // `\end{X}` written left of it — dangling, or already consumed by an earlier wrapper on that line.
    'a dangling closer left of the opener on one line': [
      '\\begin{itemize}\n\\item a\n\\end{center} \\begin{center}\n\\item b\n\\end{itemize}\n', 2],
    'the closer left of the opener belongs to an earlier wrapper': [
      '\\begin{itemize}\n\\item a\n\\begin{center}\nx\n\\end{center} \\begin{center}\n'
      + '\\item b\n\\end{itemize}\n', 2],
    // One closer and one opener between the wrapper and its candidate closer: equal counts, and the
    // closer standing first is ours. Tallying them declined to decline, and item `b` was lost.
    'env boundaries crossed, equal counts in the window': [
      '\\begin{itemize}\n\\item a\n\\begin{center}\n\\end{itemize}\n'
      + '\\begin{itemize}\n\\item b\n\\end{center}\n\\end{itemize}\n', 2],
  };
  Object.entries(shapes).forEach(([name, [src, expectedItems]]) => {
    it(name, () => {
      const { items, leaked } = rendered(src);
      items.should.equal(expectedItems, 'the list lost or gained an item');
      leaked.should.equal(false, 'the list fell out as literal LaTeX');
    });
  });
  // A list opened mid-line — a sibling or a nested one — got no `map`, so line numbering emitted a bare
  // class for it while the outer list carried its attributes.
  it('a sibling and a nested list carry line numbers that are valid, not just present', () => {
    const numbered = (src) => MM.markdownToHTML(src,
      { outMath: { include_svg: false }, lineNumbering: true });
    const attr = (tag, name) => {
      const found = tag.match(new RegExp(name + '="([^"]*)"'));
      return found ? found[1] : null;
    };
    const shapes = [
      '\\begin{itemize}\n\\item a\n\\end{itemize} \\begin{itemize}\n\\item b\n\\end{itemize}',
      '\\begin{itemize}\n\\item a\n\\begin{itemize}\n\\item b\n\\end{itemize}\n\\item c\n\\end{itemize}',
    ];
    shapes.forEach((src) => {
      const html = numbered(src);
      const lists = html.match(/<ul[^>]*>/g) || [];
      lists.should.have.length(2);
      lists.forEach((tag) => {
        const start = Number(attr(tag, 'data_line_start'));
        const end = Number(attr(tag, 'data_line_end'));
        // A zero-width map passed a presence check and left `end` below `start`, reading as data.
        end.should.be.at.least(start, 'data_line_end below data_line_start in ' + tag);
        Number(attr(tag, 'count_line')).should.be.at.least(1, 'count_line of zero in ' + tag);
      });
    });
    // `parentStart` names the list an item sits in; opening a nested list used to move it, so the item
    // after that list pointed at the sublist's line instead of its own list's.
    const items = numbered(shapes[1]).match(/<li[^>]*>/g) || [];
    items.map((tag) => attr(tag, 'data_parent_line_start')).should.deep.equal(['0', '0', '0']);
  });
  // The span search is a binary one, so ascending non-overlapping output is an assumption, not a nicety —
  // a nested pair leaking in makes a brace inside an argument read as one that opens a new argument.
  it('argument spans come back ascending, disjoint and balanced', () => {
    let seed = 20260810;
    const rnd = (n) => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed % n; };
    const alphabet = ['{', '}', '\\', '\\{', '\\\\', 'a', ' ', '\n', '`'];
    // A range end is exclusive: skipping a brace inside one must resume on it, not past it.
    pairArgumentSpans('a{b{c}', [[1, 3]]).should.deep.equal([[3, 5]]);
    pairArgumentSpans('a{b}c}', [[1, 3]]).should.deep.equal([]);
    // Escapes are counted in pairs, so `\\{` opens where `\{` does not, and a trailing `\` ends the walk.
    pairArgumentSpans('a\\{b}', []).should.deep.equal([]);
    pairArgumentSpans('a\\\\{b}', []).should.deep.equal([[3, 5]]);
    pairArgumentSpans('{a\\', []).should.deep.equal([]);
    // A backslash inside a verbatim range escapes nothing beyond it: the brace at its end still opens.
    pairArgumentSpans('`\\`{a}', [[0, 3]]).should.deep.equal([[3, 5]]);
    // Including when the `\` is the last character of the range — it used to eat the brace after it.
    pairArgumentSpans('`x\\{a}', [[0, 3]]).should.deep.equal([[3, 5]]);
    pairArgumentSpans('`x\\{a}', [[0, 2]]).should.deep.equal([]);
    for (let round = 0; round < 20000; round++) {
      let text = '';
      for (let i = rnd(24); i > 0; i--) {
        text += alphabet[rnd(alphabet.length)];
      }
      // Half the rounds pass a verbatim range, the branch that skips ahead inside the same walk.
      const cut = rnd(text.length + 1);
      const verbatim = round % 2 && cut < text.length ? [[cut, Math.min(text.length, cut + rnd(6))]] : [];
      const spans = pairArgumentSpans(text, verbatim);
      let previousEnd = -1;
      spans.forEach(([from, to]) => {
        const where = ' in ' + JSON.stringify(text) + ' with ' + JSON.stringify(verbatim);
        from.should.be.above(previousEnd, 'spans overlap or nest' + where);
        to.should.be.above(from, 'a span ends where it starts' + where);
        text[from].should.equal('{', 'a span starts off a brace' + where);
        text[to].should.equal('}', 'a span ends off a brace' + where);
        previousEnd = to;
      });
    }
  });
  // The guard asks how many closers are left after a wrapper, and a walk over every offset past it made a
  // document of such wrappers super-linear — 1600 units were 2.25× slower than `master` before the
  // suffix counts. Growth, not wall time, so the bound holds on a slower machine.
  it('a document of wrappers each holding a foreign closer scans linearly', function () {
    this.retries(2);                    // a growth ratio with a wide margin: a retry absorbs load, not a regression
    const unit = '\\begin{itemize}\n\\item a\n\\begin{center}\ntext \\end{itemize} here\n'
      + '\\end{center}\n\\item b\n\\end{itemize}';
    const median = (count) => {
      const src = Array.from({ length: count }, () => unit).join('\n\n');
      MM.markdownToHTML(src, { outMath: { include_svg: false } });      // warm up
      const samples = [];
      for (let i = 0; i < 3; i++) {
        const started = Date.now();
        MM.markdownToHTML(src, { outMath: { include_svg: false } });
        samples.push(Date.now() - started);
      }
      return samples.sort((a, b) => a - b)[1];
    };
    const small = median(200);
    const large = median(1600);
    // Eight times the input: linear allows ~8, the walk gave ~11 and rising.
    (large <= Math.max(60, small * 9)).should.equal(true,
      'growth is not linear: ' + small + ' ms → ' + large + ' ms');
  });
  // A closer written in code is skipped and the scan resumes past it. Slicing the rest of the line per
  // skip made that quadratic; the sticky scan keeps it flat.
  it('a line full of closers written in code scans linearly', function () {
    this.retries(2);
    const build = (n) => '\\begin{itemize}\n\\item a\n\\begin{center}\n'
      + '`\\end{center}` '.repeat(n) + 'tail\n\\end{center}\n\\item b\n\\end{itemize}';
    const median = (src) => {
      MM.markdownToHTML(src, { outMath: { include_svg: false } });      // warm up
      const samples = [];
      for (let i = 0; i < 5; i++) {
        const started = Date.now();
        MM.markdownToHTML(src, { outMath: { include_svg: false } });
        samples.push(Date.now() - started);
      }
      return samples.sort((a, b) => a - b)[2];
    };
    const small = median(build(200));
    const large = median(build(3200));
    // Sixteen times the closers: linear allows ~16, quadratic would be ~256.
    (large <= Math.max(20, small * 24)).should.equal(true,
      'growth is not linear: ' + small + ' ms → ' + large + ' ms');
  });
  // Argument pairing is one pass with a stack. Asking findEndMarker per brace made a long run of
  // unmatched `{` rescan the tail each time — `n^1.9` measured, 12× master at 8000 braces.
  it('a long run of unmatched braces parses linearly', function () {
    this.retries(2);
    const build = (n) => '\\begin{itemize}\n\\item a\n\\begin{center}\n' + '{'.repeat(n) + ' x\n'
      + '\\caption{q \\end{itemize} w}\n\\end{center}\n\\item b\n\\end{itemize}';
    const median = (src) => {
      MM.markdownToHTML(src, { outMath: { include_svg: false } });      // warm up
      const samples = [];
      for (let i = 0; i < 5; i++) {
        const started = Date.now();
        MM.markdownToHTML(src, { outMath: { include_svg: false } });
        samples.push(Date.now() - started);
      }
      return samples.sort((a, b) => a - b)[2];
    };
    const small = Math.max(median(build(2000)), 1);
    const large = median(build(8000));
    // Linear with room for noise: the quadratic version sat near 7× on this pair.
    (large / small).should.be.below(6, 'growth is not linear: ' + small + ' ms → ' + large + ' ms');
  });
  // Pairing runs over the whole source, so an unmatched `{` must stay local: judged document-wide it
  // blinded every list after it — the caption's closer read as structure and half the items were lost.
  it('an unmatched { before a list does not reach it', () => {
    const unit = '\\begin{itemize}\n\\item a\n\\begin{center}\n\\caption{q \\end{itemize} w}\n'
      + '\\end{center}\n\\item b\n\\end{itemize}';
    const three = [unit, unit, unit].join('\n\n');
    const wrappers = (html) => (html.match(/class="center"/g) || []).length;
    const prefixes = {
      'none': '',
      'a stray brace': 'Text with a stray {\n\n',
      'a broken formula': 'Formula $\\frac{1}{2$ here\n\n',
      'an unclosed caption': '\\caption{unclosed\n\n',
      'three hundred paragraphs after one': 'stray {\n\n'
        + Array.from({ length: 300 }, (_, i) => 'Paragraph ' + i).join('\n\n') + '\n\n',
    };
    Object.entries(prefixes).forEach(([what, prefix]) => {
      const html = MM.markdownToHTML(prefix + three, { outMath: { include_svg: false } });
      (html.match(/<li[\s>]/g) || []).should.have.length(6, 'items lost after ' + what);
      wrappers(html).should.equal(3, 'wrappers lost after ' + what);
      html.should.not.match(/\\item(?![a-zA-Z])/, 'the list fell out as literal LaTeX after ' + what);
    });
    // A brace between two lists reaches neither: the one before it is judged on its own stretch.
    const middle = MM.markdownToHTML(unit + '\n\nstray {\n\n' + unit, { outMath: { include_svg: false } });
    (middle.match(/<li[\s>]/g) || []).should.have.length(4);
    wrappers(middle).should.equal(2);
  });
  // A list opening inside the wrapper is the one shape where argument spans decide the transition. A
  // stray `{` that emptied the span list took this branch with it: the caption's closer read as ours.
  it('an unmatched { does not blind a list that opens inside a wrapper', () => {
    const unit = '\\begin{itemize}\n\\item a\n\\begin{center}\n\\caption{q \\end{itemize} w}\n'
      + '\\begin{itemize}\\item z\\end{itemize}\n\\end{center}\n\\item b\n\\end{itemize}';
    const prefixes = {
      'none': '',
      'a stray brace': 'text {\n\n',
      'a stray brace and three hundred paragraphs': 'text {\n\n'
        + Array.from({ length: 300 }, (_, i) => 'Para ' + i).join('\n\n') + '\n\n',
    };
    Object.entries(prefixes).forEach(([what, prefix]) => {
      const html = MM.markdownToHTML(prefix + unit, { outMath: { include_svg: false } });
      (html.match(/<li[\s>]/g) || []).should.have.length(3, 'items lost after ' + what);
      (html.match(/class="center"/g) || []).should.have.length(1, 'the wrapper was lost after ' + what);
      const outsideCode = html.replace(/<pre[\s\S]*?<\/pre>/g, '').replace(/<code[\s\S]*?<\/code>/g, '');
      outsideCode.should.not.match(/\\end\{itemize\}/, 'a closer fell out as text after ' + what);
    });
  });
  // The wrapper guard counts the closers left against how many lists are open, and that count is module
  // state — so the same body must decide the same way whatever depth it is written at.
  it('a wrapper holding a closer decides the same way at every nesting depth', () => {
    const body = '\\begin{center}\ntext \\end{itemize} here\n\\end{center}\n';
    const at = (depth) => {
      const open = '\\begin{itemize}\n\\item a\n'.repeat(depth + 1);
      const close = '\\end{itemize}\n'.repeat(depth + 1);
      const html = MM.markdownToHTML(open + body + '\\item b\n' + close, { outMath: { include_svg: false } });
      return {
        wrappers: (html.match(/class="center"/g) || []).length,
        lists: (html.match(/<ul[\s>]/g) || []).length,
        leaked: /\\begin\{itemize\}/.test(html),
      };
    };
    const shallow = at(0);
    [1, 2].forEach((depth) => {
      const deeper = at(depth);
      deeper.wrappers.should.equal(shallow.wrappers, 'the wrapper decision moved at depth ' + depth);
      deeper.lists.should.equal(shallow.lists + depth, 'a list was lost at depth ' + depth);
      deeper.leaked.should.equal(false, 'the list fell out as literal LaTeX at depth ' + depth);
    });
  });
  // Marker tokens are shared between the lists of one render — cloning them per open measured 12–29%
  // slower on list-heavy input. So the write is pinned where it lands, and where it must not: the
  // bucket is dropped per render, or a host reusing one `env` would carry it into the next document.
  it('a write into a marker token stays inside the render that made it', () => {
    const list = '\\begin{itemize}\n\\item a\n\\end{itemize}';
    const md = markdownIt({ html: true }).use(mathpixMarkdownPlugin, { outMath: { include_svg: false } });
    const base = md.renderer.rules.text;
    let fired = 0;
    md.renderer.rules.text = (tokens, idx, opts, env, slf) => {
      if (tokens[idx].content === '•' && fired++ === 0) {
        tokens[idx].content = 'STAMPED';
      }
      return base ? base(tokens, idx, opts, env, slf) : tokens[idx].content;
    };
    const markers = (html) => html.match(/<span class="li_level">[\s\S]*?<\/span>/g) || [];
    const env = {};
    const inside = markers(md.render([list, list, list].join('\n\n'), env));
    inside.should.have.length(3);
    inside.every((m) => /STAMPED/.test(m))
      .should.equal(true, 'the tokens are no longer shared — the clone cost belongs in the spec, not here');
    markers(md.render(list, env)).should.deep.equal(['<span class="li_level">•</span>'],
      'the write survived into the next render through the same env');
  });
  // Marker tokens are cached and shared, and a cell render writes `isTableCell` onto them. Rendering a
  // list in a cell must therefore not change how the next list outside a table draws its marker.
  it('a list rendered in a table cell leaves the shared markers alone', () => {
    const plain = '\\begin{itemize}\n\\item a\n\\end{itemize}';
    const marker = (src) => {
      const html = MM.markdownToHTML(src, { outMath: { include_svg: false } });
      return (html.match(/<span class="li_level"[^>]*>[\s\S]*?<\/span>/) || [])[0];
    };
    const before = marker(plain);
    MM.markdownToHTML('| a |\n|---|\n| \\begin{itemize}\\item x\\end{itemize} |',
      { outMath: { include_svg: false } });
    marker(plain).should.equal(before, 'the marker changed after one was rendered in a cell');
  });
  // Argument spans are paired over the whole source, so the length of an argument decides nothing: a
  // long balanced `\caption{}` holding a closer is text, an unmatched `{` before one is not knowable
  // and every closer past it counts. Both sides checked at lengths a bounded window would have cut.
  it('the length of a command argument does not decide whether a closer is ours', () => {
    const filler = 'filler line between the list and the wrapper closer\n'.repeat(120);
    [10, 4200, 20000].forEach((pad) => {
      const balanced = '\\begin{itemize}\n\\item a\n\\begin{center}\n'
        + '\\caption{' + 'x'.repeat(pad) + ' \\end{itemize} tail}\n'
        + '\\end{center}\n\\item b\n\\end{itemize}\n';
      const { items, leaked } = rendered(balanced);
      items.should.equal(2, 'a closer inside a caption was taken as ours at pad ' + pad);
      leaked.should.equal(false, 'the list fell out as literal LaTeX at pad ' + pad);
    });
    // A closer of ours ahead of the wrapper's own closer keeps the wrapper transparent, however far
    // that closer sits, and an unmatched `{` before it leaves the same decline.
    const far = '\\begin{itemize}\n\\item a\n\\begin{center}\nb\n\\end{itemize}\n' + filler + '\\end{center}\n';
    rendered(far).items.should.equal(1);
    rendered(far).leaked.should.equal(false);
    const unmatched = '\\begin{itemize}\n\\item a\n\\begin{center}\n\\caption{' + 'x'.repeat(4090)
      + '\nb\n\\end{itemize}\n' + filler + '\\end{center}\n';
    rendered(unmatched).items.should.equal(1);
    rendered(unmatched).leaked.should.equal(false);
  });
  // The stack pops on the first `\end{X}` with no depth count, so a same-name nest loses the inner
  // opener and the outer closer to text. Valid LaTeX, pinned as measured in both written forms.
  it('a same-name wrapper nested in itself keeps the list, not both frames', () => {
    const html = MM.markdownToHTML(
      '\\begin{itemize}\n\\item a\n\\begin{center}\nouter\n\\begin{center}\ninner\n\\end{center}\n'
      + 'tail\n\\end{center}\n\\item b\n\\end{itemize}',
      { outMath: { include_svg: false } });
    (html.match(/<li[\s>]/g) || []).should.have.length(2);
    (html.match(/class="center"/g) || []).should.have.length(1);
    (html.match(/\\(begin|end)\{center\}/g) || []).should.have.length(2);
    // Written on one line the text after the inner closer is kept, where `master` drops it silently.
    const oneLine = MM.markdownToHTML(
      '\\begin{itemize}\n\\item a\n\\begin{center} outer \\begin{center} inner \\end{center} tail'
      + ' \\end{center}\n\\item b\n\\end{itemize}',
      { outMath: { include_svg: false } });
    (oneLine.match(/<li[\s>]/g) || []).should.have.length(2);
    (oneLine.match(/class="center"/g) || []).should.have.length(1);
    oneLine.should.include('<div>tail \\end{center}</div>');
  });
  it('a wrapper closed within the list still becomes opaque', () => {
    const src = '\\begin{itemize}\n\\item a\n\\begin{center}\n\\item[x] y\n\\end{center}\n\\item b\n\\end{itemize}';
    const html = MM.markdownToHTML(src, { outMath: { include_svg: false } });
    // Two items, not three: the `\item` inside the wrapper is text, and the wrapper is built.
    (html.match(/<li[\s>]/g) || []).should.have.length(2);
    html.should.include('class="center"');
  });
});

// Marker macros are parsed once per macro per document and reused. Keyed by the macro itself, so a
// `\renewcommand` mid-document must still switch markers — and switch back when it is restored.
describe('Cached marker tokens follow \\renewcommand:', () => {
  it('each list takes the marker in force where it sits', () => {
    const src = '\\begin{itemize}\n\\item a\n\\end{itemize}\n\n'
      + '\\renewcommand{\\labelitemi}{ZZZ}\n\n\\begin{itemize}\n\\item b\n\\end{itemize}\n\n'
      + '\\renewcommand{\\labelitemi}{\\textbullet}\n\n\\begin{itemize}\n\\item c\n\\end{itemize}\n\n'
      + '\\begin{itemize}\n\\item d\n\\begin{itemize}\n\\item e\n\\end{itemize}\n\\end{itemize}';
    const html = MM.markdownToHTML(src, { outMath: { include_svg: false } });
    [...html.matchAll(/<span class="li_level"[^>]*>([^<]*)<\/span>/g)].map((m) => m[1])
      .should.deep.equal(['•', 'ZZZ', '•', '•', '–']);
  });
  // The shared tokens are rendered, never rewritten — a math marker, which carries the most token
  // state, must come out the same in every list that uses it and again on the next render.
  it('a math marker renders alike in every list, and twice', () => {
    const src = '\\renewcommand{\\labelitemi}{$\\star$}\n\n'
      + '\\begin{itemize}\n\\item a\n\\end{itemize}\n\n'
      + '\\begin{itemize}\n\\item b\n\\begin{itemize}\n\\item c\n\\end{itemize}\n\\end{itemize}';
    const first = MM.markdownToHTML(src, { outMath: { include_svg: false } });
    MM.markdownToHTML(src, { outMath: { include_svg: false } }).should.equal(first);
    // Two lists take the math marker; the deeper level keeps its own default.
    (first.match(/class="math-inline/g) || []).should.have.length(2);
    first.should.include('<span class="li_level">–</span>');
  });
  // The cache lives on `env`, which a consumer may hand to two instances: tokens parsed under one
  // option set must not serve the other.
  it('a shared env carries no marker tokens between md instances', () => {
    const src = '\\renewcommand{\\labelitemi}{$\\star$}\n\n\\begin{itemize}\n\\item a\n\\end{itemize}';
    const build = (outMath) => markdownIt({ html: true }).use(mathpixMarkdownPlugin, { outMath });
    const plain = build({ include_svg: false });
    const withMathml = build({ include_mathml: true, include_svg: false });
    const marker = (html) => (html.match(/<span class="li_level"[\s\S]*?<\/li>/) || [''])[0];
    const alonePlain = marker(plain.render(src, {}));
    const aloneMathml = marker(withMathml.render(src, {}));
    alonePlain.should.not.equal(aloneMathml, 'the option does not change the marker, so this proves nothing');
    const shared = {};
    marker(plain.render(src, shared)).should.equal(alonePlain);
    marker(withMathml.render(src, shared)).should.equal(aloneMathml);
    marker(plain.render(src, shared)).should.equal(alonePlain);
  });
  // The array is copied per list, the tokens are not — cloning them measured 12–29% slower on
  // list-heavy input. So a rule that writes into a marker token reaches every later list: pinned here
  // because nothing stops it, and a consumer plugin has to treat those tokens as read-only.
  it('the tokens are shared between lists, so writing into one reaches the next', () => {
    const md = markdownIt({ html: true }).use(mathpixMarkdownPlugin, { outMath: { include_svg: false } });
    const src = '\\renewcommand{\\labelitemi}{Q}\n\n\\begin{itemize}\n\\item a\n\\end{itemize}\n\n'
      + '\\begin{itemize}\n\\item b\n\\end{itemize}';
    const tokens = md.parse(src, {});
    const opens = tokens.filter((token) => token.type === 'itemize_list_open');
    opens.should.have.lengthOf(2);
    opens[0].itemizeLevel[0].should.not.equal(opens[1].itemizeLevel[0], 'the array is meant to be copied');
    opens[0].itemizeLevel[0][0].should.equal(opens[1].itemizeLevel[0][0]);
    opens[0].itemizeLevel[0][0].content = 'ZZZ';
    [...md.renderer.render(tokens, md.options, {})
      .matchAll(/<span class="li_level"[^>]*>([^<]*)<\/span>/g)].map((m) => m[1])
      .should.deep.equal(['ZZZ', 'ZZZ']);
  });
});

// A list inside a wrapper env is parsed from the wrapper's inline content, on a synthetic state that
// cannot see the enclosing list — so it claims top level. The renderer must not reset its depth for
// that: the nested list took a level-1 marker and left the counter negative for the item after it.
describe('Marker depth survives a wrapper env between two list levels:', () => {
  const markers = (src) => {
    const html = MM.markdownToHTML(src, { outMath: { include_svg: false } });
    return [...html.matchAll(/<span class="li_level"[^>]*>([^<]*)<\/span>/g)].map((m) => m[1]);
  };
  const inner = '\\begin{itemize}\n\\item inner\n\\end{itemize}';
  const shape = (wrapper) => '\\begin{itemize}\n\\item a\n'
    + (wrapper ? '\\begin{' + wrapper + '}\n' + inner + '\n\\end{' + wrapper + '}' : inner)
    + '\n\\item b\n\\end{itemize}';
  it('without a wrapper the sequence is outer, level 2, outer', () => {
    markers(shape(null)).should.deep.equal(['•', '–', '•']);
  });
  ['center', 'left', 'right', 'table', 'figure'].forEach((wrapper) => {
    it(`${wrapper} keeps the same sequence`, () => {
      markers(shape(wrapper)).should.deep.equal(['•', '–', '•']);
    });
  });
  it('three levels through a wrapper keep the itemize order', () => {
    markers('\\begin{itemize}\n\\item a\n\\begin{center}\n\\begin{itemize}\n\\item i\n'
      + '\\begin{itemize}\n\\item ii\n\\end{itemize}\n\\end{itemize}\n\\end{center}\n'
      + '\\item b\n\\end{itemize}').should.deep.equal(['•', '–', '∗', '•']);
  });
  it('the next independent list starts at the top level again', () => {
    markers(shape('center') + '\n\n\\begin{itemize}\n\\item next\n\\end{itemize}')
      .should.deep.equal(['•', '–', '•', '•']);
  });
});

// Same defect on the enumerate side, where the marker is the list style rather than a glyph: the
// nested list restarted numbering at level 1 (`decimal | decimal`) through every wrapper env.
describe('Numbering depth survives a wrapper env between two enumerate levels:', () => {
  const styles = (src) => {
    const html = MM.markdownToHTML(src, { outMath: { include_svg: false } });
    return [...html.matchAll(/list-style-type: ([a-z-]+)/g)].map((m) => m[1]);
  };
  const inner = '\\begin{enumerate}\n\\item i\n\\end{enumerate}';
  const shape = (wrapper) => '\\begin{enumerate}\n\\item a\n'
    + (wrapper ? '\\begin{' + wrapper + '}\n' + inner + '\n\\end{' + wrapper + '}' : inner)
    + '\n\\item b\n\\end{enumerate}';
  it('without a wrapper the nested level is lower-alpha', () => {
    styles(shape(null)).should.deep.equal(['decimal', 'lower-alpha']);
  });
  ['center', 'left', 'right', 'table', 'figure'].forEach((wrapper) => {
    it(`${wrapper} keeps the same styles`, () => {
      styles(shape(wrapper)).should.deep.equal(['decimal', 'lower-alpha']);
    });
  });
  it('the next independent list starts at decimal again', () => {
    styles(shape('center') + '\n\n\\begin{enumerate}\n\\item next\n\\end{enumerate}')
      .should.deep.equal(['decimal', 'lower-alpha', 'decimal']);
  });
});

// Two readers ask "is there a `\item` here": the split reader, which consumes only the command so its
// offset is the item's own, and the marker reader, which consumes the optional argument as well. They
// must agree on *whether* one is there — one saying yes where the other says no costs an item.
describe('the two `\\item` readers agree on what an item is:', () => {
  it('over the shapes that decide it', () => {
    const tails = ['', ' x', 'sep 1pt', 'indent 2em', '[m] x', '[m]x', ' [m] x', '[unclosed x', '[] x',
      '[m', '[[m]] x', 'ize x', 'X', '\n', '\t[m] x', '  ', '[a\\]b] x'];
    tails.forEach((tail) => {
      const text = '\\item' + tail;
      LATEX_ITEM_SPLIT_RE.test(text)
        .should.equal(LATEX_ITEM_COMMAND_INLINE_RE.test(text), 'disagree on ' + JSON.stringify(text));
    });
  });
  it('and on text that only looks like one', () => {
    ['item x', '\\\\itemx', 'a \\item b', '\\ item', '\\Item x'].forEach((text) => {
      LATEX_ITEM_SPLIT_RE.test(text)
        .should.equal(LATEX_ITEM_COMMAND_INLINE_RE.test(text), 'disagree on ' + JSON.stringify(text));
    });
  });
});

// `<ul>`/`<ol>` admit only `<li>`. A chunk before the first `\item` — a block env, a fence, an
// unsupported command — used to land there as a text node or a `<div>`, so it now gets a marker-less
// `<li>`, and a sublist written in that chunk goes inside it. Every direct child of every list
// element in the fixtures is checked, so a fixture added later cannot record the invalid shape.
describe('A list element holds nothing but <li>:', () => {
  // Void and SVG leaf tags never open an element, so they must not go on the stack.
  const CHILDLESS = new Set(['br', 'img', 'hr', 'input', 'meta', 'link', 'source', 'col', 'area',
    'base', 'wbr', 'embed', 'track', 'path', 'use', 'rect', 'circle', 'ellipse', 'line',
    'polyline', 'polygon', 'stop']);
  // Every direct child, not just the first: reading one child passed while an invalid `<ul>` sat
  // second. Whitespace between the tags is not a child — a fixture pins that shape.
  const invalidChild = (html) => {
    const tags = /<(\/?)([a-zA-Z][\w:-]*)\b[^>]*?(\/?)>/g;
    const stack = [];
    let last = 0;
    let match;
    const inList = () => stack.length > 0 && (stack[stack.length - 1] === 'ul' || stack[stack.length - 1] === 'ol');
    while ((match = tags.exec(html)) !== null) {
      const between = html.slice(last, match.index);
      last = match.index + match[0].length;
      if (inList() && between.trim()) {
        return 'text: ' + between.trim().slice(0, 40);
      }
      const name = match[2].toLowerCase();
      if (match[1]) {
        const at = stack.lastIndexOf(name);
        if (at >= 0) {
          stack.length = at;
        }
        continue;
      }
      if (inList() && name !== 'li') {
        return '<' + name + '>';
      }
      // The converse, which the walk above cannot see: an `<li>` outside any list.
      if (name === 'li' && !inList()) {
        return '<li> outside any list';
      }
      if (!match[3] && !CHILDLESS.has(name)) {
        stack.push(name);
      }
    }
    return inList() && html.slice(last).trim() ? 'tail: ' + html.slice(last).trim().slice(0, 40) : '';
  };
  // Rendered once for the three sweeps below: doing it per sweep cost 1.3s of the 2s per-test budget,
  // which a slower runner does not have.
  let renderedFixtures = null;
  const eachFixture = (check) => {
    if (!renderedFixtures) {
      renderedFixtures = require('./_data/_lists/_data')
        .map((test) => ({ latex: test.latex, html: MM.markdownToHTML(test.latex, fixtureOptions(test)) }));
    }
    renderedFixtures.forEach(check);
  };
  it('holds across every list fixture', () => {
    eachFixture(({ latex, html }) => {
      invalidChild(html).should.equal('', 'invalid child of a list element for ' + JSON.stringify(latex));
    });
  });
  // Separate from the child check, which reads nesting and not counts: a fuzz run found shapes that
  // leave an item open, and those pass the child walk while the HTML is still unusable as a DOM.
  it('every list fixture closes every tag it opens', () => {
    eachFixture(({ latex, html }) => {
      const count = (re) => (html.match(re) || []).length;
      count(/<li[\s>]/g).should.equal(count(/<\/li>/g),
        'unbalanced <li> for ' + JSON.stringify(latex));
      count(/<(ul|ol)[\s>]/g).should.equal(count(/<\/(ul|ol)>/g),
        'unbalanced list element for ' + JSON.stringify(latex));
    });
  });
  it('holds for the one-line form, where the chunk shares the \\begin line', () => {
    const html = MM.markdownToHTML('\\begin{itemize} loose \\item x \\end{itemize}',
      { outMath: { include_svg: false } });
    invalidChild(html).should.equal('', 'the one-line form bypasses the wrap');
    (html.match(/<li[\s>]/g) || []).should.have.length(2);
  });
  // Wrapped after the tokens are emitted, so a chunk that emits nothing gets no `<li>` — no predicate
  // decides that from its text.
  // The inline path builds its own state, and a token created through it threw there — the rule
  // caught that and dropped the whole list to literal LaTeX, warning once.
  it('holds on the inline path, where the list sits inside a paragraph or a cell', () => {
    const shapes = [
      'text before \\begin{itemize} loose \\item a \\end{itemize} after',
      '| a |\n|---|\n| \\begin{itemize} loose \\item x \\end{itemize} |',
    ];
    shapes.forEach((src) => {
      const warned = [];
      const warn = console.warn;
      console.warn = (...args) => warned.push(args.join(' '));
      const html = MM.markdownToHTML(src, { outMath: { include_svg: false } });
      console.warn = warn;
      warned.should.have.length(0, 'the list rule failed for ' + JSON.stringify(src));
      html.should.not.include('\\begin{itemize}');
      invalidChild(html).should.equal('', 'invalid child for ' + JSON.stringify(src));
      (html.match(/<li[\s>]/g) || []).should.have.length(2);
    });
  });
  // A leading space is not content: the one-line form keeps its single item.
  it('a whitespace-only run on the inline path gets no <li>', () => {
    const html = MM.markdownToHTML('text \\begin{itemize} \\item a \\end{itemize} tail',
      { outMath: { include_svg: false } });
    (html.match(/<li[\s>]/g) || []).should.have.length(1);
  });
  it('a chunk that renders to nothing gets no <li>', () => {
    const items = (src) => (MM.markdownToHTML(src, { outMath: { include_svg: false } })
      .match(/<li[\s>]/g) || []).length;
    items('\\begin{itemize}\n   \n\\item a\n\\end{itemize}').should.equal(1);
    items('\\begin{itemize}\n\\renewcommand{\\labelitemi}{ZZ}\n\\item a\n\\end{itemize}').should.equal(1);
  });
  // The wrapper carries what a written item carries for the same content: the `block` class, the
  // attribute pair a consumer reads, and line numbering.
  it('the wrapper is marked like a written item holding the same content', () => {
    const first = (src, opts) => (MM.markdownToHTML(src, opts).match(/<li[^>]*>/g) || [])[0];
    const blockChunk = '\\begin{itemize}\n\\begin{center}q\\end{center}\n\\item a\n\\end{itemize}';
    first(blockChunk, { outMath: { include_svg: false } }).should.include('li_itemize block');
    first(blockChunk, { outMath: { include_svg: false } }).should.include('data-custom-marker="true"');
    first('\\begin{itemize}\nloose\n\\item a\n\\end{itemize}',
      { outMath: { include_svg: false }, lineNumbering: true }).should.include('data_line_start=');
  });
  // A list in a table cell renders its leaf tokens once per token for HTML and once more per run for
  // the exports. Pinned per token, not in total: a rewrite that re-renders the run per member would
  // be quadratic in the cell, and the HTML would gain a duplicate.
  it('a leaf run in a cell costs a constant number of renders per token', () => {
    const build = (exports_) => {
      const md = markdownIt({ html: true }).use(mathpixMarkdownPlugin, {
        outMath: Object.assign({ include_svg: false, include_table_html: true }, exports_),
      });
      let renders = 0;
      md.renderer.rules.text = (tokens, idx) => { renders++; return tokens[idx].content; };
      return { md, renders: () => renders };
    };
    const cell = (k) => '\\begin{tabular}{|l|}\n\\begin{itemize}\\item ' +
      Array.from({ length: k }, (_, i) => 'w' + i).join(' [l](u) ') + '\\end{itemize}\n\\end{tabular}\n';
    [{}, { include_tsv: true, include_csv: true, include_table_markdown: true }].forEach((exports_) => {
      const perToken = [2, 16].map((k) => {
        const { md, renders } = build(exports_);
        const html = md.render(cell(k), {});
        return { ratio: renders() / k, first: (html.match(/>w0/g) || []).length };
      });
      perToken[1].ratio.should.equal(perToken[0].ratio, 'renders per leaf token grew with the run');
      perToken.forEach(({ first }) => first.should.equal(1, 'the leaf reached the visible HTML twice'));
    });
  });
  it('holds for a chunk before the first \\item', () => {
    const shapes = [
      '\\begin{itemize}\n\\begin{table}\\caption{q}\\end{table}\n\\item a\n\\end{itemize}',
      '\\begin{itemize}\n\\itemsep 0pt\n\\item a\n\\end{itemize}',
      '\\begin{itemize}\nplain text\n\\item a\n\\end{itemize}',
      '\\begin{enumerate}\n\\begin{center}q\\end{center}\n\\item a\n\\end{enumerate}',
    ];
    shapes.forEach((src) => {
      const html = MM.markdownToHTML(src, { outMath: { include_svg: false } });
      invalidChild(html).should.equal('', 'invalid child for ' + JSON.stringify(src));
      html.should.include('data-marker-empty="true"');
    });
  });
});
