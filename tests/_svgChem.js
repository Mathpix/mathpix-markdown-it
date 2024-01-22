let chai = require('chai');
let should = chai.should();
const notIncludeSymbols = require('./_ascii');

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;

const options = {
  cwidth: 800,
  htmlTags: true
};



const { JSDOM } = require("jsdom");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;


describe('SVG. Check parseMarkdownByHTML for Chem:', () => {
  const tests = require('./_data/_svg_chem/_data');
  tests.forEach((test, index) => {
    const html = MM.markdownToHTML(test.mmd, options);
    const data = MM.parseMarkdownByHTML(html, false);
    describe('SVG [' + index + ']', () => {
      it('Should be length = 4', (done) => {
        data.should.have.length(4);
        done();
      });
      it('Should be return smiles =>', function(done) {
        data[0].should.have.property('type', 'smiles');
        data[0].should.have.property('value', test.smiles);
        done();
      });
      it('Should be return mol =>', function(done) {
        data[1].should.have.property('type', 'mol');
        data[1].should.have.property('value', test.mol);
        done();
      });
      it('Should be return inchi =>', function(done) {
        data[2].should.have.property('type', 'inchi');
        data[2].should.have.property('value', test.inchi);
        done();
      });
      it('Should be return inchi_key =>', function(done) {
        data[3].should.have.property('type', 'inchi_key');
        data[3].should.have.property('value', test.inchi_key);
        done();
      });
    });
  });
});



