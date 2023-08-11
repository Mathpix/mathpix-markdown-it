module.exports = "First [^1]\n" +
  "\n" +
  "\\begin{table}[h]\n" +
  "\\centering\n" +
  "\\begin{tabular}{|c||c|c|} \\hline\n" +
  "& A[^1] & B \\\\ \\hline\\hline\n" +
  "Foo &\n" +
  "\\begin{tabular}{c} 1[^1] \\\\ 2 \\\\\n" +
  "\\end{tabular} &\n" +
  "\\begin{tabular}{c} 2 \\\\ 5 [^1] \\\\\n" +
  "\\end{tabular} \\\\ \\hline\n" +
  " \\hline\n" +
  "\\end{tabular}\n" +
  "\\caption{this is the table! [^1]}\n" +
  "\\label{table:4}\n" +
  "\\end{table}\n" +
  "\n" +
  "\n" +
  "\\title{ Preparation $x$ of Papers for IEEE \\\\Sponsored \n" +
  "\\\\Conferences \\& Symposia [^title] }\n" +
  "\n" +
  "\\section{ Section \\\\multiline [^section] }\n" +
  "\n" +
  "\\subsection{ Subsection \\\\multiline [^subsection] }\n" +
  "\n" +
  "\\subsubsection{ Subsubsection \\\\multiline [^subsubsection] }\n" +
  "\n" +
  "Change the [^list] labels using `\\item[label text]` in an \\texttt{itemize} environment\n" +
  "\\begin{itemize}\n" +
  "  \\item This is my first point\n" +
  "  \\item Another point I want to make \n" +
  "  \\item[!] A point to exclaim something!\n" +
  "  \\item[$\\blacksquare$] Make the point fair [^list] and square.\n" +
  "  \\item[NOTE] This entry has no bullet\n" +
  "  \\item[] A blank label?\n" +
  "  \\item Another point I want to make \n" +
  "\\end{itemize}\n" +
  "\n" +
  "[^enumerate]Change the labels using `\\item[label text]` in an \\texttt{enumerate} environment\n" +
  "\\begin{enumerate}\n" +
  "  \\item This is my first point\n" +
  "  \\item Another point I want to make \n" +
  "  \\item[!] A point to exclaim something!\n" +
  "  \\item[$\\square$] Make the point fair and square.\n" +
  "  \\item[NOTE] This entry has no bullet [^enumerate]\n" +
  "  \\item[] A blank label?\n" +
  "  \\item Another point I want to make \n" +
  "\\end{enumerate}\n" +
  "\n" +
  "\n" +
  "\\theoremstyle{definition}\n" +
  "\\newtheorem{defn}{Definition}[section]\n" +
  "\n" +
  "\\begin{defn}\n" +
  "Here is a new definition [^defn]\n" +
  "\\end{defn}\n" +
  "\n" +
  "\\begin{figure}\n" +
  "\\centering\n" +
  "\\includegraphics[width=0.5\\textwidth]{https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Cappuccino_at_Sightglass_Coffee.jpg/1599px-Cappuccino_at_Sightglass_Coffee.jpg}}\n" +
  "\\caption{The caption is at the bottom [^figure].}\n" +
  "\\end{figure}\n" +
  "\n" +
  "[^1]: First footnote\n" +
  "[^title]:Footnote to title\n" +
  "[^section]: Footnote to section\n" +
  "[^subsection]: Footnote to subsection\n" +
  "[^subsubsection]: Footnote to subsubsection\n" +
  "[^list]: Footnote to list itemize\n" +
  "[^enumerate]: Footnote to list enumerate\n" +
  "[^defn]: Footnote to theorem\n" +
  "[^figure]: Footnote to figure"
