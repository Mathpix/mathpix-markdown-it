module.exports = "<h2>Using Markdown in Snip</h2>\n" +
  "<div>Snip is a Markdown editor first, so you can use all standard Markdown syntax!</div>\n" +
  "<h1>h1 Heading</h1>\n" +
  "<h2>h2 Heading</h2>\n" +
  "<h3>h3 Heading</h3>\n" +
  "<h4>h4 Heading</h4>\n" +
  "<h5>h5 Heading</h5>\n" +
  "<h6>h6 Heading</h6>\n" +
  "<div><strong>This is bold text</strong></div>\n" +
  "<div><strong>This is also bold text</strong></div>\n" +
  "<div><em>This is italic text</em></div>\n" +
  "<div><em>This is also italic text</em></div>\n" +
  "<div><s style=\"text-decoration: line-through; color: inherit;\">Strikethrough</s></div>\n" +
  "<div><mark>This is marked text</mark></div>\n" +
  "<hr>\n" +
  "<hr>\n" +
  "<hr>\n" +
  "<div>© © ® ® ™ ™ § § ±</div>\n" +
  "<div>test… test… test… test?.. test!..</div>\n" +
  "<div>!!! ??? ,  – —</div>\n" +
  "<h3>Quotes</h3>\n" +
  "<blockquote>\n" +
  "<div>Use a <code>&gt;</code> to write a blockquote</div>\n" +
  "</blockquote>\n" +
  "<div>or</div>\n" +
  "<blockquote>\n" +
  "<div>Blockquotes can also be nested…</div>\n" +
  "<blockquote>\n" +
  "<div>…by using additional <code>&gt;</code> right next to each other…</div>\n" +
  "<blockquote>\n" +
  "<div>…or with spaces between <code>&gt;</code>.</div>\n" +
  "</blockquote>\n" +
  "</blockquote>\n" +
  "</blockquote>\n" +
  "<h3>Lists</h3>\n" +
  "<div>Create an unordered list by starting a line with “+”, “-”, or “*”</div>\n" +
  "<ul>\n" +
  "<li>Sub-lists are made by indenting 2 spaces:\n" +
  "<ul>\n" +
  "<li>Different characters in in the same sub-list will render the same characters:\n" +
  "<ul>\n" +
  "<li>Ac tristique libero volutpat at</li>\n" +
  "</ul>\n" +
  "<ul>\n" +
  "<li>Facilisis in pretium nisl aliquet</li>\n" +
  "</ul>\n" +
  "<ul>\n" +
  "<li>Nulla volutpat aliquam velit</li>\n" +
  "</ul>\n" +
  "</li>\n" +
  "</ul>\n" +
  "</li>\n" +
  "<li>Very easy!</li>\n" +
  "</ul>\n" +
  "<div>Create an ordered list by writing 1.</div>\n" +
  "<ol>\n" +
  "<li>Lorem ipsum dolor sit amet</li>\n" +
  "<li>Consectetur adipiscing elit</li>\n" +
  "<li>Integer molestie lorem at massa</li>\n" +
  "</ol>\n" +
  "<div>…</div>\n" +
  "<ol>\n" +
  "<li>You can use sequential numbers…</li>\n" +
  "<li>…or keep all the numbers as 1.</li>\n" +
  "</ol>\n" +
  "<div>Or start your list with any number and the numbering will continue:</div>\n" +
  "<ol start=\"57\">\n" +
  "<li>foo</li>\n" +
  "<li>bar</li>\n" +
  "<li>foo</li>\n" +
  "</ol>\n" +
  "<h3>Code</h3>\n" +
  "<div>Wrap inline code <code>in single backticks</code></div>\n" +
  "<div>…or wrap code blocks in 3 backticks or 3 tildes</div>\n" +
  "<pre><code class=\"hljs\">var foo = function (bar) {\n" +
  "  return bar++;\n" +
  "};\n" +
  "</code></pre>\n" +
  "<div>Include the programming language for syntax highlighting:</div>\n" +
  "<pre><code class=\"hljs language-javascript\"><span class=\"hljs-keyword\">var</span> foo = <span class=\"hljs-keyword\">function</span> (<span class=\"hljs-params\">bar</span>) {\n" +
  "  <span class=\"hljs-keyword\">return</span> bar++;\n" +
  "};\n" +
  "</code></pre>\n" +
  "<div><em>All major languages supported via <a href=\"https://highlightjs.org/\" target=\"_blank\" rel=\"noopener\" style=\"display: inline-block\">highlight.js</a>.</em></div>\n" +
  "<div>You can also create a code block by indenting all lines:</div>\n" +
  "<pre><code class=\"hljs\">\\\\ some comments \n" +
  "line 1 of code \n" +
  "line 2 of code\n" +
  "line 3 of code\n" +
  "</code></pre>\n" +
  "<h3>Tables</h3>\n" +
  "<div>Colons can be used to align columns:</div>\n" +
  "<table align=\"center\">\n" +
  "<thead>\n" +
  "<tr>\n" +
  "<th style=\"text-align:left\">Tables</th>\n" +
  "<th style=\"text-align:center\">Are</th>\n" +
  "<th style=\"text-align:right\">Cool</th>\n" +
  "</tr>\n" +
  "</thead>\n" +
  "<tbody>\n" +
  "<tr>\n" +
  "<td style=\"text-align:left\">col 3 is</td>\n" +
  "<td style=\"text-align:center\">right-aligned</td>\n" +
  "<td style=\"text-align:right\">$1600</td>\n" +
  "</tr>\n" +
  "<tr>\n" +
  "<td style=\"text-align:left\">col 2 is</td>\n" +
  "<td style=\"text-align:center\">centered</td>\n" +
  "<td style=\"text-align:right\">$12</td>\n" +
  "</tr>\n" +
  "<tr>\n" +
  "<td style=\"text-align:left\">zebra stripes</td>\n" +
  "<td style=\"text-align:center\">are neat</td>\n" +
  "<td style=\"text-align:right\">$1</td>\n" +
  "</tr>\n" +
  "</tbody>\n" +
  "</table>\n" +
  "<div>There must be at least 3 dashes separating each header cell.<br>\n" +
  "The outer pipes (|) are optional, and you don’t need to make the raw Markdown line up prettily:</div>\n" +
  "<table align=\"center\">\n" +
  "<thead>\n" +
  "<tr>\n" +
  "<th>Markdown</th>\n" +
  "<th>Less</th>\n" +
  "<th>Pretty</th>\n" +
  "</tr>\n" +
  "</thead>\n" +
  "<tbody>\n" +
  "<tr>\n" +
  "<td><em>Still</em></td>\n" +
  "<td><code>renders</code></td>\n" +
  "<td><strong>nicely</strong></td>\n" +
  "</tr>\n" +
  "<tr>\n" +
  "<td>1</td>\n" +
  "<td>2</td>\n" +
  "<td>3</td>\n" +
  "</tr>\n" +
  "</tbody>\n" +
  "</table>\n" +
  "<h3>Links and images</h3>\n" +
  "<div><a href=\"http://mathpix.com/\" target=\"_blank\" rel=\"noopener\" style=\"word-break: break-word\">This is a link to the Mathpix website</a></div>\n" +
  "<div><figure style=\"text-align: center\"><img src=\"https://cdn.mathpix.com/snip/images/0Y13pkOem1h2kqhOPAB98mtSCL5FQlQPtot1obxd-R8.original.fullsize.png\" alt=\"Feynman Lecture 1\" data-align=\"center\"></figure></div>\n" +
  "<div>Include text in quotes for a tooltip (hover over the image to see):<br>\n" +
  "<figure style=\"text-align: center\"><img src=\"https://cdn.mathpix.com/snip/images/XDfl14ZxchxGUuOHzRSN7FcqMmLxknDndIo18jsMfk0.original.fullsize.png\" alt=\"Feynman Lecture 2\" data-align=\"center\" title=\"Michelson-Morley experiment\"></figure></div>\n" +
  "<h3>Footnotes</h3>\n" +
  "<div>You can write footnotes either by writing out “first”, “second”, “third”, etc:</div>\n" +
  "<div>Footnote 1 link<sup class=\"footnote-ref\"><a href=\"#fn1\" id=\"fnref1\">[1]</a></sup>.</div>\n" +
  "<div>Footnote reference<sup class=\"footnote-ref\"><a href=\"#fn2\" id=\"fnref2\">[2]</a></sup></div>\n" +
  "<div>And you can reference the same footnote again like this<sup class=\"footnote-ref\"><a href=\"#fn2\" id=\"fnref2:1\">[2:1]</a></sup></div>\n" +
  "<div>Or you can use numbers:</div>\n" +
  "<div>This is my next footnote<sup class=\"footnote-ref\"><a href=\"#fn3\" id=\"fnref3\">[3]</a></sup></div>\n" +
  "<div>And another<sup class=\"footnote-ref\"><a href=\"#fn4\" id=\"fnref4\">[4]</a></sup></div>\n" +
  "<div>You can reference multiple footnotes in a row<sup class=\"footnote-ref\"><a href=\"#fn3\" id=\"fnref3:1\">[3:1]</a></sup><sup class=\"footnote-ref\"><a href=\"#fn4\" id=\"fnref4:1\">[4:1]</a></sup></div>\n" +
  "<div>You can also write inline footnotes:</div>\n" +
  "<div>Inline footnote<sup class=\"footnote-ref\"><a href=\"#fn5\" id=\"fnref5\">[5]</a></sup> definition.</div>\n" +
  "<h3>Emojies</h3>\n" +
  "<div>Classic markup: 😉 😢 😆 😋</div>\n" +
  "<div>Shortcuts (emoticons): 😃 😦 😎 😉</div>\n" +
  "<h3>Subscripts and Superscripts</h3>\n" +
  "<ul>\n" +
  "<li>19<sup>th</sup></li>\n" +
  "<li>H<sub>2</sub>O</li>\n" +
  "</ul>\n" +
  "<hr>\n" +
  "<hr>\n" +
  "<h2>Using HTML in Snip</h2>\n" +
  "<div>You can also use HTML tags in Snip. Here is an example of a header:</div>\n" +
  "<div>&lt;h2 style=“color:blue;”&gt;This is a Blue Heading&lt;/h2&gt;</div>\n" +
  "<div>You can also insert SVGs!</div>\n" +
  "<div>&lt;svg id=“function random() { [native code] }” xmlns=“<a href=\"http://www.w3.org/2000/svg\" target=\"_blank\" rel=\"noopener\" style=\"display: inline-block\">http://www.w3.org/2000/svg</a>” version=“1.1” width=“200px” height=“150px” viewBox=“0 0 200 150”&gt;\\n\\t&lt;style&gt; #function random() { [native code] } {pointer-events:none; }  #function random() { [native code] } .event  { pointer-events:all;}  &lt;/style&gt;\\n\\t&lt;text x=“136” y=“79” font-family=&quot; Helvetica&quot; font-weight=“900” font-size=“14” fill=“rgb(255,13,13)”&gt;O&lt;/text&gt;\\n\\t&lt;text x=“115” y=“43” font-family=&quot; Helvetica&quot; font-weight=“900” font-size=“14” fill=“rgb(255,13,13)”&gt;O&lt;/text&gt;\\n\\t&lt;text x=“126” y=“43” font-family=&quot; Helvetica&quot; font-weight=“900” font-size=“14” fill=“rgb(255,13,13)”&gt;H&lt;/text&gt;\\n\\t&lt;text x=“73” y=“42” font-family=&quot; Helvetica&quot; font-weight=“900” font-size=“14” fill=“rgb(255,13,13)”&gt;O&lt;/text&gt;\\n\\t&lt;text x=“84” y=“42” font-family=&quot; Helvetica&quot; font-weight=“900” font-size=“14” fill=“rgb(255,13,13)”&gt;H&lt;/text&gt;\\n\\t&lt;line x1=“118” y1=“64” x2=“134” y2=“72” style=“stroke:rgb(0,0,0);stroke-width:1”/&gt;\\n\\t&lt;line x1=“120” y1=“60” x2=“136” y2=“69” style=“stroke:rgb(0,0,0);stroke-width:1”/&gt;\\n\\t&lt;line x1=“79” y1=“63” x2=“100” y2=“75” style=“stroke:rgb(0,0,0);stroke-width:1”/&gt;\\n\\t&lt;line x1=“79” y1=“67” x2=“95” y2=“76” style=“stroke:rgb(0,0,0);stroke-width:1”/&gt;\\n\\t&lt;line x1=“58” y1=“99” x2=“58” y2=“74” style=“stroke:rgb(0,0,0);stroke-width:1”/&gt;\\n\\t&lt;line x1=“62” y1=“96” x2=“62” y2=“77” style=“stroke:rgb(0,0,0);stroke-width:1”/&gt;\\n\\t&lt;line x1=“99” y1=“99” x2=“79” y2=“111” style=“stroke:rgb(0,0,0);stroke-width:1”/&gt;\\n\\t&lt;line x1=“95” y1=“97” x2=“79” y2=“106” style=“stroke:rgb(0,0,0);stroke-width:1”/&gt;\\n\\t&lt;line x1=“120” y1=“46” x2=“120” y2=“63” style=“stroke:rgb(0,0,0);stroke-width:1”/&gt;\\n\\t&lt;line x1=“100” y1=“75” x2=“120” y2=“63” style=“stroke:rgb(0,0,0);stroke-width:1”/&gt;\\n\\t&lt;line x1=“79” y1=“45” x2=“79” y2=“63” style=“stroke:rgb(0,0,0);stroke-width:1”/&gt;\\n\\t&lt;line x1=“58” y1=“74” x2=“79” y2=“63” style=“stroke:rgb(0,0,0);stroke-width:1”/&gt;\\n\\t&lt;line x1=“79” y1=“111” x2=“58” y2=“99” style=“stroke:rgb(0,0,0);stroke-width:1”/&gt;\\n\\t&lt;line x1=“99” y1=“99” x2=“100” y2=“75” style=“stroke:rgb(0,0,0);stroke-width:1”/&gt;\\n\\t&lt;line id=“function random() { [native code] }:Bond:1-0” class=“event” x1=“120” y1=“63” x2=“141” y2=“75” stroke-width=“8” stroke-opacity=“0”/&gt;\\n\\t&lt;line id=“function random() { [native code] }:Bond:4-3” class=“event” x1=“79” y1=“63” x2=“100” y2=“75” stroke-width=“8” stroke-opacity=“0”/&gt;\\n\\t&lt;line id=“function random() { [native code] }:Bond:7-6” class=“event” x1=“58” y1=“99” x2=“58” y2=“74” stroke-width=“8” stroke-opacity=“0”/&gt;\\n\\t&lt;line id=“function random() { [native code] }:Bond:9-8” class=“event” x1=“99” y1=“99” x2=“79” y2=“111” stroke-width=“8” stroke-opacity=“0”/&gt;\\n\\t&lt;line id=“function random() { [native code] }:Bond:2-1” class=“event” x1=“120” y1=“39” x2=“120” y2=“63” stroke-width=“8” stroke-opacity=“0”/&gt;\\n\\t&lt;line id=“function random() { [native code] }:Bond:3-1” class=“event” x1=“100” y1=“75” x2=“120” y2=“63” stroke-width=“8” stroke-opacity=“0”/&gt;\\n\\t&lt;line id=“function random() { [native code] }:Bond:5-4” class=“event” x1=“79” y1=“38” x2=“79” y2=“63” stroke-width=“8” stroke-opacity=“0”/&gt;\\n\\t&lt;line id=“function random() { [native code] }:Bond:6-4” class=“event” x1=“58” y1=“74” x2=“79” y2=“63” stroke-width=“8” stroke-opacity=“0”/&gt;\\n\\t&lt;line id=“function random() { [native code] }:Bond:8-7” class=“event” x1=“79” y1=“111” x2=“58” y2=“99” stroke-width=“8” stroke-opacity=“0”/&gt;\\n\\t&lt;line id=“function random() { [native code] }:Bond:9-3” class=“event” x1=“99” y1=“99” x2=“100” y2=“75” stroke-width=“8” stroke-opacity=“0”/&gt;\\n\\t&lt;circle id=“function random() { [native code] }:Atom:0” class=“event” cx=“141” cy=“75” r=“8” fill-opacity=“0”/&gt;\\n\\t&lt;circle id=“function random() { [native code] }:Atom:1” class=“event” cx=“120” cy=“63” r=“8” fill-opacity=“0”/&gt;\\n\\t&lt;circle id=“function random() { [native code] }:Atom:2” class=“event” cx=“120” cy=“39” r=“8” fill-opacity=“0”/&gt;\\n\\t&lt;circle id=“function random() { [native code] }:Atom:3” class=“event” cx=“100” cy=“75” r=“8” fill-opacity=“0”/&gt;\\n\\t&lt;circle id=“function random() { [native code] }:Atom:4” class=“event” cx=“79” cy=“63” r=“8” fill-opacity=“0”/&gt;\\n\\t&lt;circle id=“function random() { [native code] }:Atom:5” class=“event” cx=“79” cy=“38” r=“8” fill-opacity=“0”/&gt;\\n\\t&lt;circle id=“function random() { [native code] }:Atom:6” class=“event” cx=“58” cy=“74” r=“8” fill-opacity=“0”/&gt;\\n\\t&lt;circle id=“function random() { [native code] }:Atom:7” class=“event” cx=“58” cy=“99” r=“8” fill-opacity=“0”/&gt;\\n\\t&lt;circle id=“function random() { [native code] }:Atom:8” class=“event” cx=“79” cy=“111” r=“8” fill-opacity=“0”/&gt;\\n\\t&lt;circle id=“function random() { [native code] }:Atom:9” class=“event” cx=“99” cy=“99” r=“8” fill-opacity=“0”/&gt;\\n&lt;/svg&gt;</div>\n" +
  "<div>\\title{Using Latex}</div>\n" +
  "<div>\\title{Title}</div>\n" +
  "<div>\\author{Author}</div>\n" +
  "<div>\\author{Author\\can also be\\multiline}</div>\n" +
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
  "<div>Inline math $\\vec { F } = m \\vec { a }$ and this (ax^2 + bx + c = 0)</div>\n" +
  "<div>$$<br>\n" +
  "x = \\frac { - b \\pm \\sqrt { b ^ { 2 } - 4 a c } } { 2 a }<br>\n" +
  "$$</div>\n" +
  "<div>[<br>\n" +
  "y = \\frac { \\sum _ { i } w _ { i } y _ { i } } { \\sum _ { i } w _ { i } } , i = 1,2 \\ldots k<br>\n" +
  "]</div>\n" +
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
  "\\int_0^\\infty \\frac{x<sup>3}{e</sup>x-1},dx = \\frac{\\pi^4}{15}<br>\n" +
  "\\label{eq:1}<br>\n" +
  "\\end{equation}</div>\n" +
  "<div>\\begin{equation}<br>\n" +
  "| x + y | \\geq | | x | | - | y | |<br>\n" +
  "\\label{eq:2}<br>\n" +
  "\\end{equation}</div>\n" +
  "<div>$$<br>\n" +
  "\\frac{x\\left(x^{2 n}-x^{-2 n}\\right)}{x^{2 n}+x^{-2 n}}<br>\n" +
  "\\tag{1.1}<br>\n" +
  "$$</div>\n" +
  "<div>\\begin{equation}<br>\n" +
  "\\max <em>{\\theta} \\mathbb{E}</em>{\\mathbf{z} \\sim \\mathcal{Z}<em>{T}}\\left[\\sum</em>{t=1}^{T} \\log p_{\\theta}\\left(x_{z_{t}} | \\mathbf{x}<em>{\\mathbf{z}</em>{&lt;t}}\\right)\\right]<br>\n" +
  "\\tag{1.2}<br>\n" +
  "\\end{equation}</div>\n" +
  "<div>Look at the Equation \\ref{eq:2}<br>\n" +
  "Ref in math mode $\\ref{eq:2}$</div>\n" +
  "<div>\\begin{split}<br>\n" +
  "a&amp; =b+c-d\\<br>\n" +
  "&amp; \\quad +e-f\\<br>\n" +
  "&amp; =g+h\\<br>\n" +
  "&amp; =i<br>\n" +
  "\\end{split}</div>\n" +
  "<div>\\begin{gather}<br>\n" +
  "a_1=b_1+c_1\\<br>\n" +
  "a_2=b_2+c_2-d_2+e_2<br>\n" +
  "\\end{gather}</div>\n" +
  "<div>\\begin{gather*}<br>\n" +
  "a_1=b_1+c_1\\<br>\n" +
  "a_2=b_2+c_2-d_2+e_2<br>\n" +
  "\\end{gather*}</div>\n" +
  "<div>Use <code>\\url{}</code> to insert a \\url{link}.</div>\n" +
  "<div>\\begin{table}[h!]<br>\n" +
  "\\centering</div>\n" +
  "<div>\\begin{tabular}{||c c c c||}<br>\n" +
  "\\hline<br>\n" +
  "Col1 &amp; Col2 &amp; Col2 &amp; Col3 \\ [0.5ex]<br>\n" +
  "\\hline\\hline<br>\n" +
  "1 &amp; 6 &amp; 87837 &amp; 787 \\<br>\n" +
  "2 &amp; 7 &amp; 78 &amp; 5415 \\<br>\n" +
  "3 &amp; 545 &amp; 778 &amp; 7507 \\<br>\n" +
  "4 &amp; 545 &amp; 18744 &amp; 7560 \\<br>\n" +
  "5 &amp; 88 &amp; 788 &amp; 6344 \\ [1ex]<br>\n" +
  "\\hline<br>\n" +
  "\\end{tabular}</div>\n" +
  "<div>\\end{table}</div>\n" +
  "<div>The table \\ref{table:1} is an example of referenced \\LaTeX elements.</div>\n" +
  "<div>\\begin{table}[h!]<br>\n" +
  "\\centering</div>\n" +
  "<div>\\begin{tabular}{||c c c c||}<br>\n" +
  "\\hline<br>\n" +
  "Col1 &amp; Col2 &amp; Col2 &amp; Col3 \\ [0.5ex]<br>\n" +
  "\\hline\\hline<br>\n" +
  "1 &amp; 6 &amp; 87837 &amp; 787 \\<br>\n" +
  "2 &amp; 7 &amp; 78 &amp; 5415 \\<br>\n" +
  "3 &amp; 545 &amp; 778 &amp; 7507 \\<br>\n" +
  "4 &amp; 545 &amp; 18744 &amp; 7560 \\<br>\n" +
  "5 &amp; 88 &amp; 788 &amp; 6344 \\ [1ex]<br>\n" +
  "\\hline<br>\n" +
  "\\end{tabular}</div>\n" +
  "<div>\\caption{Table to test captions and labels}<br>\n" +
  "\\label{table:1}<br>\n" +
  "\\end{table}</div>\n" +
  "<div>The figure \\ref{fig:figure1}</div>\n" +
  "<div>\\begin{figure}<br>\n" +
  "\\includegraphics[width=350px, height=70px, right]{<a href=\"https://cdn.mathpix.com/snip/images/-HM3WXo8kgdk8VtayBtn1_pJlgq9Cb7qV4JtM47Hgn0.original.fullsize.png\" target=\"_blank\" rel=\"noopener\" style=\"word-break: break-all\">https://cdn.mathpix.com/snip/images/-HM3WXo8kgdk8VtayBtn1_pJlgq9Cb7qV4JtM47Hgn0.original.fullsize.png</a>}<br>\n" +
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
  "Let (f) be a function whose derivative exists in every point, then (f)<br>\n" +
  "is a continuous function.<br>\n" +
  "\\end{theorem}</div>\n" +
  "<div>\\setcounter{theorem}{0}</div>\n" +
  "<div>\\begin{theorem}<br>\n" +
  "Let (f) be a function whose derivative exists in every point, then (f)<br>\n" +
  "is a continuous function.<br>\n" +
  "\\end{theorem}</div>\n" +
  "<div>\\setcounter{theorem}{-3}</div>\n" +
  "<div>\\begin{theorem}<br>\n" +
  "Let (f) be a function whose derivative exists in every point, then (f)<br>\n" +
  "is a continuous function.<br>\n" +
  "\\end{theorem}</div>\n" +
  "<div>\\section{Introduction}</div>\n" +
  "<div>\\begin{lemma}<br>\n" +
  "Given two line segments whose lengths are (a) and (b) respectively there<br>\n" +
  "is a real number (r) such that (b=ra).<br>\n" +
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
  "({ }^{0}) Compared to V1, this draft includes better baselines, experiments on GLUE, and more on adapter latency.<br>\n" +
  "}</div>\n" +
  "<div>\\footnotetext{<br>\n" +
  "({ }^{0}) Compared to V1, this draft includes better baselines, experiments on GLUE, and more on adapter latency.<br>\n" +
  "}</div>\n" +
  "<div>\\footnotetext{<br>\n" +
  "({ }^{1}) While GPT-3 175B achieves non-trivial performance with few-shot learning, fine-tuning boosts its performance significantly as shown in Appendix A<br>\n" +
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
  "<div><div class=\"smiles-inline\" style=\"display: inline-block\"><svg id=\"smiles-\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 249 177.4424529586994\" style=\"width: 248.9026083639194px; overflow: visible;\"><defs><linearGradient id=\"line-0\" gradientUnits=\"userSpaceOnUse\" x1=\"164.62123528560298\" y1=\"156.7387911520632\" x2=\"167.91388187853403\" y2=\"125.41135144796257\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-1\" gradientUnits=\"userSpaceOnUse\" x1=\"158.98229613886485\" y1=\"156.1461147653356\" x2=\"162.27494273179593\" y2=\"124.81867506123498\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-2\" gradientUnits=\"userSpaceOnUse\" x1=\"165.09441230516498\" y1=\"125.11501325459878\" x2=\"192.3742125243748\" y2=\"109.36501325459878\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-3\" gradientUnits=\"userSpaceOnUse\" x1=\"141.68535030262706\" y1=\"104.03739915429476\" x2=\"165.09441230516498\" y2=\"125.11501325459878\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-4\" gradientUnits=\"userSpaceOnUse\" x1=\"185.82499426361537\" y1=\"78.55336383148389\" x2=\"192.3742125243748\" y2=\"109.36501325459878\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-5\" gradientUnits=\"userSpaceOnUse\" x1=\"110.35791059852644\" y1=\"107.33004574722585\" x2=\"141.68535030262706\" y2=\"104.03739915429476\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-6\" gradientUnits=\"userSpaceOnUse\" x1=\"141.68535030262706\" y1=\"104.03739915429476\" x2=\"154.49755455951475\" y2=\"75.26071723855281\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-7\" gradientUnits=\"userSpaceOnUse\" x1=\"187.93180984384378\" y1=\"80.45034910051126\" x2=\"209.0094239441478\" y2=\"57.04128709797333\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-8\" gradientUnits=\"userSpaceOnUse\" x1=\"183.71817868338695\" y1=\"76.65637856245654\" x2=\"204.79579278369098\" y2=\"53.24731655991861\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-9\" gradientUnits=\"userSpaceOnUse\" x1=\"154.49755455951475\" y1=\"75.26071723855281\" x2=\"185.82499426361537\" y2=\"78.55336383148389\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-10\" gradientUnits=\"userSpaceOnUse\" x1=\"91.84267515131353\" y1=\"81.84601042441501\" x2=\"110.35791059852644\" y2=\"107.33004574722585\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-11\" gradientUnits=\"userSpaceOnUse\" x1=\"94.95580496922197\" y1=\"134.9536292798479\" x2=\"107.76800922610967\" y2=\"106.17694736410596\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-12\" gradientUnits=\"userSpaceOnUse\" x1=\"100.13560771405552\" y1=\"137.25982604608765\" x2=\"112.94781197094322\" y2=\"108.48314413034574\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-13\" gradientUnits=\"userSpaceOnUse\" x1=\"135.9823191123018\" y1=\"49.77668191574196\" x2=\"154.49755455951475\" y2=\"75.26071723855281\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-14\" gradientUnits=\"userSpaceOnUse\" x1=\"60.51523544721293\" y1=\"85.13865701734613\" x2=\"91.84267515131353\" y2=\"81.84601042441501\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-15\" gradientUnits=\"userSpaceOnUse\" x1=\"91.84267515131353\" y1=\"81.84601042441501\" x2=\"104.65487940820121\" y2=\"53.06932850867308\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-16\" gradientUnits=\"userSpaceOnUse\" x1=\"138.57222048471857\" y1=\"50.92978029886185\" x2=\"151.38442474160624\" y2=\"22.15309838311989\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-17\" gradientUnits=\"userSpaceOnUse\" x1=\"133.39241773988505\" y1=\"48.62358353262207\" x2=\"146.2046219967727\" y2=\"19.84690161688011\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-18\" gradientUnits=\"userSpaceOnUse\" x1=\"104.65487940820121\" y1=\"53.06932850867308\" x2=\"135.9823191123018\" y2=\"49.77668191574196\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-19\" gradientUnits=\"userSpaceOnUse\" x1=\"42\" y1=\"59.654621694535294\" x2=\"60.51523544721293\" y2=\"85.13865701734613\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-20\" gradientUnits=\"userSpaceOnUse\" x1=\"86.13964396098828\" y1=\"27.58529318586224\" x2=\"104.65487940820121\" y2=\"53.06932850867308\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-21\" gradientUnits=\"userSpaceOnUse\" x1=\"48.14071806410013\" y1=\"59.80256731709443\" x2=\"59.03109168245466\" y2=\"35.34238768871379\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-22\" gradientUnits=\"userSpaceOnUse\" x1=\"42\" y1=\"59.654621694535294\" x2=\"54.81220425688768\" y2=\"30.877939778793362\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-23\" gradientUnits=\"userSpaceOnUse\" x1=\"54.81220425688768\" y1=\"30.877939778793362\" x2=\"86.13964396098828\" y2=\"27.58529318586224\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient></defs><mask id=\"text-mask\"><rect x=\"0\" y=\"0\" width=\"100%\" height=\"100%\" fill=\"white\"></rect><circle cx=\"161.80176571223393\" cy=\"156.4424529586994\" r=\"6.5625\" fill=\"black\"></circle><circle cx=\"192.3742125243748\" cy=\"109.36501325459878\" r=\"6.5625\" fill=\"black\"></circle><circle cx=\"206.9026083639194\" cy=\"55.14430182894597\" r=\"6.5625\" fill=\"black\"></circle><circle cx=\"148.79452336918945\" cy=\"21\" r=\"6.5625\" fill=\"black\"></circle><circle cx=\"97.54570634163875\" cy=\"136.10672766296778\" r=\"6.5625\" fill=\"black\"></circle></mask><style>\n" +
  "                .element {\n" +
  "                    font: 14px Helvetica, Arial, sans-serif;\n" +
  "                    alignment-baseline: 'middle';\n" +
  "                }\n" +
  "                .sub {\n" +
  "                    font: 8.4px Helvetica, Arial, sans-serif;\n" +
  "                }\n" +
  "            </style><g mask=\"url(#text-mask)\"><line x1=\"164.62123528560298\" y1=\"156.7387911520632\" x2=\"167.91388187853403\" y2=\"125.41135144796257\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-0')\"></line><line x1=\"158.98229613886485\" y1=\"156.1461147653356\" x2=\"162.27494273179593\" y2=\"124.81867506123498\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-1')\"></line><line x1=\"165.09441230516498\" y1=\"125.11501325459878\" x2=\"192.3742125243748\" y2=\"109.36501325459878\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-2')\"></line><line x1=\"141.68535030262706\" y1=\"104.03739915429476\" x2=\"165.09441230516498\" y2=\"125.11501325459878\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-3')\"></line><line x1=\"185.82499426361537\" y1=\"78.55336383148389\" x2=\"192.3742125243748\" y2=\"109.36501325459878\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-4')\"></line><line x1=\"110.35791059852644\" y1=\"107.33004574722585\" x2=\"141.68535030262706\" y2=\"104.03739915429476\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-5')\"></line><line x1=\"141.68535030262706\" y1=\"104.03739915429476\" x2=\"154.49755455951475\" y2=\"75.26071723855281\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-6')\"></line><line x1=\"187.93180984384378\" y1=\"80.45034910051126\" x2=\"209.0094239441478\" y2=\"57.04128709797333\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-7')\"></line><line x1=\"183.71817868338695\" y1=\"76.65637856245654\" x2=\"204.79579278369098\" y2=\"53.24731655991861\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-8')\"></line><line x1=\"154.49755455951475\" y1=\"75.26071723855281\" x2=\"185.82499426361537\" y2=\"78.55336383148389\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-9')\"></line><line x1=\"91.84267515131353\" y1=\"81.84601042441501\" x2=\"110.35791059852644\" y2=\"107.33004574722585\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-10')\"></line><line x1=\"94.95580496922197\" y1=\"134.9536292798479\" x2=\"107.76800922610967\" y2=\"106.17694736410596\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-11')\"></line><line x1=\"100.13560771405552\" y1=\"137.25982604608765\" x2=\"112.94781197094322\" y2=\"108.48314413034574\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-12')\"></line><line x1=\"135.9823191123018\" y1=\"49.77668191574196\" x2=\"154.49755455951475\" y2=\"75.26071723855281\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-13')\"></line><line x1=\"60.51523544721293\" y1=\"85.13865701734613\" x2=\"91.84267515131353\" y2=\"81.84601042441501\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-14')\"></line><line x1=\"91.84267515131353\" y1=\"81.84601042441501\" x2=\"104.65487940820121\" y2=\"53.06932850867308\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-15')\"></line><line x1=\"138.57222048471857\" y1=\"50.92978029886185\" x2=\"151.38442474160624\" y2=\"22.15309838311989\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-16')\"></line><line x1=\"133.39241773988505\" y1=\"48.62358353262207\" x2=\"146.2046219967727\" y2=\"19.84690161688011\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-17')\"></line><line x1=\"104.65487940820121\" y1=\"53.06932850867308\" x2=\"135.9823191123018\" y2=\"49.77668191574196\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-18')\"></line><line x1=\"42\" y1=\"59.654621694535294\" x2=\"60.51523544721293\" y2=\"85.13865701734613\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-19')\"></line><line x1=\"86.13964396098828\" y1=\"27.58529318586224\" x2=\"104.65487940820121\" y2=\"53.06932850867308\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-20')\"></line><line x1=\"48.14071806410013\" y1=\"59.80256731709443\" x2=\"59.03109168245466\" y2=\"35.34238768871379\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-21')\"></line><line x1=\"42\" y1=\"59.654621694535294\" x2=\"54.81220425688768\" y2=\"30.877939778793362\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-22')\"></line><line x1=\"54.81220425688768\" y1=\"30.877939778793362\" x2=\"86.13964396098828\" y2=\"27.58529318586224\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-23')\"></line></g><g><text x=\"156.55176571223393\" y=\"161.6924529586994\" class=\"element\" fill=\"#222\" style=\"\n" +
  "                text-anchor: start;\n" +
  "                writing-mode: horizontal-tb;\n" +
  "                text-orientation: mixed;\n" +
  "                letter-spacing: normal;\n" +
  "                direction: ltr;\n" +
  "            \"><tspan>O</tspan></text><text x=\"161.80176571223393\" y=\"156.4424529586994\" class=\"debug\" fill=\"#ff0000\" style=\"\n" +
  "                font: 5px Droid Sans, sans-serif;\n" +
  "            \"></text><text x=\"165.09441230516498\" y=\"125.11501325459878\" class=\"debug\" fill=\"#ff0000\" style=\"\n" +
  "                font: 5px Droid Sans, sans-serif;\n" +
  "            \"></text><text x=\"188.4367125243748\" y=\"114.61501325459878\" class=\"element\" fill=\"#222\" style=\"\n" +
  "                text-anchor: start;\n" +
  "                writing-mode: horizontal-tb;\n" +
  "                text-orientation: mixed;\n" +
  "                letter-spacing: normal;\n" +
  "                direction: ltr;\n" +
  "            \"><tspan>O</tspan></text><text x=\"192.3742125243748\" y=\"109.36501325459878\" class=\"debug\" fill=\"#ff0000\" style=\"\n" +
  "                font: 5px Droid Sans, sans-serif;\n" +
  "            \"></text><text x=\"185.82499426361537\" y=\"78.55336383148389\" class=\"debug\" fill=\"#ff0000\" style=\"\n" +
  "                font: 5px Droid Sans, sans-serif;\n" +
  "            \"></text><text x=\"201.6526083639194\" y=\"60.39430182894597\" class=\"element\" fill=\"#222\" style=\"\n" +
  "                text-anchor: start;\n" +
  "                writing-mode: horizontal-tb;\n" +
  "                text-orientation: mixed;\n" +
  "                letter-spacing: normal;\n" +
  "                direction: ltr;\n" +
  "            \"><tspan>O</tspan></text><text x=\"206.9026083639194\" y=\"55.14430182894597\" class=\"debug\" fill=\"#ff0000\" style=\"\n" +
  "                font: 5px Droid Sans, sans-serif;\n" +
  "            \"></text><text x=\"154.49755455951475\" y=\"75.26071723855281\" class=\"debug\" fill=\"#ff0000\" style=\"\n" +
  "                font: 5px Droid Sans, sans-serif;\n" +
  "            \"></text><text x=\"135.9823191123018\" y=\"49.77668191574196\" class=\"debug\" fill=\"#ff0000\" style=\"\n" +
  "                font: 5px Droid Sans, sans-serif;\n" +
  "            \"></text><text x=\"143.54452336918945\" y=\"26.25\" class=\"element\" fill=\"#222\" style=\"\n" +
  "                text-anchor: start;\n" +
  "                writing-mode: horizontal-tb;\n" +
  "                text-orientation: mixed;\n" +
  "                letter-spacing: normal;\n" +
  "                direction: ltr;\n" +
  "            \"><tspan>O</tspan></text><text x=\"148.79452336918945\" y=\"21\" class=\"debug\" fill=\"#ff0000\" style=\"\n" +
  "                font: 5px Droid Sans, sans-serif;\n" +
  "            \"></text><text x=\"104.65487940820121\" y=\"53.06932850867308\" class=\"debug\" fill=\"#ff0000\" style=\"\n" +
  "                font: 5px Droid Sans, sans-serif;\n" +
  "            \"></text><text x=\"86.13964396098828\" y=\"27.58529318586224\" class=\"debug\" fill=\"#ff0000\" style=\"\n" +
  "                font: 5px Droid Sans, sans-serif;\n" +
  "            \"></text><text x=\"54.81220425688768\" y=\"30.877939778793362\" class=\"debug\" fill=\"#ff0000\" style=\"\n" +
  "                font: 5px Droid Sans, sans-serif;\n" +
  "            \"></text><text x=\"42\" y=\"59.654621694535294\" class=\"debug\" fill=\"#ff0000\" style=\"\n" +
  "                font: 5px Droid Sans, sans-serif;\n" +
  "            \"></text><text x=\"60.51523544721293\" y=\"85.13865701734613\" class=\"debug\" fill=\"#ff0000\" style=\"\n" +
  "                font: 5px Droid Sans, sans-serif;\n" +
  "            \"></text><text x=\"91.84267515131353\" y=\"81.84601042441501\" class=\"debug\" fill=\"#ff0000\" style=\"\n" +
  "                font: 5px Droid Sans, sans-serif;\n" +
  "            \"></text><text x=\"110.35791059852644\" y=\"107.33004574722585\" class=\"debug\" fill=\"#ff0000\" style=\"\n" +
  "                font: 5px Droid Sans, sans-serif;\n" +
  "            \"></text><text x=\"92.29570634163875\" y=\"141.35672766296778\" class=\"element\" fill=\"#222\" style=\"\n" +
  "                text-anchor: start;\n" +
  "                writing-mode: horizontal-tb;\n" +
  "                text-orientation: mixed;\n" +
  "                letter-spacing: normal;\n" +
  "                direction: ltr;\n" +
  "            \"><tspan>O</tspan></text><text x=\"97.54570634163875\" y=\"136.10672766296778\" class=\"debug\" fill=\"#ff0000\" style=\"\n" +
  "                font: 5px Droid Sans, sans-serif;\n" +
  "            \"></text><text x=\"141.68535030262706\" y=\"104.03739915429476\" class=\"debug\" fill=\"#ff0000\" style=\"\n" +
  "                font: 5px Droid Sans, sans-serif;\n" +
  "            \"></text></g></svg></div></div>\n" +
  "<div><div class=\"smiles\"><svg id=\"smiles-\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 249 177.4424529586994\" style=\"width: 248.9026083639194px; overflow: visible;\"><defs><linearGradient id=\"line-0\" gradientUnits=\"userSpaceOnUse\" x1=\"164.62123528560298\" y1=\"156.7387911520632\" x2=\"167.91388187853403\" y2=\"125.41135144796257\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-1\" gradientUnits=\"userSpaceOnUse\" x1=\"158.98229613886485\" y1=\"156.1461147653356\" x2=\"162.27494273179593\" y2=\"124.81867506123498\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-2\" gradientUnits=\"userSpaceOnUse\" x1=\"165.09441230516498\" y1=\"125.11501325459878\" x2=\"192.3742125243748\" y2=\"109.36501325459878\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-3\" gradientUnits=\"userSpaceOnUse\" x1=\"141.68535030262706\" y1=\"104.03739915429476\" x2=\"165.09441230516498\" y2=\"125.11501325459878\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-4\" gradientUnits=\"userSpaceOnUse\" x1=\"185.82499426361537\" y1=\"78.55336383148389\" x2=\"192.3742125243748\" y2=\"109.36501325459878\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-5\" gradientUnits=\"userSpaceOnUse\" x1=\"110.35791059852644\" y1=\"107.33004574722585\" x2=\"141.68535030262706\" y2=\"104.03739915429476\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-6\" gradientUnits=\"userSpaceOnUse\" x1=\"141.68535030262706\" y1=\"104.03739915429476\" x2=\"154.49755455951475\" y2=\"75.26071723855281\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-7\" gradientUnits=\"userSpaceOnUse\" x1=\"187.93180984384378\" y1=\"80.45034910051126\" x2=\"209.0094239441478\" y2=\"57.04128709797333\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-8\" gradientUnits=\"userSpaceOnUse\" x1=\"183.71817868338695\" y1=\"76.65637856245654\" x2=\"204.79579278369098\" y2=\"53.24731655991861\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-9\" gradientUnits=\"userSpaceOnUse\" x1=\"154.49755455951475\" y1=\"75.26071723855281\" x2=\"185.82499426361537\" y2=\"78.55336383148389\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-10\" gradientUnits=\"userSpaceOnUse\" x1=\"91.84267515131353\" y1=\"81.84601042441501\" x2=\"110.35791059852644\" y2=\"107.33004574722585\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-11\" gradientUnits=\"userSpaceOnUse\" x1=\"94.95580496922197\" y1=\"134.9536292798479\" x2=\"107.76800922610967\" y2=\"106.17694736410596\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-12\" gradientUnits=\"userSpaceOnUse\" x1=\"100.13560771405552\" y1=\"137.25982604608765\" x2=\"112.94781197094322\" y2=\"108.48314413034574\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-13\" gradientUnits=\"userSpaceOnUse\" x1=\"135.9823191123018\" y1=\"49.77668191574196\" x2=\"154.49755455951475\" y2=\"75.26071723855281\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-14\" gradientUnits=\"userSpaceOnUse\" x1=\"60.51523544721293\" y1=\"85.13865701734613\" x2=\"91.84267515131353\" y2=\"81.84601042441501\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-15\" gradientUnits=\"userSpaceOnUse\" x1=\"91.84267515131353\" y1=\"81.84601042441501\" x2=\"104.65487940820121\" y2=\"53.06932850867308\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-16\" gradientUnits=\"userSpaceOnUse\" x1=\"138.57222048471857\" y1=\"50.92978029886185\" x2=\"151.38442474160624\" y2=\"22.15309838311989\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-17\" gradientUnits=\"userSpaceOnUse\" x1=\"133.39241773988505\" y1=\"48.62358353262207\" x2=\"146.2046219967727\" y2=\"19.84690161688011\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-18\" gradientUnits=\"userSpaceOnUse\" x1=\"104.65487940820121\" y1=\"53.06932850867308\" x2=\"135.9823191123018\" y2=\"49.77668191574196\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-19\" gradientUnits=\"userSpaceOnUse\" x1=\"42\" y1=\"59.654621694535294\" x2=\"60.51523544721293\" y2=\"85.13865701734613\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-20\" gradientUnits=\"userSpaceOnUse\" x1=\"86.13964396098828\" y1=\"27.58529318586224\" x2=\"104.65487940820121\" y2=\"53.06932850867308\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-21\" gradientUnits=\"userSpaceOnUse\" x1=\"48.14071806410013\" y1=\"59.80256731709443\" x2=\"59.03109168245466\" y2=\"35.34238768871379\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-22\" gradientUnits=\"userSpaceOnUse\" x1=\"42\" y1=\"59.654621694535294\" x2=\"54.81220425688768\" y2=\"30.877939778793362\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient><linearGradient id=\"line-23\" gradientUnits=\"userSpaceOnUse\" x1=\"54.81220425688768\" y1=\"30.877939778793362\" x2=\"86.13964396098828\" y2=\"27.58529318586224\"><stop stop-color=\"#222\" offset=\"20%\"></stop><stop stop-color=\"#222\" offset=\"100%\"></stop></linearGradient></defs><mask id=\"text-mask\"><rect x=\"0\" y=\"0\" width=\"100%\" height=\"100%\" fill=\"white\"></rect><circle cx=\"161.80176571223393\" cy=\"156.4424529586994\" r=\"6.5625\" fill=\"black\"></circle><circle cx=\"192.3742125243748\" cy=\"109.36501325459878\" r=\"6.5625\" fill=\"black\"></circle><circle cx=\"206.9026083639194\" cy=\"55.14430182894597\" r=\"6.5625\" fill=\"black\"></circle><circle cx=\"148.79452336918945\" cy=\"21\" r=\"6.5625\" fill=\"black\"></circle><circle cx=\"97.54570634163875\" cy=\"136.10672766296778\" r=\"6.5625\" fill=\"black\"></circle></mask><style>\n" +
  "                .element {\n" +
  "                    font: 14px Helvetica, Arial, sans-serif;\n" +
  "                    alignment-baseline: 'middle';\n" +
  "                }\n" +
  "                .sub {\n" +
  "                    font: 8.4px Helvetica, Arial, sans-serif;\n" +
  "                }\n" +
  "            </style><g mask=\"url(#text-mask)\"><line x1=\"164.62123528560298\" y1=\"156.7387911520632\" x2=\"167.91388187853403\" y2=\"125.41135144796257\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-0')\"></line><line x1=\"158.98229613886485\" y1=\"156.1461147653356\" x2=\"162.27494273179593\" y2=\"124.81867506123498\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-1')\"></line><line x1=\"165.09441230516498\" y1=\"125.11501325459878\" x2=\"192.3742125243748\" y2=\"109.36501325459878\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-2')\"></line><line x1=\"141.68535030262706\" y1=\"104.03739915429476\" x2=\"165.09441230516498\" y2=\"125.11501325459878\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-3')\"></line><line x1=\"185.82499426361537\" y1=\"78.55336383148389\" x2=\"192.3742125243748\" y2=\"109.36501325459878\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-4')\"></line><line x1=\"110.35791059852644\" y1=\"107.33004574722585\" x2=\"141.68535030262706\" y2=\"104.03739915429476\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-5')\"></line><line x1=\"141.68535030262706\" y1=\"104.03739915429476\" x2=\"154.49755455951475\" y2=\"75.26071723855281\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-6')\"></line><line x1=\"187.93180984384378\" y1=\"80.45034910051126\" x2=\"209.0094239441478\" y2=\"57.04128709797333\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-7')\"></line><line x1=\"183.71817868338695\" y1=\"76.65637856245654\" x2=\"204.79579278369098\" y2=\"53.24731655991861\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-8')\"></line><line x1=\"154.49755455951475\" y1=\"75.26071723855281\" x2=\"185.82499426361537\" y2=\"78.55336383148389\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-9')\"></line><line x1=\"91.84267515131353\" y1=\"81.84601042441501\" x2=\"110.35791059852644\" y2=\"107.33004574722585\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-10')\"></line><line x1=\"94.95580496922197\" y1=\"134.9536292798479\" x2=\"107.76800922610967\" y2=\"106.17694736410596\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-11')\"></line><line x1=\"100.13560771405552\" y1=\"137.25982604608765\" x2=\"112.94781197094322\" y2=\"108.48314413034574\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-12')\"></line><line x1=\"135.9823191123018\" y1=\"49.77668191574196\" x2=\"154.49755455951475\" y2=\"75.26071723855281\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-13')\"></line><line x1=\"60.51523544721293\" y1=\"85.13865701734613\" x2=\"91.84267515131353\" y2=\"81.84601042441501\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-14')\"></line><line x1=\"91.84267515131353\" y1=\"81.84601042441501\" x2=\"104.65487940820121\" y2=\"53.06932850867308\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-15')\"></line><line x1=\"138.57222048471857\" y1=\"50.92978029886185\" x2=\"151.38442474160624\" y2=\"22.15309838311989\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-16')\"></line><line x1=\"133.39241773988505\" y1=\"48.62358353262207\" x2=\"146.2046219967727\" y2=\"19.84690161688011\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-17')\"></line><line x1=\"104.65487940820121\" y1=\"53.06932850867308\" x2=\"135.9823191123018\" y2=\"49.77668191574196\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-18')\"></line><line x1=\"42\" y1=\"59.654621694535294\" x2=\"60.51523544721293\" y2=\"85.13865701734613\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-19')\"></line><line x1=\"86.13964396098828\" y1=\"27.58529318586224\" x2=\"104.65487940820121\" y2=\"53.06932850867308\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-20')\"></line><line x1=\"48.14071806410013\" y1=\"59.80256731709443\" x2=\"59.03109168245466\" y2=\"35.34238768871379\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-21')\"></line><line x1=\"42\" y1=\"59.654621694535294\" x2=\"54.81220425688768\" y2=\"30.877939778793362\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-22')\"></line><line x1=\"54.81220425688768\" y1=\"30.877939778793362\" x2=\"86.13964396098828\" y2=\"27.58529318586224\" style=\"stroke-linecap:round;stroke-dasharray:none;stroke-width:1.26\" stroke=\"url('#line-23')\"></line></g><g><text x=\"156.55176571223393\" y=\"161.6924529586994\" class=\"element\" fill=\"#222\" style=\"\n" +
  "                text-anchor: start;\n" +
  "                writing-mode: horizontal-tb;\n" +
  "                text-orientation: mixed;\n" +
  "                letter-spacing: normal;\n" +
  "                direction: ltr;\n" +
  "            \"><tspan>O</tspan></text><text x=\"161.80176571223393\" y=\"156.4424529586994\" class=\"debug\" fill=\"#ff0000\" style=\"\n" +
  "                font: 5px Droid Sans, sans-serif;\n" +
  "            \"></text><text x=\"165.09441230516498\" y=\"125.11501325459878\" class=\"debug\" fill=\"#ff0000\" style=\"\n" +
  "                font: 5px Droid Sans, sans-serif;\n" +
  "            \"></text><text x=\"188.4367125243748\" y=\"114.61501325459878\" class=\"element\" fill=\"#222\" style=\"\n" +
  "                text-anchor: start;\n" +
  "                writing-mode: horizontal-tb;\n" +
  "                text-orientation: mixed;\n" +
  "                letter-spacing: normal;\n" +
  "                direction: ltr;\n" +
  "            \"><tspan>O</tspan></text><text x=\"192.3742125243748\" y=\"109.36501325459878\" class=\"debug\" fill=\"#ff0000\" style=\"\n" +
  "                font: 5px Droid Sans, sans-serif;\n" +
  "            \"></text><text x=\"185.82499426361537\" y=\"78.55336383148389\" class=\"debug\" fill=\"#ff0000\" style=\"\n" +
  "                font: 5px Droid Sans, sans-serif;\n" +
  "            \"></text><text x=\"201.6526083639194\" y=\"60.39430182894597\" class=\"element\" fill=\"#222\" style=\"\n" +
  "                text-anchor: start;\n" +
  "                writing-mode: horizontal-tb;\n" +
  "                text-orientation: mixed;\n" +
  "                letter-spacing: normal;\n" +
  "                direction: ltr;\n" +
  "            \"><tspan>O</tspan></text><text x=\"206.9026083639194\" y=\"55.14430182894597\" class=\"debug\" fill=\"#ff0000\" style=\"\n" +
  "                font: 5px Droid Sans, sans-serif;\n" +
  "            \"></text><text x=\"154.49755455951475\" y=\"75.26071723855281\" class=\"debug\" fill=\"#ff0000\" style=\"\n" +
  "                font: 5px Droid Sans, sans-serif;\n" +
  "            \"></text><text x=\"135.9823191123018\" y=\"49.77668191574196\" class=\"debug\" fill=\"#ff0000\" style=\"\n" +
  "                font: 5px Droid Sans, sans-serif;\n" +
  "            \"></text><text x=\"143.54452336918945\" y=\"26.25\" class=\"element\" fill=\"#222\" style=\"\n" +
  "                text-anchor: start;\n" +
  "                writing-mode: horizontal-tb;\n" +
  "                text-orientation: mixed;\n" +
  "                letter-spacing: normal;\n" +
  "                direction: ltr;\n" +
  "            \"><tspan>O</tspan></text><text x=\"148.79452336918945\" y=\"21\" class=\"debug\" fill=\"#ff0000\" style=\"\n" +
  "                font: 5px Droid Sans, sans-serif;\n" +
  "            \"></text><text x=\"104.65487940820121\" y=\"53.06932850867308\" class=\"debug\" fill=\"#ff0000\" style=\"\n" +
  "                font: 5px Droid Sans, sans-serif;\n" +
  "            \"></text><text x=\"86.13964396098828\" y=\"27.58529318586224\" class=\"debug\" fill=\"#ff0000\" style=\"\n" +
  "                font: 5px Droid Sans, sans-serif;\n" +
  "            \"></text><text x=\"54.81220425688768\" y=\"30.877939778793362\" class=\"debug\" fill=\"#ff0000\" style=\"\n" +
  "                font: 5px Droid Sans, sans-serif;\n" +
  "            \"></text><text x=\"42\" y=\"59.654621694535294\" class=\"debug\" fill=\"#ff0000\" style=\"\n" +
  "                font: 5px Droid Sans, sans-serif;\n" +
  "            \"></text><text x=\"60.51523544721293\" y=\"85.13865701734613\" class=\"debug\" fill=\"#ff0000\" style=\"\n" +
  "                font: 5px Droid Sans, sans-serif;\n" +
  "            \"></text><text x=\"91.84267515131353\" y=\"81.84601042441501\" class=\"debug\" fill=\"#ff0000\" style=\"\n" +
  "                font: 5px Droid Sans, sans-serif;\n" +
  "            \"></text><text x=\"110.35791059852644\" y=\"107.33004574722585\" class=\"debug\" fill=\"#ff0000\" style=\"\n" +
  "                font: 5px Droid Sans, sans-serif;\n" +
  "            \"></text><text x=\"92.29570634163875\" y=\"141.35672766296778\" class=\"element\" fill=\"#222\" style=\"\n" +
  "                text-anchor: start;\n" +
  "                writing-mode: horizontal-tb;\n" +
  "                text-orientation: mixed;\n" +
  "                letter-spacing: normal;\n" +
  "                direction: ltr;\n" +
  "            \"><tspan>O</tspan></text><text x=\"97.54570634163875\" y=\"136.10672766296778\" class=\"debug\" fill=\"#ff0000\" style=\"\n" +
  "                font: 5px Droid Sans, sans-serif;\n" +
  "            \"></text><text x=\"141.68535030262706\" y=\"104.03739915429476\" class=\"debug\" fill=\"#ff0000\" style=\"\n" +
  "                font: 5px Droid Sans, sans-serif;\n" +
  "            \"></text></g></svg></div></div><div><span class=\"math-inline ascii\">\n" +
  "<mjx-container class=\"MathJax\" jax=\"SVG\"><svg style=\"vertical-align: -2.827ex;\" xmlns=\"http://www.w3.org/2000/svg\" width=\"16.806ex\" height=\"6.785ex\" role=\"img\" focusable=\"false\" viewBox=\"0 -1749.5 7428.2 2999\"><g stroke=\"currentColor\" fill=\"currentColor\" stroke-width=\"0\" transform=\"scale(1,-1)\"><g data-mml-node=\"math\"><g data-mml-node=\"mstyle\"><g data-mml-node=\"mrow\"><g data-mml-node=\"mi\"><path data-c=\"73\" d=\"M295 316Q295 356 268 385T190 414Q154 414 128 401Q98 382 98 349Q97 344 98 336T114 312T157 287Q175 282 201 278T245 269T277 256Q294 248 310 236T342 195T359 133Q359 71 321 31T198 -10H190Q138 -10 94 26L86 19L77 10Q71 4 65 -1L54 -11H46H42Q39 -11 33 -5V74V132Q33 153 35 157T45 162H54Q66 162 70 158T75 146T82 119T101 77Q136 26 198 26Q295 26 295 104Q295 133 277 151Q257 175 194 187T111 210Q75 227 54 256T33 318Q33 357 50 384T93 424T143 442T187 447H198Q238 447 268 432L283 424L292 431Q302 440 314 448H322H326Q329 448 335 442V310L329 304H301Q295 310 295 316Z\"></path><path data-c=\"69\" d=\"M69 609Q69 637 87 653T131 669Q154 667 171 652T188 609Q188 579 171 564T129 549Q104 549 87 564T69 609ZM247 0Q232 3 143 3Q132 3 106 3T56 1L34 0H26V46H42Q70 46 91 49Q100 53 102 60T104 102V205V293Q104 345 102 359T88 378Q74 385 41 385H30V408Q30 431 32 431L42 432Q52 433 70 434T106 436Q123 437 142 438T171 441T182 442H185V62Q190 52 197 50T232 46H255V0H247Z\" transform=\"translate(394,0)\"></path><path data-c=\"6E\" d=\"M41 46H55Q94 46 102 60V68Q102 77 102 91T102 122T103 161T103 203Q103 234 103 269T102 328V351Q99 370 88 376T43 385H25V408Q25 431 27 431L37 432Q47 433 65 434T102 436Q119 437 138 438T167 441T178 442H181V402Q181 364 182 364T187 369T199 384T218 402T247 421T285 437Q305 442 336 442Q450 438 463 329Q464 322 464 190V104Q464 66 466 59T477 49Q498 46 526 46H542V0H534L510 1Q487 2 460 2T422 3Q319 3 310 0H302V46H318Q379 46 379 62Q380 64 380 200Q379 335 378 343Q372 371 358 385T334 402T308 404Q263 404 229 370Q202 343 195 315T187 232V168V108Q187 78 188 68T191 55T200 49Q221 46 249 46H265V0H257L234 1Q210 2 183 2T145 3Q42 3 33 0H25V46H41Z\" transform=\"translate(672,0)\"></path></g><g data-mml-node=\"mrow\" transform=\"translate(1228,0)\"><g data-mml-node=\"mo\" transform=\"translate(0 -0.5)\"><path data-c=\"28\" d=\"M758 -1237T758 -1240T752 -1249H736Q718 -1249 717 -1248Q711 -1245 672 -1199Q237 -706 237 251T672 1700Q697 1730 716 1749Q718 1750 735 1750H752Q758 1744 758 1741Q758 1737 740 1713T689 1644T619 1537T540 1380T463 1176Q348 802 348 251Q348 -242 441 -599T744 -1218Q758 -1237 758 -1240Z\"></path></g><g data-mml-node=\"mfrac\" transform=\"translate(792,0)\"><g data-mml-node=\"mrow\" transform=\"translate(2058.1,676)\"><g data-mml-node=\"mn\"><path data-c=\"34\" d=\"M462 0Q444 3 333 3Q217 3 199 0H190V46H221Q241 46 248 46T265 48T279 53T286 61Q287 63 287 115V165H28V211L179 442Q332 674 334 675Q336 677 355 677H373L379 671V211H471V165H379V114Q379 73 379 66T385 54Q393 47 442 46H471V0H462ZM293 211V545L74 212L183 211H293Z\"></path></g></g><g data-mml-node=\"mrow\" transform=\"translate(220,-832.7)\"><g data-mml-node=\"mn\"><path data-c=\"33\" d=\"M127 463Q100 463 85 480T69 524Q69 579 117 622T233 665Q268 665 277 664Q351 652 390 611T430 522Q430 470 396 421T302 350L299 348Q299 347 308 345T337 336T375 315Q457 262 457 175Q457 96 395 37T238 -22Q158 -22 100 21T42 130Q42 158 60 175T105 193Q133 193 151 175T169 130Q169 119 166 110T159 94T148 82T136 74T126 70T118 67L114 66Q165 21 238 21Q293 21 321 74Q338 107 338 175V195Q338 290 274 322Q259 328 213 329L171 330L168 332Q166 335 166 348Q166 366 174 366Q202 366 232 371Q266 376 294 413T322 525V533Q322 590 287 612Q265 626 240 626Q208 626 181 615T143 592T132 580H135Q138 579 143 578T153 573T165 566T175 555T183 540T186 520Q186 498 172 481T127 463Z\"></path></g><g data-mml-node=\"mrow\" transform=\"translate(666.7,0)\"><g data-mml-node=\"mi\"><path data-c=\"73\" d=\"M295 316Q295 356 268 385T190 414Q154 414 128 401Q98 382 98 349Q97 344 98 336T114 312T157 287Q175 282 201 278T245 269T277 256Q294 248 310 236T342 195T359 133Q359 71 321 31T198 -10H190Q138 -10 94 26L86 19L77 10Q71 4 65 -1L54 -11H46H42Q39 -11 33 -5V74V132Q33 153 35 157T45 162H54Q66 162 70 158T75 146T82 119T101 77Q136 26 198 26Q295 26 295 104Q295 133 277 151Q257 175 194 187T111 210Q75 227 54 256T33 318Q33 357 50 384T93 424T143 442T187 447H198Q238 447 268 432L283 424L292 431Q302 440 314 448H322H326Q329 448 335 442V310L329 304H301Q295 310 295 316Z\"></path><path data-c=\"69\" d=\"M69 609Q69 637 87 653T131 669Q154 667 171 652T188 609Q188 579 171 564T129 549Q104 549 87 564T69 609ZM247 0Q232 3 143 3Q132 3 106 3T56 1L34 0H26V46H42Q70 46 91 49Q100 53 102 60T104 102V205V293Q104 345 102 359T88 378Q74 385 41 385H30V408Q30 431 32 431L42 432Q52 433 70 434T106 436Q123 437 142 438T171 441T182 442H185V62Q190 52 197 50T232 46H255V0H247Z\" transform=\"translate(394,0)\"></path><path data-c=\"6E\" d=\"M41 46H55Q94 46 102 60V68Q102 77 102 91T102 122T103 161T103 203Q103 234 103 269T102 328V351Q99 370 88 376T43 385H25V408Q25 431 27 431L37 432Q47 433 65 434T102 436Q119 437 138 438T167 441T178 442H181V402Q181 364 182 364T187 369T199 384T218 402T247 421T285 437Q305 442 336 442Q450 438 463 329Q464 322 464 190V104Q464 66 466 59T477 49Q498 46 526 46H542V0H534L510 1Q487 2 460 2T422 3Q319 3 310 0H302V46H318Q379 46 379 62Q380 64 380 200Q379 335 378 343Q372 371 358 385T334 402T308 404Q263 404 229 370Q202 343 195 315T187 232V168V108Q187 78 188 68T191 55T200 49Q221 46 249 46H265V0H257L234 1Q210 2 183 2T145 3Q42 3 33 0H25V46H41Z\" transform=\"translate(672,0)\"></path></g><g data-mml-node=\"mrow\" transform=\"translate(1228,0)\"><g data-mml-node=\"mo\" transform=\"translate(0 -0.5)\"><path data-c=\"28\" d=\"M152 251Q152 646 388 850H416Q422 844 422 841Q422 837 403 816T357 753T302 649T255 482T236 250Q236 124 255 19T301 -147T356 -251T403 -315T422 -340Q422 -343 416 -349H388Q359 -325 332 -296T271 -213T212 -97T170 56T152 251Z\"></path></g><g data-mml-node=\"mfrac\" transform=\"translate(458,0)\"><g data-mml-node=\"mrow\" transform=\"translate(220,394) scale(0.707)\"><g data-mml-node=\"mn\"><path data-c=\"34\" d=\"M462 0Q444 3 333 3Q217 3 199 0H190V46H221Q241 46 248 46T265 48T279 53T286 61Q287 63 287 115V165H28V211L179 442Q332 674 334 675Q336 677 355 677H373L379 671V211H471V165H379V114Q379 73 379 66T385 54Q393 47 442 46H471V0H462ZM293 211V545L74 212L183 211H293Z\"></path></g></g><g data-mml-node=\"mrow\" transform=\"translate(220,-345) scale(0.707)\"><g data-mml-node=\"mn\"><path data-c=\"33\" d=\"M127 463Q100 463 85 480T69 524Q69 579 117 622T233 665Q268 665 277 664Q351 652 390 611T430 522Q430 470 396 421T302 350L299 348Q299 347 308 345T337 336T375 315Q457 262 457 175Q457 96 395 37T238 -22Q158 -22 100 21T42 130Q42 158 60 175T105 193Q133 193 151 175T169 130Q169 119 166 110T159 94T148 82T136 74T126 70T118 67L114 66Q165 21 238 21Q293 21 321 74Q338 107 338 175V195Q338 290 274 322Q259 328 213 329L171 330L168 332Q166 335 166 348Q166 366 174 366Q202 366 232 371Q266 376 294 413T322 525V533Q322 590 287 612Q265 626 240 626Q208 626 181 615T143 592T132 580H135Q138 579 143 578T153 573T165 566T175 555T183 540T186 520Q186 498 172 481T127 463Z\"></path></g></g><rect width=\"553.6\" height=\"60\" x=\"120\" y=\"220\"></rect></g><g data-mml-node=\"mi\" transform=\"translate(1251.6,0)\"><path data-c=\"1D465\" d=\"M52 289Q59 331 106 386T222 442Q257 442 286 424T329 379Q371 442 430 442Q467 442 494 420T522 361Q522 332 508 314T481 292T458 288Q439 288 427 299T415 328Q415 374 465 391Q454 404 425 404Q412 404 406 402Q368 386 350 336Q290 115 290 78Q290 50 306 38T341 26Q378 26 414 59T463 140Q466 150 469 151T485 153H489Q504 153 504 145Q504 144 502 134Q486 77 440 33T333 -11Q263 -11 227 52Q186 -10 133 -10H127Q78 -10 57 16T35 71Q35 103 54 123T99 143Q142 143 142 101Q142 81 130 66T107 46T94 41L91 40Q91 39 97 36T113 29T132 26Q168 26 194 71Q203 87 217 139T245 247T261 313Q266 340 266 352Q266 380 251 392T217 404Q177 404 142 372T93 290Q91 281 88 280T72 278H58Q52 284 52 289Z\"></path></g><g data-mml-node=\"mo\" transform=\"translate(1823.6,0) translate(0 -0.5)\"><path data-c=\"29\" d=\"M305 251Q305 -145 69 -349H56Q43 -349 39 -347T35 -338Q37 -333 60 -307T108 -239T160 -136T204 27T221 250T204 473T160 636T108 740T60 807T35 839Q35 850 50 850H56H69Q197 743 256 566Q305 425 305 251Z\"></path></g></g></g></g><rect width=\"4376.2\" height=\"60\" x=\"120\" y=\"220\"></rect></g><g data-mml-node=\"mo\" transform=\"translate(5408.2,0) translate(0 -0.5)\"><path data-c=\"29\" d=\"M33 1741Q33 1750 51 1750H60H65Q73 1750 81 1743T119 1700Q554 1207 554 251Q554 -707 119 -1199Q76 -1250 66 -1250Q65 -1250 62 -1250T56 -1249Q55 -1249 53 -1249T49 -1250Q33 -1250 33 -1239Q33 -1236 50 -1214T98 -1150T163 -1052T238 -910T311 -727Q443 -335 443 251Q443 402 436 532T405 831T339 1142T224 1438T50 1716Q33 1737 33 1741Z\"></path></g></g></g></g></g></g></svg></mjx-container></span></div>\n" +
  "<div><span class=\"math-block \" data-width=\"full\">\n" +
  "<mjx-container class=\"MathJax\" jax=\"SVG\" display=\"true\" width=\"full\" style=\"min-width: 30.047ex;\"><svg style=\"vertical-align: -2.183ex; min-width: 30.047ex;\" xmlns=\"http://www.w3.org/2000/svg\" width=\"100%\" height=\"5.497ex\" role=\"img\" focusable=\"false\"><g stroke=\"currentColor\" fill=\"currentColor\" stroke-width=\"0\" transform=\"scale(0.0181,-0.0181) translate(0, -1464.8)\"><g data-mml-node=\"math\"><g data-mml-node=\"mtable\" transform=\"translate(2078,0) translate(-2078,0)\"><g transform=\"translate(0 1464.8) matrix(1 0 0 -1 0 0) scale(55.25)\"><svg data-table=\"true\" preserveAspectRatio=\"xMidYMid\" viewBox=\"4562.4 -1464.8 1 2429.6\"><g transform=\"matrix(1 0 0 -1 0 0)\"><g data-mml-node=\"mlabeledtr\" transform=\"translate(0,-52.9)\"><g data-mml-node=\"mtd\"><g data-mml-node=\"msubsup\"><g data-mml-node=\"mo\" transform=\"translate(0 1)\"><path data-c=\"222B\" d=\"M114 -798Q132 -824 165 -824H167Q195 -824 223 -764T275 -600T320 -391T362 -164Q365 -143 367 -133Q439 292 523 655T645 1127Q651 1145 655 1157T672 1201T699 1257T733 1306T777 1346T828 1360Q884 1360 912 1325T944 1245Q944 1220 932 1205T909 1186T887 1183Q866 1183 849 1198T832 1239Q832 1287 885 1296L882 1300Q879 1303 874 1307T866 1313Q851 1323 833 1323Q819 1323 807 1311T775 1255T736 1139T689 936T633 628Q574 293 510 -5T410 -437T355 -629Q278 -862 165 -862Q125 -862 92 -831T55 -746Q55 -711 74 -698T112 -685Q133 -685 150 -700T167 -741Q167 -789 114 -798Z\"></path></g><g data-mml-node=\"mi\" transform=\"translate(1046.4,1088.1) scale(0.707)\"><path data-c=\"221E\" d=\"M55 217Q55 305 111 373T254 442Q342 442 419 381Q457 350 493 303L507 284L514 294Q618 442 747 442Q833 442 888 374T944 214Q944 128 889 59T743 -11Q657 -11 580 50Q542 81 506 128L492 147L485 137Q381 -11 252 -11Q166 -11 111 57T55 217ZM907 217Q907 285 869 341T761 397Q740 397 720 392T682 378T648 359T619 335T594 310T574 285T559 263T548 246L543 238L574 198Q605 158 622 138T664 94T714 61T765 51Q827 51 867 100T907 217ZM92 214Q92 145 131 89T239 33Q357 33 456 193L425 233Q364 312 334 337Q285 380 233 380Q171 380 132 331T92 214Z\"></path></g><g data-mml-node=\"mn\" transform=\"translate(589,-896.4) scale(0.707)\"><path data-c=\"30\" d=\"M96 585Q152 666 249 666Q297 666 345 640T423 548Q460 465 460 320Q460 165 417 83Q397 41 362 16T301 -15T250 -22Q224 -22 198 -16T137 16T82 83Q39 165 39 320Q39 494 96 585ZM321 597Q291 629 250 629Q208 629 178 597Q153 571 145 525T137 333Q137 175 145 125T181 46Q209 16 250 16Q290 16 318 46Q347 76 354 130T362 333Q362 478 354 524T321 597Z\"></path></g></g><g data-mml-node=\"mfrac\" transform=\"translate(1970.2,0)\"><g data-mml-node=\"msup\" transform=\"translate(1053.7,676)\"><g data-mml-node=\"mi\"><path data-c=\"1D465\" d=\"M52 289Q59 331 106 386T222 442Q257 442 286 424T329 379Q371 442 430 442Q467 442 494 420T522 361Q522 332 508 314T481 292T458 288Q439 288 427 299T415 328Q415 374 465 391Q454 404 425 404Q412 404 406 402Q368 386 350 336Q290 115 290 78Q290 50 306 38T341 26Q378 26 414 59T463 140Q466 150 469 151T485 153H489Q504 153 504 145Q504 144 502 134Q486 77 440 33T333 -11Q263 -11 227 52Q186 -10 133 -10H127Q78 -10 57 16T35 71Q35 103 54 123T99 143Q142 143 142 101Q142 81 130 66T107 46T94 41L91 40Q91 39 97 36T113 29T132 26Q168 26 194 71Q203 87 217 139T245 247T261 313Q266 340 266 352Q266 380 251 392T217 404Q177 404 142 372T93 290Q91 281 88 280T72 278H58Q52 284 52 289Z\"></path></g><g data-mml-node=\"mn\" transform=\"translate(605,363) scale(0.707)\"><path data-c=\"33\" d=\"M127 463Q100 463 85 480T69 524Q69 579 117 622T233 665Q268 665 277 664Q351 652 390 611T430 522Q430 470 396 421T302 350L299 348Q299 347 308 345T337 336T375 315Q457 262 457 175Q457 96 395 37T238 -22Q158 -22 100 21T42 130Q42 158 60 175T105 193Q133 193 151 175T169 130Q169 119 166 110T159 94T148 82T136 74T126 70T118 67L114 66Q165 21 238 21Q293 21 321 74Q338 107 338 175V195Q338 290 274 322Q259 328 213 329L171 330L168 332Q166 335 166 348Q166 366 174 366Q202 366 232 371Q266 376 294 413T322 525V533Q322 590 287 612Q265 626 240 626Q208 626 181 615T143 592T132 580H135Q138 579 143 578T153 573T165 566T175 555T183 540T186 520Q186 498 172 481T127 463Z\"></path></g></g><g data-mml-node=\"mrow\" transform=\"translate(220,-686)\"><g data-mml-node=\"msup\"><g data-mml-node=\"mi\"><path data-c=\"1D452\" d=\"M39 168Q39 225 58 272T107 350T174 402T244 433T307 442H310Q355 442 388 420T421 355Q421 265 310 237Q261 224 176 223Q139 223 138 221Q138 219 132 186T125 128Q125 81 146 54T209 26T302 45T394 111Q403 121 406 121Q410 121 419 112T429 98T420 82T390 55T344 24T281 -1T205 -11Q126 -11 83 42T39 168ZM373 353Q367 405 305 405Q272 405 244 391T199 357T170 316T154 280T149 261Q149 260 169 260Q282 260 327 284T373 353Z\"></path></g><g data-mml-node=\"mi\" transform=\"translate(499,289) scale(0.707)\"><path data-c=\"1D465\" d=\"M52 289Q59 331 106 386T222 442Q257 442 286 424T329 379Q371 442 430 442Q467 442 494 420T522 361Q522 332 508 314T481 292T458 288Q439 288 427 299T415 328Q415 374 465 391Q454 404 425 404Q412 404 406 402Q368 386 350 336Q290 115 290 78Q290 50 306 38T341 26Q378 26 414 59T463 140Q466 150 469 151T485 153H489Q504 153 504 145Q504 144 502 134Q486 77 440 33T333 -11Q263 -11 227 52Q186 -10 133 -10H127Q78 -10 57 16T35 71Q35 103 54 123T99 143Q142 143 142 101Q142 81 130 66T107 46T94 41L91 40Q91 39 97 36T113 29T132 26Q168 26 194 71Q203 87 217 139T245 247T261 313Q266 340 266 352Q266 380 251 392T217 404Q177 404 142 372T93 290Q91 281 88 280T72 278H58Q52 284 52 289Z\"></path></g></g><g data-mml-node=\"mo\" transform=\"translate(1175.7,0)\"><path data-c=\"2212\" d=\"M84 237T84 250T98 270H679Q694 262 694 250T679 230H98Q84 237 84 250Z\"></path></g><g data-mml-node=\"mn\" transform=\"translate(2175.9,0)\"><path data-c=\"31\" d=\"M213 578L200 573Q186 568 160 563T102 556H83V602H102Q149 604 189 617T245 641T273 663Q275 666 285 666Q294 666 302 660V361L303 61Q310 54 315 52T339 48T401 46H427V0H416Q395 3 257 3Q121 3 100 0H88V46H114Q136 46 152 46T177 47T193 50T201 52T207 57T213 61V578Z\"></path></g></g><rect width=\"2875.9\" height=\"60\" x=\"120\" y=\"220\"></rect></g><g data-mml-node=\"mstyle\" transform=\"translate(5086.1,0)\"><g data-mml-node=\"mspace\"></g></g><g data-mml-node=\"mi\" transform=\"translate(5252.7,0)\"><path data-c=\"1D451\" d=\"M366 683Q367 683 438 688T511 694Q523 694 523 686Q523 679 450 384T375 83T374 68Q374 26 402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487H491Q506 153 506 145Q506 140 503 129Q490 79 473 48T445 8T417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157Q33 205 53 255T101 341Q148 398 195 420T280 442Q336 442 364 400Q369 394 369 396Q370 400 396 505T424 616Q424 629 417 632T378 637H357Q351 643 351 645T353 664Q358 683 366 683ZM352 326Q329 405 277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q233 26 290 98L298 109L352 326Z\"></path></g><g data-mml-node=\"mi\" transform=\"translate(5772.7,0)\"><path data-c=\"1D465\" d=\"M52 289Q59 331 106 386T222 442Q257 442 286 424T329 379Q371 442 430 442Q467 442 494 420T522 361Q522 332 508 314T481 292T458 288Q439 288 427 299T415 328Q415 374 465 391Q454 404 425 404Q412 404 406 402Q368 386 350 336Q290 115 290 78Q290 50 306 38T341 26Q378 26 414 59T463 140Q466 150 469 151T485 153H489Q504 153 504 145Q504 144 502 134Q486 77 440 33T333 -11Q263 -11 227 52Q186 -10 133 -10H127Q78 -10 57 16T35 71Q35 103 54 123T99 143Q142 143 142 101Q142 81 130 66T107 46T94 41L91 40Q91 39 97 36T113 29T132 26Q168 26 194 71Q203 87 217 139T245 247T261 313Q266 340 266 352Q266 380 251 392T217 404Q177 404 142 372T93 290Q91 281 88 280T72 278H58Q52 284 52 289Z\"></path></g><g data-mml-node=\"mo\" transform=\"translate(6622.5,0)\"><path data-c=\"3D\" d=\"M56 347Q56 360 70 367H707Q722 359 722 347Q722 336 708 328L390 327H72Q56 332 56 347ZM56 153Q56 168 72 173H708Q722 163 722 153Q722 140 707 133H70Q56 140 56 153Z\"></path></g><g data-mml-node=\"mfrac\" transform=\"translate(7678.3,0)\"><g data-mml-node=\"msup\" transform=\"translate(220,676)\"><g data-mml-node=\"mi\"><path data-c=\"1D70B\" d=\"M132 -11Q98 -11 98 22V33L111 61Q186 219 220 334L228 358H196Q158 358 142 355T103 336Q92 329 81 318T62 297T53 285Q51 284 38 284Q19 284 19 294Q19 300 38 329T93 391T164 429Q171 431 389 431Q549 431 553 430Q573 423 573 402Q573 371 541 360Q535 358 472 358H408L405 341Q393 269 393 222Q393 170 402 129T421 65T431 37Q431 20 417 5T381 -10Q370 -10 363 -7T347 17T331 77Q330 86 330 121Q330 170 339 226T357 318T367 358H269L268 354Q268 351 249 275T206 114T175 17Q164 -11 132 -11Z\"></path></g><g data-mml-node=\"mn\" transform=\"translate(603,363) scale(0.707)\"><path data-c=\"34\" d=\"M462 0Q444 3 333 3Q217 3 199 0H190V46H221Q241 46 248 46T265 48T279 53T286 61Q287 63 287 115V165H28V211L179 442Q332 674 334 675Q336 677 355 677H373L379 671V211H471V165H379V114Q379 73 379 66T385 54Q393 47 442 46H471V0H462ZM293 211V545L74 212L183 211H293Z\"></path></g></g><g data-mml-node=\"mn\" transform=\"translate(223.3,-686)\"><path data-c=\"31\" d=\"M213 578L200 573Q186 568 160 563T102 556H83V602H102Q149 604 189 617T245 641T273 663Q275 666 285 666Q294 666 302 660V361L303 61Q310 54 315 52T339 48T401 46H427V0H416Q395 3 257 3Q121 3 100 0H88V46H114Q136 46 152 46T177 47T193 50T201 52T207 57T213 61V578Z\"></path><path data-c=\"35\" d=\"M164 157Q164 133 148 117T109 101H102Q148 22 224 22Q294 22 326 82Q345 115 345 210Q345 313 318 349Q292 382 260 382H254Q176 382 136 314Q132 307 129 306T114 304Q97 304 95 310Q93 314 93 485V614Q93 664 98 664Q100 666 102 666Q103 666 123 658T178 642T253 634Q324 634 389 662Q397 666 402 666Q410 666 410 648V635Q328 538 205 538Q174 538 149 544L139 546V374Q158 388 169 396T205 412T256 420Q337 420 393 355T449 201Q449 109 385 44T229 -22Q148 -22 99 32T50 154Q50 178 61 192T84 210T107 214Q132 214 148 197T164 157Z\" transform=\"translate(500,0)\"></path></g><rect width=\"1206.6\" height=\"60\" x=\"120\" y=\"220\"></rect></g></g></g></g></svg><svg data-labels=\"true\" preserveAspectRatio=\"xMaxYMid\" viewBox=\"1278 -1464.8 1 2429.6\"><g data-labels=\"true\" transform=\"matrix(1 0 0 -1 0 0)\"><g data-mml-node=\"mtd\" id=\"mjx-eqn-eq:1\" transform=\"translate(0,697.1)\"><text data-id-align=\"true\"></text><g data-idbox=\"true\" transform=\"translate(0,-750)\"><g data-mml-node=\"mtext\"><path data-c=\"28\" d=\"M94 250Q94 319 104 381T127 488T164 576T202 643T244 695T277 729T302 750H315H319Q333 750 333 741Q333 738 316 720T275 667T226 581T184 443T167 250T184 58T225 -81T274 -167T316 -220T333 -241Q333 -250 318 -250H315H302L274 -226Q180 -141 137 -14T94 250Z\"></path><path data-c=\"33\" d=\"M127 463Q100 463 85 480T69 524Q69 579 117 622T233 665Q268 665 277 664Q351 652 390 611T430 522Q430 470 396 421T302 350L299 348Q299 347 308 345T337 336T375 315Q457 262 457 175Q457 96 395 37T238 -22Q158 -22 100 21T42 130Q42 158 60 175T105 193Q133 193 151 175T169 130Q169 119 166 110T159 94T148 82T136 74T126 70T118 67L114 66Q165 21 238 21Q293 21 321 74Q338 107 338 175V195Q338 290 274 322Q259 328 213 329L171 330L168 332Q166 335 166 348Q166 366 174 366Q202 366 232 371Q266 376 294 413T322 525V533Q322 590 287 612Q265 626 240 626Q208 626 181 615T143 592T132 580H135Q138 579 143 578T153 573T165 566T175 555T183 540T186 520Q186 498 172 481T127 463Z\" transform=\"translate(389,0)\"></path><path data-c=\"29\" d=\"M60 749L64 750Q69 750 74 750H86L114 726Q208 641 251 514T294 250Q294 182 284 119T261 12T224 -76T186 -143T145 -194T113 -227T90 -246Q87 -249 86 -250H74Q66 -250 63 -250T58 -247T55 -238Q56 -237 66 -225Q221 -64 221 250T66 725Q56 737 55 738Q55 746 60 749Z\" transform=\"translate(889,0)\"></path></g></g></g></g></svg></g></g></g></g></svg></mjx-container></span></div>\n" +
  "<hr class=\"footnotes-sep\">\n" +
  "<section class=\"footnotes\">\n" +
  "<ol class=\"footnotes-list\">\n" +
  "<li id=\"fn1\" class=\"footnote-item\"><div>Footnotes <strong>can have markup</strong></div>\n" +
  "<div>and multiple paragraphs. <a href=\"#fnref1\" class=\"footnote-backref\">↩︎</a></div>\n" +
  "</li>\n" +
  "<li id=\"fn2\" class=\"footnote-item\"><div>Footnote text. <a href=\"#fnref2\" class=\"footnote-backref\">↩︎</a> <a href=\"#fnref2:1\" class=\"footnote-backref\">↩︎</a></div>\n" +
  "</li>\n" +
  "<li id=\"fn3\" class=\"footnote-item\"><div>Hello I am the third footote! <a href=\"#fnref3\" class=\"footnote-backref\">↩︎</a> <a href=\"#fnref3:1\" class=\"footnote-backref\">↩︎</a></div>\n" +
  "</li>\n" +
  "<li id=\"fn4\" class=\"footnote-item\"><div>And I’m the 4th! <a href=\"#fnref4\" class=\"footnote-backref\">↩︎</a> <a href=\"#fnref4:1\" class=\"footnote-backref\">↩︎</a></div>\n" +
  "</li>\n" +
  "<li id=\"fn5\" class=\"footnote-item\"><p>Text of inline footnote <a href=\"#fnref5\" class=\"footnote-backref\">↩︎</a></p>\n" +
  "</li>\n" +
  "</ol>\n" +
  "</section>";
