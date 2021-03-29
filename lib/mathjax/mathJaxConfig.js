"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//TODO: use AMS numbering once the package will be available
var MathJaxConfig = {
    TeX: {
        packages: ['base', 'ams', 'boldsymbol', 'newcommand', 'unicode', 'color', 'mhchem', 'enclose'],
        tagSide: "right",
        tagIndent: "0.8em",
        multlineWidth: "100%",
        useLabelIds: true,
        tags: "ams",
        inlineMath: [
            // start/end delimiter pairs for in-line math
            ["$", "$"],
            ["\\(", "\\)"]
        ],
        displayMath: [
            // start/end delimiter pairs for display math
            ["$$", "$$"],
            ["\\[", "\\]"]
        ],
        processEscapes: true,
        processEnvironments: true,
        processRefs: true,
    },
    asciimath: {
        delimiters: [['<ascii>', '</ascii>'], ['`', '`']]
    },
    MathML: {
        parseAs: "html",
        forceReparse: true //Need to set true. Have bug in MathJax 3.0.1
        //forceReparse: false // Force the MathML to be reparsed?
        //   (e.g., for XML parsing in an HTML document)
    },
    HTML: {
        scale: 1,
        mathmlSpacing: false,
        exFactor: 0.5 // default size of ex in em units when ex size can't be determined
    },
    SVG: {
        fontCache: 'none',
    },
    CHTML: null
};
exports.default = MathJaxConfig;
//# sourceMappingURL=mathJaxConfig.js.map