module.exports = "\\footnote[2]{text} text before \\footnote[5]{Footnote with block math:1\n" +
  "\\[\n" +
  "x = \\frac { - b \\pm \\sqrt { b ^ { 2 } - 4 a c } } { 2 a }\n" +
  "\\]\n" +
  "} text after \n" +
  "\n" +
  "text before \\footnotetext{Footnotetext with block math:2\n" +
  "\\[\n" +
  "x = \\frac { - b \\pm \\sqrt { b ^ { 2 } - 4 a c } } { 2 a }\n" +
  "\\]\n" +
  "} text after\n" +
  "\n" +
  "text \\footnotemark{} before \\footnotetext{Footnotetext and  footnotemark with block math:3\n" +
  "\\[\n" +
  "x = \\frac { - b \\pm \\sqrt { b ^ { 2 } - 4 a c } } { 2 a }\n" +
  "\\]\n" +
  "} text after\n" +
  "\n" +
  "Footnote with table \\footnote{Footnote with table\n" +
  "\\[\n" +
  "x = \\frac { - b \\pm \\sqrt { b ^ { 2 } - 4 a c } } { 2 a }\n" +
  "\\]\n" +
  "\\begin{table}[h]\n" +
  "\\centering\n" +
  "\\begin{tabular}{|c||c|c|} \\hline\n" +
  "& A & B \\\\ \\hline\\hline\n" +
  "Foo &\n" +
  "\\begin{tabular}{c} 1 \\\\ 2 \\\\ 3 \\\\ 4 \\\\\n" +
  "\\end{tabular} &\n" +
  "\\begin{tabular}{c} 2 \\\\ 5  \\\\ 9 \\\\ 8 \\\\\n" +
  "\\end{tabular} \\\\ \\hline\n" +
  "Bar &\n" +
  "\\begin{tabular}{c} 1 \\\\ 2 \\\\ 3 \\\\ 4 \\\\\n" +
  "\\end{tabular} &\n" +
  "\\begin{tabular}{c} 31 \\\\ 23 \\\\ 16 \\\\ 42 \\\\\n" +
  "\\end{tabular} \\\\ \\hline\n" +
  "\\end{tabular}\n" +
  "\\caption{this is the table!}\n" +
  "\\label{table:4}\n" +
  "\\end{table}\n" +
  "\n" +
  "\\begin{tabular}{l|S|r|l}\n" +
  "    \\textbf{Value 1} & \\textbf{Value 2} & \\textbf{Value 3} & \\textbf{Value 4}\\\\\n" +
  "    $\\alpha$ & $\\beta$ & $\\gamma$ & $\\delta$ \\\\\n" +
  "    \\hline\n" +
  "    1 & 1110.1 & a & e\\\\\n" +
  "    2 & 10.1 & b & f\\\\\n" +
  "    3 & 23.113231 & c & g\\\\\n" +
  "    \\end{tabular}\n" +
  "    \n" +
  "\\begin{itemize}\n" +
  "\\item Level 1 is `\\textbullet` (•),\n" +
  "\\item Level 2 is `\\textendash` (–) ,\n" +
  "\\item Level 3 is `\\textasteriskcentered` (*)\n" +
  "\\item Level 4 is `\\textperiodcentered` (·).\n" +
  "\\end{itemize}\n" +
  "\n" +
  "} text after";
