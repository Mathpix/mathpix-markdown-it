const Window = require('window');

export interface Global {
  document: Document;
  window: Window;
}

declare var global: Global;

export const initDocument = () => {
  try{
    document;
  } catch (e) {
    const window = new Window();
    global.window=window;
    global.document=window.document;
  }
};



