"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatMathJaxError = void 0;
var formatMathJaxError = function (err, latex, fName) {
    if (fName === void 0) { fName = 'MathJax'; }
    try {
        var validLatex = typeof latex === 'string' ? latex : 'Invalid LaTeX data';
        if (typeof err === 'object' && err !== null) {
            var errorMessage = err.message || 'Unknown error';
            var errorData = {
                message: errorMessage,
                latex: validLatex
            };
            console.log("[".concat(fName, "] ERROR=>"), JSON.stringify(errorData, null, 2));
        }
        else if (typeof err === 'string') {
            console.log("[".concat(fName, "] ERROR=> ").concat(err), "\nLaTeX: ".concat(validLatex));
        }
        else {
            console.log("[".concat(fName, "] ERROR=> Unexpected error type"), err, "\nLaTeX: ".concat(validLatex));
        }
    }
    catch (e) {
        console.log("[".concat(fName, "] ERROR (formatting error)=>"), e);
        console.log("[".concat(fName, "] Original Error=>"), err);
        console.log("[".concat(fName, "] LaTeX=> ").concat(latex));
    }
};
exports.formatMathJaxError = formatMathJaxError;
//# sourceMappingURL=utils.js.map