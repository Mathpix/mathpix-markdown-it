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
 *  pattern: mn, mo(,), mn(3 digits). Also handles Indian numbering (2-digit groups
 *  like 41,70,000) by accepting 2-digit groups when the chain ends with a 3-digit group. */
export declare const isThousandSepComma: (node: any, i: number) => boolean;
/** Check if a space separator is needed between two adjacent Typst tokens.
 *  Returns true when `next` starts with a word/dot/quote character
 *  and `prev` doesn't end with a natural separator (whitespace, open paren, etc.). */
export declare const needsTokenSeparator: (prev: string, next: string) => boolean;
export declare const needsParens: (s: string) => boolean;
