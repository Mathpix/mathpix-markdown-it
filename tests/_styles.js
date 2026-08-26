let chai = require('chai');
let should = chai.should();
const fs = require('fs');
const path = require('path');
const { MathpixStyle, PreviewStyle, TocStyle, resetBodyStyles } = require('../lib/styles');
const { ContainerStyle } = require('../lib/styles/styles-container');
const { codeStyles } = require('../lib/styles/styles-code');
const { tabularStyles } = require('../lib/styles/styles-tabular');
const { listsStyles } = require('../lib/styles/styles-lists');
const { MARKER_GAP_EM, LIST_DEFAULT_INDENT_EM } = require('../lib/markdown/common/consts');
const { menuStyle } = require('../lib/contex-menu/styles');
const { clipboardCopyStyles } = require('../lib/copy-to-clipboard/clipboard-copy-styles');
let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;
const { JSDOM } = require("jsdom");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;
const SNAP_DIR = path.join(__dirname, '_data', '_styles');
const t = (s) => s.trim();

// Writing a missing snapshot and comparing against what was just written passes for any CSS at all, so
// a deleted or never-reviewed file read as green. Missing is a failure; `UPDATE_SNAPSHOTS=1` writes.
function assertSnapshot(name, actual) {
  const snapPath = path.join(SNAP_DIR, name + '.snap.css');
  if (process.env.UPDATE_SNAPSHOTS) {
    fs.writeFileSync(snapPath, actual, 'utf8');
    console.log(`    [snapshot written] ${name}.snap.css`);
    return;
  }
  fs.existsSync(snapPath).should.equal(true,
    `No snapshot for "${name}". Review the output, then run with UPDATE_SNAPSHOTS=1 to write ${snapPath}.`);
  const expected = fs.readFileSync(snapPath, 'utf8');
  actual.should.equal(expected,
    `Snapshot mismatch for "${name}". Run with UPDATE_SNAPSHOTS=1 to update ${snapPath}.`);
}

describe('Style snapshots — individual functions:', () => {
  it('MathpixStyle (defaults)', () => {
    assertSnapshot('MathpixStyle-defaults', MathpixStyle());
  });
  it('MathpixStyle (setTextAlignJustify=true)', () => {
    assertSnapshot('MathpixStyle-justify', MathpixStyle(true));
  });
  it('MathpixStyle (useColors=false)', () => {
    assertSnapshot('MathpixStyle-noColors', MathpixStyle(false, false));
  });
  it('MathpixStyle (maxWidth=800px)', () => {
    assertSnapshot('MathpixStyle-maxWidth', MathpixStyle(false, true, '800px'));
  });
  it('MathpixStyle (isPptx=true)', () => {
    assertSnapshot('MathpixStyle-pptx', MathpixStyle(false, true, '', true));
  });
  it('ContainerStyle (defaults)', () => {
    assertSnapshot('ContainerStyle-defaults', ContainerStyle());
  });
  it('ContainerStyle (useColors=false)', () => {
    assertSnapshot('ContainerStyle-noColors', ContainerStyle(false));
  });
  it('codeStyles (defaults)', () => {
    assertSnapshot('codeStyles-defaults', codeStyles());
  });
  it('codeStyles (useColors=false)', () => {
    assertSnapshot('codeStyles-noColors', codeStyles(false));
  });
  it('tabularStyles (defaults)', () => {
    assertSnapshot('tabularStyles-defaults', tabularStyles());
  });
  it('tabularStyles (useColors=false)', () => {
    assertSnapshot('tabularStyles-noColors', tabularStyles(false));
  });
  it('tabularStyles (isPptx=true)', () => {
    assertSnapshot('tabularStyles-pptx', tabularStyles(true, true));
  });
  it('listsStyles', () => {
    assertSnapshot('listsStyles', listsStyles);
  });
  it('listsStyles marker gap matches MARKER_GAP_EM', () => {
    // The CSS gap and the padding reservation are in separate files; keep them in sync.
    listsStyles.should.include('padding-right: ' + MARKER_GAP_EM + 'em');
  });
  it('listsStyles has no bare ul/ol selector (generic elements must stay scoped)', () => {
    // Generic elements must be scoped-only; MMD classes stay bare + scoped on purpose, so
    // `ul.itemize` is fine and only an unqualified `ul`/`ol` fails (2026-03-mmd-css-scoping).
    listsStyles.should.not.match(/(^|,)\s*(ul|ol)\s*[,{>+~]/m);
  });
  it('PreviewStyle', () => {
    assertSnapshot('PreviewStyle', PreviewStyle);
  });
  it('TocStyle (defaults)', () => {
    assertSnapshot('TocStyle-defaults', TocStyle());
  });
  it('TocStyle (custom container)', () => {
    assertSnapshot('TocStyle-custom', TocStyle('my-toc'));
  });
  it('resetBodyStyles', () => {
    assertSnapshot('resetBodyStyles', resetBodyStyles);
  });
});

describe('Style assembly methods — composition:', () => {
  describe('getMathpixStyleOnly (defaults)', () => {
    const css = MM.getMathpixStyleOnly();
    it('includes MathpixStyle', () => {
      css.should.include(t(MathpixStyle()));
    });
    it('includes codeStyles', () => {
      css.should.include(t(codeStyles()));
    });
    it('includes tabularStyles', () => {
      css.should.include(t(tabularStyles()));
    });
    it('includes listsStyles', () => {
      css.should.include(t(listsStyles));
    });
    it('does NOT include ContainerStyle', () => {
      css.should.not.include('html,body');
    });
    // resolveListPadding subtracts exactly this per ancestor level when it sizes a nested reserve,
    // so the number in the emitted CSS and the constant it reads must be the same.
    it('emits the list indent the padding resolver assumes', () => {
      const indent = 'padding-inline-start: ' + LIST_DEFAULT_INDENT_EM + 'em';
      css.should.include('ol.enumerate, ul.itemize');
      css.split(indent).length.should.be.above(2); // the class rule and the scoped generic rule
      const nested = MM.markdownToHTML('\\begin{itemize}\\item[a] x \\begin{itemize}' +
        '\\item[WWWWWWWWWWWW] y\\end{itemize}\\end{itemize}', { outMath: { include_svg: false } });
      const values = (nested.match(/data-padding-inline-start="([\d.]+)em"/g) || [])
        .map((s) => parseFloat(s.replace(/[^\d.]/g, '')));
      values.should.have.length(1);
      // The inner list reserves the marker width minus the one ancestor level, at that same value.
      const flat = MM.markdownToHTML('\\begin{itemize}\\item[WWWWWWWWWWWW] y\\end{itemize}',
        { outMath: { include_svg: false } });
      const flatEm = parseFloat((flat.match(/data-padding-inline-start="([\d.]+)em"/) || [])[1]);
      values[0].should.be.closeTo(flatEm - LIST_DEFAULT_INDENT_EM, 0.011);
    });
  });
  describe('getMathpixStyleOnly (useColors=false)', () => {
    const css = MM.getMathpixStyleOnly(false);
    it('includes MathpixStyle with useColors=false', () => {
      css.should.include(t(MathpixStyle(false, false)));
    });
    it('includes codeStyles with useColors=false', () => {
      css.should.include(t(codeStyles(false)));
    });
    it('includes tabularStyles with useColors=false', () => {
      css.should.include(t(tabularStyles(false)));
    });
  });
  describe('getMathpixStyle (defaults)', () => {
    const css = MM.getMathpixStyle();
    it('includes ContainerStyle', () => {
      css.should.include(t(ContainerStyle()));
    });
    it('includes MathpixStyle', () => {
      css.should.include(t(MathpixStyle()));
    });
    it('includes codeStyles', () => {
      css.should.include(t(codeStyles()));
    });
    it('includes tabularStyles', () => {
      css.should.include(t(tabularStyles()));
    });
    it('includes listsStyles', () => {
      css.should.include(t(listsStyles));
    });
    it('does NOT include PreviewStyle', () => {
      css.should.not.include(t(PreviewStyle));
    });
  });
  describe('getMathpixStyle (stylePreview=true)', () => {
    const css = MM.getMathpixStyle(true);
    it('includes PreviewStyle', () => {
      css.should.include(t(PreviewStyle));
    });
    it('does NOT include TocStyle', () => {
      css.should.not.include('#toc {');
    });
  });
  describe('getMathpixStyle (stylePreview=true, showToc=true)', () => {
    const css = MM.getMathpixStyle(true, true);
    it('includes PreviewStyle', () => {
      css.should.include(t(PreviewStyle));
    });
    it('includes TocStyle', () => {
      css.should.include(t(TocStyle('toc')));
    });
  });
  describe('getMathpixStyle (useColors=false)', () => {
    const css = MM.getMathpixStyle(false, false, 'toc', false);
    it('includes ContainerStyle with useColors=false', () => {
      css.should.include(t(ContainerStyle(false)));
    });
    it('includes MathpixStyle with useColors=false', () => {
      css.should.include(t(MathpixStyle(false, false)));
    });
    it('includes tabularStyles with useColors=false', () => {
      css.should.include(t(tabularStyles(false)));
    });
    it('includes codeStyles with useColors=false', () => {
      css.should.include(t(codeStyles(false)));
    });
  });
  describe('getMathpixStyle (isPptx=true)', () => {
    const css = MM.getMathpixStyle(false, false, 'toc', true, true);
    it('includes MathpixStyle with isPptx=true', () => {
      css.should.include(t(MathpixStyle(false, true, '', true)));
    });
  });
  describe('getMathpixMarkdownStyles (defaults)', () => {
    const css = MM.getMathpixMarkdownStyles();
    it('includes ContainerStyle', () => {
      css.should.include(t(ContainerStyle()));
    });
    it('includes MathpixStyle', () => {
      css.should.include(t(MathpixStyle()));
    });
    it('includes tabularStyles', () => {
      css.should.include(t(tabularStyles()));
    });
    it('includes listsStyles', () => {
      css.should.include(t(listsStyles));
    });
    it('does NOT include codeStyles (VSCode exclusion)', () => {
      css.should.not.include('font-family: Inconsolata');
    });
  });
  describe('getMathpixMarkdownStyles (useColors=false)', () => {
    const css = MM.getMathpixMarkdownStyles(false);
    it('includes ContainerStyle with useColors=false', () => {
      css.should.include(t(ContainerStyle(false)));
    });
    it('includes MathpixStyle with useColors=false', () => {
      css.should.include(t(MathpixStyle(false, false)));
    });
    it('includes tabularStyles with useColors=false', () => {
      css.should.include(t(tabularStyles(false)));
    });
  });
});

describe('buildStyles — direct option combinations:', () => {
  it('defaults: MathpixStyle + code + tabular + lists only', () => {
    const css = MM.buildStyles();
    css.should.include(t(MathpixStyle()));
    css.should.include(t(codeStyles()));
    css.should.include(t(tabularStyles()));
    css.should.include(t(listsStyles));
    css.should.not.include('html,body');
    css.should.not.include(t(PreviewStyle));
    css.should.not.include(t(resetBodyStyles));
  });
  it('resetBody: true adds resetBodyStyles', () => {
    const css = MM.buildStyles({ resetBody: true });
    css.should.include(t(resetBodyStyles));
  });
  it('container: true adds ContainerStyle', () => {
    const css = MM.buildStyles({ container: true });
    css.should.include(t(ContainerStyle()));
  });
  it('container + useColors=false passes useColors to ContainerStyle', () => {
    const css = MM.buildStyles({ container: true, useColors: false });
    css.should.include(t(ContainerStyle(false)));
    css.should.not.include(t(ContainerStyle(true)));
  });
  it('code: false excludes codeStyles', () => {
    const css = MM.buildStyles({ code: false });
    css.should.not.include('font-family: Inconsolata');
    css.should.include(t(MathpixStyle()));
    css.should.include(t(tabularStyles()));
  });
  it('preview: true adds PreviewStyle', () => {
    const css = MM.buildStyles({ preview: true });
    css.should.include(t(PreviewStyle));
  });
  it('toc: true adds TocStyle', () => {
    const css = MM.buildStyles({ toc: true });
    css.should.include(t(TocStyle('toc')));
  });
  it('toc: true with custom tocContainerName', () => {
    const css = MM.buildStyles({ toc: true, tocContainerName: 'my-toc' });
    css.should.include(t(TocStyle('my-toc')));
    css.should.not.include('#toc {');
  });
  it('menu: true adds menuStyle + clipboardCopyStyles', () => {
    const css = MM.buildStyles({ menu: true });
    css.should.include(t(menuStyle()));
    css.should.include(t(clipboardCopyStyles()));
  });
  it('menu: false excludes menu and clipboard', () => {
    const css = MM.buildStyles();
    css.should.not.include(t(menuStyle()));
  });
  it('isPptx: true passes through to MathpixStyle', () => {
    const css = MM.buildStyles({ isPptx: true });
    css.should.include(t(MathpixStyle(false, true, '', true)));
    css.should.include(t(tabularStyles(true, true)));
  });
  it('setTextAlignJustify: true passes through to MathpixStyle', () => {
    const css = MM.buildStyles({ setTextAlignJustify: true });
    css.should.include('text-align: justify;');
  });
  it('maxWidth passes through to MathpixStyle', () => {
    const css = MM.buildStyles({ maxWidth: '800px' });
    css.should.include('max-width: 800px;');
  });
  it('canonical order: container before MathpixStyle', () => {
    const css = MM.buildStyles({ container: true });
    const containerIdx = css.indexOf(t(ContainerStyle()));
    const mathpixIdx = css.indexOf(t(MathpixStyle()));
    containerIdx.should.be.below(mathpixIdx);
  });
  it('canonical order: MathpixStyle before codeStyles', () => {
    const css = MM.buildStyles();
    const mathpixIdx = css.indexOf(t(MathpixStyle()));
    const codeIdx = css.indexOf(t(codeStyles()));
    mathpixIdx.should.be.below(codeIdx);
  });
  it('canonical order: tabular before lists', () => {
    const css = MM.buildStyles();
    const tabularIdx = css.indexOf(t(tabularStyles()));
    const listsIdx = css.indexOf(t(listsStyles));
    tabularIdx.should.be.below(listsIdx);
  });
  it('canonical order: lists before preview', () => {
    const css = MM.buildStyles({ preview: true });
    const listsIdx = css.indexOf(t(listsStyles));
    const previewIdx = css.indexOf(t(PreviewStyle));
    listsIdx.should.be.below(previewIdx);
  });
  it('canonical order: preview before toc', () => {
    const css = MM.buildStyles({ preview: true, toc: true });
    const previewIdx = css.indexOf(t(PreviewStyle));
    const tocIdx = css.indexOf(t(TocStyle('toc')));
    previewIdx.should.be.below(tocIdx);
  });
  it('loadMathJax combo: resetBody + core + code + tabular + lists + toc + menu', () => {
    const css = MM.buildStyles({ resetBody: true, toc: true, menu: true });
    css.should.include(t(resetBodyStyles));
    css.should.include(t(MathpixStyle()));
    css.should.include(t(codeStyles()));
    css.should.include(t(tabularStyles()));
    css.should.include(t(listsStyles));
    css.should.include(t(TocStyle('toc')));
    css.should.include(t(menuStyle()));
    css.should.not.include(t(ContainerStyle()));
  });
  it('getMathpixStyleOnly combo: mathjax + core + code + tabular + lists + menu', () => {
    const css = MM.buildStyles({ mathjax: true, menu: true });
    css.should.include(t(MathpixStyle()));
    css.should.include(t(codeStyles()));
    css.should.include(t(tabularStyles()));
    css.should.include(t(listsStyles));
    css.should.include(t(menuStyle()));
    css.should.not.include(t(ContainerStyle()));
    css.should.not.include(t(PreviewStyle));
  });
  it('getMathpixStyle(preview) combo: container + mathjax + core + code + tabular + lists + preview + menu', () => {
    const css = MM.buildStyles({ container: true, mathjax: true, preview: true, menu: true });
    css.should.include(t(ContainerStyle()));
    css.should.include(t(MathpixStyle()));
    css.should.include(t(codeStyles()));
    css.should.include(t(tabularStyles()));
    css.should.include(t(listsStyles));
    css.should.include(t(PreviewStyle));
    css.should.include(t(menuStyle()));
  });
  it('getMathpixMarkdownStyles combo: container + mathjax + core + tabular + lists, no code', () => {
    const css = MM.buildStyles({ container: true, mathjax: true, code: false });
    css.should.include(t(ContainerStyle()));
    css.should.include(t(MathpixStyle()));
    css.should.include(t(tabularStyles()));
    css.should.include(t(listsStyles));
    css.should.not.include('font-family: Inconsolata');
    css.should.not.include(t(PreviewStyle));
    css.should.not.include(t(menuStyle()));
  });
});

describe('loadMathJax — DOM behavior:', () => {
  beforeEach(() => {
    const el = document.getElementById('Mathpix-styles');
    if (el) el.remove();
    if (!document.getElementById('SVG-styles')) {
      const svg = document.createElement('style');
      svg.id = 'SVG-styles';
      document.head.appendChild(svg);
    }
    MM.isClickHandlerBound = false;
  });
  it('creates #Mathpix-styles element', () => {
    MM.loadMathJax().should.equal(true);
    const el = document.getElementById('Mathpix-styles');
    should.exist(el);
    el.innerHTML.should.include(t(MathpixStyle()));
  });
  it('updates existing element on second call', () => {
    MM.loadMathJax(false, false);
    MM.loadMathJax(false, true);
    const el = document.getElementById('Mathpix-styles');
    el.innerHTML.should.include('text-align: justify;');
  });
  it('does not duplicate #Mathpix-styles', () => {
    MM.loadMathJax();
    MM.loadMathJax();
    document.querySelectorAll('#Mathpix-styles').length.should.equal(1);
  });
  it('binds click handler only once', () => {
    MM.loadMathJax();
    MM.isClickHandlerBound.should.equal(true);
    MM.loadMathJax();
    MM.isClickHandlerBound.should.equal(true);
  });
  it('notScrolling=true skips click handler', () => {
    MM.loadMathJax(true);
    MM.isClickHandlerBound.should.equal(false);
  });
});

const { getMaxWidthStyle } = require('../lib/styles/helpers');

describe('getMaxWidthStyle:', () => {
  it('returns empty string when maxWidth is empty', () => {
    getMaxWidthStyle().should.equal('');
    getMaxWidthStyle('').should.equal('');
  });
  it('sets max-width on #setText', () => {
    const css = getMaxWidthStyle('800px');
    css.should.include('max-width: 800px');
  });
  it('includes scrollbar hiding when isHideScroll=true', () => {
    const css = getMaxWidthStyle('800px', true);
    css.should.include('::-webkit-scrollbar');
    css.should.include('display: none');
  });
  it('omits scrollbar hiding when isHideScroll=false', () => {
    const css = getMaxWidthStyle('800px', false);
    css.should.not.include('::-webkit-scrollbar');
  });
});

describe('Code-block styles scale with the em context (no absolute px/rem):', () => {
  // Extract the declaration body of the first rule whose selector contains `needle`,
  // so assertions are scoped to that rule and not the whole stylesheet.
  const blockFor = (css, needle) => {
    const start = css.indexOf(needle);
    if (start < 0) return '';
    const open = css.indexOf('{', start);
    return css.slice(open + 1, css.indexOf('}', open));
  };
  it('pre code font-size is inherited, not absolute px', () => {
    const block = blockFor(codeStyles(), '#preview-content pre code, #setText pre code');
    block.should.not.equal(''); // selector must exist, else the negative asserts pass vacuously
    block.should.include('font-size: inherit');
    block.should.not.match(/font-size:\s*\d+px/);
  });
  it('pre code line-height/padding are relative (no px line-height, no rem padding)', () => {
    const block = blockFor(MathpixStyle(), '#preview-content pre code, #setText pre code');
    block.should.not.equal('');
    block.should.include('line-height: 1.6');
    block.should.include('padding: 1em');
    block.should.not.match(/line-height:\s*\d+px/);
    block.should.not.include('1rem');
  });
  it('pre font-size is em-relative, not a percentage', () => {
    const block = blockFor(MathpixStyle(), '#preview-content pre, #setText pre');
    block.should.not.equal('');
    block.should.include('font-size: 0.9375em');
    block.should.not.include('font-size: 85%');
  });
  // The `pre` base applies to a `pre` with no `code` child too, and raw HTML does produce one: that is
  // the 13.6px → 15px the changelog names, so the markup path has to stay as documented.
  it('a raw-HTML pre with no code child reaches the output and takes the pre base', () => {
    const html = MM.markdownToHTML('<pre>x</pre>', { htmlTags: true, outMath: { include_svg: false } });
    html.should.match(/<pre[^>]*>x<\/pre>/, 'the raw pre is rewritten or dropped');
    html.should.not.match(/<pre[^>]*>\s*<code/, 'a code child would take the pre code rules instead');
  });
});
