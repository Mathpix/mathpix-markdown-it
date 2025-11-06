module.exports = [
  {
    latex: '^{(2)}',
    ascii: '^((2))',
    linear: '⁽²⁾',
  },
  {
    latex: '^{(2+3)}',
    ascii: '^((2+3))',
    linear: '⁽²⁺³⁾',
  },
  {
    latex: '^{(2+3}',
    ascii: '^((2+3)',
    linear: '⁽²⁺³',
  },
  {
    latex: '_{(2)}',
    ascii: '_((2))',
    linear: '₍₂₎',
  },
  {
    latex: '_{(2+3)}',
    ascii: '_((2+3))',
    linear: '₍₂₊₃₎',
  },
  {
    latex: '_{(2+3}',
    ascii: '_((2+3)',
    linear: '₍₂₊₃',
  },
  {
    latex: '4^{(2)}_{(2)}',
    ascii: '4_((2))^((2))',
    linear: '4₍₂₎⁽²⁾',
  },
  {
    latex: '4^{(2+3)}_{(2+3)}',
    ascii: '4_((2+3))^((2+3))',
    linear: '4₍₂₊₃₎⁽²⁺³⁾',
  },
  {
    latex: '\\bigcap_{i=1}^n',
    ascii: 'nnn_(i=1)^(n)',
    linear: '⋂_(i=1)^n',
  },
  {
    latex: '\\inf_{i=1}^n',
    ascii: 'i n f_(i=1)^(n)',
    linear: 'inf_(i=1)^n',
  },
  {
    latex: '\\sup_{i=1}^n',
    ascii: 's u p_(i=1)^(n)',
    linear: 'sup_(i=1)^n',
  },
  {
    latex: '\\injlim_{i=1}^n',
    ascii: 'i n j   l i m_(i=1)^(n)',
    linear: '(inj lim)_(i=1)^n',
  },
  {
    latex: '\\injlim\\nolimits_{i=1}^n',
    ascii: 'inj lim_(i=1)^(n)',
    linear: '(inj lim)ᵢ₌₁ⁿ',
  },
  {
    latex: '\\varinjlim_{i=1}^n',
    ascii: 'lim rarr_(i=1)^(n)',
    linear: 'lim→_(i=1)^n',
  },
  {
    latex: '\\begin{aligned}\n' +
      '2x+3 &= 7 & 2x+3-3 \\\\\n' +
      '2x &= 4 & \\frac{2x}2  \\\\\n' +
      'x &= 2 &\n' +
      '\\end{aligned}',
    ascii: '{:[2x+3=72x+3-3],[2x=4(2x)/(2)],[x=2]:}',
    linear: '2x+3=7 2x+3−3\n2x=4 (2x)/2\nx=2 ',
  },
  {
    latex: 'T_{x}\\left(\\theta_{r}\\right)=\\left[\\begin{array}{cccc}\n' +
      '1 & 0 & 0 & 0 \\\\\n' +
      '0 & \\cos \\theta_{r} & \\sin \\theta_{r} & 0 \\\\\n' +
      '0 & -\\sin \\theta_{r} & \\cos \\theta_{r} & 0 \\\\\n' +
      '0 & 0 & 0 & 1\n' +
      '\\end{array}\\right]',
    ascii: 'T_(x)(theta_(r))=[[1,0,0,0],[0,cos theta_(r),sin theta_(r),0],[0,-sin theta_(r),cos theta_(r),0],[0,0,0,1]]',
    linear: 'Tₓ(θᵣ)=[[1,0,0,0],[0,cos θᵣ,sin θᵣ,0],[0,−sin θᵣ,cos θᵣ,0],[0,0,0,1]]',
  },
  {
    latex: '\\xtwoheadrightarrow[du=dx]{u=x+1}',
    ascii: '->>_("du=dx")^("u=x+1")',
    linear: '↠_(du=dx)^(u=x+1)'
  },
  {
    latex: '\\bar x',
    ascii: 'bar(x)',
    linear: 'x̄'
  },
  {
    latex: '\\bar xy',
    ascii: 'bar(x)y',
    linear: 'x̄y'
  },
  {
    latex: '\\bar{xy}',
    ascii: 'bar(xy)',
    linear: '(xy)¯'
  },
  {
    latex: '\\breve e',
    ascii: 'e^(˘)',
    linear: 'ĕ'
  },
  {
    latex: '62.3^{\\circ}',
    ascii: '62.3^(@)',
    linear: '62.3°'
  },
  {
    latex: '\\theta^{\\prime}',
    ascii: 'theta^(\')',
    linear: 'θ′'
  },
  {
    latex: '\\mathring{A}',
    ascii: 'A^(˚)',
    linear: 'Å'
  },
  {
    latex: '\\overleftrightarrow{AB}',
    ascii: 'AB^(harr)',
    linear: '(AB) ⃡'
  },
  {
    latex: '\\dddot{x}',
    ascii: 'x^(⃛)',
    linear: 'x⃛'
  },
  {
    latex: '{}^{*}',
    ascii: '^(**)',
    linear: '^∗'
  },
  {
    latex: '\\omega^\\star(0)',
    ascii: 'omega^(***)(0)',
    linear: 'ω^⋆(0)'
  },
  {
    latex: '10^6',
    ascii: '10^(6)',
    linear: '10⁶'
  },
  {
    latex: 'x^{(n+1)}',
    ascii: 'x^((n+1))',
    linear: 'x⁽ⁿ⁺¹⁾'
  },
  {
    latex: 'D ^{\\prime \\prime}',
    ascii: 'D^(\'\')',
    linear: 'D′′'
  },
  {
    latex: 'D^{\\prime \\prime \\prime}',
    ascii: 'D^(\'\'\')',
    linear: 'D′′′'
  },
  {
    latex: '\\dot{q}_{c r}^{\\prime \\prime}',
    ascii: 'q^(˙)_(cr)^(\'\')',
    linear: 'q̇_(cr)′′'
  },
  {
    latex: 'P_{\\text {int }}',
    ascii: 'P_("int ")',
    linear: 'Pᵢₙₜ'
  },
  {
    latex: 'x^{-3}',
    ascii: 'x^(-3)',
    linear: 'x⁻³'
  },
  {
    latex: '\\sqrt[n]{abc}',
    ascii: 'root(n)(abc)',
    linear: ' ⁿ√(abc)'
  },
  {
    latex: '\\lim _{x \\rightarrow c}',
    ascii: 'lim_(x rarr c)',
    linear: 'lim_(x→c)'
  },
  {
    latex: '\\lim _{x \\leftarrow c}',
    ascii: 'lim_(x larr c)',
    linear: 'lim_(x←c)'
  },
]
