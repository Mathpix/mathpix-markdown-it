let chai = require('chai');
let should = chai.should();

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;
const { getLabelsList } = require('../lib/index');

const options = {
  cwidth: 800
};


const { JSDOM } = require("jsdom");
const mmdContent = require("./_data/_footnotes_latex/_mmd/_mmd_12");
const htmlContent = require("./_data/_footnotes_latex/_html/_html_12");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;


describe('Check Latex Footnotes:', () => {
  describe('Check footnotes counter (_mmd_01):', () => {
    const mmdContent = require('./_data/_footnotes_latex/_mmd/_mmd_01');
    const htmlContent = require('./_data/_footnotes_latex/_html/_html_01');
    it('(sync) Checking result html', () => {
      const html = MM.markdownToHTML(mmdContent, options);
      html.trim().should.equal(htmlContent);
      MM.texReset();
    });
    it('(async) Checking result html', async() => {
      const html = await MM.markdownToHTMLAsync(mmdContent, options);
      html.trim().should.equal(htmlContent);
      MM.texReset();
    });
    it('(async segments) Checking result html', async() => {
      let { content } = await MM.markdownToHTMLSegmentsAsync(mmdContent, options);
      content.trim().should.equal(htmlContent);
      MM.texReset();
    });
  });

  describe('Check: \\footnotestext to one \\footnotemark (_mmd_02):', () => {
    const mmdContent = require('./_data/_footnotes_latex/_mmd/_mmd_02');
    const htmlContent = require('./_data/_footnotes_latex/_html/_html_02');
    it('(sync) Checking result html', () => {
      const html = MM.markdownToHTML(mmdContent, options);
      html.trim().should.equal(htmlContent);
      MM.texReset();
    });
    it('(async) Checking result html', async () => {
      const html = await MM.markdownToHTMLAsync(mmdContent, options);
      html.trim().should.equal(htmlContent);
      MM.texReset();
    });
    it('(async segments) Checking result html', async () => {
      let { content } = await MM.markdownToHTMLSegmentsAsync(mmdContent, options);
      content.trim().should.equal(htmlContent);
      MM.texReset();
    });
  });
  
  describe('Check Latex Footnotes with MD Footnotes (_mmd_03):', () => {
    const mmdContent = require('./_data/_footnotes_latex/_mmd/_mmd_03');
    const htmlContent = require('./_data/_footnotes_latex/_html/_html_03');
    it('(sync) Checking result html', () => {
      const html = MM.markdownToHTML(mmdContent, options);
      html.trim().should.equal(htmlContent);
      MM.texReset();
    });
    it('(async) Checking result html', async() => {
      const html = await MM.markdownToHTMLAsync(mmdContent, options);
      html.trim().should.equal(htmlContent);
      MM.texReset();
    });
    it('(async segments) Checking result html', async() => {
      let { content } = await MM.markdownToHTMLSegmentsAsync(mmdContent, options);
      content.trim().should.equal(htmlContent);
      MM.texReset();
    });
  });  
  
  describe('Check Latex Footnotes with MD Footnotes (_mmd_04):', () => {
    const mmdContent = require('./_data/_footnotes_latex/_mmd/_mmd_04');
    const htmlContent = require('./_data/_footnotes_latex/_html/_html_04');
    it('(sync) Checking result html', () => {
      const html = MM.markdownToHTML(mmdContent, options);
      html.trim().should.equal(htmlContent);
      MM.texReset();
    });
    it('(async) Checking result html', async () => {
      const html = await MM.markdownToHTMLAsync(mmdContent, options);
      html.trim().should.equal(htmlContent);
      MM.texReset();
    });
    it('(async segments) Checking result html', async () => {
      let { content } = await MM.markdownToHTMLSegmentsAsync(mmdContent, options);
      content.trim().should.equal(htmlContent);
      MM.texReset();
    });
  });  
  
  describe('Check Latex Footnotes with MD Footnotes (_mmd_05):', () => {
    const mmdContent = require('./_data/_footnotes_latex/_mmd/_mmd_05');
    const htmlContent = require('./_data/_footnotes_latex/_html/_html_05');
    it('(sync) Checking result html', () => {
      const html = MM.markdownToHTML(mmdContent, options);
      html.trim().should.equal(htmlContent);
      MM.texReset();
    });
    it('(async) Checking result html', async() => {
      const html = await MM.markdownToHTMLAsync(mmdContent, options);
      html.trim().should.equal(htmlContent);
      MM.texReset();
    });
    it('(async segments) Checking result html', async() => {
      let { content } = await MM.markdownToHTMLSegmentsAsync(mmdContent, options);
      content.trim().should.equal(htmlContent);
      MM.texReset();
    });
  });  
  describe('Check Latex Footnotes with MD Footnotes (_mmd_08):', () => {
    const mmdContent = require('./_data/_footnotes_latex/_mmd/_mmd_08');
    const htmlContent = require('./_data/_footnotes_latex/_html/_html_08');
    it('(sync) Checking result html', () => {
      const html = MM.markdownToHTML(mmdContent, options);
      html.trim().should.equal(htmlContent);
      MM.texReset();
    });
    it('(async) Checking result html', async() => {
      const html = await MM.markdownToHTMLAsync(mmdContent, options);
      html.trim().should.equal(htmlContent);
      MM.texReset();
    });
    it('(async segments) Checking result html', async() => {
      let { content } = await MM.markdownToHTMLSegmentsAsync(mmdContent, options);
      content.trim().should.equal(htmlContent);
      MM.texReset();
    });
  });  
  describe('Check Latex Footnotes with MD Footnotes (_mmd_09):', () => {
    const mmdContent = require('./_data/_footnotes_latex/_mmd/_mmd_09');
    const htmlContent = require('./_data/_footnotes_latex/_html/_html_09');
    it('(sync) Checking result html', () => {
      const html = MM.markdownToHTML(mmdContent, options);
      html.trim().should.equal(htmlContent);
      MM.texReset();
    });
    it('(async) Checking result html', async() => {
      const html = await MM.markdownToHTMLAsync(mmdContent, options);
      html.trim().should.equal(htmlContent);
      MM.texReset();
    });
    it('(async segments) Checking result html', async() => {
      let { content } = await MM.markdownToHTMLSegmentsAsync(mmdContent, options);
      content.trim().should.equal(htmlContent);
      MM.texReset();
    });
  });  
  describe('Check Latex Footnotes with MD Footnotes (_mmd_10):', () => {
    const mmdContent = require('./_data/_footnotes_latex/_mmd/_mmd_10');
    const htmlContent = require('./_data/_footnotes_latex/_html/_html_10');
    it('(sync) Checking result html', () => {
      const html = MM.markdownToHTML(mmdContent, options);
      html.trim().should.equal(htmlContent);
      MM.texReset();
    });
    it('(async) Checking result html', async() => {
      const html = await MM.markdownToHTMLAsync(mmdContent, options);
      html.trim().should.equal(htmlContent);
      MM.texReset();
    });
    it('(async segments) Checking result html', async() => {
      let { content } = await MM.markdownToHTMLSegmentsAsync(mmdContent, options);
      content.trim().should.equal(htmlContent);
      MM.texReset();
    });
  });  
  describe('Check Latex Footnotes with only \\footnotetext{} (_mmd_11):', () => {
    const mmdContent = require('./_data/_footnotes_latex/_mmd/_mmd_11');
    const htmlContent = require('./_data/_footnotes_latex/_html/_html_11');
    it('(sync) Checking result html', () => {
      const html = MM.markdownToHTML(mmdContent, options);
      html.trim().should.equal(htmlContent);
      MM.texReset();
    });
    it('(async) Checking result html', async() => {
      const html = await MM.markdownToHTMLAsync(mmdContent, options);
      html.trim().should.equal(htmlContent);
      MM.texReset();
    });
    it('(async segments) Checking result html', async() => {
      let { content } = await MM.markdownToHTMLSegmentsAsync(mmdContent, options);
      content.trim().should.equal(htmlContent);
      MM.texReset();
    });
  });  
  describe('Check Latex Footnotes \\blfootnotetext{} (_mmd_12):', () => {
    const mmdContent = require('./_data/_footnotes_latex/_mmd/_mmd_12');
    const htmlContent = require('./_data/_footnotes_latex/_html/_html_12');
    it('(sync) Checking result html', () => {
      const html = MM.markdownToHTML(mmdContent, options);
      html.trim().should.equal(htmlContent);
      MM.texReset();
    });
    it('(async) Checking result html', async() => {
      const html = await MM.markdownToHTMLAsync(mmdContent, options);
      html.trim().should.equal(htmlContent);
      MM.texReset();
    });
    it('(async segments) Checking result html', async() => {
      let { content } = await MM.markdownToHTMLSegmentsAsync(mmdContent, options);
      content.trim().should.equal(htmlContent);
      MM.texReset();
    });
  });
  describe('Check Latex Footnotes with terminated rules (_mmd_13):', () => {
    const mmdContent = require('./_data/_footnotes_latex/_mmd/_mmd_13');
    const htmlContent = require('./_data/_footnotes_latex/_html/_html_13');
    it('(sync) Checking result html', () => {
      const html = MM.markdownToHTML(mmdContent, options);
      html.trim().should.equal(htmlContent);
      MM.texReset();
    });
    it('(async) Checking result html', async() => {
      const html = await MM.markdownToHTMLAsync(mmdContent, options);
      html.trim().should.equal(htmlContent);
      MM.texReset();
    });
    it('(async segments) Checking result html', async() => {
      let { content } = await MM.markdownToHTMLSegmentsAsync(mmdContent, options);
      content.trim().should.equal(htmlContent);
      MM.texReset();
    });
  });
});

describe('Check block \\footnotetext:', () => {
  const tests = require('./_data/_footnotes_latex/_data-footnotetext');
  tests.forEach((test, index) => {
    const mmdOptions = Object.assign({}, options, options);
    it('(sync) Checking result html. (' + index + ')', () => {
      const html = MM.markdownToHTML(test.mmd, mmdOptions);
      html.trim().should.equal(test.html);
      MM.texReset();
    });
    it('(async) Checking result html. (' + index + ')', async() => {
      const html = await MM.markdownToHTMLAsync(test.mmd, mmdOptions);
      html.trim().should.equal(test.html);
      MM.texReset();
    });
    it('(async segments) Checking result html. (' + index + ')', async() => {
      let { content } = await MM.markdownToHTMLSegmentsAsync(test.mmd, mmdOptions);
      content.trim().should.equal(test.html);
      MM.texReset();
    });
  });
});

describe('Check block \\footnote:', () => {
  const tests = require('./_data/_footnotes_latex/_data-footnote');
  tests.forEach((test, index) => {
    const mmdOptions = Object.assign({}, options, options);
    it('(sync) Checking result html. (' + index + ')', () => {
      const html = MM.markdownToHTML(test.mmd, mmdOptions);
      html.trim().should.equal(test.html);
      MM.texReset();
    });
    it('(async) Checking result html. (' + index + ')', async() => {
      const html = await MM.markdownToHTMLAsync(test.mmd, mmdOptions);
      html.trim().should.equal(test.html);
      MM.texReset();
    });
    it('(async segments) Checking result html. (' + index + ')', async() => {
      let { content } = await MM.markdownToHTMLSegmentsAsync(test.mmd, mmdOptions);
      content.trim().should.equal(test.html);
      MM.texReset();
    });
  });
});
