module.exports = [
  {
    latex: '\\begin{tabular}{ l c r }\n' +
      '  1 & 2 & 3 \\\\\n' +
      '  4 & 5 & 6 \\\\\n' +
      '  7 & 8 & 9 \\\\\n' +
      '\\end{tabular}',
    tsv: '1\t2\t3\n4\t5\t6\n7\t8\t9',
    html: '<table id="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">2</td>\n' +
      '<td style="text-align: right; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">3</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">4</td>\n' +
      '<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">5</td>\n' +
      '<td style="text-align: right; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">6</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">7</td>\n' +
      '<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">8</td>\n' +
      '<td style="text-align: right; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">9</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>'
  },
  {
    latex: '\\begin{tabular}{ | l | c | r | }\n' +
      '  1 & 2 & 3 \\\\\n' +
      '  4 & 5 & 6 \\\\\n' +
      '  7 & 8 & 9 \\\\\n' +
      '\\end{tabular}',
    tsv: '1\t2\t3\n4\t5\t6\n7\t8\t9',
    html: '<table id="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">2</td>\n' +
      '<td style="text-align: right; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">3</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">4</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">5</td>\n' +
      '<td style="text-align: right; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">6</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">7</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">8</td>\n' +
      '<td style="text-align: right; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">9</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>'
  },
  {
    latex: '\\begin{tabular}{ | l | c | r | }\n' +
      '  \\hline\t\t\t\n' +
      '  1 & 2 & 3 \\\\\n' +
      '  4 & 5 & 6 \\\\\n' +
      '  7 & 8 & 9 \\\\\n' +
      '  \\hline  \n' +
      '\\end{tabular}',
    tsv: '1\t2\t3\n4\t5\t6\n7\t8\t9',
    html: '<table id="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">2</td>\n' +
      '<td style="text-align: right; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">3</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">4</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">5</td>\n' +
      '<td style="text-align: right; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">6</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">7</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">8</td>\n' +
      '<td style="text-align: right; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">9</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>'
  },
  {
    latex: '\\begin{center}\n' +
      '  \\begin{tabular}{ | l | c | r | }\n' +
      '    \\hline\n' +
      '    1 & 2 & 3 \\\\ \\hline\n' +
      '    4 & 5 & 6 \\\\ \\hline\n' +
      '    7 & 8 & 9 \\\\\n' +
      '    \\hline\n' +
      '  \\end{tabular}\n' +
      '\\end{center}',
    tsv: '1\t2\t3\n4\t5\t6\n7\t8\t9',
    html: '<table id="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">2</td>\n' +
      '<td style="text-align: right; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">3</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">4</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">5</td>\n' +
      '<td style="text-align: right; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">6</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">7</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">8</td>\n' +
      '<td style="text-align: right; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">9</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>'
  },
  {
    latex: '\\begin{left}\n' +
      '  \\begin{tabular}{ | l | c | r | }\n' +
      '    \\hline\n' +
      '    1 & 2 & 3 \\\\ \\hline\n' +
      '    4 & 5 & 6 \\\\ \\hline\n' +
      '    7 & 8 & 9 \\\\\n' +
      '    \\hline\n' +
      '  \\end{tabular}\n' +
      '\\end{left}',
    tsv: '1\t2\t3\n4\t5\t6\n7\t8\t9',
    html: '<table id="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">2</td>\n' +
      '<td style="text-align: right; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">3</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">4</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">5</td>\n' +
      '<td style="text-align: right; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">6</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">7</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">8</td>\n' +
      '<td style="text-align: right; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">9</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>'
  },  {
    latex: '\\begin{tabular}{l|S|r|l}\n' +
      '      \\textbf{Value 1} & \\textbf{Value 2} & \\textbf{Value 3} & \\textbf{Value 4}\\\\\n' +
      '      $\\alpha$ & $\\beta$ & $\\gamma$ & $\\delta$ \\\\\n' +
      '      \\hline\n' +
      '      1 & 1110.1 & a & e\\\\\n' +
      '      2 & 10.1 & b & f\\\\\n' +
      '      3 & 23.113231 & c & g\\\\\n' +
      '    \\end{tabular}',
    tsv: 'Value 1\tValue 2\tValue 3\tValue 4\n' +
      'alpha\tbeta\tgamma\tdelta\n' +
      '1\t1110.1\ta\te\n' +
      '2\t10.1\tb\tf\n' +
      '3\t23.113231\tc\tg',
    html: '<table id="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; "><strong>Value 1</strong></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; "><strong>Value 2</strong></td>\n' +
      '<td style="text-align: right; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; "><strong>Value 3</strong></td>\n' +
      '<td style="text-align: left; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; "><strong>Value 4</strong></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><span class="math-inline ">\n' +
      '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.025ex" xmlns="http://www.w3.org/2000/svg" width="1.448ex" height="1.025ex" role="img" focusable="false" viewBox="0 -442 640 453"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="3B1" d="M34 156Q34 270 120 356T309 442Q379 442 421 402T478 304Q484 275 485 237V208Q534 282 560 374Q564 388 566 390T582 393Q603 393 603 385Q603 376 594 346T558 261T497 161L486 147L487 123Q489 67 495 47T514 26Q528 28 540 37T557 60Q559 67 562 68T577 70Q597 70 597 62Q597 56 591 43Q579 19 556 5T512 -10H505Q438 -10 414 62L411 69L400 61Q390 53 370 41T325 18T267 -2T203 -11Q124 -11 79 39T34 156ZM208 26Q257 26 306 47T379 90L403 112Q401 255 396 290Q382 405 304 405Q235 405 183 332Q156 292 139 224T121 120Q121 71 146 49T208 26Z"></path></g></g></g></svg></mjx-container></span></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><span class="math-inline ">\n' +
      '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.439ex" xmlns="http://www.w3.org/2000/svg" width="1.281ex" height="2.034ex" role="img" focusable="false" viewBox="0 -705 566 899"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="3B2" d="M29 -194Q23 -188 23 -186Q23 -183 102 134T186 465Q208 533 243 584T309 658Q365 705 429 705H431Q493 705 533 667T573 570Q573 465 469 396L482 383Q533 332 533 252Q533 139 448 65T257 -10Q227 -10 203 -2T165 17T143 40T131 59T126 65L62 -188Q60 -194 42 -194H29ZM353 431Q392 431 427 419L432 422Q436 426 439 429T449 439T461 453T472 471T484 495T493 524T501 560Q503 569 503 593Q503 611 502 616Q487 667 426 667Q384 667 347 643T286 582T247 514T224 455Q219 439 186 308T152 168Q151 163 151 147Q151 99 173 68Q204 26 260 26Q302 26 349 51T425 137Q441 171 449 214T457 279Q457 337 422 372Q380 358 347 358H337Q258 358 258 389Q258 396 261 403Q275 431 353 431Z"></path></g></g></g></svg></mjx-container></span></td>\n' +
      '<td style="text-align: right; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><span class="math-inline ">\n' +
      '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.489ex" xmlns="http://www.w3.org/2000/svg" width="1.229ex" height="1.486ex" role="img" focusable="false" viewBox="0 -441 543 657"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="3B3" d="M31 249Q11 249 11 258Q11 275 26 304T66 365T129 418T206 441Q233 441 239 440Q287 429 318 386T371 255Q385 195 385 170Q385 166 386 166L398 193Q418 244 443 300T486 391T508 430Q510 431 524 431H537Q543 425 543 422Q543 418 522 378T463 251T391 71Q385 55 378 6T357 -100Q341 -165 330 -190T303 -216Q286 -216 286 -188Q286 -138 340 32L346 51L347 69Q348 79 348 100Q348 257 291 317Q251 355 196 355Q148 355 108 329T51 260Q49 251 47 251Q45 249 31 249Z"></path></g></g></g></svg></mjx-container></span></td>\n' +
      '<td style="text-align: left; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><span class="math-inline ">\n' +
      '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.023ex" xmlns="http://www.w3.org/2000/svg" width="1.005ex" height="1.645ex" role="img" focusable="false" viewBox="0 -717 444 727"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="3B4" d="M195 609Q195 656 227 686T302 717Q319 716 351 709T407 697T433 690Q451 682 451 662Q451 644 438 628T403 612Q382 612 348 641T288 671T249 657T235 628Q235 584 334 463Q401 379 401 292Q401 169 340 80T205 -10H198Q127 -10 83 36T36 153Q36 286 151 382Q191 413 252 434Q252 435 245 449T230 481T214 521T201 566T195 609ZM112 130Q112 83 136 55T204 27Q233 27 256 51T291 111T309 178T316 232Q316 267 309 298T295 344T269 400L259 396Q215 381 183 342T137 256T118 179T112 130Z"></path></g></g></g></svg></mjx-container></span></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; "><span class="f"></span><span class="decimal_left">1110.1</span><span class="f">.00000</span></td>\n' +
      '<td style="text-align: right; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">a</td>\n' +
      '<td style="text-align: left; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">e</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">2</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; "><span class="f">00</span><span class="decimal_left">10.1</span><span class="f">.00000</span></td>\n' +
      '<td style="text-align: right; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">b</td>\n' +
      '<td style="text-align: left; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">f</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">3</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; "><span class="f">00</span><span class="decimal_left">23.113231</span><span class="f">.</span></td>\n' +
      '<td style="text-align: right; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">c</td>\n' +
      '<td style="text-align: left; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">g</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>'
  },
  {
    latex: '\\begin{center}\n' +
      '    \\begin{tabular}{| l | l | l | l |}\n' +
      '    \\hline\n' +
      '    Day & Min Temp & Max Temp & Summary \\\\ \\hline\n' +
      '    Monday & 11C & 22C & A clear day with lots of sunshine.\n' +
      '    However, the strong breeze will bring down the temperatures. \\\\ \\hline\n' +
      '    Tuesday & 9C & 19C & Cloudy with rain, across many northern regions. Clear spells\n' +
      '    across most of Scotland and Northern Ireland,\n' +
      '    but rain reaching the far northwest. \\\\ \\hline\n' +
      '    Wednesday & 10C & 21C & Rain will still linger for the morning.\n' +
      '    Conditions will improve by early afternoon and continue\n' +
      '    throughout the evening. \\\\\n' +
      '    \\hline\n' +
      '    \\end{tabular}\n' +
      '\\end{center}',
    tsv: 'Day\tMin Temp\tMax Temp\tSummary\n' +
      'Monday\t11C\t22C\tA clear day with lots of sunshine. However, the strong breeze will bring down the temperatures.\n' +
      'Tuesday\t9C\t19C\tCloudy with rain, across many northern regions. Clear spells across most of Scotland and Northern Ireland, but rain reaching the far northwest.\n' +
      'Wednesday\t10C\t21C\tRain will still linger for the morning. Conditions will improve by early afternoon and continue throughout the evening.',
    html: '<table id="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">Day</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">Min Temp</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">Max Temp</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">Summary</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Monday</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">11C</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">22C</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">A clear day with lots of sunshine. However, the strong breeze will bring down the temperatures.</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Tuesday</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">9C</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">19C</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Cloudy with rain, across many northern regions. Clear spells across most of Scotland and Northern Ireland, but rain reaching the far northwest.</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Wednesday</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">10C</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">21C</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Rain will still linger for the morning. Conditions will improve by early afternoon and continue throughout the evening.</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>'
  },
  {
    latex: '\\begin{center}\n' +
      '    \\begin{tabular}{ | l | l | l | p{5cm} |}\n' +
      '    \\hline\n' +
      '    Day & Min Temp & Max Temp & Summary \\\\ \\hline\n' +
      '    Monday & 11C & 22C & A clear day with lots of sunshine.  \n' +
      '    However, the strong breeze will bring down the temperatures. \\\\ \\hline\n' +
      '    Tuesday & 9C & 19C & Cloudy with rain, across many northern regions. Clear spells\n' +
      '    across most of Scotland and Northern Ireland,\n' +
      '    but rain reaching the far northwest. \\\\ \\hline\n' +
      '    Wednesday & 10C & 21C & Rain will still linger for the morning.\n' +
      '    Conditions will improve by early afternoon and continue\n' +
      '    throughout the evening. \\\\\n' +
      '    \\hline\n' +
      '    \\end{tabular}\n' +
      '\\end{center}',
    tsv: 'Day\tMin Temp\tMax Temp\tSummary\n' +
      'Monday\t11C\t22C\tA clear day with lots of sunshine.   However, the strong breeze will bring down the temperatures.\n' +
      'Tuesday\t9C\t19C\tCloudy with rain, across many northern regions. Clear spells across most of Scotland and Northern Ireland, but rain reaching the far northwest.\n' +
      'Wednesday\t10C\t21C\tRain will still linger for the morning. Conditions will improve by early afternoon and continue throughout the evening.',
    html: '<table id="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">Day</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">Min Temp</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">Max Temp</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: 5cm; vertical-align: top; ">Summary</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Monday</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">11C</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">22C</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: 5cm; vertical-align: top; ">A clear day with lots of sunshine.   However, the strong breeze will bring down the temperatures.</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Tuesday</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">9C</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">19C</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: 5cm; vertical-align: top; ">Cloudy with rain, across many northern regions. Clear spells across most of Scotland and Northern Ireland, but rain reaching the far northwest.</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Wednesday</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">10C</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">21C</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: 5cm; vertical-align: top; ">Rain will still linger for the morning. Conditions will improve by early afternoon and continue throughout the evening.</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>'
  },
  {
    latex: '\\begin{tabular}{ |l|l| }\n' +
      '  \\hline\n' +
      '  \\multicolumn{2}{|c|}{Team sheet} \\\\\n' +
      '  \\hline\n' +
      '  GK & Paul Robinson \\\\\n' +
      '  LB & Lucas Radebe \\\\\n' +
      '  DC & Michael Duberry \\\\\n' +
      '  DC & Dominic Matteo \\\\\n' +
      '  RB & Dider Domi \\\\\n' +
      '  MC & David Batty \\\\\n' +
      '  MC & Eirik Bakke \\\\\n' +
      '  MC & Jody Morris \\\\\n' +
      '  FW & Jamie McMaster \\\\\n' +
      '  ST & Alan Smith \\\\\n' +
      '  ST & Mark Viduka \\\\\n' +
      '  \\hline\n' +
      '\\end{tabular}',
    tsv:   'Team sheet\t\n' +
      'GK\tPaul Robinson\n' +
      'LB\tLucas Radebe\n' +
      'DC\tMichael Duberry\n' +
      'DC\tDominic Matteo\n' +
      'RB\tDider Domi\n' +
      'MC\tDavid Batty\n' +
      'MC\tEirik Bakke\n' +
      'MC\tJody Morris\n' +
      'FW\tJamie McMaster\n' +
      'ST\tAlan Smith\n' +
      'ST\tMark Viduka',
    html: '<table id="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; border-top-style: solid !important; border-top-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; " colspan="2">Team sheet</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">GK</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Paul Robinson</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">LB</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Lucas Radebe</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">DC</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Michael Duberry</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">DC</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Dominic Matteo</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">RB</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Dider Domi</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">MC</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">David Batty</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">MC</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Eirik Bakke</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">MC</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Jody Morris</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">FW</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Jamie McMaster</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">ST</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Alan Smith</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">ST</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Mark Viduka</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>'
  },  {
    latex: '\\begin{tabular}{ |l|l|l| }\n' +
      '\\hline\n' +
      '\\multicolumn{3}{ |c| }{Team sheet} \\\\\n' +
      '\\hline\n' +
      'Goalkeeper & GK & Paul Robinson \\\\ \\hline\n' +
      '\\multirow{4}{*}{Defenders} & LB & Lucas Radebe \\\\\n' +
      ' & DC & Michael Duburry \\\\\n' +
      ' & DC & Dominic Matteo \\\\\n' +
      ' & RB & Didier Domi \\\\ \\hline\n' +
      '\\multirow{3}{*}{Midfielders} & MC & David Batty \\\\\n' +
      ' & MC & Eirik Bakke \\\\\n' +
      ' & MC & Jody Morris \\\\ \\hline\n' +
      'Forward & FW & Jamie McMaster \\\\ \\hline\n' +
      '\\multirow{2}{*}{Strikers} & ST & Alan Smith \\\\\n' +
      ' & ST & Mark Viduka \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv:  'Team sheet\t\t\n' +
      'Goalkeeper\tGK\tPaul Robinson\n' +
      'Defenders\tLB\tLucas Radebe\n' +
      '\tDC\tMichael Duburry\n' +
      '\tDC\tDominic Matteo\n' +
      '\tRB\tDidier Domi\n' +
      'Midfielders\tMC\tDavid Batty\n' +
      '\tMC\tEirik Bakke\n' +
      '\tMC\tJody Morris\n' +
      'Forward\tFW\tJamie McMaster\n' +
      'Strikers\tST\tAlan Smith\n' +
      '\tST\tMark Viduka',
    html: ''
  },
  {
    latex: '\\begin{tabular}{cc|c|c|c|c|l}\n' +
      '\\cline{3-6}\n' +
      '& & \\multicolumn{4}{ c| }{Primes} \\\\ \\cline{3-6}\n' +
      '& & 2 & 3 & 5 & 7 \\\\ \\cline{1-6}\n' +
      '\\multicolumn{1}{ |c  }{\\multirow{2}{*}{Powers} } &\n' +
      '\\multicolumn{1}{ |c| }{504} & 3 & 2 & 0 & 1 &     \\\\ \\cline{2-6}\n' +
      '\\multicolumn{1}{ |c  }{}                        &\n' +
      '\\multicolumn{1}{ |c| }{540} & 2 & 3 & 1 & 0 &     \\\\ \\cline{1-6}\n' +
      '\\multicolumn{1}{ |c  }{\\multirow{2}{*}{Powers} } &\n' +
      '\\multicolumn{1}{ |c| }{gcd} & 2 & 2 & 0 & 0 & min \\\\ \\cline{2-6}\n' +
      '\\multicolumn{1}{ |c  }{}                        &\n' +
      '\\multicolumn{1}{ |c| }{lcm} & 3 & 3 & 1 & 1 & max \\\\ \\cline{1-6}\n' +
      '\\end{tabular}',
    tsv: '\t\tPrimes\t\t\t\t\n' +
      '\t\t2\t3\t5\t7\t\n' +
      'Powers\t504\t3\t2\t0\t1\t\n' +
      '\t540\t2\t3\t1\t0\t\n' +
      'Powers\tgcd\t2\t2\t0\t0\tmin\n' +
      '\tlcm\t3\t3\t1\t1\tmax',
    html: '<table id="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left: none !important; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; " class="_empty"></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; " class="_empty"></td>\n' +
      '<td style="text-align: center; border-left: none !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; border-top-style: solid !important; border-top-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; " colspan="4">Primes</td>\n' +
      '<td style="text-align: left; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; " class="_empty"></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left: none !important; border-right: none !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; " class="_empty"></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; " class="_empty"></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">2</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">3</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">5</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">7</td>\n' +
      '<td style="text-align: left; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; " class="_empty"></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; border-bottom-style: solid !important; border-bottom-width: 1px !important; " colspan="1" rowspan="2">Powers</td>\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; " colspan="1">504</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">3</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">2</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '<td style="text-align: left; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; " class="_empty"></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; " colspan="1">540</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">2</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">3</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: left; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; " class="_empty"></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; " colspan="1" rowspan="2">Powers</td>\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; " colspan="1">gcd</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">2</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">2</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: left; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">min</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; " colspan="1">lcm</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">3</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">3</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '<td style="text-align: left; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">max</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>'
  },
  {
    latex: '\\begin{tabular}{ r|c|c| }\n' +
      '\\multicolumn{1}{r}{}\n' +
      ' &  \\multicolumn{1}{c}{noninteractive}\n' +
      ' & \\multicolumn{1}{c}{interactive} \\\\\n' +
      '\\cline{2-3}\n' +
      'massively multiple & Library & University \\\\\n' +
      '\\cline{2-3}\n' +
      'one-to-one & Book & Tutor \\\\\n' +
      '\\cline{2-3}\n' +
      '\\end{tabular}\n',
    tsv: '\tnoninteractive\tinteractive\n' +
      'massively multiple\tLibrary\tUniversity\n' +
      'one-to-one\tBook\tTutor',
    html: '<table id="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: right; border-left: none !important; border-bottom: none !important; border-top: none !important; border-top: none !important; border-bottom: none !important; " colspan="1"></td>\n' +
      '<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; border-top: none !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; " colspan="1">noninteractive</td>\n' +
      '<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; border-top: none !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; " colspan="1">interactive</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: right; border-left: none !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">massively multiple</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Library</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">University</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: right; border-left: none !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">one-to-one</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Book</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Tutor</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>'
  },
  {
    latex: '\\begin{table}[h!]\n' +
      '\\centering\n' +
      '\\begin{tabular}{||c c c c||}\n' +
      '\\hline\n' +
      'Col1 & Col2 & Col2 & Col3 \\\\ [0.5ex]\n' +
      '\\hline\\hline\n' +
      '1 & 6 & 87837 & 787 \\\\\n' +
      '2 & 7 & 78 & 5415 \\\\\n' +
      '3 & 545 & 778 & 7507 \\\\\n' +
      '4 & 545 & 18744 & 7560 \\\\\n' +
      '5 & 88 & 788 & 6344 \\\\ [1ex]\n' +
      '\\hline\n' +
      '\\end{tabular}\n' +
      '\\end{table}',
    tsv: 'Col1\tCol2\tCol2\tCol3\n' +
      '1\t6\t87837\t787\n' +
      '2\t7\t78\t5415\n' +
      '3\t545\t778\t7507\n' +
      '4\t545\t18744\t7560\n' +
      '5\t88\t788\t6344',
    html: '<table id="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: double !important; border-left-width: 3px !important; border-right: none !important; border-bottom-style: double !important; border-bottom-width: 3px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; padding-bottom: 0.5ex !important;">Col1</td>\n' +
      '<td style="text-align: center; border-right: none !important; border-bottom-style: double !important; border-bottom-width: 3px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; padding-bottom: 0.5ex !important;">Col2</td>\n' +
      '<td style="text-align: center; border-right: none !important; border-bottom-style: double !important; border-bottom-width: 3px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; padding-bottom: 0.5ex !important;">Col2</td>\n' +
      '<td style="text-align: center; border-right-style: double !important; border-right-width: 3px !important; border-bottom-style: double !important; border-bottom-width: 3px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; padding-bottom: 0.5ex !important;">Col3</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: double !important; border-left-width: 3px !important; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">6</td>\n' +
      '<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">87837</td>\n' +
      '<td style="text-align: center; border-right-style: double !important; border-right-width: 3px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">787</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: double !important; border-left-width: 3px !important; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">2</td>\n' +
      '<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">7</td>\n' +
      '<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">78</td>\n' +
      '<td style="text-align: center; border-right-style: double !important; border-right-width: 3px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">5415</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: double !important; border-left-width: 3px !important; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">3</td>\n' +
      '<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">545</td>\n' +
      '<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">778</td>\n' +
      '<td style="text-align: center; border-right-style: double !important; border-right-width: 3px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">7507</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: double !important; border-left-width: 3px !important; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">4</td>\n' +
      '<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">545</td>\n' +
      '<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">18744</td>\n' +
      '<td style="text-align: center; border-right-style: double !important; border-right-width: 3px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">7560</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: double !important; border-left-width: 3px !important; border-right: none !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; padding-bottom: 1ex !important;">5</td>\n' +
      '<td style="text-align: center; border-right: none !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; padding-bottom: 1ex !important;">88</td>\n' +
      '<td style="text-align: center; border-right: none !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; padding-bottom: 1ex !important;">788</td>\n' +
      '<td style="text-align: center; border-right-style: double !important; border-right-width: 3px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; padding-bottom: 1ex !important;">6344</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>'
  },
  {
    latex: '\\begin{table}[h!]\n' +
      '\\begin{left}\n' +
      '\\begin{tabular}{||c c c c||}\n' +
      '\\hline\n' +
      'Col1 & Col2 & Col2 & Col3 \\\\ [0.5ex]\n' +
      '\\hline\\hline\n' +
      '1 & 6 & 87837 & 787 \\\\\n' +
      '2 & 7 & 78 & 5415 \\\\\n' +
      '3 & 545 & 778 & 7507 \\\\\n' +
      '4 & 545 & 18744 & 7560 \\\\\n' +
      '5 & 88 & 788 & 6344 \\\\ [1ex]\n' +
      '\\hline\n' +
      '\\end{tabular}\n' +
      '\\end{left}\n' +
      '\\end{table}',
    tsv:  'Col1\tCol2\tCol2\tCol3\n' +
      '1\t6\t87837\t787\n' +
      '2\t7\t78\t5415\n' +
      '3\t545\t778\t7507\n' +
      '4\t545\t18744\t7560\n' +
      '5\t88\t788\t6344',
    html: '<table id="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: double !important; border-left-width: 3px !important; border-right: none !important; border-bottom-style: double !important; border-bottom-width: 3px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; padding-bottom: 0.5ex !important;">Col1</td>\n' +
      '<td style="text-align: center; border-right: none !important; border-bottom-style: double !important; border-bottom-width: 3px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; padding-bottom: 0.5ex !important;">Col2</td>\n' +
      '<td style="text-align: center; border-right: none !important; border-bottom-style: double !important; border-bottom-width: 3px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; padding-bottom: 0.5ex !important;">Col2</td>\n' +
      '<td style="text-align: center; border-right-style: double !important; border-right-width: 3px !important; border-bottom-style: double !important; border-bottom-width: 3px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; padding-bottom: 0.5ex !important;">Col3</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: double !important; border-left-width: 3px !important; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">6</td>\n' +
      '<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">87837</td>\n' +
      '<td style="text-align: center; border-right-style: double !important; border-right-width: 3px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">787</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: double !important; border-left-width: 3px !important; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">2</td>\n' +
      '<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">7</td>\n' +
      '<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">78</td>\n' +
      '<td style="text-align: center; border-right-style: double !important; border-right-width: 3px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">5415</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: double !important; border-left-width: 3px !important; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">3</td>\n' +
      '<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">545</td>\n' +
      '<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">778</td>\n' +
      '<td style="text-align: center; border-right-style: double !important; border-right-width: 3px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">7507</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: double !important; border-left-width: 3px !important; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">4</td>\n' +
      '<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">545</td>\n' +
      '<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">18744</td>\n' +
      '<td style="text-align: center; border-right-style: double !important; border-right-width: 3px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">7560</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: double !important; border-left-width: 3px !important; border-right: none !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; padding-bottom: 1ex !important;">5</td>\n' +
      '<td style="text-align: center; border-right: none !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; padding-bottom: 1ex !important;">88</td>\n' +
      '<td style="text-align: center; border-right: none !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; padding-bottom: 1ex !important;">788</td>\n' +
      '<td style="text-align: center; border-right-style: double !important; border-right-width: 3px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; padding-bottom: 1ex !important;">6344</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>'
  },
  {
    latex: 'The table \\ref{table:1} is an example of referenced \\LaTeX elements.\n' +
      '\n' +
      '\\begin{table}[h!]\n' +
      '\\centering\n' +
      '\\begin{tabular}{||c c c c||}\n' +
      '\\hline\n' +
      'Col1 & Col2 & Col2 & Col3 \\\\ [0.5ex]\n' +
      '\\hline\\hline\n' +
      '1 & 6 & 87837 & 787 \\\\\n' +
      '2 & 7 & 78 & 5415 \\\\\n' +
      '3 & 545 & 778 & 7507 \\\\\n' +
      '4 & 545 & 18744 & 7560 \\\\\n' +
      '5 & 88 & 788 & 6344 \\\\ [1ex]\n' +
      '\\hline\n' +
      '\\end{tabular}\n' +
      '\\caption{Table to test captions and labels}\n' +
      '\\label{table:1}\n' +
      '\\end{table}',
    tsv: 'Col1\tCol2\tCol2\tCol3\n' +
      '1\t6\t87837\t787\n' +
      '2\t7\t78\t5415\n' +
      '3\t545\t778\t7507\n' +
      '4\t545\t18744\t7560\n' +
      '5\t88\t788\t6344',
    html: '<table id="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: double !important; border-left-width: 3px !important; border-right: none !important; border-bottom-style: double !important; border-bottom-width: 3px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; padding-bottom: 0.5ex !important;">Col1</td>\n' +
      '<td style="text-align: center; border-right: none !important; border-bottom-style: double !important; border-bottom-width: 3px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; padding-bottom: 0.5ex !important;">Col2</td>\n' +
      '<td style="text-align: center; border-right: none !important; border-bottom-style: double !important; border-bottom-width: 3px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; padding-bottom: 0.5ex !important;">Col2</td>\n' +
      '<td style="text-align: center; border-right-style: double !important; border-right-width: 3px !important; border-bottom-style: double !important; border-bottom-width: 3px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; padding-bottom: 0.5ex !important;">Col3</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: double !important; border-left-width: 3px !important; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">6</td>\n' +
      '<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">87837</td>\n' +
      '<td style="text-align: center; border-right-style: double !important; border-right-width: 3px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">787</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: double !important; border-left-width: 3px !important; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">2</td>\n' +
      '<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">7</td>\n' +
      '<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">78</td>\n' +
      '<td style="text-align: center; border-right-style: double !important; border-right-width: 3px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">5415</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: double !important; border-left-width: 3px !important; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">3</td>\n' +
      '<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">545</td>\n' +
      '<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">778</td>\n' +
      '<td style="text-align: center; border-right-style: double !important; border-right-width: 3px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">7507</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: double !important; border-left-width: 3px !important; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">4</td>\n' +
      '<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">545</td>\n' +
      '<td style="text-align: center; border-right: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">18744</td>\n' +
      '<td style="text-align: center; border-right-style: double !important; border-right-width: 3px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">7560</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: double !important; border-left-width: 3px !important; border-right: none !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; padding-bottom: 1ex !important;">5</td>\n' +
      '<td style="text-align: center; border-right: none !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; padding-bottom: 1ex !important;">88</td>\n' +
      '<td style="text-align: center; border-right: none !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; padding-bottom: 1ex !important;">788</td>\n' +
      '<td style="text-align: center; border-right-style: double !important; border-right-width: 3px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; padding-bottom: 1ex !important;">6344</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>'
  },
  {
    latex: '\\begin{table}[h]\n' +
      '\\centering\n' +
      '\\begin{tabular}{|c||c|c|} \\hline\n' +
      '& A & B \\\\ \\hline\\hline\n' +
      'Foo &\n' +
      '\\begin{tabular}{c} 1 \\\\ 2 \\\\ 3 \\\\ 4 \\\\\n' +
      '\\end{tabular} &\n' +
      '\\begin{tabular}{c} 2 \\\\ 5 \\\\ 9 \\\\ 8 \\\\\n' +
      '\\end{tabular} \\\\ \\hline\n' +
      'Bar &\n' +
      '\\begin{tabular}{c} 1 \\\\ 2 \\\\ 3 \\\\ 4 \\\\\n' +
      '\\end{tabular} &\n' +
      '\\begin{tabular}{c} 31 \\\\ 23 \\\\ 16 \\\\ 42 \\\\\n' +
      '\\end{tabular} \\\\ \\hline\n' +
      '\\end{tabular}\n' +
      '\\caption{this is the table!}\n' +
      '\\label{table:4}\n' +
      '\\end{table}',
    tsv: '\tA\tB\nFoo\t1,2,3,4\t2,5,9,8\nBar\t1,2,3,4\t31,23,16,42',
    html_not_tsv: '<table id="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: double !important; border-right-width: 3px !important; border-bottom-style: double !important; border-bottom-width: 3px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; " class="_empty"></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: double !important; border-bottom-width: 3px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">A</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: double !important; border-bottom-width: 3px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">B</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: double !important; border-right-width: 3px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Foo</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular"><table id="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">2</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">3</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">4</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular"><table id="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">2</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">5</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">9</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">8</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: double !important; border-right-width: 3px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Bar</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular"><table id="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">2</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">3</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">4</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular"><table id="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">31</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">23</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">16</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">42</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>',
    html: '<table id="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: double !important; border-right-width: 3px !important; border-bottom-style: double !important; border-bottom-width: 3px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; " class="_empty"></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: double !important; border-bottom-width: 3px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">A</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: double !important; border-bottom-width: 3px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">B</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: double !important; border-right-width: 3px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Foo</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular"><table id="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">2</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">3</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">4</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '<tsv style="display: none">1\n' +
      '2\n' +
      '3\n' +
      '4</tsv></div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular"><table id="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">2</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">5</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">9</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">8</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '<tsv style="display: none">2\n' +
      '5\n' +
      '9\n' +
      '8</tsv></div></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: double !important; border-right-width: 3px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Bar</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular"><table id="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">2</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">3</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">4</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '<tsv style="display: none">1\n' +
      '2\n' +
      '3\n' +
      '4</tsv></div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular"><table id="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">31</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">23</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">16</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">42</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '<tsv style="display: none">31\n' +
      '23\n' +
      '16\n' +
      '42</tsv></div></td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>'
  },
  {
    latex: '\\begin{table}[h]\n' +
      '\\centering\n' +
      '\\begin{tabular}{ :c|c|c: }\n' +
      ' \\multicolumn{3}{|c|}{My cells2}\\\\\n' +
      ' \\hline\n' +
      ' \\multirow{3}{4em}{Multiple rows} & cell2 & cell3 \\\\\\hline\n' +
      ' & cell5 & cell6 \\\\ \\hline\n' +
      ' & cell8 & cell9 \\\\\n' +
      ' \\hhline\n' +
      '\\end{tabular}\n' +
      '\\caption{this is the table!}\n' +
      '\\label{table:5}\n' +
      '\\end{table}',
    tsv:  'My cells2\t\t\nMultiple rows\tcell2\tcell3\n\tcell5\tcell6\n\tcell8\tcell9',
    html: '<table id="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; border-top: none !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; " colspan="3">My cells2</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: dashed !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: 4em; border-bottom-style: double !important; border-bottom-width: 3px !important; border-bottom-style: double !important; border-bottom-width: 3px !important; " rowspan="3">Multiple rows</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">cell2</td>\n' +
      '<td style="text-align: center; border-right-style: dashed !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">cell3</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">cell5</td>\n' +
      '<td style="text-align: center; border-right-style: dashed !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">cell6</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: double !important; border-bottom-width: 3px !important; border-top: none !important; width: auto; vertical-align: middle; ">cell8</td>\n' +
      '<td style="text-align: center; border-right-style: dashed !important; border-right-width: 1px !important; border-bottom-style: double !important; border-bottom-width: 3px !important; border-top: none !important; width: auto; vertical-align: middle; ">cell9</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>'
  },
  {
    latex: '\\begin{table}[h]\n' +
      '\\centering\n' +
      '\\begin{tabular}{ |c|c|c| }\n' +
      '\\hhline\n' +
      '{ formula $\\frac{\\nabla^{2} A}{A}=-k^{2}$} & cell2 & cell3 \\\\\n' +
      ' \\hline\n' +
      '\\end{tabular}\n' +
      '\\caption{this is the table!}\n' +
      '\\label{table:7}\n' +
      '\\end{table}',
    tsv: 'formula (grad^(2)A)/(A)=-k^(2)\tcell2\tcell3',
    html: '<table id="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: double !important; border-top-width: 3px !important; width: auto; vertical-align: middle; ">formula <span class="math-inline ">\n' +
      '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.783ex" xmlns="http://www.w3.org/2000/svg" width="11.043ex" height="3.009ex" role="img" focusable="false" viewBox="0 -983.7 4880.8 1330"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mfrac"><g data-mml-node="mrow" transform="translate(220, 394) scale(0.707)"><g data-mml-node="msup"><g data-mml-node="mi"><path data-c="2207" d="M46 676Q46 679 51 683H781Q786 679 786 676Q786 674 617 326T444 -26Q439 -33 416 -33T388 -26Q385 -22 216 326T46 676ZM697 596Q697 597 445 597T193 596Q195 591 319 336T445 80L697 596Z"></path></g><g data-mml-node="TeXAtom" transform="translate(833, 363) scale(0.707)" data-mjx-texclass="ORD"><g data-mml-node="mn"><path data-c="32" d="M109 429Q82 429 66 447T50 491Q50 562 103 614T235 666Q326 666 387 610T449 465Q449 422 429 383T381 315T301 241Q265 210 201 149L142 93L218 92Q375 92 385 97Q392 99 409 186V189H449V186Q448 183 436 95T421 3V0H50V19V31Q50 38 56 46T86 81Q115 113 136 137Q145 147 170 174T204 211T233 244T261 278T284 308T305 340T320 369T333 401T340 431T343 464Q343 527 309 573T212 619Q179 619 154 602T119 569T109 550Q109 549 114 549Q132 549 151 535T170 489Q170 464 154 447T109 429Z"></path></g></g></g><g data-mml-node="mi" transform="translate(1236.6, 0)"><path data-c="41" d="M208 74Q208 50 254 46Q272 46 272 35Q272 34 270 22Q267 8 264 4T251 0Q249 0 239 0T205 1T141 2Q70 2 50 0H42Q35 7 35 11Q37 38 48 46H62Q132 49 164 96Q170 102 345 401T523 704Q530 716 547 716H555H572Q578 707 578 706L606 383Q634 60 636 57Q641 46 701 46Q726 46 726 36Q726 34 723 22Q720 7 718 4T704 0Q701 0 690 0T651 1T578 2Q484 2 455 0H443Q437 6 437 9T439 27Q443 40 445 43L449 46H469Q523 49 533 63L521 213H283L249 155Q208 86 208 74ZM516 260Q516 271 504 416T490 562L463 519Q447 492 400 412L310 260L413 259Q516 259 516 260Z"></path></g></g><g data-mml-node="mi" transform="translate(657.2, -346.3) scale(0.707)"><path data-c="41" d="M208 74Q208 50 254 46Q272 46 272 35Q272 34 270 22Q267 8 264 4T251 0Q249 0 239 0T205 1T141 2Q70 2 50 0H42Q35 7 35 11Q37 38 48 46H62Q132 49 164 96Q170 102 345 401T523 704Q530 716 547 716H555H572Q578 707 578 706L606 383Q634 60 636 57Q641 46 701 46Q726 46 726 36Q726 34 723 22Q720 7 718 4T704 0Q701 0 690 0T651 1T578 2Q484 2 455 0H443Q437 6 437 9T439 27Q443 40 445 43L449 46H469Q523 49 533 63L521 213H283L249 155Q208 86 208 74ZM516 260Q516 271 504 416T490 562L463 519Q447 492 400 412L310 260L413 259Q516 259 516 260Z"></path></g><rect width="1604.7" height="60" x="120" y="220"></rect></g><g data-mml-node="mo" transform="translate(2122.5, 0)"><path data-c="3D" d="M56 347Q56 360 70 367H707Q722 359 722 347Q722 336 708 328L390 327H72Q56 332 56 347ZM56 153Q56 168 72 173H708Q722 163 722 153Q722 140 707 133H70Q56 140 56 153Z"></path></g><g data-mml-node="mo" transform="translate(3178.3, 0)"><path data-c="2212" d="M84 237T84 250T98 270H679Q694 262 694 250T679 230H98Q84 237 84 250Z"></path></g><g data-mml-node="msup" transform="translate(3956.3, 0)"><g data-mml-node="mi"><path data-c="6B" d="M121 647Q121 657 125 670T137 683Q138 683 209 688T282 694Q294 694 294 686Q294 679 244 477Q194 279 194 272Q213 282 223 291Q247 309 292 354T362 415Q402 442 438 442Q468 442 485 423T503 369Q503 344 496 327T477 302T456 291T438 288Q418 288 406 299T394 328Q394 353 410 369T442 390L458 393Q446 405 434 405H430Q398 402 367 380T294 316T228 255Q230 254 243 252T267 246T293 238T320 224T342 206T359 180T365 147Q365 130 360 106T354 66Q354 26 381 26Q429 26 459 145Q461 153 479 153H483Q499 153 499 144Q499 139 496 130Q455 -11 378 -11Q333 -11 305 15T277 90Q277 108 280 121T283 145Q283 167 269 183T234 206T200 217T182 220H180Q168 178 159 139T145 81T136 44T129 20T122 7T111 -2Q98 -11 83 -11Q66 -11 57 -1T48 16Q48 26 85 176T158 471L195 616Q196 629 188 632T149 637H144Q134 637 131 637T124 640T121 647Z"></path></g><g data-mml-node="TeXAtom" transform="translate(521, 363) scale(0.707)" data-mjx-texclass="ORD"><g data-mml-node="mn"><path data-c="32" d="M109 429Q82 429 66 447T50 491Q50 562 103 614T235 666Q326 666 387 610T449 465Q449 422 429 383T381 315T301 241Q265 210 201 149L142 93L218 92Q375 92 385 97Q392 99 409 186V189H449V186Q448 183 436 95T421 3V0H50V19V31Q50 38 56 46T86 81Q115 113 136 137Q145 147 170 174T204 211T233 244T261 278T284 308T305 340T320 369T333 401T340 431T343 464Q343 527 309 573T212 619Q179 619 154 602T119 569T109 550Q109 549 114 549Q132 549 151 535T170 489Q170 464 154 447T109 429Z"></path></g></g></g></g></g></svg></mjx-container></span></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: double !important; border-top-width: 3px !important; width: auto; vertical-align: middle; ">cell2</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: double !important; border-top-width: 3px !important; width: auto; vertical-align: middle; ">cell3</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>'
  },
  {
    latex: '\\begin{table}[h]\n' +
      '\\centering\n' +
      '\\begin{tabular}{|l:l:l|}\n' +
      '\\hline\n' +
      '1& \\multirow{2}{5em}{\\multicolumn{2}{:c:}{Day}}\\\\  \\hline\n' +
      '1&2&3&4\\\\  \\hline\n' +
      '1&2&3&4\\\\  \\hline\n' +
      '\\end{tabular}\n' +
      '\\end{table}',
    tsv: '1\tDay\t\t\n1\t\t\t4\n1\t2\t3\t4',
    html: '<table id="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: dashed !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '<td style="text-align: center; border-left-style: dashed !important; border-left-width: 1px !important; border-right-style: dashed !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: 5em; border-top-style: solid !important; border-top-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; " colspan="2" rowspan="2">Day</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; " class="_empty"></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: dashed !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">4</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: dashed !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '<td style="text-align: left; border-right-style: dashed !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">2</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">3</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">4</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>'
  },
  {
    latex: '\\begin{table}[h]\n' +
      '\\centering\n' +
      '\\begin{tabular} {|||c|c|c|c|c|c|c|c|:::}\n' +
      '\\hline \\hhline {alms\'s} & \\multicolumn{4}{|c|} {economizes} & {recondition} & {bailing} & {asymptotically} \\\\ \\hline\n' +
      '\\multicolumn{1}{|||c|} {fiddle} & \\multicolumn{5}{|c|} {kitchenettes} & {misstates} \\\\ \\hline\n' +
      '\\end{tabular}\n' +
      '\\caption{this is the table!}\n' +
      '\\label{table:7}\n' +
      '\\end{table}\n' +
      '\n' +
      'Table \\ref{table:4} is an example.',
    tsv:  "alms's\teconomizes\t\t\t\trecondition\tbailing\tasymptotically\n" +
      'fiddle\tkitchenettes\t\t\t\t\tmisstates\t',
    html: '<table id="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: double !important; border-left-width: 3px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: double !important; border-top-width: 3px !important; width: auto; vertical-align: middle; ">alms\'s</td>\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; border-top-style: double !important; border-top-width: 3px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; " colspan="4">economizes</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: double !important; border-top-width: 3px !important; width: auto; vertical-align: middle; ">recondition</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: double !important; border-top-width: 3px !important; width: auto; vertical-align: middle; ">bailing</td>\n' +
      '<td style="text-align: center; border-right-style: double !important; border-right-width: 3px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: double !important; border-top-width: 3px !important; width: auto; vertical-align: middle; ">asymptotically</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: double !important; border-left-width: 3px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; " colspan="1">fiddle</td>\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; " colspan="5">kitchenettes</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">misstates</td>\n' +
      '<td style="text-align: center; border-right-style: double !important; border-right-width: 3px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; " class="_empty"></td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>'
  },
  {
    latex: '\\begin{tabular}{|c|c|}\\hline Feature & Component \\\\ \\hline \\hline Power lock & Door lock manager \\& Power lock \\\\ Door lock & Auto lock \\\\ Door relock & Auto lock \\\\ f_Automatic & c_Automatic \\\\ f_Manual & c_Manual \\\\ Shift out of Park & Gear in Park \\\\ f_Speed & c_Speed \\\\ \\hline\\end{tabular}',
    tsv:   'Feature\tComponent\n' +
      'Power lock\tDoor lock manager & Power lock\n' +
      'Door lock\tAuto lock\n' +
      'Door relock\tAuto lock\n' +
      'f_Automatic\tc_Automatic\n' +
      'f_Manual\tc_Manual\n' +
      'Shift out of Park\tGear in Park\n' +
      'f_Speed\tc_Speed',
    html: '<table id="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: double !important; border-bottom-width: 3px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">Feature</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: double !important; border-bottom-width: 3px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">Component</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Power lock</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Door lock manager &amp; Power lock</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Door lock</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Auto lock</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Door relock</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Auto lock</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">f_Automatic</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">c_Automatic</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">f_Manual</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">c_Manual</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Shift out of Park</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Gear in Park</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">f_Speed</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">c_Speed</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>'
  },
  {
    latex: '\\begin{tabular}{|l|l|}\n' +
      '\\hline \\hline Plan 1 & Plan 2 \\\\\n' +
      '\\hline Employee pays \\$100 & Employee pays \\$200 \\\\\n' +
      '\\hline Plan pays 70\\% of the rest & Plan pays 80\\% of the rest \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv: 'Plan 1\tPlan 2\n' +
      'Employee pays $100\tEmployee pays $200\n' +
      'Plan pays 70% of the rest\tPlan pays 80% of the rest',
    html: '<table id="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: double !important; border-top-width: 3px !important; width: auto; vertical-align: middle; ">Plan 1</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: double !important; border-top-width: 3px !important; width: auto; vertical-align: middle; ">Plan 2</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Employee pays $100</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Employee pays $200</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Plan pays 70% of the rest</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Plan pays 80% of the rest</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>'
  },
  {
    latex: '\\begin{tabular}{|l|l|}\n' +
      '\\hline \\hline Plan 1 & Plan 2 \\\\\n' +
      '\\hline Employee pays \\$100 & Employee pays $200 \\\\\n' +
      '\\hline Plan pays 70\\% of the rest & Plan pays 80\\% of the rest \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv: 'Plan 1\tPlan 2\n' +
      'Employee pays $100\tEmployee pays $200\n' +
      'Plan pays 70% of the rest\tPlan pays 80% of the rest',
    html: '<table id="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: double !important; border-top-width: 3px !important; width: auto; vertical-align: middle; ">Plan 1</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: double !important; border-top-width: 3px !important; width: auto; vertical-align: middle; ">Plan 2</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Employee pays $100</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Employee pays $200</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Plan pays 70% of the rest</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Plan pays 80% of the rest</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>'
  },
  {
    latex: '\\begin{tabular}{|l|l|}\n' +
      '\\hline \\hline Plan 1 & Plan 2 \\\\\n' +
      '\\hline Employee pays $100 & Employee pays $200 \\\\\n' +
      '\\hline Plan pays 70\\% of the rest & Plan pays 80\\% of the rest \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv: 'Plan 1\tPlan 2\n' +
      'Employee pays $100\tEmployee pays $200\n' +
      'Plan pays 70% of the rest\tPlan pays 80% of the rest',
    html: '<table id="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: double !important; border-top-width: 3px !important; width: auto; vertical-align: middle; ">Plan 1</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: double !important; border-top-width: 3px !important; width: auto; vertical-align: middle; ">Plan 2</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Employee pays $100</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Employee pays $200</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Plan pays 70% of the rest</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Plan pays 80% of the rest</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>'
  },
  {
    latex: '\\begin{tabular}{|l|l|}\n' +
      '\\hline \\hline Plan 1 & Plan 2 \\\\\n' +
      '\\hline Employee pays $100 & Employee pays \\$200 \\\\\n' +
      '\\hline Plan pays 70\\% of the rest & Plan pays 80\\% of the rest \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv: 'Plan 1\tPlan 2\n' +
      'Employee pays $100\tEmployee pays $200\n' +
      'Plan pays 70% of the rest\tPlan pays 80% of the rest',
    html: '<table id="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: double !important; border-top-width: 3px !important; width: auto; vertical-align: middle; ">Plan 1</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: double !important; border-top-width: 3px !important; width: auto; vertical-align: middle; ">Plan 2</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Employee pays $100</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Employee pays $200</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Plan pays 70% of the rest</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Plan pays 80% of the rest</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>'
  },
  {
    latex: '\\begin{tabular}{|l|l|}\n' +
      '\\hline \\hline Plan 1 & Plan 2 \\\\\n' +
      '\\hline Employee pays $100 & Employee pays$200 \\\\\n' +
      '\\hline Plan pays 70\\% of the rest & Plan pays 80\\% of the rest \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv: 'Plan 1\tPlan 2\n' +
      'Employee pays $100\tEmployee pays$200\n' +
      'Plan pays 70% of the rest\tPlan pays 80% of the rest',
    html: '<table id="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: double !important; border-top-width: 3px !important; width: auto; vertical-align: middle; ">Plan 1</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: double !important; border-top-width: 3px !important; width: auto; vertical-align: middle; ">Plan 2</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Employee pays $100</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Employee pays$200</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Plan pays 70% of the rest</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Plan pays 80% of the rest</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>'
  },
  {
    latex: '\\begin{tabular}{|l|l|}\n' +
      '\\hline \\hline Plan 1 & Plan 2 \\\\\n' +
      '\\hline Employee pays $ 100 & Employee pays$ 200 \\\\\n' +
      '\\hline Plan pays 70\\% of the rest & Plan pays 80\\% of the rest \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv: 'Plan 1\tPlan 2\n' +
      'Employee pays $ 100\tEmployee pays$ 200\n' +
      'Plan pays 70% of the rest\tPlan pays 80% of the rest',
    html: '<table id="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: double !important; border-top-width: 3px !important; width: auto; vertical-align: middle; ">Plan 1</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: double !important; border-top-width: 3px !important; width: auto; vertical-align: middle; ">Plan 2</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Employee pays $ 100</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Employee pays$ 200</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Plan pays 70% of the rest</td>\n' +
      '<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Plan pays 80% of the rest</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>'
  },
  { latex: '\\begin{tabular}{|l|l|r|}\\hline\n' +
      '\\multicolumn{2}{|c|}{Item}&  \\\\\\hline\n' +
      'Animal & Description & Price (\\$) \\\\\\hline\n' +
      '\\multirow{2}{*}{Gnat } & per gram & \\multirow{2}{*}{13.65} \\\\\\hline\n' +
      '& \\multirow{2}{*}{each} &  \\\\\\hline\n' +
      'Gnu &  & 92.50  \\\\\\hline\n' +
      'Emu & stuffed  & 33.33  \\\\\\hline\n' +
      'Armadillo & frozen  & 8.99  \\\\\\hline\n' +
      '\\end{tabular}',
  tsv: 'Item\t\t\n' +
      'Animal\tDescription\tPrice ($)\n' +
      'Gnat\tper gram\t13.65\n' +
      '\teach\t\n' +
      'Gnu\t\t92.50\n' +
      'Emu\tstuffed\t33.33\n' +
      'Armadillo\tfrozen\t8.99'
  },
  {
    latex: '\\begin{tabular}{|l|l|r|}\n' +
      '\\hline\n' +
      '\\multicolumn{2}{|c|}{title1}                         & \\multirow{3}{*}{title1} \\\\ \\cline{1-2}\n' +
      'Animal                & \\multirow{2}{*}{Description} &                         \\\\ \\cline{1-1}\n' +
      '\\multirow{2}{*}{Gnat} &                              &                         \\\\ \\cline{2-3} \n' +
      '                      & each                         & 0.01                    \\\\ \\hline\n' +
      '\\multirow{2}{*}{Gnu}  & stuffed                      & \\multirow{2}{*}{92.50}  \\\\ \\cline{2-2}\n' +
      '                      & stuffed                      &                         \\\\ \\hline\n' +
      'Armadillo             & frozen                       & 8.99                    \\\\ \\hline\n' +
      '\\end{tabular}',
    tsv: 'title1\t\ttitle1\n' +
      'Animal\tDescription\t\n' +
      'Gnat\t\t\n' +
      '\teach\t0.01\n' +
      'Gnu\tstuffed\t92.50\n' +
      '\tstuffed\t\n' +
      'Armadillo\tfrozen\t8.99'
  },
  {
    latex: '\\begin{tabular} { | c | c | c | } \\hline \\multirow{2}{*} {Total Production of Higgs Bosons} & \\multicolumn { 2 } { | c | } $\\mathcal { L } = 50 \\mathrm{~fb} ^ { - 1 }$ \\\\ \\cline{2-3} & $\\tan \\beta = 10$ & $\\tan \\beta = 30$ \\\\ \\hline \\hline $h ^ { 0 }$ & 1600 & 1800 \\\\ $H ^ { 0 }$ & 700 & 470 \\\\ $A ^ { 0 }$ & 900 & 935 \\\\ $H ^ { + } H ^ { - }$ & 7000 & 6500 \\\\ \\hline \\end{tabular}',
    tsv: 'Total Production of Higgs Bosons\tL=50fb^(-1)\t\n' +
      '\ttan beta=10\ttan beta=30\n' +
      'h^(0)\t1600\t1800\n' +
      'H^(0)\t700\t470\n' +
      'A^(0)\t900\t935\n' +
      'H^(+)H^(-)\t7000\t6500'
  },
  {
    latex: '\\begin{tabular}{rccccc} \\hline $\\text{curve (chiller condition, }j\\text{)}$ &$\\hat{\\sigma}_{j}^{2}$& $\\hat{\\pi}_{j}$&$\\hat{a}_{12}$&$\\hat{a}_{21}$&$\\lambda_{j}$ \\\\ \\hline $\\text{black (off, }j=1\\text{)}$ &12.2&0.682&\\multirow{2}{*} 0.015 & \\multirow{2}{*} $<10^{-16}$& 0.050 \\\\ $\\text{red (on, }j=2\\text{)}$&400.2&0.318&&&0.006 \\\\ \\hline \\end{tabular}',
    tsv: '"curve (chiller condition, "j")"\that(sigma)_(j)^(2)\that(pi)_(j)\that(a)_(12)\that(a)_(21)\tlambda_(j)\n' +
      '"black (off, "j=1")"\t12.2\t0.682\t0.015\t< 10^(-16)\t0.050\n' +
      '"red (on, "j=2")"\t400.2\t0.318\t\t\t0.006'

  },
  {
    latex: '\\begin{tabular}{c c c | c} \\multicolumn{3}{c|} \\multirow{3}{*} $\\mathbf{H}^{+}$ & $\\mathbf{0}$ \\\\ &&& $\\cdot$ \\\\ &&& $\\mathbf{0}$ \\\\ \\hline $\\mathbf{0}$ & $\\cdot$ & $\\mathbf{0}$ & $\\mathbf{H}^{-}$ \\end{tabular}',
    tsv: 'H^(+)\t\t\t0\n\t\t\t*\n\t\t\t0\n0\t*\t0\tH^(-)'
  },
  {
    latex: '\\begin{tabular}{|c|l|c|c|c|c|} \\cline{3-6} \\multicolumn{2}{c|} & {A} & {B} & {C} & {D} \\\\ \\hline \\multirow{3}{*} {Mean} & {Human}&0.069&0.134&0.094&0.157 \\\\ \\cline{2-6} & {Sculpt}&0.112&0.177&0.131&0.193 \\\\ \\cline{2-6} & $\\textbf{% Increase}$&$\\mathbf{63.1}$&$\\mathbf{32.5}$&$\\mathbf{39.3}$&$\\mathbf{23.1}$ \\\\ \\hline \\multirow{3}{*} {Median} & {Human}&0.065&0.127&0.091&0.156 \\\\ \\cline{2-6} & {Sculpt}& 0.091&0.169&0.127&0.183 \\\\ \\cline{2-6} & \\textbf{% Increase}&$\\mathbf{40.2}$&$\\mathbf{33.5}$&$\\mathbf{40.4}$&$\\mathbf{17.4}$ \\\\ \\hline \\end{tabular}',
    tsv: '\t\tA\tB\tC\tD\n' +
      'Mean\tHuman\t0.069\t0.134\t0.094\t0.157\n' +
      '\tSculpt\t0.112\t0.177\t0.131\t0.193\n' +
      '\t"% Increase"\t63.1\t32.5\t39.3\t23.1\n' +
      'Median\tHuman\t0.065\t0.127\t0.091\t0.156\n' +
      '\tSculpt\t0.091\t0.169\t0.127\t0.183\n' +
      '\t% Increase\t40.2\t33.5\t40.4\t17.4'
  },
  {
    latex: '\\begin{tabular}{|l|l|l|c|l|r|}\n' +
      '\\hline\n' +
      '1  & \\multirow{7}{*}{2} & \\multirow{6}{*}{3} & \\multirow{5}{*}{4}      & \\multirow{4}{*}{5} & 6  \\\\ \\cline{1-1} \\cline{6-6} \n' +
      '7  &                    &                    &                         &                    & 12 \\\\ \\cline{1-1} \\cline{6-6} \n' +
      '13 &                    &                    &                         &                    & 18 \\\\ \\cline{1-1} \\cline{6-6} \n' +
      '19 &                    &                    &                         &                    & 24 \\\\ \\cline{1-1} \\cline{5-6} \n' +
      '25 &                    &                    &                         & 29                 & 30 \\\\ \\cline{1-1} \\cline{4-6} \n' +
      '31 &                    &                    & \\multicolumn{1}{l|}{34} & 35                 & 36 \\\\ \\cline{1-1} \\cline{3-6} \n' +
      '37 &                    & 39                 & \\multicolumn{1}{l|}{40} & 41                 & 42 \\\\ \\hline\n' +
      '\\end{tabular}',
    tsv: '1\t2\t3\t4\t5\t6\n' +
      '7\t\t\t\t\t12\n' +
      '13\t\t\t\t\t18\n' +
      '19\t\t\t\t\t24\n' +
      '25\t\t\t\t29\t30\n' +
      '31\t\t\t34\t35\t36\n' +
      '37\t\t39\t40\t41\t42'
  },
  {
    latex: '\\begin{tabular}{|l|l|l|c|l|r|l|l|l|}\n' +
      '\\hline\n' +
      '1                  & \\multirow{7}{*}{2} & \\multirow{6}{*}{3} & \\multirow{5}{*}{4}      & \\multirow{4}{*}{5} & 6                   & \\multirow{3}{*}{7}  & \\multirow{2}{*}{8} & 9                   \\\\ \\cline{1-1} \\cline{6-6} \\cline{9-9} \n' +
      '\\multirow{5}{*}{7} &                    &                    &                         &                    & 12                  &                     &                    & 3                   \\\\ \\cline{6-6} \\cline{8-9} \n' +
      '                   &                    &                    &                         &                    & 18                  &                     & 3                  & 3                   \\\\ \\cline{6-9} \n' +
      '                   &                    &                    &                         &                    & \\multirow{4}{*}{24} & 25                  & 26                 & 27                  \\\\ \\cline{5-5} \\cline{7-9} \n' +
      '                   &                    &                    &                         & 29                 &                     & \\multirow{3}{*}{31} & 32                 & 33                  \\\\ \\cline{4-5} \\cline{8-9} \n' +
      '                   &                    &                    & \\multicolumn{1}{l|}{34} & 35                 &                     &                     & 38                 & \\multirow{2}{*}{39} \\\\ \\cline{1-1} \\cline{3-5} \\cline{8-8}\n' +
      '37                 &                    & 39                 & \\multicolumn{1}{l|}{40} & 41                 &                     &                     & 44                 &                     \\\\ \\hline\n' +
      '\\end{tabular}',
    tsv: '1\t2\t3\t4\t5\t6\t7\t8\t9\n' +
      '7\t\t\t\t\t12\t\t\t3\n' +
      '\t\t\t\t\t18\t\t3\t3\n' +
      '\t\t\t\t\t24\t25\t26\t27\n' +
      '\t\t\t\t29\t\t31\t32\t33\n' +
      '\t\t\t34\t35\t\t\t38\t39\n' +
      '37\t\t39\t40\t41\t\t\t44\t'
  },
  {
    latex: '\\begin{tabular}{|c|c|c|c|l|}\n' +
      '\\hline \n' +
      '2 & $\\pm \\frac{1}{\\sqrt{3}}$ & $\\pm 0.57735 \\ldots$ & \\multicolumn{2}{|c|}1 \\\\\n' +
      '\\hline \n' +
      '\\multirow{2}{*}3 & \\multicolumn{2}{|c|}0 & $\\frac{8}{9}$ & $0.888889 \\ldots$ \\\\\n' +
      '\\hline \n' +
      '& $\\pm \\sqrt{\\frac{3}{5}}$ & $\\pm 0.774597 \\ldots$ & $\\frac{5}{9}$ & $0.555556 \\ldots$ \\\\\n' +
      '\\hline \n' +
      '\\multirow{2}{*}4 & $\\pm \\sqrt{\\frac{3}{7}-\\frac{2}{7} \\sqrt{\\frac{6}{5}}}$ & $\\pm 0.339981 \\ldots$ & $\\frac{18+\\sqrt{30}}{36}$ & $0.652145 \\ldots$ \\\\\n' +
      '\\hline\n' +
      '& $\\pm \\sqrt{\\frac{3}{7}+\\frac{2}{7} \\sqrt{\\frac{6}{5}}}$ & $\\pm 0.861136 \\ldots$ & $\\frac{18-\\sqrt{30}}{36}$ & $0.347855 \\ldots$ \\\\\n' +
      '\\hline\n' +
      '\\multirow{3}{*}5 & \\multicolumn{2}{|c|}0 & $\\frac{128}{225}$ & $0.568889 \\ldots$ \\\\\n' +
      '\\hline\n' +
      '& $\\pm \\frac{1}{3} \\sqrt{5-2 \\sqrt{\\frac{10}{7}}}$ & $\\pm 0.538469 \\ldots$ & $\\frac{322+13 \\sqrt{70}}{900}$ & $0.478629 \\ldots$ \\\\\n' +
      '\\hline\n' +
      '& $\\pm \\frac{1}{3} \\sqrt{5+2 \\sqrt{\\frac{10}{7}}}$ & $\\pm 0.90618 \\ldots$ & $\\frac{322-13 \\sqrt{70}}{900}$ & $0.236927 \\ldots$ \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    tsv: '2\t+-(1)/(sqrt3)\t+-0.57735 dots\t1\t\n' +
      '3\t0\t\t(8)/(9)\t0.888889 dots\n' +
      '\t+-sqrt((3)/(5))\t+-0.774597 dots\t(5)/(9)\t0.555556 dots\n' +
      '4\t+-sqrt((3)/(7)-(2)/(7)sqrt((6)/(5)))\t+-0.339981 dots\t(18+sqrt30)/(36)\t0.652145 dots\n' +
      '\t+-sqrt((3)/(7)+(2)/(7)sqrt((6)/(5)))\t+-0.861136 dots\t(18-sqrt30)/(36)\t0.347855 dots\n' +
      '5\t0\t\t(128)/(225)\t0.568889 dots\n' +
      '\t+-(1)/(3)sqrt(5-2sqrt((10)/(7)))\t+-0.538469 dots\t(322+13sqrt70)/(900)\t0.478629 dots\n' +
      '\t+-(1)/(3)sqrt(5+2sqrt((10)/(7)))\t+-0.90618 dots\t(322-13sqrt70)/(900)\t0.236927 dots'
  },
  {latex: '\\begin{tabular}{|l|l|l|l|l|r|}\n' +
      '\\hline\n' +
      '1                   & 2                   & 3  & \\multicolumn{3}{c|}{4}                         \\\\ \\hline\n' +
      '\\multirow{3}{*}{7}  & \\multicolumn{3}{l|}{8}                         & 11 & \\multirow{2}{*}{12} \\\\ \\cline{2-5}\n' +
      '                    & \\multicolumn{4}{l|}{14}                             &                     \\\\ \\cline{2-6} \n' +
      '                    & \\multirow{2}{*}{20} & 21 & \\multirow{4}{*}{22} & 23 & 24                  \\\\ \\cline{1-1} \\cline{3-3} \\cline{5-6} \n' +
      '\\multirow{3}{*}{25} &                     & 27 &                     & \\multicolumn{2}{l|}{29}  \\\\ \\cline{2-3} \\cline{5-6} \n' +
      '                    & \\multicolumn{2}{l|}{32}  &                     & 35 & 36                  \\\\ \\cline{2-3} \\cline{5-6} \n' +
      '                    & 38                  & 39 &                     & \\multicolumn{2}{l|}{41}  \\\\ \\hline\n' +
      '\\end{tabular}',
  tsv: '1\t2\t3\t4\t\t\n' +
    '7\t8\t\t\t11\t12\n' +
    '\t14\t\t\t\t\n' +
    '\t20\t21\t22\t23\t24\n' +
    '25\t\t27\t\t29\t\n' +
    '\t32\t\t\t35\t36\n' +
    '\t38\t39\t\t41\t'},
  {
    latex: '\\begin{tabular}{|c|c|c|c|c|c|}\\hline \\multirow{2}{*} {} & \\multicolumn{2}{|c|} { Latency \\( (\\mathrm{s}) \\)} & \\multicolumn{2}{|c|} { Message Sizes \\( (\\mathrm{MB}) \\)} & \\multirow{2}{*} { Accuracy \\( \\% \\)} \\\\ \\cline { 2 - 5 } & offline & online & offline & online & \\\\ \\hline ReLU/CNN/MNIST (Figure 12) & 3.58 & 5.74 & 20.9 & 636.6 & 99.0 \\\\ \\hline ReLU/CNN/CIFAR-10 (Figure 13) & 472 & 72 & 3046 & 6226 & 81.61 \\\\ \\hline Sigmoidal/LSTM/PTB (Figure 14) & 13.9 & 4.39 & 86.7 & 474 & cross-entropy loss:4.79 \\\\ \\hline\\end{tabular}',
    tsv: '\tLatency (s)\t\tMessage Sizes (MB)\t\tAccuracy %\n' +
      '\toffline\tonline\toffline\tonline\t\n' +
      'ReLU/CNN/MNIST (Figure 12)\t3.58\t5.74\t20.9\t636.6\t99.0\n' +
      'ReLU/CNN/CIFAR-10 (Figure 13)\t472\t72\t3046\t6226\t81.61\n' +
      'Sigmoidal/LSTM/PTB (Figure 14)\t13.9\t4.39\t86.7\t474\tcross-entropy loss:4.79'
  }
];
