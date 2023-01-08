import { Token } from 'markdown-it';
export interface ITocItem {
    level: number;
    link: string;
    value: string;
    content: string;
    children?: Array<Token>;
    subHeadings?: Array<Token>;
}
export interface ITocData {
    index: number; /** Index of the token in the array of tokens for building nested headers */
    tocList: Array<ITocItem>;
}
export declare const clearSlugsTocItems: () => void;
declare const _default: (md: any, opts: any) => void;
export default _default;
