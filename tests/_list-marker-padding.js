let chai = require('chai');
chai.should();

const MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;

const { JSDOM } = require('jsdom');
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

const options = { cwidth: 800, htmlTags: true };
const render = (src) => MM.markdownToHTML(src, options);
// Only the top-level list carries the padding attribute.
const hasPadding = (html) => /data-padding-inline-start="(\d+)"/.test(html);
const paddingValue = (html) => {
  const m = html.match(/data-padding-inline-start="(\d+)"/);
  return m ? Number(m[1]) : null;
};

describe('List marker padding — width edge cases:', () => {
  it('math-only marker: non-text tokens are ignored, so no padding', () => {
    // `$x^2$` contributes no text-token width; the list stays at the default indent.
    // Assumes the math plugin tokenizes `$…$` as a non-text token (not `text`); if math
    // tokenization changes, revisit computeMarkerPadding's text-token filter.
    hasPadding(render('\\begin{itemize}\n\\item[$x^2$] a\n\\item[y] b\n\\end{itemize}')).should.equal(false);
  });

  it('long plain marker still gets padding (control for the math case)', () => {
    paddingValue(render('\\begin{itemize}\n\\item[longtext] a\n\\end{itemize}')).should.equal(112);
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
