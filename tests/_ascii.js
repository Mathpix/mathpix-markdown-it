//Require the dev-dependencies
let chai = require('chai');
let should = chai.should();
let MathJax = require('../lib/mathjax/index.js').MathJax;

const options = {outMath: {
    include_asciimath: true,
    include_linearmath: true,
    include_mathml: false,
    include_latex: false,
    include_svg: false
  }};

const notIncludeSymbols = (asciimath) => {
  asciimath.should
    .not.include('&lt;')
    .not.include('&gt;')
    .not.include('&amp;')
    .not.include('&nbsp;')
    .not.include('\u00A0')
    .not.include('\u2212')
    .not.include('\u2061');
};

module.exports = notIncludeSymbols;

describe('Latex to asciimath and linearmath formats:', () => {
  describe('Testing same data:', () => {
    const tests = require('./_data/_ascii/_asciiData');
    tests.forEach(function(test) {
      it('Latex =>' + test.latex, function(done) {
        const data = MathJax.TexConvert(test.latex, options);
        console.log('    LATEX         =>', test.latex);
        console.log('    ASCIIMATH     =>', test.asciimath);
        console.log('    ASCIIMATH_OLD =>', test.asciimath_old);
        console.log('    LINEARMATH    =>', test.linearmath);
        data.should.have.property('asciimath', test.asciimath);
        data.should.have.property('linearmath', test.linearmath);
        notIncludeSymbols(data.asciimath);
        done();
      });
    });
  });
  describe('Testing longDiv:', () => {
    const tests = require('./_data/_ascii/_asciiLongDiv');
    tests.forEach(function(test) {
      it('Latex =>' + test.latex, function(done) {
        const data = MathJax.TexConvert(test.latex, options);
        console.log('    LATEX         =>', test.latex);
        console.log('    ASCIIMATH     =>', test.asciimath);
        console.log('    LINEARMATH    =>', test.linearmath);
        if (test.asciimath_old) {
          console.log('    ASCIIMATH_OLD =>', test.asciimath_old);
        }
        data.should.have.property('asciimath', test.asciimath);
        data.should.have.property('linearmath', test.linearmath);
        notIncludeSymbols(data.asciimath);
        done();
      });
    });
  });
  describe('Testing lcm:', () => {
    const tests = require('./_data/_ascii/_ascii_lcm');
    tests.forEach(function(test) {
      it('Latex =>' + test.latex, function(done) {
        const data = MathJax.TexConvert(test.latex, options);
        console.log('    LATEX         =>', test.latex);
        console.log('    ASCIIMATH     =>', test.asciimath);
        console.log('    LINEARMATH    =>', test.linearmath);
        if (test.asciimath_old) {
          console.log('    ASCIIMATH_OLD =>', test.asciimath_old);
        }
        data.should.have.property('asciimath', test.asciimath);
        data.should.have.property('linearmath', test.linearmath);
        notIncludeSymbols(data.asciimath);
        done();
      });
    });
  });
  describe('Testing Times:', () => {
    const tests = require('./_data/_ascii/_asciiTimes');
    tests.forEach(function(test) {
      it('Latex =>' + test.latex, function(done) {
        const data = MathJax.TexConvert(test.latex, options);
        console.log('    LATEX         =>', test.latex);
        console.log('    ASCIIMATH     =>', test.asciimath);
        console.log('    ASCIIMATH_OLD =>', test.asciimath_old);
        console.log('    LINEARMATH    =>', test.linearmath);
        data.should.have.property('asciimath', test.asciimath);
        data.should.have.property('linearmath', test.linearmath);
        notIncludeSymbols(data.asciimath);
        done();
      });
    });
  });
  describe('Testing Space:', () => {
    const tests = require('./_data/_ascii/_asciiSpace');
    tests.forEach(function(test) {
      it('Latex =>' + test.latex, function(done) {
        const data = MathJax.TexConvert(test.latex, options);
        console.log('    LATEX         =>', test.latex);
        console.log('    ASCIIMATH     =>', test.asciimath);
        console.log('    ASCIIMATH_OLD =>', test.asciimath_old);
        console.log('    LINEARMATH    =>', test.linearmath);
        data.should.have.property('asciimath', test.asciimath);
        data.should.have.property('linearmath', test.linearmath);
        notIncludeSymbols(data.asciimath);
        done();
      });
    });
  });
  describe('Testing Operation symbols:', () => {
    const tests = require('./_data/_ascii/_asciiOperationSymbols');
    tests.forEach(function(test) {
      it('Latex =>' + test.latex, function(done) {
        const data = MathJax.TexConvert(test.latex, options);
        console.log('    LATEX         =>', test.latex);
        console.log('    ASCIIMATH     =>', test.asciimath);
        console.log('    LINEARMATH    =>', test.linearmath);
        data.should.have.property('asciimath', test.asciimath);
        data.should.have.property('linearmath', test.linearmath);
        notIncludeSymbols(data.asciimath);
        done();
      });
    });
  });
  describe('Testing More equation:', () => {
    const tests = require('./_data/_ascii/_asciiMore');
    tests.forEach(function(test) {
      it('Latex =>' + test.latex, function(done) {
        const data = MathJax.TexConvert(test.latex, options);
        console.log('    LATEX         =>', test.latex);
        console.log('    ASCIIMATH     =>', test.asciimath);
        console.log('    LINEARMATH    =>', test.linearmath);
        data.should.have.property('asciimath', test.asciimath);
        data.should.have.property('linearmath', test.linearmath);
        notIncludeSymbols(data.asciimath);
        done();
      });
    });
  });
  describe('Testing vertical math:', () => {
    const tests = require('./_data/_ascii/_ascii_vertical_math');
    tests.forEach(function(test) {
      if (test.latex) {
        it('Latex =>' + test.latex, function(done) {
          const data = MathJax.TexConvert(test.latex, options);
          console.log('    LATEX         =>', test.latex);
          console.log('    ASCIIMATH     =>', test.asciimath);
          console.log('    LINEARMATH    =>', test.linearmath);
          data.should.have.property('asciimath', test.asciimath);
          data.should.have.property('linearmath', test.linearmath);
          notIncludeSymbols(data.asciimath);
          done();
        });
      }
    });
  });
  describe('Testing any function with a fractional argument:', () => {
    const tests = require('./_data/_ascii/_ascii_frac');
    tests.forEach(function(test) {
      if (test.latex) {
        it('Latex =>' + test.latex, function(done) {
          const data = MathJax.TexConvert(test.latex, options);
          console.log('    LATEX         =>', test.latex);
          console.log('    ASCIIMATH     =>', test.asciimath);
          console.log('    LINEARMATH    =>', test.linearmath);
          data.should.have.property('asciimath', test.asciimath);
          data.should.have.property('linearmath', test.linearmath);
          notIncludeSymbols(data.asciimath);
          done();
        });
      }
    });
  });
  describe('Testing any sup with wedge:', () => {
    const tests = require('./_data/_ascii/_ascii_sup_with_wedge');
    tests.forEach(function(test) {
      if (test.latex) {
        it('Latex =>' + test.latex, function(done) {
          const data = MathJax.TexConvert(test.latex, options);
          console.log('    LATEX         =>', test.latex);
          console.log('    ASCIIMATH     =>', test.asciimath);
          console.log('    LINEARMATH    =>', test.linearmath);
          data.should.have.property('asciimath', test.asciimath);
          notIncludeSymbols(data.asciimath);
          data.should.have.property('linearmath', test.linearmath);
          done();
        });
      }
    });
  });
  describe('Testing linearmath:', () => {
    const tests = require('./_data/_ascii/_ascii_liner');
    tests.forEach(function(test) {
      if (test.latex) {
        it('Latex =>' + test.latex, function(done) {
          const data = MathJax.TexConvert(test.latex, options);
          console.log('    LATEX         =>', test.latex);
          console.log('    ASCIIMATH     =>', test.asciimath);
          console.log('    LINEARMATH    =>', test.linearmath);
          data.should.have.property('asciimath', test.asciimath);
          notIncludeSymbols(data.asciimath);
          data.should.have.property('linearmath', test.linearmath);
          done();
        });
      }
    });
  });
});
