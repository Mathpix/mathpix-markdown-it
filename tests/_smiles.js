let chai = require('chai');
let should = chai.should();

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;


const { JSDOM } = require("jsdom");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

describe('Check Smiles:', () => {
  const options = {
    cwidth: 800,
    smiles: {
      isTesting: true,
      shortBondLength: 0.85,
      dCircle: 4,
      useCurrentColor: false
    }
  };
  const simple_aromatic_rings = require('./_data/_smiles/_simple_aromatic_rings');
  simple_aromatic_rings.forEach(function(test) {
    if (test.smiles && test.svg) {
      const html = MM.markdownToHTML(test.smiles, options);
      describe(`Smiles => [simple_aromatic_rings] => ${test.name ? test.name : ''}  [`
        + (test.id).toString() + '] => ' + test.smiles, () => {

        it('Checking result html', (done) => {
          html.trim().should.equal(test.svg.trim());
          done();
        });
      });
    }
  });

  // //data_CCOc1ccc2oc
  const tests2 = require('./_data/_smiles/_data_CCOc1ccc2oc');
  tests2.forEach(function(test) {
    if (test.smiles && test.svg) {
      const html = MM.markdownToHTML(test.smiles, options);
      describe('Smiles => [_data_CCOc1ccc2oc] => ['+ (test.id).toString() + '] => ' + test.smiles, () => {
        it('Checking result html', (done) => {
          html.trim().should.equal(test.svg.trim());
          done();
        });
      });
    }
  });

  const tests = require('./_data/_smiles/_data1');
  tests.forEach(function(test) {
    if (test.smiles && test.svg) {
      const html = MM.markdownToHTML(test.smiles, options);
      describe('Smiles [' + (test.id).toString() + '] => ' + test.smiles, () => {
        it('Checking result html', (done) => {
          html.trim().should.equal(test.svg.trim());
          done();
        });
      });
    }
  });

  const tests1 = require('./_data/_smiles/_data2');
  tests1.forEach(function(test) {
    if (test.smiles && test.svg) {
      const html = MM.markdownToHTML(test.smiles, options);
      describe('Smiles data2 [' + (test.id).toString() + '] => ' + test.smiles, () => {
        it('Checking result html', (done) => {
          html.trim().should.equal(test.svg.trim());
          done();
        });
      });
    }
  });

  const tests3 = require('./_data/_smiles/_data3');
  tests3.forEach(function(test) {
    if (test.smiles && test.svg) {
      const html = MM.markdownToHTML(test.smiles, options);
      describe('Smiles data3 [' + (test.id).toString() + '] => ' + test.smiles, () => {
        it('Checking result html', (done) => {
          html.trim().should.equal(test.svg.trim());
          done();
        });
      });
    }
  });

  const tests4 = require('./_data/_smiles/_data4');
  tests4.forEach(function(test) {
    if (test.smiles && test.svg) {
      const html = MM.markdownToHTML(test.smiles, options);
      describe('Smiles data4 [' + (test.id).toString() + '] => ' + test.smiles, () => {
        it('Checking result html', (done) => {
          html.trim().should.equal(test.svg.trim());
          done();
        });
      });
    }
  });

  const tests5 = require('./_data/_smiles/_data5');
  tests5.forEach(function(test) {
    if (test.smiles && test.svg) {
      const html = MM.markdownToHTML(test.smiles, options);
      describe('Smiles data4 [' + (test.id).toString() + '] => ' + test.smiles, () => {
        it('Checking result html', (done) => {
          html.trim().should.equal(test.svg.trim());
          done();
        });
      });
    }
  });

  const tests6 = require('./_data/_smiles/_data6');
  tests6.forEach(function(test) {
    if (test.smiles && test.svg) {
      const html = MM.markdownToHTML(test.smiles, options);
      describe('Smiles data4 [' + (test.id).toString() + '] => ' + test.smiles, () => {
        it('Checking result html', (done) => {
          html.trim().should.equal(test.svg.trim());
          done();
        });
      });
    }
  });
});
