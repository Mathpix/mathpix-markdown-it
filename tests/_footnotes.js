let chai = require('chai');
let should = chai.should();

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;
const mmdContent = require("./_data/_footnotes/_mmd");
const { htmlContent, htmlContentFootnote_compact_refs } = require("./_data/_footnotes/_html");

const { JSDOM } = require("jsdom");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;


describe('Check Footnotes:', () => {
  it('(sync) Checking result html', () => {
    const html = MM.markdownToHTML(mmdContent);
    html.trim().should.equal(htmlContent);
    MM.texReset();
  });
  it('(async) Checking result html', async () => {
    const html = await MM.markdownToHTMLAsync(mmdContent);
    html.trim().should.equal(htmlContent);
    MM.texReset();
  });
  it('(async segments) Checking result html', async () => {
    let { content } = await MM.markdownToHTMLSegmentsAsync(mmdContent);
    content.trim().should.equal(htmlContent);
    MM.texReset();
  });
});

describe('Check Footnotes with compact_refs option set to true:', () => {
  const options = {
    footnotes: {
      compact_refs: true
    }
  };
  it('(sync) Checking result html', () => {
    const html = MM.markdownToHTML(mmdContent, options);
    html.trim().should.equal(htmlContentFootnote_compact_refs);
    MM.texReset();
  });
  it('(async) Checking result html', async () => {
    const html = await MM.markdownToHTMLAsync(mmdContent, options);
    html.trim().should.equal(htmlContentFootnote_compact_refs);
    MM.texReset();
  });
  it('(async segments) Checking result html', async () => {
    let { content } = await MM.markdownToHTMLSegmentsAsync(mmdContent, options);
    content.trim().should.equal(htmlContentFootnote_compact_refs);
    MM.texReset();
  });
});
