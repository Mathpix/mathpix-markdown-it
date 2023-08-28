module.exports = "\\footnote[5]{should be 5}\n" +
  "\\footnote{should be 1}\n" +
  "\\title{Title[^1]}\n" +
  "[^1]: footnote text\n" +
  "In Snip, You can use the `\\title{}` command wherever you want the title to appear in your document. If pasting LaTeX code into Snip, please note that the `\\maketitle` command will be ignored.\n" +
  "\n" +
  "\\author{Author[^1]}\n" +
  "\n" +
  "\\author{Author\\\\can also be\\\\multiline}\n" +
  "\n" +
  "\\author{\n" +
  "    First[^1]Last\\\\\n" +
  "    Department\\\\\n" +
  "    school\\\\\n" +
  "    email@edu\n" +
  "  \\and\n" +
  "    First Last[^1]\\\\\n" +
  "    ...\n" +
  "}\n" +
  "\\footnote{should be 3}\n" +
  "\n" +
  "\\begin{abstract}\n" +
  "[^1] footnote \n" +
  "This is the abstract to my paper. You are going to learn a lot in this paper, just you wait. I am going to tell you about all the different LaTeX and Markdown syntax you can use in Snip. \n" +
  "\\end{abstract}";
