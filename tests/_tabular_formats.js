//Require the dev-dependencies
let chai = require('chai');
let should = chai.should();
let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;

const { JSDOM } = require("jsdom");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

describe('Tabular. Check formats:', () => {
  const tests = require('./_data/_tabular_formats/_data');
  tests.forEach(function(test) {
    const options = {
      outMath: {
        include_tsv: true,
        include_csv: true,
        include_table_html: true,
        include_table_markdown: true
      }
    };
    describe('Set: include_csv=true, include_tsv=true, include_table_html=true, include_table_markdown=true \n Latex => ' + test.latex, () => {
      const html = MM.render(test.latex, options);
      const data = MM.parseMarkdownByHTML(html, false);
      it('Should be parser.length = 4', () => {
        data.should.have.length(4);
      });
      it('Should be have type: "tsv"', () => {
        data[1].should.have.property('type', 'tsv');
        // data[1].should.have.property('value', test.tsv);
        if (test.tsv) {
          data[1].should.have.property('value', test.tsv);
        }
      });
      it('Should be have type: "table-markdown"', () => {
        data[2].should.have.property('type', 'table-markdown');
        // data[2].should.have.property('value', test.csv);
        if (test.markdown) {
          data[2].should.have.property('value', test.markdown);
        }
      });
      it('Should be have type: "csv"', () => {
        data[3].should.have.property('type', 'csv');
        // data[3].should.have.property('value', test.csv);
        if (test.csv) {
          data[3].should.have.property('value', test.csv);
        }
      });
    });
  });
});
