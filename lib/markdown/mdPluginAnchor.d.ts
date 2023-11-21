import { markdownit } from 'markdown-it';
declare const anchor: {
    (md: markdownit | any, opts: any): void;
    defaults: {
        level: number;
    };
};
export default anchor;
