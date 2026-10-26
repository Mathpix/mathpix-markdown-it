const chai = require('chai');
chai.should();

const { buildTabularGrid } = require('../lib/markdown/md-block-rule/begin-tabular/grid-model');

// The plan on its own, without rendering. `covering[col]` counts the anchor row, so "one row left" means
// the span ends here — an off-by-one in that reaches the fixtures only as a diff of two 4 KB strings.
// A row is `{cells, targets}` as the parse leaves it: `targets[j]` is the column index `j` lands in. How
// many rows are left the plan counts itself, from the array it was given.
const cell = (mc = 0, mr = 0, prints = true) => ({ mc, mr, prints });
const row = (cells, targets) => ({ cells, targets });
// The parse reports a target one past the last cell as well — that is where padding starts.
const plain = (n) => row(
  Array.from({ length: n }, () => cell()),
  Array.from({ length: n + 1 }, (_, j) => j));
// `col/colspan/rowspan` per cell, `-` for one added to fill a column, `x` for one with no room.
const shape = (planned) => planned.cells
  .map((c) => (c.dropped ? 'x' : (c.index < 0 ? '-' : '') + c.col + '/' + c.colspan + '/' + c.rowspan))
  .join(' ');
const shapes = (grid) => grid.map((r) => (r.collapsed ? 'collapsed' : shape(r)));

describe('buildTabularGrid: the plan, read without rendering', () => {
  it('places plain cells one per column', () => {
    shapes(buildTabularGrid(3, [plain(3)])).should.deep.equal(['0/1/0 1/1/0 2/1/0']);
  });
  it('pads a row that has fewer cells than the table has columns', () => {
    shapes(buildTabularGrid(3, [plain(1)])).should.deep.equal(['0/1/0 -1/1/0 -2/1/0']);
  });
  it('a `\\multicolumn` starts where its span ends, minus its width', () => {
    shapes(buildTabularGrid(3, [row([cell(2)], [1, 2, 3])]))
      .should.deep.equal(['0/2/0 -2/1/0']);
  });
  it('a span of three covers its own row and the two below it', () => {
    const grid = buildTabularGrid(2, [
      row([cell(0, 3), cell()], [0, 1, 2]),
      plain(2),
      plain(2),
    ]);
    shapes(grid).should.deep.equal(['0/1/3 1/1/0', 'x 1/1/0', 'x 1/1/0']);
  });
  it('takes only the rows the table has, whatever the span prints', () => {
    // Two fields: `source` prints the depth asked for, `claimed` is what the grid gave it.
    const grid = buildTabularGrid(2, [row([cell(0, 9), cell()], [0, 1]), plain(2)], { lines: 2 });
    shapes(grid).should.deep.equal(['0/1/9 1/1/0', 'x 1/1/0']);
    grid[0].cells[0].claimed.should.equal(2);
    // No `lines`: the rows given stand in, so a caller that omits it still gets the clamp.
    buildTabularGrid(2, [row([cell(0, 9), cell()], [0, 1]), plain(2)])[0].cells[0].claimed.should.equal(2);
  });
  it('a count of one covers this row and nothing below it', () => {
    shapes(buildTabularGrid(2, [row([cell(0, 1), cell()], [0, 1]), plain(2)]))
      .should.deep.equal(['0/1/1 1/1/0', '0/1/0 1/1/0']);
  });
  describe('source', () => {
    it('a clip shortens what the span takes, not the width it prints', () => {
      const grid = buildTabularGrid(3, [
        row([cell(0, 2), cell(), cell()], [0, 1, 2]),
        row([cell(3)], [2, 3]),
      ]);
      // Column 0 is held: the span gets two columns and prints three, which is the overlap `strict`
      // exists to remove. The clip is read off the first column alone, as it always has been.
      shapes(grid).should.deep.equal(['0/1/2 1/1/0 2/1/0', '1/3/0']);
      grid[1].cells[0].covers.should.equal(2);
    });
    it('leaves a fully covered row with no cells at all', () => {
      const grid = buildTabularGrid(2, [
        row([cell(2, 2)], [1, 2]),
        row([cell(0, 0, false), cell(0, 0, false)], [0, 1]),
      ]);
      shapes(grid).should.deep.equal(['0/2/2', 'x x']);
    });
  });
  describe('strict', () => {
    const strict = { strict: true };
    it('drops a fully covered row that prints nothing, and the span loses that row', () => {
      const grid = buildTabularGrid(2, [
        row([cell(2, 2)], [1, 2]),
        row([cell(0, 0, false), cell(0, 0, false)], [0, 1]),
      ], strict);
      grid[1].collapsed.should.equal(true);
      grid[0].cells[0].rowspan.should.equal(0);
    });
    it('prints no more rows than the table has left', () => {
      shapes(buildTabularGrid(2, [row([cell(0, 9), cell()], [0, 1])], strict))
        .should.deep.equal(['0/1/1 1/1/0']);
    });
    it('takes the slot from a span when the row writes into it', () => {
      const grid = buildTabularGrid(2, [
        row([cell(0, 2), cell()], [0, 1]),
        plain(2),
      ], strict);
      shapes(grid).should.deep.equal(['0/1/0 1/1/0', '0/1/0 1/1/0']);
    });
    it('takes it for any column the cell asks for, not only the one it ends on', () => {
      const grid = buildTabularGrid(3, [
        row([cell(0, 2), cell(), cell()], [0, 1, 2]),
        row([cell(2), cell()], [1, 2]),
      ], strict);
      // Column 0 is held and column 1 is free; the two-column cell still keeps its width.
      shapes(grid).should.deep.equal(['0/1/0 1/1/0 2/1/0', '0/2/0 2/1/0']);
    });
    it('clips a span to the free columns next to the one it ends on', () => {
      const grid = buildTabularGrid(3, [
        row([cell(), cell(0, 3), cell()], [0, 1, 2, 3]),
        row([cell(3, 0, false)], [2, 3]),
        row([cell()], [0, 1]),
      ], strict);
      // Column 1 stays held, so the span keeps column 2 alone and column 0 gets a cell of its own.
      shapes(grid).should.deep.equal(['0/1/0 1/1/3 2/1/0', '-0/1/0 2/1/0', '0/1/0 -2/1/0']);
    });
    it('the last row of a span is free again, where source still reads it as held', () => {
      // A span of two in column 1 covers rows 0 and 1; row 2 has a cell for column 0 only, so column 1
      // is padded — `source` counts that last row as held and leaves the row a column short.
      const rows = () => [
        row([cell(), cell(0, 2)], [0, 1, 2]),
        row([cell()], [0, 1]),
        row([cell()], [0, 1]),
      ];
      shapes(buildTabularGrid(2, rows(), strict))
        .should.deep.equal(['0/1/0 1/1/2', '0/1/0', '0/1/0 -1/1/0']);
      shapes(buildTabularGrid(2, rows()))
        .should.deep.equal(['0/1/0 1/1/2', '0/1/0', '0/1/0']);
    });
  });
});
