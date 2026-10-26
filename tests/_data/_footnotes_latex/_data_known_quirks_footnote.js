// Pre-existing rendering quirks pinned here so a future fix surfaces as an intentional snapshot update, not a regression. See `pr-specs/2026-05-footnote-perf-and-parser-invariants.md` → "Known limitations".
//
// When a quirk is fixed upstream, replace the expected `html` with the new positive output rather than treating the failure as a regression.
module.exports = [
  {
    // Mixed `\footnotemark` and real `\footnote{}` in the same paragraph.
    // Both display "[1]" — `\footnotemark[1]` echoes the explicit mark; the auto-numbered `\footnote{}` is also numbered 1 (links to #fn2). The numbering scheme does not consult earlier `\footnotemark` calls.
    mmd: 'Word \\footnotemark[1] then \\footnote{real one} more.',
    html: '<div>Word <sup class="footnote-ref">[1]</sup>then <sup class="footnote-ref"><a href="#fn2" id="fnref2">[1]</a></sup> more.</div>\n' +
      '<hr class="footnotes-sep">\n' +
      '<section class="footnotes" style="margin-bottom: 1em;">\n' +
      '<ol class="footnotes-list" style="margin-bottom: 0;">\n' +
      '<li id="fn2" class="footnote-item"><div>real one <a href="#fnref2" class="footnote-backref">↩︎</a></div>\n' +
      '</li>\n' +
      '</ol>\n' +
      '</section>'
  },
  {
    // `\\` at the end of the argument: the note renders (it used to print as literal LaTeX), but the
    // break comes out as a literal `\` — a heading in the same position renders `<br>`.
    mmd: 'Text\\footnote{note \\\\} here',
    html: '<div>Text<sup class="footnote-ref"><a href="#fn1" id="fnref1">[1]</a></sup> here</div>\n' +
      '<hr class="footnotes-sep">\n' +
      '<section class="footnotes" style="margin-bottom: 1em;">\n' +
      '<ol class="footnotes-list" style="margin-bottom: 0;">\n' +
      '<li id="fn1" class="footnote-item"><div>note \\ <a href="#fnref1" class="footnote-backref">↩︎</a></div>\n' +
      '</li>\n' +
      '</ol>\n' +
      '</section>'
  },
  {
    // Nested `\footnote{}`: inner gets [1] (id=fn1), outer gets [2] (id=fn2). The inner is processed
    // first by the recursive parse, so its number is assigned first — counter-intuitive but stable.
    mmd: 'Outer text \\footnote{outer body with nested \\footnote{inner} ref} after.',
    html: '<div>Outer text <sup class="footnote-ref"><a href="#fn2" id="fnref2">[2]</a></sup> after.</div>\n' +
      '<hr class="footnotes-sep">\n' +
      '<section class="footnotes" style="margin-bottom: 1em;">\n' +
      '<ol class="footnotes-list" style="margin-bottom: 0;">\n' +
      '<li id="fn1" class="footnote-item"><div>inner <a href="#fnref1" class="footnote-backref">↩︎</a></div>\n' +
      '</li>\n' +
      '<li id="fn2" class="footnote-item"><div>outer body with nested <sup class="footnote-ref"><a href="#fn1" id="fnref1">[1]</a></sup> ref <a href="#fnref2" class="footnote-backref">↩︎</a></div>\n' +
      '</li>\n' +
      '</ol>\n' +
      '</section>'
  },
];
