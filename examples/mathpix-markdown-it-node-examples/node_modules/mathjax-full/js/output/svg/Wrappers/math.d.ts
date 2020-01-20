import { SVGWrapper } from '../Wrapper.js';
import { CommonMath } from '../../common/Wrappers/math.js';
import { StyleList } from '../../common/CssStyles.js';
declare const SVGmath_base: import("../Wrapper.js").Constructor<CommonMath> & import("../Wrapper.js").Constructor<SVGWrapper<any, any, any>>;
export declare class SVGmath<N, T, D> extends SVGmath_base {
    static kind: string;
    static styles: StyleList;
    toSVG(parent: N): void;
    protected getTitleID(): string;
    setChildPWidths(recompute: boolean, w?: number, clear?: boolean): boolean;
}
export {};
