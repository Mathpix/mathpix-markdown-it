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
  // Parse-only timing — bypasses MathJax/render, isolates Phase 1 cost.
  const { mathpixMarkdownPlugin } = require('../lib/markdown/mathpix-markdown-plugins');
  const perfMd = require('markdown-it')({ html: true, breaks: true, linkify: true })
    .use(mathpixMarkdownPlugin, { width: 800 })
    .use(require('markdown-it-footnote'));
  const SCALING_RATIO_LIMIT = 60;
  const SMALL_FLOOR_MS = 5;
  const measureMs = (mmd) => {
    perfMd.parse(mmd, {}); // warmup
    const samples = [];
    for (let i = 0; i < 5; i++) {
      const t0 = performance.now();
      perfMd.parse(mmd, {});
      samples.push(performance.now() - t0);
    }
    samples.sort((a, b) => a - b);
    return samples[2];
  };
  // Worst case: long paragraph with literal substring inline — forces regex backtracking on master's Phase 1.
  const buildBodyWithLiteral = (lineCount, literal) => {
    const lines = [];
    for (let i = 0; i < lineCount; i++) {
      lines.push(`Line ${i} mentions ${literal} without command syntax in this long paragraph.`);
    }
    return lines.join('\n');
  };

  const cases = [
    { rule: 'latex_footnote_block',     literal: '\\footnote',     head: '\\footnote{single} early.\n\n',     tail: '\n\nLater \\footnote{single}.' },
    { rule: 'latex_footnotetext_block', literal: '\\footnotetext', head: '\\footnotetext{single} early.\n\n', tail: '\n\nLater \\footnotetext{single}.' },
  ];
  cases.forEach(({ rule, literal, head, tail }) => {
    it(`${rule}: cache early-exit path scales linearly (literal at start)`, function () {
      this.timeout(60000);
      const small = measureMs(head + buildBodyWithLiteral(200, literal));
      const large = measureMs(head + buildBodyWithLiteral(2000, literal));
      (large / Math.max(small, SMALL_FLOOR_MS)).should.be.below(SCALING_RATIO_LIMIT);
    });

    it(`${rule}: per-line gate path scales linearly (literal at end)`, function () {
      this.timeout(60000);
      const small = measureMs(buildBodyWithLiteral(200, literal) + tail);
      const large = measureMs(buildBodyWithLiteral(2000, literal) + tail);
      (large / Math.max(small, SMALL_FLOOR_MS)).should.be.below(SCALING_RATIO_LIMIT);
    });
  });

  // Without the LaTeX list rule as a terminator, each footnotetext scan runs across
  // the `\begin{itemize}` into the rest of the doc → O(N^2); the terminator bounds it → linear.
  it('list + \\footnotetext units without blank separators scale linearly', function () {
    this.timeout(60000);
    const unit =
      'Paragraph text before the list with no blank line separator.\n' +
      '\\begin{itemize}\n\\item[] \\footnotetext{\nA footnote note inside the item.\n}\n\\end{itemize}';
    const build = (n) => Array.from({ length: n }, () => unit).join('\n');
    // Same 10x growth as the cases above, so SCALING_RATIO_LIMIT means the same thing here.
    const small = measureMs(build(200));
    const large = measureMs(build(2000));
    (large / Math.max(small, SMALL_FLOOR_MS)).should.be.below(SCALING_RATIO_LIMIT);
  });

  // Without the closer lookahead, each probe of an unclosed env scans to EOF — O(N^2) over N starts.
  it('unclosed \\begin{itemize} units scale linearly', function () {
    this.timeout(60000);
    const unit = '\\begin{itemize}\n\\item[a] x';
    const build = (n) => Array.from({ length: n }, () => unit).join('\n');
    const small = measureMs(build(100));
    const large = measureMs(build(1000));
    (large / Math.max(small, SMALL_FLOOR_MS)).should.be.below(SCALING_RATIO_LIMIT);
  });

  // The tabular shape stays super-linear for a reason outside this rule (unterminated forward scans
  // in newTheoremBlock/lheading), so pin the probe itself: rejecting an unclosed env must not cost
  // more than accepting a closed one, which is what the closer lookahead guarantees.
  it('probing an unclosed \\begin{tabular} is not dearer than probing a closed one', function () {
    this.timeout(60000);
    const rule = perfMd.block.ruler.__rules__.find((r) => r.name === 'BeginTabular').fn;
    const build = (unit) => Array.from({ length: 400 }, () => unit).join('\n');
    const probeMs = (src) => {
      // One state, reused: building it costs more than the scan and would mask the difference. So
      // this measures the memoised bail against a closed env, which pays a full scan every probe.
      const state = new perfMd.block.State(src, perfMd, {}, []);
      rule(state, 0, state.lineMax, true); // warm
      const samples = [];
      for (let i = 0; i < 5; i++) {
        const t0 = performance.now();
        for (let k = 0; k < 200; k++) {
          rule(state, 0, state.lineMax, true);
        }
        samples.push(performance.now() - t0);
      }
      samples.sort((a, b) => a - b);
      return samples[2];
    };
    const unclosed = probeMs(build('\\begin{tabular}{|l|}\nq'));
    const closed = probeMs(build('\\begin{tabular}{|l|}\nq\n\\end{tabular}'));
    // Floor well above timer noise: without the lookahead the gap is ~100×, so a loose bound still
    // detects it while staying stable on a loaded CI box.
    unclosed.should.be.below(Math.max(closed, SMALL_FLOOR_MS) * 3);
  });
});
