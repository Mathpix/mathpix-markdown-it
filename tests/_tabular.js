let chai = require('chai');
let should = chai.should();

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;
const markdownIt = require('markdown-it');
const { mathpixMarkdownPlugin } = require('../lib/index.js');

const options = {
  cwidth: 800
};


const { JSDOM } = require("jsdom");
const tests = require("./_data/_tabular/_data");
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

describe('Check Mathjax:', () => {
  const tests = require('./_data/_tabular/_data');
  tests.forEach(function(test) {
    const html = MM.markdownToHTML(test.latex, {});
    describe('Latex => ' + test.latex, () => {
      it('Checking result html', (done) => {
        html.trim().should.equal(test.html);
        done();
      });
    });
  });
});

describe('Check Mathjax:', () => {
  const tests = require('./_data/_tabular/_data_sub');
  tests.forEach(function(test) {
    const html = MM.markdownToHTML(test.latex, options);
    describe('Latex => ' + test.latex, () => {
      it('Checking result html', (done) => {
        html.trim().should.equal(test.svg);
        done();
      });
    });
  });
});

describe('Check tabular with diagbox:', () => {
  const tests = require('./_data/_tabular/_data_digbox');
  tests.forEach(function(test) {
    describe('Latex => ' + test.latex, () => {
      const html = MM.markdownToHTML(test.latex, {
        outMath: {
          include_csv: true,
          include_tsv: true,
          include_table_html: true,
          include_table_markdown: true
        }
      });
      const data = MM.parseMarkdownByHTML(html, false);
      it('Should be parser.length = 4', function(done) {
        data.should.have.length(4);
        done();
      });
      it('Should be have type: "html"', function(done) {
        data[0].should.have.property('type', 'html');
        if (test.html) {
          data[0].should.have.property('value', test.html);
        }
        done();
      });
      it('Should be have type: "tsv"', function(done) {
        data[1].should.have.property('type', 'tsv');
        if (test.html) {
          data[1].should.have.property('value', test.tsv);
        }
        done();
      });
      it('Should be have type: "table-markdown"', function(done) {
        data[2].should.have.property('type', 'table-markdown');
        if (test.html) {
          data[2].should.have.property('value', test.markdown);
        }
        done();
      });
      it('Should be have type: "csv"', function(done) {
        data[3].should.have.property('type', 'csv');
        if (test.html) {
          data[3].should.have.property('value', test.csv);
        }
        done();
      });

    });
  });
});

describe('A link in a tabular cell renders well-formed in every output:', () => {
  const src = '\\begin{tabular}{l}\n[**b** x](http://a.b) tail\n\\end{tabular}';
  it('the smoothed (pptx) cell closes the anchor and keeps its label', () => {
    // tableSmoothed is an output surface for the external pptx exporter, filled during render.
    // The link branch consumes the inner tokens, so it used to hold a bare opening `<a>`.
    const md = markdownIt({ html: true }).use(mathpixMarkdownPlugin,
      { outMath: { include_svg: false }, forPptx: true });
    const env = {};
    const tokens = md.parse(src, env);
    md.renderer.render(tokens, md.options, env);
    const found = [];
    const walk = (arr) => arr.forEach((t) => {
      if (t.tableSmoothed) { found.push(JSON.stringify(t.tableSmoothed)); }
      if (t.children) { walk(t.children); }
    });
    walk(tokens);
    found.should.have.length.above(0);
    const smoothed = found.join('');
    (smoothed.match(/<a /g) || []).length.should.equal((smoothed.match(/<\/a>/g) || []).length);
    smoothed.should.include('<strong>b</strong>');
  });
  it('tsv keeps the href by design, not the label', () => {
    const html = MM.markdownToHTML(src, { outMath: { include_svg: false, include_tsv: true } });
    const tsv = (html.match(/<tsv[^>]*>([\s\S]*?)<\/tsv>/) || [])[1];
    tsv.should.include('http://a.b');
    tsv.should.include('tail');
  });
});
