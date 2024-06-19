let chai = require('chai');
let should = chai.should();
const notIncludeSymbols = require('./_ascii');

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;

const options = {
  cwidth: 800,
  htmlTags: true
};



const { JSDOM } = require("jsdom");
const tests = require("./_data/_svg_chart/_data");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;


describe('SVG. Check rendering svg table:', () => {
  const tests = require('./_data/_svg_table/_data');
  tests.forEach((test, index) => {
    const html = MM.markdownToHTML(test.mmd, options);
    describe('SVG [' + index + ']', () => {
      it('Should be return html =>', (done)=> {
        html.trim().should.equal(test.html.trim());
        done();
      });
    });
  });
});



