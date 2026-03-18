declare const sm: any;
declare const ParseMethods_js_1: any;
declare const BaseMethods_js_1: any;
declare const TexParser_js_1: any;
/**
 * Factory: creates a custom command handler that parses a TeX macro
 * and stamps the resulting MathML node with `data-custom-cmd` property.
 * Downstream serializers (MathML, Typst, ASCII, assistive MML) use this
 * property to emit a clean Unicode symbol instead of the visual-hack subtree.
 *
 * @param macro  TeX expansion string (e.g. '{[\\![}')
 * @param cmd    Command name registered in custom-cmd-map.ts (e.g. 'llbracket')
 */
declare const makeCustomCmdHandler: (macro: any, cmd: any) => (parser: any, name: any) => void;
declare const CustomMethods: {
    Varangle: (parser: any, name: any) => void;
    llbracket: (parser: any, name: any) => void;
    rrbracket: (parser: any, name: any) => void;
    pounds: (parser: any, name: any) => void;
};
declare const allMethods: any;
