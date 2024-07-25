let chai = require('chai');
let should = chai.should();

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;
const { TextDirection } = require("../lib");

const options = {
  htmlTags: true,
  width: 1200,
  isDisableEmojiShortcuts: true,
  typographer: false,
  smiles: {
    fontSize: 18.7,
    theme: 'light',
    isTesting: true,
  },
  copyToClipboard: true
};


const { JSDOM } = require("jsdom");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

describe('Check textDirection:', () => {
  const tests = require('./_data/_textDirection/_data');
  tests.forEach(function(test) {
    describe('Latex => ' + test.mmd, () => {
      it('Checking result html by default', (done) => {
        const html = MM.markdownToHTML(test.mmd, options);
        html.trim().should.equal(test.unset);
        done();
      });
      it('Checking result html with textDirection={TextDirection.unset}', (done) => {
        const html = MM.markdownToHTML(test.mmd,
          Object.assign({},
            {...options},
            {textDirection: TextDirection.unset}
          )
        );
        html.trim().should.equal(test.unset);
        done();
      });
      it('Checking result html with textDirection={TextDirection.auto}', (done) => {
        const html = MM.markdownToHTML(test.mmd,
          Object.assign({},
            {...options},
            {textDirection: TextDirection.auto}
          )
        );
        html.trim().should.equal(test.auto);
        done();
      });
      it('Checking result html with textDirection={TextDirection.ltr}', (done) => {
        const html = MM.markdownToHTML(test.mmd,
          Object.assign({},
            {...options},
            {textDirection: TextDirection.ltr}
          )
        );
        html.trim().should.equal(test.ltr);
        done();
      });
      it('Checking result html with textDirection={TextDirection.rtl}', (done) => {
        const html = MM.markdownToHTML(test.mmd,
          Object.assign({},
            {...options},
            {textDirection: TextDirection.rtl}
          )
        );
        html.trim().should.equal(test.rtl);
        done();
      });
    });
  });
});
