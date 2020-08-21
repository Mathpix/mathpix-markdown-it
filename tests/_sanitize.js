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

describe('Check SanitizeHtml for markdownToHTML. [disallowedTagsMode = recursiveEscape]', () => {
  const options = {
    width: 800,
  };
  const tests = require('./_data/_sanitizeHtml/_data');

  options.htmlTags = true;

  tests.forEach(function(test) {
    const sanitizeHtml = MM.markdownToHTML(test.html, options);

    describe('Should be sanitize Html [disallowedTagsMode = recursiveEscape] => ' + test.html, () => {
      it('Checking result html', (done) => {
        sanitizeHtml.trim().should.equal(test.sanitize);
        done();
      });
    });
  });

  options.htmlTags = true;
  options.htmlSanitize = {
    disallowedTagsMode: 'discard'
  };
  tests.forEach(function(test) {
    const sanitizeHtml = MM.markdownToHTML(test.html, options);

    describe('Should be sanitize Html [disallowedTagsMode = discard] => ' + test.html, () => {
      it('Checking result html', (done) => {
        sanitizeHtml.trim().should.equal(test.discard);
        done();
      });
    });
  });


  options.htmlTags = true;
  options.htmlSanitize = false;

  tests.forEach(function(test) {
    const sanitizeHtml = MM.markdownToHTML(test.html, options);
    describe('Should be dirty Html => ' + test.html, () => {
      it('Checking result html', (done) => {
        sanitizeHtml.trim().should.equal(test.dirty);
        done();
      });
    });
  });

});
