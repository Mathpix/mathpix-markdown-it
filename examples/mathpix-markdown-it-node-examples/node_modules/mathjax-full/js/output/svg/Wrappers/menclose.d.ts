import { SVGWrapper } from '../Wrapper.js';
import { CommonMenclose } from '../../common/Wrappers/menclose.js';
import { SVGmsqrt } from './msqrt.js';
import * as Notation from '../Notation.js';
declare const SVGmenclose_base: import("../Wrapper.js").Constructor<CommonMenclose<SVGWrapper<any, any, any>, SVGmsqrt<any, any, any>, any>> & import("../Wrapper.js").Constructor<SVGWrapper<any, any, any>>;
export declare class SVGmenclose<N, T, D> extends SVGmenclose_base {
    static kind: string;
    static notations: Notation.DefList<SVGmenclose<any, any, any>, any>;
    toSVG(parent: N): void;
    arrow(W: number, a: number, double?: boolean): N;
    line(pq: [number, number, number, number]): any;
    box(w: number, h: number, d: number, r?: number): any;
    ellipse(w: number, h: number, d: number): any;
    path(join: string, ...P: (string | number)[]): any;
    fill(...P: (string | number)[]): any;
}
export {};
