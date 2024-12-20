import { LiteElement } from "mathjax-full/js/adaptors/lite/Element";
export interface IMathDimensions {
    containerWidth: string;
    widthEx: number;
    heightEx: number;
    viewBoxHeight: number;
    viewBoxHeightAndDepth: number;
}
interface INodeAttributes {
    containerWidth: string;
    svgViewBox: string;
    svgWidth: string;
    svgMinWidth: string;
    svgHeight: string;
}
export declare const getNodeAttributes: (node: LiteElement | HTMLElement) => INodeAttributes;
export declare const getMathDimensions: (node: LiteElement | HTMLElement) => IMathDimensions;
export {};
