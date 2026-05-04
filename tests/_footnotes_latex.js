let chai = require('chai');
let should = chai.should();

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;
const { getLabelsList } = require('../lib/index');
const {
  reFootnoteToken,
  reFootnotetextToken,
  reOpenTagFootnoteG,
  reOpenTagFootnotetextG,
} = require('../lib/markdown/common/consts');

const options = {
  cwidth: 800
};


const { JSDOM } = require("jsdom");
const mmdContent = require("./_data/_footnotes_latex/_mmd/_mmd_12");
const htmlContent = require("./_data/_footnotes_latex/_html/_html_12");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;


describe('Check Latex Footnotes:', () => {
  describe('Check footnotes counter (_mmd_01):', () => {
    const mmdContent = require('./_data/_footnotes_latex/_mmd/_mmd_01');
    const htmlContent = require('./_data/_footnotes_latex/_html/_html_01');
    const html = MM.markdownToHTML(mmdContent, options);
    it('Checking result html', (done) => {
      html.trim().should.equal(htmlContent);
      done();
    });
    MM.texReset();
  });

  describe('Check: \\footnotestext to one \\footnotemark (_mmd_02):', () => {
    const mmdContent = require('./_data/_footnotes_latex/_mmd/_mmd_02');
    const htmlContent = require('./_data/_footnotes_latex/_html/_html_02');
    const html = MM.markdownToHTML(mmdContent, options);
    it('Checking result html', (done) => {
      html.trim().should.equal(htmlContent);
      done();
    });
    MM.texReset();
  });
  
  describe('Check Latex Footnotes with MD Footnotes (_mmd_03):', () => {
    const mmdContent = require('./_data/_footnotes_latex/_mmd/_mmd_03');
    const htmlContent = require('./_data/_footnotes_latex/_html/_html_03');
    const html = MM.markdownToHTML(mmdContent, options);
    it('Checking result html', (done) => {
      html.trim().should.equal(htmlContent);
      done();
    });
    MM.texReset();
  });  
  
  describe('Check Latex Footnotes with MD Footnotes (_mmd_04):', () => {
    const mmdContent = require('./_data/_footnotes_latex/_mmd/_mmd_04');
    const htmlContent = require('./_data/_footnotes_latex/_html/_html_04');
    const html = MM.markdownToHTML(mmdContent, options);
    it('Checking result html', (done) => {
      html.trim().should.equal(htmlContent);
      done();
    });
    MM.texReset();
  });  
  
  describe('Check Latex Footnotes with MD Footnotes (_mmd_05):', () => {
    const mmdContent = require('./_data/_footnotes_latex/_mmd/_mmd_05');
    const htmlContent = require('./_data/_footnotes_latex/_html/_html_05');
    const html = MM.markdownToHTML(mmdContent, options);
    it('Checking result html', (done) => {
      html.trim().should.equal(htmlContent);
      done();
    });
    MM.texReset();
  });  
  describe('Check Latex Footnotes with MD Footnotes (_mmd_08):', () => {
    const mmdContent = require('./_data/_footnotes_latex/_mmd/_mmd_08');
    const htmlContent = require('./_data/_footnotes_latex/_html/_html_08');
    const html = MM.markdownToHTML(mmdContent, options);
    it('Checking result html', (done) => {
      html.trim().should.equal(htmlContent);
      done();
    });
    MM.texReset();
  });  
  describe('Check Latex Footnotes with MD Footnotes (_mmd_09):', () => {
    const mmdContent = require('./_data/_footnotes_latex/_mmd/_mmd_09');
    const htmlContent = require('./_data/_footnotes_latex/_html/_html_09');
    const html = MM.markdownToHTML(mmdContent, options);
    it('Checking result html', (done) => {
      html.trim().should.equal(htmlContent);
      done();
    });
    MM.texReset();
  });  
  describe('Check Latex Footnotes with MD Footnotes (_mmd_10):', () => {
    const mmdContent = require('./_data/_footnotes_latex/_mmd/_mmd_10');
    const htmlContent = require('./_data/_footnotes_latex/_html/_html_10');
    const html = MM.markdownToHTML(mmdContent, options);
    it('Checking result html', (done) => {
      html.trim().should.equal(htmlContent);
      done();
    });
    MM.texReset();
  });  
  describe('Check Latex Footnotes with only \\footnotetext{} (_mmd_11):', () => {
    const mmdContent = require('./_data/_footnotes_latex/_mmd/_mmd_11');
    const htmlContent = require('./_data/_footnotes_latex/_html/_html_11');
    const html = MM.markdownToHTML(mmdContent, options);
    it('Checking result html', (done) => {
      html.trim().should.equal(htmlContent);
      done();
    });
    MM.texReset();
  });  
  describe('Check Latex Footnotes \\blfootnotetext{} (_mmd_12):', () => {
    const mmdContent = require('./_data/_footnotes_latex/_mmd/_mmd_12');
    const htmlContent = require('./_data/_footnotes_latex/_html/_html_12');
    const html = MM.markdownToHTML(mmdContent, options);
    it('Checking result html', (done) => {
      html.trim().should.equal(htmlContent);
      done();
    });
    MM.texReset();
  });
  describe('Check Latex Footnotes with terminated rules (_mmd_13):', () => {
    const mmdContent = require('./_data/_footnotes_latex/_mmd/_mmd_13');
    const htmlContent = require('./_data/_footnotes_latex/_html/_html_13');
    const html = MM.markdownToHTML(mmdContent, options);
    it('Checking result html', (done) => {
      html.trim().should.equal(htmlContent);
      done();
    });
    MM.texReset();
  });
});

describe('Check block \\footnotetext:', () => {
  const tests = require('./_data/_footnotes_latex/_data-footnotetext');
  tests.forEach((test, index) => {
    const mmdOptions = {...options};
    const html = MM.markdownToHTML(test.mmd, mmdOptions);
    it('Checking result html. (' + index + ')', (done) => {
      html.trim().should.equal(test.html);
      done();
    });
    MM.texReset();
  });
});

describe('Check block \\footnote:', () => {
  const tests = require('./_data/_footnotes_latex/_data-footnote');
  tests.forEach((test, index) => {
    const mmdOptions = {...options};
    const html = MM.markdownToHTML(test.mmd, mmdOptions);
    it('Checking result html. (' + index + ')', (done) => {
      html.trim().should.equal(test.html);
      done();
    });
    MM.texReset();
  });
});

// Pinned-quirk tests: the expected HTML documents pre-existing parser behaviour we'd like to fix one day. See `_data_known_quirks_footnote.js` for the full warning.
describe('Pre-existing rendering quirks for \\footnote / \\footnotemark (TO BE FIXED):', () => {
  const tests = require('./_data/_footnotes_latex/_data_known_quirks_footnote');
  tests.forEach((test, index) => {
    const mmdOptions = {...options};
    const html = MM.markdownToHTML(test.mmd, mmdOptions);
    it('Checking result html. (' + index + ')', (done) => {
      html.trim().should.equal(test.html);
      done();
    });
    MM.texReset();
  });
});

// Soundness of the per-line token guard: any string that matches the open-tag regex MUST also match the cheap token guard. Locks the invariant the spec relies on — if a future contributor adds an alternative to the open-tag regex that doesn't begin with the literal token followed by a non-letter, this test fails.
describe('Footnote token-guard soundness:', () => {
  // `noMatch` = strings without the literal — token guard must return false (covers pre-gate path).
  const cases = [
    { name: 'reOpenTagFootnoteG',     fullRe: reOpenTagFootnoteG,     tokenRe: reFootnoteToken,     samples: ['\\footnote[]{x}', '\\footnote[1]{x}', '\\footnote{x}', '\\footnote {x}', '\\footnote\n{x}'], forbidden: ['\\footnotemark[1]{x}', '\\footnotesize{x}', '\\footnoteX{x}'], noMatch: ['plain text', '\\textbf{x}', '\\beginningfootnote'] },
    { name: 'reOpenTagFootnotetextG', fullRe: reOpenTagFootnotetextG, tokenRe: reFootnotetextToken, samples: ['\\footnotetext[]{x}', '\\footnotetext[1]{x}', '\\footnotetext{x}', '\\footnotetext\n{x}', '\\blfootnotetext{x}'], forbidden: ['\\footnotetextX{x}', '\\footnotemark[1]{x}', '\\footnotesize{x}'], noMatch: ['plain text', '\\footnote{x}', '\\textbf{x}'] },
  ];
  // Structural invariant — Phase 1 `{` gate + token-guard soundness rely on this.
  const checkAlternatives = (re, prefixRe) => {
    const alts = re.source.split('|');
    alts.length.should.be.greaterThan(0);
    alts.forEach((alt) => {
      prefixRe.test(alt).should.equal(true);
      alt.endsWith('{').should.equal(true);
    });
  };
  it('reOpenTagFootnoteG: every alternative starts with `\\footnote` and ends with `{`', () => {
    checkAlternatives(reOpenTagFootnoteG, /^\\\\footnote/);
  });
  it('reOpenTagFootnotetextG: every alternative starts with `\\footnotetext`/`\\blfootnotetext` and ends with `{`', () => {
    checkAlternatives(reOpenTagFootnotetextG, /^\\\\(?:bl)?footnotetext/);
  });
  cases.forEach(({ name, fullRe, tokenRe, samples, forbidden, noMatch }) => {
    samples.forEach((s) => {
      it(`${name} matches "${s.replace(/\n/g, '\\n')}" → token guard also matches`, () => {
        fullRe.test(s).should.equal(true);
        tokenRe.test(s).should.equal(true);
      });
    });
    // Inverse invariant: `(?![a-zA-Z])` lookahead rejects letter-continued literals.
    forbidden.forEach((s) => {
      it(`${name} token guard rejects "${s}"`, () => {
        tokenRe.test(s).should.equal(false);
      });
    });
    noMatch.forEach((s) => {
      it(`${name} token guard rejects no-match "${s}"`, () => {
        tokenRe.test(s).should.equal(false);
      });
    });
  });
});

describe('Footnote rule performance regression:', () => {
  // Ratio-based: linear scaling on 10× size diff gives ratio ~10; O(N×M) regression gives ~1000.
  // 60× limit catches partial regressions while absorbing CI noise (both measurements share runner).
  const SCALING_RATIO_LIMIT = 60;
  const SMALL_FLOOR_MS = 5;
  // Median of 5 runs via `performance.now()` — sub-millisecond resolution, robust to single-sample GC spikes.
  const measureMs = (mmd) => {
    MM.markdownToHTML(mmd, options);
    MM.texReset();
    const samples = [];
    for (let i = 0; i < 5; i++) {
      const t0 = performance.now();
      MM.markdownToHTML(mmd, options);
      samples.push(performance.now() - t0);
      MM.texReset();
    }
    samples.sort((a, b) => a - b);
    return samples[2];
  };
  const buildBody = (paragraphCount) => {
    const lines = [];
    for (let i = 0; i < paragraphCount; i++) {
      lines.push('This paragraph contains plain prose without any footnote-related markup.');
      if ((i & 7) === 0) lines.push('');
    }
    return lines.join('\n');
  };

  it('cache early-exit path scales linearly (footnote at start)', function () {
    this.timeout(30000);
    const head = '\\footnote{single} early footnote.\n\n';
    const small = measureMs(head + buildBody(400));
    const large = measureMs(head + buildBody(4000));
    (large / Math.max(small, SMALL_FLOOR_MS)).should.be.below(SCALING_RATIO_LIMIT);
  });

  it('per-line gate path scales linearly (footnote at end)', function () {
    this.timeout(30000);
    const tail = '\n\nLater \\footnote{single}.';
    const small = measureMs(buildBody(400) + tail);
    const large = measureMs(buildBody(4000) + tail);
    (large / Math.max(small, SMALL_FLOOR_MS)).should.be.below(SCALING_RATIO_LIMIT);
  });
});
