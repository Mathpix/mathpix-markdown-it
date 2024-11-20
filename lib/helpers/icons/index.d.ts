export interface IUnicodeIcon {
    symbol: string;
    unicodeHex?: string;
    code?: number;
    alias?: string;
    name?: string;
    nameUnicode?: string;
    width?: string;
    textOnly?: boolean;
    tags?: Array<string>;
}
export interface IIcon {
    icon: IUnicodeIcon;
    name?: string;
    color?: string;
    isSquared?: boolean;
}
export declare const findSquaredIcon: (iconName: string) => IUnicodeIcon;
export declare const findSquaredIconByName: (iconName: string) => IUnicodeIcon;
export declare const findSquaredIconByTag: (tag: string) => IUnicodeIcon;
export declare const findFaIconsByName: (iconName: string) => IUnicodeIcon;
export declare const findFaIconsByTag: (tag: string) => IUnicodeIcon;
export declare const findIcon: (iconName: string, isMath?: boolean) => IIcon;
