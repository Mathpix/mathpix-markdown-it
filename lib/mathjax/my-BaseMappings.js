Object.defineProperty(exports, "__esModule", { value: true });
var sm = require("mathjax-full/js/input/tex/SymbolMap.js");
var ParseMethods_js_1 = require("mathjax-full/js/input/tex/ParseMethods.js");
var BaseMethods_js_1 = require("mathjax-full/js/input/tex/base/BaseMethods.js");
var NodeUtil_js_1 = require("mathjax-full/js/input/tex/NodeUtil.js");
var TexParser_js_1 = require("mathjax-full/js/input/tex/TexParser.js");
new sm.CharacterMap('wasysym-mathchar0mo', ParseMethods_js_1.default.mathchar0mo, {
    varangle: '\u2222',
    Perp: '\u2AEB',
});
/**
 * Factory: creates a custom command handler that parses a TeX macro
 * and stamps the resulting MathML node with `data-custom-cmd` property.
 * Downstream serializers (MathML, Typst, ASCII, assistive MML) use this
 * property to emit a clean Unicode symbol instead of the visual-hack subtree.
 *
 * @param macro  TeX expansion string (e.g. '{[\\![}')
 * @param cmd    Command name registered in custom-cmd-map.ts (e.g. 'llbracket')
 */
var makeCustomCmdHandler = function (macro, cmd) { return function (parser, name) {
    var mml = new TexParser_js_1.default(macro, Object.assign({}, parser.stack.env), parser.configuration).mml();
    if (mml) {
        mml.setProperty('data-custom-cmd', cmd);
        NodeUtil_js_1.default.setProperties(mml, { 'data-custom-cmd': cmd });
        parser.Push(mml);
    }
}; };
var CustomMethods = {
    // \Varangle — overlapping < and smaller ) via negative kern
    Varangle: makeCustomCmdHandler('{\\mathrel{<\\mkern-14mu{\\small)}}}', 'Varangle'),
    // \llbracket / \rrbracket — double brackets via negative thin space
    llbracket: makeCustomCmdHandler('{[\\![}', 'llbracket'),
    rrbracket: makeCustomCmdHandler('{]\\!]}', 'rrbracket'),
};
// Merge custom methods with BaseMethods for CommandMap
var allMethods = Object.assign({}, BaseMethods_js_1.default, CustomMethods);
new sm.CommandMap('wasysym-macros', {
    Vmathcal: ['Macro', '{\\cal #1}', 1],
    Varangle: 'Varangle',
    longdiv: ['Macro', '\\enclose{longdiv}{#1}', 1],
    lcm: ['Macro', '\\enclose{bottom}{\\smash{)}{#1}\\:}', 1],
    oint: ['Macro', '{\\mathop{\\vcenter{\\mathchoice{\\huge\\unicode{x222E}\\,}{\\unicode{x222E}}{\\unicode{x222E}}{\\unicode{x222E}}}\\,}\\nolimits}'],
    oiint: ['Macro', '{\\mathop{\\vcenter{\\mathchoice{\\huge\\unicode{x222F}\\,}{\\unicode{x222F}}{\\unicode{x222F}}{\\unicode{x222F}}}\\,}\\nolimits}'],
    oiiint: ['Macro', '{\\mathop{\\vcenter{\\mathchoice{\\huge\\unicode{x2230}\\,}{\\unicode{x2230}}{\\unicode{x2230}}{\\unicode{x2230}}}\\,}\\nolimits}'],
    ointclockwise: ['Macro', '{\\mathop{\\vcenter{\\mathchoice{\\huge\\unicode{x2232}\\,}{\\unicode{x2232}}{\\unicode{x2232}}{\\unicode{x2232}}}\\,}\\nolimits}'],
    ointctrclockwise: ['Macro', '{\\mathop{\\vcenter{\\mathchoice{\\huge\\unicode{x2233}\\,}{\\unicode{x2233}}{\\unicode{x2233}}{\\unicode{x2233}}}\\,}\\nolimits}'],
    llbracket: 'llbracket',
    rrbracket: 'rrbracket',
    hhline: ['Macro', '\\hline \\hline'],
    AA: ['Macro', '{\\unicode{x212B}}'],
    pounds: ['Macro', '{\\it\\unicode{xA3}}'],
    highlight: ['Macro', '\\mathchoice' +
            '%{\\colorbox{#1}{$\\displaystyle{#2}$}}' +
            '%{\\colorbox{#1}{$\\textstyle{#2}$}}' +
            '%{\\colorbox{#1}{$\\scriptstyle{#2}$}}' +
            '%{\\colorbox{#1}{$\\scriptscriptstyle{#2}$}}', 2]
    // highlight: ['Macro', '[green]{#2{\\mathchoice%{\\colorbox{#1}{$\\displaystyle#2$}}%{\\colorbox{#1}{$\\textstyle#2$}}%{\\colorbox{#1}{$\\scriptstyle#2$}}%{\\colorbox{#1}{$\\scriptscriptstyle#2$}}}}', 2]
}, allMethods);
//# sourceMappingURL=BaseMappings.js.map
//# sourceMappingURL=my-BaseMappings.js.map