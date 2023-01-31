let chai = require('chai');
let should = chai.should();

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;

const { JSDOM } = require("jsdom");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

describe('TSV with array:', () => {
  const tests = require('./_data/_tsv_with_array/_data');
  const options = {
    outMath: {
      include_tsv: true,
      include_table_html: false,
    }
  };
  tests.forEach((test, index) => {
    describe('Check tsv [include_sub_math=false]. Latex =>' + test.latex, () => {
      const html = MM.render(test.latex, options);
      const data = MM.parseMarkdownByHTML(html, false);
      it('Should be parser.length = 1', (done) => {
        data.should.have.length(1);
        done();
      });
      it('Should be have type: "tsv"', function(done) {
        data[0].should.have.property('type', 'tsv');
        data[0].should.have.property('value', test.tsv);
        done();
      });
    });
  })
});
