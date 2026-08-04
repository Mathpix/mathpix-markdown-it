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

// Leaf runs are rendered a second time to collect the export formats; that pass throws its HTML
// away, but it re-runs render rules, and some hold module state (marker levels). Pin that turning
// the exports on cannot change the HTML — the double render must stay invisible.
describe('Enabling the cell exports leaves the HTML untouched:', () => {
  const sources = {
    'leaf run with math': '\\begin{tabular}{|l|}\n\\begin{itemize}\\item[x] $a^2$ tail\\end{itemize}\n\\end{tabular}',
    'nested lists': '\\begin{tabular}{|l|}\n\\begin{itemize}\\item[1.] a \\begin{itemize}\\item[y] b\\end{itemize}\\end{itemize}\n\\end{tabular}',
    'link in a cell': '\\begin{tabular}{|l|}\n[t](http://a.b) tail\n\\end{tabular}',
  };
  const tableHtml = (src, extra) => {
    const html = MM.markdownToHTML(src, { outMath: { include_svg: false, ...extra } });
    return (html.match(/<table[\s\S]*?<\/table>/) || [])[0];
  };
  Object.entries(sources).forEach(([name, src]) => {
    it(`${name}: same HTML with and without tsv/csv/table-markdown`, () => {
      const off = tableHtml(src, {});
      off.should.be.a('string');
      tableHtml(src, { include_tsv: true }).should.equal(off);
      tableHtml(src, { include_csv: true }).should.equal(off);
      tableHtml(src, { include_table_markdown: true }).should.equal(off);
      tableHtml(src, { include_tsv: true, include_csv: true, include_table_markdown: true })
        .should.equal(off);
    });
  });
});

// A run is fed to renderTableCellContent whole, so a member appearing twice would export twice.
describe('Block leaves in a cell export exactly once:', () => {
  const cellMd = (src) => {
    const html = MM.markdownToHTML(src, { outMath: { include_svg: false, include_table_markdown: true } });
    return ((html.match(/<table-markdown[^>]*>([\s\S]*?)<\/table-markdown>/) || [])[1] || '').split('\n')[0];
  };
  const cases = {
    // lstlisting is a block leaf and a run member on purpose: this is where its markdown comes from.
    'lstlisting': ['\\begin{tabular}{|l|}\n\\begin{itemize}\\item[x] a\n' +
      '\\begin{lstlisting}\nz\n\\end{lstlisting}\n\\end{itemize}\n\\end{tabular}', 'z'],
    'unsupported \\hrule': ['\\begin{tabular}{|l|}\n\\begin{itemize}\\item[x] a \\hrule b\\end{itemize}\n' +
      '\\end{tabular}', '\\hrule'],
    'fence': ['\\begin{tabular}{|l|}\n\\begin{itemize}\\item[x] a\n```\ncode\n```\n\\end{itemize}\n' +
      '\\end{tabular}', 'code'],
  };
  Object.entries(cases).forEach(([name, [src, needle]]) => {
    it(`${name}: its content appears once in table-markdown`, () => {
      const md = cellMd(src);
      md.should.include(needle);
      md.split(needle).should.have.length(2);
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
  it('a table inside the label is smoothed, not passed through as HTML', () => {
    // Only a token rendered as a table carries smoothed lines, so this is the shape where the
    // link loop could diverge from the main loop.
    const nested = '\\begin{tabular}{|l|}\n[\\begin{tabular}{l}q\\end{tabular}](http://a.b) t\n\\end{tabular}';
    const md = markdownIt({ html: true }).use(mathpixMarkdownPlugin,
      { outMath: { include_svg: false }, forPptx: true });
    const env = {};
    const tokens = md.parse(nested, env);
    md.renderer.render(tokens, md.options, env);
    const outer = tokens.find((t) => t.type === 'tabular');
    const smoothed = JSON.stringify(outer.tableSmoothed);
    smoothed.should.not.match(/<table|inline-tabular/);
    smoothed.should.include('q');
    smoothed.should.include('</a>');
    // The cell's own pptx HTML takes the same form — the accumulator and the content agree.
    const html = md.renderer.render(tokens, md.options, env);
    html.should.not.match(/<a [^>]*>\s*<div class="inline-tabular"/);
  });
  it('the isSubTable stamp follows the argument, so a caller cannot claim nesting silently', () => {
    // renderTableCellContent marks the tokens it walks; later passes read the mark off them.
    const { renderTableCellContent } = require('../lib/markdown/common/render-table-cell-content');
    const inner = markdownIt({ html: true }).use(mathpixMarkdownPlugin, { outMath: { include_svg: false } });
    const call = (child, isSubTable) => {
      renderTableCellContent({ children: [child] }, isSubTable, inner.options, {}, inner.renderer);
      return child.isSubTable;
    };
    const text = () => ({ type: 'text', content: 'a', attrGet: () => null });
    (call(text(), false) === undefined).should.equal(true);
    call(text(), true).should.equal(true);
    // A nested table marks itself by type, whatever the caller passes.
    call({ type: 'tabular_inline', content: '', children: [], attrGet: () => null }, false).should.equal(true);
  });
  it('tsv keeps the href by design, not the label', () => {
    const html = MM.markdownToHTML(src, { outMath: { include_svg: false, include_tsv: true } });
    const tsv = (html.match(/<tsv[^>]*>([\s\S]*?)<\/tsv>/) || [])[1];
    tsv.should.include('http://a.b');
    tsv.should.include('tail');
  });
});
