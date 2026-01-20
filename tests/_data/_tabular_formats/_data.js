module.exports = [
  {
    latex: '\\begin{tabular}{|p{0.7\\textwidth}|}\n' +
      '\\hline\n' +
      'Input \\\\\n' +
      '\\hline\n' +
      '\\begin{itemize}\n' +
      '  \\item LaTeX\n' +
      '  \\item HTML\n' +
      '\\end{itemize}\n' +
      '\\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv: 'Input\n' +
      '" • LaTeX\n' +
      ' • HTML"',
    markdown: '| Input |\n' +
      '| :--- |\n' +
      '| • LaTeX<br>• HTML<br> |',
    csv: 'Input\n' +
      '" • LaTeX\n' +
      ' • HTML"',
  },
  {
    latex: '\\begin{tabular}{|l|}\n' +
      '\\hline\n' +
      'Input \\\\\n' +
      '\\hline\n' +
      '\\begin{itemize}\n' +
      '  \\item LaTeX\n' +
      '  \\item HTML\n' +
      '\\end{itemize}\n' +
      '\\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv: 'Input\n' +
      '" • LaTeX\n' +
      ' • HTML"',
    markdown: '| Input |\n' +
      '| :--- |\n' +
      '| • LaTeX<br>• HTML<br> |',
    csv: 'Input\n' +
      '" • LaTeX\n' +
      ' • HTML"'
  },
  {
    latex: '\\begin{tabular}{|l|}\n' +
      '\\hline\n' +
      'Input \\\\\n' +
      '\\hline\n' +
      '\\begin{itemize}\n' +
      '  \\item[] - LaTeX\n' +
      '  \\item[] - HTML\n' +
      '\\end{itemize}\n' +
      '\\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv: 'Input\n' +
      '"  - LaTeX\n' +
      '  - HTML"',
    markdown: '| Input |\n' +
      '| :--- |\n' +
      '| - LaTeX<br>- HTML<br> |',
    csv: 'Input\n' +
      '"  - LaTeX\n' +
      '  - HTML"'
  },
  {
    latex: '\\begin{tabular}{|p{0.3\\textwidth}|p{0.7\\textwidth}|}\n' +
      '\\hline\n' +
      'Input & Output \\\\\n' +
      '\\hline\n' +
      '\\begin{itemize}\n' +
      '  \\item Image\n' +
      '  \\item PDF\n' +
      '\\end{itemize}\n' +
      '&\n' +
      '\\begin{itemize}\n' +
      '  \\item LaTeX\n' +
      '  \\item HTML\n' +
      '\\end{itemize}\n' +
      '\\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv: 'Input\tOutput\n' +
      '" • Image\n' +
      ' • PDF"\t" • LaTeX\n' +
      ' • HTML"',
    markdown: '| Input | Output |\n' +
      '| :--- | :--- |\n' +
      '| • Image<br>• PDF<br> | • LaTeX<br>• HTML<br> |',
    csv: 'Input,Output\n' +
      '" • Image\n' +
      ' • PDF"," • LaTeX\n' +
      ' • HTML"'
  },
  {
    latex: '\\begin{tabular}{|l|l|}\n' +
      '\\hline\n' +
      'Input & Output \\\\\n' +
      '\\hline\n' +
      '\\begin{itemize}\n' +
      '  \\item Image\n' +
      '  \\item PDF\n' +
      '\\end{itemize}\n' +
      '&\n' +
      '\\begin{itemize}\n' +
      '  \\item LaTeX\n' +
      '  \\item HTML\n' +
      '\\end{itemize}\n' +
      '\\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv: 'Input\tOutput\n' +
      '" • Image\n' +
      ' • PDF"\t" • LaTeX\n' +
      ' • HTML"',
    markdown: '| Input | Output |\n' +
      '| :--- | :--- |\n' +
      '| • Image<br>• PDF<br> | • LaTeX<br>• HTML<br> |',
    csv: 'Input,Output\n' +
      '" • Image\n' +
      ' • PDF"," • LaTeX\n' +
      ' • HTML"'
  },
  {
    latex: '\\begin{tabular}{|p{0.7\\textwidth}|}\n' +
      '\\hline\n' +
      '\\textbf{Input (nested lists + nested tables)} \\\\\n' +
      '\\hline\n' +
      '\\begin{itemize}\n' +
      '  \\item \\textbf{Source formats supported}\n' +
      '    \\begin{itemize}\n' +
      '      \\item LaTeX source document\n' +
      '      \\item HTML source page\n' +
      '    \\end{itemize}\n' +
      '  \\item \\textbf{Example: Table embedded inside a list item}\n' +
      '    \\begin{tabular}{|l|}\n' +
      '      \\hline\n' +
      '      \\textbf{Embedded table header} \\\\\n' +
      '      \\hline\n' +
      '      \\begin{itemize}\n' +
      '        \\item First bullet inside the table\n' +
      '        \\item Second bullet inside the table\n' +
      '      \\end{itemize}\n' +
      '      \\\\\n' +
      '      \\hline\n' +
      '    \\end{tabular}\n' +
      '  \\item \\textbf{Example: Nested list inside list item}\n' +
      '    \\begin{itemize}\n' +
      '      \\item Image export (PNG / JPG)\n' +
      '      \\item PDF export\n' +
      '      \\item DOCX export\n' +
      '    \\end{itemize}\n' +
      '\\end{itemize}\n' +
      '\\\\\n' +
      '\\hline\n' +
      '\\textbf{Example: Table after list (same cell)} \\\\\n' +
      '\\begin{tabular}{|l|}\n' +
      '  \\hline\n' +
      '  \\textbf{Second embedded table} \\\\\n' +
      '  \\hline\n' +
      '  Plain text row content \\\\\n' +
      '  \\hline\n' +
      '\\end{tabular}\n' +
      '\\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv: 'Input (nested lists + nested tables)\n' +
      '" • Source formats supported\n' +
      '   – LaTeX source document\n' +
      '   – HTML source page\n' +
      ' • Example: Table embedded inside a list item\n' +
      'Embedded table header\n' +
      '   – First bullet inside the table\n' +
      '   – Second bullet inside the table\n' +
      ' • Example: Nested list inside list item\n' +
      '   – Image export (PNG / JPG)\n' +
      '   – PDF export\n' +
      '   – DOCX export"\n' +
      'Example: Table after list (same cell)\n' +
      '"Second embedded table\n' +
      'Plain text row content"',
    markdown: '| **Input (nested lists + nested tables)** |\n' +
      '| :--- |\n' +
      '| • **Source formats supported**<br>&#160;&#160;– LaTeX source document<br>&#160;&#160;– HTML source page<br>• **Example: Table embedded inside a list item**<br>**Embedded table header** <br> &#160;&#160;– First bullet inside the table<br>&#160;&#160;– Second bullet inside the table<br><br>• **Example: Nested list inside list item**<br>&#160;&#160;– Image export (PNG / JPG)<br>&#160;&#160;– PDF export<br>&#160;&#160;– DOCX export<br> |\n' +
      '| **Example: Table after list (same cell)** |\n' +
      '| **Second embedded table** <br> Plain text row content |',
    csv: 'Input (nested lists + nested tables)\n' +
      '" • Source formats supported\n' +
      '   – LaTeX source document\n' +
      '   – HTML source page\n' +
      ' • Example: Table embedded inside a list item\n' +
      'Embedded table header\n' +
      '   – First bullet inside the table\n' +
      '   – Second bullet inside the table\n' +
      ' • Example: Nested list inside list item\n' +
      '   – Image export (PNG / JPG)\n' +
      '   – PDF export\n' +
      '   – DOCX export"\n' +
      'Example: Table after list (same cell)\n' +
      '"Second embedded table\n' +
      'Plain text row content"'
  },
  {
    latex: '\\begin{tabular}{|l|}\n' +
      '\\hline\n' +
      '\\textbf{Input (nested lists + nested tables)} \\\\\n' +
      '\\hline\n' +
      '\\begin{itemize}\n' +
      '  \\item \\textbf{Source formats supported}\n' +
      '    \\begin{itemize}\n' +
      '      \\item LaTeX source document\n' +
      '      \\item HTML source page\n' +
      '    \\end{itemize}\n' +
      '  \\item \\textbf{Example: Table embedded inside a list item}\n' +
      '    \\begin{tabular}{|l|}\n' +
      '      \\hline\n' +
      '      \\textbf{Embedded table header} \\\\\n' +
      '      \\hline\n' +
      '      \\begin{itemize}\n' +
      '        \\item First bullet inside the table\n' +
      '        \\item Second bullet inside the table\n' +
      '      \\end{itemize}\n' +
      '      \\\\\n' +
      '      \\hline\n' +
      '    \\end{tabular}\n' +
      '  \\item \\textbf{Example: Nested list inside list item}\n' +
      '    \\begin{itemize}\n' +
      '      \\item Image export (PNG / JPG)\n' +
      '      \\item PDF export\n' +
      '      \\item DOCX export\n' +
      '    \\end{itemize}\n' +
      '\\end{itemize}\n' +
      '\\\\\n' +
      '\\hline\n' +
      '\\textbf{Example: Table after list (same cell)} \\\\\n' +
      '\\begin{tabular}{|l|}\n' +
      '  \\hline\n' +
      '  \\textbf{Second embedded table} \\\\\n' +
      '  \\hline\n' +
      '  Plain text row content \\\\\n' +
      '  \\hline\n' +
      '\\end{tabular}\n' +
      '\\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv: 'Input (nested lists + nested tables)\n' +
      '" • Source formats supported\n' +
      '   – LaTeX source document\n' +
      '   – HTML source page\n' +
      ' • Example: Table embedded inside a list item\n' +
      'Embedded table header\n' +
      '   – First bullet inside the table\n' +
      '   – Second bullet inside the table\n' +
      ' • Example: Nested list inside list item\n' +
      '   – Image export (PNG / JPG)\n' +
      '   – PDF export\n' +
      '   – DOCX export"\n' +
      'Example: Table after list (same cell)\n' +
      '"Second embedded table\n' +
      'Plain text row content"',
    markdown: '| **Input (nested lists + nested tables)** |\n' +
      '| :--- |\n' +
      '| • **Source formats supported**<br>&#160;&#160;– LaTeX source document<br>&#160;&#160;– HTML source page<br>• **Example: Table embedded inside a list item**<br>**Embedded table header** <br> &#160;&#160;– First bullet inside the table<br>&#160;&#160;– Second bullet inside the table<br><br>• **Example: Nested list inside list item**<br>&#160;&#160;– Image export (PNG / JPG)<br>&#160;&#160;– PDF export<br>&#160;&#160;– DOCX export<br> |\n' +
      '| **Example: Table after list (same cell)** |\n' +
      '| **Second embedded table** <br> Plain text row content |',
    csv: 'Input (nested lists + nested tables)\n' +
      '" • Source formats supported\n' +
      '   – LaTeX source document\n' +
      '   – HTML source page\n' +
      ' • Example: Table embedded inside a list item\n' +
      'Embedded table header\n' +
      '   – First bullet inside the table\n' +
      '   – Second bullet inside the table\n' +
      ' • Example: Nested list inside list item\n' +
      '   – Image export (PNG / JPG)\n' +
      '   – PDF export\n' +
      '   – DOCX export"\n' +
      'Example: Table after list (same cell)\n' +
      '"Second embedded table\n' +
      'Plain text row content"'
  },
  {
    latex: '\\begin{tabular}{|p{0.22\\textwidth}|p{0.22\\textwidth}|p{0.22\\textwidth}|p{0.22\\textwidth}|}\n' +
      '\\hline\n' +
      'cell1&cell2&cell3& cell4\n' +
      '\\\\\\hline\n' +
      '\\begin{itemize}\n' +
      '\\item[] item 1;\n' +
      '\\item[] item 2,\n' +
      '\\item[] item 3.\n' +
      '\\end{itemize}\n' +
      '& \\begin{itemize}\n' +
      '\\item[□] item 1;\n' +
      '\\item[□] item 2,\n' +
      '\\item[□] item 3.\n' +
      '\\end{itemize}\n' +
      '& \\begin{itemize}\n' +
      '\\item item 1;\n' +
      '\\item item 2,\n' +
      '\\item item 3.\n' +
      '\\end{itemize}\n' +
      '& 1\\begin{itemize}\n' +
      '\\item test\n' +
      '\\end{itemize}\n' +
      '\\\\\\hline\n' +
      '\\end{tabular}',
    tsv: 'cell1\tcell2\tcell3\tcell4\n' +
      '"  item 1;\n' +
      '  item 2,\n' +
      '  item 3."\t" □ item 1;\n' +
      ' □ item 2,\n' +
      ' □ item 3."\t" • item 1;\n' +
      ' • item 2,\n' +
      ' • item 3."\t"1\n' +
      ' • test"',
    markdown: '| cell1 | cell2 | cell3 | cell4 |\n' +
      '| :--- | :--- | :--- | :--- |\n' +
      '| item 1;<br>item 2,<br>item 3.<br> | □ item 1;<br>□ item 2,<br>□ item 3.<br> | • item 1;<br>• item 2,<br>• item 3.<br> | 1<br>• test<br> |',
    csv: 'cell1,cell2,cell3,cell4\n' +
      '"  item 1;\n' +
      '  item 2,\n' +
      '  item 3."," □ item 1;\n' +
      ' □ item 2,\n' +
      ' □ item 3."," • item 1;\n' +
      ' • item 2,\n' +
      ' • item 3.","1\n' +
      ' • test"'
  },
  {
    latex: '\\begin{tabular}{|l|l|l|l|}\n' +
      '\\hline\n' +
      'cell1&cell2&cell3& cell4\n' +
      '\\\\\\hline\n' +
      '\\begin{itemize}\n' +
      '\\item[] item 1;\n' +
      '\\item[] item 2,\n' +
      '\\item[] item 3.\n' +
      '\\end{itemize}\n' +
      '& \\begin{itemize}\n' +
      '\\item[□] item 1;\n' +
      '\\item[□] item 2,\n' +
      '\\item[□] item 3.\n' +
      '\\end{itemize}\n' +
      '& \\begin{itemize}\n' +
      '\\item item 1;\n' +
      '\\item item 2,\n' +
      '\\item item 3.\n' +
      '\\end{itemize}\n' +
      '& 1\\begin{itemize}\n' +
      '\\item test\n' +
      '\\end{itemize}\n' +
      '\\\\\\hline\n' +
      '\\end{tabular}',
    tsv: 'cell1\tcell2\tcell3\tcell4\n' +
      '"  item 1;\n' +
      '  item 2,\n' +
      '  item 3."\t" □ item 1;\n' +
      ' □ item 2,\n' +
      ' □ item 3."\t" • item 1;\n' +
      ' • item 2,\n' +
      ' • item 3."\t"1\n' +
      ' • test"',
    markdown: '| cell1 | cell2 | cell3 | cell4 |\n' +
      '| :--- | :--- | :--- | :--- |\n' +
      '| item 1;<br>item 2,<br>item 3.<br> | □ item 1;<br>□ item 2,<br>□ item 3.<br> | • item 1;<br>• item 2,<br>• item 3.<br> | 1<br>• test<br> |',
    csv: 'cell1,cell2,cell3,cell4\n' +
      '"  item 1;\n' +
      '  item 2,\n' +
      '  item 3."," □ item 1;\n' +
      ' □ item 2,\n' +
      ' □ item 3."," • item 1;\n' +
      ' • item 2,\n' +
      ' • item 3.","1\n' +
      ' • test"'
  },
  {
    latex: '\\begin{tabular}{|l|l|}\n' +
      '\\hline\n' +
      '\\textbf{A} & \\textbf{B} \\\\\n' +
      '\\hline\n' +
      '\\multicolumn{2}{|l|}{\n' +
      '\\textbf{Multicolumn with list}\n' +
      '\\begin{itemize}\n' +
      '  \\item item 1\n' +
      '  \\item item 2\n' +
      '\\end{itemize}\n' +
      '} \\\\\n' +
      '\\hline\n' +
      'Plain & Text \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv: 'A\tB\n' +
      '"Multicolumn with list\n' +
      ' • item 1\n' +
      ' • item 2"\t\n' +
      'Plain\tText',
    markdown: '| **A** | **B** |\n' +
      '| :--- | :--- |\n' +
      '| **Multicolumn with list**<br>• item 1<br>• item 2<br> |  |\n' +
      '| Plain | Text |',
    csv: 'A,B\n' +
      '"Multicolumn with list\n' +
      ' • item 1\n' +
      ' • item 2",\n' +
      'Plain,Text'
  },
  {
    latex: '\\begin{tabular}{|l|l|}\n' +
      '\\hline\n' +
      'H1 & H2 \\\\\n' +
      '\\hline\n' +
      '\\multirow{2}{*}{\n' +
      '\\textbf{Unsafe multirow * + list}\n' +
      '\\begin{itemize}\n' +
      '  \\item one\n' +
      '  \\item two\n' +
      '\\end{itemize}\n' +
      '}\n' +
      '& right 1 \\\\\n' +
      '\\cline{2-2}\n' +
      '& This is a long test sentence intended to simulate real documentation content, including multiple clauses, commas, and descriptive phrases, so we can verify that line wrapping behaves correctly inside table cells and does not overflow the page margins. \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv: 'H1\tH2\n' +
      '"Unsafe multirow * + list\n' +
      ' • one\n' +
      ' • two"\tright 1\n' +
      '\tThis is a long test sentence intended to simulate real documentation content, including multiple clauses, commas, and descriptive phrases, so we can verify that line wrapping behaves correctly inside table cells and does not overflow the page margins.',
    markdown: '| H1 | H2 |\n' +
      '| :--- | :--- |\n' +
      '| **Unsafe multirow * + list**<br>• one<br>• two<br> | right 1 |\n' +
      '|  | This is a long test sentence intended to simulate real documentation content, including multiple clauses, commas, and descriptive phrases, so we can verify that line wrapping behaves correctly inside table cells and does not overflow the page margins. |',
    csv: 'H1,H2\n' +
      '"Unsafe multirow * + list\n' +
      ' • one\n' +
      ' • two",right 1\n' +
      ',"This is a long test sentence intended to simulate real documentation content, including multiple clauses, commas, and descriptive phrases, so we can verify that line wrapping behaves correctly inside table cells and does not overflow the page margins."'
  },
  {
    latex: '\\begin{tabular}{|c|c|}\n' +
      '\\hline\n' +
      '\\textbf{A} & \\textbf{B} \\\\\n' +
      '\\hline\n' +
      '\\multicolumn{2}{|l|}{\n' +
      '\\textbf{Unsafe multicolumn l + list}\n' +
      '\\begin{itemize}\n' +
      '  \\item item 1 with a very very very long text that should wrap but cannot in l\n' +
      '  \\item item 2\n' +
      '\\end{itemize}\n' +
      '} \\\\\n' +
      '\\hline\n' +
      'x & y \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv: 'A\tB\n' +
      '"Unsafe multicolumn l + list\n' +
      ' • item 1 with a very very very long text that should wrap but cannot in l\n' +
      ' • item 2"\t\n' +
      'x\ty',
    markdown: '| **A** | **B** |\n' +
      '| :---: | :---: |\n' +
      '| **Unsafe multicolumn l + list**<br>• item 1 with a very very very long text that should wrap but cannot in l<br>• item 2<br> |  |\n' +
      '| x | y |',
    csv: 'A,B\n' +
      '"Unsafe multicolumn l + list\n' +
      ' • item 1 with a very very very long text that should wrap but cannot in l\n' +
      ' • item 2",\n' +
      'x,y'
  },
  {
    latex: '\\begin{tabular}{|p{0.7\\textwidth}|}\n' +
      '\\hline\n' +
      'Outer cell \\\\\n' +
      '\\hline\n' +
      '\\begin{tabular}{|p{0.6\\textwidth}|}\n' +
      '\\hline\n' +
      'Nested table with \\texttt{textwidth} \\\\\n' +
      '\\hline\n' +
      '\\begin{itemize}\n' +
      '  \\item nested item 1\n' +
      '  \\item nested item 2\n' +
      '\\end{itemize}\n' +
      '\\\\\n' +
      '\\hline\n' +
      '\\end{tabular}\n' +
      '\\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv: 'Outer cell\n' +
      '"Nested table with textwidth\n' +
      ' • nested item 1\n' +
      ' • nested item 2"',
    markdown: '| Outer cell |\n' +
      '| :--- |\n' +
      '| Nested table with `textwidth` <br> • nested item 1<br>• nested item 2<br> |',
    csv: 'Outer cell\n' +
      '"Nested table with textwidth\n' +
      ' • nested item 1\n' +
      ' • nested item 2"'
  },
  {
    latex: '\\begin{tabular}{|p{0.7\\textwidth}|}\n' +
      '\\hline\n' +
      'Outer \\\\\n' +
      '\\hline\n' +
      '\\begin{tabular}{|l|l|}\n' +
      '\\hline\n' +
      'A & B \\\\\n' +
      '\\hline\n' +
      '\\multirow{2}{*}{\n' +
      '\\begin{itemize}\n' +
      '  \\item nested one\n' +
      '  \\item nested two\n' +
      '\\end{itemize}\n' +
      '}\n' +
      '& right 1 \\\\\n' +
      '\\cline{2-2}\n' +
      '& This is a long test sentence intended to simulate real documentation content, including multiple clauses, commas, and descriptive phrases, so we can verify that line wrapping behaves correctly inside table cells and does not overflow the page margins. \\\\\n' +
      '\\cline{2-2}\n' +
      ' & right 3 \\\\\n' +
      ' \\hline\n' +
      '\\end{tabular}\n' +
      '\\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv: 'Outer\n' +
      '"A\tB\n' +
      ' • nested one\n' +
      ' • nested two\tright 1\n' +
      '\tThis is a long test sentence intended to simulate real documentation content, including multiple clauses, commas, and descriptive phrases, so we can verify that line wrapping behaves correctly inside table cells and does not overflow the page margins.\n' +
      '\tright 3"',
    markdown: '| Outer |\n' +
      '| :--- |\n' +
      '| A B <br> • nested one<br>• nested two<br> right 1 <br>  This is a long test sentence intended to simulate real documentation content, including multiple clauses, commas, and descriptive phrases, so we can verify that line wrapping behaves correctly inside table cells and does not overflow the page margins. <br>  right 3 |',
    csv: 'Outer\n' +
      '"A,B\n' +
      ' • nested one\n' +
      ' • nested two,right 1\n' +
      ',This is a long test sentence intended to simulate real documentation content, including multiple clauses, commas, and descriptive phrases, so we can verify that line wrapping behaves correctly inside table cells and does not overflow the page margins.\n' +
      ',right 3"'
  },
  {
    latex: '\\begin{tabular}{|l|l|l|}\n' +
      '\\hline\n' +
      'A & B & C \\\\\n' +
      '\\hline\n' +
      '\\multirow{2}{*}{\n' +
      '  \\multicolumn{2}{|l|}{\n' +
      '    \\textbf{MR+MC with list}\n' +
      '    \\begin{itemize}\n' +
      '      \\item item 1 with a very very very long text that should wrap but cannot in l\n' +
      '      \\item item 2. When exporting to LaTeX, the converter should avoid unsafe column specs, normalize alignment, preserve inline math like $E = mc^2$, and prevent box overfull warnings by forcing paragraph-mode columns where block content appears.\n' +
      '    \\end{itemize}\n' +
      '  }\n' +
      '} & This is a long test sentence intended to simulate real documentation content, including multiple clauses, commas, and descriptive phrases, so we can verify that line wrapping behaves correctly inside table cells and does not overflow the page margins. \\\\\n' +
      '\\cline{3-3}\n' +
      '\\multicolumn{2}{|c|}{} & c2 \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv: 'A\tB\tC\n' +
      '"MR+MC with list\n' +
      ' • item 1 with a very very very long text that should wrap but cannot in l\n' +
      ' • item 2. When exporting to LaTeX, the converter should avoid unsafe column specs, normalize alignment, preserve inline math like E=mc^(2), and prevent box overfull warnings by forcing paragraph-mode columns where block content appears."\t\tThis is a long test sentence intended to simulate real documentation content, including multiple clauses, commas, and descriptive phrases, so we can verify that line wrapping behaves correctly inside table cells and does not overflow the page margins.\n' +
      '\t\tc2',
    markdown: '| A | B | C |\n' +
      '| :--- | :--- | :--- |\n' +
      '| **MR+MC with list**<br>• item 1 with a very very very long text that should wrap but cannot in l<br>• item 2. When exporting to LaTeX, the converter should avoid unsafe column specs, normalize alignment, preserve inline math like $E = mc^2$, and prevent box overfull warnings by forcing paragraph-mode columns where block content appears.<br> |  | This is a long test sentence intended to simulate real documentation content, including multiple clauses, commas, and descriptive phrases, so we can verify that line wrapping behaves correctly inside table cells and does not overflow the page margins. |\n' +
      '|  |  | c2 |',
    csv: 'A,B,C\n' +
      '"MR+MC with list\n' +
      ' • item 1 with a very very very long text that should wrap but cannot in l\n' +
      ' • item 2. When exporting to LaTeX, the converter should avoid unsafe column specs, normalize alignment, preserve inline math like E=mc^(2), and prevent box overfull warnings by forcing paragraph-mode columns where block content appears.",,"This is a long test sentence intended to simulate real documentation content, including multiple clauses, commas, and descriptive phrases, so we can verify that line wrapping behaves correctly inside table cells and does not overflow the page margins."\n' +
      ',,c2'
  },
  {
    latex: '\\begin{tabular}{|l|}\n' +
      '\\hline\n' +
      '\\begin{itemize}\n' +
      '\\item[] - Family health assessment are foundational to public health nurse\'s work with families\n' +
      '\\item[] - Family members must have a certain amount of trust to allow PHN to their house\n' +
      '\\item[] - Family members believe that pHN is there to help enhance their ability to function as a healthy family utilizing internal and external resources\n' +
      '\\item[] - PHN must have certain amount of trust to enter family\'s home\n' +
      '\\item[] - To best prepare to enter a client\'s home. PHN must have the skills of good observation and communication, understanding of components of home visit, purpose of the home visit and how to maintain personal safety.\n' +
      '\\begin{itemize}\n' +
      '\\item[] I. Family health assessment\n' +
      '\\begin{itemize}\n' +
      '\\item[] - Informal approach - nurses observational skills\n' +
      '\\item[] - Formal approach - uses specific questions and assessment tools to assess health data, family hx, physical data, family development and potential health problems\n' +
      '\\item[] - Calgary family assessment model\n' +
      '\\begin{itemize}\n' +
      '\\item[] ○ Functional - emphasizes in the interaction among family members\n' +
      '\\begin{itemize}\n' +
      '\\item[] - Instrumental\n' +
      '\\begin{itemize}\n' +
      '\\item[] - ADL\'s and IADLs (meal prep-shopping-current health): activities allow to live independently\n' +
      '\\end{itemize}\n' +
      '\\item[] - Expressive\n' +
      '\\begin{itemize}\n' +
      '\\item[] - Communication verbal and nonverbal\n' +
      '\\end{itemize}\n' +
      '\\end{itemize}\n' +
      '\\end{itemize}\n' +
      '\\end{itemize}\n' +
      '\\end{itemize}\n' +
      '\\end{itemize}\n' +
      '\\\\\\hline\n' +
      '\\end{tabular}',
    tsv: '"  - Family health assessment are foundational to public health nurse\'s work with families\n' +
      '  - Family members must have a certain amount of trust to allow PHN to their house\n' +
      '  - Family members believe that pHN is there to help enhance their ability to function as a healthy family utilizing internal and external resources\n' +
      '  - PHN must have certain amount of trust to enter family\'s home\n' +
      '  - To best prepare to enter a client\'s home. PHN must have the skills of good observation and communication, understanding of components of home visit, purpose of the home visit and how to maintain personal safety.\n' +
      '    I. Family health assessment\n' +
      '      - Informal approach - nurses observational skills\n' +
      '      - Formal approach - uses specific questions and assessment tools to assess health data, family hx, physical data, family development and potential health problems\n' +
      '      - Calgary family assessment model\n' +
      '        ○ Functional - emphasizes in the interaction among family members\n' +
      '          - Instrumental\n' +
      '            - ADL\'s and IADLs (meal prep-shopping-current health): activities allow to live independently\n' +
      '          - Expressive\n' +
      '            - Communication verbal and nonverbal"',
    markdown: '| - Family health assessment are foundational to public health nurse\'s work with families<br>- Family members must have a certain amount of trust to allow PHN to their house<br>- Family members believe that pHN is there to help enhance their ability to function as a healthy family utilizing internal and external resources<br>- PHN must have certain amount of trust to enter family\'s home<br>- To best prepare to enter a client\'s home. PHN must have the skills of good observation and communication, understanding of components of home visit, purpose of the home visit and how to maintain personal safety.<br>&#160;&#160;I. Family health assessment<br>&#160;&#160;&#160;&#160;- Informal approach - nurses observational skills<br>&#160;&#160;&#160;&#160;- Formal approach - uses specific questions and assessment tools to assess health data, family hx, physical data, family development and potential health problems<br>&#160;&#160;&#160;&#160;- Calgary family assessment model<br>&#160;&#160;&#160;&#160;&#160;&#160;○ Functional - emphasizes in the interaction among family members<br>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;- Instrumental<br>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;- ADL\'s and IADLs (meal prep-shopping-current health): activities allow to live independently<br>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;- Expressive<br>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;- Communication verbal and nonverbal<br> |\n' +
      '| :--- |',
    csv: '"  - Family health assessment are foundational to public health nurse\'s work with families\n' +
      '  - Family members must have a certain amount of trust to allow PHN to their house\n' +
      '  - Family members believe that pHN is there to help enhance their ability to function as a healthy family utilizing internal and external resources\n' +
      '  - PHN must have certain amount of trust to enter family\'s home\n' +
      '  - To best prepare to enter a client\'s home. PHN must have the skills of good observation and communication, understanding of components of home visit, purpose of the home visit and how to maintain personal safety.\n' +
      '    I. Family health assessment\n' +
      '      - Informal approach - nurses observational skills\n' +
      '      - Formal approach - uses specific questions and assessment tools to assess health data, family hx, physical data, family development and potential health problems\n' +
      '      - Calgary family assessment model\n' +
      '        ○ Functional - emphasizes in the interaction among family members\n' +
      '          - Instrumental\n' +
      '            - ADL\'s and IADLs (meal prep-shopping-current health): activities allow to live independently\n' +
      '          - Expressive\n' +
      '            - Communication verbal and nonverbal"'
  },
  {
    latex: '\\begin{table}\n' +
      '\\captionsetup{labelformat=empty}\n' +
      '\\caption{\\textbf{Table 9. Required Documentation and Information to Support Legal Responsibility}}\n' +
      '\\begin{tabular}{|l|l|}\n' +
      '\\hline \\textbf{For Small Projects} & \\textbf{For Large Projects}\n' +
      '\\\\\\hline \\begin{itemize}\n' +
      '\\item[] - Certification that the facility and work are the applicant’s legal responsibility. \\end{itemize} & \\begin{tabular}{l}\n' +
      '\\begin{itemize}\n' +
      '\\item[] - If necessary to validate legal responsibility, applicants must provide one or more of the following documents:\n' +
      '\\begin{itemize}\n' +
      '\\item[] ○ Deed;\n' +
      '\\item[] ○ Title;\n' +
      '\\item[] ○ Lease agreement (required for leased facilities);\n' +
      '\\item[] ○ Bill of sale;\n' +
      '\\item[] ○ Land contract;\n' +
      '\\item[] ○ Mortgage booklet or reoccurring mortgage payments;\n' +
      '\\item[] ○ Property tax receipt or property tax bill;\n' +
      '\\item[] ○ Real property structured insurance policy; and/or,\n' +
      '\\item[] ○ Contract (required for facilities under construction at the time of the incident).\n' +
      '\\end{itemize}\n' +
      '\\end{itemize}\n' +
      '\\end{tabular} \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}\n' +
      '\\end{table}',
    tsv: 'For Small Projects\tFor Large Projects\n' +
      '  - Certification that the facility and work are the applicant’s legal responsibility.\t"  - If necessary to validate legal responsibility, applicants must provide one or more of the following documents:\n' +
      '    ○ Deed;\n' +
      '    ○ Title;\n' +
      '    ○ Lease agreement (required for leased facilities);\n' +
      '    ○ Bill of sale;\n' +
      '    ○ Land contract;\n' +
      '    ○ Mortgage booklet or reoccurring mortgage payments;\n' +
      '    ○ Property tax receipt or property tax bill;\n' +
      '    ○ Real property structured insurance policy; and/or,\n' +
      '    ○ Contract (required for facilities under construction at the time of the incident)."',
    markdown: '| **For Small Projects** | **For Large Projects** |\n' +
      '| :--- | :--- |\n' +
      '| - Certification that the facility and work are the applicant’s legal responsibility.<br> | - If necessary to validate legal responsibility, applicants must provide one or more of the following documents:<br>&#160;&#160;○ Deed;<br>&#160;&#160;○ Title;<br>&#160;&#160;○ Lease agreement (required for leased facilities);<br>&#160;&#160;○ Bill of sale;<br>&#160;&#160;○ Land contract;<br>&#160;&#160;○ Mortgage booklet or reoccurring mortgage payments;<br>&#160;&#160;○ Property tax receipt or property tax bill;<br>&#160;&#160;○ Real property structured insurance policy; and/or,<br>&#160;&#160;○ Contract (required for facilities under construction at the time of the incident).<br> |',
    csv: 'For Small Projects,For Large Projects\n' +
      '  - Certification that the facility and work are the applicant’s legal responsibility.,"  - If necessary to validate legal responsibility, applicants must provide one or more of the following documents:\n' +
      '    ○ Deed;\n' +
      '    ○ Title;\n' +
      '    ○ Lease agreement (required for leased facilities);\n' +
      '    ○ Bill of sale;\n' +
      '    ○ Land contract;\n' +
      '    ○ Mortgage booklet or reoccurring mortgage payments;\n' +
      '    ○ Property tax receipt or property tax bill;\n' +
      '    ○ Real property structured insurance policy; and/or,\n' +
      '    ○ Contract (required for facilities under construction at the time of the incident)."'
  },
  {
    latex: '\\begin{tabular}{|l|l|l|}\n' +
      '\\hline\n' +
      'Default & Custom marker & Without marker \\\\\n' +
      '\\hline\n' +
      '\\begin{itemize}\n' +
      '  \\item Level 1\n' +
      '  \\item Level 1\n' +
      '  \\begin{itemize}\n' +
      '    \\item Level 2\n' +
      '    \\item Level 2\n' +
      '    \\begin{itemize}\n' +
      '      \\item Level 3\n' +
      '      \\item Level 3\n' +
      '      \\begin{itemize}\n' +
      '        \\item Level 4\n' +
      '        \\item Level 4\n' +
      '        \\begin{itemize}\n' +
      '          \\item Level 5\n' +
      '          \\item Level 5\n' +
      '          \\begin{itemize}\n' +
      '            \\item Level 6\n' +
      '            \\item Level 6\n' +
      '          \\end{itemize}\n' +
      '        \\end{itemize}\n' +
      '      \\end{itemize}\n' +
      '    \\end{itemize}\n' +
      '  \\end{itemize}\n' +
      '\\end{itemize}\n' +
      '&\n' +
      '\\begin{itemize}\n' +
      '  \\item[•] Level 1\n' +
      '  \\item[•] Level 1\n' +
      '  \\begin{itemize}\n' +
      '    \\item[–] Level 2\n' +
      '    \\item[–] Level 2\n' +
      '    \\begin{itemize}\n' +
      '      \\item[∗] Level 3\n' +
      '      \\item[∗] Level 3\n' +
      '      \\begin{itemize}\n' +
      '        \\item[·] Level 4\n' +
      '        \\item[·] Level 4\n' +
      '        \\begin{itemize}\n' +
      '          \\item[·] Level 5\n' +
      '          \\item[·] Level 5\n' +
      '          \\begin{itemize}\n' +
      '            \\item[·] Level 6\n' +
      '            \\item[·] Level 6\n' +
      '          \\end{itemize}\n' +
      '        \\end{itemize}\n' +
      '      \\end{itemize}\n' +
      '    \\end{itemize}\n' +
      '  \\end{itemize}\n' +
      '\\end{itemize}\n' +
      '&\n' +
      '\\begin{itemize}\n' +
      '  \\item[] • Level 1\n' +
      '  \\item[] • Level 1\n' +
      '  \\begin{itemize}\n' +
      '    \\item[] – Level 2\n' +
      '    \\item[] – Level 2\n' +
      '    \\begin{itemize}\n' +
      '      \\item[] ∗ Level 3\n' +
      '      \\item[] ∗ Level 3\n' +
      '      \\begin{itemize}\n' +
      '        \\item[]· Level 4\n' +
      '        \\item[]· Level 4\n' +
      '        \\begin{itemize}\n' +
      '          \\item[] · Level 5\n' +
      '          \\item[] · Level 5\n' +
      '          \\begin{itemize}\n' +
      '            \\item[] · Level 6\n' +
      '            \\item[] · Level 6\n' +
      '          \\end{itemize}\n' +
      '        \\end{itemize}\n' +
      '      \\end{itemize}\n' +
      '    \\end{itemize}\n' +
      '  \\end{itemize}\n' +
      '\\end{itemize}\n' +
      '\\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv: 'Default\tCustom marker\tWithout marker\n' +
      '" • Level 1\n' +
      ' • Level 1\n' +
      '   – Level 2\n' +
      '   – Level 2\n' +
      '     * Level 3\n' +
      '     * Level 3\n' +
      '       · Level 4\n' +
      '       · Level 4\n' +
      '         · Level 5\n' +
      '         · Level 5\n' +
      '           · Level 6\n' +
      '           · Level 6"\t" • Level 1\n' +
      ' • Level 1\n' +
      '   – Level 2\n' +
      '   – Level 2\n' +
      '     ∗ Level 3\n' +
      '     ∗ Level 3\n' +
      '       · Level 4\n' +
      '       · Level 4\n' +
      '         · Level 5\n' +
      '         · Level 5\n' +
      '           · Level 6\n' +
      '           · Level 6"\t"  • Level 1\n' +
      '  • Level 1\n' +
      '    – Level 2\n' +
      '    – Level 2\n' +
      '      ∗ Level 3\n' +
      '      ∗ Level 3\n' +
      '        · Level 4\n' +
      '        · Level 4\n' +
      '          · Level 5\n' +
      '          · Level 5\n' +
      '            · Level 6\n' +
      '            · Level 6"',
    markdown: '| Default | Custom marker | Without marker |\n' +
      '| :--- | :--- | :--- |\n' +
      '| • Level 1<br>• Level 1<br>&#160;&#160;– Level 2<br>&#160;&#160;– Level 2<br>&#160;&#160;&#160;&#160;* Level 3<br>&#160;&#160;&#160;&#160;* Level 3<br>&#160;&#160;&#160;&#160;&#160;&#160;· Level 4<br>&#160;&#160;&#160;&#160;&#160;&#160;· Level 4<br>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;· Level 5<br>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;· Level 5<br>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;· Level 6<br>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;· Level 6<br> | • Level 1<br>• Level 1<br>&#160;&#160;– Level 2<br>&#160;&#160;– Level 2<br>&#160;&#160;&#160;&#160;∗ Level 3<br>&#160;&#160;&#160;&#160;∗ Level 3<br>&#160;&#160;&#160;&#160;&#160;&#160;· Level 4<br>&#160;&#160;&#160;&#160;&#160;&#160;· Level 4<br>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;· Level 5<br>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;· Level 5<br>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;· Level 6<br>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;· Level 6<br> | • Level 1<br>• Level 1<br>&#160;&#160;– Level 2<br>&#160;&#160;– Level 2<br>&#160;&#160;&#160;&#160;∗ Level 3<br>&#160;&#160;&#160;&#160;∗ Level 3<br>&#160;&#160;&#160;&#160;&#160;&#160;· Level 4<br>&#160;&#160;&#160;&#160;&#160;&#160;· Level 4<br>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;· Level 5<br>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;· Level 5<br>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;· Level 6<br>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;· Level 6<br> |',
    csv: 'Default,Custom marker,Without marker\n' +
      '" • Level 1\n' +
      ' • Level 1\n' +
      '   – Level 2\n' +
      '   – Level 2\n' +
      '     * Level 3\n' +
      '     * Level 3\n' +
      '       · Level 4\n' +
      '       · Level 4\n' +
      '         · Level 5\n' +
      '         · Level 5\n' +
      '           · Level 6\n' +
      '           · Level 6"," • Level 1\n' +
      ' • Level 1\n' +
      '   – Level 2\n' +
      '   – Level 2\n' +
      '     ∗ Level 3\n' +
      '     ∗ Level 3\n' +
      '       · Level 4\n' +
      '       · Level 4\n' +
      '         · Level 5\n' +
      '         · Level 5\n' +
      '           · Level 6\n' +
      '           · Level 6","  • Level 1\n' +
      '  • Level 1\n' +
      '    – Level 2\n' +
      '    – Level 2\n' +
      '      ∗ Level 3\n' +
      '      ∗ Level 3\n' +
      '        · Level 4\n' +
      '        · Level 4\n' +
      '          · Level 5\n' +
      '          · Level 5\n' +
      '            · Level 6\n' +
      '            · Level 6"'
  },
  {
    latex: '\\begin{tabular}{|l|}\n' +
      '\\hline\n' +
      'Enumerate \\\\\n' +
      '\\hline\n' +
      '- text\n' +
      'text\n' +
      '\\begin{enumerate}\n' +
      '  \\item Level 1\n' +
      '  \\item Level 1\n' +
      '  \\begin{enumerate}\n' +
      '    \\item Level 2\n' +
      '    \\item Level 2\n' +
      '    \\begin{enumerate}\n' +
      '      \\item Level 3\n' +
      '      \\item Level 3\n' +
      '      \\begin{enumerate}\n' +
      '        \\item Level 4\n' +
      '        \\item Level 4\n' +
      '        \\begin{enumerate}\n' +
      '          \\item Level 5\n' +
      '          \\item Level 5\n' +
      '          \\begin{enumerate}\n' +
      '            \\item Level 6\n' +
      '            \\item Level 6\n' +
      '          \\end{enumerate}\n' +
      '          \\item Level 5\n' +
      '          \\item Level 5\n' +
      '        \\end{enumerate}\n' +
      '        \\item Level 4\n' +
      '        \\item Level 4\n' +
      '      \\end{enumerate}\n' +
      '      \\item Level 3\n' +
      '      \\item Level 3\n' +
      '    \\end{enumerate}\n' +
      '    \\item Level 2\n' +
      '    \\item Level 2\n' +
      '  \\end{enumerate}\n' +
      '  \\item Level 1\n' +
      '  \\item Level 1\n' +
      '\\end{enumerate}\n' +
      '\\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv: 'Enumerate\n' +
      '"- text text\n' +
      ' 1. Level 1\n' +
      ' 2. Level 1\n' +
      '   a. Level 2\n' +
      '   b. Level 2\n' +
      '     i. Level 3\n' +
      '     ii. Level 3\n' +
      '       A. Level 4\n' +
      '       B. Level 4\n' +
      '         1. Level 5\n' +
      '         2. Level 5\n' +
      '           1. Level 6\n' +
      '           2. Level 6\n' +
      '         3. Level 5\n' +
      '         4. Level 5\n' +
      '       C. Level 4\n' +
      '       D. Level 4\n' +
      '     iii. Level 3\n' +
      '     iv. Level 3\n' +
      '   c. Level 2\n' +
      '   d. Level 2\n' +
      ' 3. Level 1\n' +
      ' 4. Level 1"',
    markdown: '| Enumerate |\n' +
      '| :--- |\n' +
      '| - text text<br>1. Level 1<br>2. Level 1<br>&#160;&#160;a. Level 2<br>&#160;&#160;b. Level 2<br>&#160;&#160;&#160;&#160;i. Level 3<br>&#160;&#160;&#160;&#160;ii. Level 3<br>&#160;&#160;&#160;&#160;&#160;&#160;A. Level 4<br>&#160;&#160;&#160;&#160;&#160;&#160;B. Level 4<br>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;1. Level 5<br>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;2. Level 5<br>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;1. Level 6<br>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;2. Level 6<br>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;3. Level 5<br>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;4. Level 5<br>&#160;&#160;&#160;&#160;&#160;&#160;C. Level 4<br>&#160;&#160;&#160;&#160;&#160;&#160;D. Level 4<br>&#160;&#160;&#160;&#160;iii. Level 3<br>&#160;&#160;&#160;&#160;iv. Level 3<br>&#160;&#160;c. Level 2<br>&#160;&#160;d. Level 2<br>3. Level 1<br>4. Level 1<br> |',
    csv: 'Enumerate\n' +
      '"- text text\n' +
      ' 1. Level 1\n' +
      ' 2. Level 1\n' +
      '   a. Level 2\n' +
      '   b. Level 2\n' +
      '     i. Level 3\n' +
      '     ii. Level 3\n' +
      '       A. Level 4\n' +
      '       B. Level 4\n' +
      '         1. Level 5\n' +
      '         2. Level 5\n' +
      '           1. Level 6\n' +
      '           2. Level 6\n' +
      '         3. Level 5\n' +
      '         4. Level 5\n' +
      '       C. Level 4\n' +
      '       D. Level 4\n' +
      '     iii. Level 3\n' +
      '     iv. Level 3\n' +
      '   c. Level 2\n' +
      '   d. Level 2\n' +
      ' 3. Level 1\n' +
      ' 4. Level 1"'
  },
  {
    latex: '\\begin{tabular}{|l|l|l|}\n' +
      '\\hline\n' +
      'Enumerate & with custom markers & without markers \\\\\n' +
      '\\hline\n' +
      '- text\n' +
      'text\n' +
      '\\begin{enumerate}\n' +
      '  \\item Level 1\n' +
      '  \\item Level 1\n' +
      '  \\begin{enumerate}\n' +
      '    \\item Level 2\n' +
      '    \\item Level 2\n' +
      '    \\begin{enumerate}\n' +
      '      \\item Level 3\n' +
      '      \\item Level 3\n' +
      '      \\begin{enumerate}\n' +
      '        \\item Level 4\n' +
      '        \\item Level 4\n' +
      '        \\begin{enumerate}\n' +
      '          \\item Level 5\n' +
      '          \\item Level 5\n' +
      '          \\begin{enumerate}\n' +
      '            \\item Level 6\n' +
      '            \\item Level 6\n' +
      '          \\end{enumerate}\n' +
      '          \\item Level 5\n' +
      '          \\item Level 5\n' +
      '        \\end{enumerate}\n' +
      '        \\item Level 4\n' +
      '        \\item Level 4\n' +
      '      \\end{enumerate}\n' +
      '      \\item Level 3\n' +
      '      \\item Level 3\n' +
      '    \\end{enumerate}\n' +
      '    \\item Level 2\n' +
      '    \\item Level 2\n' +
      '  \\end{enumerate}\n' +
      '  \\item Level 1\n' +
      '  \\item Level 1\n' +
      '\\end{enumerate}\n' +
      '&\n' +
      '- text\n' +
      'text\n' +
      '\\begin{enumerate}\n' +
      '  \\item[1.] Level 1\n' +
      '  \\item[2.] Level 1\n' +
      '  \\begin{enumerate}\n' +
      '    \\item[a.] Level 2\n' +
      '    \\item[b.] Level 2\n' +
      '    \\begin{enumerate}\n' +
      '      \\item[i.] Level 3\n' +
      '      \\item[ii.] Level 3\n' +
      '      \\begin{enumerate}\n' +
      '        \\item[A.] Level 4\n' +
      '        \\item[B.] Level 4\n' +
      '        \\begin{enumerate}\n' +
      '          \\item[1.] Level 5\n' +
      '          \\item[2.] Level 5\n' +
      '          \\begin{enumerate}\n' +
      '            \\item[1.] Level 6\n' +
      '            \\item[2.] Level 6\n' +
      '          \\end{enumerate}\n' +
      '          \\item[3.] Level 5\n' +
      '          \\item[4.] Level 5\n' +
      '        \\end{enumerate}\n' +
      '        \\item[C.] Level 4\n' +
      '        \\item[D.] Level 4\n' +
      '      \\end{enumerate}\n' +
      '      \\item[iii.] Level 3\n' +
      '      \\item[iv.] Level 3\n' +
      '    \\end{enumerate}\n' +
      '    \\item[c.] Level 2\n' +
      '    \\item[d.] Level 2\n' +
      '  \\end{enumerate}\n' +
      '  \\item[3.] Level 1\n' +
      '  \\item[4.] Level 1\n' +
      '\\end{enumerate}\n' +
      '&\n' +
      '- text\n' +
      'text\n' +
      '\\begin{enumerate}\n' +
      '  \\item[] 1. Level 1\n' +
      '  \\item[] 2. Level 1\n' +
      '  \\begin{enumerate}\n' +
      '    \\item[] a. Level 2\n' +
      '    \\item[] b. Level 2\n' +
      '    \\begin{enumerate}\n' +
      '      \\item[] i. Level 3\n' +
      '      \\item[] ii. Level 3\n' +
      '      \\begin{enumerate}\n' +
      '        \\item[] A. Level 4\n' +
      '        \\item[] B. Level 4\n' +
      '        \\begin{enumerate}\n' +
      '          \\item[] 1. Level 5\n' +
      '          \\item[] 2. Level 5\n' +
      '          \\begin{enumerate}\n' +
      '            \\item[] 1. Level 6\n' +
      '            \\item[] 2. Level 6\n' +
      '          \\end{enumerate}\n' +
      '          \\item[] 3. Level 5\n' +
      '          \\item[] 4. Level 5\n' +
      '        \\end{enumerate}\n' +
      '        \\item[] C. Level 4\n' +
      '        \\item[] D. Level 4\n' +
      '      \\end{enumerate}\n' +
      '      \\item[] iii. Level 3\n' +
      '      \\item[] iv. Level 3\n' +
      '    \\end{enumerate}\n' +
      '    \\item[] c. Level 2\n' +
      '    \\item[] d. Level 2\n' +
      '  \\end{enumerate}\n' +
      '  \\item[] 3. Level 1\n' +
      '  \\item[] 4. Level 1\n' +
      '\\end{enumerate}\n' +
      '\\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv: 'Enumerate\twith custom markers\twithout markers\n' +
      '"- text text\n' +
      ' 1. Level 1\n' +
      ' 2. Level 1\n' +
      '   a. Level 2\n' +
      '   b. Level 2\n' +
      '     i. Level 3\n' +
      '     ii. Level 3\n' +
      '       A. Level 4\n' +
      '       B. Level 4\n' +
      '         1. Level 5\n' +
      '         2. Level 5\n' +
      '           1. Level 6\n' +
      '           2. Level 6\n' +
      '         3. Level 5\n' +
      '         4. Level 5\n' +
      '       C. Level 4\n' +
      '       D. Level 4\n' +
      '     iii. Level 3\n' +
      '     iv. Level 3\n' +
      '   c. Level 2\n' +
      '   d. Level 2\n' +
      ' 3. Level 1\n' +
      ' 4. Level 1"\t"- text text\n' +
      ' 1. Level 1\n' +
      ' 2. Level 1\n' +
      '   a. Level 2\n' +
      '   b. Level 2\n' +
      '     i. Level 3\n' +
      '     ii. Level 3\n' +
      '       A. Level 4\n' +
      '       B. Level 4\n' +
      '         1. Level 5\n' +
      '         2. Level 5\n' +
      '           1. Level 6\n' +
      '           2. Level 6\n' +
      '         3. Level 5\n' +
      '         4. Level 5\n' +
      '       C. Level 4\n' +
      '       D. Level 4\n' +
      '     iii. Level 3\n' +
      '     iv. Level 3\n' +
      '   c. Level 2\n' +
      '   d. Level 2\n' +
      ' 3. Level 1\n' +
      ' 4. Level 1"\t"- text text\n' +
      '  1. Level 1\n' +
      '  2. Level 1\n' +
      '    a. Level 2\n' +
      '    b. Level 2\n' +
      '      i. Level 3\n' +
      '      ii. Level 3\n' +
      '        A. Level 4\n' +
      '        B. Level 4\n' +
      '          1. Level 5\n' +
      '          2. Level 5\n' +
      '            1. Level 6\n' +
      '            2. Level 6\n' +
      '          3. Level 5\n' +
      '          4. Level 5\n' +
      '        C. Level 4\n' +
      '        D. Level 4\n' +
      '      iii. Level 3\n' +
      '      iv. Level 3\n' +
      '    c. Level 2\n' +
      '    d. Level 2\n' +
      '  3. Level 1\n' +
      '  4. Level 1"',
    markdown: '| Enumerate | with custom markers | without markers |\n' +
      '| :--- | :--- | :--- |\n' +
      '| - text text<br>1. Level 1<br>2. Level 1<br>&#160;&#160;a. Level 2<br>&#160;&#160;b. Level 2<br>&#160;&#160;&#160;&#160;i. Level 3<br>&#160;&#160;&#160;&#160;ii. Level 3<br>&#160;&#160;&#160;&#160;&#160;&#160;A. Level 4<br>&#160;&#160;&#160;&#160;&#160;&#160;B. Level 4<br>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;1. Level 5<br>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;2. Level 5<br>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;1. Level 6<br>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;2. Level 6<br>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;3. Level 5<br>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;4. Level 5<br>&#160;&#160;&#160;&#160;&#160;&#160;C. Level 4<br>&#160;&#160;&#160;&#160;&#160;&#160;D. Level 4<br>&#160;&#160;&#160;&#160;iii. Level 3<br>&#160;&#160;&#160;&#160;iv. Level 3<br>&#160;&#160;c. Level 2<br>&#160;&#160;d. Level 2<br>3. Level 1<br>4. Level 1<br> | - text text<br>1. Level 1<br>2. Level 1<br>&#160;&#160;a. Level 2<br>&#160;&#160;b. Level 2<br>&#160;&#160;&#160;&#160;i. Level 3<br>&#160;&#160;&#160;&#160;ii. Level 3<br>&#160;&#160;&#160;&#160;&#160;&#160;A. Level 4<br>&#160;&#160;&#160;&#160;&#160;&#160;B. Level 4<br>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;1. Level 5<br>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;2. Level 5<br>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;1. Level 6<br>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;2. Level 6<br>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;3. Level 5<br>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;4. Level 5<br>&#160;&#160;&#160;&#160;&#160;&#160;C. Level 4<br>&#160;&#160;&#160;&#160;&#160;&#160;D. Level 4<br>&#160;&#160;&#160;&#160;iii. Level 3<br>&#160;&#160;&#160;&#160;iv. Level 3<br>&#160;&#160;c. Level 2<br>&#160;&#160;d. Level 2<br>3. Level 1<br>4. Level 1<br> | - text text<br>1. Level 1<br>2. Level 1<br>&#160;&#160;a. Level 2<br>&#160;&#160;b. Level 2<br>&#160;&#160;&#160;&#160;i. Level 3<br>&#160;&#160;&#160;&#160;ii. Level 3<br>&#160;&#160;&#160;&#160;&#160;&#160;A. Level 4<br>&#160;&#160;&#160;&#160;&#160;&#160;B. Level 4<br>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;1. Level 5<br>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;2. Level 5<br>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;1. Level 6<br>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;2. Level 6<br>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;3. Level 5<br>&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;4. Level 5<br>&#160;&#160;&#160;&#160;&#160;&#160;C. Level 4<br>&#160;&#160;&#160;&#160;&#160;&#160;D. Level 4<br>&#160;&#160;&#160;&#160;iii. Level 3<br>&#160;&#160;&#160;&#160;iv. Level 3<br>&#160;&#160;c. Level 2<br>&#160;&#160;d. Level 2<br>3. Level 1<br>4. Level 1<br> |',
    csv: 'Enumerate,with custom markers,without markers\n' +
      '"- text text\n' +
      ' 1. Level 1\n' +
      ' 2. Level 1\n' +
      '   a. Level 2\n' +
      '   b. Level 2\n' +
      '     i. Level 3\n' +
      '     ii. Level 3\n' +
      '       A. Level 4\n' +
      '       B. Level 4\n' +
      '         1. Level 5\n' +
      '         2. Level 5\n' +
      '           1. Level 6\n' +
      '           2. Level 6\n' +
      '         3. Level 5\n' +
      '         4. Level 5\n' +
      '       C. Level 4\n' +
      '       D. Level 4\n' +
      '     iii. Level 3\n' +
      '     iv. Level 3\n' +
      '   c. Level 2\n' +
      '   d. Level 2\n' +
      ' 3. Level 1\n' +
      ' 4. Level 1","- text text\n' +
      ' 1. Level 1\n' +
      ' 2. Level 1\n' +
      '   a. Level 2\n' +
      '   b. Level 2\n' +
      '     i. Level 3\n' +
      '     ii. Level 3\n' +
      '       A. Level 4\n' +
      '       B. Level 4\n' +
      '         1. Level 5\n' +
      '         2. Level 5\n' +
      '           1. Level 6\n' +
      '           2. Level 6\n' +
      '         3. Level 5\n' +
      '         4. Level 5\n' +
      '       C. Level 4\n' +
      '       D. Level 4\n' +
      '     iii. Level 3\n' +
      '     iv. Level 3\n' +
      '   c. Level 2\n' +
      '   d. Level 2\n' +
      ' 3. Level 1\n' +
      ' 4. Level 1","- text text\n' +
      '  1. Level 1\n' +
      '  2. Level 1\n' +
      '    a. Level 2\n' +
      '    b. Level 2\n' +
      '      i. Level 3\n' +
      '      ii. Level 3\n' +
      '        A. Level 4\n' +
      '        B. Level 4\n' +
      '          1. Level 5\n' +
      '          2. Level 5\n' +
      '            1. Level 6\n' +
      '            2. Level 6\n' +
      '          3. Level 5\n' +
      '          4. Level 5\n' +
      '        C. Level 4\n' +
      '        D. Level 4\n' +
      '      iii. Level 3\n' +
      '      iv. Level 3\n' +
      '    c. Level 2\n' +
      '    d. Level 2\n' +
      '  3. Level 1\n' +
      '  4. Level 1"'
  },
  {
    latex: '\\begin{tabular}{|l|l}\n' +
      '\\hline\n' +
      '\\textbf{THROMBOTIC THROMBOCYTOPENIC PURPURA (TTP)} & \\textbf{THROMBOTIC THROMBOCYTOPENIC PURPURA (TTP)}\n' +
      '\\\\\\hline\n' +
      '\\begin{itemize}\n' +
      '\\item[] \\textbf{1.} Von Willebrand Factor (vWF) is a protein that helps platelets stick together.\n' +
      '\\item[] \\textbf{2.} Normally an enzyme called ADAMTS13 ‘cuts up’ the vWF. It needs to be ‘cut up’ otherwise is attracts platelets at high rates, forming blood clots even though there is no bleeding.\n' +
      '\\item[] \\textbf{3.} In TTP there is a lack of the ADAMTS13 enzyme, promoting platelets aggregation.\n' +
      '\\item[] \\textbf{4.} Results in microthromi that deposit in arterioles and capillaries\n' +
      '\\item[] \\textbf{5.} Also results in a low platelet count because they are being ‘used up’ forming these mini clots\n' +
      '\\end{itemize}\n' +
      '&\n' +
      '\\begin{itemize}\n' +
      '\\item[\\textbf{1.}] Von Willebrand Factor (vWF) is a protein that helps platelets stick together.\n' +
      '\\item[\\textbf{2.}] Normally an enzyme called ADAMTS13 ‘cuts up’ the vWF. It needs to be ‘cut up’ otherwise is attracts platelets at high rates, forming blood clots even though there is no bleeding.\n' +
      '\\item[\\textbf{3.}] In TTP there is a lack of the ADAMTS13 enzyme, promoting platelets aggregation.\n' +
      '\\item[\\textbf{4.}] Results in microthromi that deposit in arterioles and capillaries\n' +
      '\\item[\\textbf{5.}] Also results in a low platelet count because they are being ‘used up’ forming these mini clots\n' +
      '\\end{itemize}\n' +
      '\\\\\\hline\n' +
      '\\end{tabular}',
    tsv: 'THROMBOTIC THROMBOCYTOPENIC PURPURA (TTP)\tTHROMBOTIC THROMBOCYTOPENIC PURPURA (TTP)\n' +
      '"  1. Von Willebrand Factor (vWF) is a protein that helps platelets stick together.\n' +
      '  2. Normally an enzyme called ADAMTS13 ‘cuts up’ the vWF. It needs to be ‘cut up’ otherwise is attracts platelets at high rates, forming blood clots even though there is no bleeding.\n' +
      '  3. In TTP there is a lack of the ADAMTS13 enzyme, promoting platelets aggregation.\n' +
      '  4. Results in microthromi that deposit in arterioles and capillaries\n' +
      '  5. Also results in a low platelet count because they are being ‘used up’ forming these mini clots"\t" 1. Von Willebrand Factor (vWF) is a protein that helps platelets stick together.\n' +
      ' 2. Normally an enzyme called ADAMTS13 ‘cuts up’ the vWF. It needs to be ‘cut up’ otherwise is attracts platelets at high rates, forming blood clots even though there is no bleeding.\n' +
      ' 3. In TTP there is a lack of the ADAMTS13 enzyme, promoting platelets aggregation.\n' +
      ' 4. Results in microthromi that deposit in arterioles and capillaries\n' +
      ' 5. Also results in a low platelet count because they are being ‘used up’ forming these mini clots"',
    markdown: '| **THROMBOTIC THROMBOCYTOPENIC PURPURA (TTP)** | **THROMBOTIC THROMBOCYTOPENIC PURPURA (TTP)** |\n' +
      '| :--- | :--- |\n' +
      '| **1.** Von Willebrand Factor (vWF) is a protein that helps platelets stick together.<br>**2.** Normally an enzyme called ADAMTS13 ‘cuts up’ the vWF. It needs to be ‘cut up’ otherwise is attracts platelets at high rates, forming blood clots even though there is no bleeding.<br>**3.** In TTP there is a lack of the ADAMTS13 enzyme, promoting platelets aggregation.<br>**4.** Results in microthromi that deposit in arterioles and capillaries<br>**5.** Also results in a low platelet count because they are being ‘used up’ forming these mini clots<br> | **1.** Von Willebrand Factor (vWF) is a protein that helps platelets stick together.<br>**2.** Normally an enzyme called ADAMTS13 ‘cuts up’ the vWF. It needs to be ‘cut up’ otherwise is attracts platelets at high rates, forming blood clots even though there is no bleeding.<br>**3.** In TTP there is a lack of the ADAMTS13 enzyme, promoting platelets aggregation.<br>**4.** Results in microthromi that deposit in arterioles and capillaries<br>**5.** Also results in a low platelet count because they are being ‘used up’ forming these mini clots<br> |',
    csv: 'THROMBOTIC THROMBOCYTOPENIC PURPURA (TTP),THROMBOTIC THROMBOCYTOPENIC PURPURA (TTP)\n' +
      '"  1. Von Willebrand Factor (vWF) is a protein that helps platelets stick together.\n' +
      '  2. Normally an enzyme called ADAMTS13 ‘cuts up’ the vWF. It needs to be ‘cut up’ otherwise is attracts platelets at high rates, forming blood clots even though there is no bleeding.\n' +
      '  3. In TTP there is a lack of the ADAMTS13 enzyme, promoting platelets aggregation.\n' +
      '  4. Results in microthromi that deposit in arterioles and capillaries\n' +
      '  5. Also results in a low platelet count because they are being ‘used up’ forming these mini clots"," 1. Von Willebrand Factor (vWF) is a protein that helps platelets stick together.\n' +
      ' 2. Normally an enzyme called ADAMTS13 ‘cuts up’ the vWF. It needs to be ‘cut up’ otherwise is attracts platelets at high rates, forming blood clots even though there is no bleeding.\n' +
      ' 3. In TTP there is a lack of the ADAMTS13 enzyme, promoting platelets aggregation.\n' +
      ' 4. Results in microthromi that deposit in arterioles and capillaries\n' +
      ' 5. Also results in a low platelet count because they are being ‘used up’ forming these mini clots"'
  },
  {
    latex: '\\begin{tabular}{l}\n' +
      'Underlined \\\\\n' +
      '\\begin{itemize}\n' +
      '\\item[-] \\textbf{Bold text} \n' +
      '\\item[-]\\textit{Italic text}\n' +
      '\\item[-]\\underline{Underlined text}\n' +
      '\\item[-]\\underline{\\underline{Double underlined text!}}\n' +
      '\\item[-]\\uuline{Double underlined text!}\n' +
      '\\item[-]\\uwave{This text is underlined with a wavy line!}\n' +
      '\\item[-]\\sout{Text with a horizontal line through its center!}\n' +
      '\\item[-]\\xout{Text with hatching pattern!}\n' +
      '\\item[-]\\dashuline{Dashed Underline}\n' +
      '\\item[-]\\dotuline{Dotted Underline}\n' +
      '\\end{itemize}\n' +
      '\\end{tabular}',
    tsv: 'Underlined\n' +
      '" - Bold text\n' +
      ' - Italic text\n' +
      ' - Underlined text\n' +
      ' - Double underlined text!\n' +
      ' - Double underlined text!\n' +
      ' - This text is underlined with a wavy line!\n' +
      ' - Text with a horizontal line through its center!\n' +
      ' - Text with hatching pattern!\n' +
      ' - Dashed Underline\n' +
      ' - Dotted Underline"',
    markdown: '| Underlined |\n' +
      '| :--- |\n' +
      '| - **Bold text**<br>- *Italic text*<br>- Underlined text<br>- Double underlined text!<br>- Double underlined text!<br>- This text is underlined with a wavy line!<br>- Text with a horizontal line through its center!<br>- Text with hatching pattern!<br>- Dashed Underline<br>- Dotted Underline<br> |',
    csv: 'Underlined\n' +
      '" - Bold text\n' +
      ' - Italic text\n' +
      ' - Underlined text\n' +
      ' - Double underlined text!\n' +
      ' - Double underlined text!\n' +
      ' - This text is underlined with a wavy line!\n' +
      ' - Text with a horizontal line through its center!\n' +
      ' - Text with hatching pattern!\n' +
      ' - Dashed Underline\n' +
      ' - Dotted Underline"'
  },
  // {
  //   latex: '',
  //   tsv: '',
  //   markdown: '',
  //   csv: ''
  // }
];
