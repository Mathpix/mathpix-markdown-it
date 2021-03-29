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

describe('Check rendering ascii:', () => {

  const options = {
    cwidth: 800,
    lineNumbering: false,
    htmlTags: true
  };
  const parser = new DOMParser();

  let text = '<ascii>x=(-b+-sqrt(b^(2)-4ac))/(2a)</ascii>';
  describe('Latex => ' + text, () => {
    let html = MM.markdownToHTML(text, options);

    it('Ascii should be to rendered.', (done) => {
      const doc = parser.parseFromString(html, "text/html");
      const elAscii = doc.getElementsByClassName('math-inline ascii');
      elAscii.should.have.length(1);
      done();
    });
  });

  text = '`x=(-b+-sqrt(b^(2)-4ac))/(2a)`';
  describe('Latex => ' + text, () => {
    let html = MM.markdownToHTML(text, options);

    it('Ascii should not be to rendered.', (done) => {
      const doc = parser.parseFromString(html, "text/html");
      const elAscii = doc.getElementsByClassName('math-inline ascii');
      elAscii.should.have.length(0);
      done();
    });
  });


  text = '<ascii>x=(-b+-sqrt(b^(2)-4ac))/(2a)</ascii>';
  options.mathJax = {
    asciiMath: false
  };
  describe('Latex => ' + text, () => {
    let html = MM.markdownToHTML(text, options);

    it('Ascii should not be to rendered.', (done) => {
      const doc = parser.parseFromString(html, "text/html");
      const elAscii = doc.getElementsByClassName('math-inline ascii');
      elAscii.should.have.length(0);
      done();
    });
  });

  text = '`x=(-b+-sqrt(b^(2)-4ac))/(2a)`';
  options.mathJax.asciiMath = {
    useBacktick: true
  };
  describe('Latex => ' + text, () => {
    let html = MM.markdownToHTML(text, options);

    it('Ascii should be to rendered.', (done) => {
      const doc = parser.parseFromString(html, "text/html");
      const elAscii = doc.getElementsByClassName('math-inline ascii');
      elAscii.should.have.length(1);
      done();
    });
  });
});
