let chai = require('chai');
let should = chai.should();

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;
const markdownIt = require('markdown-it');
const { getLabelsList, mathpixMarkdownPlugin } = require('../lib/index');
const {
  reFootnoteToken,
  reFootnotetextToken,
  reOpenTagFootnoteG,
  reOpenTagFootnotetextG,
} = require('../lib/markdown/common/consts');
const listEnvEngine = require('../lib/markdown/md-latex-lists-env/latex-list-env-engine');

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

// The list rule parses a body to answer a probe, so it can throw. It swallows that itself, which is
// what makes every prober behave alike — the footnote scans, markdown-it's paragraph chain, lheading.
describe('A throwing terminator probe does not fail the render:', () => {
  const shapes = {
    '\\footnote': 'Para \\footnote\n\\begin{itemize}\n\\item[a] x\n\\end{itemize}\n{f}',
    '\\footnotetext': 'Para \\footnotetext\n\\begin{itemize}\n\\item[a] x\n\\end{itemize}\n{f}',
    'paragraph chain': 'Paragraph text\n\\begin{itemize}\n\\item[a] x\n\\end{itemize}',
  };
  Object.entries(shapes).forEach(([name, src]) => {
    it(`${name}: the probe throw is contained and the document renders`, () => {
      const md = markdownIt({ html: true })
        .use(mathpixMarkdownPlugin, { outMath: { include_svg: false } });
      // Break the speculative parse from inside — that is where the guard sits — and only while a
      // probe is running: a real parse must keep failing loudly.
      const rule = md.block.ruler.__rules__.find((r) => r.name === 'Lists');
      const originalRule = rule.fn;
      let silentDepth = 0;
      rule.fn = function (state, start, end, silent) {
        if (silent) { silentDepth++; }
        try { return originalRule.apply(this, arguments); }
        finally { if (silent) { silentDepth--; } }
      };
      md.block.ruler.__cache__ = null;
      const original = listEnvEngine.createBufferedState;
      let thrown = 0;
      listEnvEngine.createBufferedState = function () {
        if (silentDepth > 0) {
          thrown++;
          throw new Error('probe blew up');
        }
        return original.apply(this, arguments);
      };
      const warn = console.warn;
      console.warn = () => {};
      try {
        const html = md.render(src);
        thrown.should.be.above(0, 'the shape stopped reaching the list rule');
        html.should.be.a('string');
      } finally {
        console.warn = warn;
        listEnvEngine.createBufferedState = original;
        rule.fn = originalRule;
      }
    });
  });
});

describe('Footnote rule performance regression:', () => {
  // Parse-only timing — bypasses MathJax/render, isolates Phase 1 cost.
  const perfMd = markdownIt({ html: true, breaks: true, linkify: true })
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
  // These two keep the absolute limit: their immune twin (a paragraph without the literal) costs
  // less than SMALL_FLOOR_MS, so a normalised ratio would measure the floor, not the defect.
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

  // Without the list terminator each footnotetext scan ran into the rest of the doc — O(N^2).
  // Normalised against the blank-separated form in the same run, so the bound is machine-free.
  it('list + \\footnotetext units scale like blank-separated ones', function () {
    this.timeout(60000);
    const unit = (sep) =>
      'Paragraph text before the list with no blank line separator.' + sep +
      '\\begin{itemize}\n\\item[] \\footnotetext{\nA footnote note inside the item.\n}\n\\end{itemize}';
    const growth = (sep) => {
      const build = (n) => Array.from({ length: n }, () => unit(sep)).join('\n');
      return measureMs(build(2000)) / Math.max(measureMs(build(200)), SMALL_FLOOR_MS);
    };
    (growth('\n') / growth('\n\n')).should.be.below(5);
  });

  // Without the closer lookahead, each probe of an unclosed env scans to EOF — O(N^2) over N starts.
  // Normalised against the closed form measured in the same run, so the bound does not depend on
  // machine speed: measured 0.6 with the lookahead, 51 without.
  it('unclosed \\begin{itemize} units scale like closed ones', function () {
    this.timeout(60000);
    const growth = (unit) => {
      const build = (n) => Array.from({ length: n }, () => unit).join('\n');
      const small = measureMs(build(100));
      return measureMs(build(1000)) / Math.max(small, SMALL_FLOOR_MS);
    };
    const unclosed = growth('\\begin{itemize}\n\\item[a] x');
    const closed = growth('\\begin{itemize}\n\\item[a] x\n\\end{itemize}');
    (unclosed / closed).should.be.below(5);
  });

  // Counting work instead of timing it: the closer lookahead rejects an unclosed env before the
  // scan, so the tag scanner is never entered. Deterministic — 0 with the lookahead, 12M without
  // (counting rule invocations would not detect it: those are identical either way).
  it('an unclosed \\begin{tabular} is rejected without scanning for tags', () => {
    const utils = require('../lib/markdown/utils');
    const original = utils.findOpenCloseTags;
    let calls = 0;
    utils.findOpenCloseTags = function counted() {
      calls++;
      return original.apply(this, arguments);
    };
    try {
      const build = (unit) => Array.from({ length: 200 }, () => unit).join('\n');
      MM.markdownToHTML(build('Para\n\\begin{tabular}{|l|}\nq'), { outMath: { include_svg: false } });
      calls.should.equal(0);
      // Control: a closed env does scan, so the counter is wired to something that runs.
      MM.markdownToHTML(build('Para\n\\begin{tabular}{|l|}\nq\n\\end{tabular}'),
        { outMath: { include_svg: false } });
      calls.should.be.above(0);
    } finally {
      utils.findOpenCloseTags = original;
    }
  });
});
