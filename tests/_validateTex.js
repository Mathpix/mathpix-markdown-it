let chai = require('chai');
let should = chai.should();

const { MathpixMarkdownModel: MM, TexValidationError } = require('../lib/index');

const options = {
  cwidth: 800
};

const { JSDOM } = require("jsdom");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

describe('validateTex: return value', () => {
  beforeEach(() => MM.texReset());
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
    result.error.message.should.match(/TeX error/i);
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
});

describe('validateTex: package-driven constructs are accepted (render-parity)', () => {
  beforeEach(() => MM.texReset());
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
  beforeEach(() => MM.texReset());
  // Render signals failure by emitting an empty math span (no <svg>).
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
});

describe('validateTex: no side-effects on equation counter', () => {
  beforeEach(() => MM.texReset());
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
  beforeEach(() => MM.texReset());
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
