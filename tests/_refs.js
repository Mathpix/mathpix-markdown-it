let chai = require('chai');
let should = chai.should();

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;
const { getLabelsList } = require('../lib/index');

let options = {
  cwidth: 800
};


const { JSDOM } = require("jsdom");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;


describe('Check \\ref and \\eqref:', () => {
  const tests = require('./_data/_refs/_data');
  tests.forEach((test, index) => {
    const mmdOptions = Object.assign({}, options, test.options);
    const html = MM.markdownToHTML(test.mmd, mmdOptions);
    const labelsList = getLabelsList();
    describe('Options => ' + JSON.stringify(test.options), () => {
      it('Checking result html. (' + index + ')', (done) => {
        html.trim().should.equal(test.html);
        done();
      });
      it('Checking labelsList', (done) => {
        JSON.stringify(labelsList).should.equal(JSON.stringify(test.labels));
        done();
      });
    });
    MM.texReset();
  });
});
