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
  {
    latex: '\\begin{tabular}{|c|c|c|c|c|}\n' +
      '\\hline \\multicolumn{2}{|c|}{\\( {\\text { MSSM phases }} \\)} & \\multicolumn{2}{|c|}{\\( {\\text { BMSSM phases }} \\)} & \\multirow{2}{*}{\\( {\\begin{array}{c}\\hline \\text { vev phase } \\\\\n' +
      '\\theta\\end{array}} \\)} \\\\\n' +
      '\\hline\\( \\phi_{i} \\) & \\( \\phi_{f} \\) & \\( \\vartheta_{1} \\) & \\( \\vartheta_{2} \\) & \\\\\n' +
      '\\hline \\( \\arg \\left(M_{i} \\mu / b\\right) \\) & \\( \\arg \\left(A_{f} \\mu / b\\right) \\) & \\( \\arg \\left(\\epsilon_{1} / b\\right) \\) & \\( \\arg \\left(\\epsilon_{2} / b^{2}\\right) \\) & \\( \\overline{\\arg \\left(b H_{u} H_{d}\\right)} \\) \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv: '" MSSM phases "\t\t" BMSSM phases "\t\t" vev phase \n' +
      'theta"\n' +
      'phi_(i)\tphi_(f)\tvartheta_(1)\tvartheta_(2)\t\n' +
      'arg(M_(i)mu//b)\targ(A_(f)mu//b)\targ(epsilon_(1)//b)\targ(epsilon_(2)//b^(2))\tbar(arg(bH_(u)H_(d)))'
  },  
  {
    latex: '\\begin{tabular}{|c|c|c|c|c|c|}\n' +
      '\\hline Viewpoint & \\( \\bar{F} \\) & \\( \\mathrm{R} \\) & \\( \\mathrm{S} \\) & \\( \\mathrm{FS} \\) & \\( \\mathrm{RS} \\) \\\\\n' +
      '\\hline & \\multicolumn{5}{|c|}{\\( {\\text { mean difference }} \\)} \\\\\n' +
      '\\hline \\multirow{4}{*}{\\( {\\begin{array}{c}\\hline \\text { Maximum speed } \\\\\n' +
      '\\text { (mean guess) } \\\\\n' +
      '\\text { Displacement } \\\\\n' +
      '\\text { (mean guess) }\\end{array}} \\)} & \\( 20.8 \\) & \\( 21.3 \\) & \\( 20.4 \\) & \\( 20.1 \\) & \\( 21.3 \\) \\\\\n' +
      '\\hline & \\( 38.0 \\) & \\( 38.5 \\) & \\( 39.4 \\) & \\( 40.2 \\) & \\( 40.1 \\) \\\\\n' +
      '\\hline & \\( 0.811 \\) & \\( 0.752 \\) & \\( 0.795 \\) & \\( 0.875 \\) & \\( 0.822 \\) \\\\\n' +
      '\\hline & \\( 1.04 \\) & \\( 0.922 \\) & \\( 1.04 \\) & \\( 1.13 \\) & \\( 1.08 \\) \\\\\n' +
      '\\hline . & \\multicolumn{5}{|c|}{\\( {\\text { classification accuracy }} \\)} \\\\\n' +
      '\\hline Door number & \\( 0.674 \\) & \\( 0.748 \\) & \\( 0.837 \\) & \\( 0.738 \\) & \\( 0.788 \\) \\\\\n' +
      '\\hline Seat number & \\( 0.672 \\) & \\( 0.691 \\) & \\( 0.711 \\) & \\( 0.660 \\) & \\( 0.700 \\) \\\\\n' +
      '\\hline Car type & \\( 0.541 \\) & \\( 0.585 \\) & \\( 0.627 \\) & \\( 0.571 \\) & \\( 0.612 \\) \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv: 'Viewpoint\tbar(F)\tR\tS\tFS\tRS\n' +
      '\t" mean difference "\t\t\t\t\n' +
      '" Maximum speed \n' +
      ' (mean guess) \n' +
      ' Displacement \n' +
      ' (mean guess) "\t20.8\t21.3\t20.4\t20.1\t21.3\n' +
      '\t38.0\t38.5\t39.4\t40.2\t40.1\n' +
      '\t0.811\t0.752\t0.795\t0.875\t0.822\n' +
      '\t1.04\t0.922\t1.04\t1.13\t1.08\n' +
      '.\t" classification accuracy "\t\t\t\t\n' +
      'Door number\t0.674\t0.748\t0.837\t0.738\t0.788\n' +
      'Seat number\t0.672\t0.691\t0.711\t0.660\t0.700\n' +
      'Car type\t0.541\t0.585\t0.627\t0.571\t0.612'
  },  
  {
    latex: '\\begin{tabular}{|c|c|c|c|c|c|}\n' +
      '\\hline \\multirow{3}{*}{\\( {\\begin{array}{c}\\text { Detector } \\\\\n' +
      '\\hline \\text { Mass of the } \\\\\n' +
      '\\text { target, tons } \\\\\n' +
      '\\text { Distance from } \\\\\n' +
      '\\text { the source, km } \\\\\n' +
      'N\\left(e^{+}, \\mathrm{n}\\right) d^{-1}\\end{array}} \\)} & \\multirow{2}{*}{\\( {\\begin{array}{c}\\text { CHOOZ\'97 } \\\\\n' +
      '5\\end{array}} \\)} & \\multicolumn{2}{|c|}{\\( {\\text { THIS PROJECT }} \\)} & \\multirow{2}{*}{\\( {\\begin{array}{c}\\text { KamLand } \\\\\n' +
      '1000\\end{array}} \\)} & \\multirow{2}{*}{\\( {\\begin{array}{c}\\text { BOREXINO } \\\\\n' +
      '300\\end{array}} \\)} \\\\\n' +
      '\\hline & & 50 & 50 & & \\\\\n' +
      '\\hline & 1 12 & \\( 0.25 \\) 1000 & \\( 1.1 \\) 55 & \\( \\sim 200 \\) 2 & \\( \\sim 800 \\) \\( 0.08 \\) \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv: '" Detector \n' +
      ' Mass of the \n' +
      ' target, tons \n' +
      ' Distance from \n' +
      ' the source, km \n' +
      'N(e^(+),n)d^(-1)"\t" CHOOZ\'97 \n' +
      '5"\t" THIS PROJECT "\t\t" KamLand \n' +
      '1000"\t" BOREXINO \n' +
      '300"\n' +
      '\t\t50\t50\t\t\n' +
      '\t1 12\t0.25 1000\t1.1 55\t∼200 2\t∼800 0.08'
  },  
  {
    latex: '\\begin{tabular}{|l|c|c|c|}\\hline &  $\\begin{array}{c}\\text { cost } \\\\ \\$\\end{array}$ & $$\\begin{array}{c}\\text { depreciation } \\\\ \\$\\end{array}$$ & \\( \\begin{array}{c}\\text { net book value } \\\\ \\$\\end{array} \\) \\\\ \\hline non-current assets & 250000 & 95000 & 155000 \\\\ \\hline\\end{tabular}',
    tsv: '\t" cost \n' +
      '$"\t" depreciation \n' +
      '$"\t" net book value \n' +
      '$"\n' +
      'non-current assets\t250000\t95000\t155000'
  },
  {
    latex: '\\begin{tabular}{|l|c|c|c|}\\hline \\multicolumn{4}{|c|}{ as at 30 June 2020 (AUD\\$\'000) } \\\\\\hline \\multirow{2}{*}{\\( \\begin{array}{l}\\text { Current assets } \\\\\\text { Cash at bank }\\end{array} \\)} & 2020 & 2019 & 2018 \\\\\\cline { 2 - 4 } Receivables (net) & \\( \\$ 120,000 \\) & \\( \\$ 80,000 \\) & \\( \\$ 36,000 \\) \\\\Inventory & \\( \\$ 140,000 \\) & \\( \\$ 120,000 \\) & \\( \\$ 96,000 \\) \\\\Total current assets & \\( \\$ 180,000 \\) & \\( \\$ 170,000 \\) & \\( \\$ 128,000 \\) \\\\Non Current assets & \\( \\$ 440,000 \\) & \\( \\$ 370,000 \\) & \\( \\$ 260,000 \\) \\\\Plant and equipment (net) & & & \\\\Investments & \\( \\$ 1,000,000 \\) & \\( \\$ 820,000 \\) & \\( \\$ 716,000 \\) \\\\\\hline\\end{tabular}',
    tsv: 'as at 30 June 2020 (AUD$\'000)\t\t\t\n' +
      '" Current assets \n' +
      ' Cash at bank "\t2020\t2019\t2018\n' +
      '\t$120,000\t$80,000\t$36,000\n' +
      'Inventory\t$140,000\t$120,000\t$96,000\n' +
      'Total current assets\t$180,000\t$170,000\t$128,000\n' +
      'Non Current assets\t$440,000\t$370,000\t$260,000\n' +
      'Plant and equipment (net)\t\t\t\n' +
      'Investments\t$1,000,000\t$820,000\t$716,000'
  },
  {
    latex: '\\begin{tabular}{|l|c|c|c|}\\hline \\multicolumn{4}{|c|}{ as at 30 June 2020 (AUD $\'000) } \\\\\\hline \\multirow{2}{*}{\\( \\begin{array}{l}\\text { Current assets } $ \\\\\\text { Cash at bank }\\end{array} \\)} & 2020 & 2019 & 2018 \\\\\\cline { 2 - 4 } Receivables (net) & \\( \\$ 120,000 \\) & \\( \\$ 80,000 \\) & \\( \\$ 36,000 \\) \\\\Inventory & \\( \\$ 140,000 \\) & \\( \\$ 120,000 \\) & \\( \\$ 96,000 \\) \\\\Total current assets & \\( \\$ 180,000 \\) & \\( \\$ 170,000 \\) & \\( \\$ 128,000 \\) \\\\Non Current assets & \\( \\$ 440,000 \\) & \\( \\$ 370,000 \\) & \\( \\$ 260,000 \\) \\\\Plant and equipment (net) & & & \\\\Investments & \\( \\$ 1,000,000 \\) & \\( \\$ 820,000 \\) & \\( \\$ 716,000 \\) \\\\\\hline\\end{tabular}',
    tsv: 'as at 30 June 2020 (AUD $\'000)\t\t\t\n' +
      '" Current assets $\n' +
      ' Cash at bank "\t2020\t2019\t2018\n' +
      '\t$120,000\t$80,000\t$36,000\n' +
      'Inventory\t$140,000\t$120,000\t$96,000\n' +
      'Total current assets\t$180,000\t$170,000\t$128,000\n' +
      'Non Current assets\t$440,000\t$370,000\t$260,000\n' +
      'Plant and equipment (net)\t\t\t\n' +
      'Investments\t$1,000,000\t$820,000\t$716,000'
  },
  {
    latex: '\\begin{tabular}{|l|c|c|c|}\\hline \\multicolumn{4}{|c|}{ as at 30 June 2020 (AUD $\'000) } \\\\\\hline \\multirow{2}{*}{\\( \\begin{array}{l}\\text { Current assets }$1 \\\\\\text { Cash at bank }\\end{array} \\)} & 2020 & 2019 & 2018 \\\\\\cline { 2 - 4 } Receivables (net) & \\( \\$ 120,000 \\) & \\( \\$ 80,000 \\) & \\( \\$ 36,000 \\) \\\\Inventory & \\( \\$ 140,000 \\) & \\( \\$ 120,000 \\) & \\( \\$ 96,000 \\) \\\\Total current assets & \\( \\$ 180,000 \\) & \\( \\$ 170,000 \\) & \\( \\$ 128,000 \\) \\\\Non Current assets & \\( \\$ 440,000 \\) & \\( \\$ 370,000 \\) & \\( \\$ 260,000 \\) \\\\Plant and equipment (net) & & & \\\\Investments & \\( \\$ 1,000,000 \\) & \\( \\$ 820,000 \\) & \\( \\$ 716,000 \\) \\\\\\hline\\end{tabular}',
    tsv: 'as at 30 June 2020 (AUD $\'000)\t\t\t\n' +
      '" Current assets $1\n' +
      ' Cash at bank "\t2020\t2019\t2018\n' +
      '\t$120,000\t$80,000\t$36,000\n' +
      'Inventory\t$140,000\t$120,000\t$96,000\n' +
      'Total current assets\t$180,000\t$170,000\t$128,000\n' +
      'Non Current assets\t$440,000\t$370,000\t$260,000\n' +
      'Plant and equipment (net)\t\t\t\n' +
      'Investments\t$1,000,000\t$820,000\t$716,000'
  },
  {
    latex: '\\begin{tabular}{ | l | c | }\\hline\n' +
      '\\(\\begin{array}{c: c}1 & 2\\end{array}\\) & 2  \\\\ \\hline\n' +
      '4 & 5 \\\\ \\hline\n' +
      '\\end{tabular}',
    tsv: '"1\t2"\t2\n' +
      '4\t5'
  },  
  {
    latex: '\\begin{tabular}{ | l | c | }\\hline\n' +
      '\\(\\begin{array}{c: c}1 & 2 \\\\ 1 & 2 \\end{array}\\) & 2  \\\\ \\hline\n' +
      '4 & 5 \\\\ \\hline\n' +
      '\\end{tabular}',
    tsv: '"1\t2\n' +
      '1\t2"\t2\n' +
      '4\t5'
  },  
  {
    latex: '\\begin{tabular}{ | l | c | }\\hline\n' +
      '\\( { \\begin{array}{c: c}1 & 2 \\\\ 1 & 2 \\end{array} } \\) & 2  \\\\ \\hline\n' +
      '4 & 5 \\\\ \\hline\n' +
      '\\end{tabular}',
    tsv: '"1\t2\n' +
      '1\t2"\t2\n' +
      '4\t5'
  },
  {
    latex: '\\begin{tabular}{ | l | c | }\\hline\n' +
      '\\( \\left| \\begin{array}{c c}1 & 2 \\\\ 1 & 2 \\end{array} \\right| \\) & 2  \\\\ \\hline\n' +
      '4 & 5 \\\\ \\hline\n' +
      '\\end{tabular}',
    tsv: '|[1,2],[1,2]|\t2\n' +
      '4\t5'
  },  
  {
    latex: '\\begin{tabular}{ | l | c | }\\hline\n' +
      '\\( \\left[ \\begin{array}{c c}1 & 2 \\\\ 1 & 2 \\end{array} \\right] \\) & 2  \\\\ \\hline\n' +
      '4 & 5 \\\\ \\hline\n' +
      '\\end{tabular}',
    tsv: '[[1,2],[1,2]]\t2\n' +
      '4\t5'
  },  
  {
    latex: '\\begin{tabular}{ | l | c | }\\hline\n' +
      '\\( \\left\\{ \\begin{array}{l} x - 2z = 1 \\\\ y + z = 3 \\end{array} \\right. \\) & 2  \\\\ \\hline\n' +
      '4 & 5 \\\\ \\hline\n' +
      '\\end{tabular}',
    tsv: '{[x-2z=1],[y+z=3]:}\t2\n' +
      '4\t5'
  },  
  {
    latex: '\\begin{tabular}{ | l | c | }\\hline\n' +
      '\\(\\begin{array}{c} x \\\\\n' +
      '\\smash{x}{y}\\end{array} \\) & 2  \\\\ \\hline\n' +
      '4 & 5 \\\\ \\hline\n' +
      '\\end{tabular}',
    tsv: '"x\n' +
      'xy"\t2\n' +
      '4\t5'
  },  
  {
    latex: '\\begin{tabular}{ | l | c | }\\hline\n' +
      '\\(\\begin{array}{c} x, y \\\\\n' +
      '\\smash{x}{y}\\end{array} \\) & 2  \\\\ \\hline\n' +
      '4 & 5 \\\\ \\hline\n' +
      '\\end{tabular}',
    tsv: '"x,y\n' +
      'xy"\t2\n' +
      '4\t5'
  },  
  {
    latex: '\\begin{tabular}{ | l | c | }\\hline\n' +
      '\\(\\begin{array}{c} x, y \\\\\n' +
      '\\begin{array}{c} w, z\\end{array}\\\\\n' +
      '\\smash{x}{y}\\end{array} \\) & 2  \\\\ \\hline\n' +
      '4 & 5 \\\\ \\hline\n' +
      '\\end{tabular}',
    tsv: '"x,y\n' +
      '{:w"",""z:}\n' +
      'xy"\t2\n' +
      '4\t5'
  },
  {
    latex: '\\begin{tabular}{ | l | c | }\\hline\n' +
      '\\(\\begin{array}{c} x, y \\\\\n' +
      '\\begin{array}{c} x1, y1 \\\\\n' +
      '\\smash{x1}{y1}\\end{array}\\\\\n' +
      '\\smash{x}{y}\\end{array} \\) & 2  \\\\ \\hline\n' +
      '4 & 5 \\\\ \\hline\n' +
      '\\end{tabular}',
    tsv: '"x,y\n' +
      '{:[x1"",""y1],[""(x1)""y1]:}\n' +
      'xy"\t2\n' +
      '4\t5'
  },
  {
    latex: '\\begin{tabular}{ | l | c | }\\hline\n' +
      '\\(\\begin{array}{c} x, "y" \\\\\n' +
      '\\begin{array}{c} w, z\\end{array}\\\\\n' +
      '\\smash{x}{y}\\end{array} \\) & 2  \\\\ \\hline\n' +
      '4 & 5 \\\\ \\hline\n' +
      '\\end{tabular}',
    tsv: '"x,""y""\n' +
      '{:w"",""z:}\n' +
      'xy"\t2\n' +
      '4\t5'
  },  
  {
    latex: '\\begin{tabular}{ | l | c | }\\hline\n' +
      '\\(\\begin{array}{c} x, \\text{"}y \\\\\n' +
      '\\begin{array}{c} w, z\\end{array}\\\\\n' +
      '\\smash{x}{y}\\end{array} \\) & 2  \\\\ \\hline\n' +
      '4 & 5 \\\\ \\hline\n' +
      '\\end{tabular}',
    tsv: '"x,""y\n' +
      '{:w"",""z:}\n' +
      'xy"\t2\n' +
      '4\t5'
  },  
  {
    latex: '\\begin{tabular}{ | l | c | }\\hline\n' +
      '\\(\\begin{array}{c} x, \\text{"some"}y \\\\\n' +
      '\\begin{array}{c} w, z \\\\\n' +
      '"x"\\end{array}\\\\\n' +
      '\\smash{x}{y}\\end{array} \\) & 2  \\\\ \\hline\n' +
      '4 & 5 \\\\ \\hline\n' +
      '\\end{tabular}',
    tsv: '"x,""some""y\n' +
      '{:[w"",""z],[""x""]:}\n' +
      'xy"\t2\n' +
      '4\t5'
  },  
  {
    latex: '\\begin{tabular}{ | l | c | }\\hline\n' +
      '\\(\\begin{array}{c} x, \\text{"some"}y \\\\\n' +
      '\\begin{array}{c} w, z \\\\\n' +
      '\\text{"}x\\end{array}\\\\\n' +
      '\\smash{x}{y}\\end{array} \\) & 2  \\\\ \\hline\n' +
      '4 & 5 \\\\ \\hline\n' +
      '\\end{tabular}',
    tsv: '"x,""some""y\n' +
      '{:[w"",""z],[""""""x]:}\n' +
      'xy"\t2\n' +
      '4\t5'
  },  
  // {
  //   latex: '',
  //   tsv: ''
  // },  
  // {
  //   latex: '',
  //   tsv: ''
  // },
];
