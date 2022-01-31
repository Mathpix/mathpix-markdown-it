module.exports = [
  {
    id: 1,
    latex: '\\begin{tabular}{ l c r }\n' +
      '  1 & 2 & 3 \\\\\n' +
      '  4 & 5 & 6 \\\\\n' +
      '  7 & 8 & 9 \\\\\n' +
      '\\end{tabular}',
    table_markdown: '| 1 | 2 | 3 |\n' +
      '| :--- | :---: | ---: |\n' +
      '| 4 | 5 | 6 |\n' +
      '| 7 | 8 | 9 |',
  },
  {
    id: 2,
    latex: '\\begin{tabular}{ | l | c | r | }\n' +
      '  1 & 2 & 3 \\\\\n' +
      '  4 & 5 & 6 \\\\\n' +
      '  7 & 8 & 9 \\\\\n' +
      '\\end{tabular}',
    table_markdown: '| 1 | 2 | 3 |\n' +
      '| :--- | :---: | ---: |\n' +
      '| 4 | 5 | 6 |\n' +
      '| 7 | 8 | 9 |',
  },
  {
    id: 3,
    latex: '\\begin{tabular}{ | l | c | r | }\n' +
      '  \\hline\t\t\t\n' +
      '  1 & 2 & 3 \\\\\n' +
      '  4 & 5 & 6 \\\\\n' +
      '  7 & 8 & 9 \\\\\n' +
      '  \\hline  \n' +
      '\\end{tabular}',
    table_markdown: '| 1 | 2 | 3 |\n' +
      '| :--- | :---: | ---: |\n' +
      '| 4 | 5 | 6 |\n' +
      '| 7 | 8 | 9 |',
  },
  {
    id: 4,
    latex: '\\begin{center}\n' +
      '  \\begin{tabular}{ | l | c | r | }\n' +
      '    \\hline\n' +
      '    1 & 2 & 3 \\\\ \\hline\n' +
      '    4 & 5 & 6 \\\\ \\hline\n' +
      '    7 & 8 & 9 \\\\\n' +
      '    \\hline\n' +
      '  \\end{tabular}\n' +
      '\\end{center}',
    table_markdown: '| 1 | 2 | 3 |\n' +
      '| :--- | :---: | ---: |\n' +
      '| 4 | 5 | 6 |\n' +
      '| 7 | 8 | 9 |'
  },
  {
    id: 6,
    latex: '\\begin{left}\n' +
      '  \\begin{tabular}{ | l | c | r | }\n' +
      '    \\hline\n' +
      '    1 & 2 & 3 \\\\ \\hline\n' +
      '    4 & 5 & 6 \\\\ \\hline\n' +
      '    7 & 8 & 9 \\\\\n' +
      '    \\hline\n' +
      '  \\end{tabular}\n' +
      '\\end{left}',
    table_markdown: '| 1 | 2 | 3 |\n' +
      '| :--- | :---: | ---: |\n' +
      '| 4 | 5 | 6 |\n' +
      '| 7 | 8 | 9 |',
  },
  {
    id: 7,
    latex: '\\begin{tabular}{l|S|r|l}\n' +
      '      \\textbf{Value 1} & \\textbf{Value 2} & \\textbf{Value 3} & \\textbf{Value 4}\\\\\n' +
      '      $\\alpha$ & $\\beta$ & $\\gamma$ & $\\delta$ \\\\\n' +
      '      \\hline\n' +
      '      1 & 1110.1 & a & e\\\\\n' +
      '      2 & 10.1 & b & f\\\\\n' +
      '      3 & 23.113231 & c & g\\\\\n' +
      '    \\end{tabular}',
    table_markdown: '| **Value 1** | **Value 2** | **Value 3** | **Value 4** |\n' +
      '| :--- | --- | ---: | :--- |\n' +
      '| $\\alpha$ | $\\beta$ | $\\gamma$ | $\\delta$ |\n' +
      '| 1 | 1110.1 | a | e |\n' +
      '| 2 | 10.1 | b | f |\n' +
      '| 3 | 23.113231 | c | g |',
    table_markdown_math_as_ascii: '| **Value 1** | **Value 2** | **Value 3** | **Value 4** |\n' +
      '| :--- | --- | ---: | :--- |\n' +
      '| alpha | beta | gamma | delta |\n' +
      '| 1 | 1110.1 | a | e |\n' +
      '| 2 | 10.1 | b | f |\n' +
      '| 3 | 23.113231 | c | g |'
  },
  {
    id: 8,
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
    table_markdown: '| Day | Min Temp | Max Temp | Summary |\n' +
      '| :--- | :--- | :--- | :--- |\n' +
      '| Monday | 11C | 22C | A clear day with lots of sunshine. However, the strong breeze will bring down the temperatures. |\n' +
      '| Tuesday | 9C | 19C | Cloudy with rain, across many northern regions. Clear spells across most of Scotland and Northern Ireland, but rain reaching the far northwest. |\n' +
      '| Wednesday | 10C | 21C | Rain will still linger for the morning. Conditions will improve by early afternoon and continue throughout the evening. |',
  },
  {
    id: 9,
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
    table_markdown: '| Day | Min Temp | Max Temp | Summary |\n' +
      '| :--- | :--- | :--- | :--- |\n' +
      '| Monday | 11C | 22C | A clear day with lots of sunshine.   However, the strong breeze will bring down the temperatures. |\n' +
      '| Tuesday | 9C | 19C | Cloudy with rain, across many northern regions. Clear spells across most of Scotland and Northern Ireland, but rain reaching the far northwest. |\n' +
      '| Wednesday | 10C | 21C | Rain will still linger for the morning. Conditions will improve by early afternoon and continue throughout the evening. |',
  },
  {
    id: 10,
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
    table_markdown:   '| Team sheet |  |\n' +
      '| :--- | :--- |\n' +
      '| GK | Paul Robinson |\n' +
      '| LB | Lucas Radebe |\n' +
      '| DC | Michael Duberry |\n' +
      '| DC | Dominic Matteo |\n' +
      '| RB | Dider Domi |\n' +
      '| MC | David Batty |\n' +
      '| MC | Eirik Bakke |\n' +
      '| MC | Jody Morris |\n' +
      '| FW | Jamie McMaster |\n' +
      '| ST | Alan Smith |\n' +
      '| ST | Mark Viduka |',
  },
  {
    id: 11,
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
    table_markdown:  '| Team sheet |  |  |\n' +
      '| :--- | :--- | :--- |\n' +
      '| Goalkeeper | GK | Paul Robinson |\n' +
      '| Defenders | LB | Lucas Radebe |\n' +
      '|  | DC | Michael Duburry |\n' +
      '|  | DC | Dominic Matteo |\n' +
      '|  | RB | Didier Domi |\n' +
      '| Midfielders | MC | David Batty |\n' +
      '|  | MC | Eirik Bakke |\n' +
      '|  | MC | Jody Morris |\n' +
      '| Forward | FW | Jamie McMaster |\n' +
      '| Strikers | ST | Alan Smith |\n' +
      '|  | ST | Mark Viduka |',
  },
  {
    id: 12,
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
    table_markdown: '|  |  | Primes |  |  |  |  |\n' +
      '| :---: | :---: | :---: | :---: | :---: | :---: | :--- |\n' +
      '|  |  | 2 | 3 | 5 | 7 |  |\n' +
      '| Powers | 504 | 3 | 2 | 0 | 1 |  |\n' +
      '|  | 540 | 2 | 3 | 1 | 0 |  |\n' +
      '| Powers | gcd | 2 | 2 | 0 | 0 | min |\n' +
      '|  | lcm | 3 | 3 | 1 | 1 | max |',
  },
  {
    id: 13,
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
    table_markdown: '|  | noninteractive | interactive |\n' +
      '| ---: | :---: | :---: |\n' +
      '| massively multiple | Library | University |\n' +
      '| one-to-one | Book | Tutor |',
  },
  {
    id: 14,
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
    table_markdown: '| Col1 | Col2 | Col2 | Col3 |\n' +
      '| :---: | :---: | :---: | :---: |\n' +
      '| 1 | 6 | 87837 | 787 |\n' +
      '| 2 | 7 | 78 | 5415 |\n' +
      '| 3 | 545 | 778 | 7507 |\n' +
      '| 4 | 545 | 18744 | 7560 |\n' +
      '| 5 | 88 | 788 | 6344 |',
  },
  {
    id: 15,
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
    table_markdown:  '| Col1 | Col2 | Col2 | Col3 |\n' +
      '| :---: | :---: | :---: | :---: |\n' +
      '| 1 | 6 | 87837 | 787 |\n' +
      '| 2 | 7 | 78 | 5415 |\n' +
      '| 3 | 545 | 778 | 7507 |\n' +
      '| 4 | 545 | 18744 | 7560 |\n' +
      '| 5 | 88 | 788 | 6344 |',
  },
  {
    id: 16,
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
    table_markdown: '| Col1 | Col2 | Col2 | Col3 |\n' +
      '| :---: | :---: | :---: | :---: |\n' +
      '| 1 | 6 | 87837 | 787 |\n' +
      '| 2 | 7 | 78 | 5415 |\n' +
      '| 3 | 545 | 778 | 7507 |\n' +
      '| 4 | 545 | 18744 | 7560 |\n' +
      '| 5 | 88 | 788 | 6344 |'
  },
  {
    id: 17,
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
    table_markdown: '|  | A | B |\n' +
      '| :---: | :---: | :---: |\n' +
      '| Foo | 1 <br> 2 <br> 3 <br> 4 | 2 <br> 5 <br> 9 <br> 8 |\n' +
      '| Bar | 1 <br> 2 <br> 3 <br> 4 | 31 <br> 23 <br> 16 <br> 42 |',

  },
  {
    id: 18,
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
    table_markdown:  '| My cells2 |  |  |\n' +
      '| :---: | :---: | :---: |\n' +
      '| Multiple rows | cell2 | cell3 |\n' +
      '|  | cell5 | cell6 |\n' +
      '|  | cell8 | cell9 |',
  },
  {
    id: 19,
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
    table_markdown: '| formula $\\frac{\\nabla^{2} A}{A}=-k^{2}$ | cell2 | cell3 |\n' +
      '| :---: | :---: | :---: |',
    table_markdown_math_as_ascii: '| formula (grad^(2)A)/(A)=-k^(2) | cell2 | cell3 |\n' +
      '| :---: | :---: | :---: |'
  },
  {
    id: 20,
    latex: '\\begin{table}[h]\n' +
      '\\centering\n' +
      '\\begin{tabular}{|l:l:l|}\n' +
      '\\hline\n' +
      '1& \\multirow{2}{5em}{\\multicolumn{2}{:c:}{Day}}\\\\  \\hline\n' +
      '1&2&3&4\\\\  \\hline\n' +
      '1&2&3&4\\\\  \\hline\n' +
      '\\end{tabular}\n' +
      '\\end{table}',
    table_markdown: '| 1 | Day |  |  |\n' +
      '| :--- | :--- | :--- | :---: |\n' +
      '| 1 |  |  | 4 |\n' +
      '| 1 | 2 | 3 | 4 |',
  },
  {
    id: 21,
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
    table_markdown:  '| alms\'s | economizes |  |  |  | recondition | bailing | asymptotically |\n' +
      '| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n' +
      '| fiddle | kitchenettes |  |  |  |  | misstates |  |',
  },
  {
    id: 22,
    latex: '\\begin{tabular}{|c|c|}\\hline Feature & Component \\\\ \\hline \\hline Power lock & Door lock manager \\& Power lock \\\\ Door lock & Auto lock \\\\ Door relock & Auto lock \\\\ f_Automatic & c_Automatic \\\\ f_Manual & c_Manual \\\\ Shift out of Park & Gear in Park \\\\ f_Speed & c_Speed \\\\ \\hline\\end{tabular}',
    table_markdown:   '| Feature | Component |\n' +
      '| :---: | :---: |\n' +
      '| Power lock | Door lock manager & Power lock |\n' +
      '| Door lock | Auto lock |\n' +
      '| Door relock | Auto lock |\n' +
      '| f_Automatic | c_Automatic |\n' +
      '| f_Manual | c_Manual |\n' +
      '| Shift out of Park | Gear in Park |\n' +
      '| f_Speed | c_Speed |',
  },
  {
    id: 23,
    latex: '\\begin{tabular}{|l|l|}\n' +
      '\\hline \\hline Plan 1 & Plan 2 \\\\\n' +
      '\\hline Employee pays \\$100 & Employee pays \\$200 \\\\\n' +
      '\\hline Plan pays 70\\% of the rest & Plan pays 80\\% of the rest \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    table_markdown:  '| Plan 1 | Plan 2 |\n' +
      '| :--- | :--- |\n' +
      '| Employee pays $100 | Employee pays $200 |\n' +
      '| Plan pays 70% of the rest | Plan pays 80% of the rest |',
  },
  {
    id: 24,
    latex: '\\begin{tabular}{|l|l|}\n' +
      '\\hline \\hline Plan 1 & Plan 2 \\\\\n' +
      '\\hline Employee pays \\$100 & Employee pays $200 \\\\\n' +
      '\\hline Plan pays 70\\% of the rest & Plan pays 80\\% of the rest \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    table_markdown:  '| Plan 1 | Plan 2 |\n' +
      '| :--- | :--- |\n' +
      '| Employee pays $100 | Employee pays $200 |\n' +
      '| Plan pays 70% of the rest | Plan pays 80% of the rest |',
  },
  {
    id: 25,
    latex: '\\begin{tabular}{|l|l|}\n' +
      '\\hline \\hline Plan 1 & Plan 2 \\\\\n' +
      '\\hline Employee pays $100 & Employee pays $200 \\\\\n' +
      '\\hline Plan pays 70\\% of the rest & Plan pays 80\\% of the rest \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    table_markdown:  '| Plan 1 | Plan 2 |\n' +
      '| :--- | :--- |\n' +
      '| Employee pays $100 | Employee pays $200 |\n' +
      '| Plan pays 70% of the rest | Plan pays 80% of the rest |',
  },
  {
    id: 26,
    latex: '\\begin{tabular}{|l|l|}\n' +
      '\\hline \\hline Plan 1 & Plan 2 \\\\\n' +
      '\\hline Employee pays $100 & Employee pays \\$200 \\\\\n' +
      '\\hline Plan pays 70\\% of the rest & Plan pays 80\\% of the rest \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    table_markdown:  '| Plan 1 | Plan 2 |\n' +
      '| :--- | :--- |\n' +
      '| Employee pays $100 | Employee pays $200 |\n' +
      '| Plan pays 70% of the rest | Plan pays 80% of the rest |',
  },
  {
    id: 27,
    latex: '\\begin{tabular}{|l|l|}\n' +
      '\\hline \\hline Plan 1 & Plan 2 \\\\\n' +
      '\\hline Employee pays $100 & Employee pays$200 \\\\\n' +
      '\\hline Plan pays 70\\% of the rest & Plan pays 80\\% of the rest \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    table_markdown:  '| Plan 1 | Plan 2 |\n' +
      '| :--- | :--- |\n' +
      '| Employee pays $100 | Employee pays$200 |\n' +
      '| Plan pays 70% of the rest | Plan pays 80% of the rest |',
  },
  {
    id: 28,
    latex: '\\begin{tabular}{|l|l|}\n' +
      '\\hline \\hline Plan 1 & Plan 2 \\\\\n' +
      '\\hline Employee pays $ 100 & Employee pays$ 200 \\\\\n' +
      '\\hline Plan pays 70\\% of the rest & Plan pays 80\\% of the rest \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    table_markdown:  '| Plan 1 | Plan 2 |\n' +
      '| :--- | :--- |\n' +
      '| Employee pays $ 100 | Employee pays$ 200 |\n' +
      '| Plan pays 70% of the rest | Plan pays 80% of the rest |',
  },
  {
    id: 29,
    latex: '\\begin{tabular}{|l|l|r|}\\hline\n' +
      '\\multicolumn{2}{|c|}{Item}&  \\\\\\hline\n' +
      'Animal & Description & Price (\\$) \\\\\\hline\n' +
      '\\multirow{2}{*}{Gnat } & per gram & \\multirow{2}{*}{13.65} \\\\\\hline\n' +
      '& \\multirow{2}{*}{each} &  \\\\\\hline\n' +
      'Gnu &  & 92.50  \\\\\\hline\n' +
      'Emu & stuffed  & 33.33  \\\\\\hline\n' +
      'Armadillo & frozen  & 8.99  \\\\\\hline\n' +
      '\\end{tabular}',
    table_markdown:  '| Item |  |  |\n' +
      '| :--- | :--- | ---: |\n' +
      '| Animal | Description | Price ($) |\n' +
      '| Gnat | per gram | 13.65 |\n' +
      '|  | each |  |\n' +
      '| Gnu |  | 92.50 |\n' +
      '| Emu | stuffed | 33.33 |\n' +
      '| Armadillo | frozen | 8.99 |',
  },
  {
    id: 30,
    latex: '\\begin{tabular}{|l|l|r|}\n' +
      '\\hline\n' +
      '\\multicolumn{2}{|c|}{title1}                         & \\multirow{3}{*}{title1} \\\\ \\cline{1-2}\n' +
      'Animal                & \\multirow{2}{*}{Description} &                         \\\\ \\cline{1-1}\n' +
      '\\multirow{2}{*}{Gnat} &                              &                         \\\\ \\cline{2-3} \n' +
      '                      & each                         & 0.01                    \\\\ \\hline\n' +
      '\\multirow{2}{*}{Gnu}  & stuffed                      & \\multirow{2}{*}{92.50}  \\\\ \\cline{2-2}\n' +
      '                      & stuffed                      &                         \\\\ \\hline\n' +
      'Armadillo             & frozen                       & 8.99                    \\\\ \\hline\n' +
      '\\end{tabular}',
    table_markdown:  '| title1 |  | title1 |\n' +
      '| :--- | :--- | ---: |\n' +
      '| Animal | Description |  |\n' +
      '| Gnat |  |  |\n' +
      '|  | each | 0.01 |\n' +
      '| Gnu | stuffed | 92.50 |\n' +
      '|  | stuffed |  |\n' +
      '| Armadillo | frozen | 8.99 |',
  },
  {
    id: 31,
    latex: '\\begin{tabular} { | c | c | c | } \\hline \\multirow{2}{*} {Total Production of Higgs Bosons} & \\multicolumn { 2 } { | c | } $\\mathcal { L } = 50 \\mathrm{~fb} ^ { - 1 }$ \\\\ \\cline{2-3} & $\\tan \\beta = 10$ & $\\tan \\beta = 30$ \\\\ \\hline \\hline $h ^ { 0 }$ & 1600 & 1800 \\\\ $H ^ { 0 }$ & 700 & 470 \\\\ $A ^ { 0 }$ & 900 & 935 \\\\ $H ^ { + } H ^ { - }$ & 7000 & 6500 \\\\ \\hline \\end{tabular}',
    table_markdown:  '| Total Production of Higgs Bosons | $\\mathcal { L } = 50 \\mathrm{~fb} ^ { - 1 }$ |  |\n' +
      '| :---: | :---: | :---: |\n' +
      '|  | $\\tan \\beta = 10$ | $\\tan \\beta = 30$ |\n' +
      '| $h ^ { 0 }$ | 1600 | 1800 |\n' +
      '| $H ^ { 0 }$ | 700 | 470 |\n' +
      '| $A ^ { 0 }$ | 900 | 935 |\n' +
      '| $H ^ { + } H ^ { - }$ | 7000 | 6500 |',
    table_markdown_math_as_ascii: '| Total Production of Higgs Bosons | L=50fb^(-1) |  |\n' +
      '| :---: | :---: | :---: |\n' +
      '|  | tan beta=10 | tan beta=30 |\n' +
      '| h^(0) | 1600 | 1800 |\n' +
      '| H^(0) | 700 | 470 |\n' +
      '| A^(0) | 900 | 935 |\n' +
      '| H^(+)H^(-) | 7000 | 6500 |'
  },
  {
    id: 32,
    latex: '\\begin{tabular}{rccccc} \\hline $\\text{curve (chiller condition, }j\\text{)}$ &$\\hat{\\sigma}_{j}^{2}$& $\\hat{\\pi}_{j}$&$\\hat{a}_{12}$&$\\hat{a}_{21}$&$\\lambda_{j}$ \\\\ \\hline $\\text{black (off, }j=1\\text{)}$ &12.2&0.682&\\multirow{2}{*} 0.015 & \\multirow{2}{*} $<10^{-16}$& 0.050 \\\\ $\\text{red (on, }j=2\\text{)}$&400.2&0.318&&&0.006 \\\\ \\hline \\end{tabular}',
    table_markdown:  '| $\\text{curve (chiller condition, }j\\text{)}$ | $\\hat{\\sigma}_{j}^{2}$ | $\\hat{\\pi}_{j}$ | $\\hat{a}_{12}$ | $\\hat{a}_{21}$ | $\\lambda_{j}$ |\n' +
      '| ---: | :---: | :---: | :---: | :---: | :---: |\n' +
      '| $\\text{black (off, }j=1\\text{)}$ | 12.2 | 0.682 | 0.015 | $<10^{-16}$ | 0.050 |\n' +
      '| $\\text{red (on, }j=2\\text{)}$ | 400.2 | 0.318 |  |  | 0.006 |',
    table_markdown_math_as_ascii: '| "curve (chiller condition, "j")" | hat(sigma)_(j)^(2) | hat(pi)_(j) | hat(a)_(12) | hat(a)_(21) | lambda_(j) |\n' +
      '| ---: | :---: | :---: | :---: | :---: | :---: |\n' +
      '| "black (off, "j=1")" | 12.2 | 0.682 | 0.015 | < 10^(-16) | 0.050 |\n' +
      '| "red (on, "j=2")" | 400.2 | 0.318 |  |  | 0.006 |'

  },
  {
    id: 33,
    latex: '\\begin{tabular}{c c c | c} \\multicolumn{3}{c|} \\multirow{3}{*} $\\mathbf{H}^{+}$ & $\\mathbf{0}$ \\\\ &&& $\\cdot$ \\\\ &&& $\\mathbf{0}$ \\\\ \\hline $\\mathbf{0}$ & $\\cdot$ & $\\mathbf{0}$ & $\\mathbf{H}^{-}$ \\end{tabular}',
    table_markdown:  '| $\\mathbf{H}^{+}$ |  |  | $\\mathbf{0}$ |\n' +
      '| :---: | :---: | :---: | :---: |\n' +
      '|  |  |  | $\\cdot$ |\n' +
      '|  |  |  | $\\mathbf{0}$ |\n' +
      '| $\\mathbf{0}$ | $\\cdot$ | $\\mathbf{0}$ | $\\mathbf{H}^{-}$ |',
    table_markdown_math_as_ascii: '| H^(+) |  |  | 0 |\n' +
      '| :---: | :---: | :---: | :---: |\n' +
      '|  |  |  | * |\n' +
      '|  |  |  | 0 |\n' +
      '| 0 | * | 0 | H^(-) |'
  },
  {
    id: 34,
    latex: '\\begin{tabular}{|c|l|c|c|c|c|} \\cline{3-6} \\multicolumn{2}{c|} & {A} & {B} & {C} & {D} \\\\ \\hline \\multirow{3}{*} {Mean} & {Human}&0.069&0.134&0.094&0.157 \\\\ \\cline{2-6} & {Sculpt}&0.112&0.177&0.131&0.193 \\\\ \\cline{2-6} & $\\textbf{% Increase}$&$\\mathbf{63.1}$&$\\mathbf{32.5}$&$\\mathbf{39.3}$&$\\mathbf{23.1}$ \\\\ \\hline \\multirow{3}{*} {Median} & {Human}&0.065&0.127&0.091&0.156 \\\\ \\cline{2-6} & {Sculpt}& 0.091&0.169&0.127&0.183 \\\\ \\cline{2-6} & \\textbf{% Increase}&$\\mathbf{40.2}$&$\\mathbf{33.5}$&$\\mathbf{40.4}$&$\\mathbf{17.4}$ \\\\ \\hline \\end{tabular}',
    table_markdown:  '|  |  | A | B | C | D |\n' +
      '| :---: | :--- | :---: | :---: | :---: | :---: |\n' +
      '| Mean | Human | 0.069 | 0.134 | 0.094 | 0.157 |\n' +
      '|  | Sculpt | 0.112 | 0.177 | 0.131 | 0.193 |\n' +
      '|  | $\\textbf{% Increase}$ | $\\mathbf{63.1}$ | $\\mathbf{32.5}$ | $\\mathbf{39.3}$ | $\\mathbf{23.1}$ |\n' +
      '| Median | Human | 0.065 | 0.127 | 0.091 | 0.156 |\n' +
      '|  | Sculpt | 0.091 | 0.169 | 0.127 | 0.183 |\n' +
      '|  | **% Increase** | $\\mathbf{40.2}$ | $\\mathbf{33.5}$ | $\\mathbf{40.4}$ | $\\mathbf{17.4}$ |',
    table_markdown_math_as_ascii: '|  |  | A | B | C | D |\n' +
      '| :---: | :--- | :---: | :---: | :---: | :---: |\n' +
      '| Mean | Human | 0.069 | 0.134 | 0.094 | 0.157 |\n' +
      '|  | Sculpt | 0.112 | 0.177 | 0.131 | 0.193 |\n' +
      '|  | "% Increase" | 63.1 | 32.5 | 39.3 | 23.1 |\n' +
      '| Median | Human | 0.065 | 0.127 | 0.091 | 0.156 |\n' +
      '|  | Sculpt | 0.091 | 0.169 | 0.127 | 0.183 |\n' +
      '|  | **% Increase** | 40.2 | 33.5 | 40.4 | 17.4 |'
  },
  {
    id: 35,
    latex: '\\begin{tabular}{|l|l|l|c|l|r|}\n' +
      '\\hline\n' +
      '1  & \\multirow{7}{*}{2} & \\multirow{6}{*}{3} & \\multirow{5}{*}{4}      & \\multirow{4}{*}{5} & 6  \\\\ \\cline{1-1} \\cline{6-6} \n' +
      '7  &                    &                    &                         &                    & 12 \\\\ \\cline{1-1} \\cline{6-6} \n' +
      '13 &                    &                    &                         &                    & 18 \\\\ \\cline{1-1} \\cline{6-6} \n' +
      '19 &                    &                    &                         &                    & 24 \\\\ \\cline{1-1} \\cline{5-6} \n' +
      '25 &                    &                    &                         & 29                 & 30 \\\\ \\cline{1-1} \\cline{4-6} \n' +
      '31 &                    &                    & \\multicolumn{1}{l|}{34} & 35                 & 36 \\\\ \\cline{1-1} \\cline{3-6} \n' +
      '37 &                    & 39                 & \\multicolumn{1}{l|}{40} & 41                 & 42 \\\\ \\hline\n' +
      '\\end{tabular}',
    table_markdown:  '| 1 | 2 | 3 | 4 | 5 | 6 |\n' +
      '| :--- | :--- | :--- | :---: | :--- | ---: |\n' +
      '| 7 |  |  |  |  | 12 |\n' +
      '| 13 |  |  |  |  | 18 |\n' +
      '| 19 |  |  |  |  | 24 |\n' +
      '| 25 |  |  |  | 29 | 30 |\n' +
      '| 31 |  |  | 34 | 35 | 36 |\n' +
      '| 37 |  | 39 | 40 | 41 | 42 |',
  },
  {
    id: 36,
    latex: '\\begin{tabular}{|l|l|l|c|l|r|l|l|l|}\n' +
      '\\hline\n' +
      '1                  & \\multirow{7}{*}{2} & \\multirow{6}{*}{3} & \\multirow{5}{*}{4}      & \\multirow{4}{*}{5} & 6                   & \\multirow{3}{*}{7}  & \\multirow{2}{*}{8} & 9                   \\\\ \\cline{1-1} \\cline{6-6} \\cline{9-9} \n' +
      '\\multirow{5}{*}{7} &                    &                    &                         &                    & 12                  &                     &                    & 3                   \\\\ \\cline{6-6} \\cline{8-9} \n' +
      '                   &                    &                    &                         &                    & 18                  &                     & 3                  & 3                   \\\\ \\cline{6-9} \n' +
      '                   &                    &                    &                         &                    & \\multirow{4}{*}{24} & 25                  & 26                 & 27                  \\\\ \\cline{5-5} \\cline{7-9} \n' +
      '                   &                    &                    &                         & 29                 &                     & \\multirow{3}{*}{31} & 32                 & 33                  \\\\ \\cline{4-5} \\cline{8-9} \n' +
      '                   &                    &                    & \\multicolumn{1}{l|}{34} & 35                 &                     &                     & 38                 & \\multirow{2}{*}{39} \\\\ \\cline{1-1} \\cline{3-5} \\cline{8-8}\n' +
      '37                 &                    & 39                 & \\multicolumn{1}{l|}{40} & 41                 &                     &                     & 44                 &                     \\\\ \\hline\n' +
      '\\end{tabular}',
    table_markdown:  '| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |\n' +
      '| :--- | :--- | :--- | :---: | :--- | ---: | :--- | :--- | :--- |\n' +
      '| 7 |  |  |  |  | 12 |  |  | 3 |\n' +
      '|  |  |  |  |  | 18 |  | 3 | 3 |\n' +
      '|  |  |  |  |  | 24 | 25 | 26 | 27 |\n' +
      '|  |  |  |  | 29 |  | 31 | 32 | 33 |\n' +
      '|  |  |  | 34 | 35 |  |  | 38 | 39 |\n' +
      '| 37 |  | 39 | 40 | 41 |  |  | 44 |  |',
  },
  {
    id: 37,
    latex: '\\begin{tabular}{|c|c|c|c|l|}\n' +
      '\\hline \n' +
      '2 & $\\pm \\frac{1}{\\sqrt{3}}$ & $\\pm 0.57735 \\ldots$ & \\multicolumn{2}{|c|}1 \\\\\n' +
      '\\hline \n' +
      '\\multirow{2}{*}3 & \\multicolumn{2}{|c|}0 & $\\frac{8}{9}$ & $0.888889 \\ldots$ \\\\\n' +
      '\\hline \n' +
      '& $\\pm \\sqrt{\\frac{3}{5}}$ & $\\pm 0.774597 \\ldots$ & $\\frac{5}{9}$ & $0.555556 \\ldots$ \\\\\n' +
      '\\hline \n' +
      '\\multirow{2}{*}4 & $\\pm \\sqrt{\\frac{3}{7}-\\frac{2}{7} \\sqrt{\\frac{6}{5}}}$ & $\\pm 0.339981 \\ldots$ & $\\frac{18+\\sqrt{30}}{36}$ & $0.652145 \\ldots$ \\\\\n' +
      '\\hline\n' +
      '& $\\pm \\sqrt{\\frac{3}{7}+\\frac{2}{7} \\sqrt{\\frac{6}{5}}}$ & $\\pm 0.861136 \\ldots$ & $\\frac{18-\\sqrt{30}}{36}$ & $0.347855 \\ldots$ \\\\\n' +
      '\\hline\n' +
      '\\multirow{3}{*}5 & \\multicolumn{2}{|c|}0 & $\\frac{128}{225}$ & $0.568889 \\ldots$ \\\\\n' +
      '\\hline\n' +
      '& $\\pm \\frac{1}{3} \\sqrt{5-2 \\sqrt{\\frac{10}{7}}}$ & $\\pm 0.538469 \\ldots$ & $\\frac{322+13 \\sqrt{70}}{900}$ & $0.478629 \\ldots$ \\\\\n' +
      '\\hline\n' +
      '& $\\pm \\frac{1}{3} \\sqrt{5+2 \\sqrt{\\frac{10}{7}}}$ & $\\pm 0.90618 \\ldots$ & $\\frac{322-13 \\sqrt{70}}{900}$ & $0.236927 \\ldots$ \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    table_markdown:  '| 2 | $\\pm \\frac{1}{\\sqrt{3}}$ | $\\pm 0.57735 \\ldots$ | 1 |  |\n' +
      '| :---: | :---: | :---: | :---: | :--- |\n' +
      '| 3 | 0 |  | $\\frac{8}{9}$ | $0.888889 \\ldots$ |\n' +
      '|  | $\\pm \\sqrt{\\frac{3}{5}}$ | $\\pm 0.774597 \\ldots$ | $\\frac{5}{9}$ | $0.555556 \\ldots$ |\n' +
      '| 4 | $\\pm \\sqrt{\\frac{3}{7}-\\frac{2}{7} \\sqrt{\\frac{6}{5}}}$ | $\\pm 0.339981 \\ldots$ | $\\frac{18+\\sqrt{30}}{36}$ | $0.652145 \\ldots$ |\n' +
      '|  | $\\pm \\sqrt{\\frac{3}{7}+\\frac{2}{7} \\sqrt{\\frac{6}{5}}}$ | $\\pm 0.861136 \\ldots$ | $\\frac{18-\\sqrt{30}}{36}$ | $0.347855 \\ldots$ |\n' +
      '| 5 | 0 |  | $\\frac{128}{225}$ | $0.568889 \\ldots$ |\n' +
      '|  | $\\pm \\frac{1}{3} \\sqrt{5-2 \\sqrt{\\frac{10}{7}}}$ | $\\pm 0.538469 \\ldots$ | $\\frac{322+13 \\sqrt{70}}{900}$ | $0.478629 \\ldots$ |\n' +
      '|  | $\\pm \\frac{1}{3} \\sqrt{5+2 \\sqrt{\\frac{10}{7}}}$ | $\\pm 0.90618 \\ldots$ | $\\frac{322-13 \\sqrt{70}}{900}$ | $0.236927 \\ldots$ |',
    table_markdown_math_as_ascii: '| 2 | +-(1)/(sqrt3) | +-0.57735 dots | 1 |  |\n' +
      '| :---: | :---: | :---: | :---: | :--- |\n' +
      '| 3 | 0 |  | (8)/(9) | 0.888889 dots |\n' +
      '|  | +-sqrt((3)/(5)) | +-0.774597 dots | (5)/(9) | 0.555556 dots |\n' +
      '| 4 | +-sqrt((3)/(7)-(2)/(7)sqrt((6)/(5))) | +-0.339981 dots | (18+sqrt30)/(36) | 0.652145 dots |\n' +
      '|  | +-sqrt((3)/(7)+(2)/(7)sqrt((6)/(5))) | +-0.861136 dots | (18-sqrt30)/(36) | 0.347855 dots |\n' +
      '| 5 | 0 |  | (128)/(225) | 0.568889 dots |\n' +
      '|  | +-(1)/(3)sqrt(5-2sqrt((10)/(7))) | +-0.538469 dots | (322+13sqrt70)/(900) | 0.478629 dots |\n' +
      '|  | +-(1)/(3)sqrt(5+2sqrt((10)/(7))) | +-0.90618 dots | (322-13sqrt70)/(900) | 0.236927 dots |'
  },
  {
    id: 38,
    latex: '\\begin{tabular}{|l|l|l|l|l|r|}\n' +
      '\\hline\n' +
      '1                   & 2                   & 3  & \\multicolumn{3}{c|}{4}                         \\\\ \\hline\n' +
      '\\multirow{3}{*}{7}  & \\multicolumn{3}{l|}{8}                         & 11 & \\multirow{2}{*}{12} \\\\ \\cline{2-5}\n' +
      '                    & \\multicolumn{4}{l|}{14}                             &                     \\\\ \\cline{2-6} \n' +
      '                    & \\multirow{2}{*}{20} & 21 & \\multirow{4}{*}{22} & 23 & 24                  \\\\ \\cline{1-1} \\cline{3-3} \\cline{5-6} \n' +
      '\\multirow{3}{*}{25} &                     & 27 &                     & \\multicolumn{2}{l|}{29}  \\\\ \\cline{2-3} \\cline{5-6} \n' +
      '                    & \\multicolumn{2}{l|}{32}  &                     & 35 & 36                  \\\\ \\cline{2-3} \\cline{5-6} \n' +
      '                    & 38                  & 39 &                     & \\multicolumn{2}{l|}{41}  \\\\ \\hline\n' +
      '\\end{tabular}',
    table_markdown: '| 1 | 2 | 3 | 4 |  |  |\n' +
      '| :--- | :--- | :--- | :--- | :--- | ---: |\n' +
      '| 7 | 8 |  |  | 11 | 12 |\n' +
      '|  | 14 |  |  |  |  |\n' +
      '|  | 20 | 21 | 22 | 23 | 24 |\n' +
      '| 25 |  | 27 |  | 29 |  |\n' +
      '|  | 32 |  |  | 35 | 36 |\n' +
      '|  | 38 | 39 |  | 41 |  |',
  },
  {
    id: 39,
    latex: '\\begin{tabular}{|c|c|c|c|c|c|}\\hline \\multirow{2}{*} {} & \\multicolumn{2}{|c|} { Latency \\( (\\mathrm{s}) \\)} & \\multicolumn{2}{|c|} { Message Sizes \\( (\\mathrm{MB}) \\)} & \\multirow{2}{*} { Accuracy \\( \\% \\)} \\\\ \\cline { 2 - 5 } & offline & online & offline & online & \\\\ \\hline ReLU/CNN/MNIST (Figure 12) & 3.58 & 5.74 & 20.9 & 636.6 & 99.0 \\\\ \\hline ReLU/CNN/CIFAR-10 (Figure 13) & 472 & 72 & 3046 & 6226 & 81.61 \\\\ \\hline Sigmoidal/LSTM/PTB (Figure 14) & 13.9 & 4.39 & 86.7 & 474 & cross-entropy loss:4.79 \\\\ \\hline\\end{tabular}',
    table_markdown:  '|  | Latency \\( (\\mathrm{s}) \\) |  | Message Sizes \\( (\\mathrm{MB}) \\) |  | Accuracy \\( \\% \\) |\n' +
      '| :---: | :---: | :---: | :---: | :---: | :---: |\n' +
      '|  | offline | online | offline | online |  |\n' +
      '| ReLU/CNN/MNIST (Figure 12) | 3.58 | 5.74 | 20.9 | 636.6 | 99.0 |\n' +
      '| ReLU/CNN/CIFAR-10 (Figure 13) | 472 | 72 | 3046 | 6226 | 81.61 |\n' +
      '| Sigmoidal/LSTM/PTB (Figure 14) | 13.9 | 4.39 | 86.7 | 474 | cross-entropy loss:4.79 |',
    table_markdown_math_as_ascii: '|  | Latency (s) |  | Message Sizes (MB) |  | Accuracy % |\n' +
      '| :---: | :---: | :---: | :---: | :---: | :---: |\n' +
      '|  | offline | online | offline | online |  |\n' +
      '| ReLU/CNN/MNIST (Figure 12) | 3.58 | 5.74 | 20.9 | 636.6 | 99.0 |\n' +
      '| ReLU/CNN/CIFAR-10 (Figure 13) | 472 | 72 | 3046 | 6226 | 81.61 |\n' +
      '| Sigmoidal/LSTM/PTB (Figure 14) | 13.9 | 4.39 | 86.7 | 474 | cross-entropy loss:4.79 |'
  },
  {
    id: 40,
    latex: '\\begin{tabular}{ l c r }\n' +
      '  1 & # Welcome to the Snip Editor! & 3 \\\\\n' +
      '  4 & [This is a link to the Mathpix website](http://mathpix.com/) & 6 \\\\\n' +
      '  ![original image](https://staging-cdn.mathpix.com/snip/images/l6xqPaxayiUYy1wkhr9aAqXqaL-RzclfJuPVxO0imQQ.original.fullsize.png) & <smiles>CO</smiles> & 9 \\\\\n' +
      '\\end{tabular}',
    table_markdown:  '| 1 | # Welcome to the Snip Editor! | 3 |\n' +
      '| :--- | :---: | ---: |\n' +
      '| 4 | [This is a link to the Mathpix website](http://mathpix.com/) | 6 |\n' +
      '| ![original image](https://staging-cdn.mathpix.com/snip/images/l6xqPaxayiUYy1wkhr9aAqXqaL-RzclfJuPVxO0imQQ.original.fullsize.png) | <smiles>CO</smiles> | 9 |'
  },
  {
    id: 41,
    latex: '\\begin{tabular}{l|S|r|l}\n' +
      '      *Value 1* & **Value 2** & \\texttt{Value 3} & \\textit{Value 4}\\\\\n' +
      '      $\\alpha$ & $\\beta$ & $\\gamma$ & $\\delta$ \\\\\n' +
      '      \\hline\n' +
      '      ~~1~~ & `1110.1` & a & e\\\\\n' +
      '      ==2== & 10.1 & b & f\\\\\n' +
      '      3 & 23.113231 & c & g\\\\\n' +
      '    \\end{tabular}',
    table_markdown:  '| *Value 1* | **Value 2** | `Value 3` | *Value 4* |\n' +
      '| :--- | --- | ---: | :--- |\n' +
      '| $\\alpha$ | $\\beta$ | $\\gamma$ | $\\delta$ |\n' +
      '| ~~1~~ | `1110.1` | a | e |\n' +
      '| ==2== | 10.1 | b | f |\n' +
      '| 3 | 23.113231 | c | g |',
    table_markdown_math_as_ascii: '| *Value 1* | **Value 2** | `Value 3` | *Value 4* |\n' +
      '| :--- | --- | ---: | :--- |\n' +
      '| alpha | beta | gamma | delta |\n' +
      '| ~~1~~ | `1110.1` | a | e |\n' +
      '| ==2== | 10.1 | b | f |\n' +
      '| 3 | 23.113231 | c | g |'
  },
  {
    id: 42,
    latex: '\\begin{tabular}{ l c r }\n' +
      '  1 & 2 | 2 & 3 \\\\\n' +
      '  4 & 5 & 6 \\\\\n' +
      '  7 & 8 & 9 \\\\\n' +
      '\\end{tabular}',
    table_markdown:  '| 1 | 2 \\| 2 | 3 |\n' +
      '| :--- | :---: | ---: |\n' +
      '| 4 | 5 | 6 |\n' +
      '| 7 | 8 | 9 |'
  },
  {
    id: 43,
    latex: '\\begin{tabular}{ l c r }\n' +
      '  1 & 2 | 2 & 3 \\\\\n' +
      '  4 & \\begin{tabular}{ l c r }\n' +
      '  1 & 2 | 2 & 3 \\\\\n' +
      '  4 & 5 & 6 \\\\\n' +
      '  7 & 8 & 9 \\\\\n' +
      '\\end{tabular} & 6 \\\\\n' +
      '  7 & 8 & 9 \\\\\n' +
      '\\end{tabular}',
    table_markdown:  '| 1 | 2 \\| 2 | 3 |\n' +
      '| :--- | :---: | ---: |\n' +
      '| 4 | 1 2 \\| 2 3 <br> 4 5 6 <br> 7 8 9 | 6 |\n' +
      '| 7 | 8 | 9 |'
  },
  {
    id: 44,
    latex: '\\begin{tabular}{ l c r }\n' +
      '  1 & # Welcome to the Snip Editor! & 3 \\\\\n' +
      '  4 & [This is | a link to the Mathpix website](http://mathpix.com/) & 6 \\\\\n' +
      '  ![original image](https://staging-cdn.mathpix.com/snip/images/l6xqPaxayiUYy1wkhr9aAqXqaL-RzclfJuPVxO0imQQ.original.fullsize.png) & <smiles>CO</smiles> & 9 \\\\\n' +
      '\\end{tabular}',
    table_markdown:  '| 1 | # Welcome to the Snip Editor! | 3 |\n' +
      '| :--- | :---: | ---: |\n' +
      '| 4 | [This is \\| a link to the Mathpix website](http://mathpix.com/) | 6 |\n' +
      '| ![original image](https://staging-cdn.mathpix.com/snip/images/l6xqPaxayiUYy1wkhr9aAqXqaL-RzclfJuPVxO0imQQ.original.fullsize.png) | <smiles>CO</smiles> | 9 |'
  },
  {
    id: 45,
    latex: '\\begin{tabular}{l|S|r|l}\n' +
      '  *Value | 1* & **Value 2** & \\texttt{Value 3} & \\textit{Value | 4}\\\\\n' +
      '  $\\alpha$ & $\\beta$ & $\\gamma$ & $\\delta$ \\\\\n' +
      '  \\hline\n' +
      '  ~~1 | g~~ & `1110.1 | 4` & a & e\\\\\n' +
      '  ==2 | f== & 10.1 & b & f\\\\\n' +
      '  3 & 23.113231 & c & g\\\\\n' +
      '\\end{tabular}',
    table_markdown:  '| *Value \\| 1* | **Value 2** | `Value 3` | *Value \\| 4* |\n' +
      '| :--- | --- | ---: | :--- |\n' +
      '| $\\alpha$ | $\\beta$ | $\\gamma$ | $\\delta$ |\n' +
      '| ~~1 \\| g~~ | `1110.1 \\| 4` | a | e |\n' +
      '| ==2 \\| f== | 10.1 | b | f |\n' +
      '| 3 | 23.113231 | c | g |',
    table_markdown_math_as_ascii: '| *Value \\| 1* | **Value 2** | `Value 3` | *Value \\| 4* |\n' +
      '| :--- | --- | ---: | :--- |\n' +
      '| alpha | beta | gamma | delta |\n' +
      '| ~~1 \\| g~~ | `1110.1 \\| 4` | a | e |\n' +
      '| ==2 \\| f== | 10.1 | b | f |\n' +
      '| 3 | 23.113231 | c | g |'
  },
  // {
  //   id: 40,
  //   latex: '',
  //   table_markdown:  ''
  // },
  // {
  //   id: 40,
  //   latex: '',
  //   table_markdown:  ''
  // },
];
