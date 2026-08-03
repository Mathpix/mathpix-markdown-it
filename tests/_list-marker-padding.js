let chai = require('chai');
chai.should();

const fs = require('fs');
const path = require('path');
const MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;
const markdownIt = require('markdown-it');
const { mathpixMarkdownPlugin } = require('../lib/index.js');
const { FontMetrics } = require('../lib/markdown/common/text-dimentions');
const { MARKER_GAP_EM, LIST_DEFAULT_INDENT_EM, DEFAULT_FONT_SIZE_PX, DEFAULT_EX_PX } = require('../lib/markdown/common/consts');
const { resolveListPadding } = require('../lib/markdown/md-latex-lists-env/latex-list-items');
const { render_itemize_list_open } = require('../lib/markdown/md-latex-lists-env/render-latex-list-env');
const Token = require('markdown-it/lib/token');

const { JSDOM } = require('jsdom');
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

const options = { cwidth: 800, htmlTags: true };
const render = (src) => MM.markdownToHTML(src, options);
const hasPadding = (html) => /data-padding-inline-start="[\d.]+em"/.test(html);
const paddingValue = (html) => {
  const m = html.match(/data-padding-inline-start="([\d.]+)em"/);
  return m ? Number(m[1]) : null;
};

// Rendered-HTML behaviour (marker padding, B2 nesting, empty-<>, \item detection, footnote
// terminators) is locked by full-HTML fixtures in tests/_data/_lists/_data.js. What stays here
// can't be a fixture: config-varying renders, env-state, font-metric invariants, and a unit test.

describe('List marker padding — math widthEx per config:', () => {
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
});

describe('No empty <> item bodies from leaked env.isBlock:', () => {
  it('a closed list with a tabular item does not leak env.isBlock', () => {
    // The tabular snapshots env into envToInline; core-inline replays it, so a captured
    // isBlock=true would wake the inline list fallback on later content. Guard the snapshot.
    const md = markdownIt({ html: true, breaks: true }).use(mathpixMarkdownPlugin, { outMath: { include_svg: true } });
    const src = '\\begin{itemize}\n\\item[a] x\n\\begin{tabular}{|l|l|}\ncell\n\\end{tabular}\n\\end{itemize}';
    const env = {};
    md.render(src, env);
    // Keys are restored to undefined, not deleted — assert on the value, not on presence.
    (['isBlock', 'inheritedListType', 'parentType', 'prentLevel']
      .some((k) => env[k] !== undefined)).should.equal(false);
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
  it('reserves at least the glyph width + gap for a bold marker (\\textbf{note})', () => {
    // Bold has the tightest measured margin; lock it against its rendered text "note".
    indentEm('\\textbf{note}').should.be.at.least(trueEm('note') + MARKER_GAP_EM);
  });
  it('covers the glyph width along the ancestor chain for a nested marker', () => {
    // Nested reserve is a shortfall, so check the CHAIN sum (ancestors + own), not one node.
    const marker = 'WWWWWWWWWWWW';
    const styles = [...render('\\begin{itemize}\n\\item[a] x\n\\begin{itemize}\n\\item[' + marker + '] y\n\\end{itemize}\n\\end{itemize}')
      .matchAll(/<ul[^>]*style="([^"]*)"/g)].map((m) => m[1]);
    const cumulative = styles.reduce((sum, st) => {
      const m = st.match(/padding-inline-start:\s*([\d.]+)em/);
      return sum + (m ? Number(m[1]) : LIST_DEFAULT_INDENT_EM);
    }, 0);
    cumulative.should.be.at.least(trueEm(marker) + MARKER_GAP_EM);
  });
});

describe('List marker padding — the default-indent threshold:', () => {
  // Narrow glyphs (0.40em) straddle the 2.5em default, so they pin both sides of the threshold.
  it('a marker at or under the default indent emits no attribute', () => {
    hasPadding(render('\\begin{itemize}\n\\item[....] a\n\\end{itemize}')).should.equal(false);
  });
  it('a marker just over the default indent emits the reserve', () => {
    paddingValue(render('\\begin{itemize}\n\\item[.....] a\n\\end{itemize}'))
      .should.be.above(LIST_DEFAULT_INDENT_EM);
  });
});

describe('data-padding-inline-start is sanitized before it reaches inline style:', () => {
  // Locks the render-side guard: only a bare `Nem` may enter style="…"; anything else is dropped.
  const md = markdownIt();
  const styleOf = (padValue) => {
    const token = new Token('itemize_list_open', 'ul', 1);
    token.isTopLevelList = true;
    token.attrSet('data-padding-inline-start', padValue);
    const html = render_itemize_list_open([token], 0, md.options, {}, md.renderer);
    const m = html.match(/style="([^"]*)"/);
    return m ? m[1] : '';
  };
  it('a valid em value is inlined as padding-inline-start', () => {
    styleOf('4.5em').should.contain('padding-inline-start: 4.5em');
  });
  it('a value carrying extra CSS never reaches the style attribute', () => {
    styleOf('1em; background:url(x)').should.equal('list-style-type: none');
  });
  it('a non-em unit is dropped', () => {
    styleOf('40px').should.equal('list-style-type: none');
  });
  it('malformed em values are dropped', () => {
    ['', 'em', '-3em', '3.5.1em', '2 em', '2em ', '.5em', '2EM', '2em;'].forEach((v) => {
      styleOf(v).should.equal('list-style-type: none');
    });
  });
});

describe('resolveListPadding — malformed depth is tolerated (no throw):', () => {
  const mk = (prentLevel, padding) => ({ prentLevel, padding, attrSet(k, v) { this[k] = v; } });
  it('a smaller (negative-relative) then skipped depth does not throw; any emitted padding is a valid em', () => {
    const toks = [mk(2, 0), mk(1, 30), mk(5, 40)]; // relative depth: 0, -1→0, 3 (skips 1,2)
    (() => resolveListPadding(toks)).should.not.throw();
    toks.forEach((t) => {
      const pad = t['data-padding-inline-start'];
      if (pad !== undefined) pad.should.match(/^\d+(\.\d+)?em$/);
    });
  });
});
