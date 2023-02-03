//Require the dev-dependencies
let chai = require('chai');
let should = chai.should();
let MathJax = require('../lib/mathjax/index.js').MathJax;

const options = {outMath: {
    include_asciimath: true,
    include_wolfram: true,
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

describe('Latex to wolfram:', () => {
  describe('Testing same data:', () => {
    const tests = require('./_data/_wolfram/_data');
    tests.forEach(function(test) {
      it('Latex =>' + test.latex, function(done) {
        const data = MathJax.TexConvert(test.latex, options);
        console.log('    LATEX         =>', test.latex);
        console.log('    ASCIIMATH     =>', test.ascii);
        console.log('    WOLFRAM =>', test.wolfram);
        data.should.have.property('wolfram', test.wolfram);
        /** If symbol can be unicode */
        if (test.wolfram_u) {
          const data_plain_text = MathJax.TexConvert(test.latex, Object.assign({},options, {
            outMath:{
              include_asciimath: true,
              include_wolfram: true,
              wolfram_options: {
                unicode: true
              }
            }}));
          data_plain_text.should.have.property('wolfram', test.wolfram_u);
        }
        notIncludeSymbols(data.asciimath);
        done();
      });
    });
  });  
  describe('Testing notation for differentiation:', () => {
    const tests = require('./_data/_wolfram/_differentiation');
    tests.forEach(function(test) {
      it('Latex =>' + test.latex, function(done) {
        const data = MathJax.TexConvert(test.latex, options);
        console.log('    LATEX         =>', test.latex);
        console.log('    ASCIIMATH     =>', test.ascii);
        console.log('    WOLFRAM =>', test.wolfram);
        data.should.have.property('wolfram', test.wolfram);
        /** If symbol can be unicode */
        if (test.wolfram_u) {
          const data_plain_text = MathJax.TexConvert(test.latex, Object.assign({},options, {
            outMath:{
              include_asciimath: true,
              include_wolfram: true,
              wolfram_options: {
                unicode: true
              }
            }}));
          data_plain_text.should.have.property('wolfram', test.wolfram_u);
        }
        notIncludeSymbols(data.asciimath);
        done();
      });
    });
  });  
  describe('Testing sum:', () => {
    const tests = require('./_data/_wolfram/_sum');
    tests.forEach(function(test) {
      it('Latex =>' + test.latex, function(done) {
        const data = MathJax.TexConvert(test.latex, options);
        console.log('    LATEX         =>', test.latex);
        console.log('    ASCIIMATH     =>', test.ascii);
        console.log('    WOLFRAM =>', test.wolfram);
        data.should.have.property('wolfram', test.wolfram);
        /** If symbol can be unicode */
        if (test.wolfram_u) {
          const data_plain_text = MathJax.TexConvert(test.latex, Object.assign({},options, {
            outMath:{
              include_asciimath: true,
              include_wolfram: true,
              wolfram_options: {
                unicode: true
              }
            }}));
          data_plain_text.should.have.property('wolfram', test.wolfram_u);
        }
        notIncludeSymbols(data.asciimath);
        done();
      });
    });
  });  
  describe('Testing product:', () => {
    const tests = require('./_data/_wolfram/_product');
    tests.forEach(function(test) {
      it('Latex =>' + test.latex, function(done) {
        const data = MathJax.TexConvert(test.latex, options);
        console.log('    LATEX         =>', test.latex);
        console.log('    ASCIIMATH     =>', test.ascii);
        console.log('    WOLFRAM =>', test.wolfram);
        data.should.have.property('wolfram', test.wolfram);
        /** If symbol can be unicode */
        if (test.wolfram_u) {
          const data_plain_text = MathJax.TexConvert(test.latex, Object.assign({},options, {
            outMath:{
              include_asciimath: true,
              include_wolfram: true,
              wolfram_options: {
                unicode: true
              }
            }}));
          data_plain_text.should.have.property('wolfram', test.wolfram_u);
        }
        notIncludeSymbols(data.asciimath);
        done();
      });
    });
  });  
  describe('Testing Systems of Equations:', () => {
    const tests = require('./_data/_wolfram/_systems-of-equations');
    tests.forEach(function(test) {
      it('Latex =>' + test.latex, function(done) {
        const data = MathJax.TexConvert(test.latex, options);
        console.log('    LATEX         =>', test.latex);
        console.log('    ASCIIMATH     =>', test.ascii);
        console.log('    WOLFRAM =>', test.wolfram);
        data.should.have.property('wolfram', test.wolfram);
        /** If symbol can be unicode */
        if (test.wolfram_u) {
          const data_plain_text = MathJax.TexConvert(test.latex, Object.assign({},options, {
            outMath:{
              include_asciimath: true,
              include_wolfram: true,
              wolfram_options: {
                unicode: true
              }
            }}));
          data_plain_text.should.have.property('wolfram', test.wolfram_u);
        }
        notIncludeSymbols(data.asciimath);
        done();
      });
    });
  });  
  describe('Testing Long Division:', () => {
    const tests = require('./_data/_wolfram/_longDiv');
    tests.forEach(function(test) {
      it('Latex =>' + test.latex, function(done) {
        const data = MathJax.TexConvert(test.latex, options);
        console.log('    LATEX         =>', test.latex);
        console.log('    ASCIIMATH     =>', test.ascii);
        console.log('    WOLFRAM =>', test.wolfram);
        data.should.have.property('wolfram', test.wolfram);
        /** If symbol can be unicode */
        if (test.wolfram_u) {
          const data_plain_text = MathJax.TexConvert(test.latex, Object.assign({},options, {
            outMath:{
              include_asciimath: true,
              include_wolfram: true,
              wolfram_options: {
                unicode: true
              }
            }}));
          data_plain_text.should.have.property('wolfram', test.wolfram_u);
        }
        notIncludeSymbols(data.asciimath);
        done();
      });
    });
  });  
  describe('Testing Integrals:', () => {
    const tests = require('./_data/_wolfram/_integrals');
    tests.forEach(function(test) {
      it('Latex =>' + test.latex, function(done) {
        const data = MathJax.TexConvert(test.latex, options);
        console.log('    LATEX         =>', test.latex);
        console.log('    ASCIIMATH     =>', test.ascii);
        console.log('    WOLFRAM =>', test.wolfram);
        data.should.have.property('wolfram', test.wolfram);
        /** If symbol can be unicode */
        if (test.wolfram_u) {
          const data_plain_text = MathJax.TexConvert(test.latex, Object.assign({},options, {
            outMath:{
              include_asciimath: true,
              include_wolfram: true,
              wolfram_options: {
                unicode: true
              }
            }}));
          data_plain_text.should.have.property('wolfram', test.wolfram_u);
        }
        notIncludeSymbols(data.asciimath);
        done();
      });
    });
  });
});
