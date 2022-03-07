//Require the dev-dependencies
let chai = require('chai');
let should = chai.should();


let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;

const options = {outMath: {
    include_asciimath: false,
    include_mathml: false,
    include_latex: false,
    include_svg: false,
    include_tsv: false
  }};



const { JSDOM } = require("jsdom");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

describe('Set: include_table_markdown=true:', () => {
  const tests = require('./_data/_table-markdown/_data');
  tests.forEach(function(test) {
    const options = {
      outMath: {
        include_table_markdown: true,
        include_table_html: false
      }
    };
    describe(`[${test.id}] Latex => ` + test.latex, () => {
      const html = MM.render(test.latex, options);
      const data = MM.parseMarkdownByHTML(html, false);

      it('Should be parser.length = 1', function(done) {
        data.should.have.length(1);
        done();
      });

      it('Should be have type: "table-markdown"', function(done) {
        data[0].should.have.property('type', 'table-markdown');
        // console.log('value>',  data[0].value);
        data[0].should.have.property('value', test.table_markdown);
        done();
      });
    });


  });

});

describe('Set: include_table_markdown=true:, math_as_ascii=true ', () => {
  const tests = require('./_data/_table-markdown/_data');
  tests.forEach(function(test) {
    const options = {
      outMath: {
        include_table_markdown: true,
        include_table_html: false,
        table_markdown: {
          math_as_ascii: true
        }
      }
    };
    describe(`[${test.id}] Latex => ` + test.latex, () => {
      const html = MM.render(test.latex, options);
      const data = MM.parseMarkdownByHTML(html, false);

      it('Should be parser.length = 1', function(done) {
        data.should.have.length(1);
        done();
      });

      it('Should be have type: "table-markdown"', function(done) {
        data[0].should.have.property('type', 'table-markdown');
        // console.log('value>',  data[0].value);
        if (test.table_markdown_math_as_ascii) {
          data[0].should.have.property('value', test.table_markdown_math_as_ascii);
        } else {
          data[0].should.have.property('value', test.table_markdown);
        }
        done();
      });
    });


  });

});
