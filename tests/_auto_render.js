// Set up JSDOM globals BEFORE requiring auto-render so that isBrowser() returns
// true and the module exposes renderMathInElement. We also polyfill XMLHttpRequest
// because the SRE browser build (imported transitively by auto-render) uses it
// at module-init time.
const { JSDOM } = require("jsdom");
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost'
});
global.window = dom.window;
global.document = dom.window.document;
global.DOMParser = dom.window.DOMParser;
global.Node = dom.window.Node;
global.XMLHttpRequest = dom.window.XMLHttpRequest;

let chai = require('chai');
let should = chai.should();
const { renderMathInElement } = require('../lib/browser/auto-render');

// Shorthand: render with accessibility disabled (fast, no SRE)
const renderNoA11y = (container, extraConfig) =>
  renderMathInElement(container, {
    accessibility: { assistive_mml: false, include_speech: false },
    ...extraConfig,
  });

// Helper: create a container <div> with the given inner HTML
const makeContainer = (innerHTML) => {
  const div = document.createElement('div');
  div.innerHTML = innerHTML;
  return div;
};

describe('auto-render (renderMathInElement):', () => {
  // ─── TeX delimiter recognition ─────────────────────────────────────
  describe('TeX delimiter recognition', () => {
    it('renders $...$ (inline dollar)', async () => {
      const c = makeContainer('<span class="math-inline">$x^2$</span>');
      await renderNoA11y(c);
      c.innerHTML.should.include('mjx-container');
      c.innerHTML.should.include('<svg');
    });
    it('renders $$...$$ (display dollar)', async () => {
      const c = makeContainer('<span class="math-block">$$\\frac{a}{b}$$</span>');
      await renderNoA11y(c);
      c.innerHTML.should.include('mjx-container');
      c.innerHTML.should.include('display="true"');
    });
    it('renders \\(...\\) (inline parens)', async () => {
      const c = makeContainer('<span class="math-inline">\\(x^2\\)</span>');
      await renderNoA11y(c);
      c.innerHTML.should.include('mjx-container');
      c.innerHTML.should.include('<svg');
    });
    it('renders \\[...\\] (display brackets)', async () => {
      const c = makeContainer('<span class="math-block">\\[x^2\\]</span>');
      await renderNoA11y(c);
      c.innerHTML.should.include('mjx-container');
      c.innerHTML.should.include('display="true"');
    });
    it('renders \\begin{equation}...\\end{equation} (environment)', async () => {
      const c = makeContainer(
        '<span class="math-block">\\begin{equation}x^2\\end{equation}</span>'
      );
      await renderNoA11y(c);
      c.innerHTML.should.include('mjx-container');
    });
  });
  // ─── MathML input ──────────────────────────────────────────────────
  describe('MathML input', () => {
    it('renders a <math> element inside .math-block', async () => {
      const c = makeContainer(
        '<span class="math-block">' +
          '<math xmlns="http://www.w3.org/1998/Math/MathML"><msup><mi>x</mi><mn>2</mn></msup></math>' +
        '</span>'
      );
      await renderNoA11y(c);
      c.innerHTML.should.include('mjx-container');
    });
  });
  // ─── Skip logic ────────────────────────────────────────────────────
  describe('skip logic', () => {
    it('skips already-rendered elements (data-mathpix-typeset)', async () => {
      const c = makeContainer(
        '<span class="math-inline" data-mathpix-typeset="true"><mjx-container>existing</mjx-container></span>'
      );
      await renderNoA11y(c);
      // Should not re-render — content unchanged
      c.querySelector('.math-inline').innerHTML.should.include('existing');
    });
    it('skips elements without math delimiters', async () => {
      const c = makeContainer('<span class="math-inline">just plain text</span>');
      await renderNoA11y(c);
      // No mjx-container — content was not math
      c.innerHTML.should.not.include('mjx-container');
    });
    it('skips elements containing non-trivial child elements', async () => {
      const c = makeContainer(
        '<span class="math-inline"><span>child</span></span>'
      );
      await renderNoA11y(c);
      c.innerHTML.should.not.include('mjx-container');
    });
  });
  // ─── Attributes ────────────────────────────────────────────────────
  describe('post-render attributes', () => {
    it('sets data-mathpix-typeset="true" after rendering', async () => {
      const c = makeContainer('<span class="math-inline">$x^2$</span>');
      await renderNoA11y(c);
      const el = c.querySelector('.math-inline');
      el.getAttribute('data-mathpix-typeset').should.equal('true');
    });
  });
  // ─── Multiple elements ─────────────────────────────────────────────
  describe('multiple elements', () => {
    it('renders all .math-inline and .math-block elements in one pass', async () => {
      const c = makeContainer(
        '<span class="math-inline">$a$</span>' +
        '<span class="math-block">$$b$$</span>' +
        '<span class="math-inline">$c$</span>'
      );
      await renderNoA11y(c);
      const rendered = c.querySelectorAll('[data-mathpix-typeset="true"]');
      rendered.length.should.equal(3);
    });
  });
  // ─── Accessibility config ──────────────────────────────────────────
  describe('accessibility config', () => {
    it('assistive_mml: false → no mjx-assistive-mml in output', async () => {
      const c = makeContainer('<span class="math-inline">$x^2$</span>');
      await renderMathInElement(c, {
        accessibility: { assistive_mml: false, include_speech: false }
      });
      c.innerHTML.should.not.include('mjx-assistive-mml');
    });
    it('assistive_mml: true → mjx-assistive-mml present', async () => {
      const c = makeContainer('<span class="math-inline">$x^2$</span>');
      await renderMathInElement(c, {
        accessibility: { assistive_mml: true, include_speech: false }
      });
      c.innerHTML.should.include('mjx-assistive-mml');
    });
  });
});
