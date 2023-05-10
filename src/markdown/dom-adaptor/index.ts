export interface Global {
  document: Document;
}

declare var global: Global;

export const initDocument = () => {
  try{
    document;
  } catch (e) {
    console.error(e);
  }
};
