let chai = require('chai');
let should = chai.should();

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;
const { getLabelsList } = require('../lib/index');

const options = {
  cwidth: 800
};


const { JSDOM } = require("jsdom");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;


describe('Check Theorem environments:', () => {
  const tests = require('./_data/_labels/_data');
  tests.forEach(function(test, index) {
    const html = MM.markdownToHTML(test.latex, options);
    const labelsList = getLabelsList();
    describe('Latex => ' + test.latex, () => {
      it('Checking result html', (done) => {
        html.trim().should.equal(test.html);
        done();
      });      
      it('Checking labelsList', (done) => {
        JSON.stringify(labelsList).should.equal(JSON.stringify(test.labels));
        done();
      });
    });
  });
  MM.texReset();
});
