// The grid a CALS consumer needs, read off our HTML the way that consumer reads it: every row holds at
// least one cell, no cell reaches past the last column, no position is taken twice, no span runs past
// the last row, and every row is exactly as wide as the table. Nested tables are checked on their own.
//
// The column count comes from the markup — the widest row, spans counted — because that is all a
// consumer has. Shared by the fixture tests and the fuzz so the two cannot drift apart.

const cellsOf = (tr) => [...tr.children].filter((c) => /^t[dh]$/i.test(c.tagName));
// A span a browser would honour: anything not a positive number counts as one column or row.
const spanOf = (cell, name) => {
  const span = parseInt(cell.getAttribute(name) || '1', 10);
  return Number.isFinite(span) && span > 0 ? span : 1;
};

const colsOf = (rows) => {
  let max = 0;
  const carried = [];
  rows.forEach((tr) => {
    let width = carried.filter((c) => c > 0).length;
    let at = 0;
    cellsOf(tr).forEach((cell) => {
      const colspan = spanOf(cell, 'colspan');
      width += colspan;
      while (carried[at] > 0) { at++; }
      for (let k = 0; k < colspan; k++) { carried[at + k] = spanOf(cell, 'rowspan'); }
      at += colspan;
    });
    max = Math.max(max, width);
    for (let c = 0; c < carried.length; c++) { if (carried[c] > 0) { carried[c]--; } }
  });
  return max;
};

/** Every distinct problem in the rendered HTML, `[]` when a consumer can build every table in it.
 *  `parse` is a DOMParser, which the caller has set up with its own JSDOM. */
const gridProblems = (html, parse) => {
  const doc = parse.parseFromString('<body>' + html + '</body>', 'text/html');
  const problems = [];
  [...doc.querySelectorAll('table')].forEach((table, ti) => {
    const rows = [...table.querySelectorAll('tr')].filter((r) => r.closest('table') === table);
    const cols = colsOf(rows);
    const where = (ri) => 'table ' + ti + ' row ' + ri + ': ';
    let covered = new Array(cols).fill(0);
    rows.forEach((tr, ri) => {
      const cells = cellsOf(tr);
      const slots = covered.map((c) => (c > 0 ? 1 : 0));
      const fresh = new Array(cols).fill(0);
      let width = slots.reduce((a, b) => a + b, 0);
      let at = 0;
      if (cells.length === 0) {
        problems.push(where(ri) + 'no cells');
      }
      cells.forEach((cell) => {
        const colspan = spanOf(cell, 'colspan');
        const rowspan = spanOf(cell, 'rowspan');
        while (at < cols && slots[at]) { at++; }
        if (at + colspan > cols) {
          problems.push(where(ri) + 'past the last column, ' + (at + colspan) + ' > ' + cols);
        }
        for (let k = 0; k < colspan; k++) {
          if (at + k < cols) {
            if (slots[at + k]) { problems.push(where(ri) + 'column ' + (at + k) + ' taken twice'); }
            slots[at + k] = 1;
          }
        }
        if (rowspan > 1 && ri + rowspan > rows.length) {
          problems.push(where(ri) + 'rowspan ' + rowspan + ' past the last row');
        }
        for (let k = 0; k < colspan; k++) {
          if (rowspan > 1 && at + k < cols) { fresh[at + k] = rowspan - 1; }
        }
        width += colspan;
        at += colspan;
      });
      if (cells.length > 0 && width !== cols) {
        problems.push(where(ri) + 'width ' + width + ' against ' + cols);
      }
      covered = covered.map((c, i) => Math.max(c > 0 ? c - 1 : 0, fresh[i]));
    });
  });
  return [...new Set(problems)];
};

module.exports = { gridProblems };
