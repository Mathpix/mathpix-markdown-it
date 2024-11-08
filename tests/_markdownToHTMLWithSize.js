//markdownToHTMLWithSize
let chai = require('chai');
let should = chai.should();
let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;

const fs = require('fs');
const path = require("path");
const tests = require("./_data/_lists/_data");

const rootDir = path.dirname(__dirname);
const fontDir = path.resolve(rootDir, 'tests/_data/_markdownToHTMLWithSize/fonts');
const arialFontPath = path.join(fontDir, 'Arial.ttf');
const arialBoldFontPath = path.join(fontDir, 'Arial-Bold.ttf');
const fontBuffer = fs.readFileSync(arialFontPath);
const fontBoldBuffer = fs.readFileSync(arialBoldFontPath);
const fontMetricsOptions = {
  font: fontBuffer.buffer,
  fontBold: fontBoldBuffer.buffer,
  fontSize: 25,
  ex: 12.9638671875
  // fontSize: 16,
  // ex: 8.296875
}

const char_size = 16;
const options = {
  typographer: false,
  isDisableFancy: true,
  outMath: {
    include_mathml: false,
    include_asciimath: false,
    include_latex: false,
    include_svg: true,
    include_tsv: false,
    include_table_html: false,
    include_sub_math: false,
    not_catch_errors: true
  },
  smiles: {
    fontSize: char_size
  },
  renderOptions: {
    enable_markdown: false
  }
};

describe('Check the function markdownToHTMLWithSize:', () => {
  const tests = require('./_data/_markdownToHTMLWithSize/_data');
  tests.forEach(function(test) {
    const data = MM.markdownToHTMLWithSize(test.mmd, options, fontMetricsOptions);
    describe('mmd => ' + test.mmd, () => {
      it('Checking results', (done) => {
        data.should.have.property('html');
        data.should.have.property('size');
        data.size.should.have.property('heightEx');
        data.size.should.have.property('widthEx');
        done();
      });
      it('Checking result html', (done) => {
        data.html.trim().should.equal(test.html);
        done();
      });
      it('Checking result size', (done) => {
        data.size.heightEx.should.equal(test.size.heightEx);
        data.size.widthEx.should.equal(test.size.widthEx);
        done();
      });
    });
  });
});

describe('Check the function markdownToHTMLWithSize whit bold font by default:', () => {
  const tests = require('./_data/_markdownToHTMLWithSize/_data_bold');
  tests.forEach(function(test) {
    const data = MM.markdownToHTMLWithSize(test.mmd, options,
      Object.assign({}, {...fontMetricsOptions}, {fontWeight: 'bold'}));
    describe('mmd => ' + test.mmd, () => {
      it('Checking results', (done) => {
        data.should.have.property('html');
        data.should.have.property('size');
        data.size.should.have.property('heightEx');
        data.size.should.have.property('widthEx');
        done();
      });
      it('Checking result html', (done) => {
        data.html.trim().should.equal(test.html);
        done();
      });
      it('Checking result size', (done) => {
        data.size.heightEx.should.equal(test.size.heightEx);
        data.size.widthEx.should.equal(test.size.widthEx);
        done();
      });
    });
  });
});
