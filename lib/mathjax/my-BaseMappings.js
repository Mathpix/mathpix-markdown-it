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
 * Custom handler methods for commands that need to tag MathML nodes
 * with properties detectable by downstream serializers (e.g. Typst).
 */
var CustomMethods = {
    /**
     * \Varangle — constructs ∢ by overlapping < and a smaller ) via negative kern.
     * Uses \mkern (mu-units) instead of chained \! for stability across MathJax versions.
     * Sets 'data-custom-cmd' property so the Typst serializer can map it to angle.spheric.
     */
    Varangle: function (parser, name) {
        var macro = '{\\mathrel{<\\mkern-14mu{\\small)}}}';
        var mml = new TexParser_js_1.default(macro, Object.assign({}, parser.stack.env), parser.configuration).mml();
        if (mml) {
            // Set as both a property (for visitor/serializer access via getProperty)
            // and an attribute (for MathML output via getAttributes)
            mml.setProperty('data-custom-cmd', 'Varangle');
            NodeUtil_js_1.default.setProperties(mml, { 'data-custom-cmd': 'Varangle' });
            parser.Push(mml);
        }
    },
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
    llbracket: ['Macro', '{[\\![}'],
    rrbracket: ['Macro', '{]\\!]}'],
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