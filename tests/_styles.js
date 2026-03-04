/**
 * Snapshot tests for CSS style output.
 *
 * Each style function / assembly method is called with default params
 * and compared against a stored snapshot file.
 *
 * To update snapshots: delete the .snap.css files in tests/_data/_styles/
 * and re-run `npm test`.
 */

let chai = require('chai');
let should = chai.should();
const fs = require('fs');
const path = require('path');

const { MathpixStyle, PreviewStyle, TocStyle, resetBodyStyles } = require('../lib/styles');
const { ContainerStyle } = require('../lib/styles/styles-container');
const { codeStyles } = require('../lib/styles/styles-code');
const { tabularStyles } = require('../lib/styles/styles-tabular');
const { listsStyles } = require('../lib/styles/styles-lists');

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;

const { JSDOM } = require("jsdom");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

const SNAP_DIR = path.join(__dirname, '_data', '_styles');

/**
 * Compare output against a snapshot file.
 * If the snapshot doesn't exist, create it (first run).
 */
function assertSnapshot(name, actual) {
  const snapPath = path.join(SNAP_DIR, name + '.snap.css');

  if (!fs.existsSync(snapPath)) {
    fs.writeFileSync(snapPath, actual, 'utf8');
    console.log(`    [snapshot created] ${name}.snap.css`);
  }

  const expected = fs.readFileSync(snapPath, 'utf8');
  actual.should.equal(expected, `Snapshot mismatch for "${name}". Delete ${snapPath} to update.`);
}

// ─── Individual style functions ──────────────────────────────────────

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
    assertSnapshot('MathpixStyle-pptx', MathpixStyle(false, true, '', true, true));
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

// ─── Assembly methods on MathpixMarkdownModel ────────────────────────
//
// Assembly methods include getMathjaxStyle() output which varies depending on
// what formulas other tests have rendered. We test composition (contains the
// right parts with correct params) rather than exact snapshots.

describe('Style assembly methods — composition:', () => {

  // ── getMathpixStyleOnly ──────────────────────────────────────────

  describe('getMathpixStyleOnly (defaults)', () => {
    const css = MM.getMathpixStyleOnly();

    it('includes MathpixStyle', () => {
      css.should.include(MathpixStyle());
    });
    it('includes codeStyles', () => {
      css.should.include(codeStyles());
    });
    it('includes tabularStyles', () => {
      css.should.include(tabularStyles());
    });
    it('includes listsStyles', () => {
      css.should.include(listsStyles);
    });
    it('does NOT include ContainerStyle', () => {
      css.should.not.include('html,body');
    });
  });

  describe('getMathpixStyleOnly (useColors=false)', () => {
    const css = MM.getMathpixStyleOnly(true, false);

    it('includes MathpixStyle with useColors=false', () => {
      css.should.include(MathpixStyle(false, false));
    });
    it('includes codeStyles with useColors=false', () => {
      css.should.include(codeStyles(false));
    });
    it('includes tabularStyles with useColors=false', () => {
      css.should.include(tabularStyles(false));
    });
  });

  // ── getMathpixStyle ──────────────────────────────────────────────

  describe('getMathpixStyle (defaults)', () => {
    const css = MM.getMathpixStyle();

    it('includes ContainerStyle', () => {
      css.should.include(ContainerStyle());
    });
    it('includes MathpixStyle', () => {
      css.should.include(MathpixStyle());
    });
    it('includes codeStyles', () => {
      css.should.include(codeStyles());
    });
    it('includes tabularStyles', () => {
      css.should.include(tabularStyles());
    });
    it('includes listsStyles', () => {
      css.should.include(listsStyles);
    });
    it('does NOT include PreviewStyle', () => {
      css.should.not.include(PreviewStyle);
    });
  });

  describe('getMathpixStyle (stylePreview=true)', () => {
    const css = MM.getMathpixStyle(true);

    it('includes PreviewStyle', () => {
      css.should.include(PreviewStyle);
    });
    it('does NOT include TocStyle', () => {
      css.should.not.include('#toc {');
    });
  });

  describe('getMathpixStyle (stylePreview=true, showToc=true)', () => {
    const css = MM.getMathpixStyle(true, true);

    it('includes PreviewStyle', () => {
      css.should.include(PreviewStyle);
    });
    it('includes TocStyle', () => {
      css.should.include(TocStyle('toc'));
    });
  });

  describe('getMathpixStyle (useColors=false)', () => {
    const css = MM.getMathpixStyle(false, false, 'toc', true, false, false);

    it('includes ContainerStyle with useColors=false', () => {
      css.should.include(ContainerStyle(false));
    });
    it('includes MathpixStyle with useColors=false', () => {
      css.should.include(MathpixStyle(false, false));
    });
    it('includes tabularStyles with useColors=false', () => {
      css.should.include(tabularStyles(false));
    });
  });

  describe('getMathpixStyle (isPptx=true)', () => {
    const css = MM.getMathpixStyle(false, false, 'toc', true, true);

    it('includes MathpixStyle with isPptx=true', () => {
      css.should.include(MathpixStyle(false, true, '', true, true));
    });
  });

  // ── getMathpixMarkdownStyles ─────────────────────────────────────

  describe('getMathpixMarkdownStyles (defaults)', () => {
    const css = MM.getMathpixMarkdownStyles();

    it('includes ContainerStyle', () => {
      css.should.include(ContainerStyle());
    });
    it('includes MathpixStyle', () => {
      css.should.include(MathpixStyle());
    });
    it('includes tabularStyles', () => {
      css.should.include(tabularStyles());
    });
    it('includes listsStyles', () => {
      css.should.include(listsStyles);
    });
    it('does NOT include codeStyles (VSCode exclusion)', () => {
      css.should.not.include('font-family: Inconsolata');
    });
  });

  describe('getMathpixMarkdownStyles (useColors=false)', () => {
    const css = MM.getMathpixMarkdownStyles(false);

    it('includes ContainerStyle with useColors=false', () => {
      css.should.include(ContainerStyle(false));
    });
    it('includes MathpixStyle with useColors=false', () => {
      css.should.include(MathpixStyle(false, false));
    });
    it('includes tabularStyles with useColors=false', () => {
      css.should.include(tabularStyles(false));
    });
  });
});
