# mathpix-markdown-it Node examples

This repository contains examples of how to use mathpix-markdown-it in your node projects.

## Install

```
git clone https://github.com/Mathpix/mathpix-markdown-it.git
cd examples/mathpix-markdown-it-node-examples
npm install
node app.js
```


`http://localhost:8088/`

It returns html page.

Result:

![screenshot-localhost_8088-2020 01 14-12_14_49](https://user-images.githubusercontent.com/32493105/72335348-853d4b80-36c7-11ea-91a3-cd99e1842668.png)



#### `POST /convert`

Examples:

`curl -d "\\(x^x\\)" "http://localhost:8088/convert"`

Result:

```json
{
    "htmlMM": "<div>“<span  class=\"math-inline \" ><mjx-container class=\"MathJax\" jax=\"SVG\"><svg style=\"vertical-align: -0.025ex\" xmlns=\"http://www.w3.org/2000/svg\" width=\"2.322ex\" height=\"1.553ex\" role=\"img\" focusable=\"false\" viewBox=\"0 -675.5 1026.5 686.5\"><g stroke=\"currentColor\" fill=\"currentColor\" stroke-width=\"0\" transform=\"matrix(1 0 0 -1 0 0)\"><g data-mml-node=\"math\"><g data-mml-node=\"msup\"><g data-mml-node=\"mi\"><path data-c=\"78\" d=\"M52 289Q59 331 106 386T222 442Q257 442 286 424T329 379Q371 442 430 442Q467 442 494 420T522 361Q522 332 508 314T481 292T458 288Q439 288 427 299T415 328Q415 374 465 391Q454 404 425 404Q412 404 406 402Q368 386 350 336Q290 115 290 78Q290 50 306 38T341 26Q378 26 414 59T463 140Q466 150 469 151T485 153H489Q504 153 504 145Q504 144 502 134Q486 77 440 33T333 -11Q263 -11 227 52Q186 -10 133 -10H127Q78 -10 57 16T35 71Q35 103 54 123T99 143Q142 143 142 101Q142 81 130 66T107 46T94 41L91 40Q91 39 97 36T113 29T132 26Q168 26 194 71Q203 87 217 139T245 247T261 313Q266 340 266 352Q266 380 251 392T217 404Q177 404 142 372T93 290Q91 281 88 280T72 278H58Q52 284 52 289Z\"></path></g><g data-mml-node=\"mi\" transform=\"translate(572, 363) scale(0.707)\"><path data-c=\"78\" d=\"M52 289Q59 331 106 386T222 442Q257 442 286 424T329 379Q371 442 430 442Q467 442 494 420T522 361Q522 332 508 314T481 292T458 288Q439 288 427 299T415 328Q415 374 465 391Q454 404 425 404Q412 404 406 402Q368 386 350 336Q290 115 290 78Q290 50 306 38T341 26Q378 26 414 59T463 140Q466 150 469 151T485 153H489Q504 153 504 145Q504 144 502 134Q486 77 440 33T333 -11Q263 -11 227 52Q186 -10 133 -10H127Q78 -10 57 16T35 71Q35 103 54 123T99 143Q142 143 142 101Q142 81 130 66T107 46T94 41L91 40Q91 39 97 36T113 29T132 26Q168 26 194 71Q203 87 217 139T245 247T261 313Q266 340 266 352Q266 380 251 392T217 404Q177 404 142 372T93 290Q91 281 88 280T72 278H58Q52 284 52 289Z\"></path></g></g></g></g></svg></mjx-container></span>”</div>\n"
}
```

### Example of Latex to mathml/asciimath/tsv conversion

1. `node conversion/math.js`
2. `node conversion/tabular.js`
3. `node conversion/math_outMath.js`
4. `node conversion/tabular_outMath.js`
5. `node conversion/tabular_include_sub_math.js`
6. `node conversion/tabular_not_include_sub_math.js`
