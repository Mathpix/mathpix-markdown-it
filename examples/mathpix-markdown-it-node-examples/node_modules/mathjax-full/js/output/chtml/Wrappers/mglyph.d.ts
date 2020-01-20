import { CHTMLWrapper } from '../Wrapper.js';
import { CommonMglyph } from '../../common/Wrappers/mglyph.js';
import { StyleList } from '../../common/CssStyles.js';
declare const CHTMLmglyph_base: import("../Wrapper.js").Constructor<CommonMglyph> & import("../Wrapper.js").Constructor<CHTMLWrapper<any, any, any>>;
export declare class CHTMLmglyph<N, T, D> extends CHTMLmglyph_base {
    static kind: string;
    static styles: StyleList;
    toCHTML(parent: N): void;
}
export {};
