const chai = require('chai');
chai.should();

const crypto = require('crypto');
const MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;
const { gridProblems: checkGrid } = require('./_data/_tabular/_grid_invariant');
const { JSDOM } = require('jsdom');
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

// Seeded fuzz over overlapping spans. The fixtures pin what known shapes render to; this pins what no
// shape may produce in `strict` — a row without cells, a slot booked twice, a span past the last column
// or row, a row narrower than the table, a cell `source` kept and `strict` lost. Four defects came from
// here, none from a shape anyone would have written down: a clipped span keeping a held column, the last
// row of a span read as still held, a free column left with no cell, and a cell holding a nested tabular
// read as printing nothing.
//
// Deterministic: same seed, same tables, same run. A failure prints the source.
const SEED = 20260827;
const DEFAULT_TABLES = 400;
const TABLES = Number(process.env.TABULAR_FUZZ_TABLES) || DEFAULT_TABLES;
// What `source` renders for 200 tables whose spans fit, hashed. Nothing outside this repository pins
// that output, and two defects reached review because only an external build of the previous release
// could see them. A deliberate change to `source` updates this line; anything else has to explain
// itself. Independent of TABULAR_FUZZ_TABLES: the corpus it hashes is always the same 200.
const GOLDEN_TABLES = 200;
const GOLDEN_SOURCE = '3495ccf9a82d2c09840b2a749b5eb4870156d53602393370312795487b2e9a70';

let seed = SEED;
const next = (n) => {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed % n;
};

// What a cell may be, and how many columns it claims: every form real output carries — vertical
// brackets, a width instead of `*`, a span of one, degenerate and absurd counts, math, and a nested
// tabular whose own spans overlap.
const cellForms = (cols) => {
  const forms = [{ src: '', width: 1 }, { src: 'x', width: 1 }, { src: '\\multirow{1}{*}{r1}', width: 1 },
    { src: '\\multirow{2}{*}{}', width: 1 },
    { src: '\\multirow[t]{2}{4em}{bt}', width: 1 },
    { src: '\\multirow[b]{3}{*}{bb}', width: 1 },
    { src: '\\multirow{0}{*}{r0}', width: 1 },
    { src: '\\multirow{99}{*}{r99}', width: 1 },
    { src: '\\multicolumn{1}{|c|}{one}', width: 1 },
    { src: '\\multicolumn{0}{|l|}{zero}', width: 1 },
    { src: '\\multicolumn{-1}{|l|}{neg}', width: 1 },
    { src: '\\multicolumn{q}{|l|}{nan}', width: 1 },
    { src: '\\multicolumn{2.5}{|l|}{frac}', width: 1 },
    { src: '\\multirow{2.5}{*}{rfrac}', width: 1 },
    { src: '\\begin{tabular}{l}\nn \\\\ m\n\\end{tabular}', width: 1 },
    { src: '\\multicolumn{2}{c}{\\( x^2 \\)}', width: 2 },
    { src: '\\multicolumn{2}{|r|}{\\multirow[t]{2}{2cm}{\\begin{tabular}{l}\np\n\\end{tabular}}}', width: 2 },
    { src: '\\multicolumn{2}{|l|}{\\begin{tabular}{|l|l|}\n\\hline \\multicolumn{2}{|l|}{\\multirow{2}{*}{in}} \\\\\n\\hline & \\\\\n\\hline\n\\end{tabular}}', width: 2 }];
  for (let rowspan = 2; rowspan <= 3; rowspan++) {
    forms.push({ src: '\\multirow{' + rowspan + '}{*}{r' + rowspan + '}', width: 1 });
  }
  // One wider than the table too: the source is free to declare a span the grid has no room for.
  for (let colspan = 2; colspan <= cols + 1; colspan++) {
    forms.push({ src: '\\multicolumn{' + colspan + '}{|l|}{c' + colspan + '}', width: colspan });
  }
  for (let colspan = 2; colspan <= cols; colspan++) {
    for (let rowspan = 2; rowspan <= 3; rowspan++) {
      forms.push({ src: '\\multicolumn{' + colspan + '}{|l|}{\\multirow{' + rowspan + '}{*}{m' + colspan
        + 'r' + rowspan + '}}', width: colspan });
    }
  }
  return forms;
};

const buildTable = (cols, rowCount, bracket) => {
  const forms = cellForms(cols);
  const lines = [];
  for (let r = 0; r < rowCount; r++) {
    const cells = [];
    let width = 0;
    // A row may also come out one column short or one long, which is what OCR writes.
    const slack = next(3);
    const limit = cols + (slack === 2 ? 1 : 0) - (slack === 1 ? 1 : 0);
    while (width < limit) {
      const form = forms[next(forms.length)];
      cells.push(form.src);
      width += form.width;
    }
    lines.push(cells.join(' & '));
    // A row with no cells at all still becomes a `<tr>`, so a span has to count it.
    if (next(5) === 0) {
      lines.push('');
    }
  }
  return '\\begin{tabular}' + bracket + '{|' + 'l|'.repeat(cols) + '}\n\\hline '
    + lines.join(' \\\\\n\\hline ') + ' \\\\\n\\hline\n\\end{tabular}';
};

// A table whose spans fit: every span placed on free columns only, never past the last row, every row
// exactly as wide as the table and printing at least one cell of its own — what ordinary output looks
// like. A covered column keeps an empty cell, which is how the serializer writes a continuation row.
// Null when a row came out fully covered, the one shape `strict` is there to reconcile.
const buildFittingTable = (cols, rowCount, bracket) => {
  const covering = new Array(cols).fill(0);
  const lines = [];
  for (let r = 0; r < rowCount; r++) {
    const cells = [];
    let printed = 0;
    let c = 0;
    while (c < cols) {
      if (covering[c] > 0) {
        covering[c] -= 1;
        cells.push('');
        c += 1;
        continue;
      }
      // The free run starting here bounds how wide a span may be.
      let run = 0;
      while (c + run < cols && covering[c + run] === 0) { run++; }
      const colspan = 1 + next(run);
      const rowsLeft = rowCount - r;
      const rowspan = rowsLeft > 1 && next(3) === 0 ? 2 + next(rowsLeft - 1) : 1;
      const body = 'c' + r + '_' + c;
      let src = body;
      if (rowspan > 1) { src = '\\multirow{' + rowspan + '}{*}{' + src + '}'; }
      if (colspan > 1) { src = '\\multicolumn{' + colspan + '}{|l|}{' + src + '}'; }
      cells.push(src);
      printed++;
      for (let k = 0; k < colspan; k++) { covering[c + k] = rowspan - 1; }
      c += colspan;
    }
    if (!printed) {
      return null;
    }
    lines.push(cells.join(' & '));
    // A line of its own, only where no span crosses it: in `source` such a row fills every column,
    // the held ones included.
    if (next(5) === 0 && covering.every((left) => left === 0)) {
      lines.push('');
    }
  }
  return '\\begin{tabular}' + bracket + '{|' + 'l|'.repeat(cols) + '}\n\\hline '
    + lines.join(' \\\\\n\\hline ') + ' \\\\\n\\hline\n\\end{tabular}';
};

const render = (latex, mode, forPptx) => {
  const warn = console.warn;
  const error = console.error;
  console.warn = () => {};
  console.error = () => {};
  try {
    return MM.markdownToHTML(latex,
      { outMath: { include_svg: false }, tabularGridMode: mode, forPptx: !!forPptx });
  } finally {
    console.warn = warn;
    console.error = error;
  }
};

const gridProblems = (html) => checkGrid(html, new global.DOMParser());

// What `expected` has and `got` does not, counting repeats: two cells may carry the same content, and a
// set comparison would call a dropped one present.
const missingFrom = (expected, got) => {
  const rest = got.slice();
  const missing = [];
  expected.forEach((held) => {
    const at = rest.indexOf(held);
    if (at < 0) { missing.push(held); } else { rest.splice(at, 1); }
  });
  return missing;
};

// What every non-empty cell holds, so one mode can be checked for losing what the other keeps. Markup,
// not text: a cell carrying only an image has no text of its own. A cell wrapping a nested tabular is
// skipped — that table's own cells are counted, and its markup moves when the mode reconciles it.
const contentsOf = (html) => {
  const doc = new global.DOMParser().parseFromString('<body>' + html + '</body>', 'text/html');
  const contents = [];
  [...doc.querySelectorAll('td, th')].forEach((cell) => {
    if (cell.querySelector('table')) { return; }
    const held = cell.innerHTML.replace(/\s+/g, ' ').trim();
    if (held.length) { contents.push(held); }
  });
  return contents.sort();
};

describe('tabularGridMode: seeded fuzz over overlapping spans', () => {
  const tables = [];
  for (let i = 0; i < TABLES; i++) {
    tables.push(buildTable(2 + next(6), 2 + next(5), i % 2 ? '[t]' : ''));
  }

  it('strict leaves a grid a CALS consumer can build, for every generated table', function () {
    // ~2ms per table here; the margin is for a slower runner, not for the work.
    this.timeout(Math.max(10000, TABLES * 20));
    const failed = [];
    tables.forEach((latex) => {
      const problems = gridProblems(render(latex, 'strict'));
      if (problems.length) { failed.push(problems.join('; ') + '\n' + latex); }
    });
    failed.should.deep.equal([], failed.length + ' of ' + TABLES + ' tables left an unbuildable grid');
  });

  // `forPptx` decides differently for a line carrying no cells, so it needs its own sweep.
  it('and does so for pptx output too', function () {
    this.timeout(Math.max(10000, TABLES * 20));
    const failed = [];
    tables.forEach((latex) => {
      const problems = gridProblems(render(latex, 'strict', true));
      if (problems.length) { failed.push(problems.join('; ') + '\n' + latex); }
    });
    failed.should.deep.equal([], failed.length + ' of ' + TABLES + ' tables left an unbuildable grid');
  });

  it('source renders the same bytes it rendered when this line was written', function () {
    this.timeout(20000);
    let seedBefore = seed;
    seed = SEED;
    const hash = crypto.createHash('sha256');
    let built = 0;
    for (let i = 0; built < GOLDEN_TABLES && i < GOLDEN_TABLES * 10; i++) {
      const latex = buildFittingTable(2 + next(6), 2 + next(5), i % 2 ? '[t]' : '');
      if (!latex) { continue; }
      built++;
      hash.update(render(latex, 'source'));
    }
    built.should.equal(GOLDEN_TABLES, 'the generator produced too few tables whose spans fit');
    seed = seedBefore;
    hash.digest('hex').should.equal(GOLDEN_SOURCE,
      'source output moved; update GOLDEN_SOURCE only for a change you meant to make');
  });

  // What the mode costs an ordinary table: nothing. Spans that fit leave the two modes with the same
  // grid to render, so the option may not touch a byte.
  it('strict is byte-identical to source on tables whose spans fit', function () {
    this.timeout(Math.max(10000, TABLES * 40));
    const differed = [];
    let built = 0;
    for (let i = 0; built < TABLES && i < TABLES * 10; i++) {
      const latex = buildFittingTable(2 + next(6), 2 + next(5), i % 2 ? '[t]' : '');
      if (!latex) { continue; }
      built++;
      if (render(latex, 'source') !== render(latex, 'strict')) { differed.push(latex); }
    }
    built.should.be.above(TABLES / 2, 'the generator produced too few tables whose spans fit');
    differed.should.deep.equal([], differed.length + ' of ' + built
      + ' tables changed under strict; first:\n' + (differed[0] || ''));
  });

  it('strict keeps everything source keeps', function () {
    // Both modes rendered per table, so twice the budget above.
    this.timeout(Math.max(10000, TABLES * 40));
    const lost = [];
    tables.forEach((latex) => {
      const missing = missingFrom(contentsOf(render(latex, 'source')), contentsOf(render(latex, 'strict')));
      if (missing.length) { lost.push(missing.join(', ') + '\n' + latex); }
    });
    lost.should.deep.equal([], lost.length + ' of ' + TABLES + ' tables lost content in strict');
  });
});
