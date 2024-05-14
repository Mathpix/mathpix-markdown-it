module.exports = "## Using Markdown in Snip \n" +
  "\n" +
  "Snip is a Markdown editor first, so you can use all standard Markdown syntax!\n" +
  "\n" +
  "# h1 Heading\n" +
  "## h2 Heading\n" +
  "### h3 Heading\n" +
  "#### h4 Heading\n" +
  "##### h5 Heading\n" +
  "###### h6 Heading\n" +
  "\n" +
  "**This is bold text**\n" +
  "\n" +
  "__This is also bold text__\n" +
  "\n" +
  "*This is italic text*\n" +
  "\n" +
  "_This is also italic text_\n" +
  "\n" +
  "~~Strikethrough~~\n" +
  "\n" +
  "==This is marked text==\n" +
  "\n" +
  "___\n" +
  "\n" +
  "---\n" +
  "\n" +
  "***\n" +
  "\n" +
  "(c) (C) (r) (R) (tm) (TM) (p) (P) +-\n" +
  "\n" +
  "test.. test... test..... test?..... test!....\n" +
  "\n" +
  "!!!!!! ???? ,,  -- ---\n" +
  "\n" +
  "### Quotes\n" +
  "\n" +
  "> Use a `>` to write a blockquote\n" +
  "\n" +
  "or\n" +
  "\n" +
  "> Blockquotes can also be nested...\n" +
  ">> ...by using additional `>` right next to each other...\n" +
  "> > > ...or with spaces between `>`.\n" +
  "\n" +
  "### Lists \n" +
  "\n" +
  "Create an unordered list by starting a line with \"+\", \"-\", or \"*\"\n" +
  "\n" +
  "+ Sub-lists are made by indenting 2 spaces:\n" +
  "  - Different characters in in the same sub-list will render the same characters:\n" +
  "    * Ac tristique libero volutpat at\n" +
  "    + Facilisis in pretium nisl aliquet\n" +
  "    - Nulla volutpat aliquam velit\n" +
  "+ Very easy!\n" +
  "\n" +
  "Create an ordered list by writing 1.\n" +
  "\n" +
  "1. Lorem ipsum dolor sit amet\n" +
  "2. Consectetur adipiscing elit\n" +
  "3. Integer molestie lorem at massa\n" +
  "\n" +
  "...\n" +
  "\n" +
  "1. You can use sequential numbers...\n" +
  "1. ...or keep all the numbers as 1.\n" +
  "\n" +
  "Or start your list with any number and the numbering will continue:\n" +
  "\n" +
  "57. foo\n" +
  "2. bar\n" +
  "6. foo\n" +
  "\n" +
  "### Code\n" +
  "\n" +
  "Wrap inline code `in single backticks`\n" +
  "\n" +
  "...or wrap code blocks in 3 backticks or 3 tildes\n" +
  "\n" +
  "```\n" +
  "var foo = function (bar) {\n" +
  "  return bar++;\n" +
  "};\n" +
  "```\n" +
  "\n" +
  "Include the programming language for syntax highlighting:\n" +
  "\n" +
  "~~~javascript\n" +
  "var foo = function (bar) {\n" +
  "  return bar++;\n" +
  "};\n" +
  "~~~ \n" +
  "\n" +
  "*All major languages supported via [highlight.js](https://highlightjs.org/).*\n" +
  "\n" +
  "You can also create a code block by indenting all lines: \n" +
  "\n" +
  "\t\\\\ some comments \n" +
  "\tline 1 of code \n" +
  "\tline 2 of code\n" +
  "\tline 3 of code\n" +
  "\n" +
  "### Tables\n" +
  "\n" +
  "Colons can be used to align columns:\n" +
  "\n" +
  "| Tables        | Are           | Cool  |\n" +
  "| :------------ |:-------------:| -----:|\n" +
  "| col 3 is      | right-aligned | $1600 |\n" +
  "| col 2 is      | centered      |   $12 |\n" +
  "| zebra stripes | are neat      |    $1 |\n" +
  "\n" +
  "There must be at least 3 dashes separating each header cell.\n" +
  "The outer pipes (|) are optional, and you don't need to make the raw Markdown line up prettily:\n" +
  "\n" +
  "Markdown | Less | Pretty\n" +
  "--- | --- | ---\n" +
  "*Still* | `renders` | **nicely**\n" +
  "1 | 2 | 3\n" +
  "\n" +
  "\n" +
  "### Links and images\n" +
  "\n" +
  "[This is a link to the Mathpix website](http://mathpix.com/)\n" +
  "\n" +
  "![Feynman Lecture 1](https://cdn.mathpix.com/snip/images/0Y13pkOem1h2kqhOPAB98mtSCL5FQlQPtot1obxd-R8.original.fullsize.png)\n" +
  "\n" +
  "Include text in quotes for a tooltip (hover over the image to see):\n" +
  "![Feynman Lecture 2](https://cdn.mathpix.com/snip/images/XDfl14ZxchxGUuOHzRSN7FcqMmLxknDndIo18jsMfk0.original.fullsize.png \"Michelson-Morley experiment\")\n" +
  "\n" +
  "### Footnotes\n" +
  "\n" +
  "You can write footnotes either by writing out \"first\", \"second\", \"third\", etc:\n" +
  "\n" +
  "Footnote 1 link[^first].\n" +
  "\n" +
  "Footnote reference[^second]\n" +
  "\n" +
  "And you can reference the same footnote again like this[^second]\n" +
  "\n" +
  "Or you can use numbers: \n" +
  "\n" +
  "This is my next footnote[^3] \n" +
  "\n" +
  "And another[^4]\n" +
  "\n" +
  "You can reference multiple footnotes in a row[^3][^4]\n" +
  "\n" +
  "You can also write inline footnotes:\n" +
  "\n" +
  "Inline footnote^[Text of inline footnote] definition.\n" +
  "\n" +
  "[^first]: Footnotes **can have markup**\n" +
  "\n" +
  "    and multiple paragraphs.\n" +
  "\n" +
  "[^second]: Footnote text.\n" +
  "\n" +
  "[^3]: Hello I am the third footote!\n" +
  "\n" +
  "[^4]: And I'm the 4th!\n" +
  "\n" +
  "\n" +
  "### Emojies\n" +
  "\n" +
  "Classic markup: :wink: :cry: :laughing: :yum:\n" +
  "\n" +
  "Shortcuts (emoticons): :-) :-( 8-) ;)\n" +
  "\n" +
  "\n" +
  "### Subscripts and Superscripts \n" +
  "\n" +
  "- 19^th^\n" +
  "- H~2~O\n" +
  "\n" +
  "---\n" +
  "---\n" +
  "\n" +
  "## Using HTML in Snip\n" +
  "\n" +
  "You can also use HTML tags in Snip. Here is an example of a header: \n" +
  "\n" +
  "<h2 style=\"color:blue;\">This is a Blue Heading</h2>\n" +
  "\n" +
  "You can also insert SVGs!\n" +
  "\n" +
  "<svg id=\"function random() { [native code] }\" xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" width=\"200px\" height=\"150px\" viewBox=\"0 0 200 150\">\\n\\t<style> #function random() { [native code] } {pointer-events:none; }  #function random() { [native code] } .event  { pointer-events:all;}  </style>\\n\\t<text x=\"136\" y=\"79\" font-family=\" Helvetica\" font-weight=\"900\" font-size=\"14\" fill=\"rgb(255,13,13)\">O</text>\\n\\t<text x=\"115\" y=\"43\" font-family=\" Helvetica\" font-weight=\"900\" font-size=\"14\" fill=\"rgb(255,13,13)\">O</text>\\n\\t<text x=\"126\" y=\"43\" font-family=\" Helvetica\" font-weight=\"900\" font-size=\"14\" fill=\"rgb(255,13,13)\">H</text>\\n\\t<text x=\"73\" y=\"42\" font-family=\" Helvetica\" font-weight=\"900\" font-size=\"14\" fill=\"rgb(255,13,13)\">O</text>\\n\\t<text x=\"84\" y=\"42\" font-family=\" Helvetica\" font-weight=\"900\" font-size=\"14\" fill=\"rgb(255,13,13)\">H</text>\\n\\t<line x1=\"118\" y1=\"64\" x2=\"134\" y2=\"72\" style=\"stroke:rgb(0,0,0);stroke-width:1\"/>\\n\\t<line x1=\"120\" y1=\"60\" x2=\"136\" y2=\"69\" style=\"stroke:rgb(0,0,0);stroke-width:1\"/>\\n\\t<line x1=\"79\" y1=\"63\" x2=\"100\" y2=\"75\" style=\"stroke:rgb(0,0,0);stroke-width:1\"/>\\n\\t<line x1=\"79\" y1=\"67\" x2=\"95\" y2=\"76\" style=\"stroke:rgb(0,0,0);stroke-width:1\"/>\\n\\t<line x1=\"58\" y1=\"99\" x2=\"58\" y2=\"74\" style=\"stroke:rgb(0,0,0);stroke-width:1\"/>\\n\\t<line x1=\"62\" y1=\"96\" x2=\"62\" y2=\"77\" style=\"stroke:rgb(0,0,0);stroke-width:1\"/>\\n\\t<line x1=\"99\" y1=\"99\" x2=\"79\" y2=\"111\" style=\"stroke:rgb(0,0,0);stroke-width:1\"/>\\n\\t<line x1=\"95\" y1=\"97\" x2=\"79\" y2=\"106\" style=\"stroke:rgb(0,0,0);stroke-width:1\"/>\\n\\t<line x1=\"120\" y1=\"46\" x2=\"120\" y2=\"63\" style=\"stroke:rgb(0,0,0);stroke-width:1\"/>\\n\\t<line x1=\"100\" y1=\"75\" x2=\"120\" y2=\"63\" style=\"stroke:rgb(0,0,0);stroke-width:1\"/>\\n\\t<line x1=\"79\" y1=\"45\" x2=\"79\" y2=\"63\" style=\"stroke:rgb(0,0,0);stroke-width:1\"/>\\n\\t<line x1=\"58\" y1=\"74\" x2=\"79\" y2=\"63\" style=\"stroke:rgb(0,0,0);stroke-width:1\"/>\\n\\t<line x1=\"79\" y1=\"111\" x2=\"58\" y2=\"99\" style=\"stroke:rgb(0,0,0);stroke-width:1\"/>\\n\\t<line x1=\"99\" y1=\"99\" x2=\"100\" y2=\"75\" style=\"stroke:rgb(0,0,0);stroke-width:1\"/>\\n\\t<line id=\"function random() { [native code] }:Bond:1-0\" class=\"event\" x1=\"120\" y1=\"63\" x2=\"141\" y2=\"75\" stroke-width=\"8\" stroke-opacity=\"0\"/>\\n\\t<line id=\"function random() { [native code] }:Bond:4-3\" class=\"event\" x1=\"79\" y1=\"63\" x2=\"100\" y2=\"75\" stroke-width=\"8\" stroke-opacity=\"0\"/>\\n\\t<line id=\"function random() { [native code] }:Bond:7-6\" class=\"event\" x1=\"58\" y1=\"99\" x2=\"58\" y2=\"74\" stroke-width=\"8\" stroke-opacity=\"0\"/>\\n\\t<line id=\"function random() { [native code] }:Bond:9-8\" class=\"event\" x1=\"99\" y1=\"99\" x2=\"79\" y2=\"111\" stroke-width=\"8\" stroke-opacity=\"0\"/>\\n\\t<line id=\"function random() { [native code] }:Bond:2-1\" class=\"event\" x1=\"120\" y1=\"39\" x2=\"120\" y2=\"63\" stroke-width=\"8\" stroke-opacity=\"0\"/>\\n\\t<line id=\"function random() { [native code] }:Bond:3-1\" class=\"event\" x1=\"100\" y1=\"75\" x2=\"120\" y2=\"63\" stroke-width=\"8\" stroke-opacity=\"0\"/>\\n\\t<line id=\"function random() { [native code] }:Bond:5-4\" class=\"event\" x1=\"79\" y1=\"38\" x2=\"79\" y2=\"63\" stroke-width=\"8\" stroke-opacity=\"0\"/>\\n\\t<line id=\"function random() { [native code] }:Bond:6-4\" class=\"event\" x1=\"58\" y1=\"74\" x2=\"79\" y2=\"63\" stroke-width=\"8\" stroke-opacity=\"0\"/>\\n\\t<line id=\"function random() { [native code] }:Bond:8-7\" class=\"event\" x1=\"79\" y1=\"111\" x2=\"58\" y2=\"99\" stroke-width=\"8\" stroke-opacity=\"0\"/>\\n\\t<line id=\"function random() { [native code] }:Bond:9-3\" class=\"event\" x1=\"99\" y1=\"99\" x2=\"100\" y2=\"75\" stroke-width=\"8\" stroke-opacity=\"0\"/>\\n\\t<circle id=\"function random() { [native code] }:Atom:0\" class=\"event\" cx=\"141\" cy=\"75\" r=\"8\" fill-opacity=\"0\"/>\\n\\t<circle id=\"function random() { [native code] }:Atom:1\" class=\"event\" cx=\"120\" cy=\"63\" r=\"8\" fill-opacity=\"0\"/>\\n\\t<circle id=\"function random() { [native code] }:Atom:2\" class=\"event\" cx=\"120\" cy=\"39\" r=\"8\" fill-opacity=\"0\"/>\\n\\t<circle id=\"function random() { [native code] }:Atom:3\" class=\"event\" cx=\"100\" cy=\"75\" r=\"8\" fill-opacity=\"0\"/>\\n\\t<circle id=\"function random() { [native code] }:Atom:4\" class=\"event\" cx=\"79\" cy=\"63\" r=\"8\" fill-opacity=\"0\"/>\\n\\t<circle id=\"function random() { [native code] }:Atom:5\" class=\"event\" cx=\"79\" cy=\"38\" r=\"8\" fill-opacity=\"0\"/>\\n\\t<circle id=\"function random() { [native code] }:Atom:6\" class=\"event\" cx=\"58\" cy=\"74\" r=\"8\" fill-opacity=\"0\"/>\\n\\t<circle id=\"function random() { [native code] }:Atom:7\" class=\"event\" cx=\"58\" cy=\"99\" r=\"8\" fill-opacity=\"0\"/>\\n\\t<circle id=\"function random() { [native code] }:Atom:8\" class=\"event\" cx=\"79\" cy=\"111\" r=\"8\" fill-opacity=\"0\"/>\\n\\t<circle id=\"function random() { [native code] }:Atom:9\" class=\"event\" cx=\"99\" cy=\"99\" r=\"8\" fill-opacity=\"0\"/>\\n</svg>\t\n" +
  "\n" +
  "\n" +
  "\\title{Using Latex}\n" +
  "\n" +
  "\\title{Title}\n" +
  "\n" +
  "\\author{Author}\n" +
  "\n" +
  "\\author{Author\\\\can also be\\\\multiline}\n" +
  "\n" +
  "\\begin{abstract}\n" +
  "This is the abstract to my paper. You are going to learn a lot in this paper, just you wait. I am going to tell you about all the different LaTeX and Markdown syntax you can use in Snip. \n" +
  "\\end{abstract}\n" +
  "\n" +
  "\\section{My great section}\n" +
  "\n" +
  "\\subsection{My really great subsection}\n" +
  "\n" +
  "\\subsubsection{My really great subsubsection}\n" +
  "\n" +
  "\\section*{My great section}\n" +
  "\n" +
  "\\subsection*{My really great subsection}\n" +
  "\n" +
  "\\subsubsection*{My really great subsubsection}\n" +
  "\n" +
  "\\textit{This is italic text}\n" +
  "\n" +
  "\\textbf{This is bold text}\n" +
  "\n" +
  "\\textbf{\\textit{This is bold italic text}}\n" +
  "\n" +
  "\\texttt{This is code text}\n" +
  "\n" +
  "\\text{This is text}\n" +
  "\n" +
  "\\underline{This is underline text}\n" +
  "\n" +
  "\\underline{\\textbf{This is underline bold text}}\n" +
  "\n" +
  "\\uline{This is underline text}\n" +
  "\n" +
  "\\uline{\\textit{This is underline italic text}}\n" +
  "\n" +
  "\\uuline{This is double underline text}\n" +
  "\n" +
  "\\uwave{This is wave underline text}\n" +
  "\n" +
  "\\dashuline{This is dash underline text}\n" +
  "\n" +
  "\\dotuline{This is dot underline text}\n" +
  "\n" +
  "\\sout{Strikethrough}\n" +
  "\n" +
  "\\xout{Strikethrough}\n" +
  "\n" +
  "Some text with dotfill \\dotfill\n" +
  "\n" +
  "\\textasciicircum \\textless \\textasciitilde \\textordfeminine \\textasteriskcentered \\textordmasculine \\textbackslash \\textparagraph \\textbar \\textperiodcentered \\textbraceleft \\textquestiondown \\textbraceright \\textquotedblleft \\textbullet \\textquotedblright \\textcopyright \\textquoteleft \\textdagger \\textquoteright \\textdaggerdbl \\textregistered \\textdollar \\textsection \\textellipsis \\ldots \\textsterling \\textemdash \\texttrademark \\textendash \\textunderscore \\textexclamdown \\textvisiblespace \\textgreater \\pounds\n" +
  "\n" +
  "\\pagebreak\n" +
  "\n" +
  "\\clearpage\n" +
  "\n" +
  "\\newpage\n" +
  "\n" +
  "Inline math $\\vec { F } = m \\vec { a }$ and this \\(ax^2 + bx + c = 0\\)\n" +
  "\n" +
  "$$\n" +
  "x = \\frac { - b \\pm \\sqrt { b ^ { 2 } - 4 a c } } { 2 a }\n" +
  "$$\n" +
  "\n" +
  "\\[\n" +
  "y = \\frac { \\sum _ { i } w _ { i } y _ { i } } { \\sum _ { i } w _ { i } } , i = 1,2 \\ldots k\n" +
  "\\]\n" +
  "\n" +
  "\\begin{equation*}\n" +
  "l ( \\theta ) = \\sum _ { i = 1 } ^ { m } \\log p ( x , \\theta )\n" +
  "\\end{equation*}\n" +
  "\n" +
  "\\begin{align*}\n" +
  "t _ { 1 } + t _ { 2 } = \\frac { ( 2 L / c ) \\sqrt { 1 - u ^ { 2 } / c ^ { 2 } } } { 1 - u ^ { 2 } / c ^ { 2 } } = \\frac { 2 L / c } { \\sqrt { 1 - u ^ { 2 } / c ^ { 2 } } }\n" +
  "\\end{align*}\n" +
  "\n" +
  "\\begin{equation}\n" +
  "m = \\frac { m _ { 0 } } { \\sqrt { 1 - v ^ { 2 } / c ^ { 2 } } }\n" +
  "\\end{equation}\n" +
  "\n" +
  "\\begin{align}\n" +
  "^{|\\alpha|} \\sqrt{x^{\\alpha}} \\leq(x \\bullet \\alpha) /|\\alpha|\n" +
  "\\end{align}\n" +
  "\n" +
  "In equation \\eqref{eq:1}, we find the value of an\n" +
  "interesting integral:\n" +
  "\n" +
  "\\begin{equation}\n" +
  "  \\int_0^\\infty \\frac{x^3}{e^x-1}\\,dx = \\frac{\\pi^4}{15}\n" +
  "  \\label{eq:1}\n" +
  "\\end{equation}\n" +
  "\n" +
  "\\begin{equation}\n" +
  "  \\| x + y \\| \\geq | \\| x | | - \\| y \\| |\n" +
  "  \\label{eq:2}\n" +
  "\\end{equation}\n" +
  "\n" +
  "$$\n" +
  "\\frac{x\\left(x^{2 n}-x^{-2 n}\\right)}{x^{2 n}+x^{-2 n}}\n" +
  "\\tag{1.1}\n" +
  "$$\n" +
  "\n" +
  "\\begin{equation}\n" +
  "\\max _{\\theta} \\mathbb{E}_{\\mathbf{z} \\sim \\mathcal{Z}_{T}}\\left[\\sum_{t=1}^{T} \\log p_{\\theta}\\left(x_{z_{t}} | \\mathbf{x}_{\\mathbf{z}_{<t}}\\right)\\right]\n" +
  "\\tag{1.2}\n" +
  "\\end{equation}\n" +
  "\n" +
  "Look at the Equation \\ref{eq:2} \n" +
  "Ref in math mode $\\ref{eq:2}$\n" +
  "\n" +
  "\\begin{split}\n" +
  "a& =b+c-d\\\\\n" +
  "& \\quad +e-f\\\\\n" +
  "& =g+h\\\\\n" +
  "& =i\n" +
  "\\end{split}\n" +
  "\n" +
  "\\begin{gather}\n" +
  "a_1=b_1+c_1\\\\\n" +
  "a_2=b_2+c_2-d_2+e_2\n" +
  "\\end{gather}\n" +
  "\n" +
  "\\begin{gather*}\n" +
  "a_1=b_1+c_1\\\\\n" +
  "a_2=b_2+c_2-d_2+e_2\n" +
  "\\end{gather*}\n" +
  "\n" +
  "Use `\\url{}` to insert a \\url{link}.\n" +
  "\n" +
  "\\begin{table}[h!]\n" +
  "\\centering\n" +
  "\\begin{tabular}{||c c c c||}\n" +
  "\\hline\n" +
  "Col1 & Col2 & Col2 & Col3 \\\\ [0.5ex]\n" +
  "\\hline\\hline\n" +
  "1 & 6 & 87837 & 787 \\\\\n" +
  "2 & 7 & 78 & 5415 \\\\\n" +
  "3 & 545 & 778 & 7507 \\\\\n" +
  "4 & 545 & 18744 & 7560 \\\\\n" +
  "5 & 88 & 788 & 6344 \\\\ [1ex]\n" +
  "\\hline\n" +
  "\\end{tabular}\n" +
  "\\end{table}\n" +
  "\n" +
  "The table \\ref{table:1} is an example of referenced \\LaTeX elements.\n" +
  "\n" +
  "\\begin{table}[h!]\n" +
  "\\centering\n" +
  "\\begin{tabular}{||c c c c||}\n" +
  "\\hline\n" +
  "Col1 & Col2 & Col2 & Col3 \\\\ [0.5ex]\n" +
  "\\hline\\hline\n" +
  "1 & 6 & 87837 & 787 \\\\\n" +
  "2 & 7 & 78 & 5415 \\\\\n" +
  "3 & 545 & 778 & 7507 \\\\\n" +
  "4 & 545 & 18744 & 7560 \\\\\n" +
  "5 & 88 & 788 & 6344 \\\\ [1ex]\n" +
  "\\hline\n" +
  "\\end{tabular}\n" +
  "\\caption{Table to test captions and labels}\n" +
  "\\label{table:1}\n" +
  "\\end{table}\n" +
  "\n" +
  "The figure \\ref{fig:figure1}\n" +
  "\n" +
  "\\begin{figure}\n" +
  "\\includegraphics[width=350px, height=70px, right]{https://cdn.mathpix.com/snip/images/-HM3WXo8kgdk8VtayBtn1_pJlgq9Cb7qV4JtM47Hgn0.original.fullsize.png}\n" +
  "\\caption{Equation}\n" +
  "\\label{fig:figure1}\n" +
  "\\end{figure}\n" +
  "\n" +
  "\\begin{itemize}\n" +
  "  \\item  Default item label for entry one\n" +
  "  \\item  Default item label for entry two\n" +
  "  \\item[$\\square$]  Custom item label for entry three\n" +
  "\\end{itemize}\n" +
  "\n" +
  "\\renewcommand{\\labelenumii}{\\Roman{enumii}}\n" +
  " \\begin{enumerate}\n" +
  "   \\item First level item\n" +
  "   \\item First level item\n" +
  "   \\begin{enumerate}\n" +
  "     \\setcounter{enumii}{4}\n" +
  "     \\item Second level item\n" +
  "     \\item Second level item\n" +
  "       \\begin{enumerate}\n" +
  "       \\item Third level item\n" +
  "       \\item Third level item\n" +
  "         \\begin{enumerate}\n" +
  "         \\item Fourth level item\n" +
  "         \\item Fourth level item\n" +
  "       \\end{enumerate}\n" +
  "     \\end{enumerate}\n" +
  "   \\end{enumerate}\n" +
  " \\end{enumerate}\n" +
  "\n" +
  "\\newtheorem{theorem}{Theorem}\n" +
  "\\newtheorem{theorem}{Theorem}[section]\n" +
  "\\newtheorem{lemma}[theorem]{Lemma}\n" +
  "\n" +
  "\\section{Introduction}\n" +
  "Theorems can easily be defined:\n" +
  "\n" +
  "\\begin{theorem}\n" +
  "Let \\(f\\) be a function whose derivative exists in every point, then \\(f\\) \n" +
  "is a continuous function.\n" +
  "\\end{theorem}\n" +
  "\n" +
  "\\setcounter{theorem}{0}\n" +
  "\n" +
  "\\begin{theorem}\n" +
  "Let \\(f\\) be a function whose derivative exists in every point, then \\(f\\) \n" +
  "is a continuous function.\n" +
  "\\end{theorem}\n" +
  "\n" +
  "\\setcounter{theorem}{-3}\n" +
  "\n" +
  "\\begin{theorem}\n" +
  "Let \\(f\\) be a function whose derivative exists in every point, then \\(f\\) \n" +
  "is a continuous function.\n" +
  "\\end{theorem}\n" +
  "\n" +
  "\\section{Introduction}\n" +
  "\n" +
  "\\begin{lemma}\n" +
  "Given two line segments whose lengths are \\(a\\) and \\(b\\) respectively there \n" +
  "is a real number \\(r\\) such that \\(b=ra\\).\n" +
  "\\end{lemma}\n" +
  "\n" +
  "\\renewcommand\\qedsymbol{$\\blacksquare$}\n" +
  "\n" +
  "\\begin{proof}\n" +
  "To prove it by contradiction try and assume that the statement is false,\n" +
  "proceed from there and at some point you will arrive to a contradiction.\n" +
  "\\end{proof}\n" +
  "\n" +
  "\\renewcommand\\qedsymbol{QED}\n" +
  "\n" +
  "\\begin{proof}\n" +
  "To prove it by contradiction try and assume that the statement is false,\n" +
  "proceed from there and at some point you will arrive to a contradiction.\n" +
  "\\end{proof}\n" +
  "\n" +
  "Automatically-generated footnote marker 1 \\footnote{First footnote should be 1}.\n" +
  "\n" +
  "Footnote marker set to 11 \\footnote[11]{First footnote should be 11}.\n" +
  "\n" +
  "Automatically-generated footnote marker 2 \\footnote{First footnote should be 2}.\n" +
  "\n" +
  "Automatically-generated footnote marker 3 \\footnotemark{} \\footnotetext{Text of footnote with marker 3.}\n" +
  "\n" +
  "Automatically-generated footnote markers 4 \\footnotemark{}, 5\\footnotemark{}\n" +
  "\n" +
  "Marker set to 20 \\footnotemark[20]{} \\footnotetext{Text of last footnote marker}\n" +
  "\\footnotetext[20]{Text of footnote with marker 20}\n" +
  "\\footnotetext{Text of last footnote marker}\n" +
  "\n" +
  "\\footnotetext[20]{Text of footnote with marker 20}\n" +
  "\\footnote{First footnote should be 1}.\n" +
  "\\footnotetext{Text of last footnote marker}\n" +
  "\\footnotetext{Text of last footnote marker}\n" +
  "\n" +
  "\\footnotetext[20]{Text of footnote with marker 20}\n" +
  "\n" +
  "\\blfootnotetext{\n" +
  "\\({ }^{0}\\) Compared to V1, this draft includes better baselines, experiments on GLUE, and more on adapter latency.\n" +
  "}\n" +
  "\n" +
  "\\footnotetext{\n" +
  "\\({ }^{0}\\) Compared to V1, this draft includes better baselines, experiments on GLUE, and more on adapter latency.\n" +
  "}\n" +
  "\n" +
  "\\footnotetext{\n" +
  "\\({ }^{1}\\) While GPT-3 175B achieves non-trivial performance with few-shot learning, fine-tuning boosts its performance significantly as shown in Appendix A\n" +
  "}\n" +
  "\n" +
  "\\footnotetext[]{ While GPT-3 175B achieves non-trivial performance with few-shot learning, fine-tuning boosts its performance significantly as shown in Appendix A\n" +
  "}\n" +
  "\n" +
  "\\footnotetext[0]{ While GPT-3 175B achieves non-trivial performance with few-shot learning, fine-tuning boosts its performance significantly as shown in Appendix A\n" +
  "}\n" +
  "\n" +
  "\\footnote{}\n" +
  "\n" +
  "\\footnotetext[]{ While GPT-3 175B achieves non-trivial performance with few-shot learning, fine-tuning boosts its performance significantly as shown in Appendix A\n" +
  "}\n" +
  "\n" +
  "\\footnotetext[0]{ While GPT-3 175B achieves non-trivial performance with few-shot learning, fine-tuning boosts its performance significantly as shown in Appendix A\n" +
  "}\n" +
  "\n" +
  "<smiles>O=C1OC(=O)C2C(=O)C3CC=CCC3C(=O)C12</smiles>\n" +
  "\n" +
  "```smiles\n" +
  "O=C1OC(=O)C2C(=O)C3CC=CCC3C(=O)C12\n" +
  "```\n" +
  "\n" +
  "<ascii>sin ((4)/(3sin ((4)/(3)x)))</ascii>\n" +
  "\n" +
  "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\">\n" +
  "  <mtable displaystyle=\"true\">\n" +
  "    <mlabeledtr>\n" +
  "      <mtd id=\"mjx-eqn-eq:1\">\n" +
  "        <mtext>(3)</mtext>\n" +
  "      </mtd>\n" +
  "      <mtd>\n" +
  "        <msubsup>\n" +
  "          <mo data-mjx-texclass=\"OP\">∫</mo>\n" +
  "          <mn>0</mn>\n" +
  "          <mi mathvariant=\"normal\">∞</mi>\n" +
  "        </msubsup>\n" +
  "        <mfrac>\n" +
  "          <msup>\n" +
  "            <mi>x</mi>\n" +
  "            <mn>3</mn>\n" +
  "          </msup>\n" +
  "          <mrow>\n" +
  "            <msup>\n" +
  "              <mi>e</mi>\n" +
  "              <mi>x</mi>\n" +
  "            </msup>\n" +
  "            <mo>−</mo>\n" +
  "            <mn>1</mn>\n" +
  "          </mrow>\n" +
  "        </mfrac>\n" +
  "        <mstyle scriptlevel=\"0\">\n" +
  "          <mspace width=\"thinmathspace\"></mspace>\n" +
  "        </mstyle>\n" +
  "        <mi>d</mi>\n" +
  "        <mi>x</mi>\n" +
  "        <mo>=</mo>\n" +
  "        <mfrac>\n" +
  "          <msup>\n" +
  "            <mi>π</mi>\n" +
  "            <mn>4</mn>\n" +
  "          </msup>\n" +
  "          <mn>15</mn>\n" +
  "        </mfrac>\n" +
  "      </mtd>\n" +
  "    </mlabeledtr>\n" +
  "  </mtable>\n" +
  "</math>";