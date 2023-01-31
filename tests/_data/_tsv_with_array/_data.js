module.exports = [
  {
    latex: '\\begin{tabular}{|l|c|c|c|}\\hline & \\( \\begin{array}{c}\\text { cost } \\\\ \\$\\end{array} \\) & \\( \\begin{array}{c}\\text { depreciation } \\\\ \\$\\end{array} \\) & \\( \\begin{array}{c}\\text { net book value } \\\\ \\$\\end{array} \\) \\\\ \\hline non-current assets & 250000 & 95000 & 155000 \\\\ \\hline\\end{tabular}',
    tsv: '\t" cost \n' +
      '$"\t" depreciation \n' +
      '$"\t" net book value \n' +
      '$"\n' +
      'non-current assets\t250000\t95000\t155000'
  },
  /** For tsv:
   * If double-quotes are used to enclose fields, then a double-quote
   * appearing inside a field must be escaped by preceding it with
   * another double quote */
  {
    latex: '\\begin{tabular}{|l|c|c|c|}\\hline & \\( \\begin{array}{c}\\text { cost } \\\\ \\$ \\begin{array}{c}\\text { cost } \\\\ \\$\\end{array} \n' +
      ' \\end{array} \\)  & \\( \\begin{array}{c}\\text { depreciation } \\\\ \\$\\end{array} \\) & \\( \\begin{array}{c}\\text { net book value } \\\\ \\$\\end{array} \\) \\\\ \\hline non-current assets & 250000 & 95000 & 155000 \\\\ \\hline\\end{tabular}',
    tsv: '\t" cost \n' +
      '${:["" cost ""],[$]:}"\t" depreciation \n' +
      '$"\t" net book value \n' +
      '$"\n' +
      'non-current assets\t250000\t95000\t155000'
  },  
  /** In tsv matrix and aligned should be as asciimath */
  {
    latex: '\\begin{tabular}{|l|c|c|c|}\\hline & \\( \\begin{array}{c}\\text { cost } \\\\ \\$\\end{array} \\) & \\( \\begin{matrix}\\text { depreciation } \\\\ \\$\\end{matrix} \\) & \\( \\begin{aligned}\\text { net book value } \\\\ \\$\\end{aligned} \\) \\\\ \\hline non-current assets & 250000 & 95000 & 155000 \\\\ \\hline\\end{tabular}',
    tsv: '\t" cost \n' +
      '$"\t{:[" depreciation "],[$]:}\t{:[" net book value "],[$]:}\n' +
      'non-current assets\t250000\t95000\t155000'
  },
  /** In this equation begin{array} should be as asciimath */
  {
    latex: '\\begin{tabular}{|c|c|}\n' +
      '\\hline Area (sq. ft) & Number of Bedrooms \\\\\n' +
      '\\hline \\( 60 \\leq A<80 \\) & 4 \\\\\n' +
      '\\hline \\( 80 \\leq A<100 \\) & 6 \\\\\n' +
      '\\hline \\( 100 \\leq A<120 \\) & 5 \\\\\n' +
      '\\hline \\( 120 \\leq A<140 \\) & 3 \\\\\n' +
      '\\hline \\( 110<\\begin{array}{c}-16 n \\\\\n' +
      '1\\end{array} \\) \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv: 'Area (sq. ft)\tNumber of Bedrooms\n' +
      '60 <= A < 80\t4\n' +
      '80 <= A < 100\t6\n' +
      '100 <= A < 120\t5\n' +
      '120 <= A < 140\t3\n' +
      '110 < {:[-16 n],[1]:}\t'
  },  
  {
    latex: '\\begin{tabular}{|c|c|c|c|c|}\n' +
      '\\hline \\multirow{2}{*}{\\( \\begin{array}{c}\\text { Coating Type } \\\\\n' +
      '\\hline 1\\end{array} \\)} & \\multicolumn{4}{|c|}{\\( {\\text { Conductivity }} \\)} \\\\\n' +
      '\\hline & 143 & 141 & 150 & 146 \\\\\n' +
      '\\hline 2 & 152 & 149 & 137 & 143 \\\\\n' +
      '\\hline 3 & 134 & 133 & 132 & 127 \\\\\n' +
      '\\hline 4 & 129 & 127 & 132 & 129 \\\\\n' +
      '\\hline 5 & 147 & 148 & 144 & 142 \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv: '" Coating Type \n' +
      '1"\t" Conductivity "\t\t\t\n' +
      '\t143\t141\t150\t146\n' +
      '2\t152\t149\t137\t143\n' +
      '3\t134\t133\t132\t127\n' +
      '4\t129\t127\t132\t129\n' +
      '5\t147\t148\t144\t142'
  },
  /** In this equation begin{array} should be as asciimath */
  {
    latex: '\\begin{tabular}{|l|l|l|}\n' +
      '\\hline \\multicolumn{2}{|c|} { NUMERO BINOMIAL } & \\multicolumn{1}{|c|} { RESULTADO } \\\\\n' +
      '\\hline\\( (\\quad)\\left(\\begin{array}{l}3 \\\\\n' +
      '0\\end{array}\\right) \\) & (1) 35 \\\\\n' +
      '\\hline\\( \\left(\\begin{array}{c}10 \\\\\n' +
      '1\\end{array}\\right) \\) & (2) 5 \\\\\n' +
      '\\hline\\( (\\quad)\\left(\\begin{array}{l}5 \\\\\n' +
      '4\\end{array}\\right) \\) & (3) 15 \\\\\n' +
      '\\hline\\( \\left(\\begin{array}{l}6 \\\\\n' +
      '2\\end{array}\\right) \\) & (4) 10 \\\\\n' +
      '\\hline\\( (1)\\left(\\begin{array}{l}7 \\\\\n' +
      '3\\end{array}\\right) \\) & & \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv: 'NUMERO BINOMIAL\t\tRESULTADO\n' +
      '(quad)([3],[0])\t(1) 35\t\n' +
      '([10],[1])\t(2) 5\t\n' +
      '(quad)([5],[4])\t(3) 15\t\n' +
      '([6],[2])\t(4) 10\t\n' +
      '(1)([7],[3])\t\t'
  },  
  {
    latex: '\\begin{tabular}{l}\n' +
      'Activity Precedes Optimistic Most Likely Pessimisti \\\\\n' +
      'Start \\( A, B, C \\) \\\\\n' +
      '\\( \\begin{array}{ccccc}\\text { A } & \\text { D } & 38 & 50 & 62 \\\\\n' +
      '\\text { B } & \\text { E } & 90 & 99 & 108 \\\\\n' +
      '\\text { C } & \\text { End } & 85 & 100 & 115 \\\\\n' +
      '\\text { D } & \\text { F } & 19 & 25 & 31 \\\\\n' +
      '\\text { E } & \\text { End } & \\text { 91 } & 100 & 115 \\\\\n' +
      '\\text { F } & \\text { End } & 62 & 65 & 68\\end{array} \\) \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv: 'Activity Precedes Optimistic Most Likely Pessimisti\n' +
      'Start A,B,C\n' +
      '" A \t D \t38\t50\t62\n' +
      ' B \t E \t90\t99\t108\n' +
      ' C \t End \t85\t100\t115\n' +
      ' D \t F \t19\t25\t31\n' +
      ' E \t End \t 91 \t100\t115\n' +
      ' F \t End \t62\t65\t68"'
  },  
  // {
  //   latex: '',
  //   tsv: ''
  // },
];
