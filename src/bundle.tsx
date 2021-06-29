import { MathpixMarkdownModel as MM } from './mathpix-markdown-model';

declare global {
  interface Window {
    loadMathJax: Function,
    markdownToHTML: Function,
    render: Function,
    mmdYamlToHTML: Function,
    renderTitleMmd: Function,
    renderAuthorsMmd: Function,
  }
}

export const exportMethods = () => {
  window.loadMathJax = MM.loadMathJax;
  window.render = MM.render;
  window.markdownToHTML = MM.markdownToHTML;
  window.mmdYamlToHTML = MM.mmdYamlToHTML;
  window.renderTitleMmd = MM.renderTitleMmd;
  window.renderAuthorsMmd = MM.renderAuthorsMmd;
};

exportMethods();
