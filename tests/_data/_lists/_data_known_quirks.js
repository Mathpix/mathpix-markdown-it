// Pre-existing list-rendering quirks pinned here so a future fix surfaces as an intentional snapshot
// update, not a regression. Kept out of `_data.js` because that file states what the output should be,
// and these shapes state what it is — each measured identical to `master`.
//
// When a quirk is fixed, replace the expected `html` with the new positive output.
module.exports = [
  {
    // Crossed env names on one line: the closer takes the tag its stack top names while the outer opener
    // has already gone out as text, so `</ul>` appears without its `<ul>` and the `<ol>` never closes.
    name: "crossed itemize/enumerate on one line leaves an unbalanced tag",
    latex: "\\begin{itemize}\n\\begin{enumerate} \\end{itemize} \\begin{itemize}\n\\end{itemize}\n",
    html: "<div>\\begin{itemize}</div>\n<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"> </ul> <ul class=\"itemize\" style=\"list-style-type: none\"></ul>"
  },
  // Same-line wrapper closers are taken whatever they sit inside: the check is off there because turning
  // it on lost the tail. The wrapper's own block rule truncates at the inner closer, and `y}` follows it.
  {
    name: "a wrapper closer written inside \\caption still closes the wrapper",
    latex: "\\begin{itemize}\\item a\n\\begin{center}\\caption{x \\end{center} y}\\end{center}\n\\item b\n\\end{itemize}",
    html: "<ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a<div class=\"center\" style=\"text-align: center\">\\caption{x </div>\n<div>y}\\end{center}</div>\n</li><li class=\"li_itemize\"><span class=\"li_level\">•</span>b</li></ul>"
  },
  // The quirk above leaves the render depth negative, and the next list inherits it. The itemize guard
  // recovers fully (level-1 bullet); the enumerate one only partly — `lower-alpha`, not `decimal`.
  // Both are one level better than `master`, which reaches `·` and `lower-roman`.
  {
    name: "a top-level itemize after the crossed-names quirk uses the level-1 bullet",
    latex: "\\begin{itemize}\n\\begin{enumerate} \\end{itemize} \\begin{itemize}\n\\end{itemize}\n\n\\begin{itemize}\n\\item a\n\\end{itemize}",
    html: "<div>\\begin{itemize}</div>\n<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"> </ul> <ul class=\"itemize\" style=\"list-style-type: none\"></ul><ul class=\"itemize\" style=\"list-style-type: none\"><li class=\"li_itemize\"><span class=\"li_level\">•</span>a</li></ul>"
  },
  {
    name: "a top-level enumerate after the crossed-names quirk still numbers one level in",
    latex: "\\begin{itemize}\n\\begin{enumerate} \\end{itemize} \\begin{itemize}\n\\end{itemize}\n\n\\begin{enumerate}\n\\item a\n\\end{enumerate}",
    html: "<div>\\begin{itemize}</div>\n<ol class=\"enumerate decimal\" style=\"list-style-type: decimal\"> </ul> <ul class=\"itemize\" style=\"list-style-type: none\"></ul><ol class=\"enumerate lower-alpha\" style=\"list-style-type: lower-alpha\"><li class=\"li_enumerate\">a</li></ol>"
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
