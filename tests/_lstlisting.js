const chai = require('chai');
const should = chai.should();
const MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;

const { JSDOM } = require('jsdom');
const jsdom = new JSDOM();
globalThis.window = jsdom.window;
globalThis.document = jsdom.window.document;
globalThis.DOMParser = jsdom.window.DOMParser;

describe('Check stlisting env:', () => {
  const tests = require('./_data/_lstlisting/_data');
  tests.forEach(function(test) {
    const html = MM.markdownToHTML(test.mmd);
    const html_copyToClipboard = test.html_copyToClipboard
      ? MM.markdownToHTML(test.mmd, {copyToClipboard: true})
    : '';
    const html_codeHighlight_auto = test.html_codeHighlight_auto
      ? MM.markdownToHTML(test.mmd, { codeHighlight: { auto: true } })
    : '';
    describe('Render stlisting env => ' + test.mmd, () => {
      it('Checking result html', () => {
        html.trim().should.equal(test.html);
      });
      if (test.html_copyToClipboard) {
        it('Checking result html with copyToClipboard', () => {
          html_copyToClipboard.trim().should.equal(test.html_copyToClipboard);
        });
      }
      if (test.html_codeHighlight_auto) {
        it('Checking result html with codeHighlight auto ', () => {
          html_codeHighlight_auto.trim().should.equal(test.html_codeHighlight_auto);
        });
      }
    });
  });
  MM.texReset();
});
