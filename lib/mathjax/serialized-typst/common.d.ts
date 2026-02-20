export interface ITypstData {
    typst: string;
    /** Inline-safe variant: same as typst when no block wrappers are used,
     *  otherwise contains pure math expressions without #math.equation() wrappers. */
    typst_inline?: string;
}
export declare const initTypstData: () => ITypstData;
export declare const addToTypstData: (dataOutput: ITypstData, dataInput: ITypstData) => ITypstData;
/** Add a separator space to both typst and typst_inline fields. */
export declare const addSpaceToTypstData: (data: ITypstData) => void;
export declare const needsParens: (s: string) => boolean;
