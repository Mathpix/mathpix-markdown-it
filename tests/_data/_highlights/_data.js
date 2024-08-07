module.exports = [
  {
    content: 'When the target variable that we\'re trying to predict is continuous, such as in our housing example, we call the learning problem a regression problem.',
    highlights: [ 
      {
        start:10,end:50,
        highlight_color: 'var(--textHighlightColor)',
        text_color: 'var(--darkTextColor)',
      },
      {
        start:60,end:70,
        highlight_color: 'var(--textHighlightColor)',
        text_color: 'var(--darkTextColor)',
      },
      {
        start:80,end:90,
        highlight_color: 'var(--textHighlightColor)',
        text_color: 'var(--darkTextColor)',
      },
      {
        start:9,end:60,
        highlight_color: 'var(--textHighlightColor)',
        text_color: 'var(--darkTextColor)',
      },
      {
        start:91,end:100,
        highlight_color: 'var(--textHighlightColor)',
        text_color: 'var(--darkTextColor)',
      },
      {
        start:60,end:121,
        highlight_color: 'var(--textHighlightColor)',
        text_color: 'var(--darkTextColor)',
      }
    ],
    html: '<div>When the <span class="mmd-highlight" style="background-color: var(--textHighlightColor);color: var(--darkTextColor);">target variable that we’re trying to predict is con</span><span class="mmd-highlight" style="background-color: var(--textHighlightColor);color: var(--darkTextColor);">tinuous, such as in our housing example, we call the learning</span> problem a regression problem.</div>'
  },
  {
    content: 'When the `target variable that we\'re trying to predict is continuous, such as in our housing example, we call the learning` problem a regression problem.',
    highlights: [
      {
        start:10,end:50,
        highlight_color: 'var(--textHighlightColor)',
        text_color: 'var(--darkTextColor)',
      },
      {
        start:60,end:70,
        highlight_color: 'var(--textHighlightColor)',
        text_color: 'var(--darkTextColor)',
      },
      {
        start:80,end:90,
        highlight_color: 'var(--textHighlightColor)',
        text_color: 'var(--darkTextColor)',
      },
      {
        start:9,end:60,
        highlight_color: 'var(--textHighlightColor)',
        text_color: 'var(--darkTextColor)',
      },
      {
        start:91,end:100,
        highlight_color: 'var(--textHighlightColor)',
        text_color: 'var(--darkTextColor)',
      },
      {
        start:60,end:122,
        highlight_color: 'var(--textHighlightColor)',
        text_color: 'var(--darkTextColor)',
      }
    ],
    html: '<div>When the <span class="mmd-highlight" style="background-color: var(--textHighlightColor);color: var(--darkTextColor);"></span><code><span style="background-color: var(--textHighlightColor);color: var(--darkTextColor);">target variable that we\'re trying to predict is co</span><span style="background-color: var(--textHighlightColor);color: var(--darkTextColor);">ntinuous, such as in our housing example, we call the learning</span></code> problem a regression problem.</div>'
  },
  {
    content: 'To describe the supervised learning problem slightly more formally, our goal is, given a training set, to learn a function \\(h: \\mathcal{X} \\mapsto \\mathcal{Y}\\) so that \\(h(x)\\) is a "good" predictor for the corresponding value of \\(y\\). For historical reasons, this function \\(h\\) is called a hypothesis. Seen pictorially, the process is therefore like this:',
    highlights: [
      {
        start:10,end:50,
        highlight_color: 'var(--textHighlightColor)',
        text_color: 'var(--darkTextColor)',
      },
      {
        start:60,end:70,
        highlight_color: 'var(--textHighlightColor)',
        text_color: 'var(--darkTextColor)',
      },
      {
        start:80,end:90,
        highlight_color: 'var(--textHighlightColor)',
        text_color: 'var(--darkTextColor)',
      },
      {
        start:9,end:60,
        highlight_color: 'var(--textHighlightColor)',
        text_color: 'var(--darkTextColor)',
      },
      {
        start:91,end:100,
        highlight_color: 'var(--textHighlightColor)',
        text_color: 'var(--darkTextColor)',
      },
      {
        start:280,end:282,
        highlight_color: 'var(--textHighlightColor)',
        text_color: 'var(--darkTextColor)',
      },
      {
        start:60,end:282,
        highlight_color: 'var(--textHighlightColor)',
        text_color: 'var(--darkTextColor)',
      },
    ],
    html: '<div>To descri<span class="mmd-highlight" style="background-color: var(--textHighlightColor);color: var(--darkTextColor);">be the supervised learning problem slightly more fo</span><span class="mmd-highlight" style="background-color: var(--textHighlightColor);color: var(--darkTextColor);">rmally, our goal is, given a training set, to learn a function </span><span class="math-inline " style="background-color: var(--textHighlightColor);color: var(--darkTextColor);">\n' +
      '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.324ex;" xmlns="http://www.w3.org/2000/svg" width="10.15ex" height="1.894ex" role="img" focusable="false" viewBox="0 -694 4486.1 837"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="210E" d="M137 683Q138 683 209 688T282 694Q294 694 294 685Q294 674 258 534Q220 386 220 383Q220 381 227 388Q288 442 357 442Q411 442 444 415T478 336Q478 285 440 178T402 50Q403 36 407 31T422 26Q450 26 474 56T513 138Q516 149 519 151T535 153Q555 153 555 145Q555 144 551 130Q535 71 500 33Q466 -10 419 -10H414Q367 -10 346 17T325 74Q325 90 361 192T398 345Q398 404 354 404H349Q266 404 205 306L198 293L164 158Q132 28 127 16Q114 -11 83 -11Q69 -11 59 -2T48 16Q48 30 121 320L195 616Q195 629 188 632T149 637H128Q122 643 122 645T124 664Q129 683 137 683Z"></path></g><g data-mml-node="mo" transform="translate(853.8,0)"><path data-c="3A" d="M78 370Q78 394 95 412T138 430Q162 430 180 414T199 371Q199 346 182 328T139 310T96 327T78 370ZM78 60Q78 84 95 102T138 120Q162 120 180 104T199 61Q199 36 182 18T139 0T96 17T78 60Z"></path></g><g data-mml-node="TeXAtom" data-mjx-texclass="ORD" transform="translate(1409.6,0)"><g data-mml-node="mi"><path data-c="58" d="M324 614Q291 576 250 573Q231 573 231 584Q231 589 232 592Q235 601 244 614T271 643T324 671T400 683H403Q462 683 481 610Q485 594 490 545T498 454L501 413Q504 413 551 442T648 509T705 561Q707 565 707 578Q707 610 682 614Q667 614 667 626Q667 641 695 662T755 683Q765 683 775 680T796 662T807 623Q807 596 792 572T713 499T530 376L505 361V356Q508 346 511 278T524 148T557 75Q569 69 580 69Q585 69 593 77Q624 108 660 110Q667 110 670 110T676 106T678 94Q668 59 624 30T510 0Q487 0 471 9T445 32T430 71T422 117T417 173Q416 183 416 188Q413 214 411 244T407 286T405 299Q403 299 344 263T223 182T154 122Q152 118 152 105Q152 69 180 69Q183 69 187 66T191 60L192 58V56Q192 41 163 21T105 0Q94 0 84 3T63 21T52 60Q52 77 56 90T85 131T155 191Q197 223 259 263T362 327T402 352L391 489Q391 492 390 505T387 526T384 547T379 568T372 586T361 602T348 611Q346 612 341 613T333 614H324Z"></path></g></g><g data-mml-node="mo" transform="translate(2494.3,0)"><path data-c="21A6" d="M95 155V109Q95 83 92 73T75 63Q61 63 58 74T54 130Q54 140 54 180T55 250Q55 421 57 425Q61 437 75 437Q88 437 91 428T95 393V345V270H835Q719 357 692 493Q692 494 692 496T691 499Q691 511 708 511H711Q720 511 723 510T729 506T732 497T735 481T743 456Q765 389 816 336T935 261Q944 258 944 250Q944 244 939 241T915 231T877 212Q836 186 806 152T761 85T740 35T732 4Q730 -6 727 -8T711 -11Q691 -11 691 0Q691 7 696 25Q728 151 835 230H95V155Z"></path></g><g data-mml-node="TeXAtom" data-mjx-texclass="ORD" transform="translate(3772.1,0)"><g data-mml-node="mi"><path data-c="59" d="M65 599Q65 618 107 650T204 683Q267 683 312 643T380 533T414 385T424 217Q424 186 423 160T422 123Q426 123 468 170T567 304T650 469Q661 503 661 519Q661 546 639 570Q615 591 583 591Q569 591 569 616Q569 640 582 661T613 683Q624 683 638 679T671 664T702 625T714 558Q714 472 639 329T426 45Q361 -21 282 -82T154 -143Q97 -143 64 -104T31 -20Q31 4 44 25T70 46Q78 46 81 39T87 16T97 -9Q127 -51 182 -51Q184 -51 187 -50H190Q233 -41 314 25Q330 36 330 40Q336 79 336 178Q336 508 223 594Q199 614 158 619L148 620L139 611Q111 586 83 586Q65 586 65 599Z"></path></g></g></g></g></svg></mjx-container></span><span class="mmd-highlight" style="background-color: var(--textHighlightColor);color: var(--darkTextColor);"> so that </span><span class="math-inline " style="background-color: var(--textHighlightColor);color: var(--darkTextColor);">\n' +
      '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.566ex;" xmlns="http://www.w3.org/2000/svg" width="4.357ex" height="2.262ex" role="img" focusable="false" viewBox="0 -750 1926 1000"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="210E" d="M137 683Q138 683 209 688T282 694Q294 694 294 685Q294 674 258 534Q220 386 220 383Q220 381 227 388Q288 442 357 442Q411 442 444 415T478 336Q478 285 440 178T402 50Q403 36 407 31T422 26Q450 26 474 56T513 138Q516 149 519 151T535 153Q555 153 555 145Q555 144 551 130Q535 71 500 33Q466 -10 419 -10H414Q367 -10 346 17T325 74Q325 90 361 192T398 345Q398 404 354 404H349Q266 404 205 306L198 293L164 158Q132 28 127 16Q114 -11 83 -11Q69 -11 59 -2T48 16Q48 30 121 320L195 616Q195 629 188 632T149 637H128Q122 643 122 645T124 664Q129 683 137 683Z"></path></g><g data-mml-node="mo" transform="translate(576,0)"><path data-c="28" d="M94 250Q94 319 104 381T127 488T164 576T202 643T244 695T277 729T302 750H315H319Q333 750 333 741Q333 738 316 720T275 667T226 581T184 443T167 250T184 58T225 -81T274 -167T316 -220T333 -241Q333 -250 318 -250H315H302L274 -226Q180 -141 137 -14T94 250Z"></path></g><g data-mml-node="mi" transform="translate(965,0)"><path data-c="1D465" d="M52 289Q59 331 106 386T222 442Q257 442 286 424T329 379Q371 442 430 442Q467 442 494 420T522 361Q522 332 508 314T481 292T458 288Q439 288 427 299T415 328Q415 374 465 391Q454 404 425 404Q412 404 406 402Q368 386 350 336Q290 115 290 78Q290 50 306 38T341 26Q378 26 414 59T463 140Q466 150 469 151T485 153H489Q504 153 504 145Q504 144 502 134Q486 77 440 33T333 -11Q263 -11 227 52Q186 -10 133 -10H127Q78 -10 57 16T35 71Q35 103 54 123T99 143Q142 143 142 101Q142 81 130 66T107 46T94 41L91 40Q91 39 97 36T113 29T132 26Q168 26 194 71Q203 87 217 139T245 247T261 313Q266 340 266 352Q266 380 251 392T217 404Q177 404 142 372T93 290Q91 281 88 280T72 278H58Q52 284 52 289Z"></path></g><g data-mml-node="mo" transform="translate(1537,0)"><path data-c="29" d="M60 749L64 750Q69 750 74 750H86L114 726Q208 641 251 514T294 250Q294 182 284 119T261 12T224 -76T186 -143T145 -194T113 -227T90 -246Q87 -249 86 -250H74Q66 -250 63 -250T58 -247T55 -238Q56 -237 66 -225Q221 -64 221 250T66 725Q56 737 55 738Q55 746 60 749Z"></path></g></g></g></svg></mjx-container></span><span class="mmd-highlight" style="background-color: var(--textHighlightColor);color: var(--darkTextColor);"> is a “good” predictor for the corresponding value of </span><span class="math-inline " style="background-color: var(--textHighlightColor);color: var(--darkTextColor);">\n' +
      '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.464ex;" xmlns="http://www.w3.org/2000/svg" width="1.109ex" height="1.464ex" role="img" focusable="false" viewBox="0 -442 490 647"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="1D466" d="M21 287Q21 301 36 335T84 406T158 442Q199 442 224 419T250 355Q248 336 247 334Q247 331 231 288T198 191T182 105Q182 62 196 45T238 27Q261 27 281 38T312 61T339 94Q339 95 344 114T358 173T377 247Q415 397 419 404Q432 431 462 431Q475 431 483 424T494 412T496 403Q496 390 447 193T391 -23Q363 -106 294 -155T156 -205Q111 -205 77 -183T43 -117Q43 -95 50 -80T69 -58T89 -48T106 -45Q150 -45 150 -87Q150 -107 138 -122T115 -142T102 -147L99 -148Q101 -153 118 -160T152 -167H160Q177 -167 186 -165Q219 -156 247 -127T290 -65T313 -9T321 21L315 17Q309 13 296 6T270 -6Q250 -11 231 -11Q185 -11 150 11T104 82Q103 89 103 113Q103 170 138 262T173 379Q173 380 173 381Q173 390 173 393T169 400T158 404H154Q131 404 112 385T82 344T65 302T57 280Q55 278 41 278H27Q21 284 21 287Z"></path></g></g></g></svg></mjx-container></span><span class="mmd-highlight" style="background-color: var(--textHighlightColor);color: var(--darkTextColor);">. For historical reasons, this function </span><span class="math-inline " style="background-color: var(--textHighlightColor);color: var(--darkTextColor);">\n' +
      '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.025ex;" xmlns="http://www.w3.org/2000/svg" width="1.303ex" height="1.595ex" role="img" focusable="false" viewBox="0 -694 576 705"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="210E" d="M137 683Q138 683 209 688T282 694Q294 694 294 685Q294 674 258 534Q220 386 220 383Q220 381 227 388Q288 442 357 442Q411 442 444 415T478 336Q478 285 440 178T402 50Q403 36 407 31T422 26Q450 26 474 56T513 138Q516 149 519 151T535 153Q555 153 555 145Q555 144 551 130Q535 71 500 33Q466 -10 419 -10H414Q367 -10 346 17T325 74Q325 90 361 192T398 345Q398 404 354 404H349Q266 404 205 306L198 293L164 158Q132 28 127 16Q114 -11 83 -11Q69 -11 59 -2T48 16Q48 30 121 320L195 616Q195 629 188 632T149 637H128Q122 643 122 645T124 664Q129 683 137 683Z"></path></g></g></g></svg></mjx-container></span><span class="mmd-highlight" style="background-color: var(--textHighlightColor);color: var(--darkTextColor);"></span> is called a hypothesis. Seen pictorially, the process is therefore like this:</div>'
  },
  {
    content: 'Now, since \\(h_{\\theta}\\left(x^{(i)}\\right)=\\left(x^{(i)}\\right)^{T} \\theta\\), we can easily verify that',
    highlights: [
      {
        start:10,end:50,
        highlight_color: 'var(--textHighlightColor)',
        text_color: 'var(--darkTextColor)',
      },
      {
        start:60,end:70,
        highlight_color: 'var(--textHighlightColor)',
        text_color: 'var(--darkTextColor)',
      },
      {
        start:80,end:90,
        highlight_color: 'var(--textHighlightColor)',
        text_color: 'var(--darkTextColor)',
      },
      {
        start:5,end:60,
        highlight_color: 'var(--textHighlightColor)',
        text_color: 'var(--darkTextColor)',
      },
      {
        start:91,end:100,
        highlight_color: 'var(--textHighlightColor)',
        text_color: 'var(--darkTextColor)',
      },
      {
        start:280,end:282,
        highlight_color: 'var(--textHighlightColor)',
        text_color: 'var(--darkTextColor)',
      },
      {
        start:60,end:282,
        highlight_color: 'var(--textHighlightColor)',
        text_color: 'var(--darkTextColor)',
      },
    ],
    html: '<div>Now, <span class="mmd-highlight" style="background-color: var(--textHighlightColor);color: var(--darkTextColor);">since </span><span class="math-inline " data-highlight-color="true" data-highlight-text-color="true" style="--mmd-highlight-color: var(--textHighlightColor);--mmd-highlight-text-color: var(--darkTextColor);">\n' +
      '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.791ex;" xmlns="http://www.w3.org/2000/svg" width="18.712ex" height="3.277ex" role="img" focusable="false" viewBox="0 -1099.1 8270.8 1448.6"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="msub"><g data-mml-node="mi"><path data-c="210E" d="M137 683Q138 683 209 688T282 694Q294 694 294 685Q294 674 258 534Q220 386 220 383Q220 381 227 388Q288 442 357 442Q411 442 444 415T478 336Q478 285 440 178T402 50Q403 36 407 31T422 26Q450 26 474 56T513 138Q516 149 519 151T535 153Q555 153 555 145Q555 144 551 130Q535 71 500 33Q466 -10 419 -10H414Q367 -10 346 17T325 74Q325 90 361 192T398 345Q398 404 354 404H349Q266 404 205 306L198 293L164 158Q132 28 127 16Q114 -11 83 -11Q69 -11 59 -2T48 16Q48 30 121 320L195 616Q195 629 188 632T149 637H128Q122 643 122 645T124 664Q129 683 137 683Z"></path></g><g data-mml-node="TeXAtom" transform="translate(609,-150) scale(0.707)" data-mjx-texclass="ORD"><g data-mml-node="mi"><path data-c="1D703" d="M35 200Q35 302 74 415T180 610T319 704Q320 704 327 704T339 705Q393 701 423 656Q462 596 462 495Q462 380 417 261T302 66T168 -10H161Q125 -10 99 10T60 63T41 130T35 200ZM383 566Q383 668 330 668Q294 668 260 623T204 521T170 421T157 371Q206 370 254 370L351 371Q352 372 359 404T375 484T383 566ZM113 132Q113 26 166 26Q181 26 198 36T239 74T287 161T335 307L340 324H145Q145 321 136 286T120 208T113 132Z"></path></g></g></g><g data-mml-node="mrow" transform="translate(1157.3,0)"><g data-mml-node="mo" transform="translate(0 -0.5)"><path data-c="28" d="M152 251Q152 646 388 850H416Q422 844 422 841Q422 837 403 816T357 753T302 649T255 482T236 250Q236 124 255 19T301 -147T356 -251T403 -315T422 -340Q422 -343 416 -349H388Q359 -325 332 -296T271 -213T212 -97T170 56T152 251Z"></path></g><g data-mml-node="msup" transform="translate(458,0)"><g data-mml-node="mi"><path data-c="1D465" d="M52 289Q59 331 106 386T222 442Q257 442 286 424T329 379Q371 442 430 442Q467 442 494 420T522 361Q522 332 508 314T481 292T458 288Q439 288 427 299T415 328Q415 374 465 391Q454 404 425 404Q412 404 406 402Q368 386 350 336Q290 115 290 78Q290 50 306 38T341 26Q378 26 414 59T463 140Q466 150 469 151T485 153H489Q504 153 504 145Q504 144 502 134Q486 77 440 33T333 -11Q263 -11 227 52Q186 -10 133 -10H127Q78 -10 57 16T35 71Q35 103 54 123T99 143Q142 143 142 101Q142 81 130 66T107 46T94 41L91 40Q91 39 97 36T113 29T132 26Q168 26 194 71Q203 87 217 139T245 247T261 313Q266 340 266 352Q266 380 251 392T217 404Q177 404 142 372T93 290Q91 281 88 280T72 278H58Q52 284 52 289Z"></path></g><g data-mml-node="TeXAtom" transform="translate(605,363) scale(0.707)" data-mjx-texclass="ORD"><g data-mml-node="mo"><path data-c="28" d="M94 250Q94 319 104 381T127 488T164 576T202 643T244 695T277 729T302 750H315H319Q333 750 333 741Q333 738 316 720T275 667T226 581T184 443T167 250T184 58T225 -81T274 -167T316 -220T333 -241Q333 -250 318 -250H315H302L274 -226Q180 -141 137 -14T94 250Z"></path></g><g data-mml-node="mi" transform="translate(389,0)"><path data-c="1D456" d="M184 600Q184 624 203 642T247 661Q265 661 277 649T290 619Q290 596 270 577T226 557Q211 557 198 567T184 600ZM21 287Q21 295 30 318T54 369T98 420T158 442Q197 442 223 419T250 357Q250 340 236 301T196 196T154 83Q149 61 149 51Q149 26 166 26Q175 26 185 29T208 43T235 78T260 137Q263 149 265 151T282 153Q302 153 302 143Q302 135 293 112T268 61T223 11T161 -11Q129 -11 102 10T74 74Q74 91 79 106T122 220Q160 321 166 341T173 380Q173 404 156 404H154Q124 404 99 371T61 287Q60 286 59 284T58 281T56 279T53 278T49 278T41 278H27Q21 284 21 287Z"></path></g><g data-mml-node="mo" transform="translate(734,0)"><path data-c="29" d="M60 749L64 750Q69 750 74 750H86L114 726Q208 641 251 514T294 250Q294 182 284 119T261 12T224 -76T186 -143T145 -194T113 -227T90 -246Q87 -249 86 -250H74Q66 -250 63 -250T58 -247T55 -238Q56 -237 66 -225Q221 -64 221 250T66 725Q56 737 55 738Q55 746 60 749Z"></path></g></g></g><g data-mml-node="mo" transform="translate(1907.1,0) translate(0 -0.5)"><path data-c="29" d="M305 251Q305 -145 69 -349H56Q43 -349 39 -347T35 -338Q37 -333 60 -307T108 -239T160 -136T204 27T221 250T204 473T160 636T108 740T60 807T35 839Q35 850 50 850H56H69Q197 743 256 566Q305 425 305 251Z"></path></g></g><g data-mml-node="mo" transform="translate(3800.2,0)"><path data-c="3D" d="M56 347Q56 360 70 367H707Q722 359 722 347Q722 336 708 328L390 327H72Q56 332 56 347ZM56 153Q56 168 72 173H708Q722 163 722 153Q722 140 707 133H70Q56 140 56 153Z"></path></g><g data-mml-node="msup" transform="translate(4855.9,0)"><g data-mml-node="mrow"><g data-mml-node="mo" transform="translate(0 -0.5)"><path data-c="28" d="M152 251Q152 646 388 850H416Q422 844 422 841Q422 837 403 816T357 753T302 649T255 482T236 250Q236 124 255 19T301 -147T356 -251T403 -315T422 -340Q422 -343 416 -349H388Q359 -325 332 -296T271 -213T212 -97T170 56T152 251Z"></path></g><g data-mml-node="msup" transform="translate(458,0)"><g data-mml-node="mi"><path data-c="1D465" d="M52 289Q59 331 106 386T222 442Q257 442 286 424T329 379Q371 442 430 442Q467 442 494 420T522 361Q522 332 508 314T481 292T458 288Q439 288 427 299T415 328Q415 374 465 391Q454 404 425 404Q412 404 406 402Q368 386 350 336Q290 115 290 78Q290 50 306 38T341 26Q378 26 414 59T463 140Q466 150 469 151T485 153H489Q504 153 504 145Q504 144 502 134Q486 77 440 33T333 -11Q263 -11 227 52Q186 -10 133 -10H127Q78 -10 57 16T35 71Q35 103 54 123T99 143Q142 143 142 101Q142 81 130 66T107 46T94 41L91 40Q91 39 97 36T113 29T132 26Q168 26 194 71Q203 87 217 139T245 247T261 313Q266 340 266 352Q266 380 251 392T217 404Q177 404 142 372T93 290Q91 281 88 280T72 278H58Q52 284 52 289Z"></path></g><g data-mml-node="TeXAtom" transform="translate(605,363) scale(0.707)" data-mjx-texclass="ORD"><g data-mml-node="mo"><path data-c="28" d="M94 250Q94 319 104 381T127 488T164 576T202 643T244 695T277 729T302 750H315H319Q333 750 333 741Q333 738 316 720T275 667T226 581T184 443T167 250T184 58T225 -81T274 -167T316 -220T333 -241Q333 -250 318 -250H315H302L274 -226Q180 -141 137 -14T94 250Z"></path></g><g data-mml-node="mi" transform="translate(389,0)"><path data-c="1D456" d="M184 600Q184 624 203 642T247 661Q265 661 277 649T290 619Q290 596 270 577T226 557Q211 557 198 567T184 600ZM21 287Q21 295 30 318T54 369T98 420T158 442Q197 442 223 419T250 357Q250 340 236 301T196 196T154 83Q149 61 149 51Q149 26 166 26Q175 26 185 29T208 43T235 78T260 137Q263 149 265 151T282 153Q302 153 302 143Q302 135 293 112T268 61T223 11T161 -11Q129 -11 102 10T74 74Q74 91 79 106T122 220Q160 321 166 341T173 380Q173 404 156 404H154Q124 404 99 371T61 287Q60 286 59 284T58 281T56 279T53 278T49 278T41 278H27Q21 284 21 287Z"></path></g><g data-mml-node="mo" transform="translate(734,0)"><path data-c="29" d="M60 749L64 750Q69 750 74 750H86L114 726Q208 641 251 514T294 250Q294 182 284 119T261 12T224 -76T186 -143T145 -194T113 -227T90 -246Q87 -249 86 -250H74Q66 -250 63 -250T58 -247T55 -238Q56 -237 66 -225Q221 -64 221 250T66 725Q56 737 55 738Q55 746 60 749Z"></path></g></g></g><g data-mml-node="mo" transform="translate(1907.1,0) translate(0 -0.5)"><path data-c="29" d="M305 251Q305 -145 69 -349H56Q43 -349 39 -347T35 -338Q37 -333 60 -307T108 -239T160 -136T204 27T221 250T204 473T160 636T108 740T60 807T35 839Q35 850 50 850H56H69Q197 743 256 566Q305 425 305 251Z"></path></g></g><g data-mml-node="TeXAtom" transform="translate(2398.1,620.4) scale(0.707)" data-mjx-texclass="ORD"><g data-mml-node="mi"><path data-c="1D447" d="M40 437Q21 437 21 445Q21 450 37 501T71 602L88 651Q93 669 101 677H569H659Q691 677 697 676T704 667Q704 661 687 553T668 444Q668 437 649 437Q640 437 637 437T631 442L629 445Q629 451 635 490T641 551Q641 586 628 604T573 629Q568 630 515 631Q469 631 457 630T439 622Q438 621 368 343T298 60Q298 48 386 46Q418 46 427 45T436 36Q436 31 433 22Q429 4 424 1L422 0Q419 0 415 0Q410 0 363 1T228 2Q99 2 64 0H49Q43 6 43 9T45 27Q49 40 55 46H83H94Q174 46 189 55Q190 56 191 56Q196 59 201 76T241 233Q258 301 269 344Q339 619 339 625Q339 630 310 630H279Q212 630 191 624Q146 614 121 583T67 467Q60 445 57 441T43 437H40Z"></path></g></g></g><g data-mml-node="mi" transform="translate(7801.8,0)"><path data-c="1D703" d="M35 200Q35 302 74 415T180 610T319 704Q320 704 327 704T339 705Q393 701 423 656Q462 596 462 495Q462 380 417 261T302 66T168 -10H161Q125 -10 99 10T60 63T41 130T35 200ZM383 566Q383 668 330 668Q294 668 260 623T204 521T170 421T157 371Q206 370 254 370L351 371Q352 372 359 404T375 484T383 566ZM113 132Q113 26 166 26Q181 26 198 36T239 74T287 161T335 307L340 324H145Q145 321 136 286T120 208T113 132Z"></path></g></g></g></svg></mjx-container></span><span class="mmd-highlight" style="background-color: var(--textHighlightColor);color: var(--darkTextColor);">, we can easily verify that</span></div>'
  },
  {
    content: 'To describe the supervised learning problem slightly more formally',
    highlights: [
      {
        start:0,end:11,
        highlight_color: 'var(--textHighlightColor)',
        text_color: 'var(--darkTextColor)',
      },
      {
        start:12,end:52,
        highlight_color: 'var(--textHighlightColor)',
        text_color: 'var(--darkTextColor)',
      },
    ],
    html: '<div><span class="mmd-highlight" style="background-color: var(--textHighlightColor);color: var(--darkTextColor);">To describe</span> <span class="mmd-highlight" style="background-color: var(--textHighlightColor);color: var(--darkTextColor);">the supervised learning problem slightly</span> more formally</div>'
  },
  {
    content: 'To describe the supervised learning problem slightly more formally',
    highlights: [
      {
        start:0,end:13,
        highlight_color: 'var(--textHighlightColor)',
        text_color: 'var(--darkTextColor)',
      },
      {
        start:13,end:52,
        highlight_color: 'var(--textHighlightColor)',
        text_color: 'var(--darkTextColor)',
      },
    ],
    html: '<div><span class="mmd-highlight" style="background-color: var(--textHighlightColor);color: var(--darkTextColor);">To describe t</span><span class="mmd-highlight" style="background-color: var(--textHighlightColor);color: var(--darkTextColor);">he supervised learning problem slightly</span> more formally</div>'
  },
  {
    content: 'To describe the supervised learning problem slightly more formally',
    highlights: [
      {
        start:0,end:14,
        highlight_color: 'var(--textHighlightColor)',
        text_color: 'var(--darkTextColor)',
      },
      {
        start:13,end:52,
        highlight_color: 'var(--textHighlightColor)',
        text_color: 'var(--darkTextColor)',
      },
    ],
    html: '<div><span class="mmd-highlight" style="background-color: var(--textHighlightColor);color: var(--darkTextColor);">To describe the supervised learning problem slightly</span> more formally</div>'
  },
  // {
  //   content: '',
  //   highlights: [],
  //   html: ''
  // },
  // {
  //   content: '',
  //   highlights: [],
  //   html: ''
  // },
];
