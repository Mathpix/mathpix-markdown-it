module.exports = [
  {
    latex: '^{(2)}',
    asciimath: '^((2))',
    linearmath: '⁽²⁾',
  },
  {
    latex: '^{(2+3)}',
    asciimath: '^((2+3))',
    linearmath: '⁽²⁺³⁾',
  },
  {
    latex: '^{(2+3}',
    asciimath: '^((2+3)',
    linearmath: '⁽²⁺³',
  },
  {
    latex: '_{(2)}',
    asciimath: '_((2))',
    linearmath: '₍₂₎',
  },
  {
    latex: '_{(2+3)}',
    asciimath: '_((2+3))',
    linearmath: '₍₂₊₃₎',
  },
  {
    latex: '_{(2+3}',
    asciimath: '_((2+3)',
    linearmath: '₍₂₊₃',
  },
  {
    latex: '4^{(2)}_{(2)}',
    asciimath: '4_((2))^((2))',
    linearmath: '4₍₂₎⁽²⁾',
  },
  {
    latex: '4^{(2+3)}_{(2+3)}',
    asciimath: '4_((2+3))^((2+3))',
    linearmath: '4₍₂₊₃₎⁽²⁺³⁾',
  },
  {
    latex: '\\bigcap_{i=1}^n',
    asciimath: 'nnn_(i=1)^(n)',
    linearmath: '⋂_(i=1)^n',
  },
  {
    latex: '\\inf_{i=1}^n',
    asciimath: 'i n f_(i=1)^(n)',
    linearmath: 'inf_(i=1)^n',
  },
  {
    latex: '\\sup_{i=1}^n',
    asciimath: 's u p_(i=1)^(n)',
    linearmath: 'sup_(i=1)^n',
  },
  {
    latex: '\\injlim_{i=1}^n',
    asciimath: 'i n j   l i m_(i=1)^(n)',
    linearmath: '(inj lim)_(i=1)^n',
  },
  {
    latex: '\\injlim\\nolimits_{i=1}^n',
    asciimath: 'inj lim_(i=1)^(n)',
    linearmath: '(inj lim)ᵢ₌₁ⁿ',
  },
  {
    latex: '\\varinjlim_{i=1}^n',
    asciimath: 'lim rarr_(i=1)^(n)',
    linearmath: 'lim→_(i=1)^n',
  },
  {
    latex: '\\begin{aligned}\n' +
      '2x+3 &= 7 & 2x+3-3 \\\\\n' +
      '2x &= 4 & \\frac{2x}2  \\\\\n' +
      'x &= 2 &\n' +
      '\\end{aligned}',
    asciimath: '{:[2x+3=72x+3-3],[2x=4(2x)/(2)],[x=2]:}',
    linearmath: '2x+3=7 2x+3−3\n2x=4 (2x)/2\nx=2 ',
  },
  {
    latex: 'T_{x}\\left(\\theta_{r}\\right)=\\left[\\begin{array}{cccc}\n' +
      '1 & 0 & 0 & 0 \\\\\n' +
      '0 & \\cos \\theta_{r} & \\sin \\theta_{r} & 0 \\\\\n' +
      '0 & -\\sin \\theta_{r} & \\cos \\theta_{r} & 0 \\\\\n' +
      '0 & 0 & 0 & 1\n' +
      '\\end{array}\\right]',
    asciimath: 'T_(x)(theta_(r))=[[1,0,0,0],[0,cos theta_(r),sin theta_(r),0],[0,-sin theta_(r),cos theta_(r),0],[0,0,0,1]]',
    linearmath: 'Tₓ(θᵣ)=[[1,0,0,0],[0,cos θᵣ,sin θᵣ,0],[0,−sin θᵣ,cos θᵣ,0],[0,0,0,1]]',
  },
  {
    latex: '\\xtwoheadrightarrow[du=dx]{u=x+1}',
    asciimath: '->>_("du=dx")^("u=x+1")',
    linearmath: '↠_(du=dx)^(u=x+1)'
  },
  {
    latex: '\\bar x',
    asciimath: 'bar(x)',
    linearmath: 'x̄'
  },
  {
    latex: '\\bar xy',
    asciimath: 'bar(x)y',
    linearmath: 'x̄y'
  },
  {
    latex: '\\bar{xy}',
    asciimath: 'bar(xy)',
    linearmath: '(xy)¯'
  },
  {
    latex: '\\breve e',
    asciimath: 'e^(˘)',
    linearmath: 'ĕ'
  },
  {
    latex: '62.3^{\\circ}',
    asciimath: '62.3^(@)',
    linearmath: '62.3°'
  },
  {
    latex: '\\theta^{\\prime}',
    asciimath: 'theta^(\')',
    linearmath: 'θ′'
  },
  {
    latex: '\\mathring{A}',
    asciimath: 'A^(˚)',
    linearmath: 'Å'
  },
  {
    latex: '\\overleftrightarrow{AB}',
    asciimath: 'AB^(harr)',
    linearmath: '(AB) ⃡'
  },
  {
    latex: '\\dddot{x}',
    asciimath: 'x^(⃛)',
    linearmath: 'x⃛'
  },
  {
    latex: '{}^{*}',
    asciimath: '^(**)',
    linearmath: '^∗'
  },
  {
    latex: '\\omega^\\star(0)',
    asciimath: 'omega^(***)(0)',
    linearmath: 'ω^⋆(0)'
  },
  {
    latex: '10^6',
    asciimath: '10^(6)',
    linearmath: '10⁶'
  },
  {
    latex: 'x^{(n+1)}',
    asciimath: 'x^((n+1))',
    linearmath: 'x⁽ⁿ⁺¹⁾'
  },
  {
    latex: 'D ^{\\prime \\prime}',
    asciimath: 'D^(\'\')',
    linearmath: 'D′′'
  },
  {
    latex: 'D^{\\prime \\prime \\prime}',
    asciimath: 'D^(\'\'\')',
    linearmath: 'D′′′'
  },
  {
    latex: '\\dot{q}_{c r}^{\\prime \\prime}',
    asciimath: 'q^(˙)_(cr)^(\'\')',
    linearmath: 'q̇_(cr)′′'
  },
  {
    latex: 'P_{\\text {int }}',
    asciimath: 'P_("int ")',
    linearmath: 'Pᵢₙₜ'
  },
  {
    latex: 'x^{-3}',
    asciimath: 'x^(-3)',
    linearmath: 'x⁻³'
  },
  {
    latex: '\\sqrt[n]{abc}',
    asciimath: 'root(n)(abc)',
    linearmath: ' ⁿ√(abc)'
  },
  {
    latex: '\\lim _{x \\rightarrow c}',
    asciimath: 'lim_(x rarr c)',
    linearmath: 'lim_(x→c)'
  },
  {
    latex: '\\lim _{x \\leftarrow c}',
    asciimath: 'lim_(x larr c)',
    linearmath: 'lim_(x←c)'
  },
]
