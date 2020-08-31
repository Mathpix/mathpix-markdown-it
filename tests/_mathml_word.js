let chai = require('chai');
let should = chai.should();
const notIncludeSymbols = require('./_ascii');

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;

const Window = require('window');
const window = new Window();
global.window = window;
global.document = window.document;

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
global.DOMParser = new JSDOM().window.DOMParser;


describe.only('Check mathml_word:', () => {
  const tests = require('./_data/_mathml_word/_data');
  const options = {
    cwidth: 800,
    outMath: {
      // include_asciimath: true,
      // include_mathml: true,
      include_mathml_word: true,
      // include_latex: true,
      include_svg: false,
      // include_tsv: true,
      // include_table_html: true
    }};
  tests.forEach(function(test, index) {
    const html = MM.render(test.latex_input, options);
    const data = MM.parseMarkdownByHTML(html, false);
    console.log('=>data=>', data);
    describe(index + '. [input_latex] => ' + test.latex_input, () => {
      console.log('=>data=>', data);
      // it('Should be length = 4', (done) => {
      //   data.should.have.length(4);
      //   done();
      // });
      it('Should be return mathml_word =>', function(done) {
        data[0].should.have.property('type', 'mathmlword');
        data[0].should.have.property('value', test.mathmlword);
        done();
      });
      // it('Should be return asciimath =>', function(done) {
      //   data[1].should.have.property('type', 'asciimath');
      //   data[1].should.have.property('value', test.asciimath);
      //   notIncludeSymbols(data[1].value);
      //   done();
      // });
      // it('Should be return latex =>', function(done) {
      //   data[2].should.have.property('type', 'latex');
      //   data[2].should.have.property('value', test.latex);
      //   done();
      // });
      // it('Should be return svg =>', function(done) {
      //   data[3].should.have.property('type', 'svg');
      //   const doc = JSDOM.fragment(data[3].value);
      //   doc.firstChild.tagName.should.equal('svg');
      //   done();
      // });
    });
  });
});

// describe('Check u2212 for asciimath:', () => {
//   const options = {
//     outMath: {
//       include_asciimath: true
//     }
//   };
//   const test = `\\[3-x\\]`;
//   const html = MM.render(test, options);
//   const parsed = MM.parseMarkdownByHTML(html, false);
//   describe('input_latex => ' + test, () => {
//     it('Should be return asciimath =>', function(done) {
//       parsed[0].should.have.property('type', 'asciimath');
//       parsed[0].value.charCodeAt(1).should.equal(45);
//       parsed[0].value[1].should.equal('-');
//       notIncludeSymbols(parsed[0].value);
//       done();
//     });
//   });
// });
//
// describe('Test from example:', () => {
//   const latex = String.raw`\begin{tabular}{ l c r }
//                  1 & {$x^1$} & 3 \\
//                  4 & {$y^1$} & 6 \\
//                  7 & {$z^1$} & 9 \\
//                \end{tabular}`;
//   const options = {
//     outMath: {
//       include_asciimath: true,
//       include_mathml: true,
//       include_latex: true,
//       include_svg: true,
//       include_tsv: true,
//       include_table_html: true
//     }
//   };
//   const html = MM.markdownToHTML(latex, options);
//   const parsed = MM.parseMarkdownByHTML(html, false);
//
//   describe('input_latex => ' , () => {
//     it('Should be parser.length = 2', function(done) {
//       parsed.should.have.length(2);
//       done();
//     });
//     it('Should be have type: "html"', function(done) {
//       parsed[0].should.have.property('type', 'html');
//       done();
//     });
//     it('Should be have type: "tsv"', function(done) {
//       parsed[1].should.have.property('type', 'tsv');
//       done();
//     });
//   });
// });

