// Pre-existing rendering quirk: the body text inside an unregistered theorem env (no matching `\newtheorem{NAME}{…}`) is dropped by an unrelated math-block fallback rule. See `pr-specs/2026-05-footnote-perf-and-parser-invariants.md` → "Known limitations".
//
// When the body-drop quirk is fixed upstream, these fixtures will start failing — replace the expected `html` with the new positive output rather than treating the failure as a regression.
module.exports = [
  {
    latex: '\\begin{tikzpicture}\nfoo\n\\end{tikzpicture}',
    html: '<div><span  class="math-block equation-number " number="0"></span></div>'
  },
  {
    latex: '\\begin{lemma}\nstatement\n\\end{lemma}',
    html: '<div><span  class="math-block equation-number " number="0"></span></div>'
  },
  {
    latex: 'Prefix \\begin{example}\nbody\n\\end{example} suffix',
    html: '<div>Prefix <span  class="math-block equation-number " number="0"></span> suffix</div>'
  }
];
