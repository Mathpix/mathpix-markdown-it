export interface IAsciiData {
    ascii: string;
    ascii_tsv: string;
    ascii_csv: string;
    ascii_md: string;
}
export declare const regLetter: RegExp;
export declare const regW: RegExp;
export declare const AddToAsciiData: (data: IAsciiData, arr: Array<string>, serialize: any, node?: any) => IAsciiData;
export declare const pushToSerializedStack: (serialize: any, data: any, node?: any) => void;
export declare const clearSerializedChildStack: (serialize: any) => void;
export declare const getLastSymbolFromSerializedStack: (serialize: any) => string;
export declare const getLastItemFromSerializedStack: (serialize: any) => any;
export declare const needFirstSpaceBeforeLetter: (node: any, currentText: any, serialize: any) => boolean;
export declare const needSpaceBetweenLetters: (strBefore: string, strAfter: string) => boolean;
export declare const needFirstSpaceBeforeCurrentNode: (node: any, serialize: any) => boolean;
