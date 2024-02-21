export interface IAsciiData {
    ascii: string;
    ascii_tsv: string;
    ascii_csv: string;
    ascii_md: string;
}
export declare const AddToAsciiData: (data: IAsciiData, arr: Array<string>) => IAsciiData;
export declare const getFunctionNameFromAscii: (ascii: string, node: any) => string;
