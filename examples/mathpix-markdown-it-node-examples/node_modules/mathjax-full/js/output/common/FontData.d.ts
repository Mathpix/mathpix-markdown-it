import { OptionList } from '../../util/Options.js';
import { StyleList } from './CssStyles.js';
export interface CharOptions {
    ic?: number;
    sk?: number;
    unknown?: boolean;
}
export declare type CharData<C extends CharOptions> = [number, number, number] | [number, number, number, C];
export declare type CharMap<C extends CharOptions> = {
    [n: number]: CharData<C>;
};
export declare type CharMapMap<C extends CharOptions> = {
    [name: string]: CharMap<C>;
};
export interface VariantData<C extends CharOptions> {
    linked: CharMap<C>[];
    chars: CharMap<C>;
}
export declare type VariantMap<C extends CharOptions, V extends VariantData<C>> = {
    [name: string]: V;
};
export declare type CssFontData = [string, boolean, boolean];
export declare type CssFontMap = {
    [name: string]: CssFontData;
};
export declare const enum DIRECTION {
    None = 0,
    Vertical = 1,
    Horizontal = 2
}
export declare const V = DIRECTION.Vertical;
export declare const H = DIRECTION.Horizontal;
export declare type DelimiterData = {
    dir: DIRECTION;
    sizes?: number[];
    variants?: number[];
    schar?: number[];
    stretch?: number[];
    HDW?: number[];
    min?: number;
    c?: number;
};
export declare type DelimiterMap<D extends DelimiterData> = {
    [n: number]: D;
};
export declare const NOSTRETCH: DelimiterData;
export declare type RemapData = string;
export declare type RemapMap = {
    [key: number]: RemapData;
};
export declare type RemapMapMap = {
    [key: string]: RemapMap;
};
export declare type FontParameters = {
    x_height: number;
    quad: number;
    num1: number;
    num2: number;
    num3: number;
    denom1: number;
    denom2: number;
    sup1: number;
    sup2: number;
    sup3: number;
    sub1: number;
    sub2: number;
    sup_drop: number;
    sub_drop: number;
    delim1: number;
    delim2: number;
    axis_height: number;
    rule_thickness: number;
    big_op_spacing1: number;
    big_op_spacing2: number;
    big_op_spacing3: number;
    big_op_spacing4: number;
    big_op_spacing5: number;
    surd_height: number;
    scriptspace: number;
    nulldelimiterspace: number;
    delimiterfactor: number;
    delimitershortfall: number;
    min_rule_thickness: number;
};
export declare class FontData<C extends CharOptions, V extends VariantData<C>, D extends DelimiterData> {
    static OPTIONS: OptionList;
    static defaultVariants: string[][];
    static defaultCssFonts: CssFontMap;
    protected static defaultAccentMap: {
        0x0300: string;
        0x0301: string;
        0x0302: string;
        0x0303: string;
        0x0304: string;
        0x0306: string;
        0x0307: string;
        0x0308: string;
        0x030A: string;
        0x030C: string;
        0x2192: string;
        0x2032: string;
        0x2033: string;
        0x2034: string;
        0x2035: string;
        0x2036: string;
        0x2037: string;
        0x2057: string;
        0x20D0: string;
        0x20D1: string;
        0x20D6: string;
        0x20E1: string;
        0x20F0: string;
        0x20DB: string;
        0x20DC: string;
        0x20EC: string;
        0x20ED: string;
        0x20EE: string;
        0x20EF: string;
    };
    protected static defaultMoMap: {
        0x002D: string;
    };
    protected static defaultMnMap: {
        0x002D: string;
    };
    static defaultParams: FontParameters;
    protected static defaultDelimiters: DelimiterMap<any>;
    protected static defaultChars: CharMapMap<any>;
    protected static defaultSizeVariants: string[];
    static charOptions(font: CharMap<CharOptions>, n: number): CharOptions;
    protected variant: VariantMap<C, V>;
    protected delimiters: DelimiterMap<D>;
    protected sizeVariants: string[];
    protected cssFontMap: CssFontMap;
    protected remapChars: RemapMapMap;
    params: FontParameters;
    styles: StyleList;
    constructor();
    createVariant(name: string, inherit?: string, link?: string): void;
    createVariants(variants: string[][]): void;
    defineChars(name: string, chars: CharMap<C>): void;
    defineDelimiters(delims: DelimiterMap<D>): void;
    defineRemap(name: string, remap: RemapMap): void;
    getDelimiter(n: number): D;
    getSizeVariant(n: number, i: number): string;
    getChar(name: string, n: number): CharData<C>;
    getVariant(name: string): V;
    getCssFont(variant: string): [string, boolean, boolean];
    getRemappedChar(name: string, c: number): string;
}
export interface FontDataClass<C extends CharOptions, V extends VariantData<C>, D extends DelimiterData> {
    OPTIONS: OptionList;
    defaultCssFonts: CssFontMap;
    defaultVariants: string[][];
    defaultParams: FontParameters;
    charOptions(font: CharMap<C>, n: number): C;
    new (...args: any[]): FontData<C, V, D>;
}
