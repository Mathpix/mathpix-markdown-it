import { MathpixMarkdownModel as MM } from './mathpix-markdown-model';

declare global {
  interface Window {
    loadMathJax: Function,
    markdownToHTML: Function,
    render: Function
  }
}

export const exportMethods = () => {
  window.loadMathJax = MM.loadMathJax;
  window.render = MM.render;
  window.markdownToHTML = MM.markdownToHTML;
};

exportMethods();
