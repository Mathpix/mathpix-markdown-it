import {
  addListenerCopyToClipboardEvents,
  removeListenerCopyToClipboardEvents
} from './copy-to-clipboard';

declare global {
  interface Window {
    addListenerCopyToClipboardEvents: Function,
    removeListenerCopyToClipboardEvents: Function
  }
}

export const exposeClipboardToWindow = () => {
  if (typeof window !== 'undefined') {
    window.addListenerCopyToClipboardEvents = addListenerCopyToClipboardEvents;
    window.removeListenerCopyToClipboardEvents = removeListenerCopyToClipboardEvents;
  }
};

exposeClipboardToWindow();
