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


describe('Check Footnotes:', () => {
  const mmdContent = require('./_data/_footnotes/_mmd');
  const htmlContent = require('./_data/_footnotes/_html');
  const html = MM.markdownToHTML(mmdContent, options);
  it('Checking result html', (done) => {
    html.trim().should.equal(htmlContent);
    done();
  });
  MM.texReset();
});
