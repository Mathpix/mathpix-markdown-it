import {
  addListenerCopyToClipdoardEvents,
  removeListenerCopyToClipdoardEvents
} from './copy-to-clipboard';

declare global {
  interface Window {
    addListenerCopyToClipdoardEvents: Function,
    removeListenerCopyToClipdoardEvents: Function
  }
}

export const exportMethods = () => {
  window.addListenerCopyToClipdoardEvents = addListenerCopyToClipdoardEvents;
  window.removeListenerCopyToClipdoardEvents = removeListenerCopyToClipdoardEvents;
};

exportMethods();
