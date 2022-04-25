# ACCESSIBILITY

[speech-rule-engine](https://www.npmjs.com/package/speech-rule-engine)


## Browser

To form accessibility attributes, the browser version of `speech-rule-engine` is used. 
This requires access to window and DOM

```js
import { loadSre } from "mathpix-markdown-it/lib/sre/sre-browser";
const sre = loadSre();

import { MathpixMarkdownModel } from "mathpix-markdown-it";

const mmdOptions = {
  outMath: {
    include_svg: true,
    include_speech: true,
  },
  accessibility: {
    assistiveMml: true, // assistive-mml will be added to mjx-container
    sre: sre
  },
};

const html = MathpixMarkdownModel.markdownToHTML("$x^y$", mmdOptions);
console.log('html => ', html);
```

```html
<div>
  <span class="math-inline ">
    <speech style="display: none">x Superscript y</speech>
    <mjx-container class="MathJax" jax="SVG" role="math" aria-label="x Superscript y" style="position: relative;">
      <svg xmlns="http://www.w3.org/2000/svg" width="2.191ex" height="1.553ex" role="img" focusable="false" viewBox="0 -675.5 968.5 686.5" aria-hidden="true" style="vertical-align: -0.025ex;"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="msup"><g data-mml-node="mi"><path data-c="78" d="M52 289Q59 331 106 386T222 442Q257 442 286 424T329 379Q371 442 430 442Q467 442 494 420T522 361Q522 332 508 314T481 292T458 288Q439 288 427 299T415 328Q415 374 465 391Q454 404 425 404Q412 404 406 402Q368 386 350 336Q290 115 290 78Q290 50 306 38T341 26Q378 26 414 59T463 140Q466 150 469 151T485 153H489Q504 153 504 145Q504 144 502 134Q486 77 440 33T333 -11Q263 -11 227 52Q186 -10 133 -10H127Q78 -10 57 16T35 71Q35 103 54 123T99 143Q142 143 142 101Q142 81 130 66T107 46T94 41L91 40Q91 39 97 36T113 29T132 26Q168 26 194 71Q203 87 217 139T245 247T261 313Q266 340 266 352Q266 380 251 392T217 404Q177 404 142 372T93 290Q91 281 88 280T72 278H58Q52 284 52 289Z"></path></g><g data-mml-node="mi" transform="translate(572, 363) scale(0.707)"><path data-c="79" d="M21 287Q21 301 36 335T84 406T158 442Q199 442 224 419T250 355Q248 336 247 334Q247 331 231 288T198 191T182 105Q182 62 196 45T238 27Q261 27 281 38T312 61T339 94Q339 95 344 114T358 173T377 247Q415 397 419 404Q432 431 462 431Q475 431 483 424T494 412T496 403Q496 390 447 193T391 -23Q363 -106 294 -155T156 -205Q111 -205 77 -183T43 -117Q43 -95 50 -80T69 -58T89 -48T106 -45Q150 -45 150 -87Q150 -107 138 -122T115 -142T102 -147L99 -148Q101 -153 118 -160T152 -167H160Q177 -167 186 -165Q219 -156 247 -127T290 -65T313 -9T321 21L315 17Q309 13 296 6T270 -6Q250 -11 231 -11Q185 -11 150 11T104 82Q103 89 103 113Q103 170 138 262T173 379Q173 380 173 381Q173 390 173 393T169 400T158 404H154Q131 404 112 385T82 344T65 302T57 280Q55 278 41 278H27Q21 284 21 287Z"></path></g></g></g></g></svg>
      <mjx-assistive-mml role="presentation" unselectable="on" display="inline"><math xmlns="http://www.w3.org/1998/Math/MathML"><msup><mi>x</mi><mi>y</mi></msup></math></mjx-assistive-mml>
    </mjx-container>
  </span>
</div>
```


## Node.js

To form accessibility, the node version of `speech-rule-engine` is used.
Modules are loaded asynchronously. 

`const { loadSreAsync } = require('mathpix-markdown-it/lib/sre/sre-node');`


```js
const { loadSreAsync } = require('mathpix-markdown-it/lib/sre/sre-node');;
const { MathpixMarkdownModel } = require('mathpix-markdown-it');

( async() => {
  const sre = await loadSreAsync();

  const options = {
    accessibility: {
      assistiveMml: true,
      sre: sre
    },
    outMath: {
      include_svg: true,
      include_speech: true,

    }
  };


  const htmlMM = MathpixMarkdownModel.markdownToHTML("$x^y$", options);
  console.log('==>htmlMM=>', htmlMM)

})();

```

```html
<div>
  <span class="math-inline ">
    <speech style="display: none">x Superscript y</speech>
    <mjx-container class="MathJax" jax="SVG" role="math" style="position: relative" aria-label="x Superscript y">
      <svg style="vertical-align: -0.025ex" xmlns="http://www.w3.org/2000/svg" width="2.191ex" height="1.553ex" role="img" focusable="false" viewBox="0 -675.5 968.5 686.5" aria-hidden="true"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="msup"><g data-mml-node="mi"><path data-c="78" d="M52 289Q59 331 106 386T222 442Q257 442 286 424T329 379Q371 442 430 442Q467 442 494 420T522 361Q522 332 508 314T481 292T458 288Q439 288 427 299T415 328Q415 374 465 391Q454 404 425 404Q412 404 406 402Q368 386 350 336Q290 115 290 78Q290 50 306 38T341 26Q378 26 414 59T463 140Q466 150 469 151T485 153H489Q504 153 504 145Q504 144 502 134Q486 77 440 33T333 -11Q263 -11 227 52Q186 -10 133 -10H127Q78 -10 57 16T35 71Q35 103 54 123T99 143Q142 143 142 101Q142 81 130 66T107 46T94 41L91 40Q91 39 97 36T113 29T132 26Q168 26 194 71Q203 87 217 139T245 247T261 313Q266 340 266 352Q266 380 251 392T217 404Q177 404 142 372T93 290Q91 281 88 280T72 278H58Q52 284 52 289Z"></path></g><g data-mml-node="mi" transform="translate(572, 363) scale(0.707)"><path data-c="79" d="M21 287Q21 301 36 335T84 406T158 442Q199 442 224 419T250 355Q248 336 247 334Q247 331 231 288T198 191T182 105Q182 62 196 45T238 27Q261 27 281 38T312 61T339 94Q339 95 344 114T358 173T377 247Q415 397 419 404Q432 431 462 431Q475 431 483 424T494 412T496 403Q496 390 447 193T391 -23Q363 -106 294 -155T156 -205Q111 -205 77 -183T43 -117Q43 -95 50 -80T69 -58T89 -48T106 -45Q150 -45 150 -87Q150 -107 138 -122T115 -142T102 -147L99 -148Q101 -153 118 -160T152 -167H160Q177 -167 186 -165Q219 -156 247 -127T290 -65T313 -9T321 21L315 17Q309 13 296 6T270 -6Q250 -11 231 -11Q185 -11 150 11T104 82Q103 89 103 113Q103 170 138 262T173 379Q173 380 173 381Q173 390 173 393T169 400T158 404H154Q131 404 112 385T82 344T65 302T57 280Q55 278 41 278H27Q21 284 21 287Z"></path></g></g></g></g></svg>
      <mjx-assistive-mml role="presentation" unselectable="on" display="inline"><math xmlns="http://www.w3.org/1998/Math/MathML"><msup><mi>x</mi><mi>y</mi></msup></math></mjx-assistive-mml>
    </mjx-container>
  </span>
</div>

```


## Web Worker

For the Web worker, we cannot use any of the `speech-rule-engine` versions.
This will throw errors. Since the Web worker does not have access to the DOM and Window, 
the `speech-rule-engine` will try to switch to the node version. 
And it will throw a `process` and `require` access error.

Solutions to this problem:
- Render to html in Web worker.
- Then, after the messages from the Web Worker with rendered html are received. 
We can add the necessary attributes to the resulting html using the function `addAriaToMathHTML`

`import { addAriaToMathHTML } from "mathpix-markdown-it/lib/mmd-sre";`


#### Web worker

```js
const mmdOptions = {
  outMath: {
    include_svg: true,
  },
  accessibility: {
    assistiveMml: true, // This should be set to true
    sre: false // This should be set to false
  }
};

const html = MM.markdownToHTML("$x^y$", mmdOptions);
```

```html
<div>
  <span class="math-inline ">
    <mjx-container class="MathJax" jax="SVG" role="presentation" style="position: relative">
      <svg style="vertical-align: -0.025ex" xmlns="http://www.w3.org/2000/svg" width="2.191ex" height="1.553ex" role="img" focusable="false" viewBox="0 -675.5 968.5 686.5" aria-hidden="true"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="msup"><g data-mml-node="mi"><path data-c="78" d="M52 289Q59 331 106 386T222 442Q257 442 286 424T329 379Q371 442 430 442Q467 442 494 420T522 361Q522 332 508 314T481 292T458 288Q439 288 427 299T415 328Q415 374 465 391Q454 404 425 404Q412 404 406 402Q368 386 350 336Q290 115 290 78Q290 50 306 38T341 26Q378 26 414 59T463 140Q466 150 469 151T485 153H489Q504 153 504 145Q504 144 502 134Q486 77 440 33T333 -11Q263 -11 227 52Q186 -10 133 -10H127Q78 -10 57 16T35 71Q35 103 54 123T99 143Q142 143 142 101Q142 81 130 66T107 46T94 41L91 40Q91 39 97 36T113 29T132 26Q168 26 194 71Q203 87 217 139T245 247T261 313Q266 340 266 352Q266 380 251 392T217 404Q177 404 142 372T93 290Q91 281 88 280T72 278H58Q52 284 52 289Z"></path></g><g data-mml-node="mi" transform="translate(572, 363) scale(0.707)"><path data-c="79" d="M21 287Q21 301 36 335T84 406T158 442Q199 442 224 419T250 355Q248 336 247 334Q247 331 231 288T198 191T182 105Q182 62 196 45T238 27Q261 27 281 38T312 61T339 94Q339 95 344 114T358 173T377 247Q415 397 419 404Q432 431 462 431Q475 431 483 424T494 412T496 403Q496 390 447 193T391 -23Q363 -106 294 -155T156 -205Q111 -205 77 -183T43 -117Q43 -95 50 -80T69 -58T89 -48T106 -45Q150 -45 150 -87Q150 -107 138 -122T115 -142T102 -147L99 -148Q101 -153 118 -160T152 -167H160Q177 -167 186 -165Q219 -156 247 -127T290 -65T313 -9T321 21L315 17Q309 13 296 6T270 -6Q250 -11 231 -11Q185 -11 150 11T104 82Q103 89 103 113Q103 170 138 262T173 379Q173 380 173 381Q173 390 173 393T169 400T158 404H154Q131 404 112 385T82 344T65 302T57 280Q55 278 41 278H27Q21 284 21 287Z"></path></g></g></g></g></svg>
      <mjx-assistive-mml role="presentation" unselectable="on" display="inline"><math xmlns="http://www.w3.org/1998/Math/MathML"><msup><mi>x</mi><mi>y</mi></msup></math></mjx-assistive-mml>
    </mjx-container>
  </span>
</div>
```

#### After the messages from the Web Worker with rendered html are received.

```js
import { loadSre } from "mathpix-markdown-it/lib/sre/sre-browser";
import { addAriaToMathHTML } from "mathpix-markdown-it/lib/sre";
const sre = loadSre();

const htmlNew = addAriaToMathHTML(sre, html);
```

```html
<div>
  <span class="math-inline ">
    <mjx-container class="MathJax" jax="SVG" role="math" style="position: relative" aria-label="x Superscript y">
      <svg style="vertical-align: -0.025ex" xmlns="http://www.w3.org/2000/svg" width="2.191ex" height="1.553ex" role="img" focusable="false" viewBox="0 -675.5 968.5 686.5" aria-hidden="true"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="msup"><g data-mml-node="mi"><path data-c="78" d="M52 289Q59 331 106 386T222 442Q257 442 286 424T329 379Q371 442 430 442Q467 442 494 420T522 361Q522 332 508 314T481 292T458 288Q439 288 427 299T415 328Q415 374 465 391Q454 404 425 404Q412 404 406 402Q368 386 350 336Q290 115 290 78Q290 50 306 38T341 26Q378 26 414 59T463 140Q466 150 469 151T485 153H489Q504 153 504 145Q504 144 502 134Q486 77 440 33T333 -11Q263 -11 227 52Q186 -10 133 -10H127Q78 -10 57 16T35 71Q35 103 54 123T99 143Q142 143 142 101Q142 81 130 66T107 46T94 41L91 40Q91 39 97 36T113 29T132 26Q168 26 194 71Q203 87 217 139T245 247T261 313Q266 340 266 352Q266 380 251 392T217 404Q177 404 142 372T93 290Q91 281 88 280T72 278H58Q52 284 52 289Z"></path></g><g data-mml-node="mi" transform="translate(572, 363) scale(0.707)"><path data-c="79" d="M21 287Q21 301 36 335T84 406T158 442Q199 442 224 419T250 355Q248 336 247 334Q247 331 231 288T198 191T182 105Q182 62 196 45T238 27Q261 27 281 38T312 61T339 94Q339 95 344 114T358 173T377 247Q415 397 419 404Q432 431 462 431Q475 431 483 424T494 412T496 403Q496 390 447 193T391 -23Q363 -106 294 -155T156 -205Q111 -205 77 -183T43 -117Q43 -95 50 -80T69 -58T89 -48T106 -45Q150 -45 150 -87Q150 -107 138 -122T115 -142T102 -147L99 -148Q101 -153 118 -160T152 -167H160Q177 -167 186 -165Q219 -156 247 -127T290 -65T313 -9T321 21L315 17Q309 13 296 6T270 -6Q250 -11 231 -11Q185 -11 150 11T104 82Q103 89 103 113Q103 170 138 262T173 379Q173 380 173 381Q173 390 173 393T169 400T158 404H154Q131 404 112 385T82 344T65 302T57 280Q55 278 41 278H27Q21 284 21 287Z"></path></g></g></g></g></svg>
      <mjx-assistive-mml role="presentation" unselectable="on" display="inline"><math xmlns="http://www.w3.org/1998/Math/MathML"><msup><mi>x</mi><mi>y</mi></msup></math></mjx-assistive-mml>
    </mjx-container>
    <speech style="display: none;">x Superscript y</speech>
  </span>
</div>
```
