declare const sm: any;
declare const ParseMethods_js_1: any;
declare const BaseMethods_js_1: any;
declare const NodeUtil_js_1: any;
declare const TexParser_js_1: any;
/**
 * Custom handler methods for commands that need to tag MathML nodes
 * with properties detectable by downstream serializers (e.g. Typst).
 */
declare const CustomMethods: {
    /**
     * \Varangle — constructs ∢ by overlapping < and a smaller ) via negative kern.
     * Uses \mkern (mu-units) instead of chained \! for stability across MathJax versions.
     * Sets 'data-custom-cmd' property so the Typst serializer can map it to angle.spheric.
     */
    Varangle: (parser: any, name: any) => void;
};
declare const allMethods: any;
