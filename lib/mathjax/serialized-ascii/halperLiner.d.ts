export declare const amSymbolsToLiner: {
    input: string;
    output: string;
}[];
export declare const rootSymbols: {
    val: number;
    output: string;
}[];
export declare const findAmSymbolsToLiner: (input: string) => string;
export declare const findRootSymbol: (val: number) => string;
export declare const needsParensForFollowingDivision: (s: string) => boolean;
export declare const needBrackets: (serialize: any, node: any, isFunction?: boolean) => boolean;
