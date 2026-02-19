module.exports = [
  // === Basic operations ===
  { latex: `\\frac{a}{b}`, typst: `frac(a, b)` },
  { latex: `x^{2}`, typst: `x^2` },
  { latex: `x^2`, typst: `x^2` },
  { latex: `x_{i}`, typst: `x_i` },
  { latex: `x_i`, typst: `x_i` },
  { latex: `x_{i}^{2}`, typst: `x_i^2` },
  { latex: `\\sqrt{x}`, typst: `sqrt(x)` },
  { latex: `\\sqrt[3]{x}`, typst: `root(3, x)` },
  { latex: `a + b`, typst: `a + b` },
  { latex: `a - b`, typst: `a - b` },
  { latex: `a = b`, typst: `a = b` },

  // === Greek letters ===
  { latex: `\\alpha`, typst: `alpha` },
  { latex: `\\beta`, typst: `beta` },
  { latex: `\\gamma`, typst: `gamma` },
  { latex: `\\delta`, typst: `delta` },
  { latex: `\\Gamma`, typst: `Gamma` },
  { latex: `\\Delta`, typst: `Delta` },
  { latex: `\\epsilon`, typst: `epsilon.alt` },
  { latex: `\\varepsilon`, typst: `epsilon` },
  { latex: `\\theta`, typst: `theta` },
  { latex: `\\vartheta`, typst: `theta.alt` },
  { latex: `\\lambda`, typst: `lambda` },
  { latex: `\\mu`, typst: `mu` },
  { latex: `\\pi`, typst: `pi` },
  { latex: `\\sigma`, typst: `sigma` },
  { latex: `\\phi`, typst: `phi.alt` },
  { latex: `\\varphi`, typst: `phi` },
  { latex: `\\omega`, typst: `omega` },
  { latex: `\\Omega`, typst: `Omega` },

  // === Accents ===
  { latex: `\\hat{x}`, typst: `hat(x)` },
  { latex: `\\bar{x}`, typst: `macron(x)` },
  { latex: `\\tilde{x}`, typst: `tilde(x)` },
  { latex: `\\vec{x}`, typst: `arrow(x)` },
  { latex: `\\dot{x}`, typst: `dot(x)` },
  { latex: `\\ddot{x}`, typst: `diaer(x)` },
  { latex: `\\dddot{x}`, typst: `accent(x, dot.triple)` },
  { latex: `\\ddddot{x}`, typst: `accent(x, dot.quad)` },
  { latex: `\\overline{x}`, typst: `overline(x)` },
  { latex: `\\underline{x}`, typst: `underline(x)` },
  { latex: `\\overbrace{x+y}^{n}`, typst: `overbrace(x + y)^n` },
  { latex: `\\underbrace{x+y}_{n}`, typst: `underbrace(x + y)_n` },

  // === Font commands ===
  { latex: `\\mathbb{R}`, typst: `RR` },
  { latex: `\\mathcal{L}`, typst: `cal(L)` },
  { latex: `\\mathfrak{g}`, typst: `frak(g)` },
  { latex: `\\mathbf{v}`, typst: `upright(bold(v))` },
  { latex: `\\mathrm{d}`, typst: `dif` },
  { latex: `\\mathrm{d}x`, typst: `dif x` },
  { latex: `\\int \\mathrm{d}x`, typst: `integral dif x` },
  { latex: `\\mathrm{distance}`, typst: `upright("distance")` },
  { latex: `\\mathrm{const}`, typst: `upright("const")` },
  { latex: `\\mathrm{T}`, typst: `upright(T)` },

  // === Named functions ===
  { latex: `\\sin x`, typst: `sin x` },
  { latex: `\\cos x`, typst: `cos x` },
  { latex: `\\tan x`, typst: `tan x` },
  { latex: `\\log x`, typst: `log x` },
  { latex: `\\ln x`, typst: `ln x` },
  { latex: `\\exp x`, typst: `exp x` },
  { latex: `\\lim_{x \\to 0}`, typst: `lim_(x arrow.r 0)` },
  { latex: `\\max_{x}`, typst: `max_x` },
  { latex: `\\min_{x}`, typst: `min_x` },
  { latex: `\\operatorname{sech} x`, typst: `op("sech") x` },

  // === Binary operators ===
  { latex: `a \\cdot b`, typst: `a dot.op b` },
  { latex: `a \\times b`, typst: `a times b` },
  { latex: `a \\div b`, typst: `a div b` },
  { latex: `a \\pm b`, typst: `a plus.minus b` },
  { latex: `a \\mp b`, typst: `a minus.plus b` },

  // === Relation operators ===
  { latex: `x \\leq y`, typst: `x lt.eq y` },
  { latex: `x \\geq y`, typst: `x gt.eq y` },
  { latex: `x \\neq y`, typst: `x eq.not y` },
  { latex: `x \\equiv y`, typst: `x equiv y` },
  { latex: `x \\approx y`, typst: `x approx y` },
  { latex: `x \\sim y`, typst: `x tilde.op y` },
  { latex: `x \\propto y`, typst: `x prop y` },

  // === Set operators ===
  { latex: `A \\cup B`, typst: `A union B` },
  { latex: `A \\cap B`, typst: `A inter B` },
  { latex: `A \\subset B`, typst: `A subset B` },
  { latex: `A \\supset B`, typst: `A supset B` },
  { latex: `A \\subseteq B`, typst: `A subset.eq B` },
  { latex: `A \\supseteq B`, typst: `A supset.eq B` },
  { latex: `x \\in A`, typst: `x in A` },
  { latex: `x \\notin A`, typst: `x in.not A` },

  // === Arrows ===
  { latex: `\\rightarrow`, typst: `arrow.r` },
  { latex: `\\leftarrow`, typst: `arrow.l` },
  { latex: `\\leftrightarrow`, typst: `arrow.l.r` },
  { latex: `\\Rightarrow`, typst: `arrow.r.double` },
  { latex: `\\Leftarrow`, typst: `arrow.l.double` },
  { latex: `\\Leftrightarrow`, typst: `arrow.l.r.double` },
  { latex: `\\mapsto`, typst: `arrow.r.bar` },

  // === Large operators ===
  { latex: `\\sum_{i=1}^{n}`, typst: `sum_(i = 1)^n` },
  { latex: `\\prod_{i=1}^{n}`, typst: `product_(i = 1)^n` },
  { latex: `\\coprod_{i=1}^{n}`, typst: `product.co_(i = 1)^n` },
  { latex: `\\bigcap_{i=1}^{n}`, typst: `inter.big_(i = 1)^n` },
  { latex: `\\bigcup_{i=1}^{n}`, typst: `union.big_(i = 1)^n` },
  { latex: `\\bigodot_{i=1}^{n}`, typst: `dot.o.big_(i = 1)^n` },
  { latex: `\\bigoplus_{i=1}^{n}`, typst: `plus.o.big_(i = 1)^n` },
  { latex: `\\bigotimes_{i=1}^{n}`, typst: `times.o.big_(i = 1)^n` },
  { latex: `\\bigsqcup_{i=1}^{n}`, typst: `union.sq.big_(i = 1)^n` },
  { latex: `\\biguplus_{i=1}^{n}`, typst: `union.plus.big_(i = 1)^n` },
  { latex: `\\bigvee_{i=1}^{n}`, typst: `or.big_(i = 1)^n` },
  { latex: `\\bigwedge_{i=1}^{n}`, typst: `and.big_(i = 1)^n` },

  // === Integrals ===
  { latex: `\\int_0^1`, typst: `integral_0^1` },
  { latex: `\\iint`, typst: `integral.double` },
  { latex: `\\iiint`, typst: `integral.triple` },
  { latex: `\\iiiint_{i=1}^{n}`, typst: `integral.quad_(i = 1)^n` },
  { latex: `\\oint f`, typst: `integral.cont f` },

  // === Limits placement ===
  { latex: `\\int\\limits_0^1`, typst: `limits(integral)_0^1` },
  { latex: `\\iint\\limits_{a}^{b}`, typst: `limits(integral.double)_a^b` },
  { latex: `\\iiint\\limits_{a}^{b}`, typst: `limits(integral.triple)_a^b` },

  // === Delimiters / lr ===
  { latex: `\\left( x \\right)`, typst: `lr(( x ))` },
  { latex: `\\left[ x \\right]`, typst: `lr([ x ])` },
  { latex: `\\left\\{ x \\right\\}`, typst: `lr({ x })` },
  { latex: `\\left\\langle x \\right\\rangle`, typst: `lr(chevron.l x chevron.r)` },
  { latex: `\\left( x \\right.`, typst: `( x` },
  { latex: `\\left. x \\right)`, typst: `x )` },

  // === Token spacing inside \left...\right delimiters ===
  { latex: `\\left[\\sum_{t=1}^{T} \\log p_{\\theta}\\right]`, typst: `lr([ sum_(t = 1)^T log p_(theta) ])` },
  { latex: `\\max _{\\theta} \\mathbb{E}_{\\mathbf{z} \\sim \\mathcal{Z}_{T}}\\left[\\sum_{t=1}^{T} \\log p_{\\theta}\\left(x_{z_{t}} | \\mathbf{x}_{\\mathbf{z}_{<t}}\\right)\\right]`, typst: `max_(theta) EE_(upright(bold(z)) tilde.op cal(Z)_T) lr([ sum_(t = 1)^T log p_(theta) lr(( x_(z_t)|upright(bold(x))_(upright(bold(z))_(< t)) )) ])` },

  // === Matrices ===
  { latex: `\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}`, typst: `mat(delim: "(", a, b; c, d)` },
  { latex: `\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}`, typst: `mat(delim: "[", a, b; c, d)` },
  { latex: `\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}`, typst: `mat(delim: "|", a, b; c, d)` },

  // === Cases ===
  { latex: `\\begin{cases} x & \\text{if } x > 0 \\\\ -x & \\text{otherwise} \\end{cases}`, typst: `cases(x & "if " x > 0, - x & "otherwise")` },

  // === Misc symbols ===
  { latex: `\\infty`, typst: `infinity` },
  { latex: `\\nabla f`, typst: `nabla f` },
  { latex: `\\partial x`, typst: `partial x` },
  { latex: `\\forall x`, typst: `forall x` },
  { latex: `\\exists x`, typst: `exists x` },
  { latex: `\\emptyset`, typst: `emptyset` },
  { latex: `\\neg p`, typst: `not p` },

  // === Dots ===
  { latex: `\\cdots`, typst: `dots.c` },
  { latex: `\\ldots`, typst: `dots` },
  { latex: `\\vdots`, typst: `dots.v` },
  { latex: `\\ddots`, typst: `dots.down` },

  // === Spacing ===
  { latex: `a \\quad b`, typst: `a quad b` },
  { latex: `a \\, b`, typst: `a thin b` },

  // === Fractions ===
  { latex: `\\binom{n}{k}`, typst: `binom(n, k)` },
  { latex: `\\frac{x+1}{x-1}`, typst: `frac(x + 1, x - 1)` },
  { latex: `\\frac{\\partial f}{\\partial x}`, typst: `frac(partial f, partial x)` },

  // === Literal slash (escaped — Typst / creates a fraction) ===
  { latex: `a/b`, typst: `a\\/ b` },
  { latex: `1/2`, typst: `1\\/ 2` },
  { latex: `dy/dx`, typst: `d y\\/ d x` },

  // === Combined expressions ===
  { latex: `\\alpha + \\beta`, typst: `alpha + beta` },
  { latex: `\\sum_{i=1}^{n} x_i`, typst: `sum_(i = 1)^n x_i` },
  { latex: `\\lim_{n \\to \\infty} a_n`, typst: `lim_(n arrow.r infinity) a_n` },
  { latex: `e^{i\\pi} + 1 = 0`, typst: `e^(i pi) + 1 = 0` },
  { latex: `\\cancel{x}`, typst: `cancel(x)` },
  { latex: `\\text{if } x > 0`, typst: `"if " x > 0` },

  // === Phantom variants (Typst hide preserves dimensions) ===
  { latex: `\\phantom{x}`, typst: `#hide($x$)` },
  { latex: `\\hphantom{x}`, typst: `#hide($x$)` },
  { latex: `\\vphantom{x}`, typst: `#hide($x$)` },

  // === Substack ===
  { latex: `\\sum_{\\substack{i<n \\\\ j<m}}`, typst: `sum_(mat(delim: #none, i < n; j < m))` },

  // === Mod variants ===
  { latex: `a \\bmod b`, typst: `a mod b` },
  { latex: `a \\pmod{b}`, typst: `a quad (mod b)` },

  // === Cancel variants ===
  { latex: `\\bcancel{x}`, typst: `cancel(inverted: #true, x)` },

  // === Equation arrays ===
  { latex: `\\begin{aligned} a &= b \\\\ c &= d \\end{aligned}`, typst: `a = b \\\nc = d` },

  // === Log with subscript ===
  { latex: `\\log_2 x`, typst: `log_2 x` },

  // === Choose (binom) ===
  { latex: `a \\choose b`, typst: `binom(a, b)` },

  // === Negated relations ===
  { latex: `\\not\\equiv`, typst: `equiv.not` },
  { latex: `\\not\\leq`, typst: `lt.eq.not` },
  { latex: `\\not\\sim`, typst: `tilde.not` },

  // === Text with font variants ===
  { latex: `\\textbf{bold}`, typst: `bold("bold")` },

  // === Color ===
  { latex: `\\color{red}{x}`, typst: `#text(fill: red)[x]` },

  // === Boxed ===
  { latex: `\\boxed{x=1}`, typst: `#box(stroke: 0.5pt, inset: 3pt, $x = 1$)` },

  // === Big delimiters ===
  { latex: `\\big( x \\big)`, typst: `lr(size: #1.2em, ( x ))` },
  { latex: `\\Big( x \\Big)`, typst: `lr(size: #1.623em, ( x ))` },
  { latex: `\\bigg( x \\bigg)`, typst: `lr(size: #2.047em, ( x ))` },
  { latex: `\\Bigg( x \\Bigg)`, typst: `lr(size: #2.470em, ( x ))` },

  // === Non-shorthand accents ===
  { latex: `\\overleftarrow{AB}`, typst: `accent(A B, arrow.l)` },

  // === Math italic ===
  { latex: `\\mathit{word}`, typst: `italic("word")` },

  // === Nested expressions ===
  { latex: `\\frac{\\sum_{i=1}^{n} x_i}{n}`, typst: `frac(sum_(i = 1)^n x_i, n)` },
  { latex: `\\sqrt{\\frac{a}{b}}`, typst: `sqrt(frac(a, b))` },
  { latex: `\\left(\\frac{a}{b}\\right)^2`, typst: `lr(( frac(a, b) ))^2` },

  // === Text spacing ===
  { latex: `x \\text{ and } y`, typst: `x " and " y` },

  // === Thin space preserved ===
  { latex: `\\iint_D f(x,y) \\, dA`, typst: `integral.double_D f(x, y) thin d A` },

  // === Operatorname with limits ===
  { latex: `\\operatorname*{argmax}_{x} f(x)`, typst: `op("argmax", limits: #true)_x f(x)` },

  // === Delimiter optimizations ===
  { latex: `\\left|x\\right|`, typst: `norm(x)` },
  { latex: `\\left\\lfloor x\\right\\rfloor`, typst: `floor(x)` },
  { latex: `\\left\\lceil x\\right\\rceil`, typst: `ceil(x)` },

  // === mathbb doubled-letter shorthand ===
  { latex: `\\mathbb{Z}`, typst: `ZZ` },
  { latex: `\\mathbb{N}`, typst: `NN` },
  { latex: `\\mathbb{C}`, typst: `CC` },

  // === boldsymbol (italic bold, not upright bold) ===
  { latex: `\\boldsymbol{v}`, typst: `bold(v)` },

  // === aleph ===
  { latex: `\\aleph`, typst: `aleph` },

  // === stackrel / overset / underset ===
  { latex: `\\stackrel{f}{\\rightarrow}`, typst: `limits(arrow.r)^f` },
  { latex: `\\overset{n}{=}`, typst: `limits(=)^n` },
  { latex: `\\underset{n}{=}`, typst: `limits(=)_n` },

  // === Vmatrix (double bar delimiter) ===
  { latex: `\\begin{Vmatrix} a & b \\\\ c & d \\end{Vmatrix}`, typst: `mat(delim: "‖", a, b; c, d)` },

  // === nmid ===
  { latex: `a \\nmid b`, typst: `a divides.not b` },

  // === Prime shorthand ===
  { latex: `f'(x)`, typst: `f'(x)` },
  { latex: `f''(x)`, typst: `f''(x)` },

  // === Parallel ===
  { latex: `a \\parallel b`, typst: `a parallel b` },

  // === Extensible arrows ===
  { latex: `\\xrightarrow{f}`, typst: `limits(arrow.r)^f` },
  { latex: `\\xleftarrow{g}`, typst: `limits(arrow.l)^g` },

  // === mathbb on numbers ===
  { latex: `\\mathbb{1}`, typst: `bb(1)` },

  // === Literal parens in superscript ===
  { latex: `f^{(n)}(a)`, typst: `f^((n))(a)` },

  // === Rare symbols ===
  { latex: `\\rightleftharpoons`, typst: `harpoons.rtlb` },
  { latex: `A \\lhd B`, typst: `A lt.tri B` },
  { latex: `A \\wr B`, typst: `A wreath B` },

  // === Multiscripts (attach) ===
  { latex: `\\sideset{_a^b}{_c^d} \\sum`, typst: `attach(sum, tl: b, bl: a, t: d, b: c)` },
  { latex: `\\sideset{_1^2}{} \\sum`, typst: `attach(sum, tl: 2, bl: 1)` },

  // === Mathring accent ===
  { latex: `\\mathring{x}`, typst: `circle(x)` },

  // === Array lines (augment) ===
  { latex: `\\begin{array}{|c|c|} \\hline a & b \\\\ \\hline c & d \\\\ \\hline \\end{array}`, typst: `#box(stroke: 0.5pt, inset: 3pt, $ mat(delim: #none, augment: #(hline: 1, vline: 1), a, b; c, d) $)` },
  { latex: `\\begin{array}{c|c} a & b \\\\ c & d \\end{array}`, typst: `mat(delim: #none, augment: #(vline: 1), a, b; c, d)` },
  { latex: `\\begin{array}{lcr} a & b & c \\end{array}`, typst: `mat(delim: #none, a, b, c)` },

  // === Equation tags ===
  { latex: `E = mc^2 \\tag{1}`, typst: `#math.equation(block: true, numbering: n => [(1)], $ E = m c^2 $)` },
  { latex: `E = mc^2 \\tag{1.2}`, typst: `#math.equation(block: true, numbering: n => [(1.2)], $ E = m c^2 $)` },
  { latex: `\\begin{align} a &= b \\tag{1} \\\\ c &= d \\tag{2} \\end{align}`, typst: `#math.equation(block: true, numbering: n => [(1)], $ a = b $)\n#math.equation(block: true, numbering: n => [(2)], $ c = d $)` },
  { latex: `\\begin{align} x &= 1 \\tag{A} \\\\ y &= 2 \\tag{B} \\end{align}`, typst: `#math.equation(block: true, numbering: n => [(A)], $ x = 1 $)\n#math.equation(block: true, numbering: n => [(B)], $ y = 2 $)` },
  { latex: `\\begin{equation*} S_{20} \\tag{1} \\end{equation*}`, typst: `#math.equation(block: true, numbering: n => [(1)], $ S_(20) $)` },
  { latex: `\\begin{equation} x^2 \\tag{$x\\sqrt{5}$ 1.3.1} \\end{equation}`, typst: `#math.equation(block: true, numbering: n => [($x sqrt(5)$ 1.3.1)], $ x^2 $)` },
  { latex: `\\begin{equation} \\begin{split} a &= b+c \\\\ &= d \\end{split} \\end{equation}`, typst: `#math.equation(block: true, numbering: "(1)", $ a = b + c \\\n = d $)` },
  { latex: `\\begin{align*} a &= b+c \\\\ &= d \\end{align*}`, typst: `a = b + c \\\n = d` },
  { latex: `\\begin{align} a &= b \\\\ c &= d \\nonumber \\end{align}`, typst: `#math.equation(block: true, numbering: "(1)", $ a = b $)\n$ c = d $` },
  { latex: `\\begin{gather} x = 1 \\\\ y = 2 \\end{gather}`, typst: `#math.equation(block: true, numbering: "(1)", $ x = 1 $)\n#math.equation(block: true, numbering: "(1)", $ y = 2 $)` },

  // === Empty base superscript, pipes as absolute value, operator before paren ===
  { latex: `^{|\\alpha|} \\sqrt{x^{\\alpha}} \\leq(x \\bullet \\alpha) /|\\alpha|`, typst: `""^(|alpha|) sqrt(x^(alpha)) lt.eq (x bullet alpha)\\/ lr(| alpha |)` },

  // === numcases / subnumcases ===
  { latex: `\\begin{numcases}{f(x)=} 0 & x < 0 \\\\ x & x \\geq 0 \\end{numcases}`, typst: `f(x) = cases(0 & "x < 0 ", x & "x \\geq 0 ")` },
  { latex: `\\begin{subnumcases}{|x|=} -x & x < 0 \\\\ x & x \\geq 0 \\end{subnumcases}`, typst: `|x| = cases(- x & "x < 0 ", x & "x \\geq 0 ")` },
];
