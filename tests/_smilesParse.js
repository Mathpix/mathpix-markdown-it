let chai = require('chai');
let should = chai.should();
const notIncludeSymbols = require('./_ascii');

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;


const { JSDOM } = require("jsdom");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;


describe('Check parse Smiles inline:', () => {
  const tests = require('./_data/_smilesParse/_data');
  const options = {
    cwidth: 800,
    outMath: {
      include_smiles: true,
      include_svg: false,
    }};
  tests.forEach(function(item, index) {
    const smilesInline = `<smiles>${item}</smiles>`;

    const html = MM.render(smilesInline, options);
    const data = MM.parseMarkdownByHTML(html, false);
    describe((index + 1) + '. [input_smiles] => ' + item, () => {
      it('Should be length = 1', (done) => {
        data.should.have.length(1);
        done();
      });
      it('Should be return smiles =>', function(done) {
        data[0].should.have.property('type', 'smiles');
        data[0].should.have.property('value', item);
        done();
      });
    });
  });
});

describe('Check parse Smiles block:', () => {
  const tests = require('./_data/_smilesParse/_data');
  const options = {
    cwidth: 800,
    outMath: {
      include_smiles: true,
      include_svg: false,
    }};
  tests.forEach(function(item, index) {
    let smilesInline = '```smiles';
    smilesInline += '\n';
    smilesInline += item;
    smilesInline += '\n';
    smilesInline += '```';

    const html = MM.render(smilesInline, options);
    const data = MM.parseMarkdownByHTML(html, false);
    describe((index + 1) + '. [input_smiles] => ' + item, () => {
      it('Should be length = 1', (done) => {
        data.should.have.length(1);
        done();
      });
      it('Should be return smiles =>', function(done) {
        data[0].should.have.property('type', 'smiles');
        data[0].should.have.property('value', item);
        done();
      });
    });
  });
});

describe('Check parse Smiles with svg:', () => {
  const tests = require('./_data/_smilesParse/_data');
  const options = {
    cwidth: 800,
    outMath: {
      include_smiles: true
    }};
  tests.forEach(function(item) {
    const smilesInline = `<smiles>${item}</smiles>`;

    const html = MM.render(smilesInline, options);
    const data = MM.parseMarkdownByHTML(html, false);
    describe('input_smiles => ' + item, () => {
      it('Should be length = 2', (done) => {
        data.should.have.length(2);
        done();
      });
      it('Should be return smiles =>', function(done) {
        data[0].should.have.property('type', 'smiles');
        data[0].should.have.property('value', item);
        done();
      });

      it('Should be return svg =>', function(done) {
        data[1].should.have.property('type', 'svg');
        const doc = JSDOM.fragment(data[1].value);
        doc.firstChild.tagName.should.equal('svg');
        done();
      });
    });
  });
});
