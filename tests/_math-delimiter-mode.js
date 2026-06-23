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
const MarkdownIt = require('markdown-it');
const pluginLatexCodeEnvs = require('../lib/markdown/md-latex-lstlisting-env/index').default;

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
  describe('edge cases:', () => {
    it('prose strict: mixed literal + real math — \\\\(a\\\\) and \\(b\\)', () => {
      const html = MM.markdownToHTML('\\\\(a\\\\) and \\(b\\)', { mathDelimiterMode: 'strict' });
      html.should.include('\\(a\\)');                                 // doubled -> literal
      (html.match(/<mjx-container/g) || []).length.should.equal(1);   // exactly one formula: \(b\)
    });
    it('lst strict: doubled abutting single — \\\\(\\(x\\) keeps \\\\( verbatim, renders \\(x\\)', () => {
      const html = MM.markdownToHTML(lst('\\\\(\\(x\\)'), { mathDelimiterMode: 'strict' });
      html.should.include('mjx-container');   // trailing single \(x\) is math
      html.should.include('\\\\(');           // leading doubled \\( stays verbatim
    });
    it('unknown mathDelimiterMode value is treated as strict (fail-safe)', () => {
      isMath(MM.markdownToHTML('\\\\(x\\\\)', { mathDelimiterMode: 'bogus' })).should.equal(false);
    });
  });
  // cached math-only parser must honor a reused baseMd whose mathDelimiterMode is mutated between parses
  describe('lstlisting mathescape — cached parser honors a reused/mutated baseMd:', () => {
    const lstSrc = lst('\\\\(x\\\\)');
    const itemKind = (md, mode) => {
      md.options.mathDelimiterMode = mode;
      const token = md.parse(lstSrc, {}).find((t) => t.type === 'latex_lstlisting_env');
      return token.children.map((c) => c.type).join('|');
    };
    it('legacy then strict on one instance: math, then literal text', () => {
      const md = new MarkdownIt({ outMath: {} }).use(pluginLatexCodeEnvs);
      itemKind(md, 'legacy').should.equal('inline_math');
      itemKind(md, 'strict').should.equal('text');
    });
    it('strict then legacy on one instance: literal text, then math', () => {
      const md = new MarkdownIt({ outMath: {} }).use(pluginLatexCodeEnvs);
      itemKind(md, 'strict').should.equal('text');
      itemKind(md, 'legacy').should.equal('inline_math');
    });
  });
  MM.texReset();
});
