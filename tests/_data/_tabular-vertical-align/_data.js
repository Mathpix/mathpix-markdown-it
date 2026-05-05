module.exports = [
  {
    title: 'No bracket — middle (no-op default)',
    mmd: '\\begin{tabular}{|l|l|}\n\\hline\na & b \\\\\n\\hline\n\\end{tabular}',
    html: `<div class="table_tabular" style="text-align: center">
<div class="inline-tabular"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">a</td>
<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">b</td>
</tr>
</tbody>
</table>
</div></div>`
  },
  {
    title: '[t] — all l/c/r cells become top',
    mmd: '\\begin{tabular}[t]{|l|l|}\n\\hline\na & b \\\\\n\\hline\n\\end{tabular}',
    html: `<div class="table_tabular" style="text-align: center">
<div class="inline-tabular"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: top; ">a</td>
<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: top; ">b</td>
</tr>
</tbody>
</table>
</div></div>`
  },
  {
    title: '[c] — explicit middle (matches default)',
    mmd: '\\begin{tabular}[c]{|l|l|}\n\\hline\na & b \\\\\n\\hline\n\\end{tabular}',
    html: `<div class="table_tabular" style="text-align: center">
<div class="inline-tabular"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">a</td>
<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">b</td>
</tr>
</tbody>
</table>
</div></div>`
  },
  {
    title: '[b] — all l/c/r cells become bottom',
    mmd: '\\begin{tabular}[b]{|l|l|}\n\\hline\na & b \\\\\n\\hline\n\\end{tabular}',
    html: `<div class="table_tabular" style="text-align: center">
<div class="inline-tabular"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: bottom; ">a</td>
<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: bottom; ">b</td>
</tr>
</tbody>
</table>
</div></div>`
  },
  {
    title: '[t] with per-column m{} — m{} keeps middle',
    mmd: '\\begin{tabular}[t]{|l|m{2cm}|}\n\\hline\na & b \\\\\n\\hline\n\\end{tabular}',
    html: `<div class="table_tabular" style="text-align: center">
<div class="inline-tabular"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: top; ">a</td>
<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: 2cm; vertical-align: middle; ">b</td>
</tr>
</tbody>
</table>
</div></div>`
  },
  {
    title: '[t] with p{} (already top) and b{} (overrides to bottom)',
    mmd: '\\begin{tabular}[t]{|l|p{2cm}|b{2cm}|}\n\\hline\na & b & c \\\\\n\\hline\n\\end{tabular}',
    html: `<div class="table_tabular" style="text-align: center">
<div class="inline-tabular"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: top; ">a</td>
<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: 2cm; vertical-align: top; ">b</td>
<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: 2cm; vertical-align: bottom; ">c</td>
</tr>
</tbody>
</table>
</div></div>`
  },
  {
    title: 'Unknown bracket value [x] — treated as absent',
    mmd: '\\begin{tabular}[x]{|l|l|}\n\\hline\na & b \\\\\n\\hline\n\\end{tabular}',
    html: `<div class="table_tabular" style="text-align: center">
<div class="inline-tabular"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">a</td>
<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">b</td>
</tr>
</tbody>
</table>
</div></div>`
  },
  {
    title: 'Empty bracket [] — treated as absent',
    mmd: '\\begin{tabular}[]{|l|l|}\n\\hline\na & b \\\\\n\\hline\n\\end{tabular}',
    html: `<div class="table_tabular" style="text-align: center">
<div class="inline-tabular"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">a</td>
<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">b</td>
</tr>
</tbody>
</table>
</div></div>`
  },
  {
    title: 'Whitespace around bracket — tolerated',
    mmd: '\\begin{tabular}  [t]  {|l|l|}\n\\hline\na & b \\\\\n\\hline\n\\end{tabular}',
    html: `<div class="table_tabular" style="text-align: center">
<div class="inline-tabular"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: top; ">a</td>
<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: top; ">b</td>
</tr>
</tbody>
</table>
</div></div>`
  },
  {
    title: 'Nested: outer no bracket, inner [t] — outer cells stay middle, inner cells become top',
    mmd: '\\begin{tabular}{|l|l|}\n\\hline\n\\begin{tabular}[t]{l}\nx \\\\\ny\n\\end{tabular} & b \\\\\n\\hline\n\\end{tabular}',
    html: `<div class="table_tabular" style="text-align: center">
<div class="inline-tabular"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; "><div class="inline-tabular sub-table"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: top; ">x</td>
</tr>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: top; ">y</td>
</tr>
</tbody>
</table>
</div></td>
<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">b</td>
</tr>
</tbody>
</table>
</div></div>`
  },
  {
    title: '[t] propagates to multicolumn cells',
    mmd: '\\begin{tabular}[t]{|l|l|l|}\n\\hline\na & b & c \\\\\n\\hline\n\\multicolumn{2}{|l|}{span} & d \\\\\n\\hline\n\\end{tabular}',
    html: `<div class="table_tabular" style="text-align: center">
<div class="inline-tabular"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: top; ">a</td>
<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: top; ">b</td>
<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: top; ">c</td>
</tr>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; vertical-align: top; border-bottom-style: solid !important; border-bottom-width: 1px !important; " colspan="2">span</td>
<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: top; ">d</td>
</tr>
</tbody>
</table>
</div></div>`
  },
  {
    title: '[t] propagates to multirow cells',
    mmd: '\\begin{tabular}[t]{|l|l|}\n\\hline\n\\multirow{2}{*}{m} & a \\\\\n & b \\\\\n\\hline\n\\end{tabular}',
    html: `<div class="table_tabular" style="text-align: center">
<div class="inline-tabular"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; vertical-align: top; width: auto; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; " rowspan="2">m</td>
<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: top; ">a</td>
</tr>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: top; ">b</td>
</tr>
</tbody>
</table>
</div></div>`
  },
  {
    title: 'Multicolumn without bracket — stays without vertical-align (legacy)',
    mmd: '\\begin{tabular}{|l|l|l|}\n\\hline\n\\multicolumn{2}{|l|}{span} & d \\\\\n\\hline\n\\end{tabular}',
    html: `<div class="table_tabular" style="text-align: center">
<div class="inline-tabular"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; border-top-style: solid !important; border-top-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; " colspan="2">span</td>
<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">d</td>
</tr>
</tbody>
</table>
</div></div>`
  },
  {
    title: "Option 'top' applies when source has no bracket",
    mmd: '\\begin{tabular}{|l|l|}\n\\hline\na & b \\\\\n\\hline\n\\end{tabular}',
    options: { defaultCellVerticalAlign: 'top' },
    html: `<div class="table_tabular" style="text-align: center">
<div class="inline-tabular"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: top; ">a</td>
<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: top; ">b</td>
</tr>
</tbody>
</table>
</div></div>`
  },
  {
    title: "Option 'bottom' applies when source has no bracket",
    mmd: '\\begin{tabular}{|l|l|}\n\\hline\na & b \\\\\n\\hline\n\\end{tabular}',
    options: { defaultCellVerticalAlign: 'bottom' },
    html: `<div class="table_tabular" style="text-align: center">
<div class="inline-tabular"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: bottom; ">a</td>
<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: bottom; ">b</td>
</tr>
</tbody>
</table>
</div></div>`
  },
  {
    title: "Explicit source [c] overrides option 'top'",
    mmd: '\\begin{tabular}[c]{|l|l|}\n\\hline\na & b \\\\\n\\hline\n\\end{tabular}',
    options: { defaultCellVerticalAlign: 'top' },
    html: `<div class="table_tabular" style="text-align: center">
<div class="inline-tabular"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">a</td>
<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">b</td>
</tr>
</tbody>
</table>
</div></div>`
  },
  {
    title: "Option 'top' propagates to multicolumn cells",
    mmd: '\\begin{tabular}{|l|l|l|}\n\\hline\n\\multicolumn{2}{|l|}{span} & d \\\\\n\\hline\n\\end{tabular}',
    options: { defaultCellVerticalAlign: 'top' },
    html: `<div class="table_tabular" style="text-align: center">
<div class="inline-tabular"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; vertical-align: top; border-top-style: solid !important; border-top-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; " colspan="2">span</td>
<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: top; ">d</td>
</tr>
</tbody>
</table>
</div></div>`
  },
  {
    title: 'Explicit \\multirow[t] wins in absent-bracket table',
    mmd: '\\begin{tabular}{|l|l|}\n\\hline\n\\multirow[t]{2}{*}{m} & a \\\\\n & b \\\\\n\\hline\n\\end{tabular}',
    html: `<div class="table_tabular" style="text-align: center">
<div class="inline-tabular"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; vertical-align: top; width: auto; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; " rowspan="2">m</td>
<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">a</td>
</tr>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: middle; ">b</td>
</tr>
</tbody>
</table>
</div></div>`
  },
  {
    title: 'Explicit \\multirow[b] overrides outer [t]',
    mmd: '\\begin{tabular}[t]{|l|l|}\n\\hline\n\\multirow[b]{2}{*}{m} & a \\\\\n & b \\\\\n\\hline\n\\end{tabular}',
    html: `<div class="table_tabular" style="text-align: center">
<div class="inline-tabular"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top: none !important; vertical-align: bottom; width: auto; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; " rowspan="2">m</td>
<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom: none !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: top; ">a</td>
</tr>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top: none !important; width: auto; vertical-align: top; ">b</td>
</tr>
</tbody>
</table>
</div></div>`
  },
  {
    title: 'Outer [t] does not propagate into nested tabular without its own bracket',
    mmd: '\\begin{tabular}[t]{|l|l|}\n\\hline\n\\begin{tabular}{l}\nx \\\\\ny\n\\end{tabular} & b \\\\\n\\hline\n\\end{tabular}',
    html: `<div class="table_tabular" style="text-align: center">
<div class="inline-tabular"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: top; "><div class="inline-tabular sub-table"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">x</td>
</tr>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left: none !important; border-bottom: none !important; border-top: none !important; width: auto; vertical-align: middle; ">y</td>
</tr>
</tbody>
</table>
</div></td>
<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: top; ">b</td>
</tr>
</tbody>
</table>
</div></div>`
  },
  {
    title: '[t] applies to r and S columns',
    mmd: '\\begin{tabular}[t]{|r|S|}\n\\hline\n1 & 2.5 \\\\\n\\hline\n\\end{tabular}',
    html: `<div class="table_tabular" style="text-align: center">
<div class="inline-tabular"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: right; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: top; ">1</td>
<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: top; "><span class="f"></span><span class="decimal_left">2.5</span><span class="f">.</span></td>
</tr>
</tbody>
</table>
</div></div>`
  },
  {
    title: "Explicit source [t] overrides option 'bottom'",
    mmd: '\\begin{tabular}[t]{|l|l|}\n\\hline\na & b \\\\\n\\hline\n\\end{tabular}',
    options: { defaultCellVerticalAlign: 'bottom' },
    html: `<div class="table_tabular" style="text-align: center">
<div class="inline-tabular"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: top; ">a</td>
<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: top; ">b</td>
</tr>
</tbody>
</table>
</div></div>`
  },
  {
    title: 'Multi-character bracket [tt] — treated as absent',
    mmd: '\\begin{tabular}[tt]{|l|l|}\n\\hline\na & b \\\\\n\\hline\n\\end{tabular}',
    html: `<div class="table_tabular" style="text-align: center">
<div class="inline-tabular"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">a</td>
<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">b</td>
</tr>
</tbody>
</table>
</div></div>`
  },
  {
    title: 'Whitespace-only bracket [ ] — treated as absent',
    mmd: '\\begin{tabular}[ ]{|l|l|}\n\\hline\na & b \\\\\n\\hline\n\\end{tabular}',
    html: `<div class="table_tabular" style="text-align: center">
<div class="inline-tabular"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">a</td>
<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">b</td>
</tr>
</tbody>
</table>
</div></div>`
  },
  {
    title: '\\diagbox cell without bracket — middle (legacy default)',
    mmd: '\\begin{tabular}{|l|l|}\n\\hline\n\\diagbox{A}{B} & x \\\\\n\\hline\n\\end{tabular}',
    html: `<div class="table_tabular" style="text-align: center">
<div class="inline-tabular"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; background-size: 100% 100%;vertical-align: middle;background-image: linear-gradient(to bottom left, transparent calc(50% - 0.5px), black 50%, black 50%, transparent calc(50% + 0.5px));"><div  class="diagonal-cell" style="grid-template-columns: repeat(2, 1fr); padding: 0; display: grid; height: 100%; grid-auto-rows: 1fr; min-width: max-content;"><div  class="cell-item diagonal-cell-topRight" style="grid-row-start: 1; grid-column-start: 2; text-align: right; white-space: nowrap; min-height: 1.5em;">B</div><div  class="cell-item diagonal-cell-bottomLeft" style="grid-row-start: 2; grid-column-start: 1; text-align: left; white-space: nowrap; min-height: 1.5em; margin-top: auto;">A</div></div></td>
<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">x</td>
</tr>
</tbody>
</table>
</div></div>`
  },
  {
    title: '\\diagbox cell with [t] — bracket applies to td, diagbox keeps own internal CSS',
    mmd: '\\begin{tabular}[t]{|l|l|}\n\\hline\n\\diagbox{A}{B} & x \\\\\n\\hline\n\\end{tabular}',
    html: `<div class="table_tabular" style="text-align: center">
<div class="inline-tabular"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: top; background-size: 100% 100%;vertical-align: middle;background-image: linear-gradient(to bottom left, transparent calc(50% - 0.5px), black 50%, black 50%, transparent calc(50% + 0.5px));"><div  class="diagonal-cell" style="grid-template-columns: repeat(2, 1fr); padding: 0; display: grid; height: 100%; grid-auto-rows: 1fr; min-width: max-content;"><div  class="cell-item diagonal-cell-topRight" style="grid-row-start: 1; grid-column-start: 2; text-align: right; white-space: nowrap; min-height: 1.5em;">B</div><div  class="cell-item diagonal-cell-bottomLeft" style="grid-row-start: 2; grid-column-start: 1; text-align: left; white-space: nowrap; min-height: 1.5em; margin-top: auto;">A</div></div></td>
<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: top; ">x</td>
</tr>
</tbody>
</table>
</div></div>`
  },
  {
    title: '[t] applies to c columns (centered text + top vertical)',
    mmd: '\\begin{tabular}[t]{|c|c|}\n\\hline\na & b \\\\\n\\hline\n\\end{tabular}',
    html: `<div class="table_tabular" style="text-align: center">
<div class="inline-tabular"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: center; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: top; ">a</td>
<td style="text-align: center; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: top; ">b</td>
</tr>
</tbody>
</table>
</div></div>`
  },
  {
    title: 'Two tabulars in one document with different brackets — parsed independently',
    mmd: '\\begin{tabular}[t]{|l|}\n\\hline\nA \\\\\n\\hline\n\\end{tabular}\n\nText between\n\n\\begin{tabular}[b]{|l|}\n\\hline\nB \\\\\n\\hline\n\\end{tabular}',
    html: `<div class="table_tabular" style="text-align: center">
<div class="inline-tabular"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: top; ">A</td>
</tr>
</tbody>
</table>
</div></div>
<div>Text between</div>
<div class="table_tabular" style="text-align: center">
<div class="inline-tabular"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: bottom; ">B</td>
</tr>
</tbody>
</table>
</div></div>`
  },
  {
    title: 'Uppercase bracket [T] — case-sensitive, treated as absent',
    mmd: '\\begin{tabular}[T]{|l|l|}\n\\hline\na & b \\\\\n\\hline\n\\end{tabular}',
    html: `<div class="table_tabular" style="text-align: center">
<div class="inline-tabular"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">a</td>
<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">b</td>
</tr>
</tbody>
</table>
</div></div>`
  },
  {
    title: 'Inline tabular within paragraph — bracket applied via inline-rule path',
    mmd: 'Before \\begin{tabular}[t]{|l|}\\hline a \\\\\\hline\\end{tabular} after',
    html: `<div>Before <div class="inline-tabular"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: top; ">a</td>
</tr>
</tbody>
</table>
</div> after</div>`
  },
  {
    title: "Invalid option value 'TOP' — rejected, defaults to middle",
    mmd: '\\begin{tabular}{|l|l|}\n\\hline\na & b \\\\\n\\hline\n\\end{tabular}',
    options: { defaultCellVerticalAlign: 'TOP' },
    html: `<div class="table_tabular" style="text-align: center">
<div class="inline-tabular"><table class="tabular">
<tbody>
<tr style="border-top: none !important; border-bottom: none !important;">
<td style="text-align: left; border-left-style: solid !important; border-left-width: 1px !important; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">a</td>
<td style="text-align: left; border-right-style: solid !important; border-right-width: 1px !important; border-bottom-style: solid !important; border-bottom-width: 1px !important; border-top-style: solid !important; border-top-width: 1px !important; width: auto; vertical-align: middle; ">b</td>
</tr>
</tbody>
</table>
</div></div>`
  }
];
