const assert = require('assert');
const { MathpixMarkdownModel: MM } = require('../lib');
const { applyCanvasProfile, HIDDEN_SOURCE_TAGS: HIDDEN } = require('../lib/markdown/canvas');

/**
 * Canvas takes no stylesheet, so every class whose rule carries layout has to travel inline.
 * The list is the contract: a class added to the stylesheet without an inline counterpart is a
 * silent regression — the markup survives a Canvas page while the layout does not.
 */
const STRUCTURAL_CLASSES = [
  'main-title', 'author', 'abstract', 'section-title',
  'math-block', 'math-inline', 'figure_img', 'table_tabular', 'tabular',
  'li_level', 'li_itemize', 'li_enumerate',
];

/** Written by mmd but absent from the Canvas allowlist, so a Canvas page would drop them. */
const STRIPPED_BY_CANVAS = [
  'word-break', 'text-decoration-thickness', 'box-sizing',
  'padding-inline-start', 'page-break-after', 'page-break-inside',
  /** Canvas keeps these only inside the shorthand they fold into. */
  'background-size', 'background-image', 'text-decoration-style', 'font-weight',
];

/**
 * Hidden copies of the source. Canvas unwraps them and their payload becomes visible body text.
 * Taken from the profile itself so the two cannot drift apart.
 */
const HIDDEN_SOURCE_TAGS = Object.keys(HIDDEN);

const CORPUS = [
  '\\title{Paper title}',
  '\\author{Jane Doe\\\\Some University}',
  '',
  '\\begin{abstract}',
  'Abstract text.',
  '\\end{abstract}',
  '',
  '\\section{Section}',
  '',
  'Inline \\( a \\quad b \\) and display:',
  '',
  '$$ x^2 $$',
  '',
  '\\begin{itemize}',
  '\\item one',
  '\\begin{itemize}',
  '\\item nested',
  '\\end{itemize}',
  '\\end{itemize}',
  '',
  '\\begin{enumerate}',
  '\\item[a)] custom marker',
  '\\end{enumerate}',
  '',
  '| a | b |',
  '| --- | --- |',
  '| 1 | 2 |',
  '',
  'A table keeps consuming rows across a blank line, so the aligned one needs a paragraph first.',
  '',
  '| left | centre | right |',
  '| :--- | :----: | ----: |',
  '| 1 | 2 | 3 |',
  '',
  '\\begin{tabular}{|l|c|}',
  '\\hline',
  'H & V \\\\',
  '\\hline',
  '\\end{tabular}',
  '',
  '<smiles>CCO</smiles>',
  '',
  '~~struck~~ and https://example.com/a-very-long-url-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  '',
  '![a labelled chart](https://cdn.mathpix.com/a.jpg?height=294&width=793&top_left_y=1953&top_left_x=1154)',
  '',
  '\\begin{figure}',
  '\\includegraphics{https://cdn.mathpix.com/a.jpg}',
  '\\caption{A figure}',
  '\\end{figure}',
  '',
  '[call](tel:+15551234567) and [write](mailto:someone@example.com)',
  '',
  '<h1>Raw HTML heading</h1>',
  '',
  '<h2 align="center">Raw centred heading</h2>',
  '',
  '<div style="background-image: url(data:image/png;base64,iVBORw0KGgo=); background-size: 100% 100%;">cell</div>',
  '',
  '\\uwave{wavy underline}',
  '',
  '\\sout{struck out} and \\xout{crossed out}',
  '',
  '<span style="font-weight: bold">raw bold</span>',
  '',
  '\\begin{equation}',
  'x^2',
  '\\end{equation}',
  '',
  '\\begin{tabular}{|l|l|}',
  '\\hline',
  '\\diagbox{A}{B} & x \\\\',
  '\\hline',
  '\\end{tabular}',
].join('\n');

/**
 * Every include_* flag on, so the profile is proven not to depend on what the caller passes.
 * `include_svg` matters most: chemistry has to reach Canvas as source even when SVG is asked for.
 */
const ALL_INCLUDES = {
  include_mathml: true, include_mathml_word: true, include_asciimath: true,
  include_latex: true, include_speech: true, include_tsv: true, include_csv: true,
  include_table_markdown: true, include_smiles: true, include_mol: true, include_svg: true,
};

const renderCanvas = () => MM.markdownToCanvasHTML(CORPUS, {
  htmlTags: true,
  width: 1200,
  lineNumbering: false,
  outMath: { ...ALL_INCLUDES },
  accessibility: { assistiveMml: false },
});

describe('Canvas profile', () => {
  let html;
  let warnings;
  before(() => { ({ html, warnings } = renderCanvas()); });

  it('gives every structural class an inline style', () => {
    /** Split the attribute rather than match the name: `\b` would read `inline-tabular` as `tabular`. */
    const seen = new Map();
    for (const tag of html.match(/<[a-z][a-z0-9]*\b[^>]*>/g) || []) {
      const attr = /\sclass="([^"]*)"/.exec(tag);
      if (!attr) {
        continue;
      }
      const styled = /\sstyle="/.test(tag);
      for (const cls of attr[1].trim().split(/\s+/)) {
        if (!cls) {
          continue;
        }
        const counts = seen.get(cls) || { total: 0, styled: 0 };
        counts.total++;
        if (styled) {
          counts.styled++;
        }
        seen.set(cls, counts);
      }
    }
    const problems = [];
    for (const cls of STRUCTURAL_CLASSES) {
      const counts = seen.get(cls);
      /** A class the corpus never produces is not proof of anything, so the corpus has to cover it. */
      if (!counts) {
        problems.push(`${cls}: the corpus never produces it`);
        continue;
      }
      if (counts.styled < counts.total) {
        problems.push(`${cls}: ${counts.total - counts.styled} of ${counts.total} carry no style`);
      }
    }
    assert.deepStrictEqual(problems, []);
  });

  it('emits no property Canvas strips', () => {
    const found = STRIPPED_BY_CANVAS.filter(p => html.includes(p));
    assert.deepStrictEqual(found, [], `stripped by Canvas: ${found.join(', ')}`);
  });

  it('emits no hidden copy of the source', () => {
    const found = HIDDEN_SOURCE_TAGS.filter(t => new RegExp(`<${t}[ >]`).test(html));
    assert.deepStrictEqual(found, [], `would become visible text: ${found.join(', ')}`);
  });

  it('emits no svg, script or mjx element', () => {
    assert.ok(!/<svg[ >]/.test(html), 'svg is deleted with its contents by Canvas');
    assert.ok(!/<script[ >]/.test(html), 'script is deleted by Canvas');
    assert.ok(!/<mjx-/.test(html), 'mjx elements are unwrapped by Canvas');
  });

  it('leaves no h1, including one written as raw HTML', () => {
    assert.ok(!/<h1[ >]/.test(html), 'a document h1 duplicates the Canvas page title');
  });

  it('emits no element or attribute Canvas replaces', () => {
    assert.ok(!/<s[ >]/.test(html), 'Canvas allows del and strike but not s');
    assert.ok(!/<mspace[^>]*(width|height|depth)=/.test(html), 'Canvas drops mspace sizing');
    /** Canvas strips `rel` on save and writes its own back, so omitting it only causes a diff. */
    assert.ok(/\srel="noopener"/.test(html), 'a link keeps the rel Canvas would re-add anyway');
    assert.ok(!/<table[^>]*\salign=/.test(html), 'Canvas does not allow align on a table');
    assert.ok(!/\snumber=/.test(html), 'Canvas keeps no `number` attribute');
    assert.ok(/<strong[ >]/.test(html), 'Canvas has no font-weight, so bold has to be an element');
  });

  it('leaves every URL intact', () => {
    const urls = [...html.matchAll(/(?:href|src)="([^"]*)"/g)].map(match => match[1]);
    const withQuery = urls.filter(url => url.includes('?'));
    assert.ok(withQuery.length > 0, 'the corpus must exercise a query string');
    const decoded = withQuery.filter(url => /[←-⋿]/.test(url));
    assert.deepStrictEqual(decoded, [], `an entity was decoded inside: ${decoded.join(', ')}`);
    const schemed = urls.filter(url => /^[a-z]+:/i.test(url));
    const dropped = schemed.filter(url => !/^(https?|ftp|mailto|tel):/i.test(url));
    assert.deepStrictEqual(dropped, [], `Canvas keeps no such scheme: ${dropped.join(', ')}`);
  });

  /** A scheme the sanitizer does not know is removed silently, taking the whole href with it. */
  it('keeps the links whose scheme Canvas allows', () => {
    for (const scheme of ['tel:', 'mailto:']) {
      assert.ok(html.includes(`href="${scheme}`), `the ${scheme} link lost its href`);
    }
  });

  /** Canvas rejects these sub-properties by name, so they have to travel inside the shorthand. */
  it('folds a rejected sub-property into the shorthand Canvas allows', () => {
    assert.ok(/text-decoration:\s*underline wavy/.test(html), 'the wavy underline went flat');
    assert.ok(/background:[^"]*\/[^"]*no-repeat/.test(html), 'the diagonal cell lost its diagonal');
  });

  /** `align` survives only on the elements the Canvas allowlist names; elsewhere it is dropped. */
  it('replaces an `align` Canvas drops with the equivalent declaration', () => {
    assert.ok(!/<h[1-6][^>]*\salign=/.test(html), 'a heading kept an align Canvas would drop');
    assert.ok(/<h[1-6][^>]*text-align:\s*center/.test(html), 'the centred heading lost its centring');
    const table = applyCanvasProfile('<table align="center"><tr><td>x</td></tr></table>');
    assert.ok(/margin-left:auto/.test(table), `a table is placed by margin, not text: ${table}`);
    const cell = applyCanvasProfile('<td align="center">x</td>');
    assert.ok(cell.includes('align="center"'), `Canvas keeps align on a cell: ${cell}`);
  });

  /**
   * The shorthand resets every sub-property it does not name, so folding beside one of them would
   * silently drop it — a background colour, in this case, which nothing in the output would show.
   */
  it('does not fold a shorthand over a sub-property it would reset', () => {
    const coloured = applyCanvasProfile(
      '<td style="background-color: yellow; background-size: 100% 100%; background-image: linear-gradient(a,b);">x</td>'
    );
    assert.ok(coloured.includes('background-color:yellow'), `the colour was reset: ${coloured}`);
    const shorthand = applyCanvasProfile(
      '<td style="background: red; background-image: linear-gradient(a,b); background-size: 100% 100%;">x</td>'
    );
    assert.ok(/background:red/.test(shorthand), `the colour was reset: ${shorthand}`);
  });

  /** A shorthand declared after the sub-property has already reset it; folding would bring it back. */
  it('folds text-decoration only when the shorthand comes first', () => {
    const first = applyCanvasProfile('<span style="text-decoration: underline; text-decoration-style: wavy;">u</span>');
    assert.ok(/text-decoration:underline wavy/.test(first), first);
    const later = applyCanvasProfile('<span style="text-decoration-style: wavy; text-decoration: underline;">u</span>');
    assert.ok(!/underline wavy/.test(later), `a style the cascade had dropped came back: ${later}`);
    const already = applyCanvasProfile('<span style="text-decoration: underline wavy; text-decoration-style: dotted;">u</span>');
    assert.ok(!/wavy dotted/.test(already), `two styles make the declaration invalid: ${already}`);
  });

  it('promotes bold to `strong` whatever the case of the declaration', () => {
    assert.ok(/<strong/.test(applyCanvasProfile('<span style="FONT-WEIGHT: BOLD">b</span>')));
    assert.ok(!/<strong/.test(applyCanvasProfile('<span style="font-weight: normal">b</span>')));
  });

  /** Weight travels as an element, so where the element cannot be replaced the caller is told. */
  it('reports bold it could not carry', () => {
    const { warnings } = MM.markdownToCanvasHTML('<p style="font-weight:bold">w</p>', {
      htmlTags: true, width: 1200, lineNumbering: false,
    });
    assert.strictEqual(warnings.boldDropped, 1);
  });

  /** Cell borders and padding are descendant rules; without them a table arrives as bare text. */
  it('gives every cell the grid its stylesheet rule carries', () => {
    const cells = html.match(/<t[dh]\b[^>]*>/g) || [];
    assert.ok(cells.length > 0, 'the corpus must exercise a table');
    const unstyled = cells.filter(cell => !/padding/.test(cell) || !/border/.test(cell));
    assert.deepStrictEqual(unstyled, [], `${unstyled.length} cells carry no grid`);
  });

  /**
   * markdown-it writes the column alignment into the same attribute, without a closing `;`, so a
   * default joined on carelessly runs into it and the whole attribute is dropped as unparsable.
   */
  it('keeps both the column alignment and the defaults on an aligned cell', () => {
    const aligned = (html.match(/<t[dh]\b[^>]*>/g) || []).filter(cell =>
      /text-align:\s*right/.test(cell)
    );
    assert.ok(aligned.length > 0, 'the corpus must exercise an aligned column');
    for (const cell of aligned) {
      assert.ok(/border/.test(cell) && /padding/.test(cell), `alignment ate the defaults: ${cell}`);
      /** The document's own alignment has to come last, or the header default would win. */
      assert.ok(
        cell.lastIndexOf('text-align:right') > cell.indexOf('text-align:center'),
        `the default alignment overrode the column: ${cell}`
      );
    }
  });

  /**
   * A stylesheet rule is not the whole cascade: a nested list keeps the indentation of the base
   * rule, and a custom-marker item is block because the renderer's own declaration beats its class.
   */
  it('inlines what the cascade computes, not one rule of it', () => {
    const lists = html.match(/<ul[^>]*class="itemize"[^>]*>/g) || [];
    assert.ok(lists.length > 1, 'the corpus must exercise a nested list');
    const unindented = lists.filter(list => !/padding-left/.test(list));
    assert.deepStrictEqual(unindented, [], 'a nested list lost its indentation');
    const custom = html.match(/<li[^>]*not_number[^>]*>/g) || [];
    assert.ok(custom.length > 0, 'the corpus must exercise a custom marker');
    const inline = custom.filter(item => /display:\s*inline-block/.test(item));
    assert.deepStrictEqual(inline, [], 'custom-marker items would render on one line');
  });

  /** Canvas deletes the drawing, so the structure has to reach the page as its source. */
  it('keeps chemistry as its source', () => {
    assert.ok(/class="smiles-source"/.test(html), 'the SMILES source is gone');
    assert.ok(html.includes('CCO'), 'the structure left no trace at all');
  });

  /** `ol` is the only element whose `type` the Canvas attribute allowlist carries. */
  it('keeps `type` only where Canvas keeps it', () => {
    assert.ok(applyCanvasProfile('<ol type="a"><li>x</li></ol>').includes('type="a"'));
    assert.ok(!/\stype=/.test(applyCanvasProfile('<li type="a">x</li>')), 'Canvas strips type on li');
  });

  it('drops a hidden source copy written as raw HTML', () => {
    for (const tag of HIDDEN_SOURCE_TAGS) {
      const out = applyCanvasProfile(`<p>a</p><${tag}>payload</${tag}><p>b</p>`);
      assert.strictEqual(out, '<p>a</p><p>b</p>', `<${tag}> payload became body text`);
    }
  });

  /** htmlparser2 decodes a named entity without its semicolon; a browser's parser does not. */
  it('keeps a query string whose parameter starts a named entity', () => {
    const url = 'https://cdn.mathpix.com/b.jpg?height=1&top_left_y=3&notin=4';
    const out = applyCanvasProfile(`<img src="${url}">`);
    assert.ok(out.includes('top_left_y=3'), `a parameter was decoded away: ${out}`);
    assert.ok(out.includes('notin=4'), `a parameter was decoded away: ${out}`);
  });

  it('keeps a value that carries the declaration separator', () => {
    const tag = html.match(/<div[^>]*background[^>]*>/);
    assert.ok(tag, 'the corpus must exercise a data URI inside a style');
    assert.ok(tag[0].includes('base64,iVBORw0KGgo='), `a url() was split at its own ";": ${tag[0]}`);
  });

  /**
   * Not asserted yet. mmd gives the abstract a fixed `h4` while `\section` is `h2`, and the shift
   * is a flat +1, so a document without an `h1` starts below the Canvas page title. Canvas's own
   * accessibility check reports both. Left as it is for now, deliberately.
   */

  /** The result type is only usable if the package root exposes it alongside the cap it reports. */
  it('exposes the page cap from the package root', () => {
    assert.strictEqual(require('../lib').CANVAS_PAGE_BODY_LIMIT, 500 * 1024 - 1);
  });

  /** What the caller has to know before the result reaches a page it cannot fix afterwards. */
  it('reports what a Canvas page would object to', () => {
    assert.strictEqual(warnings.overPageLimit, false, 'the corpus fits a Canvas page');
    assert.ok(warnings.bytes > html.length / 2, 'bytes are measured, not characters');
    assert.strictEqual(warnings.chemistry, 1, 'one structure degraded to its source');
    assert.strictEqual(warnings.imagesWithoutAlt, 1, 'the corpus image carries no alt');
    const big = MM.markdownToCanvasHTML('x '.repeat(300000), { width: 1200, lineNumbering: false });
    assert.strictEqual(big.warnings.overPageLimit, true, 'a page over the cap is not reported');
  });

  /** Canvas unwraps a document's `head`, which would leave the `<title>` text on the page. */
  it('returns a fragment even when a document wrapper is asked for', () => {
    const { html: wrapped } = MM.markdownToCanvasHTML('text', {
      htmlTags: true, width: 1200, lineNumbering: false, htmlWrapper: true,
      accessibility: { assistiveMml: false },
    });
    assert.ok(!/<html[ >]/.test(wrapped), 'a Canvas page takes a fragment, not a document');
    assert.ok(!/Title/.test(wrapped), 'the wrapper title would become visible body text');
  });

  it('keeps the defaults untouched', () => {
    const plain = MM.markdownToHTML(CORPUS, {
      htmlTags: true, width: 1200, lineNumbering: false,
      outMath: { output_format: 'mathml' }, accessibility: { assistiveMml: false },
    });
    assert.ok(/<h1[ >]/.test(plain), 'markdownToHTML leaves the raw h1 an h1');
    assert.ok(!/smiles-source/.test(plain), 'markdownToHTML still renders chemistry');
    const wrapped = MM.markdownToHTML('text', {
      htmlTags: true, width: 1200, lineNumbering: false, htmlWrapper: true,
      accessibility: { assistiveMml: false },
    });
    assert.ok(/<html[ >]/.test(wrapped), 'markdownToHTML still wraps a document');
  });
});
