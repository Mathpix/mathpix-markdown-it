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


describe('Check mmd image rendering:', () => {
  const tests = require('./_data/_image/_data');
  tests.forEach(function(test) {
    const html = MM.markdownToHTML(test.latex, options);
    describe('Render mmd image => ' + test.latex, () => {
      it('Checking result html', (done) => {
        html.trim().should.equal(test.html);
        done();
      });
    });    
    const html_notCenterImages = MM.markdownToHTML(test.latex, 
      Object.assign({}, options, { centerImages: false}));
    describe('Render mmd image with centerImages = false => ' + test.latex, () => {
      it('Checking result html', (done) => {
        html_notCenterImages.trim().should.equal(test.html_notCenterImages);
        done();
      });
    });
  });
  MM.texReset();
});
