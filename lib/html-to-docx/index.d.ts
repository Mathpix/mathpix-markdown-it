/// <reference types="node" />
declare function generateContainer(htmlString: any, headerHTMLString: any, documentOptions?: {}, onlyBuffer?: boolean): Promise<ArrayBuffer | Blob | Buffer>;
export default generateContainer;
