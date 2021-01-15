declare global {
    interface Window {
        loadMathJax: Function;
        markdownToHTML: Function;
        render: Function;
    }
}
export declare const exportMethods: () => void;
