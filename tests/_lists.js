let chai = require('chai');
let should = chai.should();

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;
const markdownIt = require('markdown-it');
const { mathpixMarkdownPlugin } = require('../lib/index.js');

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


describe('Check Lists:', () => {
  const tests = require('./_data/_lists/_data');
  tests.forEach(function(test) {
    const html = MM.markdownToHTML(test.latex, options);
    describe('Latex => ' + test.latex, () => {
      it('Checking result html', (done) => {
        html.should.equal(test.html);
        done();
      });
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
  // The guard parses at most 4096 characters for argument spans. Past that a closer reads as unmatched,
  // which declines — so a wrapper whose closer sits far away still leaves the list rendering.
  it('a closer beyond the guard window still leaves the list rendering', () => {
    const filler = 'filler line to push the closer past the guard window\n'.repeat(120);
    const far = '\\begin{itemize}\n\\item a\n\\begin{center}\nb\n\\end{itemize}\n' + filler + '\\end{center}\n';
    far.length.should.be.greaterThan(4096, 'the window is not exceeded, so this proves nothing');
    const { items, leaked } = rendered(far);
    items.should.equal(1);
    leaked.should.equal(false);
    // A `{` opening near the bound is the truncation edge: its argument cannot be paired, and the
    // conservative side is the same decline.
    const atEdge = '\\begin{itemize}\n\\item a\n\\begin{center}\n\\caption{' + 'x'.repeat(4090)
      + '\nb\n\\end{itemize}\n' + filler + '\\end{center}\n';
    const edge = rendered(atEdge);
    edge.items.should.equal(1);
    edge.leaked.should.equal(false);
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
