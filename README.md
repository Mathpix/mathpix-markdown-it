# mathpix-markdown-it

Component that can render Mathpix output.

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
| `htmlTags`       | boolean;*`false`*            | Enable HTML tags in source
| `breaks`         | boolean;*`true`*             | Convert `\n` in paragraphs into `<br>`
| `typographer`    | boolean;*`true`*             | Enable some language-neutral replacement + quotes beautification
| `width`          | number;*`1200`*              | Text container width 


### Sample for non-React UI code

```js
import {MathpixMarkdownModel as MM} from 'mathpix-markdown-it';

const html = MM.render('# markdown-it rulezz!', 'right');

```


```js
    MM.render ( text: string, options: optionsMathpixMarkdown );

````
## optionsMathpixMarkdown

|                  | type&nbsp;*`default`*        |  description                                                                                                          |
|------------------|------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| `alignMathBlock` | string&nbsp;*`center`*       | should align `math-block`                                                                                             |
| `display`        | string&nbsp;*`block`*        | `block` - the whole space, `inline-block` - renders in its actual size                                                |
| `showTimeLog`    | boolean&nbsp;*`false`*       | should show execution time in console                                                                                 |
| `isDisableFancy` | boolean&nbsp;*`false`*       | `true` - disables processing of special characters (Example: `(c)`, `+`, `-` )                                        |
| `disableRules`   | array of strings&nbsp;*`[]`* | We can pass a list of rules for markdown rendering that should be disabled but only if `isDisableFancy` is not `true`.|
|                  |                              | Example:  `disableRules = ['replacements'] ` will disable fancy characters processing.                                |
| `htmlTags`       | boolean;*`false`*            | Enable HTML tags in source
| `breaks`         | boolean;*`true`*             | Convert `\n` in paragraphs into `<br>`
| `typographer`    | boolean;*`true`*             | Enable some language-neutral replacement + quotes beautification
| `width`          | number;*`1200`*              | Text container width 

## Development

### Get Started

#### - Install dependencies

```shell
$ npm install
```

#### - Build the component for production deployment

```shell
$ npm run build
```
