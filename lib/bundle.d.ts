declare global {
    interface Window {
        loadMathJax: Function;
        markdownToHTML: Function;
        render: Function;
        mmdYamlToHTML: Function;
        renderTitleMmd: Function;
        renderAuthorsMmd: Function;
    }
}
export declare const exportMethods: () => void;
