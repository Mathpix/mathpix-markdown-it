# mathpix-markdown-it

[![npm version](https://badge.fury.io/js/mathpix-markdown-it.svg)](https://badge.fury.io/js/mathpix-markdown-it)
[![Build Status](https://img.shields.io/circleci/build/gh/Mathpix/mathpix-markdown-it/master.svg?style=flat)](https://circleci.com/gh/Mathpix/mathpix-markdown-it/tree/master)
[![GitHub](https://img.shields.io/github/license/mathpix/mathpix-markdown-it)](https://github.com/Mathpix/mathpix-markdown-it/blob/master/LICENSE)

# What is Mathpix Markdown? 

[mathpix-markdown](https://mathpix.com/docs/mathpix-markdown/overview) is a superset of Markdown that adds helpful syntax for the STEM community, such as advanced equation, table, and chemistry support. Wherever possible, we borrow syntax from LaTeX. In other cases (such as chemistry) we invent new syntax that is backward compatible with Markdown.

Here are the key benefits over plain Markdown:
- better equation support via LaTeX syntax (powered by MathJax), including equation numbering and referencing conventions from LaTeX
- better support for tables, via the LaTeX tabular syntax, which allows for complex, nested tables often seen in scientific publications
- advanced figure referencing via LaTeX syntax
- support for abstracts, author lists, and linkable sections; these are a fact of life for academic publications
- support for chemistry diagrams represented with SMILES markup, compatible with popular chemistry tools like ChemDraw

![Editing an MMD file in VS Code](assets/mmd-vscode.png)

# Mathpix Markdown Syntax reference

Click [here](https://mathpix.com/docs/mathpix-markdown/syntax-reference) for the full syntax reference.

# How to edit mmd files?

Mathpix Markdown is an open format with multiple implementations:

- you can use this Github repo and the `mathpix-markdown-it` npm library to render STEM content on your website
- you can use the [VS Code plugin](https://mathpix.com/docs/mathpix-markdown/how-to-mmd-vscode) (see picture above) to edit mmd files
- use can use our web editor [Snip Notes](https://snip.mathpix.com) to edit, export, and publish mmd files (with exports to pdf and docx formats)
- you can use our experimental static site generator [Spectra](https://github.com/mathpix/spectra) to edit local mmd files and see changes in real time

# How is Mathpix Markdown different from regular Markdown?

Mathpix Markdown addresses these limitations by adding support for the following standard Latex syntax elements which are already familiar to the scientific community:

- inline math via `\( <latex math> \)`
- block math via `\[ <latex math> \]` or `$$ <math> $$`
- tables via `\begin{tabular} ... \end{tabular}`
- figures and figure captions via `\begin{figure} \caption{...} ... \end{figure}`
- lists: unordered lists via `\begin{itemize} ... \end{itemize}` and ordered lists via `\begin{enumerate} ... \end{enumerate}`
- numbered and unnumbered equation enviornments `\begin{elem} ... \end{elem}` and `\begin{elem*} ... \end{elem*}` where elem=`equation|align|split|gather`
- equation, table, and figure references via `\label`, `\ref`, `\eqref`, `\tag`
- [text formatting options](doc/sections.md) `\title{...}`, `\author{...}`, `\begin{abstract}...\end{abstract}`, `\section{Section Title}`, `\subsection{Section Title}`, `\subsubsection{Section Title}`, `\textit{italicized text}`, `\textbf{bold text}`, `\url{link}`
- chemistry equation via `<smiles>OC(=O)c1cc(Cl)cs1</smiles>` or
~~~
```smiles
OC(=O)c1cc(Cl)cs1
```
~~~
- images (Markdown). Parse and render additional parameters such as width, height, alignment:
~~~
![foo](foo.png){ width=50% }
![foo](foo.png){ width="36px" }
![image](<src> "title"){width="20px",height="20px"}
![image](<src> "title"){width="20px",height="20px",right}
![image](<src> "title"){width="20px",height="20px", align="left"}
~~~
![Image properties](assets/mmd-image-properties.webp)

- [theorems and proofs](doc/theorems.md)

```tex
\newtheorem{theorem}{Theorem}
\newtheorem{lemma}[theorem]{Lemma}

\begin{theorem}
Let \(f\) be a function whose derivative exists in every point, then \(f\) 
is a continuous function.
\end{theorem}

\begin{lemma}
Given two line segments whose lengths are \(a\) and \(b\) respectively there 
is a real number \(r\) such that \(b=ra\).
\end{lemma}

\begin{proof}
To prove it by contradiction try and assume that the statement is false,
proceed from there and at some point you will arrive to a contradiction.
\end{proof}
```

![](doc/images/theorems_and_proofs.png)

- [Latex footnotes](doc/latex-footnotes.md)

```tex
Footnote marker without text. Auto increment counter to 1 \footnotemark{} should be 1.

Footnote marker with text. Auto increment counter to 2 \footnotemark{} be 2. \footnotetext{text should be 2}

Auto increment counter to 3 \footnote{text  should be 3}

Auto increment counter to 4 \footnote{text  should be 4}

Footnote marker without text. Auto increment counter to 5 \footnotemark{} should be 5.

Footnote marker with text. Auto increment counter to 6 \footnotemark{} should be 6. \footnotetext{text should be 6}

Auto increment counter to 7 \footnote{text  should be 7}

Auto increment counter to 8 \footnote{text  should be 8}
```

![](doc/images/latex-footnotes/latex-footnotes_01.png)

- [Latex underline](doc/latex-underline.md)

```tex
Underline text: \underline{Underlined text!}
Underline text: \uline{Underlined text!}

Double underline text: \underline{\underline{Double underlined text!}}
Double underline text: \uuline{Double underlined text!}

Wavy underlined text: \uwave{This text is underlined with a wavy line!}

Dashed underline text: \dashuline{Dashed Underline}
Dotted underline text: \dotuline{Dotted Underline}

Strikethrough text: \sout{Text with a horizontal line through its center!}
Struck with Hatching text: \xout{Text with hatching pattern!}
```

![](doc/images/latex-underline/latex-underline_07.png)

- [Latex lstlisting env](doc/latex-lstlisting-env.md)

```tex
\begin{lstlisting}[language=C, mathescape]
/* the following code computes $\displaystyle\sum_{i=1}^{n}i$ */

for (i = 1; i <= limit; i++) {
  sum += i;
}
\end{lstlisting}
```

![](doc/images/latex-lstlisting-env/latex-lstlisting-env-01.png)

# What is mathpix-markdown-it? 

**mathpix-markdown-it** is an open source implementation of the mathpix-markdown spec written in Typescript.

It relies on the following open source libraries:

- MathJax v3 (to render math with SVGs)
- markdown-it (for standard Markdown parsing)


# Quickstart

## Installation

[npm](https://www.npmjs.com) usage:

```bash
$ npm install mathpix-markdown-it
```

[yarn](https://classic.yarnpkg.com) usage:

```bash
$ yarn add mathpix-markdown-it
```


# How to use

## React usage

### [mathpix-markdown-it components](https://github.com/Mathpix/mathpix-markdown-it#mathpixmarkdown-props) usage

We provide React components which make rendering of mathpix-markdown-it easy for React applications:
[Full example](https://github.com/Mathpix/mathpix-markdown-it/tree/master/examples/react-app/use-components)

```js
import {MathpixMarkdown, MathpixLoader} from 'mathpix-markdown-it';


class App extends Component {
  render() {
    return (
      <MathpixLoader>
          <MathpixMarkdown text="\\(ax^2 + bx + c = 0\\)"/>
          <MathpixMarkdown text="$x = \frac { - b \pm \sqrt { b ^ { 2 } - 4 a c } } { 2 a }$"/>
          ...
      </MathpixLoader>
    );
  }
}
```

### [MathpixMarkdownModel methods](https://github.com/Mathpix/mathpix-markdown-it#mathpixmarkdownmodel-methods) usage

#### [Example of render() method usage](https://github.com/Mathpix/mathpix-markdown-it/tree/master/examples/react-app/use-render-method)

```js
import * as React from 'react';
import { MathpixMarkdownModel as MM } from 'mathpix-markdown-it';

class App extends React.Component {
  componentDidMount() {
    const elStyle = document.getElementById('Mathpix-styles');
    if (!elStyle) {
      const style = document.createElement("style");
      style.setAttribute("id", "Mathpix-styles");
      style.innerHTML = MM.getMathpixFontsStyle() + MM.getMathpixStyle(true);
      document.head.appendChild(style);
    }
  }
  render() {
    const html = MM.render('$x = \\frac { - b \\pm \\sqrt { b ^ { 2 } - 4 a c } } { 2 a }$');
    return (
      <div className="App">
        <div className="content" dangerouslySetInnerHTML={{__html: html}}></div>
      </div>
    )
  }
}

export default App;

```

#### [Example of markdownToHTML() method usage](https://github.com/Mathpix/mathpix-markdown-it/tree/master/examples/react-app/use-markdownToHTML-method)

```js
class ConvertForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '\\[\n' +
        'y = \\frac { \\sum _ { i } w _ { i } y _ { i } } { \\sum _ { i } w _ { i } } , i = 1,2 \\ldots k\n' +
        '\\]',
      result: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({result: MM.markdownToHTML(this.state.value)})
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <h1>Input Text with Latex:</h1>
          <textarea value={this.state.value} onChange={this.handleChange} />
          <input type="submit" value="Convert" />
        </form>
        <div id='preview-content' dangerouslySetInnerHTML={{__html: this.state.result}}/>
      </div>
    );
  }
}
```

### Latex to mathml/asciimath/tsv conversion

#### [Example of Latex to mathml/asciimath/tsv conversion](https://github.com/Mathpix/mathpix-markdown-it/tree/master/examples/react-app/use-parseMarkdownByHTML-method)

Rendering methods have the ability to convert `Latex` representation to such formats as: `mathml`, `asciimath`, `tsv`

```js
const options = {
      outMath: { //You can set which formats should be included into html result
        include_mathml: true,
        include_asciimath: true,
        include_latex: true,
        include_svg: true, // sets in default
        include_tsv: true,
        include_table_html: true, // sets in default
      }
    };
const html = MathpixMarkdownModel.markdownToHTML(`$x^x$`, options);
```

`markdownToHTML()` returns an HTML string that will contain the formats specified in the options.

For `Latex` formulas, the result will be:
```html
<span class="math-inline">
    <mathml style="display: none">...</mathml>
    <asciimath style="display: none">...</asciimath>
    <latex style="display: none">...</latex>
    <mjx-comtainer class="MathJax" jax="SVG">..</mjx-comtainer>
</span>
```

For `tabular`, the result will be:
```html
<div class="table_ tabular">
    <table id="tabular">...</table>
    <tsv style="display: none">...</tsv>
</div>
```

Then calling the `parseMarkdownByHTML(html)` method will return all formats as a list from the incoming html string.

For `Latex` formulas:
```js
[
    {
      "type": "mathml",
      "value": "<math>...</math>"
    },
    {
       "type": "asciimath",
       "value": "x^(x)"
     },
    {
       "type": "latex",
       "value": "x^x"
     },
    {
       "type": "svg",
       "value": "<sgv>...</svg>"
     }
]
```

For `tabular`:
```js
[
    {
      "type": "html",
      "value": "<table>...</table>"
    },
    {
       "type": "tsv",
       "value": "<tsv>...</tsv>"
     }
]
```

#### Example of outMath option usage

For `Latex` formulas:
```js
const options = {
      outMath: {
        include_mathml: false,
        include_asciimath: true,
        include_latex: false,
      }
    };
const latex = `$x^x$`;
const html = MathpixMarkdownModel.markdownToHTML(latex, options);
const parsed = MathpixMarkdownModel.parseMarkdownByHTML(html, false);
```

`html`:
```html
<div>
    <span class="math-inline">
        <asciimath style="display: none;">x^(x)</asciimath>
        <mjx-comtainer class="MathJax" jax="SVG"><svg>...</svg></mjx-comtainer>
    </span>
</div>

```

`parsed`:
```js
[
    {
       "type": "asciimath",
       "value": "x^(x)"
     },
    {
       "type": "svg",
       "value": "<sgv>...</svg>"
     }
]
```

For `tabular`:
```js
const options = {
      outMath: {
        include_table_html: false,
        include_tsv: true,
      }
    };
const latex = `\\begin{tabular}{ l c r }
  1 & 2 & 3 \\\\
  4 & 5 & 6 \\\\
  7 & 8 & 9 \\\\
\\end{tabular}`;
const html = MathpixMarkdownModel.markdownToHTML(latex, options);
const parsed = MathpixMarkdownModel.parseMarkdownByHTML(html, false);
```

```html
<div class="table_tabular " style="text-align: center">
  <tsv style="display: none">1    2       3
4       5       6
7       8       9</tsv>
</div>

```

`parsed`:
```js
[
  { 
    type: 'tsv', 
    value: '1\t2\t3\n4\t5\t6\n7\t8\t9' 
  }
]
```


### Example of the include_sub_math option usage for tables containing nested tables and formulas

#### parseMarkdownByHTML(html: string, include_sub_math: boolean = true)

##### By default, the include_sub_math option is enabled, and as a result will contain formats for the nested table and math.

```js
const options = {
    outMath: {
        include_asciimath: true,
        include_mathml: true,
        include_latex: true,
        include_svg: true,
        include_tsv: true,
        include_table_html: true
    }
  };
const latex = `\\begin{tabular}{ l c r }
                 1 & {$x^1$} & 3 \\\\
                 4 & {$y^1$} & 6 \\\\
                 7 & {$z^1$} & 9 \\\\
               \\end{tabular}`;
const html = MathpixMarkdownModel.markdownToHTML(latex, options);
const parsed = MathpixMarkdownModel.parseMarkdownByHTML(html);
```

`parsed`:
```js
[
  { 
    type: 'html',
    value: '<table>..</table>'
  },
  { type: 'tsv', value: '1\tx^(1)\t3\n4\ty^(1)\t6\n7\tz^(1)\t9' },
  
  { type: 'mathml', value: '<math xmlns="http://www.w3.org/1998/Math/MathML">\n  <msup>\n    <mi>x</mi>\n    <mn>1</mn>\n  </msup>\n</math>' },
  { type: 'asciimath', value: 'x^(1)' },
  { type: 'latex', value: 'x^1' },
  { type: 'svg', value: '<svg >..</svg>' },
    
  { type: 'mathml', value: '<math xmlns="http://www.w3.org/1998/Math/MathML">\n  <msup>\n    <mi>y</mi>\n    <mn>1</mn>\n  </msup>\n</math>' },
  { type: 'asciimath', value: 'y^(1)' },
  { type: 'latex', value: 'y^1' },
  { type: 'svg', value: '<svg ></svg>' },
      
  { type: 'mathml', value: '<math xmlns="http://www.w3.org/1998/Math/MathML">\n  <msup>\n    <mi>z</mi>\n    <mn>1</mn>\n  </msup>\n</math>' },
  { type: 'asciimath', value: 'z^(1)' },
  { type: 'latex', value: 'z^1' },
  { type: 'svg', value: '<svg ></svg>' }
]
```

##### If you set the include_sub_math option in the false,  then as a result, will not contain formats for all the nested table and math.

```js
const options = {
    outMath: {
        include_asciimath: true,
        include_mathml: true,
        include_latex: true,
        include_svg: true,
        include_tsv: true,
        include_table_html: true
    }
  };
const latex = `\\begin{tabular}{ l c r }
                 1 & {$x^1$} & 3 \\\\
                 4 & {$y^1$} & 6 \\\\
                 7 & {$z^1$} & 9 \\\\
               \\end{tabular}`;
const html = MathpixMarkdownModel.markdownToHTML(latex, options);
const parsed = MathpixMarkdownModel.parseMarkdownByHTML(html, false);
```

`parsed`:
```js
[
  { 
    type: 'html',
    value: '<table>..</table>'
  },
  { 
    type: 'tsv', 
    value: '1\tx^(1)\t3\n4\ty^(1)\t6\n7\tz^(1)\t9' 
  }
]
```


## NodeJS

### [MathpixMarkdownModel methods usage](https://github.com/Mathpix/mathpix-markdown-it#mathpixmarkdownmodel-methods)

#### [Example of mathpix-markdown-it usage in the node application](https://github.com/Mathpix/mathpix-markdown-it/tree/master/examples/mathpix-markdown-it-node-examples)
#### [Example of Latex to mathml/asciimath/tsv conversion in the node application](https://github.com/Mathpix/mathpix-markdown-it/tree/master/examples/mathpix-markdown-it-node-examples#example-of-latex-to-mathmlasciimathtsv-conversion)

```js
const {MathpixMarkdownModel} = require('mathpix-markdown-it'); 

const htmlMM = MathpixMarkdownModel.render(text, options);
const mathpixStyles = MathpixMarkdownModel.getMathpixStyleOnly();
```
Before using mathpix-markdown-it in node applications, you should define global variables

```js
const Window = require('window');
const window = new Window();
global.window = window;
global.document = window.document;

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
global.DOMParser = new JSDOM().window.DOMParser;
```

#### Simple example of mathpix-markdown-it usage in node app.

It prints html to the console for string `\\(ax^2 + bx + c = 0\\)`

1. Install packages:

```bash
$ npm install mathpix-markdown-it jsdom window
```

2. Node app.js:

```js
const {MathpixMarkdownModel} = require('mathpix-markdown-it');

const Window = require('window');
const window = new Window();
global.window = window;
global.document = window.document;

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
global.DOMParser = new JSDOM().window.DOMParser;

const text = `\\(ax^2 + bx + c = 0\\)`;
const options = {
  htmlTags: true,
  width: 800
};
const htmlMM = MathpixMarkdownModel.markdownToHTML(text, options);

console.log(htmlMM);
```

3. Start:

```bash
node app.js
```

4. Result:

```html
<div><span  class="math-inline " ><mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.186ex" xmlns="http://www.w3.org/2000/svg" width="16.328ex" height="2.072ex" role="img" focusable="false" viewBox="0 -833.9 7217 915.9"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="61" d="M33 157Q33 258 109 349T280 441Q331 441 370 392Q386 422 416 422Q429 422 439 414T449 394Q449 381 412 234T374 68Q374 43 381 35T402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487Q506 153 506 144Q506 138 501 117T481 63T449 13Q436 0 417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157ZM351 328Q351 334 346 350T323 385T277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q217 26 254 59T298 110Q300 114 325 217T351 328Z"></path></g><g data-mml-node="msup" transform="translate(529, 0)"><g data-mml-node="mi"><path data-c="78" d="M52 289Q59 331 106 386T222 442Q257 442 286 424T329 379Q371 442 430 442Q467 442 494 420T522 361Q522 332 508 314T481 292T458 288Q439 288 427 299T415 328Q415 374 465 391Q454 404 425 404Q412 404 406 402Q368 386 350 336Q290 115 290 78Q290 50 306 38T341 26Q378 26 414 59T463 140Q466 150 469 151T485 153H489Q504 153 504 145Q504 144 502 134Q486 77 440 33T333 -11Q263 -11 227 52Q186 -10 133 -10H127Q78 -10 57 16T35 71Q35 103 54 123T99 143Q142 143 142 101Q142 81 130 66T107 46T94 41L91 40Q91 39 97 36T113 29T132 26Q168 26 194 71Q203 87 217 139T245 247T261 313Q266 340 266 352Q266 380 251 392T217 404Q177 404 142 372T93 290Q91 281 88 280T72 278H58Q52 284 52 289Z"></path></g><g data-mml-node="mn" transform="translate(572, 363) scale(0.707)"><path data-c="32" d="M109 429Q82 429 66 447T50 491Q50 562 103 614T235 666Q326 666 387 610T449 465Q449 422 429 383T381 315T301 241Q265 210 201 149L142 93L218 92Q375 92 385 97Q392 99 409 186V189H449V186Q448 183 436 95T421 3V0H50V19V31Q50 38 56 46T86 81Q115 113 136 137Q145 147 170 174T204 211T233 244T261 278T284 308T305 340T320 369T333 401T340 431T343 464Q343 527 309 573T212 619Q179 619 154 602T119 569T109 550Q109 549 114 549Q132 549 151 535T170 489Q170 464 154 447T109 429Z"></path></g></g><g data-mml-node="mo" transform="translate(1726.8, 0)"><path data-c="2B" d="M56 237T56 250T70 270H369V420L370 570Q380 583 389 583Q402 583 409 568V270H707Q722 262 722 250T707 230H409V-68Q401 -82 391 -82H389H387Q375 -82 369 -68V230H70Q56 237 56 250Z"></path></g><g data-mml-node="mi" transform="translate(2727, 0)"><path data-c="62" d="M73 647Q73 657 77 670T89 683Q90 683 161 688T234 694Q246 694 246 685T212 542Q204 508 195 472T180 418L176 399Q176 396 182 402Q231 442 283 442Q345 442 383 396T422 280Q422 169 343 79T173 -11Q123 -11 82 27T40 150V159Q40 180 48 217T97 414Q147 611 147 623T109 637Q104 637 101 637H96Q86 637 83 637T76 640T73 647ZM336 325V331Q336 405 275 405Q258 405 240 397T207 376T181 352T163 330L157 322L136 236Q114 150 114 114Q114 66 138 42Q154 26 178 26Q211 26 245 58Q270 81 285 114T318 219Q336 291 336 325Z"></path></g><g data-mml-node="mi" transform="translate(3156, 0)"><path data-c="78" d="M52 289Q59 331 106 386T222 442Q257 442 286 424T329 379Q371 442 430 442Q467 442 494 420T522 361Q522 332 508 314T481 292T458 288Q439 288 427 299T415 328Q415 374 465 391Q454 404 425 404Q412 404 406 402Q368 386 350 336Q290 115 290 78Q290 50 306 38T341 26Q378 26 414 59T463 140Q466 150 469 151T485 153H489Q504 153 504 145Q504 144 502 134Q486 77 440 33T333 -11Q263 -11 227 52Q186 -10 133 -10H127Q78 -10 57 16T35 71Q35 103 54 123T99 143Q142 143 142 101Q142 81 130 66T107 46T94 41L91 40Q91 39 97 36T113 29T132 26Q168 26 194 71Q203 87 217 139T245 247T261 313Q266 340 266 352Q266 380 251 392T217 404Q177 404 142 372T93 290Q91 281 88 280T72 278H58Q52 284 52 289Z"></path></g><g data-mml-node="mo" transform="translate(3950.2, 0)"><path data-c="2B" d="M56 237T56 250T70 270H369V420L370 570Q380 583 389 583Q402 583 409 568V270H707Q722 262 722 250T707 230H409V-68Q401 -82 391 -82H389H387Q375 -82 369 -68V230H70Q56 237 56 250Z"></path></g><g data-mml-node="mi" transform="translate(4950.4, 0)"><path data-c="63" d="M34 159Q34 268 120 355T306 442Q362 442 394 418T427 355Q427 326 408 306T360 285Q341 285 330 295T319 325T330 359T352 380T366 386H367Q367 388 361 392T340 400T306 404Q276 404 249 390Q228 381 206 359Q162 315 142 235T121 119Q121 73 147 50Q169 26 205 26H209Q321 26 394 111Q403 121 406 121Q410 121 419 112T429 98T420 83T391 55T346 25T282 0T202 -11Q127 -11 81 37T34 159Z"></path></g><g data-mml-node="mo" transform="translate(5661.2, 0)"><path data-c="3D" d="M56 347Q56 360 70 367H707Q722 359 722 347Q722 336 708 328L390 327H72Q56 332 56 347ZM56 153Q56 168 72 173H708Q722 163 722 153Q722 140 707 133H70Q56 140 56 153Z"></path></g><g data-mml-node="mn" transform="translate(6717, 0)"><path data-c="30" d="M96 585Q152 666 249 666Q297 666 345 640T423 548Q460 465 460 320Q460 165 417 83Q397 41 362 16T301 -15T250 -22Q224 -22 198 -16T137 16T82 83Q39 165 39 320Q39 494 96 585ZM321 597Q291 629 250 629Q208 629 178 597Q153 571 145 525T137 333Q137 175 145 125T181 46Q209 16 250 16Q290 16 318 46Q347 76 354 130T362 333Q362 478 354 524T321 597Z"></path></g></g></g></svg></mjx-container></span></div>
```

## Using mathpix-markdown-it in web browsers

If you are loading `mathpix-markdown-it` from a CDN into a web page, there is no
need to install anything.  Simply use a `script` tag that loads
`mathpix-markdown-it` from the CDN.  E.g.,

``` html
  <script>
    let script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/mathpix-markdown-it@1.0.40/es5/bundle.js";
    document.head.append(script);

    script.onload = function() {
      const isLoaded = window.loadMathJax();
      if (isLoaded) {
        console.log('Styles loaded!')
      }
    }
  </script>
```

### Example of mathpix-markdown-it usage in the web browsers

* [Example of render function usage](https://github.com/Mathpix/mathpix-markdown-it/blob/master/examples/html/content-mmd-to-html.html.md) ([View Demo](https://htmlpreview.github.io/?https://github.com/Mathpix/mathpix-markdown-it/blob/master/examples/html/content-mmd-to-html.html))
* [Example of markdownToHTML function usage](https://github.com/Mathpix/mathpix-markdown-it/blob/master/examples/html/input-mmd-to-html.html.md)([View Demo](https://htmlpreview.github.io/?https://github.com/Mathpix/mathpix-markdown-it/blob/master/examples/html/input-mmd-to-html.html))


## Accessibility math

By default, math is not accessibility. 
In order for math to become accessibility, need to load the library speech-rule-engine for semantic interpretation.

### 1. For **Browser libraries**, synchronous loading is used.

```js
import { MathpixMarkdownModel } from "mathpix-markdown-it";
import { loadSre } from "mathpix-markdown-it/lib/sre/sre-browser";

const html = MathpixMarkdownModel.markdownToHTML("$x^y$", {
    accessibility: {
      sre: loadSre()
    },
});
```
    
### 2. For **Node modules**, asynchronous loading is used.
    
```js
const { MathpixMarkdownModel } = require('mathpix-markdown-it');
const { loadSreAsync } = require('mathpix-markdown-it/lib/sre/sre-node');

(async() => {
  const html = MathpixMarkdownModel.markdownToHTML("$x^y$", {
    accessibility: {
      sre: await loadSreAsync()
    },
  });
})
```    

_If the accessibility option is specified, then `assistive-mml` into `mjx-container` will be added for math_

### Result html

```html
<div>
  <span class="math-inline ">
    <mjx-container class="MathJax" jax="SVG" role="math" style="position: relative" aria-label="x Superscript y" tabindex="0">
      <svg style="vertical-align: -0.025ex" xmlns="http://www.w3.org/2000/svg" width="2.191ex" height="1.553ex" role="img" focusable="false" viewBox="0 -675.5 968.5 686.5" aria-hidden="true"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="msup"><g data-mml-node="mi"><path data-c="78" d="M52 289Q59 331 106 386T222 442Q257 442 286 424T329 379Q371 442 430 442Q467 442 494 420T522 361Q522 332 508 314T481 292T458 288Q439 288 427 299T415 328Q415 374 465 391Q454 404 425 404Q412 404 406 402Q368 386 350 336Q290 115 290 78Q290 50 306 38T341 26Q378 26 414 59T463 140Q466 150 469 151T485 153H489Q504 153 504 145Q504 144 502 134Q486 77 440 33T333 -11Q263 -11 227 52Q186 -10 133 -10H127Q78 -10 57 16T35 71Q35 103 54 123T99 143Q142 143 142 101Q142 81 130 66T107 46T94 41L91 40Q91 39 97 36T113 29T132 26Q168 26 194 71Q203 87 217 139T245 247T261 313Q266 340 266 352Q266 380 251 392T217 404Q177 404 142 372T93 290Q91 281 88 280T72 278H58Q52 284 52 289Z"></path></g><g data-mml-node="mi" transform="translate(572, 363) scale(0.707)"><path data-c="79" d="M21 287Q21 301 36 335T84 406T158 442Q199 442 224 419T250 355Q248 336 247 334Q247 331 231 288T198 191T182 105Q182 62 196 45T238 27Q261 27 281 38T312 61T339 94Q339 95 344 114T358 173T377 247Q415 397 419 404Q432 431 462 431Q475 431 483 424T494 412T496 403Q496 390 447 193T391 -23Q363 -106 294 -155T156 -205Q111 -205 77 -183T43 -117Q43 -95 50 -80T69 -58T89 -48T106 -45Q150 -45 150 -87Q150 -107 138 -122T115 -142T102 -147L99 -148Q101 -153 118 -160T152 -167H160Q177 -167 186 -165Q219 -156 247 -127T290 -65T313 -9T321 21L315 17Q309 13 296 6T270 -6Q250 -11 231 -11Q185 -11 150 11T104 82Q103 89 103 113Q103 170 138 262T173 379Q173 380 173 381Q173 390 173 393T169 400T158 404H154Q131 404 112 385T82 344T65 302T57 280Q55 278 41 278H27Q21 284 21 287Z"></path></g></g></g></g></svg>
      <mjx-assistive-mml role="presentation" unselectable="on" display="inline" aria-hidden="true"><math xmlns="http://www.w3.org/1998/Math/MathML"><msup><mi>x</mi><mi>y</mi></msup></math></mjx-assistive-mml>
    </mjx-container>
  </span>
</div>
```

The math will then be read by screen readers as `x Superscript y`
    

## Context menu for export math

The context menu for selecting math export options is only available for browser libraries

In the rendering options, specify the export formats that should be displayed in the menu:
```js
const html = MM.markdownToHTML("$x^y$", {
outMath: {
    include_error: true,
    // Show in context menu:
    include_asciimath: true,
    include_latex: true,
    include_mathml: true,
    include_mathml_word: true,
  }
});
```

Then we can use:
```js
import {
  addListenerContextMenuEvents,
  removeListenerContextMenuEvents,
} from "mathpix-markdown-it/lib/contex-menu";
```

`addListenerContextMenuEvents` - listens for events to invoke and create the context menu
`removeListenerContextMenuEvents` - stop listening to these events

<img width="370" alt="Screen Shot 2022-05-03 at 17 21 50" src="https://user-images.githubusercontent.com/32493105/166471623-fd3f6a5b-84e4-4d43-afcd-0384e83eb2df.png">


## Output Format

The `output_format` option in `TOutputMath` controls which math format is placed in the HTML output. This is useful for optimizing file size or delegating rendering to the client.

| Value | Description |
|-------|-------------|
| `'svg'` (default) | Pre-rendered SVG with hidden format elements. Works offline, no client-side rendering needed. |
| `'mathml'` | Native `<math>` elements only. Smaller file size, requires client-side rendering via `auto-render.js`. |
| `'latex'` | Raw LaTeX with original delimiters. Smaller file size, requires client-side rendering via `auto-render.js`. |

### Example usage

```js
const options = {
  outMath: {
    output_format: 'mathml', // or 'latex'
    include_mathml: true,
    include_latex: true,
  }
};
const html = MathpixMarkdownModel.markdownToHTML('$x^2$', options);
```

When using `'mathml'` or `'latex'`, the server outputs minimal HTML containing only the raw format. Use the browser rendering script (`auto-render.js`) to transform this into the full structure with SVG and hidden formats.


## Browser Rendering Script (auto-render.js)

For `output_format: 'mathml'` or `output_format: 'latex'`, use the browser bundle to render math on the client side.

### Loading the script

```html
<script src="https://cdn.jsdelivr.net/npm/mathpix-markdown-it@latest/es5/browser/auto-render.js"></script>
```

### Usage

```js
// Render all math elements in a container
window.MathpixRender.renderMathInElement(document.getElementById('content'), {
  outMath: {
    output_format: 'svg',
    include_svg: true,
    include_mathml: true,
    include_latex: true,
    include_asciimath: true,
  },
  accessibility: {
    assistive_mml: true,
    include_speech: true,
  }
});
```

### Configuration options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `outMath` | `TOutputMath` | `{ output_format: 'svg', include_svg: true }` | Controls which hidden formats to generate. Set `include_mathml`, `include_latex`, `include_asciimath`, etc. to `true` to generate hidden format elements for context menu compatibility. |
| `accessibility.assistive_mml` | `boolean` | `true` | Add `<mjx-assistive-mml>` element for screen readers |
| `accessibility.include_speech` | `boolean` | `false` | Add `aria-label` with speech text (requires `assistive_mml: true`) |

### Accessibility behavior

The browser bundle uses a simplified accessibility configuration (different from the server-side [TAccessibility](#taccessibility) interface):

| Configuration | Result |
|---------------|--------|
| `{ assistive_mml: true, include_speech: true }` | `aria-label` attribute with speech text + `<mjx-assistive-mml>` element |
| `{ assistive_mml: true }` | `aria-labelledby` pointing to `<mjx-assistive-mml>` ID |
| No accessibility config | No accessibility attributes added |

The script automatically skips elements that have already been rendered.

**Note:** For server-side rendering accessibility, use the [TAccessibility](#taccessibility) interface with `assistiveMml` and `sre` options instead.


## Browser Speech Script (add-speech.js)

Use this script to add speech accessibility to math that was already rendered server-side as SVG with `assistiveMml: true` but without SRE speech. It loads SRE dynamically and adds `aria-label` attributes to existing `mjx-container` elements.

This is useful when you want fast server-side rendering without the SRE dependency, but still want speech accessibility on the client.

### Prerequisites

The rendered HTML must include `<mjx-assistive-mml>` elements (i.e., the server used `accessibility: { assistiveMml: true }`).

### Loading the script

```html
<script src="https://cdn.jsdelivr.net/npm/mathpix-markdown-it@latest/es5/browser/add-speech.js"></script>
```

By default, the script automatically processes `document.body` on `DOMContentLoaded`.

### Usage

```js
// Add speech to all rendered math in a specific container
window.MathpixSpeech.addSpeechToRenderedMath(document.getElementById('content'));
```

### Configuration

Set `window.MathpixSpeechConfig` before the script loads to customize behavior:

```js
window.MathpixSpeechConfig = {
  container: document.getElementById('math-content') // defaults to document.body
};
```

### What it does

For each `mjx-container` element that does not already have an `aria-label`:
1. Extracts MathML from the `<mjx-assistive-mml>` child element
2. Generates speech text using SRE (Speech Rule Engine)
3. Sets `aria-label`, `role="math"`, and `tabindex="0"` on the container


# Documentation

## React components

| React components  | props   | description                        |
|-------------------|---------|------------------------------------|
| `MathpixLoader`   |         | Loads styles                       |
| `MathpixMarkdown` | [props](https://github.com/Mathpix/mathpix-markdown-it#mathpixmarkdown-props) | Renders input text to html element |

The `MathpixMarkdown` React element accepts the following props: 

### MathpixMarkdown props

| prop                     | type&nbsp;*`default`*        |  description                                                                                                           |
|--------------------------|------------------------------|------------------------------------------------------------------------------------------------------------------------|
| `text`                   | sting                        | string that will be converted                                                                                          |
| `alignMathBlock`         | string&nbsp;*`center`*       | aligns `math-block`  by this params                                                                                    |
| `display`                | string&nbsp;*`block`*        | `block` - the whole space, `inline-block` - renders in its actual size                                                 |
| `showTimeLog`            | boolean&nbsp;*`false`*       | shows execution time in console                                                                                        |
| `isDisableFancy`         | boolean&nbsp;*`false`*       | `true` - disables processing of special characters (Example: `+ item`, `- item` )                                      |
| `disableRules`           | array of strings&nbsp;*`[]`* | You can pass a list of rules for markdown rendering that should be disabled but only if `isDisableFancy` is not `true`.|
|                          |                              | Example:  `disableRules = ['replacements'] ` will disable fancy characters processing.                                 |
| `htmlTags`               | boolean;*`false`*            | Enables HTML tags in source                                                                                            |
| `htmlDisableTagMatching` | boolean;*`false`*            | Allows to turn off the validation that checks for matching opening and closing HTML tags                               |
| `xhtmlOut`               | boolean;*`false`*            | Uses `/` to close single tags (`<br />`)                                                                               |
| `breaks`                 | boolean;*`true`*             | Converts `\n` in paragraphs into `<br>`                                                                                |
| `typographer`            | boolean;*`false`*            | Enables some language-neutral replacement + quotes beautification (Example: `(c) (C) (r) (R) (tm) (TM) (p) (P) +-`)    |
| `linkify`                | boolean;*`false`*            | Autoconverts URL-like text to links                                                                                    |
| `width`                  | number;*`1200`*              | Sets text container width                                                                                              |
| `outMath`                | [TOutputMath](https://github.com/Mathpix/mathpix-markdown-it#toutputmath);*`{}`*         | Sets options to output html                                                                                           |
| `mathJax`                | [TOutputMathJax](https://github.com/Mathpix/mathpix-markdown-it#toutputmathjax);*`{}`*       | Sets options to output MathJax                                                                                         |
| `smiles`                 | [ISmilesOptions](https://github.com/Mathpix/mathpix-markdown-it#ismilesoptions);*`{}`*        | Sets options to output chemistry equation                                                                              |
| `parserErrors`           | [ParserErrors](https://github.com/Mathpix/mathpix-markdown-it#parsererrors);*`{}`*        | Sets options to output parser errors for equations and tabular                    |
| `codeHighlight`          | [CodeHighlight](https://github.com/Mathpix/mathpix-markdown-it#codehighlight);*`{}`*      | Sets options to highlight code block                      |
| `footnotes`              | [Footnotes](https://github.com/Mathpix/mathpix-markdown-it#footnotes);*`{}`*              | Sets options to footnotes                                 |


## MathpixMarkdownModel methods

|                                                    | returns | description                                                                                                               |         |
|----------------------------------------------------|---------|---------------------------------------------------------------------------------------------------------------------------|---------|
| **Style methods:**                                 |         |                                                                                                                           |         |
| loadMathJax()                                      | boolean | Adds a style element into the head of the document and returns true. In case of an error, returns false.                  |[example](https://github.com/Mathpix/mathpix-markdown-it/tree/master/examples/react-app/use-markdownToHTML-method)|
| getMathpixStyleOnly()                              | string  | returns styles as a string.                                                                                               |         |
| getMathpixStyle(true)                              | string  | returns styles as a string including styles for container.                                                                |[example](https://github.com/Mathpix/mathpix-markdown-it/tree/master/examples/react-app/use-render-method)|
| getMathpixFontsStyle()                             | boolean | returns fonts styles as a string.                                                                                         |[example](https://github.com/Mathpix/mathpix-markdown-it/tree/master/examples/react-app/use-render-method)|
| **Render methods:**                                |         |                                                                                                                           |         |
| markdownToHTML(str, options: [TMarkdownItOptions](https://github.com/Mathpix/mathpix-markdown-it#tmarkdownitoptions)) | string  | Renders input text to html element as a string.                                                                           |[example](https://github.com/Mathpix/mathpix-markdown-it/tree/master/examples/react-app/use-markdownToHTML-method)|
| render(str, options: [optionsMathpixMarkdown](https://github.com/Mathpix/mathpix-markdown-it#optionsmathpixmarkdown))     | string  | Renders input text to  HTML element as a string and wraps it in a container. Should be used to render the entire document.|[example](https://github.com/Mathpix/mathpix-markdown-it/tree/master/examples/react-app/use-render-method)|
| **Parser methods:**                                |         |                                                                                                                           |         |
| parseMarkdownByHTML(htmlString)                    | Array   | parses input html string and returns array of formats.                                                                    |[examples](https://github.com/Mathpix/mathpix-markdown-it/tree/master/examples/react-app/use-parseMarkdownByHTML-method)|
| parseMarkdownByElement(htmlElement)                | Array   | parses input html element and returns array of formats.                                                                   |         |



### TMarkdownItOptions

|                                       | type&nbsp;*`default`*        |  description                                                                                                           |
|---------------------------------------|------------------------------|------------------------------------------------------------------------------------------------------------------------|
| `isDisableFancy`                      | boolean&nbsp;*`false`*       | `true` - disables processing of special characters (Example: `+ item`, `- item` )                                      |
| `disableRules`                        | array of strings&nbsp;*`[]`* | You can pass a list of rules for markdown rendering that should be disabled but only if `isDisableFancy` is not `true`.|
|                                       |                              | Example:  `disableRules = ['replacements'] ` will disable fancy characters processing.                                 |
| `htmlTags`                            | boolean;*`false`*            | Enables HTML tags in source                                                                                            |
| `htmlDisableTagMatching`              | boolean;*`false`*            | Allows to turn off the validation that checks for matching opening and closing HTML tags                               |
| `xhtmlOut`                            | boolean;*`false`*            | Uses `/` to close single tags (`<br />`)                                                                               |
| `breaks`                              | boolean;*`true`*             | Converts `\n` in paragraphs into `<br>`                                                                                |
| `typographer`                         | boolean;*`true`*             | Enables some language-neutral replacement + quotes beautification  (Example: `(c) (C) (r) (R) (tm) (TM) (p) (P) +-`)   |
| `linkify`                             | boolean;*`true`*             | Autoconverts URL-like text to links                                                                                    |
| `width`                               | number;*`1200`*              | Sets text container width                                                                                              |
| `lineNumbering`                       | boolean;*`false`*            | Sets line numbers. Recommended for synchronization with a text editor.                                                 |
| `outMath`                             | [TOutputMath](https://github.com/Mathpix/mathpix-markdown-it#toutputmath);*`{}`*           | Sets options to output html                                                                                            |
| `mathJax`                             | [TOutputMathJax](https://github.com/Mathpix/mathpix-markdown-it#toutputmathjax);*`{}`*       | Sets options to output MathJax                                                                                         |
| `htmlSanitize`                        | [THtmlSanitize](https://github.com/Mathpix/mathpix-markdown-it#thtmlsanitize);*`{}`*         | Sets html output options (if `htmlTags=true`). Cleans up user html input.                                              |
|                                       |                              | Removes script tags and stuff. Removes broken and malicious html. Set to `false` to disable                            |
| `smiles`                              | [ISmilesOptions](https://github.com/Mathpix/mathpix-markdown-it#ismilesoptions);*`{}`*        | Sets options to output chemistry equation                                                                              |
| `htmlWrapper`                         | [THtmlWrapper](https://github.com/Mathpix/mathpix-markdown-it#thtmlwrapper);*`{}`*          | Sets options for output full html page                                                                                 |
| `accessibility`                       | [TAccessibility](https://github.com/Mathpix/mathpix-markdown-it#taccessibility);*`{}`*        | Sets options to accessibility                                                                                          |
| `nonumbers`                           | boolean;*`false`*            | Sets options to prevent equations, tables, figure from being numbered                                                  |
| `showPageBreaks`                      | boolean;*`false`*            | Hidden tags will be shown in html like page break                                                                      |
| `centerImages`                        | boolean;*`true`*             | Center align images by default                                                                                         |
| `centerTables`                        | boolean;*`true`*             | Center align tables by default                                                                                         |
| `validateLink`                        | function;*`null`*            | The function `(url: string) => void` to override md link validator                                                     |
| `enableCodeBlockRuleForLatexCommands` | boolean;*`false`* | By default, if latex commands are indented (4 spaces / 1 tab) they do not become `Code Blocks`.               |
| `parserErrors`                        | [ParserErrors](https://github.com/Mathpix/mathpix-markdown-it#parsererrors);*`{}`*        | Sets options to output parser errors for equations and tabular                    |
| `codeHighlight`                       | [CodeHighlight](https://github.com/Mathpix/mathpix-markdown-it#codehighlight);*`{}`*      | Sets options to highlight code block                      |
| `footnotes`                           | [Footnotes](https://github.com/Mathpix/mathpix-markdown-it#footnotes);*`{}`*              | Sets options to footnotes                                 |
| `copyToClipboard`                     | boolean;*`false`*            | Added copy to clipboard button for code chunks. To handle events, import the function addListenerCopyToClipboardEvents() from "mathpix-markdown-it/lib/copy-to-clipboard";|
| `renderOptions`                       | [RenderOptions](https://github.com/Mathpix/mathpix-markdown-it#renderoptions);*`{}`*   | Sets options to enable render rules                          |

### optionsMathpixMarkdown

|                                       | type&nbsp;*`default`*        |  description                                                                                                           |
|---------------------------------------|------------------------------|------------------------------------------------------------------------------------------------------------------------|
| `alignMathBlock`                      | string&nbsp;*`center`*       | aligns `math-block`                                                                                                    |
| `display`                             | string&nbsp;*`block`*        | `block` - the whole space, `inline-block` - renders in its actual size                                                 |
| `showTimeLog`                         | boolean&nbsp;*`false`*       | shows execution time in console                                                                                        |
| `isDisableFancy`                      | boolean&nbsp;*`false`*       | `true` - disables processing of special characters (Example: `+ item`, `- item` )                                      |
| `disableRules`                        | array of strings&nbsp;*`[]`* | You can pass a list of rules for markdown rendering that should be disabled but only if `isDisableFancy` is not `true`.|
|                                       |                              | Example:  `disableRules = ['replacements'] ` will disable fancy characters processing.                                 |
| `htmlTags`                            | boolean;*`false`*            | Enables HTML tags in source                                                                                            |
| `htmlDisableTagMatching`              | boolean;*`false`*            | Allows to turn off the validation that checks for matching opening and closing HTML tags                               |
| `xhtmlOut`                            | boolean;*`false`*            | Uses `/` to close single tags (`<br />`)                                                                               |
| `breaks`                              | boolean;*`true`*             | Converts `\n` in paragraphs into `<br>`                                                                                |
| `typographer`                         | boolean;*`true`*             | Enables some language-neutral replacement + quotes beautification (Example: `(c) (C) (r) (R) (tm) (TM) (p) (P) +-`)    |
| `linkify`                             | boolean;*`true`*             | Autoconverts URL-like text to links                                                                                    |
| `width`                               | number;*`1200`*              | Sets text container width                                                                                              |
| `outMath`                             | [TOutputMath](https://github.com/Mathpix/mathpix-markdown-it#toutputmath);*`{}`*           | Sets options to output html                                                                                            |
| `mathJax`                             | [TOutputMathJax](https://github.com/Mathpix/mathpix-markdown-it#toutputmathjax);*`{}`*        | Sets options to output MathJax                                                                                         |
| `htmlSanitize`                        | [THtmlSanitize](https://github.com/Mathpix/mathpix-markdown-it#thtmlsanitize);*`{}`*         | Sets html output options (if `htmlTags=true`). Cleans up user html input.                                              |
|                                       |                              | Removes script tags and stuff. Removes broken and malicious html. Set to `false` to disable                            |
| `smiles`                              | [ISmilesOptions](https://github.com/Mathpix/mathpix-markdown-it#ismilesoptions);*`{}`*        | Sets options to output chemistry equation                                                                              |
| `nonumbers`                           | boolean;*`false`*            | Sets options to prevent equations, tables, figure from being numbered                                                  |
| `showPageBreaks`                      | boolean;*`false`*            | Hidden tags will be shown in html like page break                                                                      |
| `centerImages`                        | boolean;*`true`*             | Center align images by default                                                                                         |
| `centerTables`                        | boolean;*`true`*             | Center align tables by default                                                                                         |
| `validateLink`                        | function;*`null`*            | The function `(url: string) => void` to override md link validator                                                     |
| `enableCodeBlockRuleForLatexCommands` | boolean;*`false`* | By default, if latex commands are indented (4 spaces / 1 tab) they do not become `Code Blocks`.               |
| `parserErrors`                        | [ParserErrors](https://github.com/Mathpix/mathpix-markdown-it#parsererrors);*`{}`*        | Sets options to output parser errors for equations and tabular                    |
| `codeHighlight`                       | [CodeHighlight](https://github.com/Mathpix/mathpix-markdown-it#codehighlight);*`{}`*      | Sets options to highlight code block                      |
| `footnotes`                           | [Footnotes](https://github.com/Mathpix/mathpix-markdown-it#footnotes);*`{}`*              | Sets options to footnotes                                 |
| `copyToClipboard`                     | boolean;*`false`*            | Added copy to clipboard button for code chunks. To handle events, import the function addListenerCopyToClipdoardEvents() from "mathpix-markdown-it/lib/copy-to-clipboard";|
| `renderOptions`                       | [RenderOptions](https://github.com/Mathpix/mathpix-markdown-it#renderoptions);*`{}`*   | Sets options to enable render rules                             |

### TOutputMath

|                          | type&nbsp;*`default`*        |  description                                                                                                      |
|--------------------------|------------------------------|-------------------------------------------------------------------------------------------------------------------|
| `output_format`          | `'svg' \| 'mathml' \| 'latex'`&nbsp;*`'svg'`* | Controls which math format is placed in HTML output. See [Output Format](#output-format) section.    |
| `include_mathml`         | boolean&nbsp;*`false`*       | outputs mathml `<mathml style="display: none"><math>...</math></mathml>`                                          |
| `include_mathml_word`    | boolean&nbsp;*`false`*       | outputs mathml_word `<mathmlword style="display: none"><math>...</math></mathmlword>`                             |
| `include_asciimath`      | boolean&nbsp;*`false`*       | outputs asciimath `<asciimath style="display: none">...</asciimath>`                                              |
| `include_linearmath`     | boolean&nbsp;*`false`*       | outputs linearmath `<linearmath style="display: none">...</linearmath>`                                            |
| `include_latex`          | boolean&nbsp;*`true`*        | outputs latex `<latex style="display: none">...</latex>`                                                          |
| `include_svg`            | boolean&nbsp;*`true`*        | outputs svg `<svg>...</svg>`                                                                                      |
| `include_tsv`            | boolean&nbsp;*`false`*       | outputs tsv `<tsv style="display: none">...</tsv>`                                                                |
| `include_csv`            | boolean&nbsp;*`false`*       | outputs csv `<csv style="display: none">...</csv>`                                                                |
| `include_table_html`     | boolean&nbsp;*`true`*        | outputs html table `<table>...</table>`                                                                           |
| `include_table_markdown` | boolean&nbsp;*`false`*       | outputs markdown table `<table-markdown>...</table-markdown>`                                                     |
| `include_smiles`         | boolean&nbsp;*`false`*       | outputs smiles `<smiles>...</smiles>`                                                                             |
| `tsv_separators`         | `{column: '\t', row: '\n'}`  | Separators for tsv tables                                                                                         |
| `csv_separators`         | `{column: ',', row: '\n', toQuoteAllFields: false}` | Separators for csv tables. If `toQuoteAllFields=true` - all fields will be enclosed in double quotes|
| `not_catch_errors`       | boolean&nbsp;*`false`*       | Do not catch math rendering errors                                                                                |
| `include_error`          | boolean&nbsp;*`false`*       | outputs error `<error style="display: none">...</error>`                                                          |
| `include_speech`         | boolean&nbsp;*`false`*       | outputs speech `<speech>...</speech`                                                                              | 
| `md_separators`          | `{column: ' ', row: ' <br> '}`| Separators for Markdown tables                                                                                   | 
| `table_markdown`         | `{math_as_ascii: false, math_inline_delimiters: ['$','$']}`| By default, math goes into Markdown tables as latex and is enclosed in `$...$` delimiters. If `math_as_ascii` is set to `true`, then math will be represented as asciimath | 

### TOutputMathJax

|                      | type&nbsp;*`default`*        |  description                                                                                                       |
|----------------------|------------------------------|--------------------------------------------------------------------------------------------------------------------|
| `mtextInheritFont`   | boolean&nbsp;*`false`*       | true to make mtext elements use surrounding font                                                                   |


### THtmlSanitize

|                                     | type&nbsp;*`default`*      |  description                                                                                                            |
|-------------------------------------|----------------------------|-------------------------------------------------------------------------------------------------------------------------|
| `disallowedTagsMode`                | `string`&nbsp;*`discard`*  | `discard` (the default) - disallowed tags are discarded.                                                                |
|                                     |                            | `escape` - the disallowed tags are escaped rather than discarded. Any text or subtags is handled normally.              |
|                                     |                            | `recursiveEscape` - the disallowed tags are escaped rather than discarded, and the same treatment is applied            |
|                                     |                            | to all subtags, whether otherwise allowed or not.                                                                       |
| `allowedTags`                       | `Array<string>`            | List of allowed HTML tags. See [default options](https://github.com/Mathpix/mathpix-markdown-it#thtmlsanitize-default-options). |
| `allowedAttributes`                 | `Record<string, string[]>` | Defines allowed attributes for specific tags. Example: `{ a: ['href', 'name', 'target'], img: ['src'] }`.               |
| `allowedIframeHostnames`            | `Array<string>`            | List of allowed hostnames for `<iframe>` sources. Helps prevent embedding unsafe content.                               |
| `selfClosing`                       | `Array<string>`            | List of self-closing tags such as `img`, `br`, `hr`, `area`, `base`, `basefont`, `input`, `link`, `meta`.               |
| `allowedSchemes`                    | `Array<string>` (default: `["http", "https", "ftp", "mailto"]`) | Defines the allowed URL schemes for links, images, and other elements.             |
| `allowedSchemesByTag`               | `Record<string, string[]>` | Defines allowed schemes per tag. Example: `{ a: ['http', 'https'], img: ['data'] }`.                                    |
| `allowedSchemesAppliedToAttributes` | `Array<string>`            | Defines which attributes should have their values checked against `allowedSchemes`. Default: `['href', 'src', 'cite']`. |
| `allowProtocolRelative`             | `boolean`&nbsp;*`true`*    | If `true`, allows protocol-relative URLs (e.g., `//example.com`).                                                       |
| `enforceHtmlBoundary`               | `boolean`&nbsp;*`false`*   | If `true`, ensures that sanitized output is enclosed within valid HTML boundaries.                                      |
| `skipCloseTag`                      | `boolean`&nbsp;*`false`*   | If `true`, skips closing tags in the output.                                                                            |

### HtmlSanitize default options

```js
  allowedTags: ['h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
    'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'abbr', 'code', 'hr', 'br', 'div',
    'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'u'],
  disallowedTagsMode: 'discard',
  allowedAttributes: {
    a: [ 'href', 'name', 'target' ],
    // We don't currently allow img itself by default, but
    // these attributes would make sense if we did.
    img: [ 'src' ]
  },
  // Lots of these won't come up by default because we don't allow them
  selfClosing: [ 'img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta' ],
  // URL schemes we permit
  allowedSchemes: ['http', 'https', 'ftp', 'mailto'],
  allowedSchemesByTag: {},
  allowedSchemesAppliedToAttributes: [ 'href', 'src', 'cite' ],
  allowProtocolRelative: true,
  enforceHtmlBoundary: false,
  skipCloseTag: false
```


### ISmilesOptions

|                             | type&nbsp;*`default`*       |  description                                                                                                                                |
|-----------------------------|-----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| `theme`                     | string&nbsp;*`light`*       | Color theme                                                                                                                                 |
| `fontSize`                  | number&nbsp;*`14`*          | Font Size (in px)                                                                                                                           |
| `disableGradient`           | boolean&nbsp;*`false`*      | Disable gradient coloring                                                                                                                   |
| `disableColors`             | boolean&nbsp;*`false`*      | Disable all coloring                                                                                                                        |
| `ringVisualization`         | string&nbsp;*`default`*     | Determines how to display aromatic rings. `circle` - a ring; `default` - alternating double and single lines.                               |
| `ringAromaticVisualization` | string&nbsp;*`default`*     | For Bridged Rings. Determines how to display aromatic rings. `dashed` - dashed gray lines; `default` - alternating double and single lines. |


### THtmlWrapper

|                             | type&nbsp;*`default`*       |  description                                                                                                                                |
|-----------------------------|-----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| `title`                     | string&nbsp;*`light`*       | Sets title for html page                                                                                                                    |
| `includeStyles`             | boolean&nbsp;*`false`*      | Includes mathpix-markdown styles                                                                                                            |
| `includeFonts`              | boolean&nbsp;*`false`*      | Includes mathpix-markdown fonts                                                                                                             |

### ParserErrors enum

|              |                                         |
|--------------|-----------------------------------------|
| `show`       | Display errors in resulting html        |
| `hide`       | Hide errors in resulting html           |
| `show_input` | Display original latex instead of error | 

### CodeHighlight

|              | type&nbsp;*`default`*  |                                                                                                               |
|--------------|------------------------|---------------------------------------------------------------------------------------------------------------|
| `auto`       | boolean&nbsp;*`false`* | Highlighting with language detection                                                                          |
| `code`       | boolean&nbsp;*`true`*  | Add code highlighting for a code block which created by indenting. To auto-detect the language, set auto=true |

### Footnotes

|                | type&nbsp;*`default`*       |                                                                                                    |
|----------------|-----------------------------|----------------------------------------------------------------------------------------------------|
| `fontSize`     | string&nbsp;*`unset`*       | Ability to change font size for footnotes section                                                  |
| `compact_refs` | boolean&nbsp;*`unset`*      | Renders footnote references in a compact format, avoiding repeated numbering for the same footnote |

### RenderOptions

|                                   | type&nbsp;*`default`*                                                                          |                                                                                                                                                              |
|-----------------------------------|------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `enable_markdown`                 | boolean&nbsp;*`true`*                                                                          | Enable markdown rules. If it is set to `false`, then all markdown rules will be disabled. This also disables the rules for `enable_markdown_mmd_extensions`. |
| `enable_latex`                    | boolean&nbsp;*`true`*                                                                          | Enable latex rules. If it is set to `false`, then all latex and math rules will be disabled.                                                                 |
| `enable_markdown_mmd_extensions`  | boolean&nbsp;*`true`*                                                                          | Enable markdown mmd extensions rules: `smiles`, `asciiMath`, `mathML`. If it is set to `false` then these rules will be disabled.                            |

### TAccessibility

|                             | type&nbsp;*`default`*       | description
|-----------------------------|-----------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| `assistiveMml`              | boolean&nbsp;*`false`*      | Should Assistive MathML be enabled to math (mjx-container).                                                                                |
| `sre`                       | object&nbsp;*`null`*        | spe object from library [speech-rule-engine](https://www.npmjs.com/package/speech-rule-engine) for semantic interpretation.                                                                    |
|                             |                             | If this value is not set then the aria-label for accessibility will not be added to the math at render time.                               |  

`sre` Has different loaders for node and browser.
1. For **Browser libraries**, synchronous loading is used.
```js
import { loadSre } from "mathpix-markdown-it/lib/sre/sre-browser";
const sre = loadSre();
```

2. For **Node modules**, asynchronous loading is used.

```js
const { loadSreAsync } = require('mathpix-markdown-it/lib/sre/sre-node');

(async() => {
  const sre = await loadSreAsync();
})

```

Then just pass the resulting value to `accessibility.sre`
```js
accessibility: {
     assistiveMml: true, // assistive-mml will be added to mjx-container
     sre: sre
   }
```

### Adding accessibility to math on already rendered html.

`addAriaToMathHTML(sre, html)` function will add accessibility attributes. 
Can only be used for **Browser libraries**

```js
import { loadSre } from "mathpix-markdown-it/lib/sre/sre-browser";
const sre = loadSre();

const htmlAssistive = addAriaToMathHTML(sre, html);
```

# Development

Install dependencies:

```shell
$ npm install
```

Compile TypeScript into JavaScript files.

```shell
$ npm run compile
```

Build the es5 file for node.

```shell
$ npm run build
```

# Testing

```shell
$ npm run test
```
