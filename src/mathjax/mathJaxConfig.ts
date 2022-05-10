//TODO: use AMS numbering once the package will be available
const MathJaxConfig = {
    TeX: {
        packages: ['base', 'ams', 'boldsymbol', 'html', 'newcommand', 'unicode', 'color', 'mhchem', 'enclose'], // extensions to use
        tagSide: "right", // side for \tag macros
        tagIndent: "0.8em", // amount to indent tags
        multlineWidth: "100%", // width of multline environment
        useLabelIds: true, // use label name rather for ids
        tags: "ams", // or 'ams' or 'all'
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
        processEscapes: true, // use \$ to produce a litteral dollar sign
        processEnvironments: true, // process \begin{xxx}...\end{xxx} outside math mode
        processRefs: true, // process \ref{...} outside of math mode,
        maxMacros: 10000,  //maximum number of macro substitutions per expression //10000
        maxBuffer: 15 * 1024 // maximum size for the internal TeX string (5K) //5 * 1024
    },
      asciimath: {
        delimiters: [['<ascii>','</ascii>'], ['`','`']]
      },
    MathML: {
        parseAs: "html", // or 'xml'
        forceReparse: true //Need to set true. Have bug in MathJax 3.0.1
        //forceReparse: false // Force the MathML to be reparsed?
        //   (e.g., for XML parsing in an HTML document)
    },
    HTML: {
        scale: 1, // Global scaling factor for all expressions
        mathmlSpacing: false, // true for MathML spacing rules, false for TeX rules
        exFactor: 0.5 // default size of ex in em units when ex size can't be determined
    },
    SVG: {
        fontCache: 'none',             // or 'global' or 'local',
    },
    CHTML: null
};

export default MathJaxConfig;
