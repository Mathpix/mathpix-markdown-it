module.exports = [
  {
    latex_input: '$\\lim_{x\\rightarrow 0}{x^2}$',
    latex: "\\lim_{x\\rightarrow 0}{x^2}",
    asciimath: 'lim_(x rarr0)x^(2)',
    mathml: '<math xmlns="http://www.w3.org/1998/Math/MathML">\n' +
      '  <munder>\n' +
      '    <mo data-mjx-texclass="OP" movablelimits="true">lim</mo>\n' +
      '    <mrow>\n' +
      '      <mi>x</mi>\n' +
      '      <mo stretchy="false">→</mo>\n' +
      '      <mn>0</mn>\n' +
      '    </mrow>\n' +
      '  </munder>\n' +
      '  <mrow>\n' +
      '    <msup>\n' +
      '      <mi>x</mi>\n' +
      '      <mn>2</mn>\n' +
      '    </msup>\n' +
      '  </mrow>\n' +
      '</math>',
  },
  {
    latex_input: '\\begin{aligned}\n' +
      '\\frac{\\partial f}{\\partial \\boldsymbol{A}}: \\boldsymbol{T} &=\\left.\\frac{d}{d \\alpha}\\left[\\alpha^{3} \\operatorname{det}(\\boldsymbol{A})\\left(\\frac{1}{\\alpha^{3}}+I_{1}\\left(\\boldsymbol{A}^{-1} \\cdot \\boldsymbol{T}\\right) \\frac{1}{\\alpha^{2}}+I_{2}\\left(\\boldsymbol{A}^{-1} \\cdot \\boldsymbol{T}\\right) \\frac{1}{\\alpha}+I_{3}\\left(\\boldsymbol{A}^{-1} \\cdot \\boldsymbol{T}\\right)\\right)\\right]\\right|_{0} \\\\\n' +
      '&=\\left.\\operatorname{det}(\\boldsymbol{A}) \\frac{d}{d \\alpha}\\left[1+I_{1}\\left(\\boldsymbol{A}^{-1} \\cdot \\boldsymbol{T}\\right) \\alpha+I_{2}\\left(\\boldsymbol{A}^{-1} \\cdot \\boldsymbol{T}\\right) \\alpha^{2}+I_{3}\\left(\\boldsymbol{A}^{-1} \\cdot \\boldsymbol{T}\\right) \\alpha^{3}\\right]\\right|_{a-0} \\\\\n' +
      '&=\\left.\\operatorname{det}(\\boldsymbol{A})\\left[I_{1}\\left(\\boldsymbol{A}^{-1} \\cdot \\boldsymbol{T}\\right)+2 I_{2}\\left(\\boldsymbol{A}^{-1} \\cdot \\boldsymbol{T}\\right) \\alpha+3 I_{3}\\left(\\boldsymbol{A}^{-1} \\cdot \\boldsymbol{T}\\right) \\alpha^{2}\\right]\\right|_{\\alpha=0} \\\\\n' +
      '&=\\operatorname{det}(\\boldsymbol{A}) I_{1}\\left(\\boldsymbol{A}^{-1} \\cdot \\boldsymbol{T}\\right)\n' +
      '\\end{aligned}',
    latex: '\\begin{aligned}\n' +
      '\\frac{\\partial f}{\\partial \\boldsymbol{A}}: \\boldsymbol{T} &=\\left.\\frac{d}{d \\alpha}\\left[\\alpha^{3} \\operatorname{det}(\\boldsymbol{A})\\left(\\frac{1}{\\alpha^{3}}+I_{1}\\left(\\boldsymbol{A}^{-1} \\cdot \\boldsymbol{T}\\right) \\frac{1}{\\alpha^{2}}+I_{2}\\left(\\boldsymbol{A}^{-1} \\cdot \\boldsymbol{T}\\right) \\frac{1}{\\alpha}+I_{3}\\left(\\boldsymbol{A}^{-1} \\cdot \\boldsymbol{T}\\right)\\right)\\right]\\right|_{0} \\\\\n' +
      '&=\\left.\\operatorname{det}(\\boldsymbol{A}) \\frac{d}{d \\alpha}\\left[1+I_{1}\\left(\\boldsymbol{A}^{-1} \\cdot \\boldsymbol{T}\\right) \\alpha+I_{2}\\left(\\boldsymbol{A}^{-1} \\cdot \\boldsymbol{T}\\right) \\alpha^{2}+I_{3}\\left(\\boldsymbol{A}^{-1} \\cdot \\boldsymbol{T}\\right) \\alpha^{3}\\right]\\right|_{a-0} \\\\\n' +
      '&=\\left.\\operatorname{det}(\\boldsymbol{A})\\left[I_{1}\\left(\\boldsymbol{A}^{-1} \\cdot \\boldsymbol{T}\\right)+2 I_{2}\\left(\\boldsymbol{A}^{-1} \\cdot \\boldsymbol{T}\\right) \\alpha+3 I_{3}\\left(\\boldsymbol{A}^{-1} \\cdot \\boldsymbol{T}\\right) \\alpha^{2}\\right]\\right|_{\\alpha=0} \\\\\n' +
      '&=\\operatorname{det}(\\boldsymbol{A}) I_{1}\\left(\\boldsymbol{A}^{-1} \\cdot \\boldsymbol{T}\\right)\n' +
      '\\end{aligned}',
    asciimath: '{:[(del f)/(del A):T=(d)/(d alpha)[alpha^(3)det(A)((1)/(alpha^(3))+I_(1)(A^(-1)*T)(1)/(alpha^(2))+I_(2)(A^(-1)*T)(1)/(alpha)+I_(3)(A^(-1)*T))]|_(0)],[= det(A)(d)/(d alpha)[1+I_(1)(A^(-1)*T)alpha+I_(2)(A^(-1)*T)alpha^(2)+I_(3)(A^(-1)*T)alpha^(3)]|_(a-0)],[= det(A)[I_(1)(A^(-1)*T)+2I_(2)(A^(-1)*T)alpha+3I_(3)(A^(-1)*T)alpha^(2)]|_(alpha=0)],[=det(A)I_(1)(A^(-1)*T)]:}',
    mathml:  '<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">\n' +
      '  <mtable displaystyle="true" columnalign="right left right left right left right left right left right left" columnspacing="0em 2em 0em 2em 0em 2em 0em 2em 0em 2em 0em" rowspacing="3pt">\n' +
      '    <mtr>\n' +
      '      <mtd>\n' +
      '        <mfrac>\n' +
      '          <mrow>\n' +
      '            <mi mathvariant="normal">∂</mi>\n' +
      '            <mi>f</mi>\n' +
      '          </mrow>\n' +
      '          <mrow>\n' +
      '            <mi mathvariant="normal">∂</mi>\n' +
      '            <mi mathvariant="bold-italic">A</mi>\n' +
      '          </mrow>\n' +
      '        </mfrac>\n' +
      '        <mo>:</mo>\n' +
      '        <mi mathvariant="bold-italic">T</mi>\n' +
      '      </mtd>\n' +
      '      <mtd>\n' +
      '        <mi></mi>\n' +
      '        <mo>=</mo>\n' +
      '        <msub>\n' +
      '          <mrow data-mjx-texclass="INNER">\n' +
      '            <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true"></mo>\n' +
      '            <mfrac>\n' +
      '              <mi>d</mi>\n' +
      '              <mrow>\n' +
      '                <mi>d</mi>\n' +
      '                <mi>α</mi>\n' +
      '              </mrow>\n' +
      '            </mfrac>\n' +
      '            <mrow data-mjx-texclass="INNER">\n' +
      '              <mo data-mjx-texclass="OPEN">[</mo>\n' +
      '              <msup>\n' +
      '                <mi>α</mi>\n' +
      '                <mrow>\n' +
      '                  <mn>3</mn>\n' +
      '                </mrow>\n' +
      '              </msup>\n' +
      '              <mi>det</mi>\n' +
      '              <mo data-mjx-texclass="NONE">⁡</mo>\n' +
      '              <mo stretchy="false">(</mo>\n' +
      '              <mi mathvariant="bold-italic">A</mi>\n' +
      '              <mo stretchy="false">)</mo>\n' +
      '              <mrow data-mjx-texclass="INNER">\n' +
      '                <mo data-mjx-texclass="OPEN">(</mo>\n' +
      '                <mfrac>\n' +
      '                  <mn>1</mn>\n' +
      '                  <msup>\n' +
      '                    <mi>α</mi>\n' +
      '                    <mrow>\n' +
      '                      <mn>3</mn>\n' +
      '                    </mrow>\n' +
      '                  </msup>\n' +
      '                </mfrac>\n' +
      '                <mo>+</mo>\n' +
      '                <msub>\n' +
      '                  <mi>I</mi>\n' +
      '                  <mrow>\n' +
      '                    <mn>1</mn>\n' +
      '                  </mrow>\n' +
      '                </msub>\n' +
      '                <mrow data-mjx-texclass="INNER">\n' +
      '                  <mo data-mjx-texclass="OPEN">(</mo>\n' +
      '                  <msup>\n' +
      '                    <mi mathvariant="bold-italic">A</mi>\n' +
      '                    <mrow>\n' +
      '                      <mo>−</mo>\n' +
      '                      <mn>1</mn>\n' +
      '                    </mrow>\n' +
      '                  </msup>\n' +
      '                  <mo>⋅</mo>\n' +
      '                  <mi mathvariant="bold-italic">T</mi>\n' +
      '                  <mo data-mjx-texclass="CLOSE">)</mo>\n' +
      '                </mrow>\n' +
      '                <mfrac>\n' +
      '                  <mn>1</mn>\n' +
      '                  <msup>\n' +
      '                    <mi>α</mi>\n' +
      '                    <mrow>\n' +
      '                      <mn>2</mn>\n' +
      '                    </mrow>\n' +
      '                  </msup>\n' +
      '                </mfrac>\n' +
      '                <mo>+</mo>\n' +
      '                <msub>\n' +
      '                  <mi>I</mi>\n' +
      '                  <mrow>\n' +
      '                    <mn>2</mn>\n' +
      '                  </mrow>\n' +
      '                </msub>\n' +
      '                <mrow data-mjx-texclass="INNER">\n' +
      '                  <mo data-mjx-texclass="OPEN">(</mo>\n' +
      '                  <msup>\n' +
      '                    <mi mathvariant="bold-italic">A</mi>\n' +
      '                    <mrow>\n' +
      '                      <mo>−</mo>\n' +
      '                      <mn>1</mn>\n' +
      '                    </mrow>\n' +
      '                  </msup>\n' +
      '                  <mo>⋅</mo>\n' +
      '                  <mi mathvariant="bold-italic">T</mi>\n' +
      '                  <mo data-mjx-texclass="CLOSE">)</mo>\n' +
      '                </mrow>\n' +
      '                <mfrac>\n' +
      '                  <mn>1</mn>\n' +
      '                  <mi>α</mi>\n' +
      '                </mfrac>\n' +
      '                <mo>+</mo>\n' +
      '                <msub>\n' +
      '                  <mi>I</mi>\n' +
      '                  <mrow>\n' +
      '                    <mn>3</mn>\n' +
      '                  </mrow>\n' +
      '                </msub>\n' +
      '                <mrow data-mjx-texclass="INNER">\n' +
      '                  <mo data-mjx-texclass="OPEN">(</mo>\n' +
      '                  <msup>\n' +
      '                    <mi mathvariant="bold-italic">A</mi>\n' +
      '                    <mrow>\n' +
      '                      <mo>−</mo>\n' +
      '                      <mn>1</mn>\n' +
      '                    </mrow>\n' +
      '                  </msup>\n' +
      '                  <mo>⋅</mo>\n' +
      '                  <mi mathvariant="bold-italic">T</mi>\n' +
      '                  <mo data-mjx-texclass="CLOSE">)</mo>\n' +
      '                </mrow>\n' +
      '                <mo data-mjx-texclass="CLOSE">)</mo>\n' +
      '              </mrow>\n' +
      '              <mo data-mjx-texclass="CLOSE">]</mo>\n' +
      '            </mrow>\n' +
      '            <mo data-mjx-texclass="CLOSE">|</mo>\n' +
      '          </mrow>\n' +
      '          <mrow>\n' +
      '            <mn>0</mn>\n' +
      '          </mrow>\n' +
      '        </msub>\n' +
      '      </mtd>\n' +
      '    </mtr>\n' +
      '    <mtr>\n' +
      '      <mtd></mtd>\n' +
      '      <mtd>\n' +
      '        <mi></mi>\n' +
      '        <mo>=</mo>\n' +
      '        <msub>\n' +
      '          <mrow data-mjx-texclass="INNER">\n' +
      '            <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true"></mo>\n' +
      '            <mi>det</mi>\n' +
      '            <mo data-mjx-texclass="NONE">⁡</mo>\n' +
      '            <mo stretchy="false">(</mo>\n' +
      '            <mi mathvariant="bold-italic">A</mi>\n' +
      '            <mo stretchy="false">)</mo>\n' +
      '            <mfrac>\n' +
      '              <mi>d</mi>\n' +
      '              <mrow>\n' +
      '                <mi>d</mi>\n' +
      '                <mi>α</mi>\n' +
      '              </mrow>\n' +
      '            </mfrac>\n' +
      '            <mrow data-mjx-texclass="INNER">\n' +
      '              <mo data-mjx-texclass="OPEN">[</mo>\n' +
      '              <mn>1</mn>\n' +
      '              <mo>+</mo>\n' +
      '              <msub>\n' +
      '                <mi>I</mi>\n' +
      '                <mrow>\n' +
      '                  <mn>1</mn>\n' +
      '                </mrow>\n' +
      '              </msub>\n' +
      '              <mrow data-mjx-texclass="INNER">\n' +
      '                <mo data-mjx-texclass="OPEN">(</mo>\n' +
      '                <msup>\n' +
      '                  <mi mathvariant="bold-italic">A</mi>\n' +
      '                  <mrow>\n' +
      '                    <mo>−</mo>\n' +
      '                    <mn>1</mn>\n' +
      '                  </mrow>\n' +
      '                </msup>\n' +
      '                <mo>⋅</mo>\n' +
      '                <mi mathvariant="bold-italic">T</mi>\n' +
      '                <mo data-mjx-texclass="CLOSE">)</mo>\n' +
      '              </mrow>\n' +
      '              <mi>α</mi>\n' +
      '              <mo>+</mo>\n' +
      '              <msub>\n' +
      '                <mi>I</mi>\n' +
      '                <mrow>\n' +
      '                  <mn>2</mn>\n' +
      '                </mrow>\n' +
      '              </msub>\n' +
      '              <mrow data-mjx-texclass="INNER">\n' +
      '                <mo data-mjx-texclass="OPEN">(</mo>\n' +
      '                <msup>\n' +
      '                  <mi mathvariant="bold-italic">A</mi>\n' +
      '                  <mrow>\n' +
      '                    <mo>−</mo>\n' +
      '                    <mn>1</mn>\n' +
      '                  </mrow>\n' +
      '                </msup>\n' +
      '                <mo>⋅</mo>\n' +
      '                <mi mathvariant="bold-italic">T</mi>\n' +
      '                <mo data-mjx-texclass="CLOSE">)</mo>\n' +
      '              </mrow>\n' +
      '              <msup>\n' +
      '                <mi>α</mi>\n' +
      '                <mrow>\n' +
      '                  <mn>2</mn>\n' +
      '                </mrow>\n' +
      '              </msup>\n' +
      '              <mo>+</mo>\n' +
      '              <msub>\n' +
      '                <mi>I</mi>\n' +
      '                <mrow>\n' +
      '                  <mn>3</mn>\n' +
      '                </mrow>\n' +
      '              </msub>\n' +
      '              <mrow data-mjx-texclass="INNER">\n' +
      '                <mo data-mjx-texclass="OPEN">(</mo>\n' +
      '                <msup>\n' +
      '                  <mi mathvariant="bold-italic">A</mi>\n' +
      '                  <mrow>\n' +
      '                    <mo>−</mo>\n' +
      '                    <mn>1</mn>\n' +
      '                  </mrow>\n' +
      '                </msup>\n' +
      '                <mo>⋅</mo>\n' +
      '                <mi mathvariant="bold-italic">T</mi>\n' +
      '                <mo data-mjx-texclass="CLOSE">)</mo>\n' +
      '              </mrow>\n' +
      '              <msup>\n' +
      '                <mi>α</mi>\n' +
      '                <mrow>\n' +
      '                  <mn>3</mn>\n' +
      '                </mrow>\n' +
      '              </msup>\n' +
      '              <mo data-mjx-texclass="CLOSE">]</mo>\n' +
      '            </mrow>\n' +
      '            <mo data-mjx-texclass="CLOSE">|</mo>\n' +
      '          </mrow>\n' +
      '          <mrow>\n' +
      '            <mi>a</mi>\n' +
      '            <mo>−</mo>\n' +
      '            <mn>0</mn>\n' +
      '          </mrow>\n' +
      '        </msub>\n' +
      '      </mtd>\n' +
      '    </mtr>\n' +
      '    <mtr>\n' +
      '      <mtd></mtd>\n' +
      '      <mtd>\n' +
      '        <mi></mi>\n' +
      '        <mo>=</mo>\n' +
      '        <msub>\n' +
      '          <mrow data-mjx-texclass="INNER">\n' +
      '            <mo data-mjx-texclass="OPEN" fence="true" stretchy="true" symmetric="true"></mo>\n' +
      '            <mi>det</mi>\n' +
      '            <mo data-mjx-texclass="NONE">⁡</mo>\n' +
      '            <mo stretchy="false">(</mo>\n' +
      '            <mi mathvariant="bold-italic">A</mi>\n' +
      '            <mo stretchy="false">)</mo>\n' +
      '            <mrow data-mjx-texclass="INNER">\n' +
      '              <mo data-mjx-texclass="OPEN">[</mo>\n' +
      '              <msub>\n' +
      '                <mi>I</mi>\n' +
      '                <mrow>\n' +
      '                  <mn>1</mn>\n' +
      '                </mrow>\n' +
      '              </msub>\n' +
      '              <mrow data-mjx-texclass="INNER">\n' +
      '                <mo data-mjx-texclass="OPEN">(</mo>\n' +
      '                <msup>\n' +
      '                  <mi mathvariant="bold-italic">A</mi>\n' +
      '                  <mrow>\n' +
      '                    <mo>−</mo>\n' +
      '                    <mn>1</mn>\n' +
      '                  </mrow>\n' +
      '                </msup>\n' +
      '                <mo>⋅</mo>\n' +
      '                <mi mathvariant="bold-italic">T</mi>\n' +
      '                <mo data-mjx-texclass="CLOSE">)</mo>\n' +
      '              </mrow>\n' +
      '              <mo>+</mo>\n' +
      '              <mn>2</mn>\n' +
      '              <msub>\n' +
      '                <mi>I</mi>\n' +
      '                <mrow>\n' +
      '                  <mn>2</mn>\n' +
      '                </mrow>\n' +
      '              </msub>\n' +
      '              <mrow data-mjx-texclass="INNER">\n' +
      '                <mo data-mjx-texclass="OPEN">(</mo>\n' +
      '                <msup>\n' +
      '                  <mi mathvariant="bold-italic">A</mi>\n' +
      '                  <mrow>\n' +
      '                    <mo>−</mo>\n' +
      '                    <mn>1</mn>\n' +
      '                  </mrow>\n' +
      '                </msup>\n' +
      '                <mo>⋅</mo>\n' +
      '                <mi mathvariant="bold-italic">T</mi>\n' +
      '                <mo data-mjx-texclass="CLOSE">)</mo>\n' +
      '              </mrow>\n' +
      '              <mi>α</mi>\n' +
      '              <mo>+</mo>\n' +
      '              <mn>3</mn>\n' +
      '              <msub>\n' +
      '                <mi>I</mi>\n' +
      '                <mrow>\n' +
      '                  <mn>3</mn>\n' +
      '                </mrow>\n' +
      '              </msub>\n' +
      '              <mrow data-mjx-texclass="INNER">\n' +
      '                <mo data-mjx-texclass="OPEN">(</mo>\n' +
      '                <msup>\n' +
      '                  <mi mathvariant="bold-italic">A</mi>\n' +
      '                  <mrow>\n' +
      '                    <mo>−</mo>\n' +
      '                    <mn>1</mn>\n' +
      '                  </mrow>\n' +
      '                </msup>\n' +
      '                <mo>⋅</mo>\n' +
      '                <mi mathvariant="bold-italic">T</mi>\n' +
      '                <mo data-mjx-texclass="CLOSE">)</mo>\n' +
      '              </mrow>\n' +
      '              <msup>\n' +
      '                <mi>α</mi>\n' +
      '                <mrow>\n' +
      '                  <mn>2</mn>\n' +
      '                </mrow>\n' +
      '              </msup>\n' +
      '              <mo data-mjx-texclass="CLOSE">]</mo>\n' +
      '            </mrow>\n' +
      '            <mo data-mjx-texclass="CLOSE">|</mo>\n' +
      '          </mrow>\n' +
      '          <mrow>\n' +
      '            <mi>α</mi>\n' +
      '            <mo>=</mo>\n' +
      '            <mn>0</mn>\n' +
      '          </mrow>\n' +
      '        </msub>\n' +
      '      </mtd>\n' +
      '    </mtr>\n' +
      '    <mtr>\n' +
      '      <mtd></mtd>\n' +
      '      <mtd>\n' +
      '        <mi></mi>\n' +
      '        <mo>=</mo>\n' +
      '        <mi>det</mi>\n' +
      '        <mo data-mjx-texclass="NONE">⁡</mo>\n' +
      '        <mo stretchy="false">(</mo>\n' +
      '        <mi mathvariant="bold-italic">A</mi>\n' +
      '        <mo stretchy="false">)</mo>\n' +
      '        <msub>\n' +
      '          <mi>I</mi>\n' +
      '          <mrow>\n' +
      '            <mn>1</mn>\n' +
      '          </mrow>\n' +
      '        </msub>\n' +
      '        <mrow data-mjx-texclass="INNER">\n' +
      '          <mo data-mjx-texclass="OPEN">(</mo>\n' +
      '          <msup>\n' +
      '            <mi mathvariant="bold-italic">A</mi>\n' +
      '            <mrow>\n' +
      '              <mo>−</mo>\n' +
      '              <mn>1</mn>\n' +
      '            </mrow>\n' +
      '          </msup>\n' +
      '          <mo>⋅</mo>\n' +
      '          <mi mathvariant="bold-italic">T</mi>\n' +
      '          <mo data-mjx-texclass="CLOSE">)</mo>\n' +
      '        </mrow>\n' +
      '      </mtd>\n' +
      '    </mtr>\n' +
      '  </mtable>\n' +
      '</math>'
  },
  {
    latex_input: '\\begin{aligned}\n' +
      'F(x) &=P(X \\leq x) \\\\\n' +
      '&=1-P(X>x) \\\\\n' +
      '&=1-\\sum_{w=x+1}^{\\infty} f(w)\n' +
      '\\end{aligned}',
    latex: '\\begin{aligned}\n' +
      'F(x) &=P(X \\leq x) \\\\\n' +
      '&=1-P(X>x) \\\\\n' +
      '&=1-\\sum_{w=x+1}^{\\infty} f(w)\n' +
      '\\end{aligned}',
    asciimath: '{:[F(x)=P(X <= x)],[=1-P(X > x)],[=1-sum_(w=x+1)^(oo)f(w)]:}',
    mathml: '<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">\n' +
      '  <mtable displaystyle="true" columnalign="right left right left right left right left right left right left" columnspacing="0em 2em 0em 2em 0em 2em 0em 2em 0em 2em 0em" rowspacing="3pt">\n' +
      '    <mtr>\n' +
      '      <mtd>\n' +
      '        <mi>F</mi>\n' +
      '        <mo stretchy="false">(</mo>\n' +
      '        <mi>x</mi>\n' +
      '        <mo stretchy="false">)</mo>\n' +
      '      </mtd>\n' +
      '      <mtd>\n' +
      '        <mi></mi>\n' +
      '        <mo>=</mo>\n' +
      '        <mi>P</mi>\n' +
      '        <mo stretchy="false">(</mo>\n' +
      '        <mi>X</mi>\n' +
      '        <mo>≤</mo>\n' +
      '        <mi>x</mi>\n' +
      '        <mo stretchy="false">)</mo>\n' +
      '      </mtd>\n' +
      '    </mtr>\n' +
      '    <mtr>\n' +
      '      <mtd></mtd>\n' +
      '      <mtd>\n' +
      '        <mi></mi>\n' +
      '        <mo>=</mo>\n' +
      '        <mn>1</mn>\n' +
      '        <mo>−</mo>\n' +
      '        <mi>P</mi>\n' +
      '        <mo stretchy="false">(</mo>\n' +
      '        <mi>X</mi>\n' +
      '        <mo>&gt;</mo>\n' +
      '        <mi>x</mi>\n' +
      '        <mo stretchy="false">)</mo>\n' +
      '      </mtd>\n' +
      '    </mtr>\n' +
      '    <mtr>\n' +
      '      <mtd></mtd>\n' +
      '      <mtd>\n' +
      '        <mi></mi>\n' +
      '        <mo>=</mo>\n' +
      '        <mn>1</mn>\n' +
      '        <mo>−</mo>\n' +
      '        <munderover>\n' +
      '          <mo data-mjx-texclass="OP">∑</mo>\n' +
      '          <mrow>\n' +
      '            <mi>w</mi>\n' +
      '            <mo>=</mo>\n' +
      '            <mi>x</mi>\n' +
      '            <mo>+</mo>\n' +
      '            <mn>1</mn>\n' +
      '          </mrow>\n' +
      '          <mrow>\n' +
      '            <mi mathvariant="normal">∞</mi>\n' +
      '          </mrow>\n' +
      '        </munderover>\n' +
      '        <mi>f</mi>\n' +
      '        <mo stretchy="false">(</mo>\n' +
      '        <mi>w</mi>\n' +
      '        <mo stretchy="false">)</mo>\n' +
      '      </mtd>\n' +
      '    </mtr>\n' +
      '  </mtable>\n' +
      '</math>',
  },
  {
    latex_input: '$\\begin{aligned}\\left\\langle U_{T_{*}}^{n} 1,1\\right\\rangle &=\\prod_{n \\in \\mathbb{Z}} \\int_{\\mathbb{Z}_{+}} \\sqrt{\\frac{d \\kappa_{k-n}}{d \\kappa_{k}}\\left(y_{k}\\right)} d \\kappa_{k}\\left(y_{k}\\right) \\\\ &=\\prod_{n \\in \\mathbb{Z}}\\left(1-H^{2}\\left(\\kappa_{k-n}, \\kappa_{k}\\right)\\right) \\\\ & \\leq \\prod_{n \\in \\mathbb{Z}}\\left(1-H^{2}\\left(\\kappa_{k-n}, \\kappa_{k}\\right)\\right) \\\\ &=\\prod_{\\frac{n}{3}<k<\\frac{2 n}{3}}^{\\frac{n}{3}<k<\\frac{2 n}{3}} \\\\ &<\\left(1-\\delta^{2}\\right)^{n / 3} \\end{aligned}$',
    latex:        '\\begin{aligned}\\left\\langle U_{T_{*}}^{n} 1,1\\right\\rangle &=\\prod_{n \\in \\mathbb{Z}} \\int_{\\mathbb{Z}_{+}} \\sqrt{\\frac{d \\kappa_{k-n}}{d \\kappa_{k}}\\left(y_{k}\\right)} d \\kappa_{k}\\left(y_{k}\\right) \\\\ &=\\prod_{n \\in \\mathbb{Z}}\\left(1-H^{2}\\left(\\kappa_{k-n}, \\kappa_{k}\\right)\\right) \\\\ & \\leq \\prod_{n \\in \\mathbb{Z}}\\left(1-H^{2}\\left(\\kappa_{k-n}, \\kappa_{k}\\right)\\right) \\\\ &=\\prod_{\\frac{n}{3}<k<\\frac{2 n}{3}}^{\\frac{n}{3}<k<\\frac{2 n}{3}} \\\\ &<\\left(1-\\delta^{2}\\right)^{n / 3} \\end{aligned}',
    asciimath: '{:[(:U_(T_(**))^(n)1,1:)=prod_(n inZ)int_(Z_(+))sqrt((dkappa_(k-n))/(dkappa_(k))(y_(k)))dkappa_(k)(y_(k))],[=prod_(n inZ)(1-H^(2)(kappa_(k-n),kappa_(k)))],[ <= prod_(n inZ)(1-H^(2)(kappa_(k-n),kappa_(k)))],[=prod_((n)/(3) < k < (2n)/(3))^((n)/(3) < k < (2n)/(3))],[ < (1-delta^(2))^(n//3)]:}',
    mathml: '<math xmlns="http://www.w3.org/1998/Math/MathML">\n' +
      '  <mtable displaystyle="true" columnalign="right left right left right left right left right left right left" columnspacing="0em 2em 0em 2em 0em 2em 0em 2em 0em 2em 0em" rowspacing="3pt">\n' +
      '    <mtr>\n' +
      '      <mtd>\n' +
      '        <mrow data-mjx-texclass="INNER">\n' +
      '          <mo data-mjx-texclass="OPEN">⟨</mo>\n' +
      '          <msubsup>\n' +
      '            <mi>U</mi>\n' +
      '            <mrow>\n' +
      '              <msub>\n' +
      '                <mi>T</mi>\n' +
      '                <mrow>\n' +
      '                  <mo>∗</mo>\n' +
      '                </mrow>\n' +
      '              </msub>\n' +
      '            </mrow>\n' +
      '            <mrow>\n' +
      '              <mi>n</mi>\n' +
      '            </mrow>\n' +
      '          </msubsup>\n' +
      '          <mn>1</mn>\n' +
      '          <mo>,</mo>\n' +
      '          <mn>1</mn>\n' +
      '          <mo data-mjx-texclass="CLOSE">⟩</mo>\n' +
      '        </mrow>\n' +
      '      </mtd>\n' +
      '      <mtd>\n' +
      '        <mi></mi>\n' +
      '        <mo>=</mo>\n' +
      '        <munder>\n' +
      '          <mo data-mjx-texclass="OP">∏</mo>\n' +
      '          <mrow>\n' +
      '            <mi>n</mi>\n' +
      '            <mo>∈</mo>\n' +
      '            <mrow>\n' +
      '              <mi mathvariant="double-struck">Z</mi>\n' +
      '            </mrow>\n' +
      '          </mrow>\n' +
      '        </munder>\n' +
      '        <msub>\n' +
      '          <mo data-mjx-texclass="OP">∫</mo>\n' +
      '          <mrow>\n' +
      '            <msub>\n' +
      '              <mrow>\n' +
      '                <mi mathvariant="double-struck">Z</mi>\n' +
      '              </mrow>\n' +
      '              <mrow>\n' +
      '                <mo>+</mo>\n' +
      '              </mrow>\n' +
      '            </msub>\n' +
      '          </mrow>\n' +
      '        </msub>\n' +
      '        <msqrt>\n' +
      '          <mfrac>\n' +
      '            <mrow>\n' +
      '              <mi>d</mi>\n' +
      '              <msub>\n' +
      '                <mi>κ</mi>\n' +
      '                <mrow>\n' +
      '                  <mi>k</mi>\n' +
      '                  <mo>−</mo>\n' +
      '                  <mi>n</mi>\n' +
      '                </mrow>\n' +
      '              </msub>\n' +
      '            </mrow>\n' +
      '            <mrow>\n' +
      '              <mi>d</mi>\n' +
      '              <msub>\n' +
      '                <mi>κ</mi>\n' +
      '                <mrow>\n' +
      '                  <mi>k</mi>\n' +
      '                </mrow>\n' +
      '              </msub>\n' +
      '            </mrow>\n' +
      '          </mfrac>\n' +
      '          <mrow data-mjx-texclass="INNER">\n' +
      '            <mo data-mjx-texclass="OPEN">(</mo>\n' +
      '            <msub>\n' +
      '              <mi>y</mi>\n' +
      '              <mrow>\n' +
      '                <mi>k</mi>\n' +
      '              </mrow>\n' +
      '            </msub>\n' +
      '            <mo data-mjx-texclass="CLOSE">)</mo>\n' +
      '          </mrow>\n' +
      '        </msqrt>\n' +
      '        <mi>d</mi>\n' +
      '        <msub>\n' +
      '          <mi>κ</mi>\n' +
      '          <mrow>\n' +
      '            <mi>k</mi>\n' +
      '          </mrow>\n' +
      '        </msub>\n' +
      '        <mrow data-mjx-texclass="INNER">\n' +
      '          <mo data-mjx-texclass="OPEN">(</mo>\n' +
      '          <msub>\n' +
      '            <mi>y</mi>\n' +
      '            <mrow>\n' +
      '              <mi>k</mi>\n' +
      '            </mrow>\n' +
      '          </msub>\n' +
      '          <mo data-mjx-texclass="CLOSE">)</mo>\n' +
      '        </mrow>\n' +
      '      </mtd>\n' +
      '    </mtr>\n' +
      '    <mtr>\n' +
      '      <mtd></mtd>\n' +
      '      <mtd>\n' +
      '        <mi></mi>\n' +
      '        <mo>=</mo>\n' +
      '        <munder>\n' +
      '          <mo data-mjx-texclass="OP">∏</mo>\n' +
      '          <mrow>\n' +
      '            <mi>n</mi>\n' +
      '            <mo>∈</mo>\n' +
      '            <mrow>\n' +
      '              <mi mathvariant="double-struck">Z</mi>\n' +
      '            </mrow>\n' +
      '          </mrow>\n' +
      '        </munder>\n' +
      '        <mrow data-mjx-texclass="INNER">\n' +
      '          <mo data-mjx-texclass="OPEN">(</mo>\n' +
      '          <mn>1</mn>\n' +
      '          <mo>−</mo>\n' +
      '          <msup>\n' +
      '            <mi>H</mi>\n' +
      '            <mrow>\n' +
      '              <mn>2</mn>\n' +
      '            </mrow>\n' +
      '          </msup>\n' +
      '          <mrow data-mjx-texclass="INNER">\n' +
      '            <mo data-mjx-texclass="OPEN">(</mo>\n' +
      '            <msub>\n' +
      '              <mi>κ</mi>\n' +
      '              <mrow>\n' +
      '                <mi>k</mi>\n' +
      '                <mo>−</mo>\n' +
      '                <mi>n</mi>\n' +
      '              </mrow>\n' +
      '            </msub>\n' +
      '            <mo>,</mo>\n' +
      '            <msub>\n' +
      '              <mi>κ</mi>\n' +
      '              <mrow>\n' +
      '                <mi>k</mi>\n' +
      '              </mrow>\n' +
      '            </msub>\n' +
      '            <mo data-mjx-texclass="CLOSE">)</mo>\n' +
      '          </mrow>\n' +
      '          <mo data-mjx-texclass="CLOSE">)</mo>\n' +
      '        </mrow>\n' +
      '      </mtd>\n' +
      '    </mtr>\n' +
      '    <mtr>\n' +
      '      <mtd></mtd>\n' +
      '      <mtd>\n' +
      '        <mi></mi>\n' +
      '        <mo>≤</mo>\n' +
      '        <munder>\n' +
      '          <mo data-mjx-texclass="OP">∏</mo>\n' +
      '          <mrow>\n' +
      '            <mi>n</mi>\n' +
      '            <mo>∈</mo>\n' +
      '            <mrow>\n' +
      '              <mi mathvariant="double-struck">Z</mi>\n' +
      '            </mrow>\n' +
      '          </mrow>\n' +
      '        </munder>\n' +
      '        <mrow data-mjx-texclass="INNER">\n' +
      '          <mo data-mjx-texclass="OPEN">(</mo>\n' +
      '          <mn>1</mn>\n' +
      '          <mo>−</mo>\n' +
      '          <msup>\n' +
      '            <mi>H</mi>\n' +
      '            <mrow>\n' +
      '              <mn>2</mn>\n' +
      '            </mrow>\n' +
      '          </msup>\n' +
      '          <mrow data-mjx-texclass="INNER">\n' +
      '            <mo data-mjx-texclass="OPEN">(</mo>\n' +
      '            <msub>\n' +
      '              <mi>κ</mi>\n' +
      '              <mrow>\n' +
      '                <mi>k</mi>\n' +
      '                <mo>−</mo>\n' +
      '                <mi>n</mi>\n' +
      '              </mrow>\n' +
      '            </msub>\n' +
      '            <mo>,</mo>\n' +
      '            <msub>\n' +
      '              <mi>κ</mi>\n' +
      '              <mrow>\n' +
      '                <mi>k</mi>\n' +
      '              </mrow>\n' +
      '            </msub>\n' +
      '            <mo data-mjx-texclass="CLOSE">)</mo>\n' +
      '          </mrow>\n' +
      '          <mo data-mjx-texclass="CLOSE">)</mo>\n' +
      '        </mrow>\n' +
      '      </mtd>\n' +
      '    </mtr>\n' +
      '    <mtr>\n' +
      '      <mtd></mtd>\n' +
      '      <mtd>\n' +
      '        <mi></mi>\n' +
      '        <mo>=</mo>\n' +
      '        <munderover>\n' +
      '          <mo data-mjx-texclass="OP">∏</mo>\n' +
      '          <mrow>\n' +
      '            <mfrac>\n' +
      '              <mi>n</mi>\n' +
      '              <mn>3</mn>\n' +
      '            </mfrac>\n' +
      '            <mo>&lt;</mo>\n' +
      '            <mi>k</mi>\n' +
      '            <mo>&lt;</mo>\n' +
      '            <mfrac>\n' +
      '              <mrow>\n' +
      '                <mn>2</mn>\n' +
      '                <mi>n</mi>\n' +
      '              </mrow>\n' +
      '              <mn>3</mn>\n' +
      '            </mfrac>\n' +
      '          </mrow>\n' +
      '          <mrow>\n' +
      '            <mfrac>\n' +
      '              <mi>n</mi>\n' +
      '              <mn>3</mn>\n' +
      '            </mfrac>\n' +
      '            <mo>&lt;</mo>\n' +
      '            <mi>k</mi>\n' +
      '            <mo>&lt;</mo>\n' +
      '            <mfrac>\n' +
      '              <mrow>\n' +
      '                <mn>2</mn>\n' +
      '                <mi>n</mi>\n' +
      '              </mrow>\n' +
      '              <mn>3</mn>\n' +
      '            </mfrac>\n' +
      '          </mrow>\n' +
      '        </munderover>\n' +
      '      </mtd>\n' +
      '    </mtr>\n' +
      '    <mtr>\n' +
      '      <mtd></mtd>\n' +
      '      <mtd>\n' +
      '        <mi></mi>\n' +
      '        <mo>&lt;</mo>\n' +
      '        <msup>\n' +
      '          <mrow data-mjx-texclass="INNER">\n' +
      '            <mo data-mjx-texclass="OPEN">(</mo>\n' +
      '            <mn>1</mn>\n' +
      '            <mo>−</mo>\n' +
      '            <msup>\n' +
      '              <mi>δ</mi>\n' +
      '              <mrow>\n' +
      '                <mn>2</mn>\n' +
      '              </mrow>\n' +
      '            </msup>\n' +
      '            <mo data-mjx-texclass="CLOSE">)</mo>\n' +
      '          </mrow>\n' +
      '          <mrow>\n' +
      '            <mi>n</mi>\n' +
      '            <mrow>\n' +
      '              <mo>/</mo>\n' +
      '            </mrow>\n' +
      '            <mn>3</mn>\n' +
      '          </mrow>\n' +
      '        </msup>\n' +
      '      </mtd>\n' +
      '    </mtr>\n' +
      '  </mtable>\n' +
      '</math>'
  },
];
