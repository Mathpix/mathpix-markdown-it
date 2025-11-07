module.exports = [
  {
    latex: `\\left.\\begin{array}{r}{a}\\\\{-b}\\\\{\\times c}\\\\\\hline\\end{array}\\right.`,
    asciimath:     `a-bxx c`, //vertical math
    linearmath:     `a−b×c`, //vertical math
    asciimath_old: `{:[a],[-b],[times c]:}`
  },
  {
    latex: `\\left\\{\\begin{array}{r}{a}\\\\{-b}\\\\{\\times c}\\\\\\hline\\end{array}\\right\\}`,
    asciimath:     `{[a],[-b],[xx c]}`,
    linearmath:     `{a\n−b\n×c}`,
    asciimath_old: `{[a],[-b],[times c]}`
  },
  {
    latex: `x \\times \\frac{1}{2}y|_{a}^{b}`,
    asciimath:     `x xx(1)/(2)y|_(a)^(b)`,
    linearmath:     `x×(1/2)y|ₐᵇ`,
    asciimath_old: `x times(1)/(2)y|_(a)^(b)`
  },
//different
  {
    latex: `\\left \\langle \\frac{1}{2} \\right \\rangle`,
    asciimath:   `(:(1)/(2):)`,
    linearmath:   `⟨1/2⟩`,
    asciimath_old: `(1)/(2)`
  },
  {
    latex: `\\{ \\text{ \\frac{1}{2} } \\}`,
    asciimath: `{" \\frac{1}{2} "}`,
    linearmath: `{ \\frac{1}{2} }`,
    asciimath_old: `{" (1)/(2) "}`
  },

];
