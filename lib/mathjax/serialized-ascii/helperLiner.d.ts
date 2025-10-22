export declare const amSymbolsToLiner: ({
    input: string;
    output: string;
    outputComplex: string;
    tag?: undefined;
    isFirst?: undefined;
} | {
    input: string;
    output: string;
    outputComplex: string;
    tag: string;
    isFirst?: undefined;
} | {
    input: string;
    output: string;
    outputComplex: string;
    isFirst: boolean;
    tag?: undefined;
})[];
export declare const rootSymbols: {
    val: number;
    output: string;
}[];
export declare const replaceScripts: (text: string, type?: string) => string;
export declare const findAmSymbolsToLiner: (input: string, tag?: string) => any;
export declare const findRootSymbol: (str: string) => string;
export declare const needsParensForFollowingDivision: (s: string) => boolean;
export declare const needBrackets: (serialize: any, node: any, isFunction?: boolean) => boolean;
export declare const isWrappedWithParens: (s: string) => boolean;
export declare const hasAnyWhitespace: (str: string) => boolean;
export declare const replaceUnicodeWhitespace: (str: string) => string;
export declare const formatLinerFromAscii: (ascii: string, childLiner?: string, tag?: string) => string;
