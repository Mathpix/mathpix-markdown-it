export interface IAsciiData {
    ascii: string;
    liner: string;
    ascii_tsv?: string;
    ascii_csv?: string;
    ascii_md?: string;
    liner_tsv?: string;
}
export declare const initAsciiData: () => IAsciiData;
export declare const AddToAsciiData: (dataOutput: IAsciiData, dataInput: IAsciiData) => IAsciiData;
export declare const getFunctionNameFromAscii: (ascii: string, node: any) => string;
export declare const hasOnlyOneMoNode: (node: any) => boolean;
