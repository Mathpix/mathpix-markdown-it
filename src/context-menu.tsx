import { addListenerContextMenuEvents, removeListenerContextMenuEvents } from './contex-menu';

declare global {
  interface Window {
    addListenerContextMenuEvents: Function,
    removeListenerContextMenuEvents: Function,
  }
}

export const exportMethods = () => {
  window.addListenerContextMenuEvents = addListenerContextMenuEvents;
  window.removeListenerContextMenuEvents = removeListenerContextMenuEvents;
};

exportMethods();
