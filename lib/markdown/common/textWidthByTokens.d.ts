import { Token } from 'markdown-it';
import { eFontType } from "./text-dimentions";
export interface ISizeEx {
    widthEx: number;
    heightEx: number;
}
export declare const getTextWidthByTokens: (tokens: Array<Token>, widthEx?: number, heightEx?: number, fontType?: eFontType) => ISizeEx;
