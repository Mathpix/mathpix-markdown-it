let chai = require('chai');
let should = chai.should();

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;

const { JSDOM } = require("jsdom");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

describe('TSV/CSV with array:', () => {
  let tests = require('./_data/_tsv_with_array/_data');
  const options = {
    outMath: {
      include_tsv: true,
      include_csv: true,
      include_table_html: false,
    }
  };
  tests.forEach((test, index) => {
    describe('Check tsv/csv [include_sub_math=false]. Latex =>' + test.latex, () => {
      const html = MM.render(test.latex, options);
      const data = MM.parseMarkdownByHTML(html, false);
      it('Should be parser.length = 2', (done) => {
        data.should.have.length(2);
        done();
      });
      it('Should be have type: "tsv"', function(done) {
        data[0].should.have.property('type', 'tsv');
        data[0].should.have.property('value', test.tsv);
        done();
      });
      it('Should be have type: "csv"', function(done) {
        data[1].should.have.property('type', 'csv');
        data[1].should.have.property('value', test.csv);
        done();
      });
    });
  });
  tests = require('./_data/_tsv_with_array/_data_gathered_aligned');
  tests.forEach((test, index) => {
    describe('Check tsv/csv with gathered/aligned [include_sub_math=false]. Latex =>' + test.latex, () => {
      const html = MM.render(test.latex, options);
      const data = MM.parseMarkdownByHTML(html, false);
      it('Should be parser.length = 2', (done) => {
        data.should.have.length(2);
        done();
      });
      it('Should be have type: "tsv"', function(done) {
        data[0].should.have.property('type', 'tsv');
        data[0].should.have.property('value', test.tsv);
        done();
      });
      it('Should be have type: "csv"', function (done) {
        data[1].should.have.property('type', 'csv');
        data[1].should.have.property('value', test.csv);
        done();
      });
    });
  });
});

describe('TSV/CSV with array:', () => {
  const tests = require('./_data/_tsv_with_array/_data_include_sub_math');
  tests.forEach((test, index) => {
    const options = {
      outMath: {
        include_tsv: true,
        include_csv: true,
        include_table_markdown: true,
        include_table_html: true,
        include_asciimath: true,
        include_svg: false,
      }
    };
    describe('Check table-markdown [include_sub_math=true]. Latex =>' + test.latex, () => {
      const html = MM.render(test.latex, options);
      const data = MM.parseMarkdownByHTML(html, true);
      it('Should be have type: "html"', function(done) {
        data[0].should.have.property('type', 'html');
        done();
      });      
      it('Should be have type: "tsv"', function(done) {
        data[1].should.have.property('type', 'tsv');
        data[1].should.have.property('value', test.tsv);
        done();
      });
      it('Should be have type: "table-markdown"', function(done) {
        data[2].should.have.property('type', 'table-markdown');
        data[2].should.have.property('value', test.table_markdown);
        done();
      });
      it('Should be have type: "csv"', function (done) {
        data[3].should.have.property('type', 'csv');
        data[3].should.have.property('value', test.csv);
        done();
      });
      if (test.include_sub_math?.length) {
        it('Should be have include_sub_math with asciimath', function(done) {
          const asciimath = data.filter(item => item.type === 'asciimath');
          asciimath.should.have.length(test.include_sub_math.length);
          for (let i = 0; i < test.include_sub_math.length; i++) {
            asciimath[i].should.have.property('value', test.include_sub_math[i].value);
          }
          done();
        });
      }
    });
  });
});
