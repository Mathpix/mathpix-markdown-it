export declare const LevelsEnum: string[];
export declare const LevelsItem: string[];
export declare const AvailableStyles: {
    alph: string;
    Alph: string;
    arabic: string;
    roman: string;
    Roman: string;
};
export declare var itemizeLevelDef: string[];
export declare var enumerateLevelDef: string[];
export declare var itemizeLevel: any[];
export declare var enumerateLevel: any[];
export declare var itemizeLevelTokens: any[];
export declare const SetDefaultItemizeLevel: () => any[];
export declare const SetDefaultEnumerateLevel: () => any[];
export declare const GetItemizeLevel: (data?: any) => any[];
export declare const GetEnumerateLevel: (data?: any) => any[];
export declare const SetItemizeLevelTokens: (state: any) => {
    tokens: any[];
    contents: any[];
};
export declare const SetItemizeLevelTokensByIndex: (state: any, index: number) => void;
export declare const GetItemizeLevelTokens: (data?: any) => any[];
export declare const GetItemizeLevelTokensByState: (state: any) => {
    tokens: any[];
    contents: any[];
};
export declare const ChangeLevel: (state: any, data: any) => boolean;
export declare const clearItemizeLevelTokens: () => void;
