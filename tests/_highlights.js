let chai = require('chai');
let should = chai.should();

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;

const options = {
  cwidth: 800,
};

const { JSDOM } = require("jsdom");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

describe('Check mmd highlighting:', () => {
  const tests = require('./_data/_highlights/_data');
  tests.forEach(function(test) {
    const html = MM.markdownToHTML(test.content,
      Object.assign({}, options, { highlights: test.highlights}));
    describe('Render mmd highlighting => ' + test.content, () => {
      it('Checking result html', (done) => {
        html.trim().should.equal(test.html);
        done();
      });
    });
  });
  MM.texReset();
});
