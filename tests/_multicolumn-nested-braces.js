const chai = require('chai');
chai.should();
const { MathpixMarkdownModel: MM } = require('../lib/index');

const { JSDOM } = require('jsdom');
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

describe('multicolumn with nested-brace align-spec (e.g. p{11cm}):', () => {
  const renderCell = (alignSpec, content) =>
    MM.markdownToHTML(
      `\\begin{tabular}{cc}\n\\multicolumn{2}{${alignSpec}}{${content}}\n\\end{tabular}`,
      { cwidth: 800 }
    );
  it('p{11cm}: colspan=2 with clean content, no truncated align-spec leaking into HTML', () => {
    const html = renderCell('p{11cm}', 'TEXT_CONTENT');
    html.should.match(/colspan="2"/);
    html.should.match(/>TEXT_CONTENT</);
    html.should.not.match(/p\{11cm/);
    html.should.not.match(/}TEXT_CONTENT/);
  });
  it('m{2cm}: same one-level nesting handled cleanly', () => {
    const html = renderCell('m{2cm}', 'X');
    html.should.match(/colspan="2"/);
    html.should.match(/>X</);
    html.should.not.match(/m\{2cm/);
  });
  it('plain {c} (no nesting) still works as before', () => {
    const html = renderCell('c', 'Y');
    html.should.match(/colspan="2"/);
    html.should.match(/>Y</);
  });
  it('regression: real-world non-ASCII content keeps both braces intact', () => {
    const html = renderCell(
      'p{11cm}',
      'A combinação ou o contraste de ambas as abordagens proporciona uma visão mais clara'
    );
    html.should.match(/colspan="2"/);
    html.should.match(/combinação/);
    html.should.not.match(/p\{11cm/);
    html.should.not.match(/}A combinação/);
  });
});
