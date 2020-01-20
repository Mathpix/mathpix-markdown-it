import { SVGFontData, SVGCharOptions, SVGVariantData, SVGDelimiterData, DelimiterMap, CharMapMap, FontDataClass } from '../FontData.js';
declare const TeXFont_base: FontDataClass<SVGCharOptions, SVGVariantData, SVGDelimiterData> & typeof SVGFontData;
export declare class TeXFont extends TeXFont_base {
    protected static defaultDelimiters: DelimiterMap<SVGDelimiterData>;
    protected static defaultChars: CharMapMap<SVGCharOptions>;
    protected static variantCacheIds: {
        [name: string]: string;
    };
    constructor();
}
export {};
