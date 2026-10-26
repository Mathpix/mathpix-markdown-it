const chai = require('chai');
chai.should();

const { JSDOM } = require('jsdom');
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

const markdownIt = require('markdown-it');
const { mathpixMarkdownPlugin } = require('../lib/index.js');
const { markdownToHTML: markdownEntry } = require('../lib/markdown/index.js');
const MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;
const fixtures = require('./_data/_tabular/_data_grid_mode');
const { gridProblems } = require('./_data/_tabular/_grid_invariant');

const html = (latex, mode) => MM.markdownToHTML(latex,
  mode ? { outMath: { include_svg: false }, tabularGridMode: mode } : { outMath: { include_svg: false } });
const pptx = (latex, mode) => MM.markdownToHTML(latex,
  { outMath: { include_svg: false }, tabularGridMode: mode, forPptx: true });
const exported = (latex, flag, mode) => {
  const rendered = MM.render(latex,
    { outMath: { [flag]: true, include_table_html: false }, include_svg: false, tabularGridMode: mode });
  const parsed = MM.parseMarkdownByHTML(rendered, false);
  return parsed.length ? parsed[0].value : '';
};

describe('tabularGridMode: the same source in both modes', () => {
  fixtures.forEach((test) => {
    describe(test.name, () => {
      it('source renders the grid the LaTeX declares', () => {
        html(test.latex, 'source').should.equal(test.html_source);
      });
      it('strict renders the grid it reconciles', () => {
        html(test.latex, 'strict').should.equal(test.html_strict);
      });
      // The option is new, so its absence must render exactly what `source` renders.
      it('no option is the source mode', () => {
        html(test.latex, undefined).should.equal(test.html_source);
      });
      it('tsv follows the mode', () => {
        exported(test.latex, 'include_tsv', 'source').should.equal(test.tsv_source);
        exported(test.latex, 'include_tsv', 'strict').should.equal(test.tsv_strict);
      });
      it('csv follows the mode', () => {
        exported(test.latex, 'include_csv', 'source').should.equal(test.csv_source);
        exported(test.latex, 'include_csv', 'strict').should.equal(test.csv_strict);
      });
      it('table-markdown follows the mode', () => {
        exported(test.latex, 'include_table_markdown', 'source').should.equal(test.md_source);
        exported(test.latex, 'include_table_markdown', 'strict').should.equal(test.md_strict);
      });
      // A `.tex` round-trip rebuilds the source, where a dropped row would be a dropped line.
      it('forLatex is the same in both modes', () => {
        const rendered = (mode) => markdownIt({ html: true })
          .use(mathpixMarkdownPlugin,
            { outMath: { include_svg: false }, forLatex: true, tabularGridMode: mode })
          .render(test.latex, {});
        rendered('strict').should.equal(rendered('source'));
      });
      // The option is read where the options are unpacked, which is three places besides the model:
      // a consumer holding the plugin, or `lib/markdown`, must not silently get `source`.
      it('every entry point honours the mode', () => {
        ['source', 'strict'].forEach((mode) => {
          const options = { outMath: { include_svg: false }, tabularGridMode: mode };
          markdownIt({ html: true }).use(mathpixMarkdownPlugin, options).render(test.latex, {})
            .should.equal(html(test.latex, mode), 'the plugin dropped the mode');
          markdownEntry(test.latex, options)
            .should.equal(html(test.latex, mode), 'lib/markdown dropped the mode');
        });
      });
      it('strict satisfies the grid invariant', () => {
        gridProblems(html(test.latex, 'strict'), test.latex)
          .should.deep.equal([], 'strict left a grid a CALS consumer cannot build');
      });
      // `forPptx` decides a line without cells differently and writes no span of one, so the shapes
      // where that shows carry their own pinned output.
      if (test.pptx_source || test.pptx_strict) {
        it('pptx output follows the mode', () => {
          pptx(test.latex, 'source').should.equal(test.pptx_source);
          pptx(test.latex, 'strict').should.equal(test.pptx_strict);
        });
      }
    });
  });

  // The shape that fails the invariant. Markup alone, no declared count: the width `source` overruns is
  // a class of its own, pinned in `_tabular_grid.js`.
  it('source keeps the row that strict drops, and only that', () => {
    const reported = fixtures.find((f) => f.name === 'the reported five-column page');
    gridProblems(reported.html_source)
      .should.deep.equal(['table 0 row 2: no cells'], 'source lost or gained something else');
    gridProblems(reported.html_strict).should.deep.equal([]);
  });
});
