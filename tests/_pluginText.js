let chai = require('chai');
let should = chai.should();

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;

const options = {
  htmlTags: true,
  width: 1200,
  isDisableEmojiShortcuts: true,
  typographer: false,
  smiles: {
    fontSize: 18.7,
    theme: 'light'
  }
};


const { JSDOM } = require("jsdom");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

describe('Check pluginText:', () => {
  const tests = require('./_data/_pluginText/_data');
  tests.forEach(function(test) {
    const html = MM.markdownToHTML(test.latex, options);
    describe('Latex => ' + test.latex, () => {
      it('Checking result html', (done) => {
        html.trim().should.equal(test.svg);
        done();
      });
    });
  });
});
