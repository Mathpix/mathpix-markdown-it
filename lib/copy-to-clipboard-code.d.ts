declare global {
    interface Window {
        addListenerCopyToClipboardEvents: Function;
        removeListenerCopyToClipboardEvents: Function;
    }
}
export declare const exposeClipboardToWindow: () => void;
