// Pre-existing list-rendering quirks pinned here so a future fix surfaces as an intentional snapshot
// update, not a regression. Kept out of `_data.js` because the `<li>`-only sweep runs over that file and
// these shapes break the invariant on purpose — each is measured identical to `master`.
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
];
