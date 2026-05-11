let chai = require('chai');
let should = chai.should();

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;

const options = {
  cwidth: 800
};


const { JSDOM } = require("jsdom");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;


const runTheoremFixtures = (tests) => {
  tests.forEach(function(test) {
    const html = MM.markdownToHTML(test.latex, options);
    describe('Latex => ' + test.latex, () => {
      it('Checking result html', (done) => {
        html.trim().should.equal(test.html);
        done();
      });
    });
  });
  MM.texReset();
};

describe('Check Theorem environments:', () => {
  runTheoremFixtures(require('./_data/_theorem/_data'));
});

// Pinned-quirk tests: the expected HTML documents pre-existing parser behaviour we'd like to fix one day. See `_data_known_quirks.js` for the full warning.
describe('Pre-existing body-drop quirk for unregistered theorem envs (TO BE FIXED):', () => {
  runTheoremFixtures(require('./_data/_theorem/_data_known_quirks'));
});
