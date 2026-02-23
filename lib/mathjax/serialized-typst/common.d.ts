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
/** Check if child at index i in a node's childNodes starts a thousand-separator
 *  pattern: mn, mo(,), mn(exactly 3 digits). Returns true if pattern matches. */
export declare const isThousandSepComma: (node: any, i: number) => boolean;
export declare const needsParens: (s: string) => boolean;
