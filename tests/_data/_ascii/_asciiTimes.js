module.exports = [
  {
    latex: `\\left.\\begin{array}{r}{a}\\\\{-b}\\\\{\\times c}\\\\\\hline\\end{array}\\right.`,
    ascii:     `a-bxx c`, //vertical math
    liner:     `a−b×c`, //vertical math
    ascii_old: `{:[a],[-b],[times c]:}`
  },
  {
    latex: `\\left\\{\\begin{array}{r}{a}\\\\{-b}\\\\{\\times c}\\\\\\hline\\end{array}\\right\\}`,
    ascii:     `{[a],[-b],[xx c]}`,
    liner:     `{a \n−b \n×c}`,
    ascii_old: `{[a],[-b],[times c]}`
  },
  {
    latex: `x \\times \\frac{1}{2}y|_{a}^{b}`,
    ascii:     `x xx(1)/(2)y|_(a)^(b)`,
    liner:     `x ×(1/2)y|_a^b`,
    ascii_old: `x times(1)/(2)y|_(a)^(b)`
  },
//different
  {
    latex: `\\left \\langle \\frac{1}{2} \\right \\rangle`,
    ascii:   `(:(1)/(2):)`,
    liner:   `⟨1/2⟩`,
    ascii_old: `(1)/(2)`
  },
  {
    latex: `\\{ \\text{ \\frac{1}{2} } \\}`,
    ascii: `{" \\frac{1}{2} "}`,
    liner: `{ \\frac{1}{2} }`,
    ascii_old: `{" (1)/(2) "}`
  },

];
