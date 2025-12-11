module.exports = [
  {
    latex: "![original image](https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png)",
    html: "<div><figure style=\"text-align: center\"><img src=\"https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png\" alt=\"original image\" data-align=\"center\"></figure></div>",
    html_notCenterImages: "<div><figure><img src=\"https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png\" alt=\"original image\"></figure></div>",
  },
  {
    latex: "![original image](https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png ){width=10%}",
    html: "<div><figure style=\"text-align: center\"><img src=\"https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png\" alt=\"original image\" width=\"10%\" data-align=\"center\" style=\"width: 10%;\"></figure></div>",
    html_notCenterImages: `<div><figure><img src="https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png" alt="original image" width="10%" style="width: 10%;"></figure></div>`
  },  
  {
    latex: "![original image](https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png ){width=30px, align=\"left\"}",
    html: `<div><figure style="text-align: left"><img src="https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png" alt="original image" width="30px" data-align="left" style="width: 30px;"></figure></div>`,
    html_notCenterImages: `<div><figure style="text-align: left"><img src="https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png" alt="original image" width="30px" data-align="left" style="width: 30px;"></figure></div>`
  },  
  {
    latex: `![original image](https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png ){width="50px", height="40px", right}`,
    html: `<div><figure style="text-align: right"><img src="https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png" alt="original image" width="50px" height="40px" data-align="right" style="width: 50px;height: 40px;"></figure></div>`,
    html_notCenterImages: `<div><figure style="text-align: right"><img src="https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png" alt="original image" width="50px" height="40px" data-align="right" style="width: 50px;height: 40px;"></figure></div>`
  },  
  {
    latex: `test
![original image](https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png ){width="50px", height="40px", right}`,
    html: `<div>test<br>
<figure style="text-align: right"><img src="https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png" alt="original image" width="50px" height="40px" data-align="right" style="width: 50px;height: 40px;"></figure></div>`,
    html_notCenterImages: `<div>test<br>
<figure style="text-align: right"><img src="https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png" alt="original image" width="50px" height="40px" data-align="right" style="width: 50px;height: 40px;"></figure></div>`
  },  
  {
    latex: `test1
![original image](https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png ){width="50px", height="40px", right}
test2`,
    html: `<div>test1<br>
<figure style="text-align: right"><img src="https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png" alt="original image" width="50px" height="40px" data-align="right" style="width: 50px;height: 40px;"></figure><br>
test2</div>`,
    html_notCenterImages: `<div>test1<br>
<figure style="text-align: right"><img src="https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png" alt="original image" width="50px" height="40px" data-align="right" style="width: 50px;height: 40px;"></figure><br>
test2</div>`
  },
  {
    latex: `test1![original image](https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png ){width="50px", height="40px", right}
test2`,
    html: `<div>test1<img src="https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png" alt="original image" width="50px" height="40px" style="width: 50px;height: 40px;"><br>
test2</div>`,
    html_notCenterImages: `<div>test1<img src="https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png" alt="original image" width="50px" height="40px" style="width: 50px;height: 40px;"><br>
test2</div>`
  },  
  {
    latex: `![original image](https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png ){width="50px", height="40px"}test2`,
    html: `<div><img src="https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png" alt="original image" width="50px" height="40px" style="width: 50px;height: 40px;">test2</div>`,
    html_notCenterImages: `<div><img src="https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png" alt="original image" width="50px" height="40px" style="width: 50px;height: 40px;">test2</div>`
  },
  {
    latex: `\\includegraphics{https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png}`,
    html: `<div><div class="figure_img" style="text-align: center;"><img src="https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png" alt="" style="max-width: 50%;"/></div></div>`,
    html_notCenterImages: `<div><div class="figure_img"><img src="https://cdn.mathpix.com/snip/images/CJ2UE_bWzpjLlxKUaO9o69DgpbCy8d-E8_uBe2-IORY.original.fullsize.png" alt="" style="max-width: 50%;"/></div></div>`
  },  
  {
    latex: `\\begin{figure}
\\includegraphics{https://cdn.mathpix.com/snip/images/HRFXh5gVJum_M8klzVz9Z8pDweI_-Ebsswicb88jXZE.original.fullsize.png}
\\end{figure}`,
    html: `<div class="table">
<div class="figure_img" style="text-align: center;"><img src="https://cdn.mathpix.com/snip/images/HRFXh5gVJum_M8klzVz9Z8pDweI_-Ebsswicb88jXZE.original.fullsize.png" alt="" style="max-width: 50%;"/></div></div>`,
    html_notCenterImages: `<div class="table">
<div class="figure_img"><img src="https://cdn.mathpix.com/snip/images/HRFXh5gVJum_M8klzVz9Z8pDweI_-Ebsswicb88jXZE.original.fullsize.png" alt="" style="max-width: 50%;"/></div></div>`
  },  
  {
    latex: `\\begin{figure}[h]
\\includegraphics[width=0.5\\textwidth, right]{https://cdn.mathpix.com/snip/images/MJT22mwBq-bwqrOYwhrUrVKxO3Xcu4vyHSabfbG8my8.original.fullsize.png}
\\end{figure}`,
    html: `<div class="table">
<div class="figure_img" style="text-align: right;"><img src="https://cdn.mathpix.com/snip/images/MJT22mwBq-bwqrOYwhrUrVKxO3Xcu4vyHSabfbG8my8.original.fullsize.png" alt="" style="width: 50%;"/></div></div>`,
    html_notCenterImages: `<div class="table">
<div class="figure_img" style="text-align: right;"><img src="https://cdn.mathpix.com/snip/images/MJT22mwBq-bwqrOYwhrUrVKxO3Xcu4vyHSabfbG8my8.original.fullsize.png" alt="" style="width: 50%;"/></div></div>`
  },
  {
    latex: '![<smiles>CC=O</smiles>](https://cdn.mathpix.com/cropped/99f7259a-da61-4b41-a7df-76c3e78fa9ed-1.jpg?height=154&width=197&top_left_y=918&top_left_x=694)',
    html: '<div><figure style="text-align: center"><img src="https://cdn.mathpix.com/cropped/99f7259a-da61-4b41-a7df-76c3e78fa9ed-1.jpg?height=154&amp;width=197&amp;top_left_y=918&amp;top_left_x=694" alt="&lt;smiles&gt;CC=O&lt;/smiles&gt;" data-align="center"></figure></div>'
  },
  {
    latex: '![$x^y$](https://cdn.mathpix.com/cropped/99f7259a-da61-4b41-a7df-76c3e78fa9ed-1.jpg?height=154&width=197&top_left_y=918&top_left_x=694)',
    html: '<div><figure style="text-align: center"><img src="https://cdn.mathpix.com/cropped/99f7259a-da61-4b41-a7df-76c3e78fa9ed-1.jpg?height=154&amp;width=197&amp;top_left_y=918&amp;top_left_x=694" alt="$x^y$" data-align="center"></figure></div>'
  },
  {
    latex: '![Text](https://cdn.mathpix.com/cropped/99f7259a-da61-4b41-a7df-76c3e78fa9ed-1.jpg?height=154&width=197&top_left_y=918&top_left_x=694)',
    html: '<div><figure style="text-align: center"><img src="https://cdn.mathpix.com/cropped/99f7259a-da61-4b41-a7df-76c3e78fa9ed-1.jpg?height=154&amp;width=197&amp;top_left_y=918&amp;top_left_x=694" alt="Text" data-align="center"></figure></div>'
  },
  {
    latex: '\\includegraphics[max width=\\textwidth]{https://cdn.mathpix.com/cropped/99f7259a-da61-4b41-a7df-76c3e78fa9ed-1.jpg?height=154&width=197&top_left_y=918&top_left_x=694}',
    html: '<div><div class="figure_img" style="text-align: center;"><img src="https://cdn.mathpix.com/cropped/99f7259a-da61-4b41-a7df-76c3e78fa9ed-1.jpg?height=154&width=197&top_left_y=918&top_left_x=694" alt="" style="max-width: 100%;"/></div></div>'
  },
  {
    latex: '\\includegraphics[alt={Alternative, text},max width=\\textwidth]{https://cdn.mathpix.com/cropped/99f7259a-da61-4b41-a7df-76c3e78fa9ed-1.jpg?height=154&width=197&top_left_y=918&top_left_x=694}',
    html: '<div><div class="figure_img" style="text-align: center;"><img src="https://cdn.mathpix.com/cropped/99f7259a-da61-4b41-a7df-76c3e78fa9ed-1.jpg?height=154&width=197&top_left_y=918&top_left_x=694" alt="Alternative, text" style="max-width: 100%;"/></div></div>'
  },
  {
    latex: '\\begin{figure}[h]\n' +
      '\\includegraphics[width=0.5\\textwidth, right]{https://cdn.mathpix.com/snip/images/MJT22mwBq-bwqrOYwhrUrVKxO3Xcu4vyHSabfbG8my8.original.fullsize.png}\n' +
      '\\end{figure}',
    html: '<div class="table">\n' +
      '<div class="figure_img" style="text-align: right;"><img src="https://cdn.mathpix.com/snip/images/MJT22mwBq-bwqrOYwhrUrVKxO3Xcu4vyHSabfbG8my8.original.fullsize.png" alt="" style="width: 50%;"/></div></div>'
  },
  {
    latex: '\\includegraphics[alt={Alternative= text},max width=\\textwidth]{https://cdn.mathpix.com/cropped/99f7259a-da61-4b41-a7df-76c3e78fa9ed-1.jpg?height=154&width=197&top_left_y=918&top_left_x=694}\n',
    html: '<div><div class="figure_img" style="text-align: center;"><img src="https://cdn.mathpix.com/cropped/99f7259a-da61-4b41-a7df-76c3e78fa9ed-1.jpg?height=154&width=197&top_left_y=918&top_left_x=694" alt="Alternative= text" style="max-width: 100%;"/></div></div>'
  },
  {
    latex: '\\includegraphics[alt={Alternative< text},max width=\\textwidth]{https://cdn.mathpix.com/cropped/99f7259a-da61-4b41-a7df-76c3e78fa9ed-1.jpg?height=154&width=197&top_left_y=918&top_left_x=694}',
    html: '<div><div class="figure_img" style="text-align: center;"><img src="https://cdn.mathpix.com/cropped/99f7259a-da61-4b41-a7df-76c3e78fa9ed-1.jpg?height=154&width=197&top_left_y=918&top_left_x=694" alt="Alternative&lt; text" style="max-width: 100%;"/></div></div>'
  },
  {
    latex: '\\begin{figure}[h]\n' +
      '\\centering\n' +
      '\\includegraphics[alt={<smiles>C\n' +
      'C#0</smiles>},max width=\\textwidth]{https://cdn.mathpix.com/cropped/99f7259a-da61-4b41-a7df-76c3e78fa9ed-1.jpg?height=154&width=197&top_left_y=918&top_left_x=694}\n' +
      '\\caption{My caption}\n' +
      '\\label{fig1}\n' +
      '\\end{figure}',
    html: '<div id="fig1" class="figure fig1" number="1">\n' +
      '<div class="figure_img" style="text-align: center;"><img src="https://cdn.mathpix.com/cropped/99f7259a-da61-4b41-a7df-76c3e78fa9ed-1.jpg?height=154&width=197&top_left_y=918&top_left_x=694" alt="&lt;smiles&gt;C\n' +
      'C#0&lt;/smiles&gt;" style="max-width: 100%;"/></div><div class="caption_figure">Figure 1: My caption</div></div>'
  },
  {
    latex: '\\begin{figure}\n' +
      '\\includegraphics[max width=\\textwidth, alt={CC=0}]{https://cdn.mathpix.com/cropped/c3b313d8-1cc4-4916-893f-68080a4f3fe0-1.jpg?height=145&width=159&top_left_y=913&top_left_x=438}\n' +
      '\\captionsetup{labelformat=empty}\n' +
      '\\caption{\n' +
      'Formaldehyde\n' +
      '$v \\mathrm{C}=\\mathrm{O}$;\n' +
      '$1750 \\mathrm{~cm}^{-1}$\n' +
      '}\n' +
      '\\end{figure}',
    html: '<div class="table" number="1">\n' +
      '<div class="figure_img" style="text-align: center;"><img src="https://cdn.mathpix.com/cropped/c3b313d8-1cc4-4916-893f-68080a4f3fe0-1.jpg?height=145&width=159&top_left_y=913&top_left_x=438" alt="CC=0" style="max-width: 100%;"/></div><div class="caption_figure"><br>\n' +
      'Formaldehyde<br>\n' +
      '<span class="math-inline ">\n' +
      '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.186ex;" xmlns="http://www.w3.org/2000/svg" width="7.508ex" height="1.781ex" role="img" focusable="false" viewBox="0 -705 3318.6 787"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><path data-c="1D463" d="M173 380Q173 405 154 405Q130 405 104 376T61 287Q60 286 59 284T58 281T56 279T53 278T49 278T41 278H27Q21 284 21 287Q21 294 29 316T53 368T97 419T160 441Q202 441 225 417T249 361Q249 344 246 335Q246 329 231 291T200 202T182 113Q182 86 187 69Q200 26 250 26Q287 26 319 60T369 139T398 222T409 277Q409 300 401 317T383 343T365 361T357 383Q357 405 376 424T417 443Q436 443 451 425T467 367Q467 340 455 284T418 159T347 40T241 -11Q177 -11 139 22Q102 54 102 117Q102 148 110 181T151 298Q173 362 173 380Z"></path></g><g data-mml-node="TeXAtom" data-mjx-texclass="ORD" transform="translate(485,0)"><g data-mml-node="mi"><path data-c="43" d="M56 342Q56 428 89 500T174 615T283 681T391 705Q394 705 400 705T408 704Q499 704 569 636L582 624L612 663Q639 700 643 704Q644 704 647 704T653 705H657Q660 705 666 699V419L660 413H626Q620 419 619 430Q610 512 571 572T476 651Q457 658 426 658Q322 658 252 588Q173 509 173 342Q173 221 211 151Q232 111 263 84T328 45T384 29T428 24Q517 24 571 93T626 244Q626 251 632 257H660L666 251V236Q661 133 590 56T403 -21Q262 -21 159 83T56 342Z"></path></g></g><g data-mml-node="mo" transform="translate(1484.8,0)"><path data-c="3D" d="M56 347Q56 360 70 367H707Q722 359 722 347Q722 336 708 328L390 327H72Q56 332 56 347ZM56 153Q56 168 72 173H708Q722 163 722 153Q722 140 707 133H70Q56 140 56 153Z"></path></g><g data-mml-node="TeXAtom" data-mjx-texclass="ORD" transform="translate(2540.6,0)"><g data-mml-node="mi"><path data-c="4F" d="M56 340Q56 423 86 494T164 610T270 680T388 705Q521 705 621 601T722 341Q722 260 693 191T617 75T510 4T388 -22T267 3T160 74T85 189T56 340ZM467 647Q426 665 388 665Q360 665 331 654T269 620T213 549T179 439Q174 411 174 354Q174 144 277 61Q327 20 385 20H389H391Q474 20 537 99Q603 188 603 354Q603 411 598 439Q577 592 467 647Z"></path></g></g></g></g></svg></mjx-container></span>;<br>\n' +
      '<span class="math-inline ">\n' +
      '<mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.05ex;" xmlns="http://www.w3.org/2000/svg" width="10.212ex" height="1.937ex" role="img" focusable="false" viewBox="0 -833.9 4513.7 855.9"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mn"><path data-c="31" d="M213 578L200 573Q186 568 160 563T102 556H83V602H102Q149 604 189 617T245 641T273 663Q275 666 285 666Q294 666 302 660V361L303 61Q310 54 315 52T339 48T401 46H427V0H416Q395 3 257 3Q121 3 100 0H88V46H114Q136 46 152 46T177 47T193 50T201 52T207 57T213 61V578Z"></path><path data-c="37" d="M55 458Q56 460 72 567L88 674Q88 676 108 676H128V672Q128 662 143 655T195 646T364 644H485V605L417 512Q408 500 387 472T360 435T339 403T319 367T305 330T292 284T284 230T278 162T275 80Q275 66 275 52T274 28V19Q270 2 255 -10T221 -22Q210 -22 200 -19T179 0T168 40Q168 198 265 368Q285 400 349 489L395 552H302Q128 552 119 546Q113 543 108 522T98 479L95 458V455H55V458Z" transform="translate(500,0)"></path><path data-c="35" d="M164 157Q164 133 148 117T109 101H102Q148 22 224 22Q294 22 326 82Q345 115 345 210Q345 313 318 349Q292 382 260 382H254Q176 382 136 314Q132 307 129 306T114 304Q97 304 95 310Q93 314 93 485V614Q93 664 98 664Q100 666 102 666Q103 666 123 658T178 642T253 634Q324 634 389 662Q397 666 402 666Q410 666 410 648V635Q328 538 205 538Q174 538 149 544L139 546V374Q158 388 169 396T205 412T256 420Q337 420 393 355T449 201Q449 109 385 44T229 -22Q148 -22 99 32T50 154Q50 178 61 192T84 210T107 214Q132 214 148 197T164 157Z" transform="translate(1000,0)"></path><path data-c="30" d="M96 585Q152 666 249 666Q297 666 345 640T423 548Q460 465 460 320Q460 165 417 83Q397 41 362 16T301 -15T250 -22Q224 -22 198 -16T137 16T82 83Q39 165 39 320Q39 494 96 585ZM321 597Q291 629 250 629Q208 629 178 597Q153 571 145 525T137 333Q137 175 145 125T181 46Q209 16 250 16Q290 16 318 46Q347 76 354 130T362 333Q362 478 354 524T321 597Z" transform="translate(1500,0)"></path></g><g data-mml-node="msup" transform="translate(2000,0)"><g data-mml-node="TeXAtom" data-mjx-texclass="ORD"><g data-mml-node="mtext"><path data-c="A0" d=""></path></g><g data-mml-node="mi" transform="translate(250,0)"><path data-c="63" d="M370 305T349 305T313 320T297 358Q297 381 312 396Q317 401 317 402T307 404Q281 408 258 408Q209 408 178 376Q131 329 131 219Q131 137 162 90Q203 29 272 29Q313 29 338 55T374 117Q376 125 379 127T395 129H409Q415 123 415 120Q415 116 411 104T395 71T366 33T318 2T249 -11Q163 -11 99 53T34 214Q34 318 99 383T250 448T370 421T404 357Q404 334 387 320Z"></path><path data-c="6D" d="M41 46H55Q94 46 102 60V68Q102 77 102 91T102 122T103 161T103 203Q103 234 103 269T102 328V351Q99 370 88 376T43 385H25V408Q25 431 27 431L37 432Q47 433 65 434T102 436Q119 437 138 438T167 441T178 442H181V402Q181 364 182 364T187 369T199 384T218 402T247 421T285 437Q305 442 336 442Q351 442 364 440T387 434T406 426T421 417T432 406T441 395T448 384T452 374T455 366L457 361L460 365Q463 369 466 373T475 384T488 397T503 410T523 422T546 432T572 439T603 442Q729 442 740 329Q741 322 741 190V104Q741 66 743 59T754 49Q775 46 803 46H819V0H811L788 1Q764 2 737 2T699 3Q596 3 587 0H579V46H595Q656 46 656 62Q657 64 657 200Q656 335 655 343Q649 371 635 385T611 402T585 404Q540 404 506 370Q479 343 472 315T464 232V168V108Q464 78 465 68T468 55T477 49Q498 46 526 46H542V0H534L510 1Q487 2 460 2T422 3Q319 3 310 0H302V46H318Q379 46 379 62Q380 64 380 200Q379 335 378 343Q372 371 358 385T334 402T308 404Q263 404 229 370Q202 343 195 315T187 232V168V108Q187 78 188 68T191 55T200 49Q221 46 249 46H265V0H257L234 1Q210 2 183 2T145 3Q42 3 33 0H25V46H41Z" transform="translate(444,0)"></path></g></g><g data-mml-node="TeXAtom" transform="translate(1560,363) scale(0.707)" data-mjx-texclass="ORD"><g data-mml-node="mo"><path data-c="2212" d="M84 237T84 250T98 270H679Q694 262 694 250T679 230H98Q84 237 84 250Z"></path></g><g data-mml-node="mn" transform="translate(778,0)"><path data-c="31" d="M213 578L200 573Q186 568 160 563T102 556H83V602H102Q149 604 189 617T245 641T273 663Q275 666 285 666Q294 666 302 660V361L303 61Q310 54 315 52T339 48T401 46H427V0H416Q395 3 257 3Q121 3 100 0H88V46H114Q136 46 152 46T177 47T193 50T201 52T207 57T213 61V578Z"></path></g></g></g></g></g></svg></mjx-container></span><br>\n' +
      '</div></div>'
  },
  {
    latex: '![Alternative text with smiles <smiles>CC=O</smiles>](https://mathpix-ocr-examples.s3.amazonaws.com/dog.jpg)',
    html: '<div><figure style="text-align: center"><img src="https://mathpix-ocr-examples.s3.amazonaws.com/dog.jpg" alt="Alternative text with smiles &lt;smiles&gt;CC=O&lt;/smiles&gt;" data-align="center"></figure></div>'
  },
  {
    latex: '![Alternative \'text\' "for" `diagram`](https://mathpix-ocr-examples.s3.amazonaws.com/diagram.jpg)',
    html: '<div><figure style="text-align: center"><img src="https://mathpix-ocr-examples.s3.amazonaws.com/diagram.jpg" alt="Alternative \'text\' &quot;for&quot; `diagram`" data-align="center"></figure></div>'
  },
  {
    latex: '\\includegraphics[alt={Alternative< " style="max-width: 100%;"},max width=\\textwidth]{https://mathpix-ocr-examples.s3.amazonaws.com/cases_printed_0.jpg}',
    html: '<div><div class="figure_img" style="text-align: center;"><img src="https://mathpix-ocr-examples.s3.amazonaws.com/cases_printed_0.jpg" alt="Alternative&lt; &quot; style=&quot;max-width: 100%;&quot;" style="max-width: 100%;"/></div></div>'
  },
  {
    latex: '\\begin{equation}\n' +
      'x\n' +
      '\\end{equation}\n' +
      '![Alternative text with math $x^y$ and \\begin{equation}x\\end{equation}](https://mathpix-ocr-examples.s3.amazonaws.com/graph.jpg)\n' +
      '\n' +
      '\\begin{equation}\n' +
      'y\n' +
      '\\end{equation}',
    html: '<div><span  class="math-block equation-number " number="1" data-width="full">\n' +
      '<mjx-container class="MathJax" jax="SVG" display="true" width="full" style="min-width: 10.697ex;"><svg style="vertical-align: -0.566ex; min-width: 10.697ex;" xmlns="http://www.w3.org/2000/svg" width="100%" height="2.262ex" role="img" focusable="false"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(0.0181,-0.0181) translate(0, -750)"><g data-mml-node="math"><g data-mml-node="mtable" transform="translate(2078,0) translate(-2078,0)"><g transform="translate(0 750) matrix(1 0 0 -1 0 0) scale(55.25)"><svg data-table="true" preserveAspectRatio="xMidYMid" viewBox="286 -750 1 1000"><g transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="mlabeledtr"><g data-mml-node="mtd"><g data-mml-node="mi"><path data-c="1D465" d="M52 289Q59 331 106 386T222 442Q257 442 286 424T329 379Q371 442 430 442Q467 442 494 420T522 361Q522 332 508 314T481 292T458 288Q439 288 427 299T415 328Q415 374 465 391Q454 404 425 404Q412 404 406 402Q368 386 350 336Q290 115 290 78Q290 50 306 38T341 26Q378 26 414 59T463 140Q466 150 469 151T485 153H489Q504 153 504 145Q504 144 502 134Q486 77 440 33T333 -11Q263 -11 227 52Q186 -10 133 -10H127Q78 -10 57 16T35 71Q35 103 54 123T99 143Q142 143 142 101Q142 81 130 66T107 46T94 41L91 40Q91 39 97 36T113 29T132 26Q168 26 194 71Q203 87 217 139T245 247T261 313Q266 340 266 352Q266 380 251 392T217 404Q177 404 142 372T93 290Q91 281 88 280T72 278H58Q52 284 52 289Z"></path></g></g></g></g></svg><svg data-labels="true" preserveAspectRatio="xMaxYMid" viewBox="1278 -750 1 1000"><g data-labels="true" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="mtd" id="mjx-eqn:1"><g data-mml-node="mtext"><path data-c="28" d="M94 250Q94 319 104 381T127 488T164 576T202 643T244 695T277 729T302 750H315H319Q333 750 333 741Q333 738 316 720T275 667T226 581T184 443T167 250T184 58T225 -81T274 -167T316 -220T333 -241Q333 -250 318 -250H315H302L274 -226Q180 -141 137 -14T94 250Z"></path><path data-c="31" d="M213 578L200 573Q186 568 160 563T102 556H83V602H102Q149 604 189 617T245 641T273 663Q275 666 285 666Q294 666 302 660V361L303 61Q310 54 315 52T339 48T401 46H427V0H416Q395 3 257 3Q121 3 100 0H88V46H114Q136 46 152 46T177 47T193 50T201 52T207 57T213 61V578Z" transform="translate(389,0)"></path><path data-c="29" d="M60 749L64 750Q69 750 74 750H86L114 726Q208 641 251 514T294 250Q294 182 284 119T261 12T224 -76T186 -143T145 -194T113 -227T90 -246Q87 -249 86 -250H74Q66 -250 63 -250T58 -247T55 -238Q56 -237 66 -225Q221 -64 221 250T66 725Q56 737 55 738Q55 746 60 749Z" transform="translate(889,0)"></path></g></g></g></svg></g></g></g></g></svg></mjx-container></span></div>\n' +
      '<div><figure style="text-align: center"><img src="https://mathpix-ocr-examples.s3.amazonaws.com/graph.jpg" alt="Alternative text with math $x^y$ and \\begin{equation}x\\end{equation}" data-align="center"></figure></div>\n' +
      '<div><span  class="math-block equation-number " number="2" data-width="full">\n' +
      '<mjx-container class="MathJax" jax="SVG" display="true" width="full" style="min-width: 10.511ex;"><svg style="vertical-align: -0.566ex; min-width: 10.511ex;" xmlns="http://www.w3.org/2000/svg" width="100%" height="2.262ex" role="img" focusable="false"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(0.0181,-0.0181) translate(0, -750)"><g data-mml-node="math"><g data-mml-node="mtable" transform="translate(2078,0) translate(-2078,0)"><g transform="translate(0 750) matrix(1 0 0 -1 0 0) scale(55.25)"><svg data-table="true" preserveAspectRatio="xMidYMid" viewBox="245 -750 1 1000"><g transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="mlabeledtr"><g data-mml-node="mtd"><g data-mml-node="mi"><path data-c="1D466" d="M21 287Q21 301 36 335T84 406T158 442Q199 442 224 419T250 355Q248 336 247 334Q247 331 231 288T198 191T182 105Q182 62 196 45T238 27Q261 27 281 38T312 61T339 94Q339 95 344 114T358 173T377 247Q415 397 419 404Q432 431 462 431Q475 431 483 424T494 412T496 403Q496 390 447 193T391 -23Q363 -106 294 -155T156 -205Q111 -205 77 -183T43 -117Q43 -95 50 -80T69 -58T89 -48T106 -45Q150 -45 150 -87Q150 -107 138 -122T115 -142T102 -147L99 -148Q101 -153 118 -160T152 -167H160Q177 -167 186 -165Q219 -156 247 -127T290 -65T313 -9T321 21L315 17Q309 13 296 6T270 -6Q250 -11 231 -11Q185 -11 150 11T104 82Q103 89 103 113Q103 170 138 262T173 379Q173 380 173 381Q173 390 173 393T169 400T158 404H154Q131 404 112 385T82 344T65 302T57 280Q55 278 41 278H27Q21 284 21 287Z"></path></g></g></g></g></svg><svg data-labels="true" preserveAspectRatio="xMaxYMid" viewBox="1278 -750 1 1000"><g data-labels="true" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="mtd" id="mjx-eqn:2"><g data-mml-node="mtext"><path data-c="28" d="M94 250Q94 319 104 381T127 488T164 576T202 643T244 695T277 729T302 750H315H319Q333 750 333 741Q333 738 316 720T275 667T226 581T184 443T167 250T184 58T225 -81T274 -167T316 -220T333 -241Q333 -250 318 -250H315H302L274 -226Q180 -141 137 -14T94 250Z"></path><path data-c="32" d="M109 429Q82 429 66 447T50 491Q50 562 103 614T235 666Q326 666 387 610T449 465Q449 422 429 383T381 315T301 241Q265 210 201 149L142 93L218 92Q375 92 385 97Q392 99 409 186V189H449V186Q448 183 436 95T421 3V0H50V19V31Q50 38 56 46T86 81Q115 113 136 137Q145 147 170 174T204 211T233 244T261 278T284 308T305 340T320 369T333 401T340 431T343 464Q343 527 309 573T212 619Q179 619 154 602T119 569T109 550Q109 549 114 549Q132 549 151 535T170 489Q170 464 154 447T109 429Z" transform="translate(389,0)"></path><path data-c="29" d="M60 749L64 750Q69 750 74 750H86L114 726Q208 641 251 514T294 250Q294 182 284 119T261 12T224 -76T186 -143T145 -194T113 -227T90 -246Q87 -249 86 -250H74Q66 -250 63 -250T58 -247T55 -238Q56 -237 66 -225Q221 -64 221 250T66 725Q56 737 55 738Q55 746 60 749Z" transform="translate(889,0)"></path></g></g></g></svg></g></g></g></g></svg></mjx-container></span></div>'
  }
];
