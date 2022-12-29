export declare const tocRegexp: RegExp;
export declare const isSpace: (code: any) => boolean;
export declare const slugify: (s: string) => string;
export declare const uniqueSlug: (slug: string, slugs: any) => string;
export declare const findEndMarker: (str: string, startPos?: number, beginMarker?: string, endMarker?: string, onlyEnd?: boolean) => {
    res: boolean;
    content?: undefined;
    nextPos?: undefined;
} | {
    res: boolean;
    content: string;
    nextPos?: undefined;
} | {
    res: boolean;
    content: string;
    nextPos: number;
};
