// Pre-existing list-rendering quirks pinned here so a future fix surfaces as an intentional snapshot
// update, not a regression. Kept out of `_data.js` because that file states what the output should be,
// and these shapes state what it is — each measured identical to `master`.
//
// When a quirk is fixed, replace the expected `html` with the new positive output.
module.exports = [
  {
    // Crossed env names on one line. The closer now takes the tag of the list that is open rather than
    // the one it names, so the tags balance; what stays wrong is that both lists come out empty.
    name: "crossed itemize/enumerate on one line renders two empty lists",
    latex: "\\begin{itemize}\n\\begin{enumerate} \\end{itemize} \\begin{itemize}\n\\end{itemize}\n",
    html: "<div>\\begin{itemize}</div>\n<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"> </ol> <ul class=\"itemize\" style=\"list-style-type: none\"></ul>"
  },
  // The body walk reads its line textually and asks only about paired backticks, so a closer written in
  // `$…$` still ends the list there. Inside a wrapper env it is text, because the wrapper collects its
  // interior raw. Byte-identical to `master`.
  {
    name: "a closer written in math outside a wrapper still ends the list",
    latex: "\\begin{itemize}\n\\item a $x \\end{itemize} y$\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a $x</li></ul><div>\\item b<br>\n\\end{itemize}</div>\n"
  },
  // The inline `\item` and `\end{}` rules fire with no list open — the `[list-state]` warnings say so —
  // and leave a stray `</ul>`, an unclosed `<li>` and an unclosed `<ol>`. Gating those rules is not
  // touched here. `master` is worse in kind on the same input: it closes the `<ul>` with `</ol>`, whose
  // count then balances against the unrelated `<ol>`, and writes `class="enumerate undefined"`.
  {
    name: "inline \\item and \\end fire outside any list and leave tags open",
    latex: "\\begin{itemize} \\item[X] b \\end{enumerate} \\end{itemize} \\item a \\begin{enumerate}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"> <li class=\"li_itemize\" data-custom-marker=\"true\"><span class=\"li_level\" data-custom-marker=\"true\">X</span>b</li></ul> </ul> <li>a<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\">"
  },
  // The only invariant violation left in 24k fuzzed documents: on one line the inline path emits the
  // gap as text, so it lands directly in the `<ul>`. The two-line form is already clean.
  {
    name: "an empty list written on one line keeps its whitespace inside the <ul>",
    latex: "\\begin{itemize}     \\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\">     </ul>"
  },
  // A nested list with no item of its own now closes its host `<li>`, so the tags balance. What stays
  // wrong here is the empty `<ul></ul>`: a list element holding nothing at all.
  {
    name: "a nested list with no items of its own renders as an empty list element",
    latex: "\\end{itemize}\ntext\ntext\n\\item[X] b\n\\end{tabular}\n\\begin{itemize}\n\\begin{itemize}\n\\end{itemize}\n`\\end{itemize}`\n`\\end{itemize}`\n\\end{itemize}\n",
    html: "<div>\\end{itemize}<br>\ntext<br>\ntext<br>\n\\item[X] b<br>\n\\end{tabular}</div>\n<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\"><ul class=\"itemize\" style=\"list-style-type: none\"></ul></li><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\"><code>\\end{itemize}</code></li><li class=\"li_itemize\" data-custom-marker=\"true\" data-marker-empty=\"true\"><code>\\end{itemize}</code></li></ul>"
  },
  // Same-line wrapper closers are taken whatever they sit inside: the check is off there because turning
  // it on lost the tail. The wrapper's own block rule truncates at the inner closer, and `y}` follows it.
  {
    name: "a wrapper closer written inside \\caption still closes the wrapper",
    latex: "\\begin{itemize}\\item a\n\\begin{center}\\caption{x \\end{center} y}\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a<div class=\"center\" style=\"text-align: center\">\\caption{x </div>\n<div>y}\\end{center}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  // Closing the list that is open also cured the depth drift the mismatch left behind: the list after
  // the quirk now starts at its own level — `•` and `decimal`. `master` reaches `·` and `lower-roman`.
  // Still here for the two empty lists above them.
  {
    name: "a top-level itemize after the crossed-names quirk uses the level-1 bullet",
    latex: "\\begin{itemize}\n\\begin{enumerate} \\end{itemize} \\begin{itemize}\n\\end{itemize}\n\n\\begin{itemize}\n\\item a\n\\end{itemize}",
    html: "<div>\\begin{itemize}</div>\n<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"> </ol> <ul class=\"itemize\" style=\"list-style-type: none\"></ul><ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul>"
  },
  {
    name: "a top-level enumerate after the crossed-names quirk numbers from decimal",
    latex: "\\begin{itemize}\n\\begin{enumerate} \\end{itemize} \\begin{itemize}\n\\end{itemize}\n\n\\begin{enumerate}\n\\item a\n\\end{enumerate}",
    html: "<div>\\begin{itemize}</div>\n<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"> </ol> <ul class=\"itemize\" style=\"list-style-type: none\"></ul><ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"><li class=\"li_enumerate\">a</li></ol>"
  },
  // A sibling that can never close is dropped with its items. The finished list above it is kept, which
  // is why the rule declines the sibling at all; the tail reaches the item above and is lost there.
  {
    name: "a sibling whose only closer sits in a code span is dropped with its item",
    latex: "\\begin{itemize}\n\\item a\n\\end{itemize} \\begin{itemize} \\item b `\\end{itemize}`",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul>"
  },
  {
    name: "the same with two levels and the outer closer in a code span",
    latex: "\\begin{itemize}\n\\item a\n\\end{itemize} \\begin{itemize} \\item b \\begin{itemize} \\item c \\end{itemize} `\\end{itemize}`",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul>"
  },
  {
    name: "a sibling enumerate whose closer sits in a code span is dropped the same way",
    latex: "\\begin{itemize}\n\\item a\n\\end{itemize} \\begin{enumerate} \\item b `\\end{enumerate}`",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul>"
  },
];
