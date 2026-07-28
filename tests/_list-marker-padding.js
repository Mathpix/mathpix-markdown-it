let chai = require('chai');
chai.should();

const MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;
const markdownIt = require('markdown-it');
const { mathpixMarkdownPlugin } = require('../lib/index.js');

const { JSDOM } = require('jsdom');
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

const options = { cwidth: 800, htmlTags: true };
const render = (src) => MM.markdownToHTML(src, options);
// Only the top-level list carries the padding attribute (marker width + gap, in ex).
const hasPadding = (html) => /data-padding-inline-start="([\d.]+)"/.test(html);
const paddingValue = (html) => {
  const m = html.match(/data-padding-inline-start="([\d.]+)"/);
  return m ? Number(m[1]) : null;
};

describe('List marker padding — width edge cases:', () => {
  it('short math marker stays under the threshold (no padding)', () => {
    // `$x^2$` is measured by its rendered width but is narrow (< the > 3 threshold).
    hasPadding(render('\\begin{itemize}\n\\item[$x^2$] a\n\\item[y] b\n\\end{itemize}')).should.equal(false);
  });
  it('wide math marker gets padding from its rendered width (ex + gap)', () => {
    // math width comes from token.widthEx (7.329ex); reserve = 7.329 + 1.4 gap = 8.73ex.
    paddingValue(render('\\begin{itemize}\n\\item[$x^4 + x^4$] a\n\\end{itemize}')).should.equal(8.73);
  });
  it('math marker on the block-content path gets the same padding', () => {
    // Block-content items are measured on a separate code path; must match the inline one.
    paddingValue(render(
      '\\begin{itemize}\n\\item[$x^4 + x^4$] a\n\\begin{figure}\n\\caption{c}\n\\end{figure}\n\\end{itemize}'
    )).should.equal(8.73);
  });
  it('math marker gets padding regardless of outMath config', () => {
    // widthEx is only populated in the SVG pipeline; other configs fall back to
    // source length. The exact px differs, but padding must be present in all.
    const src = '\\begin{itemize}\n\\item[$x^4 + x^4$] a\n\\end{itemize}';
    [{}, { skipMathToHtml: true }, { include_latex: true, include_svg: false },
     { include_mathml: true, include_svg: false }].forEach((outMath) => {
      hasPadding(MM.markdownToHTML(src, { ...options, outMath })).should.equal(true);
    });
  });
  it('edge whitespace in the marker does not inflate padding', () => {
    // `\item[  wide  ]` renders trimmed; its padding must match `\item[wide]`.
    paddingValue(render('\\begin{itemize}\n\\item[  wide  ] a\n\\end{itemize}'))
      .should.equal(paddingValue(render('\\begin{itemize}\n\\item[wide] a\n\\end{itemize}')));
  });
  it('bold marker gets padding from its children (\\textbf)', () => {
    // `\textbf{…}` has no top-level text token; width comes from recursing into children.
    hasPadding(render('\\begin{itemize}\n\\item[\\textbf{x^4 + x^4}] a\n\\end{itemize}')).should.equal(true);
  });
  it('long plain marker still gets padding (control)', () => {
    // 8 chars × 2 ex/cell + 1.4 gap = 17.4ex.
    paddingValue(render('\\begin{itemize}\n\\item[longtext] a\n\\end{itemize}')).should.equal(17.4);
  });
  it('astral marker (emoji) counts as width 1, not a wide char', () => {
    // Documented limitation: isWideChar covers BMP ranges only. Two emoji = width 2,
    // under the threshold, so no padding — if emoji were counted as 2 this would indent.
    hasPadding(render('\\begin{itemize}\n\\item[\u{1F600}\u{1F600}] a\n\\item[x] b\n\\end{itemize}')).should.equal(false);
  });
  it('nested list does not receive inline padding (only the top level does)', () => {
    // Long markers at both levels; padding is applied to the top-level list only.
    const html = render(
      '\\begin{itemize}\n\\item[11.33] a\n' +
      '\\begin{itemize}\n\\item[XXXXX] b\n\\begin{figure}\n\\caption{c}\n\\end{figure}\n\\end{itemize}\n' +
      '\\end{itemize}'
    );
    (html.match(/data-padding-inline-start/g) || []).length.should.equal(1);
  });
});

describe('No empty <> item bodies from leaked env.isBlock:', () => {
  const noEmptyTags = (html) => (html.match(/<>/g) || []).length;
  it('a closed list with a tabular item does not leak env.isBlock', () => {
    // The tabular snapshots env into envToInline; core-inline replays it, so a captured
    // isBlock=true would wake the inline list fallback on later content. Guard the snapshot.
    const md = markdownIt({ html: true, breaks: true }).use(mathpixMarkdownPlugin, { outMath: { include_svg: true } });
    const src = '\\begin{itemize}\n\\item[a] x\n\\begin{tabular}{|l|l|}\ncell\n\\end{tabular}\n\\end{itemize}';
    const env = {};
    md.render(src, env);
    (['isBlock', 'inheritedListType', 'parentType', 'prentLevel'].some((k) => k in env)).should.equal(false);
  });
  it('a closed figure-list followed by an unclosed tabular-list has no empty <> bodies', () => {
    const src =
      '\\begin{itemize}\n\\item[11.33] a\n\\begin{figure}\n\\caption{Fig}\n\\end{figure}\n\\end{itemize}\n\n' +
      '\\begin{itemize}\n\\item[(d1)] b\n\\begin{tabular}{|l|l|}\ncell\n\\end{tabular}\n\\begin{itemize}';
    noEmptyTags(render(src)).should.equal(0);
  });
  it('a closed tabular-list followed by an unclosed figure-list has no empty <> bodies', () => {
    const src =
      '\\begin{itemize}\n\\item[a] x\n\\begin{tabular}{|l|l|}\ncell\n\\end{tabular}\n\\end{itemize}\n\n' +
      '\\begin{itemize}\n\\item[b] y\n\\begin{figure}\n\\caption{Fig}\n\\end{figure}';
    noEmptyTags(render(src)).should.equal(0);
  });
});

describe('Footnote does not swallow a following list / stays recognized:', () => {
  it('a \\footnote after a heading (no blank line) is still recognized', () => {
    const html = render('# Heading\ntext with \\footnote{a note}');
    html.should.include('footnote-ref');
  });
  it('a \\footnote after a tabular (no blank line) is still recognized', () => {
    const html = render('\\begin{tabular}{|l|}\ncell\n\\end{tabular}\ntext \\footnote{a note}');
    html.should.include('footnote-ref');
  });
  it('a core-markdown list before a \\footnote (no blank line) is not swallowed', () => {
    // `list` is not in the \footnote terminator set (only fence + Lists), but the core
    // markdown list rule renders it anyway — no swallow, no literal `- item` text.
    const html = render('Para text.\n- item one\n- item two\ntail \\footnote{a note}');
    html.should.include('<li>item one');
    html.should.not.include('- item one');
    html.should.include('footnote-ref');
  });
});
