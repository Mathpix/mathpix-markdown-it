import { CHTMLWrapper } from '../Wrapper.js';
import { CommonSemantics } from '../../common/Wrappers/semantics.js';
import { BBox } from '../BBox.js';
import { StyleList } from '../../common/CssStyles.js';
declare const CHTMLsemantics_base: import("../Wrapper.js").Constructor<CommonSemantics> & import("../Wrapper.js").Constructor<CHTMLWrapper<any, any, any>>;
export declare class CHTMLsemantics<N, T, D> extends CHTMLsemantics_base {
    static kind: string;
    toCHTML(parent: N): void;
}
export declare class CHTMLannotation<N, T, D> extends CHTMLWrapper<N, T, D> {
    static kind: string;
    toCHTML(parent: N): void;
    computeBBox(): BBox;
}
export declare class CHTMLannotationXML<N, T, D> extends CHTMLWrapper<N, T, D> {
    static kind: string;
    static styles: StyleList;
}
export declare class CHTMLxml<N, T, D> extends CHTMLWrapper<N, T, D> {
    static kind: string;
    static autoStyle: boolean;
    toCHTML(parent: N): void;
    computeBBox(bbox: BBox, recompute?: boolean): void;
    protected getStyles(): void;
    protected getScale(): void;
    protected getVariant(): void;
}
export {};
