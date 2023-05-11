//Require the dev-dependencies
let chai = require('chai');
let should = chai.should();


let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;

const options = {outMath: {
    include_asciimath: false,
    include_mathml: false,
    include_latex: false,
    include_svg: false,
    include_tsv: true,
    include_csv: true,
}};

const { JSDOM } = require("jsdom");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

describe('CSV:', () => {
  const tests = require('./_data/_csv/_data');
  tests.forEach(function(test) {
    const options = {
      outMath: {
        include_tsv: true,
        include_csv: true,
        include_table_html: true
      }
    };
    describe('Set: include_csv=true, include_tsv=true and include_table_html=true. \n Latex => ' + test.latex, () => {
      const html = MM.render(test.latex, options);
      const data = MM.parseMarkdownByHTML(html, false);

      it('Should be parser.length = 3', function(done) {
        data.should.have.length(3);
        done();
      });
      it('Should be have type: "tsv"', function(done) {
        data[1].should.have.property('type', 'tsv');
        data[1].should.have.property('value', test.tsv);
        done();
      });      
      it('Should be have type: "csv"', function(done) {
        data[2].should.have.property('type', 'csv');
        data[2].should.have.property('value', test.csv);
        done();
      });
    });
    describe('To quote all fields whether or not they contain delimiters. \n Latex => ' + test.latex, () => {
      options.outMath.csv_separators = {
        toQuoteAllFields: true
      };
      const html = MM.render(test.latex, options);
      const data = MM.parseMarkdownByHTML(html, false);

      it('Should be parser.length = 3', function(done) {
        data.should.have.length(3);
        done();
      });
      it('Should be have type: "tsv"', function(done) {
        data[1].should.have.property('type', 'tsv');
        data[1].should.have.property('value', test.tsv);
        done();
      });
      it('Should be have type: "csv"', function(done) {
        data[2].should.have.property('type', 'csv');
        data[2].should.have.property('value', test.csvQuoteAllFields);
        done();
      });
    });
  });
});
