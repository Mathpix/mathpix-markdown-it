module.exports = [
  {
    latex: `\\left.\\begin{array}{r}{a}\\\\{-b}\\\\{\\times c}\\\\\\hline\\end{array}\\right.`,
    ascii:     `{:[a],[-b],[xx c]:}`,
    ascii_old: `{:[a],[-b],[times c]:}`
  },
  {
    latex: `\\left\\{\\begin{array}{r}{a}\\\\{-b}\\\\{\\times c}\\\\\\hline\\end{array}\\right\\}`,
    ascii:     `{[a],[-b],[xx c]}`,
    ascii_old: `{[a],[-b],[times c]}`
  },
  {
    latex: `x \\times \\frac{1}{2}y|_{a}^{b}`,
    ascii:     `x xx(1)/(2)y|_(a)^(b)`,
    ascii_old: `x times(1)/(2)y|_(a)^(b)`
  },
//different
  {
    latex: `\\left \\langle \\frac{1}{2} \\right \\rangle`,
    ascii:   `(:(1)/(2):)`,
    ascii_old: `(1)/(2)`
  },
  {
    latex: `\\{ \\text{ \\frac{1}{2} } \\}`,
    ascii: `{" \\frac{1}{2} "}`,
    ascii_old: `{" (1)/(2) "}`
  },

];
