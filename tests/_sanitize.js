let chai = require('chai');
let should = chai.should();

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;


const { JSDOM } = require("jsdom");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

describe('Check SanitizeHtml for markdownToHTML. [disallowedTagsMode = recursiveEscape]', () => {
  const options = {
    width: 800
  };
  const tests = require('./_data/_sanitizeHtml/_data');

  options.htmlTags = true;

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
  options.htmlSanitize = {
    disallowedTagsMode: 'recursiveEscape'
  };

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
