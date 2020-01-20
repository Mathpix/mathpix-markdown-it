import { CHTMLWrapper } from '../Wrapper.js';
import { CommonMpadded } from '../../common/Wrappers/mpadded.js';
import { StyleList } from '../../common/CssStyles.js';
declare const CHTMLmpadded_base: import("../Wrapper.js").Constructor<CommonMpadded> & import("../Wrapper.js").Constructor<CHTMLWrapper<any, any, any>>;
export declare class CHTMLmpadded<N, T, D> extends CHTMLmpadded_base {
    static kind: string;
    static styles: StyleList;
    toCHTML(parent: N): void;
}
export {};
