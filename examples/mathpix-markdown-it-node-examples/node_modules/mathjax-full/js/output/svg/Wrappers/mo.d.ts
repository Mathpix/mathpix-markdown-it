import { SVGWrapper } from '../Wrapper.js';
import { CommonMo } from '../../common/Wrappers/mo.js';
import { BBox } from '../BBox.js';
import { SVGCharOptions } from '../FontData.js';
declare const SVGmo_base: import("../Wrapper.js").Constructor<CommonMo> & import("../Wrapper.js").Constructor<SVGWrapper<any, any, any>>;
export declare class SVGmo<N, T, D> extends SVGmo_base {
    static kind: string;
    toSVG(parent: N): void;
    protected stretchSVG(svg: N, symmetric: boolean): void;
    protected stretchVertical(stretch: number[], bbox: BBox): void;
    protected stretchHorizontal(stretch: number[], bbox: BBox): void;
    protected getChar(n: number): [number, number, number, SVGCharOptions];
    protected addGlyph(n: number, x: number, y: number, parent?: N): number;
    protected addTop(n: number, H: number, W: number): number;
    protected addExtV(n: number, H: number, D: number, T: number, B: number, W: number): void;
    protected addBot(n: number, D: number, W: number): number;
    protected addMidV(n: number, W: number): any[];
    protected addLeft(n: number): number;
    protected addExtH(n: number, W: number, L: number, R: number, x?: number): void;
    protected addRight(n: number, W: number): number;
    protected addMidH(n: number, W: number): number[];
}
export {};
