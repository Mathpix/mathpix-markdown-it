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
    const mmdOptions = Object.assign({}, options, options);
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
    const mmdOptions = Object.assign({}, options, options);
    const html = MM.markdownToHTML(test.mmd, mmdOptions);
    it('Checking result html. (' + index + ')', (done) => {
      html.trim().should.equal(test.html);
      done();
    });
    MM.texReset();
  });
});

// Performance regression: the per-state position cache must keep both `latex_footnote_block` and `latex_footnotetext_block` at O(1) per block start on footnote-free paragraphs, not O(N × paragraph-length). Without the early-exit, a single forgotten optimization can regress this back into the seconds-to-minutes range.
const buildLargeNoFootnoteDoc = (header) => {
  const lines = [header, ''];
  for (let i = 0; i < 4000; i++) {
    lines.push('This paragraph contains plain prose without any footnote-related markup.');
    if ((i & 7) === 0) lines.push('');
  }
  return lines.join('\n');
};

// Soundness of the per-line token guard: any string that matches the open-tag regex MUST also match the cheap token guard. Locks the invariant the spec relies on — if a future contributor adds an alternative to the open-tag regex that doesn't begin with the literal token followed by a non-letter, this test fails.
describe('Footnote token-guard soundness:', () => {
  const cases = [
    { name: 'reOpenTagFootnoteG',     fullRe: reOpenTagFootnoteG,     tokenRe: reFootnoteToken,     samples: ['\\footnote[]{x}', '\\footnote[1]{x}', '\\footnote{x}', '\\footnote {x}', '\\footnote\n{x}'] },
    { name: 'reOpenTagFootnotetextG', fullRe: reOpenTagFootnotetextG, tokenRe: reFootnotetextToken, samples: ['\\footnotetext[]{x}', '\\footnotetext[1]{x}', '\\footnotetext{x}', '\\footnotetext\n{x}', '\\blfootnotetext{x}'] },
  ];
  cases.forEach(({ name, fullRe, tokenRe, samples }) => {
    samples.forEach((s) => {
      it(`${name} matches "${s.replace(/\n/g, '\\n')}" → token guard also matches`, () => {
        fullRe.test(s).should.equal(true);
        tokenRe.test(s).should.equal(true);
      });
    });
  });
});

describe('Footnote rule performance regression:', () => {
  // Optimized path: ~80 ms locally. 1.5 s budget catches a return to seconds-per-parse (~20× regression and up) while staying loose enough for slow CI runners. Warmup parse absorbs JIT / MathJax init so the measured run isn't penalised on first call.
  const measure = (mmd) => {
    MM.markdownToHTML(mmd, options);
    MM.texReset();
    const t0 = Date.now();
    const html = MM.markdownToHTML(mmd, options);
    const elapsed = Date.now() - t0;
    MM.texReset();
    return { html, elapsed };
  };

  it('4,000-paragraph document with one early \\footnote{} parses well under the budget', function () {
    this.timeout(15000);
    const mmd = buildLargeNoFootnoteDoc('Header paragraph with one footnote \\footnote{single}.');
    const { html, elapsed } = measure(mmd);
    html.should.contain('footnote-ref');
    elapsed.should.be.below(1500);
  });

  it('4,000-paragraph document with one early \\footnotetext{} parses well under the budget', function () {
    this.timeout(15000);
    const mmd = buildLargeNoFootnoteDoc('\\footnotetext[1]{single}\n');
    const { elapsed } = measure(mmd);
    elapsed.should.be.below(1500);
  });
});
