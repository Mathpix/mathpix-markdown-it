//Require the dev-dependencies
let chai = require('chai');
let should = chai.should();
let MathJax = require('../lib/mathjax/index.js').MathJax;

const options = {outMath: {
    include_asciimath: true,
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

describe('Latex to ascii:', () => {
  describe('Testing same data:', () => {
    const tests = require('./_data/_ascii/_asciiData');
    tests.forEach(function(test) {
      it('Latex =>' + test.latex, function(done) {
        const data = MathJax.TexConvert(test.latex, options);
        console.log('    LATEX         =>', test.latex);
        console.log('    ASCIIMATH     =>', test.ascii);
        console.log('    ASCIIMATH_OLD =>', test.ascii_old);
        data.should.have.property('asciimath', test.ascii);
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
        console.log('    ASCIIMATH     =>', test.ascii);
        if (test.ascii_old) {
          console.log('    ASCIIMATH_OLD =>', test.ascii_old);
        }
        data.should.have.property('asciimath', test.ascii);
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
        console.log('    ASCIIMATH     =>', test.ascii);
        if (test.ascii_old) {
          console.log('    ASCIIMATH_OLD =>', test.ascii_old);
        }
        data.should.have.property('asciimath', test.ascii);
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
        console.log('    ASCIIMATH     =>', test.ascii);
        console.log('    ASCIIMATH_OLD =>', test.ascii_old);
        data.should.have.property('asciimath', test.ascii);
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
        console.log('    ASCIIMATH     =>', test.ascii);
        console.log('    ASCIIMATH_OLD =>', test.ascii_old);
        data.should.have.property('asciimath', test.ascii);
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
        console.log('    ASCIIMATH     =>', test.ascii);
        data.should.have.property('asciimath', test.ascii);
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
        console.log('    ASCIIMATH     =>', test.ascii);
        data.should.have.property('asciimath', test.ascii);
        notIncludeSymbols(data.asciimath);
        done();
      });
    });
  });
  // {
  //   latex: `\\left.\\begin{array}{l}{\\text{foo}} \\\\ { \\theta + C }\\end{array} \\right.`,
  //     ascii: `{:["foo"],[theta+C]:}`,
  //   ascii_old: `{:["foo"],[theta+C]:}`
  // },

  // describe('Latex =>a = b + c', () => {
  //   //tests.forEach(function(test) {
  //     it('Latex =>' + `\\left.\\begin{array}{l}{\\text{foo}} \\\\ { \\theta + C }\\end{array} \\right.`, function(done) {
  //       const data = MathJax.TexConvert(`\\left.\\begin{array}{l}{\\text{foo}} \\\\ { \\theta + C }\\end{array} \\right.`, options);
  //       console.log('    data         =>', data);
  //       console.log('    LATEX         =>', `\\left.\\begin{array}{l}{\\text{foo}} \\\\ { \\theta + C }\\end{array} \\right.`);
  //       console.log('    ASCIIMATH     =>', `{:["foo"],[theta+C]:}`);
  //       console.log('    ASCIIMATH_OLD =>', `{:["foo"],[theta+C]:}`);
  //       data.should.have.property('asciimath', `{:["foo"],[theta+C]:}`);
  //       done();
  //    // });
  //   });
  // });
});
