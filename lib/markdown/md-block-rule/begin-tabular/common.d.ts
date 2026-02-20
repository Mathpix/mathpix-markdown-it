export type TParselines = {
    cLines: Array<Array<string>>;
    cSpaces: Array<Array<string>>;
    sLines: Array<string>;
};
export declare const getContent: (content: string, onlyOne?: boolean, skipTrim?: boolean) => string;
export declare const generateUniqueId: (onlyUuid?: boolean) => string;
export declare const getColumnLines: (str: string, numCol?: number) => Array<string>;
export declare const getColumnAlign: (align: string) => string[] | [
];
export type TAlignData = {
    cAlign: Array<string>;
    vAlign: Array<string>;
    cWidth: Array<string>;
    colSpec: Array<string>;
};
export declare const getVerticallyColumnAlign: (align: string, numCol: number) => TAlignData;
export declare const getParams: (str: string, i: number) => {
    align: string;
    index: number;
};
export type TDecimal = {
    l: number;
    r: number;
};
export declare const getDecimal: (cAlign: Array<string>, cellsAll: Array<string>) => Array<TDecimal>;
export declare const getCellsAll: (rows: string[]) => string[];
export declare const getRowLines: (rows: string[], numCol: number) => TParselines;
/**
 * Checks whether any column listed in `colsToFixWidth` uses an unsafe spec in `colSpec`.
 * Used to decide if tabular column specs must be rewritten to fixed-width paragraph columns.
 *
 * @param colsToFixWidth - Column indices that require fixed width (e.g., columns containing lists)
 * @param colSpec - Original column specs array (e.g., ["l","c","p{...}"])
 */
export declare const shouldRewriteColSpec: (colsToFixWidth: number[] | undefined, colSpec: string[] | undefined) => boolean;
/**
 * Detects whether the given content starts a block-level LaTeX construct
 * (e.g. list environments like \begin{itemize}).
 */
export declare const detectLocalBlock: (content: string) => boolean;
