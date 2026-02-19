export interface ITypstData {
    typst: string;
}
export declare const initTypstData: () => ITypstData;
export declare const addToTypstData: (dataOutput: ITypstData, dataInput: ITypstData) => ITypstData;
export declare const needsParens: (s: string) => boolean;
