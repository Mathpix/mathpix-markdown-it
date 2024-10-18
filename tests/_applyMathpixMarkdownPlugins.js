let chai = require('chai');
let should = chai.should();

const { applyMathpixMarkdownPlugins } = require('../lib/index');

const options = {
  cwidth: 800,
  htmlTags: true
};

describe('Check applyMathpixMarkdownPlugins:', () => {
  const tests = require('./_data/_applyMathpixMarkdownPlugins/_data');
  tests.forEach(function(test) {
    const md = applyMathpixMarkdownPlugins(options);
    const html = md.render(test.mmd);
    describe('mmd => ' + test.mmd, () => {
      it('Checking result html', (done) => {
        html.trim().should.equal(test.html);
        done();
      });
    });
  });
});
