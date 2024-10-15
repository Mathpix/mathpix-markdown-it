export interface IFonts {
    normal: ArrayBuffer;
    bold?: ArrayBuffer;
}
export declare class FontMetrics {
    font: any;
    fontBold: any;
    constructor();
    loadFont(fonts: IFonts): void;
    getWidth(text: any, fontSize: any, fontType?: string): number;
    getWidthInEx(text: any, fontSize: any, fontType?: string): number;
}
export declare const fontMetrics: FontMetrics;
