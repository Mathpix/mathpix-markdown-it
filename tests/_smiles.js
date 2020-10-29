let chai = require('chai');
let should = chai.should();

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;

const Window = require('window');
const window = new Window();
global.window = window;
global.document = window.document;

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
global.DOMParser = new JSDOM().window.DOMParser;

describe.only('Check Smiles:', () => {
  const options = {
    cwidth: 800,
    smiles: {
      isTesting: true
    }
  };

  const tests = require('./_data/_smiles/_data');
  tests.forEach(function(test, index) {
    if (test.smiles && test.svg) {
      const html = MM.markdownToHTML(test.smiles, options);
      describe('Smiles [' + (index + 1).toString() + '] => ' + test.smiles, () => {
        it('Checking result html', (done) => {
          html.trim().should.equal(test.svg);
          done();
        });
      });
    }
  });

  const tests1 = require('./_data/_smiles/_data1');
  tests1.forEach(function(test) {
    if (test.smiles && test.svg) {
      const html = MM.markdownToHTML(test.smiles, options);
      describe('Smiles => ' + test.smiles, () => {
        it('Checking result html', (done) => {
          html.trim().should.equal(test.svg);
          done();
        });
      });
    }
  });

  //data_CCOc1ccc2oc
  const tests2 = require('./_data/_smiles/_data_CCOc1ccc2oc');
  tests2.forEach(function(test, index) {
    if (test.smiles && test.svg) {
      const html = MM.markdownToHTML(test.smiles, options);
      describe('Smiles => [_data_CCOc1ccc2oc] => ['+ (index + 1).toString() + '] => ' + test.smiles, () => {
        it('Checking result html', (done) => {
          html.trim().should.equal(test.svg);
          done();
        });
      });
    }
  });

  const simple_aromatic_rings = require('./_data/_smiles/_simple_aromatic_rings');
  simple_aromatic_rings.forEach(function(test, index) {
    if (test.smiles && test.svg) {
      const html = MM.markdownToHTML(test.smiles, options);
      describe(`Smiles => [simple_aromatic_rings] => ${test.name ? test.name : ''}  [`
        + (index + 1).toString() + '] => ' + test.smiles, () => {
        it('Checking result html', (done) => {
          html.trim().should.equal(test.svg);
          done();
        });
      });
    }
  });
});
