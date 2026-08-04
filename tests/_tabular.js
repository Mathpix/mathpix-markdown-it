let chai = require('chai');
let should = chai.should();

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;
const markdownIt = require('markdown-it');
const { mathpixMarkdownPlugin } = require('../lib/index.js');
const { getMdLink } = require('../lib/markdown/common/table-markdown');
const { renderTableCellContent } = require('../lib/markdown/common/render-table-cell-content');

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

// The cell export walks a hand-kept predicate plus three Sets: a type missing from the stitch set
// exports twice, a type added to the boundary set stops exporting at all. Both fail silently, so
// pin the property per type: whatever the run holds, its text reaches table-markdown exactly once.
describe('Each inline type in a cell exports exactly once:', () => {
  const cellMd = (body) => {
    const src = '\\begin{tabular}{|l|}\n\\begin{itemize}\\item[x] ' + body + '\\end{itemize}\n\\end{tabular}';
    const html = MM.markdownToHTML(src, { outMath: { include_svg: false, include_table_markdown: true } });
    const parsed = MM.parseMarkdownByHTML(html, false).find((p) => p.type === 'table-markdown');
    return parsed.value.split('\n')[0];
  };
  const cases = {
    text: ['plain', 'plain'],
    link: ['[t](http://a.b)', '[t](http://a.b)'],
    image: ['![alt](i.png)', '![alt](i.png)'],
    strong: ['**b**', '**b**'],
    em: ['*i*', '*i*'],
    strike: ['~~s~~', '~~s~~'],
    code_inline: ['`c`', '`c`'],
    texttt: ['\\texttt{q}', '`q`'],
    inline_math: ['$x^2$', '$x^2$'],
    smiles_inline: ['<smiles>CCO</smiles>', '<smiles>CCO</smiles>'],
    lstlisting: ['a\n\\begin{lstlisting}\nz\n\\end{lstlisting}\n', '<pre><code>z</code></pre>'],
  };
  Object.entries(cases).forEach(([name, [body, needle]]) => {
    it(`${name}: its text appears once`, () => {
      const md = cellMd(body);
      md.split(needle).should.have.length(2, `expected exactly one ${name} in ${md}`);
    });
  });
});

// An inline type the label builder does not know falls back to its bare content, which silently
// drops the markup around it (`H~2~O` → `H2O`). These two tests are the gate for that class.
describe('The exported label has a decision for every inline construct:', () => {
  // Every inline rule this plugin registers, reviewed against getMdLink/getMdForChild. A new rule
  // fails the test until its tokens are handled there — or listed here as knowingly flattened.
  const REVIEWED_INLINE_RULES = (
    'InlineIncludeGraphics asciiMath autolink backtickAsAsciiMath backticks balance_pairs ' +
    'captionLatex captionSetupLatex centeringLatex dotfill doubleSlashToSoftBreak emphasis ' +
    'entity escape grab_footnote_ref html_inline html_inline2 html_inline_full_tag image ' +
    'inlineDiagbox inlineMmdIcon inlineTabular labelLatex latex_footnote latex_footnotemark ' +
    'latex_footnotetext latex_list_env_inline latex_lstlisting_env_inline link linkifyURL ' +
    'list_begin_inline list_close_inline list_item_inline list_setcounter_inline mathML multiMath ' +
    'newCommandQedSymbol newTheorem newline newlineToSpace pageBreaks refs refsInline ' +
    'renewcommand_inline setCounterSection setCounterTheorem simpleMath smilesDrawerInline ' +
    'strikethrough text textAuthor textMode textOut textTypes textUnderline ' +
    'text_collapse theoremStyle toc tocHide usepackage'
  ).split(' ');

  it('no inline rule of this plugin is unreviewed', () => {
    const md = markdownIt({ html: true }).use(mathpixMarkdownPlugin, { outMath: { include_svg: false } });
    const live = md.inline.ruler.__rules__.concat(md.inline.ruler2.__rules__).map((r) => r.name);
    const unreviewed = live.filter((name, i) => live.indexOf(name) === i
      && REVIEWED_INLINE_RULES.indexOf(name) === -1);
    unreviewed.should.deep.equal([],
      'new inline rule(s): handle their tokens in getMdLink/getMdForChild, then list them here');
  });

  const labelMd = (body) => {
    const src = '\\begin{tabular}{|l|}\n' + body + '\n\\end{tabular}';
    const html = MM.markdownToHTML(src, { outMath: { include_svg: false, include_table_markdown: true } });
    return MM.parseMarkdownByHTML(html, false)
      .find((p) => p.type === 'table-markdown').value.split('\n')[0];
  };
  // Measured, not assumed: third-party markup (sub/sup/mark/ins) reaches the label as tokens too.
  const KEEPS_ITS_MARKUP = ['**b**', '*i*', '~~s~~', '`c`', '==m==', '++ins++', 'H~2~O', 'x^2^',
    ':smile:', '<b>h</b>', '$x$', '<smiles>CCO</smiles>'];
  KEEPS_ITS_MARKUP.forEach((body) => {
    it(`keeps its markup: ${body}`, () =>
      labelMd(`[${body}](http://x.y)`).should.equal(`| [${body}](http://x.y) |`));
  });
  it('what the label drops, it drops knowingly', () => {
    // No Markdown form for an underline; a nested image keeps its alt; a link title has nowhere to go.
    labelMd('[\\underline{u}](http://x.y)').should.equal('| [u](http://x.y) |');
    labelMd('[![alt](p.png)](http://x.y)').should.equal('| [alt](http://x.y) |');
    labelMd('[a](http://x.y "t")').should.equal('| [a](http://x.y) |');
    // \textbf maps onto the Markdown marker rather than staying LaTeX.
    labelMd('[\\textbf{b}](http://x.y)').should.equal('| [**b**](http://x.y) |');
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
  it('a link_open with no close still closes its anchor', () => {
    // Cell children are partly hand-stitched (sub-tabular, envToInline replay), so balance is not a
    // parser guarantee here: the loop must not leave the anchor open when it runs out of tokens.
    const inner = markdownIt({ html: true }).use(mathpixMarkdownPlugin, { outMath: { include_svg: false } });
    const tokens = [];
    inner.inline.parse('[label](http://a.b) tail', inner, {}, tokens);
    const cell = (children) =>
      renderTableCellContent({ children }, false, inner.options, {}, inner.renderer);
    const balance = (res) =>
      (res.content.match(/<a /g) || []).length - (res.content.match(/<\/a>/g) || []).length;

    // No close: the loop runs to the end, so the tail joins the label. Pinned exactly — the chosen
    // behaviour is "keep the content", and an assertion on substrings would allow either outcome.
    const noClose = cell(tokens.filter((t) => t.type !== 'link_close'));
    balance(noClose).should.equal(0);
    noClose.tableMd.should.equal('[label tail](http://a.b)');

    // link_open as the last child: no label at all, and the opening tag came from the main loop.
    const onlyOpen = cell([tokens[0]]);
    balance(onlyOpen).should.equal(0);
    onlyOpen.tableMd.should.equal('');

    // Control: a balanced stream keeps the tail outside the label.
    const balanced = cell(tokens);
    balance(balanced).should.equal(0);
    balanced.tableMd.should.equal('[label](http://a.b) tail');
  });
  it('every part of the label is escaped, except an image alt', () => {
    // A truncated label loses the whole link downstream, so `]` is escaped wherever it comes from —
    // raw markup included. Math and an image alt are exempt: both are latex/raw source, and a
    // backslash added there would change what they mean (`\\` is a LaTeX line break).
    const inner = markdownIt({ html: true }).use(mathpixMarkdownPlugin, { outMath: { include_svg: false } });
    const label = (src) => {
      const tokens = [];
      inner.inline.parse(src, inner, {}, tokens);
      return getMdLink(tokens[0], { children: tokens }, 0);
    };
    label('[a\\]b](http://a.b)').should.equal('[a\\]b](http://a.b)');
    // Math goes through verbatim, delimiters included — see the re-parse test below for why the
    // unescaped `]` is safe here.
    label('[$a]b$](http://a.b)').should.equal('[$a]b$](http://a.b)');
    label('[$\\frac{a}{b}$](http://a.b)').should.equal('[$\\frac{a}{b}$](http://a.b)');
    // Display math keeps `$$`, or the label would downgrade it to inline.
    label('[$$x^2$$](http://a.b)').should.equal('[$$x^2$$](http://a.b)');

    // The point of the delimiters: an exported math label reads back as a link, brackets and all.
    ['[$\\sqrt[3]{x}$](http://a.b)', '[$a]b$](http://a.b)', '[$\\frac{a}{b}$](http://a.b)'].forEach((src) => {
      const round = [];
      inner.inline.parse(label(src), inner, {}, round);
      const open = round.find((t) => t.type === 'link_open');
      chai.expect(open, 'label stopped being a link: ' + src).to.not.be.undefined;
      open.attrGet('href').should.equal('http://a.b');
    });
    label('[<i title="x]y">t</i>](http://a.b)').should.equal('[<i title="x\\]y">t</i>](http://a.b)');
    label('[![a\\]b](i.png)](http://a.b)').should.equal('[a\\]b](http://a.b)');

    // `[` and `\` belong to the same class: the first re-pairs with the closing bracket, the second
    // would escape whatever follows it. Not reachable through a cell (`\\` splits a tabular row),
    // so the label is built from tokens and read back with a plain parser.
    const roundTrip = (text) => {
      const tokens = [];
      inner.inline.parse('[x](u)', inner, {}, tokens);
      tokens[1].content = text;
      const md = getMdLink(tokens[0], { children: tokens }, 0);
      const html = markdownIt({ html: true }).render(md);
      return {
        md,
        text: (html.match(/<a href="[^"]*"[^>]*>([\s\S]*?)<\/a>/) || [])[1],
        plain: html.replace(/<[^>]+>/g, '').trim(),
      };
    };
    ['a]b', 'a[b', 'tail\\', 'a[b]c'].forEach((text) => {
      const res = roundTrip(text);
      res.text.should.equal(text, 'label changed for ' + JSON.stringify(text) + ' via ' + res.md);
      res.plain.should.equal(text, 'content leaked outside the link for ' + JSON.stringify(text));
    });
  });
  it('a stitched nested link does not leak a literal <a> into the label', () => {
    const inner = markdownIt({ html: true }).use(mathpixMarkdownPlugin, { outMath: { include_svg: false } });
    const outer = [];
    inner.inline.parse('[a b](http://a.b)', inner, {}, outer);
    const nested = [];
    inner.inline.parse('[q](http://c.d)', inner, {}, nested);
    // Hand-stitched: a nested link inside the label, which the parser never produces.
    const children = [outer[0], outer[1], ...nested, ...outer.slice(2)];
    const md = getMdLink(children[0], { children }, 0);
    md.should.not.include('<a>');
    md.should.not.include('</a>');
  });
  it('the isSubTable stamp follows the argument, so a caller cannot claim nesting silently', () => {
    // renderTableCellContent marks the tokens it walks; later passes read the mark off them.
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
