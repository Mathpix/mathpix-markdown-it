import { SVG } from '../svg.js';
import { CommonWrapper } from '../common/Wrapper.js';
import { CommonWrapperFactory } from '../common/WrapperFactory.js';
import { SVGWrapper, SVGWrapperClass } from './Wrapper.js';
import { SVGCharOptions, SVGDelimiterData, SVGFontData } from './FontData.js';
export declare class SVGWrapperFactory<N, T, D> extends CommonWrapperFactory<SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperClass<N, T, D>, SVGCharOptions, SVGDelimiterData, SVGFontData> {
    static defaultNodes: {
        [kind: string]: import("./Wrapper.js").Constructor<CommonWrapper<any, any, any, any, any, any>>;
    };
    jax: SVG<N, T, D>;
}
