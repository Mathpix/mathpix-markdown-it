Object.defineProperty(exports, "__esModule", { value: true });
var sm = require("mathjax-full/js/input/tex/SymbolMap.js");
var ParseMethods_js_1 = require("mathjax-full/js/input/tex/ParseMethods.js");
var BaseMethods_js_1 = require("mathjax-full/js/input/tex/base/BaseMethods.js");
new sm.CharacterMap('wasysym-mathchar0mo', ParseMethods_js_1.default.mathchar0mo, {
    varangle: '\u2222',
    Perp: '\u2AEB',
});
new sm.CommandMap('wasysym-macros', {
    Vmathcal: ['Macro', '{\\cal #1}', 1],
    Varangle: ['Macro', '{\\mathop{{<\\!\\!\\!\\!\\!\\small)}\\:}\\nolimits}'],
    longdiv: ['Macro', '\\enclose{longdiv}{#1}', 1],
    lcm: ['Macro', '\\enclose{bottom}{\\smash{)}{#1}\\:}', 1],
    oint: ['Macro', '{\\mathop{\\vcenter{\\mathchoice{\\huge\\unicode{x222E}\\,}{\\unicode{x222E}}{\\unicode{x222E}}{\\unicode{x222E}}}\\,}\\nolimits}'],
    oiint: ['Macro', '{\\mathop{\\vcenter{\\mathchoice{\\huge\\unicode{x222F}\\,}{\\unicode{x222F}}{\\unicode{x222F}}{\\unicode{x222F}}}\\,}\\nolimits}'],
    oiiint: ['Macro', '{\\mathop{\\vcenter{\\mathchoice{\\huge\\unicode{x2230}\\,}{\\unicode{x2230}}{\\unicode{x2230}}{\\unicode{x2230}}}\\,}\\nolimits}'],
    ointclockwise: ['Macro', '{\\mathop{\\vcenter{\\mathchoice{\\huge\\unicode{x2232}\\,}{\\unicode{x2232}}{\\unicode{x2232}}{\\unicode{x2232}}}\\,}\\nolimits}'],
    ointctrclockwise: ['Macro', '{\\mathop{\\vcenter{\\mathchoice{\\huge\\unicode{x2233}\\,}{\\unicode{x2233}}{\\unicode{x2233}}{\\unicode{x2233}}}\\,}\\nolimits}'],
    llbracket: ['Macro', '{[\\![}'],
    rrbracket: ['Macro', '{]\\!]}'],
    hhline: ['Macro', '\\hline \\hline'],
    AA: ['Macro', '{\\unicode{x212B}}'],
    pounds: ['Macro', '{\\it\\unicode{xA3}}']
}, BaseMethods_js_1.default);
//# sourceMappingURL=BaseMappings.js.map
//# sourceMappingURL=my-BaseMappings.js.map