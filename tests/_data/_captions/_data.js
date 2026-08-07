module.exports = [
  {
    latex: '\\begin{figure}\n' +
      '\\centering\n' +
      '\\includegraphics[width=0.5\\textwidth]{https://cdn.mathpix.com/snip/images/5r2cqa-4r9p1M77cjQmHKZbv19W-kCnuJ4Jya24Xh1k.original.fullsize.png}\n' +
      '\\captionsetup{labelformat=empty}\n' +
      '\\caption{The caption is at the bottom.}\n' +
      '\\end{figure}',
    html: '<div class="table" number="1">\n' +
      '<div class="figure_img" style="text-align: center;"><img src="https://cdn.mathpix.com/snip/images/5r2cqa-4r9p1M77cjQmHKZbv19W-kCnuJ4Jya24Xh1k.original.fullsize.png" alt="" style="width: 50%;"/></div><div class="caption_figure">The caption is at the bottom.</div></div>'
  },
  {
    latex: '\\begin{table}\n' +
      '\\captionsetup{labelformat = empty}\n' +
      '\\caption{The caption is at the top.}\n' +
      '\\begin{tabular}{ | l | c | r | }\n' +
      '\\hline\n' +
      '1 & 2 & 3 \\\\\\hline\n' +
      '4 & 5 & 6 \\\\\\hline\n' +
      '7 & 8 & 9 \\\\\\hline\n' +
      '\\end{tabular}\n' +
      '\\end{table}',
    html: '<div class="table" number="1">\n' +
      '<div class="caption_table">The caption is at the top.</div><div class="table_tabular" style="text-align: center">\n' +
      '<div class="inline-tabular"><table class="tabular">\n' +
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
      '</table>\n' +
      '</div></div>\n' +
      '</div>'
  },
  {
    latex: '\\begin{figure}\n' +
      '\\centering\n' +
      '\\includegraphics[width=0.5\\textwidth]{https://cdn.mathpix.com/snip/images/5r2cqa-4r9p1M77cjQmHKZbv19W-kCnuJ4Jya24Xh1k.original.fullsize.png}\n' +
      '\\captionsetup{labelformat=empty, singlelinecheck=true}\n' +
      '\\caption{The caption is at the bottom.}\n' +
      '\\end{figure}\n' +
      '\n' +
      '\\begin{table}\n' +
      '\\begin{tabular}{ | l | c | r | }\n' +
      '\\hline\n' +
      '1 & 2 & 3 \\\\\\hline\n' +
      '4 & 5 & 6 \\\\\\hline\n' +
      '7 & 8 & 9 \\\\\\hline\n' +
      '\\end{tabular}\n' +
      '\\captionsetup{labelformat=empty, singlelinecheck=on}\n' +
      '\\caption{The caption is at the bottom.}\n' +
      '\\end{table}\n',
    html: '<div class="table" number="1" style="text-align: center">\n' +
      '<div class="figure_img" style="text-align: center;"><img src="https://cdn.mathpix.com/snip/images/5r2cqa-4r9p1M77cjQmHKZbv19W-kCnuJ4Jya24Xh1k.original.fullsize.png" alt="" style="width: 50%;"/></div><div class="caption_figure">The caption is at the bottom.</div></div>\n' +
      '<div class="table" number="1" style="text-align: center">\n' +
      '<div class="table_tabular" style="text-align: center">\n' +
      '<div class="inline-tabular"><table class="tabular">\n' +
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
      '</table>\n' +
      '</div></div>\n' +
      '<div class="caption_table">The caption is at the bottom.</div></div>'
  },
  {
    name: "caption: figure in a list is Figure 1",
    latex: "Para.\n\\begin{itemize}\n\\item[a] x\n\\begin{figure}\n\\caption{F}\n\\end{figure}\n\\end{itemize}\n",
    html: "<div>Para.</div>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">a</span><div>x</div>\n<div class=\"table\" number=\"1\">\n<div></div>\n<div class=\"caption_figure\">Figure 1: F</div></div>\n</li></ul>"
  },
  {
    name: "caption: trailing \\footnote keeps figure at 1",
    latex: "Para.\n\\begin{itemize}\n\\item[a] x\n\\begin{figure}\n\\caption{F}\n\\end{figure}\n\\end{itemize}\ntail \\footnote{n}",
    html: "<div>Para.</div>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">a</span><div>x</div>\n<div class=\"table\" number=\"1\">\n<div></div>\n<div class=\"caption_figure\">Figure 1: F</div></div>\n</li></ul><div>tail <sup class=\"footnote-ref\"><a href=\"#fn1\" id=\"fnref1\">[1]</a></sup></div>\n<hr class=\"footnotes-sep\">\n<section class=\"footnotes\" style=\"margin-bottom: 1em;\">\n<ol class=\"footnotes-list\" style=\"margin-bottom: 0;\">\n<li id=\"fn1\" class=\"footnote-item\"><div>n <a href=\"#fnref1\" class=\"footnote-backref\">↩︎</a></div>\n</li>\n</ol>\n</section>"
  },
  {
    name: "caption: trailing \\footnotetext keeps figure at 1",
    latex: "Para.\n\\begin{itemize}\n\\item[a] x\n\\begin{figure}\n\\caption{F}\n\\end{figure}\n\\end{itemize}\ntail \\footnotetext{n}",
    html: "<div>Para.</div>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">a</span><div>x</div>\n<div class=\"table\" number=\"1\">\n<div></div>\n<div class=\"caption_figure\">Figure 1: F</div></div>\n</li></ul><div>tail </div>\n<hr class=\"footnotes-sep\">\n<section class=\"footnotes\" style=\"margin-bottom: 1em;\">\n<ol class=\"footnotes-list\" style=\"padding-left: 20px; margin-bottom: 0;\">\n<li id=\"fn1\" class=\"footnote-item\" style=\"list-style-type: none;\"><div>n</div>\n</li>\n</ol>\n</section>"
  },
  {
    name: "caption: trailing \\footnote keeps table at 1",
    latex: "Para.\n\\begin{itemize}\n\\item[a] x\n\\begin{table}\n\\caption{T}\n\\begin{tabular}{|l|}\nc\n\\end{tabular}\n\\end{table}\n\\end{itemize}\ntail \\footnote{n}",
    html: "<div>Para.</div>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">a</span><div>x</div>\n<div class=\"table\" number=\"1\">\n<div class=\"caption_table\">Table 1: T</div><div class=\"table_tabular\" style=\"text-align: center\">\n<div class=\"inline-tabular\"><table class=\"tabular\">\n<tbody>\n<tr style=\"border-top: none !important; border-bottom: none !important;\">\n<td style=\"text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; \">c</td>\n</tr>\n</tbody>\n</table>\n</div></div>\n</div>\n</li></ul><div>tail <sup class=\"footnote-ref\"><a href=\"#fn1\" id=\"fnref1\">[1]</a></sup></div>\n<hr class=\"footnotes-sep\">\n<section class=\"footnotes\" style=\"margin-bottom: 1em;\">\n<ol class=\"footnotes-list\" style=\"margin-bottom: 0;\">\n<li id=\"fn1\" class=\"footnote-item\"><div>n <a href=\"#fnref1\" class=\"footnote-backref\">↩︎</a></div>\n</li>\n</ol>\n</section>"
  },
  {
    name: "caption: two list-figures number 1,2",
    latex: "Para.\n\\begin{itemize}\n\\item[a] x\n\\begin{figure}\n\\caption{A}\n\\end{figure}\n\\end{itemize}\n\nmid\n\\begin{itemize}\n\\item[a] x\n\\begin{figure}\n\\caption{B}\n\\end{figure}\n\\end{itemize}\n",
    html: "<div>Para.</div>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">a</span><div>x</div>\n<div class=\"table\" number=\"1\">\n<div></div>\n<div class=\"caption_figure\">Figure 1: A</div></div>\n</li></ul><div>mid</div>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">a</span><div>x</div>\n<div class=\"table\" number=\"2\">\n<div></div>\n<div class=\"caption_figure\">Figure 2: B</div></div>\n</li></ul>"
  },
  {
    name: "caption: bare + list + bare figures number 1,2,3",
    latex: "\\begin{figure}\n\\caption{A}\n\\end{figure}\n\n\\begin{itemize}\n\\item[a] x\n\\begin{figure}\n\\caption{B}\n\\end{figure}\n\\end{itemize}\n\n\\begin{figure}\n\\caption{C}\n\\end{figure}\n",
    html: "<div class=\"table\" number=\"1\">\n<div></div>\n<div class=\"caption_figure\">Figure 1: A</div></div>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">a</span><div>x</div>\n<div class=\"table\" number=\"2\">\n<div></div>\n<div class=\"caption_figure\">Figure 2: B</div></div>\n</li></ul><div class=\"table\" number=\"3\">\n<div></div>\n<div class=\"caption_figure\">Figure 3: C</div></div>"
  },
  {
    name: "caption: figure in a nested list is Figure 1",
    latex: "Para.\n\\begin{itemize}\n\\item[a] x\n\\begin{itemize}\n\\item[b] y\n\\begin{figure}\n\\caption{N}\n\\end{figure}\n\\end{itemize}\n\\end{itemize}\n",
    html: "<div>Para.</div>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">a</span>x<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">b</span><div>y</div>\n<div class=\"table\" number=\"1\">\n<div></div>\n<div class=\"caption_figure\">Figure 1: N</div></div>\n</li></ul></li></ul>"
  },
  {
    name: "caption: \\ref to figure in a list resolves to its number",
    latex: "Para.\n\\begin{itemize}\n\\item[a] x\n\\begin{figure}\n\\caption{F}\n\\label{fig:a}\n\\end{figure}\n\\end{itemize}\n\nSee \\ref{fig:a}.\n",
    html: "<div>Para.</div>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize block\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">a</span><div>x</div>\n<div id=\"fig%3Aa\" class=\"figure fig%3Aa\" number=\"1\"><div class=\"caption_figure\">Figure 1: F</div></div>\n</li></ul><div>See <a href=\"#fig%3Aa\" style=\"cursor: pointer; text-decoration: none;\" class=\"clickable-link\" value=\"fig%3Aa\" data-parentheses=\"false\">1</a>.</div>"
  },
  // `\\` is a line break, not an escape for the brace after it: the argument used to read as unclosed
  // and the whole caption was dropped, which also moved the number of every table below it.
  {
    latex: "\\begin{table}\n\\caption{First line \\\\}\n\\begin{tabular}{l}a\\end{tabular}\n\\end{table}",
    html: "<div class=\"table\" number=\"1\">\n<div class=\"caption_table\">Table 1: First line \\</div><div class=\"table_tabular\" style=\"text-align: center\">\n<div class=\"inline-tabular\"><table class=\"tabular\">\n<tbody>\n<tr style=\"border-top: none !important; border-bottom: none !important;\">\n<td style=\"text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; \">a</td>\n</tr>\n</tbody>\n</table>\n</div></div>\n</div>"
  },
  {
    latex: "\\begin{table}\n\\caption{a \\\\{b} c}\n\\begin{tabular}{l}a\\end{tabular}\n\\end{table}",
    html: "<div class=\"table\" number=\"1\">\n<div class=\"caption_table\">Table 1: a \\{b} c</div><div class=\"table_tabular\" style=\"text-align: center\">\n<div class=\"inline-tabular\"><table class=\"tabular\">\n<tbody>\n<tr style=\"border-top: none !important; border-bottom: none !important;\">\n<td style=\"text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; \">a</td>\n</tr>\n</tbody>\n</table>\n</div></div>\n</div>"
  },
];
