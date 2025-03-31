let chai = require('chai');
let should = chai.should();

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;


const { JSDOM } = require("jsdom");
const tests = require("./_data/_sanitizeHtml/_data");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

describe('Check SanitizeHtml for markdownToHTML. [disallowedTagsMode = recursiveEscape, htmlDisableTagMatching = true]', () => {
  const optionsDef = {
    width: 800,
    htmlDisableTagMatching: true,
    htmlTags: true
  };
  const tests = require('./_data/_sanitizeHtml/_data');

  tests.forEach(function(test) {
    let options = test.discardOptions
      ? { ...optionsDef, ...test.discardOptions }
      : {...optionsDef};
    const sanitizeHtml = MM.markdownToHTML(test.html, options);

    describe('Should be sanitize Html [disallowedTagsMode = discard] => ' + test.html, () => {
      it('Checking result html', (done) => {
        sanitizeHtml.trim().should.equal(test.discard);
        done();
      });
    });
  });

  tests.forEach(function(test) {
    let options = test.sanitizeOptions
      ? { ...optionsDef, ...test.sanitizeOptions }
      : {...optionsDef, htmlSanitize: {disallowedTagsMode: 'recursiveEscape'}};
    const sanitizeHtml = MM.markdownToHTML(test.html, options);

    describe('Should be sanitize Html [disallowedTagsMode = recursiveEscape] => ' + test.html, () => {
      it('Checking result html', (done) => {
        sanitizeHtml.trim().should.equal(test.sanitize);
        done();
      });
    });
  });

  tests.forEach(function(test) {
    let options = {...optionsDef, htmlSanitize: false};
    const sanitizeHtml = MM.markdownToHTML(test.html, options);
    describe('Should be dirty Html => ' + test.html, () => {
      it('Checking result html', (done) => {
        sanitizeHtml.trim().should.equal(test.dirty);
        done();
      });
    });
  });
});


describe('Check SanitizeHtml for markdownToHTML. [disallowedTagsMode = recursiveEscape, htmlDisableTagMatching = false]', () => {
  const optionsDef = {
    width: 800,
    htmlTags: true
  };
  const tests = require('./_data/_sanitizeHtml/_data_htmlCheckTagMatching');

  tests.forEach(function(test) {
    let options = test.discardOptions
      ? { ...optionsDef, ...test.discardOptions }
      : {...optionsDef};
    const sanitizeHtml = MM.markdownToHTML(test.html, options);

    describe('Should be sanitize Html [disallowedTagsMode = discard] => ' + test.html, () => {
      it('Checking result html', (done) => {
        sanitizeHtml.trim().should.equal(test.discard);
        done();
      });
    });
  });

  tests.forEach(function(test) {
    let options = test.sanitizeOptions
      ? { ...optionsDef, ...test.sanitizeOptions }
      : {...optionsDef, htmlSanitize: {disallowedTagsMode: 'recursiveEscape'}};
    const sanitizeHtml = MM.markdownToHTML(test.html, options);

    describe('Should be sanitize Html [disallowedTagsMode = recursiveEscape] => ' + test.html, () => {
      it('Checking result html', (done) => {
        sanitizeHtml.trim().should.equal(test.sanitize);
        done();
      });
    });
  });

  tests.forEach(function(test) {
    let options = {...optionsDef, htmlSanitize: false};
    const sanitizeHtml = MM.markdownToHTML(test.html, options);
    describe('Should be dirty Html => ' + test.html, () => {
      it('Checking result html', (done) => {
        sanitizeHtml.trim().should.equal(test.dirty);
        done();
      });
    });
  });

});
