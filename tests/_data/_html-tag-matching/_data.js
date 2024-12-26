module.exports = [
  {
    mmd: '<S>This should not be strikethrough text',
    html: '<div>&lt;S&gt;This should not be strikethrough text</div>',
    htmlDisableTagMatching: '<div><s>This should not be strikethrough text</div>',
    htmlTagsDisable: '<div>&lt;S&gt;This should not be strikethrough text</div>'
  },
  {
    mmd: "<script>This should not be in script",
    html: '<div>&lt;script&gt;This should not be in script</div>',
    htmlDisableTagMatching: '',
    htmlTagsDisable: '<div>&lt;script&gt;This should not be in script</div>'
  },
  {
    mmd: '<S>This should be strikethrough text</s>',
    html: '<div><s>This should be strikethrough text</s></div>',
    htmlDisableTagMatching: '<div><s>This should be strikethrough text</s></div>',
    htmlTagsDisable: '<div>&lt;S&gt;This should be strikethrough text&lt;/s&gt;</div>'
  },
  {
    mmd: '<s>This should be strikethrough text</S>',
    html: '<div><s>This should be strikethrough text</S></div>',
    htmlDisableTagMatching: '<div><s>This should be strikethrough text</S></div>',
    htmlTagsDisable: '<div>&lt;s&gt;This should be strikethrough text&lt;/S&gt;</div>'
  },
  {
    mmd: '<script>\n' +
      ' Some script content   \n' +
      '</script>\n' +
      '\n' +
      'text1\n' +
      '<i>  <s> some text </i> </s>\n' +
      '$dd^d$\n' +
      '  `</s>`\n' +
      '\n' +
      '\n' +
      'text2\n' +
      '  <i>\n' +
      '  some text\n' +
      '$dd^d$\n' +
      '  `</i>`\n',
    html: '<div>text1<br>\n' +
      '&lt;i&gt;  <s> some text &lt;/i&gt; </s><br>\n' +
      '<span class="math-inline ">\n' +
      '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.023ex;" xmlns="http://www.w3.org/2000/svg" width="3.373ex" height="1.954ex" role="img" focusable="false" viewBox="0 -853.7 1490.7 863.7"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="1D451" d="M366 683Q367 683 438 688T511 694Q523 694 523 686Q523 679 450 384T375 83T374 68Q374 26 402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487H491Q506 153 506 145Q506 140 503 129Q490 79 473 48T445 8T417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157Q33 205 53 255T101 341Q148 398 195 420T280 442Q336 442 364 400Q369 394 369 396Q370 400 396 505T424 616Q424 629 417 632T378 637H357Q351 643 351 645T353 664Q358 683 366 683ZM352 326Q329 405 277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q233 26 290 98L298 109L352 326Z"></path></g><g data-mml-node="msup" transform="translate(520,0)"><g data-mml-node="mi"><path data-c="1D451" d="M366 683Q367 683 438 688T511 694Q523 694 523 686Q523 679 450 384T375 83T374 68Q374 26 402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487H491Q506 153 506 145Q506 140 503 129Q490 79 473 48T445 8T417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157Q33 205 53 255T101 341Q148 398 195 420T280 442Q336 442 364 400Q369 394 369 396Q370 400 396 505T424 616Q424 629 417 632T378 637H357Q351 643 351 645T353 664Q358 683 366 683ZM352 326Q329 405 277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q233 26 290 98L298 109L352 326Z"></path></g><g data-mml-node="mi" transform="translate(553,363) scale(0.707)"><path data-c="1D451" d="M366 683Q367 683 438 688T511 694Q523 694 523 686Q523 679 450 384T375 83T374 68Q374 26 402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487H491Q506 153 506 145Q506 140 503 129Q490 79 473 48T445 8T417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157Q33 205 53 255T101 341Q148 398 195 420T280 442Q336 442 364 400Q369 394 369 396Q370 400 396 505T424 616Q424 629 417 632T378 637H357Q351 643 351 645T353 664Q358 683 366 683ZM352 326Q329 405 277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q233 26 290 98L298 109L352 326Z"></path></g></g></g></g></svg></mjx-container></span><br>\n' +
      '<code>&lt;/s&gt;</code></div>\n' +
      '<div>text2<br>\n' +
      '&lt;i&gt;<br>\n' +
      'some text<br>\n' +
      '<span class="math-inline ">\n' +
      '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.023ex;" xmlns="http://www.w3.org/2000/svg" width="3.373ex" height="1.954ex" role="img" focusable="false" viewBox="0 -853.7 1490.7 863.7"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="1D451" d="M366 683Q367 683 438 688T511 694Q523 694 523 686Q523 679 450 384T375 83T374 68Q374 26 402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487H491Q506 153 506 145Q506 140 503 129Q490 79 473 48T445 8T417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157Q33 205 53 255T101 341Q148 398 195 420T280 442Q336 442 364 400Q369 394 369 396Q370 400 396 505T424 616Q424 629 417 632T378 637H357Q351 643 351 645T353 664Q358 683 366 683ZM352 326Q329 405 277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q233 26 290 98L298 109L352 326Z"></path></g><g data-mml-node="msup" transform="translate(520,0)"><g data-mml-node="mi"><path data-c="1D451" d="M366 683Q367 683 438 688T511 694Q523 694 523 686Q523 679 450 384T375 83T374 68Q374 26 402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487H491Q506 153 506 145Q506 140 503 129Q490 79 473 48T445 8T417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157Q33 205 53 255T101 341Q148 398 195 420T280 442Q336 442 364 400Q369 394 369 396Q370 400 396 505T424 616Q424 629 417 632T378 637H357Q351 643 351 645T353 664Q358 683 366 683ZM352 326Q329 405 277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q233 26 290 98L298 109L352 326Z"></path></g><g data-mml-node="mi" transform="translate(553,363) scale(0.707)"><path data-c="1D451" d="M366 683Q367 683 438 688T511 694Q523 694 523 686Q523 679 450 384T375 83T374 68Q374 26 402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487H491Q506 153 506 145Q506 140 503 129Q490 79 473 48T445 8T417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157Q33 205 53 255T101 341Q148 398 195 420T280 442Q336 442 364 400Q369 394 369 396Q370 400 396 505T424 616Q424 629 417 632T378 637H357Q351 643 351 645T353 664Q358 683 366 683ZM352 326Q329 405 277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q233 26 290 98L298 109L352 326Z"></path></g></g></g></g></svg></mjx-container></span><br>\n' +
      '<code>&lt;/i&gt;</code></div>',
    htmlDisableTagMatching: '<div>text1<br>\n' +
      '<i>  <s> some text </i> </s><br>\n' +
      '<span class="math-inline ">\n' +
      '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.023ex;" xmlns="http://www.w3.org/2000/svg" width="3.373ex" height="1.954ex" role="img" focusable="false" viewBox="0 -853.7 1490.7 863.7"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="1D451" d="M366 683Q367 683 438 688T511 694Q523 694 523 686Q523 679 450 384T375 83T374 68Q374 26 402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487H491Q506 153 506 145Q506 140 503 129Q490 79 473 48T445 8T417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157Q33 205 53 255T101 341Q148 398 195 420T280 442Q336 442 364 400Q369 394 369 396Q370 400 396 505T424 616Q424 629 417 632T378 637H357Q351 643 351 645T353 664Q358 683 366 683ZM352 326Q329 405 277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q233 26 290 98L298 109L352 326Z"></path></g><g data-mml-node="msup" transform="translate(520,0)"><g data-mml-node="mi"><path data-c="1D451" d="M366 683Q367 683 438 688T511 694Q523 694 523 686Q523 679 450 384T375 83T374 68Q374 26 402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487H491Q506 153 506 145Q506 140 503 129Q490 79 473 48T445 8T417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157Q33 205 53 255T101 341Q148 398 195 420T280 442Q336 442 364 400Q369 394 369 396Q370 400 396 505T424 616Q424 629 417 632T378 637H357Q351 643 351 645T353 664Q358 683 366 683ZM352 326Q329 405 277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q233 26 290 98L298 109L352 326Z"></path></g><g data-mml-node="mi" transform="translate(553,363) scale(0.707)"><path data-c="1D451" d="M366 683Q367 683 438 688T511 694Q523 694 523 686Q523 679 450 384T375 83T374 68Q374 26 402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487H491Q506 153 506 145Q506 140 503 129Q490 79 473 48T445 8T417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157Q33 205 53 255T101 341Q148 398 195 420T280 442Q336 442 364 400Q369 394 369 396Q370 400 396 505T424 616Q424 629 417 632T378 637H357Q351 643 351 645T353 664Q358 683 366 683ZM352 326Q329 405 277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q233 26 290 98L298 109L352 326Z"></path></g></g></g></g></svg></mjx-container></span><br>\n' +
      '<code>&lt;/s&gt;</code></div>\n' +
      '<div>text2<br>\n' +
      '<i><br>\n' +
      'some text<br>\n' +
      '<span class="math-inline ">\n' +
      '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.023ex;" xmlns="http://www.w3.org/2000/svg" width="3.373ex" height="1.954ex" role="img" focusable="false" viewBox="0 -853.7 1490.7 863.7"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="1D451" d="M366 683Q367 683 438 688T511 694Q523 694 523 686Q523 679 450 384T375 83T374 68Q374 26 402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487H491Q506 153 506 145Q506 140 503 129Q490 79 473 48T445 8T417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157Q33 205 53 255T101 341Q148 398 195 420T280 442Q336 442 364 400Q369 394 369 396Q370 400 396 505T424 616Q424 629 417 632T378 637H357Q351 643 351 645T353 664Q358 683 366 683ZM352 326Q329 405 277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q233 26 290 98L298 109L352 326Z"></path></g><g data-mml-node="msup" transform="translate(520,0)"><g data-mml-node="mi"><path data-c="1D451" d="M366 683Q367 683 438 688T511 694Q523 694 523 686Q523 679 450 384T375 83T374 68Q374 26 402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487H491Q506 153 506 145Q506 140 503 129Q490 79 473 48T445 8T417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157Q33 205 53 255T101 341Q148 398 195 420T280 442Q336 442 364 400Q369 394 369 396Q370 400 396 505T424 616Q424 629 417 632T378 637H357Q351 643 351 645T353 664Q358 683 366 683ZM352 326Q329 405 277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q233 26 290 98L298 109L352 326Z"></path></g><g data-mml-node="mi" transform="translate(553,363) scale(0.707)"><path data-c="1D451" d="M366 683Q367 683 438 688T511 694Q523 694 523 686Q523 679 450 384T375 83T374 68Q374 26 402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487H491Q506 153 506 145Q506 140 503 129Q490 79 473 48T445 8T417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157Q33 205 53 255T101 341Q148 398 195 420T280 442Q336 442 364 400Q369 394 369 396Q370 400 396 505T424 616Q424 629 417 632T378 637H357Q351 643 351 645T353 664Q358 683 366 683ZM352 326Q329 405 277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q233 26 290 98L298 109L352 326Z"></path></g></g></g></g></svg></mjx-container></span><br>\n' +
      '<code>&lt;/i&gt;</code></div>',
    htmlTagsDisable: '<div>&lt;script&gt;<br>\n' +
      'Some script content<br>\n' +
      '&lt;/script&gt;</div>\n' +
      '<div>text1<br>\n' +
      '&lt;i&gt;  &lt;s&gt; some text &lt;/i&gt; &lt;/s&gt;<br>\n' +
      '<span class="math-inline ">\n' +
      '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.023ex;" xmlns="http://www.w3.org/2000/svg" width="3.373ex" height="1.954ex" role="img" focusable="false" viewBox="0 -853.7 1490.7 863.7"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="1D451" d="M366 683Q367 683 438 688T511 694Q523 694 523 686Q523 679 450 384T375 83T374 68Q374 26 402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487H491Q506 153 506 145Q506 140 503 129Q490 79 473 48T445 8T417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157Q33 205 53 255T101 341Q148 398 195 420T280 442Q336 442 364 400Q369 394 369 396Q370 400 396 505T424 616Q424 629 417 632T378 637H357Q351 643 351 645T353 664Q358 683 366 683ZM352 326Q329 405 277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q233 26 290 98L298 109L352 326Z"></path></g><g data-mml-node="msup" transform="translate(520,0)"><g data-mml-node="mi"><path data-c="1D451" d="M366 683Q367 683 438 688T511 694Q523 694 523 686Q523 679 450 384T375 83T374 68Q374 26 402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487H491Q506 153 506 145Q506 140 503 129Q490 79 473 48T445 8T417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157Q33 205 53 255T101 341Q148 398 195 420T280 442Q336 442 364 400Q369 394 369 396Q370 400 396 505T424 616Q424 629 417 632T378 637H357Q351 643 351 645T353 664Q358 683 366 683ZM352 326Q329 405 277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q233 26 290 98L298 109L352 326Z"></path></g><g data-mml-node="mi" transform="translate(553,363) scale(0.707)"><path data-c="1D451" d="M366 683Q367 683 438 688T511 694Q523 694 523 686Q523 679 450 384T375 83T374 68Q374 26 402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487H491Q506 153 506 145Q506 140 503 129Q490 79 473 48T445 8T417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157Q33 205 53 255T101 341Q148 398 195 420T280 442Q336 442 364 400Q369 394 369 396Q370 400 396 505T424 616Q424 629 417 632T378 637H357Q351 643 351 645T353 664Q358 683 366 683ZM352 326Q329 405 277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q233 26 290 98L298 109L352 326Z"></path></g></g></g></g></svg></mjx-container></span><br>\n' +
      '<code>&lt;/s&gt;</code></div>\n' +
      '<div>text2<br>\n' +
      '&lt;i&gt;<br>\n' +
      'some text<br>\n' +
      '<span class="math-inline ">\n' +
      '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.023ex;" xmlns="http://www.w3.org/2000/svg" width="3.373ex" height="1.954ex" role="img" focusable="false" viewBox="0 -853.7 1490.7 863.7"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="1D451" d="M366 683Q367 683 438 688T511 694Q523 694 523 686Q523 679 450 384T375 83T374 68Q374 26 402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487H491Q506 153 506 145Q506 140 503 129Q490 79 473 48T445 8T417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157Q33 205 53 255T101 341Q148 398 195 420T280 442Q336 442 364 400Q369 394 369 396Q370 400 396 505T424 616Q424 629 417 632T378 637H357Q351 643 351 645T353 664Q358 683 366 683ZM352 326Q329 405 277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q233 26 290 98L298 109L352 326Z"></path></g><g data-mml-node="msup" transform="translate(520,0)"><g data-mml-node="mi"><path data-c="1D451" d="M366 683Q367 683 438 688T511 694Q523 694 523 686Q523 679 450 384T375 83T374 68Q374 26 402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487H491Q506 153 506 145Q506 140 503 129Q490 79 473 48T445 8T417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157Q33 205 53 255T101 341Q148 398 195 420T280 442Q336 442 364 400Q369 394 369 396Q370 400 396 505T424 616Q424 629 417 632T378 637H357Q351 643 351 645T353 664Q358 683 366 683ZM352 326Q329 405 277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q233 26 290 98L298 109L352 326Z"></path></g><g data-mml-node="mi" transform="translate(553,363) scale(0.707)"><path data-c="1D451" d="M366 683Q367 683 438 688T511 694Q523 694 523 686Q523 679 450 384T375 83T374 68Q374 26 402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487H491Q506 153 506 145Q506 140 503 129Q490 79 473 48T445 8T417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157Q33 205 53 255T101 341Q148 398 195 420T280 442Q336 442 364 400Q369 394 369 396Q370 400 396 505T424 616Q424 629 417 632T378 637H357Q351 643 351 645T353 664Q358 683 366 683ZM352 326Q329 405 277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q233 26 290 98L298 109L352 326Z"></path></g></g></g></g></svg></mjx-container></span><br>\n' +
      '<code>&lt;/i&gt;</code></div>'
  },
  {
    mmd: '<script>タグ ..... 40\n' +
      'console.log. ..... 41\n' +
      '変数（var, variable） ..... 42\n' +
      '関数（function） ..... 43\n' +
      'JavaScriptを記述するときのルール ..... 44\n' +
      'JavaScriptの型 ..... 48\n' +
      '配列 (Array) ..... 51\n' +
      'オブジェクト (Object) ..... 52',
    html: '<div>&lt;script&gt;タグ … 40<br>\n' +
      'console.log. … 41<br>\n' +
      '変数（var, variable） … 42<br>\n' +
      '関数（function） … 43<br>\n' +
      'JavaScriptを記述するときのルール … 44<br>\n' +
      'JavaScriptの型 … 48<br>\n' +
      '配列 (Array) … 51<br>\n' +
      'オブジェクト (Object) … 52</div>',
    htmlDisableTagMatching: '',
    htmlTagsDisable: '<div>&lt;script&gt;タグ … 40<br>\n' +
      'console.log. … 41<br>\n' +
      '変数（var, variable） … 42<br>\n' +
      '関数（function） … 43<br>\n' +
      'JavaScriptを記述するときのルール … 44<br>\n' +
      'JavaScriptの型 … 48<br>\n' +
      '配列 (Array) … 51<br>\n' +
      'オブジェクト (Object) … 52</div>'
  },
  {
    mmd: '(1) Product Search ( $<\\mathrm{P}>$ ): This category encompasses queries where the customer is either specifically looking for a product, indicated by a direct question about a known item, or conducting a broader exploration without mentioning a particular product.\n' +
      '(2) Help ( $<\\mathrm{H}>)$ : Here, the customer seeks information regarding Amazon\'s policies, programs, or details about their orders.\n' +
      '(3) General Knowledge (<G>): Queries in this category involve requests for factual information or guidance on products, such as "How far away is the Moon from the Earth?" or "How to interpret COVID-19 test results?"\n' +
      '(4) Sensitive (<S>): This category is reserved for questions that are harmful, unethical, offensive, or of an adult nature.',
    html: '<div>(1) Product Search ( <span class="math-inline ">\n' +
      '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.09ex;" xmlns="http://www.w3.org/2000/svg" width="6.318ex" height="1.636ex" role="img" focusable="false" viewBox="0 -683 2792.6 723"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mo"><path data-c="3C" d="M694 -11T694 -19T688 -33T678 -40Q671 -40 524 29T234 166L90 235Q83 240 83 250Q83 261 91 266Q664 540 678 540Q681 540 687 534T694 519T687 505Q686 504 417 376L151 250L417 124Q686 -4 687 -5Q694 -11 694 -19Z"></path></g><g data-mml-node="TeXAtom" data-mjx-texclass="ORD" transform="translate(1055.8,0)"><g data-mml-node="mi"><path data-c="50" d="M130 622Q123 629 119 631T103 634T60 637H27V683H214Q237 683 276 683T331 684Q419 684 471 671T567 616Q624 563 624 489Q624 421 573 372T451 307Q429 302 328 301H234V181Q234 62 237 58Q245 47 304 46H337V0H326Q305 3 182 3Q47 3 38 0H27V46H60Q102 47 111 49T130 61V622ZM507 488Q507 514 506 528T500 564T483 597T450 620T397 635Q385 637 307 637H286Q237 637 234 628Q231 624 231 483V342H302H339Q390 342 423 349T481 382Q507 411 507 488Z"></path></g></g><g data-mml-node="mo" transform="translate(2014.6,0)"><path data-c="3E" d="M84 520Q84 528 88 533T96 539L99 540Q106 540 253 471T544 334L687 265Q694 260 694 250T687 235Q685 233 395 96L107 -40H101Q83 -38 83 -20Q83 -19 83 -17Q82 -10 98 -1Q117 9 248 71Q326 108 378 132L626 250L378 368Q90 504 86 509Q84 513 84 520Z"></path></g></g></g></svg></mjx-container></span> ): This category encompasses queries where the customer is either specifically looking for a product, indicated by a direct question about a known item, or conducting a broader exploration without mentioning a particular product.<br>\n' +
      '(2) Help ( <span class="math-inline ">\n' +
      '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.566ex;" xmlns="http://www.w3.org/2000/svg" width="7.354ex" height="2.262ex" role="img" focusable="false" viewBox="0 -750 3250.6 1000"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mo"><path data-c="3C" d="M694 -11T694 -19T688 -33T678 -40Q671 -40 524 29T234 166L90 235Q83 240 83 250Q83 261 91 266Q664 540 678 540Q681 540 687 534T694 519T687 505Q686 504 417 376L151 250L417 124Q686 -4 687 -5Q694 -11 694 -19Z"></path></g><g data-mml-node="TeXAtom" data-mjx-texclass="ORD" transform="translate(1055.8,0)"><g data-mml-node="mi"><path data-c="48" d="M128 622Q121 629 117 631T101 634T58 637H25V683H36Q57 680 180 680Q315 680 324 683H335V637H302Q262 636 251 634T233 622L232 500V378H517V622Q510 629 506 631T490 634T447 637H414V683H425Q446 680 569 680Q704 680 713 683H724V637H691Q651 636 640 634T622 622V61Q628 51 639 49T691 46H724V0H713Q692 3 569 3Q434 3 425 0H414V46H447Q489 47 498 49T517 61V332H232V197L233 61Q239 51 250 49T302 46H335V0H324Q303 3 180 3Q45 3 36 0H25V46H58Q100 47 109 49T128 61V622Z"></path></g></g><g data-mml-node="mo" transform="translate(2083.6,0)"><path data-c="3E" d="M84 520Q84 528 88 533T96 539L99 540Q106 540 253 471T544 334L687 265Q694 260 694 250T687 235Q685 233 395 96L107 -40H101Q83 -38 83 -20Q83 -19 83 -17Q82 -10 98 -1Q117 9 248 71Q326 108 378 132L626 250L378 368Q90 504 86 509Q84 513 84 520Z"></path></g><g data-mml-node="mo" transform="translate(2861.6,0)"><path data-c="29" d="M60 749L64 750Q69 750 74 750H86L114 726Q208 641 251 514T294 250Q294 182 284 119T261 12T224 -76T186 -143T145 -194T113 -227T90 -246Q87 -249 86 -250H74Q66 -250 63 -250T58 -247T55 -238Q56 -237 66 -225Q221 -64 221 250T66 725Q56 737 55 738Q55 746 60 749Z"></path></g></g></g></svg></mjx-container></span> : Here, the customer seeks information regarding Amazon’s policies, programs, or details about their orders.<br>\n' +
      '(3) General Knowledge (&lt;G&gt;): Queries in this category involve requests for factual information or guidance on products, such as “How far away is the Moon from the Earth?” or “How to interpret COVID-19 test results?”<br>\n' +
      '(4) Sensitive (&lt;S&gt;): This category is reserved for questions that are harmful, unethical, offensive, or of an adult nature.</div>',
    htmlDisableTagMatching: '<div>(1) Product Search ( <span class="math-inline ">\n' +
      '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.09ex;" xmlns="http://www.w3.org/2000/svg" width="6.318ex" height="1.636ex" role="img" focusable="false" viewBox="0 -683 2792.6 723"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mo"><path data-c="3C" d="M694 -11T694 -19T688 -33T678 -40Q671 -40 524 29T234 166L90 235Q83 240 83 250Q83 261 91 266Q664 540 678 540Q681 540 687 534T694 519T687 505Q686 504 417 376L151 250L417 124Q686 -4 687 -5Q694 -11 694 -19Z"></path></g><g data-mml-node="TeXAtom" data-mjx-texclass="ORD" transform="translate(1055.8,0)"><g data-mml-node="mi"><path data-c="50" d="M130 622Q123 629 119 631T103 634T60 637H27V683H214Q237 683 276 683T331 684Q419 684 471 671T567 616Q624 563 624 489Q624 421 573 372T451 307Q429 302 328 301H234V181Q234 62 237 58Q245 47 304 46H337V0H326Q305 3 182 3Q47 3 38 0H27V46H60Q102 47 111 49T130 61V622ZM507 488Q507 514 506 528T500 564T483 597T450 620T397 635Q385 637 307 637H286Q237 637 234 628Q231 624 231 483V342H302H339Q390 342 423 349T481 382Q507 411 507 488Z"></path></g></g><g data-mml-node="mo" transform="translate(2014.6,0)"><path data-c="3E" d="M84 520Q84 528 88 533T96 539L99 540Q106 540 253 471T544 334L687 265Q694 260 694 250T687 235Q685 233 395 96L107 -40H101Q83 -38 83 -20Q83 -19 83 -17Q82 -10 98 -1Q117 9 248 71Q326 108 378 132L626 250L378 368Q90 504 86 509Q84 513 84 520Z"></path></g></g></g></svg></mjx-container></span> ): This category encompasses queries where the customer is either specifically looking for a product, indicated by a direct question about a known item, or conducting a broader exploration without mentioning a particular product.<br>\n' +
      '(2) Help ( <span class="math-inline ">\n' +
      '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.566ex;" xmlns="http://www.w3.org/2000/svg" width="7.354ex" height="2.262ex" role="img" focusable="false" viewBox="0 -750 3250.6 1000"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mo"><path data-c="3C" d="M694 -11T694 -19T688 -33T678 -40Q671 -40 524 29T234 166L90 235Q83 240 83 250Q83 261 91 266Q664 540 678 540Q681 540 687 534T694 519T687 505Q686 504 417 376L151 250L417 124Q686 -4 687 -5Q694 -11 694 -19Z"></path></g><g data-mml-node="TeXAtom" data-mjx-texclass="ORD" transform="translate(1055.8,0)"><g data-mml-node="mi"><path data-c="48" d="M128 622Q121 629 117 631T101 634T58 637H25V683H36Q57 680 180 680Q315 680 324 683H335V637H302Q262 636 251 634T233 622L232 500V378H517V622Q510 629 506 631T490 634T447 637H414V683H425Q446 680 569 680Q704 680 713 683H724V637H691Q651 636 640 634T622 622V61Q628 51 639 49T691 46H724V0H713Q692 3 569 3Q434 3 425 0H414V46H447Q489 47 498 49T517 61V332H232V197L233 61Q239 51 250 49T302 46H335V0H324Q303 3 180 3Q45 3 36 0H25V46H58Q100 47 109 49T128 61V622Z"></path></g></g><g data-mml-node="mo" transform="translate(2083.6,0)"><path data-c="3E" d="M84 520Q84 528 88 533T96 539L99 540Q106 540 253 471T544 334L687 265Q694 260 694 250T687 235Q685 233 395 96L107 -40H101Q83 -38 83 -20Q83 -19 83 -17Q82 -10 98 -1Q117 9 248 71Q326 108 378 132L626 250L378 368Q90 504 86 509Q84 513 84 520Z"></path></g><g data-mml-node="mo" transform="translate(2861.6,0)"><path data-c="29" d="M60 749L64 750Q69 750 74 750H86L114 726Q208 641 251 514T294 250Q294 182 284 119T261 12T224 -76T186 -143T145 -194T113 -227T90 -246Q87 -249 86 -250H74Q66 -250 63 -250T58 -247T55 -238Q56 -237 66 -225Q221 -64 221 250T66 725Q56 737 55 738Q55 746 60 749Z"></path></g></g></g></svg></mjx-container></span> : Here, the customer seeks information regarding Amazon’s policies, programs, or details about their orders.<br>\n' +
      '(3) General Knowledge (<g>): Queries in this category involve requests for factual information or guidance on products, such as “How far away is the Moon from the Earth?” or “How to interpret COVID-19 test results?”<br>\n' +
      '(4) Sensitive (<s>): This category is reserved for questions that are harmful, unethical, offensive, or of an adult nature.</div>',
    htmlTagsDisable: '<div>(1) Product Search ( <span class="math-inline ">\n' +
      '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.09ex;" xmlns="http://www.w3.org/2000/svg" width="6.318ex" height="1.636ex" role="img" focusable="false" viewBox="0 -683 2792.6 723"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mo"><path data-c="3C" d="M694 -11T694 -19T688 -33T678 -40Q671 -40 524 29T234 166L90 235Q83 240 83 250Q83 261 91 266Q664 540 678 540Q681 540 687 534T694 519T687 505Q686 504 417 376L151 250L417 124Q686 -4 687 -5Q694 -11 694 -19Z"></path></g><g data-mml-node="TeXAtom" data-mjx-texclass="ORD" transform="translate(1055.8,0)"><g data-mml-node="mi"><path data-c="50" d="M130 622Q123 629 119 631T103 634T60 637H27V683H214Q237 683 276 683T331 684Q419 684 471 671T567 616Q624 563 624 489Q624 421 573 372T451 307Q429 302 328 301H234V181Q234 62 237 58Q245 47 304 46H337V0H326Q305 3 182 3Q47 3 38 0H27V46H60Q102 47 111 49T130 61V622ZM507 488Q507 514 506 528T500 564T483 597T450 620T397 635Q385 637 307 637H286Q237 637 234 628Q231 624 231 483V342H302H339Q390 342 423 349T481 382Q507 411 507 488Z"></path></g></g><g data-mml-node="mo" transform="translate(2014.6,0)"><path data-c="3E" d="M84 520Q84 528 88 533T96 539L99 540Q106 540 253 471T544 334L687 265Q694 260 694 250T687 235Q685 233 395 96L107 -40H101Q83 -38 83 -20Q83 -19 83 -17Q82 -10 98 -1Q117 9 248 71Q326 108 378 132L626 250L378 368Q90 504 86 509Q84 513 84 520Z"></path></g></g></g></svg></mjx-container></span> ): This category encompasses queries where the customer is either specifically looking for a product, indicated by a direct question about a known item, or conducting a broader exploration without mentioning a particular product.<br>\n' +
      '(2) Help ( <span class="math-inline ">\n' +
      '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.566ex;" xmlns="http://www.w3.org/2000/svg" width="7.354ex" height="2.262ex" role="img" focusable="false" viewBox="0 -750 3250.6 1000"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mo"><path data-c="3C" d="M694 -11T694 -19T688 -33T678 -40Q671 -40 524 29T234 166L90 235Q83 240 83 250Q83 261 91 266Q664 540 678 540Q681 540 687 534T694 519T687 505Q686 504 417 376L151 250L417 124Q686 -4 687 -5Q694 -11 694 -19Z"></path></g><g data-mml-node="TeXAtom" data-mjx-texclass="ORD" transform="translate(1055.8,0)"><g data-mml-node="mi"><path data-c="48" d="M128 622Q121 629 117 631T101 634T58 637H25V683H36Q57 680 180 680Q315 680 324 683H335V637H302Q262 636 251 634T233 622L232 500V378H517V622Q510 629 506 631T490 634T447 637H414V683H425Q446 680 569 680Q704 680 713 683H724V637H691Q651 636 640 634T622 622V61Q628 51 639 49T691 46H724V0H713Q692 3 569 3Q434 3 425 0H414V46H447Q489 47 498 49T517 61V332H232V197L233 61Q239 51 250 49T302 46H335V0H324Q303 3 180 3Q45 3 36 0H25V46H58Q100 47 109 49T128 61V622Z"></path></g></g><g data-mml-node="mo" transform="translate(2083.6,0)"><path data-c="3E" d="M84 520Q84 528 88 533T96 539L99 540Q106 540 253 471T544 334L687 265Q694 260 694 250T687 235Q685 233 395 96L107 -40H101Q83 -38 83 -20Q83 -19 83 -17Q82 -10 98 -1Q117 9 248 71Q326 108 378 132L626 250L378 368Q90 504 86 509Q84 513 84 520Z"></path></g><g data-mml-node="mo" transform="translate(2861.6,0)"><path data-c="29" d="M60 749L64 750Q69 750 74 750H86L114 726Q208 641 251 514T294 250Q294 182 284 119T261 12T224 -76T186 -143T145 -194T113 -227T90 -246Q87 -249 86 -250H74Q66 -250 63 -250T58 -247T55 -238Q56 -237 66 -225Q221 -64 221 250T66 725Q56 737 55 738Q55 746 60 749Z"></path></g></g></g></svg></mjx-container></span> : Here, the customer seeks information regarding Amazon’s policies, programs, or details about their orders.<br>\n' +
      '(3) General Knowledge (&lt;G&gt;): Queries in this category involve requests for factual information or guidance on products, such as “How far away is the Moon from the Earth?” or “How to interpret COVID-19 test results?”<br>\n' +
      '(4) Sensitive (&lt;S&gt;): This category is reserved for questions that are harmful, unethical, offensive, or of an adult nature.</div>'
  },
  {
    mmd: 'This is not mathml: <math>Y</math>\n' +
      '\n' +
      '\\section*{Section 1}',
    html: '<div>This is not mathml: Y</div>\n' +
      '<h2 type="section" data-unnumbered="true" class="section-title" id="section-1">\n' +
      'Section 1</h2>',
    htmlDisableTagMatching: '<div>This is not mathml: Y</div>\n' +
      '<h2 type="section" data-unnumbered="true" class="section-title" id="section-1">\n' +
      'Section 1</h2>',
    htmlTagsDisable: '<div>This is not mathml: &lt;math&gt;Y&lt;/math&gt;</div>\n' +
      '<h2 type="section" data-unnumbered="true" class="section-title" id="section-1">\n' +
      'Section 1</h2>'
  },
  {
    mmd: 'This is also not mathml:\n' +
      '<math>\n' +
      'Y\n' +
      '</math>\n' +
      '\n' +
      '\\section*{Section 2}',
    html: '<div>This is also not mathml:<br>\n' +
      '<br>\n' +
      'Y<br>\n' +
      '</div>\n' +
      '<h2 type="section" data-unnumbered="true" class="section-title" id="section-2">\n' +
      'Section 2</h2>',
    htmlDisableTagMatching: '<div>This is also not mathml:<br>\n' +
      '<br>\n' +
      'Y<br>\n' +
      '</div>\n' +
      '<h2 type="section" data-unnumbered="true" class="section-title" id="section-2">\n' +
      'Section 2</h2>',
    htmlTagsDisable: '<div>This is also not mathml:<br>\n' +
      '&lt;math&gt;<br>\n' +
      'Y<br>\n' +
      '&lt;/math&gt;</div>\n' +
      '<h2 type="section" data-unnumbered="true" class="section-title" id="section-2">\n' +
      'Section 2</h2>'
  },
  {
    mmd: 'This is inline mathml rule: <math><mi>Y</mi></math>\n' +
      '\n' +
      '\\section*{Section 3}',
    html: '<div>This is inline mathml rule: <span class="math-inline " data-overflow="visible">\n' +
      '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: 0;" xmlns="http://www.w3.org/2000/svg" width="1.726ex" height="1.545ex" role="img" focusable="false" viewBox="0 -683 763 683"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="1D44C" d="M66 637Q54 637 49 637T39 638T32 641T30 647T33 664T42 682Q44 683 56 683Q104 680 165 680Q288 680 306 683H316Q322 677 322 674T320 656Q316 643 310 637H298Q242 637 242 624Q242 619 292 477T343 333L346 336Q350 340 358 349T379 373T411 410T454 461Q546 568 561 587T577 618Q577 634 545 637Q528 637 528 647Q528 649 530 661Q533 676 535 679T549 683Q551 683 578 682T657 680Q684 680 713 681T746 682Q763 682 763 673Q763 669 760 657T755 643Q753 637 734 637Q662 632 617 587Q608 578 477 424L348 273L322 169Q295 62 295 57Q295 46 363 46Q379 46 384 45T390 35Q390 33 388 23Q384 6 382 4T366 1Q361 1 324 1T232 2Q170 2 138 2T102 1Q84 1 84 9Q84 14 87 24Q88 27 89 30T90 35T91 39T93 42T96 44T101 45T107 45T116 46T129 46Q168 47 180 50T198 63Q201 68 227 171L252 274L129 623Q128 624 127 625T125 627T122 629T118 631T113 633T105 634T96 635T83 636T66 637Z"></path></g></g></g></svg></mjx-container></span></div>\n' +
      '<h2 type="section" data-unnumbered="true" class="section-title" id="section-3">\n' +
      'Section 3</h2>',
    htmlDisableTagMatching: '<div>This is inline mathml rule: <span class="math-inline " data-overflow="visible">\n' +
      '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: 0;" xmlns="http://www.w3.org/2000/svg" width="1.726ex" height="1.545ex" role="img" focusable="false" viewBox="0 -683 763 683"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="1D44C" d="M66 637Q54 637 49 637T39 638T32 641T30 647T33 664T42 682Q44 683 56 683Q104 680 165 680Q288 680 306 683H316Q322 677 322 674T320 656Q316 643 310 637H298Q242 637 242 624Q242 619 292 477T343 333L346 336Q350 340 358 349T379 373T411 410T454 461Q546 568 561 587T577 618Q577 634 545 637Q528 637 528 647Q528 649 530 661Q533 676 535 679T549 683Q551 683 578 682T657 680Q684 680 713 681T746 682Q763 682 763 673Q763 669 760 657T755 643Q753 637 734 637Q662 632 617 587Q608 578 477 424L348 273L322 169Q295 62 295 57Q295 46 363 46Q379 46 384 45T390 35Q390 33 388 23Q384 6 382 4T366 1Q361 1 324 1T232 2Q170 2 138 2T102 1Q84 1 84 9Q84 14 87 24Q88 27 89 30T90 35T91 39T93 42T96 44T101 45T107 45T116 46T129 46Q168 47 180 50T198 63Q201 68 227 171L252 274L129 623Q128 624 127 625T125 627T122 629T118 631T113 633T105 634T96 635T83 636T66 637Z"></path></g></g></g></svg></mjx-container></span></div>\n' +
      '<h2 type="section" data-unnumbered="true" class="section-title" id="section-3">\n' +
      'Section 3</h2>',
    htmlTagsDisable: '<div>This is inline mathml rule: <span class="math-inline " data-overflow="visible">\n' +
      '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: 0;" xmlns="http://www.w3.org/2000/svg" width="1.726ex" height="1.545ex" role="img" focusable="false" viewBox="0 -683 763 683"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="1D44C" d="M66 637Q54 637 49 637T39 638T32 641T30 647T33 664T42 682Q44 683 56 683Q104 680 165 680Q288 680 306 683H316Q322 677 322 674T320 656Q316 643 310 637H298Q242 637 242 624Q242 619 292 477T343 333L346 336Q350 340 358 349T379 373T411 410T454 461Q546 568 561 587T577 618Q577 634 545 637Q528 637 528 647Q528 649 530 661Q533 676 535 679T549 683Q551 683 578 682T657 680Q684 680 713 681T746 682Q763 682 763 673Q763 669 760 657T755 643Q753 637 734 637Q662 632 617 587Q608 578 477 424L348 273L322 169Q295 62 295 57Q295 46 363 46Q379 46 384 45T390 35Q390 33 388 23Q384 6 382 4T366 1Q361 1 324 1T232 2Q170 2 138 2T102 1Q84 1 84 9Q84 14 87 24Q88 27 89 30T90 35T91 39T93 42T96 44T101 45T107 45T116 46T129 46Q168 47 180 50T198 63Q201 68 227 171L252 274L129 623Q128 624 127 625T125 627T122 629T118 631T113 633T105 634T96 635T83 636T66 637Z"></path></g></g></g></svg></mjx-container></span></div>\n' +
      '<h2 type="section" data-unnumbered="true" class="section-title" id="section-3">\n' +
      'Section 3</h2>'
  },
  {
    mmd: 'This is block mathml rule:\n' +
      '<math>\n' +
      '  <mi>Y</mi>\n' +
      '</math>\n' +
      '\n' +
      '\\section*{Section 4}',
    html: '<div>This is block mathml rule:</div>\n' +
      '<div><span class="math-inline " data-overflow="visible">\n' +
      '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: 0;" xmlns="http://www.w3.org/2000/svg" width="1.726ex" height="1.545ex" role="img" focusable="false" viewBox="0 -683 763 683"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="1D44C" d="M66 637Q54 637 49 637T39 638T32 641T30 647T33 664T42 682Q44 683 56 683Q104 680 165 680Q288 680 306 683H316Q322 677 322 674T320 656Q316 643 310 637H298Q242 637 242 624Q242 619 292 477T343 333L346 336Q350 340 358 349T379 373T411 410T454 461Q546 568 561 587T577 618Q577 634 545 637Q528 637 528 647Q528 649 530 661Q533 676 535 679T549 683Q551 683 578 682T657 680Q684 680 713 681T746 682Q763 682 763 673Q763 669 760 657T755 643Q753 637 734 637Q662 632 617 587Q608 578 477 424L348 273L322 169Q295 62 295 57Q295 46 363 46Q379 46 384 45T390 35Q390 33 388 23Q384 6 382 4T366 1Q361 1 324 1T232 2Q170 2 138 2T102 1Q84 1 84 9Q84 14 87 24Q88 27 89 30T90 35T91 39T93 42T96 44T101 45T107 45T116 46T129 46Q168 47 180 50T198 63Q201 68 227 171L252 274L129 623Q128 624 127 625T125 627T122 629T118 631T113 633T105 634T96 635T83 636T66 637Z"></path></g></g></g></svg></mjx-container></span></div>\n' +
      '<h2 type="section" data-unnumbered="true" class="section-title" id="section-4">\n' +
      'Section 4</h2>',
    htmlDisableTagMatching: '<div>This is block mathml rule:</div>\n' +
      '<div><span class="math-inline " data-overflow="visible">\n' +
      '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: 0;" xmlns="http://www.w3.org/2000/svg" width="1.726ex" height="1.545ex" role="img" focusable="false" viewBox="0 -683 763 683"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="1D44C" d="M66 637Q54 637 49 637T39 638T32 641T30 647T33 664T42 682Q44 683 56 683Q104 680 165 680Q288 680 306 683H316Q322 677 322 674T320 656Q316 643 310 637H298Q242 637 242 624Q242 619 292 477T343 333L346 336Q350 340 358 349T379 373T411 410T454 461Q546 568 561 587T577 618Q577 634 545 637Q528 637 528 647Q528 649 530 661Q533 676 535 679T549 683Q551 683 578 682T657 680Q684 680 713 681T746 682Q763 682 763 673Q763 669 760 657T755 643Q753 637 734 637Q662 632 617 587Q608 578 477 424L348 273L322 169Q295 62 295 57Q295 46 363 46Q379 46 384 45T390 35Q390 33 388 23Q384 6 382 4T366 1Q361 1 324 1T232 2Q170 2 138 2T102 1Q84 1 84 9Q84 14 87 24Q88 27 89 30T90 35T91 39T93 42T96 44T101 45T107 45T116 46T129 46Q168 47 180 50T198 63Q201 68 227 171L252 274L129 623Q128 624 127 625T125 627T122 629T118 631T113 633T105 634T96 635T83 636T66 637Z"></path></g></g></g></svg></mjx-container></span></div>\n' +
      '<h2 type="section" data-unnumbered="true" class="section-title" id="section-4">\n' +
      'Section 4</h2>',
    htmlTagsDisable: '<div>This is block mathml rule:</div>\n' +
      '<div><span class="math-inline " data-overflow="visible">\n' +
      '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: 0;" xmlns="http://www.w3.org/2000/svg" width="1.726ex" height="1.545ex" role="img" focusable="false" viewBox="0 -683 763 683"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="1D44C" d="M66 637Q54 637 49 637T39 638T32 641T30 647T33 664T42 682Q44 683 56 683Q104 680 165 680Q288 680 306 683H316Q322 677 322 674T320 656Q316 643 310 637H298Q242 637 242 624Q242 619 292 477T343 333L346 336Q350 340 358 349T379 373T411 410T454 461Q546 568 561 587T577 618Q577 634 545 637Q528 637 528 647Q528 649 530 661Q533 676 535 679T549 683Q551 683 578 682T657 680Q684 680 713 681T746 682Q763 682 763 673Q763 669 760 657T755 643Q753 637 734 637Q662 632 617 587Q608 578 477 424L348 273L322 169Q295 62 295 57Q295 46 363 46Q379 46 384 45T390 35Q390 33 388 23Q384 6 382 4T366 1Q361 1 324 1T232 2Q170 2 138 2T102 1Q84 1 84 9Q84 14 87 24Q88 27 89 30T90 35T91 39T93 42T96 44T101 45T107 45T116 46T129 46Q168 47 180 50T198 63Q201 68 227 171L252 274L129 623Q128 624 127 625T125 627T122 629T118 631T113 633T105 634T96 635T83 636T66 637Z"></path></g></g></g></svg></mjx-container></span></div>\n' +
      '<h2 type="section" data-unnumbered="true" class="section-title" id="section-4">\n' +
      'Section 4</h2>'
  },
  {
    mmd: '(19) Agenția de Stat pentru Proprietatea Intelectuală\n' +
      '(11) 1667 (13) <math>Y</math>\n' +
      '(51) Int.Cl: G01N 33/50 (2006.01)\n' +
      '\n' +
      'G01N 33/74 (2006.01)\n' +
      'C07K 14/575 (2006.01)\n' +
      '\n' +
      '\\section*{(12) BREVET DE INVENȚIE DE SCURTĂ DURATĂ}',
    html: '<div>(19) Agenția de Stat pentru Proprietatea Intelectuală<br>\n' +
      '(11) 1667 (13) Y<br>\n' +
      '(51) <a href="http://Int.Cl" target="_blank" rel="noopener" style="display: inline-block">Int.Cl</a>: G01N 33/50 (2006.01)</div>\n' +
      '<div>G01N 33/74 (2006.01)<br>\n' +
      'C07K 14/575 (2006.01)</div>\n' +
      '<h2 type="section" data-unnumbered="true" class="section-title" id="(12)-brevet-de-inven%C8%9Bie-de-scurt%C4%83-durat%C4%83">\n' +
      '(12) BREVET DE INVENȚIE DE SCURTĂ DURATĂ</h2>',
    htmlDisableTagMatching: '<div>(19) Agenția de Stat pentru Proprietatea Intelectuală<br>\n' +
      '(11) 1667 (13) Y<br>\n' +
      '(51) <a href="http://Int.Cl" target="_blank" rel="noopener" style="display: inline-block">Int.Cl</a>: G01N 33/50 (2006.01)</div>\n' +
      '<div>G01N 33/74 (2006.01)<br>\n' +
      'C07K 14/575 (2006.01)</div>\n' +
      '<h2 type="section" data-unnumbered="true" class="section-title" id="(12)-brevet-de-inven%C8%9Bie-de-scurt%C4%83-durat%C4%83">\n' +
      '(12) BREVET DE INVENȚIE DE SCURTĂ DURATĂ</h2>',
    htmlTagsDisable: '<div>(19) Agenția de Stat pentru Proprietatea Intelectuală<br>\n' +
      '(11) 1667 (13) &lt;math&gt;Y&lt;/math&gt;<br>\n' +
      '(51) <a href="http://Int.Cl" target="_blank" rel="noopener" style="display: inline-block">Int.Cl</a>: G01N 33/50 (2006.01)</div>\n' +
      '<div>G01N 33/74 (2006.01)<br>\n' +
      'C07K 14/575 (2006.01)</div>\n' +
      '<h2 type="section" data-unnumbered="true" class="section-title" id="(12)-brevet-de-inven%C8%9Bie-de-scurt%C4%83-durat%C4%83">\n' +
      '(12) BREVET DE INVENȚIE DE SCURTĂ DURATĂ</h2>'
  },
]
