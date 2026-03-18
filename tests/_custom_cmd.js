// Import SRE-dependent modules BEFORE setting JSDOM globals.
let chai = require('chai');
let should = chai.should();
let MathJax = require('../lib/mathjax/index.js').MathJax;
let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;
const { loadSreAsync } = require('../lib/sre/sre-node');

const { JSDOM } = require("jsdom");
global.window = new JSDOM().window;
global.document = global.window.document;
global.DOMParser = global.window.DOMParser;

const { addSpeechToMathContainer } = require('../lib/sre/index');

const tests = require('./_data/_custom_cmd/_data');

const convertOpts = {outMath: {
  include_asciimath: true,
  include_linearmath: true,
  include_mathml: true,
  include_mathml_word: true,
  include_svg: true,
}};

describe('Custom commands — all output formats:', () => {
  let sre;
  before(async function () {
    this.timeout(10000);
    sre = await loadSreAsync();
  });
  tests.forEach(function(t, i) {
    describe((i + 1) + '. ' + t.latex, () => {
      let data;
      let typstData;
      before(() => {
        data = MathJax.TexConvert(t.latex, convertOpts);
        typstData = MathJax.TexConvertToTypstData(t.latex);
      });
      // --- text-based formats ---
      if (t.asciimath !== undefined) {
        it('asciimath', () => {
          data.asciimath.should.equal(t.asciimath);
        });
      }
      if (t.linearmath !== undefined) {
        it('linearmath', () => {
          data.linearmath.should.equal(t.linearmath);
        });
      }
      if (t.typst !== undefined) {
        it('typst', () => {
          typstData.typstmath.should.equal(t.typst);
        });
      }
      if (t.typst_inline !== undefined) {
        it('typst_inline', () => {
          typstData.typstmath_inline.should.equal(t.typst_inline);
        });
      }
      if (t.mathml !== undefined) {
        it('mathml', () => {
          data.mathml.should.equal(t.mathml);
        });
      }
      if (t.mathml_word !== undefined) {
        it('mathml_word', () => {
          data.mathml_word.should.equal(t.mathml_word);
        });
      }
      if (t.svg !== undefined) {
        it('svg', () => {
          data.svg.should.equal(t.svg);
        });
      }
      // --- accessibility ---
      if (t.assistive_mml !== undefined) {
        it('assistive_mml', () => {
          const html = MM.markdownToHTML(t.mmd, {
            accessibility: { assistiveMml: true }
          });
          const dom = new JSDOM(html);
          const assistive = dom.window.document.querySelector('mjx-assistive-mml');
          should.exist(assistive, 'mjx-assistive-mml should exist');
          assistive.innerHTML.should.equal(t.assistive_mml);
        });
      }
      if (t.aria_label !== undefined) {
        it('aria_label (client-side: addSpeechToMathContainer)', () => {
          const html = MM.markdownToHTML(t.mmd, {
            accessibility: { assistiveMml: true }
          });
          const dom = new JSDOM(html);
          const mjx = dom.window.document.querySelector('mjx-container');
          should.exist(mjx, 'mjx-container should exist');
          addSpeechToMathContainer(sre, mjx, dom.window.document);
          mjx.getAttribute('aria-label').should.equal(t.aria_label);
        });
        it('aria_label (server-side: sre in markdownToHTML)', async () => {
          const html = MM.markdownToHTML(t.mmd, {
            accessibility: { assistiveMml: true, sre: sre }
          });
          const dom = new JSDOM(html);
          const mjx = dom.window.document.querySelector('mjx-container');
          should.exist(mjx, 'mjx-container should exist');
          mjx.hasAttribute('aria-label').should.be.true;
          mjx.getAttribute('aria-label').should.equal(t.aria_label);
        });
      }
    });
  });
});
