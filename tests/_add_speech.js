// Import SRE-dependent modules BEFORE setting JSDOM globals.
// SRE's Node.js build checks `typeof window` to decide whether to use `fs` or
// `XMLHttpRequest` for loading locale data. Setting global.window first would
// make it pick the XMLHttpRequest path, which doesn't exist in Node.js.
let chai = require('chai');
let should = chai.should();
let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;
const { loadSreAsync } = require('../lib/sre/sre-node');
const { addSpeechToMathContainer, addAriaToMathHTML } = require('../lib/sre/index');

// Now set up JSDOM for DOM operations used by addSpeechToMathContainer
const { JSDOM } = require("jsdom");
global.window = new JSDOM().window;
global.document = global.window.document;
global.DOMParser = global.window.DOMParser;

describe('add-speech (addSpeechToMathContainer):', () => {
  let sre;
  before(async function () {
    this.timeout(10000);
    sre = await loadSreAsync();
  });
  /**
   * Helper: render math server-side with assistiveMml (no SRE) and parse
   * the resulting HTML into a fresh JSDOM. Returns the JSDOM instance.
   * Server output will contain aria-labelledby + mjx-assistive-mml but NOT aria-label.
   */
  const renderAndParse = (latex) => {
    const html = MM.markdownToHTML(latex, {
      accessibility: { assistiveMml: true }
    });
    return new JSDOM(html);
  };
  // ─── addSpeechToMathContainer ──────────────────────────────────────
  describe('addSpeechToMathContainer', () => {
    it('adds aria-label to mjx-container', () => {
      const dom = renderAndParse('$x^2$');
      const mjx = dom.window.document.querySelector('mjx-container');
      should.exist(mjx);
      addSpeechToMathContainer(sre, mjx, dom.window.document);
      mjx.hasAttribute('aria-label').should.be.true;
      mjx.getAttribute('aria-label').should.be.a('string').and.not.be.empty;
    });
    it('sets role="math" and tabindex="0"', () => {
      const dom = renderAndParse('$x^2$');
      const mjx = dom.window.document.querySelector('mjx-container');
      addSpeechToMathContainer(sre, mjx, dom.window.document);
      mjx.getAttribute('role').should.equal('math');
      mjx.getAttribute('tabindex').should.equal('0');
    });
    it('removes aria-labelledby when aria-label is set', () => {
      const dom = renderAndParse('$x^2$');
      const mjx = dom.window.document.querySelector('mjx-container');
      // Server render with assistiveMml produces aria-labelledby
      mjx.hasAttribute('aria-labelledby').should.be.true;
      addSpeechToMathContainer(sre, mjx, dom.window.document);
      mjx.hasAttribute('aria-labelledby').should.be.false;
      mjx.hasAttribute('aria-label').should.be.true;
    });
    it('creates hidden <speech> element in parent', () => {
      const dom = renderAndParse('$x^2$');
      const mjx = dom.window.document.querySelector('mjx-container');
      addSpeechToMathContainer(sre, mjx, dom.window.document);
      const speechEl = mjx.parentElement.querySelector('speech');
      should.exist(speechEl);
      speechEl.style.display.should.equal('none');
      speechEl.innerHTML.should.be.a('string').and.not.be.empty;
    });
    it('skips elements that already have aria-label', () => {
      const dom = renderAndParse('$x^2$');
      const mjx = dom.window.document.querySelector('mjx-container');
      mjx.setAttribute('aria-label', 'existing label');
      addSpeechToMathContainer(sre, mjx, dom.window.document);
      // Should not overwrite
      mjx.getAttribute('aria-label').should.equal('existing label');
    });
    it('skips elements without mjx-assistive-mml', () => {
      const dom = new JSDOM('<mjx-container><svg></svg></mjx-container>');
      const mjx = dom.window.document.querySelector('mjx-container');
      addSpeechToMathContainer(sre, mjx, dom.window.document);
      mjx.hasAttribute('aria-label').should.be.false;
    });
    it('produces meaningful speech text (not empty)', () => {
      const dom = renderAndParse('$\\frac{a}{b}$');
      const mjx = dom.window.document.querySelector('mjx-container');
      addSpeechToMathContainer(sre, mjx, dom.window.document);
      const speech = mjx.getAttribute('aria-label');
      // Speech should contain actual words describing the fraction
      speech.length.should.be.above(2);
    });
  });
  // ─── addAriaToMathHTML (string-based API) ──────────────────────────
  describe('addAriaToMathHTML', () => {
    it('adds aria-label to HTML string containing mjx-container', () => {
      const html = MM.markdownToHTML('$x^2$', {
        accessibility: { assistiveMml: true }
      });
      const result = addAriaToMathHTML(sre, html);
      result.should.include('aria-label');
    });
    it('handles multiple mjx-containers in one HTML string', () => {
      const html = MM.markdownToHTML('$x^2$ and $y^3$', {
        accessibility: { assistiveMml: true }
      });
      const result = addAriaToMathHTML(sre, html);
      const count = (result.match(/aria-label/g) || []).length;
      count.should.be.at.least(2);
    });
    it('returns original HTML if no mjx-container found', () => {
      const html = '<p>No math here</p>';
      const result = addAriaToMathHTML(sre, html);
      result.should.equal(html);
    });
    it('adds role="math" and tabindex="0" to each container', () => {
      const html = MM.markdownToHTML('$x^2$', {
        accessibility: { assistiveMml: true }
      });
      const result = addAriaToMathHTML(sre, html);
      result.should.include('role="math"');
      result.should.include('tabindex="0"');
    });
    it('integration: server render → addAriaToMathHTML → full speech pipeline', () => {
      const html = MM.markdownToHTML('$\\frac{a}{b}$', {
        accessibility: { assistiveMml: true }
      });
      // Before: has aria-labelledby but no aria-label
      html.should.include('mjx-assistive-mml');
      html.should.include('aria-labelledby');
      html.should.not.include('aria-label=');
      const result = addAriaToMathHTML(sre, html);
      // After: has aria-label, role, tabindex, speech element
      result.should.include('aria-label');
      result.should.include('role="math"');
      result.should.include('tabindex="0"');
      result.should.include('<speech');
    });
  });
});
