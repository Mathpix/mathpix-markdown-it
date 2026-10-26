const CELL = '<div  class="diagonal-cell" style="grid-template-columns: repeat(2, 1fr); padding: 0;'
  + ' display: inline-grid; background-size: 100% 100%; background-image: linear-gradient(to bottom';
const NE = CELL + ' left, transparent calc(50% - 0.5px), black 50%, black 50%, transparent calc(50% + 0.5px));">'
  + '<div  class="cell-item diagonal-cell-topRight" style="grid-row-start: 1; grid-column-start: 2;'
  + ' text-align: right; white-space: nowrap; min-height: 1.5em;">b</div>'
  + '<div  class="cell-item diagonal-cell-bottomLeft" style="grid-row-start: 2; grid-column-start: 1;'
  + ' text-align: left; white-space: nowrap; min-height: 1.5em; margin-top: auto;">a</div></div>';
const SW = CELL + ' right, transparent calc(50% - 0.5px), black 50%, black 50%, transparent calc(50% + 0.5px));">'
  + '<div  class="cell-item diagonal-cell-topLeft" style="grid-row-start: 1; grid-column-start: 1;'
  + ' text-align: left; white-space: nowrap; min-height: 1.5em;">a</div>'
  + '<div  class="cell-item diagonal-cell-bottomRight" style="grid-row-start: 2; grid-column-start: 2;'
  + ' text-align: right; white-space: nowrap; min-height: 1.5em; margin-top: auto;">b</div></div>';

module.exports = [
  {
    // The rule stands at `\alpha` and used to match the `\diagbox` further along, taking the text between.
    title: 'text between an earlier backslash and the diagbox survives',
    mmd: '\\alpha VISIBLE text \\diagbox{a}{b} tail',
    html: '<div>\\alpha VISIBLE text ' + NE + ' tail</div>',
  },
  {
    title: 'a backslash with no diagbox after it keeps its line',
    mmd: '\\alpha VISIBLE text tail',
    html: '<div>\\alpha VISIBLE text tail</div>',
  },
  {
    title: '\\diagbox at the position still renders',
    mmd: '\\diagbox{a}{b} tail',
    html: '<div>' + NE + ' tail</div>',
  },
  {
    title: '\\slashbox at the position still renders, and mirrors the diagonal',
    mmd: '\\slashbox{a}{b} tail',
    html: '<div>' + SW + ' tail</div>',
  },
  {
    title: '\\backslashbox at the position still renders',
    mmd: '\\backslashbox{a}{b} tail',
    html: '<div>' + NE + ' tail</div>',
  },
  // The arguments are read by offset in `src` now, so the position the rule ends at is absolute: added
  // to `state.pos` instead of assigned, it doubled and everything past the command went missing.
  {
    title: 'a code span after the diagbox keeps its place',
    mmd: '\\diagbox{a}{b} tail `c`',
    html: '<div>' + NE + ' tail <code>c</code></div>',
  },
  {
    title: 'two diagboxes on a line with a code span after them',
    mmd: '\\diagbox{a}{b} \\diagbox{a}{b} `c`',
    html: '<div>' + NE + ' ' + NE + ' <code>c</code></div>',
  },
  {
    title: 'a backtick inside an argument is content, and the tail survives',
    mmd: '\\diagbox{a`}{b} tail',
    html: '<div>' + NE.replace('>a</div>', '>a`</div>') + ' tail</div>',
  },
];
