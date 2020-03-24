module.exports = [
  {
    latex: '\\begin{tabular}{ l c r }\n' +
      '  1 & 2 & 3 \\\\\n' +
      '  4 & 5 & 6 \\\\\n' +
      '  7 & 8 & 9 \\\\\n' +
      '\\end{tabular}',
    tsv: '1\t2\t3\n4\t5\t6\n7\t8\t9',
  },
  {
    latex: '\\begin{tabular}{lcr}\n' +
      'a & b & c\\\\\n' +
      'aa & ab & ac\\\\\n' +
      'aaa & aab & aac\n' +
      '\\end{tabular}\n' +
      '\n' +
      'dere \\begin{tabular}{lcr}a & b & c\\\\aa & ab & ac\\\\aaa & aab & aac\\end{tabular}',
    tsv: '',
  },
  {
    latex: '\\begin{table}[h]\n' +
      '\\centering\n' +
      '\\begin{tabular}{ ||c: c|| c||: }\n' +
      '\\hhline\n' +
      '  {\\(cell^1\\)} & dd$$\\frac{\\nabla^{2} A}{A}=-k^{2}$$ dd & {cell3} \\\\ \\hdashline\n' +
      '  {\\(cell^4\\)} & {cell5} & \\(cell^6\\) \\\\  \\hline\\hline\n' +
      '  cell7 & {cell $f^f$ 8} & cell9\\\\\\hhline   \n' +
      '\\end{tabular}\n' +
      '\\caption{this is the table!}\n' +
      '\\label{table:6}\n' +
      '\\end{table}',
    tsv: 'cell^(1)\tdd(grad^(2)A)/(A)=-k^(2) dd\tcell3\n' +
      'cell^(4)\tcell5\tcell^(6)\n' +
      'cell7\tcell f^(f) 8\tcell9',
  },
  {
    latex: '\\begin{table}[h]\n' +
      '\\centering\n' +
      '\\begin{tabular}{ ||c: c|| c||: }\n' +
      '\\hhline\n' +
      '  {\\(cell^1\\)} & dd$$\\frac{\\nabla^{2} A}{A}=-k^{2}$$ dd & {cell3} \\\\ \\hdashline\n' +
      '  {\\(cell^4\\)} & {cell5} & \\(cell^6\\) \\\\  \\hline\\hline\n' +
      '  \\begin{tabular}{lcr}a & $b^2$ & c\\\\aa & ab & ac\\\\aaa & aab & aac\\end{tabular} & {cell $f^f$ 8} & cell9\\\\\\hhline   \n' +
      '\\end{tabular}\n' +
      '\\caption{this is the table!}\n' +
      '\\label{table:6}\n' +
      '\\end{table}',
    tsv: 'cell^(1)\tdd(grad^(2)A)/(A)=-k^(2) dd\tcell3\n' +
      'cell^(4)\tcell5\tcell^(6)\n' +
      'a,b^(2),c,aa,ab,ac,aaa,aab,aac\tcell f^(f) 8\tcell9',
  }
];
