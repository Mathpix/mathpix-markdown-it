let chai = require('chai');
chai.should();

const { MathpixMarkdownModel: MM, TexValidationError } = require('../lib/index');
// Internal MathJax export — used by drift detector + binary-verdict parity test; not a stable public surface.
const { MathJax: MJ } = require('../lib/mathjax/index');
// mathjax-full internals (AllPackages already loaded via lib import).
const TexErrorMod = require('mathjax-full/js/input/tex/TexError.js');
const TexError = TexErrorMod.default || TexErrorMod;
const TexMod = require('mathjax-full/js/input/tex.js');
const TeX = TexMod.TeX || TexMod.default || TexMod;
const TexParserMod = require('mathjax-full/js/input/tex/TexParser.js');
const TexParser = TexParserMod.default || TexParserMod;

const options = {
  cwidth: 800
};

const { JSDOM } = require("jsdom");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

const resetAll = () => { MM.texReset(); MM.resetValidateTex(); };

describe('validateTex: return value', () => {
  beforeEach(resetAll);
  it('returns valid:true for a valid inline formula', (done) => {
    const result = MM.validateTex('\\frac{1}{2}', { display: false });
    result.valid.should.be.true;
    done();
  });
  it('returns valid:true for a valid display formula', (done) => {
    const result = MM.validateTex('\\frac{a}{b} + \\sqrt{x^2 + y^2}');
    result.valid.should.be.true;
    done();
  });
  it('returns valid:true for a valid environment', (done) => {
    const result = MM.validateTex('\\begin{equation} x = 1 \\end{equation}');
    result.valid.should.be.true;
    done();
  });
  it('returns valid:false with TexValidationError for an unmatched brace', (done) => {
    const result = MM.validateTex('\\frac{1}{2');
    result.valid.should.be.false;
    result.error.should.be.an.instanceof(TexValidationError);
    result.error.message.should.match(/missing|brace/i);
    result.error.latex.should.equal('\\frac{1}{2');
    done();
  });
  it('returns code "UndefinedControlSequence" for an unknown macro', (done) => {
    const result = MM.validateTex('\\nosuchmacro{x}');
    result.valid.should.be.false;
    result.error.should.be.an.instanceof(TexValidationError);
    result.error.code.should.equal('UndefinedControlSequence');
    result.error.message.should.match(/undefined control sequence/i);
    done();
  });
  it('returns code "MissingArgFor" for a macro with too few arguments', (done) => {
    const result = MM.validateTex('\\frac{1}');
    result.valid.should.be.false;
    result.error.should.be.an.instanceof(TexValidationError);
    result.error.code.should.equal('MissingArgFor');
    result.error.message.should.match(/missing argument/i);
    done();
  });
  it('returns code "UnknownEnv" for an unknown environment', (done) => {
    const result = MM.validateTex('\\begin{nosuchenv} x \\end{nosuchenv}');
    result.valid.should.be.false;
    result.error.should.be.an.instanceof(TexValidationError);
    result.error.code.should.equal('UnknownEnv');
    done();
  });
  it('returns code "ExtraLeftMissingRight" for an unclosed \\left', (done) => {
    const result = MM.validateTex('\\left( x');
    result.valid.should.be.false;
    result.error.should.be.an.instanceof(TexValidationError);
    result.error.code.should.equal('ExtraLeftMissingRight');
    done();
  });
  it('returns valid:false for an unclosed environment', (done) => {
    const result = MM.validateTex('\\begin{equation} x = 1');
    result.valid.should.be.false;
    result.error.should.be.an.instanceof(TexValidationError);
    done();
  });
  it('accepts an empty string', (done) => {
    MM.validateTex('').valid.should.be.true;
    done();
  });
  it('accepts a whitespace-only string', (done) => {
    MM.validateTex('   ').valid.should.be.true;
    done();
  });
  it('does not throw when options is null', () => {
    MM.validateTex('x', null).valid.should.equal(true);
  });
  it('does not throw when options is undefined', () => {
    MM.validateTex('x', undefined).valid.should.equal(true);
  });
  it('returns code "InvalidInput" for null latex', () => {
    const r = MM.validateTex(null);
    r.valid.should.equal(false);
    r.error.code.should.equal('InvalidInput');
  });
  it('returns code "InvalidInput" for undefined latex', () => {
    const r = MM.validateTex(undefined);
    r.valid.should.equal(false);
    r.error.code.should.equal('InvalidInput');
  });
  it('returns code "InvalidInput" for a non-string latex (number)', () => {
    const r = MM.validateTex(42);
    r.valid.should.equal(false);
    r.error.code.should.equal('InvalidInput');
  });
  it('handles a non-string latex whose Symbol.toPrimitive throws', () => {
    const evil = { [Symbol.toPrimitive]: () => { throw new Error('bad'); } };
    const r = MM.validateTex(evil);
    r.valid.should.equal(false);
    r.error.code.should.equal('InvalidInput');
    r.error.latex.should.equal('[unstringifiable]');
  });
});

describe('validateTex: isolated option drops accumulated packageData:', () => {
  beforeEach(resetAll);
  it('isolated:true forgets a macro defined in an earlier call', () => {
    MM.validateTex('\\newcommand{\\zzzIsolateTest}{X}');
    MM.validateTex('\\zzzIsolateTest').valid.should.equal(true);
    MM.validateTex('\\zzzIsolateTest', { isolated: true }).valid.should.equal(false);
  });
});

describe('validateTex: MathJax internals sanity (drift detector):', () => {
  beforeEach(resetAll);
  it('TexError carries the .id field used for error.code', () => {
    const e = new TexError('SampleId', 'msg');
    chai.expect(e.id).to.equal('SampleId');
  });
  it('parseOptions exposes clear() and tags.{reset, startEquation} on a fresh MathJax TeX instance', () => {
    const tex = new TeX({ packages: ['base'], tags: 'none' });
    chai.expect(tex.parseOptions.clear).to.be.a('function');
    chai.expect(tex.parseOptions.tags.reset).to.be.a('function');
    chai.expect(tex.parseOptions.tags.startEquation).to.be.a('function');
  });
});

describe('validateTex: binary verdict parity with MJ.TexConvert(throwError=true):', () => {
  beforeEach(resetAll);
  // MTeX.formatError wraps TexError in the render path, losing .id — only binary parity is checkable here.
  ['\\nosuchmacro', '\\frac{1}', '\\left( x'].forEach((latex) => {
    it(`both paths flag invalid for ${latex}`, () => {
      MM.validateTex(latex).valid.should.equal(false);
      let threw = false;
      try { MJ.TexConvert(latex, {}, true); } catch (_) { threw = true; }
      threw.should.equal(true);
    });
  });
});

describe('validateTex: package-driven constructs are accepted (render-parity)', () => {
  beforeEach(resetAll);
  it('accepts \\color{red}{x}', (done) => {
    MM.validateTex('\\color{red}{x}').valid.should.be.true;
    done();
  });
  it('accepts \\textcolor{red}{x}', (done) => {
    MM.validateTex('\\textcolor{red}{x}').valid.should.be.true;
    done();
  });
  it('accepts \\definecolor + \\color in one formula', (done) => {
    MM.validateTex('\\definecolor{c1}{rgb}{0.1,0.2,0.3} \\color{c1}{x}').valid.should.be.true;
    done();
  });
  it('accepts \\ce{H2O} (mhchem)', (done) => {
    MM.validateTex('\\ce{H2O}').valid.should.be.true;
    done();
  });
  it('accepts \\boldsymbol{x} and \\cancel{x}', (done) => {
    MM.validateTex('\\boldsymbol{x}').valid.should.be.true;
    MM.validateTex('\\cancel{x}').valid.should.be.true;
    done();
  });
});

describe('validateTex: verdict parity with render path', () => {
  beforeEach(resetAll);
  // MTeX.formatError throws (mathjax.ts), so failure produces empty span — no merror; <svg> presence is the signal.
  it('both validateTex and markdownToHTML flag an unmatched brace', (done) => {
    const latex = '\\frac{1}{2';
    MM.validateTex(latex).valid.should.be.false;
    MM.markdownToHTML('$' + latex + '$', options).should.not.match(/<svg/);
    done();
  });
  it('both validateTex and markdownToHTML flag an unknown control sequence', (done) => {
    const latex = '\\nosuchmacro{x}';
    MM.validateTex(latex).valid.should.be.false;
    MM.markdownToHTML('$' + latex + '$', options).should.not.match(/<svg/);
    done();
  });
  it('both accept a valid formula', (done) => {
    const latex = '\\frac{a}{b}';
    MM.validateTex(latex).valid.should.be.true;
    MM.markdownToHTML('$' + latex + '$', options).should.match(/<svg/);
    done();
  });
  // Parameterized parity sweep: validate vs render must agree; invalid cases also pin error.code.
  const parityCases = [
    { latex: '\\sqrt{x}',                expected: true                                       },
    { latex: '\\sqrt',                   expected: false, code: 'MissingArgFor'               },
    { latex: '\\frac',                   expected: false, code: 'MissingArgFor'               },
    { latex: '\\left( x',                expected: false, code: 'ExtraLeftMissingRight'       },
    { latex: '\\begin{matrix} a',        expected: false, code: 'EnvMissingEnd'               },
    { latex: '\\overset',                expected: false, code: 'MissingArgFor'               },
    { latex: '\\nosuchcommand',          expected: false, code: 'UndefinedControlSequence'    },
    { latex: '\\sum_{i=0}^n a_i',        expected: true                                       },
    { latex: '\\binom{n}{k}',            expected: true                                       },
    { latex: '\\ce{H2O}',                expected: true                                       },
    { latex: '\\color{red}{x}',          expected: true                                       },
  ];
  parityCases.forEach(({ latex, expected, code }) => {
    it(`parity (${expected ? 'valid' : 'invalid'}): ${latex}`, () => {
      const result = MM.validateTex(latex);
      const r = /<svg/.test(MM.markdownToHTML('$' + latex + '$', options));
      result.valid.should.equal(expected);
      r.should.equal(expected);
      if (!expected) result.error.code.should.equal(code);
    });
  });
});

describe('validateTex: display: false behavior in the current MathJax config:', () => {
  beforeEach(resetAll);
  // tags:'none' → display-only constructs are accepted in inline mode too; option kept for forward-compat.
  ['\\tag{1} x', '\\begin{equation} x \\end{equation}', '\\begin{align} a &= b \\end{align}'].forEach((latex) => {
    it(`display:false accepts ${latex}`, () => {
      MM.validateTex(latex, { display: false }).valid.should.equal(true);
    });
  });
});

describe('validateTex: cold-start and contract smoke:', () => {
  beforeEach(resetAll);
  it('does not throw on a trivial valid formula immediately after texReset', () => {
    MM.texReset();
    MM.validateTex('x').valid.should.equal(true);
  });
  it('error.code on a real failure is one of the documented values', () => {
    const r = MM.validateTex('\\nosuchmacro');
    r.valid.should.equal(false);
    ['UndefinedControlSequence', 'MissingArgFor', 'InternalError', 'InvalidInput', 'TexError'].should.include(r.error.code);
  });
});

// Isolated describe — monkey-patch can't leak past this block under .only / parallel runners.
describe('validateTex: non-TexError wrapping (isolated monkey-patch):', () => {
  beforeEach(resetAll);
  const origMml = TexParser.prototype.mml;
  afterEach(() => { TexParser.prototype.mml = origMml; });
  it('non-TexError exception is wrapped with code "InternalError"', () => {
    TexParser.prototype.mml = function () { throw new Error('mock non-TexError'); };
    const r = MM.validateTex('x');
    r.valid.should.equal(false);
    r.error.code.should.equal('InternalError');
    r.error.message.should.equal('mock non-TexError');
  });
  it('null MML root is wrapped with code "InternalError"', () => {
    TexParser.prototype.mml = function () { return null; };
    const r = MM.validateTex('x');
    r.valid.should.equal(false);
    r.error.code.should.equal('InternalError');
    r.error.message.should.equal('parser produced no MML root');
  });
  it('TexError without an .id falls back to code "TexError"', () => {
    TexParser.prototype.mml = function () {
      const err = new TexError('placeholder', 'no id');
      delete err.id;
      throw err;
    };
    const r = MM.validateTex('x');
    r.valid.should.equal(false);
    r.error.code.should.equal('TexError');
  });
});

describe('validateTex: setHandler invalidation via changeHandler:', () => {
  beforeEach(() => {
    // Force accessibility ON so the toggle in the test deterministically triggers changeHandler.
    MJ.checkAccessibility('default');
    resetAll();
  });
  afterEach(() => { MJ.checkAccessibility('default'); });
  it('changeHandler drops the validator just like resetValidateTex', () => {
    MM.validateTex('\\newcommand{\\zzzHandlerTest}{X}');
    MM.validateTex('\\zzzHandlerTest').valid.should.equal(true);
    MJ.checkAccessibility(null); // accessibility ON → OFF triggers changeHandler
    MM.validateTex('\\zzzHandlerTest').valid.should.equal(false);
  });
});

describe('validateTex: package state persistence and render-pipeline isolation:', () => {
  beforeEach(resetAll);
  // Macro names use a `zzz` prefix to avoid collision; LaTeX command names accept only letters.
  it('\\newcommand registered in one validateTex call is visible to the next', () => {
    MM.validateTex('\\newcommand{\\zzzPersistA}{42} \\zzzPersistA').valid.should.equal(true);
    MM.validateTex('\\zzzPersistA').valid.should.equal(true);
    MM.validateTex('\\zzzNeverDefined').valid.should.equal(false);
  });
  it('validateTex does not see macros registered by markdownToHTML', () => {
    // First confirm the macro is actually registered in the render path — true isolation, not "never registered".
    MM.markdownToHTML('$\\newcommand{\\zzzRenderOnly}{Y} \\zzzRenderOnly$', options);
    MM.markdownToHTML('$\\zzzRenderOnly$', options).should.match(/<svg/);
    MM.validateTex('\\zzzRenderOnly').valid.should.equal(false);
  });
  it('markdownToHTML does not see macros registered by validateTex', () => {
    MM.validateTex('\\newcommand{\\zzzValidateOnly}{X}');
    MM.markdownToHTML('$\\zzzValidateOnly$', options).should.not.match(/<svg/);
  });
  it('resetValidateTex() drops accumulated packageData', () => {
    MM.validateTex('\\newcommand{\\zzzResetMe}{X}');
    MM.validateTex('\\zzzResetMe').valid.should.equal(true);
    MM.resetValidateTex();
    MM.validateTex('\\zzzResetMe').valid.should.equal(false);
  });
});

describe('validateTex: parity on edge MML shapes (post-filter coverage)', () => {
  beforeEach(resetAll);
  // Exercises post-filters; verifies validateTex stays aligned with render path.
  const edgeCases = [
    'x_i^j + \\sum_{i=0}^n a_i',
    '\\left( \\frac{a}{b} \\right)',
    '\\overline{\\overline{x}}',
    'a \\stackrel{!}{=} b',
    '\\binom{n}{k}',
    '\\sqrt[3]{x}',
    '\\int_0^\\infty e^{-x} dx',
    '\\begin{matrix} a & b \\\\ c & d \\end{matrix}',
  ];
  edgeCases.forEach((latex) => {
    it(`valid: ${latex}`, () => {
      MM.validateTex(latex).valid.should.equal(true);
      MM.markdownToHTML('$' + latex + '$', options).should.match(/<svg/);
    });
  });
});

describe('validateTex: no side-effects on equation counter', () => {
  beforeEach(resetAll);
  it('does not advance getLastEquationNumber on a valid auto-numbered equation', (done) => {
    const before = MM.getLastEquationNumber();
    MM.validateTex('\\begin{equation} x = 1 \\end{equation}');
    const after = MM.getLastEquationNumber();
    after.should.equal(before);
    done();
  });
  it('does not advance getLastEquationNumber on an invalid formula', (done) => {
    const before = MM.getLastEquationNumber();
    MM.validateTex('\\frac{1}{');
    const after = MM.getLastEquationNumber();
    after.should.equal(before);
    done();
  });
  it('does not advance getLastEquationNumber across many validateTex calls', (done) => {
    const before = MM.getLastEquationNumber();
    for (let i = 0; i < 10; i++) {
      MM.validateTex('\\begin{equation} y = ' + i + ' \\end{equation}');
    }
    const after = MM.getLastEquationNumber();
    after.should.equal(before);
    done();
  });
  it('does not interfere with real subsequent rendering of numbered equations', (done) => {
    MM.texReset();
    const htmlBaseline = MM.markdownToHTML(
      '$$\\begin{equation} a = 1 \\end{equation}$$\n\n$$\\begin{equation} b = 2 \\end{equation}$$',
      options
    );
    MM.texReset();
    MM.validateTex('\\begin{equation} junk = 0 \\end{equation}');
    MM.validateTex('\\begin{equation} junk2 = 0 \\end{equation}');
    const htmlAfterValidation = MM.markdownToHTML(
      '$$\\begin{equation} a = 1 \\end{equation}$$\n\n$$\\begin{equation} b = 2 \\end{equation}$$',
      options
    );
    htmlAfterValidation.should.equal(htmlBaseline);
    done();
  });
});

describe('validateTex: no side-effects on labels/ids', () => {
  beforeEach(resetAll);
  it('produces identical rendered HTML when a \\label is validated then rendered for real', (done) => {
    MM.texReset();
    const htmlBaseline = MM.markdownToHTML(
      '$$\\begin{equation}\\label{eq:a} a = 1 \\end{equation}$$\n\n$$\\eqref{eq:a}$$',
      options
    );
    MM.texReset();
    MM.validateTex('\\begin{equation}\\label{eq:a} a = 1 \\end{equation}');
    const htmlAfterValidation = MM.markdownToHTML(
      '$$\\begin{equation}\\label{eq:a} a = 1 \\end{equation}$$\n\n$$\\eqref{eq:a}$$',
      options
    );
    htmlAfterValidation.should.equal(htmlBaseline);
    done();
  });
  it('does not cause "duplicate label" failures when same label is validated twice', (done) => {
    MM.texReset();
    MM.validateTex('\\begin{equation}\\label{eq:dup} x \\end{equation}');
    const result = MM.validateTex('\\begin{equation}\\label{eq:dup} x \\end{equation}');
    result.valid.should.be.true;
    done();
  });
});

describe('validateTex: validation does not leak state between independent renders', () => {
  beforeEach(resetAll);
  it('a sequence of renders produces the same output whether or not validateTex is interleaved', (done) => {
    MM.texReset();
    const renderA = MM.markdownToHTML('$$\\begin{equation} p = 1 \\end{equation}$$', options);
    const renderB = MM.markdownToHTML('$$\\begin{equation} q = 2 \\end{equation}$$', options);
    MM.texReset();
    const renderA2 = MM.markdownToHTML('$$\\begin{equation} p = 1 \\end{equation}$$', options);
    MM.validateTex('\\begin{equation} junk = 99 \\end{equation}');
    MM.validateTex('\\frac{1}{');
    MM.validateTex('\\begin{equation}\\label{eq:junk} z \\end{equation}');
    const renderB2 = MM.markdownToHTML('$$\\begin{equation} q = 2 \\end{equation}$$', options);
    renderA2.should.equal(renderA);
    renderB2.should.equal(renderB);
    done();
  });
  after(() => MM.texReset());
});
