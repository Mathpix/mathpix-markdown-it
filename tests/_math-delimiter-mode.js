/**
 * mathDelimiterMode: 'strict' (default) | 'legacy'
 *
 * Governs whether DOUBLE-backslash delimiters `\\( ... \\)` / `\\[ ... \\]` are treated
 * as math. Single-backslash `\( \[` and dollar `$ $$` are unaffected.
 *
 *   strict (default): only single-backslash (and $) are math; `\\(` is NOT math
 *     - prose         : `\\(x\\)` collapses to literal `\(x\)` via the escape rule
 *     - lstlisting code: `\\(x\\)` stays VERBATIM `\\(x\\)` (code is not escape-collapsed)
 *   legacy: also accept `\\( \\[` as math (inherited markdown-it-mathjax behavior)
 */
const chai = require('chai');
const should = chai.should();
const MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;

const { JSDOM } = require('jsdom');
const jsdom = new JSDOM();
globalThis.window = jsdom.window;
globalThis.document = jsdom.window.document;
globalThis.DOMParser = jsdom.window.DOMParser;

// mjx-container wraps both inline and display MathJax output.
const isMath = (html) => html.includes('mjx-container');
const lst = (body) => '\\begin{lstlisting}[mathescape=true]\n' + body + '\n\\end{lstlisting}';

describe('mathDelimiterMode — math vs literal across modes:', () => {
  // [label, mmd, expectMathStrict, expectMathLegacy]
  const cases = [
    // --- prose (main parser) ---
    ['prose: single \\(x\\)',     '\\(x\\)',                 true,  true],
    ['prose: double \\\\(x\\\\)', '\\\\(x\\\\)',             false, true],
    ['prose: single \\[x\\]',     '\\[x\\]',                 true,  true],
    ['prose: double \\\\[x\\\\]', '\\\\[x\\\\]',             false, true],
    ['prose: dollar $x$',         '$x$',                     true,  true],
    ['prose: dollar $$x$$',       '$$x$$',                   true,  true],
    // --- lstlisting[mathescape] (verbatim code) ---
    ['lst: single \\(x\\)',       lst('a \\(x\\) b'),        true,  true],
    ['lst: double \\\\(x\\\\)',   lst('a \\\\(x\\\\) b'),    false, true],
    ['lst: double \\\\[x\\\\]',   lst('a \\\\[x\\\\] b'),    false, true],
    ['lst: dollar $x$',           lst('a $x$ b'),            true,  true],
  ];
  cases.forEach(([label, mmd, mathStrict, mathLegacy]) => {
    describe(label, () => {
      it('strict → math=' + mathStrict, () => {
        isMath(MM.markdownToHTML(mmd, { mathDelimiterMode: 'strict' })).should.equal(mathStrict);
      });
      it('legacy → math=' + mathLegacy, () => {
        isMath(MM.markdownToHTML(mmd, { mathDelimiterMode: 'legacy' })).should.equal(mathLegacy);
      });
      it('default (no option) === strict → math=' + mathStrict, () => {
        isMath(MM.markdownToHTML(mmd, {})).should.equal(mathStrict);
      });
    });
  });
  describe('strict — literal preservation:', () => {
    it('prose: \\\\(x\\\\) collapses to literal \\(x\\) (escape rule)', () => {
      MM.markdownToHTML('\\\\(x\\\\)', { mathDelimiterMode: 'strict' }).should.include('\\(x\\)');
    });
    it('prose: \\\\[x\\\\] collapses to literal \\[x\\]', () => {
      MM.markdownToHTML('\\\\[x\\\\]', { mathDelimiterMode: 'strict' }).should.include('\\[x\\]');
    });
    it('lst: \\\\(x^2\\\\) stays VERBATIM \\\\(x^2\\\\) (code, no escape collapse)', () => {
      MM.markdownToHTML(lst('sum \\\\(x^2\\\\) end'), { mathDelimiterMode: 'strict' }).should.include('\\\\(x^2\\\\)');
    });
    it('lst: \\\\[x\\\\] stays VERBATIM \\\\[x\\\\]', () => {
      MM.markdownToHTML(lst('a \\\\[x\\\\] b'), { mathDelimiterMode: 'strict' }).should.include('\\\\[x\\\\]');
    });
  });
  describe('legacy — doubled renders identical content to single:', () => {
    it('\\\\(x\\\\) legacy produces the same math as single \\(x\\)', () => {
      const single = MM.markdownToHTML('\\(x\\)', {});
      const legacy = MM.markdownToHTML('\\\\(x\\\\)', { mathDelimiterMode: 'legacy' });
      isMath(single).should.equal(true);
      isMath(legacy).should.equal(true);
    });
  });
  MM.texReset();
});
