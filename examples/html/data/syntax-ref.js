const text = '\\title{Welcome to the Snip Editor!}\n' +
  '\n' +
  'The Snip editor uses a combination of Markdown and LaTeX syntax, what we call **LaTeX flavored Markdown** or **.mdl**, to create a great writing experience for technical documents. \n' +
  '\n' +
  'This means that you can use all the standard **Markdown syntax** in addition to some **LaTeX features** that we will list below. \n' +
  '\n' +
  '---\n' +
  '---\n' +
  '\n' +
  '## Using Math mode LaTeX in Snip\n' +
  '\n' +
  'You can insert inline mathematics using LaTeX delimiters `$...$` or `\\(...\\)` like this $\\vec { F } = m \\vec { a }$ and this \\(ax^2 + bx + c = 0\\).\n' +
  '\n' +
  'You can insert non-numbered block mode mathematics by using the LaTeX delimiters `$$...$$`, `\\[...\\]`, `\\begin{equation*}...\\end{equation*}`, and `\\begin{align*}...\\end{align*}`:\n' +
  '\n' +
  '$$\n' +
  'x = \\frac { - b \\pm \\sqrt { b ^ { 2 } - 4 a c } } { 2 a }\n' +
  '$$\n' +
  '\n' +
  '\\[\n' +
  'y = \\frac { \\sum _ { i } w _ { i } y _ { i } } { \\sum _ { i } w _ { i } } , i = 1,2 \\ldots k\n' +
  '\\]\n' +
  '\n' +
  '\\begin{equation*}\n' +
  'l ( \\theta ) = \\sum _ { i = 1 } ^ { m } \\log p ( x , \\theta )\n' +
  '\\end{equation*}\n' +
  '\n' +
  '\\begin{align*}\n' +
  't _ { 1 } + t _ { 2 } = \\frac { ( 2 L / c ) \\sqrt { 1 - u ^ { 2 } / c ^ { 2 } } } { 1 - u ^ { 2 } / c ^ { 2 } } = \\frac { 2 L / c } { \\sqrt { 1 - u ^ { 2 } / c ^ { 2 } } }\n' +
  '\\end{align*}\n' +
  '\n' +
  '\n' +
  'You can insert numbered block mode mathematics by using the LaTeX delimiters `\\begin{equation}...\\end{equation}` and `\\begin{align}...\\end{align}`:\n' +
  '\n' +
  '\\begin{equation}\n' +
  'm = \\frac { m _ { 0 } } { \\sqrt { 1 - v ^ { 2 } / c ^ { 2 } } }\n' +
  '\\end{equation}\n' +
  '\n' +
  '\\begin{align}\n' +
  '^{|\\alpha|} \\sqrt{x^{\\alpha}} \\leq(x \\bullet \\alpha) /|\\alpha|\n' +
  '\\end{align}\n' +
  '\n' +
  '\n' +
  '### Use `\\label{}` and `\\ref{}` or `\\eqref{}` to link to any numbered equation in your document \n' +
  '\n' +
  'In equation \\eqref{eq:1}, we find the value of an\n' +
  'interesting integral:\n' +
  '\n' +
  '\\begin{equation}\n' +
  '  \\int_0^\\infty \\frac{x^3}{e^x-1}\\,dx = \\frac{\\pi^4}{15}\n' +
  '  \\label{eq:1}\n' +
  '\\end{equation}\n' +
  '\n' +
  '\\begin{equation}\n' +
  '  \\| x + y \\| \\geq | \\| x | | - \\| y \\| |\n' +
  '  \\label{eq:2}\n' +
  '\\end{equation}\n' +
  '\n' +
  'Look at the Equation \\ref{eq:2}\n' +
  '\n' +
  '### Use `\\tag{}` to create a custom tag for your equation\n' +
  '\n' +
  'In addition to using numbered block mode equation syntax for standard numbering (ie. 1, 2, 3), you can use also include `\\tag{}` inside of your LaTeX delimiters to create a custom tag. Note that if `\\tag{}` is used in a numbered equation, it will override the document\'s numbering.\n' +
  '\n' +
  '$$\n' +
  '\\frac{x\\left(x^{2 n}-x^{-2 n}\\right)}{x^{2 n}+x^{-2 n}}\n' +
  '\\tag{1.1}\n' +
  '$$\n' +
  '\n' +
  '\\begin{equation}\n' +
  '\\max _{\\theta} \\mathbb{E}_{\\mathbf{z} \\sim \\mathcal{Z}_{T}}\\left[\\sum_{t=1}^{T} \\log p_{\\theta}\\left(x_{z_{t}} | \\mathbf{x}_{\\mathbf{z}_{<t}}\\right)\\right]\n' +
  '\\tag{1.2}\n' +
  '\\end{equation}\n' +
  '\n' +
  '### Other math mode LaTeX environments supported\n' +
  '\n' +
  'Snip also supports some less common math mode LaTeX environments, such as: \n' +
  '\n' +
  '`\\begin{split}...\\end{split}` to split your equation into smaller pieces: \n' +
  '\n' +
  '\\begin{split}\n' +
  'a& =b+c-d\\\\\n' +
  '& \\quad +e-f\\\\\n' +
  '& =g+h\\\\\n' +
  '& =i\n' +
  '\\end{split}\n' +
  '\n' +
  '- Use `\\\\` to denote a new line and `&` to denote where the lines should align.\n' +
  '- Need it numbered? Wrap it in `\\begin{equation}...\\end{equation}`\n' +
  '\n' +
  '`\\begin{gather}...\\end{gather}` for displaying a set of consecutive equations that don\'t require special alignment and `\\begin{gather*}...\\end{gather*}` if you don\'t want equation numbering: \n' +
  '\n' +
  '\\begin{gather}\n' +
  'a_1=b_1+c_1\\\\\n' +
  'a_2=b_2+c_2-d_2+e_2\n' +
  '\\end{gather}\n' +
  '\n' +
  '\\begin{gather*}\n' +
  'a_1=b_1+c_1\\\\\n' +
  'a_2=b_2+c_2-d_2+e_2\n' +
  '\\end{gather*}\n' +
  '\n' +
  '---\n' +
  '---\n' +
  '\n' +
  '## Using Text mode LaTeX in Snip \n' +
  '\n' +
  'Our LaTeX Flavored Markdown includes support for many standard text mode LaTeX commands that Markdown editors do not support. \n' +
  '\n' +
  '\\title{Title}\n' +
  '\n' +
  'In Snip, You can use the `\\title{}` command wherever you want the title to appear in your document. If pasting LaTeX code into Snip, please note that the `\\maketitle` command will be ignored.\n' +
  '\n' +
  '\\author{Author}\n' +
  '\n' +
  '\\author{Author\\\\can also be\\\\multiline}\n' +
  '\n' +
  '\\begin{abstract}\n' +
  'This is the abstract to my paper. You are going to learn a lot in this paper, just you wait. I am going to tell you about all the different LaTeX and Markdown syntax you can use in Snip. \n' +
  '\\end{abstract}\n' +
  '\n' +
  '\\section{My great section}\n' +
  '\n' +
  '\\subsection{My really great subsection}\n' +
  '\n' +
  '\n' +
  'You can use LaTeX commands for \\textit{italicizing...}\n' +
  '\n' +
  '...and for \\textbf{bolding}\n' +
  '\n' +
  'Use ' + '`' + '\\url{}' + '`' + ' to insert a \\url{link}.\n' +
  '\n' +
  '---\n' +
  '---\n' +
  '\n' +
  '## Using Markdown in Snip \n' +
  '\n' +
  'Snip is a Markdown editor first, so you can use all standard Markdown syntax!\n' +
  '\n' +
  '# h1 Heading\n' +
  '## h2 Heading\n' +
  '### h3 Heading\n' +
  '#### h4 Heading\n' +
  '##### h5 Heading\n' +
  '###### h6 Heading\n' +
  '\n' +
  '**This is bold text**\n' +
  '\n' +
  '__This is also bold text__\n' +
  '\n' +
  '*This is italic text*\n' +
  '\n' +
  '_This is also italic text_\n' +
  '\n' +
  '~~Strikethrough~~\n' +
  '\n' +
  '==This is marked text==\n' +
  '\n' +
  '___\n' +
  '\n' +
  '---\n' +
  '\n' +
  '***\n' +
  '\n' +
  '(c) (C) (r) (R) (tm) (TM) (p) (P) +-\n' +
  '\n' +
  'test.. test... test..... test?..... test!....\n' +
  '\n' +
  '!!!!!! ???? ,,  -- ---\n' +
  '\n' +
  '### Quotes\n' +
  '\n' +
  '> Use a `>` to write a blockquote\n' +
  '\n' +
  'or\n' +
  '\n' +
  '> Blockquotes can also be nested...\n' +
  '>> ...by using additional `>` right next to each other...\n' +
  '> > > ...or with spaces between `>`.\n' +
  '\n' +
  '### Lists \n' +
  '\n' +
  'Create an unordered list by starting a line with "+", "-", or "*"\n' +
  '\n' +
  '+ Sub-lists are made by indenting 2 spaces:\n' +
  '  - Different characters in in the same sub-list will render the same characters:\n' +
  '    * Ac tristique libero volutpat at\n' +
  '    + Facilisis in pretium nisl aliquet\n' +
  '    - Nulla volutpat aliquam velit\n' +
  '+ Very easy!\n' +
  '\n' +
  'Create an ordered list by writing 1.\n' +
  '\n' +
  '1. Lorem ipsum dolor sit amet\n' +
  '2. Consectetur adipiscing elit\n' +
  '3. Integer molestie lorem at massa\n' +
  '\n' +
  '...\n' +
  '\n' +
  '1. You can use sequential numbers...\n' +
  '1. ...or keep all the numbers as 1.\n' +
  '\n' +
  'Or start your list with any number and the numbering will continue:\n' +
  '\n' +
  '57. foo\n' +
  '2. bar\n' +
  '6. foo\n' +
  '\n' +
  '### Code\n' +
  '\n' +
  'Wrap inline code `in single backticks`\n' +
  '\n' +
  '...or wrap code blocks in 3 backticks or 3 tildes\n' +
  '\n' +
  '```\n' +
  'var foo = function (bar) {\n' +
  '  return bar++;\n' +
  '};\n' +
  '```\n' +
  '\n' +
  'Include the programming language for syntax highlighting:\n' +
  '\n' +
  '~~~javascript\n' +
  'var foo = function (bar) {\n' +
  '  return bar++;\n' +
  '};\n' +
  '~~~ \n' +
  '\n' +
  '*All major languages supported via [highlight.js](https://highlightjs.org/).*\n' +
  '\n' +
  'You can also create a code block by indenting all lines: \n' +
  '\n' +
  '\t\\\\ some comments \n' +
  '\tline 1 of code \n' +
  '\tline 2 of code\n' +
  '\tline 3 of code\n' +
  '\n' +
  '### Tables\n' +
  '\n' +
  'Colons can be used to align columns:\n' +
  '\n' +
  '| Tables        | Are           | Cool  |\n' +
  '| :------------ |:-------------:| -----:|\n' +
  '| col 3 is      | right-aligned | $1600 |\n' +
  '| col 2 is      | centered      |   $12 |\n' +
  '| zebra stripes | are neat      |    $1 |\n' +
  '\n' +
  'There must be at least 3 dashes separating each header cell.\n' +
  'The outer pipes (|) are optional, and you don\'t need to make the raw Markdown line up prettily:\n' +
  '\n' +
  'Markdown | Less | Pretty\n' +
  '--- | --- | ---\n' +
  '*Still* | `renders` | **nicely**\n' +
  '1 | 2 | 3\n' +
  '\n' +
  '\n' +
  '### Links and images\n' +
  '\n' +
  '[This is a link to the Mathpix website](http://mathpix.com/)\n' +
  '\n' +
  '![Feynman Lecture 1](https://cdn.mathpix.com/snip/images/0Y13pkOem1h2kqhOPAB98mtSCL5FQlQPtot1obxd-R8.original.fullsize.png)\n' +
  '\n' +
  'Include text in quotes for a tooltip (hover over the image to see):\n' +
  '![Feynman Lecture 2](https://cdn.mathpix.com/snip/images/XDfl14ZxchxGUuOHzRSN7FcqMmLxknDndIo18jsMfk0.original.fullsize.png "Michelson-Morley experiment")\n' +
  '\n' +
  '### Footnotes\n' +
  '\n' +
  'You can write footnotes either by writing out "first", "second", "third", etc:\n' +
  '\n' +
  'Footnote 1 link[^first].\n' +
  '\n' +
  'Footnote reference[^second]\n' +
  '\n' +
  'And you can reference the same footnote again like this[^second]\n' +
  '\n' +
  'Or you can use numbers: \n' +
  '\n' +
  'This is my next footnote[^3] \n' +
  '\n' +
  'And another[^4]\n' +
  '\n' +
  'You can reference multiple footnotes in a row[^3][^4]\n' +
  '\n' +
  'You can also write inline footnotes:\n' +
  '\n' +
  'Inline footnote^[Text of inline footnote] definition.\n' +
  '\n' +
  '[^first]: Footnotes **can have markup**\n' +
  '\n' +
  '    and multiple paragraphs.\n' +
  '\n' +
  '[^second]: Footnote text.\n' +
  '\n' +
  '[^3]: Hello I am the third footote!\n' +
  '\n' +
  '[^4]: And I\'m the 4th!\n' +
  '\n' +
  '\n' +
  '### Emojies\n' +
  '\n' +
  'Classic markup: :wink: :cry: :laughing: :yum:\n' +
  '\n' +
  'Shortcuts (emoticons): :-) :-( 8-) ;)\n' +
  '\n' +
  '\n' +
  '### Subscripts and Superscripts \n' +
  '\n' +
  '- 19^th^\n' +
  '- H~2~O\n' +
  '\n' +
  '---\n' +
  '---\n' +
  '\n' +
  '## Using HTML in Snip\n' +
  '\n' +
  'You can also use HTML tags in Snip. Here is an example of a header: \n' +
  '\n' +
  '<h2 style="color:blue;">This is a Blue Heading</h1>\n' +
  '\n' +
  'You can also insert SVGs!\n' +
  '\n' +
  '<svg id="function random() { [native code] }" xmlns="http://www.w3.org/2000/svg" version="1.1" width="200px" height="150px" viewBox="0 0 200 150">\\n\\t<style> #function random() { [native code] } {pointer-events:none; }  #function random() { [native code] } .event  { pointer-events:all;}  </style>\\n\\t<text x="136" y="79" font-family=" Helvetica" font-weight="900" font-size="14" fill="rgb(255,13,13)">O</text>\\n\\t<text x="115" y="43" font-family=" Helvetica" font-weight="900" font-size="14" fill="rgb(255,13,13)">O</text>\\n\\t<text x="126" y="43" font-family=" Helvetica" font-weight="900" font-size="14" fill="rgb(255,13,13)">H</text>\\n\\t<text x="73" y="42" font-family=" Helvetica" font-weight="900" font-size="14" fill="rgb(255,13,13)">O</text>\\n\\t<text x="84" y="42" font-family=" Helvetica" font-weight="900" font-size="14" fill="rgb(255,13,13)">H</text>\\n\\t<line x1="118" y1="64" x2="134" y2="72" style="stroke:rgb(0,0,0);stroke-width:1"/>\\n\\t<line x1="120" y1="60" x2="136" y2="69" style="stroke:rgb(0,0,0);stroke-width:1"/>\\n\\t<line x1="79" y1="63" x2="100" y2="75" style="stroke:rgb(0,0,0);stroke-width:1"/>\\n\\t<line x1="79" y1="67" x2="95" y2="76" style="stroke:rgb(0,0,0);stroke-width:1"/>\\n\\t<line x1="58" y1="99" x2="58" y2="74" style="stroke:rgb(0,0,0);stroke-width:1"/>\\n\\t<line x1="62" y1="96" x2="62" y2="77" style="stroke:rgb(0,0,0);stroke-width:1"/>\\n\\t<line x1="99" y1="99" x2="79" y2="111" style="stroke:rgb(0,0,0);stroke-width:1"/>\\n\\t<line x1="95" y1="97" x2="79" y2="106" style="stroke:rgb(0,0,0);stroke-width:1"/>\\n\\t<line x1="120" y1="46" x2="120" y2="63" style="stroke:rgb(0,0,0);stroke-width:1"/>\\n\\t<line x1="100" y1="75" x2="120" y2="63" style="stroke:rgb(0,0,0);stroke-width:1"/>\\n\\t<line x1="79" y1="45" x2="79" y2="63" style="stroke:rgb(0,0,0);stroke-width:1"/>\\n\\t<line x1="58" y1="74" x2="79" y2="63" style="stroke:rgb(0,0,0);stroke-width:1"/>\\n\\t<line x1="79" y1="111" x2="58" y2="99" style="stroke:rgb(0,0,0);stroke-width:1"/>\\n\\t<line x1="99" y1="99" x2="100" y2="75" style="stroke:rgb(0,0,0);stroke-width:1"/>\\n\\t<line id="function random() { [native code] }:Bond:1-0" class="event" x1="120" y1="63" x2="141" y2="75" stroke-width="8" stroke-opacity="0"/>\\n\\t<line id="function random() { [native code] }:Bond:4-3" class="event" x1="79" y1="63" x2="100" y2="75" stroke-width="8" stroke-opacity="0"/>\\n\\t<line id="function random() { [native code] }:Bond:7-6" class="event" x1="58" y1="99" x2="58" y2="74" stroke-width="8" stroke-opacity="0"/>\\n\\t<line id="function random() { [native code] }:Bond:9-8" class="event" x1="99" y1="99" x2="79" y2="111" stroke-width="8" stroke-opacity="0"/>\\n\\t<line id="function random() { [native code] }:Bond:2-1" class="event" x1="120" y1="39" x2="120" y2="63" stroke-width="8" stroke-opacity="0"/>\\n\\t<line id="function random() { [native code] }:Bond:3-1" class="event" x1="100" y1="75" x2="120" y2="63" stroke-width="8" stroke-opacity="0"/>\\n\\t<line id="function random() { [native code] }:Bond:5-4" class="event" x1="79" y1="38" x2="79" y2="63" stroke-width="8" stroke-opacity="0"/>\\n\\t<line id="function random() { [native code] }:Bond:6-4" class="event" x1="58" y1="74" x2="79" y2="63" stroke-width="8" stroke-opacity="0"/>\\n\\t<line id="function random() { [native code] }:Bond:8-7" class="event" x1="79" y1="111" x2="58" y2="99" stroke-width="8" stroke-opacity="0"/>\\n\\t<line id="function random() { [native code] }:Bond:9-3" class="event" x1="99" y1="99" x2="100" y2="75" stroke-width="8" stroke-opacity="0"/>\\n\\t<circle id="function random() { [native code] }:Atom:0" class="event" cx="141" cy="75" r="8" fill-opacity="0"/>\\n\\t<circle id="function random() { [native code] }:Atom:1" class="event" cx="120" cy="63" r="8" fill-opacity="0"/>\\n\\t<circle id="function random() { [native code] }:Atom:2" class="event" cx="120" cy="39" r="8" fill-opacity="0"/>\\n\\t<circle id="function random() { [native code] }:Atom:3" class="event" cx="100" cy="75" r="8" fill-opacity="0"/>\\n\\t<circle id="function random() { [native code] }:Atom:4" class="event" cx="79" cy="63" r="8" fill-opacity="0"/>\\n\\t<circle id="function random() { [native code] }:Atom:5" class="event" cx="79" cy="38" r="8" fill-opacity="0"/>\\n\\t<circle id="function random() { [native code] }:Atom:6" class="event" cx="58" cy="74" r="8" fill-opacity="0"/>\\n\\t<circle id="function random() { [native code] }:Atom:7" class="event" cx="58" cy="99" r="8" fill-opacity="0"/>\\n\\t<circle id="function random() { [native code] }:Atom:8" class="event" cx="79" cy="111" r="8" fill-opacity="0"/>\\n\\t<circle id="function random() { [native code] }:Atom:9" class="event" cx="99" cy="99" r="8" fill-opacity="0"/>\\n</svg>\t\n' +
  '\n' +
  '\n' +
  '---';
