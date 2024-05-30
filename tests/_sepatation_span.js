let chai = require('chai');
let should = chai.should();

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;


const { JSDOM } = require("jsdom");
const tests = require("./_data/_sepatation_span/_data");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

describe('Check SanitizeHtml for markdownToHTML. [disallowedTagsMode = recursiveEscape]', () => {
  const options = {
    htmlTags: true
  };
  const tests = require('./_data/_sepatation_span/_data');
  
  tests.forEach(function(test){
    const html = MM.markdownToHTML(test.mmd, options);
    
    describe('Should be <span></span> ' + test.describe, () => {
      it('Checking result html', (done) => {
        html.trim().should.equal(test.html);
        done();
      });
    });
  })
});

describe('Check separation span for code block', () => {
  const options = {
    htmlTags: true,
    previewUuid: "98790064-1a09-406b-8311-efb72e541d01"
  };
  const tests = require('./_data/_sepatation_span/_data_fence');

  tests.forEach(function(test){
    const html = MM.markdownToHTML(test.mmd, options);
    describe('Should be ' + test.describe, () => {
      it('Checking result html', (done) => {
        html.trim().should.equal(test.html);
        done();
      });
    });
  })
});
