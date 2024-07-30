export const formatMathJaxError = (err, latex, fName = 'MathJax') => {
  try {
    const validLatex = typeof latex === 'string' ? latex : 'Invalid LaTeX data';

    if (typeof err === 'object' && err !== null) {
      const errorMessage = err.message || 'Unknown error';
      const errorData = {
        message: errorMessage,
        latex: validLatex
      };
      console.log(`[${fName}] ERROR=>`, JSON.stringify(errorData, null, 2));
    } else if (typeof err === 'string') {
      console.log(`[${fName}] ERROR=> ${err}`, `\nLaTeX: ${validLatex}`);
    } else {
      console.log(`[${fName}] ERROR=> Unexpected error type`, err, `\nLaTeX: ${validLatex}`);
    }
  } catch (e) {
    console.log(`[${fName}] ERROR (formatting error)=>`, e);
    console.log(`[${fName}] Original Error=>`, err);
    console.log(`[${fName}] LaTeX=> ${latex}`);
  }
};