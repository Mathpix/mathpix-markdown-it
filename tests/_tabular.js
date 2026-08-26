let chai = require('chai');
let should = chai.should();

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;
const markdownIt = require('markdown-it');
const { mathpixMarkdownPlugin } = require('../lib/index.js');
const { getMdLink, mdHref, getMdMath } = require('../lib/markdown/common/table-markdown');
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

// The inline rule runs at every backslash and asked an unanchored pattern, so standing at one backslash
// it matched a `\diagbox` further on and consumed everything between — the text in the middle was lost.
describe('a diagbox is only recognised where the rule stands:', () => {
  const tests = require('./_data/_tabular/_data_diagbox_inline');
  tests.forEach((test) => {
    describe(test.title, () => {
      it('Checking result html', () => {
        MM.markdownToHTML(test.mmd, { outMath: { include_svg: false } })
          .trim().should.equal(test.html);
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
// tsv/csv hold no markup, so a link cell carries its href and an image cell its src. The image used
// to carry both, glued: the generic accumulator appended the alt before the branch appended the src.
describe('tsv and csv carry the address of a link or image, once:', () => {
  const plain = (body, kind) => {
    const html = MM.markdownToHTML('\\begin{tabular}{|l|}\n' + body + '\n\\end{tabular}',
      { outMath: { include_svg: false, include_tsv: true, include_csv: true } });
    return MM.parseMarkdownByHTML(html, false).find((p) => p.type === kind).value.split('\n')[0];
  };
  // The exports are text, and a rejected link is text in both outputs — there is no link token to strip.
  // Pinned on both sides so neither the HTML nor the export can start disagreeing with the README.
  it('a rejected scheme is literal text in the HTML and in the export alike', () => {
    const cell = (body, extra) => MM.markdownToHTML('\\begin{tabular}{l}\n' + body + ' \\\\\n\\end{tabular}',
      Object.assign({ outMath: { include_svg: false, include_table_markdown: true } }, extra));
    const exported = (html) => (html.match(/<table-markdown[^>]*>([\s\S]*?)<\/table-markdown>/) || [])[1]
      .split('\n')[0];
    const bare = (html) => html.replace(/<table-markdown[\s\S]*?<\/table-markdown>/, '');
    const rejected = cell('[click](javascript:alert(1))', {});
    bare(rejected).should.not.match(/<a\s/, 'the HTML path made a link out of a rejected scheme');
    bare(rejected).should.include('[click](javascript:alert(1))', 'the rejected link lost its text');
    exported(rejected).should.equal('| [click](javascript:alert(1)) |');
    // A consumer's own validator is honoured the same way: no link, the text unchanged in both.
    const refused = cell('[click](http://a.b)', { validateLink: () => false });
    bare(refused).should.not.match(/<a\s/);
    exported(refused).should.equal('| [click](http://a.b) |');
    // An accepted link keeps its address as written, in the HTML and in the export.
    const accepted = cell('[click](http://a.b)', {});
    bare(accepted).should.match(/<a[^>]*href="http:\/\/a\.b"/);
    exported(accepted).should.equal('| [click](http://a.b) |');
  });
  // Raw HTML in a cell, or in a link label, reaches the export verbatim — pre-existing, and the README
  // says so; pinned because this branch widened how much of the label is exported.
  it('inline markup in a cell is exported as written, HTML included', () => {
    const exported = (body) => {
      const html = MM.markdownToHTML('\\begin{tabular}{l}\n' + body + ' \\\\\n\\end{tabular}',
        { outMath: { include_svg: false, include_table_markdown: true } });
      return MM.parseMarkdownByHTML(html, false).find((p) => p.type === 'table-markdown').value.split('\n')[0];
    };
    exported('<b onx="1">plain</b> tail').should.equal('| <b onx="1">plain</b> tail |');
    exported('[<b onx="1">lab</b> more](http://u.tld/a) tail')
      .should.equal('| [<b onx="1">lab</b> more](http://u.tld/a) tail |');
  });
  it('a link cell holds the href alone', () => {
    plain('[**bold** x](http://a.b)', 'tsv').should.equal('http://a.b');
    plain('[**bold** x](http://a.b)', 'csv').should.equal('http://a.b');
  });
  it('an image cell holds the src alone, not alt glued to src', () => {
    plain('![alt](i.png)', 'tsv').should.equal('i.png');
    plain('![alt](i.png)', 'csv').should.equal('i.png');
  });
  it('text around a link survives on both sides', () => {
    plain('text before [l](http://a.b) after', 'tsv').should.equal('text before http://a.b after');
  });
  // A leaf run is exported through a token literal that carries no `type`, so the `subTabular` quoting
  // branch never sees it. Identical either way on every shape tried; pinned so a change is deliberate.
  // The `lstlisting` case is here because that rule writes `tsv` onto a childless token — the one kind
  // that could reach the branch — and a comma in its body is what quoting would show.
  it('a leaf run in a nested cell exports as measured', () => {
    const exported = (inner) => {
      const html = MM.markdownToHTML('\\begin{tabular}{|l|l|}\nA & \\begin{tabular}{l}'
        + inner + '\\end{tabular} \\\\\n\\end{tabular}',
        { outMath: { include_svg: false, include_tsv: true, include_csv: true } });
      const all = (kind) => (html.match(new RegExp('<' + kind + '[^>]*>([\\s\\S]*?)</' + kind + '>', 'g')) || [])
        .map((one) => one.replace(/<[^>]*>/g, ''));
      return { tsv: all('tsv'), csv: all('csv') };
    };
    const list = exported('\\begin{itemize}\\item x, y\\end{itemize}');
    list.tsv.should.deep.equal(['A\t • x, y']);
    list.csv.should.deep.equal(['A," • x, y"']);
    const listing = exported('\\begin{lstlisting}a, b\\end{lstlisting}');
    listing.tsv.should.deep.equal(['a, b', 'A\t"a, b"']);
    listing.csv.should.deep.equal(['"a, b"', 'A,"a, b"']);
  });
});

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
    ':smile:', '<b>h</b>', '$x$', '<smiles>CCO</smiles>', '![alt](p.png)'];
  KEEPS_ITS_MARKUP.forEach((body) => {
    it(`keeps its markup: ${body}`, () =>
      labelMd(`[${body}](http://x.y)`).should.equal(`| [${body}](http://x.y) |`));
  });
  it('what the label drops, it drops knowingly', () => {
    // No Markdown form for an underline; a link title has nowhere to go.
    labelMd('[\\underline{u}](http://x.y)').should.equal('| [u](http://x.y) |');
    labelMd('[a](http://x.y "t")').should.equal('| [a](http://x.y) |');
    // \textbf maps onto the Markdown marker rather than staying LaTeX.
    labelMd('[\\textbf{b}](http://x.y)').should.equal('| [**b**](http://x.y) |');
  });
});

// One document must not export two math syntaxes: a label used hardcoded `$` while the text beside
// it honoured the config, so a consumer with its own delimiters got `$…$` inside labels only.
describe('math in a label follows outMath.table_markdown:', () => {
  const cellMd = (body, tableMarkdown) => {
    const html = MM.markdownToHTML('\\begin{tabular}{|l|}\n' + body + '\n\\end{tabular}',
      { outMath: { include_svg: false, include_table_markdown: true, table_markdown: tableMarkdown } });
    return MM.parseMarkdownByHTML(html, false)
      .find((p) => p.type === 'table-markdown').value.split('\n')[0];
  };
  const configs = {
    'the default delimiters': [undefined, '$x^2$'],
    'configured delimiters': [{ math_inline_delimiters: ['\\(', '\\)'] }, '\\(x^2\\)'],
    'math_as_ascii': [{ math_as_ascii: true }, 'x^(2)'],
  };
  Object.entries(configs).forEach(([name, [tableMarkdown, math]]) => {
    it(`${name}: a label and the text beside it come out alike`, () => {
      cellMd('[see $x^2$ here](http://a.b)', tableMarkdown)
        .should.equal(`| [see ${math} here](http://a.b) |`);
      cellMd('see $x^2$ here', tableMarkdown).should.equal(`| see ${math} here |`);
    });
  });
  it('display math takes the cell delimiters, default or configured', () => {
    // `$…$` by default, per the documented option; `['$$','$$']` is how a caller keeps the block form.
    cellMd('[$$\\sum x$$](http://a.b)').should.equal('| [$\\sum x$](http://a.b) |');
    cellMd('[$$\\sum x$$](http://a.b)', { math_inline_delimiters: ['\\(', '\\)'] })
      .should.equal('| [\\(\\sum x\\)](http://a.b) |');
    cellMd('[$$\\sum x$$](http://a.b)', { math_inline_delimiters: ['$$', '$$'] })
      .should.equal('| [$$\\sum x$$](http://a.b) |');
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
  it('the label escapes what it must, and leaves source slices alone', () => {
    // A truncated label loses the whole link downstream, so `]` is escaped wherever it comes from —
    // raw markup included. Math and an image alt are exempt because they are source slices that
    // already carry their escapes; escaping again would double them (`a\]b` → `a\\\]b`).
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
    // Display math takes the cell delimiters, like the text beside it.
    label('[$$x^2$$](http://a.b)').should.equal('[$x^2$](http://a.b)');

    // The point of the delimiters: an exported math label reads back as a link, brackets and all.
    ['[$\\sqrt[3]{x}$](http://a.b)', '[$a]b$](http://a.b)', '[$\\frac{a}{b}$](http://a.b)'].forEach((src) => {
      const round = [];
      inner.inline.parse(label(src), inner, {}, round);
      const open = round.find((t) => t.type === 'link_open');
      chai.expect(open, 'label stopped being a link: ' + src).to.not.be.undefined;
      open.attrGet('href').should.equal('http://a.b');
    });
    label('[<i title="x]y">t</i>](http://a.b)').should.equal('[<i title="x\\]y">t</i>](http://a.b)');
    // The image survives whole; its alt is raw source, so its own escape is not doubled.
    label('[![a\\]b](i.png)](http://a.b)').should.equal('[![a\\]b](i.png)](http://a.b)');

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

// The two exported cell-export helpers, called directly: markdown-it normalizes a destination
// before it reaches mdHref, so the `<…>` branch is unreachable from a document and would otherwise
// never run in this suite.
describe('Cell-export helpers:', () => {
  it('mdHref picks the bare or the angle form and escapes inside it', () => {
    // Angle form: whitespace, either angle bracket, a backslash, or unbalanced parens.
    mdHref('a b').should.equal('<a b>');
    mdHref('a<b').should.equal('<a\\<b>');
    mdHref('a>b').should.equal('<a\\>b>');
    mdHref('a\\').should.equal('<a\\\\>');
    mdHref('a(b').should.equal('<a(b>');
    mdHref('a)b').should.equal('<a)b>');
    // Bare form: balanced parens and an ordinary URL need no wrapping.
    mdHref('a(b)c').should.equal('a(b)c');
    mdHref('http://x/y').should.equal('http://x/y');
    // A line break is invalid in either form, so it goes before the decision.
    mdHref('a\nb').should.equal('ab');
    mdHref('').should.equal('');
  });

  it('getMdMath uses one delimiter pair for inline and display alike', () => {
    getMdMath({ type: 'inline_math', content: 'x^2' }).should.equal('$x^2$');
    getMdMath({ type: 'math_block', content: 'x^2' }).should.equal('$x^2$');
    getMdMath({ type: 'inline_math', content: 'x^2' },
      { outMath: { table_markdown: { math_inline_delimiters: ['\\(', '\\)'] } } })
      .should.equal('\\(x^2\\)');
    // ascii_tsv alone must satisfy math_as_ascii, or a label and the text beside it diverge.
    getMdMath({ type: 'inline_math', content: 'x^2', ascii_tsv: 'x^(2)' },
      { outMath: { table_markdown: { math_as_ascii: true } } }).should.equal('x^(2)');
  });
});

// Both `\diagbox` readers built the inline-code index over the whole string per argument, twice per
// command: a line of them with a code span past it was `n^1.85`, 342 ms at 3200 against 31 here. The
// index is built once per source now, so the bound is a ratio against a plainly linear control.
describe('a line of \\diagbox with a code span past it scales linearly:', () => {
  const CONTROL_UNIT = '\\diagbox{a}{b} ';
  const medianMs = (src) => {
    MM.markdownToHTML(src, { outMath: { include_svg: false } });      // warm up
    const samples = [];
    for (let i = 0; i < 5; i++) {
      const started = performance.now();
      MM.markdownToHTML(src, { outMath: { include_svg: false } });
      samples.push(performance.now() - started);
    }
    return Math.max(samples.sort((a, b) => a - b)[2], 0.001);
  };
  const growthOf = (build, small, large) => medianMs(build(large)) / medianMs(build(small));
  // The same units without the code span: with none in the string the index build exits at once, so
  // this is the axis with the work in it divided by the axis without.
  const withCode = (n) => CONTROL_UNIT.repeat(n) + ' `c`';
  const plain = (n) => CONTROL_UNIT.repeat(n);
  it('grows no faster than the same line without one', function () {
    this.timeout(60000);
    // 0.9–1.2 measured, against 5.8–6.3 with the index rebuilt per argument.
    const relative = [0, 0, 0].map(() => growthOf(withCode, 200, 3200) / growthOf(plain, 200, 3200))
      .sort((a, b) => a - b)[1];
    relative.should.be.below(2.5, 'the code span costs more than the units do: ×' + relative.toFixed(2));
  });
});
