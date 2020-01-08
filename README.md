# mathpix-markdown-it

**mathpix-markdown-it** is an extended Markdown-it specification optimized for mathematics and science.
It not only supports LaTeX math mode (e.g. standard Markdown),
it also supports some aspects of LaTeX text mode, such as `title`, `author`, `abstract`, `tabular`, `figure` environment.
Using marking Markdown, LaTeX, MathML you get a high-quality display of notations on HTML-pages.


This repository contains `mathpix-markdown-it` source files written in TypeScript.
They are compiled into JavaScript files.

## Install

**node.js**

```bash
npm install https://github.com/Mathpix/mathpix-markdown-it.git
```

## Usage examples

### Sample for React Component

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
## props

| prop             | type&nbsp;*`default`*        |  description                                                                                                          |
|------------------|------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| `text`           | sting                        | string that will be converted                                                                                         |
| `alignMathBlock` | string&nbsp;*`center`*       | should align `math-block`                                                                                             |
| `display`        | string&nbsp;*`block`*        | `block` - the whole space, `inline-block` - renders in its actual size                                                |
| `showTimeLog`    | boolean&nbsp;*`false`*       | should show execution time in console                                                                                 |
| `isDisableFancy` | boolean&nbsp;*`false`*       | `true` - disables processing of special characters (Example: `(c)`, `+`, `-` )                                        |
| `disableRules`   | array of strings&nbsp;*`[]`* | We can pass a list of rules for markdown rendering that should be disabled but only if `isDisableFancy` is not `true`.|
|                  |                              | Example:  `disableRules = ['replacements'] ` will disable fancy characters processing.                                |
| `htmlTags`       | boolean;*`false`*            | Enable HTML tags in source                                                                                            |
| `breaks`         | boolean;*`true`*             | Convert `\n` in paragraphs into `<br>`                                                                                |
| `typographer`    | boolean;*`false`*            | Enable some language-neutral replacement + quotes beautification                                                      |
| `linkify`        | boolean;*`false`*            | Autoconvert URL-like text to links                                                                                    |
| `width`          | number;*`1200`*              | Text container width                                                                                                  |

### Sample for non-React UI code

You can also use certain functions to get styles and rendering in html:

`const isLoad = MathpixMarkdownModel.loadMathJax();` - If styles have not been added yet - add them to the style element. In case of an error, returns false.

`const mathpixStyles = MathpixMarkdownModel.getMathpixStyleOnly();` - It returns styles as a string.

`const html = MathpixMarkdownModel.markdownToHTML(content, options: TMarkdownItOptions);` - It returns a rendered html element as a string.

`const htmlMM = MathpixMarkdownModel.render(text, options: optionsMathpixMarkdown);` - Returns a rendered HTML element as a string and wraps it in a container. Should be used to render the entire document.


## TMarkdownItOptions

|                  | type&nbsp;*`default`*        |  description                                                                                                          |
|------------------|------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| `htmlTags`       | boolean;*`false`*            | Enable HTML tags in source                                                                                            |
| `breaks`         | boolean;*`true`*             | Convert `\n` in paragraphs into `<br>`                                                                                |
| `typographer`    | boolean;*`true`*             | Enable some language-neutral replacement + quotes beautification                                                      |
| `linkify`        | boolean;*`true`*             | Autoconvert URL-like text to links                                                                                    |
| `width`          | number;*`1200`*              | Text container width                                                                                                  |
| `lineNumbering`  | boolean;*`false`*            | Recommended for synchronization with a text editor.                                                                   |

## optionsMathpixMarkdown

|                  | type&nbsp;*`default`*        |  description                                                                                                          |
|------------------|------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| `alignMathBlock` | string&nbsp;*`center`*       | should align `math-block`                                                                                             |
| `display`        | string&nbsp;*`block`*        | `block` - the whole space, `inline-block` - renders in its actual size                                                |
| `showTimeLog`    | boolean&nbsp;*`false`*       | should show execution time in console                                                                                 |
| `isDisableFancy` | boolean&nbsp;*`false`*       | `true` - disables processing of special characters (Example: `(c)`, `+`, `-` )                                        |
| `disableRules`   | array of strings&nbsp;*`[]`* | We can pass a list of rules for markdown rendering that should be disabled but only if `isDisableFancy` is not `true`.|
|                  |                              | Example:  `disableRules = ['replacements'] ` will disable fancy characters processing.                                |
| `htmlTags`       | boolean;*`false`*            | Enable HTML tags in source                                                                                            |
| `breaks`         | boolean;*`true`*             | Convert `\n` in paragraphs into `<br>`                                                                                |
| `typographer`    | boolean;*`true`*             | Enable some language-neutral replacement + quotes beautification                                                      |
| `linkify`        | boolean;*`true`*             | Autoconvert URL-like text to links                                                                                    |
| `width`          | number;*`1200`*              | Text container width                                                                                                  |


### Sample for node

```js
const {MathpixMarkdownModel} = require('mathpix-markdown-it'); 
```
or
```js
const {MathpixMarkdownModel} = require('mathpix-markdown-it/es5');
```

```js
  const htmlMM = MathpixMarkdownModel.render(text, options);
  const mathpixStyles = MathpixMarkdownModel.getMathpixStyleOnly();
```
Before using mathpix-markdown-it in node applications, should be to define global variables

```js
const Window = require('window');
const window = new Window();
global.window = window;
global.document = window.document;

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
global.DOMParser = new JSDOM().window.DOMParser;
```

## Development

### Get Started

#### - Install dependencies

```shell
$ npm install
```
#### - Compile TypeScript into JavaScript files.

```shell
$ npm run compile
```

#### - Build the es5 file for node.

```shell
$ npm run build
```
