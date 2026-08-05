let chai = require('chai');
chai.should();

const fs = require('fs');
const path = require('path');
const MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;
const markdownIt = require('markdown-it');
const { mathpixMarkdownPlugin } = require('../lib/index.js');
const { FontMetrics } = require('../lib/markdown/common/text-dimentions');
const { MARKER_GAP_EM, LIST_DEFAULT_INDENT_EM, LIST_MAX_INDENT_EM, DEFAULT_FONT_SIZE_PX, DEFAULT_EX_PX } = require('../lib/markdown/common/consts');
const { resolveListPadding } = require('../lib/markdown/md-latex-lists-env/latex-list-items');
const { processListChildToken, computeMarkerPadding } = require('../lib/markdown/md-latex-lists-env/latex-list-tokens');
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
  // Non-ASCII is measured by case, so uppercase Cyrillic/Greek/accented Latin belong here:
  // under an ASCII-only model they resolved to the normal class and the marker was clipped.
  ['note', '11.33', 'longtext', '(d1)', 'NOTE', 'SECTION', 'WWWWWWWW', 'Introduction',
   'ПРИМЕЧАНИЕ', 'ШИРОКО', 'ЖЖЖЖ', 'Введение', 'примечание',
   'ÄÖÜÄÖÜ', 'ΣΩΦΘΞ', 'ЉЉЉ', 'ÆŒÆŒ'].forEach((marker) => {
    it('reserves at least the glyph width + gap for "' + marker + '"', () => {
      indentEm(marker).should.be.at.least(trueEm(marker) + MARKER_GAP_EM);
    });
  });
  // Paired upper bound: the estimate is deliberately generous, but without a ceiling it can drift
  // further and silently eat the content column. Worst measured ratio is 1.56 (lowercase Greek).
  it('does not over-reserve beyond the accepted margin', () => {
    ['примечание', 'ПРИМЕЧАНИЕ', 'note', 'NOTE', 'Introduction', 'αβγδε', 'ÄÖÜÄÖÜ',
     '11.33', 'щщщщщщ', 'WWWWWWWW'].forEach((marker) => {
      const need = trueEm(marker) + MARKER_GAP_EM;
      indentEm(marker).should.be.below(need * 1.8, 'over-reserved for "' + marker + '"');
    });
  });
  it('reserves at least the glyph width + gap for a bold marker (\\textbf{note})', () => {
    // Bold has the tightest measured margin; lock it against its rendered text "note".
    indentEm('\\textbf{note}').should.be.at.least(trueEm('note') + MARKER_GAP_EM);
  });
  // Nested reserve is a shortfall, so the invariant holds over the CHAIN sum, not one node.
  const chainIndentEm = (html) => [...html.matchAll(/<ul[^>]*style="([^"]*)"/g)]
    .reduce((sum, m) => {
      const p = m[1].match(/padding-inline-start:\s*([\d.]+)em/);
      return sum + (p ? Number(p[1]) : LIST_DEFAULT_INDENT_EM);
    }, 0);
  it('covers the glyph width along the ancestor chain for a nested marker', () => {
    const marker = 'WWWWWWWWWWWW';
    chainIndentEm(render('\\begin{itemize}\n\\item[a] x\n\\begin{itemize}\n\\item[' + marker + '] y\n\\end{itemize}\n\\end{itemize}'))
      .should.be.at.least(trueEm(marker) + MARKER_GAP_EM);
  });
  // A sublist after block content is opened on the inline path; padding must still resolve.
  const wide = 'XXXXXXXXXXXX';
  const sub = '\\begin{itemize}\n\\item[' + wide + '] y\n\\end{itemize}\n';
  [
    ['after a tabular item', '\\begin{tabular}{|l|}\nq\n\\end{tabular}\n'],
    ['after a fenced-code item', '```\ncode\n```\n'],
    ['after a figure item', '\\begin{figure}\n\\caption{c}\n\\end{figure}\n'],
  ].forEach(([name, block]) => {
    it('resolves the nested reserve ' + name, () => {
      chainIndentEm(render('\\begin{itemize}\n\\item[a]\n' + block + sub + '\\end{itemize}'))
        .should.be.at.least(trueEm(wide) + MARKER_GAP_EM);
    });
  });
  // Code spans render monospace, so the reserve must clear the widest mono advance, not Arial's
  // narrow classes. 0.6em is DM Mono, the widest face `code` uses.
  [['`iiiiiiiiii`', 10], ['\\texttt{iiiiiiiiii}', 10], ['`....`', 4]].forEach(([marker, chars]) => {
    it('reserves the monospace width for "' + marker + '"', () => {
      indentEm(marker).should.be.at.least(chars * 0.6 + MARKER_GAP_EM);
    });
  });
  // A marker parses into texttt_open / texttt / texttt_close, so the bare `texttt` type reaches
  // MONO_TOKEN_TYPES here — unlike the cell-export stream, where it arrives as text.
  it('the mono branch is chosen, not merely wide enough', () => {
    indentEm('\\texttt{iiiiiiiiii}').should.equal(indentEm('`iiiiiiiiii`'));
    // The same letters as plain text land in the narrow class, which is what underreserved.
    indentEm('iiiiiiiiii').should.be.below(indentEm('\\texttt{iiiiiiiiii}'));
    // Monospace is per cell, so glyph class does not matter.
    indentEm('\\texttt{WWWWWWWWWW}').should.equal(indentEm('\\texttt{iiiiiiiiii}'));
  });
  it('resolves the nested reserve for a sublist inside a tabular cell in an item', () => {
    const html = render('\\begin{itemize}\n\\item[a]\n\\begin{tabular}{|l|}\n\\begin{itemize}\\item[' +
      wide + '] y\\end{itemize}\n\\end{tabular}\n\\end{itemize}');
    chainIndentEm(html).should.be.at.least(trueEm(wide) + MARKER_GAP_EM);
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
  // Rounding to 2 decimals must not land below the need: `[WWWWWWWW]` needs 9.425em.
  const mdInline = markdownIt({ html: true }).use(mathpixMarkdownPlugin, {});
  const markerTokensOf = (marker) => {
    const tokens = [];
    mdInline.inline.parse(marker, mdInline, {}, tokens);
    return tokens;
  };
  ['WWWWWWWW', 'aaaaaaaaaaaaaaaaaaaaaa', 'ПРИМЕЧАНИЕ', '`iiiiiiiiii`'].forEach((marker) => {
    it('never rounds the reserve below the computed need for "' + marker + '"', () => {
      paddingValue(render('\\begin{itemize}\n\\item[' + marker + '] a\n\\end{itemize}'))
        .should.be.at.least(computeMarkerPadding(markerTokensOf(marker)));
    });
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

// Malformed input where the marker lands on the wrong level is a declared Non-Goal, so the shape of
// the HTML is not pinned — but the guarantees are: no throw, no unclosed item, no NaN reaching the
// attribute. A future rework of the openTokens registry has to keep these.
describe('malformed list nesting degrades without breaking the document:', () => {
  const shapes = {
    'an extra \\end of the same kind': '\\begin{itemize}\n\\item[a] x\n\\end{itemize}\n\\end{itemize}\n',
    'an extra \\end before a wide-marker list':
      '\\begin{itemize}\n\\item[a] x\n\\end{itemize}\n\\end{itemize}\n' +
      '\\begin{itemize}\n\\item[WWWWWWWWWW] y\n\\end{itemize}\n',
    'an item body opening an inline list that never closes':
      '\\begin{itemize}\n\\item[a] x \\begin{itemize} \\item[WWWWWWWWWW] y\n\\end{itemize}\n',
    'an unclosed inline list followed by a normal one':
      '\\begin{itemize}\n\\item[a] x \\begin{itemize} \\item[y] z\n\\end{itemize}\n\n' +
      '\\begin{itemize}\n\\item[WWWWWWWWWW] q\n\\end{itemize}\n',
  };
  Object.entries(shapes).forEach(([name, src]) => {
    it(`${name}: renders, closes every item, reserves a valid em`, () => {
      const html = MM.markdownToHTML(src, { outMath: { include_svg: false } });
      (html.match(/<li[ >]/g) || []).length
        .should.equal((html.match(/<\/li>/g) || []).length, 'unbalanced items in ' + html);
      html.should.not.match(/NaN|undefined/);
      (html.match(/data-padding-inline-start="([^"]*)"/g) || []).forEach((attr) => {
        attr.should.match(/data-padding-inline-start="\d+(\.\d+)?em"/);
      });
    });
  });
});

describe('resolveListPadding over irregular depth sequences:', () => {
  const listAt = (depth, padding) => {
    const token = new Token('itemize_list_open', 'ul', 1);
    token.prentLevel = depth;
    token.padding = padding;
    return token;
  };
  const padOf = (token) => token.attrGet('data-padding-inline-start');
  it('a depth that drops back reserves the same as the first list at that depth', () => {
    // [0,1,0,1]: the second level-1 list must not inherit the first one's ancestor sum.
    const tokens = [listAt(0, 0), listAt(1, 8), listAt(0, 0), listAt(1, 8)];
    resolveListPadding(tokens);
    padOf(tokens[1]).should.equal('5.5em');
    padOf(tokens[3]).should.equal('5.5em');
  });
  it('a skipped depth fills the gap with the default instead of producing NaN', () => {
    // [0,2]: level 1 never appears, so its indent has to be assumed to sum the ancestors.
    const tokens = [listAt(0, 0), listAt(2, 9)];
    resolveListPadding(tokens);
    padOf(tokens[1]).should.equal('4em');
  });
  it('a depth below the first list is clamped to zero rather than throwing', () => {
    const tokens = [listAt(2, 0), listAt(0, 9)];
    resolveListPadding(tokens);
    (padOf(tokens[1]) === null || /^\d+(\.\d+)?em$/.test(padOf(tokens[1]))).should.equal(true);
  });
});

// The point of resolveListPadding: the indents of levels 0..d together must cover the marker at
// depth d. Per-level attributes are only the means, so assert the sum.
describe('the reserved indent covers the marker at every depth:', () => {
  const mdInline = markdownIt({ html: true }).use(mathpixMarkdownPlugin, {});
  const markerTokensOf = (marker) => {
    const tokens = [];
    mdInline.inline.parse(marker, mdInline, {}, tokens);
    return tokens;
  };
  const nested = (markers) => markers.map((m, i) => '\\begin{itemize}\n\\item[' + m + '] level' + i).join('\n')
    + '\n' + markers.map(() => '\\end{itemize}').join('\n');
  [['WWWWWWWW', 'a'], ['a', 'WWWWWWWWWW'], ['ПРИМЕЧАНИЕ', 'WWWW', '....'], ['漢字漢字漢字', 'W']]
    .forEach((markers) => {
      it('sum of indents covers each marker: [' + markers.join('] [') + ']', () => {
        const html = MM.markdownToHTML(nested(markers), { outMath: { include_svg: false } });
        const tags = html.match(/<ul[^>]*>/g) || [];
        tags.should.have.length(markers.length);
        let sum = 0;
        tags.forEach((tag, depth) => {
          const own = (tag.match(/data-padding-inline-start="([\d.]+)em"/) || [])[1];
          sum += own ? parseFloat(own) : LIST_DEFAULT_INDENT_EM;
          const need = computeMarkerPadding(markerTokensOf(markers[depth]));
          if (need <= LIST_MAX_INDENT_EM) {
            sum.should.be.at.least(need - 1e-9, 'depth ' + depth + ' reserves ' + sum + ' for ' + need);
          }
        });
      });
    });
  it('past the clamp the total stops growing and stays at the maximum', () => {
    const html = MM.markdownToHTML(nested(Array(9).fill('W'.repeat(20))), { outMath: { include_svg: false } });
    const values = (html.match(/data-padding-inline-start="([\d.]+)em"/g) || [])
      .map((a) => parseFloat(a.match(/([\d.]+)em/)[1]));
    // One list carries the clamped reserve; the deeper ones fall back to the default indent.
    values.should.deep.equal([LIST_MAX_INDENT_EM]);
  });
});

describe('the clamp and an unclosed list do not disturb later lists:', () => {
  const pads = (src) => (MM.markdownToHTML(src, { outMath: { include_svg: false } })
    .match(/<[uo]l[^>]*>/g) || [])
    .map((tag) => (tag.match(/data-padding-inline-start="([^"]+)"/) || [])[1]);
  const wide = 'W'.repeat(12);
  const fresh = '\\begin{itemize}\n\\item[' + wide + '] q\n\\end{itemize}';
  it('a list after an unclosed one reserves what it would alone', () => {
    // The leaked depth must not make the next list look nested (a smaller reserve would mean it
    // subtracted a phantom ancestor).
    const alone = pads(fresh);
    alone.should.have.length(1);
    pads('\\begin{itemize}\\item[a] x \\begin{itemize}\\item[' + wide + '] y\\end{itemize}\n\n' + fresh)
      .should.contain(alone[0]);
    pads('\\begin{itemize}\n\\item a\n\\begin{itemize}\n\\item b\n\\begin{itemize}\n\\item c\n\n' + fresh)
      .should.contain(alone[0]);
  });
});

// Migration says the attribute is now emitted on nested lists too; the docx path has its own
// marker attributes, so pin that it carries this one as well.
describe('forDocx keeps the per-level marker padding:', () => {
  const src = '\\begin{itemize}\n\\item[a] x\n' +
    '\\begin{itemize}\n\\item[WWWWWWWWWW] y\n\\end{itemize}\n\\end{itemize}';
  it('the nested list carries data-padding-inline-start in em, the outer keeps the default', () => {
    const html = MM.markdownToHTML(src, { outMath: { include_svg: false }, forDocx: true });
    const opens = html.match(/<ul[^>]*>/g);
    opens.should.have.length(2);
    // Outer: marker fits the default, so no custom indent.
    opens[0].should.not.match(/data-padding-inline-start/);
    const em = (opens[1].match(/data-padding-inline-start="([^"]+)"/) || [])[1];
    em.should.match(/^\d+(\.\d+)?em$/);
    parseFloat(em).should.be.above(LIST_DEFAULT_INDENT_EM);
    // Same value reaches the inline style, as on the non-docx path.
    opens[1].should.include('padding-inline-start: ' + em);
  });
  it('the em value matches the non-docx render', () => {
    const pad = (opts) => (MM.markdownToHTML(src, { outMath: { include_svg: false }, ...opts })
      .match(/data-padding-inline-start="([^"]+)"/) || [])[1];
    pad({ forDocx: true }).should.equal(pad({}));
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

describe('resolveListPadding — the ancestor sum follows the depth, not the last branch:', () => {
  const mk = (prentLevel, padding) => ({ prentLevel, padding, attrSet(k, v) { this[k] = v; } });
  it('a skipped level counts as the default, and a sibling after it does not inherit its sum', () => {
    const toks = [mk(0, 0), mk(2, 12), mk(1, 0), mk(1, 11), mk(3, 18)];
    resolveListPadding(toks);
    const pad = (t) => t['data-padding-inline-start'];
    // depth 2 with level 1 skipped: ancestors count as 2 × 2.5, so 12 − 5.
    pad(toks[1]).should.equal('7em');
    // back at depth 1: ancestors are 2.5 again, not the 12 carried by the depth-2 branch.
    pad(toks[3]).should.equal('8.5em');
    // deeper again: the chain is rebuilt from the current sums (2.5 + 8.5 + 2.5), not stale ones.
    pad(toks[4]).should.equal('4.5em');
    [toks[0], toks[2]].forEach((t) => (pad(t) === undefined).should.equal(true));
  });

  // The clamp is on the cumulative indent, not per level, so a chain cannot exceed it by stacking.
  it('a chain that overflows at every level stays within the clamp', () => {
    const pad = (t) => t['data-padding-inline-start'];
    const emitted = (toks) => toks.map(pad).filter((v) => v !== undefined);
    const sum = (toks) => emitted(toks).reduce((a, v) => a + parseFloat(v), 0);

    // Each level wants far more than the clamp: the outermost takes all of it, the rest fall back
    // to the default, so the chain grows by the default per level instead of by the clamp.
    const all = [mk(0, 50), mk(1, 50), mk(2, 50)];
    resolveListPadding(all);
    pad(all[0]).should.equal(String(LIST_MAX_INDENT_EM) + 'em');
    [all[1], all[2]].forEach((t) => (pad(t) === undefined).should.equal(true));
    (sum(all) + 2 * LIST_DEFAULT_INDENT_EM)
      .should.equal(LIST_MAX_INDENT_EM + 2 * LIST_DEFAULT_INDENT_EM);

    // Overflowing only at the deepest level: the reserves add up to exactly the clamp, no more.
    const deep = [mk(0, 5), mk(1, 12), mk(2, 30)];
    resolveListPadding(deep);
    emitted(deep).should.eql(['5em', '7em', '8em']);
    sum(deep).should.equal(LIST_MAX_INDENT_EM);

    [all, deep].forEach((toks) => emitted(toks).forEach((v) => v.should.match(/^\d+(\.\d+)?em$/)));
  });

  // The renderer drops a value that misses PADDING_EM_RE without a word, and the marker then
  // clips — so every value the resolver can emit must match it, not just the ones in fixtures.
  it('every emitted value matches the validator the renderer applies', () => {
    const PADDING_EM_RE = /^\d+(\.\d+)?em$/;
    const paddings = [2.51, 2.999, 3, 7.0001, 9.995, 12.345678, 19.999, 20, 20.01, 1e6, 1 / 3];
    paddings.forEach((padding) => {
      [0, 1, 2].forEach((depth) => {
        const toks = [mk(0, 0), mk(depth, padding)];
        resolveListPadding(toks);
        const value = toks[1]['data-padding-inline-start'];
        if (value !== undefined) {
          value.should.match(PADDING_EM_RE, `padding ${padding} at depth ${depth}`);
        }
      });
    });
  });
});

describe('processListChildToken — an unpaired close does not steal the outer list:', () => {
  // The inline guard is by kind only — weaker than the block path's identity check. Pins what it
  // does cover; a same-kind unpaired close is not protected (see the comment at the call site).
  const mkState = () => ({
    tokens: [], types: ['itemize'], startLine: 0, prentLevel: 0, md: { options: {} },
    push: () => new Token('x', '', 0),
  });
  const mkCtx = (openTokens) => ({
    li: null, iOpen: 1, itemizeLevelTokens: [], enumerateLevelTypes: [],
    itemizeLevelContents: [], openTokens, allListTokens: [...openTokens],
  });
  it('a stray enumerate_list_close leaves the itemize registry entry in place', () => {
    const outer = new Token('itemize_list_open', 'ul', 1);
    const state = mkState();
    const ctx = mkCtx([outer]);
    processListChildToken(state, { startLine: 0, endLine: 0 }, new Token('enumerate_list_close', 'ol', -1), ctx);
    ctx.openTokens.should.have.lengthOf(1);
    // The next wide marker must still be attributed to the outer list.
    const item = new Token('latex_list_item_open', 'li', 1);
    item.marker = 'XXXXXXXXXXXX';
    item.markerTokens = [Object.assign(new Token('text', '', 0), { content: 'XXXXXXXXXXXX' })];
    processListChildToken(state, { startLine: 0, endLine: 0 }, item, ctx);
    outer.padding.should.be.above(LIST_DEFAULT_INDENT_EM);
  });
  it('unpaired closes do not drive the depth negative', () => {
    // prentLevel is the level key resolveListPadding reads, so a negative would misattribute.
    const state = mkState();
    const ctx = mkCtx([]);
    for (let i = 0; i < 3; i++) {
      processListChildToken(state, { startLine: 0, endLine: 0 },
        new Token('itemize_list_close', 'ul', -1), ctx);
    }
    state.prentLevel.should.equal(0);
  });
  it('a same-kind close does pop the registry entry, matched or not', () => {
    // The known limitation, pinned rather than fixed: the block path compares identity, this one
    // only kind, so a stray itemize close drops the itemize entry that is open here.
    const outer = new Token('itemize_list_open', 'ul', 1);
    const ctx = mkCtx([outer]);
    processListChildToken(mkState(), { startLine: 0, endLine: 0 },
      new Token('itemize_list_close', 'ul', -1), ctx);
    ctx.openTokens.should.have.lengthOf(0);
  });
  // End to end the limitation is not observable on the shapes tried: an unpaired close ends the
  // list, and a following wide marker is attributed to the list that holds it.
  it('a wide marker after an inline close lands on the list that contains it', () => {
    const wide = 'WWWWWWWWWWWW';
    const html = render('\\begin{itemize}\\item[a] x \\begin{itemize}\\item[b] y\\end{itemize}\\item[' +
      wide + '] z\\end{itemize}');
    const opens = html.match(/<ul[^>]*>/g);
    opens.should.have.length(2);
    opens[0].should.match(/data-padding-inline-start="\d+(\.\d+)?em"/);
    opens[1].should.not.match(/data-padding-inline-start/);
  });
});
