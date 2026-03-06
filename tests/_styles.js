let chai = require('chai');
let should = chai.should();
const fs = require('fs');
const path = require('path');
const { MathpixStyle, PreviewStyle, TocStyle, resetBodyStyles } = require('../lib/styles');
const { ContainerStyle } = require('../lib/styles/styles-container');
const { codeStyles } = require('../lib/styles/styles-code');
const { tabularStyles } = require('../lib/styles/styles-tabular');
const { listsStyles } = require('../lib/styles/styles-lists');
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

function assertSnapshot(name, actual) {
  const snapPath = path.join(SNAP_DIR, name + '.snap.css');
  if (!fs.existsSync(snapPath)) {
    fs.writeFileSync(snapPath, actual, 'utf8');
    console.log(`    [snapshot created] ${name}.snap.css`);
  }
  const expected = fs.readFileSync(snapPath, 'utf8');
  actual.should.equal(expected, `Snapshot mismatch for "${name}". Delete ${snapPath} to update.`);
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
  it('listsStyles', () => {
    assertSnapshot('listsStyles', listsStyles);
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
