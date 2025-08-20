import { addListenerContextMenuEvents, removeListenerContextMenuEvents } from './contex-menu';

declare global {
  interface Window {
    addListenerContextMenuEvents: Function,
    removeListenerContextMenuEvents: Function,
  }
}

export const exportMethods = () => {
  if (typeof window !== 'undefined') {
    window.addListenerContextMenuEvents = addListenerContextMenuEvents;
    window.removeListenerContextMenuEvents = removeListenerContextMenuEvents;
  }
};

exportMethods();
