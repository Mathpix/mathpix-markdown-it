let chai = require('chai');
chai.should();

const fs = require('fs');
const path = require('path');
const MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;
const markdownIt = require('markdown-it');
const { mathpixMarkdownPlugin } = require('../lib/index.js');
const { FontMetrics } = require('../lib/markdown/common/text-dimentions');
const { MARKER_GAP_EM, LIST_DEFAULT_INDENT_EM, DEFAULT_FONT_SIZE_PX, DEFAULT_EX_PX } = require('../lib/markdown/common/consts');

const { JSDOM } = require('jsdom');
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

const options = { cwidth: 800, htmlTags: true };
const render = (src) => MM.markdownToHTML(src, options);
// Only the top-level list carries the padding attribute (marker width + gap, em-valued).
const hasPadding = (html) => /data-padding-inline-start="[\d.]+em"/.test(html);
const paddingValue = (html) => {
  const m = html.match(/data-padding-inline-start="([\d.]+)em"/);
  return m ? Number(m[1]) : null;
};

describe('List marker padding — width edge cases:', () => {
  it('short math marker stays under the threshold (no padding)', () => {
    // `$x^2$` is measured by its rendered widthEx but is narrow — its em value stays
    // under the 2.5em default, so no custom padding is emitted.
    hasPadding(render('\\begin{itemize}\n\\item[$x^2$] a\n\\item[y] b\n\\end{itemize}')).should.equal(false);
  });
  it('wide math marker gets padding from its rendered width (em)', () => {
    // math width comes from token.widthEx (7.329ex); reserve = (7.329 × EX_TO_EM) + gap ≈ 4.43em.
    paddingValue(render('\\begin{itemize}\n\\item[$x^4 + x^4$] a\n\\end{itemize}')).should.equal(4.43);
  });
  it('math marker on the block-content path gets the same padding', () => {
    // Block-content items are measured on a separate code path; must match the inline one.
    paddingValue(render(
      '\\begin{itemize}\n\\item[$x^4 + x^4$] a\n\\begin{figure}\n\\caption{c}\n\\end{figure}\n\\end{itemize}'
    )).should.equal(4.43);
  });
  it('math marker padding needs a measured widthEx (SVG); other configs keep the default indent', () => {
    // widthEx is only populated in the SVG pipeline. Without it we do not fabricate a width,
    // so the marker keeps the default indent (no custom padding) rather than a guess.
    const src = '\\begin{itemize}\n\\item[$x^4 + x^4$] a\n\\end{itemize}';
    hasPadding(MM.markdownToHTML(src, { ...options, outMath: {} })).should.equal(true);
    [{ skipMathToHtml: true }, { include_latex: true, include_svg: false },
     { include_mathml: true, include_svg: false }].forEach((outMath) => {
      hasPadding(MM.markdownToHTML(src, { ...options, outMath })).should.equal(false);
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
    // "longtext" per-glyph-class widths + 0.625 gap ≈ 4.93em.
    paddingValue(render('\\begin{itemize}\n\\item[longtext] a\n\\end{itemize}')).should.equal(4.93);
  });
  it('reserve is per glyph class: wide glyphs reserve more than narrow of the same length', () => {
    // 8 wide capitals reserve more than 8 mixed lowercase — widths are class-based, not a flat count.
    paddingValue(render('\\begin{itemize}\n\\item[WWWWWWWW] a\n\\end{itemize}'))
      .should.be.above(paddingValue(render('\\begin{itemize}\n\\item[longtext] a\n\\end{itemize}')));
  });
  it('a code-span marker contributes its width (like plain text)', () => {
    // code_inline carries content but no children; it must be measured, not skipped.
    paddingValue(render('\\begin{itemize}\n\\item[`longtext`] a\n\\end{itemize}'))
      .should.equal(paddingValue(render('\\begin{itemize}\n\\item[longtext] a\n\\end{itemize}')));
  });
  it('an html-tag marker measures only the visible text, not the markup', () => {
    // `html_inline` content is raw tags; it must not be counted (would wildly over-reserve).
    paddingValue(render('\\begin{itemize}\n\\item[<b>longtext</b>] a\n\\end{itemize}'))
      .should.equal(paddingValue(render('\\begin{itemize}\n\\item[longtext] a\n\\end{itemize}')));
  });
  it('a real (non-pathological) long marker is not clamped', () => {
    // ~22 chars must still get its full reserve; the clamp only guards pathological widths.
    paddingValue(render('\\begin{itemize}\n\\item[' + 'a'.repeat(22) + '] a\n\\end{itemize}')).should.be.above(12);
  });
  it('a pathological marker is clamped so it cannot blow out the content column', () => {
    paddingValue(render('\\begin{itemize}\n\\item[' + 'x'.repeat(60) + '] a\n\\end{itemize}')).should.equal(20);
  });
  it('a mixed text+math marker sums both parts (not the max)', () => {
    const both = paddingValue(render('\\begin{itemize}\n\\item[abcd $x^4 + x^4$] a\n\\end{itemize}'));
    const text = paddingValue(render('\\begin{itemize}\n\\item[abcd] a\n\\end{itemize}'));
    const math = paddingValue(render('\\begin{itemize}\n\\item[$x^4 + x^4$] a\n\\end{itemize}'));
    both.should.be.above(text);
    both.should.be.above(math);
  });
  it('astral marker (emoji) falls in the normal class, not wide', () => {
    // isWideChar covers BMP ranges only, so astral emoji get NORMAL_EM (0.62). Two emoji
    // ≈ 1.24em + gap < 2.5em default → no custom padding (would if they were wide/CJK).
    hasPadding(render('\\begin{itemize}\n\\item[\u{1F600}\u{1F600}] a\n\\item[x] b\n\\end{itemize}')).should.equal(false);
  });
  const ulStyles = (html) => [...html.matchAll(/<[uo]l[^>]*style="([^"]*)"/g)].map((m) => m[1]);
  it('deep numbering fits the accumulated ancestor indent, so no level over-reserves', () => {
    // "3.1.1.1" (~4.31em) fits within the ancestors' 2.5em-per-level indent → no custom padding.
    const html = render(
      '\\begin{itemize}\n\\item[1.] a\n\\item[2.] b\n' +
      '\\begin{itemize}\n\\item[3.1] c\n' +
      '\\begin{itemize}\n\\item[3.1.1.1] d\n\\item[3.1.1.2] e\n\\end{itemize}\n' +
      '\\end{itemize}\n\\end{itemize}');
    hasPadding(html).should.equal(false);
  });
  it('an overflowing nested marker reserves only the shortfall; the outer stays default', () => {
    // Outer "1." narrow → default. Nested overflows (need > ancestor 2.5 + default 2.5), so it
    // emits need − ancestorIndent on its own list, not the full width.
    const html = render(
      '\\begin{itemize}\n\\item[1.] a\n' +
      '\\begin{itemize}\n\\item[XXXXXXXXXXXX] b\n\\end{itemize}\n' +
      '\\end{itemize}');
    const styles = ulStyles(html);
    styles[0].should.not.match(/padding-inline-start/);
    styles[1].should.match(/padding-inline-start:\s*8\.93em/); // 11.43 need − 2.5 ancestor
  });
  it('a wider parent absorbs the child: its indent counts toward the ancestor sum', () => {
    // Top "11.33" emits 3.51em → nested "XXXXX" (5.13) fits under 3.51 + 2.5 → child stays default.
    const html = render(
      '\\begin{itemize}\n\\item[11.33] a\n' +
      '\\begin{itemize}\n\\item[XXXXX] b\n\\end{itemize}\n' +
      '\\end{itemize}');
    const styles = ulStyles(html);
    styles[0].should.match(/padding-inline-start:\s*3\.51em/);
    styles[1].should.not.match(/padding-inline-start/);
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

describe('Caption numbering is not shifted by a speculative list parse:', () => {
  const figNos = (html) => (html.match(/Figure\s+(\d+)/g) || []).map((s) => s.match(/\d+/)[0]);
  const figNo = (html) => figNos(html)[0] || null;
  const tblNo = (html) => { const m = html.match(/Table\s+(\d+)/); return m ? m[1] : null; };
  const listFig = (c) => '\\begin{itemize}\n\\item[a] x\n\\begin{figure}\n\\caption{' + c + '}\n\\end{figure}\n\\end{itemize}\n';
  const figSrc = 'Para.\n' + listFig('F');
  const tblSrc = 'Para.\n\\begin{itemize}\n\\item[a] x\n\\begin{table}\n\\caption{T}\n\\begin{tabular}{|l|}\nc\n\\end{tabular}\n\\end{table}\n\\end{itemize}\n';
  // Absolute values: a relative assert would pass even if both sides shifted together (master's bug).
  it('a figure in a list is numbered 1, not inflated by the paragraph terminator probe', () => {
    figNo(render(figSrc)).should.equal('1');
  });
  it('a trailing \\footnote leaves the figure number at 1', () => {
    figNo(render(figSrc + 'tail \\footnote{n}')).should.equal('1');
  });
  it('a trailing \\footnotetext leaves the figure number at 1', () => {
    figNo(render(figSrc + 'tail \\footnotetext{n}')).should.equal('1');
  });
  it('a trailing \\footnote leaves the table number at 1', () => {
    tblNo(render(tblSrc + 'tail \\footnote{n}')).should.equal('1');
  });
  it('two lists each with a figure number sequentially (1, 2)', () => {
    figNos(render('Para.\n' + listFig('A') + '\nmid\n' + listFig('B'))).should.deep.equal(['1', '2']);
  });
  it('a bare figure, a list-with-figure, and a bare figure number 1, 2, 3', () => {
    const src = '\\begin{figure}\n\\caption{A}\n\\end{figure}\n\n' + listFig('B') +
      '\n\\begin{figure}\n\\caption{C}\n\\end{figure}\n';
    figNos(render(src)).should.deep.equal(['1', '2', '3']);
  });
  it('a figure in a nested list is numbered 1', () => {
    const nested = '\\begin{itemize}\n\\item[a] x\n\\begin{itemize}\n\\item[b] y\n' +
      '\\begin{figure}\n\\caption{N}\n\\end{figure}\n\\end{itemize}\n\\end{itemize}\n';
    figNos(render('Para.\n' + nested)).should.deep.equal(['1']);
  });
  it('a \\ref to a figure inside a list resolves to its caption number', () => {
    const src = 'Para.\n\\begin{itemize}\n\\item[a] x\n\\begin{figure}\n\\caption{F}\n' +
      '\\label{fig:a}\n\\end{figure}\n\\end{itemize}\n\nSee \\ref{fig:a}.\n';
    const html = render(src);
    const num = figNo(html);
    num.should.equal('1');
    const ref = html.match(/value="fig%3Aa"[^>]*>([^<]+)</);
    ref[1].should.equal(num); // the \ref link renders the same number
  });
});

describe('List marker padding — attribute contract & threshold:', () => {
  it('data-padding-inline-start value is a bare em length and matches the inline style', () => {
    const html = render('\\begin{itemize}\n\\item[longtext] a\n\\end{itemize}');
    const v = html.match(/data-padding-inline-start="([^"]+)"/)[1];
    v.should.match(/^\d+(\.\d+)?em$/);
    html.should.include('padding-inline-start: ' + v + ';');
  });
  it('a short marker below the default indent keeps the default (no attribute)', () => {
    // "abc" ≈ 1.86em + gap = 2.49em < 2.5em default → no custom padding emitted.
    hasPadding(render('\\begin{itemize}\n\\item[abc] a\n\\end{itemize}')).should.equal(false);
  });
});

describe('List marker padding — reserve covers the true glyph width (Arial):', () => {
  // The real invariant to protect: the rendered indent is never smaller than the marker's
  // actual glyph width + gap. Measured against the Arial fixture at the default 16px/ex.
  const metrics = new FontMetrics();
  const dir = path.resolve(__dirname, '_data/_markdownToHTMLWithSize/fonts');
  metrics.loadFont({
    font: fs.readFileSync(path.join(dir, 'Arial.ttf')).buffer,
    fontSize: DEFAULT_FONT_SIZE_PX,
    ex: DEFAULT_EX_PX,
  });
  const trueEm = (text) => metrics.getWidth(text) / DEFAULT_FONT_SIZE_PX;
  const indentEm = (marker) =>
    paddingValue(render('\\begin{itemize}\n\\item[' + marker + '] a\n\\end{itemize}')) || LIST_DEFAULT_INDENT_EM;
  // (CJK/fullwidth is intentionally excluded — Arial isn't its render font, so its "true"
  // width here would be meaningless.)
  ['note', '11.33', 'longtext', '(d1)', 'NOTE', 'SECTION', 'WWWWWWWW', 'Introduction'].forEach((marker) => {
    it('reserves at least the glyph width + gap for "' + marker + '"', () => {
      indentEm(marker).should.be.at.least(trueEm(marker) + MARKER_GAP_EM);
    });
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
