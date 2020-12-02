import * as domino from 'domino';

export interface Global {
  document: Document;
}

declare var global: Global;

export const initDocument = () => {
  try{
    document;
  } catch (e) {
    const domimpl = domino.createDOMImplementation();
    global.document = domimpl.createHTMLDocument();
  }
};
