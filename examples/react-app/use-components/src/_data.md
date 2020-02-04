# Mathpix Markdown Syntax Reference

We created our own flavor of markdown, Mathpix Markdown, to be used for all rendering environments in our apps like the [Snip Editor](snip.mathpix.com).

It is a combination of Markdown and LaTeX syntax, which creates a great writing experience for technical documents. This means that you can use all the standard **Markdown syntax** in addition to some **LaTeX features** that we will list below. You can also use HTML code.

---

## Math mode LaTeX

### Inline math

\begin{tabular}{ | l | l | l | }
\hline
Delimiter & Example LaTeX & Rendered Equation \\
\hline
`$...$` & `$\vec { F } = m \vec { a }$` &  $\vec { F } = m \vec { a }$ \\
\hline
`\(...\)` & `\(ax^2 + bx + c = 0\)` & \(ax^2 + bx + c = 0\) \\
\hline
\end{tabular}

### Block mode math (non-numbered)

Delimiters: `$$...$$`

Example LaTeX:
```
$$
x = \frac { - b \pm \sqrt { b ^ { 2 } - 4 a c } } { 2 a }
$$
```

Rendered equation:

$$
x = \frac { - b \pm \sqrt { b ^ { 2 } - 4 a c } } { 2 a }
$$

Delimiters: `\[...\]`

Example LaTeX:
```
\[
y = \frac { \sum _ { i } w _ { i } y _ { i } } { \sum _ { i } w _ { i } } , i = 1,2 \ldots k
\]
```

Rendered equation:

\[
y = \frac { \sum _ { i } w _ { i } y _ { i } } { \sum _ { i } w _ { i } } , i = 1,2 \ldots k
\]

Delimiters: `\begin{equation*}...\end{equation*}`

Example LaTeX:
```
\begin{equation*}
l ( \theta ) = \sum _ { i = 1 } ^ { m } \log p ( x , \theta )
\end{equation*}
```

Rendered equation:

\begin{equation*}
l ( \theta ) = \sum _ { i = 1 } ^ { m } \log p ( x , \theta )
\end{equation*}

Delimiters: `\begin{align*}...\end{align*}`

Example LaTeX:
```
\begin{align*}
t _ { 1 } + t _ { 2 } = \frac { ( 2 L / c ) \sqrt { 1 - u ^ { 2 } / c ^ { 2 } } } { 1 - u ^ { 2 } / c ^ { 2 } } = \frac { 2 L / c } { \sqrt { 1 - u ^ { 2 } / c ^ { 2 } } }
\end{align*}
```

Rendered equation:

\begin{align*}
t _ { 1 } + t _ { 2 } = \frac { ( 2 L / c ) \sqrt { 1 - u ^ { 2 } / c ^ { 2 } } } { 1 - u ^ { 2 } / c ^ { 2 } } = \frac { 2 L / c } { \sqrt { 1 - u ^ { 2 } / c ^ { 2 } } }
\end{align*}

### Block mode math (numbered)

Delimiters: `\begin{equation}...\end{equation}`

Example LaTeX:
```
\begin{equation}
m = \frac { m _ { 0 } } { \sqrt { 1 - v ^ { 2 } / c ^ { 2 } } }
\end{equation}
```

Rendered equation:

\begin{equation}
m = \frac { m _ { 0 } } { \sqrt { 1 - v ^ { 2 } / c ^ { 2 } } }
\end{equation}

Delimiters: `\begin{align}...\end{align}`

Example LaTeX:
```
\begin{align}
^{|\alpha|} \sqrt{x^{\alpha}} \leq(x \bullet \alpha) /|\alpha|
\end{align}
```

Rendered equation:

\begin{align}
^{|\alpha|} \sqrt{x^{\alpha}} \leq(x \bullet \alpha) /|\alpha|
\end{align}

### Other (less common) math mode LaTeX environments supported

Delimiters: `\begin{split}...\end{split}`
Reason to use: split your equation into smaller pieces

Example LaTeX:
```
\begin{split}
a& =b+c-d\\
& \quad +e-f\\
& =g+h\\
& =i
\end{split}
```

Rendered equation:

\begin{split}
a& =b+c-d\\
& \quad +e-f\\
& =g+h\\
& =i
\end{split}

- Use `\\` to denote a new line and `&` to denote where the lines should align.
- Need it numbered? Wrap it in `\begin{equation}...\end{equation}`

Delimiters: `\begin{gather}...\end{gather}`
Reason to use: for displaying a set of consecutive equations that don't require special alignment

Example LaTeX:
```
\begin{gather}
a_1=b_1+c_1\\
a_2=b_2+c_2-d_2+e_2
\end{gather}
```

Rendered equation:

\begin{gather}
a_1=b_1+c_1\\
a_2=b_2+c_2-d_2+e_2
\end{gather}


Delimiters: `\begin{gather*}...\end{gather*}`
Reason to use:  `gather` environment without an equation number

Example LaTeX:

```
\begin{gather*}
a_1=b_1+c_1\\
a_2=b_2+c_2-d_2+e_2
\end{gather*}
```

Rendered equation:
\begin{gather*}
a_1=b_1+c_1\\
a_2=b_2+c_2-d_2+e_2
\end{gather*}

### \label, \ref, \eqref, \tag

You can use `\label{}`, `\ref{}` and `\eqref{}` to link to any numbered equation in your document:

```
In equation \eqref{eq:1}, we find the value of an
interesting integral:

\begin{equation}
  \int_0^\infty \frac{x^3}{e^x-1}\,dx = \frac{\pi^4}{15}
  \label{eq:1}
\end{equation}

\begin{equation}
  \| x + y \| \geq | \| x | | - \| y \| |
  \label{eq:2}
\end{equation}

Look at the Equation \ref{eq:2}
```

In equation \eqref{eq:1}, we find the value of an
interesting integral:

\begin{equation}
  \int_0^\infty \frac{x^3}{e^x-1}\,dx = \frac{\pi^4}{15}
  \label{eq:1}
\end{equation}

\begin{equation}
  \| x + y \| \geq | \| x | | - \| y \| |
  \label{eq:2}
\end{equation}

Look at the Equation \ref{eq:2}

In addition to using numbered block mode equation syntax for standard numbering (ie. 1, 2, 3), you can use also include `\tag{}` inside of your LaTeX delimiters to create a custom tag. Note that if `\tag{}` is used in a numbered equation, it will override the document's numbering.

```
$$
\frac{x\left(x^{2 n}-x^{-2 n}\right)}{x^{2 n}+x^{-2 n}}
\tag{1.1}
$$
```

$$
\frac{x\left(x^{2 n}-x^{-2 n}\right)}{x^{2 n}+x^{-2 n}}
\tag{1.1}
$$

```
\begin{equation}
\max _{\theta} \mathbb{E}_{\mathbf{z} \sim \mathcal{Z}_{T}}\left[\sum_{t=1}^{T} \log p_{\theta}\left(x_{z_{t}} | \mathbf{x}_{\mathbf{z}_{<t}}\right)\right]
\tag{1.2}
\end{equation}
```

\begin{equation}
\max _{\theta} \mathbb{E}_{\mathbf{z} \sim \mathcal{Z}_{T}}\left[\sum_{t=1}^{T} \log p_{\theta}\left(x_{z_{t}} | \mathbf{x}_{\mathbf{z}_{< t}}\right)\right]
\tag{1.2}
\end{equation}

---

## Text mode LaTeX

Supported text mode LaTeX syntax:

\begin{tabular}{ || l | l | l || }
\hline
\hline
LaTeX syntax & Markdown equivalent & HTML equivalent \\
\hline
\hline
`\title{My Title}` & `# My Title` & `<h1 align="center">My Title</h1>`\\
\hline
`\author{Author's Name}` & No equivalent & No equivalent\\
\hline
`\begin{abstract}...\end{abstract}` & No equivalent & No equivalent\\
\hline
`\section{Section Title}` & `## Section Title` & `<h2>Section Title</h2>`\\
\hline
`\subsection{Section Title}` & `### Section Title` & `<h3>Section Title</h3>`\\
\hline
`\subsubsection{Section Title}` & `#### Section Title` & `<h4>Section Title</h4>`\\
\hline
`\textit{italicized text}` & `*italicized text*` or `_italicized text_` & `<i>italicized text</i>` or `<em>italicized text</em>`\\
\hline
`\textbf{bold text}` & `__bold text__` & `<b>bold text</b>` or `<strong>bold text</strong>`\\
\hline
`\url{link}` & `[link text](url)` & `<a href="url">link text</a>`\\
\hline
\hline
\end{tabular}

Note: The LaTeX `\title{}` will always render center-aligned and an `<h1>...</h1>` HTML tag can be aligned using the `align="..."` attribute, but the Markdown title using `#` will always render left-aligned.

Here are some examples of how text mode LaTeX will render using Mathpix Markdown:

```
\title{Title}

\author{Author}

\author{Author\\can also be\\multiline}

\begin{abstract}
This is the abstract to my paper. You are going to learn a lot in this paper, just you wait. I am going to tell you all about different LaTeX and Markdown syntax.
\end{abstract}

\section{My great section}

\subsection{My really great subsection}

\subsubsection{My really really great subsubsection}

You can use LaTeX commands for \textit{italicizing...}

...and for \textbf{bolding}

Insert a url like this: \url{https://mathpix.com/}.
```

\title{Title}

\author{Author}

\author{Author\\can also be\\multiline}

\begin{abstract}
This is the abstract to my paper. You are going to learn a lot in this paper, just you wait. I am going to tell you all about different LaTeX and Markdown syntax.
\end{abstract}

\section{My great section}

\subsection{My really great subsection}

\subsubsection{My really really great subsubsection}

You can use LaTeX commands for \textit{italicizing...}

...and for \textbf{bolding}

Insert a url like this: \url{https://mathpix.com/}.

Note: In Mathpix Markdown, You can use the `\title{}` command wherever you want the title to appear in your document, as you would use the `\maketitle` command in a LaTeX document.

---

## Markdown

All standard Markdown syntax is supported by Mathpix Markdown.

### Headings

| Markdown      | HTML          | Rendered output  |
| :------------ |:--------------| :-----|
| `# H1 Heading`  | `<h1>H1 Heading</h1>` | <h1>H1 Heading</h1> |
| `## H2 Heading`      | `<h2>H2 Heading</h2>`      |   <h2>H2 Heading</h2> |
| `## H3 Heading`      | `<h3>H3 Heading</h3>`      |   <h3>H3 Heading</h3> |
| `## H4 Heading`      | `<h4>H4 Heading</h4>`      |   <h4>H4 Heading</h4> |
| `## H5 Heading`      | `<h5>H5 Heading</h5>`      |   <h5>H5 Heading</h5> |
| `## H6 Heading`      | `<h6>H6 Heading</h6>`      |   <h6>H6 Heading</h6> |
| `H1 Heading`<br>`=====`  | `<h1>H1 Heading</h1>` | <h1>H1 Heading</h1> |
| `## H2 Heading`<br>`----` | `<h2>H2 Heading</h2>`      |   <h2>H2 Heading</h2> |

### Font emphasis

| Markdown      | HTML          | Rendered output  |
| :------------ |:--------------| :-----|
| `**This is bold text**`  | `<b>This is bold text</b>` | **This is bold text** |
| `__This is also bold text__`   | `<strong>This is bold text<strong>`  |   __This is also bold text__ |
| `*This is italic text*`      | `<i>This is bold text</i>`      |   *This is italic text* |
| `_This is also italic text_`      | `<em>This is bold text</em>`      |   _This is also italic text_ |
| `~~Strikethrough~~`      | `<s>Strikethrough</s>`      |   ~~Strikethrough~~ |
| `==This is marked text==`      | `<mark>This is marked text</mark>`      |   ==This is marked text== |

### Quotes

Use a `>` to write a blockquote like this:

```
> This is my blockquote
```

> This is my blockquote

```
> This is my blockquote,
> It's taking up two lines.
```

> This is my blockquote,
> It's taking up two lines.

```
> This is my nested blockquote,
>> it's pretty nifty.
```

> This is my nested blockquote,
>> it's pretty nifty.

### Lists

Create an unordered list by starting a line with `+`, `-`, or `*`

```
+ Sub-lists are made by indenting 2 spaces:
  - Different characters in in the same sub-list will render the same characters:
    * Ac tristique libero volutpat at
    + Facilisis in pretium nisl aliquet
    - Nulla volutpat aliquam velit
+ Very easy!
```

+ Sub-lists are made by indenting 2 spaces:
  - Different characters in in the same sub-list will render the same characters:
    * Ac tristique libero volutpat at
    + Facilisis in pretium nisl aliquet
    - Nulla volutpat aliquam velit
+ Very easy!

Create an ordered list by writing 1,2,etc.

```
1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa
```

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa

```
1. You can use sequential numbers...
1. ...or keep all the numbers as 1 and it will automatically increment your list.
```

1. You can use sequential numbers...
1. ...or keep all the numbers as 1.

Or start your list with any number and the numbering will continue:

```
57. foo
2. bar
6. foo
```

57. foo
2. bar
6. foo

### Code

Wrap inline code `in single backticks` (`)

...or wrap code blocks in 3 backticks (```) or 3 tildes (~~~)

```
var foo = function (bar) {
  return bar++;
};
```

Include the programming language after the first three backticks or tildes for syntax highlighting:

~~~javascript
var foo = function (bar) {
  return bar++;
};
~~~

(*All major languages supported via [highlight.js](https://highlightjs.org/).*)

You can also create a code block by indenting all lines:

```
    \\ some comments
    line 1 of code
    line 2 of code
    line 3 of code
```

Will render:

    \\ some comments
    line 1 of code
    line 2 of code
    line 3 of code

### Tables

We support Markdown tables, as well as LaTeX tables using the `tabular` environment. Read the [full guide to LaTeX table support](tables.md) for more.

Colons can be used to align columns:

```
| Tables        | Are           | Cool  |
| :------------ |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |
```

| Tables        | Are           | Cool  |
| :------------ |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

There must be at least 3 dashes separating each header cell.
The outer pipes (`|`) are optional, and you don't need to make the raw Markdown line up prettily:

```
Markdown | Less | Pretty
--- | --- | ---
*Still* | `renders` | **nicely**
1 | 2 | 3
```

Markdown | Less | Pretty
--- | --- | ---
*Still* | `renders` | **nicely**
1 | 2 | 3


### Links and images

Use the `[Title](url)` syntax to insert a link:

```
[This is a link to the Mathpix website](http://mathpix.com/)
```

[This is a link to the Mathpix website](http://mathpix.com/)

Use the `![Title](url)` syntax to insert an image:

```
![Feynman Lecture 1](https://cdn.mathpix.com/snip/images/0Y13pkOem1h2kqhOPAB98mtSCL5FQlQPtot1obxd-R8.original.fullsize.png)
```

![Feynman Lecture 1](https://cdn.mathpix.com/snip/images/0Y13pkOem1h2kqhOPAB98mtSCL5FQlQPtot1obxd-R8.original.fullsize.png)

Include text in quotes after the url for a tooltip (hover over the image to see):

```
![Feynman Lecture 2](https://cdn.mathpix.com/snip/images/XDfl14ZxchxGUuOHzRSN7FcqMmLxknDndIo18jsMfk0.original.fullsize.png "Michelson-Morley experiment")
```

![Feynman Lecture 2](https://cdn.mathpix.com/snip/images/XDfl14ZxchxGUuOHzRSN7FcqMmLxknDndIo18jsMfk0.original.fullsize.png "Michelson-Morley experiment")

### Footnotes

You can write footnotes either by writing out "first", "second", "third", etc:

```
Footnote 1 link[^first]
```

Footnote 1 link[^first]

```
Footnote reference[^second]
```

Footnote reference[^second]

And you can reference the same footnote again like this:

```
My reference[^second]
```

My reference[^second]

Or you can use numbers:

```
This is my next footnote[^3]
```

This is my next footnote[^3]

```
You can reference multiple footnotes in a row[^3][^4]
```

You can reference multiple footnotes in a row[^3][^4]

You can also write inline footnotes:

```
Inline footnote^[Text of inline footnote] definition.
```

Inline footnote^[Text of inline footnote] definition.

Scroll to the bottom of the page to see how these footnotes render:
```
[^first]: Footnotes **can have markup**

    and multiple paragraphs.

[^second]: Footnote text.

[^3]: Hello I am the third footote!

[^4]: And I'm the 4th!
```

[^first]: Footnotes **can have markup**

    and multiple paragraphs.

[^second]: Footnote text.

[^3]: Hello I am the third footote!

[^4]: And I'm the 4th!


### Misc.

Create horizontal rules like this:
```
___
---
***
```
___
---
***

Here are some other symbols supported:
```
(c) (C) (r) (R) (tm) (TM) (p) (P) +-
```

(c) (C) (r) (R) (tm) (TM) (p) (P) +-

Punctuation will get autocorrected:
```
test.. test... test..... test?..... test!....
```

test.. test... test..... test?..... test!....

```
!!!!!! ???? ,,  -- ---
```

!!!!!! ???? ,,  -- ---


#### Emojies

Classic markup:

```
:wink: :cry: :laughing: :yum:
```

:wink: :cry: :laughing: :yum:


Shortcuts (emoticons):

```
:-) :-( 8-) ;)
```

:-) :-( 8-) ;)


#### Subscripts and Superscripts

```
19^th^
```

19^th^

```
H~2~O

```

H~2~O

---

## Using HTML

You can also use HTML tags. Here is an example of a header:

```
<h2 style="color:blue;">This is a Blue Heading</h2>
```

<h2 style="color:blue;">This is a Blue Heading</h2>

You can also render SVGs!

```
<svg id="function random() { [native code] }" xmlns="http://www.w3.org/2000/svg" version="1.1" width="200px" height="150px" viewBox="0 0 200 150">\n\t<style> #function random() { [native code] } {pointer-events:none; }  #function random() { [native code] } .event  { pointer-events:all;}  </style>\n\t<text x="136" y="79" font-family=" Helvetica" font-weight="900" font-size="14" fill="rgb(255,13,13)">O</text>\n\t<text x="115" y="43" font-family=" Helvetica" font-weight="900" font-size="14" fill="rgb(255,13,13)">O</text>\n\t<text x="126" y="43" font-family=" Helvetica" font-weight="900" font-size="14" fill="rgb(255,13,13)">H</text>\n\t<text x="73" y="42" font-family=" Helvetica" font-weight="900" font-size="14" fill="rgb(255,13,13)">O</text>\n\t<text x="84" y="42" font-family=" Helvetica" font-weight="900" font-size="14" fill="rgb(255,13,13)">H</text>\n\t<line x1="118" y1="64" x2="134" y2="72" style="stroke:rgb(0,0,0);stroke-width:1"/>\n\t<line x1="120" y1="60" x2="136" y2="69" style="stroke:rgb(0,0,0);stroke-width:1"/>\n\t<line x1="79" y1="63" x2="100" y2="75" style="stroke:rgb(0,0,0);stroke-width:1"/>\n\t<line x1="79" y1="67" x2="95" y2="76" style="stroke:rgb(0,0,0);stroke-width:1"/>\n\t<line x1="58" y1="99" x2="58" y2="74" style="stroke:rgb(0,0,0);stroke-width:1"/>\n\t<line x1="62" y1="96" x2="62" y2="77" style="stroke:rgb(0,0,0);stroke-width:1"/>\n\t<line x1="99" y1="99" x2="79" y2="111" style="stroke:rgb(0,0,0);stroke-width:1"/>\n\t<line x1="95" y1="97" x2="79" y2="106" style="stroke:rgb(0,0,0);stroke-width:1"/>\n\t<line x1="120" y1="46" x2="120" y2="63" style="stroke:rgb(0,0,0);stroke-width:1"/>\n\t<line x1="100" y1="75" x2="120" y2="63" style="stroke:rgb(0,0,0);stroke-width:1"/>\n\t<line x1="79" y1="45" x2="79" y2="63" style="stroke:rgb(0,0,0);stroke-width:1"/>\n\t<line x1="58" y1="74" x2="79" y2="63" style="stroke:rgb(0,0,0);stroke-width:1"/>\n\t<line x1="79" y1="111" x2="58" y2="99" style="stroke:rgb(0,0,0);stroke-width:1"/>\n\t<line x1="99" y1="99" x2="100" y2="75" style="stroke:rgb(0,0,0);stroke-width:1"/>\n\t<line id="function random() { [native code] }:Bond:1-0" class="event" x1="120" y1="63" x2="141" y2="75" stroke-width="8" stroke-opacity="0"/>\n\t<line id="function random() { [native code] }:Bond:4-3" class="event" x1="79" y1="63" x2="100" y2="75" stroke-width="8" stroke-opacity="0"/>\n\t<line id="function random() { [native code] }:Bond:7-6" class="event" x1="58" y1="99" x2="58" y2="74" stroke-width="8" stroke-opacity="0"/>\n\t<line id="function random() { [native code] }:Bond:9-8" class="event" x1="99" y1="99" x2="79" y2="111" stroke-width="8" stroke-opacity="0"/>\n\t<line id="function random() { [native code] }:Bond:2-1" class="event" x1="120" y1="39" x2="120" y2="63" stroke-width="8" stroke-opacity="0"/>\n\t<line id="function random() { [native code] }:Bond:3-1" class="event" x1="100" y1="75" x2="120" y2="63" stroke-width="8" stroke-opacity="0"/>\n\t<line id="function random() { [native code] }:Bond:5-4" class="event" x1="79" y1="38" x2="79" y2="63" stroke-width="8" stroke-opacity="0"/>\n\t<line id="function random() { [native code] }:Bond:6-4" class="event" x1="58" y1="74" x2="79" y2="63" stroke-width="8" stroke-opacity="0"/>\n\t<line id="function random() { [native code] }:Bond:8-7" class="event" x1="79" y1="111" x2="58" y2="99" stroke-width="8" stroke-opacity="0"/>\n\t<line id="function random() { [native code] }:Bond:9-3" class="event" x1="99" y1="99" x2="100" y2="75" stroke-width="8" stroke-opacity="0"/>\n\t<circle id="function random() { [native code] }:Atom:0" class="event" cx="141" cy="75" r="8" fill-opacity="0"/>\n\t<circle id="function random() { [native code] }:Atom:1" class="event" cx="120" cy="63" r="8" fill-opacity="0"/>\n\t<circle id="function random() { [native code] }:Atom:2" class="event" cx="120" cy="39" r="8" fill-opacity="0"/>\n\t<circle id="function random() { [native code] }:Atom:3" class="event" cx="100" cy="75" r="8" fill-opacity="0"/>\n\t<circle id="function random() { [native code] }:Atom:4" class="event" cx="79" cy="63" r="8" fill-opacity="0"/>\n\t<circle id="function random() { [native code] }:Atom:5" class="event" cx="79" cy="38" r="8" fill-opacity="0"/>\n\t<circle id="function random() { [native code] }:Atom:6" class="event" cx="58" cy="74" r="8" fill-opacity="0"/>\n\t<circle id="function random() { [native code] }:Atom:7" class="event" cx="58" cy="99" r="8" fill-opacity="0"/>\n\t<circle id="function random() { [native code] }:Atom:8" class="event" cx="79" cy="111" r="8" fill-opacity="0"/>\n\t<circle id="function random() { [native code] }:Atom:9" class="event" cx="99" cy="99" r="8" fill-opacity="0"/>\n</svg>  
```

<svg id="function random() { [native code] }" xmlns="http://www.w3.org/2000/svg" version="1.1" width="200px" height="150px" viewBox="0 0 200 150">\n\t<style> #function random() { [native code] } {pointer-events:none; }  #function random() { [native code] } .event  { pointer-events:all;}  </style>\n\t<text x="136" y="79" font-family=" Helvetica" font-weight="900" font-size="14" fill="rgb(255,13,13)">O</text>\n\t<text x="115" y="43" font-family=" Helvetica" font-weight="900" font-size="14" fill="rgb(255,13,13)">O</text>\n\t<text x="126" y="43" font-family=" Helvetica" font-weight="900" font-size="14" fill="rgb(255,13,13)">H</text>\n\t<text x="73" y="42" font-family=" Helvetica" font-weight="900" font-size="14" fill="rgb(255,13,13)">O</text>\n\t<text x="84" y="42" font-family=" Helvetica" font-weight="900" font-size="14" fill="rgb(255,13,13)">H</text>\n\t<line x1="118" y1="64" x2="134" y2="72" style="stroke:rgb(0,0,0);stroke-width:1"/>\n\t<line x1="120" y1="60" x2="136" y2="69" style="stroke:rgb(0,0,0);stroke-width:1"/>\n\t<line x1="79" y1="63" x2="100" y2="75" style="stroke:rgb(0,0,0);stroke-width:1"/>\n\t<line x1="79" y1="67" x2="95" y2="76" style="stroke:rgb(0,0,0);stroke-width:1"/>\n\t<line x1="58" y1="99" x2="58" y2="74" style="stroke:rgb(0,0,0);stroke-width:1"/>\n\t<line x1="62" y1="96" x2="62" y2="77" style="stroke:rgb(0,0,0);stroke-width:1"/>\n\t<line x1="99" y1="99" x2="79" y2="111" style="stroke:rgb(0,0,0);stroke-width:1"/>\n\t<line x1="95" y1="97" x2="79" y2="106" style="stroke:rgb(0,0,0);stroke-width:1"/>\n\t<line x1="120" y1="46" x2="120" y2="63" style="stroke:rgb(0,0,0);stroke-width:1"/>\n\t<line x1="100" y1="75" x2="120" y2="63" style="stroke:rgb(0,0,0);stroke-width:1"/>\n\t<line x1="79" y1="45" x2="79" y2="63" style="stroke:rgb(0,0,0);stroke-width:1"/>\n\t<line x1="58" y1="74" x2="79" y2="63" style="stroke:rgb(0,0,0);stroke-width:1"/>\n\t<line x1="79" y1="111" x2="58" y2="99" style="stroke:rgb(0,0,0);stroke-width:1"/>\n\t<line x1="99" y1="99" x2="100" y2="75" style="stroke:rgb(0,0,0);stroke-width:1"/>\n\t<line id="function random() { [native code] }:Bond:1-0" class="event" x1="120" y1="63" x2="141" y2="75" stroke-width="8" stroke-opacity="0"/>\n\t<line id="function random() { [native code] }:Bond:4-3" class="event" x1="79" y1="63" x2="100" y2="75" stroke-width="8" stroke-opacity="0"/>\n\t<line id="function random() { [native code] }:Bond:7-6" class="event" x1="58" y1="99" x2="58" y2="74" stroke-width="8" stroke-opacity="0"/>\n\t<line id="function random() { [native code] }:Bond:9-8" class="event" x1="99" y1="99" x2="79" y2="111" stroke-width="8" stroke-opacity="0"/>\n\t<line id="function random() { [native code] }:Bond:2-1" class="event" x1="120" y1="39" x2="120" y2="63" stroke-width="8" stroke-opacity="0"/>\n\t<line id="function random() { [native code] }:Bond:3-1" class="event" x1="100" y1="75" x2="120" y2="63" stroke-width="8" stroke-opacity="0"/>\n\t<line id="function random() { [native code] }:Bond:5-4" class="event" x1="79" y1="38" x2="79" y2="63" stroke-width="8" stroke-opacity="0"/>\n\t<line id="function random() { [native code] }:Bond:6-4" class="event" x1="58" y1="74" x2="79" y2="63" stroke-width="8" stroke-opacity="0"/>\n\t<line id="function random() { [native code] }:Bond:8-7" class="event" x1="79" y1="111" x2="58" y2="99" stroke-width="8" stroke-opacity="0"/>\n\t<line id="function random() { [native code] }:Bond:9-3" class="event" x1="99" y1="99" x2="100" y2="75" stroke-width="8" stroke-opacity="0"/>\n\t<circle id="function random() { [native code] }:Atom:0" class="event" cx="141" cy="75" r="8" fill-opacity="0"/>\n\t<circle id="function random() { [native code] }:Atom:1" class="event" cx="120" cy="63" r="8" fill-opacity="0"/>\n\t<circle id="function random() { [native code] }:Atom:2" class="event" cx="120" cy="39" r="8" fill-opacity="0"/>\n\t<circle id="function random() { [native code] }:Atom:3" class="event" cx="100" cy="75" r="8" fill-opacity="0"/>\n\t<circle id="function random() { [native code] }:Atom:4" class="event" cx="79" cy="63" r="8" fill-opacity="0"/>\n\t<circle id="function random() { [native code] }:Atom:5" class="event" cx="79" cy="38" r="8" fill-opacity="0"/>\n\t<circle id="function random() { [native code] }:Atom:6" class="event" cx="58" cy="74" r="8" fill-opacity="0"/>\n\t<circle id="function random() { [native code] }:Atom:7" class="event" cx="58" cy="99" r="8" fill-opacity="0"/>\n\t<circle id="function random() { [native code] }:Atom:8" class="event" cx="79" cy="111" r="8" fill-opacity="0"/>\n\t<circle id="function random() { [native code] }:Atom:9" class="event" cx="99" cy="99" r="8" fill-opacity="0"/>\n</svg>  
