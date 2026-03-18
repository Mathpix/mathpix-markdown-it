/**
 * Test data for custom commands across all output formats.
 * Each entry: latex input + expected outputs per format.
 */
module.exports = [
  {
    latex: '\\Varangle',
    mmd: '$\\Varangle$',
    asciimath: '∢',
    linearmath: '∢',
    typst: 'angle.spheric',
    typst_inline: 'angle.spheric',
    mathml: '<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">\n  <mrow><mo>∢</mo></mrow>\n</math>',
    mathml_word: '<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">\n  <mrow><mo>∢</mo></mrow>\n</math>',
    svg: '<mjx-container class="MathJax" jax="SVG" display="true"><svg style="vertical-align: -0.481ex;" xmlns="http://www.w3.org/2000/svg" width="1.377ex" height="1.923ex" role="img" focusable="false" viewBox="0 -637.5 608.4 850"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="TeXAtom" data-custom-cmd="Varangle" data-mjx-texclass="ORD"><g data-mml-node="TeXAtom" data-mjx-texclass="REL"><g data-mml-node="mo"><path data-c="3C" d="M694 -11T694 -19T688 -33T678 -40Q671 -40 524 29T234 166L90 235Q83 240 83 250Q83 261 91 266Q664 540 678 540Q681 540 687 534T694 519T687 505Q686 504 417 376L151 250L417 124Q686 -4 687 -5Q694 -11 694 -19Z"></path></g><g data-mml-node="mspace" transform="translate(778,0)"></g><g data-mml-node="TeXAtom" data-mjx-texclass="ORD" transform="translate(277.8,0)"><g data-mml-node="mstyle" transform="scale(0.85)"><g data-mml-node="mo"><path data-c="29" d="M60 749L64 750Q69 750 74 750H86L114 726Q208 641 251 514T294 250Q294 182 284 119T261 12T224 -76T186 -143T145 -194T113 -227T90 -246Q87 -249 86 -250H74Q66 -250 63 -250T58 -247T55 -238Q56 -237 66 -225Q221 -64 221 250T66 725Q56 737 55 738Q55 746 60 749Z"></path></g></g></g></g></g></g></g></svg></mjx-container>',
    assistive_mml: '<math xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∢</mo></mrow></math>',
    aria_label: 'spherical angle',
  },
  {
    latex: '\\Varangle ABC',
    mmd: '$\\Varangle ABC$',
    asciimath: '∢ABC',
    linearmath: '∢ABC',
    typst: 'angle.spheric A B C',
    typst_inline: 'angle.spheric A B C',
    mathml: '<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">\n  <mrow><mo>∢</mo></mrow>\n  <mi>A</mi>\n  <mi>B</mi>\n  <mi>C</mi>\n</math>',
    mathml_word: '<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">\n  <mrow><mo>∢</mo></mrow>\n  <mi>A</mi>\n  <mi>B</mi>\n  <mi>C</mi>\n</math>',
    assistive_mml: '<math xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∢</mo></mrow><mi>A</mi><mi>B</mi><mi>C</mi></math>',
    aria_label: 'spherical angle upper A upper B upper C',
  },
  {
    latex: '\\Varangle_{ABC}',
    mmd: '$\\Varangle_{ABC}$',
    asciimath: '∢_(ABC)',
    linearmath: '∢_(ABC)',
    typst: 'angle.spheric_(A B C)',
    typst_inline: 'angle.spheric_(A B C)',
    mathml: '<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">\n  <msub>\n    <mrow><mo>∢</mo></mrow>\n    <mrow data-mjx-texclass="ORD">\n      <mi>A</mi>\n      <mi>B</mi>\n      <mi>C</mi>\n    </mrow>\n  </msub>\n</math>',
    mathml_word: '<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">\n  <msub>\n    <mrow><mo>∢</mo></mrow>\n    <mrow data-mjx-texclass="ORD">\n      <mi>A</mi>\n      <mi>B</mi>\n      <mi>C</mi>\n    </mrow>\n  </msub>\n</math>',
    assistive_mml: '<math xmlns="http://www.w3.org/1998/Math/MathML"><msub><mrow><mo>∢</mo></mrow><mrow data-mjx-texclass="ORD"><mi>A</mi><mi>B</mi><mi>C</mi></mrow></msub></math>',
    aria_label: 'spherical angle Subscript upper A upper B upper C Baseline',
  },
];
