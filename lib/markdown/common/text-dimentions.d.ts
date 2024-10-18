import { Font } from "opentype.js";
export interface IFontMetricsOptions {
    font: ArrayBuffer;
    fontBold?: ArrayBuffer;
    fontSize?: number;
    ex?: number;
    fontWeight?: eFontType;
}
export declare enum eFontType {
    normal = "normal",
    bold = "bold"
}
export declare class FontMetrics {
    font: Font;
    fontBold: Font;
    fontSize: number;
    ex: number;
    fontWeight: eFontType;
    constructor();
    loadFont(options: IFontMetricsOptions): void;
    isFontLoaded(): boolean;
    private getGlyph;
    getWidth(text: string, fontType?: eFontType): number;
    getWidthInEx(text: string, fontType?: eFontType): number;
}
export declare const fontMetrics: FontMetrics;
