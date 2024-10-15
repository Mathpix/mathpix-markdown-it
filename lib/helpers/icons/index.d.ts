export interface IUnicodeIcon {
    symbol: string;
    unicodeHex?: string;
    code?: number;
    alias?: string;
    name?: string;
    nameUnicode?: string;
    width?: string;
    textOnly?: boolean;
}
export declare const findIcon: (iconName: string, isMath?: boolean) => IUnicodeIcon;
export declare const findSquaredIcon: (iconName: string) => IUnicodeIcon;
export declare const findFaIcons: (iconName: string) => IUnicodeIcon;
