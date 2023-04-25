module.exports = [
  {
    latex: '\\begin{tabular}{ l c r }\n' +
      '  1 & 2 & 3 \\\\\n' +
      '  4 & 5 & 6 \\\\\n' +
      '  7 & 8 & 9 \\\\\n' +
      '\\end{tabular}',
    tsv: '1\t2\t3\n4\t5\t6\n7\t8\t9',
    csvQuoteAllFields: '"1","2","3"\n' +
      '"4","5","6"\n' +
      '"7","8","9"',
    csv: '1,2,3\n' +
      '4,5,6\n' +
      '7,8,9'
  },
  {
    latex: '\\begin{tabular}{ | l | c | r | }\n' +
      '  1 & 2 & 3 \\\\\n' +
      '  4 & 5 & 6 \\\\\n' +
      '  7 & 8 & 9 \\\\\n' +
      '\\end{tabular}',
    tsv: '1\t2\t3\n4\t5\t6\n7\t8\t9',
    csv: '1,2,3\n' +
      '4,5,6\n' +
      '7,8,9',
    csvQuoteAllFields: '"1","2","3"\n' +
      '"4","5","6"\n' +
      '"7","8","9"'
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
    csv: '1,2,3\n' +
      '4,5,6\n' +
      '7,8,9',
    csvQuoteAllFields: '"1","2","3"\n' +
      '"4","5","6"\n' +
      '"7","8","9"'
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
    csv: '1,2,3\n' +
      '4,5,6\n' +
      '7,8,9',
    csvQuoteAllFields: '"1","2","3"\n' +
      '"4","5","6"\n' +
      '"7","8","9"'

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
    csv: '1,2,3\n' +
      '4,5,6\n' +
      '7,8,9',
    csvQuoteAllFields: '"1","2","3"\n' +
      '"4","5","6"\n' +
      '"7","8","9"'
  },  
  {
    latex: '\\begin{tabular}{l|S|r|l}\n' +
      '      \\textbf{Value 1} & \\textbf{Value 2} & \\textbf{Value 3} & \\textbf{Value 4}\\\\\n' +
      '      $\\alpha$ & $\\beta$ & $\\gamma$ & $\\delta$ \\\\\n' +
      '      \\hline\n' +
      '      1 & 1110.1 & a & e\\\\\n' +
      '      2 & 10.1 & b & f\\\\\n' +
      '      3 & 23.113231 & c & g\\\\\n' +
      '    \\end{tabular}',
    tsv: 'Value 1\tValue 2\tValue 3\tValue 4\n' +
      'alpha\tbeta\tgamma\tdelta\n' +
      '1\t1110.1\ta\te\n' +
      '2\t10.1\tb\tf\n' +
      '3\t23.113231\tc\tg',
    csv: 'Value 1,Value 2,Value 3,Value 4\n' +
      'alpha,beta,gamma,delta\n' +
      '1,1110.1,a,e\n' +
      '2,10.1,b,f\n' +
      '3,23.113231,c,g',
    csvQuoteAllFields: '"Value 1","Value 2","Value 3","Value 4"\n' +
      '"alpha","beta","gamma","delta"\n' +
      '"1","1110.1","a","e"\n' +
      '"2","10.1","b","f"\n' +
      '"3","23.113231","c","g"'
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
    csv: 'Day,Min Temp,Max Temp,Summary\n' +
      'Monday,11C,22C,"A clear day with lots of sunshine. However, the strong breeze will bring down the temperatures."\n' +
      'Tuesday,9C,19C,"Cloudy with rain, across many northern regions. Clear spells across most of Scotland and Northern Ireland, but rain reaching the far northwest."\n' +
      'Wednesday,10C,21C,Rain will still linger for the morning. Conditions will improve by early afternoon and continue throughout the evening.',
    csvQuoteAllFields: '"Day","Min Temp","Max Temp","Summary"\n' +
      '"Monday","11C","22C","A clear day with lots of sunshine. However, the strong breeze will bring down the temperatures."\n' +
      '"Tuesday","9C","19C","Cloudy with rain, across many northern regions. Clear spells across most of Scotland and Northern Ireland, but rain reaching the far northwest."\n' +
      '"Wednesday","10C","21C","Rain will still linger for the morning. Conditions will improve by early afternoon and continue throughout the evening."'
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
    csv: 'Day,Min Temp,Max Temp,Summary\n' +
      'Monday,11C,22C,"A clear day with lots of sunshine.   However, the strong breeze will bring down the temperatures."\n' +
      'Tuesday,9C,19C,"Cloudy with rain, across many northern regions. Clear spells across most of Scotland and Northern Ireland, but rain reaching the far northwest."\n' +
      'Wednesday,10C,21C,Rain will still linger for the morning. Conditions will improve by early afternoon and continue throughout the evening.',
    csvQuoteAllFields: '"Day","Min Temp","Max Temp","Summary"\n' +
      '"Monday","11C","22C","A clear day with lots of sunshine.   However, the strong breeze will bring down the temperatures."\n' +
      '"Tuesday","9C","19C","Cloudy with rain, across many northern regions. Clear spells across most of Scotland and Northern Ireland, but rain reaching the far northwest."\n' +
      '"Wednesday","10C","21C","Rain will still linger for the morning. Conditions will improve by early afternoon and continue throughout the evening."'
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
      'ST\tMark Viduka',
    csv: 'Team sheet,\n' +
      'GK,Paul Robinson\n' +
      'LB,Lucas Radebe\n' +
      'DC,Michael Duberry\n' +
      'DC,Dominic Matteo\n' +
      'RB,Dider Domi\n' +
      'MC,David Batty\n' +
      'MC,Eirik Bakke\n' +
      'MC,Jody Morris\n' +
      'FW,Jamie McMaster\n' +
      'ST,Alan Smith\n' +
      'ST,Mark Viduka',
    csvQuoteAllFields: '"Team sheet",\n' +
      '"GK","Paul Robinson"\n' +
      '"LB","Lucas Radebe"\n' +
      '"DC","Michael Duberry"\n' +
      '"DC","Dominic Matteo"\n' +
      '"RB","Dider Domi"\n' +
      '"MC","David Batty"\n' +
      '"MC","Eirik Bakke"\n' +
      '"MC","Jody Morris"\n' +
      '"FW","Jamie McMaster"\n' +
      '"ST","Alan Smith"\n' +
      '"ST","Mark Viduka"'
  },  
  {
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
    csv: 'Team sheet,,\n' +
      'Goalkeeper,GK,Paul Robinson\n' +
      'Defenders,LB,Lucas Radebe\n' +
      ',DC,Michael Duburry\n' +
      ',DC,Dominic Matteo\n' +
      ',RB,Didier Domi\n' +
      'Midfielders,MC,David Batty\n' +
      ',MC,Eirik Bakke\n' +
      ',MC,Jody Morris\n' +
      'Forward,FW,Jamie McMaster\n' +
      'Strikers,ST,Alan Smith\n' +
      ',ST,Mark Viduka',
    csvQuoteAllFields: '"Team sheet",,\n' +
      '"Goalkeeper","GK","Paul Robinson"\n' +
      '"Defenders","LB","Lucas Radebe"\n' +
      ',"DC","Michael Duburry"\n' +
      ',"DC","Dominic Matteo"\n' +
      ',"RB","Didier Domi"\n' +
      '"Midfielders","MC","David Batty"\n' +
      ',"MC","Eirik Bakke"\n' +
      ',"MC","Jody Morris"\n' +
      '"Forward","FW","Jamie McMaster"\n' +
      '"Strikers","ST","Alan Smith"\n' +
      ',"ST","Mark Viduka"'
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
    csv: ',,Primes,,,,\n' +
      ',,2,3,5,7,\n' +
      'Powers,504,3,2,0,1,\n' +
      ',540,2,3,1,0,\n' +
      'Powers,gcd,2,2,0,0,min\n' +
      ',lcm,3,3,1,1,max',
    csvQuoteAllFields: ',,"Primes",,,,\n' +
      ',,"2","3","5","7",\n' +
      '"Powers","504","3","2","0","1",\n' +
      ',"540","2","3","1","0",\n' +
      '"Powers","gcd","2","2","0","0","min"\n' +
      ',"lcm","3","3","1","1","max"'
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
    csv: ',noninteractive,interactive\n' +
      'massively multiple,Library,University\n' +
      'one-to-one,Book,Tutor',
    csvQuoteAllFields: ',"noninteractive","interactive"\n' +
      '"massively multiple","Library","University"\n' +
      '"one-to-one","Book","Tutor"'
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
    csv: 'Col1,Col2,Col2,Col3\n' +
      '1,6,87837,787\n' +
      '2,7,78,5415\n' +
      '3,545,778,7507\n' +
      '4,545,18744,7560\n' +
      '5,88,788,6344',
    csvQuoteAllFields: '"Col1","Col2","Col2","Col3"\n' +
      '"1","6","87837","787"\n' +
      '"2","7","78","5415"\n' +
      '"3","545","778","7507"\n' +
      '"4","545","18744","7560"\n' +
      '"5","88","788","6344"'
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
    csv: 'Col1,Col2,Col2,Col3\n' +
      '1,6,87837,787\n' +
      '2,7,78,5415\n' +
      '3,545,778,7507\n' +
      '4,545,18744,7560\n' +
      '5,88,788,6344',
    csvQuoteAllFields: '"Col1","Col2","Col2","Col3"\n' +
      '"1","6","87837","787"\n' +
      '"2","7","78","5415"\n' +
      '"3","545","778","7507"\n' +
      '"4","545","18744","7560"\n' +
      '"5","88","788","6344"'
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
    csv: 'Col1,Col2,Col2,Col3\n' +
      '1,6,87837,787\n' +
      '2,7,78,5415\n' +
      '3,545,778,7507\n' +
      '4,545,18744,7560\n' +
      '5,88,788,6344',
    csvQuoteAllFields: '"Col1","Col2","Col2","Col3"\n' +
      '"1","6","87837","787"\n' +
      '"2","7","78","5415"\n' +
      '"3","545","778","7507"\n' +
      '"4","545","18744","7560"\n' +
      '"5","88","788","6344"'
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
    tsv: '\tA\tB\n' +
      'Foo\t"1\n' +
      '2\n' +
      '3\n' +
      '4"\t"2\n' +
      '5\n' +
      '9\n' +
      '8"\n' +
      'Bar\t"1\n' +
      '2\n' +
      '3\n' +
      '4"\t"31\n' +
      '23\n' +
      '16\n' +
      '42"',
    csv: ',A,B\n' +
      'Foo,"1\n' +
      '2\n' +
      '3\n' +
      '4","2\n' +
      '5\n' +
      '9\n' +
      '8"\n' +
      'Bar,"1\n' +
      '2\n' +
      '3\n' +
      '4","31\n' +
      '23\n' +
      '16\n' +
      '42"',
    csvQuoteAllFields: ',"A","B"\n' +
      '"Foo","1\n' +
      '2\n' +
      '3\n' +
      '4","2\n' +
      '5\n' +
      '9\n' +
      '8"\n' +
      '"Bar","1\n' +
      '2\n' +
      '3\n' +
      '4","31\n' +
      '23\n' +
      '16\n' +
      '42"'
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
    csv: 'My cells2,,\n' +
      'Multiple rows,cell2,cell3\n' +
      ',cell5,cell6\n' +
      ',cell8,cell9',
    csvQuoteAllFields: '"My cells2",,\n' +
      '"Multiple rows","cell2","cell3"\n' +
      ',"cell5","cell6"\n' +
      ',"cell8","cell9"'
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
    tsv: 'formula (grad^(2)A)/(A)=-k^(2)\tcell2\tcell3',
    csv: 'formula (grad^(2)A)/(A)=-k^(2),cell2,cell3',
    csvQuoteAllFields: '"formula (grad^(2)A)/(A)=-k^(2)","cell2","cell3"'
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
    csv: '1,Day,,\n' +
      '1,,,4\n' +
      '1,2,3,4',
    csvQuoteAllFields: '"1","Day",,\n' +
      '"1",,,"4"\n' +
      '"1","2","3","4"'
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
    csv: 'alms\'s,economizes,,,,recondition,bailing,asymptotically\n' +
      'fiddle,kitchenettes,,,,,misstates,',
    csvQuoteAllFields: '"alms\'s","economizes",,,,"recondition","bailing","asymptotically"\n' +
      '"fiddle","kitchenettes",,,,,"misstates",'
  },
  {
    latex: '\\begin{tabular}{|c|c|}\\hline Feature & Component \\\\ \\hline \\hline Power lock & Door lock manager \\& Power lock \\\\ Door lock & Auto lock \\\\ Door relock & Auto lock \\\\ f_Automatic & c_Automatic \\\\ f_Manual & c_Manual \\\\ Shift out of Park & Gear in Park \\\\ f_Speed & c_Speed \\\\ \\hline\\end{tabular}',
    tsv:   'Feature\tComponent\n' +
      'Power lock\tDoor lock manager & Power lock\n' +
      'Door lock\tAuto lock\n' +
      'Door relock\tAuto lock\n' +
      'f_Automatic\tc_Automatic\n' +
      'f_Manual\tc_Manual\n' +
      'Shift out of Park\tGear in Park\n' +
      'f_Speed\tc_Speed',
    csv: 'Feature,Component\n' +
      'Power lock,Door lock manager & Power lock\n' +
      'Door lock,Auto lock\n' +
      'Door relock,Auto lock\n' +
      'f_Automatic,c_Automatic\n' +
      'f_Manual,c_Manual\n' +
      'Shift out of Park,Gear in Park\n' +
      'f_Speed,c_Speed',
    csvQuoteAllFields: '"Feature","Component"\n' +
      '"Power lock","Door lock manager & Power lock"\n' +
      '"Door lock","Auto lock"\n' +
      '"Door relock","Auto lock"\n' +
      '"f_Automatic","c_Automatic"\n' +
      '"f_Manual","c_Manual"\n' +
      '"Shift out of Park","Gear in Park"\n' +
      '"f_Speed","c_Speed"'
  },
  {
    latex: '\\begin{tabular}{|l|l|}\n' +
      '\\hline \\hline Plan 1 & Plan 2 \\\\\n' +
      '\\hline Employee pays \\$100 & Employee pays \\$200 \\\\\n' +
      '\\hline Plan pays 70\\% of the rest & Plan pays 80\\% of the rest \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv: 'Plan 1\tPlan 2\n' +
      'Employee pays $100\tEmployee pays $200\n' +
      'Plan pays 70% of the rest\tPlan pays 80% of the rest',
    csv: 'Plan 1,Plan 2\n' +
      'Employee pays $100,Employee pays $200\n' +
      'Plan pays 70% of the rest,Plan pays 80% of the rest',
    csvQuoteAllFields: '"Plan 1","Plan 2"\n' +
      '"Employee pays $100","Employee pays $200"\n' +
      '"Plan pays 70% of the rest","Plan pays 80% of the rest"'
  },
  { latex: '\\begin{tabular}{|l|l|r|}\\hline\n' +
      '\\multicolumn{2}{|c|}{Item}&  \\\\\\hline\n' +
      'Animal & Description & Price (\\$) \\\\\\hline\n' +
      '\\multirow{2}{*}{Gnat } & per gram & \\multirow{2}{*}{13.65} \\\\\\hline\n' +
      '& \\multirow{2}{*}{each} &  \\\\\\hline\n' +
      'Gnu &  & 92.50  \\\\\\hline\n' +
      'Emu & stuffed  & 33.33  \\\\\\hline\n' +
      'Armadillo & frozen  & 8.99  \\\\\\hline\n' +
      '\\end{tabular}',
    tsv: 'Item\t\t\n' +
      'Animal\tDescription\tPrice ($)\n' +
      'Gnat\tper gram\t13.65\n' +
      '\teach\t\n' +
      'Gnu\t\t92.50\n' +
      'Emu\tstuffed\t33.33\n' +
      'Armadillo\tfrozen\t8.99',
    csv: 'Item,,\n' +
      'Animal,Description,Price ($)\n' +
      'Gnat,per gram,13.65\n' +
      ',each,\n' +
      'Gnu,,92.50\n' +
      'Emu,stuffed,33.33\n' +
      'Armadillo,frozen,8.99',
    csvQuoteAllFields: '"Item",,\n' +
      '"Animal","Description","Price ($)"\n' +
      '"Gnat","per gram","13.65"\n' +
      ',"each",\n' +
      '"Gnu",,"92.50"\n' +
      '"Emu","stuffed","33.33"\n' +
      '"Armadillo","frozen","8.99"'
  },
  {
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
    tsv: 'title1\t\ttitle1\n' +
      'Animal\tDescription\t\n' +
      'Gnat\t\t\n' +
      '\teach\t0.01\n' +
      'Gnu\tstuffed\t92.50\n' +
      '\tstuffed\t\n' +
      'Armadillo\tfrozen\t8.99',
    csv: 'title1,,title1\n' +
      'Animal,Description,\n' +
      'Gnat,,\n' +
      ',each,0.01\n' +
      'Gnu,stuffed,92.50\n' +
      ',stuffed,\n' +
      'Armadillo,frozen,8.99',
    csvQuoteAllFields: '"title1",,"title1"\n' +
      '"Animal","Description",\n' +
      '"Gnat",,\n' +
      ',"each","0.01"\n' +
      '"Gnu","stuffed","92.50"\n' +
      ',"stuffed",\n' +
      '"Armadillo","frozen","8.99"'
  },
  {
    latex: '\\begin{tabular} { | c | c | c | } \\hline \\multirow{2}{*} {Total Production of Higgs Bosons} & \\multicolumn { 2 } { | c | } $\\mathcal { L } = 50 \\mathrm{~fb} ^ { - 1 }$ \\\\ \\cline{2-3} & $\\tan \\beta = 10$ & $\\tan \\beta = 30$ \\\\ \\hline \\hline $h ^ { 0 }$ & 1600 & 1800 \\\\ $H ^ { 0 }$ & 700 & 470 \\\\ $A ^ { 0 }$ & 900 & 935 \\\\ $H ^ { + } H ^ { - }$ & 7000 & 6500 \\\\ \\hline \\end{tabular}',
    tsv: 'Total Production of Higgs Bosons\tL=50fb^(-1)\t\n' +
      '\ttan beta=10\ttan beta=30\n' +
      'h^(0)\t1600\t1800\n' +
      'H^(0)\t700\t470\n' +
      'A^(0)\t900\t935\n' +
      'H^(+)H^(-)\t7000\t6500',
    csv: 'Total Production of Higgs Bosons,L=50fb^(-1),\n' +
      ',tan beta=10,tan beta=30\n' +
      'h^(0),1600,1800\n' +
      'H^(0),700,470\n' +
      'A^(0),900,935\n' +
      'H^(+)H^(-),7000,6500',
    csvQuoteAllFields: '"Total Production of Higgs Bosons","L=50fb^(-1)",\n' +
      ',"tan beta=10","tan beta=30"\n' +
      '"h^(0)","1600","1800"\n' +
      '"H^(0)","700","470"\n' +
      '"A^(0)","900","935"\n' +
      '"H^(+)H^(-)","7000","6500"'
  },
  {
    latex: '\\begin{tabular}{rccccc} \\hline $\\text{curve (chiller condition, }j\\text{)}$ &$\\hat{\\sigma}_{j}^{2}$& $\\hat{\\pi}_{j}$&$\\hat{a}_{12}$&$\\hat{a}_{21}$&$\\lambda_{j}$ \\\\ \\hline $\\text{black (off, }j=1\\text{)}$ &12.2&0.682&\\multirow{2}{*} 0.015 & \\multirow{2}{*} $<10^{-16}$& 0.050 \\\\ $\\text{red (on, }j=2\\text{)}$&400.2&0.318&&&0.006 \\\\ \\hline \\end{tabular}',
    tsv: '"curve (chiller condition, "j")"\that(sigma)_(j)^(2)\that(pi)_(j)\that(a)_(12)\that(a)_(21)\tlambda_(j)\n' +
      '"black (off, "j=1")"\t12.2\t0.682\t0.015\t< 10^(-16)\t0.050\n' +
      '"red (on, "j=2")"\t400.2\t0.318\t\t\t0.006',
    csv: '"curve (chiller condition, j)",hat(sigma)_(j)^(2),hat(pi)_(j),hat(a)_(12),hat(a)_(21),lambda_(j)\n' +
      '"black (off, j=1)",12.2,0.682,0.015,< 10^(-16),0.050\n' +
      '"red (on, j=2)",400.2,0.318,,,0.006',
    csvQuoteAllFields: '"curve (chiller condition, j)","hat(sigma)_(j)^(2)","hat(pi)_(j)","hat(a)_(12)","hat(a)_(21)","lambda_(j)"\n' +
      '"black (off, j=1)","12.2","0.682","0.015","< 10^(-16)","0.050"\n' +
      '"red (on, j=2)","400.2","0.318",,,"0.006"'
  },
  {
    latex: '\\begin{tabular}{c c c | c} \\multicolumn{3}{c|} \\multirow{3}{*} $\\mathbf{H}^{+}$ & $\\mathbf{0}$ \\\\ &&& $\\cdot$ \\\\ &&& $\\mathbf{0}$ \\\\ \\hline $\\mathbf{0}$ & $\\cdot$ & $\\mathbf{0}$ & $\\mathbf{H}^{-}$ \\end{tabular}',
    tsv: 'H^(+)\t\t\t0\n\t\t\t*\n\t\t\t0\n0\t*\t0\tH^(-)',
    csv: 'H^(+),,,0\n' +
      ',,,*\n' +
      ',,,0\n' +
      '0,*,0,H^(-)',
    csvQuoteAllFields: '"H^(+)",,,"0"\n' +
      ',,,"*"\n' +
      ',,,"0"\n' +
      '"0","*","0","H^(-)"'
  },
  {
    latex: '\\begin{tabular}{|c|l|c|c|c|c|} \\cline{3-6} \\multicolumn{2}{c|} & {A} & {B} & {C} & {D} \\\\ \\hline \\multirow{3}{*} {Mean} & {Human}&0.069&0.134&0.094&0.157 \\\\ \\cline{2-6} & {Sculpt}&0.112&0.177&0.131&0.193 \\\\ \\cline{2-6} & $\\textbf{% Increase}$&$\\mathbf{63.1}$&$\\mathbf{32.5}$&$\\mathbf{39.3}$&$\\mathbf{23.1}$ \\\\ \\hline \\multirow{3}{*} {Median} & {Human}&0.065&0.127&0.091&0.156 \\\\ \\cline{2-6} & {Sculpt}& 0.091&0.169&0.127&0.183 \\\\ \\cline{2-6} & \\textbf{% Increase}&$\\mathbf{40.2}$&$\\mathbf{33.5}$&$\\mathbf{40.4}$&$\\mathbf{17.4}$ \\\\ \\hline \\end{tabular}',
    tsv: '\t\tA\tB\tC\tD\n' +
      'Mean\tHuman\t0.069\t0.134\t0.094\t0.157\n' +
      '\tSculpt\t0.112\t0.177\t0.131\t0.193\n' +
      '\t"% Increase"\t63.1\t32.5\t39.3\t23.1\n' +
      'Median\tHuman\t0.065\t0.127\t0.091\t0.156\n' +
      '\tSculpt\t0.091\t0.169\t0.127\t0.183\n' +
      '\t% Increase\t40.2\t33.5\t40.4\t17.4',
    csv: ',,A,B,C,D\n' +
      'Mean,Human,0.069,0.134,0.094,0.157\n' +
      ',Sculpt,0.112,0.177,0.131,0.193\n' +
      ',% Increase,63.1,32.5,39.3,23.1\n' +
      'Median,Human,0.065,0.127,0.091,0.156\n' +
      ',Sculpt,0.091,0.169,0.127,0.183\n' +
      ',% Increase,40.2,33.5,40.4,17.4',
    csvQuoteAllFields: ',,"A","B","C","D"\n' +
      '"Mean","Human","0.069","0.134","0.094","0.157"\n' +
      ',"Sculpt","0.112","0.177","0.131","0.193"\n' +
      ',"% Increase","63.1","32.5","39.3","23.1"\n' +
      '"Median","Human","0.065","0.127","0.091","0.156"\n' +
      ',"Sculpt","0.091","0.169","0.127","0.183"\n' +
      ',"% Increase","40.2","33.5","40.4","17.4"'
  },
  {
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
    tsv: '1\t2\t3\t4\t5\t6\n' +
      '7\t\t\t\t\t12\n' +
      '13\t\t\t\t\t18\n' +
      '19\t\t\t\t\t24\n' +
      '25\t\t\t\t29\t30\n' +
      '31\t\t\t34\t35\t36\n' +
      '37\t\t39\t40\t41\t42',
    csv: '1,2,3,4,5,6\n' +
      '7,,,,,12\n' +
      '13,,,,,18\n' +
      '19,,,,,24\n' +
      '25,,,,29,30\n' +
      '31,,,34,35,36\n' +
      '37,,39,40,41,42',
    csvQuoteAllFields: '"1","2","3","4","5","6"\n' +
      '"7",,,,,"12"\n' +
      '"13",,,,,"18"\n' +
      '"19",,,,,"24"\n' +
      '"25",,,,"29","30"\n' +
      '"31",,,"34","35","36"\n' +
      '"37",,"39","40","41","42"'
  },
  {
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
    tsv: '1\t2\t3\t4\t5\t6\t7\t8\t9\n' +
      '7\t\t\t\t\t12\t\t\t3\n' +
      '\t\t\t\t\t18\t\t3\t3\n' +
      '\t\t\t\t\t24\t25\t26\t27\n' +
      '\t\t\t\t29\t\t31\t32\t33\n' +
      '\t\t\t34\t35\t\t\t38\t39\n' +
      '37\t\t39\t40\t41\t\t\t44\t',
    csv: '1,2,3,4,5,6,7,8,9\n' +
      '7,,,,,12,,,3\n' +
      ',,,,,18,,3,3\n' +
      ',,,,,24,25,26,27\n' +
      ',,,,29,,31,32,33\n' +
      ',,,34,35,,,38,39\n' +
      '37,,39,40,41,,,44,',
    csvQuoteAllFields: '"1","2","3","4","5","6","7","8","9"\n' +
      '"7",,,,,"12",,,"3"\n' +
      ',,,,,"18",,"3","3"\n' +
      ',,,,,"24","25","26","27"\n' +
      ',,,,"29",,"31","32","33"\n' +
      ',,,"34","35",,,"38","39"\n' +
      '"37",,"39","40","41",,,"44",'
  },
  {
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
    tsv: '2\t+-(1)/(sqrt3)\t+-0.57735 dots\t1\t\n' +
      '3\t0\t\t(8)/(9)\t0.888889 dots\n' +
      '\t+-sqrt((3)/(5))\t+-0.774597 dots\t(5)/(9)\t0.555556 dots\n' +
      '4\t+-sqrt((3)/(7)-(2)/(7)sqrt((6)/(5)))\t+-0.339981 dots\t(18+sqrt30)/(36)\t0.652145 dots\n' +
      '\t+-sqrt((3)/(7)+(2)/(7)sqrt((6)/(5)))\t+-0.861136 dots\t(18-sqrt30)/(36)\t0.347855 dots\n' +
      '5\t0\t\t(128)/(225)\t0.568889 dots\n' +
      '\t+-(1)/(3)sqrt(5-2sqrt((10)/(7)))\t+-0.538469 dots\t(322+13sqrt70)/(900)\t0.478629 dots\n' +
      '\t+-(1)/(3)sqrt(5+2sqrt((10)/(7)))\t+-0.90618 dots\t(322-13sqrt70)/(900)\t0.236927 dots',
    csv: '2,+-(1)/(sqrt3),+-0.57735 dots,1,\n' +
      '3,0,,(8)/(9),0.888889 dots\n' +
      ',+-sqrt((3)/(5)),+-0.774597 dots,(5)/(9),0.555556 dots\n' +
      '4,+-sqrt((3)/(7)-(2)/(7)sqrt((6)/(5))),+-0.339981 dots,(18+sqrt30)/(36),0.652145 dots\n' +
      ',+-sqrt((3)/(7)+(2)/(7)sqrt((6)/(5))),+-0.861136 dots,(18-sqrt30)/(36),0.347855 dots\n' +
      '5,0,,(128)/(225),0.568889 dots\n' +
      ',+-(1)/(3)sqrt(5-2sqrt((10)/(7))),+-0.538469 dots,(322+13sqrt70)/(900),0.478629 dots\n' +
      ',+-(1)/(3)sqrt(5+2sqrt((10)/(7))),+-0.90618 dots,(322-13sqrt70)/(900),0.236927 dots',
    csvQuoteAllFields: '"2","+-(1)/(sqrt3)","+-0.57735 dots","1",\n' +
      '"3","0",,"(8)/(9)","0.888889 dots"\n' +
      ',"+-sqrt((3)/(5))","+-0.774597 dots","(5)/(9)","0.555556 dots"\n' +
      '"4","+-sqrt((3)/(7)-(2)/(7)sqrt((6)/(5)))","+-0.339981 dots","(18+sqrt30)/(36)","0.652145 dots"\n' +
      ',"+-sqrt((3)/(7)+(2)/(7)sqrt((6)/(5)))","+-0.861136 dots","(18-sqrt30)/(36)","0.347855 dots"\n' +
      '"5","0",,"(128)/(225)","0.568889 dots"\n' +
      ',"+-(1)/(3)sqrt(5-2sqrt((10)/(7)))","+-0.538469 dots","(322+13sqrt70)/(900)","0.478629 dots"\n' +
      ',"+-(1)/(3)sqrt(5+2sqrt((10)/(7)))","+-0.90618 dots","(322-13sqrt70)/(900)","0.236927 dots"'
  },
  {
    latex: '\\begin{tabular}{|c|c|}\n' +
      '\\hline Image: & ![](https://cdn.mathpix.com/cropped/2023_02_22_6fd8bab63bd5a61e0117g-15.jpg?height=454\\&width=968\\&top_left_y=293\\&top_left_x=544) \\\\\n' +
      '\\hline Image type: & Logic circut \\\\ \\hline\n' +
      'Link: & [This is a link to the Mathpix website](http://mathpix.com) \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv: 'Image:\thttps://cdn.mathpix.com/cropped/2023_02_22_6fd8bab63bd5a61e0117g-15.jpg?height=454&width=968&top_left_y=293&top_left_x=544\n' +
      'Image type:\tLogic circut\n' +
      'Link:\thttp://mathpix.com',
    csv: 'Image:,https://cdn.mathpix.com/cropped/2023_02_22_6fd8bab63bd5a61e0117g-15.jpg?height=454&width=968&top_left_y=293&top_left_x=544\n' +
      'Image type:,Logic circut\n' +
      'Link:,http://mathpix.com',
    csvQuoteAllFields: '"Image:","https://cdn.mathpix.com/cropped/2023_02_22_6fd8bab63bd5a61e0117g-15.jpg?height=454&width=968&top_left_y=293&top_left_x=544"\n' +
      '"Image type:","Logic circut"\n' +
      '"Link:","http://mathpix.com"'
  },
  {
    latex: '\\begin{tabular}{|c|c|}\n' +
      '\\hline Image: & {\\includegraphics[max width=\\textwidth]{https://cdn.mathpix.com/cropped/2023_02_22_6fd8bab63bd5a61e0117g-15.jpg?height=454\\&width=968\\&top_left_y=293\\&top_left_x=544}} \\\\\n' +
      '\\hline Image type: & Logic circut \\\\ \\hline\n' +
      'Link: & [This is a link to the Mathpix website](http://mathpix.com) \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv: 'Image:\thttps://cdn.mathpix.com/cropped/2023_02_22_6fd8bab63bd5a61e0117g-15.jpg?height=454&width=968&top_left_y=293&top_left_x=544\n' +
      'Image type:\tLogic circut\n' +
      'Link:\thttp://mathpix.com',
    csv: 'Image:,https://cdn.mathpix.com/cropped/2023_02_22_6fd8bab63bd5a61e0117g-15.jpg?height=454&width=968&top_left_y=293&top_left_x=544\n' +
      'Image type:,Logic circut\n' +
      'Link:,http://mathpix.com',
    csvQuoteAllFields: '"Image:","https://cdn.mathpix.com/cropped/2023_02_22_6fd8bab63bd5a61e0117g-15.jpg?height=454&width=968&top_left_y=293&top_left_x=544"\n' +
      '"Image type:","Logic circut"\n' +
      '"Link:","http://mathpix.com"'
  },
  {
    latex: '\\begin{tabular}{|c|c|}\n' +
      '\\hline Image mmd: & ![](https://mañana.com/logo.jpg) \\\\\n' +
      '\\hline Image latex: & {\\includegraphics[max width=\\textwidth]{https://mañana.com/logo.jpg}} \\\\ \\hline\n' +
      'Link mmd: & [link mmd](https://mañana.com/logo.jpg) \\\\ \\hline\n' +
      '\\end{tabular}',
    tsv: 'Image mmd:\thttps://xn--maana-pta.com/logo.jpg\n' +
      'Image latex:\thttps://xn--maana-pta.com/logo.jpg\n' +
      'Link mmd:\thttps://xn--maana-pta.com/logo.jpg',
    csv: 'Image mmd:,https://xn--maana-pta.com/logo.jpg\n' +
      'Image latex:,https://xn--maana-pta.com/logo.jpg\n' +
      'Link mmd:,https://xn--maana-pta.com/logo.jpg',
    csvQuoteAllFields: '"Image mmd:","https://xn--maana-pta.com/logo.jpg"\n' +
      '"Image latex:","https://xn--maana-pta.com/logo.jpg"\n' +
      '"Link mmd:","https://xn--maana-pta.com/logo.jpg"'
  },
  {
    latex: '\\begin{tabular}{|c|c|}\n' +
      '\\hline \\begin{tabular}{l} Text \\\\ More text\\end{tabular} & 1 \\\\\n' +
      '\\hline 2 & 2 \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv: '"Text\n' +
      'More text"\t1\n' +
      '2\t2',
    csv: '"Text\n' +
      'More text",1\n' +
      '2,2',
    csvQuoteAllFields: '"Text\n' +
      'More text","1"\n' +
      '"2","2"'
  },
  {
    latex: '\\begin{tabular}{|c|c|}\n' +
      '\\hline \\begin{tabular}{l} Text \\\\ More text\\end{tabular} & 1 \\\\\n' +
      '\\hline \\begin{tabular}{l} \\begin{tabular}{l} \\begin{tabular}{l} Text \\\\ More text\\end{tabular} \\\\ More text\\end{tabular}  \\\\ More text\\end{tabular}  & 2 \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv: '"Text\n' +
      'More text"\t1\n' +
      '"Text,More text,More text\n' +
      'More text"\t2',
    csv: '"Text\n' +
      'More text",1\n' +
      '"Text,More text,More text\n' +
      'More text",2',
    csvQuoteAllFields: '"Text\n' +
      'More text","1"\n' +
      '"Text,More text,More text\n' +
      'More text","2"'
  },
  {
    latex: '\\begin{tabular}{|c|c|} \\hline  \n' +
      'mt1 & \\begin{tabular}{|l|} \\hline  t1 \\\\ \\hline t2 \\\\ \\hline \\end{tabular} \\\\ \\hline \n' +
      'mt3 & mt4 \\\\ \\hline \n' +
      '\\end{tabular}',
    tsv: 'mt1\t"t1\n' +
      't2"\n' +
      'mt3\tmt4',
    csv: 'mt1,"t1\n' +
      't2"\n' +
      'mt3,mt4',
    csvQuoteAllFields: '"mt1","t1\n' +
      't2"\n' +
      '"mt3","mt4"'
  },
  {
    latex: '\\begin{tabular}{|c|c|} \\hline  \n' +
      '\\begin{array}{l} a1 \\\\ a2 \\end{array} & \\begin{tabular}{|l|} \\hline  t1 \\\\ \\hline t2 \\\\ \\hline \\end{tabular} \\\\ \\hline \n' +
      '\\begin{tabular}{|l|l|} \\hline  t1 & t2 \\\\ \\hline t3 & t4 \\\\ \\hline \\end{tabular} & mt4 \\\\ \\hline \n' +
      '\\end{tabular}',
    tsv: '"a1\n' +
      'a2"\t"t1\n' +
      't2"\n' +
      '"t1\tt2\n' +
      't3\tt4"\tmt4',
    csv: '"a1\n' +
      'a2","t1\n' +
      't2"\n' +
      '"t1,t2\n' +
      't3,t4",mt4',
    csvQuoteAllFields: '"a1\n' +
      'a2","t1\n' +
      't2"\n' +
      '"t1,t2\n' +
      't3,t4","mt4"'
  },
  {
    latex: '\\begin{tabular}{|c|c|} \\hline  \n' +
      '\\begin{array}{l} a1 \\\\ a2 \\end{array} \n' +
      '& \\begin{tabular}{|l|} \\hline  t1 \\\\ \\hline t2 \\\\ \\hline \\end{tabular} \\\\ \\hline \n' +
      '\\begin{tabular}{|l|l|} \\hline  t1 & t2 \\\\ \\hline t3 & t4 \\\\ \\hline \\end{tabular} \n' +
      '& \\begin{array}{l} a1 & a2 \\\\ a3 & a4 \\end{array} \\\\ \\hline \n' +
      '\\end{tabular}',
    tsv: '"a1\n' +
      'a2"\t"t1\n' +
      't2"\n' +
      '"t1\tt2\n' +
      't3\tt4"\t"a1\ta2\n' +
      'a3\ta4"',
    csv: '"a1\n' +
      'a2","t1\n' +
      't2"\n' +
      '"t1,t2\n' +
      't3,t4","a1,a2\n' +
      'a3,a4"',
    csvQuoteAllFields: '"a1\n' +
      'a2","t1\n' +
      't2"\n' +
      '"t1,t2\n' +
      't3,t4","a1,a2\n' +
      'a3,a4"'
  },
  {
    latex: '\\begin{tabular}{|c|c|} \\hline  \n' +
      'mt1 & \n' +
      '\\begin{tabular}{|l|} \\hline math \\begin{array}{l} na1 \\\\ na2 \\end{array} \\\\ \\hline t2 \\\\ \\hline \\end{tabular} \n' +
      '\\\\ \\hline \n' +
      '\\begin{tabular}{|l|l|} \\hline  t1 & t2 \\\\ \\hline t3 & t4 \\\\ \\hline \\end{tabular} & mt4 \\\\ \\hline \n' +
      '\\end{tabular}',
    tsv: 'mt1\t"math na1, na2\n' +
      't2"\n' +
      '"t1\tt2\n' +
      't3\tt4"\tmt4',
    csv: 'mt1,"math na1, na2\n' +
      't2"\n' +
      '"t1,t2\n' +
      't3,t4",mt4',
    csvQuoteAllFields: '"mt1","math na1, na2\n' +
      't2"\n' +
      '"t1,t2\n' +
      't3,t4","mt4"'
  },
  {
    latex: '\\begin{tabular}{ |l|l|l| }\n' +
      '\\hline\n' +
      '\\multicolumn{3}{ |c| }{\\begin{tabular}{|l|} \\hline  t1 \\\\ \\hline t2 \\\\ \\hline \\end{tabular}} \\\\\n' +
      '\\hline\n' +
      'cell1 & cell2 & cell3 \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv: '"t1\n' +
      't2"\t\t\n' +
      'cell1\tcell2\tcell3',
    csv: '"t1\n' +
      't2",,\n' +
      'cell1,cell2,cell3',
    csvQuoteAllFields: '"t1\n' +
      't2",,\n' +
      '"cell1","cell2","cell3"'
  },
  {
    latex: '\\begin{tabular}{ |l|l|l| }\n' +
      '\\hline\n' +
      '\\multicolumn{3}{ |c| }{\\begin{array}{l} a1 & a2 \\\\ a3 & a4 \\end{array}} \\\\\n' +
      '\\hline\n' +
      'cell1 & cell2 & cell3 \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv: '"a1\ta2\n' +
      'a3\ta4"\t\t\n' +
      'cell1\tcell2\tcell3',
    csv: '"a1,a2\n' +
      'a3,a4",,\n' +
      'cell1,cell2,cell3',
    csvQuoteAllFields: '"a1,a2\n' +
      'a3,a4",,\n' +
      '"cell1","cell2","cell3"'
  },
  {
    latex: '\\begin{tabular}{ |l|l|l| }\n' +
      '\\hline\n' +
      '\\multicolumn{3}{ |c| }{\\begin{tabular}{|l|} \\hline  t1 \\\\ \\hline \\begin{array}{l} a1 & a2 \\\\ a3 & a4 \\end{array} \\\\ \\hline \\end{tabular}} \\\\\n' +
      '\\hline\n' +
      'cell1 & cell2 & cell3 \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv: '"t1\n' +
      'a1, a2, a3, a4"\t\t\n' +
      'cell1\tcell2\tcell3',
    csv: '"t1\n' +
      'a1, a2, a3, a4",,\n' +
      'cell1,cell2,cell3',
    csvQuoteAllFields: '"t1\n' +
      'a1, a2, a3, a4",,\n' +
      '"cell1","cell2","cell3"'
  },
  {
    latex: '\\begin{tabular}{ |l|l|l| }\n' +
      '\\hline\n' +
      '\\multicolumn{3}{ |c| }{\\begin{tabular}{|l|} \\hline  t1 \\\\ \\hline \\begin{tabular}{|l|l|} \\hline  t1 & t2 \\\\ \\hline t3 & t4 \\\\ \\hline \\end{tabular} \\\\ \\hline \\end{tabular}} \\\\\n' +
      '\\hline\n' +
      'cell1 & cell2 & cell3 \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv: '"t1\n' +
      't1,t2,t3,t4"\t\t\n' +
      'cell1\tcell2\tcell3',
    csv: '"t1\n' +
      't1,t2,t3,t4",,\n' +
      'cell1,cell2,cell3',
    csvQuoteAllFields: '"t1\n' +
      't1,t2,t3,t4",,\n' +
      '"cell1","cell2","cell3"'
  },
  {
    latex: '\\begin{tabular}{ |l|l|l| }\n' +
      '\\hline\n' +
      '\\multicolumn{3}{ |c| }{\\begin{tabular}{|l|} \\hline  t1 \\\\ \\hline \\begin{tabular}{|l|} \\hline  t1 \\\\ \\hline t2 \\\\ \\hline \\end{tabular} \\\\ \\hline \\end{tabular}} \\\\\n' +
      '\\hline\n' +
      'Goalkeeper & GK & Paul Robinson \\\\ \\hline\n' +
      '\\multirow{4}{*}{\\begin{tabular}{|l|} \\hline  t1 \\\\ \\hline t2 \\\\ \\hline \\end{tabular}} & LB & Lucas Radebe \\\\\n' +
      ' & DC & Michael Duburry \\\\\n' +
      ' & DC & Dominic Matteo \\\\\n' +
      ' & RB & Didier Domi \\\\ \\hline\n' +
      '\\multirow{3}{*}{\\begin{array}{l} a1 & a2 \\\\ a3 & a4 \\end{array}} & MC & David Batty \\\\\n' +
      ' & MC & Eirik Bakke \\\\\n' +
      ' & MC & Jody Morris \\\\ \\hline\n' +
      'Forward & FW & Jamie McMaster \\\\ \\hline\n' +
      '\\multirow{2}{*}{\\begin{tabular}{|l|} \\hline  t1 \\\\ \\hline \\begin{array}{l} a1 & a2 \\\\ a3 & a4 \\end{array} \\\\ \\hline \\end{tabular}} & ST & Alan Smith \\\\\n' +
      ' & ST & Mark Viduka \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv: '"t1\n' +
      't1,t2"\t\t\n' +
      'Goalkeeper\tGK\tPaul Robinson\n' +
      '"t1\n' +
      't2"\tLB\tLucas Radebe\n' +
      '\tDC\tMichael Duburry\n' +
      '\tDC\tDominic Matteo\n' +
      '\tRB\tDidier Domi\n' +
      '"a1\ta2\n' +
      'a3\ta4"\tMC\tDavid Batty\n' +
      '\tMC\tEirik Bakke\n' +
      '\tMC\tJody Morris\n' +
      'Forward\tFW\tJamie McMaster\n' +
      '"t1\n' +
      'a1, a2, a3, a4"\tST\tAlan Smith\n' +
      '\tST\tMark Viduka',
    csv: '"t1\n' +
      't1,t2",,\n' +
      'Goalkeeper,GK,Paul Robinson\n' +
      '"t1\n' +
      't2",LB,Lucas Radebe\n' +
      ',DC,Michael Duburry\n' +
      ',DC,Dominic Matteo\n' +
      ',RB,Didier Domi\n' +
      '"a1,a2\n' +
      'a3,a4",MC,David Batty\n' +
      ',MC,Eirik Bakke\n' +
      ',MC,Jody Morris\n' +
      'Forward,FW,Jamie McMaster\n' +
      '"t1\n' +
      'a1, a2, a3, a4",ST,Alan Smith\n' +
      ',ST,Mark Viduka',
    csvQuoteAllFields: '"t1\n' +
      't1,t2",,\n' +
      '"Goalkeeper","GK","Paul Robinson"\n' +
      '"t1\n' +
      't2","LB","Lucas Radebe"\n' +
      ',"DC","Michael Duburry"\n' +
      ',"DC","Dominic Matteo"\n' +
      ',"RB","Didier Domi"\n' +
      '"a1,a2\n' +
      'a3,a4","MC","David Batty"\n' +
      ',"MC","Eirik Bakke"\n' +
      ',"MC","Jody Morris"\n' +
      '"Forward","FW","Jamie McMaster"\n' +
      '"t1\n' +
      'a1, a2, a3, a4","ST","Alan Smith"\n' +
      ',"ST","Mark Viduka"'
  },
  {
    latex: '\\begin{tabular}{ l c r }\n' +
      '  1 & $\\text{Some text in math}$ & 3 \\\\\n' +
      '  4 & $\\smash{x}{y}$ & 6\n' +
      '\\end{tabular}',
    tsv: '1\t"Some text in math"\t3\n' +
      '4\t"x"y\t6',
    csv: '1,Some text in math,3\n' +
      '4,xy,6',
    csvQuoteAllFields: '"1","Some text in math","3"\n' +
      '"4","xy","6"'
  },
  {
    latex: '\\begin{tabular}{ l c r }\n' +
      '  1 & $\\text{Some text in math}$ & 3 \\\\\n' +
      '  4 & $\\smash{x}{y}$ & $f ( x ) = \\left\\{ \\begin{array} { l l } { x ^ { 2} + 1,} & { x > 1} \\\\ { 1,} & { x = 1} \\\\ { x + 1,} & { x < 1} \\end{array} \\right.$\n' +
      '\\end{tabular}',
    tsv: '1\t"Some text in math"\t3\n' +
      '4\t"x"y\tf(x)={[x^(2)+1",",x > 1],[1",",x=1],[x+1",",x < 1]:}',
    csv: '1,Some text in math,3\n' +
      '4,xy,"f(x)={[x^(2)+1,,x > 1],[1,,x=1],[x+1,,x < 1]:}"',
    csvQuoteAllFields: '"1","Some text in math","3"\n' +
      '"4","xy","f(x)={[x^(2)+1,,x > 1],[1,,x=1],[x+1,,x < 1]:}"'
  },
  // {
  //   latex: '',
  //   tsv: '',
  //   csv: '',
  //   csvQuoteAllFields: ''
  // }
];
