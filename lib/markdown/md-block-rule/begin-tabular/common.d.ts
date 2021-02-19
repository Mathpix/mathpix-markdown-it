export declare type TParselines = {
    cLines: Array<Array<string>>;
    cSpaces: Array<Array<string>>;
    sLines: Array<string>;
};
export declare const getContent: (content: string, onlyOne?: boolean) => string;
export declare const getColumnLines: (str: string, numCol?: number) => Array<string>;
export declare const getColumnAlign: (align: string) => string[] | [];
export declare type TAlignData = {
    cAlign: Array<string>;
    vAlign: Array<string>;
    cWidth: Array<string>;
};
export declare const getVerticallyColumnAlign: (align: string, numCol: number) => TAlignData;
export declare const getParams: (str: string, i: number) => {
    align: string;
    index: number;
};
export declare type TDecimal = {
    l: number;
    r: number;
};
export declare const getDecimal: (cAlign: Array<string>, cellsAll: Array<string>) => Array<TDecimal>;
export declare const getCellsAll: (rows: string[]) => string[];
export declare const getRowLines: (rows: string[], numCol: number) => TParselines;
