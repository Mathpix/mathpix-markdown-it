export declare enum eSymbolType {
    operation = "operation",
    relation = "relation",
    logical = "logical",
    miscellaneous = "miscellaneous",
    arrow = "arrow"
}
export declare const AMsymbols: ({
    input: string;
    tag: string;
    output: string;
    tex: string;
    ttype: number;
    symbolType?: undefined;
    invisible?: undefined;
    acc?: undefined;
    stretchy?: undefined;
    func?: undefined;
    rewriteleftright?: undefined;
    atname?: undefined;
    atval?: undefined;
    codes?: undefined;
} | {
    input: string;
    tag: string;
    output: string;
    tex: string;
    ttype: number;
    symbolType: eSymbolType;
    invisible?: undefined;
    acc?: undefined;
    stretchy?: undefined;
    func?: undefined;
    rewriteleftright?: undefined;
    atname?: undefined;
    atval?: undefined;
    codes?: undefined;
} | {
    input: string;
    tag: string;
    output: string;
    tex: any;
    ttype: number;
    invisible: boolean;
    symbolType?: undefined;
    acc?: undefined;
    stretchy?: undefined;
    func?: undefined;
    rewriteleftright?: undefined;
    atname?: undefined;
    atval?: undefined;
    codes?: undefined;
} | {
    input: string;
    tag: string;
    output: string;
    tex: any;
    ttype: number;
    acc: boolean;
    stretchy: boolean;
    symbolType: eSymbolType;
    invisible?: undefined;
    func?: undefined;
    rewriteleftright?: undefined;
    atname?: undefined;
    atval?: undefined;
    codes?: undefined;
} | {
    input: string;
    tag: string;
    output: string;
    tex: any;
    ttype: number;
    func: boolean;
    symbolType?: undefined;
    invisible?: undefined;
    acc?: undefined;
    stretchy?: undefined;
    rewriteleftright?: undefined;
    atname?: undefined;
    atval?: undefined;
    codes?: undefined;
} | {
    input: string;
    tag: string;
    output: string;
    tex: any;
    ttype: number;
    rewriteleftright: string[];
    symbolType?: undefined;
    invisible?: undefined;
    acc?: undefined;
    stretchy?: undefined;
    func?: undefined;
    atname?: undefined;
    atval?: undefined;
    codes?: undefined;
} | {
    input: string;
    tag: string;
    output: string;
    tex: any;
    ttype: number;
    acc: boolean;
    stretchy: boolean;
    symbolType?: undefined;
    invisible?: undefined;
    func?: undefined;
    rewriteleftright?: undefined;
    atname?: undefined;
    atval?: undefined;
    codes?: undefined;
} | {
    input: string;
    tag: string;
    output: string;
    tex: string;
    ttype: number;
    acc: boolean;
    symbolType?: undefined;
    invisible?: undefined;
    stretchy?: undefined;
    func?: undefined;
    rewriteleftright?: undefined;
    atname?: undefined;
    atval?: undefined;
    codes?: undefined;
} | {
    input: string;
    tag: string;
    ttype: number;
    output?: undefined;
    tex?: undefined;
    symbolType?: undefined;
    invisible?: undefined;
    acc?: undefined;
    stretchy?: undefined;
    func?: undefined;
    rewriteleftright?: undefined;
    atname?: undefined;
    atval?: undefined;
    codes?: undefined;
} | {
    input: string;
    tag: string;
    atname: string;
    atval: string;
    output: string;
    tex: any;
    ttype: number;
    symbolType?: undefined;
    invisible?: undefined;
    acc?: undefined;
    stretchy?: undefined;
    func?: undefined;
    rewriteleftright?: undefined;
    codes?: undefined;
} | {
    input: string;
    tag: string;
    atname: string;
    atval: string;
    output: string;
    tex: any;
    ttype: number;
    codes: string[];
    symbolType?: undefined;
    invisible?: undefined;
    acc?: undefined;
    stretchy?: undefined;
    func?: undefined;
    rewriteleftright?: undefined;
})[];
