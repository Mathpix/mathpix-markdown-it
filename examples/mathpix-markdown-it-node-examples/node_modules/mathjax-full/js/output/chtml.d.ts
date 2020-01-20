import { CommonOutputJax } from './common/OutputJax.js';
import { CommonWrapper } from './common/Wrapper.js';
import { StyleList, Styles } from '../util/Styles.js';
import { StyleList as CssStyleList } from './common/CssStyles.js';
import { OptionList } from '../util/Options.js';
import { MathDocument } from '../core/MathDocument.js';
import { MathItem } from '../core/MathItem.js';
import { MmlNode } from '../core/MmlTree/MmlNode.js';
import { CHTMLWrapper } from './chtml/Wrapper.js';
import { CHTMLWrapperFactory } from './chtml/WrapperFactory.js';
import { CHTMLFontData } from './chtml/FontData.js';
import { CssFontData } from './common/FontData.js';
export declare class CHTML<N, T, D> extends CommonOutputJax<N, T, D, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLFontData, typeof CHTMLFontData> {
    static NAME: string;
    static OPTIONS: OptionList;
    static commonStyles: CssStyleList;
    static STYLESHEETID: string;
    factory: CHTMLWrapperFactory<N, T, D>;
    constructor(options?: OptionList);
    escaped(math: MathItem<N, T, D>, html: MathDocument<N, T, D>): N;
    styleSheet(html: MathDocument<N, T, D>): N;
    protected addClassStyles(CLASS: typeof CommonWrapper): void;
    protected processMath(math: MmlNode, parent: N): void;
    clearCache(): void;
    unknownText(text: string, variant: string): N;
    measureTextNode(text: N): {
        w: number;
        h: number;
        d: number;
    };
    getFontData(styles: Styles): [string, boolean, boolean];
    cssFontStyles(font: CssFontData, styles?: StyleList): StyleList;
}
