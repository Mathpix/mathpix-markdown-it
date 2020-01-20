import { SVGWrapper, Constructor } from '../Wrapper.js';
import { SVGmsqrt } from './msqrt.js';
import { CommonMroot } from '../../common/Wrappers/mroot.js';
import { BBox } from '../BBox.js';
declare const SVGmroot_base: Constructor<CommonMroot> & Constructor<SVGmsqrt<any, any, any>>;
export declare class SVGmroot<N, T, D> extends SVGmroot_base {
    static kind: string;
    protected addRoot(ROOT: N, root: SVGWrapper<N, T, D>, sbox: BBox): void;
}
export {};
