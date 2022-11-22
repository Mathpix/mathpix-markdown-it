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


describe('Check mmd table rendering:', () => {
  const tests = require('./_data/_tables/_data');
  tests.forEach(function(test) {
    const html = MM.markdownToHTML(test.latex, options);
    describe('Render mmd table => ' + test.latex, () => {
      it('Checking result html', (done) => {
        html.trim().should.equal(test.html);
        done();
      });
    });
    const html_notCenterTables = MM.markdownToHTML(test.latex,
      Object.assign({}, options, { 
        centerTables: false
      }));
    describe('Render mmd table with centerTables = false => ' + test.latex, () => {
      it('Checking result html', (done) => {
        html_notCenterTables.trim().should.equal(test.html_notCenterTables);
        done();
      });
    });
  });
  MM.texReset();
});
