//Require the dev-dependencies
let chai = require('chai');
const expect  = require('chai').expect;
let should = chai.should();
let MathJax = require('../lib/mathjax/index.js').MathJax;
// const bigText = require('./_data');
//const textList = require('./_textList');

//hai.use(chaiHttp);

const tests = require('./_asciiData');

const options = {outMath: {
    include_asciimath: true,
    include_mathml: false,
    include_latex: false,
    include_svg: false
  }};


describe('Latex to ascii:', () => {
  describe('Latex =>a = b + c', () => {
    tests.forEach(function(test) {
      it('Latex =>' + test.latex, function(done) {
        const data = MathJax.TexConvert(test.latex, options);
        console.log('    ASCIIMATH =>', test.ascii);
        console.log('    ASCIIMATH_OLD =>', test.ascii_old);
        data.should.have.property('asciimath', test.ascii);
        done();
      });
    });
  });
});
