module.exports = [
  // === Basic operations ===
  {
    latex: `\\frac{a}{b}`,
    typst: `frac(a, b)`,
    typst_inline: `frac(a, b)`,
  },
  {
    latex: `x^{2}`,
    typst: `x^2`,
    typst_inline: `x^2`,
  },
  {
    latex: `x^2`,
    typst: `x^2`,
    typst_inline: `x^2`,
  },
  {
    latex: `x_{i}`,
    typst: `x_i`,
    typst_inline: `x_i`,
  },
  {
    latex: `x_i`,
    typst: `x_i`,
    typst_inline: `x_i`,
  },
  {
    latex: `x_{i}^{2}`,
    typst: `x_i^2`,
    typst_inline: `x_i^2`,
  },
  {
    latex: `\\sqrt{x}`,
    typst: `sqrt(x)`,
    typst_inline: `sqrt(x)`,
  },
  {
    latex: `\\sqrt[3]{x}`,
    typst: `root(3, x)`,
    typst_inline: `root(3, x)`,
  },
  {
    latex: `a + b`,
    typst: `a + b`,
    typst_inline: `a + b`,
  },
  {
    latex: `a - b`,
    typst: `a - b`,
    typst_inline: `a - b`,
  },
  {
    latex: `a = b`,
    typst: `a = b`,
    typst_inline: `a = b`,
  },

  // === Greek letters ===
  {
    latex: `\\alpha`,
    typst: `alpha`,
    typst_inline: `alpha`,
  },
  {
    latex: `\\beta`,
    typst: `beta`,
    typst_inline: `beta`,
  },
  {
    latex: `\\gamma`,
    typst: `gamma`,
    typst_inline: `gamma`,
  },
  {
    latex: `\\delta`,
    typst: `delta`,
    typst_inline: `delta`,
  },
  {
    latex: `\\Gamma`,
    typst: `Gamma`,
    typst_inline: `Gamma`,
  },
  {
    latex: `\\Delta`,
    typst: `Delta`,
    typst_inline: `Delta`,
  },
  {
    latex: `\\epsilon`,
    typst: `epsilon.alt`,
    typst_inline: `epsilon.alt`,
  },
  {
    latex: `\\varepsilon`,
    typst: `epsilon`,
    typst_inline: `epsilon`,
  },
  {
    latex: `\\theta`,
    typst: `theta`,
    typst_inline: `theta`,
  },
  {
    latex: `\\vartheta`,
    typst: `theta.alt`,
    typst_inline: `theta.alt`,
  },
  {
    latex: `\\lambda`,
    typst: `lambda`,
    typst_inline: `lambda`,
  },
  {
    latex: `\\mu`,
    typst: `mu`,
    typst_inline: `mu`,
  },
  {
    latex: `\\pi`,
    typst: `pi`,
    typst_inline: `pi`,
  },
  {
    latex: `\\sigma`,
    typst: `sigma`,
    typst_inline: `sigma`,
  },
  {
    latex: `\\phi`,
    typst: `phi.alt`,
    typst_inline: `phi.alt`,
  },
  {
    latex: `\\varphi`,
    typst: `phi`,
    typst_inline: `phi`,
  },
  {
    latex: `\\omega`,
    typst: `omega`,
    typst_inline: `omega`,
  },
  {
    latex: `\\Omega`,
    typst: `Omega`,
    typst_inline: `Omega`,
  },

  // === Accents ===
  {
    latex: `\\hat{x}`,
    typst: `hat(x)`,
    typst_inline: `hat(x)`,
  },
  {
    latex: `\\bar{x}`,
    typst: `macron(x)`,
    typst_inline: `macron(x)`,
  },
  {
    latex: `\\tilde{x}`,
    typst: `tilde(x)`,
    typst_inline: `tilde(x)`,
  },
  {
    latex: `\\vec{x}`,
    typst: `arrow(x)`,
    typst_inline: `arrow(x)`,
  },
  {
    latex: `\\dot{x}`,
    typst: `dot(x)`,
    typst_inline: `dot(x)`,
  },
  {
    latex: `\\ddot{x}`,
    typst: `diaer(x)`,
    typst_inline: `diaer(x)`,
  },
  {
    latex: `\\dddot{x}`,
    typst: `accent(x, dot.triple)`,
    typst_inline: `accent(x, dot.triple)`,
  },
  {
    latex: `\\ddddot{x}`,
    typst: `accent(x, dot.quad)`,
    typst_inline: `accent(x, dot.quad)`,
  },
  {
    latex: `\\overline{x}`,
    typst: `overline(x)`,
    typst_inline: `overline(x)`,
  },
  {
    latex: `\\underline{x}`,
    typst: `underline(x)`,
    typst_inline: `underline(x)`,
  },
  {
    latex: `\\overbrace{x+y}^{n}`,
    typst: `overbrace(x + y)^n`,
    typst_inline: `overbrace(x + y)^n`,
  },
  {
    latex: `\\underbrace{x+y}_{n}`,
    typst: `underbrace(x + y)_n`,
    typst_inline: `underbrace(x + y)_n`,
  },

  // === Font commands ===
  {
    latex: `\\mathbb{R}`,
    typst: `RR`,
    typst_inline: `RR`,
  },
  {
    latex: `\\mathcal{L}`,
    typst: `cal(L)`,
    typst_inline: `cal(L)`,
  },
  {
    latex: `\\mathfrak{g}`,
    typst: `frak(g)`,
    typst_inline: `frak(g)`,
  },
  {
    latex: `\\mathbf{v}`,
    typst: `upright(bold(v))`,
    typst_inline: `upright(bold(v))`,
  },
  {
    latex: `\\mathrm{d}`,
    typst: `dif`,
    typst_inline: `dif`,
  },
  {
    latex: `\\mathrm{d}x`,
    typst: `dif x`,
    typst_inline: `dif x`,
  },
  {
    latex: `\\int \\mathrm{d}x`,
    typst: `integral dif x`,
    typst_inline: `integral dif x`,
  },
  {
    latex: `\\mathrm{distance}`,
    typst: `upright("distance")`,
    typst_inline: `upright("distance")`,
  },
  {
    latex: `\\mathrm{const}`,
    typst: `upright("const")`,
    typst_inline: `upright("const")`,
  },
  {
    latex: `\\mathrm{T}`,
    typst: `upright(T)`,
    typst_inline: `upright(T)`,
  },

  // === Named functions ===
  {
    latex: `\\sin x`,
    typst: `sin x`,
    typst_inline: `sin x`,
  },
  {
    latex: `\\cos x`,
    typst: `cos x`,
    typst_inline: `cos x`,
  },
  {
    latex: `\\tan x`,
    typst: `tan x`,
    typst_inline: `tan x`,
  },
  {
    latex: `\\log x`,
    typst: `log x`,
    typst_inline: `log x`,
  },
  {
    latex: `\\ln x`,
    typst: `ln x`,
    typst_inline: `ln x`,
  },
  {
    latex: `\\exp x`,
    typst: `exp x`,
    typst_inline: `exp x`,
  },
  {
    latex: `\\lim_{x \\to 0}`,
    typst: `lim_(x arrow.r 0)`,
    typst_inline: `lim_(x arrow.r 0)`,
  },
  {
    latex: `\\max_{x}`,
    typst: `max_x`,
    typst_inline: `max_x`,
  },
  {
    latex: `\\min_{x}`,
    typst: `min_x`,
    typst_inline: `min_x`,
  },
  {
    latex: `\\operatorname{sech} x`,
    typst: `op("sech") x`,
    typst_inline: `op("sech") x`,
  },

  // === Binary operators ===
  {
    latex: `a \\cdot b`,
    typst: `a dot.op b`,
    typst_inline: `a dot.op b`,
  },
  {
    latex: `a \\times b`,
    typst: `a times b`,
    typst_inline: `a times b`,
  },
  {
    latex: `a \\div b`,
    typst: `a div b`,
    typst_inline: `a div b`,
  },
  {
    latex: `a \\pm b`,
    typst: `a plus.minus b`,
    typst_inline: `a plus.minus b`,
  },
  {
    latex: `a \\mp b`,
    typst: `a minus.plus b`,
    typst_inline: `a minus.plus b`,
  },

  // === Relation operators ===
  {
    latex: `x \\leq y`,
    typst: `x lt.eq y`,
    typst_inline: `x lt.eq y`,
  },
  {
    latex: `x \\geq y`,
    typst: `x gt.eq y`,
    typst_inline: `x gt.eq y`,
  },
  {
    latex: `x \\neq y`,
    typst: `x eq.not y`,
    typst_inline: `x eq.not y`,
  },
  {
    latex: `x \\equiv y`,
    typst: `x equiv y`,
    typst_inline: `x equiv y`,
  },
  {
    latex: `x \\approx y`,
    typst: `x approx y`,
    typst_inline: `x approx y`,
  },
  {
    latex: `x \\sim y`,
    typst: `x tilde.op y`,
    typst_inline: `x tilde.op y`,
  },
  {
    latex: `x \\propto y`,
    typst: `x prop y`,
    typst_inline: `x prop y`,
  },

  // === Set operators ===
  {
    latex: `A \\cup B`,
    typst: `A union B`,
    typst_inline: `A union B`,
  },
  {
    latex: `A \\cap B`,
    typst: `A inter B`,
    typst_inline: `A inter B`,
  },
  {
    latex: `A \\subset B`,
    typst: `A subset B`,
    typst_inline: `A subset B`,
  },
  {
    latex: `A \\supset B`,
    typst: `A supset B`,
    typst_inline: `A supset B`,
  },
  {
    latex: `A \\subseteq B`,
    typst: `A subset.eq B`,
    typst_inline: `A subset.eq B`,
  },
  {
    latex: `A \\supseteq B`,
    typst: `A supset.eq B`,
    typst_inline: `A supset.eq B`,
  },
  {
    latex: `x \\in A`,
    typst: `x in A`,
    typst_inline: `x in A`,
  },
  {
    latex: `x \\notin A`,
    typst: `x in.not A`,
    typst_inline: `x in.not A`,
  },

  // === Arrows ===
  {
    latex: `\\rightarrow`,
    typst: `arrow.r`,
    typst_inline: `arrow.r`,
  },
  {
    latex: `\\leftarrow`,
    typst: `arrow.l`,
    typst_inline: `arrow.l`,
  },
  {
    latex: `\\leftrightarrow`,
    typst: `arrow.l.r`,
    typst_inline: `arrow.l.r`,
  },
  {
    latex: `\\Rightarrow`,
    typst: `arrow.r.double`,
    typst_inline: `arrow.r.double`,
  },
  {
    latex: `\\Leftarrow`,
    typst: `arrow.l.double`,
    typst_inline: `arrow.l.double`,
  },
  {
    latex: `\\Leftrightarrow`,
    typst: `arrow.l.r.double`,
    typst_inline: `arrow.l.r.double`,
  },
  {
    latex: `\\mapsto`,
    typst: `arrow.r.bar`,
    typst_inline: `arrow.r.bar`,
  },

  // === Large operators ===
  {
    latex: `\\sum_{i=1}^{n}`,
    typst: `sum_(i = 1)^n`,
    typst_inline: `sum_(i = 1)^n`,
  },
  {
    latex: `\\prod_{i=1}^{n}`,
    typst: `product_(i = 1)^n`,
    typst_inline: `product_(i = 1)^n`,
  },
  {
    latex: `\\coprod_{i=1}^{n}`,
    typst: `product.co_(i = 1)^n`,
    typst_inline: `product.co_(i = 1)^n`,
  },
  {
    latex: `\\bigcap_{i=1}^{n}`,
    typst: `inter.big_(i = 1)^n`,
    typst_inline: `inter.big_(i = 1)^n`,
  },
  {
    latex: `\\bigcup_{i=1}^{n}`,
    typst: `union.big_(i = 1)^n`,
    typst_inline: `union.big_(i = 1)^n`,
  },
  {
    latex: `\\bigodot_{i=1}^{n}`,
    typst: `dot.o.big_(i = 1)^n`,
    typst_inline: `dot.o.big_(i = 1)^n`,
  },
  {
    latex: `\\bigoplus_{i=1}^{n}`,
    typst: `plus.o.big_(i = 1)^n`,
    typst_inline: `plus.o.big_(i = 1)^n`,
  },
  {
    latex: `\\bigotimes_{i=1}^{n}`,
    typst: `times.o.big_(i = 1)^n`,
    typst_inline: `times.o.big_(i = 1)^n`,
  },
  {
    latex: `\\bigsqcup_{i=1}^{n}`,
    typst: `union.sq.big_(i = 1)^n`,
    typst_inline: `union.sq.big_(i = 1)^n`,
  },
  {
    latex: `\\biguplus_{i=1}^{n}`,
    typst: `union.plus.big_(i = 1)^n`,
    typst_inline: `union.plus.big_(i = 1)^n`,
  },
  {
    latex: `\\bigvee_{i=1}^{n}`,
    typst: `or.big_(i = 1)^n`,
    typst_inline: `or.big_(i = 1)^n`,
  },
  {
    latex: `\\bigwedge_{i=1}^{n}`,
    typst: `and.big_(i = 1)^n`,
    typst_inline: `and.big_(i = 1)^n`,
  },

  // === Integrals ===
  {
    latex: `\\int_0^1`,
    typst: `integral_0^1`,
    typst_inline: `integral_0^1`,
  },
  {
    latex: `\\iint`,
    typst: `integral.double`,
    typst_inline: `integral.double`,
  },
  {
    latex: `\\iiint`,
    typst: `integral.triple`,
    typst_inline: `integral.triple`,
  },
  {
    latex: `\\iiiint_{i=1}^{n}`,
    typst: `integral.quad_(i = 1)^n`,
    typst_inline: `integral.quad_(i = 1)^n`,
  },
  {
    latex: `\\oint f`,
    typst: `integral.cont f`,
    typst_inline: `integral.cont f`,
  },

  // === Limits placement ===
  {
    latex: `\\int\\limits_0^1`,
    typst: `limits(integral)_0^1`,
    typst_inline: `limits(integral)_0^1`,
  },
  {
    latex: `\\iint\\limits_{a}^{b}`,
    typst: `limits(integral.double)_a^b`,
    typst_inline: `limits(integral.double)_a^b`,
  },
  {
    latex: `\\iiint\\limits_{a}^{b}`,
    typst: `limits(integral.triple)_a^b`,
    typst_inline: `limits(integral.triple)_a^b`,
  },

  // === Delimiters / lr ===
  {
    latex: `\\left( x \\right)`,
    typst: `lr(( x ))`,
    typst_inline: `lr(( x ))`,
  },
  {
    latex: `\\left[ x \\right]`,
    typst: `lr([ x ])`,
    typst_inline: `lr([ x ])`,
  },
  {
    latex: `\\left\\{ x \\right\\}`,
    typst: `lr({ x })`,
    typst_inline: `lr({ x })`,
  },
  {
    latex: `\\left\\langle x \\right\\rangle`,
    typst: `lr(chevron.l x chevron.r)`,
    typst_inline: `lr(chevron.l x chevron.r)`,
  },
  {
    latex: `\\left( x \\right.`,
    typst: `( x`,
    typst_inline: `( x`,
  },
  {
    latex: `\\left. x \\right)`,
    typst: `x )`,
    typst_inline: `x )`,
  },

  // === Token spacing inside \left...\right delimiters ===
  {
    latex: `\\left[\\sum_{t=1}^{T} \\log p_{\\theta}\\right]`,
    typst: `lr([ sum_(t = 1)^T log p_(theta) ])`,
    typst_inline: `lr([ sum_(t = 1)^T log p_(theta) ])`,
  },
  {
    latex: `\\max _{\\theta} \\mathbb{E}_{\\mathbf{z} \\sim \\mathcal{Z}_{T}}\\left[\\sum_{t=1}^{T} \\log p_{\\theta}\\left(x_{z_{t}} | \\mathbf{x}_{\\mathbf{z}_{<t}}\\right)\\right]`,
    typst: `max_(theta) EE_(upright(bold(z)) tilde.op cal(Z)_T) lr([ sum_(t = 1)^T log p_(theta) lr(( x_(z_t)|upright(bold(x))_(upright(bold(z))_(< t)) )) ])`,
    typst_inline: `max_(theta) EE_(upright(bold(z)) tilde.op cal(Z)_T) lr([ sum_(t = 1)^T log p_(theta) lr(( x_(z_t)|upright(bold(x))_(upright(bold(z))_(< t)) )) ])`,
  },

  // === Matrices ===
  {
    latex: `\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}`,
    typst: `mat(delim: "(", a, b; c, d)`,
    typst_inline: `mat(delim: "(", a, b; c, d)`,
  },
  {
    latex: `\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}`,
    typst: `mat(delim: "[", a, b; c, d)`,
    typst_inline: `mat(delim: "[", a, b; c, d)`,
  },
  {
    latex: `\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}`,
    typst: `mat(delim: "|", a, b; c, d)`,
    typst_inline: `mat(delim: "|", a, b; c, d)`,
  },

  // === Cases ===
  {
    latex: `\\begin{cases} x & \\text{if } x > 0 \\\\ -x & \\text{otherwise} \\end{cases}`,
    typst: `cases(x & "if " x > 0, - x & "otherwise")`,
    typst_inline: `cases(x & "if " x > 0, - x & "otherwise")`,
  },

  // === Misc symbols ===
  {
    latex: `\\infty`,
    typst: `infinity`,
    typst_inline: `infinity`,
  },
  {
    latex: `\\nabla f`,
    typst: `nabla f`,
    typst_inline: `nabla f`,
  },
  {
    latex: `\\partial x`,
    typst: `partial x`,
    typst_inline: `partial x`,
  },
  {
    latex: `\\forall x`,
    typst: `forall x`,
    typst_inline: `forall x`,
  },
  {
    latex: `\\exists x`,
    typst: `exists x`,
    typst_inline: `exists x`,
  },
  {
    latex: `\\emptyset`,
    typst: `emptyset`,
    typst_inline: `emptyset`,
  },
  {
    latex: `\\neg p`,
    typst: `not p`,
    typst_inline: `not p`,
  },

  // === Dots ===
  {
    latex: `\\cdots`,
    typst: `dots.c`,
    typst_inline: `dots.c`,
  },
  {
    latex: `\\ldots`,
    typst: `dots`,
    typst_inline: `dots`,
  },
  {
    latex: `\\vdots`,
    typst: `dots.v`,
    typst_inline: `dots.v`,
  },
  {
    latex: `\\ddots`,
    typst: `dots.down`,
    typst_inline: `dots.down`,
  },

  // === Spacing ===
  {
    latex: `a \\quad b`,
    typst: `a quad b`,
    typst_inline: `a quad b`,
  },
  {
    latex: `a \\, b`,
    typst: `a thin b`,
    typst_inline: `a thin b`,
  },

  // === Fractions ===
  {
    latex: `\\binom{n}{k}`,
    typst: `binom(n, k)`,
    typst_inline: `binom(n, k)`,
  },
  {
    latex: `\\frac{x+1}{x-1}`,
    typst: `frac(x + 1, x - 1)`,
    typst_inline: `frac(x + 1, x - 1)`,
  },
  {
    latex: `\\frac{\\partial f}{\\partial x}`,
    typst: `frac(partial f, partial x)`,
    typst_inline: `frac(partial f, partial x)`,
  },

  // === Literal slash (escaped — Typst / creates a fraction) ===
  {
    latex: `a/b`,
    typst: `a\\/ b`,
    typst_inline: `a\\/ b`,
  },
  {
    latex: `1/2`,
    typst: `1\\/ 2`,
    typst_inline: `1\\/ 2`,
  },
  {
    latex: `dy/dx`,
    typst: `d y\\/ d x`,
    typst_inline: `d y\\/ d x`,
  },

  // === Combined expressions ===
  {
    latex: `\\alpha + \\beta`,
    typst: `alpha + beta`,
    typst_inline: `alpha + beta`,
  },
  {
    latex: `\\sum_{i=1}^{n} x_i`,
    typst: `sum_(i = 1)^n x_i`,
    typst_inline: `sum_(i = 1)^n x_i`,
  },
  {
    latex: `\\lim_{n \\to \\infty} a_n`,
    typst: `lim_(n arrow.r infinity) a_n`,
    typst_inline: `lim_(n arrow.r infinity) a_n`,
  },
  {
    latex: `e^{i\\pi} + 1 = 0`,
    typst: `e^(i pi) + 1 = 0`,
    typst_inline: `e^(i pi) + 1 = 0`,
  },
  {
    latex: `\\cancel{x}`,
    typst: `cancel(x)`,
    typst_inline: `cancel(x)`,
  },
  {
    latex: `\\text{if } x > 0`,
    typst: `"if " x > 0`,
    typst_inline: `"if " x > 0`,
  },

  // === Phantom variants (Typst hide preserves dimensions) ===
  {
    latex: `\\phantom{x}`,
    typst: `#hide($x$)`,
    typst_inline: `#hide($x$)`,
  },
  {
    latex: `\\hphantom{x}`,
    typst: `#hide($x$)`,
    typst_inline: `#hide($x$)`,
  },
  {
    latex: `\\vphantom{x}`,
    typst: `#hide($x$)`,
    typst_inline: `#hide($x$)`,
  },

  // === Substack ===
  {
    latex: `\\sum_{\\substack{i<n \\\\ j<m}}`,
    typst: `sum_(mat(delim: #none, i < n; j < m))`,
    typst_inline: `sum_(mat(delim: #none, i < n; j < m))`,
  },

  // === Mod variants ===
  {
    latex: `a \\bmod b`,
    typst: `a mod b`,
    typst_inline: `a mod b`,
  },
  {
    latex: `a \\pmod{b}`,
    typst: `a quad (mod b)`,
    typst_inline: `a quad (mod b)`,
  },

  // === Cancel variants ===
  {
    latex: `\\bcancel{x}`,
    typst: `cancel(inverted: #true, x)`,
    typst_inline: `cancel(inverted: #true, x)`,
  },

  // === Equation arrays ===
  {
    latex: `\\begin{aligned} a &= b \\\\ c &= d \\end{aligned}`,
    typst: `a = b \\\nc = d`,
    typst_inline: `a = b \\\nc = d`,
  },

  // === Log with subscript ===
  {
    latex: `\\log_2 x`,
    typst: `log_2 x`,
    typst_inline: `log_2 x`,
  },

  // === Choose (binom) ===
  {
    latex: `a \\choose b`,
    typst: `binom(a, b)`,
    typst_inline: `binom(a, b)`,
  },

  // === Negated relations ===
  {
    latex: `\\not\\equiv`,
    typst: `equiv.not`,
    typst_inline: `equiv.not`,
  },
  {
    latex: `\\not\\leq`,
    typst: `lt.eq.not`,
    typst_inline: `lt.eq.not`,
  },
  {
    latex: `\\not\\sim`,
    typst: `tilde.not`,
    typst_inline: `tilde.not`,
  },

  // === Text with font variants ===
  {
    latex: `\\textbf{bold}`,
    typst: `bold("bold")`,
    typst_inline: `bold("bold")`,
  },

  // === Color ===
  {
    latex: `\\color{red}{x}`,
    typst: `#text(fill: red)[x]`,
    typst_inline: `#text(fill: red)[x]`,
  },

  // === Boxed ===
  {
    latex: `\\boxed{x=1}`,
    typst: `#box(stroke: 0.5pt, inset: 3pt, $x = 1$)`,
    typst_inline: `x = 1`,
  },

  // === Big delimiters ===
  {
    latex: `\\big( x \\big)`,
    typst: `lr(size: #1.2em, ( x ))`,
    typst_inline: `lr(size: #1.2em, ( x ))`,
  },
  {
    latex: `\\Big( x \\Big)`,
    typst: `lr(size: #1.623em, ( x ))`,
    typst_inline: `lr(size: #1.623em, ( x ))`,
  },
  {
    latex: `\\bigg( x \\bigg)`,
    typst: `lr(size: #2.047em, ( x ))`,
    typst_inline: `lr(size: #2.047em, ( x ))`,
  },
  {
    latex: `\\Bigg( x \\Bigg)`,
    typst: `lr(size: #2.470em, ( x ))`,
    typst_inline: `lr(size: #2.470em, ( x ))`,
  },

  // === Non-shorthand accents ===
  {
    latex: `\\overleftarrow{AB}`,
    typst: `accent(A B, arrow.l)`,
    typst_inline: `accent(A B, arrow.l)`,
  },

  // === Math italic ===
  {
    latex: `\\mathit{word}`,
    typst: `italic("word")`,
    typst_inline: `italic("word")`,
  },

  // === Nested expressions ===
  {
    latex: `\\frac{\\sum_{i=1}^{n} x_i}{n}`,
    typst: `frac(sum_(i = 1)^n x_i, n)`,
    typst_inline: `frac(sum_(i = 1)^n x_i, n)`,
  },
  {
    latex: `\\sqrt{\\frac{a}{b}}`,
    typst: `sqrt(frac(a, b))`,
    typst_inline: `sqrt(frac(a, b))`,
  },
  {
    latex: `\\left(\\frac{a}{b}\\right)^2`,
    typst: `lr(( frac(a, b) ))^2`,
    typst_inline: `lr(( frac(a, b) ))^2`,
  },

  // === Text spacing ===
  {
    latex: `x \\text{ and } y`,
    typst: `x " and " y`,
    typst_inline: `x " and " y`,
  },

  // === Thin space preserved ===
  {
    latex: `\\iint_D f(x,y) \\, dA`,
    typst: `integral.double_D f(x, y) thin d A`,
    typst_inline: `integral.double_D f(x, y) thin d A`,
  },

  // === Operatorname with limits ===
  {
    latex: `\\operatorname*{argmax}_{x} f(x)`,
    typst: `op("argmax", limits: #true)_x f(x)`,
    typst_inline: `op("argmax", limits: #true)_x f(x)`,
  },

  // === Delimiter optimizations ===
  {
    latex: `\\left|x\\right|`,
    typst: `norm(x)`,
    typst_inline: `norm(x)`,
  },
  {
    latex: `\\left\\lfloor x\\right\\rfloor`,
    typst: `floor(x)`,
    typst_inline: `floor(x)`,
  },
  {
    latex: `\\left\\lceil x\\right\\rceil`,
    typst: `ceil(x)`,
    typst_inline: `ceil(x)`,
  },

  // === Bare delimiters (without \left...\right) ===
  {
    latex: `\\lfloor x \\rfloor`,
    typst: `floor(x)`,
    typst_inline: `floor(x)`,
  },
  {
    latex: `\\lceil y \\rceil`,
    typst: `ceil(y)`,
    typst_inline: `ceil(y)`,
  },
  {
    latex: `\\|x\\|`,
    typst: `norm(x)`,
    typst_inline: `norm(x)`,
  },
  {
    latex: `\\lfloor x/2 \\rfloor + \\lceil y \\rceil`,
    typst: `floor(x\\/ 2) + ceil(y)`,
    typst_inline: `floor(x\\/ 2) + ceil(y)`,
  },

  // === mathbb doubled-letter shorthand ===
  {
    latex: `\\mathbb{Z}`,
    typst: `ZZ`,
    typst_inline: `ZZ`,
  },
  {
    latex: `\\mathbb{N}`,
    typst: `NN`,
    typst_inline: `NN`,
  },
  {
    latex: `\\mathbb{C}`,
    typst: `CC`,
    typst_inline: `CC`,
  },

  // === boldsymbol (italic bold, not upright bold) ===
  {
    latex: `\\boldsymbol{v}`,
    typst: `bold(v)`,
    typst_inline: `bold(v)`,
  },

  // === aleph ===
  {
    latex: `\\aleph`,
    typst: `aleph`,
    typst_inline: `aleph`,
  },

  // === stackrel / overset / underset ===
  {
    latex: `\\stackrel{f}{\\rightarrow}`,
    typst: `limits(arrow.r)^f`,
    typst_inline: `limits(arrow.r)^f`,
  },
  {
    latex: `\\overset{n}{=}`,
    typst: `limits(=)^n`,
    typst_inline: `limits(=)^n`,
  },
  {
    latex: `\\underset{n}{=}`,
    typst: `limits(=)_n`,
    typst_inline: `limits(=)_n`,
  },

  // === Vmatrix (double bar delimiter) ===
  {
    latex: `\\begin{Vmatrix} a & b \\\\ c & d \\end{Vmatrix}`,
    typst: `mat(delim: "\u2016", a, b; c, d)`,
    typst_inline: `mat(delim: "\u2016", a, b; c, d)`,
  },

  // === nmid ===
  {
    latex: `a \\nmid b`,
    typst: `a divides.not b`,
    typst_inline: `a divides.not b`,
  },

  // === Prime shorthand ===
  {
    latex: `f'(x)`,
    typst: `f'(x)`,
    typst_inline: `f'(x)`,
  },
  {
    latex: `f''(x)`,
    typst: `f''(x)`,
    typst_inline: `f''(x)`,
  },

  // === Parallel ===
  {
    latex: `a \\parallel b`,
    typst: `a parallel b`,
    typst_inline: `a parallel b`,
  },

  // === Extensible arrows ===
  {
    latex: `\\xrightarrow{f}`,
    typst: `limits(arrow.r)^f`,
    typst_inline: `limits(arrow.r)^f`,
  },
  {
    latex: `\\xleftarrow{g}`,
    typst: `limits(arrow.l)^g`,
    typst_inline: `limits(arrow.l)^g`,
  },

  // === mathbb on numbers ===
  {
    latex: `\\mathbb{1}`,
    typst: `bb(1)`,
    typst_inline: `bb(1)`,
  },

  // === Literal parens in superscript ===
  {
    latex: `f^{(n)}(a)`,
    typst: `f^((n))(a)`,
    typst_inline: `f^((n))(a)`,
  },

  // === Rare symbols ===
  {
    latex: `\\rightleftharpoons`,
    typst: `harpoons.rtlb`,
    typst_inline: `harpoons.rtlb`,
  },
  {
    latex: `A \\lhd B`,
    typst: `A lt.tri B`,
    typst_inline: `A lt.tri B`,
  },
  {
    latex: `A \\wr B`,
    typst: `A wreath B`,
    typst_inline: `A wreath B`,
  },

  // === Multiscripts (attach) ===
  {
    latex: `\\sideset{_a^b}{_c^d} \\sum`,
    typst: `attach(sum, tl: b, bl: a, t: d, b: c)`,
    typst_inline: `attach(sum, tl: b, bl: a, t: d, b: c)`,
  },
  {
    latex: `\\sideset{_1^2}{} \\sum`,
    typst: `attach(sum, tl: 2, bl: 1)`,
    typst_inline: `attach(sum, tl: 2, bl: 1)`,
  },

  // === Mathring accent ===
  {
    latex: `\\mathring{x}`,
    typst: `circle(x)`,
    typst_inline: `circle(x)`,
  },

  // === Array lines (augment) ===
  {
    latex: `\\begin{array}{|c|c|} \\hline a & b \\\\ \\hline c & d \\\\ \\hline \\end{array}`,
    typst: `#box(stroke: 0.5pt, inset: 3pt, $ mat(delim: #none, augment: #(hline: 1, vline: 1), a, b; c, d) $)`,
    typst_inline: `mat(delim: #none, augment: #(hline: 1, vline: 1), a, b; c, d)`,
  },
  {
    latex: `\\begin{array}{c|c} a & b \\\\ c & d \\end{array}`,
    typst: `mat(delim: #none, augment: #(vline: 1), a, b; c, d)`,
    typst_inline: `mat(delim: #none, augment: #(vline: 1), a, b; c, d)`,
  },
  {
    latex: `\\begin{array}{lcr} a & b & c \\end{array}`,
    typst: `mat(delim: #none, a, b, c)`,
    typst_inline: `mat(delim: #none, a, b, c)`,
  },

  // === Equation tags ===
  {
    latex: `E = mc^2 \\tag{1}`,
    typst: `#math.equation(block: true, numbering: n => [(1)], $ E = m c^2 $)`,
    typst_inline: `E = m c^2`,
  },
  {
    latex: `E = mc^2 \\tag{1.2}`,
    typst: `#math.equation(block: true, numbering: n => [(1.2)], $ E = m c^2 $)`,
    typst_inline: `E = m c^2`,
  },
  {
    latex: `\\begin{align} a &= b \\tag{1} \\\\ c &= d \\tag{2} \\end{align}`,
    typst: `#math.equation(block: true, numbering: n => [(1)], $ a = b $)\n#math.equation(block: true, numbering: n => [(2)], $ c = d $)`,
    typst_inline: `a = b \\\nc = d`,
  },
  {
    latex: `\\begin{align} x &= 1 \\tag{A} \\\\ y &= 2 \\tag{B} \\end{align}`,
    typst: `#math.equation(block: true, numbering: n => [(A)], $ x = 1 $)\n#math.equation(block: true, numbering: n => [(B)], $ y = 2 $)`,
    typst_inline: `x = 1 \\\ny = 2`,
  },
  {
    latex: `\\begin{equation*} S_{20} \\tag{1} \\end{equation*}`,
    typst: `#math.equation(block: true, numbering: n => [(1)], $ S_(20) $)`,
    typst_inline: `S_(20)`,
  },
  {
    latex: `\\begin{equation} x^2 \\tag{$x\\sqrt{5}$ 1.3.1} \\end{equation}`,
    typst: `#math.equation(block: true, numbering: n => [($x sqrt(5)$ 1.3.1)], $ x^2 $)`,
    typst_inline: `x^2`,
  },
  {
    latex: `\\begin{equation} \\begin{split} a &= b+c \\\\ &= d \\end{split} \\end{equation}`,
    typst: `#math.equation(block: true, numbering: "(1)", $ a = b + c \\\n = d $)`,
    typst_inline: `a = b + c \\\n = d`,
  },
  {
    latex: `\\begin{align*} a &= b+c \\\\ &= d \\end{align*}`,
    typst: `a = b + c \\\n = d`,
    typst_inline: `a = b + c \\\n = d`,
  },
  {
    latex: `\\begin{align} a &= b \\\\ c &= d \\nonumber \\end{align}`,
    typst: `#math.equation(block: true, numbering: "(1)", $ a = b $)\n$ c = d $`,
    typst_inline: `a = b \\\nc = d`,
  },
  {
    latex: `\\begin{gather} x = 1 \\\\ y = 2 \\end{gather}`,
    typst: `#math.equation(block: true, numbering: "(1)", $ x = 1 $)\n#math.equation(block: true, numbering: "(1)", $ y = 2 $)`,
    typst_inline: `x = 1 \\\ny = 2`,
  },

  // === Empty base superscript, pipes as absolute value, operator before paren ===
  {
    latex: `^{|\\alpha|} \\sqrt{x^{\\alpha}} \\leq(x \\bullet \\alpha) /|\\alpha|`,
    typst: `""^(|alpha|) sqrt(x^(alpha)) lt.eq (x bullet alpha)\\/ lr(| alpha |)`,
    typst_inline: `""^(|alpha|) sqrt(x^(alpha)) lt.eq (x bullet alpha)\\/ lr(| alpha |)`,
  },

  // === numcases / subnumcases (grid layout with per-row numbering) ===
  {
    latex: `\\begin{numcases}{f(x)=} 0 & x < 0 \\\\ x & x \\geq 0 \\end{numcases}`,
    typst: `#grid(\n  columns: (1fr, auto),\n  math.equation(block: true, numbering: none, $ f(x) = cases(0 & "x < 0 ", x & "x \\geq 0 ") $),\n  grid(\n    row-gutter: 0.65em,\n    context { counter(math.equation).step(); counter(math.equation).display("(1)") },\n    context { counter(math.equation).step(); counter(math.equation).display("(1)") },\n  ),\n)`,
    typst_inline: `f(x) = cases(0 & "x < 0 ", x & "x \\geq 0 ")`,
  },
  {
    latex: `\\begin{numcases}{f(x)=} 0 & x < 0 \\tag{3.12} \\\\ x & x \\geq 0 \\tag{3.13} \\end{numcases}`,
    typst: `#grid(\n  columns: (1fr, auto),\n  math.equation(block: true, numbering: none, $ f(x) = cases(0 & "x < 0", x & "x \\geq 0") $),\n  grid(\n    row-gutter: 0.65em,\n    [(3.12)],\n    [(3.13)],\n  ),\n)`,
    typst_inline: `f(x) = cases(0 & "x < 0", x & "x \\geq 0")`,
  },
  {
    latex: `\\begin{subnumcases}{|x|=} -x & x < 0 \\\\ x & x \\geq 0 \\end{subnumcases}`,
    typst: `#grid(\n  columns: (1fr, auto),\n  math.equation(block: true, numbering: none, $ |x| = cases(- x & "x < 0 ", x & "x \\geq 0 ") $),\n  grid(\n    row-gutter: 0.65em,\n    context { counter(math.equation).step(); counter(math.equation).display("(1)") },\n    context { counter(math.equation).step(); counter(math.equation).display("(1)") },\n  ),\n)`,
    typst_inline: `|x| = cases(- x & "x < 0 ", x & "x \\geq 0 ")`,
  },
  // cases via array with commas in cells (commas must be escaped)
  {
    latex: `f ( x ) = \\left\\{ \\begin{array} { l l } { x ^ { 2} + 1,} & { x > 1} \\\\ { 1,} & { x = 1} \\\\ { x + 1,} & { x < 1} \\end{array} \\right.`,
    typst: `f(x) = cases(x^2 + 1"," & x > 1, 1"," & x = 1, x + 1"," & x < 1)`,
    typst_inline: `f(x) = cases(x^2 + 1"," & x > 1, 1"," & x = 1, x + 1"," & x < 1)`,
  },
  // numcases with empty prefix and explicit \tag (processed by MathJax as real tags)
  {
    latex: `\\begin{numcases}{} \\Delta_{q}^{\\alpha} x^{n}=f\\left(t_{n}, x^{n}\\right), n=1,2, \\ldots, N \\tag{3.12}\\label{eq:3.12}\\\\ x^{0}=x_{0} \\tag{3.13}\\label{eq3.13} \\end{numcases}`,
    typst: `#grid(\n  columns: (1fr, auto),\n  math.equation(block: true, numbering: none, $ cases(Delta_q^(alpha) x^n = f lr(( t_n, x^n ))"," n = 1"," 2"," dots"," N, x^0 = x_0) $),\n  grid(\n    row-gutter: 0.65em,\n    [(3.12)],\n    [(3.13)],\n  ),\n)`,
    typst_inline: `cases(Delta_q^(alpha) x^n = f lr(( t_n, x^n ))"," n = 1"," 2"," dots"," N, x^0 = x_0)`,
  },
];
