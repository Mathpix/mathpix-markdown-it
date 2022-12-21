module.exports = [
  {
    latex: '\\newtheorem{theorem}{Theorem}\n' +
      '\n' +
      '\\section{Introduction}\n' +
      'Theorems can easily be defined:\n' +
      '\n' +
      '\\begin{theorem}\n' +
      'Let \\(f\\) be a function whose derivative exists in every point, then \\(f\\) \n' +
      'is a continuous function.\n' +
      '\\end{theorem}',
    html:  `<div style="margin-top: 0; margin-bottom: 0;"></div>
<h2 type="section" class="section-title" id="introduction">
<span class="section-number">1. </span>Introduction</h2>
<div>Theorems can easily be defined:</div>
<div>
<div class="theorem" style="font-style: italic; padding: 10px 0;"><span style="font-weight: bold; font-style: normal;" class="theorem-title">Theorem 1.</span><span style="margin-right: 16px"></span><div style="display: inline" data-display="inline">Let <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.464ex" xmlns="http://www.w3.org/2000/svg" width="1.244ex" height="2.059ex" role="img" focusable="false" viewBox="0 -705 550 910"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="66" d="M118 -162Q120 -162 124 -164T135 -167T147 -168Q160 -168 171 -155T187 -126Q197 -99 221 27T267 267T289 382V385H242Q195 385 192 387Q188 390 188 397L195 425Q197 430 203 430T250 431Q298 431 298 432Q298 434 307 482T319 540Q356 705 465 705Q502 703 526 683T550 630Q550 594 529 578T487 561Q443 561 443 603Q443 622 454 636T478 657L487 662Q471 668 457 668Q445 668 434 658T419 630Q412 601 403 552T387 469T380 433Q380 431 435 431Q480 431 487 430T498 424Q499 420 496 407T491 391Q489 386 482 386T428 385H372L349 263Q301 15 282 -47Q255 -132 212 -173Q175 -205 139 -205Q107 -205 81 -186T55 -132Q55 -95 76 -78T118 -61Q162 -61 162 -103Q162 -122 151 -136T127 -157L118 -162Z"></path></g></g></g></svg></mjx-container></span> be a function whose derivative exists in every point, then <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.464ex" xmlns="http://www.w3.org/2000/svg" width="1.244ex" height="2.059ex" role="img" focusable="false" viewBox="0 -705 550 910"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="66" d="M118 -162Q120 -162 124 -164T135 -167T147 -168Q160 -168 171 -155T187 -126Q197 -99 221 27T267 267T289 382V385H242Q195 385 192 387Q188 390 188 397L195 425Q197 430 203 430T250 431Q298 431 298 432Q298 434 307 482T319 540Q356 705 465 705Q502 703 526 683T550 630Q550 594 529 578T487 561Q443 561 443 603Q443 622 454 636T478 657L487 662Q471 668 457 668Q445 668 434 658T419 630Q412 601 403 552T387 469T380 433Q380 431 435 431Q480 431 487 430T498 424Q499 420 496 407T491 391Q489 386 482 386T428 385H372L349 263Q301 15 282 -47Q255 -132 212 -173Q175 -205 139 -205Q107 -205 81 -186T55 -132Q55 -95 76 -78T118 -61Q162 -61 162 -103Q162 -122 151 -136T127 -157L118 -162Z"></path></g></g></g></svg></mjx-container></span><br>
is a continuous function.</div>
</div></div>`
  },
  {
    latex: '\\newtheorem{theorem}{Theorem}[section]\n' +
      '\\newtheorem{corollary}{Corollary}[theorem]\n' +
      '\\newtheorem{lemma}[theorem]{Lemma}\n' +
      '\n' +
      '\\section{Introduction}\n' +
      'Theorems can easily be defined:\n' +
      '\n' +
      '\\begin{theorem}\n' +
      'Let \\(f\\) be a function whose derivative exists in every point, then \\(f\\) is \n' +
      'a continuous function.\n' +
      '\\end{theorem}\n' +
      '\n' +
      '\\begin{theorem}[Pythagorean theorem]\n' +
      '\\label{pythagorean}\n' +
      'This is a theorem about right triangles and can be summarised in the next \n' +
      'equation \n' +
      '\\[ x^2 + y^2 = z^2 \\]\n' +
      '\\end{theorem}\n' +
      '\n' +
      'And a consequence of theorem \\ref{pythagorean} is the statement in the next \n' +
      'corollary.\n' +
      '\n' +
      '\\begin{corollary}\n' +
      'There\'s no right rectangle whose sides measure 3cm, 4cm, and 6cm.\n' +
      '\\end{corollary}\n' +
      '\n' +
      'You can reference theorems such as \\ref{pythagorean} when a label is assigned.\n' +
      '\n' +
      '\\begin{lemma}\n' +
      'Given two line segments whose lengths are \\(a\\) and \\(b\\) respectively there is a \n' +
      'real number \\(r\\) such that \\(b=ra\\).\n' +
      '\\end{lemma}',
    html: `<div style="margin-top: 0; margin-bottom: 0;"></div>
<h2 type="section" class="section-title" id="introduction">
<span class="section-number">1. </span>Introduction</h2>
<div>Theorems can easily be defined:</div>
<div>
<div class="theorem" style="font-style: italic; padding: 10px 0;"><span style="font-weight: bold; font-style: normal;" class="theorem-title">Theorem 1.1.</span><span style="margin-right: 16px"></span><div style="display: inline" data-display="inline">Let <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.464ex" xmlns="http://www.w3.org/2000/svg" width="1.244ex" height="2.059ex" role="img" focusable="false" viewBox="0 -705 550 910"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="66" d="M118 -162Q120 -162 124 -164T135 -167T147 -168Q160 -168 171 -155T187 -126Q197 -99 221 27T267 267T289 382V385H242Q195 385 192 387Q188 390 188 397L195 425Q197 430 203 430T250 431Q298 431 298 432Q298 434 307 482T319 540Q356 705 465 705Q502 703 526 683T550 630Q550 594 529 578T487 561Q443 561 443 603Q443 622 454 636T478 657L487 662Q471 668 457 668Q445 668 434 658T419 630Q412 601 403 552T387 469T380 433Q380 431 435 431Q480 431 487 430T498 424Q499 420 496 407T491 391Q489 386 482 386T428 385H372L349 263Q301 15 282 -47Q255 -132 212 -173Q175 -205 139 -205Q107 -205 81 -186T55 -132Q55 -95 76 -78T118 -61Q162 -61 162 -103Q162 -122 151 -136T127 -157L118 -162Z"></path></g></g></g></svg></mjx-container></span> be a function whose derivative exists in every point, then <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.464ex" xmlns="http://www.w3.org/2000/svg" width="1.244ex" height="2.059ex" role="img" focusable="false" viewBox="0 -705 550 910"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="66" d="M118 -162Q120 -162 124 -164T135 -167T147 -168Q160 -168 171 -155T187 -126Q197 -99 221 27T267 267T289 382V385H242Q195 385 192 387Q188 390 188 397L195 425Q197 430 203 430T250 431Q298 431 298 432Q298 434 307 482T319 540Q356 705 465 705Q502 703 526 683T550 630Q550 594 529 578T487 561Q443 561 443 603Q443 622 454 636T478 657L487 662Q471 668 457 668Q445 668 434 658T419 630Q412 601 403 552T387 469T380 433Q380 431 435 431Q480 431 487 430T498 424Q499 420 496 407T491 391Q489 386 482 386T428 385H372L349 263Q301 15 282 -47Q255 -132 212 -173Q175 -205 139 -205Q107 -205 81 -186T55 -132Q55 -95 76 -78T118 -61Q162 -61 162 -103Q162 -122 151 -136T127 -157L118 -162Z"></path></g></g></g></svg></mjx-container></span> is<br>
a continuous function.</div>
</div></div>
<div>
<div id="pythagorean" class="theorem" style="font-style: italic; padding: 10px 0;"><span style="font-weight: bold; font-style: normal;" class="theorem-title">Theorem 1.2.</span><span style="margin-right: 10px"></span><span style="font-weight: bold; font-style: normal;">(Pythagorean theorem)</span><span style="margin-right: 16px"></span><div style="display: inline" data-display="inline">This is a theorem about right triangles and can be summarised in the next<br>
equation</div>
<div><span class="math-block ">
<mjx-container class="MathJax" jax="SVG" display="true"><svg style="vertical-align: -0.464ex" xmlns="http://www.w3.org/2000/svg" width="11.977ex" height="2.464ex" role="img" focusable="false" viewBox="0 -883.9 5293.7 1088.9"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="msup"><g data-mml-node="mi"><path data-c="78" d="M52 289Q59 331 106 386T222 442Q257 442 286 424T329 379Q371 442 430 442Q467 442 494 420T522 361Q522 332 508 314T481 292T458 288Q439 288 427 299T415 328Q415 374 465 391Q454 404 425 404Q412 404 406 402Q368 386 350 336Q290 115 290 78Q290 50 306 38T341 26Q378 26 414 59T463 140Q466 150 469 151T485 153H489Q504 153 504 145Q504 144 502 134Q486 77 440 33T333 -11Q263 -11 227 52Q186 -10 133 -10H127Q78 -10 57 16T35 71Q35 103 54 123T99 143Q142 143 142 101Q142 81 130 66T107 46T94 41L91 40Q91 39 97 36T113 29T132 26Q168 26 194 71Q203 87 217 139T245 247T261 313Q266 340 266 352Q266 380 251 392T217 404Q177 404 142 372T93 290Q91 281 88 280T72 278H58Q52 284 52 289Z"></path></g><g data-mml-node="mn" transform="translate(572, 413) scale(0.707)"><path data-c="32" d="M109 429Q82 429 66 447T50 491Q50 562 103 614T235 666Q326 666 387 610T449 465Q449 422 429 383T381 315T301 241Q265 210 201 149L142 93L218 92Q375 92 385 97Q392 99 409 186V189H449V186Q448 183 436 95T421 3V0H50V19V31Q50 38 56 46T86 81Q115 113 136 137Q145 147 170 174T204 211T233 244T261 278T284 308T305 340T320 369T333 401T340 431T343 464Q343 527 309 573T212 619Q179 619 154 602T119 569T109 550Q109 549 114 549Q132 549 151 535T170 489Q170 464 154 447T109 429Z"></path></g></g><g data-mml-node="mo" transform="translate(1197.8, 0)"><path data-c="2B" d="M56 237T56 250T70 270H369V420L370 570Q380 583 389 583Q402 583 409 568V270H707Q722 262 722 250T707 230H409V-68Q401 -82 391 -82H389H387Q375 -82 369 -68V230H70Q56 237 56 250Z"></path></g><g data-mml-node="msup" transform="translate(2198, 0)"><g data-mml-node="mi"><path data-c="79" d="M21 287Q21 301 36 335T84 406T158 442Q199 442 224 419T250 355Q248 336 247 334Q247 331 231 288T198 191T182 105Q182 62 196 45T238 27Q261 27 281 38T312 61T339 94Q339 95 344 114T358 173T377 247Q415 397 419 404Q432 431 462 431Q475 431 483 424T494 412T496 403Q496 390 447 193T391 -23Q363 -106 294 -155T156 -205Q111 -205 77 -183T43 -117Q43 -95 50 -80T69 -58T89 -48T106 -45Q150 -45 150 -87Q150 -107 138 -122T115 -142T102 -147L99 -148Q101 -153 118 -160T152 -167H160Q177 -167 186 -165Q219 -156 247 -127T290 -65T313 -9T321 21L315 17Q309 13 296 6T270 -6Q250 -11 231 -11Q185 -11 150 11T104 82Q103 89 103 113Q103 170 138 262T173 379Q173 380 173 381Q173 390 173 393T169 400T158 404H154Q131 404 112 385T82 344T65 302T57 280Q55 278 41 278H27Q21 284 21 287Z"></path></g><g data-mml-node="mn" transform="translate(490, 413) scale(0.707)"><path data-c="32" d="M109 429Q82 429 66 447T50 491Q50 562 103 614T235 666Q326 666 387 610T449 465Q449 422 429 383T381 315T301 241Q265 210 201 149L142 93L218 92Q375 92 385 97Q392 99 409 186V189H449V186Q448 183 436 95T421 3V0H50V19V31Q50 38 56 46T86 81Q115 113 136 137Q145 147 170 174T204 211T233 244T261 278T284 308T305 340T320 369T333 401T340 431T343 464Q343 527 309 573T212 619Q179 619 154 602T119 569T109 550Q109 549 114 549Q132 549 151 535T170 489Q170 464 154 447T109 429Z"></path></g></g><g data-mml-node="mo" transform="translate(3369.3, 0)"><path data-c="3D" d="M56 347Q56 360 70 367H707Q722 359 722 347Q722 336 708 328L390 327H72Q56 332 56 347ZM56 153Q56 168 72 173H708Q722 163 722 153Q722 140 707 133H70Q56 140 56 153Z"></path></g><g data-mml-node="msup" transform="translate(4425.1, 0)"><g data-mml-node="mi"><path data-c="7A" d="M347 338Q337 338 294 349T231 360Q211 360 197 356T174 346T162 335T155 324L153 320Q150 317 138 317Q117 317 117 325Q117 330 120 339Q133 378 163 406T229 440Q241 442 246 442Q271 442 291 425T329 392T367 375Q389 375 411 408T434 441Q435 442 449 442H462Q468 436 468 434Q468 430 463 420T449 399T432 377T418 358L411 349Q368 298 275 214T160 106L148 94L163 93Q185 93 227 82T290 71Q328 71 360 90T402 140Q406 149 409 151T424 153Q443 153 443 143Q443 138 442 134Q425 72 376 31T278 -11Q252 -11 232 6T193 40T155 57Q111 57 76 -3Q70 -11 59 -11H54H41Q35 -5 35 -2Q35 13 93 84Q132 129 225 214T340 322Q352 338 347 338Z"></path></g><g data-mml-node="mn" transform="translate(465, 413) scale(0.707)"><path data-c="32" d="M109 429Q82 429 66 447T50 491Q50 562 103 614T235 666Q326 666 387 610T449 465Q449 422 429 383T381 315T301 241Q265 210 201 149L142 93L218 92Q375 92 385 97Q392 99 409 186V189H449V186Q448 183 436 95T421 3V0H50V19V31Q50 38 56 46T86 81Q115 113 136 137Q145 147 170 174T204 211T233 244T261 278T284 308T305 340T320 369T333 401T340 431T343 464Q343 527 309 573T212 619Q179 619 154 602T119 569T109 550Q109 549 114 549Q132 549 151 535T170 489Q170 464 154 447T109 429Z"></path></g></g></g></g></svg></mjx-container></span></div>
</div></div>
<div>And a consequence of theorem <a href="#pythagorean" style="cursor: pointer; text-decoration: none;" class="clickable-link" value="pythagorean">1.2 </a> is the statement in the next<br>
corollary.</div>
<div>
<div class="theorem" style="font-style: italic; padding: 10px 0;"><span style="font-weight: bold; font-style: normal;" class="theorem-title">Corollary 1.2.1.</span><span style="margin-right: 16px"></span><div style="display: inline" data-display="inline">There’s no right rectangle whose sides measure 3cm, 4cm, and 6cm.</div>
</div></div>
<div>You can reference theorems such as <a href="#pythagorean" style="cursor: pointer; text-decoration: none;" class="clickable-link" value="pythagorean">1.2 </a> when a label is assigned.</div>
<div>
<div class="theorem" style="font-style: italic; padding: 10px 0;"><span style="font-weight: bold; font-style: normal;" class="theorem-title">Lemma 1.3.</span><span style="margin-right: 16px"></span><div style="display: inline" data-display="inline">Given two line segments whose lengths are <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.023ex" xmlns="http://www.w3.org/2000/svg" width="1.197ex" height="1.02ex" role="img" focusable="false" viewBox="0 -441 529 451"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="61" d="M33 157Q33 258 109 349T280 441Q331 441 370 392Q386 422 416 422Q429 422 439 414T449 394Q449 381 412 234T374 68Q374 43 381 35T402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487Q506 153 506 144Q506 138 501 117T481 63T449 13Q436 0 417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157ZM351 328Q351 334 346 350T323 385T277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q217 26 254 59T298 110Q300 114 325 217T351 328Z"></path></g></g></g></svg></mjx-container></span> and <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.025ex" xmlns="http://www.w3.org/2000/svg" width="0.971ex" height="1.595ex" role="img" focusable="false" viewBox="0 -694 429 705"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="62" d="M73 647Q73 657 77 670T89 683Q90 683 161 688T234 694Q246 694 246 685T212 542Q204 508 195 472T180 418L176 399Q176 396 182 402Q231 442 283 442Q345 442 383 396T422 280Q422 169 343 79T173 -11Q123 -11 82 27T40 150V159Q40 180 48 217T97 414Q147 611 147 623T109 637Q104 637 101 637H96Q86 637 83 637T76 640T73 647ZM336 325V331Q336 405 275 405Q258 405 240 397T207 376T181 352T163 330L157 322L136 236Q114 150 114 114Q114 66 138 42Q154 26 178 26Q211 26 245 58Q270 81 285 114T318 219Q336 291 336 325Z"></path></g></g></g></svg></mjx-container></span> respectively there is a<br>
real number <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.025ex" xmlns="http://www.w3.org/2000/svg" width="1.02ex" height="1.025ex" role="img" focusable="false" viewBox="0 -442 451 453"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="72" d="M21 287Q22 290 23 295T28 317T38 348T53 381T73 411T99 433T132 442Q161 442 183 430T214 408T225 388Q227 382 228 382T236 389Q284 441 347 441H350Q398 441 422 400Q430 381 430 363Q430 333 417 315T391 292T366 288Q346 288 334 299T322 328Q322 376 378 392Q356 405 342 405Q286 405 239 331Q229 315 224 298T190 165Q156 25 151 16Q138 -11 108 -11Q95 -11 87 -5T76 7T74 17Q74 30 114 189T154 366Q154 405 128 405Q107 405 92 377T68 316T57 280Q55 278 41 278H27Q21 284 21 287Z"></path></g></g></g></svg></mjx-container></span> such that <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.186ex" xmlns="http://www.w3.org/2000/svg" width="6.205ex" height="1.756ex" role="img" focusable="false" viewBox="0 -694 2742.6 776"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="62" d="M73 647Q73 657 77 670T89 683Q90 683 161 688T234 694Q246 694 246 685T212 542Q204 508 195 472T180 418L176 399Q176 396 182 402Q231 442 283 442Q345 442 383 396T422 280Q422 169 343 79T173 -11Q123 -11 82 27T40 150V159Q40 180 48 217T97 414Q147 611 147 623T109 637Q104 637 101 637H96Q86 637 83 637T76 640T73 647ZM336 325V331Q336 405 275 405Q258 405 240 397T207 376T181 352T163 330L157 322L136 236Q114 150 114 114Q114 66 138 42Q154 26 178 26Q211 26 245 58Q270 81 285 114T318 219Q336 291 336 325Z"></path></g><g data-mml-node="mo" transform="translate(706.8, 0)"><path data-c="3D" d="M56 347Q56 360 70 367H707Q722 359 722 347Q722 336 708 328L390 327H72Q56 332 56 347ZM56 153Q56 168 72 173H708Q722 163 722 153Q722 140 707 133H70Q56 140 56 153Z"></path></g><g data-mml-node="mi" transform="translate(1762.6, 0)"><path data-c="72" d="M21 287Q22 290 23 295T28 317T38 348T53 381T73 411T99 433T132 442Q161 442 183 430T214 408T225 388Q227 382 228 382T236 389Q284 441 347 441H350Q398 441 422 400Q430 381 430 363Q430 333 417 315T391 292T366 288Q346 288 334 299T322 328Q322 376 378 392Q356 405 342 405Q286 405 239 331Q229 315 224 298T190 165Q156 25 151 16Q138 -11 108 -11Q95 -11 87 -5T76 7T74 17Q74 30 114 189T154 366Q154 405 128 405Q107 405 92 377T68 316T57 280Q55 278 41 278H27Q21 284 21 287Z"></path></g><g data-mml-node="mi" transform="translate(2213.6, 0)"><path data-c="61" d="M33 157Q33 258 109 349T280 441Q331 441 370 392Q386 422 416 422Q429 422 439 414T449 394Q449 381 412 234T374 68Q374 43 381 35T402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487Q506 153 506 144Q506 138 501 117T481 63T449 13Q436 0 417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157ZM351 328Q351 334 346 350T323 385T277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q217 26 254 59T298 110Q300 114 325 217T351 328Z"></path></g></g></g></svg></mjx-container></span>.</div>
</div></div>`
  },  
  {
    latex: '\\newtheorem*{remark}{Remark}\n' +
      '\n' +
      'Unnumbered theorem-like environments are also possible.\n' +
      '\n' +
      '\\begin{remark}\n' +
      'This statement is true, I guess.\n' +
      '\\end{remark}',
    html: `<div style="margin-top: 0; margin-bottom: 0;"></div>
<div>Unnumbered theorem-like environments are also possible.</div>
<div>
<div class="theorem" style="font-style: italic; padding: 10px 0;"><span style="font-weight: bold; font-style: normal;" class="theorem-title">Remark.</span><span style="margin-right: 16px"></span><div style="display: inline" data-display="inline">This statement is true, I guess.</div>
</div></div>`
  },  
  {
    latex: '\\theoremstyle{definition}\n' +
      '\\newtheorem{definition}{Definition}[section]\n' +
      '\n' +
      '\\theoremstyle{remark}\n' +
      '\\newtheorem*{remark}{Remark}\n' +
      '\n' +
      '\\section{Introduction}\n' +
      'Unnumbered theorem-like environments are also possible.\n' +
      '\n' +
      '\\begin{remark}\n' +
      'This statement is true, I guess.\n' +
      '\\end{remark}\n' +
      '\n' +
      'And the next is a somewhat informal definition\n' +
      '\n' +
      '\\begin{definition}[Fibration]\n' +
      'A fibration is a mapping between two topological spaces that has the homotopy lifting property for every space \\(X\\).\n' +
      '\\end{definition}',
    html: `<div style="margin-top: 0; margin-bottom: 0;"></div>
<div style="margin-top: 0; margin-bottom: 0;"></div>
<h2 type="section" class="section-title" id="introduction">
<span class="section-number">1. </span>Introduction</h2>
<div>Unnumbered theorem-like environments are also possible.</div>
<div>
<div class="theorem" style="font-style: normal; padding: 10px 0;"><span style="font-style: italic;" class="theorem-title">Remark.</span><span style="margin-right: 16px"></span><div style="display: inline" data-display="inline">This statement is true, I guess.</div>
</div></div>
<div>And the next is a somewhat informal definition</div>
<div>
<div class="theorem" style="font-style: normal; padding: 10px 0;"><span style="font-weight: bold; font-style: normal;" class="theorem-title">Definition 1.1</span><span style="margin-right: 10px"></span><span style="font-style: normal;">(Fibration).</span><span style="margin-right: 16px"></span><div style="display: inline" data-display="inline">A fibration is a mapping between two topological spaces that has the homotopy lifting property for every space <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: 0" xmlns="http://www.w3.org/2000/svg" width="1.928ex" height="1.545ex" role="img" focusable="false" viewBox="0 -683 852 683"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="58" d="M42 0H40Q26 0 26 11Q26 15 29 27Q33 41 36 43T55 46Q141 49 190 98Q200 108 306 224T411 342Q302 620 297 625Q288 636 234 637H206Q200 643 200 645T202 664Q206 677 212 683H226Q260 681 347 681Q380 681 408 681T453 682T473 682Q490 682 490 671Q490 670 488 658Q484 643 481 640T465 637Q434 634 411 620L488 426L541 485Q646 598 646 610Q646 628 622 635Q617 635 609 637Q594 637 594 648Q594 650 596 664Q600 677 606 683H618Q619 683 643 683T697 681T738 680Q828 680 837 683H845Q852 676 852 672Q850 647 840 637H824Q790 636 763 628T722 611T698 593L687 584Q687 585 592 480L505 384Q505 383 536 304T601 142T638 56Q648 47 699 46Q734 46 734 37Q734 35 732 23Q728 7 725 4T711 1Q708 1 678 1T589 2Q528 2 496 2T461 1Q444 1 444 10Q444 11 446 25Q448 35 450 39T455 44T464 46T480 47T506 54Q523 62 523 64Q522 64 476 181L429 299Q241 95 236 84Q232 76 232 72Q232 53 261 47Q262 47 267 47T273 46Q276 46 277 46T280 45T283 42T284 35Q284 26 282 19Q279 6 276 4T261 1Q258 1 243 1T201 2T142 2Q64 2 42 0Z"></path></g></g></g></svg></mjx-container></span>.</div>
</div></div>`
  },
  {
    latex: '\\newtheorem{theorem}{Theorem}[section]\n' +
      '\\newtheorem{lemma}[theorem]{Lemma}\n' +
      '\n' +
      '\\section{Introduction}\n' +
      '\\begin{lemma}\n' +
      'Given two line segments whose lengths are \\(a\\) and \\(b\\) respectively there \n' +
      'is a real number \\(r\\) such that \\(b=ra\\).\n' +
      '\\end{lemma}\n' +
      '\n' +
      '\\begin{proof}\n' +
      'To prove it by contradiction try and assume that the statement is false,\n' +
      'proceed from there and at some point you will arrive to a contradiction.\n' +
      '\\end{proof}',
    html: `<div style="margin-top: 0; margin-bottom: 0;"></div>
<h2 type="section" class="section-title" id="introduction">
<span class="section-number">1. </span>Introduction</h2>
<div>
<div class="theorem" style="font-style: italic; padding: 10px 0;"><span style="font-weight: bold; font-style: normal;" class="theorem-title">Lemma 1.1.</span><span style="margin-right: 16px"></span><div style="display: inline" data-display="inline">Given two line segments whose lengths are <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.023ex" xmlns="http://www.w3.org/2000/svg" width="1.197ex" height="1.02ex" role="img" focusable="false" viewBox="0 -441 529 451"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="61" d="M33 157Q33 258 109 349T280 441Q331 441 370 392Q386 422 416 422Q429 422 439 414T449 394Q449 381 412 234T374 68Q374 43 381 35T402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487Q506 153 506 144Q506 138 501 117T481 63T449 13Q436 0 417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157ZM351 328Q351 334 346 350T323 385T277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q217 26 254 59T298 110Q300 114 325 217T351 328Z"></path></g></g></g></svg></mjx-container></span> and <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.025ex" xmlns="http://www.w3.org/2000/svg" width="0.971ex" height="1.595ex" role="img" focusable="false" viewBox="0 -694 429 705"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="62" d="M73 647Q73 657 77 670T89 683Q90 683 161 688T234 694Q246 694 246 685T212 542Q204 508 195 472T180 418L176 399Q176 396 182 402Q231 442 283 442Q345 442 383 396T422 280Q422 169 343 79T173 -11Q123 -11 82 27T40 150V159Q40 180 48 217T97 414Q147 611 147 623T109 637Q104 637 101 637H96Q86 637 83 637T76 640T73 647ZM336 325V331Q336 405 275 405Q258 405 240 397T207 376T181 352T163 330L157 322L136 236Q114 150 114 114Q114 66 138 42Q154 26 178 26Q211 26 245 58Q270 81 285 114T318 219Q336 291 336 325Z"></path></g></g></g></svg></mjx-container></span> respectively there<br>
is a real number <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.025ex" xmlns="http://www.w3.org/2000/svg" width="1.02ex" height="1.025ex" role="img" focusable="false" viewBox="0 -442 451 453"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="72" d="M21 287Q22 290 23 295T28 317T38 348T53 381T73 411T99 433T132 442Q161 442 183 430T214 408T225 388Q227 382 228 382T236 389Q284 441 347 441H350Q398 441 422 400Q430 381 430 363Q430 333 417 315T391 292T366 288Q346 288 334 299T322 328Q322 376 378 392Q356 405 342 405Q286 405 239 331Q229 315 224 298T190 165Q156 25 151 16Q138 -11 108 -11Q95 -11 87 -5T76 7T74 17Q74 30 114 189T154 366Q154 405 128 405Q107 405 92 377T68 316T57 280Q55 278 41 278H27Q21 284 21 287Z"></path></g></g></g></svg></mjx-container></span> such that <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.186ex" xmlns="http://www.w3.org/2000/svg" width="6.205ex" height="1.756ex" role="img" focusable="false" viewBox="0 -694 2742.6 776"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="62" d="M73 647Q73 657 77 670T89 683Q90 683 161 688T234 694Q246 694 246 685T212 542Q204 508 195 472T180 418L176 399Q176 396 182 402Q231 442 283 442Q345 442 383 396T422 280Q422 169 343 79T173 -11Q123 -11 82 27T40 150V159Q40 180 48 217T97 414Q147 611 147 623T109 637Q104 637 101 637H96Q86 637 83 637T76 640T73 647ZM336 325V331Q336 405 275 405Q258 405 240 397T207 376T181 352T163 330L157 322L136 236Q114 150 114 114Q114 66 138 42Q154 26 178 26Q211 26 245 58Q270 81 285 114T318 219Q336 291 336 325Z"></path></g><g data-mml-node="mo" transform="translate(706.8, 0)"><path data-c="3D" d="M56 347Q56 360 70 367H707Q722 359 722 347Q722 336 708 328L390 327H72Q56 332 56 347ZM56 153Q56 168 72 173H708Q722 163 722 153Q722 140 707 133H70Q56 140 56 153Z"></path></g><g data-mml-node="mi" transform="translate(1762.6, 0)"><path data-c="72" d="M21 287Q22 290 23 295T28 317T38 348T53 381T73 411T99 433T132 442Q161 442 183 430T214 408T225 388Q227 382 228 382T236 389Q284 441 347 441H350Q398 441 422 400Q430 381 430 363Q430 333 417 315T391 292T366 288Q346 288 334 299T322 328Q322 376 378 392Q356 405 342 405Q286 405 239 331Q229 315 224 298T190 165Q156 25 151 16Q138 -11 108 -11Q95 -11 87 -5T76 7T74 17Q74 30 114 189T154 366Q154 405 128 405Q107 405 92 377T68 316T57 280Q55 278 41 278H27Q21 284 21 287Z"></path></g><g data-mml-node="mi" transform="translate(2213.6, 0)"><path data-c="61" d="M33 157Q33 258 109 349T280 441Q331 441 370 392Q386 422 416 422Q429 422 439 414T449 394Q449 381 412 234T374 68Q374 43 381 35T402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487Q506 153 506 144Q506 138 501 117T481 63T449 13Q436 0 417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157ZM351 328Q351 334 346 350T323 385T277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q217 26 254 59T298 110Q300 114 325 217T351 328Z"></path></g></g></g></svg></mjx-container></span>.</div>
</div></div>
<div>
<div class="proof" style="font-style: normal; padding: 10px 0;"><span style="font-style: italic;">Proof.</span><span style="margin-right: 10px"></span><div style="display: inline" data-display="inline">To prove it by contradiction try and assume that the statement is false,<br>
proceed from there and at some point you will arrive to a contradiction.<span style="float: right"><span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: 0" xmlns="http://www.w3.org/2000/svg" width="1.76ex" height="1.559ex" role="img" focusable="false" viewBox="0 -689 778 689"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="25FB" d="M71 0Q59 4 55 16V346L56 676Q64 686 70 689H709Q719 681 722 674V15Q719 10 709 1L390 0H71ZM682 40V649H95V40H682Z"></path></g></g></g></svg></mjx-container></span></span></div>
</div></div>`
  },  
  {
    latex: '\\newtheorem{theorem}{Theorem}[section]\n' +
      '\\newtheorem{lemma}[theorem]{Lemma}\n' +
      '\n' +
      '\\section{Introduction}\n' +
      '\n' +
      '\\begin{lemma}\n' +
      'Given two line segments whose lengths are \\(a\\) and \\(b\\) respectively there \n' +
      'is a real number \\(r\\) such that \\(b=ra\\).\n' +
      '\\end{lemma}\n' +
      '\n' +
      '\\renewcommand\\qedsymbol{$\\blacksquare$}\n' +
      '\n' +
      '\\begin{proof}\n' +
      'To prove it by contradiction try and assume that the statement is false,\n' +
      'proceed from there and at some point you will arrive to a contradiction.\n' +
      '\\end{proof}\n' +
      '\n' +
      '\\renewcommand\\qedsymbol{QED}\n' +
      '\n' +
      '\\begin{proof}\n' +
      'To prove it by contradiction try and assume that the statement is false,\n' +
      'proceed from there and at some point you will arrive to a contradiction.\n' +
      '\\end{proof}',
    html: `<div style="margin-top: 0; margin-bottom: 0;"></div>
<h2 type="section" class="section-title" id="introduction">
<span class="section-number">1. </span>Introduction</h2>
<div>
<div class="theorem" style="font-style: italic; padding: 10px 0;"><span style="font-weight: bold; font-style: normal;" class="theorem-title">Lemma 1.1.</span><span style="margin-right: 16px"></span><div style="display: inline" data-display="inline">Given two line segments whose lengths are <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.023ex" xmlns="http://www.w3.org/2000/svg" width="1.197ex" height="1.02ex" role="img" focusable="false" viewBox="0 -441 529 451"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="61" d="M33 157Q33 258 109 349T280 441Q331 441 370 392Q386 422 416 422Q429 422 439 414T449 394Q449 381 412 234T374 68Q374 43 381 35T402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487Q506 153 506 144Q506 138 501 117T481 63T449 13Q436 0 417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157ZM351 328Q351 334 346 350T323 385T277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q217 26 254 59T298 110Q300 114 325 217T351 328Z"></path></g></g></g></svg></mjx-container></span> and <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.025ex" xmlns="http://www.w3.org/2000/svg" width="0.971ex" height="1.595ex" role="img" focusable="false" viewBox="0 -694 429 705"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="62" d="M73 647Q73 657 77 670T89 683Q90 683 161 688T234 694Q246 694 246 685T212 542Q204 508 195 472T180 418L176 399Q176 396 182 402Q231 442 283 442Q345 442 383 396T422 280Q422 169 343 79T173 -11Q123 -11 82 27T40 150V159Q40 180 48 217T97 414Q147 611 147 623T109 637Q104 637 101 637H96Q86 637 83 637T76 640T73 647ZM336 325V331Q336 405 275 405Q258 405 240 397T207 376T181 352T163 330L157 322L136 236Q114 150 114 114Q114 66 138 42Q154 26 178 26Q211 26 245 58Q270 81 285 114T318 219Q336 291 336 325Z"></path></g></g></g></svg></mjx-container></span> respectively there<br>
is a real number <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.025ex" xmlns="http://www.w3.org/2000/svg" width="1.02ex" height="1.025ex" role="img" focusable="false" viewBox="0 -442 451 453"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="72" d="M21 287Q22 290 23 295T28 317T38 348T53 381T73 411T99 433T132 442Q161 442 183 430T214 408T225 388Q227 382 228 382T236 389Q284 441 347 441H350Q398 441 422 400Q430 381 430 363Q430 333 417 315T391 292T366 288Q346 288 334 299T322 328Q322 376 378 392Q356 405 342 405Q286 405 239 331Q229 315 224 298T190 165Q156 25 151 16Q138 -11 108 -11Q95 -11 87 -5T76 7T74 17Q74 30 114 189T154 366Q154 405 128 405Q107 405 92 377T68 316T57 280Q55 278 41 278H27Q21 284 21 287Z"></path></g></g></g></svg></mjx-container></span> such that <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.186ex" xmlns="http://www.w3.org/2000/svg" width="6.205ex" height="1.756ex" role="img" focusable="false" viewBox="0 -694 2742.6 776"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="62" d="M73 647Q73 657 77 670T89 683Q90 683 161 688T234 694Q246 694 246 685T212 542Q204 508 195 472T180 418L176 399Q176 396 182 402Q231 442 283 442Q345 442 383 396T422 280Q422 169 343 79T173 -11Q123 -11 82 27T40 150V159Q40 180 48 217T97 414Q147 611 147 623T109 637Q104 637 101 637H96Q86 637 83 637T76 640T73 647ZM336 325V331Q336 405 275 405Q258 405 240 397T207 376T181 352T163 330L157 322L136 236Q114 150 114 114Q114 66 138 42Q154 26 178 26Q211 26 245 58Q270 81 285 114T318 219Q336 291 336 325Z"></path></g><g data-mml-node="mo" transform="translate(706.8, 0)"><path data-c="3D" d="M56 347Q56 360 70 367H707Q722 359 722 347Q722 336 708 328L390 327H72Q56 332 56 347ZM56 153Q56 168 72 173H708Q722 163 722 153Q722 140 707 133H70Q56 140 56 153Z"></path></g><g data-mml-node="mi" transform="translate(1762.6, 0)"><path data-c="72" d="M21 287Q22 290 23 295T28 317T38 348T53 381T73 411T99 433T132 442Q161 442 183 430T214 408T225 388Q227 382 228 382T236 389Q284 441 347 441H350Q398 441 422 400Q430 381 430 363Q430 333 417 315T391 292T366 288Q346 288 334 299T322 328Q322 376 378 392Q356 405 342 405Q286 405 239 331Q229 315 224 298T190 165Q156 25 151 16Q138 -11 108 -11Q95 -11 87 -5T76 7T74 17Q74 30 114 189T154 366Q154 405 128 405Q107 405 92 377T68 316T57 280Q55 278 41 278H27Q21 284 21 287Z"></path></g><g data-mml-node="mi" transform="translate(2213.6, 0)"><path data-c="61" d="M33 157Q33 258 109 349T280 441Q331 441 370 392Q386 422 416 422Q429 422 439 414T449 394Q449 381 412 234T374 68Q374 43 381 35T402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487Q506 153 506 144Q506 138 501 117T481 63T449 13Q436 0 417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157ZM351 328Q351 334 346 350T323 385T277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q217 26 254 59T298 110Q300 114 325 217T351 328Z"></path></g></g></g></svg></mjx-container></span>.</div>
</div></div>
<div style="margin-top: 0; margin-bottom: 0;"></div>
<div>
<div class="proof" style="font-style: normal; padding: 10px 0;"><span style="font-style: italic;">Proof.</span><span style="margin-right: 10px"></span><div style="display: inline" data-display="inline">To prove it by contradiction try and assume that the statement is false,<br>
proceed from there and at some point you will arrive to a contradiction.<span style="float: right"><span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: 0" xmlns="http://www.w3.org/2000/svg" width="1.76ex" height="1.559ex" role="img" focusable="false" viewBox="0 -689 778 689"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="25FC" d="M71 0Q59 4 55 16V346L56 676Q64 686 70 689H709Q719 681 722 674V15Q719 10 709 1L390 0H71Z"></path></g></g></g></svg></mjx-container></span></span></div>
</div></div>
<div style="margin-top: 0; margin-bottom: 0;"></div>
<div>
<div class="proof" style="font-style: normal; padding: 10px 0;"><span style="font-style: italic;">Proof.</span><span style="margin-right: 10px"></span><div style="display: inline" data-display="inline">To prove it by contradiction try and assume that the statement is false,<br>
proceed from there and at some point you will arrive to a contradiction.<span style="float: right">QED</span></div>
</div></div>`
  },  
  {
    latex: '\\newtheorem{theorem}{Theorem}[section]\n' +
      '\\newtheorem{lemma}[theorem]{Lemma}\n' +
      '\\newtheorem{conj}[theorem]{Conjecture}\n' +
      '\n' +
      '\\begin{theorem}[Wolfenstein, 1572]\n' +
      'People have fun with beer.\n' +
      '\\end{theorem}\n' +
      '\n' +
      '\\begin{lemma}[Ventura, 1992]\n' +
      'Guys have fun in cathouses.\n' +
      '\\end{lemma}\n' +
      '\n' +
      '\\section{Moo}\n' +
      '\n' +
      '\\begin{theorem}[Lu, 2000]\n' +
      'God is bovine.\n' +
      '\\end{theorem}\n' +
      '\n' +
      '\\begin{conj}[Mihelich, 2002]\n' +
      'Yuran Lu is insane.\n' +
      '\\end{conj}\n' +
      '\n' +
      '\\begin{proof}\n' +
      '(Heuristic.) Yuran moos a lot and thinks God is a cow. ’Nuff said.\n' +
      '\\end{proof}',
    html: `<div style="margin-top: 0; margin-bottom: 0;"></div>
<div>
<div class="theorem" style="font-style: italic; padding: 10px 0;"><span style="font-weight: bold; font-style: normal;" class="theorem-title">Theorem 0.1.</span><span style="margin-right: 10px"></span><span style="font-weight: bold; font-style: normal;">(Wolfenstein, 1572)</span><span style="margin-right: 16px"></span><div style="display: inline" data-display="inline">People have fun with beer.</div>
</div></div>
<div>
<div class="theorem" style="font-style: italic; padding: 10px 0;"><span style="font-weight: bold; font-style: normal;" class="theorem-title">Lemma 0.2.</span><span style="margin-right: 10px"></span><span style="font-weight: bold; font-style: normal;">(Ventura, 1992)</span><span style="margin-right: 16px"></span><div style="display: inline" data-display="inline">Guys have fun in cathouses.</div>
</div></div>
<h2 type="section" class="section-title" id="moo">
<span class="section-number">1. </span>Moo</h2>
<div>
<div class="theorem" style="font-style: italic; padding: 10px 0;"><span style="font-weight: bold; font-style: normal;" class="theorem-title">Theorem 1.1.</span><span style="margin-right: 10px"></span><span style="font-weight: bold; font-style: normal;">(Lu, 2000)</span><span style="margin-right: 16px"></span><div style="display: inline" data-display="inline">God is bovine.</div>
</div></div>
<div>
<div class="theorem" style="font-style: italic; padding: 10px 0;"><span style="font-weight: bold; font-style: normal;" class="theorem-title">Conjecture 1.2.</span><span style="margin-right: 10px"></span><span style="font-weight: bold; font-style: normal;">(Mihelich, 2002)</span><span style="margin-right: 16px"></span><div style="display: inline" data-display="inline">Yuran Lu is insane.</div>
</div></div>
<div>
<div class="proof" style="font-style: normal; padding: 10px 0;"><span style="font-style: italic;">Proof.</span><span style="margin-right: 10px"></span><div style="display: inline" data-display="inline">(Heuristic.) Yuran moos a lot and thinks God is a cow. ’Nuff said.<span style="float: right"><span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: 0" xmlns="http://www.w3.org/2000/svg" width="1.76ex" height="1.559ex" role="img" focusable="false" viewBox="0 -689 778 689"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="25FB" d="M71 0Q59 4 55 16V346L56 676Q64 686 70 689H709Q719 681 722 674V15Q719 10 709 1L390 0H71ZM682 40V649H95V40H682Z"></path></g></g></g></svg></mjx-container></span></span></div>
</div></div>`
  },  
  {
    latex: '\\newtheorem{теорема}{定理}\n' +
      '\n' +
      '\\section{Introduction}\n' +
      'Theorems can easily be defined:\n' +
      '\n' +
      '\\begin{теорема}\n' +
      'Let \\(f\\) be a function whose derivative exists in every point, then \\(f\\) \n' +
      'is a continuous function.\n' +
      '\\end{теорема}',
    html: `<div style="margin-top: 0; margin-bottom: 0;"></div>
<h2 type="section" class="section-title" id="introduction">
<span class="section-number">1. </span>Introduction</h2>
<div>Theorems can easily be defined:</div>
<div>
<div class="theorem" style="font-style: italic; padding: 10px 0;"><span style="font-weight: bold; font-style: normal;" class="theorem-title">定理 1.</span><span style="margin-right: 16px"></span><div style="display: inline" data-display="inline">Let <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.464ex" xmlns="http://www.w3.org/2000/svg" width="1.244ex" height="2.059ex" role="img" focusable="false" viewBox="0 -705 550 910"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="66" d="M118 -162Q120 -162 124 -164T135 -167T147 -168Q160 -168 171 -155T187 -126Q197 -99 221 27T267 267T289 382V385H242Q195 385 192 387Q188 390 188 397L195 425Q197 430 203 430T250 431Q298 431 298 432Q298 434 307 482T319 540Q356 705 465 705Q502 703 526 683T550 630Q550 594 529 578T487 561Q443 561 443 603Q443 622 454 636T478 657L487 662Q471 668 457 668Q445 668 434 658T419 630Q412 601 403 552T387 469T380 433Q380 431 435 431Q480 431 487 430T498 424Q499 420 496 407T491 391Q489 386 482 386T428 385H372L349 263Q301 15 282 -47Q255 -132 212 -173Q175 -205 139 -205Q107 -205 81 -186T55 -132Q55 -95 76 -78T118 -61Q162 -61 162 -103Q162 -122 151 -136T127 -157L118 -162Z"></path></g></g></g></svg></mjx-container></span> be a function whose derivative exists in every point, then <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.464ex" xmlns="http://www.w3.org/2000/svg" width="1.244ex" height="2.059ex" role="img" focusable="false" viewBox="0 -705 550 910"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="66" d="M118 -162Q120 -162 124 -164T135 -167T147 -168Q160 -168 171 -155T187 -126Q197 -99 221 27T267 267T289 382V385H242Q195 385 192 387Q188 390 188 397L195 425Q197 430 203 430T250 431Q298 431 298 432Q298 434 307 482T319 540Q356 705 465 705Q502 703 526 683T550 630Q550 594 529 578T487 561Q443 561 443 603Q443 622 454 636T478 657L487 662Q471 668 457 668Q445 668 434 658T419 630Q412 601 403 552T387 469T380 433Q380 431 435 431Q480 431 487 430T498 424Q499 420 496 407T491 391Q489 386 482 386T428 385H372L349 263Q301 15 282 -47Q255 -132 212 -173Q175 -205 139 -205Q107 -205 81 -186T55 -132Q55 -95 76 -78T118 -61Q162 -61 162 -103Q162 -122 151 -136T127 -157L118 -162Z"></path></g></g></g></svg></mjx-container></span><br>
is a continuous function.</div>
</div></div>`
  },
  {
    latex: '\\newtheorem{theorem}{Theorem $x^y$}\n' +
      '\n' +
      '\\begin{theorem}[Can be math $x^y$]\n' +
      'Let \\(f\\) be a function whose derivative exists in every point, then \\(f\\) \n' +
      'is a continuous function.\n' +
      '\\end{theorem}',
    html: `<div style="margin-top: 0; margin-bottom: 0;"></div>
<div>
<div class="theorem" style="font-style: italic; padding: 10px 0;"><span style="font-weight: bold; font-style: normal;" class="theorem-title">Theorem <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.025ex" xmlns="http://www.w3.org/2000/svg" width="2.191ex" height="1.553ex" role="img" focusable="false" viewBox="0 -675.5 968.5 686.5"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="msup"><g data-mml-node="mi"><path data-c="78" d="M52 289Q59 331 106 386T222 442Q257 442 286 424T329 379Q371 442 430 442Q467 442 494 420T522 361Q522 332 508 314T481 292T458 288Q439 288 427 299T415 328Q415 374 465 391Q454 404 425 404Q412 404 406 402Q368 386 350 336Q290 115 290 78Q290 50 306 38T341 26Q378 26 414 59T463 140Q466 150 469 151T485 153H489Q504 153 504 145Q504 144 502 134Q486 77 440 33T333 -11Q263 -11 227 52Q186 -10 133 -10H127Q78 -10 57 16T35 71Q35 103 54 123T99 143Q142 143 142 101Q142 81 130 66T107 46T94 41L91 40Q91 39 97 36T113 29T132 26Q168 26 194 71Q203 87 217 139T245 247T261 313Q266 340 266 352Q266 380 251 392T217 404Q177 404 142 372T93 290Q91 281 88 280T72 278H58Q52 284 52 289Z"></path></g><g data-mml-node="mi" transform="translate(572, 363) scale(0.707)"><path data-c="79" d="M21 287Q21 301 36 335T84 406T158 442Q199 442 224 419T250 355Q248 336 247 334Q247 331 231 288T198 191T182 105Q182 62 196 45T238 27Q261 27 281 38T312 61T339 94Q339 95 344 114T358 173T377 247Q415 397 419 404Q432 431 462 431Q475 431 483 424T494 412T496 403Q496 390 447 193T391 -23Q363 -106 294 -155T156 -205Q111 -205 77 -183T43 -117Q43 -95 50 -80T69 -58T89 -48T106 -45Q150 -45 150 -87Q150 -107 138 -122T115 -142T102 -147L99 -148Q101 -153 118 -160T152 -167H160Q177 -167 186 -165Q219 -156 247 -127T290 -65T313 -9T321 21L315 17Q309 13 296 6T270 -6Q250 -11 231 -11Q185 -11 150 11T104 82Q103 89 103 113Q103 170 138 262T173 379Q173 380 173 381Q173 390 173 393T169 400T158 404H154Q131 404 112 385T82 344T65 302T57 280Q55 278 41 278H27Q21 284 21 287Z"></path></g></g></g></g></svg></mjx-container></span> 1.</span><span style="margin-right: 10px"></span><span style="font-weight: bold; font-style: normal;">(Can be math <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.025ex" xmlns="http://www.w3.org/2000/svg" width="2.191ex" height="1.553ex" role="img" focusable="false" viewBox="0 -675.5 968.5 686.5"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="msup"><g data-mml-node="mi"><path data-c="78" d="M52 289Q59 331 106 386T222 442Q257 442 286 424T329 379Q371 442 430 442Q467 442 494 420T522 361Q522 332 508 314T481 292T458 288Q439 288 427 299T415 328Q415 374 465 391Q454 404 425 404Q412 404 406 402Q368 386 350 336Q290 115 290 78Q290 50 306 38T341 26Q378 26 414 59T463 140Q466 150 469 151T485 153H489Q504 153 504 145Q504 144 502 134Q486 77 440 33T333 -11Q263 -11 227 52Q186 -10 133 -10H127Q78 -10 57 16T35 71Q35 103 54 123T99 143Q142 143 142 101Q142 81 130 66T107 46T94 41L91 40Q91 39 97 36T113 29T132 26Q168 26 194 71Q203 87 217 139T245 247T261 313Q266 340 266 352Q266 380 251 392T217 404Q177 404 142 372T93 290Q91 281 88 280T72 278H58Q52 284 52 289Z"></path></g><g data-mml-node="mi" transform="translate(572, 363) scale(0.707)"><path data-c="79" d="M21 287Q21 301 36 335T84 406T158 442Q199 442 224 419T250 355Q248 336 247 334Q247 331 231 288T198 191T182 105Q182 62 196 45T238 27Q261 27 281 38T312 61T339 94Q339 95 344 114T358 173T377 247Q415 397 419 404Q432 431 462 431Q475 431 483 424T494 412T496 403Q496 390 447 193T391 -23Q363 -106 294 -155T156 -205Q111 -205 77 -183T43 -117Q43 -95 50 -80T69 -58T89 -48T106 -45Q150 -45 150 -87Q150 -107 138 -122T115 -142T102 -147L99 -148Q101 -153 118 -160T152 -167H160Q177 -167 186 -165Q219 -156 247 -127T290 -65T313 -9T321 21L315 17Q309 13 296 6T270 -6Q250 -11 231 -11Q185 -11 150 11T104 82Q103 89 103 113Q103 170 138 262T173 379Q173 380 173 381Q173 390 173 393T169 400T158 404H154Q131 404 112 385T82 344T65 302T57 280Q55 278 41 278H27Q21 284 21 287Z"></path></g></g></g></g></svg></mjx-container></span>)</span><span style="margin-right: 16px"></span><div style="display: inline" data-display="inline">Let <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.464ex" xmlns="http://www.w3.org/2000/svg" width="1.244ex" height="2.059ex" role="img" focusable="false" viewBox="0 -705 550 910"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="66" d="M118 -162Q120 -162 124 -164T135 -167T147 -168Q160 -168 171 -155T187 -126Q197 -99 221 27T267 267T289 382V385H242Q195 385 192 387Q188 390 188 397L195 425Q197 430 203 430T250 431Q298 431 298 432Q298 434 307 482T319 540Q356 705 465 705Q502 703 526 683T550 630Q550 594 529 578T487 561Q443 561 443 603Q443 622 454 636T478 657L487 662Q471 668 457 668Q445 668 434 658T419 630Q412 601 403 552T387 469T380 433Q380 431 435 431Q480 431 487 430T498 424Q499 420 496 407T491 391Q489 386 482 386T428 385H372L349 263Q301 15 282 -47Q255 -132 212 -173Q175 -205 139 -205Q107 -205 81 -186T55 -132Q55 -95 76 -78T118 -61Q162 -61 162 -103Q162 -122 151 -136T127 -157L118 -162Z"></path></g></g></g></svg></mjx-container></span> be a function whose derivative exists in every point, then <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.464ex" xmlns="http://www.w3.org/2000/svg" width="1.244ex" height="2.059ex" role="img" focusable="false" viewBox="0 -705 550 910"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="66" d="M118 -162Q120 -162 124 -164T135 -167T147 -168Q160 -168 171 -155T187 -126Q197 -99 221 27T267 267T289 382V385H242Q195 385 192 387Q188 390 188 397L195 425Q197 430 203 430T250 431Q298 431 298 432Q298 434 307 482T319 540Q356 705 465 705Q502 703 526 683T550 630Q550 594 529 578T487 561Q443 561 443 603Q443 622 454 636T478 657L487 662Q471 668 457 668Q445 668 434 658T419 630Q412 601 403 552T387 469T380 433Q380 431 435 431Q480 431 487 430T498 424Q499 420 496 407T491 391Q489 386 482 386T428 385H372L349 263Q301 15 282 -47Q255 -132 212 -173Q175 -205 139 -205Q107 -205 81 -186T55 -132Q55 -95 76 -78T118 -61Q162 -61 162 -103Q162 -122 151 -136T127 -157L118 -162Z"></path></g></g></g></svg></mjx-container></span><br>
is a continuous function.</div>
</div></div>`
  },  
  {
    latex: '\\newtheorem{theorem}{Theorem}\n' +
      '\n' +
      '\\section{Introduction}\n' +
      'Theorems can easily be defined:\n' +
      '\n' +
      '\\begin{theorem}\n' +
      'Let \\(f\\) be a function whose derivative exists in every point, then \\(f\\) \n' +
      'is a continuous function.\n' +
      '\\end{theorem}\n' +
      '\n' +
      '\\setcounter{theorem}{0}\n' +
      '\n' +
      '\\begin{theorem}\n' +
      'Let \\(f\\) be a function whose derivative exists in every point, then \\(f\\) \n' +
      'is a continuous function.\n' +
      '\\end{theorem}\n' +
      '\n' +
      '\\setcounter{theorem}{-3}\n' +
      '\n' +
      '\\begin{theorem}\n' +
      'Let \\(f\\) be a function whose derivative exists in every point, then \\(f\\) \n' +
      'is a continuous function.\n' +
      '\\end{theorem}',
    html: `<div style="margin-top: 0; margin-bottom: 0;"></div>
<h2 type="section" class="section-title" id="introduction">
<span class="section-number">1. </span>Introduction</h2>
<div>Theorems can easily be defined:</div>
<div>
<div class="theorem" style="font-style: italic; padding: 10px 0;"><span style="font-weight: bold; font-style: normal;" class="theorem-title">Theorem 1.</span><span style="margin-right: 16px"></span><div style="display: inline" data-display="inline">Let <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.464ex" xmlns="http://www.w3.org/2000/svg" width="1.244ex" height="2.059ex" role="img" focusable="false" viewBox="0 -705 550 910"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="66" d="M118 -162Q120 -162 124 -164T135 -167T147 -168Q160 -168 171 -155T187 -126Q197 -99 221 27T267 267T289 382V385H242Q195 385 192 387Q188 390 188 397L195 425Q197 430 203 430T250 431Q298 431 298 432Q298 434 307 482T319 540Q356 705 465 705Q502 703 526 683T550 630Q550 594 529 578T487 561Q443 561 443 603Q443 622 454 636T478 657L487 662Q471 668 457 668Q445 668 434 658T419 630Q412 601 403 552T387 469T380 433Q380 431 435 431Q480 431 487 430T498 424Q499 420 496 407T491 391Q489 386 482 386T428 385H372L349 263Q301 15 282 -47Q255 -132 212 -173Q175 -205 139 -205Q107 -205 81 -186T55 -132Q55 -95 76 -78T118 -61Q162 -61 162 -103Q162 -122 151 -136T127 -157L118 -162Z"></path></g></g></g></svg></mjx-container></span> be a function whose derivative exists in every point, then <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.464ex" xmlns="http://www.w3.org/2000/svg" width="1.244ex" height="2.059ex" role="img" focusable="false" viewBox="0 -705 550 910"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="66" d="M118 -162Q120 -162 124 -164T135 -167T147 -168Q160 -168 171 -155T187 -126Q197 -99 221 27T267 267T289 382V385H242Q195 385 192 387Q188 390 188 397L195 425Q197 430 203 430T250 431Q298 431 298 432Q298 434 307 482T319 540Q356 705 465 705Q502 703 526 683T550 630Q550 594 529 578T487 561Q443 561 443 603Q443 622 454 636T478 657L487 662Q471 668 457 668Q445 668 434 658T419 630Q412 601 403 552T387 469T380 433Q380 431 435 431Q480 431 487 430T498 424Q499 420 496 407T491 391Q489 386 482 386T428 385H372L349 263Q301 15 282 -47Q255 -132 212 -173Q175 -205 139 -205Q107 -205 81 -186T55 -132Q55 -95 76 -78T118 -61Q162 -61 162 -103Q162 -122 151 -136T127 -157L118 -162Z"></path></g></g></g></svg></mjx-container></span><br>
is a continuous function.</div>
</div></div>
<div style="margin-top: 0; margin-bottom: 0;"></div>
<div>
<div class="theorem" style="font-style: italic; padding: 10px 0;"><span style="font-weight: bold; font-style: normal;" class="theorem-title">Theorem 1.</span><span style="margin-right: 16px"></span><div style="display: inline" data-display="inline">Let <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.464ex" xmlns="http://www.w3.org/2000/svg" width="1.244ex" height="2.059ex" role="img" focusable="false" viewBox="0 -705 550 910"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="66" d="M118 -162Q120 -162 124 -164T135 -167T147 -168Q160 -168 171 -155T187 -126Q197 -99 221 27T267 267T289 382V385H242Q195 385 192 387Q188 390 188 397L195 425Q197 430 203 430T250 431Q298 431 298 432Q298 434 307 482T319 540Q356 705 465 705Q502 703 526 683T550 630Q550 594 529 578T487 561Q443 561 443 603Q443 622 454 636T478 657L487 662Q471 668 457 668Q445 668 434 658T419 630Q412 601 403 552T387 469T380 433Q380 431 435 431Q480 431 487 430T498 424Q499 420 496 407T491 391Q489 386 482 386T428 385H372L349 263Q301 15 282 -47Q255 -132 212 -173Q175 -205 139 -205Q107 -205 81 -186T55 -132Q55 -95 76 -78T118 -61Q162 -61 162 -103Q162 -122 151 -136T127 -157L118 -162Z"></path></g></g></g></svg></mjx-container></span> be a function whose derivative exists in every point, then <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.464ex" xmlns="http://www.w3.org/2000/svg" width="1.244ex" height="2.059ex" role="img" focusable="false" viewBox="0 -705 550 910"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="66" d="M118 -162Q120 -162 124 -164T135 -167T147 -168Q160 -168 171 -155T187 -126Q197 -99 221 27T267 267T289 382V385H242Q195 385 192 387Q188 390 188 397L195 425Q197 430 203 430T250 431Q298 431 298 432Q298 434 307 482T319 540Q356 705 465 705Q502 703 526 683T550 630Q550 594 529 578T487 561Q443 561 443 603Q443 622 454 636T478 657L487 662Q471 668 457 668Q445 668 434 658T419 630Q412 601 403 552T387 469T380 433Q380 431 435 431Q480 431 487 430T498 424Q499 420 496 407T491 391Q489 386 482 386T428 385H372L349 263Q301 15 282 -47Q255 -132 212 -173Q175 -205 139 -205Q107 -205 81 -186T55 -132Q55 -95 76 -78T118 -61Q162 -61 162 -103Q162 -122 151 -136T127 -157L118 -162Z"></path></g></g></g></svg></mjx-container></span><br>
is a continuous function.</div>
</div></div>
<div style="margin-top: 0; margin-bottom: 0;"></div>
<div>
<div class="theorem" style="font-style: italic; padding: 10px 0;"><span style="font-weight: bold; font-style: normal;" class="theorem-title">Theorem -2.</span><span style="margin-right: 16px"></span><div style="display: inline" data-display="inline">Let <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.464ex" xmlns="http://www.w3.org/2000/svg" width="1.244ex" height="2.059ex" role="img" focusable="false" viewBox="0 -705 550 910"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="66" d="M118 -162Q120 -162 124 -164T135 -167T147 -168Q160 -168 171 -155T187 -126Q197 -99 221 27T267 267T289 382V385H242Q195 385 192 387Q188 390 188 397L195 425Q197 430 203 430T250 431Q298 431 298 432Q298 434 307 482T319 540Q356 705 465 705Q502 703 526 683T550 630Q550 594 529 578T487 561Q443 561 443 603Q443 622 454 636T478 657L487 662Q471 668 457 668Q445 668 434 658T419 630Q412 601 403 552T387 469T380 433Q380 431 435 431Q480 431 487 430T498 424Q499 420 496 407T491 391Q489 386 482 386T428 385H372L349 263Q301 15 282 -47Q255 -132 212 -173Q175 -205 139 -205Q107 -205 81 -186T55 -132Q55 -95 76 -78T118 -61Q162 -61 162 -103Q162 -122 151 -136T127 -157L118 -162Z"></path></g></g></g></svg></mjx-container></span> be a function whose derivative exists in every point, then <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.464ex" xmlns="http://www.w3.org/2000/svg" width="1.244ex" height="2.059ex" role="img" focusable="false" viewBox="0 -705 550 910"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="66" d="M118 -162Q120 -162 124 -164T135 -167T147 -168Q160 -168 171 -155T187 -126Q197 -99 221 27T267 267T289 382V385H242Q195 385 192 387Q188 390 188 397L195 425Q197 430 203 430T250 431Q298 431 298 432Q298 434 307 482T319 540Q356 705 465 705Q502 703 526 683T550 630Q550 594 529 578T487 561Q443 561 443 603Q443 622 454 636T478 657L487 662Q471 668 457 668Q445 668 434 658T419 630Q412 601 403 552T387 469T380 433Q380 431 435 431Q480 431 487 430T498 424Q499 420 496 407T491 391Q489 386 482 386T428 385H372L349 263Q301 15 282 -47Q255 -132 212 -173Q175 -205 139 -205Q107 -205 81 -186T55 -132Q55 -95 76 -78T118 -61Q162 -61 162 -103Q162 -122 151 -136T127 -157L118 -162Z"></path></g></g></g></svg></mjx-container></span><br>
is a continuous function.</div>
</div></div>`
  },  
  {
    latex: '\\newtheorem{theorem}{Theorem}[section]\n' +
      '\\newtheorem{corollary}{Corollary}[theorem]\n' +
      '\n' +
      '\\section{Introduction}\n' +
      'Theorems can easily be defined:\n' +
      '\n' +
      '\\begin{theorem}\n' +
      'Let \\(f\\) be a function whose derivative exists in every point, then \\(f\\) \n' +
      'is a continuous function.\n' +
      '\\end{theorem}\n' +
      '\n' +
      '\\begin{corollary}\n' +
      'There\'s no right rectangle whose sides measure 3cm, 4cm, and 6cm.\n' +
      '\\end{corollary}\n' +
      '\n' +
      '\\setcounter{theorem}{5}\n' +
      '\n' +
      '\\begin{theorem}\n' +
      'Let \\(f\\) be a function whose derivative exists in every point, then \\(f\\) \n' +
      'is a continuous function.\n' +
      '\\end{theorem}\n' +
      '\n' +
      '\\begin{corollary}\n' +
      'There\'s no right rectangle whose sides measure 3cm, 4cm, and 6cm.\n' +
      '\\end{corollary}\n' +
      '\n' +
      '\\setcounter{theorem}{0}\n' +
      '\n' +
      '\\begin{theorem}\n' +
      'Let \\(f\\) be a function whose derivative exists in every point, then \\(f\\) \n' +
      'is a continuous function.\n' +
      '\\end{theorem}\n' +
      '\n' +
      '\\begin{corollary}\n' +
      'There\'s no right rectangle whose sides measure 3cm, 4cm, and 6cm.\n' +
      '\\end{corollary}',
    html: `<div style="margin-top: 0; margin-bottom: 0;"></div>
<h2 type="section" class="section-title" id="introduction">
<span class="section-number">1. </span>Introduction</h2>
<div>Theorems can easily be defined:</div>
<div>
<div class="theorem" style="font-style: italic; padding: 10px 0;"><span style="font-weight: bold; font-style: normal;" class="theorem-title">Theorem 1.1.</span><span style="margin-right: 16px"></span><div style="display: inline" data-display="inline">Let <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.464ex" xmlns="http://www.w3.org/2000/svg" width="1.244ex" height="2.059ex" role="img" focusable="false" viewBox="0 -705 550 910"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="66" d="M118 -162Q120 -162 124 -164T135 -167T147 -168Q160 -168 171 -155T187 -126Q197 -99 221 27T267 267T289 382V385H242Q195 385 192 387Q188 390 188 397L195 425Q197 430 203 430T250 431Q298 431 298 432Q298 434 307 482T319 540Q356 705 465 705Q502 703 526 683T550 630Q550 594 529 578T487 561Q443 561 443 603Q443 622 454 636T478 657L487 662Q471 668 457 668Q445 668 434 658T419 630Q412 601 403 552T387 469T380 433Q380 431 435 431Q480 431 487 430T498 424Q499 420 496 407T491 391Q489 386 482 386T428 385H372L349 263Q301 15 282 -47Q255 -132 212 -173Q175 -205 139 -205Q107 -205 81 -186T55 -132Q55 -95 76 -78T118 -61Q162 -61 162 -103Q162 -122 151 -136T127 -157L118 -162Z"></path></g></g></g></svg></mjx-container></span> be a function whose derivative exists in every point, then <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.464ex" xmlns="http://www.w3.org/2000/svg" width="1.244ex" height="2.059ex" role="img" focusable="false" viewBox="0 -705 550 910"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="66" d="M118 -162Q120 -162 124 -164T135 -167T147 -168Q160 -168 171 -155T187 -126Q197 -99 221 27T267 267T289 382V385H242Q195 385 192 387Q188 390 188 397L195 425Q197 430 203 430T250 431Q298 431 298 432Q298 434 307 482T319 540Q356 705 465 705Q502 703 526 683T550 630Q550 594 529 578T487 561Q443 561 443 603Q443 622 454 636T478 657L487 662Q471 668 457 668Q445 668 434 658T419 630Q412 601 403 552T387 469T380 433Q380 431 435 431Q480 431 487 430T498 424Q499 420 496 407T491 391Q489 386 482 386T428 385H372L349 263Q301 15 282 -47Q255 -132 212 -173Q175 -205 139 -205Q107 -205 81 -186T55 -132Q55 -95 76 -78T118 -61Q162 -61 162 -103Q162 -122 151 -136T127 -157L118 -162Z"></path></g></g></g></svg></mjx-container></span><br>
is a continuous function.</div>
</div></div>
<div>
<div class="theorem" style="font-style: italic; padding: 10px 0;"><span style="font-weight: bold; font-style: normal;" class="theorem-title">Corollary 1.1.1.</span><span style="margin-right: 16px"></span><div style="display: inline" data-display="inline">There’s no right rectangle whose sides measure 3cm, 4cm, and 6cm.</div>
</div></div>
<div style="margin-top: 0; margin-bottom: 0;"></div>
<div>
<div class="theorem" style="font-style: italic; padding: 10px 0;"><span style="font-weight: bold; font-style: normal;" class="theorem-title">Theorem 1.6.</span><span style="margin-right: 16px"></span><div style="display: inline" data-display="inline">Let <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.464ex" xmlns="http://www.w3.org/2000/svg" width="1.244ex" height="2.059ex" role="img" focusable="false" viewBox="0 -705 550 910"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="66" d="M118 -162Q120 -162 124 -164T135 -167T147 -168Q160 -168 171 -155T187 -126Q197 -99 221 27T267 267T289 382V385H242Q195 385 192 387Q188 390 188 397L195 425Q197 430 203 430T250 431Q298 431 298 432Q298 434 307 482T319 540Q356 705 465 705Q502 703 526 683T550 630Q550 594 529 578T487 561Q443 561 443 603Q443 622 454 636T478 657L487 662Q471 668 457 668Q445 668 434 658T419 630Q412 601 403 552T387 469T380 433Q380 431 435 431Q480 431 487 430T498 424Q499 420 496 407T491 391Q489 386 482 386T428 385H372L349 263Q301 15 282 -47Q255 -132 212 -173Q175 -205 139 -205Q107 -205 81 -186T55 -132Q55 -95 76 -78T118 -61Q162 -61 162 -103Q162 -122 151 -136T127 -157L118 -162Z"></path></g></g></g></svg></mjx-container></span> be a function whose derivative exists in every point, then <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.464ex" xmlns="http://www.w3.org/2000/svg" width="1.244ex" height="2.059ex" role="img" focusable="false" viewBox="0 -705 550 910"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="66" d="M118 -162Q120 -162 124 -164T135 -167T147 -168Q160 -168 171 -155T187 -126Q197 -99 221 27T267 267T289 382V385H242Q195 385 192 387Q188 390 188 397L195 425Q197 430 203 430T250 431Q298 431 298 432Q298 434 307 482T319 540Q356 705 465 705Q502 703 526 683T550 630Q550 594 529 578T487 561Q443 561 443 603Q443 622 454 636T478 657L487 662Q471 668 457 668Q445 668 434 658T419 630Q412 601 403 552T387 469T380 433Q380 431 435 431Q480 431 487 430T498 424Q499 420 496 407T491 391Q489 386 482 386T428 385H372L349 263Q301 15 282 -47Q255 -132 212 -173Q175 -205 139 -205Q107 -205 81 -186T55 -132Q55 -95 76 -78T118 -61Q162 -61 162 -103Q162 -122 151 -136T127 -157L118 -162Z"></path></g></g></g></svg></mjx-container></span><br>
is a continuous function.</div>
</div></div>
<div>
<div class="theorem" style="font-style: italic; padding: 10px 0;"><span style="font-weight: bold; font-style: normal;" class="theorem-title">Corollary 1.6.1.</span><span style="margin-right: 16px"></span><div style="display: inline" data-display="inline">There’s no right rectangle whose sides measure 3cm, 4cm, and 6cm.</div>
</div></div>
<div style="margin-top: 0; margin-bottom: 0;"></div>
<div>
<div class="theorem" style="font-style: italic; padding: 10px 0;"><span style="font-weight: bold; font-style: normal;" class="theorem-title">Theorem 1.1.</span><span style="margin-right: 16px"></span><div style="display: inline" data-display="inline">Let <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.464ex" xmlns="http://www.w3.org/2000/svg" width="1.244ex" height="2.059ex" role="img" focusable="false" viewBox="0 -705 550 910"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="66" d="M118 -162Q120 -162 124 -164T135 -167T147 -168Q160 -168 171 -155T187 -126Q197 -99 221 27T267 267T289 382V385H242Q195 385 192 387Q188 390 188 397L195 425Q197 430 203 430T250 431Q298 431 298 432Q298 434 307 482T319 540Q356 705 465 705Q502 703 526 683T550 630Q550 594 529 578T487 561Q443 561 443 603Q443 622 454 636T478 657L487 662Q471 668 457 668Q445 668 434 658T419 630Q412 601 403 552T387 469T380 433Q380 431 435 431Q480 431 487 430T498 424Q499 420 496 407T491 391Q489 386 482 386T428 385H372L349 263Q301 15 282 -47Q255 -132 212 -173Q175 -205 139 -205Q107 -205 81 -186T55 -132Q55 -95 76 -78T118 -61Q162 -61 162 -103Q162 -122 151 -136T127 -157L118 -162Z"></path></g></g></g></svg></mjx-container></span> be a function whose derivative exists in every point, then <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.464ex" xmlns="http://www.w3.org/2000/svg" width="1.244ex" height="2.059ex" role="img" focusable="false" viewBox="0 -705 550 910"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="66" d="M118 -162Q120 -162 124 -164T135 -167T147 -168Q160 -168 171 -155T187 -126Q197 -99 221 27T267 267T289 382V385H242Q195 385 192 387Q188 390 188 397L195 425Q197 430 203 430T250 431Q298 431 298 432Q298 434 307 482T319 540Q356 705 465 705Q502 703 526 683T550 630Q550 594 529 578T487 561Q443 561 443 603Q443 622 454 636T478 657L487 662Q471 668 457 668Q445 668 434 658T419 630Q412 601 403 552T387 469T380 433Q380 431 435 431Q480 431 487 430T498 424Q499 420 496 407T491 391Q489 386 482 386T428 385H372L349 263Q301 15 282 -47Q255 -132 212 -173Q175 -205 139 -205Q107 -205 81 -186T55 -132Q55 -95 76 -78T118 -61Q162 -61 162 -103Q162 -122 151 -136T127 -157L118 -162Z"></path></g></g></g></svg></mjx-container></span><br>
is a continuous function.</div>
</div></div>
<div>
<div class="theorem" style="font-style: italic; padding: 10px 0;"><span style="font-weight: bold; font-style: normal;" class="theorem-title">Corollary 1.1.1.</span><span style="margin-right: 16px"></span><div style="display: inline" data-display="inline">There’s no right rectangle whose sides measure 3cm, 4cm, and 6cm.</div>
</div></div>`
  },  
  {
    latex: '\\newtheorem{theorem}{Theorem}[section]\n' +
      '\\newtheorem{theorem2}{Theorem2}[theorem]\n' +
      '\\newtheorem{corollary}{Corollary}[theorem]\n' +
      '\\newtheorem{lemma}[theorem]{Lemma}\n' +
      '\\newtheorem{lemma2}[theorem2]{Lemma2}\n' +
      '\\newtheorem{lemma3}{Lemma3}[lemma2]\n' +
      '\n' +
      '\\section{Introduction}\n' +
      'Theorems can easily be defined:\n' +
      '\n' +
      '\\begin{theorem}\n' +
      'Let \\(f\\) be a function whose derivative exists in every point, then \\(f\\) is \n' +
      'a continuous function.\n' +
      '\\end{theorem}\n' +
      '\n' +
      '\\begin{theorem}[Pythagorean theorem]\n' +
      '\\label{pythagorean}\n' +
      'This is a theorem about right triangles and can be summarised in the next \n' +
      'equation \n' +
      '\\[ x^2 + y^2 = z^2 \\]\n' +
      '\\end{theorem}\n' +
      '\n' +
      'And a consequence of theorem \\ref{pythagorean} is the statement in the next \n' +
      'corollary.\n' +
      '\n' +
      '\\begin{corollary}\n' +
      'There\'s no right rectangle whose sides measure 3cm, 4cm, and 6cm.\n' +
      '\\end{corollary}\n' +
      '\n' +
      'You can reference theorems such as \\ref{pythagorean} when a label is assigned.\n' +
      '\n' +
      '\\setcounter{theorem}{-3}\n' +
      '\n' +
      '\\begin{corollary}\n' +
      'There\'s no right rectangle whose sides measure 3cm, 4cm, and 6cm.\n' +
      '\\end{corollary}\n' +
      '\n' +
      '\\begin{lemma}\n' +
      'Given two line segments whose lengths are \\(a\\) and \\(b\\) respectively there is a \n' +
      'real number \\(r\\) such that \\(b=ra\\).\n' +
      '\\end{lemma}\n' +
      '\n' +
      '\\begin{lemma2}\n' +
      'Given two line segments whose lengths are \\(a\\) and \\(b\\) respectively there is a \n' +
      'real number \\(r\\) such that \\(b=ra\\).\n' +
      '\\end{lemma2}\n' +
      '\n' +
      '\\begin{lemma3}\n' +
      'Given two line segments whose lengths are \\(a\\) and \\(b\\) respectively there is a \n' +
      'real number \\(r\\) such that \\(b=ra\\).\n' +
      '\\end{lemma3}\n' +
      '\n' +
      '\\begin{theorem}\n' +
      'Let \\(f\\) be a function whose derivative exists in every point, then \\(f\\) is \n' +
      'a continuous function.\n' +
      '\\end{theorem}\n' +
      '\n' +
      '\\section{Introduction}\n' +
      'test\n',
    html: `<div style="margin-top: 0; margin-bottom: 0;"></div>
<h2 type="section" class="section-title" id="introduction">
<span class="section-number">1. </span>Introduction</h2>
<div>Theorems can easily be defined:</div>
<div>
<div class="theorem" style="font-style: italic; padding: 10px 0;"><span style="font-weight: bold; font-style: normal;" class="theorem-title">Theorem 1.1.</span><span style="margin-right: 16px"></span><div style="display: inline" data-display="inline">Let <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.464ex" xmlns="http://www.w3.org/2000/svg" width="1.244ex" height="2.059ex" role="img" focusable="false" viewBox="0 -705 550 910"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="66" d="M118 -162Q120 -162 124 -164T135 -167T147 -168Q160 -168 171 -155T187 -126Q197 -99 221 27T267 267T289 382V385H242Q195 385 192 387Q188 390 188 397L195 425Q197 430 203 430T250 431Q298 431 298 432Q298 434 307 482T319 540Q356 705 465 705Q502 703 526 683T550 630Q550 594 529 578T487 561Q443 561 443 603Q443 622 454 636T478 657L487 662Q471 668 457 668Q445 668 434 658T419 630Q412 601 403 552T387 469T380 433Q380 431 435 431Q480 431 487 430T498 424Q499 420 496 407T491 391Q489 386 482 386T428 385H372L349 263Q301 15 282 -47Q255 -132 212 -173Q175 -205 139 -205Q107 -205 81 -186T55 -132Q55 -95 76 -78T118 -61Q162 -61 162 -103Q162 -122 151 -136T127 -157L118 -162Z"></path></g></g></g></svg></mjx-container></span> be a function whose derivative exists in every point, then <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.464ex" xmlns="http://www.w3.org/2000/svg" width="1.244ex" height="2.059ex" role="img" focusable="false" viewBox="0 -705 550 910"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="66" d="M118 -162Q120 -162 124 -164T135 -167T147 -168Q160 -168 171 -155T187 -126Q197 -99 221 27T267 267T289 382V385H242Q195 385 192 387Q188 390 188 397L195 425Q197 430 203 430T250 431Q298 431 298 432Q298 434 307 482T319 540Q356 705 465 705Q502 703 526 683T550 630Q550 594 529 578T487 561Q443 561 443 603Q443 622 454 636T478 657L487 662Q471 668 457 668Q445 668 434 658T419 630Q412 601 403 552T387 469T380 433Q380 431 435 431Q480 431 487 430T498 424Q499 420 496 407T491 391Q489 386 482 386T428 385H372L349 263Q301 15 282 -47Q255 -132 212 -173Q175 -205 139 -205Q107 -205 81 -186T55 -132Q55 -95 76 -78T118 -61Q162 -61 162 -103Q162 -122 151 -136T127 -157L118 -162Z"></path></g></g></g></svg></mjx-container></span> is<br>
a continuous function.</div>
</div></div>
<div>
<div id="pythagorean" class="theorem" style="font-style: italic; padding: 10px 0;"><span style="font-weight: bold; font-style: normal;" class="theorem-title">Theorem 1.2.</span><span style="margin-right: 10px"></span><span style="font-weight: bold; font-style: normal;">(Pythagorean theorem)</span><span style="margin-right: 16px"></span><div style="display: inline" data-display="inline">This is a theorem about right triangles and can be summarised in the next<br>
equation</div>
<div><span class="math-block ">
<mjx-container class="MathJax" jax="SVG" display="true"><svg style="vertical-align: -0.464ex" xmlns="http://www.w3.org/2000/svg" width="11.977ex" height="2.464ex" role="img" focusable="false" viewBox="0 -883.9 5293.7 1088.9"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="msup"><g data-mml-node="mi"><path data-c="78" d="M52 289Q59 331 106 386T222 442Q257 442 286 424T329 379Q371 442 430 442Q467 442 494 420T522 361Q522 332 508 314T481 292T458 288Q439 288 427 299T415 328Q415 374 465 391Q454 404 425 404Q412 404 406 402Q368 386 350 336Q290 115 290 78Q290 50 306 38T341 26Q378 26 414 59T463 140Q466 150 469 151T485 153H489Q504 153 504 145Q504 144 502 134Q486 77 440 33T333 -11Q263 -11 227 52Q186 -10 133 -10H127Q78 -10 57 16T35 71Q35 103 54 123T99 143Q142 143 142 101Q142 81 130 66T107 46T94 41L91 40Q91 39 97 36T113 29T132 26Q168 26 194 71Q203 87 217 139T245 247T261 313Q266 340 266 352Q266 380 251 392T217 404Q177 404 142 372T93 290Q91 281 88 280T72 278H58Q52 284 52 289Z"></path></g><g data-mml-node="mn" transform="translate(572, 413) scale(0.707)"><path data-c="32" d="M109 429Q82 429 66 447T50 491Q50 562 103 614T235 666Q326 666 387 610T449 465Q449 422 429 383T381 315T301 241Q265 210 201 149L142 93L218 92Q375 92 385 97Q392 99 409 186V189H449V186Q448 183 436 95T421 3V0H50V19V31Q50 38 56 46T86 81Q115 113 136 137Q145 147 170 174T204 211T233 244T261 278T284 308T305 340T320 369T333 401T340 431T343 464Q343 527 309 573T212 619Q179 619 154 602T119 569T109 550Q109 549 114 549Q132 549 151 535T170 489Q170 464 154 447T109 429Z"></path></g></g><g data-mml-node="mo" transform="translate(1197.8, 0)"><path data-c="2B" d="M56 237T56 250T70 270H369V420L370 570Q380 583 389 583Q402 583 409 568V270H707Q722 262 722 250T707 230H409V-68Q401 -82 391 -82H389H387Q375 -82 369 -68V230H70Q56 237 56 250Z"></path></g><g data-mml-node="msup" transform="translate(2198, 0)"><g data-mml-node="mi"><path data-c="79" d="M21 287Q21 301 36 335T84 406T158 442Q199 442 224 419T250 355Q248 336 247 334Q247 331 231 288T198 191T182 105Q182 62 196 45T238 27Q261 27 281 38T312 61T339 94Q339 95 344 114T358 173T377 247Q415 397 419 404Q432 431 462 431Q475 431 483 424T494 412T496 403Q496 390 447 193T391 -23Q363 -106 294 -155T156 -205Q111 -205 77 -183T43 -117Q43 -95 50 -80T69 -58T89 -48T106 -45Q150 -45 150 -87Q150 -107 138 -122T115 -142T102 -147L99 -148Q101 -153 118 -160T152 -167H160Q177 -167 186 -165Q219 -156 247 -127T290 -65T313 -9T321 21L315 17Q309 13 296 6T270 -6Q250 -11 231 -11Q185 -11 150 11T104 82Q103 89 103 113Q103 170 138 262T173 379Q173 380 173 381Q173 390 173 393T169 400T158 404H154Q131 404 112 385T82 344T65 302T57 280Q55 278 41 278H27Q21 284 21 287Z"></path></g><g data-mml-node="mn" transform="translate(490, 413) scale(0.707)"><path data-c="32" d="M109 429Q82 429 66 447T50 491Q50 562 103 614T235 666Q326 666 387 610T449 465Q449 422 429 383T381 315T301 241Q265 210 201 149L142 93L218 92Q375 92 385 97Q392 99 409 186V189H449V186Q448 183 436 95T421 3V0H50V19V31Q50 38 56 46T86 81Q115 113 136 137Q145 147 170 174T204 211T233 244T261 278T284 308T305 340T320 369T333 401T340 431T343 464Q343 527 309 573T212 619Q179 619 154 602T119 569T109 550Q109 549 114 549Q132 549 151 535T170 489Q170 464 154 447T109 429Z"></path></g></g><g data-mml-node="mo" transform="translate(3369.3, 0)"><path data-c="3D" d="M56 347Q56 360 70 367H707Q722 359 722 347Q722 336 708 328L390 327H72Q56 332 56 347ZM56 153Q56 168 72 173H708Q722 163 722 153Q722 140 707 133H70Q56 140 56 153Z"></path></g><g data-mml-node="msup" transform="translate(4425.1, 0)"><g data-mml-node="mi"><path data-c="7A" d="M347 338Q337 338 294 349T231 360Q211 360 197 356T174 346T162 335T155 324L153 320Q150 317 138 317Q117 317 117 325Q117 330 120 339Q133 378 163 406T229 440Q241 442 246 442Q271 442 291 425T329 392T367 375Q389 375 411 408T434 441Q435 442 449 442H462Q468 436 468 434Q468 430 463 420T449 399T432 377T418 358L411 349Q368 298 275 214T160 106L148 94L163 93Q185 93 227 82T290 71Q328 71 360 90T402 140Q406 149 409 151T424 153Q443 153 443 143Q443 138 442 134Q425 72 376 31T278 -11Q252 -11 232 6T193 40T155 57Q111 57 76 -3Q70 -11 59 -11H54H41Q35 -5 35 -2Q35 13 93 84Q132 129 225 214T340 322Q352 338 347 338Z"></path></g><g data-mml-node="mn" transform="translate(465, 413) scale(0.707)"><path data-c="32" d="M109 429Q82 429 66 447T50 491Q50 562 103 614T235 666Q326 666 387 610T449 465Q449 422 429 383T381 315T301 241Q265 210 201 149L142 93L218 92Q375 92 385 97Q392 99 409 186V189H449V186Q448 183 436 95T421 3V0H50V19V31Q50 38 56 46T86 81Q115 113 136 137Q145 147 170 174T204 211T233 244T261 278T284 308T305 340T320 369T333 401T340 431T343 464Q343 527 309 573T212 619Q179 619 154 602T119 569T109 550Q109 549 114 549Q132 549 151 535T170 489Q170 464 154 447T109 429Z"></path></g></g></g></g></svg></mjx-container></span></div>
</div></div>
<div>And a consequence of theorem <a href="#pythagorean" style="cursor: pointer; text-decoration: none;" class="clickable-link" value="pythagorean">1.2 </a> is the statement in the next<br>
corollary.</div>
<div>
<div class="theorem" style="font-style: italic; padding: 10px 0;"><span style="font-weight: bold; font-style: normal;" class="theorem-title">Corollary 1.2.1.</span><span style="margin-right: 16px"></span><div style="display: inline" data-display="inline">There’s no right rectangle whose sides measure 3cm, 4cm, and 6cm.</div>
</div></div>
<div>You can reference theorems such as <a href="#pythagorean" style="cursor: pointer; text-decoration: none;" class="clickable-link" value="pythagorean">1.2 </a> when a label is assigned.</div>
<div style="margin-top: 0; margin-bottom: 0;"></div>
<div>
<div class="theorem" style="font-style: italic; padding: 10px 0;"><span style="font-weight: bold; font-style: normal;" class="theorem-title">Corollary 1.-3.2.</span><span style="margin-right: 16px"></span><div style="display: inline" data-display="inline">There’s no right rectangle whose sides measure 3cm, 4cm, and 6cm.</div>
</div></div>
<div>
<div class="theorem" style="font-style: italic; padding: 10px 0;"><span style="font-weight: bold; font-style: normal;" class="theorem-title">Lemma 1.-2.</span><span style="margin-right: 16px"></span><div style="display: inline" data-display="inline">Given two line segments whose lengths are <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.023ex" xmlns="http://www.w3.org/2000/svg" width="1.197ex" height="1.02ex" role="img" focusable="false" viewBox="0 -441 529 451"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="61" d="M33 157Q33 258 109 349T280 441Q331 441 370 392Q386 422 416 422Q429 422 439 414T449 394Q449 381 412 234T374 68Q374 43 381 35T402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487Q506 153 506 144Q506 138 501 117T481 63T449 13Q436 0 417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157ZM351 328Q351 334 346 350T323 385T277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q217 26 254 59T298 110Q300 114 325 217T351 328Z"></path></g></g></g></svg></mjx-container></span> and <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.025ex" xmlns="http://www.w3.org/2000/svg" width="0.971ex" height="1.595ex" role="img" focusable="false" viewBox="0 -694 429 705"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="62" d="M73 647Q73 657 77 670T89 683Q90 683 161 688T234 694Q246 694 246 685T212 542Q204 508 195 472T180 418L176 399Q176 396 182 402Q231 442 283 442Q345 442 383 396T422 280Q422 169 343 79T173 -11Q123 -11 82 27T40 150V159Q40 180 48 217T97 414Q147 611 147 623T109 637Q104 637 101 637H96Q86 637 83 637T76 640T73 647ZM336 325V331Q336 405 275 405Q258 405 240 397T207 376T181 352T163 330L157 322L136 236Q114 150 114 114Q114 66 138 42Q154 26 178 26Q211 26 245 58Q270 81 285 114T318 219Q336 291 336 325Z"></path></g></g></g></svg></mjx-container></span> respectively there is a<br>
real number <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.025ex" xmlns="http://www.w3.org/2000/svg" width="1.02ex" height="1.025ex" role="img" focusable="false" viewBox="0 -442 451 453"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="72" d="M21 287Q22 290 23 295T28 317T38 348T53 381T73 411T99 433T132 442Q161 442 183 430T214 408T225 388Q227 382 228 382T236 389Q284 441 347 441H350Q398 441 422 400Q430 381 430 363Q430 333 417 315T391 292T366 288Q346 288 334 299T322 328Q322 376 378 392Q356 405 342 405Q286 405 239 331Q229 315 224 298T190 165Q156 25 151 16Q138 -11 108 -11Q95 -11 87 -5T76 7T74 17Q74 30 114 189T154 366Q154 405 128 405Q107 405 92 377T68 316T57 280Q55 278 41 278H27Q21 284 21 287Z"></path></g></g></g></svg></mjx-container></span> such that <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.186ex" xmlns="http://www.w3.org/2000/svg" width="6.205ex" height="1.756ex" role="img" focusable="false" viewBox="0 -694 2742.6 776"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="62" d="M73 647Q73 657 77 670T89 683Q90 683 161 688T234 694Q246 694 246 685T212 542Q204 508 195 472T180 418L176 399Q176 396 182 402Q231 442 283 442Q345 442 383 396T422 280Q422 169 343 79T173 -11Q123 -11 82 27T40 150V159Q40 180 48 217T97 414Q147 611 147 623T109 637Q104 637 101 637H96Q86 637 83 637T76 640T73 647ZM336 325V331Q336 405 275 405Q258 405 240 397T207 376T181 352T163 330L157 322L136 236Q114 150 114 114Q114 66 138 42Q154 26 178 26Q211 26 245 58Q270 81 285 114T318 219Q336 291 336 325Z"></path></g><g data-mml-node="mo" transform="translate(706.8, 0)"><path data-c="3D" d="M56 347Q56 360 70 367H707Q722 359 722 347Q722 336 708 328L390 327H72Q56 332 56 347ZM56 153Q56 168 72 173H708Q722 163 722 153Q722 140 707 133H70Q56 140 56 153Z"></path></g><g data-mml-node="mi" transform="translate(1762.6, 0)"><path data-c="72" d="M21 287Q22 290 23 295T28 317T38 348T53 381T73 411T99 433T132 442Q161 442 183 430T214 408T225 388Q227 382 228 382T236 389Q284 441 347 441H350Q398 441 422 400Q430 381 430 363Q430 333 417 315T391 292T366 288Q346 288 334 299T322 328Q322 376 378 392Q356 405 342 405Q286 405 239 331Q229 315 224 298T190 165Q156 25 151 16Q138 -11 108 -11Q95 -11 87 -5T76 7T74 17Q74 30 114 189T154 366Q154 405 128 405Q107 405 92 377T68 316T57 280Q55 278 41 278H27Q21 284 21 287Z"></path></g><g data-mml-node="mi" transform="translate(2213.6, 0)"><path data-c="61" d="M33 157Q33 258 109 349T280 441Q331 441 370 392Q386 422 416 422Q429 422 439 414T449 394Q449 381 412 234T374 68Q374 43 381 35T402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487Q506 153 506 144Q506 138 501 117T481 63T449 13Q436 0 417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157ZM351 328Q351 334 346 350T323 385T277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q217 26 254 59T298 110Q300 114 325 217T351 328Z"></path></g></g></g></svg></mjx-container></span>.</div>
</div></div>
<div>
<div class="theorem" style="font-style: italic; padding: 10px 0;"><span style="font-weight: bold; font-style: normal;" class="theorem-title">Lemma2 1.-2.1.</span><span style="margin-right: 16px"></span><div style="display: inline" data-display="inline">Given two line segments whose lengths are <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.023ex" xmlns="http://www.w3.org/2000/svg" width="1.197ex" height="1.02ex" role="img" focusable="false" viewBox="0 -441 529 451"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="61" d="M33 157Q33 258 109 349T280 441Q331 441 370 392Q386 422 416 422Q429 422 439 414T449 394Q449 381 412 234T374 68Q374 43 381 35T402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487Q506 153 506 144Q506 138 501 117T481 63T449 13Q436 0 417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157ZM351 328Q351 334 346 350T323 385T277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q217 26 254 59T298 110Q300 114 325 217T351 328Z"></path></g></g></g></svg></mjx-container></span> and <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.025ex" xmlns="http://www.w3.org/2000/svg" width="0.971ex" height="1.595ex" role="img" focusable="false" viewBox="0 -694 429 705"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="62" d="M73 647Q73 657 77 670T89 683Q90 683 161 688T234 694Q246 694 246 685T212 542Q204 508 195 472T180 418L176 399Q176 396 182 402Q231 442 283 442Q345 442 383 396T422 280Q422 169 343 79T173 -11Q123 -11 82 27T40 150V159Q40 180 48 217T97 414Q147 611 147 623T109 637Q104 637 101 637H96Q86 637 83 637T76 640T73 647ZM336 325V331Q336 405 275 405Q258 405 240 397T207 376T181 352T163 330L157 322L136 236Q114 150 114 114Q114 66 138 42Q154 26 178 26Q211 26 245 58Q270 81 285 114T318 219Q336 291 336 325Z"></path></g></g></g></svg></mjx-container></span> respectively there is a<br>
real number <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.025ex" xmlns="http://www.w3.org/2000/svg" width="1.02ex" height="1.025ex" role="img" focusable="false" viewBox="0 -442 451 453"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="72" d="M21 287Q22 290 23 295T28 317T38 348T53 381T73 411T99 433T132 442Q161 442 183 430T214 408T225 388Q227 382 228 382T236 389Q284 441 347 441H350Q398 441 422 400Q430 381 430 363Q430 333 417 315T391 292T366 288Q346 288 334 299T322 328Q322 376 378 392Q356 405 342 405Q286 405 239 331Q229 315 224 298T190 165Q156 25 151 16Q138 -11 108 -11Q95 -11 87 -5T76 7T74 17Q74 30 114 189T154 366Q154 405 128 405Q107 405 92 377T68 316T57 280Q55 278 41 278H27Q21 284 21 287Z"></path></g></g></g></svg></mjx-container></span> such that <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.186ex" xmlns="http://www.w3.org/2000/svg" width="6.205ex" height="1.756ex" role="img" focusable="false" viewBox="0 -694 2742.6 776"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="62" d="M73 647Q73 657 77 670T89 683Q90 683 161 688T234 694Q246 694 246 685T212 542Q204 508 195 472T180 418L176 399Q176 396 182 402Q231 442 283 442Q345 442 383 396T422 280Q422 169 343 79T173 -11Q123 -11 82 27T40 150V159Q40 180 48 217T97 414Q147 611 147 623T109 637Q104 637 101 637H96Q86 637 83 637T76 640T73 647ZM336 325V331Q336 405 275 405Q258 405 240 397T207 376T181 352T163 330L157 322L136 236Q114 150 114 114Q114 66 138 42Q154 26 178 26Q211 26 245 58Q270 81 285 114T318 219Q336 291 336 325Z"></path></g><g data-mml-node="mo" transform="translate(706.8, 0)"><path data-c="3D" d="M56 347Q56 360 70 367H707Q722 359 722 347Q722 336 708 328L390 327H72Q56 332 56 347ZM56 153Q56 168 72 173H708Q722 163 722 153Q722 140 707 133H70Q56 140 56 153Z"></path></g><g data-mml-node="mi" transform="translate(1762.6, 0)"><path data-c="72" d="M21 287Q22 290 23 295T28 317T38 348T53 381T73 411T99 433T132 442Q161 442 183 430T214 408T225 388Q227 382 228 382T236 389Q284 441 347 441H350Q398 441 422 400Q430 381 430 363Q430 333 417 315T391 292T366 288Q346 288 334 299T322 328Q322 376 378 392Q356 405 342 405Q286 405 239 331Q229 315 224 298T190 165Q156 25 151 16Q138 -11 108 -11Q95 -11 87 -5T76 7T74 17Q74 30 114 189T154 366Q154 405 128 405Q107 405 92 377T68 316T57 280Q55 278 41 278H27Q21 284 21 287Z"></path></g><g data-mml-node="mi" transform="translate(2213.6, 0)"><path data-c="61" d="M33 157Q33 258 109 349T280 441Q331 441 370 392Q386 422 416 422Q429 422 439 414T449 394Q449 381 412 234T374 68Q374 43 381 35T402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487Q506 153 506 144Q506 138 501 117T481 63T449 13Q436 0 417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157ZM351 328Q351 334 346 350T323 385T277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q217 26 254 59T298 110Q300 114 325 217T351 328Z"></path></g></g></g></svg></mjx-container></span>.</div>
</div></div>
<div>
<div class="theorem" style="font-style: italic; padding: 10px 0;"><span style="font-weight: bold; font-style: normal;" class="theorem-title">Lemma3 1.-2.1.1.</span><span style="margin-right: 16px"></span><div style="display: inline" data-display="inline">Given two line segments whose lengths are <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.023ex" xmlns="http://www.w3.org/2000/svg" width="1.197ex" height="1.02ex" role="img" focusable="false" viewBox="0 -441 529 451"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="61" d="M33 157Q33 258 109 349T280 441Q331 441 370 392Q386 422 416 422Q429 422 439 414T449 394Q449 381 412 234T374 68Q374 43 381 35T402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487Q506 153 506 144Q506 138 501 117T481 63T449 13Q436 0 417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157ZM351 328Q351 334 346 350T323 385T277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q217 26 254 59T298 110Q300 114 325 217T351 328Z"></path></g></g></g></svg></mjx-container></span> and <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.025ex" xmlns="http://www.w3.org/2000/svg" width="0.971ex" height="1.595ex" role="img" focusable="false" viewBox="0 -694 429 705"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="62" d="M73 647Q73 657 77 670T89 683Q90 683 161 688T234 694Q246 694 246 685T212 542Q204 508 195 472T180 418L176 399Q176 396 182 402Q231 442 283 442Q345 442 383 396T422 280Q422 169 343 79T173 -11Q123 -11 82 27T40 150V159Q40 180 48 217T97 414Q147 611 147 623T109 637Q104 637 101 637H96Q86 637 83 637T76 640T73 647ZM336 325V331Q336 405 275 405Q258 405 240 397T207 376T181 352T163 330L157 322L136 236Q114 150 114 114Q114 66 138 42Q154 26 178 26Q211 26 245 58Q270 81 285 114T318 219Q336 291 336 325Z"></path></g></g></g></svg></mjx-container></span> respectively there is a<br>
real number <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.025ex" xmlns="http://www.w3.org/2000/svg" width="1.02ex" height="1.025ex" role="img" focusable="false" viewBox="0 -442 451 453"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="72" d="M21 287Q22 290 23 295T28 317T38 348T53 381T73 411T99 433T132 442Q161 442 183 430T214 408T225 388Q227 382 228 382T236 389Q284 441 347 441H350Q398 441 422 400Q430 381 430 363Q430 333 417 315T391 292T366 288Q346 288 334 299T322 328Q322 376 378 392Q356 405 342 405Q286 405 239 331Q229 315 224 298T190 165Q156 25 151 16Q138 -11 108 -11Q95 -11 87 -5T76 7T74 17Q74 30 114 189T154 366Q154 405 128 405Q107 405 92 377T68 316T57 280Q55 278 41 278H27Q21 284 21 287Z"></path></g></g></g></svg></mjx-container></span> such that <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.186ex" xmlns="http://www.w3.org/2000/svg" width="6.205ex" height="1.756ex" role="img" focusable="false" viewBox="0 -694 2742.6 776"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="62" d="M73 647Q73 657 77 670T89 683Q90 683 161 688T234 694Q246 694 246 685T212 542Q204 508 195 472T180 418L176 399Q176 396 182 402Q231 442 283 442Q345 442 383 396T422 280Q422 169 343 79T173 -11Q123 -11 82 27T40 150V159Q40 180 48 217T97 414Q147 611 147 623T109 637Q104 637 101 637H96Q86 637 83 637T76 640T73 647ZM336 325V331Q336 405 275 405Q258 405 240 397T207 376T181 352T163 330L157 322L136 236Q114 150 114 114Q114 66 138 42Q154 26 178 26Q211 26 245 58Q270 81 285 114T318 219Q336 291 336 325Z"></path></g><g data-mml-node="mo" transform="translate(706.8, 0)"><path data-c="3D" d="M56 347Q56 360 70 367H707Q722 359 722 347Q722 336 708 328L390 327H72Q56 332 56 347ZM56 153Q56 168 72 173H708Q722 163 722 153Q722 140 707 133H70Q56 140 56 153Z"></path></g><g data-mml-node="mi" transform="translate(1762.6, 0)"><path data-c="72" d="M21 287Q22 290 23 295T28 317T38 348T53 381T73 411T99 433T132 442Q161 442 183 430T214 408T225 388Q227 382 228 382T236 389Q284 441 347 441H350Q398 441 422 400Q430 381 430 363Q430 333 417 315T391 292T366 288Q346 288 334 299T322 328Q322 376 378 392Q356 405 342 405Q286 405 239 331Q229 315 224 298T190 165Q156 25 151 16Q138 -11 108 -11Q95 -11 87 -5T76 7T74 17Q74 30 114 189T154 366Q154 405 128 405Q107 405 92 377T68 316T57 280Q55 278 41 278H27Q21 284 21 287Z"></path></g><g data-mml-node="mi" transform="translate(2213.6, 0)"><path data-c="61" d="M33 157Q33 258 109 349T280 441Q331 441 370 392Q386 422 416 422Q429 422 439 414T449 394Q449 381 412 234T374 68Q374 43 381 35T402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487Q506 153 506 144Q506 138 501 117T481 63T449 13Q436 0 417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157ZM351 328Q351 334 346 350T323 385T277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q217 26 254 59T298 110Q300 114 325 217T351 328Z"></path></g></g></g></svg></mjx-container></span>.</div>
</div></div>
<div>
<div class="theorem" style="font-style: italic; padding: 10px 0;"><span style="font-weight: bold; font-style: normal;" class="theorem-title">Theorem 1.-1.</span><span style="margin-right: 16px"></span><div style="display: inline" data-display="inline">Let <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.464ex" xmlns="http://www.w3.org/2000/svg" width="1.244ex" height="2.059ex" role="img" focusable="false" viewBox="0 -705 550 910"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="66" d="M118 -162Q120 -162 124 -164T135 -167T147 -168Q160 -168 171 -155T187 -126Q197 -99 221 27T267 267T289 382V385H242Q195 385 192 387Q188 390 188 397L195 425Q197 430 203 430T250 431Q298 431 298 432Q298 434 307 482T319 540Q356 705 465 705Q502 703 526 683T550 630Q550 594 529 578T487 561Q443 561 443 603Q443 622 454 636T478 657L487 662Q471 668 457 668Q445 668 434 658T419 630Q412 601 403 552T387 469T380 433Q380 431 435 431Q480 431 487 430T498 424Q499 420 496 407T491 391Q489 386 482 386T428 385H372L349 263Q301 15 282 -47Q255 -132 212 -173Q175 -205 139 -205Q107 -205 81 -186T55 -132Q55 -95 76 -78T118 -61Q162 -61 162 -103Q162 -122 151 -136T127 -157L118 -162Z"></path></g></g></g></svg></mjx-container></span> be a function whose derivative exists in every point, then <span class="math-inline ">
<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.464ex" xmlns="http://www.w3.org/2000/svg" width="1.244ex" height="2.059ex" role="img" focusable="false" viewBox="0 -705 550 910"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="66" d="M118 -162Q120 -162 124 -164T135 -167T147 -168Q160 -168 171 -155T187 -126Q197 -99 221 27T267 267T289 382V385H242Q195 385 192 387Q188 390 188 397L195 425Q197 430 203 430T250 431Q298 431 298 432Q298 434 307 482T319 540Q356 705 465 705Q502 703 526 683T550 630Q550 594 529 578T487 561Q443 561 443 603Q443 622 454 636T478 657L487 662Q471 668 457 668Q445 668 434 658T419 630Q412 601 403 552T387 469T380 433Q380 431 435 431Q480 431 487 430T498 424Q499 420 496 407T491 391Q489 386 482 386T428 385H372L349 263Q301 15 282 -47Q255 -132 212 -173Q175 -205 139 -205Q107 -205 81 -186T55 -132Q55 -95 76 -78T118 -61Q162 -61 162 -103Q162 -122 151 -136T127 -157L118 -162Z"></path></g></g></g></svg></mjx-container></span> is<br>
a continuous function.</div>
</div></div>
<h2 type="section" class="section-title" id="introduction-2">
<span class="section-number">2. </span>Introduction</h2>
<div>test</div>`
  },
];
