module.exports = "<div>## Using Markdown in Snip</div>\n" +
  "<div>Snip is a Markdown editor first, so you can use all standard Markdown syntax!</div>\n" +
  "<div># h1 Heading<br>\n" +
  "## h2 Heading<br>\n" +
  "### h3 Heading<br>\n" +
  "#### h4 Heading<br>\n" +
  "##### h5 Heading<br>\n" +
  "###### h6 Heading</div>\n" +
  "<div>**This is bold text**</div>\n" +
  "<div>__This is also bold text__</div>\n" +
  "<div>*This is italic text*</div>\n" +
  "<div>_This is also italic text_</div>\n" +
  "<div>~~Strikethrough~~</div>\n" +
  "<div>==This is marked text==</div>\n" +
  "<div>___</div>\n" +
  "<div>---</div>\n" +
  "<div>***</div>\n" +
  "<div>(c) (C) (r) (R) (tm) (TM) (p) (P) +-</div>\n" +
  "<div>test.. test... test..... test?..... test!....</div>\n" +
  "<div>!!!!!! ???? ,,  -- ---</div>\n" +
  "<div>### Quotes</div>\n" +
  "<div>&gt; Use a `&gt;` to write a blockquote</div>\n" +
  "<div>or</div>\n" +
  "<div>&gt; Blockquotes can also be nested...<br>\n" +
  "&gt;&gt; ...by using additional `&gt;` right next to each other...<br>\n" +
  "&gt; &gt; &gt; ...or with spaces between `&gt;`.</div>\n" +
  "<div>### Lists</div>\n" +
  "<div>Create an unordered list by starting a line with &quot;+&quot;, &quot;-&quot;, or &quot;*&quot;</div>\n" +
  "<div>+ Sub-lists are made by indenting 2 spaces:<br>\n" +
  "- Different characters in in the same sub-list will render the same characters:<br>\n" +
  "* Ac tristique libero volutpat at<br>\n" +
  "+ Facilisis in pretium nisl aliquet<br>\n" +
  "- Nulla volutpat aliquam velit<br>\n" +
  "+ Very easy!</div>\n" +
  "<div>Create an ordered list by writing 1.</div>\n" +
  "<div>1. Lorem ipsum dolor sit amet<br>\n" +
  "2. Consectetur adipiscing elit<br>\n" +
  "3. Integer molestie lorem at massa</div>\n" +
  "<div>...</div>\n" +
  "<div>1. You can use sequential numbers...<br>\n" +
  "1. ...or keep all the numbers as 1.</div>\n" +
  "<div>Or start your list with any number and the numbering will continue:</div>\n" +
  "<div>57. foo<br>\n" +
  "2. bar<br>\n" +
  "6. foo</div>\n" +
  "<div>### Code</div>\n" +
  "<div>Wrap inline code `in single backticks`</div>\n" +
  "<div>...or wrap code blocks in 3 backticks or 3 tildes</div>\n" +
  "<div>```<br>\n" +
  "var foo = function (bar) {<br>\n" +
  "return bar++;<br>\n" +
  "};<br>\n" +
  "```</div>\n" +
  "<div>Include the programming language for syntax highlighting:</div>\n" +
  "<div>~~~javascript<br>\n" +
  "var foo = function (bar) {<br>\n" +
  "return bar++;<br>\n" +
  "};<br>\n" +
  "~~~</div>\n" +
  "<div>*All major languages supported via [highlight.js](https://highlightjs.org/).*</div>\n" +
  "<div>You can also create a code block by indenting all lines:</div>\n" +
  "<div>\\\\ some comments<br>\n" +
  "line 1 of code<br>\n" +
  "line 2 of code<br>\n" +
  "line 3 of code</div>\n" +
  "<div>### Tables</div>\n" +
  "<div>Colons can be used to align columns:</div>\n" +
  "<div>| Tables        | Are           | Cool  |<br>\n" +
  "| :------------ |:-------------:| -----:|<br>\n" +
  "| col 3 is      | right-aligned | $1600 |<br>\n" +
  "| col 2 is      | centered      |   $12 |<br>\n" +
  "| zebra stripes | are neat      |    $1 |</div>\n" +
  "<div>There must be at least 3 dashes separating each header cell.<br>\n" +
  "The outer pipes (|) are optional, and you don't need to make the raw Markdown line up prettily:</div>\n" +
  "<div>Markdown | Less | Pretty<br>\n" +
  "--- | --- | ---<br>\n" +
  "*Still* | `renders` | **nicely**<br>\n" +
  "1 | 2 | 3</div>\n" +
  "<div>### Links and images</div>\n" +
  "<div>[This is a link to the Mathpix website](http://mathpix.com/)</div>\n" +
  "<div>![Feynman Lecture 1](https://cdn.mathpix.com/snip/images/0Y13pkOem1h2kqhOPAB98mtSCL5FQlQPtot1obxd-R8.original.fullsize.png)</div>\n" +
  "<div>Include text in quotes for a tooltip (hover over the image to see):<br>\n" +
  "![Feynman Lecture 2](https://cdn.mathpix.com/snip/images/XDfl14ZxchxGUuOHzRSN7FcqMmLxknDndIo18jsMfk0.original.fullsize.png &quot;Michelson-Morley experiment&quot;)</div>\n" +
  "<div>### Footnotes</div>\n" +
  "<div>You can write footnotes either by writing out &quot;first&quot;, &quot;second&quot;, &quot;third&quot;, etc:</div>\n" +
  "<div>Footnote 1 link[^first].</div>\n" +
  "<div>Footnote reference[^second]</div>\n" +
  "<div>And you can reference the same footnote again like this[^second]</div>\n" +
  "<div>Or you can use numbers:</div>\n" +
  "<div>This is my next footnote[^3]</div>\n" +
  "<div>And another[^4]</div>\n" +
  "<div>You can reference multiple footnotes in a row[^3][^4]</div>\n" +
  "<div>You can also write inline footnotes:</div>\n" +
  "<div>Inline footnote^[Text of inline footnote] definition.</div>\n" +
  "<div>[^first]: Footnotes **can have markup**</div>\n" +
  "<div>and multiple paragraphs.</div>\n" +
  "<div>[^second]: Footnote text.</div>\n" +
  "<div>[^3]: Hello I am the third footote!</div>\n" +
  "<div>[^4]: And I'm the 4th!</div>\n" +
  "<div>### Emojies</div>\n" +
  "<div>Classic markup: :wink: :cry: :laughing: :yum:</div>\n" +
  "<div>Shortcuts (emoticons): :-) :-( 8-) ;)</div>\n" +
  "<div>### Subscripts and Superscripts</div>\n" +
  "<div>- 19^th^<br>\n" +
  "- H~2~O</div>\n" +
  "<div>---<br>\n" +
  "---</div>\n" +
  "<div>## Using HTML in Snip</div>\n" +
  "<div>You can also use HTML tags in Snip. Here is an example of a header:</div>\n" +
  "<div>&lt;h2 style=&quot;color:blue;&quot;&gt;This is a Blue Heading&lt;/h2&gt;</div>\n" +
  "<div>You can also insert SVGs!</div>\n" +
  "<div>&lt;svg id=&quot;function random() { [native code] }&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot; version=&quot;1.1&quot; width=&quot;200px&quot; height=&quot;150px&quot; viewBox=&quot;0 0 200 150&quot;&gt;\\n\\t&lt;style&gt; #function random() { [native code] } {pointer-events:none; }  #function random() { [native code] } .event  { pointer-events:all;}  &lt;/style&gt;\\n\\t&lt;text x=&quot;136&quot; y=&quot;79&quot; font-family=&quot; Helvetica&quot; font-weight=&quot;900&quot; font-size=&quot;14&quot; fill=&quot;rgb(255,13,13)&quot;&gt;O&lt;/text&gt;\\n\\t&lt;text x=&quot;115&quot; y=&quot;43&quot; font-family=&quot; Helvetica&quot; font-weight=&quot;900&quot; font-size=&quot;14&quot; fill=&quot;rgb(255,13,13)&quot;&gt;O&lt;/text&gt;\\n\\t&lt;text x=&quot;126&quot; y=&quot;43&quot; font-family=&quot; Helvetica&quot; font-weight=&quot;900&quot; font-size=&quot;14&quot; fill=&quot;rgb(255,13,13)&quot;&gt;H&lt;/text&gt;\\n\\t&lt;text x=&quot;73&quot; y=&quot;42&quot; font-family=&quot; Helvetica&quot; font-weight=&quot;900&quot; font-size=&quot;14&quot; fill=&quot;rgb(255,13,13)&quot;&gt;O&lt;/text&gt;\\n\\t&lt;text x=&quot;84&quot; y=&quot;42&quot; font-family=&quot; Helvetica&quot; font-weight=&quot;900&quot; font-size=&quot;14&quot; fill=&quot;rgb(255,13,13)&quot;&gt;H&lt;/text&gt;\\n\\t&lt;line x1=&quot;118&quot; y1=&quot;64&quot; x2=&quot;134&quot; y2=&quot;72&quot; style=&quot;stroke:rgb(0,0,0);stroke-width:1&quot;/&gt;\\n\\t&lt;line x1=&quot;120&quot; y1=&quot;60&quot; x2=&quot;136&quot; y2=&quot;69&quot; style=&quot;stroke:rgb(0,0,0);stroke-width:1&quot;/&gt;\\n\\t&lt;line x1=&quot;79&quot; y1=&quot;63&quot; x2=&quot;100&quot; y2=&quot;75&quot; style=&quot;stroke:rgb(0,0,0);stroke-width:1&quot;/&gt;\\n\\t&lt;line x1=&quot;79&quot; y1=&quot;67&quot; x2=&quot;95&quot; y2=&quot;76&quot; style=&quot;stroke:rgb(0,0,0);stroke-width:1&quot;/&gt;\\n\\t&lt;line x1=&quot;58&quot; y1=&quot;99&quot; x2=&quot;58&quot; y2=&quot;74&quot; style=&quot;stroke:rgb(0,0,0);stroke-width:1&quot;/&gt;\\n\\t&lt;line x1=&quot;62&quot; y1=&quot;96&quot; x2=&quot;62&quot; y2=&quot;77&quot; style=&quot;stroke:rgb(0,0,0);stroke-width:1&quot;/&gt;\\n\\t&lt;line x1=&quot;99&quot; y1=&quot;99&quot; x2=&quot;79&quot; y2=&quot;111&quot; style=&quot;stroke:rgb(0,0,0);stroke-width:1&quot;/&gt;\\n\\t&lt;line x1=&quot;95&quot; y1=&quot;97&quot; x2=&quot;79&quot; y2=&quot;106&quot; style=&quot;stroke:rgb(0,0,0);stroke-width:1&quot;/&gt;\\n\\t&lt;line x1=&quot;120&quot; y1=&quot;46&quot; x2=&quot;120&quot; y2=&quot;63&quot; style=&quot;stroke:rgb(0,0,0);stroke-width:1&quot;/&gt;\\n\\t&lt;line x1=&quot;100&quot; y1=&quot;75&quot; x2=&quot;120&quot; y2=&quot;63&quot; style=&quot;stroke:rgb(0,0,0);stroke-width:1&quot;/&gt;\\n\\t&lt;line x1=&quot;79&quot; y1=&quot;45&quot; x2=&quot;79&quot; y2=&quot;63&quot; style=&quot;stroke:rgb(0,0,0);stroke-width:1&quot;/&gt;\\n\\t&lt;line x1=&quot;58&quot; y1=&quot;74&quot; x2=&quot;79&quot; y2=&quot;63&quot; style=&quot;stroke:rgb(0,0,0);stroke-width:1&quot;/&gt;\\n\\t&lt;line x1=&quot;79&quot; y1=&quot;111&quot; x2=&quot;58&quot; y2=&quot;99&quot; style=&quot;stroke:rgb(0,0,0);stroke-width:1&quot;/&gt;\\n\\t&lt;line x1=&quot;99&quot; y1=&quot;99&quot; x2=&quot;100&quot; y2=&quot;75&quot; style=&quot;stroke:rgb(0,0,0);stroke-width:1&quot;/&gt;\\n\\t&lt;line id=&quot;function random() { [native code] }:Bond:1-0&quot; class=&quot;event&quot; x1=&quot;120&quot; y1=&quot;63&quot; x2=&quot;141&quot; y2=&quot;75&quot; stroke-width=&quot;8&quot; stroke-opacity=&quot;0&quot;/&gt;\\n\\t&lt;line id=&quot;function random() { [native code] }:Bond:4-3&quot; class=&quot;event&quot; x1=&quot;79&quot; y1=&quot;63&quot; x2=&quot;100&quot; y2=&quot;75&quot; stroke-width=&quot;8&quot; stroke-opacity=&quot;0&quot;/&gt;\\n\\t&lt;line id=&quot;function random() { [native code] }:Bond:7-6&quot; class=&quot;event&quot; x1=&quot;58&quot; y1=&quot;99&quot; x2=&quot;58&quot; y2=&quot;74&quot; stroke-width=&quot;8&quot; stroke-opacity=&quot;0&quot;/&gt;\\n\\t&lt;line id=&quot;function random() { [native code] }:Bond:9-8&quot; class=&quot;event&quot; x1=&quot;99&quot; y1=&quot;99&quot; x2=&quot;79&quot; y2=&quot;111&quot; stroke-width=&quot;8&quot; stroke-opacity=&quot;0&quot;/&gt;\\n\\t&lt;line id=&quot;function random() { [native code] }:Bond:2-1&quot; class=&quot;event&quot; x1=&quot;120&quot; y1=&quot;39&quot; x2=&quot;120&quot; y2=&quot;63&quot; stroke-width=&quot;8&quot; stroke-opacity=&quot;0&quot;/&gt;\\n\\t&lt;line id=&quot;function random() { [native code] }:Bond:3-1&quot; class=&quot;event&quot; x1=&quot;100&quot; y1=&quot;75&quot; x2=&quot;120&quot; y2=&quot;63&quot; stroke-width=&quot;8&quot; stroke-opacity=&quot;0&quot;/&gt;\\n\\t&lt;line id=&quot;function random() { [native code] }:Bond:5-4&quot; class=&quot;event&quot; x1=&quot;79&quot; y1=&quot;38&quot; x2=&quot;79&quot; y2=&quot;63&quot; stroke-width=&quot;8&quot; stroke-opacity=&quot;0&quot;/&gt;\\n\\t&lt;line id=&quot;function random() { [native code] }:Bond:6-4&quot; class=&quot;event&quot; x1=&quot;58&quot; y1=&quot;74&quot; x2=&quot;79&quot; y2=&quot;63&quot; stroke-width=&quot;8&quot; stroke-opacity=&quot;0&quot;/&gt;\\n\\t&lt;line id=&quot;function random() { [native code] }:Bond:8-7&quot; class=&quot;event&quot; x1=&quot;79&quot; y1=&quot;111&quot; x2=&quot;58&quot; y2=&quot;99&quot; stroke-width=&quot;8&quot; stroke-opacity=&quot;0&quot;/&gt;\\n\\t&lt;line id=&quot;function random() { [native code] }:Bond:9-3&quot; class=&quot;event&quot; x1=&quot;99&quot; y1=&quot;99&quot; x2=&quot;100&quot; y2=&quot;75&quot; stroke-width=&quot;8&quot; stroke-opacity=&quot;0&quot;/&gt;\\n\\t&lt;circle id=&quot;function random() { [native code] }:Atom:0&quot; class=&quot;event&quot; cx=&quot;141&quot; cy=&quot;75&quot; r=&quot;8&quot; fill-opacity=&quot;0&quot;/&gt;\\n\\t&lt;circle id=&quot;function random() { [native code] }:Atom:1&quot; class=&quot;event&quot; cx=&quot;120&quot; cy=&quot;63&quot; r=&quot;8&quot; fill-opacity=&quot;0&quot;/&gt;\\n\\t&lt;circle id=&quot;function random() { [native code] }:Atom:2&quot; class=&quot;event&quot; cx=&quot;120&quot; cy=&quot;39&quot; r=&quot;8&quot; fill-opacity=&quot;0&quot;/&gt;\\n\\t&lt;circle id=&quot;function random() { [native code] }:Atom:3&quot; class=&quot;event&quot; cx=&quot;100&quot; cy=&quot;75&quot; r=&quot;8&quot; fill-opacity=&quot;0&quot;/&gt;\\n\\t&lt;circle id=&quot;function random() { [native code] }:Atom:4&quot; class=&quot;event&quot; cx=&quot;79&quot; cy=&quot;63&quot; r=&quot;8&quot; fill-opacity=&quot;0&quot;/&gt;\\n\\t&lt;circle id=&quot;function random() { [native code] }:Atom:5&quot; class=&quot;event&quot; cx=&quot;79&quot; cy=&quot;38&quot; r=&quot;8&quot; fill-opacity=&quot;0&quot;/&gt;\\n\\t&lt;circle id=&quot;function random() { [native code] }:Atom:6&quot; class=&quot;event&quot; cx=&quot;58&quot; cy=&quot;74&quot; r=&quot;8&quot; fill-opacity=&quot;0&quot;/&gt;\\n\\t&lt;circle id=&quot;function random() { [native code] }:Atom:7&quot; class=&quot;event&quot; cx=&quot;58&quot; cy=&quot;99&quot; r=&quot;8&quot; fill-opacity=&quot;0&quot;/&gt;\\n\\t&lt;circle id=&quot;function random() { [native code] }:Atom:8&quot; class=&quot;event&quot; cx=&quot;79&quot; cy=&quot;111&quot; r=&quot;8&quot; fill-opacity=&quot;0&quot;/&gt;\\n\\t&lt;circle id=&quot;function random() { [native code] }:Atom:9&quot; class=&quot;event&quot; cx=&quot;99&quot; cy=&quot;99&quot; r=&quot;8&quot; fill-opacity=&quot;0&quot;/&gt;\\n&lt;/svg&gt;</div>\n" +
  "<div>\\title{Using Latex}</div>\n" +
  "<div>\\title{Title}</div>\n" +
  "<div>\\author{Author}</div>\n" +
  "<div>\\author{Author\\\\can also be\\\\multiline}</div>\n" +
  "<div>\\begin{abstract}<br>\n" +
  "This is the abstract to my paper. You are going to learn a lot in this paper, just you wait. I am going to tell you about all the different LaTeX and Markdown syntax you can use in Snip.<br>\n" +
  "\\end{abstract}</div>\n" +
  "<div>\\section{My great section}</div>\n" +
  "<div>\\subsection{My really great subsection}</div>\n" +
  "<div>\\subsubsection{My really great subsubsection}</div>\n" +
  "<div>\\section*{My great section}</div>\n" +
  "<div>\\subsection*{My really great subsection}</div>\n" +
  "<div>\\subsubsection*{My really great subsubsection}</div>\n" +
  "<div>\\textit{This is italic text}</div>\n" +
  "<div>\\textbf{This is bold text}</div>\n" +
  "<div>\\textbf{\\textit{This is bold italic text}}</div>\n" +
  "<div>\\texttt{This is code text}</div>\n" +
  "<div>\\text{This is text}</div>\n" +
  "<div>\\underline{This is underline text}</div>\n" +
  "<div>\\underline{\\textbf{This is underline bold text}}</div>\n" +
  "<div>\\uline{This is underline text}</div>\n" +
  "<div>\\uline{\\textit{This is underline italic text}}</div>\n" +
  "<div>\\uuline{This is double underline text}</div>\n" +
  "<div>\\uwave{This is wave underline text}</div>\n" +
  "<div>\\dashuline{This is dash underline text}</div>\n" +
  "<div>\\dotuline{This is dot underline text}</div>\n" +
  "<div>\\sout{Strikethrough}</div>\n" +
  "<div>\\xout{Strikethrough}</div>\n" +
  "<div>Some text with dotfill \\dotfill</div>\n" +
  "<div>\\textasciicircum \\textless \\textasciitilde \\textordfeminine \\textasteriskcentered \\textordmasculine \\textbackslash \\textparagraph \\textbar \\textperiodcentered \\textbraceleft \\textquestiondown \\textbraceright \\textquotedblleft \\textbullet \\textquotedblright \\textcopyright \\textquoteleft \\textdagger \\textquoteright \\textdaggerdbl \\textregistered \\textdollar \\textsection \\textellipsis \\ldots \\textsterling \\textemdash \\texttrademark \\textendash \\textunderscore \\textexclamdown \\textvisiblespace \\textgreater \\pounds</div>\n" +
  "<div>\\pagebreak</div>\n" +
  "<div>\\clearpage</div>\n" +
  "<div>\\newpage</div>\n" +
  "<div>Inline math $\\vec { F } = m \\vec { a }$ and this \\(ax^2 + bx + c = 0\\)</div>\n" +
  "<div>$$<br>\n" +
  "x = \\frac { - b \\pm \\sqrt { b ^ { 2 } - 4 a c } } { 2 a }<br>\n" +
  "$$</div>\n" +
  "<div>\\[<br>\n" +
  "y = \\frac { \\sum _ { i } w _ { i } y _ { i } } { \\sum _ { i } w _ { i } } , i = 1,2 \\ldots k<br>\n" +
  "\\]</div>\n" +
  "<div>\\begin{equation*}<br>\n" +
  "l ( \\theta ) = \\sum _ { i = 1 } ^ { m } \\log p ( x , \\theta )<br>\n" +
  "\\end{equation*}</div>\n" +
  "<div>\\begin{align*}<br>\n" +
  "t _ { 1 } + t _ { 2 } = \\frac { ( 2 L / c ) \\sqrt { 1 - u ^ { 2 } / c ^ { 2 } } } { 1 - u ^ { 2 } / c ^ { 2 } } = \\frac { 2 L / c } { \\sqrt { 1 - u ^ { 2 } / c ^ { 2 } } }<br>\n" +
  "\\end{align*}</div>\n" +
  "<div>\\begin{equation}<br>\n" +
  "m = \\frac { m _ { 0 } } { \\sqrt { 1 - v ^ { 2 } / c ^ { 2 } } }<br>\n" +
  "\\end{equation}</div>\n" +
  "<div>\\begin{align}<br>\n" +
  "^{|\\alpha|} \\sqrt{x^{\\alpha}} \\leq(x \\bullet \\alpha) /|\\alpha|<br>\n" +
  "\\end{align}</div>\n" +
  "<div>In equation \\eqref{eq:1}, we find the value of an<br>\n" +
  "interesting integral:</div>\n" +
  "<div>\\begin{equation}<br>\n" +
  "\\int_0^\\infty \\frac{x^3}{e^x-1}\\,dx = \\frac{\\pi^4}{15}<br>\n" +
  "\\label{eq:1}<br>\n" +
  "\\end{equation}</div>\n" +
  "<div>\\begin{equation}<br>\n" +
  "\\| x + y \\| \\geq | \\| x | | - \\| y \\| |<br>\n" +
  "\\label{eq:2}<br>\n" +
  "\\end{equation}</div>\n" +
  "<div>$$<br>\n" +
  "\\frac{x\\left(x^{2 n}-x^{-2 n}\\right)}{x^{2 n}+x^{-2 n}}<br>\n" +
  "\\tag{1.1}<br>\n" +
  "$$</div>\n" +
  "<div>\\begin{equation}<br>\n" +
  "\\max _{\\theta} \\mathbb{E}_{\\mathbf{z} \\sim \\mathcal{Z}_{T}}\\left[\\sum_{t=1}^{T} \\log p_{\\theta}\\left(x_{z_{t}} | \\mathbf{x}_{\\mathbf{z}_{&lt;t}}\\right)\\right]<br>\n" +
  "\\tag{1.2}<br>\n" +
  "\\end{equation}</div>\n" +
  "<div>Look at the Equation \\ref{eq:2}<br>\n" +
  "Ref in math mode $\\ref{eq:2}$</div>\n" +
  "<div>\\begin{split}<br>\n" +
  "a&amp; =b+c-d\\\\<br>\n" +
  "&amp; \\quad +e-f\\\\<br>\n" +
  "&amp; =g+h\\\\<br>\n" +
  "&amp; =i<br>\n" +
  "\\end{split}</div>\n" +
  "<div>\\begin{gather}<br>\n" +
  "a_1=b_1+c_1\\\\<br>\n" +
  "a_2=b_2+c_2-d_2+e_2<br>\n" +
  "\\end{gather}</div>\n" +
  "<div>\\begin{gather*}<br>\n" +
  "a_1=b_1+c_1\\\\<br>\n" +
  "a_2=b_2+c_2-d_2+e_2<br>\n" +
  "\\end{gather*}</div>\n" +
  "<div>Use `\\url{}` to insert a \\url{link}.</div>\n" +
  "<div>\\begin{table}[h!]<br>\n" +
  "\\centering</div>\n" +
  "<div>\\begin{tabular}{||c c c c||}<br>\n" +
  "\\hline<br>\n" +
  "Col1 &amp; Col2 &amp; Col2 &amp; Col3 \\\\ [0.5ex]<br>\n" +
  "\\hline\\hline<br>\n" +
  "1 &amp; 6 &amp; 87837 &amp; 787 \\\\<br>\n" +
  "2 &amp; 7 &amp; 78 &amp; 5415 \\\\<br>\n" +
  "3 &amp; 545 &amp; 778 &amp; 7507 \\\\<br>\n" +
  "4 &amp; 545 &amp; 18744 &amp; 7560 \\\\<br>\n" +
  "5 &amp; 88 &amp; 788 &amp; 6344 \\\\ [1ex]<br>\n" +
  "\\hline<br>\n" +
  "\\end{tabular}</div>\n" +
  "<div>\\end{table}</div>\n" +
  "<div>The table \\ref{table:1} is an example of referenced \\LaTeX elements.</div>\n" +
  "<div>\\begin{table}[h!]<br>\n" +
  "\\centering</div>\n" +
  "<div>\\begin{tabular}{||c c c c||}<br>\n" +
  "\\hline<br>\n" +
  "Col1 &amp; Col2 &amp; Col2 &amp; Col3 \\\\ [0.5ex]<br>\n" +
  "\\hline\\hline<br>\n" +
  "1 &amp; 6 &amp; 87837 &amp; 787 \\\\<br>\n" +
  "2 &amp; 7 &amp; 78 &amp; 5415 \\\\<br>\n" +
  "3 &amp; 545 &amp; 778 &amp; 7507 \\\\<br>\n" +
  "4 &amp; 545 &amp; 18744 &amp; 7560 \\\\<br>\n" +
  "5 &amp; 88 &amp; 788 &amp; 6344 \\\\ [1ex]<br>\n" +
  "\\hline<br>\n" +
  "\\end{tabular}</div>\n" +
  "<div>\\caption{Table to test captions and labels}<br>\n" +
  "\\label{table:1}<br>\n" +
  "\\end{table}</div>\n" +
  "<div>The figure \\ref{fig:figure1}</div>\n" +
  "<div>\\begin{figure}<br>\n" +
  "\\includegraphics[width=350px, height=70px, right]{https://cdn.mathpix.com/snip/images/-HM3WXo8kgdk8VtayBtn1_pJlgq9Cb7qV4JtM47Hgn0.original.fullsize.png}<br>\n" +
  "\\caption{Equation}<br>\n" +
  "\\label{fig:figure1}<br>\n" +
  "\\end{figure}</div>\n" +
  "<div>\\begin{itemize}<br>\n" +
  "\\item  Default item label for entry one<br>\n" +
  "\\item  Default item label for entry two<br>\n" +
  "\\item[$\\square$]  Custom item label for entry three<br>\n" +
  "\\end{itemize}</div>\n" +
  "<div>\\renewcommand{\\labelenumii}{\\Roman{enumii}}</div>\n" +
  "<div>\\begin{enumerate}<br>\n" +
  "\\item First level item<br>\n" +
  "\\item First level item<br>\n" +
  "\\begin{enumerate}<br>\n" +
  "\\setcounter{enumii}{4}<br>\n" +
  "\\item Second level item<br>\n" +
  "\\item Second level item<br>\n" +
  "\\begin{enumerate}<br>\n" +
  "\\item Third level item<br>\n" +
  "\\item Third level item<br>\n" +
  "\\begin{enumerate}<br>\n" +
  "\\item Fourth level item<br>\n" +
  "\\item Fourth level item<br>\n" +
  "\\end{enumerate}<br>\n" +
  "\\end{enumerate}<br>\n" +
  "\\end{enumerate}<br>\n" +
  "\\end{enumerate}</div>\n" +
  "<div>\\newtheorem{theorem}{Theorem}<br>\n" +
  "\\newtheorem{theorem}{Theorem}[section]<br>\n" +
  "\\newtheorem{lemma}[theorem]{Lemma}</div>\n" +
  "<div>\\section{Introduction}</div>\n" +
  "<div>Theorems can easily be defined:</div>\n" +
  "<div>\\begin{theorem}<br>\n" +
  "Let \\(f\\) be a function whose derivative exists in every point, then \\(f\\)<br>\n" +
  "is a continuous function.<br>\n" +
  "\\end{theorem}</div>\n" +
  "<div>\\setcounter{theorem}{0}</div>\n" +
  "<div>\\begin{theorem}<br>\n" +
  "Let \\(f\\) be a function whose derivative exists in every point, then \\(f\\)<br>\n" +
  "is a continuous function.<br>\n" +
  "\\end{theorem}</div>\n" +
  "<div>\\setcounter{theorem}{-3}</div>\n" +
  "<div>\\begin{theorem}<br>\n" +
  "Let \\(f\\) be a function whose derivative exists in every point, then \\(f\\)<br>\n" +
  "is a continuous function.<br>\n" +
  "\\end{theorem}</div>\n" +
  "<div>\\section{Introduction}</div>\n" +
  "<div>\\begin{lemma}<br>\n" +
  "Given two line segments whose lengths are \\(a\\) and \\(b\\) respectively there<br>\n" +
  "is a real number \\(r\\) such that \\(b=ra\\).<br>\n" +
  "\\end{lemma}</div>\n" +
  "<div>\\renewcommand\\qedsymbol{$\\blacksquare$}</div>\n" +
  "<div>\\begin{proof}<br>\n" +
  "To prove it by contradiction try and assume that the statement is false,<br>\n" +
  "proceed from there and at some point you will arrive to a contradiction.<br>\n" +
  "\\end{proof}</div>\n" +
  "<div>\\renewcommand\\qedsymbol{QED}</div>\n" +
  "<div>\\begin{proof}<br>\n" +
  "To prove it by contradiction try and assume that the statement is false,<br>\n" +
  "proceed from there and at some point you will arrive to a contradiction.<br>\n" +
  "\\end{proof}</div>\n" +
  "<div>Automatically-generated footnote marker 1 \\footnote{First footnote should be 1}.</div>\n" +
  "<div>Footnote marker set to 11 \\footnote[11]{First footnote should be 11}.</div>\n" +
  "<div>Automatically-generated footnote marker 2 \\footnote{First footnote should be 2}.</div>\n" +
  "<div>Automatically-generated footnote marker 3 \\footnotemark{} \\footnotetext{Text of footnote with marker 3.}</div>\n" +
  "<div>Automatically-generated footnote markers 4 \\footnotemark{}, 5\\footnotemark{}</div>\n" +
  "<div>Marker set to 20 \\footnotemark[20]{} \\footnotetext{Text of last footnote marker}<br>\n" +
  "\\footnotetext[20]{Text of footnote with marker 20}<br>\n" +
  "\\footnotetext{Text of last footnote marker}</div>\n" +
  "<div>\\footnotetext[20]{Text of footnote with marker 20}<br>\n" +
  "\\footnote{First footnote should be 1}.<br>\n" +
  "\\footnotetext{Text of last footnote marker}<br>\n" +
  "\\footnotetext{Text of last footnote marker}</div>\n" +
  "<div>\\footnotetext[20]{Text of footnote with marker 20}</div>\n" +
  "<div>\\blfootnotetext{<br>\n" +
  "\\({ }^{0}\\) Compared to V1, this draft includes better baselines, experiments on GLUE, and more on adapter latency.<br>\n" +
  "}</div>\n" +
  "<div>\\footnotetext{<br>\n" +
  "\\({ }^{0}\\) Compared to V1, this draft includes better baselines, experiments on GLUE, and more on adapter latency.<br>\n" +
  "}</div>\n" +
  "<div>\\footnotetext{<br>\n" +
  "\\({ }^{1}\\) While GPT-3 175B achieves non-trivial performance with few-shot learning, fine-tuning boosts its performance significantly as shown in Appendix A<br>\n" +
  "}</div>\n" +
  "<div>\\footnotetext[]{ While GPT-3 175B achieves non-trivial performance with few-shot learning, fine-tuning boosts its performance significantly as shown in Appendix A<br>\n" +
  "}</div>\n" +
  "<div>\\footnotetext[0]{ While GPT-3 175B achieves non-trivial performance with few-shot learning, fine-tuning boosts its performance significantly as shown in Appendix A<br>\n" +
  "}</div>\n" +
  "<div>\\footnote{}</div>\n" +
  "<div>\\footnotetext[]{ While GPT-3 175B achieves non-trivial performance with few-shot learning, fine-tuning boosts its performance significantly as shown in Appendix A<br>\n" +
  "}</div>\n" +
  "<div>\\footnotetext[0]{ While GPT-3 175B achieves non-trivial performance with few-shot learning, fine-tuning boosts its performance significantly as shown in Appendix A<br>\n" +
  "}</div>\n" +
  "<div>&lt;smiles&gt;O=C1OC(=O)C2C(=O)C3CC=CCC3C(=O)C12&lt;/smiles&gt;</div>\n" +
  "<div>```smiles<br>\n" +
  "O=C1OC(=O)C2C(=O)C3CC=CCC3C(=O)C12<br>\n" +
  "```</div>\n" +
  "<div>&lt;ascii&gt;sin ((4)/(3sin ((4)/(3)x)))&lt;/ascii&gt;</div>\n" +
  "<div>&lt;math xmlns=&quot;http://www.w3.org/1998/Math/MathML&quot; display=&quot;block&quot;&gt;<br>\n" +
  "&lt;mtable displaystyle=&quot;true&quot;&gt;<br>\n" +
  "&lt;mlabeledtr&gt;<br>\n" +
  "&lt;mtd id=&quot;mjx-eqn-eq:1&quot;&gt;<br>\n" +
  "&lt;mtext&gt;(3)&lt;/mtext&gt;<br>\n" +
  "&lt;/mtd&gt;<br>\n" +
  "&lt;mtd&gt;<br>\n" +
  "&lt;msubsup&gt;<br>\n" +
  "&lt;mo data-mjx-texclass=&quot;OP&quot;&gt;∫&lt;/mo&gt;<br>\n" +
  "&lt;mn&gt;0&lt;/mn&gt;<br>\n" +
  "&lt;mi mathvariant=&quot;normal&quot;&gt;∞&lt;/mi&gt;<br>\n" +
  "&lt;/msubsup&gt;<br>\n" +
  "&lt;mfrac&gt;<br>\n" +
  "&lt;msup&gt;<br>\n" +
  "&lt;mi&gt;x&lt;/mi&gt;<br>\n" +
  "&lt;mn&gt;3&lt;/mn&gt;<br>\n" +
  "&lt;/msup&gt;<br>\n" +
  "&lt;mrow&gt;<br>\n" +
  "&lt;msup&gt;<br>\n" +
  "&lt;mi&gt;e&lt;/mi&gt;<br>\n" +
  "&lt;mi&gt;x&lt;/mi&gt;<br>\n" +
  "&lt;/msup&gt;<br>\n" +
  "&lt;mo&gt;−&lt;/mo&gt;<br>\n" +
  "&lt;mn&gt;1&lt;/mn&gt;<br>\n" +
  "&lt;/mrow&gt;<br>\n" +
  "&lt;/mfrac&gt;<br>\n" +
  "&lt;mstyle scriptlevel=&quot;0&quot;&gt;<br>\n" +
  "&lt;mspace width=&quot;thinmathspace&quot;&gt;&lt;/mspace&gt;<br>\n" +
  "&lt;/mstyle&gt;<br>\n" +
  "&lt;mi&gt;d&lt;/mi&gt;<br>\n" +
  "&lt;mi&gt;x&lt;/mi&gt;<br>\n" +
  "&lt;mo&gt;=&lt;/mo&gt;<br>\n" +
  "&lt;mfrac&gt;<br>\n" +
  "&lt;msup&gt;<br>\n" +
  "&lt;mi&gt;π&lt;/mi&gt;<br>\n" +
  "&lt;mn&gt;4&lt;/mn&gt;<br>\n" +
  "&lt;/msup&gt;<br>\n" +
  "&lt;mn&gt;15&lt;/mn&gt;<br>\n" +
  "&lt;/mfrac&gt;<br>\n" +
  "&lt;/mtd&gt;<br>\n" +
  "&lt;/mlabeledtr&gt;<br>\n" +
  "&lt;/mtable&gt;<br>\n" +
  "&lt;/math&gt;</div>";