import { SVGWrapper } from '../Wrapper.js';
import { CommonMtd } from '../../common/Wrappers/mtd.js';
declare const SVGmtd_base: import("../Wrapper.js").Constructor<CommonMtd> & import("../Wrapper.js").Constructor<SVGWrapper<any, any, any>>;
export declare class SVGmtd<N, T, D> extends SVGmtd_base {
    static kind: string;
    placeCell(x: number, y: number, W: number, H: number, D: number): number[];
    placeColor(x: number, y: number, W: number, H: number): void;
}
export {};
