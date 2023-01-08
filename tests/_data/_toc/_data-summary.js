module.exports = [
  {
    latex: "[[toc]]\n" +
      "\n" +
      "# Header 1\n" +
      "\n" +
      "## Header 2\n" +
      "\n" +
      "### Header 3\n" +
      "\n" +
      "#### Header 4\n" +
      "\n" +
      "##### Header 5\n" +
      "\n" +
      "##### Header 6",
    html: `<div id="toc_container"><ul><li class="toc-title-1"><details><summary><a href="#header-1" style="cursor: pointer; text-decoration: none;" class="toc-link" value="header-1">Header 1</a></summary><ul><li class="toc-title-2"><details><summary><a href="#header-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="header-2">Header 2</a></summary><ul><li class="toc-title-3"><details><summary><a href="#header-3" style="cursor: pointer; text-decoration: none;" class="toc-link" value="header-3">Header 3</a></summary><ul><li class="toc-title-4"><details><summary><a href="#header-4" style="cursor: pointer; text-decoration: none;" class="toc-link" value="header-4">Header 4</a></summary><ul><li class="toc-title-5"><a href="#header-5" style="cursor: pointer; text-decoration: none;" class="toc-link" value="header-5">Header 5</a></li><li class="toc-title-5"><a href="#header-6" style="cursor: pointer; text-decoration: none;" class="toc-link" value="header-6">Header 6</a></li></ul></details></li></ul></details></li></ul></details></li></ul></details></li></ul></div>`
  },
  {
    latex: "[[toc]]\n" +
      "\n" +
      "\\title{Header 1}\n" +
      "\n" +
      "\\section{Header 2}\n" +
      "\n" +
      "\\subsection{Header 3}\n" +
      "\n" +
      "\\subsubsection{Header 4}",
    html: "<div id=\"toc_container\"><ul><li class=\"toc-title-1\"><details><summary><a href=\"#header-1\" style=\"cursor: pointer; text-decoration: none;\" class=\"toc-link\" value=\"header-1\">Header 1</a></summary><ul><li class=\"toc-title-2\"><details><summary><a href=\"#header-2\" style=\"cursor: pointer; text-decoration: none;\" class=\"toc-link\" value=\"header-2\">Header 2</a></summary><ul><li class=\"toc-title-3\"><details><summary><a href=\"#header-3\" style=\"cursor: pointer; text-decoration: none;\" class=\"toc-link\" value=\"header-3\">Header 3</a></summary><ul><li class=\"toc-title-4\"><a href=\"#header-4\" style=\"cursor: pointer; text-decoration: none;\" class=\"toc-link\" value=\"header-4\">Header 4</a></li></ul></details></li></ul></details></li></ul></details></li></ul></div>"
  },
  {
    latex: "[[toc]]\n" +
      "\n" +
      "\\title{Header 1}\n" +
      "\n" +
      "\\section{Header 2}\n" +
      "\n" +
      "\\subsection{Header 3}\n" +
      "\n" +
      "\\subsubsection{Header 4}\n" +
      "\n" +
      "\\subsection{Header 3}\n" +
      "\n" +
      "\\section{Header 2}\n" +
      "\n" +
      "\\title{Header 1}",
    html: `<div id="toc_container"><ul><li class="toc-title-1"><details><summary><a href="#header-1" style="cursor: pointer; text-decoration: none;" class="toc-link" value="header-1">Header 1</a></summary><ul><li class="toc-title-2"><details><summary><a href="#header-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="header-2">Header 2</a></summary><ul><li class="toc-title-3"><details><summary><a href="#header-3" style="cursor: pointer; text-decoration: none;" class="toc-link" value="header-3">Header 3</a></summary><ul><li class="toc-title-4"><a href="#header-4" style="cursor: pointer; text-decoration: none;" class="toc-link" value="header-4">Header 4</a></li></ul></details></li><li class="toc-title-3"><a href="#header-3-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="header-3-2">Header 3</a></li></ul></details></li><li class="toc-title-2"><a href="#header-2-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="header-2-2">Header 2</a></li></ul></details></li><li class="toc-title-1"><a href="#header-1-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="header-1-2">Header 1</a></li></ul></div>`
  },
  {
    latex: "[[toc]]\n" +
      "\n" +
      "### Header 3\n" +
      "\n" +
      "## Header 2\n" +
      "\n" +
      "# Header 1\n" +
      "\n" +
      "### Header 3\n" +
      "\n" +
      "### Header 3\n" +
      "\n" +
      "## Header 2",
    html: `<div id="toc_container"><ul><li class="toc-title-3"><a href="#header-3" style="cursor: pointer; text-decoration: none;" class="toc-link" value="header-3">Header 3</a></li><li class="toc-title-2"><a href="#header-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="header-2">Header 2</a></li><li class="toc-title-1"><details><summary><a href="#header-1" style="cursor: pointer; text-decoration: none;" class="toc-link" value="header-1">Header 1</a></summary><ul><li class="toc-title-3"><a href="#header-3-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="header-3-2">Header 3</a></li><li class="toc-title-3"><a href="#header-3-3" style="cursor: pointer; text-decoration: none;" class="toc-link" value="header-3-3">Header 3</a></li><li class="toc-title-2"><a href="#header-2-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="header-2-2">Header 2</a></li></ul></details></li></ul></div>`
  },
  {
    latex: "[[toc]]\n" +
      "\n" +
      "#### Header 4\n" +
      "\n" +
      "## Header 2\n" +
      "\n" +
      "### Header 3",
    html: `<div id="toc_container"><ul><li class="toc-title-4"><a href="#header-4" style="cursor: pointer; text-decoration: none;" class="toc-link" value="header-4">Header 4</a></li><li class="toc-title-2"><details><summary><a href="#header-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="header-2">Header 2</a></summary><ul><li class="toc-title-3"><a href="#header-3" style="cursor: pointer; text-decoration: none;" class="toc-link" value="header-3">Header 3</a></li></ul></details></li></ul></div>`
  },
  {
    latex: "[[toc]]\n" +
      "\n" +
      "#### Header 4\n" +
      "\n" +
      "## Header 2\n" +
      "\n" +
      "### Header 3\n" +
      "\n" +
      "\\subsubsection{Subsubsection}\n" +
      "\n" +
      "\\subsection{Subsection}\n" +
      "\n" +
      "\\section{Section}",
    html: `<div id="toc_container"><ul><li class="toc-title-4"><a href="#header-4" style="cursor: pointer; text-decoration: none;" class="toc-link" value="header-4">Header 4</a></li><li class="toc-title-2"><details><summary><a href="#header-2" style="cursor: pointer; text-decoration: none;" class="toc-link" value="header-2">Header 2</a></summary><ul><li class="toc-title-3"><details><summary><a href="#header-3" style="cursor: pointer; text-decoration: none;" class="toc-link" value="header-3">Header 3</a></summary><ul><li class="toc-title-4"><a href="#subsubsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsubsection">Subsubsection</a></li></ul></details></li><li class="toc-title-3"><a href="#subsection" style="cursor: pointer; text-decoration: none;" class="toc-link" value="subsection">Subsection</a></li></ul></details></li><li class="toc-title-2"><a href="#section" style="cursor: pointer; text-decoration: none;" class="toc-link" value="section">Section</a></li></ul></div>`
  }
];
