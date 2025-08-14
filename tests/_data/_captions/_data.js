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
  }
];
