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
    latex: '\\begin{tabular}{ | l | c | r | }\n' +
      '  1 & 2 & 3 \\\\\n' +
      '  4 & 5 & 6 \\\\\n' +
      '  7 & 8 & 9 \\\\\n' +
      '\\end{tabular}',
    tsv: '1\t2\t3\n4\t5\t6\n7\t8\t9',
  },
  {
    latex: '\\begin{tabular}{ | l | c | r | }\n' +
      '  \\hline\t\t\t\n' +
      '  1 & 2 & 3 \\\\\n' +
      '  4 & 5 & 6 \\\\\n' +
      '  7 & 8 & 9 \\\\\n' +
      '  \\hline  \n' +
      '\\end{tabular}',
    tsv: '1\t2\t3\n4\t5\t6\n7\t8\t9',
  },
  {
    latex: '\\begin{center}\n' +
      '  \\begin{tabular}{ | l | c | r | }\n' +
      '    \\hline\n' +
      '    1 & 2 & 3 \\\\ \\hline\n' +
      '    4 & 5 & 6 \\\\ \\hline\n' +
      '    7 & 8 & 9 \\\\\n' +
      '    \\hline\n' +
      '  \\end{tabular}\n' +
      '\\end{center}',
    tsv: '1\t2\t3\n4\t5\t6\n7\t8\t9',
  },
  {
    latex: '\\begin{left}\n' +
      '  \\begin{tabular}{ | l | c | r | }\n' +
      '    \\hline\n' +
      '    1 & 2 & 3 \\\\ \\hline\n' +
      '    4 & 5 & 6 \\\\ \\hline\n' +
      '    7 & 8 & 9 \\\\\n' +
      '    \\hline\n' +
      '  \\end{tabular}\n' +
      '\\end{left}',
    tsv: '1\t2\t3\n4\t5\t6\n7\t8\t9',
  },  {
    latex: '\\begin{tabular}{l|S|r|l}\n' +
      '      \\textbf{Value 1} & \\textbf{Value 2} & \\textbf{Value 3} & \\textbf{Value 4}\\\\\n' +
      '      $\\alpha$ & $\\beta$ & $\\gamma$ & $\\delta$ \\\\\n' +
      '      \\hline\n' +
      '      1 & 1110.1 & a & e\\\\\n' +
      '      2 & 10.1 & b & f\\\\\n' +
      '      3 & 23.113231 & c & g\\\\\n' +
      '    \\end{tabular}',
    tsv: '\\textbf{Value 1}\t\\textbf{Value 2}\t\\textbf{Value 3}\t\\textbf{Value 4}\n' +
      '$\\alpha$\t$\\beta$\t$\\gamma$\t$\\delta$\n' +
      '1\t1110.1\ta\te\n' +
      '2\t10.1\tb\tf\n' +
      '3\t23.113231\tc\tg',
  },
  {
    latex: '\\begin{center}\n' +
      '    \\begin{tabular}{| l | l | l | l |}\n' +
      '    \\hline\n' +
      '    Day & Min Temp & Max Temp & Summary \\\\ \\hline\n' +
      '    Monday & 11C & 22C & A clear day with lots of sunshine.\n' +
      '    However, the strong breeze will bring down the temperatures. \\\\ \\hline\n' +
      '    Tuesday & 9C & 19C & Cloudy with rain, across many northern regions. Clear spells\n' +
      '    across most of Scotland and Northern Ireland,\n' +
      '    but rain reaching the far northwest. \\\\ \\hline\n' +
      '    Wednesday & 10C & 21C & Rain will still linger for the morning.\n' +
      '    Conditions will improve by early afternoon and continue\n' +
      '    throughout the evening. \\\\\n' +
      '    \\hline\n' +
      '    \\end{tabular}\n' +
      '\\end{center}',
    tsv: 'Day\tMin Temp\tMax Temp\tSummary\n' +
      'Monday\t11C\t22C\tA clear day with lots of sunshine. However, the strong breeze will bring down the temperatures.\n' +
      'Tuesday\t9C\t19C\tCloudy with rain, across many northern regions. Clear spells across most of Scotland and Northern Ireland, but rain reaching the far northwest.\n' +
      'Wednesday\t10C\t21C\tRain will still linger for the morning. Conditions will improve by early afternoon and continue throughout the evening.',
  },
  {
    latex: '\\begin{center}\n' +
      '    \\begin{tabular}{ | l | l | l | p{5cm} |}\n' +
      '    \\hline\n' +
      '    Day & Min Temp & Max Temp & Summary \\\\ \\hline\n' +
      '    Monday & 11C & 22C & A clear day with lots of sunshine.  \n' +
      '    However, the strong breeze will bring down the temperatures. \\\\ \\hline\n' +
      '    Tuesday & 9C & 19C & Cloudy with rain, across many northern regions. Clear spells\n' +
      '    across most of Scotland and Northern Ireland,\n' +
      '    but rain reaching the far northwest. \\\\ \\hline\n' +
      '    Wednesday & 10C & 21C & Rain will still linger for the morning.\n' +
      '    Conditions will improve by early afternoon and continue\n' +
      '    throughout the evening. \\\\\n' +
      '    \\hline\n' +
      '    \\end{tabular}\n' +
      '\\end{center}',
    tsv: 'Day\tMin Temp\tMax Temp\tSummary\n' +
      'Monday\t11C\t22C\tA clear day with lots of sunshine.   However, the strong breeze will bring down the temperatures.\n' +
      'Tuesday\t9C\t19C\tCloudy with rain, across many northern regions. Clear spells across most of Scotland and Northern Ireland, but rain reaching the far northwest.\n' +
      'Wednesday\t10C\t21C\tRain will still linger for the morning. Conditions will improve by early afternoon and continue throughout the evening.',
  },
  {
    latex: '\\begin{tabular}{ |l|l| }\n' +
      '  \\hline\n' +
      '  \\multicolumn{2}{|c|}{Team sheet} \\\\\n' +
      '  \\hline\n' +
      '  GK & Paul Robinson \\\\\n' +
      '  LB & Lucas Radebe \\\\\n' +
      '  DC & Michael Duberry \\\\\n' +
      '  DC & Dominic Matteo \\\\\n' +
      '  RB & Dider Domi \\\\\n' +
      '  MC & David Batty \\\\\n' +
      '  MC & Eirik Bakke \\\\\n' +
      '  MC & Jody Morris \\\\\n' +
      '  FW & Jamie McMaster \\\\\n' +
      '  ST & Alan Smith \\\\\n' +
      '  ST & Mark Viduka \\\\\n' +
      '  \\hline\n' +
      '\\end{tabular}',
    tsv:   'Team sheet\t\n' +
      'GK\tPaul Robinson\n' +
      'LB\tLucas Radebe\n' +
      'DC\tMichael Duberry\n' +
      'DC\tDominic Matteo\n' +
      'RB\tDider Domi\n' +
      'MC\tDavid Batty\n' +
      'MC\tEirik Bakke\n' +
      'MC\tJody Morris\n' +
      'FW\tJamie McMaster\n' +
      'ST\tAlan Smith\n' +
      'ST\tMark Viduka'
  },  {
    latex: '\\begin{tabular}{ |l|l|l| }\n' +
      '\\hline\n' +
      '\\multicolumn{3}{ |c| }{Team sheet} \\\\\n' +
      '\\hline\n' +
      'Goalkeeper & GK & Paul Robinson \\\\ \\hline\n' +
      '\\multirow{4}{*}{Defenders} & LB & Lucas Radebe \\\\\n' +
      ' & DC & Michael Duburry \\\\\n' +
      ' & DC & Dominic Matteo \\\\\n' +
      ' & RB & Didier Domi \\\\ \\hline\n' +
      '\\multirow{3}{*}{Midfielders} & MC & David Batty \\\\\n' +
      ' & MC & Eirik Bakke \\\\\n' +
      ' & MC & Jody Morris \\\\ \\hline\n' +
      'Forward & FW & Jamie McMaster \\\\ \\hline\n' +
      '\\multirow{2}{*}{Strikers} & ST & Alan Smith \\\\\n' +
      ' & ST & Mark Viduka \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv:  'Team sheet\t\t\n' +
      'Goalkeeper\tGK\tPaul Robinson\n' +
      'Defenders\tLB\tLucas Radebe\n' +
      '\tDC\tMichael Duburry\n' +
      '\tDC\tDominic Matteo\n' +
      '\tRB\tDidier Domi\n' +
      'Midfielders\tMC\tDavid Batty\n' +
      '\tMC\tEirik Bakke\n' +
      '\tMC\tJody Morris\n' +
      'Forward\tFW\tJamie McMaster\n' +
      'Strikers\tST\tAlan Smith\n' +
      '\tST\tMark Viduka',
  },
  {
    latex: '\\begin{tabular}{cc|c|c|c|c|l}\n' +
      '\\cline{3-6}\n' +
      '& & \\multicolumn{4}{ c| }{Primes} \\\\ \\cline{3-6}\n' +
      '& & 2 & 3 & 5 & 7 \\\\ \\cline{1-6}\n' +
      '\\multicolumn{1}{ |c  }{\\multirow{2}{*}{Powers} } &\n' +
      '\\multicolumn{1}{ |c| }{504} & 3 & 2 & 0 & 1 &     \\\\ \\cline{2-6}\n' +
      '\\multicolumn{1}{ |c  }{}                        &\n' +
      '\\multicolumn{1}{ |c| }{540} & 2 & 3 & 1 & 0 &     \\\\ \\cline{1-6}\n' +
      '\\multicolumn{1}{ |c  }{\\multirow{2}{*}{Powers} } &\n' +
      '\\multicolumn{1}{ |c| }{gcd} & 2 & 2 & 0 & 0 & min \\\\ \\cline{2-6}\n' +
      '\\multicolumn{1}{ |c  }{}                        &\n' +
      '\\multicolumn{1}{ |c| }{lcm} & 3 & 3 & 1 & 1 & max \\\\ \\cline{1-6}\n' +
      '\\end{tabular}',
    tsv: '\t\tPrimes\t\t\t\t\n' +
      '\t\t2\t3\t5\t7\t\n' +
      'Powers\t504\t3\t2\t0\t1\t\n' +
      '\t540\t2\t3\t1\t0\t\n' +
      'Powers\tgcd\t2\t2\t0\t0\tmin\n' +
      '\tlcm\t3\t3\t1\t1\tmax',
  },
  {
    latex: '\\begin{tabular}{ r|c|c| }\n' +
      '\\multicolumn{1}{r}{}\n' +
      ' &  \\multicolumn{1}{c}{noninteractive}\n' +
      ' & \\multicolumn{1}{c}{interactive} \\\\\n' +
      '\\cline{2-3}\n' +
      'massively multiple & Library & University \\\\\n' +
      '\\cline{2-3}\n' +
      'one-to-one & Book & Tutor \\\\\n' +
      '\\cline{2-3}\n' +
      '\\end{tabular}\n',
    tsv: '\tnoninteractive\tinteractive\n' +
      'massively multiple\tLibrary\tUniversity\n' +
      'one-to-one\tBook\tTutor',
  },
  {
    latex: '\\begin{table}[h!]\n' +
      '\\centering\n' +
      '\\begin{tabular}{||c c c c||}\n' +
      '\\hline\n' +
      'Col1 & Col2 & Col2 & Col3 \\\\ [0.5ex]\n' +
      '\\hline\\hline\n' +
      '1 & 6 & 87837 & 787 \\\\\n' +
      '2 & 7 & 78 & 5415 \\\\\n' +
      '3 & 545 & 778 & 7507 \\\\\n' +
      '4 & 545 & 18744 & 7560 \\\\\n' +
      '5 & 88 & 788 & 6344 \\\\ [1ex]\n' +
      '\\hline\n' +
      '\\end{tabular}\n' +
      '\\end{table}',
    tsv: 'Col1\tCol2\tCol2\tCol3\n' +
      '1\t6\t87837\t787\n' +
      '2\t7\t78\t5415\n' +
      '3\t545\t778\t7507\n' +
      '4\t545\t18744\t7560\n' +
      '5\t88\t788\t6344',
  },
  {
    latex: '\\begin{table}[h!]\n' +
      '\\begin{left}\n' +
      '\\begin{tabular}{||c c c c||}\n' +
      '\\hline\n' +
      'Col1 & Col2 & Col2 & Col3 \\\\ [0.5ex]\n' +
      '\\hline\\hline\n' +
      '1 & 6 & 87837 & 787 \\\\\n' +
      '2 & 7 & 78 & 5415 \\\\\n' +
      '3 & 545 & 778 & 7507 \\\\\n' +
      '4 & 545 & 18744 & 7560 \\\\\n' +
      '5 & 88 & 788 & 6344 \\\\ [1ex]\n' +
      '\\hline\n' +
      '\\end{tabular}\n' +
      '\\end{left}\n' +
      '\\end{table}',
    tsv:  'Col1\tCol2\tCol2\tCol3\n' +
      '1\t6\t87837\t787\n' +
      '2\t7\t78\t5415\n' +
      '3\t545\t778\t7507\n' +
      '4\t545\t18744\t7560\n' +
      '5\t88\t788\t6344',
  },
  {
    latex: 'The table \\ref{table:1} is an example of referenced \\LaTeX elements.\n' +
      '\n' +
      '\\begin{table}[h!]\n' +
      '\\centering\n' +
      '\\begin{tabular}{||c c c c||}\n' +
      '\\hline\n' +
      'Col1 & Col2 & Col2 & Col3 \\\\ [0.5ex]\n' +
      '\\hline\\hline\n' +
      '1 & 6 & 87837 & 787 \\\\\n' +
      '2 & 7 & 78 & 5415 \\\\\n' +
      '3 & 545 & 778 & 7507 \\\\\n' +
      '4 & 545 & 18744 & 7560 \\\\\n' +
      '5 & 88 & 788 & 6344 \\\\ [1ex]\n' +
      '\\hline\n' +
      '\\end{tabular}\n' +
      '\\caption{Table to test captions and labels}\n' +
      '\\label{table:1}\n' +
      '\\end{table}',
    tsv: 'Col1\tCol2\tCol2\tCol3\n' +
      '1\t6\t87837\t787\n' +
      '2\t7\t78\t5415\n' +
      '3\t545\t778\t7507\n' +
      '4\t545\t18744\t7560\n' +
      '5\t88\t788\t6344',
  },
  {
    latex: '\\begin{table}[h]\n' +
      '\\centering\n' +
      '\\begin{tabular}{|c||c|c|} \\hline\n' +
      '& A & B \\\\ \\hline\\hline\n' +
      'Foo &\n' +
      '\\begin{tabular}{c} 1 \\\\ 2 \\\\ 3 \\\\ 4 \\\\\n' +
      '\\end{tabular} &\n' +
      '\\begin{tabular}{c} 2 \\\\ 5 \\\\ 9 \\\\ 8 \\\\\n' +
      '\\end{tabular} \\\\ \\hline\n' +
      'Bar &\n' +
      '\\begin{tabular}{c} 1 \\\\ 2 \\\\ 3 \\\\ 4 \\\\\n' +
      '\\end{tabular} &\n' +
      '\\begin{tabular}{c} 31 \\\\ 23 \\\\ 16 \\\\ 42 \\\\\n' +
      '\\end{tabular} \\\\ \\hline\n' +
      '\\end{tabular}\n' +
      '\\caption{this is the table!}\n' +
      '\\label{table:4}\n' +
      '\\end{table}',
    tsv: '\tA\tB\nFoo\t1,2,3,4\t2,5,9,8\nBar\t1,2,3,4\t31,23,16,42',
  },
  {
    latex: '\\begin{table}[h]\n' +
      '\\centering\n' +
      '\\begin{tabular}{ :c|c|c: }\n' +
      ' \\multicolumn{3}{|c|}{My cells2}\\\\\n' +
      ' \\hline\n' +
      ' \\multirow{3}{4em}{Multiple rows} & cell2 & cell3 \\\\\\hline\n' +
      ' & cell5 & cell6 \\\\ \\hline\n' +
      ' & cell8 & cell9 \\\\\n' +
      ' \\hhline\n' +
      '\\end{tabular}\n' +
      '\\caption{this is the table!}\n' +
      '\\label{table:5}\n' +
      '\\end{table}',
    tsv:  'My cells2\t\t\nMultiple rows\tcell2\tcell3\n\tcell5\tcell6\n\tcell8\tcell9',
  },
  {
    latex: '\\begin{table}[h]\n' +
      '\\centering\n' +
      '\\begin{tabular}{ |c|c|c| }\n' +
      '\\hhline\n' +
      '{ formula $\\frac{\\nabla^{2} A}{A}=-k^{2}$} & cell2 & cell3 \\\\\n' +
      ' \\hline\n' +
      '\\end{tabular}\n' +
      '\\caption{this is the table!}\n' +
      '\\label{table:7}\n' +
      '\\end{table}',
    tsv: 'formula $\\frac{\\nabla^{2} A}{A}=-k^{2}$\tcell2\tcell3',
  },
  {
    latex: '\\begin{table}[h]\n' +
      '\\centering\n' +
      '\\begin{tabular}{|l:l:l|}\n' +
      '\\hline\n' +
      '1& \\multirow{2}{5em}{\\multicolumn{2}{:c:}{Day}}\\\\  \\hline\n' +
      '1&2&3&4\\\\  \\hline\n' +
      '1&2&3&4\\\\  \\hline\n' +
      '\\end{tabular}\n' +
      '\\end{table}',
    tsv: '1\tDay\t\t\n1\t\t\t4\n1\t2\t3\t4',
  },
  {
    latex: '\\begin{table}[h]\n' +
      '\\centering\n' +
      '\\begin{tabular} {|||c|c|c|c|c|c|c|c|:::}\n' +
      '\\hline \\hhline {alms\'s} & \\multicolumn{4}{|c|} {economizes} & {recondition} & {bailing} & {asymptotically} \\\\ \\hline\n' +
      '\\multicolumn{1}{|||c|} {fiddle} & \\multicolumn{5}{|c|} {kitchenettes} & {misstates} \\\\ \\hline\n' +
      '\\end{tabular}\n' +
      '\\caption{this is the table!}\n' +
      '\\label{table:7}\n' +
      '\\end{table}\n' +
      '\n' +
      'Table \\ref{table:4} is an example.',
    tsv:  "alms's\teconomizes\t\t\t\trecondition\tbailing\tasymptotically\n" +
      'fiddle\tkitchenettes\t\t\t\t\tmisstates\t',
  }
];
