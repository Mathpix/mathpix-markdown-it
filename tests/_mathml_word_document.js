let chai = require('chai');
let should = chai.should();

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;

const { JSDOM } = require("jsdom");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

const options = {
  cwidth: 800,
  outMath: {
    include_mathml_word: true,
    include_svg: true,
  }};

const countOf = (str, re) => (str.match(re) || []).length;

describe('Check mathml_word whole document:', () => {
  describe('1. A snip with prose and several equations', () => {
    const input = `Start from the general form:

$$a x^{2} + b x + c = 0$$

Divide through by \\( a \\), which gives

$$x^{2} + \\frac{b}{a} x = -\\frac{c}{a}$$

and that is the result.`;
    const html = MM.render(input, options);
    const res = MM.parseMathmlWordDocumentByHTML(html);

    it('Should return every equation, not just the first =>', function(done) {
      countOf(res, /<math[\s>]/g).should.equal(3);
      done();
    });
    it('Should keep the prose between the equations =>', function(done) {
      res.should.contain('Start from the general form');
      res.should.contain('Divide through by');
      res.should.contain('and that is the result');
      done();
    });
    it('Should keep the rendered order =>', function(done) {
      res.indexOf('Start from').should.be.below(res.indexOf('Divide through by'));
      res.indexOf('Divide through by').should.be.below(res.indexOf('and that is the result'));
      done();
    });
    it('Should drop the SVG rendering =>', function(done) {
      countOf(res, /<mjx-container[\s>]/g).should.equal(0);
      countOf(res, /<svg[\s>]/g).should.equal(0);
      done();
    });
    it('Should namespace the MathML so Word converts it =>', function(done) {
      countOf(res, /xmlns="http:\/\/www\.w3\.org\/1998\/Math\/MathML"/g).should.equal(3);
      done();
    });
    it('Should mark display math as block and leave inline math inline =>', function(done) {
      countOf(res, /<math[^>]*display="block"/g).should.equal(2);
      done();
    });
  });

  describe('2. A snip with a single equation', () => {
    const html = MM.render('$$x = 1$$', options);
    const res = MM.parseMathmlWordDocumentByHTML(html);
    const perElement = MM.parseMarkdownByHTML(html, false)
      .find((item) => item.type === 'mathmlword');

    it('Should carry the same MathML the per-equation copy carries =>', function(done) {
      res.should.contain(perElement.value);
      done();
    });
  });

  describe('3. A snip with no math at all', () => {
    const res = MM.parseMathmlWordDocumentByHTML(MM.render('Just some prose.', options));

    it('Should return the prose and no MathML =>', function(done) {
      res.should.contain('Just some prose.');
      countOf(res, /<math[\s>]/g).should.equal(0);
      done();
    });
  });

  describe('4. A math container with no <mathmlword> child', () => {
    const html = MM.render('$$x = 1$$', { cwidth: 800, outMath: { include_mathml_word: false, include_svg: true }});
    const res = MM.parseMathmlWordDocumentByHTML(html);

    it('Should degrade to text rather than emit the SVG =>', function(done) {
      countOf(res, /<math[\s>]/g).should.equal(0);
      countOf(res, /<mjx-container[\s>]/g).should.equal(0);
      done();
    });
  });

  describe('5. The source element', () => {
    const html = MM.render('Prose and $$x = 1$$', options);
    const doc = new global.DOMParser().parseFromString(html, "text/html");
    const before = doc.body.innerHTML;
    MM.parseMathmlWordDocument(doc);

    it('Should not be modified by the walk =>', function(done) {
      doc.body.innerHTML.should.equal(before);
      done();
    });
  });

  describe('6. An empty input', () => {
    it('Should return an empty string rather than throw =>', function(done) {
      MM.parseMathmlWordDocument(null).should.equal('');
      done();
    });
  });
});
