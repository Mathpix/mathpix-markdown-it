let chai = require('chai');
let should = chai.should();
let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;
const { loadSreAsync } = require('../lib/sre/sre-node');

const { JSDOM } = require("jsdom");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

describe('output_format:', () => {
  // ─── Group 1: Default SVG output (regression protection) ───────────
  describe('SVG (default)', () => {
    it('inline math with no output_format contains mjx-container and <svg', (done) => {
      const html = MM.markdownToHTML('$x^2$');
      html.should.include('mjx-container');
      html.should.include('<svg');
      done();
    });
    it('display math with no output_format contains mjx-container and display="true"', (done) => {
      const html = MM.markdownToHTML('$$\\frac{a}{b}$$');
      html.should.include('mjx-container');
      html.should.include('display="true"');
      done();
    });
    it('explicit output_format: "svg" produces mjx-container and <svg', (done) => {
      const html = MM.markdownToHTML('$x^2$', {
        outMath: { output_format: 'svg' }
      });
      html.should.include('mjx-container');
      html.should.include('<svg');
      done();
    });
    it('explicit output_format: "svg" on display math contains display="true"', (done) => {
      const html = MM.markdownToHTML('$$\\frac{a}{b}$$', {
        outMath: { output_format: 'svg' }
      });
      html.should.include('mjx-container');
      html.should.include('display="true"');
      done();
    });
  });
  // ─── Group 2: MathML output format ────────────────────────────────
  describe('MathML format', () => {
    it('inline math contains <math and <msup, no SVG or mjx-container', (done) => {
      const html = MM.markdownToHTML('$x^2$', {
        outMath: { output_format: 'mathml' }
      });
      html.should.include('<math');
      html.should.include('<msup');
      html.should.not.include('<svg');
      html.should.not.include('mjx-container');
      done();
    });
    it('display math contains <math and <mfrac, no SVG', (done) => {
      const html = MM.markdownToHTML('$$\\frac{a}{b}$$', {
        outMath: { output_format: 'mathml' }
      });
      html.should.include('<math');
      html.should.include('<mfrac');
      html.should.not.include('<svg');
      html.should.not.include('mjx-container');
      done();
    });
    it('inline MathML is wrapped in span.math-inline', (done) => {
      const html = MM.markdownToHTML('$x^2$', {
        outMath: { output_format: 'mathml' }
      });
      html.should.include('class="math-inline');
      done();
    });
    it('display MathML is wrapped in element with class math-block', (done) => {
      const html = MM.markdownToHTML('$$\\frac{a}{b}$$', {
        outMath: { output_format: 'mathml' }
      });
      html.should.include('class="math-block');
      done();
    });
  });
  // ─── Group 3: LaTeX output format ─────────────────────────────────
  describe('LaTeX format', () => {
    it('inline math contains latex source, no SVG or MathML', (done) => {
      const html = MM.markdownToHTML('$x^2$', {
        outMath: { output_format: 'latex' }
      });
      html.should.include('x^');
      html.should.not.include('<svg');
      html.should.not.include('mjx-container');
      html.should.not.include('<math');
      done();
    });
    it('display math contains \\frac{a}{b} source', (done) => {
      const html = MM.markdownToHTML('$$\\frac{a}{b}$$', {
        outMath: { output_format: 'latex' }
      });
      html.should.include('\\frac{a}{b}');
      html.should.not.include('<svg');
      html.should.not.include('<math');
      done();
    });
    it('HTML entities are escaped via formatSource (< becomes &lt;)', (done) => {
      const html = MM.markdownToHTML('$a < b$', {
        outMath: { output_format: 'latex' }
      });
      html.should.include('&lt;');
      done();
    });
    it('latex output is wrapped in span.math-inline for inline math', (done) => {
      const html = MM.markdownToHTML('$x^2$', {
        outMath: { output_format: 'latex' }
      });
      html.should.include('class="math-inline');
      done();
    });
    it('latex output is wrapped in element with class math-block for display math', (done) => {
      const html = MM.markdownToHTML('$$x^2$$', {
        outMath: { output_format: 'latex' }
      });
      html.should.include('class="math-block');
      done();
    });
  });
  // ─── Group 4: Interaction with include_* flags ─────────────────────
  describe('Interaction with include_* flags', () => {
    it('output_format: "mathml" + include_mathml: false → MathML still produced (forced by output_format)', (done) => {
      const html = MM.markdownToHTML('$x^2$', {
        outMath: { output_format: 'mathml', include_mathml: false }
      });
      html.should.include('<math');
      html.should.include('<msup');
      done();
    });
    it('output_format: "svg" + include_svg: false → no SVG in output', (done) => {
      const html = MM.markdownToHTML('$x^2$', {
        outMath: { output_format: 'svg', include_svg: false }
      });
      html.should.not.include('<svg');
      done();
    });
    it('output_format: "svg" + include_mathml + include_latex → SVG with hidden mathml and latex elements', (done) => {
      const html = MM.markdownToHTML('$x^2$', {
        outMath: {
          output_format: 'svg',
          include_mathml: true,
          include_latex: true,
          include_svg: true
        }
      });
      html.should.include('<svg');
      html.should.include('<mathml');
      html.should.include('<latex');
      html.should.include('style="display: none;"');
      done();
    });
    it('output_format: "mathml" + include_latex: true → only MathML, no hidden latex element', (done) => {
      const html = MM.markdownToHTML('$x^2$', {
        outMath: { output_format: 'mathml', include_latex: true }
      });
      html.should.include('<math');
      html.should.not.include('<latex');
      done();
    });
  });
  // ─── Group 5: Accessibility with output_format ─────────────────────
  describe('Accessibility integration', () => {
    it('SVG + assistiveMml: true → mjx-assistive-mml present', (done) => {
      const html = MM.markdownToHTML('$x^2$', {
        outMath: { output_format: 'svg' },
        accessibility: { assistiveMml: true }
      });
      html.should.include('mjx-assistive-mml');
      html.should.include('mjx-container');
      done();
    });
    it('SVG + assistiveMml + SRE → aria-label with speech text', async () => {
      const html = MM.markdownToHTML('$x^2$', {
        outMath: { output_format: 'svg' },
        accessibility: {
          assistiveMml: true,
          sre: await loadSreAsync()
        }
      });
      html.should.include('aria-label');
      html.should.include('mjx-container');
    });
    it('MathML + assistiveMml: true → no ARIA attributes (no mjx-container)', (done) => {
      const html = MM.markdownToHTML('$x^2$', {
        outMath: { output_format: 'mathml' },
        accessibility: { assistiveMml: true }
      });
      html.should.not.include('mjx-assistive-mml');
      html.should.not.include('aria-labelledby');
      done();
    });
    it('LaTeX + assistiveMml: true → no ARIA attributes', (done) => {
      const html = MM.markdownToHTML('$x^2$', {
        outMath: { output_format: 'latex' },
        accessibility: { assistiveMml: true }
      });
      html.should.not.include('mjx-assistive-mml');
      html.should.not.include('aria-labelledby');
      done();
    });
  });
  // ─── Group 6: parseMarkdownByHTML with output_format ───────────────
  describe('parseMarkdownByHTML integration', () => {
    it('SVG + include_mathml + include_latex → parsed array contains mathml, latex, svg types', (done) => {
      const html = MM.render('$x^2$', {
        outMath: {
          output_format: 'svg',
          include_mathml: true,
          include_latex: true,
          include_svg: true
        }
      });
      const data = MM.parseMarkdownByHTML(html, false);
      const types = data.map(d => d.type);
      types.should.include('mathml');
      types.should.include('latex');
      types.should.include('svg');
      done();
    });
    it('MathML output → rendered HTML contains <math element', (done) => {
      const html = MM.render('$x^2$', {
        outMath: { output_format: 'mathml' }
      });
      html.should.include('<math');
      html.should.include('math-inline');
      done();
    });
    it('LaTeX output → rendered HTML contains latex source text', (done) => {
      const html = MM.render('$x^2$', {
        outMath: { output_format: 'latex' }
      });
      html.should.include('x^');
      html.should.include('math-inline');
      done();
    });
  });
  // ─── Group 7: Edge cases ───────────────────────────────────────────
  describe('Edge cases', () => {
    it('invalid output_format falls through to SVG (default switch case)', (done) => {
      const html = MM.markdownToHTML('$x^2$', {
        outMath: { output_format: 'invalid' }
      });
      html.should.include('mjx-container');
      html.should.include('<svg');
      done();
    });
    it('output_format: "mathml" with \\begin{equation} produces MathML', (done) => {
      const html = MM.markdownToHTML('\\begin{equation}\nx^2\n\\end{equation}', {
        outMath: { output_format: 'mathml' }
      });
      html.should.include('<math');
      html.should.not.include('<svg');
      done();
    });
    it('multiple math expressions in same document each respect output_format', (done) => {
      const html = MM.markdownToHTML('$x^2$ and $y^3$', {
        outMath: { output_format: 'mathml' }
      });
      const mathCount = (html.match(/<math/g) || []).length;
      mathCount.should.be.at.least(2);
      html.should.not.include('<svg');
      done();
    });
    it('malformed LaTeX with output_format: "mathml" does not produce "undefined"', (done) => {
      const html = MM.markdownToHTML('$\\frac{ {$', {
        outMath: { output_format: 'mathml' }
      });
      html.should.not.include('undefined');
      html.should.include('math-inline');
      done();
    });
  });
});
