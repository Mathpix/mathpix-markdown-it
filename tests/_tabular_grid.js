const chai = require('chai');
chai.should();

const MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;
const { gridProblems: checkGrid } = require('./_data/_tabular/_grid_invariant');
const { JSDOM } = require('jsdom');
const jsdom = new JSDOM();
global.window = jsdom.window;
global.document = jsdom.window.document;
global.DOMParser = jsdom.window.DOMParser;

const TABU = '\\begin{tabular}{|l|l|l|l|l|} \\hline\n';
const CELL = '\\begin{tabular}{|l|}\\hline c \\\\ \\hline\\end{tabular}';

// What a consumer finds in each shape, per mode: `[]` means it can build the table. `strict` is `[]`
// everywhere — that is the contract. `source` is not, and what it leaves is pinned here rather than
// described in prose: a row with no cells, and a slot two cells claim because a clipped span keeps its
// right edge instead of moving onto the free run.
const shapes = {
  'colspan over three covered columns': [
    TABU + 'A & B & \\multicolumn{3}{|l|}{\\multirow{2}{*}{MR}} \\\\ \\hline\n'
      + '\\multicolumn{3}{|l|}{X} \\\\ \\hline\n\\end{tabular}', []],
  'two rowspans then a wide colspan': [
    '\\begin{tabular}{|l|l|l|l|} \\hline\n'
      + '\\multirow{2}{*}{P} & \\multirow{2}{*}{Q} & C & D \\\\ \\hline\n'
      + '\\multicolumn{4}{|l|}{Z} \\\\ \\hline\n\\end{tabular}', []],
  'reported shape: multirow nested in multicolumn': [
    TABU + '\\multicolumn{5}{|l|}{H} \\\\ \\hline\n'
      + '\\multirow{2}{*}{Image} & B & \\multicolumn{3}{|l|}{\\multirow{2}{*}{MR}} \\\\ \\hline\n'
      + '& \\multicolumn{4}{|l|}{mc 4} \\\\ \\hline\n\\end{tabular}', []],
  'a clipped span keeping its right edge covers a carried slot': [
    '\\begin{tabular}{|l|l|l|} \\hline\n'
      + 'a & \\multirow{2}{*}{M} & c \\\\ \\hline\n'
      + '\\multicolumn{3}{|l|}{W} \\\\ \\hline\n\\end{tabular}', ['table 0 row 1: column 1 taken twice']],
  'all-covered continuation row': [
    TABU + '\\multirow{2}{*}{Image} & \\multicolumn{4}{|c|}{\\multirow{2}{*}{MR}} \\\\ \\hline\n'
      + '& & & & \\\\ \\hline\nA & \\multicolumn{4}{|l|}{B} \\\\ \\hline\n\\end{tabular}',
    ['table 0 row 1: no cells']],
  'rowspan longer than the table': [
    '\\begin{tabular}{|l|l|} \\hline\n\\multirow{5}{*}{X} & B \\\\ \\hline\n'
      + '& C \\\\ \\hline\n\\end{tabular}', []],
  'multirow with no continuation row': [
    '\\begin{tabular}{|l|l|} \\hline\n\\multirow{2}{*}{X} & B \\\\ \\hline\n\\end{tabular}', []],
  'plain table, no spans': [
    '\\begin{tabular}{|l|l|} \\hline\nA & B \\\\ \\hline\nC & D \\\\ \\hline\n\\end{tabular}', []],
  'valid spans': [
    '\\begin{tabular}{|l|l|l|} \\hline\n'
      + '\\multirow{2}{*}{X} & \\multicolumn{2}{|l|}{Y} \\\\ \\hline\n'
      + '& A & B \\\\ \\hline\n\\end{tabular}', []],
  'nested tabular in a spanned cell': [
    TABU + '\\multirow{2}{*}{Image} & B & \\multicolumn{3}{|l|}{\\multirow{2}{*}{' + CELL + '}} \\\\ \\hline\n'
      + '& \\multicolumn{4}{|l|}{tail} \\\\ \\hline\n\\end{tabular}', []],
};

// `console.warn` captured rather than printed: the last test asserts nothing is written to it.
const renderMuted = (latex, mode) => {
  const warn = console.warn;
  const seen = [];
  console.warn = (...args) => seen.push(args.join(' '));
  try {
    return {
      html: MM.markdownToHTML(latex,
        { htmlTags: true, outMath: { include_svg: false }, tabularGridMode: mode }),
      seen,
    };
  } finally {
    console.warn = warn;
  }
};
const problems = (latex, mode) => checkGrid(renderMuted(latex, mode).html, new global.DOMParser());

describe('The grid a consumer can build:', () => {
  Object.entries(shapes).forEach(([name, [latex, inSource]]) => {
    it('strict builds ' + name, () => {
      problems(latex, 'strict').should.deep.equal([], 'strict left a grid a consumer cannot build');
    });
    it('source leaves what it has always left in ' + name, () => {
      problems(latex, 'source').should.deep.equal(inSource);
      problems(latex, undefined).should.deep.equal(inSource, 'no option is not the source mode');
    });
  });
});

describe('A clipped span keeps its cell:', () => {
  const [latex] = shapes['reported shape: multirow nested in multicolumn'];
  it('the clip narrows the span and leaves the content in place', () => {
    // Clipped from 4 to the one free column, with its text — the row is 5 wide either way, so the
    // invariant above cannot see a dropped or emptied cell.
    renderMuted(latex, 'source').html.should.include('colspan="1">mc 4</td>');
    renderMuted(latex, 'source').html.should.include('colspan="3" rowspan="2">MR</td>');
  });
});

describe('A clip is normalization, not a defect to report:', () => {
  const [latex] = shapes['reported shape: multirow nested in multicolumn'];
  it('nothing is written to the console', () => {
    renderMuted(latex, 'source').seen.should.have.length(0);
    renderMuted(shapes['valid spans'][0], 'strict').seen.should.have.length(0);
  });
});
