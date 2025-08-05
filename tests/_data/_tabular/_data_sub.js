module.exports = [
  {
    latex: '\\begin{tabular} { l }  \\( \\qquad \\)  \\begin{tabular} { | l | l | l | l | l | l | l | l | l | } \\hline \\end{tabular} \\\\ \\hline 4 \\end{tabular}',
    svg: '<div class="table_tabular" style="text-align: center">\n' +
      '<div class="inline-tabular"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><span class="math-inline ">\n' +
      '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: 0;" xmlns="http://www.w3.org/2000/svg" width="4.525ex" height="0.036ex" role="img" focusable="false" viewBox="0 0 2000 16"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mstyle"><g data-mml-node="mspace"></g></g></g></g></svg></mjx-container></span><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody></tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">4</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></div>'
  },
  {
    latex: '\\begin{tabular}{|c|c|c|}\n' +
      '  \\hline\n' +
      '  \\textbf{Column 1} & \\textbf{Column 2} & \\textbf{Column 3} \\\\\n' +
      '  \\hline\n' +
      '  1 & \n' +
      '  { $\\displaystyle E = mc^2$\n' +
      '    \\begin{tabular}{c}\n' +
      '      \\\\\n' +
      '      \\begin{tabular}{|c|c|}\n' +
      '        \\hline\n' +
      '        A & B \\\\\n' +
      '        \\hline\n' +
      '        C & D \\\\\n' +
      '        \\hline\n' +
      '      \\end{tabular} \\\\\n' +
      '    \\end{tabular}\n' +
      '  } \n' +
      '  & Some Text \\\\\n' +
      '  \\cline{1-1} \\cline{3-3}\n' +
      '  2 &  & Another Text \\\\\n' +
      '  \\hline\n' +
      '\\end{tabular}',
    svg: '<div class="table_tabular" style="text-align: center">\n' +
      '<div class="inline-tabular"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; "><strong>Column 1</strong></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; "><strong>Column 2</strong></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; "><strong>Column 3</strong></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; "><span class="math-inline ">\n' +
      '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.186ex;" xmlns="http://www.w3.org/2000/svg" width="8.699ex" height="2.185ex" role="img" focusable="false" viewBox="0 -883.9 3845.1 965.9"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mstyle"><g data-mml-node="mi"><path data-c="1D438" d="M492 213Q472 213 472 226Q472 230 477 250T482 285Q482 316 461 323T364 330H312Q311 328 277 192T243 52Q243 48 254 48T334 46Q428 46 458 48T518 61Q567 77 599 117T670 248Q680 270 683 272Q690 274 698 274Q718 274 718 261Q613 7 608 2Q605 0 322 0H133Q31 0 31 11Q31 13 34 25Q38 41 42 43T65 46Q92 46 125 49Q139 52 144 61Q146 66 215 342T285 622Q285 629 281 629Q273 632 228 634H197Q191 640 191 642T193 659Q197 676 203 680H757Q764 676 764 669Q764 664 751 557T737 447Q735 440 717 440H705Q698 445 698 453L701 476Q704 500 704 528Q704 558 697 578T678 609T643 625T596 632T532 634H485Q397 633 392 631Q388 629 386 622Q385 619 355 499T324 377Q347 376 372 376H398Q464 376 489 391T534 472Q538 488 540 490T557 493Q562 493 565 493T570 492T572 491T574 487T577 483L544 351Q511 218 508 216Q505 213 492 213Z"></path></g><g data-mml-node="mo" transform="translate(1041.8,0)"><path data-c="3D" d="M56 347Q56 360 70 367H707Q722 359 722 347Q722 336 708 328L390 327H72Q56 332 56 347ZM56 153Q56 168 72 173H708Q722 163 722 153Q722 140 707 133H70Q56 140 56 153Z"></path></g><g data-mml-node="mi" transform="translate(2097.6,0)"><path data-c="1D45A" d="M21 287Q22 293 24 303T36 341T56 388T88 425T132 442T175 435T205 417T221 395T229 376L231 369Q231 367 232 367L243 378Q303 442 384 442Q401 442 415 440T441 433T460 423T475 411T485 398T493 385T497 373T500 364T502 357L510 367Q573 442 659 442Q713 442 746 415T780 336Q780 285 742 178T704 50Q705 36 709 31T724 26Q752 26 776 56T815 138Q818 149 821 151T837 153Q857 153 857 145Q857 144 853 130Q845 101 831 73T785 17T716 -10Q669 -10 648 17T627 73Q627 92 663 193T700 345Q700 404 656 404H651Q565 404 506 303L499 291L466 157Q433 26 428 16Q415 -11 385 -11Q372 -11 364 -4T353 8T350 18Q350 29 384 161L420 307Q423 322 423 345Q423 404 379 404H374Q288 404 229 303L222 291L189 157Q156 26 151 16Q138 -11 108 -11Q95 -11 87 -5T76 7T74 17Q74 30 112 181Q151 335 151 342Q154 357 154 369Q154 405 129 405Q107 405 92 377T69 316T57 280Q55 278 41 278H27Q21 284 21 287Z"></path></g><g data-mml-node="msup" transform="translate(2975.6,0)"><g data-mml-node="mi"><path data-c="1D450" d="M34 159Q34 268 120 355T306 442Q362 442 394 418T427 355Q427 326 408 306T360 285Q341 285 330 295T319 325T330 359T352 380T366 386H367Q367 388 361 392T340 400T306 404Q276 404 249 390Q228 381 206 359Q162 315 142 235T121 119Q121 73 147 50Q169 26 205 26H209Q321 26 394 111Q403 121 406 121Q410 121 419 112T429 98T420 83T391 55T346 25T282 0T202 -11Q127 -11 81 37T34 159Z"></path></g><g data-mml-node="mn" transform="translate(466,413) scale(0.707)"><path data-c="32" d="M109 429Q82 429 66 447T50 491Q50 562 103 614T235 666Q326 666 387 610T449 465Q449 422 429 383T381 315T301 241Q265 210 201 149L142 93L218 92Q375 92 385 97Q392 99 409 186V189H449V186Q448 183 436 95T421 3V0H50V19V31Q50 38 56 46T86 81Q115 113 136 137Q145 147 170 174T204 211T233 244T261 278T284 308T305 340T320 369T333 401T340 431T343 464Q343 527 309 573T212 619Q179 619 154 602T119 569T109 550Q109 549 114 549Q132 549 151 535T170 489Q170 464 154 447T109 429Z"></path></g></g></g></g></g></svg></mjx-container></span><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; " class="_empty"></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">A</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">B</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">C</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">D</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Some Text</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">2</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; " class="_empty"></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Another Text</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></div>'
  },
  {
    latex: '\\begin{tabular}{|c|c|c|}\n' +
      '  \\hline\n' +
      '  \\textbf{Column 1} & \\textbf{Column 2} & \\textbf{Column 3} \\\\\n' +
      '  \\hline\n' +
      '  1 & \n' +
      '  { $E = mc^2$ and $E = mc^2$\n' +
      '    \\begin{tabular}{|c|c|}\n' +
      '        \\hline\n' +
      '        A & B \\\\\n' +
      '        \\hline\n' +
      '        C & D \\\\\n' +
      '        \\hline\n' +
      '      \\end{tabular}\n' +
      '  } \n' +
      '  & Some Text \\\\\n' +
      '  \\cline{1-1} \\cline{3-3}\n' +
      '  2 &  & Another Text \\\\\n' +
      '  \\hline\n' +
      '\\end{tabular}',
    svg: '<div class="table_tabular" style="text-align: center">\n' +
      '<div class="inline-tabular"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; "><strong>Column 1</strong></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; "><strong>Column 2</strong></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; "><strong>Column 3</strong></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; "><span class="math-inline ">\n' +
      '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.186ex;" xmlns="http://www.w3.org/2000/svg" width="8.699ex" height="2.072ex" role="img" focusable="false" viewBox="0 -833.9 3845.1 915.9"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="1D438" d="M492 213Q472 213 472 226Q472 230 477 250T482 285Q482 316 461 323T364 330H312Q311 328 277 192T243 52Q243 48 254 48T334 46Q428 46 458 48T518 61Q567 77 599 117T670 248Q680 270 683 272Q690 274 698 274Q718 274 718 261Q613 7 608 2Q605 0 322 0H133Q31 0 31 11Q31 13 34 25Q38 41 42 43T65 46Q92 46 125 49Q139 52 144 61Q146 66 215 342T285 622Q285 629 281 629Q273 632 228 634H197Q191 640 191 642T193 659Q197 676 203 680H757Q764 676 764 669Q764 664 751 557T737 447Q735 440 717 440H705Q698 445 698 453L701 476Q704 500 704 528Q704 558 697 578T678 609T643 625T596 632T532 634H485Q397 633 392 631Q388 629 386 622Q385 619 355 499T324 377Q347 376 372 376H398Q464 376 489 391T534 472Q538 488 540 490T557 493Q562 493 565 493T570 492T572 491T574 487T577 483L544 351Q511 218 508 216Q505 213 492 213Z"></path></g><g data-mml-node="mo" transform="translate(1041.8,0)"><path data-c="3D" d="M56 347Q56 360 70 367H707Q722 359 722 347Q722 336 708 328L390 327H72Q56 332 56 347ZM56 153Q56 168 72 173H708Q722 163 722 153Q722 140 707 133H70Q56 140 56 153Z"></path></g><g data-mml-node="mi" transform="translate(2097.6,0)"><path data-c="1D45A" d="M21 287Q22 293 24 303T36 341T56 388T88 425T132 442T175 435T205 417T221 395T229 376L231 369Q231 367 232 367L243 378Q303 442 384 442Q401 442 415 440T441 433T460 423T475 411T485 398T493 385T497 373T500 364T502 357L510 367Q573 442 659 442Q713 442 746 415T780 336Q780 285 742 178T704 50Q705 36 709 31T724 26Q752 26 776 56T815 138Q818 149 821 151T837 153Q857 153 857 145Q857 144 853 130Q845 101 831 73T785 17T716 -10Q669 -10 648 17T627 73Q627 92 663 193T700 345Q700 404 656 404H651Q565 404 506 303L499 291L466 157Q433 26 428 16Q415 -11 385 -11Q372 -11 364 -4T353 8T350 18Q350 29 384 161L420 307Q423 322 423 345Q423 404 379 404H374Q288 404 229 303L222 291L189 157Q156 26 151 16Q138 -11 108 -11Q95 -11 87 -5T76 7T74 17Q74 30 112 181Q151 335 151 342Q154 357 154 369Q154 405 129 405Q107 405 92 377T69 316T57 280Q55 278 41 278H27Q21 284 21 287Z"></path></g><g data-mml-node="msup" transform="translate(2975.6,0)"><g data-mml-node="mi"><path data-c="1D450" d="M34 159Q34 268 120 355T306 442Q362 442 394 418T427 355Q427 326 408 306T360 285Q341 285 330 295T319 325T330 359T352 380T366 386H367Q367 388 361 392T340 400T306 404Q276 404 249 390Q228 381 206 359Q162 315 142 235T121 119Q121 73 147 50Q169 26 205 26H209Q321 26 394 111Q403 121 406 121Q410 121 419 112T429 98T420 83T391 55T346 25T282 0T202 -11Q127 -11 81 37T34 159Z"></path></g><g data-mml-node="mn" transform="translate(466,363) scale(0.707)"><path data-c="32" d="M109 429Q82 429 66 447T50 491Q50 562 103 614T235 666Q326 666 387 610T449 465Q449 422 429 383T381 315T301 241Q265 210 201 149L142 93L218 92Q375 92 385 97Q392 99 409 186V189H449V186Q448 183 436 95T421 3V0H50V19V31Q50 38 56 46T86 81Q115 113 136 137Q145 147 170 174T204 211T233 244T261 278T284 308T305 340T320 369T333 401T340 431T343 464Q343 527 309 573T212 619Q179 619 154 602T119 569T109 550Q109 549 114 549Q132 549 151 535T170 489Q170 464 154 447T109 429Z"></path></g></g></g></g></svg></mjx-container></span> and <span class="math-inline ">\n' +
      '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.186ex;" xmlns="http://www.w3.org/2000/svg" width="8.699ex" height="2.072ex" role="img" focusable="false" viewBox="0 -833.9 3845.1 915.9"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="1D438" d="M492 213Q472 213 472 226Q472 230 477 250T482 285Q482 316 461 323T364 330H312Q311 328 277 192T243 52Q243 48 254 48T334 46Q428 46 458 48T518 61Q567 77 599 117T670 248Q680 270 683 272Q690 274 698 274Q718 274 718 261Q613 7 608 2Q605 0 322 0H133Q31 0 31 11Q31 13 34 25Q38 41 42 43T65 46Q92 46 125 49Q139 52 144 61Q146 66 215 342T285 622Q285 629 281 629Q273 632 228 634H197Q191 640 191 642T193 659Q197 676 203 680H757Q764 676 764 669Q764 664 751 557T737 447Q735 440 717 440H705Q698 445 698 453L701 476Q704 500 704 528Q704 558 697 578T678 609T643 625T596 632T532 634H485Q397 633 392 631Q388 629 386 622Q385 619 355 499T324 377Q347 376 372 376H398Q464 376 489 391T534 472Q538 488 540 490T557 493Q562 493 565 493T570 492T572 491T574 487T577 483L544 351Q511 218 508 216Q505 213 492 213Z"></path></g><g data-mml-node="mo" transform="translate(1041.8,0)"><path data-c="3D" d="M56 347Q56 360 70 367H707Q722 359 722 347Q722 336 708 328L390 327H72Q56 332 56 347ZM56 153Q56 168 72 173H708Q722 163 722 153Q722 140 707 133H70Q56 140 56 153Z"></path></g><g data-mml-node="mi" transform="translate(2097.6,0)"><path data-c="1D45A" d="M21 287Q22 293 24 303T36 341T56 388T88 425T132 442T175 435T205 417T221 395T229 376L231 369Q231 367 232 367L243 378Q303 442 384 442Q401 442 415 440T441 433T460 423T475 411T485 398T493 385T497 373T500 364T502 357L510 367Q573 442 659 442Q713 442 746 415T780 336Q780 285 742 178T704 50Q705 36 709 31T724 26Q752 26 776 56T815 138Q818 149 821 151T837 153Q857 153 857 145Q857 144 853 130Q845 101 831 73T785 17T716 -10Q669 -10 648 17T627 73Q627 92 663 193T700 345Q700 404 656 404H651Q565 404 506 303L499 291L466 157Q433 26 428 16Q415 -11 385 -11Q372 -11 364 -4T353 8T350 18Q350 29 384 161L420 307Q423 322 423 345Q423 404 379 404H374Q288 404 229 303L222 291L189 157Q156 26 151 16Q138 -11 108 -11Q95 -11 87 -5T76 7T74 17Q74 30 112 181Q151 335 151 342Q154 357 154 369Q154 405 129 405Q107 405 92 377T69 316T57 280Q55 278 41 278H27Q21 284 21 287Z"></path></g><g data-mml-node="msup" transform="translate(2975.6,0)"><g data-mml-node="mi"><path data-c="1D450" d="M34 159Q34 268 120 355T306 442Q362 442 394 418T427 355Q427 326 408 306T360 285Q341 285 330 295T319 325T330 359T352 380T366 386H367Q367 388 361 392T340 400T306 404Q276 404 249 390Q228 381 206 359Q162 315 142 235T121 119Q121 73 147 50Q169 26 205 26H209Q321 26 394 111Q403 121 406 121Q410 121 419 112T429 98T420 83T391 55T346 25T282 0T202 -11Q127 -11 81 37T34 159Z"></path></g><g data-mml-node="mn" transform="translate(466,363) scale(0.707)"><path data-c="32" d="M109 429Q82 429 66 447T50 491Q50 562 103 614T235 666Q326 666 387 610T449 465Q449 422 429 383T381 315T301 241Q265 210 201 149L142 93L218 92Q375 92 385 97Q392 99 409 186V189H449V186Q448 183 436 95T421 3V0H50V19V31Q50 38 56 46T86 81Q115 113 136 137Q145 147 170 174T204 211T233 244T261 278T284 308T305 340T320 369T333 401T340 431T343 464Q343 527 309 573T212 619Q179 619 154 602T119 569T109 550Q109 549 114 549Q132 549 151 535T170 489Q170 464 154 447T109 429Z"></path></g></g></g></g></svg></mjx-container></span><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">A</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">B</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">C</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">D</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Some Text</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">2</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; " class="_empty"></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Another Text</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></div>'
  },
  {
    latex: '\\begin{tabular}{|c|c|c|}\n' +
      '  \\hline\n' +
      '  \\textbf{Column 1} & \\textbf{Column 2} & \\textbf{Column 3} \\\\\n' +
      '  \\hline\n' +
      '  \\begin{tabular}{|c|}\\hline A\\\\\\hline B\\\\\\hline \\end{tabular} \\begin{array}{|c|}\\hline C\\\\\\hline C\\\\\\hline \\end{array} & \n' +
      '  { \\begin{array}{|c|c|}\\hline A & B \\\\ \\hline C & D \\\\\\hline \\end{array}\n' +
      '    \\begin{tabular}{|c|c|}\\hline A & B \\\\\\hline C & D \\\\\\hline \\end{tabular}} \n' +
      '  & Some Text \\\\\n' +
      '  \\cline{1-1} \\cline{3-3}\n' +
      '  \\begin{array}{|c|}\\hline C\\\\\\hline C\\\\\\hline \\end{array} \\begin{tabular}{|c|c|}\\hline A & B \\\\\\hline C & D \\\\\\hline \\end{tabular} & 3 & Another Text \\\\\n' +
      '  \\hline\n' +
      '\\end{tabular}\n',
    svg: '<div class="table_tabular" style="text-align: center">\n' +
      '<div class="inline-tabular"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; "><strong>Column 1</strong></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; "><strong>Column 2</strong></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; "><strong>Column 3</strong></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">A</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">B</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div> <span  class="math-block equation-number " number="0">\n' +
      '<mjx-container class="MathJax" jax="SVG" display="true"><svg style="vertical-align: -2.874ex;" xmlns="http://www.w3.org/2000/svg" width="3.846ex" height="6.88ex" role="img" focusable="false" viewBox="0 -1770.5 1700 3041"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mtable"><g data-mml-node="mtr" transform="translate(0,735)"><g data-mml-node="mtd" transform="translate(470,0)"><g data-mml-node="mi"><path data-c="1D436" d="M50 252Q50 367 117 473T286 641T490 704Q580 704 633 653Q642 643 648 636T656 626L657 623Q660 623 684 649Q691 655 699 663T715 679T725 690L740 705H746Q760 705 760 698Q760 694 728 561Q692 422 692 421Q690 416 687 415T669 413H653Q647 419 647 422Q647 423 648 429T650 449T651 481Q651 552 619 605T510 659Q484 659 454 652T382 628T299 572T226 479Q194 422 175 346T156 222Q156 108 232 58Q280 24 350 24Q441 24 512 92T606 240Q610 253 612 255T628 257Q648 257 648 248Q648 243 647 239Q618 132 523 55T319 -22Q206 -22 128 53T50 252Z"></path></g></g></g><g data-mml-node="mtr" transform="translate(0,-735)"><g data-mml-node="mtd" transform="translate(470,0)"><g data-mml-node="mi"><path data-c="1D436" d="M50 252Q50 367 117 473T286 641T490 704Q580 704 633 653Q642 643 648 636T656 626L657 623Q660 623 684 649Q691 655 699 663T715 679T725 690L740 705H746Q760 705 760 698Q760 694 728 561Q692 422 692 421Q690 416 687 415T669 413H653Q647 419 647 422Q647 423 648 429T650 449T651 481Q651 552 619 605T510 659Q484 659 454 652T382 628T299 572T226 479Q194 422 175 346T156 222Q156 108 232 58Q280 24 350 24Q441 24 512 92T606 240Q610 253 612 255T628 257Q648 257 648 248Q648 243 647 239Q618 132 523 55T319 -22Q206 -22 128 53T50 252Z"></path></g></g></g><line data-line="h" class="mjx-solid" x1="0" y1="250" x2="1700" y2="250"></line><rect data-frame="true" class="mjx-solid" width="1630" height="2971" x="35" y="-1235.5"></rect></g></g></g></svg></mjx-container></span></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; "><span  class="math-block equation-number " number="0">\n' +
      '<mjx-container class="MathJax" jax="SVG" display="true"><svg style="vertical-align: -2.874ex;" xmlns="http://www.w3.org/2000/svg" width="8.14ex" height="6.88ex" role="img" focusable="false" viewBox="0 -1770.5 3598 3041"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mtable"><g data-mml-node="mtr" transform="translate(0,735)"><g data-mml-node="mtd" transform="translate(475,0)"><g data-mml-node="mi"><path data-c="1D434" d="M208 74Q208 50 254 46Q272 46 272 35Q272 34 270 22Q267 8 264 4T251 0Q249 0 239 0T205 1T141 2Q70 2 50 0H42Q35 7 35 11Q37 38 48 46H62Q132 49 164 96Q170 102 345 401T523 704Q530 716 547 716H555H572Q578 707 578 706L606 383Q634 60 636 57Q641 46 701 46Q726 46 726 36Q726 34 723 22Q720 7 718 4T704 0Q701 0 690 0T651 1T578 2Q484 2 455 0H443Q437 6 437 9T439 27Q443 40 445 43L449 46H469Q523 49 533 63L521 213H283L249 155Q208 86 208 74ZM516 260Q516 271 504 416T490 562L463 519Q447 492 400 412L310 260L413 259Q516 259 516 260Z"></path></g></g><g data-mml-node="mtd" transform="translate(2334.5,0)"><g data-mml-node="mi"><path data-c="1D435" d="M231 637Q204 637 199 638T194 649Q194 676 205 682Q206 683 335 683Q594 683 608 681Q671 671 713 636T756 544Q756 480 698 429T565 360L555 357Q619 348 660 311T702 219Q702 146 630 78T453 1Q446 0 242 0Q42 0 39 2Q35 5 35 10Q35 17 37 24Q42 43 47 45Q51 46 62 46H68Q95 46 128 49Q142 52 147 61Q150 65 219 339T288 628Q288 635 231 637ZM649 544Q649 574 634 600T585 634Q578 636 493 637Q473 637 451 637T416 636H403Q388 635 384 626Q382 622 352 506Q352 503 351 500L320 374H401Q482 374 494 376Q554 386 601 434T649 544ZM595 229Q595 273 572 302T512 336Q506 337 429 337Q311 337 310 336Q310 334 293 263T258 122L240 52Q240 48 252 48T333 46Q422 46 429 47Q491 54 543 105T595 229Z"></path></g></g></g><g data-mml-node="mtr" transform="translate(0,-735)"><g data-mml-node="mtd" transform="translate(470,0)"><g data-mml-node="mi"><path data-c="1D436" d="M50 252Q50 367 117 473T286 641T490 704Q580 704 633 653Q642 643 648 636T656 626L657 623Q660 623 684 649Q691 655 699 663T715 679T725 690L740 705H746Q760 705 760 698Q760 694 728 561Q692 422 692 421Q690 416 687 415T669 413H653Q647 419 647 422Q647 423 648 429T650 449T651 481Q651 552 619 605T510 659Q484 659 454 652T382 628T299 572T226 479Q194 422 175 346T156 222Q156 108 232 58Q280 24 350 24Q441 24 512 92T606 240Q610 253 612 255T628 257Q648 257 648 248Q648 243 647 239Q618 132 523 55T319 -22Q206 -22 128 53T50 252Z"></path></g></g><g data-mml-node="mtd" transform="translate(2300,0)"><g data-mml-node="mi"><path data-c="1D437" d="M287 628Q287 635 230 637Q207 637 200 638T193 647Q193 655 197 667T204 682Q206 683 403 683Q570 682 590 682T630 676Q702 659 752 597T803 431Q803 275 696 151T444 3L430 1L236 0H125H72Q48 0 41 2T33 11Q33 13 36 25Q40 41 44 43T67 46Q94 46 127 49Q141 52 146 61Q149 65 218 339T287 628ZM703 469Q703 507 692 537T666 584T629 613T590 629T555 636Q553 636 541 636T512 636T479 637H436Q392 637 386 627Q384 623 313 339T242 52Q242 48 253 48T330 47Q335 47 349 47T373 46Q499 46 581 128Q617 164 640 212T683 339T703 469Z"></path></g></g></g><line data-line="v" class="mjx-solid" x1="1765" y1="-1270.5" x2="1765" y2="1770.5"></line><line data-line="h" class="mjx-solid" x1="0" y1="250" x2="3598" y2="250"></line><rect data-frame="true" class="mjx-solid" width="3528" height="2971" x="35" y="-1235.5"></rect></g></g></g></svg></mjx-container></span><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">A</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">B</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">C</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">D</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Some Text</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><span  class="math-block equation-number " number="0">\n' +
      '<mjx-container class="MathJax" jax="SVG" display="true"><svg style="vertical-align: -2.874ex;" xmlns="http://www.w3.org/2000/svg" width="3.846ex" height="6.88ex" role="img" focusable="false" viewBox="0 -1770.5 1700 3041"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mtable"><g data-mml-node="mtr" transform="translate(0,735)"><g data-mml-node="mtd" transform="translate(470,0)"><g data-mml-node="mi"><path data-c="1D436" d="M50 252Q50 367 117 473T286 641T490 704Q580 704 633 653Q642 643 648 636T656 626L657 623Q660 623 684 649Q691 655 699 663T715 679T725 690L740 705H746Q760 705 760 698Q760 694 728 561Q692 422 692 421Q690 416 687 415T669 413H653Q647 419 647 422Q647 423 648 429T650 449T651 481Q651 552 619 605T510 659Q484 659 454 652T382 628T299 572T226 479Q194 422 175 346T156 222Q156 108 232 58Q280 24 350 24Q441 24 512 92T606 240Q610 253 612 255T628 257Q648 257 648 248Q648 243 647 239Q618 132 523 55T319 -22Q206 -22 128 53T50 252Z"></path></g></g></g><g data-mml-node="mtr" transform="translate(0,-735)"><g data-mml-node="mtd" transform="translate(470,0)"><g data-mml-node="mi"><path data-c="1D436" d="M50 252Q50 367 117 473T286 641T490 704Q580 704 633 653Q642 643 648 636T656 626L657 623Q660 623 684 649Q691 655 699 663T715 679T725 690L740 705H746Q760 705 760 698Q760 694 728 561Q692 422 692 421Q690 416 687 415T669 413H653Q647 419 647 422Q647 423 648 429T650 449T651 481Q651 552 619 605T510 659Q484 659 454 652T382 628T299 572T226 479Q194 422 175 346T156 222Q156 108 232 58Q280 24 350 24Q441 24 512 92T606 240Q610 253 612 255T628 257Q648 257 648 248Q648 243 647 239Q618 132 523 55T319 -22Q206 -22 128 53T50 252Z"></path></g></g></g><line data-line="h" class="mjx-solid" x1="0" y1="250" x2="1700" y2="250"></line><rect data-frame="true" class="mjx-solid" width="1630" height="2971" x="35" y="-1235.5"></rect></g></g></g></svg></mjx-container></span><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">A</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">B</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">C</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">D</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">3</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Another Text</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></div>'
  },
  {
    latex: '\\begin{tabular}{ |c|c|c|c|c|c| } \n' +
      '\\hline\n' +
      'col11 & col12 & col13& col14 & col15& col16 \\\\\n' +
      '\\hline\n' +
      '\\multicolumn{3}{|c|}{\\multirow[b]{5}{4em}{Multiple row with math and table \\( E=\\binom{\\kappa}{\\sigma} \\)\\begin{tabular}{l}\n' +
      '\\begin{tabular}{l}\n' +
      '\\hline\\( R \\) not \\\\\n' +
      'existing, \\end{tabular}\n' +
      '\\end{tabular}}} & cell24& col25& col26 \\\\ \n' +
      '\\multicolumn{3}{|c|}{}& cell24& col25& col26 \\\\\n' +
      '\\multicolumn{3}{|c|}{}& cell24& col25& col26 \\\\\n' +
      '\\multicolumn{3}{|c|}{}& cell24& col25& col26 \\\\\n' +
      '\\multicolumn{3}{|c|}{}& cell24& col25& col26 \\\\\\hline\n' +
      'col11 & col12 & col13& col14 & col15& col16 \\\\\\hline\n' +
      '\\end{tabular}',
    svg: '<div class="table_tabular" style="text-align: center">\n' +
      '<div class="inline-tabular"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">col11</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">col12</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">col13</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">col14</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">col15</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">col16</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; vertical-align: bottom; width: 4em; border-bottom-style: solid !important; border-bottom-width: 1px !important; " colspan="3" rowspan="5">Multiple row with math and table <span class="math-inline ">\n' +
      '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.798ex;" xmlns="http://www.w3.org/2000/svg" width="7.739ex" height="2.72ex" role="img" focusable="false" viewBox="0 -849.5 3420.8 1202.3"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="1D438" d="M492 213Q472 213 472 226Q472 230 477 250T482 285Q482 316 461 323T364 330H312Q311 328 277 192T243 52Q243 48 254 48T334 46Q428 46 458 48T518 61Q567 77 599 117T670 248Q680 270 683 272Q690 274 698 274Q718 274 718 261Q613 7 608 2Q605 0 322 0H133Q31 0 31 11Q31 13 34 25Q38 41 42 43T65 46Q92 46 125 49Q139 52 144 61Q146 66 215 342T285 622Q285 629 281 629Q273 632 228 634H197Q191 640 191 642T193 659Q197 676 203 680H757Q764 676 764 669Q764 664 751 557T737 447Q735 440 717 440H705Q698 445 698 453L701 476Q704 500 704 528Q704 558 697 578T678 609T643 625T596 632T532 634H485Q397 633 392 631Q388 629 386 622Q385 619 355 499T324 377Q347 376 372 376H398Q464 376 489 391T534 472Q538 488 540 490T557 493Q562 493 565 493T570 492T572 491T574 487T577 483L544 351Q511 218 508 216Q505 213 492 213Z"></path></g><g data-mml-node="mo" transform="translate(1041.8,0)"><path data-c="3D" d="M56 347Q56 360 70 367H707Q722 359 722 347Q722 336 708 328L390 327H72Q56 332 56 347ZM56 153Q56 168 72 173H708Q722 163 722 153Q722 140 707 133H70Q56 140 56 153Z"></path></g><g data-mml-node="mrow" transform="translate(2097.6,0)"><g data-mml-node="TeXAtom" data-mjx-texclass="OPEN"><g data-mml-node="mo" transform="translate(0 -0.5)"><path data-c="28" d="M152 251Q152 646 388 850H416Q422 844 422 841Q422 837 403 816T357 753T302 649T255 482T236 250Q236 124 255 19T301 -147T356 -251T403 -315T422 -340Q422 -343 416 -349H388Q359 -325 332 -296T271 -213T212 -97T170 56T152 251Z"></path></g></g><g data-mml-node="mfrac" transform="translate(458,0)"><g data-mml-node="mi" transform="translate(0,444) scale(0.707)"><path data-c="1D705" d="M83 -11Q70 -11 62 -4T51 8T49 17Q49 30 96 217T147 414Q160 442 193 442Q205 441 213 435T223 422T225 412Q225 401 208 337L192 270Q193 269 208 277T235 292Q252 304 306 349T396 412T467 431Q489 431 500 420T512 391Q512 366 494 347T449 327Q430 327 418 338T405 368Q405 370 407 380L397 375Q368 360 315 315L253 266L240 257H245Q262 257 300 251T366 230Q422 203 422 150Q422 140 417 114T411 67Q411 26 437 26Q484 26 513 137Q516 149 519 151T535 153Q554 153 554 144Q554 121 527 64T457 -7Q447 -10 431 -10Q386 -10 360 17T333 90Q333 108 336 122T339 146Q339 170 320 186T271 209T222 218T185 221H180L155 122Q129 22 126 16Q113 -11 83 -11Z"></path></g><g data-mml-node="mi" transform="translate(1.8,-345) scale(0.707)"><path data-c="1D70E" d="M184 -11Q116 -11 74 34T31 147Q31 247 104 333T274 430Q275 431 414 431H552Q553 430 555 429T559 427T562 425T565 422T567 420T569 416T570 412T571 407T572 401Q572 357 507 357Q500 357 490 357T476 358H416L421 348Q439 310 439 263Q439 153 359 71T184 -11ZM361 278Q361 358 276 358Q152 358 115 184Q114 180 114 178Q106 141 106 117Q106 67 131 47T188 26Q242 26 287 73Q316 103 334 153T356 233T361 278Z"></path></g></g><g data-mml-node="TeXAtom" data-mjx-texclass="CLOSE" transform="translate(865.3,0)"><g data-mml-node="mo" transform="translate(0 -0.5)"><path data-c="29" d="M305 251Q305 -145 69 -349H56Q43 -349 39 -347T35 -338Q37 -333 60 -307T108 -239T160 -136T204 27T221 250T204 473T160 636T108 740T60 807T35 839Q35 850 50 850H56H69Q197 743 256 566Q305 425 305 251Z"></path></g></g></g></g></g></svg></mjx-container></span><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; "><span class="math-inline " data-overflow="visible">\n' +
      '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.048ex;" xmlns="http://www.w3.org/2000/svg" width="1.717ex" height="1.593ex" role="img" focusable="false" viewBox="0 -683 759 704"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="1D445" d="M230 637Q203 637 198 638T193 649Q193 676 204 682Q206 683 378 683Q550 682 564 680Q620 672 658 652T712 606T733 563T739 529Q739 484 710 445T643 385T576 351T538 338L545 333Q612 295 612 223Q612 212 607 162T602 80V71Q602 53 603 43T614 25T640 16Q668 16 686 38T712 85Q717 99 720 102T735 105Q755 105 755 93Q755 75 731 36Q693 -21 641 -21H632Q571 -21 531 4T487 82Q487 109 502 166T517 239Q517 290 474 313Q459 320 449 321T378 323H309L277 193Q244 61 244 59Q244 55 245 54T252 50T269 48T302 46H333Q339 38 339 37T336 19Q332 6 326 0H311Q275 2 180 2Q146 2 117 2T71 2T50 1Q33 1 33 10Q33 12 36 24Q41 43 46 45Q50 46 61 46H67Q94 46 127 49Q141 52 146 61Q149 65 218 339T287 628Q287 635 230 637ZM630 554Q630 586 609 608T523 636Q521 636 500 636T462 637H440Q393 637 386 627Q385 624 352 494T319 361Q319 360 388 360Q466 361 492 367Q556 377 592 426Q608 449 619 486T630 554Z"></path></g></g></g></svg></mjx-container></span> not</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">existing,</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">cell24</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">col25</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">col26</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">cell24</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">col25</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">col26</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">cell24</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">col25</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">col26</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">cell24</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">col25</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">col26</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">cell24</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">col25</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">col26</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">col11</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">col12</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">col13</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">col14</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">col15</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">col16</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></div>'
  },
  {
    latex: '\\begin{tabular}{|c|c|}\n' +
      '\\hline \\multirow{8}{*}{\\multicolumn{2}{|c|}{\\begin{tabular}{l} \n' +
      'Average Price of plots sold per \\\\\n' +
      'square meter (USD)\n' +
      '\\end{tabular}}} \\\\\n' +
      '\\hline & \\\\\n' +
      '\\hline & \\\\\n' +
      '\\hline & \\\\\n' +
      '\\hline & \\\\\n' +
      '\\hline & \\\\\n' +
      '\\hline & \\\\\n' +
      '\\hline & \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    svg: '<div class="table_tabular" style="text-align: center">\n' +
      '<div class="inline-tabular"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; " colspan="2" rowspan="8"><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Average Price of plots sold per</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">square meter (USD)</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;"></tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;"></tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;"></tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;"></tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;"></tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;"></tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;"></tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></div>'
  },
  {
    latex: '\\begin{tabular}{|cc|c|}\n' +
      '\\hline\n' +
      '\\multicolumn{2}{|c|}{\\multirow{2}{*}{\\begin{tabular}{l}\n' +
      'First line \\\\ \n' +
      'second line1 \\\\\n' +
      '\\end{tabular}\\begin{tabular}{l}\n' +
      'First line \\\\ \n' +
      'second line2 \\\\\n' +
      '\\end{tabular}}} & {{\\begin{tabular}{l}\n' +
      'First line \\\\ \n' +
      'second line3 \\\\\n' +
      '\\end{tabular}} \\\\\n' +
      '\\cline{3-3}\n' +
      ' &  &  \\\\\n' +
      '\\hline\n' +
      '\\multicolumn{1}{|c|}{4} & 5 & 6 \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    svg: '<div class="table_tabular" style="text-align: center">\n' +
      '<div class="inline-tabular"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; border-top-style: solid !important; border-top-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; " colspan="2" rowspan="2"><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">First line</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">second line1</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">First line</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">second line2</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">{<div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">First line</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">second line3</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; " class="_empty"></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; " colspan="1">4</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">5</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">6</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></div>'
  },
  {
    latex: '\\begin{tabular}{|c|c|c|c|c|c|c|c|}\n' +
      '\\hline & & & & \\multirow[b]{2}{*}{\\multicolumn{3}{|l|}{ Species origin }} & \\\\\n' +
      '\\hline Island & Project & Zone & Substrate & & & & Total Species \\\\\n' +
      '\\hline \\multirow{2}{*}{ Baltra } & \\multirow{2}{*}{\\begin{tabular}{l} \n' +
      'Ecological \\\\\n' +
      'restoration\n' +
      '\\end{tabular}} & Arid & Clay & 2 & 4 & 0 & 6 \\\\\n' +
      '\\hline & & Littoral & Clay & 0 & 1 & 0 & 1 \\\\\n' +
      '\\hline \\multirow{17}{*}{ Floreana } & \\multirow{8}{*}{\\begin{tabular}{l} \n' +
      'Sustainable \\\\\n' +
      'agriculture\n' +
      '\\end{tabular}} & \\multirow{6}{*}{ Arid } & Clay & 0 & 0 & 13 & 13 \\\\\n' +
      '\\hline & & & Humus & 0 & 0 & 6 & 6 \\\\\n' +
      '\\hline & & & Humus-clay & 0 & 0 & 15 & 15 \\\\\n' +
      '\\hline & & & Humus-rocky & 0 & 0 & 8 & 8 \\\\\n' +
      '\\hline & & & Rocky & 0 & 0 & 3 & 3 \\\\\n' +
      '\\hline & & & Rocky-clay & 0 & 0 & 6 & 6 \\\\\n' +
      '\\hline & & \\multirow{2}{*}{ Humid } & Clay & 0 & 0 & 1 & 1 \\\\\n' +
      '\\hline & & & Humus & 0 & 0 & 6 & 6 \\\\\n' +
      '\\hline & \\multirow{9}{*}{\\begin{tabular}{l} \n' +
      'Ecological \\\\\n' +
      'restoration\n' +
      '\\end{tabular}} & Arid & Clay & 5 & 4 & 0 & 9 \\\\\n' +
      '\\hline & & \\multirow{6}{*}{ Humid } & Humus & 0 & 1 & 0 & 1 \\\\\n' +
      '\\hline & & & Humus-clay & 1 & 1 & 0 & 2 \\\\\n' +
      '\\hline & & & Humus-rocky & 2 & 4 & 0 & 6 \\\\\n' +
      '\\hline & & & Rocky-clay & 0 & 1 & 0 & 1 \\\\\n' +
      '\\hline & & & Humus & 3 & 5 & 0 & 8 \\\\\n' +
      '\\hline & & & Humus-rocky & 2 & 4 & 0 & 6 \\\\\n' +
      '\\hline & & \\multirow{2}{*}{ Littoral } & Clay & 2 & 1 & 0 & 3 \\\\\n' +
      '\\hline & & & Rocky-clay & 2 & 2 & 0 & 4 \\\\\n' +
      '\\hline \\multirow{9}{*}{ Santa Cruz } & \\multirow{3}{*}{\\begin{tabular}{l} \n' +
      'Sustainable \\\\\n' +
      'agriculture\n' +
      '\\end{tabular}} & \\multirow{3}{*}{ Transition } & Clay & 0 & 0 & 2 & 2 \\\\\n' +
      '\\hline & & & Humus & 0 & 0 & 1 & 1 \\\\\n' +
      '\\hline & & & Humus-rocky & 0 & 0 & 1 & 1 \\\\\n' +
      '\\hline & \\multirow{6}{*}{\\begin{tabular}{l} \n' +
      'Ecological \\\\\n' +
      'restoration\n' +
      '\\end{tabular}} & Humid & Humus & 0 & 4 & 0 & 4 \\\\\n' +
      '\\hline & & \\multirow{5}{*}{ Littoral } & Clay & 3 & 0 & 0 & 3 \\\\\n' +
      '\\hline & & & Sandy & 3 & 4 & 0 & 7 \\\\\n' +
      '\\hline & & & Humus & 2 & 1 & 0 & 3 \\\\\n' +
      '\\hline & & & Rocky & 2 & 1 & 0 & 3 \\\\\n' +
      '\\hline & & & Rocky-sandy & 2 & 1 & 0 & 3 \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    svg: '<div class="table_tabular" style="text-align: center">\n' +
      '<div class="inline-tabular"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; " class="_empty"></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; " class="_empty"></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; " class="_empty"></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; " class="_empty"></td>\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; vertical-align: bottom; width: auto; border-top-style: solid !important; border-top-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; " colspan="3" rowspan="2">Species origin</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; " class="_empty"></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Island</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Project</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Zone</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Substrate</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Total Species</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; border-bottom-style: solid !important; border-bottom-width: 1px !important; " rowspan="2">Baltra</td>\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; border-bottom-style: solid !important; border-bottom-width: 1px !important; " rowspan="2"><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Ecological</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">restoration</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Arid</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Clay</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">2</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">4</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">6</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Littoral</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Clay</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; border-bottom-style: solid !important; border-bottom-width: 1px !important; " rowspan="17">Floreana</td>\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; border-bottom-style: solid !important; border-bottom-width: 1px !important; " rowspan="8"><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Sustainable</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">agriculture</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; border-bottom-style: solid !important; border-bottom-width: 1px !important; " rowspan="6">Arid</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Clay</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">13</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">13</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Humus</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">6</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">6</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Humus-clay</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">15</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">15</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Humus-rocky</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">8</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">8</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Rocky</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">3</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">3</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Rocky-clay</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">6</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">6</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; border-bottom-style: solid !important; border-bottom-width: 1px !important; " rowspan="2">Humid</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Clay</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Humus</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">6</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">6</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; border-bottom-style: solid !important; border-bottom-width: 1px !important; " rowspan="9"><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Ecological</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">restoration</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Arid</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Clay</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">5</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">4</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">9</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; border-bottom-style: solid !important; border-bottom-width: 1px !important; " rowspan="6">Humid</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Humus</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Humus-clay</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">2</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Humus-rocky</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">2</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">4</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">6</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Rocky-clay</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Humus</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">3</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">5</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">8</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Humus-rocky</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">2</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">4</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">6</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; border-bottom-style: solid !important; border-bottom-width: 1px !important; " rowspan="2">Littoral</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Clay</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">2</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">3</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Rocky-clay</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">2</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">2</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">4</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; " rowspan="9">Santa Cruz</td>\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; border-bottom-style: solid !important; border-bottom-width: 1px !important; " rowspan="3"><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Sustainable</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">agriculture</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; border-bottom-style: solid !important; border-bottom-width: 1px !important; " rowspan="3">Transition</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Clay</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">2</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">2</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Humus</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Humus-rocky</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; " rowspan="6"><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Ecological</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">restoration</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Humid</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Humus</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">4</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">4</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; " rowspan="5">Littoral</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Clay</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">3</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">3</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Sandy</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">3</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">4</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">7</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Humus</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">2</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">3</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Rocky</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">2</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">3</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Rocky-sandy</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">2</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">0</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">3</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></div>'
  },
  {
    latex: '|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||\n' +
      'NV01-W9C8-D7V7-292V\n' +
      '\\begin{tabular}{|c|c|c|c|c|c|c|c|c|c|c|c|c|c|}\n' +
      '\\hline \\multirow{2}{*}{\\multicolumn{5}{|c|}{ COPIE DU REGISTRE D\'IDENTITÉ }} & \\multicolumn{2}{|l|}{ PROVINCE } & \\multicolumn{2}{|l|}{ QUARTIER } & \\multicolumn{2}{|l|}{ QUARTIER/VILLAGE } & \\multirow{2}{*}{\\begin{tabular}{l}\n' +
      '$\\frac{\\text { VOLUME }}{N^{\\circ} 5}$\n' +
      '\\end{tabular}} & \\multicolumn{2}{|l|}{ EXERCICE } \\\\\n' +
      '\\hline & & & & & \\multicolumn{2}{|l|}{ ERZURUM } & \\multicolumn{2}{|l|}{ KARAYAZI (1444) } & \\multicolumn{2}{|l|}{ AKARSUMA } & & & ค8 8 \\\\\n' +
      '\\hline SEL & B.Sc. & C & \\begin{tabular}{l} \n' +
      'CONFIANT \\\\\n' +
      'DEGRÉ\n' +
      '\\end{tabular} & T.C. KİMLİK NON & NOM & noM De Familie & NOM DU PÊRE & ANA ADI & \\begin{tabular}{l} \n' +
      'LIEU DE NAISSANCE ET \\\\\n' +
      'DATE\n' +
      '\\end{tabular} & \\begin{tabular}{l} \n' +
      'ÉTAT MED. ET \\\\\n' +
      'RELI\n' +
      '\\end{tabular} & \\begin{tabular}{l} \n' +
      'INSCRIPTION \\\\\n' +
      'DATE\n' +
      '\\end{tabular} & & \\begin{tabular}{l} \n' +
      'MENTS ET \\\\\n' +
      'S\n' +
      '\\end{tabular} \\\\\n' +
      '\\hline 1 & 18 & K & Lui-même & 12818143008 & ZINNET & SRO & HUSSEIN & CEVAHIR & \\begin{tabular}{l}\n' +
      '\\begin{tabular}{l}\n' +
      '\\hline KARAYAZI \\\\\n' +
      '20.05 .1951\n' +
      '\\end{tabular}\n' +
      '\\end{tabular} & \\begin{tabular}{l} \n' +
      'Aller \\\\\n' +
      'Islam\n' +
      '\\end{tabular} & 15.06.1956 & \\begin{tabular}{l} \n' +
      'La mort: \\\\\n' +
      'Mariage : \\\\\n' +
      'Divorce :\n' +
      '\\end{tabular} & \\begin{tabular}{l} \n' +
      'DROITE \\\\\n' +
      '21.05.1986\n' +
      '\\end{tabular} \\\\\n' +
      '\\hline 2 & 4 & ET & $\\substack{\\text { epou } \\\\\n' +
      '\\text { se }}$ & 12845142142 & ABDULBAKI & SRO & SULLEIMAN & HANIM & \\begin{tabular}{l}\n' +
      '\\begin{tabular}{c} \n' +
      'HINIS \\\\\n' +
      '02.03 .1944\n' +
      '\\end{tabular}\n' +
      '\\end{tabular} & \\begin{tabular}{l} \n' +
      'Marié \\\\\n' +
      'Islam\n' +
      '\\end{tabular} & 04.04.1946 & \\begin{tabular}{l} \n' +
      'Décès : \\\\\n' +
      'Mariage : \\\\\n' +
      'Divorce :\n' +
      '\\end{tabular} & \\begin{tabular}{l}\n' +
      '\\begin{tabular}{l}\n' +
      '13.12 .2011 \\\\\n' +
      '21.05.1986 \\\\\n' +
      '------\n' +
      '\\end{tabular}\n' +
      '\\end{tabular} \\\\\n' +
      '\\hline 3 & 19 & Et & Son fils & 12815143162 & MAHFUZ & SRO & ABDULBAKI & ZINNET & \\begin{tabular}{l} \n' +
      'KARAYAZI \\\\\n' +
      '12.07.1974\n' +
      '\\end{tabular} & \\begin{tabular}{l} \n' +
      'Marié \\\\\n' +
      'Islam\n' +
      '\\end{tabular} & 21.05.1986 & \\begin{tabular}{l} \n' +
      'Décès : \\\\\n' +
      'Mariage : \\\\\n' +
      'Divorce :\n' +
      '\\end{tabular} & \\begin{tabular}{l} \n' +
      'DROITE \\\\\n' +
      '17.02.1999 \\\\\n' +
      'DPOITE\n' +
      '\\end{tabular} \\\\\n' +
      '\\hline 4 & 20 & Et & Son fils & 12812143226 & FIKRET & SRO & ABDULBAKI & ZINNET & \\begin{tabular}{l} \n' +
      'KARAYAZI \\\\\n' +
      '11.07.1975\n' +
      '\\end{tabular} & \\begin{tabular}{l} \n' +
      'Marié \\\\\n' +
      'Islam\n' +
      '\\end{tabular} & 21.05.1986 & \\begin{tabular}{l} \n' +
      'Décès : \\\\\n' +
      'Mariage : \\\\\n' +
      'Divorce:\n' +
      '\\end{tabular} & \\begin{tabular}{l} \n' +
      '17.03.1999 \\\\\n' +
      'INSCRIPTI\n' +
      '\\end{tabular} \\\\\n' +
      '\\hline 5 & 21 & K & fille & 31126531888 & DIT & SRO & ABDULBAKI & ZINNET & \\begin{tabular}{l} \n' +
      'KARAYAZI \\\\\n' +
      '06.07.1980\n' +
      '\\end{tabular} & \\begin{tabular}{l} \n' +
      'Marié \\\\\n' +
      'Islam\n' +
      '\\end{tabular} & 21.05.1986 & \\begin{tabular}{l} \n' +
      'La mort: \\\\\n' +
      'Mariage: \\\\\n' +
      'Divorce:\n' +
      '\\end{tabular} & \\begin{tabular}{l} \n' +
      'ON FERMÉE \\\\\n' +
      '18.09.1997 \\\\\n' +
      'DROITE\n' +
      '\\end{tabular} \\\\\n' +
      '\\hline 6 & 22 & ET & Son fils & 12809143390 & ERKAN & SRO & ABDULBAKI & ZINNET & \\begin{tabular}{l} \n' +
      'KARAYAZI \\\\\n' +
      '05.06.1981\n' +
      '\\end{tabular} & \\begin{tabular}{l} \n' +
      'Marié \\\\\n' +
      'Islam\n' +
      '\\end{tabular} & 21.05.1986 & \\begin{tabular}{l} \n' +
      'La mort: \\\\\n' +
      'Mariage : \\\\\n' +
      'Divorce:\n' +
      '\\end{tabular} & \\begin{tabular}{l} \n' +
      '13.01.2011 \\\\\n' +
      'DROITE\n' +
      '\\end{tabular} \\\\\n' +
      '\\hline 7 & 28 & Et & Son fils & 12797143778 & SÉDAT & SRO & ABDULBAKI & ZINNET & \\begin{tabular}{l} \n' +
      'KARAYAZI \\\\\n' +
      '10.10 .1985\n' +
      '\\end{tabular} & \\begin{tabular}{l} \n' +
      'Marié \\\\\n' +
      'Islam\n' +
      '\\end{tabular} & 23.09.1991 & \\begin{tabular}{l} \n' +
      'La mort: \\\\\n' +
      'Mariage : \\\\\n' +
      'Divorce:\n' +
      '\\end{tabular} & \\begin{tabular}{l}\n' +
      '20.02 .2008 \\\\\n' +
      'INSCRIPTI \\\\\n' +
      'ON FERMÉE\n' +
      '\\end{tabular} \\\\\n' +
      '\\hline 8 & 38 & K & fille & 12767144798 & PROVINCE & SRO & ABDULBAKI & ZINNET & \\begin{tabular}{l} \n' +
      'KARAYAZI \\\\\n' +
      '20.11.1978\n' +
      '\\end{tabular} & \\begin{tabular}{l} \n' +
      'Marié \\\\\n' +
      'Islam\n' +
      '\\end{tabular} & 17.10.1994 & \\begin{tabular}{l} \n' +
      'La mort: \\\\\n' +
      'Mariage: \\\\\n' +
      'Divorce: \\\\\n' +
      'ta mort\n' +
      '\\end{tabular} & \\begin{tabular}{l} \n' +
      '10.03.2001 \\\\\n' +
      'DROITE \\\\\n' +
      '01.06.2016\n' +
      '\\end{tabular} \\\\\n' +
      '\\hline 9 & 39 & ET & Son fils & 12764144852 & UNIVERS & SRO & ABDULBAKI & ZINNET & \\begin{tabular}{l} \n' +
      'KARAYAZI \\\\\n' +
      '01.10.1994\n' +
      '\\end{tabular} & \\begin{tabular}{l} \n' +
      'Marié \\\\\n' +
      'Islam\n' +
      '\\end{tabular} & 17.10.1994 & \\begin{tabular}{l} \n' +
      'Mariage : \\\\\n' +
      'Divorce:\n' +
      '\\end{tabular} & \\begin{tabular}{l} \n' +
      '14.05.2012\n' +
      '\\end{tabular} \\\\\n' +
      '\\hline 10 & 40 & K & fille & 12761144916 & GENTilLESSE & SRO & ABDULBAKI & ZINNET & \\begin{tabular}{l} \n' +
      'KARAYAZI \\\\\n' +
      '01.10.1994\n' +
      '\\end{tabular} & \\begin{tabular}{l} \n' +
      'Islam \\\\\n' +
      'unique\n' +
      '\\end{tabular} & 17.10.1994 & \\begin{tabular}{l} \n' +
      'La mort: \\\\\n' +
      'Mariage : \\\\\n' +
      'Divorce:\n' +
      '\\end{tabular} & \\begin{tabular}{l} \n' +
      'INSCRIPTI \\\\\n' +
      'ON FERMÉE \\\\\n' +
      '09.05 .2007\n' +
      '\\end{tabular} \\\\\n' +
      '\\hline 11 & 56 & K & fille & 10841210322 & NOURAN & SRO & ABDULBAKI & ZINNET & \\begin{tabular}{l} \n' +
      'KARAYAZI \\\\\n' +
      '20.09.1988\n' +
      '\\end{tabular} & \\begin{tabular}{l} \n' +
      'Marié \\\\\n' +
      'Islam\n' +
      '\\end{tabular} & 22.09.2005 & \\begin{tabular}{l} \n' +
      'La mort: \\\\\n' +
      'Mariage: \\\\\n' +
      'Divorce:\n' +
      '\\end{tabular} & \\\\\n' +
      '\\hline\n' +
      '\\end{tabular}',
    svg: '<div>|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||<br>\n' +
      'NV01-W9C8-D7V7-292V</div>\n' +
      '<div class="table_tabular" style="text-align: center">\n' +
      '<div class="inline-tabular"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; border-top-style: solid !important; border-top-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; " colspan="5" rowspan="2">COPIE DU REGISTRE D\'IDENTITÉ</td>\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; border-top-style: solid !important; border-top-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; " colspan="2">PROVINCE</td>\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; border-top-style: solid !important; border-top-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; " colspan="2">QUARTIER</td>\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; border-top-style: solid !important; border-top-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; " colspan="2">QUARTIER/VILLAGE</td>\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; border-top-style: solid !important; border-top-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; " rowspan="2"><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; "><span class="math-inline ">\n' +
      '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.816ex;" xmlns="http://www.w3.org/2000/svg" width="8.996ex" height="2.835ex" role="img" focusable="false" viewBox="0 -892.5 3976.2 1253.1"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mfrac"><g data-mml-node="mtext" transform="translate(220,394) scale(0.707)"><path data-c="A0" d=""></path><path data-c="56" d="M114 620Q113 621 110 624T107 627T103 630T98 632T91 634T80 635T67 636T48 637H19V683H28Q46 680 152 680Q273 680 294 683H305V637H284Q223 634 223 620Q223 618 313 372T404 126L490 358Q575 588 575 597Q575 616 554 626T508 637H503V683H512Q527 680 627 680Q718 680 724 683H730V637H723Q648 637 627 596Q627 595 515 291T401 -14Q396 -22 382 -22H374H367Q353 -22 348 -14Q346 -12 231 303Q114 617 114 620Z" transform="translate(250,0)"></path><path data-c="4F" d="M56 340Q56 423 86 494T164 610T270 680T388 705Q521 705 621 601T722 341Q722 260 693 191T617 75T510 4T388 -22T267 3T160 74T85 189T56 340ZM467 647Q426 665 388 665Q360 665 331 654T269 620T213 549T179 439Q174 411 174 354Q174 144 277 61Q327 20 385 20H389H391Q474 20 537 99Q603 188 603 354Q603 411 598 439Q577 592 467 647Z" transform="translate(1000,0)"></path><path data-c="4C" d="M128 622Q121 629 117 631T101 634T58 637H25V683H36Q48 680 182 680Q324 680 348 683H360V637H333Q273 637 258 635T233 622L232 342V129Q232 57 237 52Q243 47 313 47Q384 47 410 53Q470 70 498 110T536 221Q536 226 537 238T540 261T542 272T562 273H582V268Q580 265 568 137T554 5V0H25V46H58Q100 47 109 49T128 61V622Z" transform="translate(1778,0)"></path><path data-c="55" d="M128 622Q121 629 117 631T101 634T58 637H25V683H36Q57 680 180 680Q315 680 324 683H335V637H302Q262 636 251 634T233 622L232 418V291Q232 189 240 145T280 67Q325 24 389 24Q454 24 506 64T571 183Q575 206 575 410V598Q569 608 565 613T541 627T489 637H472V683H481Q496 680 598 680T715 683H724V637H707Q634 633 622 598L621 399Q620 194 617 180Q617 179 615 171Q595 83 531 31T389 -22Q304 -22 226 33T130 192Q129 201 128 412V622Z" transform="translate(2403,0)"></path><path data-c="4D" d="M132 622Q125 629 121 631T105 634T62 637H29V683H135Q221 683 232 682T249 675Q250 674 354 398L458 124L562 398Q666 674 668 675Q671 681 683 682T781 683H887V637H854Q814 636 803 634T785 622V61Q791 51 802 49T854 46H887V0H876Q855 3 736 3Q605 3 596 0H585V46H618Q660 47 669 49T688 61V347Q688 424 688 461T688 546T688 613L687 632Q454 14 450 7Q446 1 430 1T410 7Q409 9 292 316L176 624V606Q175 588 175 543T175 463T175 356L176 86Q187 50 261 46H278V0H269Q254 3 154 3Q52 3 37 0H29V46H46Q78 48 98 56T122 69T132 86V622Z" transform="translate(3153,0)"></path><path data-c="45" d="M128 619Q121 626 117 628T101 631T58 634H25V680H597V676Q599 670 611 560T625 444V440H585V444Q584 447 582 465Q578 500 570 526T553 571T528 601T498 619T457 629T411 633T353 634Q266 634 251 633T233 622Q233 622 233 621Q232 619 232 497V376H286Q359 378 377 385Q413 401 416 469Q416 471 416 473V493H456V213H416V233Q415 268 408 288T383 317T349 328T297 330Q290 330 286 330H232V196V114Q232 57 237 52Q243 47 289 47H340H391Q428 47 452 50T505 62T552 92T584 146Q594 172 599 200T607 247T612 270V273H652V270Q651 267 632 137T610 3V0H25V46H58Q100 47 109 49T128 61V619Z" transform="translate(4070,0)"></path><path data-c="A0" d="" transform="translate(4751,0)"></path></g><g data-mml-node="mrow" transform="translate(1323.9,-345) scale(0.707)"><g data-mml-node="msup"><g data-mml-node="mi"><path data-c="1D441" d="M234 637Q231 637 226 637Q201 637 196 638T191 649Q191 676 202 682Q204 683 299 683Q376 683 387 683T401 677Q612 181 616 168L670 381Q723 592 723 606Q723 633 659 637Q635 637 635 648Q635 650 637 660Q641 676 643 679T653 683Q656 683 684 682T767 680Q817 680 843 681T873 682Q888 682 888 672Q888 650 880 642Q878 637 858 637Q787 633 769 597L620 7Q618 0 599 0Q585 0 582 2Q579 5 453 305L326 604L261 344Q196 88 196 79Q201 46 268 46H278Q284 41 284 38T282 19Q278 6 272 0H259Q228 2 151 2Q123 2 100 2T63 2T46 1Q31 1 31 10Q31 14 34 26T39 40Q41 46 62 46Q130 49 150 85Q154 91 221 362L289 634Q287 635 234 637Z"></path></g><g data-mml-node="TeXAtom" transform="translate(975.3,289) scale(0.707)" data-mjx-texclass="ORD"><g data-mml-node="mo"><path data-c="2218" d="M55 251Q55 328 112 386T249 444T386 388T444 249Q444 171 388 113T250 55Q170 55 113 112T55 251ZM245 403Q188 403 142 361T96 250Q96 183 141 140T250 96Q284 96 313 109T354 135T375 160Q403 197 403 250Q403 313 360 358T245 403Z"></path></g></g></g><g data-mml-node="mn" transform="translate(1378.8,0)"><path data-c="35" d="M164 157Q164 133 148 117T109 101H102Q148 22 224 22Q294 22 326 82Q345 115 345 210Q345 313 318 349Q292 382 260 382H254Q176 382 136 314Q132 307 129 306T114 304Q97 304 95 310Q93 314 93 485V614Q93 664 98 664Q100 666 102 666Q103 666 123 658T178 642T253 634Q324 634 389 662Q397 666 402 666Q410 666 410 648V635Q328 538 205 538Q174 538 149 544L139 546V374Q158 388 169 396T205 412T256 420Q337 420 393 355T449 201Q449 109 385 44T229 -22Q148 -22 99 32T50 154Q50 178 61 192T84 210T107 214Q132 214 148 197T164 157Z"></path></g></g><rect width="3736.2" height="60" x="120" y="220"></rect></g></g></g></svg></mjx-container></span></td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; border-top-style: solid !important; border-top-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; " colspan="2">EXERCICE</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; " colspan="2">ERZURUM</td>\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; " colspan="2">KARAYAZI (1444)</td>\n' +
      '<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; " colspan="2">AKARSUMA</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; " class="_empty"></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">ค8 8</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">SEL</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">B.Sc.</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">C</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">CONFIANT</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">DEGRÉ</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">T.C. KİMLİK NON</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">NOM</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">noM De Familie</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">NOM DU PÊRE</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">ANA ADI</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">LIEU DE NAISSANCE ET</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">DATE</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">ÉTAT MED. ET</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">RELI</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">INSCRIPTION</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">DATE</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; " class="_empty"></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">MENTS ET</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">S</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">1</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">18</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">K</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Lui-même</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">12818143008</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">ZINNET</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">SRO</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">HUSSEIN</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">CEVAHIR</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">KARAYAZI</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">20.05 .1951</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Aller</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Islam</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">15.06.1956</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">La mort:</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Mariage :</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Divorce :</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">DROITE</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">21.05.1986</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">2</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">4</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">ET</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><span class="math-inline ">\n' +
      '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.428ex;" xmlns="http://www.w3.org/2000/svg" width="4.089ex" height="1.988ex" role="img" focusable="false" viewBox="0 -689.3 1807.4 878.5"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mtable"><g data-mml-node="mtr" transform="translate(0,372.5) scale(0.707)"><g data-mml-node="mtd"><g data-mml-node="mtext"><path data-c="A0" d=""></path><path data-c="65" d="M28 218Q28 273 48 318T98 391T163 433T229 448Q282 448 320 430T378 380T406 316T415 245Q415 238 408 231H126V216Q126 68 226 36Q246 30 270 30Q312 30 342 62Q359 79 369 104L379 128Q382 131 395 131H398Q415 131 415 121Q415 117 412 108Q393 53 349 21T250 -11Q155 -11 92 58T28 218ZM333 275Q322 403 238 411H236Q228 411 220 410T195 402T166 381T143 340T127 274V267H333V275Z" transform="translate(250,0)"></path><path data-c="70" d="M36 -148H50Q89 -148 97 -134V-126Q97 -119 97 -107T97 -77T98 -38T98 6T98 55T98 106Q98 140 98 177T98 243T98 296T97 335T97 351Q94 370 83 376T38 385H20V408Q20 431 22 431L32 432Q42 433 61 434T98 436Q115 437 135 438T165 441T176 442H179V416L180 390L188 397Q247 441 326 441Q407 441 464 377T522 216Q522 115 457 52T310 -11Q242 -11 190 33L182 40V-45V-101Q182 -128 184 -134T195 -145Q216 -148 244 -148H260V-194H252L228 -193Q205 -192 178 -192T140 -191Q37 -191 28 -194H20V-148H36ZM424 218Q424 292 390 347T305 402Q234 402 182 337V98Q222 26 294 26Q345 26 384 80T424 218Z" transform="translate(694,0)"></path><path data-c="6F" d="M28 214Q28 309 93 378T250 448Q340 448 405 380T471 215Q471 120 407 55T250 -10Q153 -10 91 57T28 214ZM250 30Q372 30 372 193V225V250Q372 272 371 288T364 326T348 362T317 390T268 410Q263 411 252 411Q222 411 195 399Q152 377 139 338T126 246V226Q126 130 145 91Q177 30 250 30Z" transform="translate(1250,0)"></path><path data-c="75" d="M383 58Q327 -10 256 -10H249Q124 -10 105 89Q104 96 103 226Q102 335 102 348T96 369Q86 385 36 385H25V408Q25 431 27 431L38 432Q48 433 67 434T105 436Q122 437 142 438T172 441T184 442H187V261Q188 77 190 64Q193 49 204 40Q224 26 264 26Q290 26 311 35T343 58T363 90T375 120T379 144Q379 145 379 161T380 201T380 248V315Q380 361 370 372T320 385H302V431Q304 431 378 436T457 442H464V264Q464 84 465 81Q468 61 479 55T524 46H542V0Q540 0 467 -5T390 -11H383V58Z" transform="translate(1750,0)"></path><path data-c="A0" d="" transform="translate(2306,0)"></path></g></g></g><g data-mml-node="mtr" transform="translate(0,-181.5) scale(0.707)"><g data-mml-node="mtd" transform="translate(609,0)"><g data-mml-node="mtext"><path data-c="A0" d=""></path><path data-c="73" d="M295 316Q295 356 268 385T190 414Q154 414 128 401Q98 382 98 349Q97 344 98 336T114 312T157 287Q175 282 201 278T245 269T277 256Q294 248 310 236T342 195T359 133Q359 71 321 31T198 -10H190Q138 -10 94 26L86 19L77 10Q71 4 65 -1L54 -11H46H42Q39 -11 33 -5V74V132Q33 153 35 157T45 162H54Q66 162 70 158T75 146T82 119T101 77Q136 26 198 26Q295 26 295 104Q295 133 277 151Q257 175 194 187T111 210Q75 227 54 256T33 318Q33 357 50 384T93 424T143 442T187 447H198Q238 447 268 432L283 424L292 431Q302 440 314 448H322H326Q329 448 335 442V310L329 304H301Q295 310 295 316Z" transform="translate(250,0)"></path><path data-c="65" d="M28 218Q28 273 48 318T98 391T163 433T229 448Q282 448 320 430T378 380T406 316T415 245Q415 238 408 231H126V216Q126 68 226 36Q246 30 270 30Q312 30 342 62Q359 79 369 104L379 128Q382 131 395 131H398Q415 131 415 121Q415 117 412 108Q393 53 349 21T250 -11Q155 -11 92 58T28 218ZM333 275Q322 403 238 411H236Q228 411 220 410T195 402T166 381T143 340T127 274V267H333V275Z" transform="translate(644,0)"></path><path data-c="A0" d="" transform="translate(1088,0)"></path></g></g></g></g></g></g></svg></mjx-container></span></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">12845142142</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">ABDULBAKI</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">SRO</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">SULLEIMAN</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">HANIM</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">HINIS</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">02.03 .1944</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Marié</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Islam</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">04.04.1946</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Décès :</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Mariage :</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Divorce :</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">13.12 .2011</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">21.05.1986</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">------</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">3</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">19</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Et</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Son fils</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">12815143162</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">MAHFUZ</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">SRO</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">ABDULBAKI</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">ZINNET</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">KARAYAZI</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">12.07.1974</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Marié</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Islam</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">21.05.1986</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Décès :</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Mariage :</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Divorce :</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">DROITE</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">17.02.1999</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">DPOITE</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">4</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">20</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Et</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Son fils</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">12812143226</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">FIKRET</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">SRO</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">ABDULBAKI</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">ZINNET</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">KARAYAZI</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">11.07.1975</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Marié</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Islam</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">21.05.1986</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Décès :</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Mariage :</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Divorce:</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">17.03.1999</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">INSCRIPTI</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">5</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">21</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">K</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">fille</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">31126531888</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">DIT</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">SRO</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">ABDULBAKI</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">ZINNET</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">KARAYAZI</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">06.07.1980</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Marié</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Islam</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">21.05.1986</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">La mort:</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Mariage:</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Divorce:</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">ON FERMÉE</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">18.09.1997</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">DROITE</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">6</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">22</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">ET</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Son fils</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">12809143390</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">ERKAN</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">SRO</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">ABDULBAKI</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">ZINNET</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">KARAYAZI</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">05.06.1981</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Marié</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Islam</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">21.05.1986</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">La mort:</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Mariage :</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Divorce:</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">13.01.2011</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">DROITE</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">7</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">28</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Et</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Son fils</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">12797143778</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">SÉDAT</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">SRO</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">ABDULBAKI</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">ZINNET</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">KARAYAZI</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">10.10 .1985</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Marié</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Islam</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">23.09.1991</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">La mort:</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Mariage :</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Divorce:</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">20.02 .2008</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">INSCRIPTI</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">ON FERMÉE</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">8</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">38</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">K</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">fille</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">12767144798</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">PROVINCE</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">SRO</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">ABDULBAKI</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">ZINNET</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">KARAYAZI</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">20.11.1978</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Marié</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Islam</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">17.10.1994</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">La mort:</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Mariage:</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Divorce:</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">ta mort</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">10.03.2001</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">DROITE</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">01.06.2016</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">9</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">39</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">ET</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">Son fils</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">12764144852</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">UNIVERS</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">SRO</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">ABDULBAKI</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">ZINNET</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">KARAYAZI</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">01.10.1994</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Marié</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Islam</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">17.10.1994</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Mariage :</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Divorce:</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">14.05.2012</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">10</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">40</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">K</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">fille</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">12761144916</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">GENTilLESSE</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">SRO</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">ABDULBAKI</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">ZINNET</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">KARAYAZI</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">01.10.1994</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Islam</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">unique</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">17.10.1994</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">La mort:</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Mariage :</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Divorce:</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">INSCRIPTI</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">ON FERMÉE</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">09.05 .2007</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">11</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">56</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">K</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">fille</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">10841210322</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">NOURAN</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">SRO</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">ABDULBAKI</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">ZINNET</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">KARAYAZI</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">20.09.1988</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Marié</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Islam</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">22.09.2005</td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">\n' +
      '<tbody>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">La mort:</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Mariage:</td>\n' +
      '</tr>\n' +
      '<tr style="border-top: none !important; border-bottom: none !important;">\n' +
      '<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">Divorce:</td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></td>\n' +
      '<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; " class="_empty"></td>\n' +
      '</tr>\n' +
      '</tbody>\n' +
      '</table>\n' +
      '</div></div>'
  }
];
